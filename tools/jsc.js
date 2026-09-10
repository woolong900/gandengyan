/**
 * Cocos `assets/src/*.jsc` 的编解码：**gzip + xxtea**。
 *
 * 密钥写死在 APK 的 `lib/arm64-v8a/libcocos2djs.so` 里，`strings` 就能看到，
 * 挨着 AppDelegate 的 'Cocos Game' 启动串。
 *
 * xxtea 把数据按小端 uint32 切，末尾补一个字记原始长度，所以密文长度恒为
 * `(ceil(len/4) + 1) * 4`。encrypt 和 decrypt 是严格互逆的——`encryptjsc.js --selftest`
 * 会拿原始 jsc 对拍，逐字节相同才算过。
 */
const zlib = require('zlib');

const KEY = process.env.JSC_KEY || 'bd51835d-27d3-47';
const DELTA = 0x9e3779b9;

/** 密钥补齐到 16 字节，切成 4 个小端字 */
function keyWords(key) {
  const kb = Buffer.alloc(16);
  Buffer.from(key, 'binary').copy(kb, 0, 0, Math.min(16, key.length));
  return [0, 1, 2, 3].map((i) => kb.readUInt32LE(i * 4));
}

function encrypt(data, key = KEY) {
  const n = ((data.length + 3) >> 2) + 1;
  const v = new Uint32Array(n);
  for (let i = 0; i < data.length; i++) v[i >> 2] |= data[i] << ((i & 3) * 8);
  v[n - 1] = data.length;

  const k = keyWords(key);
  let rounds = 6 + Math.floor(52 / n);
  let sum = 0;
  let z = v[n - 1];
  const mx = (y, p, e) =>
    ((((z >>> 5) ^ ((y << 2) >>> 0)) + ((y >>> 3) ^ ((z << 4) >>> 0))) ^ (((sum ^ y) >>> 0) + ((k[(p & 3) ^ e] ^ z) >>> 0))) >>> 0;
  while (rounds-- > 0) {
    sum = (sum + DELTA) >>> 0;
    const e = (sum >>> 2) & 3;
    for (let p = 0; p < n - 1; p++) z = v[p] = (v[p] + mx(v[p + 1], p, e)) >>> 0;
    z = v[n - 1] = (v[n - 1] + mx(v[0], n - 1, e)) >>> 0;
  }

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) out.writeUInt32LE(v[i], i * 4);
  return out;
}

function decrypt(data, key = KEY) {
  const n = data.length >> 2;
  if (n < 2) return null;
  const v = new Uint32Array(n);
  for (let i = 0; i < n; i++) v[i] = data.readUInt32LE(i * 4);

  const k = keyWords(key);
  let rounds = 6 + Math.floor(52 / n);
  let sum = (rounds * DELTA) >>> 0;
  let y = v[0];
  const mx = (z, p, e) =>
    ((((z >>> 5) ^ ((y << 2) >>> 0)) + ((y >>> 3) ^ ((z << 4) >>> 0))) ^ (((sum ^ y) >>> 0) + ((k[(p & 3) ^ e] ^ z) >>> 0))) >>> 0;
  while (rounds-- > 0) {
    const e = (sum >>> 2) & 3;
    for (let p = n - 1; p > 0; p--) y = v[p] = (v[p] - mx(v[p - 1], p, e)) >>> 0;
    y = v[0] = (v[0] - mx(v[n - 1], 0, e)) >>> 0;
    sum = (sum - DELTA) >>> 0;
  }

  const len = v[n - 1];
  if (len > (n - 1) * 4 || len < (n - 1) * 4 - 3) return null; // 长度字不合理 = 密钥不对
  const out = Buffer.alloc((n - 1) * 4);
  for (let i = 0; i < n - 1; i++) out.writeUInt32LE(v[i], i * 4);
  return out.subarray(0, len);
}

/** jsc -> 明文 JS。有的包不压缩，看 gzip magic 决定要不要解压 */
function toJs(jsc, key = KEY) {
  const plain = decrypt(jsc, key);
  if (!plain) return null;
  return plain[0] === 0x1f && plain[1] === 0x8b ? zlib.gunzipSync(plain) : plain;
}

/** JS -> jsc。压缩参数不必和原包一致，客户端只管 gunzip */
function toJsc(js, key = KEY) {
  return encrypt(zlib.gzipSync(js, { level: 9 }), key);
}

module.exports = { KEY, encrypt, decrypt, toJs, toJsc };
