#!/usr/bin/env node
/**
 * Decrypts the reference APK's compiled scripts.
 *
 * Format: XXTEA(key) + gzip. The key is compiled into libcocos2djs.so and was
 * recovered by locating the ADRP/ADD pair feeding the jsb_set_xxtea_key call
 * (see tools/find_key.py).
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { decrypt } = require('./xxtea');

const KEY = 'bd51835d-27d3-47';
const SRC = process.argv[2] || '/tmp/qjqp/extracted/assets/src';
const OUT = process.argv[3] || '/tmp/qjqp/out/src';

fs.mkdirSync(OUT, { recursive: true });
for (const file of fs.readdirSync(SRC)) {
  if (!file.endsWith('.jsc')) continue;
  const buf = fs.readFileSync(path.join(SRC, file));
  const dec = decrypt(buf, KEY);
  if (!dec) {
    console.log(`${file}: decrypt failed`);
    continue;
  }
  let js;
  try {
    js = zlib.gunzipSync(dec);
  } catch {
    js = dec;
  }
  const out = path.join(OUT, file.replace(/\.jsc$/, '.js'));
  fs.writeFileSync(out, js);
  console.log(`${file} -> ${out} (${js.length} bytes)`);
}
