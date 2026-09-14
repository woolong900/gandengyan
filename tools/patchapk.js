#!/usr/bin/env node
/**
 * 把原版 APK 的服务器地址改到自己的服务端，重打包并重新签名。
 *
 * 客户端一个字节都不用改写：地址全在 `Config/GameConstant.js` 的几个常量里，
 * 解密 `assets/src/project.jsc`、替换字符串、再加密塞回去就行。
 * `.jsc` 在 APK 里是 **Stored**（未压缩），所以更新时必须 `zip -0`，
 * 否则原本 4 字节对齐的条目会被压成 Deflate，zipalign 还得重排。
 *
 * 热更地址也一并改掉：留着原厂的地址，客户端有可能把我们的脚本覆盖回去。
 *
 * `--guest` 把登录页的游客按钮放出来。原版是 `guestNode.active = isDebug()`，
 * 而 `isDebug()` 走 Java 桥问这个包是不是 debuggable——与其去改二进制 manifest，
 * 不如就在这里改 JS，反正 project.jsc 本来就要重新加密。别顺手把 `isDebug()`
 * 整个改成 true：那会把 gameMode 切到 debug，牵动的地方远不止一个按钮。
 *
 * 语音走自己的 GME AppID：写在 AndroidManifest 的 SDK_VOICE_*，
 * 用 --voice-appid / --voice-appkey，或环境变量 / .dev.vars，不要把密钥提交进 git。
 * 原生库从旧 GCloudVoice 换成 GME 2.9。录音仍用 GME，文件走自己服务器 /voice，
 * 避免模拟器和真机落在不同 COS 分区后互相反向下载超时。
 *
 * 地址一律写局域网 IP。不要打 10.0.2.2：那是模拟器回环，真机连不上。
 * 模拟器也能访问电脑的 192.168.*。不写 --host 时自动探测网卡。
 *
 * usage: node tools/patchapk.js --apk <原始.apk> [--host <主机[:端口]>] [--tls] [--guest]
 *   [--package <包名>] [--app-name <应用名>] [--wechat-appid <微信AppID>] [--out <输出.apk>]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { toJs, toJsc } = require('./jsc');

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i < 0 ? def : argv[i + 1];
};

const loadDotEnv = () => {
  const p = path.join(__dirname, '..', '.dev.vars');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^(QJQP_VOICE_APPID|QJQP_VOICE_APPKEY|QJQP_WECHAT_APPID)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
};
loadDotEnv();

const lanIPv4 = () => {
  const ifs = os.networkInterfaces();
  const all = [];
  for (const name of Object.keys(ifs)) {
    for (const a of ifs[name] || []) {
      const family = a.family === 4 || a.family === 'IPv4';
      if (!family || a.internal) continue;
      if (a.address === '10.0.2.2') continue;
      all.push({ name, address: a.address });
    }
  }
  for (const want of ['en0', 'en1', 'eth0', 'wlan0']) {
    const hit = all.find((x) => x.name === want);
    if (hit) return hit.address;
  }
  const priv = all.find((x) => /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(x.address));
  return (priv || all[0] || {}).address || '';
};

const APK = arg('apk');
const LAN = lanIPv4();
let HOST = arg('host');
const TLS = argv.includes('--tls');
if (HOST && /^10\.0\.2\.2(?::|$)/.test(HOST)) {
  if (!LAN) {
    console.error('不能打 10.0.2.2，真机连不上，也找不到局域网 IP');
    process.exit(1);
  }
  console.log(`--host ${HOST} 真机连不上，改用 ${LAN}:8899`);
  HOST = `${LAN}:8899`;
}
if (!HOST) HOST = LAN ? `${LAN}:8899` : '';
// HTTPS 公网域名默认走443；局域网 IP 才补本地服务端的 8899。
if (HOST && !/:\d+$/.test(HOST) && (!TLS || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(HOST))) HOST = `${HOST}:8899`;
const OUT = arg('out', APK && APK.replace(/\.apk$/, '-patched.apk'));
const SDK = process.env.ANDROID_SDK_ROOT || '/opt/homebrew/share/android-commandlinetools';
const KEYSTORE = arg('keystore', path.join(os.homedir(), '.android-qjqp.keystore'));
const KEY_ALIAS = arg('key-alias', 'gandengyan');
const STOREPASS = 'qjqp123456';
const VOICE_APPID = arg('voice-appid', process.env.QJQP_VOICE_APPID);
const VOICE_APPKEY = arg('voice-appkey', process.env.QJQP_VOICE_APPKEY);
const WECHAT_APPID = arg('wechat-appid', process.env.QJQP_WECHAT_APPID);
const ORIGINAL_PACKAGE = 'com.yuanlai.qjqp';
const APP_PACKAGE = arg('package', 'com.haoke.gandengyan');
const APP_NAME = arg('app-name', '潜江干瞪眼');
const ICON_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'icon.png');
const LOGIN_LOGO_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'login', 'login-logo.png');
const LOGIN_BACKGROUND_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'login', 'login-background.jpg');
const HALL_BACKGROUND_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'hall', 'hall-background.png');
const HALL_CHARACTER_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'hall', 'hall-character.png');
const CLUB_BACKGROUND_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'club', 'club-background.png');
const CLUB_CHARACTER_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'club', 'club-character-empty.png');
const TABLE_BACKGROUND_2D_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'table', 'table-background-2d.jpg');
const TABLE_BACKGROUND_3D_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'table', 'table-background-3d.jpg');
const SPLASH_SOURCE = path.join(__dirname, '..', 'assets', 'branding', 'startup', 'splash-screen.png');
const LEGACY_CLEANUP_DIR = path.join(__dirname, '..', 'assets', 'branding', 'legacy-cleanup');
const APKTOOL = process.env.APKTOOL
  || (fs.existsSync('/tmp/apktool.jar') ? '/tmp/apktool.jar' : '/opt/homebrew/bin/apktool');
const GME_URL = process.env.GME_SDK_URL
  || 'https://dl.gmertc.com/gme/GME2.9.17/Android/GME_android_audio_sdk_2.9.17.9e947c95.zip';
const GME_DIR = process.env.GME_SDK || '/tmp/gme-sdk';
const ANDROID_JAR = process.env.ANDROID_JAR
  || path.join(SDK, 'platforms', 'android-34', 'android.jar');

if (WECHAT_APPID && !/^wx[0-9a-zA-Z]{16}$/.test(WECHAT_APPID)) {
  console.error('微信 AppID 格式错误，应为 wx 加 16 位字母或数字');
  process.exit(1);
}
if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(APP_PACKAGE)) {
  console.error(`Android 包名格式错误：${APP_PACKAGE}`);
  process.exit(1);
}
if (!APP_NAME.trim()) {
  console.error('应用名称不能为空');
  process.exit(1);
}

if (!APK || !HOST) {
  console.error('usage: node tools/patchapk.js --apk <原始.apk> [--host <局域网IP[:端口]>] [--tls] [--out <输出.apk>]');
  process.exit(1);
}
console.log(`打包地址 ${TLS ? 'https' : 'http'}://${HOST}`);

/** 中文规则要按 UTF-8 字节进 binary 串，否则 split 对不上 */
const u2b = (s) => Buffer.from(s, 'utf8').toString('binary');

const http = `${TLS ? 'https' : 'http'}://${HOST}`;
const ws = `${TLS ? 'wss' : 'ws'}://${HOST}`;
/** 长的先替换，否则裸域名会把带路径的那几条先吃掉 */
const RULES = [
  ['http://10.0.2.2:8899', http],
  ['ws://10.0.2.2:8899', ws],
  ['http://10.0.2.2', http],
  ['ws://10.0.2.2', ws],
  ['wss://qj.yuanlaiqipai.net', ws],
  ['wss://test2.yuanlaihuyu.com', ws],
  ['https://qj.yuanlaiqipai.net', http],
  ['https://test2.yuanlaihuyu.com', http],
  ['https://test2.yuanlaiqipai.cn', http],
  ['https://qj.laishopping.cn', http],
  ['http://ylsoft.qj.dayuehuyu.com', http],
  ['http://hotupgrade.yuanlaihuyu.com', http],
];
if (argv.includes('--guest')) {
  RULES.push(['this.guestNode.active = v.default.isDebug();', 'this.guestNode.active = true;']);
}

