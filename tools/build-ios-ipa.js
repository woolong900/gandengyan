#!/usr/bin/env node
/**
 * 将原厂 iOS R234 热更新使用的跨平台 Cocos 资源迁入原厂 iOS 壳，生成 IPA。
 * 原厂 iOS R234 清单里的 8563 个文件与原厂 Android R234 基包逐个 MD5 一致；
 * 默认从当前已修补的 R234 APK 取资源，再应用 iOS 原生桥接。
 *
 * 默认使用 ad-hoc 签名，只用于校验包结构；真机安装需要 Apple 开发证书和
 * 与 com.haoke.gandengyan 匹配的 provisioning profile。
 *
 * usage: node tools/build-ios-ipa.js [--ipa <原厂.ipa>] [--apk <当前R234.apk>]
 *   [--host <局域网IP[:端口]>] [--base-url <HTTP(S)服务地址>] [--out <输出.ipa>]
 *   [--identity <Apple签名证书>] [--profile <描述文件>] [--without-wechat-applink]
 */
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { toJs, toJsc } = require('./jsc');
const { buildReleaseProjectSource } = require('./client-release-project');
const { applyIosSyncPatches } = require('./ios-sync-patches');
const { injectMachOLoadDylib } = require('./inject-macho-dylib');
const { LOGIN_SCENE_ASSET, patchLoginScene } = require('./client-login-scene');
const u2b = (value) => Buffer.from(value, 'utf8').toString('binary');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const index = argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  if (!argv[index + 1]) throw new Error(`--${name} 缺少参数`);
  return argv[index + 1];
};

const loadDotEnv = () => {
  const file = path.join(ROOT, '.dev.vars');
  if (!fs.existsSync(file)) return;
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
};
loadDotEnv();

const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: options.cwd || ROOT,
  encoding: 'utf8',
  stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
});

const walkFiles = (root, visit) => {
  if (!fs.existsSync(root)) return;
  for (const name of fs.readdirSync(root)) {
    const file = path.join(root, name);
    if (fs.statSync(file).isDirectory()) walkFiles(file, visit);
    else visit(file);
  }
};

const readCocosAsset = (file) => {
  const input = fs.readFileSync(file);
  const encrypted = input.subarray(0, 9).toString('ascii') === 'aaabbbccc';
  if (!encrypted) return { body: input, key: null };
  const key = input[9];
  const body = Buffer.alloc(input.length - 10);
  for (let i = 10; i < input.length; i += 1) body[i - 10] = input[i] ^ key;
  return { body, key };
};

const writeCocosBody = (file, body, key) => {
  if (key === null) {
    fs.writeFileSync(file, body);
    return;
  }
  const encrypted = Buffer.alloc(body.length);
  for (let i = 0; i < body.length; i += 1) encrypted[i] = body[i] ^ key;
  fs.writeFileSync(file, Buffer.concat([Buffer.from('aaabbbccc', 'ascii'), Buffer.from([key]), encrypted]));
};

const replaceCocosAsset = (source, target) => {
  if (!fs.existsSync(source)) throw new Error(`缺少品牌资源：${source}`);
  if (!fs.existsSync(target)) throw new Error(`iOS 基包缺少待替换资源：${target}`);
  const { key } = readCocosAsset(target);
  writeCocosBody(target, fs.readFileSync(source), key);
};

