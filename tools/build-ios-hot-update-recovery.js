#!/usr/bin/env node
'use strict';

// 从已经签名的稳定 IPA 和已发布的完整热更新资源生成 iOS 恢复包。
// 该流程不调用 Cocos Creator，也不重新编译游戏脚本：它只覆盖已验证的
// 二进制资源，并在首次启动时清除一次损坏的热更新搜索路径。

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  if (index < 0) return fallback;
  if (!args[index + 1]) throw new Error(`--${name} 缺少参数`);
  return args[index + 1];
};

const required = (name) => {
  const value = arg(name);
  if (!value) throw new Error(`缺少 --${name}`);
  return path.resolve(value);
};

const run = (command, commandArgs, options = {}) => execFileSync(command, commandArgs, {
  cwd: options.cwd,
  encoding: options.encoding === null ? null : 'utf8',
  stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
});

const baseIpa = required('ipa');
const fullAssets = required('full-assets');
const patchAssets = required('patch-assets');
const output = required('out');
const identity = arg('identity');
const buildNumber = arg('build-number', '236');
const recoveryVersion = arg('recovery-version', '271');

for (const target of [baseIpa, fullAssets, patchAssets]) {
  if (!fs.existsSync(target)) throw new Error(`路径不存在：${target}`);
}
if (!identity) throw new Error('缺少 --identity');

const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-ios-recovery-'));
try {
  run('unzip', ['-q', baseIpa, '-d', stage]);
  const payload = path.join(stage, 'Payload');
  const appNames = fs.readdirSync(payload).filter((name) => name.endsWith('.app'));
  if (appNames.length !== 1) throw new Error(`IPA 中找到 ${appNames.length} 个 .app，预期 1 个`);
  const app = path.join(payload, appNames[0]);

  const info = path.join(app, 'Info.plist');
  const bundleId = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleIdentifier', info]).trim();
  if (bundleId !== 'com.haoke.gandengyan') throw new Error(`包标识异常：${bundleId}`);

  const fullManifest = JSON.parse(fs.readFileSync(path.join(fullAssets, 'project.manifest'), 'utf8'));
  const patchManifest = JSON.parse(fs.readFileSync(path.join(patchAssets, 'project.manifest'), 'utf8'));
  if (String(patchManifest.version) !== String(recoveryVersion)) {
    throw new Error(`补丁清单版本为 ${patchManifest.version}，预期 ${recoveryVersion}`);
  }
  if (Object.keys(fullManifest.assets || {}).length !== Object.keys(patchManifest.assets || {}).length) {
    throw new Error('完整资源和恢复补丁的资产数量不一致');
  }

  // 先覆盖 R269 的完整稳定资源，再覆盖只含差异的 R271 二进制补丁。
  fs.cpSync(fullAssets, app, { recursive: true, force: true });
  fs.cpSync(patchAssets, app, { recursive: true, force: true });

  const missing = Object.keys(patchManifest.assets || {}).filter((asset) => !fs.existsSync(path.join(app, asset)));
  if (missing.length) throw new Error(`恢复包缺少 ${missing.length} 个资产，首个为 ${missing[0]}`);

  // Cocos 场景引用的是这个 raw manifest；同步到 R271 后未来仍可正常增量热更。
  const rawManifest = path.join(app, 'res', 'raw-assets', '2c', '2c8a7447-5900-4cca-b1ef-51d750d90396.manifest');
  if (!fs.existsSync(rawManifest)) throw new Error(`找不到内置热更新清单：${rawManifest}`);
  fs.copyFileSync(path.join(patchAssets, 'project.manifest'), rawManifest);

  const mainFile = path.join(app, 'main.js');
  let main = fs.readFileSync(mainFile, 'utf8');
  const marker = `__QJ_R${recoveryVersion}_HOT_UPDATE_RECOVERY__`;
  const needle = "    if (typeof window.jsb === 'object') {\n        var hotUpdateSearchPaths = localStorage.getItem('__KY_Hot_Update_Search_Paths__');";
  const replacement = `    if (typeof window.jsb === 'object') {\n        // One-time recovery: ignore the broken cached script while preserving login/account data.\n        var recoveryMarker = '${marker}';\n        if (!localStorage.getItem(recoveryMarker)) {\n            localStorage.removeItem('__KY_Hot_Update_Search_Paths__');\n            localStorage.setItem(recoveryMarker, '1');\n        }\n        var hotUpdateSearchPaths = localStorage.getItem('__KY_Hot_Update_Search_Paths__');`;
  if (!main.includes(needle)) throw new Error('main.js 热更新搜索路径代码与预期不一致');
  main = main.replace(needle, replacement);
  if (!main.includes(marker)) throw new Error('恢复标记写入失败');
  fs.writeFileSync(mainFile, main);

  run('/usr/libexec/PlistBuddy', ['-c', `Set :CFBundleVersion ${buildNumber}`, info]);

  const profile = path.join(app, 'embedded.mobileprovision');
  if (!fs.existsSync(profile)) throw new Error('IPA 缺少 embedded.mobileprovision');
  const decodedProfile = path.join(stage, 'profile.plist');
  run('security', ['cms', '-D', '-i', profile], {
    stdio: ['ignore', fs.openSync(decodedProfile, 'w'), 'pipe'],
  });
  const entitlements = path.join(stage, 'entitlements.plist');
  const profileEntitlements = JSON.parse(run('plutil', [
    '-extract', 'Entitlements', 'json', '-o', '-', decodedProfile,
  ]));
  fs.writeFileSync(entitlements, JSON.stringify(profileEntitlements));
  run('plutil', ['-convert', 'xml1', entitlements]);

  fs.rmSync(path.join(app, '_CodeSignature'), { recursive: true, force: true });
  const frameworks = path.join(app, 'Frameworks');
  if (fs.existsSync(frameworks)) {
    for (const name of fs.readdirSync(frameworks)) {
      const item = path.join(frameworks, name);
      run('codesign', ['--force', '--sign', identity, '--timestamp=none', item], { stdio: 'inherit' });
    }
  }
  run('codesign', [
    '--force', '--sign', identity, '--timestamp=none', '--entitlements', entitlements, app,
  ], { stdio: 'inherit' });
  run('codesign', ['--verify', '--deep', '--strict', '--verbose=2', app], { stdio: 'inherit' });

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.rmSync(output, { force: true });
  run('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', 'Payload', output], { cwd: stage });
  run('unzip', ['-tq', output]);

  const version = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleShortVersionString', info]).trim();
  console.log(`完成：${output}`);
  console.log(`应用：${bundleId} ${version} (${buildNumber})，内置资源 R${recoveryVersion}`);
  console.log(`资产：${Object.keys(patchManifest.assets || {}).length} 个，首次启动清理一次错误热更路径`);
} finally {
  fs.rmSync(stage, { recursive: true, force: true });
}