// 游客登录携带 Android ID。已有游客 token 也一并发送，服务端会先把旧账号
// 绑定到当前设备；以后即使应用数据被清除，同一设备仍能找回这个游客账号。
RULES.push([
  't.prototype._guestLogin = function() {\nvar e = this, t = {\nappName: a.default.appName,\naccountType: s.eAccountType.guest,\ncode: void 0,\ntoken: void 0\n};\nl.default.uiHelper.showLoading();\nvar o = d.default.guestToken.getValue();\no ? this._tokenLogin(o) : this._accountSend(t, function(t) {\ne._loginSuccess(t.token, s.eAccountType.guest, function(e) {\ne && l.default.uiHelper.removeLoading();\n});\n}, function(e, t) {\nl.default.uiHelper.removeLoading();\nl.default.uiHelper.showTip(t);\n});\n};',
  't.prototype._guestLogin = function() {\nvar e = this, t = {\nappName: a.default.appName,\naccountType: s.eAccountType.guest,\ncode: void 0,\ntoken: d.default.guestToken.getValue(),\ndeviceId: void 0\n};\nif (cc.sys.os === cc.sys.OS_ANDROID) try {\nt.deviceId = jsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "getGuestDeviceId", "()Ljava/lang/String;");\n} catch (o) {\ncc.error("get guest device id failed:", o);\n}\nl.default.uiHelper.showLoading();\nthis._accountSend(t, function(t) {\ne._loginSuccess(t.token, s.eAccountType.guest, function(e) {\ne && l.default.uiHelper.removeLoading();\n});\n}, function(e, t) {\nl.default.uiHelper.removeLoading();\nl.default.uiHelper.showTip(t);\n});\n};',
  true,
]);

// 登录页只保留微信（以及显式开启的调试游客入口）。同时禁用旧手机令牌的
// 自动登录路径，避免用户升级后仍被上个版本保存的登录方式带进游戏。
// 原厂 AppDunOnOff 和 LoginUpdate 都在场景 start 阶段运行；全新安装时前者
// 偶尔会先发出 on_off_ok，导致后者错过事件并永远停在“更新检测中”。注册事件
// 后补一次下一帧调用，并用闭包保证无论事件还是兜底先到都只检查一次。
RULES.push([
  'c.default.eventUtils.on("on_off_ok", function() {\ncc.log("on off ok.");\ne.checkFull(3);\n}, this, y.eOffType.OnDestroy);\nthis.initActivityData();',
  'var onOffHandled = !1, continueUpdate = function() {\nif (onOffHandled) return;\nonOffHandled = !0;\ne.checkFull(3);\n};\nc.default.eventUtils.on("on_off_ok", continueUpdate, this, y.eOffType.OnDestroy);\nthis.scheduleOnce(continueUpdate);\nthis.initActivityData();',
  true,
]);
RULES.push([
  'this.mobileNode.active = !0;',
  'this.mobileNode.active = !1;',
  true,
]);
RULES.push([
  'e === s.eAccountType.mobile && d.default.mobileToken.getValue() && this._mobileLogin(null);',
  '',
  true,
]);

// 微信配置不完整时在客户端给出可操作提示，避免 iOS SDK
// 因 Universal Link 为空而无回调。授权取消和真正失败也分开提示。
RULES.push([
  't.prototype._wxLogin = function() {\nvar e = this, t = {',
  u2b('t.prototype._wxLogin = function() {\nif (!v.default.sdkInfo("SDK_WX_APPID")) return l.default.uiHelper.showTip("微信登录尚未配置 AppID");\nif (cc.sys.os === cc.sys.OS_IOS && !v.default.sdkInfo("SDK_WX_APPLINK")) return l.default.uiHelper.showTip("iOS 微信登录需先配置 Universal Link");\nvar e = this, t = {'),
  true,
]);
RULES.push([
  u2b('if (o === s.eExCallBackMsg.cancel || o === s.eExCallBackMsg.fail) l.default.uiHelper.showTip("登录失败~"); else {'),
  u2b('if (o === s.eExCallBackMsg.cancel) l.default.uiHelper.showTip("已取消微信登录"); else if (o === s.eExCallBackMsg.fail) l.default.uiHelper.showTip("微信登录失败，请检查微信配置"); else {'),
  true,
]);

// 分享标题使用当前品牌，并把原生 SDK 的失败回调显示给用户。
RULES.push([
  't.prototype.share = function(e, t) {\nif (this._shareUIType === i.ShareHall) {',
  u2b('t.prototype.share = function(e, t) {\nvar k = function(e) {\ne === c.eExCallBackMsg.fail && l.default.uiHelper.showTip("微信分享失败，请检查微信或网络");\n};\nif (this._shareUIType === i.ShareHall) {'),
  true,
]);
RULES.push([
  'var o = function(o) {\ne === c.eAccountType.wechat',
  u2b('var o = function(o) {\no === c.eExCallBackMsg.fail && l.default.uiHelper.showTip("微信分享失败，请检查微信或网络");\ne === c.eAccountType.wechat'),
  true,
]);
RULES.push([
  u2b('var m = "最好玩的游戏", g = "最正宗的玩法", y = d.default.downloadUrl({});\ncc.sys.isNative && s.default.shareWebPage(e, t, g, m, this.iconPath(), y);'),
  u2b('var m = "潜江本地玩法，约上好友一起玩", g = "潜江干瞪眼", y = d.default.downloadUrl({});\ncc.sys.isNative && s.default.shareWebPage(e, t, g, m, this.iconPath(), y, k);'),
  true,
]);
RULES.push([
  'e === c.eAccountType.xianLiao ? s.default.shareGame(e, t, g, m, this.iconPath(), "" + u.default.roomId, " ") : s.default.shareWebPage(e, t, g, m, this.iconPath(), y);',
  'e === c.eAccountType.xianLiao ? s.default.shareGame(e, t, g, m, this.iconPath(), "" + u.default.roomId, " ") : s.default.shareWebPage(e, t, g, m, this.iconPath(), y, k);',
  true,
]);
RULES.push([
  's.default.shareWebPage(e, t, g, _, this.iconPath(), y);',
  's.default.shareWebPage(e, t, g, _, this.iconPath(), y, k);',
  true,
]);
RULES.push([
  't.prototype.onClickShareWxFriend = function() {\nthis.share(c.eAccountType.wechat, c.eShareScene.Friend);',
  u2b('t.prototype.onClickShareWxFriend = function() {\nif (!s.default.isInstallWX()) return l.default.uiHelper.showTip("您尚未安装微信客户端！");\nif (cc.sys.os === cc.sys.OS_IOS && !d.default.sdkInfo("SDK_WX_APPLINK")) return l.default.uiHelper.showTip("iOS 微信分享需先配置 Universal Link");\nthis.share(c.eAccountType.wechat, c.eShareScene.Friend);'),
  true,
]);
RULES.push([
  't.prototype.onClickShareWxCircle = function() {\nthis.share(c.eAccountType.wechat, c.eShareScene.Circle);',
  u2b('t.prototype.onClickShareWxCircle = function() {\nif (!s.default.isInstallWX()) return l.default.uiHelper.showTip("您尚未安装微信客户端！");\nif (cc.sys.os === cc.sys.OS_IOS && !d.default.sdkInfo("SDK_WX_APPLINK")) return l.default.uiHelper.showTip("iOS 微信分享需先配置 Universal Link");\nthis.share(c.eAccountType.wechat, c.eShareScene.Circle);'),
  true,
]);

// 分享弹窗去掉未配置且不再使用的钉钉、默往入口。
RULES.push([
  'this.ddNode.active = !0;\nthis.mwNode.active = !0;',
  'this.ddNode.active = !1;\nthis.mwNode.active = !1;',
  true,
]);

// 去掉大厅首页左侧的手机认证按钮。
RULES.push([
  'this.node.getChildByName("box").getChildByName("BtnBuyCard").active = !a.default.isReivew;',
  'var mobileBtn = this.node.getChildByName("LeftBtns").getChildByName("BtnMobile");\nmobileBtn && (mobileBtn.active = !1);\nthis.node.getChildByName("box").getChildByName("BtnBuyCard").active = !a.default.isReivew;',
  true,
]);

// 登录页：去掉许可证编号那一排文字，并用不含旧品牌角标的新标题图。
RULES.push([
  'u.default.setImg("Hall/Res/Texture/Login/login_logo", this.logo);',
  'var e = this, t = this.node.getChildByName("login_bg"), o = t && t.getChildByName("IBSA");\no && (o.active = !1);\nif (cc.sys.isNative) {\nvar n = jsb.fileUtils.fullPathForFilename("branding/login-logo.png");\ncc.loader.load({ url: n, type: "png" }, function(t, o) {\nt ? u.default.setImg("Hall/Res/Texture/Login/login_logo", e.logo) : e.logo && e.logo.isValid && (e.logo.spriteFrame = new cc.SpriteFrame(o));\n});\n} else u.default.setImg("Hall/Res/Texture/Login/login_logo", this.logo);',
  true,
]);

