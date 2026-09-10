#!/usr/bin/env node
/**
 * 解开 APK 里的 Cocos 脚本（`assets/src/*.jsc`）。
 *
 * 这些是 xxtea 加密 + gzip 的打包 JS。密钥写死在 libcocos2djs.so 的
 * AppDelegate 启动串附近（`strings` 能直接看到，挨着 'Cocos Game'）。
 * 解出来的 project.js 是**权威**：预制体只给槽位，脚本才说清哪些槽位真的用、怎么用
 * ——比如牌河的 `_outIndex` 一排只放 7 张、自家/对家取 13 槽里居中的 7 个。
 *
 * usage: node tools/decryptjsc.js [<jsc 目录> [<输出目录>]]
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SRC = process.argv[2] || '/tmp/qjqp/extracted/assets/src';
const OUT = process.argv[3] || '/tmp/qjqp/out/js';
const KEY = process.env.JSC_KEY || 'bd51835d-27d3-47';

const DELTA = 0x9e3779b9;
const M = 0xffffffff;

/** xxtea 解密。data/key 都按小端 uint32 切，长度存在最后一个字 */
function xxteaDecrypt(data, key) {
  const n = data.length >> 2;
  if (n < 2) return null;
  const v = new Uint32Array(n);
  for (let i = 0; i < n; i++) v[i] = data.readUInt32LE(i * 4);
  const kb = Buffer.alloc(16);
  Buffer.from(key, 'binary').copy(kb, 0, 0, Math.min(16, key.length));
  const k = [0, 1, 2, 3].map((i) => kb.readUInt32LE(i * 4));

  let rounds = 6 + Math.floor(52 / n);
  let sum = (rounds * DELTA) >>> 0;
  let y = v[0];
  const mx = (z, p, e) =>
    ((((z >>> 5) ^ ((y << 2) >>> 0)) + ((y >>> 3) ^ ((z << 4) >>> 0))) ^ (((sum ^ y) >>> 0) + ((k[(p & 3) ^ e] ^ z) >>> 0))) >>> 0;
  while (rounds-- > 0) {
    const e = (sum >>> 2) & 3;
    for (let p = n - 1; p > 0; p--) {
      y = v[p] = (v[p] - mx(v[p - 1], p, e)) >>> 0;
    }
    y = v[0] = (v[0] - mx(v[n - 1], 0, e)) >>> 0;
    sum = (sum - DELTA) >>> 0;
  }

  const len = v[n - 1];
  if (len > (n - 1) * 4 || len < (n - 1) * 4 - 3) return null;
  const out = Buffer.alloc((n - 1) * 4);
  for (let i = 0; i < n - 1; i++) out.writeUInt32LE(v[i], i * 4);
  return out.subarray(0, len);
}

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jsc'));
if (!files.length) {
  console.error(`${SRC} 下没有 .jsc`);
  process.exit(1);
}
for (const f of files) {
  const plain = xxteaDecrypt(fs.readFileSync(path.join(SRC, f)), KEY);
  if (!plain) {
    console.error(`${f}: 解密失败，密钥不对？（现用 ${KEY}）`);
    continue;
  }
  // gzip 开头 1f 8b；有的包不压缩
  const js = plain[0] === 0x1f && plain[1] === 0x8b ? zlib.gunzipSync(plain) : plain;
  const dst = path.join(OUT, f.replace(/\.jsc$/, '.js'));
  fs.writeFileSync(dst, js);
  console.log(`${dst}  ${js.length} 字节`);
}
