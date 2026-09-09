/** Minimal XXTEA (Ma Bingyao variant, as used by cocos2d-x jsb) decrypt. */
const DELTA = 0x9e3779b9;

function toUint32Array(buf, includeLength) {
  const length = buf.length;
  let n = length >> 2;
  if ((length & 3) !== 0) n++;
  let v;
  if (includeLength) {
    v = new Uint32Array(n + 1);
    v[n] = length;
  } else {
    v = new Uint32Array(n);
  }
  for (let i = 0; i < length; i++) v[i >> 2] |= buf[i] << ((i & 3) << 3);
  return v;
}

function toUint8Array(v, includeLength) {
  let length = v.length << 2;
  if (includeLength) {
    const m = v[v.length - 1];
    length -= 4;
    if (m < length - 3 || m > length) return null;
    length = m;
  }
  const buf = Buffer.alloc(length);
  for (let i = 0; i < length; i++) buf[i] = (v[i >> 2] >>> ((i & 3) << 3)) & 0xff;
  return buf;
}

function fixKey(key) {
  if (key.length === 16) return key;
  const fixed = Buffer.alloc(16);
  key.copy(fixed, 0, 0, Math.min(16, key.length));
  return fixed;
}

function mx(sum, y, z, p, e, k) {
  return (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^ ((sum ^ y) + (k[(p & 3) ^ e] ^ z));
}

function decryptUint32Array(v, k) {
  const length = v.length;
  const n = length - 1;
  let y = v[0];
  let z;
  let sum = (Math.floor(6 + 52 / length) * DELTA) >>> 0;
  while (sum !== 0) {
    const e = (sum >>> 2) & 3;
    let p;
    for (p = n; p > 0; p--) {
      z = v[p - 1];
      v[p] = (v[p] - mx(sum, y, z, p, e, k)) >>> 0;
      y = v[p];
    }
    z = v[n];
    v[0] = (v[0] - mx(sum, y, z, 0, e, k)) >>> 0;
    y = v[0];
    sum = (sum - DELTA) >>> 0;
  }
  return v;
}

function decrypt(data, key) {
  if (data.length === 0) return data;
  const k = toUint32Array(fixKey(Buffer.isBuffer(key) ? key : Buffer.from(key, 'utf8')), false);
  return toUint8Array(decryptUint32Array(toUint32Array(data, false), k), true);
}

module.exports = { decrypt };