// Android 发布版本仍为 1.0.5，资源版本显示实际的原厂 R234。
RULES.push([
  'assertVer: 234,\npackageVer: "1.0.2",',
  'assertVer: 234,\npackageVer: "1.0.5",',
  true,
]);

// 旧支付流程会把这个字段显示为订单中的商品/应用名称。保留支付渠道枚举，
// 只改用户能看到的名称，避免影响服务端对支付方式的匹配。
RULES.push([u2b('"元来游戏"'), u2b(`"${APP_NAME}"`)]);

// 去掉大厅推广员入口，并切回不带推广按钮的普通顶部背景。
// 标记为 required，避免客户端版本变化后静默漏掉这个改动。
RULES.push([
  'e.headerBg.active = !a.default.isAgent;\ne.headerBg01.active = a.default.isAgent;\ne.btnAgent.active = a.default.isAgent;',
  'e.headerBg.active = !0;\ne.headerBg01.active = !1;\ne.btnAgent.active = !1;',
  true,
]);

// 去掉个人信息里的代理入口；没有绑定手机号时也不留下多余分隔线。
RULES.push([
  'this.dividerNode.active = !(!c.default.mobile && !c.default.isAgent);\nthis.agentEnterNode.active = c.default.isAgent;',
  'this.dividerNode.active = !!c.default.mobile;\nthis.agentEnterNode.active = !1;',
  true,
]);

// 实名表单先清理空格并统一身份证末位 X，减少输入错误；服务端仍执行完整校验。
RULES.push([
  'var t = this.nameLabel.string, o = this.idCardLabel.string;',
  u2b('var t = this.nameLabel.string.replace(/[\\s\\u00a0]+/g, "").replace(/[•・]/g, "·"), o = this.idCardLabel.string.replace(/\\s+/g, "").toUpperCase();'),
  true,
]);
// 服务端只回传脱敏数据；首次提交仍在本地使用刚输入的原值，两个场景都正确展示。
RULES.push([
  'this.nameLabel.string = i.default.realName.slice(0, 1) + "**";\nthis.cardLabel.string = i.default.idCard.slice(0, 6) + "*******" + i.default.idCard.slice(-4, i.default.idCard.length);',
  'this.nameLabel.string = i.default.realName.slice(0, 1) + "**";\nthis.cardLabel.string = i.default.idCard.indexOf("*") >= 0 ? i.default.idCard : i.default.idCard.slice(0, 6) + "********" + i.default.idCard.slice(-4, i.default.idCard.length);',
  true,
]);

// 朝天笑只有三张皮子。原客户端虽然会在碰杠区按三张绘制，却仍按普通杠
// 删除手牌：暗朝天删四张、接别人打出的朝天删三张，都会让本地手牌错乱。
RULES.push([
  'if (_.subType === i.eGangType.AnGang) g ? m.removeHandCards([ D, D, D, D ], !0) : m.removeHandCards([ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0); else if (_.subType === i.eGangType.MingGang) {',
  'if (_.subType === i.eGangType.AnGang) g ? m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ D, D, D ] : [ D, D, D, D ], !0) : m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ] : [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0); else if (_.subType === i.eGangType.MingGang) {',
  true,
]);
RULES.push([
  'g ? m.removeHandCards([ D, D, D ], !0) : m.removeHandCards([ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);\no();',
  'g ? m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ D, D ] : [ D, D, D ], !0) : m.removeHandCards(u.default.gameLogic().is3CardGang(D) ? [ a.MJ_BACK_ID, a.MJ_BACK_ID ] : [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);\no();',
  true,
]);
RULES.push([
  '!c.default.isWatcher() && e.showVoice(a, n.content);',
  'n.fromUid != D.default.uid && !c.default.isWatcher() && e.showVoice(a, n.content);',
]);
// 临时：创房/大厅只露出潜江晃晃。要恢复就把这一段删掉。
RULES.push([
  'gameList: [ c.eGameIds.QJHH, c.eGameIds.QJHZ, c.eGameIds.PDKAA, c.eGameIds.DDZ, c.eGameIds.TMHH, c.eGameIds.QJSHZ, c.eGameIds.QJWSKBD, c.eGameIds.GD ]',
  'gameList: [ c.eGameIds.QJHH ]',
]);
// 临时：潜江晃晃改名干瞪眼；玩法只留土豪必杠。
RULES.push([u2b('name: "潜江晃晃"'), u2b('name: "干瞪眼"')]);
RULES.push([
  u2b('desc: "潜江癞晃",\nreject: [ 1, 2, 26 ]'),
  u2b('desc: "潜江癞晃",\nreject: [ 1, 2, 26 ],\nisHide: !0'),
]);
RULES.push([
  u2b('desc: "堆癞子",\nreject: [ 1, 2, 26 ]'),
  u2b('desc: "堆癞子",\nreject: [ 1, 2, 26 ],\nisHide: !0'),
]);
// 暂时关掉语音房：实时麦走腾讯 GME，先只留按住说话。
RULES.push([
  u2b('desc: "语音房",\nnote: "开启之后，玩家将可实时听到语音，无法关闭。"'),
  u2b('desc: "语音房",\nisHide: !0,\nnote: "开启之后，玩家将可实时听到语音，无法关闭。"'),
]);
RULES.push([
  u2b('desc: "语音房",\nnote: "开启之后，其他玩家可实时听到\\n自己说话声音，无法关闭"'),
  u2b('desc: "语音房",\nisHide: !0,\nnote: "开启之后，其他玩家可实时听到\\n自己说话声音，无法关闭"'),
]);
RULES.push([
  u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 1 ],\ndetailIds: [ 1, 2, 26 ]'),
  u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 2 ],\ndetailIds: [ 1, 2, 26 ]'),
]);

