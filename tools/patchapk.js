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
