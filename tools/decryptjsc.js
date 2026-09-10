#!/usr/bin/env node
/**
 * 解开 APK 里的 Cocos 脚本（`assets/src/*.jsc`）。
 *
 * 解出来的 project.js 是**权威**：预制体只给槽位，脚本才说清哪些槽位真的用、怎么用。
 *
 * usage: node tools/decryptjsc.js [<jsc 目录> [<输出目录>]]
 */
const fs = require('fs');
const path = require('path');
const { KEY, toJs } = require('./jsc');

const SRC = process.argv[2] || '/tmp/qjqp/extracted/assets/src';
const OUT = process.argv[3] || '/tmp/qjqp/out/js';

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jsc'));
if (!files.length) {
  console.error(`${SRC} 下没有 .jsc`);
  process.exit(1);
}

for (const f of files) {
  const js = toJs(fs.readFileSync(path.join(SRC, f)));
  if (!js) {
    console.error(`${f}: 解密失败，密钥不对？（现用 ${KEY}）`);
    continue;
  }
  const dst = path.join(OUT, f.replace(/\.jsc$/, '.js'));
  fs.writeFileSync(dst, js);
  console.log(`${dst}  ${js.length} 字节`);
}