// 创房页的 CheckType 原本用 scheduleOnce 延后一帧创建右侧选项，所以弹窗
// 已经显示时内容区仍是空的。改成立即执行，确保弹窗第一次绘制就有完整选项。
RULES.push([
  'this._ids = s;\nthis.scheduleOnce(function() {\nfor (var o = n.layer.width, r = -o / 2, l = o / p, u = 0, d = s.length; u < d; u++) {\nvar f = s[u], h = r + u % p * l, m = 62 * Math.floor(u / p) + 19, g = a.cellStyle(f);\nif (0 === g) {\nvar y = cc.instantiate(n.cellPre);\nn.layer.addChild(y);\ny.x = h;\ny.y = -m;\ny.getComponent(i.default).setData(e, t, f);\n} else if (1 === g) {\ny = cc.instantiate(n.cellStyle1Pre);\nn.layer.addChild(y);\ny.x = h;\ny.y = -m;\ny.getComponent(c.default).setData(e, t, f);\n}\nn._pos.push(cc.v2(h, -m));\n}\nn._updatePos();\n});\n};\nt.prototype._updatePos = function() {',
  'this._ids = s;\nvar w = this.layer.getComponent(cc.Widget);\nw && w.updateAlignment();\n(function() {\nfor (var o = n.layer.width, r = -o / 2, l = o / p, u = 0, d = s.length; u < d; u++) {\nvar f = s[u], h = r + u % p * l, m = 62 * Math.floor(u / p) + 19, g = a.cellStyle(f);\nif (0 === g) {\nvar y = cc.instantiate(n.cellPre);\nn.layer.addChild(y);\ny.x = h;\ny.y = -m;\ny.getComponent(i.default).setData(e, t, f);\n} else if (1 === g) {\ny = cc.instantiate(n.cellStyle1Pre);\nn.layer.addChild(y);\ny.x = h;\ny.y = -m;\ny.getComponent(c.default).setData(e, t, f);\n}\nn._pos.push(cc.v2(h, -m));\n}\nn._updatePos();\n})();\n};\nt.prototype._updatePos = function() {',
  true,
]);
RULES.push([
  'r.default.inviteCode = t.inviteCode || "";\nr.default.inviteCodeAward = t.giveCard || 0;',
  'r.default.inviteCode = t.inviteCode || "";\nr.default.myInviteCode = t.username || "";\nr.default.inviteCodeAward = t.giveCard || 0;',
]);
RULES.push([
  'a.default.isBindInviteCode() ? i.default.uiHelper.showWithNode(l.eWindowID.InviteCodeOK, this.bindInviteCodeOkPre) : i.default.uiHelper.showWithNode(l.eWindowID.InviteCode, this.bindInviteCodePre);',
  'i.default.uiHelper.showWithNode(l.eWindowID.InviteCode, this.bindInviteCodePre);',
]);
RULES.push([
  u2b('t.prototype.start = function() {\nthis.inviteTipLabel.string = "绑定推荐人邀请码，可获得" + l.default.inviteCodeAward + "张房卡哦！";\n};'),
  u2b('t.prototype.start = function() {\nvar e = this, n = function() {\nvar o = l.default.myInviteCode || "", h = e.inactiveNode;\ne.inviteTipLabel.string = "绑定推荐人邀请码，可获得" + l.default.inviteCodeAward + "张房卡哦！";\nif (!h) return;\nvar tip = e.inviteTipLabel.node, name = h.getChildByName("LabelName"), input = h.getChildByName("InputName"), hint = h.getChildByName("LabelTip");\nif (tip) tip.y = 171;\nif (input) input.y = 1;\nif (hint) hint.y = -54;\nif (name) {\nname.setAnchorPoint(1, .5);\nname.setPosition(-128.4, -4);\n}\nvar row = h.getChildByName("MyInviteRow");\nif (!row) {\nrow = new cc.Node("MyInviteRow");\nrow.setPosition(0, 90);\nh.addChild(row);\nif (name) {\nvar title = cc.instantiate(name);\ntitle.name = "MyTitle";\ntitle.setPosition(name.x, 0);\nvar tw = title.getComponent(cc.Widget);\nif (tw) tw.destroy();\ntitle.getComponent(cc.Label).string = "我的邀请码：";\nrow.addChild(title);\n}\nvar bg = input && input.getChildByName("BACKGROUND_SPRITE");\nvar box = bg ? cc.instantiate(bg) : new cc.Node("MyCodeBox");\nbox.name = "MyCodeBox";\nvar ww = box.getComponent(cc.Widget);\nif (ww) { ww.enabled = !1; ww.destroy(); }\nbox.setContentSize(363, 56);\nbox.setPosition(input ? input.x : 63.5, 0);\nrow.addChild(box);\nvar code = new cc.Node("MyCode"), cl = code.addComponent(cc.Label);\ncl.useSystemFont = !0;\ncl.fontFamily = "sans-serif-medium";\ncl.fontSize = 30;\ncl.lineHeight = 36;\ncl.horizontalAlign = 0;\ncl.verticalAlign = 1;\ncl.spacingX = 4;\ncode.color = new cc.Color(151, 56, 26);\ncode.setAnchorPoint(0, .5);\nvar tl = input && input.getChildByName("TEXT_LABEL");\ncode.setPosition(tl ? tl.x : -173, 1);\nbox.addChild(code);\nvar src = h.getChildByName("BtnSign"), copy = src ? cc.instantiate(src) : new cc.Node("CopyInvite");\ncopy.name = "CopyInvite";\nvar bw = copy.getComponent(cc.Widget);\nif (bw) bw.destroy();\nvar bc = copy.getComponent(cc.Button);\nif (bc) bc.clickEvents = [];\nelse copy.addComponent(cc.Button);\ncopy.setScale(src ? .5 : 1, src ? .5 : 1);\ncopy.setPosition((input ? input.x : 63.5) + 254, 0);\nvar lab = copy.getChildByName("Label");\nif (lab && lab.getComponent(cc.Label)) lab.getComponent(cc.Label).string = "复 制";\nrow.addChild(copy);\ncopy.on(cc.Node.EventType.TOUCH_END, function() {\ns.default.clickBtn();\njsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "copyText", "(Ljava/lang/String;)Ljava/lang/String;", l.default.myInviteCode || "");\ni.default.uiHelper.showTip("复制成功！");\n});\n}\nvar show = row.getChildByName("MyCodeBox");\nshow = show && show.getChildByName("MyCode");\nif (show) show.getComponent(cc.Label).string = o;\nif (show && input) { var t2 = input.getChildByName("TEXT_LABEL"); if (t2) show.x = t2.x; }\nvar bound = l.default.inviteCode || "";\nif (bound) {\ne.inviteTipLabel.string = "已绑定推荐人邀请码";\nif (e.inviteCodeLabel) {\ne.inviteCodeLabel.useSystemFont = !0;\ne.inviteCodeLabel.fontFamily = "sans-serif-medium";\ne.inviteCodeLabel.fontSize = 30;\ne.inviteCodeLabel.string = bound;\ne.inviteCodeLabel.node.active = !0;\n}\nif (input) {\nvar eb = input.getComponent(cc.EditBox);\nif (eb) {\neb.string = bound;\neb.enabled = !1;\n}\nvar ph = input.getChildByName("PLACEHOLDER_LABEL");\nif (ph) ph.active = !1;\nvar tl = input.getChildByName("TEXT_LABEL");\nif (tl) tl.active = !0;\n}\nvar sign = h.getChildByName("BtnSign");\nif (sign) {\nvar sb = sign.getComponent(cc.Button);\nif (sb) {\nsb.interactable = !1;\nsb.clickEvents = [];\n}\nvar sl = sign.getChildByName("Label");\nif (sl && sl.getComponent(cc.Label)) sl.getComponent(cc.Label).string = "已绑定";\n}\n}\n};\nc.default.getInviteCode(function() { n(); }, !1);\n};'),
]);

RULES.push([
  u2b('i.default.uiHelper.showTip("绑定成功！");\ni.default.uiHelper.remove(e);\ni.default.uiHelper.show(u.eWindowID.InviteCodeOK);'),
  u2b('i.default.uiHelper.showTip("绑定成功！");\ne.start();'),
]);

RULES.push([
  u2b('this.inviteCodeLabel.string = "邀请码：" + a.default.inviteCode;'),
  u2b('this.inviteCodeLabel.string = "我的邀请码：" + (a.default.myInviteCode || "");'),
]);
RULES.push([
  'var o = u.default.gameRecordList.collection(t, d.default.timerSort);\no.length < 1 ? this.noDataTipNode.active = !0 : this.noDataTipNode.active = !1;',
  'var o = u.default.gameRecordList.collection(t, d.default.timerSort);\no.length < 1 ? this.noDataTipNode.active = !0 : this.noDataTipNode.active = !1;\nthis._updateDayStat(o);',
]);
RULES.push([
  't.prototype._addItem = function(e, t) {',
  u2b('t.prototype._updateDayStat = function(e) {\nvar t = this.node.getChildByName("bg"), o = t && t.getChildByName("DateSelector");\nif (!o) return;\nvar n = o.getChildByName("DateInput"), r = n && n.getChildByName("input_date");\nr = r && r.getChildByName("DateLabel");\nvar i = 36, a = function(s, l) {\nvar c = t.getChildByName(s);\nif (!c) {\nc = r ? cc.instantiate(r) : new cc.Node(s);\nc.name = s;\nvar b = c.getComponent(cc.Label);\nif (!b) {\nb = c.addComponent(cc.Label);\nb.useSystemFont = !0;\nb.fontFamily = "sans-serif-medium";\nb.fontSize = 26;\nb.lineHeight = 26;\nc.color = new cc.Color(93, 70, 26);\n}\nc.setAnchorPoint(1, .5);\nt.addChild(c);\n}\nvar d = c.getComponent(cc.Label);\nd.overflow = 0;\nd.horizontalAlign = 2;\nd.string = l;\nd._updateRenderData && d._updateRenderData(!0);\nreturn c;\n};\nvar s = 0, l = u.default.uid;\nfor (var c = 0; c < e.length; c++) {\nvar d = u.default.gameRecordList.get(e[c]);\nif (d && d.players) for (var p = 0; p < d.players.length; p++) if (Number(d.players[p].uid) === Number(l)) {\ns += d.players[p].score;\nbreak;\n}\n}\nvar f = a("DayScore", "总分：" + s), h = a("DayGames", "总场次：" + e.length);\nvar m = o.x - ((n && n.width) || 260) / 2;\nf.setPosition(m - i, o.y);\nh.setPosition(m - i - f.width - i, o.y);\n};\nt.prototype._addItem = function(e, t) {'),
]);
RULES.push([
  'e.prototype.replaceDYJPay = function() {\nvar e = this._storageData.ids;\nif (e.length > 0) {\nvar t = 14, o = 12;',
  'e.prototype.replaceDYJPay = function() {\nvar e = this._storageData.ids;\nif (2 === this.index && e) {\nfor (var q = e.length - 1; q >= 0; q--) (1 === e[q] || 26 === e[q]) && (e[q] = 2);\nthis._storageData.ids = this._unique(e);\ne = this._storageData.ids;\n}\nif (e.length > 0) {\nvar t = 14, o = 12;',
]);