const patchIosSerializedAssets = (app) => {
  const importRoot = path.join(app, 'res', 'import');
  const textRules = [
    ['元来互娱俱乐部', `${APP_NAME}俱乐部`],
    ['元来黄冈麻将', APP_NAME],
    ['元来黄冈', APP_NAME],
    ['元来棋牌', APP_NAME],
    ['元来', '浩克'],
    ['m1m1_77', '游戏客服'],
  ];
  let mobileNodes = 0;
  let licenseNodes = 0;
  let changedFiles = 0;
  walkFiles(importRoot, (file) => {
    if (!file.endsWith('.json')) return;
    const { body, key } = readCocosAsset(file);
    let data;
    try { data = JSON.parse(body.toString('utf8')); } catch { return; }
    let changed = false;
    if (Array.isArray(data)) {
      for (const entry of data) {
        if (!entry || typeof entry !== 'object') continue;
        if (entry._name === 'BtnMobile') {
          mobileNodes += 1;
          if (entry._active !== false) {
            entry._active = false;
            changed = true;
          }
        }
        if (entry._name === 'IBSA') {
          licenseNodes += 1;
          if (entry._active !== false) {
            entry._active = false;
            changed = true;
          }
        }
      }
    }
    let json = JSON.stringify(data);
    for (const [from, to] of textRules) {
      if (json.includes(from)) {
        json = json.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      writeCocosBody(file, Buffer.from(json, 'utf8'), key);
      changedFiles += 1;
    }
  });
  if (mobileNodes < 2) throw new Error(`iOS 手机入口节点只找到 ${mobileNodes} 个，预期至少 2 个`);
  if (licenseNodes < 1) throw new Error('iOS 登录页没有找到许可证文字节点 IBSA');
  console.log(`      已隐藏 ${mobileNodes} 个手机入口、${licenseNodes} 个许可证文字节点，更新 ${changedFiles} 个场景资源`);
};

const applyIosBrandingAssets = (app) => {
  const branding = path.join(ROOT, 'assets', 'branding');
  const raw = path.join(app, 'res', 'raw-assets');
  const replacements = [
    ['hall/hall-background.png', ['2d', '2dad1db8-b44a-4077-a9fa-52cbfe497b4d.png']],
    ['hall/hall-character.png', ['1b', '1b6b9d70-3f53-4064-801d-f7fb08c52ba3.png']],
    ['club/club-background.png', ['7f', '7fd7e41f-bc15-43c0-9ccf-9f255336b48f.png']],
    ['club/club-home-background.jpg', ['d7', 'd784bb4c-e6d9-4a94-932a-4b9bc139c351.jpg']],
    ['club/club-character-empty.png', ['89', '896e3506-6fa6-4a3c-864b-f632f44c2f96.png']],
    ['login/login-background.jpg', ['73', '73c931dd-4abb-4c4c-ab86-37f883c44430.jpg']],
    ['table/table-background-2d.jpg', ['65', '6528fb79-db94-4c58-88e8-ff1b0a184491.jpg']],
    ['table/table-background-3d-ios.png', ['16', '16cd3461-5051-44bf-83b2-bb6ad34d0696.png']],
    ['share/settlement-background.png', ['b9', 'b90e4f53-0a61-4024-a8e4-3c9d5dd78f18.png']],
    ['share/download-qr.png', ['20', '206b229f-fa1c-409e-b47e-b2d2c0938d57.png']],
    ['share/moments-poster.jpg', ['db', 'dbd4ba35-fdeb-4a79-a26f-1f3ba1fdfca9.jpg']],
  ];
  for (const [source, target] of replacements) {
    replaceCocosAsset(path.join(branding, source), path.join(raw, ...target));
  }

  const legacy = {
    '1b3339a9-7323-4d7a-bc29-a0541f03ebc0.png': ['1b', '1b3339a9-7323-4d7a-bc29-a0541f03ebc0.png'],
    '352ea258-16a5-4785-9a93-7dcd168211b4.jpg': ['35', '352ea258-16a5-4785-9a93-7dcd168211b4.jpg'],
    '735a1b69-bef3-4257-9942-773def542b50.png': ['73', '735a1b69-bef3-4257-9942-773def542b50.png'],
    '7b0ebbdf-d404-42ab-9c8e-85ad2b828ae9.png': ['7b', '7b0ebbdf-d404-42ab-9c8e-85ad2b828ae9.png'],
    '9272ef06-deee-4241-b004-64c282072754.jpg': ['92', '9272ef06-deee-4241-b004-64c282072754.jpg'],
    'f80f7e41-3748-4fee-99cf-8066229ff1aa.png': ['f8', 'f80f7e41-3748-4fee-99cf-8066229ff1aa.png'],
    'f89eca2a-97a6-4480-9d24-bdf2fec1e807.png': ['f8', 'f89eca2a-97a6-4480-9d24-bdf2fec1e807.png'],
  };
  for (const [source, target] of Object.entries(legacy)) {
    replaceCocosAsset(path.join(branding, 'legacy-cleanup', source), path.join(raw, ...target));
  }
  patchIosSerializedAssets(app);
};

const patchWskTotalEndCell = (app) => {
  const file = path.join(app, 'res', 'import', 'c9', 'c94a0fd3-4986-461e-84f9-82e8ed06697c.json');
  if (!fs.existsSync(file)) throw new Error(`iOS 资源缺少说胡子总结算统计项：${file}`);
  const { body, key } = readCocosAsset(file);
  const prefab = JSON.parse(body.toString('utf8'));
  const infoBg = prefab[9];
  const keyNode = prefab[10];
  const keyLabel = prefab[11];
  const valueNode = prefab[12];
  const valueLabel = prefab[13];
  if (!infoBg || infoBg._name !== 'total_cell_info_bg' || infoBg._contentSize?.height !== 236
      || !keyNode || keyNode._name !== 'New Label' || keyLabel?.__type__ !== 'cc.Label'
      || !valueNode || valueNode._name !== 'New Label copy' || valueLabel?.__type__ !== 'cc.Label') {
    throw new Error('iOS 说胡子总结算统计区节点异常');
  }
  keyLabel._lineHeight = 45;
  valueLabel._lineHeight = 45;
  keyNode._contentSize.height = 180;
  valueNode._contentSize.height = 180;
  writeCocosBody(file, Buffer.from(JSON.stringify(prefab)), key);
};

const patchLoginSceneAsset = (app) => {
  const file = path.join(app, LOGIN_SCENE_ASSET);
  if (!fs.existsSync(file)) throw new Error(`iOS 资源缺少登录场景：${file}`);
  const { body, key } = readCocosAsset(file);
  writeCocosBody(file, patchLoginScene(body), key);
};

// 原厂壳在 iOS 系统启动页之上又手动添加了一层 LaunchImage12，
// 并依赖 JS 在登录组件 start() 中调用 removeLaunchImg 移除。资源迁移后
// 这个回调可能不能及时执行，导致游戏已运行但启动图一直盖在最上层。
// 直接让 -[AppController showLaunchScreen] 返回，交由 iOS 系统启动页正常过渡。
const disableManualLaunchOverlay = (executable) => {
  const offset = 0xd050;
  const expected = Buffer.from('e923bb6d', 'hex'); // stp d9, d8, [sp, #-0x50]!
  const replacement = Buffer.from('c0035fd6', 'hex'); // ret
  const binary = fs.readFileSync(executable);
  const actual = binary.subarray(offset, offset + expected.length);
  if (!actual.equals(expected) && !actual.equals(replacement)) {
    throw new Error(`启动图层补丁校验失败：0x${offset.toString(16)} 处为 ${actual.toString('hex')}`);
  }
  replacement.copy(binary, offset);
  fs.writeFileSync(executable, binary);
};

const installIosVoiceFix = (app, executable) => {
  const frameworkDir = path.join(app, 'Frameworks');
  const output = path.join(frameworkDir, 'QJVoiceFix.dylib');
  fs.mkdirSync(frameworkDir, { recursive: true });
  run('xcrun', [
    '--sdk', 'iphoneos', 'clang',
    '-arch', 'arm64',
    '-dynamiclib',
    '-fobjc-arc',
    '-miphoneos-version-min=12.0',
    '-framework', 'Foundation',
    '-framework', 'AVFoundation',
    '-install_name', '@executable_path/Frameworks/QJVoiceFix.dylib',
    path.join(ROOT, 'tools', 'ios-voice-fix', 'QJVoiceFix.m'),
    '-o', output,
  ]);
  // iOS 会独立校验嵌入的动态库。仅对 .app 使用 codesign --deep 在本机
  // 校验可能通过，但真机会在 dyld 阶段拒绝没有独立签名的 dylib。
  run('codesign', ['--force', '--sign', SIGN_IDENTITY, '--timestamp=none', output]);
  injectMachOLoadDylib(executable, '@executable_path/Frameworks/QJVoiceFix.dylib');
};

const lanIPv4 = () => {
  const all = [];
  for (const [name, addresses] of Object.entries(os.networkInterfaces())) {
    for (const address of addresses || []) {
      const isV4 = address.family === 4 || address.family === 'IPv4';
      if (!isV4 || address.internal || address.address === '10.0.2.2') continue;
      all.push({ name, address: address.address });
    }
  }
  for (const preferred of ['en0', 'en1', 'eth0', 'wlan0']) {
    const found = all.find((item) => item.name === preferred);
    if (found) return found.address;
  }
  return (all.find((item) => /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address)) || all[0] || {}).address;
};

