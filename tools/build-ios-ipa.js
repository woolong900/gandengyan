#!/usr/bin/env node
/**
 * 将当前已修补 Android 包里的跨平台 Cocos 资源迁入原厂 iOS 壳，生成 IPA。
 *
 * 默认使用 ad-hoc 签名，只用于校验包结构；真机安装需要 Apple 开发证书和
 * 与 com.haoke.gandengyan 匹配的 provisioning profile。
 *
 * usage: node tools/build-ios-ipa.js [--ipa <原厂.ipa>] [--apk <当前.apk>]
 *   [--host <局域网IP[:端口]>] [--out <输出.ipa>]
 *   [--identity <Apple签名证书>] [--profile <描述文件>]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { toJs, toJsc } = require('./jsc');

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
const APP_ID = 'com.haoke.gandengyan';
const APP_NAME = '潜江干瞪眼';
const EXECUTABLE_NAME = 'QianjiangGandengyan';
const WECHAT_APPID = process.env.QJQP_WECHAT_APPID || 'wx71fea3b8e75b232b';
const SIGN_IDENTITY = arg('identity', '-');
const PROFILE = arg('profile', null);
let HOST = arg('host', lanIPv4());
if (HOST && !/:\d+$/.test(HOST)) HOST = `${HOST}:8899`;
if (!BASE_IPA || !fs.existsSync(BASE_IPA)) throw new Error(`找不到原厂 IPA：${BASE_IPA}`);
if (!SOURCE_APK || !fs.existsSync(SOURCE_APK)) throw new Error(`找不到当前 Android 包：${SOURCE_APK}`);
if (!HOST) throw new Error('无法确定局域网地址，请使用 --host 指定');
if (SIGN_IDENTITY !== '-' && !PROFILE) throw new Error('正式签名需要同时提供 --identity 和 --profile');
if (PROFILE && !fs.existsSync(path.resolve(PROFILE))) throw new Error(`找不到描述文件：${PROFILE}`);

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
  console.log(`跨平台资源：${SOURCE_APK}`);
  console.log(`服务地址：http://${HOST}`);
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
  fs.rmSync(path.join(app, 'cike.dylib'), { force: true });
  fs.rmSync(path.join(app, '_CodeSignature'), { recursive: true, force: true });
  fs.rmSync(path.join(app, 'embedded.mobileprovision'), { force: true });
  if (run('otool', ['-L', executable]).includes('cike.dylib')) throw new Error('没有清除 cike.dylib 加载项');

  console.log('3/7 迁入当前 R234 Cocos 资源');
  const apkStage = path.join(stage, 'apk');
  fs.mkdirSync(apkStage);
  run('unzip', ['-q', '-o', SOURCE_APK, 'assets/src/*', 'assets/res/*', 'assets/branding/*', '-d', apkStage]);
  const androidAssets = path.join(apkStage, 'assets');
  for (const name of ['src', 'res', 'branding']) {
    const source = path.join(androidAssets, name);
    if (!fs.existsSync(source)) throw new Error(`Android 包缺少 assets/${name}`);
    fs.rmSync(path.join(app, name), { recursive: true, force: true });
    fs.cpSync(source, path.join(app, name), { recursive: true });
  }

  console.log('4/7 应用 iOS 专用脚本桥接');
  const projectJsc = path.join(app, 'src', 'project.jsc');
  let projectJs = toJs(fs.readFileSync(projectJsc)).toString('binary');
  const guestVisibility = 'this.guestNode.active = v.default.isDebug();';
  const guestVisibilityCount = projectJs.split(guestVisibility).length - 1;
  if (guestVisibilityCount !== 1) throw new Error(`游客按钮补丁匹配到 ${guestVisibilityCount} 处，预期 1 处`);
  projectJs = projectJs.replace(guestVisibility, 'this.guestNode.active = true;');
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
  const http = `http://${HOST}`;
  const ws = `ws://${HOST}`;
  projectJs = projectJs
    .replace(/https?:\/\/192\.168\.\d+\.\d+:8899/g, http)
    .replace(/wss?:\/\/192\.168\.\d+\.\d+:8899/g, ws);
  if (!projectJs.includes(http) || !projectJs.includes(ws)) throw new Error('没有写入 iPhone 可访问的局域网地址');
  if (projectJs.includes('com/yuanlai/external/Utils')) throw new Error('iOS 脚本里仍有 Android Utils 调用');
  const requiredUiPatches = [
    ['游客登录按钮', 'this.guestNode.active = true;'],
    ['手机登录入口隐藏', 'this.mobileNode.active = !1;'],
    ['钉钉分享隐藏', 'this.ddNode.active = !1;'],
    ['默往分享隐藏', 'this.mwNode.active = !1;'],
    ['大厅仅保留潜江干瞪眼', 'gameList: [ c.eGameIds.QJHH ],'],
  ];
  for (const [label, snippet] of requiredUiPatches) {
    if (!projectJs.includes(snippet)) throw new Error(`当前资源未包含“${label}”修改`);
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
    `d['CFBundleShortVersionString']='1.0.5'\n` +
    `d['CFBundleVersion']='234'\n` +
    `d['version']='1.0.5'\n` +
    `d['NSLocationWhenInUseUsageDescription']=sys.argv[4]+'需要访问位置信息，以提供房间防作弊功能。'\n` +
    `d['NSMicrophoneUsageDescription']=sys.argv[4]+'需要使用麦克风，以发送游戏语音。'\n` +
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
    process.env.QJQP_WECHAT_APPLINK || '', process.env.QJQP_VOICE_APPID || '', process.env.QJQP_VOICE_APPKEY || '']);

  const iconSource = path.join(ROOT, 'assets', 'branding', 'icon.png');
  for (const name of fs.readdirSync(app).filter((name) => /^AppIcon.*\.png$/.test(name))) {
    const target = path.join(app, name);
    const dimensions = run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', target]);
    const width = dimensions.match(/pixelWidth:\s*(\d+)/)?.[1];
    const height = dimensions.match(/pixelHeight:\s*(\d+)/)?.[1];
    if (!width || !height) throw new Error(`无法读取图标尺寸：${name}`);
    run('sips', ['-z', height, width, iconSource, '--out', target]);
  }
  fs.copyFileSync(path.join(ROOT, 'assets', 'branding', 'startup', 'splash-screen.png'), path.join(app, 'LaunchImage12.png'));

  console.log('6/7 签名并校验应用结构');
  let entitlements = null;
  if (SIGN_IDENTITY !== '-') {
    const profile = path.resolve(PROFILE);
    fs.copyFileSync(profile, path.join(app, 'embedded.mobileprovision'));
    const decodedProfile = path.join(stage, 'profile.plist');
    run('security', ['cms', '-D', '-i', profile], { stdio: ['ignore', fs.openSync(decodedProfile, 'w'), 'pipe'] });
    entitlements = path.join(stage, 'entitlements.plist');
    const entitlementScript = path.join(stage, 'profile-entitlements.py');
    fs.writeFileSync(entitlementScript, `import plistlib,sys\n` +
      `p=plistlib.load(open(sys.argv[1],'rb'))\n` +
      `e=p.get('Entitlements',{})\n` +
      `plistlib.dump(e,open(sys.argv[2],'wb'),fmt=plistlib.FMT_XML)\n`);
    run('python3', [entitlementScript, decodedProfile, entitlements]);
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
  console.log(`大小：${(fs.statSync(output).size / 1048576).toFixed(1)} MB`);
} finally {
  fs.rmSync(stage, { recursive: true, force: true });
}
