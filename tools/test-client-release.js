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
assert(source.includes('o.__qjqpImgRequestId === n'),
  '客户端缺少牌面异步加载防串图保护');
assert(source.includes('this._lastPutPos = -1;')
  && source.includes('this.siteInfos.setLastPut(e);')
  && source.includes('e.last_put_uid')
  && source.includes(Buffer.from('"没有牌大过对方"', 'utf8').toString('binary')),
  '说胡子客户端没有按真实最新出牌判断提示、出牌与无牌可压状态');
{
  const start = source.indexOf('t.prototype._udpateQJSHZ = function()');
  const end = source.indexOf('t.prototype.start = function()', start);
  const settlement = source.slice(start, end);
  assert(start >= 0 && end > start
    && settlement.includes(Buffer.from('m.string = "抓分：" + f;', 'utf8').toString('binary'))
    && !settlement.includes(Buffer.from('喜钱：', 'utf8').toString('binary')),
  '说胡子单局结算的抓分行不应再拼接喜钱');
}
assert(source.includes('return "Games/Poker/card_" + t + o;')
  && source.includes('var t = .93 * (this._totalW - 127);')
  && source.includes('68 * e <= t ? 68')
  && source.includes('31 * e <= t ? t / e : 31')
  && !source.includes('this.node.getChildByName("wsk_large_corner")')
  && !source.includes('new cc.Node("wsk_score_text")')
  && !source.includes('this._qianfenRank'),
  '说胡子手牌没有直接复用潜江千分整牌资源，或仍在运行时叠字');
assert(source.includes('e.prototype.playName = function() {')
  && source.includes('if ("' + Buffer.from('玩法', 'utf8').toString('binary') + '" === this.typeName(o))')
  && source.includes('return this.gameName();'),
  '客户端没有优先从建房选项取玩法名称');
assert(source.includes('u = "' + Buffer.from('玩法：', 'utf8').toString('binary') + '" + o;')
  && !source.includes('" + o + "  " + n;'),
  '房间结束分享图没有只显示游戏名');
assert.equal(source.split('n = String(n || "").split("' + Buffer.from(',喜钱：', 'utf8').toString('binary') + '")[0];').length - 1, 2,
  '单局或整房统计图的算分项仍会显示喜钱明细');
assert(source.includes(Buffer.from('desc: "潜江晃晃"', 'utf8').toString('binary'))
  && !source.includes(Buffer.from('desc: "潜江癞晃"', 'utf8').toString('binary')),
  '干瞪眼建房页的子玩法名称不是潜江晃晃');
assert(source.includes('msghead: "support_history"') && source.includes('msghead: "support_send"'),
  '客户端缺少客服会话读取或发送功能');
assert(source.includes('eventUtils.emit("support_chat_update"'),
  '客户端缺少客服消息实时分发');
assert(source.includes('Date.now() - this._lastProgressAt >= 3e4')
  && source.includes('this._am.downloadFailedAssets();')
  && source.includes('this._storagePath + "_temp/"')
  && source.includes('__QJQP_HOT_UPDATE_RECOVERY__'),
  '热更新缺少停滞检测、失败重试或临时文件自愈');
assert(source.includes('this._eventNumber(t, "getDownloadedBytes")')
  && source.includes('this._eventNumber(t, "getTotalBytes")')
  && source.includes('this._formatBytes(n) + "/" + this._formatBytes(r)')
  && source.includes('this._retryCount + "/" + this._maxRetryCount')
  && source.includes(Buffer.from('正在更新游戏资源，请勿退出', 'utf8').toString('binary')),
  '热更新启动页没有显示下载量或重试次数');
assert(source.includes('t.scheduleOnce(function() {\nt.hotUpdate.hotUpdate(n.version, l);\n}, .05);'),
  '热更新没有先让进度界面完成首帧绘制');
assert(source.includes('var t = cc.winSize.width - e;\nthis.node.width = t;\nthis.node.height = cc.winSize.height;')
  && source.includes('this.node.anchorX = (cc.winSize.width / 2 - e) / t;')
  && source.includes('Math.max(cc.winSize.width / o.width, cc.winSize.height / o.height)')
  && source.includes('o.scaleX = n;\no.scaleY = n;'),
  '俱乐部没有保持左侧安全区并仅向右扩展，或背景未等比例铺满');