// 创房页：高度仍交给 Layout CONTAINER（和原包一样），只关掉 ScrollView 回弹，
// 否则 content 尺寸未就绪时会按住一直拖出空白。
RULES.push([
  'f.setData(h, h === n);\nthis.listNode.addChild(p);\n}',
  'f.setData(h, h === n);\nthis.listNode.addChild(p);\n}\nthis._lockCreateRoomScroll(this.allGameList, this.listNode);',
]);
RULES.push([
  's.setData(this._chooseGameId, n, l);\n}\nthis._updateIp();\n}',
  's.setData(this._chooseGameId, n, l);\n}\nthis._lockCreateRoomScroll(this.contentNdoe && this.contentNdoe.parent && this.contentNdoe.parent.parent && this.contentNdoe.parent.parent.getComponent(cc.ScrollView), this.contentNdoe);\nthis._updateIp();\n}',
]);
RULES.push([
  't.prototype._updateIp = function() {',
  't.prototype._lockCreateRoomScroll = function(e, t) {\nif (!t) return;\nvar o = t.getComponent(cc.Layout);\nif (o) {\no._layoutDirty = !0;\no.updateLayout();\n}\nif (!(t.height > 0)) {\nvar n = o && void 0 !== o.spacingY ? o.spacingY : 0, r = (o && o.paddingTop || 0) + (o && o.paddingBottom || 0), i = t.children, a = 0;\nfor (var s = 0; s < i.length; s++) if (i[s].activeInHierarchy) {\na++;\nr += i[s].height;\n}\nr += Math.max(0, a - 1) * n;\nt.height = Math.max(r, 1);\n}\nif (e) {\ne.elastic = !1;\ne._calculateBoundary && e._calculateBoundary();\n}\n};\nt.prototype._updateIp = function() {',
]);

// 所有基于 ScrollContens 的列表统一关闭回弹，避免内容边界未及时刷新时可以被拖出无限空白。
// 战绩、战绩详情、俱乐部成员/消息/房间列表都共用这个组件。
RULES.push([
  't.prototype.load = function(e) {\nvar t = this, o = this.node.getComponent(cc.ScrollView), n = this.node.getChildByName("scrollBar"), r = cc.find("view/content", this.node);',
  't.prototype.load = function(e) {\nvar t = this, o = this.node.getComponent(cc.ScrollView), n = this.node.getChildByName("scrollBar"), r = cc.find("view/content", this.node);\no.elastic = !1;',
]);

// 抢杠胡同时带普通胡位时，优先播报潜江专用的 qj_qgh，不能被普通 hu 音频抢先匹配。
RULES.push([
  u2b('e.prototype._huSound = function(e, t) {\nfor (var o = null, r = a.HuTypeBitConfig[e], i = this._sortIds(r), l = 0; l < i.length; l++) {\nvar c = parseInt(i[l]);\nif (n.default.checkBit(t, c)) {\no = r[c].sound;\nbreak;\n}\n}\no || (o = s.default.gameLogic().isZiMo(t) ? "zimo" : "hu");\nreturn o;\n};'),
  u2b('e.prototype._huSound = function(e, t) {\nvar o = null, r = a.HuTypeBitConfig[e];\nif (e === i.eGameIds.QJHH && r[16] && n.default.checkBit(t, 16)) return r[16].sound || "hu";\nfor (var h = this._sortIds(r), l = 0; l < h.length; l++) {\nvar c = parseInt(h[l]);\nif (n.default.checkBit(t, c)) {\no = r[c].sound;\nbreak;\n}\n}\no || (o = s.default.gameLogic().isZiMo(t) ? "zimo" : "hu");\nreturn o;\n};'),
]);

// 右侧开启/关闭玩法后，主动刷新桌子列表，清掉服务端已回收的空桌。
RULES.push([
  u2b('a.default.eventUtils.emit(s.default.data_club_get_scheme_list);\n} else a.default.uiHelper.showTip(e.res.what);'),
  u2b('a.default.eventUtils.emit(s.default.data_club_get_scheme_list);\nh.default.getClubTableInfo(e._clubId, function() { a.default.eventUtils.emit(s.default.data_club_table_scheme_update); }, !0);\n} else a.default.uiHelper.showTip(e.res.what);'),
]);

// 俱乐部桌子数据统一刷新后通知桌子组件，避免空列表时旧空桌残留在界面；
// 回调变量全部改名，避免遮蔽模块级 gContext/EventKeys。
RULES.push([
  u2b('e.prototype.getClubTableInfo = function(e, t, o) {\nvoid 0 === o && (o = !1);\nvar r = {\nclubId: e\n};\nn.default.sendMsg(122, r, function(o, n, r) {\nif (r) t(o, r); else {\nif (0 === o.res.error) {\nvar i = a.default.get(e).tableList();\ni.destroy();\nfor (var s = 0, c = o.rooms.length; s < c; s++) {\nvar u = new l.default(o.rooms[s]);\ni.update(u);\n}\n}\nt(o, null);\n}\n}, o);\n};'),
  u2b('e.prototype.getClubTableInfo = function(e, t, o) {\nvoid 0 === o && (o = !1);\nvar request = {\nclubId: e\n};\nn.default.sendMsg(122, request, function(response, unused, networkError) {\nif (networkError) t(response, networkError); else {\nif (0 === response.res.error) {\nvar tableList = a.default.get(e).tableList();\ntableList.destroy();\nfor (var roomIndex = 0, roomCount = response.rooms.length; roomIndex < roomCount; roomIndex++) {\nvar roomData = new l.default(response.rooms[roomIndex]);\ntableList.update(roomData);\n}\nr.default.eventUtils.emit(u.default.data_club_table_scheme_update);\n}\nt(response, null);\n}\n}, o);\n};'),
]);

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const runApktool = (args) => APKTOOL.endsWith('.jar')
  ? run('java', ['-jar', APKTOOL, ...args])
  : run(APKTOOL, args);
const tool = (name) => {
  const dir = path.join(SDK, 'build-tools');
  const ver = fs.readdirSync(dir).sort().pop();
  return path.join(dir, ver, name);
};

const writeStub = (root, rel, body) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body);
};

const ensureGmeSdk = () => {
  const jar = path.join(GME_DIR, 'libs', 'gmesdk.jar');
  if (fs.existsSync(jar)) return jar;
  fs.mkdirSync(GME_DIR, { recursive: true });
  const zip = path.join(GME_DIR, 'sdk.zip');
  console.log('      下载 GME Android SDK');
  run('curl', ['-fsSL', '-A', 'Mozilla/5.0', '-o', zip, GME_URL]);
  run('unzip', ['-qo', zip, '-d', GME_DIR]);
  if (!fs.existsSync(jar)) throw new Error('GME SDK 里没有 gmesdk.jar');
  return jar;
};

/** 编 Voice.java + gmesdk.jar，解成 smali，供塞进 APK。 */
const compileGmeVoiceSmali = () => {
  const jar = ensureGmeSdk();
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-gme-'));
  const stubs = path.join(work, 'stubs');
  const classes = path.join(work, 'classes');
  const dexDir = path.join(work, 'dex');
  fs.mkdirSync(classes);
  fs.mkdirSync(dexDir);
  writeStub(stubs, 'org/cocos2dx/javascript/AppActivity.java', [
    'package org.cocos2dx.javascript;',
    'import android.app.Activity;',
    'import android.content.Context;',
    'public class AppActivity extends Activity {',
    '  public static Context getContext() { return null; }',
    '}',
    '',
  ].join('\n'));
  writeStub(stubs, 'com/yuanlai/Constants.java', [
    'package com.yuanlai;',
    'public class Constants {',
    '  public static String sdkConfig(String key) { return ""; }',
    '}',
    '',
  ].join('\n'));
  writeStub(stubs, 'com/yuanlai/external/Bridge.java', [
    'package com.yuanlai.external;',
    'public class Bridge {',
    '  public static void onAction(String a, String b, String c) {}',
    '  public static void onAction(String a, String b, String c, String d) {}',
    '}',
    '',
  ].join('\n'));
  const voiceSrc = path.join(__dirname, 'gme', 'Voice.java');
  run('javac', [
    '-source', '1.8', '-target', '1.8', '-Xlint:-options',
    '-cp', [ANDROID_JAR, jar, stubs].join(path.delimiter),
    '-d', classes,
    path.join(stubs, 'org/cocos2dx/javascript/AppActivity.java'),
    path.join(stubs, 'com/yuanlai/Constants.java'),
    path.join(stubs, 'com/yuanlai/external/Bridge.java'),
    voiceSrc,
  ]);
  const voiceJar = path.join(work, 'voice.jar');
  run('jar', ['cf', voiceJar, '-C', classes, 'com/yuanlai/external/Voice.class']);
  for (const name of fs.readdirSync(path.join(classes, 'com/yuanlai/external'))) {
    if (name.startsWith('Voice$')) {
      run('jar', ['uf', voiceJar, '-C', classes, `com/yuanlai/external/${name}`]);
    }
  }
  run(tool('d8'), [
    '--lib', ANDROID_JAR, '--min-api', '16', '--output', dexDir,
    jar, voiceJar,
  ]);
  const miniApk = path.join(work, 'mini.apk');
  run('zip', ['-q', '-0', '-X', miniApk, 'classes.dex'], dexDir);
  const smaliOut = path.join(work, 'smali');
  runApktool(['d', '-f', '-o', smaliOut, miniApk]);
  return { work, smali: path.join(smaliOut, 'smali') };
};

