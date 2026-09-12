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
  u2b('t.prototype.start = function() {\nvar e = this, n = function() {\ne.inviteTipLabel.string = "绑定推荐人邀请码，双方各得" + l.default.inviteCodeAward + "张房卡哦！";\nvar o = e.inactiveNode && e.inactiveNode.getChildByName("LabelName"), a = o && o.getComponent(cc.Label);\nif (a) {\na.fontSize = 36;\na.lineHeight = 40;\na.string = "我的邀请码 " + (l.default.myInviteCode || "");\n}\n};\nl.default.myInviteCode ? n() : c.default.getInviteCode(function() { n(); }, !1);\n};'),
]);
RULES.push([
  u2b('this.inviteCodeLabel.string = "邀请码：" + a.default.inviteCode;'),
  u2b('this.inviteCodeLabel.string = "我的邀请码：" + (a.default.myInviteCode || "");'),
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
