const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { toJs } = require('./jsc');
const {
  buildReleaseProjectSource,
  buildReleaseProjectJsc,
} = require('./client-release-project');
const { patchLoginScene } = require('./client-login-scene');

const ROOT = path.join(__dirname, '..');
const options = {
  root: ROOT,
  assetVersion: 987654,
  packageVersion: '1.0.6',
  serviceBaseUrl: 'https://203.0.113.10',
};
const source = buildReleaseProjectSource(options);
const decoded = toJs(buildReleaseProjectJsc(options)).toString('binary');
assert.equal(decoded, source, '共用源码编解码必须无损');
assert(source.startsWith('window.__require=function e(t,o,n)'));
assert(source.includes('throw new Error("Cannot find module \'"+a+"\'")}a=l}var u=o[a]'),
  '整包生成器丢失模块 basename 回退修复');
assert(!source.includes('throw new Error("Cannot find module \'"+a+"\'")}}var u=o[a]'),
  '整包仍会在模块回退后访问旧 key');
assert(source.includes('assertVer: 987654,\npackageVer: "1.0.6",'));
assert(source.includes('https://203.0.113.10/version'));
assert(source.includes('https://203.0.113.10/login'));
assert(source.includes('wss://203.0.113.10/ws'));
assert(!source.includes('game.auxvv.com'), '发布客户端仍包含旧服务域名');
assert(source.includes('var t = this.downloadBaseUrl() + "/download";'),
  '客户端分享链接没有指向应用下载页');
assert(source.includes('encodeURIComponent(r) + "=" + encodeURIComponent(String(t[r]))'),
  'HTTP 查询参数未编码，带空格的 iOS 设备名会触发“不支持的URL”');
assert(!source.includes('n += r + "=" + t[r];'),
  'HTTP 查询参数仍在直接拼接未编码值');
assert(source.includes('!s.default.sdkInfo("SDK_WX_APPLINK")'),
  '微信分享配置检查没有调用 ExUtils.sdkInfo');
assert(!source.includes('!d.default.sdkInfo("SDK_WX_APPLINK")'),
  '微信分享配置检查错误调用了 GameConfig.sdkInfo');
assert(source.includes('if (cc.sys.os === cc.sys.OS_ANDROID) try {'));
assert(source.includes('} else if (cc.sys.os === cc.sys.OS_IOS) try {'));
assert(source.includes('this.ebTestAccount.node.active = false;'));
assert(source.includes('this.btnTestLogin.node.active = false;'));
assert(!source.includes('this.ebTestAccount.node.active = v.default.isDebug();'));
assert(!source.includes('this.btnTestLogin.node.active = v.default.isDebug();'));
assert(source.includes('m.default.copyText(l.default.myInviteCode || "");'));
assert(!source.includes('c = h.default.b3N2(i.length) && e._handDrawnCard, d = 0'));
assert(!source.includes('var o = e.handCards.length, n = c.default.b3N2(o) && e._handDrawnCard;'));
assert(source.includes('S.ready = void 0 !== C.ready ? !!C.ready : S.ready || !1;'),
  '客户端重连没有从房间快照还原准备状态');
new Function(source);

const loginSceneSource = fs.readFileSync(path.join(ROOT,
  'client-release-source/assets/resources/Hall/Scene/LoginScene.fire'));
const patchedLoginScene = JSON.parse(patchLoginScene(loginSceneSource).toString('utf8'));
for (const name of ['editboxTestAccount', 'buttonTestLogin']) {
  const node = patchedLoginScene.find((entry) => entry?.__type__ === 'cc.Node' && entry._name === name);
  assert.equal(node._active, false, `${name} 没有在场景层隐藏`);
  assert.equal(node._opacity, 0, `${name} 场景层仍可见`);
  assert.deepEqual([node._scale.x, node._scale.y], [0, 0], `${name} 场景层仍占用显示尺寸`);
}
assert(!patchedLoginScene.some((entry) => entry?._string === '测试ID登录'
  || entry?._N$string === '测试ID登录'));

for (const script of ['patchapk.js', 'build-ios-ipa.js', 'publish-hot-update.js']) {
  const body = fs.readFileSync(path.join(__dirname, script), 'utf8');
  assert(body.includes("require('./client-release-project')"), `${script} 没有使用客户端单一源码`);
  assert(body.includes('buildReleaseProject'), `${script} 没有调用共用构建器`);
}

const iosBuildScript = fs.readFileSync(path.join(__dirname, 'build-ios-ipa.js'), 'utf8');
assert(iosBuildScript.includes("'com.apple.developer.associated-domains': associatedDomains"),
  'iOS 待重签包没有固化 Associated Domains 权限');
const iosEntitlements = fs.readFileSync(
  path.join(ROOT, 'config', 'qianjiang-gandengyan.entitlements'),
  'utf8',
);
assert(iosEntitlements.includes('<string>applinks:gmhiu.com</string>'),
  'iOS 企业重签权限文件缺少 gmhiu.com');

const totalEndAsset = 'c94a0fd3-4986-461e-84f9-82e8ed06697c.json';
for (const script of ['patchapk.js', 'build-ios-ipa.js', 'publish-hot-update.js']) {
  const body = fs.readFileSync(path.join(__dirname, script), 'utf8');
  assert(body.includes(totalEndAsset), `${script} 没有固化说胡子总结算资源修复`);
}
const hotUpdateScript = fs.readFileSync(path.join(__dirname, 'publish-hot-update.js'), 'utf8');
assert(hotUpdateScript.includes('206b229f-fa1c-409e-b47e-b2d2c0938d57.png')
  && hotUpdateScript.includes('dbd4ba35-fdeb-4a79-a26f-1f3ba1fdfca9.jpg'),
'热更新没有固化战绩二维码和朋友圈海报');

console.log('客户端整包/热更单一源码校验通过');
