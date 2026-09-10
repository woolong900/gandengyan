#!/usr/bin/env node
/**
 * `decryptjsc.js` 的逆操作：把改好的 JS 打回 `.jsc`。
 *
 * 正确性靠往返验证：拿原始 jsc 解出来的**未解压**字节再加密一遍，必须和原始
 * jsc 逐字节相同。三个文件都过了，才敢拿去重打包。
 *
 * usage: node tools/encryptjsc.js <输入.js> <输出.jsc>
 *        node tools/encryptjsc.js --selftest <原始.jsc>
 */
const fs = require('fs');
const { KEY, encrypt, decrypt, toJsc } = require('./jsc');

if (process.argv[2] === '--selftest') {
  const orig = fs.readFileSync(process.argv[3]);
  const plain = decrypt(orig);
  if (!plain) {
    console.error(`解密失败，密钥不对？（现用 ${KEY}）`);
    process.exit(1);
  }
  const same = encrypt(plain).equals(orig);
  console.log(`明文 ${plain.length} 字节 -> ${same ? '重新加密与原文件逐字节相同 ✓' : '不一致 ✗'}`);
  process.exit(same ? 0 : 1);
}

const [, , src, dst] = process.argv;
if (!src || !dst) {
  console.error('usage: node tools/encryptjsc.js <输入.js> <输出.jsc>');
  process.exit(1);
}
fs.writeFileSync(dst, toJsc(fs.readFileSync(src)));
console.log(`${dst}  ${fs.statSync(dst).size} 字节`);