const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    const a = path.join(from, name);
    const b = path.join(to, name);
    if (fs.statSync(a).isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
};

const rmIf = (p) => {
  fs.rmSync(p, { recursive: true, force: true });
};

const walkFiles = (root, visit) => {
  if (!fs.existsSync(root)) return;
  for (const name of fs.readdirSync(root)) {
    const file = path.join(root, name);
    if (fs.statSync(file).isDirectory()) walkFiles(file, visit);
    else visit(file);
  }
};

const xmlEscape = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const writeEncryptedAsset = (source, target) => {
  const key = 0x77;
  const input = fs.readFileSync(source);
  const encrypted = Buffer.alloc(input.length);
  for (let i = 0; i < input.length; i += 1) encrypted[i] = input[i] ^ key;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.concat([Buffer.from('aaabbbccc', 'ascii'), Buffer.from([key]), encrypted]));
};

const sanitizeCocosText = (decoded) => {
  const importRoot = path.join(decoded, 'assets', 'res', 'import');
  const replacements = [
    ['元来互娱俱乐部', `${APP_NAME}俱乐部`],
    ['元来黄冈麻将', APP_NAME],
    ['元来黄冈', APP_NAME],
    ['元来棋牌', APP_NAME],
    ['m1m1_77', '游戏客服'],
  ];
  let changedFiles = 0;
  let changedStrings = 0;
  walkFiles(importRoot, (file) => {
    if (!file.endsWith('.json')) return;
    const source = fs.readFileSync(file, 'utf8');
    let changed = source;
    for (const [from, to] of replacements) {
      const count = changed.split(from).length - 1;
      changedStrings += count;
      changed = changed.split(from).join(to);
    }
    if (changed !== source) {
      fs.writeFileSync(file, changed);
      changedFiles += 1;
    }
  });
  if (changedFiles !== 9 || changedStrings !== 30) {
    throw new Error(`旧品牌界面文字清理数量异常：${changedFiles} 个文件、${changedStrings} 处`);
  }
  console.log(`      已清理界面文字 ${changedStrings} 处（${changedFiles} 个资源）`);
};

const replaceLegacyArtwork = (decoded) => {
  const assets = {
    '02dd5217-a089-4edb-af79-6e1c1f3e8f35.png': ['02', '02dd5217-a089-4edb-af79-6e1c1f3e8f35.png'],
    '1b3339a9-7323-4d7a-bc29-a0541f03ebc0.png': ['1b', '1b3339a9-7323-4d7a-bc29-a0541f03ebc0.png'],
    '1d602e4c2.png': ['1d', '1d602e4c2.png'],
    '1f821cda2.png': ['1f', '1f821cda2.png'],
    '352ea258-16a5-4785-9a93-7dcd168211b4.jpg': ['35', '352ea258-16a5-4785-9a93-7dcd168211b4.jpg'],
    '735a1b69-bef3-4257-9942-773def542b50.png': ['73', '735a1b69-bef3-4257-9942-773def542b50.png'],
    '7a66c68d-c67b-4977-881c-c9e860a9556f.png': ['7a', '7a66c68d-c67b-4977-881c-c9e860a9556f.png'],
    '7b0ebbdf-d404-42ab-9c8e-85ad2b828ae9.png': ['7b', '7b0ebbdf-d404-42ab-9c8e-85ad2b828ae9.png'],
    '9272ef06-deee-4241-b004-64c282072754.jpg': ['92', '9272ef06-deee-4241-b004-64c282072754.jpg'],
    'af282322-83b5-482f-9f1a-9f7c5e822465.png': ['af', 'af282322-83b5-482f-9f1a-9f7c5e822465.png'],
    'c8f530ab-040c-4919-b8c6-fa74703c8b06.png': ['c8', 'c8f530ab-040c-4919-b8c6-fa74703c8b06.png'],
    'f80f7e41-3748-4fee-99cf-8066229ff1aa.png': ['f8', 'f80f7e41-3748-4fee-99cf-8066229ff1aa.png'],
    'f89eca2a-97a6-4480-9d24-bdf2fec1e807.png': ['f8', 'f89eca2a-97a6-4480-9d24-bdf2fec1e807.png'],
    'ff4a224b-c762-451f-badc-e999f4d4f91d.png': ['ff', 'ff4a224b-c762-451f-badc-e999f4d4f91d.png'],
  };
  for (const [sourceName, targetParts] of Object.entries(assets)) {
    const source = path.join(LEGACY_CLEANUP_DIR, sourceName);
    if (!fs.existsSync(source)) throw new Error(`缺少旧品牌替换素材：${source}`);
    writeEncryptedAsset(
      source,
      path.join(decoded, 'assets', 'res', 'raw-assets', ...targetParts),
    );
  }
  console.log(`      已替换旧品牌图片 ${Object.keys(assets).length} 张`);
};

const disableLegacyHotUpdate = (decoded) => {
  const manifestFile = path.join(
    decoded,
    'assets', 'res', 'raw-assets', '2c', '2c8a7447-5900-4cca-b1ef-51d750d90396.manifest',
  );
  let source = fs.readFileSync(manifestFile, 'utf8');
  const legacyBase = 'http://hotupgrade.yuanlaihuyu.com/hgmj/update/114';
  const count = source.split(legacyBase).length - 1;
  if (count !== 3) throw new Error(`旧热更新地址匹配到 ${count} 处，预期 3 处`);
  source = source.split(legacyBase).join(`${http}/disabled-hot-update`);
  if (/yuanlai(?:huyu|qipai)/i.test(source)) throw new Error('热更新清单仍含旧公司域名');
  fs.writeFileSync(manifestFile, source);
  console.log('      已禁用原公司的热更新地址');
};

