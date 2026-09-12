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
const APK = arg('apk');
const HOST = arg('host');
const TLS = argv.includes('--tls');
const OUT = arg('out', APK && APK.replace(/\.apk$/, '-patched.apk'));
const SDK = process.env.ANDROID_SDK_ROOT || '/opt/homebrew/share/android-commandlinetools';
const KEYSTORE = arg('keystore', path.join(os.homedir(), '.android-qjqp.keystore'));
const STOREPASS = 'qjqp123456';

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

// 按住说话：别再走腾讯 GCloud 上传。本地仍用 GCloud 录音/播放，
// 文件进出改成我们的 /voice。录音在 files/__gv_recording_data__。
RULES.push([
  'e.prototype.uploadRecordedFile = function(e) {\nvar t = n.default.platform;\nr.ePlatformType.android === t || r.ePlatformType.iOS === t ? i.default.voice.invoke("uploadRecordedFile", null, function(t, o) {\ne && e(t, o);\n}) : e && e(r.eExCallBackMsg.fail);\n};',
  'e.prototype.uploadRecordedFile = function(e) {\nvar t = n.default.gameBaseUrl() + "/voice", o = (jsb.fileUtils.getWritablePath() || "") + "__gv_recording_data__";\nif (!jsb.fileUtils.isFileExist(o)) {\ne && e(r.eExCallBackMsg.fail);\nreturn;\n}\nvar a = jsb.fileUtils.getDataFromFile(o);\nif (!a || !a.length) {\ne && e(r.eExCallBackMsg.fail);\nreturn;\n}\nvar s = new XMLHttpRequest();\ns.timeout = 1e4;\ns.onreadystatechange = function() {\nif (4 == s.readyState) {\nif (200 == s.status) try {\nvar t = JSON.parse(s.responseText);\nt && t.id ? e && e(r.eExCallBackMsg.success, t.id) : e && e(r.eExCallBackMsg.fail);\n} catch (o) {\ne && e(r.eExCallBackMsg.fail);\n} else e && e(r.eExCallBackMsg.fail);\n}\n};\ns.onerror = function() {\ne && e(r.eExCallBackMsg.fail);\n};\ns.ontimeout = function() {\ne && e(r.eExCallBackMsg.fail);\n};\ns.open("POST", t, !0);\ns.setRequestHeader("Content-Type", "application/octet-stream");\ns.send(a.buffer ? a.buffer : a);\n};',
]);
RULES.push([
  'e.prototype.downloadRecordedFile = function(e, t) {\nvar o = n.default.platform;\nif (r.ePlatformType.android === o || r.ePlatformType.iOS === o) i.default.voice.invoke("downloadRecordedFile", e, function(e, o) {\nt && t(e, o);\n}); else t && t(r.eExCallBackMsg.fail);\n};',
  'e.prototype.downloadRecordedFile = function(e, t) {\nvar o = n.default.gameBaseUrl() + "/voice/" + encodeURIComponent(e), i = (jsb.fileUtils.getWritablePath() || "") + "__gv_download_dat__", a = new XMLHttpRequest();\na.timeout = 1e4;\na.responseType = "arraybuffer";\na.onreadystatechange = function() {\nif (4 == a.readyState) {\nif (200 == a.status && a.response) {\nvar e = new Uint8Array(a.response);\njsb.fileUtils.writeDataToFile(e, i) ? t && t(r.eExCallBackMsg.success) : t && t(r.eExCallBackMsg.fail);\n} else t && t(r.eExCallBackMsg.fail);\n}\n};\na.onerror = function() {\nt && t(r.eExCallBackMsg.fail);\n};\na.ontimeout = function() {\nt && t(r.eExCallBackMsg.fail);\n};\na.open("GET", o, !0);\na.send();\n};',
]);

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const tool = (name) => {
  const dir = path.join(SDK, 'build-tools');
  const ver = fs.readdirSync(dir).sort().pop();
  return path.join(dir, ver, name);
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