const newestPatchedApk = () => {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) return null;
  return fs.readdirSync(dist)
    .filter((name) => /^qianjiang-gandengyan-\d{8}-\d{6}\.apk$/.test(name))
    .map((name) => path.join(dist, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
};

const BASE_IPA = path.resolve(arg('ipa', path.join(ROOT, 'originals/ios/qjqp-original-ios-1.0.2.ipa')));
const SOURCE_APK = path.resolve(arg('apk', newestPatchedApk() || ''));
const COCOS_BASE = arg('cocos-base', 'ios-r234');
const R234_MANIFEST_FILE = path.join(ROOT, 'originals', 'ios', 'qjqp-r234-project.manifest');
const APP_ID = 'com.haoke.gandengyan';
const APP_NAME = '潜江干瞪眼';
const EXECUTABLE_NAME = 'QianjiangGandengyan';
const WECHAT_APPID = process.env.QJQP_WECHAT_APPID || 'wx296b8ef20e6de62f';
const normalizeWechatAppLink = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let parsed;
  try { parsed = new URL(raw); } catch { throw new Error('QJQP_WECHAT_APPLINK 不是有效 URL'); }
  if (parsed.protocol !== 'https:') throw new Error('QJQP_WECHAT_APPLINK 必须使用 https://');
  if (parsed.search || parsed.hash) throw new Error('QJQP_WECHAT_APPLINK 不能包含查询参数或锚点');
  if (!parsed.pathname.endsWith('/')) parsed.pathname += '/';
  return parsed.toString();
};
// Personal Team 描述文件没有 Associated Domains 权限。允许构建真机调试包时
// 明确关闭 Universal Link，避免修改或删除开发者本机的 .dev.vars。
const WECHAT_APPLINK = argv.includes('--without-wechat-applink')
  ? ''
  : normalizeWechatAppLink(process.env.QJQP_WECHAT_APPLINK);
const SIGN_IDENTITY = arg('identity', '-');
const PROFILE = arg('profile', null);
let HOST = arg('host', lanIPv4());
if (HOST && !/:\d+$/.test(HOST)) HOST = `${HOST}:8899`;
const rawBaseUrl = arg('base-url', '');
let HTTP_BASE = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : (HOST ? `http://${HOST}` : '');
if (HTTP_BASE && !/^https?:\/\//.test(HTTP_BASE)) {
  throw new Error('--base-url 必须以 http:// 或 https:// 开头');
}
const WS_BASE = HTTP_BASE.replace(/^http/, 'ws');
if (!BASE_IPA || !fs.existsSync(BASE_IPA)) throw new Error(`找不到原厂 IPA：${BASE_IPA}`);
if (!['ios', 'android', 'ios-r234'].includes(COCOS_BASE)) throw new Error('--cocos-base 只能是 ios、ios-r234 或 android');
if (COCOS_BASE !== 'ios' && (!SOURCE_APK || !fs.existsSync(SOURCE_APK))) throw new Error(`找不到当前 R234 资源包：${SOURCE_APK}`);
if (COCOS_BASE === 'ios-r234' && !fs.existsSync(R234_MANIFEST_FILE)) throw new Error(`找不到原厂 iOS R234 清单：${R234_MANIFEST_FILE}`);
if (!HTTP_BASE) throw new Error('无法确定服务地址，请使用 --host 或 --base-url 指定');
if (SIGN_IDENTITY !== '-' && !PROFILE) throw new Error('正式签名需要同时提供 --identity 和 --profile');
if (PROFILE && !fs.existsSync(path.resolve(PROFILE))) throw new Error(`找不到描述文件：${PROFILE}`);
if (!/^wx[0-9a-zA-Z]{16}$/.test(WECHAT_APPID)) throw new Error('微信 AppID 格式错误，应为 wx 加 16 位字母或数字');