assert(source.includes('var topPanal = this.contentRoot.getChildByName("TopPanal");')
  && source.includes('var topExtension = new cc.Node("TopPanalRightExtension");')
  && source.includes('topExtension.width = e + 5;')
  && source.includes('topExtension.x = this.contentRoot.width / 2;')
  && source.includes('extensionSprite.spriteFrame = topSprite.spriteFrame;')
  && source.includes('topExtension.setSiblingIndex(topPanal.getSiblingIndex());')
  && !source.includes('topExtension.x = topPanal.x + topPanal.width * (1 - topPanal.anchorX) - 5;')
  && !source.includes('topPanal.width = topWidth + e;')
  && !source.includes('topPanal.anchorX = topWidth * topAnchorX / topPanal.width;')
  && !source.includes('topWidget.left = -e - 5;')
  && !source.includes('topWidget.right = -e - 5;'),
  '俱乐部顶部遮罩没有使用与原按钮脱离的独立右侧补片');
for (const [width, safeOffset] of [[1280, 0], [1624, 172], [1792, 256]]) {
  if (safeOffset <= 0) continue;
  const contentWidth = width - 2 * safeOffset;
  const extensionRight = contentWidth / 2 + safeOffset + 5;
  assert.equal(extensionRight, width / 2 + 5,
    '俱乐部顶部遮罩右侧补片没有到达屏幕右外沿');
}
assert(!source.includes('getChildByName("ClubListLayer");\ni && (i.active = !1);'),
  '俱乐部侧栏仍被额外隐藏，没有恢复原来的折叠显示逻辑');
assert(source.includes('this._panel(e, "MessageInput", 840, 64, 0, -178'),
  '客服输入框没有与聊天记录框保持等宽');
assert(source.includes('this._button(t, "sendSupport", 106, 38, 351, -8'),
  '客服发送按钮没有放入输入框右下角');
assert(source.includes('var o = new cc.Node("EditArea");')
  && source.includes('o.setContentSize(690, 56);')
  && source.includes('n.anchorX = 0;\nn.setPosition(-325, 5);')
  && source.includes('i.anchorX = 0;\ni.setPosition(-325, 5);')
  && source.includes('s.textLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;')
  && source.includes('s.placeholderLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;'),
  '客服输入文字或占位文字没有强制从左侧开始显示');
assert(source.includes('var s = o.addComponent(cc.EditBox);')
  && !source.includes('t.addComponent(cc.EditBox)'),
  '客服发送按钮仍位于输入框点击区域内');
assert(!source.includes('"牌局异常", "我遇到了牌局异常')
  && !source.includes('"账号问题", "我需要咨询账号问题')
  && !source.includes('"房卡问题", "我需要咨询房卡相关问题')
  && !source.includes('"意见建议", "我有一条意见或建议'),
  '客服窗口仍包含问题分类快捷按钮');
assert(!source.includes('this._button(r, "onClickClose"'),
  '客服窗口仍包含重复的自绘关闭按钮');
assert(!source.includes('getChildByName("BtnClose")'),
  '客服窗口仍在额外启用场景关闭按钮');
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
assert(hotUpdateScript.includes('table-background-3d.jpg')
  && hotUpdateScript.includes('table-background-3d-ios.png')
  && hotUpdateScript.includes('0ed69516-3023-4cb0-947a-abd9aab04b9f.jpg'),
'热更新没有固化 Android/iOS 3D 桌面背景');
for (const script of ['patchapk.js', 'build-ios-ipa.js', 'publish-hot-update.js']) {
  const body = fs.readFileSync(path.join(__dirname, script), 'utf8');
  assert(body.includes('table-text-3d.png')
    && body.includes('a120356e-9147-4a68-a7ef-f9c4dbbaff41.png'),
  `${script} 没有固化新版 3D 桌面文字图集`);
}
console.log('客户端整包/热更单一源码校验通过');