const applyBranding = (decoded) => {
  const manifestFile = path.join(decoded, 'AndroidManifest.xml');
  let manifest = fs.readFileSync(manifestFile, 'utf8').replaceAll(ORIGINAL_PACKAGE, APP_PACKAGE);
  manifest = manifest.replace(
    /(<meta-data android:name="APP_DUN_ONOFF_(?:DEBUG|RELEASE)_URL" android:value=")[^"]*("\/>)/g,
    `$1${http}$2`,
  );
  if (!manifest.includes(`package="${APP_PACKAGE}"`) || manifest.includes(ORIGINAL_PACKAGE)) {
    throw new Error('AndroidManifest 包名替换失败');
  }
  if (/yuanlai(?:huyu|qipai)\.(?:com|cn|net)/i.test(manifest)) {
    throw new Error('AndroidManifest 仍含旧公司服务器地址');
  }
  fs.writeFileSync(manifestFile, manifest);

  const stringsFile = path.join(decoded, 'res', 'values', 'strings.xml');
  let strings = fs.readFileSync(stringsFile, 'utf8');
  strings = strings.replace(
    /(<string name="app_name">)[\s\S]*?(<\/string>)/,
    `$1${xmlEscape(APP_NAME)}$2`,
  );
  if (!strings.includes(`<string name="app_name">${xmlEscape(APP_NAME)}</string>`)) {
    throw new Error('应用名称替换失败');
  }
  fs.writeFileSync(stringsFile, strings);

  const apktoolFile = path.join(decoded, 'apktool.yml');
  let apktool = fs.readFileSync(apktoolFile, 'utf8');
  apktool = apktool
    .replace(/(^\s*versionCode:\s*)\d+$/m, '$1105')
    .replace(/(^\s*versionName:\s*).*$/m, '$11.0.5');
  if (!/^\s*versionCode:\s*105$/m.test(apktool) || !/^\s*versionName:\s*1\.0\.5$/m.test(apktool)) {
    throw new Error('Android 版本号替换失败');
  }
  fs.writeFileSync(apktoolFile, apktool);

  const oldDescriptor = ORIGINAL_PACKAGE.replaceAll('.', '/');
  const newDescriptor = APP_PACKAGE.replaceAll('.', '/');
  for (const name of fs.readdirSync(decoded).filter((entry) => entry.startsWith('smali'))) {
    walkFiles(path.join(decoded, name), (file) => {
      if (!file.endsWith('.smali')) return;
      const source = fs.readFileSync(file, 'utf8');
      const changed = source
        .replaceAll(ORIGINAL_PACKAGE, APP_PACKAGE)
        .replaceAll(oldDescriptor, newDescriptor);
      if (changed !== source) fs.writeFileSync(file, changed);
    });
  }

  const oldCallbacks = path.join(decoded, 'smali', ...oldDescriptor.split('/'));
  const newCallbacks = path.join(decoded, 'smali', ...newDescriptor.split('/'));
  if (!fs.existsSync(oldCallbacks)) throw new Error(`找不到旧回调类目录：${oldCallbacks}`);
  fs.mkdirSync(path.dirname(newCallbacks), { recursive: true });
  fs.renameSync(oldCallbacks, newCallbacks);

  // 分享页已去掉钉钉入口，同时禁用其原生 SDK 初始化。旧 SDK 在部分
  // Android 冷启动时取不到 Activity，会直接导致启动崩溃。
  const dingDingFile = path.join(decoded, 'smali', 'com', 'yuanlai', 'dingding', 'DingDingHelper.smali');
  let dingDing = fs.readFileSync(dingDingFile, 'utf8');
  const dingDingInit = /\.method public init\(Ljava\/lang\/String;\)V[\s\S]*?\.end method/;
  if (!dingDingInit.test(dingDing)) throw new Error('找不到钉钉 SDK 初始化方法');
  dingDing = dingDing.replace(
    dingDingInit,
    '.method public init(Ljava/lang/String;)V\n    .locals 0\n\n    return-void\n.end method',
  );
  fs.writeFileSync(dingDingFile, dingDing);

  const utilsFile = path.join(decoded, 'smali', 'com', 'yuanlai', 'external', 'Utils.smali');
  let utils = fs.readFileSync(utilsFile, 'utf8');
  const deviceMethodMarker = '.method public static getExternalStoragePath()Ljava/lang/String;';
  if (!utils.includes(deviceMethodMarker)) throw new Error('找不到 Utils 原生方法插入位置');
  const deviceMethod = [
    '.method public static getGuestDeviceId()Ljava/lang/String;',
    '    .locals 2',
    '',
    '    invoke-static {}, Lorg/cocos2dx/lib/Cocos2dxActivity;->getContext()Landroid/content/Context;',
    '    move-result-object v0',
    '    if-eqz v0, :empty',
    '',
    '    invoke-virtual {v0}, Landroid/content/Context;->getContentResolver()Landroid/content/ContentResolver;',
    '    move-result-object v0',
    '    const-string v1, "android_id"',
    '    invoke-static {v0, v1}, Landroid/provider/Settings$Secure;->getString(Landroid/content/ContentResolver;Ljava/lang/String;)Ljava/lang/String;',
    '    move-result-object v0',
    '    if-nez v0, :done',
    '',
    '    :empty',
    '    const-string v0, ""',
    '',
    '    :done',
    '    return-object v0',
    '.end method',
    '',
  ].join('\n');
  utils = utils.replace(deviceMethodMarker, `${deviceMethod}${deviceMethodMarker}`);
  fs.writeFileSync(utilsFile, utils);

  const iconSizes = { ldpi: 36, mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  if (!fs.existsSync(ICON_SOURCE)) throw new Error(`缺少应用图标源文件：${ICON_SOURCE}`);
  for (const [density, pixels] of Object.entries(iconSizes)) {
    const target = path.join(decoded, 'res', `mipmap-${density}`, 'ic_launcher.png');
    run('sips', ['-z', String(pixels), String(pixels), ICON_SOURCE, '--out', target]);
  }
  if (!fs.existsSync(LOGIN_LOGO_SOURCE)) throw new Error(`缺少登录标题图：${LOGIN_LOGO_SOURCE}`);
  if (!fs.existsSync(LOGIN_BACKGROUND_SOURCE)) throw new Error(`缺少登录背景图：${LOGIN_BACKGROUND_SOURCE}`);
  if (!fs.existsSync(HALL_BACKGROUND_SOURCE)) throw new Error(`缺少大厅背景图：${HALL_BACKGROUND_SOURCE}`);
  if (!fs.existsSync(HALL_CHARACTER_SOURCE)) throw new Error(`缺少大厅人物图：${HALL_CHARACTER_SOURCE}`);
  if (!fs.existsSync(CLUB_BACKGROUND_SOURCE)) throw new Error(`缺少俱乐部背景图：${CLUB_BACKGROUND_SOURCE}`);
  if (!fs.existsSync(CLUB_CHARACTER_SOURCE)) throw new Error(`缺少俱乐部人物占位图：${CLUB_CHARACTER_SOURCE}`);
  if (!fs.existsSync(TABLE_BACKGROUND_2D_SOURCE)) throw new Error(`缺少 2D 牌桌背景图：${TABLE_BACKGROUND_2D_SOURCE}`);
  if (!fs.existsSync(TABLE_BACKGROUND_3D_SOURCE)) throw new Error(`缺少 3D 牌桌背景图：${TABLE_BACKGROUND_3D_SOURCE}`);
  if (!fs.existsSync(SPLASH_SOURCE)) throw new Error(`缺少启动画面：${SPLASH_SOURCE}`);
  const loginLogoTarget = path.join(decoded, 'assets', 'branding', 'login-logo.png');
  fs.mkdirSync(path.dirname(loginLogoTarget), { recursive: true });
  fs.copyFileSync(LOGIN_LOGO_SOURCE, loginLogoTarget);
  fs.copyFileSync(
    LOGIN_BACKGROUND_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '73', '73c931dd-4abb-4c4c-ab86-37f883c44430.jpg'),
  );
  writeEncryptedAsset(
    HALL_BACKGROUND_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '2d', '2dad1db8-b44a-4077-a9fa-52cbfe497b4d.png'),
  );
  writeEncryptedAsset(
    HALL_CHARACTER_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '1b', '1b6b9d70-3f53-4064-801d-f7fb08c52ba3.png'),
  );
  writeEncryptedAsset(
    CLUB_BACKGROUND_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '7f', '7fd7e41f-bc15-43c0-9ccf-9f255336b48f.png'),
  );
  writeEncryptedAsset(
    CLUB_CHARACTER_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '89', '896e3506-6fa6-4a3c-864b-f632f44c2f96.png'),
  );
  writeEncryptedAsset(
    TABLE_BACKGROUND_2D_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '65', '6528fb79-db94-4c58-88e8-ff1b0a184491.jpg'),
  );
  writeEncryptedAsset(
    TABLE_BACKGROUND_3D_SOURCE,
    path.join(decoded, 'assets', 'res', 'raw-assets', '0e', '0ed69516-3023-4cb0-947a-abd9aab04b9f.jpg'),
  );
  sanitizeCocosText(decoded);
  replaceLegacyArtwork(decoded);
  disableLegacyHotUpdate(decoded);
  fs.copyFileSync(SPLASH_SOURCE, path.join(decoded, 'res', 'mipmap', 'splash_screen.png'));
  console.log(`      包名 ${ORIGINAL_PACKAGE} -> ${APP_PACKAGE}`);
  console.log(`      应用名称 -> ${APP_NAME}`);
  console.log('      Android 版本 -> 1.0.5，资源版本 -> R234');
  console.log('      已替换各分辨率应用图标');
  console.log('      已替换登录标题、登录背景和启动画面');
  console.log('      已替换大厅背景和卡通人物');
  console.log('      已替换创建俱乐部页面背景和人物');
  console.log('      已替换 2D / 3D 牌桌背景花纹');
  console.log('      已移除用户可见的旧品牌名称、公告和客服信息');
  console.log('      协议页面已改为待补充真实运营主体的内部测试提示');
  console.log('      已禁用不再使用的钉钉 SDK 启动初始化');
  console.log('      已加入游客设备标识原生接口');
};