const stamp = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};
const output = path.resolve(arg('out', path.join(ROOT, 'dist', `qianjiang-gandengyan-ios-${SIGN_IDENTITY === '-' ? 'adhoc-' : ''}${stamp()}.ipa`)));
fs.mkdirSync(path.dirname(output), { recursive: true });

const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-ios-build-'));
try {
  console.log(`原厂 IPA：${BASE_IPA}`);
  console.log(`Cocos 基线：${COCOS_BASE === 'ios' ? 'iOS IPA 内置旧资源' : COCOS_BASE === 'ios-r234' ? `原厂 iOS R234 热更新资源（取自 ${SOURCE_APK}）` : SOURCE_APK}`);
  console.log(`服务地址：${HTTP_BASE}`);
  console.log(`输出：${output}`);

  console.log('1/7 解开 iOS 基包并规范应用目录');
  run('ditto', ['-x', '-k', BASE_IPA, stage]);
  const payload = path.join(stage, 'Payload');
  const sourceApps = fs.readdirSync(payload).filter((name) => name.endsWith('.app'));
  if (sourceApps.length !== 1) throw new Error(`IPA 内 .app 数量异常：${sourceApps.length}`);
  let app = path.join(payload, sourceApps[0]);
  const oldExecutable = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleExecutable', path.join(app, 'Info.plist')]).trim();
  const oldExecutablePath = path.join(app, oldExecutable);
  if (!fs.existsSync(oldExecutablePath)) throw new Error(`找不到主程序：${oldExecutablePath}`);
  fs.renameSync(oldExecutablePath, path.join(app, EXECUTABLE_NAME));
  const normalizedApp = path.join(payload, `${EXECUTABLE_NAME}.app`);
  fs.renameSync(app, normalizedApp);
  app = normalizedApp;

  console.log('2/7 移除第三方重签注入');
  const executable = path.join(app, EXECUTABLE_NAME);
  const linked = run('otool', ['-L', executable]);
  if (linked.includes('@executable_path/cike.dylib')) {
    run('install_name_tool', ['-change', '@executable_path/cike.dylib', '/usr/lib/libSystem.B.dylib', executable]);
  }
  disableManualLaunchOverlay(executable);
  installIosVoiceFix(app, executable);
  fs.rmSync(path.join(app, 'cike.dylib'), { force: true });
  fs.rmSync(path.join(app, '_CodeSignature'), { recursive: true, force: true });
  fs.rmSync(path.join(app, 'embedded.mobileprovision'), { force: true });
  if (run('otool', ['-L', executable]).includes('cike.dylib')) throw new Error('没有清除 cike.dylib 加载项');

  console.log(`3/7 ${COCOS_BASE === 'ios' ? '保留原厂 iOS Cocos 旧资源' : '迁入原厂 iOS R234 跨平台资源'}`);
  if (COCOS_BASE !== 'ios') {
    const apkStage = path.join(stage, 'apk');
    fs.mkdirSync(apkStage);
    run('unzip', ['-q', '-o', SOURCE_APK, 'assets/src/*', 'assets/res/*', 'assets/branding/*', '-d', apkStage]);
    const androidAssets = path.join(apkStage, 'assets');
    for (const name of ['src', 'res', 'branding']) {
      const source = path.join(androidAssets, name);
      if (!fs.existsSync(source)) throw new Error(`R234 资源包缺少 assets/${name}`);
      fs.rmSync(path.join(app, name), { recursive: true, force: true });
      fs.cpSync(source, path.join(app, name), { recursive: true });
    }
    if (COCOS_BASE === 'ios-r234') {
      const official = JSON.parse(fs.readFileSync(R234_MANIFEST_FILE, 'utf8'));
      if (official.version !== '234' || Object.keys(official.assets || {}).length !== 8563) {
        throw new Error('原厂 iOS R234 资源清单版本或文件数量异常');
      }
      for (const asset of Object.keys(official.assets)) {
        if (!fs.existsSync(path.join(app, asset))) throw new Error(`R234 资源包缺少原厂 iOS 资源 ${asset}`);
      }
      console.log(`      已核对原厂 iOS R234 清单中的 ${Object.keys(official.assets).length} 个资源路径`);
    }
  }

  console.log('4/7 应用 iOS 专用脚本桥接');
  const projectJsc = path.join(app, 'src', 'project.jsc');
  const embeddedProjectJs = toJs(fs.readFileSync(projectJsc)).toString('binary');
  const embeddedVersion = embeddedProjectJs.match(/assertVer: (\d+),\npackageVer: "[^"]+",/);
  const defaultAssetVersion = Math.max(235, Number(embeddedVersion?.[1] || 235));
  const requestedAssetVersion = Number(arg('asset-version', String(defaultAssetVersion)));
  let projectJs = buildReleaseProjectSource({
    root: ROOT,
    workDir: stage,
    assetVersion: requestedAssetVersion,
    packageVersion: '1.0.6',
    serviceBaseUrl: HTTP_BASE,
    allowPrivateServiceUrl: true,
  });
  const settingsJsc = path.join(app, 'src', 'settings.jsc');
  let settingsJs = toJs(fs.readFileSync(settingsJsc)).toString('binary');
  if (settingsJs.includes('platform:"android"')) {
    settingsJs = settingsJs.replace('platform:"android"', 'platform:"ios"');
    fs.writeFileSync(settingsJsc, toJsc(Buffer.from(settingsJs, 'binary')));
  } else if (!settingsJs.includes('platform:"ios"')) {
    throw new Error('iOS settings 平台标记异常');
  }
  // 旧的分支补丁仅保留作为原厂 iOS 结构的迁移记录。新包和热更
  // 现在都从同一恢复源码生成，不再执行这套易漏项的差分补丁。
  if (false) {
  if (COCOS_BASE !== 'ios') {
  const guestVisibility = 'this.guestNode.active = v.default.isDebug();';
  const guestVisibilityCount = projectJs.split(guestVisibility).length - 1;
  if (guestVisibilityCount === 1) projectJs = projectJs.replace(guestVisibility, 'this.guestNode.active = true;');
  else if (!projectJs.includes('this.guestNode.active = true;')) {
    throw new Error(`游客按钮补丁匹配到 ${guestVisibilityCount} 处，且当前包未开启游客入口`);
  }
  const androidGuestBlock = [
    'if (cc.sys.os === cc.sys.OS_ANDROID) try {',
    't.deviceId = jsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "getGuestDeviceId", "()Ljava/lang/String;");',
    '} catch (o) {',
    'cc.error("get guest device id failed:", o);',
    '}',
  ].join('\n');
  const iosGuestBlock = 'if (cc.sys.os === cc.sys.OS_IOS) try {\n' +
    't.deviceId = jsb.reflection.callStaticMethod("TalkingDataGA", "getDeviceId");\n' +
    '} catch (o) {\ncc.error("get guest device id failed:", o);\n}';
  const guestCount = projectJs.split(androidGuestBlock).length - 1;
  if (guestCount !== 1) throw new Error(`游客设备标识补丁匹配到 ${guestCount} 处，预期 1 处`);
  projectJs = projectJs.replace(androidGuestBlock, iosGuestBlock);
  const androidCopy = 'jsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "copyText", "(Ljava/lang/String;)Ljava/lang/String;", l.default.myInviteCode || "");';
  const copyCount = projectJs.split(androidCopy).length - 1;
  if (copyCount !== 1) throw new Error(`邀请码复制补丁匹配到 ${copyCount} 处，预期 1 处`);
  projectJs = projectJs.replace(androidCopy, 'jsb.reflection.callStaticMethod("Utils", "copyText:", l.default.myInviteCode || "");');
  const http = HTTP_BASE;
  const ws = WS_BASE;
  projectJs = projectJs
    .replace(/https?:\/\/game\.auxvv\.com/g, http)
    .replace(/wss?:\/\/game\.auxvv\.com/g, ws)
    .replace(/https?:\/\/192\.168\.\d+\.\d+:8899/g, http)
    .replace(/wss?:\/\/192\.168\.\d+\.\d+:8899/g, ws);
  if (!projectJs.includes(http) || !projectJs.includes(ws)) throw new Error('没有写入 iPhone 可访问的局域网地址');
  if (projectJs.includes('com/yuanlai/external/Utils')) throw new Error('iOS 脚本里仍有 Android Utils 调用');
  const requiredUiPatches = [
    ['游客登录按钮', 'this.guestNode.active = true;'],
    ['测试账号输入框隐藏', 'this.ebTestAccount.node.active = false;'],
    ['测试ID登录按钮隐藏', 'this.btnTestLogin.node.active = false;'],
    ['手机登录入口隐藏', 'this.mobileNode.active = !1;'],
    ['钉钉分享隐藏', 'this.ddNode.active = !1;'],
    ['默往分享隐藏', 'this.mwNode.active = !1;'],
    ['大厅显示干瞪眼和说胡子', 'gameList: [ c.eGameIds.QJHH, c.eGameIds.QJSHZ ],'],
  ];
  for (const [label, snippet] of requiredUiPatches) {
    if (!projectJs.includes(snippet)) throw new Error(`当前资源未包含“${label}”修改`);
  }
  const settingsJsc = path.join(app, 'src', 'settings.jsc');
  let settingsJs = toJs(fs.readFileSync(settingsJsc)).toString('binary');
  const androidPlatform = 'platform:"android"';
  const platformCount = settingsJs.split(androidPlatform).length - 1;
  if (platformCount !== 1) throw new Error(`Android settings 平台补丁匹配到 ${platformCount} 处，预期 1 处`);
  settingsJs = settingsJs.replace(androidPlatform, 'platform:"ios"');
  fs.writeFileSync(settingsJsc, toJsc(Buffer.from(settingsJs, 'binary')));
  } else {
    const replaceOnce = (label, from, to) => {
      const count = projectJs.split(from).length - 1;
      if (count !== 1) throw new Error(`${label}补丁匹配到 ${count} 处，预期 1 处`);
      projectJs = projectJs.replace(from, to);
    };

    replaceOnce('隐藏手机登录', 'this.mobileNode.active = !0;', 'this.mobileNode.active = !1;');
    replaceOnce('显示游客登录', 'this.guestNode.active = b.default.isDebug();', 'this.guestNode.active = !0;');
    replaceOnce('隐藏钉钉分享', 'this.ddNode.active = !0;', 'this.ddNode.active = !1;');
    replaceOnce('隐藏默往分享', 'this.mwNode.active = !0;', 'this.mwNode.active = !1;');
    projectJs = applyIosSyncPatches(projectJs);

    const guestStart = projectJs.indexOf('t.prototype._guestLogin = function() {');
    const guestEnd = projectJs.indexOf('t.prototype._tokenLogin = function(e) {', guestStart);
    if (guestStart < 0 || guestEnd < 0) throw new Error('找不到原厂 iOS 游客登录实现');
    const stableGuestLogin = `t.prototype._guestLogin = function() {
var e = this, t = {
appName: a.default.appName,
accountType: s.eAccountType.guest,
code: void 0,
token: d.default.guestToken.getValue(),
deviceId: void 0
};
if (cc.sys.os === cc.sys.OS_IOS) try {
t.deviceId = jsb.reflection.callStaticMethod("TalkingDataGA", "getDeviceId");
} catch (o) {
cc.error("get guest device id failed:", o);
}
l.default.uiHelper.showLoading();
this._accountSend(t, function(t) {
e._loginSuccess(t.token, s.eAccountType.guest, function(e) {
e && l.default.uiHelper.removeLoading();
});
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t);
});
};
`;
    projectJs = projectJs.slice(0, guestStart) + stableGuestLogin + projectJs.slice(guestEnd);

    const http = HTTP_BASE;
    const ws = WS_BASE;
    projectJs = projectJs
      .replace(/https:\/\/(?:game\.auxvv\.com|test2\.yuanlaihuyu\.com|qj\.yuanlaiqipai\.net)\/version/g, `${http}/version`)
      .replace(/https:\/\/(?:game\.auxvv\.com|test2\.yuanlaihuyu\.com|qj\.yuanlaiqipai\.net)\/login/g, `${http}/login`)
      .replace(/wss:\/\/(?:game\.auxvv\.com|test2\.yuanlaihuyu\.com|qj\.yuanlaiqipai\.net)\/ws/g, `${ws}/ws`)
      .replace(/https:\/\/(?:game\.auxvv\.com|test2\.yuanlaihuyu\.com|qj\.yuanlaiqipai\.net)/g, http);
    if (!projectJs.includes(`${http}/login`) || !projectJs.includes(`${ws}/ws`)) {
      throw new Error('原厂 iOS 脚本没有写入本地服务地址');
    }

    const settingsJsc = path.join(app, 'src', 'settings.jsc');
    const settingsJs = toJs(fs.readFileSync(settingsJsc)).toString('binary');
    if (!settingsJs.includes('platform:"ios"')) throw new Error('原厂 iOS settings 平台标记异常');
  }
  const wxLoginStart = 't.prototype._wxLogin = function() {\nvar e = this, t = {';
  const wxLoginGuard = u2b('t.prototype._wxLogin = function() {\n' +
    'if (!v.default.sdkInfo("SDK_WX_APPID")) return l.default.uiHelper.showTip("微信登录尚未配置 AppID");\n' +
    'if (cc.sys.os === cc.sys.OS_IOS && !v.default.sdkInfo("SDK_WX_APPLINK")) return l.default.uiHelper.showTip("iOS 微信登录需先配置 Universal Link");\n' +
    'var e = this, t = {');
  if (!projectJs.includes('t.prototype._wxLogin = function() {\nif (!v.default.sdkInfo("SDK_WX_APPID"))')) {
    const count = projectJs.split(wxLoginStart).length - 1;
    if (count !== 1) throw new Error(`iOS 微信配置提示补丁匹配到 ${count} 处，预期 1 处`);
    projectJs = projectJs.replace(wxLoginStart, wxLoginGuard);
  }
  const wxFriendFunction = 't.prototype.onClickShareWxFriend = function() {\n';
  const wxInstallGuard = u2b('if (!s.default.isInstallWX()) return l.default.uiHelper.showTip("您尚未安装微信客户端！");\n');
  const wxShareConfigGuard = u2b('if (cc.sys.os === cc.sys.OS_IOS && !s.default.sdkInfo("SDK_WX_APPLINK")) return l.default.uiHelper.showTip("iOS 微信分享需先配置 Universal Link");\n');
  const wxFriendStart = wxFriendFunction + wxInstallGuard;
  const wxFriendGuard = wxFriendStart + wxShareConfigGuard;
  if (!projectJs.includes(wxFriendGuard)) {
    const friendStart = projectJs.includes(wxFriendStart) ? wxFriendStart : wxFriendFunction;
    const friendGuard = projectJs.includes(wxFriendStart)
      ? wxFriendGuard : wxFriendFunction + wxInstallGuard + wxShareConfigGuard;
    const friendCount = projectJs.split(friendStart).length - 1;
    if (friendCount !== 1) throw new Error(`iOS 微信分享配置提示补丁匹配到 ${friendCount} 处，预期 1 处`);
    projectJs = projectJs.replace(friendStart, friendGuard);
  }
  const wxCircleFunction = 't.prototype.onClickShareWxCircle = function() {\n';
  const wxCircleStart = wxCircleFunction + wxInstallGuard;
  const wxCircleGuard = wxCircleStart + wxShareConfigGuard;
  if (!projectJs.includes(wxCircleGuard)) {
    const circleStart = projectJs.includes(wxCircleStart) ? wxCircleStart : wxCircleFunction;
    const circleGuard = projectJs.includes(wxCircleStart)
      ? wxCircleGuard : wxCircleFunction + wxInstallGuard + wxShareConfigGuard;
    const circleCount = projectJs.split(circleStart).length - 1;
    if (circleCount !== 1) throw new Error(`iOS 微信朋友圈配置提示补丁匹配到 ${circleCount} 处，预期 1 处`);
    projectJs = projectJs.replace(circleStart, circleGuard);
  }
  }
  fs.writeFileSync(projectJsc, toJsc(Buffer.from(projectJs, 'binary')));

  console.log('5/7 写入应用信息、微信配置、图标和启动图');
  const plistScript = path.join(stage, 'patch-info.py');
  fs.writeFileSync(plistScript, `import plistlib, sys\n` +
    `p=sys.argv[1]\n` +
    `with open(p,'rb') as f: d=plistlib.load(f)\n` +
    `d['CFBundleExecutable']=sys.argv[2]\n` +
    `d['CFBundleIdentifier']=sys.argv[3]\n` +
    `d['CFBundleDisplayName']=sys.argv[4]\n` +
    `d['CFBundleName']=sys.argv[4]\n` +
    `d['CFBundleShortVersionString']='1.0.6'\n` +
    `d['CFBundleVersion']='238'\n` +
    `d['version']='1.0.6'\n` +
    `d['NSLocationWhenInUseUsageDescription']=sys.argv[4]+'需要访问位置信息，以提供房间防作弊功能。'\n` +
    `d['NSMicrophoneUsageDescription']=sys.argv[4]+'需要使用麦克风，以发送游戏语音。'\n` +
    `d['QJQPVoiceBaseURL']=sys.argv[9]\n` +
    `d['NSPhotoLibraryUsageDescription']=sys.argv[4]+'需要访问相册，以保存或选择分享图片。'\n` +
    `d['NSLocalNetworkUsageDescription']=sys.argv[4]+'需要访问本地网络，以连接游戏服务器。'\n` +
    `d['CFBundleURLTypes']=[{'CFBundleTypeRole':'Editor','CFBundleURLName':'weixin','CFBundleURLSchemes':[sys.argv[5]]},{'CFBundleTypeRole':'Editor','CFBundleURLName':'gandengyan','CFBundleURLSchemes':['gandengyan']}]\n` +
    `d['LSApplicationQueriesSchemes']=['weixin','weixinULAPI']\n` +
    `sdk=d.get('sdk',{})\n` +
    `sdk['SDK_WX_APPID']=sys.argv[5]\n` +
    `sdk['SDK_WX_APPLINK']=sys.argv[6]\n` +
    `# 原生壳会无条件读取这些旧 SDK 键；保留空值以关闭功能并避免 NSString(nil) 崩溃。\n` +
    `for k in ['SDK_DD_APPID','SDK_MW_APPKEY','SDK_DX_APPID','SDK_SG_APPID','SDK_TD_APPID']: sdk[k]=''\n` +
    `if sys.argv[7]: sdk['SDK_VOICE_APPID']=sys.argv[7]\n` +
    `if sys.argv[8]: sdk['SDK_VOICE_APPKEY']=sys.argv[8]\n` +
    `d['sdk']=sdk\n` +
    `for key in ['CFBundleIcons','CFBundleIcons~ipad']:\n` +
    `  icon=d.get(key,{}).get('CFBundlePrimaryIcon',{})\n` +
    `  icon.pop('CFBundleIconName',None)\n` +
    `with open(p,'wb') as f: plistlib.dump(d,f,fmt=plistlib.FMT_BINARY,sort_keys=False)\n`);
  run('python3', [plistScript, path.join(app, 'Info.plist'), EXECUTABLE_NAME, APP_ID, APP_NAME, WECHAT_APPID,
    WECHAT_APPLINK, process.env.QJQP_VOICE_APPID || '', process.env.QJQP_VOICE_APPKEY || '', HTTP_BASE]);

  const iconSource = path.join(ROOT, 'assets', 'branding', 'icon.png');
  for (const name of fs.readdirSync(app).filter((name) => /^AppIcon.*\.png$/.test(name))) {
    const target = path.join(app, name);
    const dimensions = run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', target]);
    const width = dimensions.match(/pixelWidth:\s*(\d+)/)?.[1];
    const height = dimensions.match(/pixelHeight:\s*(\d+)/)?.[1];
    if (!width || !height) throw new Error(`无法读取图标尺寸：${name}`);
    run('sips', ['-z', height, width, iconSource, '--out', target]);
  }
  const brandingTarget = path.join(app, 'branding');
  fs.mkdirSync(brandingTarget, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'assets', 'branding', 'login', 'login-logo.png'), path.join(brandingTarget, 'login-logo.png'));
  if (COCOS_BASE === 'ios') {
    applyIosBrandingAssets(app);
  } else {
    // R234 资源来自 Android APK，但 iOS 的中央东南西北灯盘必须保留。
    // 用同一张桌面图的 iOS 专版覆盖 R234 的 3D 背景槽位，避免灯盘被
    // Android 背景盖掉而只剩不完整的闪灯动画。
    replaceCocosAsset(
      path.join(ROOT, 'assets', 'branding', 'table', 'table-background-3d-ios.png'),
      path.join(app, 'res', 'raw-assets', '0e', '0ed69516-3023-4cb0-947a-abd9aab04b9f.jpg'),
    );
    replaceCocosAsset(
      path.join(ROOT, 'assets', 'branding', 'club', 'club-home-background.jpg'),
      path.join(app, 'res', 'raw-assets', 'd7', 'd784bb4c-e6d9-4a94-932a-4b9bc139c351.jpg'),
    );
    console.log('      已写入 iOS 专用 3D 桌面并保留中央灯盘');
  }
  patchWskTotalEndCell(app);
  console.log('      已固化说胡子总结算四项统计行距');
  patchLoginSceneAsset(app);
  console.log('      已在登录场景层永久隐藏测试账号入口');
  fs.copyFileSync(path.join(ROOT, 'assets', 'branding', 'startup', 'splash-screen.png'), path.join(app, 'LaunchImage12.png'));

  if (COCOS_BASE === 'ios-r234') {
    const official = JSON.parse(fs.readFileSync(R234_MANIFEST_FILE, 'utf8'));
    const local = {
      ...official,
      packageUrl: `${HTTP_BASE}/hot-update/ios/${requestedAssetVersion}/`,
      remoteManifestUrl: `${HTTP_BASE}/hot-update/ios/${requestedAssetVersion}/project.manifest`,
      remoteVersionUrl: `${HTTP_BASE}/hot-update/ios/${requestedAssetVersion}/version.manifest`,
      version: String(requestedAssetVersion),
      assets: {},
    };
    const rawManifest = 'res/raw-assets/2c/2c8a7447-5900-4cca-b1ef-51d750d90396.manifest';
    for (const directory of ['src', 'res', 'branding']) {
      const root = path.join(app, directory);
      if (!fs.existsSync(root)) continue;
      walkFiles(root, (file) => {
        const asset = path.relative(app, file).split(path.sep).join('/');
        if (asset === rawManifest) return; // 清单不能记录自身的新 MD5。
        const data = fs.readFileSync(file);
        local.assets[asset] = { size: data.length, md5: crypto.createHash('md5').update(data).digest('hex') };
      });
    }
    fs.writeFileSync(path.join(app, rawManifest), JSON.stringify(local));
    console.log(`      已生成与当前修改资源一致的 iOS 热更新基线清单 R${requestedAssetVersion}`);
  }

  console.log('6/7 签名并校验应用结构');
  let entitlements = null;
  const associatedDomains = WECHAT_APPLINK
    ? [`applinks:${new URL(WECHAT_APPLINK).hostname}`]
    : [];
  if (SIGN_IDENTITY !== '-') {
    const profile = path.resolve(PROFILE);
    fs.copyFileSync(profile, path.join(app, 'embedded.mobileprovision'));
    const decodedProfile = path.join(stage, 'profile.plist');
    run('security', ['cms', '-D', '-i', profile], { stdio: ['ignore', fs.openSync(decodedProfile, 'w'), 'pipe'] });
    const profileEntitlements = JSON.parse(run('plutil', ['-extract', 'Entitlements', 'json', '-o', '-', decodedProfile]));
    if (WECHAT_APPLINK) {
      if (!Object.prototype.hasOwnProperty.call(profileEntitlements, 'com.apple.developer.associated-domains')) {
        throw new Error('当前描述文件没有 Associated Domains 权限，无法启用 iOS 微信 Universal Link');
      }
      profileEntitlements['com.apple.developer.associated-domains'] = associatedDomains;
    }
    entitlements = path.join(stage, 'entitlements.plist');
    fs.writeFileSync(entitlements, JSON.stringify(profileEntitlements));
    run('plutil', ['-convert', 'xml1', entitlements]);
  } else if (associatedDomains.length) {
    // 待企业重签包先带上 Associated Domains 声明。最终重签时，
    // 签名方的 provisioning profile 仍必须授权同一 entitlement。
    entitlements = path.join(stage, 'entitlements.plist');
    fs.writeFileSync(entitlements, JSON.stringify({
      'com.apple.developer.associated-domains': associatedDomains,
    }));
    run('plutil', ['-convert', 'xml1', entitlements]);
  }
  const signArgs = ['--force', '--deep', '--sign', SIGN_IDENTITY, '--timestamp=none'];
  if (entitlements) signArgs.push('--entitlements', entitlements);
  signArgs.push(app);
  run('codesign', signArgs, { stdio: 'inherit' });
  run('codesign', ['--verify', '--deep', '--strict', '--verbose=2', app], { stdio: 'inherit' });

  console.log('7/7 生成 IPA 并复核关键字段');
  fs.rmSync(output, { force: true });
  run('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', 'Payload', output], { cwd: stage });
  run('unzip', ['-tq', output]);
  const info = path.join(app, 'Info.plist');
  const bundleId = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleIdentifier', info]).trim();
  const displayName = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleDisplayName', info]).trim();
  const version = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleShortVersionString', info]).trim();
  const build = run('/usr/libexec/PlistBuddy', ['-c', 'Print :CFBundleVersion', info]).trim();
  const encryption = run('otool', ['-l', executable]);
  if (!/cryptid\s+0/.test(encryption)) throw new Error('主程序不是未加密 Mach-O');
  console.log(`完成：${output}`);
  console.log(`应用：${displayName} ${bundleId} ${version} (${build})`);
  console.log(`签名：${SIGN_IDENTITY === '-' ? 'ad-hoc（需正式签名后安装）' : SIGN_IDENTITY}`);
  console.log(`微信：${WECHAT_APPLINK ? `AppID + Universal Link (${WECHAT_APPLINK})` : 'AppID 已写入，iOS Universal Link 待配置'}`);
  console.log(`大小：${(fs.statSync(output).size / 1048576).toFixed(1)} MB`);
} finally {
  fs.rmSync(stage, { recursive: true, force: true });
}
