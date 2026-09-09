/** Cocos Creator compressed-UUID decoding (22 chars -> canonical 36-char form). */
const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const VALUES = new Array(128).fill(0);
for (let i = 0; i < BASE64_KEYS.length; i++) VALUES[BASE64_KEYS.charCodeAt(i)] = i;
const HEX = '0123456789abcdef';

function decodeUuid(base64) {
  const short = String(base64).split('@')[0];
  if (short.length !== 22) return String(base64);
  let hex = short[0] + short[1];
  for (let i = 2; i < 22; i += 2) {
    const lhs = VALUES[short.charCodeAt(i)];
    const rhs = VALUES[short.charCodeAt(i + 1)];
    hex += HEX[lhs >> 2] + HEX[((lhs & 3) << 2) | (rhs >> 4)] + HEX[rhs & 0xf];
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

module.exports = { decodeUuid };