const writeMeta = (xml, name, value) => {
  if (!value) return xml;
  const pattern = new RegExp(`(<meta-data android:name="${name}" android:value=")[^"]*("\\/>)`);
  const out = xml.replace(pattern, `$1${value}$2`);
  if (!out.includes(`android:name="${name}" android:value="${value}"`)) {
    throw new Error(`没改到 ${name}`);
  }
  return out;
};

const writeVoiceMeta = (xml, appid, appkey, httpBase) => {
  let out = writeMeta(xml, 'SDK_VOICE_APPID', appid);
  out = writeMeta(out, 'SDK_VOICE_APPKEY', appkey);
  if (httpBase) {
    if (out.includes('android:name="SDK_VOICE_HTTP"')) {
      out = out.replace(
        /(<meta-data android:name="SDK_VOICE_HTTP" android:value=")[^"]*("\/>)/,
        `$1${httpBase}$2`
      );
    } else {
      out = out.replace(
        /(<meta-data android:name="SDK_VOICE_APPKEY" android:value="[^"]*"\/>)/,
        `$1\n        <meta-data android:name="SDK_VOICE_HTTP" android:value="${httpBase}"/>`
      );
    }
  }
  if (httpBase && !out.includes(`android:name="SDK_VOICE_HTTP" android:value="${httpBase}"`)) {
    throw new Error('没改到 SDK_VOICE_HTTP');
  }
  return out;
};

/** SDK 配置写入清单；启用 GME 时一并替换 Java 桥和 .so。密钥不打日志。 */
const injectNativeConfig = (apkPath, { voiceAppid, voiceAppkey, wechatAppid }) => {
  const withVoice = !!(voiceAppid && voiceAppkey);
  if (!fs.existsSync(APKTOOL)) {
    throw new Error(`没有可用的 apktool，无法写入原生 SDK 配置（APKTOOL=${APKTOOL}）`);
  }
  if (withVoice && !fs.existsSync(ANDROID_JAR)) {
    throw new Error(`没有 android.jar：${ANDROID_JAR}`);
  }
  const compiled = withVoice ? compileGmeVoiceSmali() : null;
  const decoded = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-nativeapk-'));
  const built = `${apkPath}.native.apk`;
  try {
    runApktool(['d', '-f', apkPath, '-o', decoded]);
    applyBranding(decoded);
    const mf = path.join(decoded, 'AndroidManifest.xml');
    let manifest = fs.readFileSync(mf, 'utf8');
    if (wechatAppid) {
      manifest = writeMeta(manifest, 'SDK_WX_APPID', wechatAppid);
      console.log('      已写入自己的微信 AppID');
    }
    if (withVoice) {
      manifest = writeVoiceMeta(manifest, voiceAppid, voiceAppkey, http);
      console.log('      已写入自己的 GME AppID');
    }
    fs.writeFileSync(mf, manifest);

    if (withVoice) {
      for (const name of fs.readdirSync(path.join(decoded, 'smali/com/yuanlai/external'))) {
        if (name.startsWith('Voice')) rmIf(path.join(decoded, 'smali/com/yuanlai/external', name));
      }
      copyDir(compiled.smali, path.join(decoded, 'smali_classes2'));
      console.log('      已换上 GME Java 桥');

      for (const abi of ['arm64-v8a', 'armeabi-v7a']) {
        const lib = path.join(decoded, 'lib', abi);
        if (!fs.existsSync(lib)) continue;
        rmIf(path.join(lib, 'libGCloudVoice.so'));
        rmIf(path.join(lib, 'libGvoiceNN.so'));
        for (const so of ['libgmesdk.so', 'libgmefdkaac.so']) {
          const src = path.join(GME_DIR, 'libs', abi, so);
          if (fs.existsSync(src)) fs.copyFileSync(src, path.join(lib, so));
        }
      }
      rmIf(path.join(decoded, 'assets/GCloudVoice'));
      console.log('      已换上 GME .so，去掉旧 GCloudVoice');
    }

    runApktool(['b', decoded, '-o', built]);
    fs.copyFileSync(built, apkPath);
  } finally {
    if (compiled) fs.rmSync(compiled.work, { recursive: true, force: true });
    fs.rmSync(decoded, { recursive: true, force: true });
    try { fs.unlinkSync(built); } catch { /* */ }
  }
};

const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-patch-'));
const rel = 'assets/src/project.jsc';

console.log('1/6 取出 project.jsc');
run('unzip', ['-q', '-o', APK, rel, '-d', stage]);

console.log('2/6 解密并替换地址');
let js = toJs(fs.readFileSync(path.join(stage, rel))).toString('binary');
for (const [from, to, required] of RULES) {
  const n = js.split(from).length - 1;
  if (required && n !== 1) {
    throw new Error(`必要的客户端界面补丁匹配到 ${n} 处，预期 1 处：${from}`);
  }
  if (n) console.log(`      ${from} -> ${to}  (${n} 处)`);
  js = js.split(from).join(to);
}
js = js.replace(/https?:\/\/192\.168\.\d+\.\d+:8899/g, (m) => (m === http ? m : http));
js = js.replace(/wss?:\/\/192\.168\.\d+\.\d+:8899/g, (m) => (m === ws ? m : ws));
if (js.includes('10.0.2.2')) {
  throw new Error('jsc 里还留着 10.0.2.2，真机连不上');
}
if (/yuanlai(?:huyu|qipai)\.(?:com|cn|net)/i.test(js)) {
  throw new Error('jsc 里还留着原公司的服务器地址');
}
if (js.includes(u2b('元来'))) {
  throw new Error('jsc 里还留着用户可见的旧品牌名称');
}
if (!js.includes(http)) {
  throw new Error(`jsc 里没有写进局域网地址 ${http}`);
}
// iOS JavaScriptCore 会拒绝加载含非 UTF-8 字节的整个脚本。在这里提前
// 校验，也防止后续新增中文规则时忘记通过 u2b 转成 UTF-8 字节。
new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(js, 'binary'));
console.log(`      已写入 ${http}  (${js.split(http).length - 1} 处)`);
fs.writeFileSync(path.join(stage, rel), toJsc(Buffer.from(js, 'binary')));

console.log('3/6 复制并替换 APK 内的条目');
const out = path.resolve(OUT);
fs.copyFileSync(APK, out);
run('zip', ['-q', '-0', '-X', out, rel], stage);

console.log('3b/6 写入包名、应用名称、图标及原生 SDK 配置');
injectNativeConfig(out, {
  voiceAppid: VOICE_APPID,
  voiceAppkey: VOICE_APPKEY,
  wechatAppid: WECHAT_APPID,
});

console.log('4/6 删掉旧签名');
// v1 的三个文件留着会和新签名打架；v2 的签名块 zipalign 会一并丢弃
try {
  run('zip', ['-q', '-d', out, 'META-INF/MANIFEST.MF', 'META-INF/*.SF', 'META-INF/*.RSA', 'META-INF/*.DSA', 'META-INF/*.EC']);
} catch {
  /* 没有就算了 */
}

console.log('5/6 zipalign');
// -p 让 .so 按页对齐（不加的话 extractNativeLibs=false 的包装不上）
const aligned = `${out}.aligned`;
run(tool('zipalign'), ['-p', '-f', '4', out, aligned]);
fs.renameSync(aligned, out);

console.log('6/6 签名');
if (!fs.existsSync(KEYSTORE)) {
  if (WECHAT_APPID) {
    throw new Error(`微信登录已配置，但签名库不存在：${KEYSTORE}。不能自动生成新签名，否则会与微信开放平台登记值不一致`);
  }
  run('keytool', ['-genkeypair', '-keystore', KEYSTORE, '-storepass', STOREPASS, '-keypass', STOREPASS,
    '-alias', KEY_ALIAS, '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-dname', `CN=${KEY_ALIAS}`]);
  console.log(`      新建签名库 ${KEYSTORE}`);
}
run(tool('apksigner'), ['sign', '--ks', KEYSTORE, '--ks-pass', `pass:${STOREPASS}`, '--ks-key-alias', KEY_ALIAS, out]);
const certInfo = run(tool('apksigner'), ['verify', '--print-certs', out]);
console.log(certInfo.split('\n').find((line) => line.includes('certificate DN')) || '签名已验证');
console.log(certInfo.split('\n').find((line) => line.includes('MD5 digest')) || '');

fs.rmSync(stage, { recursive: true, force: true });
console.log(`\n完成：${out}  ${(fs.statSync(out).size / 1048576).toFixed(0)} MB`);
console.log('装之前要先卸载原版——签名不同，覆盖装不上。');
