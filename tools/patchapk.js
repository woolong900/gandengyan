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
 * 原生库从旧 GCloudVoice 换成 GME 2.9，按住说话仍走腾讯上传/下载（和原包一样）。
 *
 * usage: node tools/patchapk.js --apk <原始.apk> --host <主机[:端口]> [--tls] [--guest] [--out <输出.apk>]
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
    const m = line.match(/^(QJQP_VOICE_APPID|QJQP_VOICE_APPKEY)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
};
loadDotEnv();

const APK = arg('apk');
const HOST = arg('host');
const TLS = argv.includes('--tls');
const OUT = arg('out', APK && APK.replace(/\.apk$/, '-patched.apk'));
const SDK = process.env.ANDROID_SDK_ROOT || '/opt/homebrew/share/android-commandlinetools';
const KEYSTORE = arg('keystore', path.join(os.homedir(), '.android-qjqp.keystore'));
const STOREPASS = 'qjqp123456';
const VOICE_APPID = arg('voice-appid', process.env.QJQP_VOICE_APPID);
const VOICE_APPKEY = arg('voice-appkey', process.env.QJQP_VOICE_APPKEY);
const APKTOOL = process.env.APKTOOL || '/tmp/apktool.jar';
const GME_URL = process.env.GME_SDK_URL
  || 'https://dl.gmertc.com/gme/GME2.9.17/Android/GME_android_audio_sdk_2.9.17.9e947c95.zip';
const GME_DIR = process.env.GME_SDK || '/tmp/gme-sdk';
const ANDROID_JAR = process.env.ANDROID_JAR
  || path.join(SDK, 'platforms', 'android-34', 'android.jar');

if (!APK || !HOST) {
  console.error('usage: node tools/patchapk.js --apk <原始.apk> --host <主机[:端口]> [--tls] [--out <输出.apk>]');
  process.exit(1);
}

/** 中文规则要按 UTF-8 字节进 binary 串，否则 split 对不上 */
const u2b = (s) => Buffer.from(s, 'utf8').toString('binary');

const http = `${TLS ? 'https' : 'http'}://${HOST}`;
const ws = `${TLS ? 'wss' : 'ws'}://${HOST}`;
/** 长的先替换，否则裸域名会把带路径的那几条先吃掉 */
const RULES = [
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
// 临时：创房/大厅只露出潜江晃晃。要恢复就把这一段删掉。
RULES.push([
  'gameList: [ c.eGameIds.QJHH, c.eGameIds.QJHZ, c.eGameIds.PDKAA, c.eGameIds.DDZ, c.eGameIds.TMHH, c.eGameIds.QJSHZ, c.eGameIds.QJWSKBD ]',
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
RULES.push([
  u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 1 ],\ndetailIds: [ 1, 2, 26 ]'),
  u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 2 ],\ndetailIds: [ 1, 2, 26 ]'),
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

// 潜江晃晃的抢杠胡使用专用 qj_qgh 时播报错词，改用包内正确的抢杠胡语音。
RULES.push([
  u2b('r[16] = {\ndesc: "抢杠胡",\nweight: 90,\nanimation: "qiangganghu",\nsound: "qj_qgh",\nbHideGuo: !0\n}'),
  u2b('r[16] = {\ndesc: "抢杠胡",\nweight: 90,\nanimation: "qiangganghu",\nsound: "qiangganghu",\nbHideGuo: !0\n}'),
]);

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
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
  run('java', ['-jar', APKTOOL, 'd', '-f', '-o', smaliOut, miniApk]);
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

const writeVoiceMeta = (xml, appid, appkey) => {
  let out = xml.replace(
    /(<meta-data android:name="SDK_VOICE_APPID" android:value=")[^"]*("\/>)/,
    `$1${appid}$2`
  );
  out = out.replace(
    /(<meta-data android:name="SDK_VOICE_APPKEY" android:value=")[^"]*("\/>)/,
    `$1${appkey}$2`
  );
  if (!out.includes(`android:name="SDK_VOICE_APPID" android:value="${appid}"`)) {
    throw new Error('没改到 SDK_VOICE_APPID');
  }
  if (!out.includes(`android:name="SDK_VOICE_APPKEY" android:value="${appkey}"`)) {
    throw new Error('没改到 SDK_VOICE_APPKEY');
  }
  return out;
};

/** 凭证写入清单，Java 桥和 .so 换成 GME。密钥不打日志。 */
const injectGme = (apkPath, appid, appkey) => {
  if (!appid || !appkey) return;
  if (!fs.existsSync(APKTOOL)) {
    throw new Error('没有 apktool.jar，无法换 GME（APKTOOL=/tmp/apktool.jar）');
  }
  if (!fs.existsSync(ANDROID_JAR)) {
    throw new Error(`没有 android.jar：${ANDROID_JAR}`);
  }
  const compiled = compileGmeVoiceSmali();
  const decoded = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-gmeapk-'));
  const built = `${apkPath}.gme.apk`;
  try {
    run('java', ['-jar', APKTOOL, 'd', '-f', apkPath, '-o', decoded]);
    const mf = path.join(decoded, 'AndroidManifest.xml');
    fs.writeFileSync(mf, writeVoiceMeta(fs.readFileSync(mf, 'utf8'), appid, appkey));
    console.log('      已写入自己的 GME AppID');

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

    run('java', ['-jar', APKTOOL, 'b', decoded, '-o', built]);
    fs.copyFileSync(built, apkPath);
  } finally {
    fs.rmSync(compiled.work, { recursive: true, force: true });
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
for (const [from, to] of RULES) {
  const n = js.split(from).length - 1;
  if (n) console.log(`      ${from} -> ${to}  (${n} 处)`);
  js = js.split(from).join(to);
}
fs.writeFileSync(path.join(stage, rel), toJsc(Buffer.from(js, 'binary')));

console.log('3/6 复制并替换 APK 内的条目');
const out = path.resolve(OUT);
fs.copyFileSync(APK, out);
run('zip', ['-q', '-0', '-X', out, rel], stage);

if (VOICE_APPID && VOICE_APPKEY) {
  console.log('3b/6 换成 GME 并写入自己的 AppID');
  injectGme(out, VOICE_APPID, VOICE_APPKEY);
} else {
  console.log('3b/6 未提供 GME 凭证，语音仍用原厂 GCloudVoice');
}

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
  run('keytool', ['-genkeypair', '-keystore', KEYSTORE, '-storepass', STOREPASS, '-keypass', STOREPASS,
    '-alias', 'qjqp', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-dname', 'CN=qjqp']);
  console.log(`      新建签名库 ${KEYSTORE}`);
}
run(tool('apksigner'), ['sign', '--ks', KEYSTORE, '--ks-pass', `pass:${STOREPASS}`, '--ks-key-alias', 'qjqp', out]);
console.log(run(tool('apksigner'), ['verify', '--print-certs', out]).split('\n')[0] || '已验证');

fs.rmSync(stage, { recursive: true, force: true });
console.log(`\n完成：${out}  ${(fs.statSync(out).size / 1048576).toFixed(0)} MB`);
console.log('装之前要先卸载原版——签名不同，覆盖装不上。');
