// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5c421f/SSZEkrQhTXUyT8Dn", "md5");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {
this._state = new Int32Array(4);
this._buffer = new ArrayBuffer(68);
this._buffer8 = new Uint8Array(this._buffer, 0, 68);
this._buffer32 = new Uint32Array(this._buffer, 0, 17);
this.start();
}
e.hashStr = function(e, t) {
void 0 === t && (t = !1);
return this.onePassHasher.start().appendStr(e).end(t);
};
e.hashAsciiStr = function(e, t) {
void 0 === t && (t = !1);
return this.onePassHasher.start().appendAsciiStr(e).end(t);
};
e._hex = function(t) {
var o, n, r, i, a = e.hexChars, s = e.hexOut;
for (i = 0; i < 4; i += 1) {
n = 8 * i;
o = t[i];
for (r = 0; r < 8; r += 2) {
s[n + 1 + r] = a.charAt(15 & o);
o >>>= 4;
s[n + 0 + r] = a.charAt(15 & o);
o >>>= 4;
}
}
return s.join("");
};
e._md5cycle = function(e, t) {
var o = e[0], n = e[1], r = e[2], i = e[3];
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & r | ~n & i) + t[0] - 680876936 | 0) << 7 | o >>> 25) + n | 0) & n | ~o & r) + t[1] - 389564586 | 0) << 12 | i >>> 20) + o | 0) & o | ~i & n) + t[2] + 606105819 | 0) << 17 | r >>> 15) + i | 0) & i | ~r & o) + t[3] - 1044525330 | 0) << 22 | n >>> 10) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & r | ~n & i) + t[4] - 176418897 | 0) << 7 | o >>> 25) + n | 0) & n | ~o & r) + t[5] + 1200080426 | 0) << 12 | i >>> 20) + o | 0) & o | ~i & n) + t[6] - 1473231341 | 0) << 17 | r >>> 15) + i | 0) & i | ~r & o) + t[7] - 45705983 | 0) << 22 | n >>> 10) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & r | ~n & i) + t[8] + 1770035416 | 0) << 7 | o >>> 25) + n | 0) & n | ~o & r) + t[9] - 1958414417 | 0) << 12 | i >>> 20) + o | 0) & o | ~i & n) + t[10] - 42063 | 0) << 17 | r >>> 15) + i | 0) & i | ~r & o) + t[11] - 1990404162 | 0) << 22 | n >>> 10) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & r | ~n & i) + t[12] + 1804603682 | 0) << 7 | o >>> 25) + n | 0) & n | ~o & r) + t[13] - 40341101 | 0) << 12 | i >>> 20) + o | 0) & o | ~i & n) + t[14] - 1502002290 | 0) << 17 | r >>> 15) + i | 0) & i | ~r & o) + t[15] + 1236535329 | 0) << 22 | n >>> 10) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & i | r & ~i) + t[1] - 165796510 | 0) << 5 | o >>> 27) + n | 0) & r | n & ~r) + t[6] - 1069501632 | 0) << 9 | i >>> 23) + o | 0) & n | o & ~n) + t[11] + 643717713 | 0) << 14 | r >>> 18) + i | 0) & o | i & ~o) + t[0] - 373897302 | 0) << 20 | n >>> 12) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & i | r & ~i) + t[5] - 701558691 | 0) << 5 | o >>> 27) + n | 0) & r | n & ~r) + t[10] + 38016083 | 0) << 9 | i >>> 23) + o | 0) & n | o & ~n) + t[15] - 660478335 | 0) << 14 | r >>> 18) + i | 0) & o | i & ~o) + t[4] - 405537848 | 0) << 20 | n >>> 12) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & i | r & ~i) + t[9] + 568446438 | 0) << 5 | o >>> 27) + n | 0) & r | n & ~r) + t[14] - 1019803690 | 0) << 9 | i >>> 23) + o | 0) & n | o & ~n) + t[3] - 187363961 | 0) << 14 | r >>> 18) + i | 0) & o | i & ~o) + t[8] + 1163531501 | 0) << 20 | n >>> 12) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n & i | r & ~i) + t[13] - 1444681467 | 0) << 5 | o >>> 27) + n | 0) & r | n & ~r) + t[2] - 51403784 | 0) << 9 | i >>> 23) + o | 0) & n | o & ~n) + t[7] + 1735328473 | 0) << 14 | r >>> 18) + i | 0) & o | i & ~o) + t[12] - 1926607734 | 0) << 20 | n >>> 12) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n ^ r ^ i) + t[5] - 378558 | 0) << 4 | o >>> 28) + n | 0) ^ n ^ r) + t[8] - 2022574463 | 0) << 11 | i >>> 21) + o | 0) ^ o ^ n) + t[11] + 1839030562 | 0) << 16 | r >>> 16) + i | 0) ^ i ^ o) + t[14] - 35309556 | 0) << 23 | n >>> 9) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n ^ r ^ i) + t[1] - 1530992060 | 0) << 4 | o >>> 28) + n | 0) ^ n ^ r) + t[4] + 1272893353 | 0) << 11 | i >>> 21) + o | 0) ^ o ^ n) + t[7] - 155497632 | 0) << 16 | r >>> 16) + i | 0) ^ i ^ o) + t[10] - 1094730640 | 0) << 23 | n >>> 9) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n ^ r ^ i) + t[13] + 681279174 | 0) << 4 | o >>> 28) + n | 0) ^ n ^ r) + t[0] - 358537222 | 0) << 11 | i >>> 21) + o | 0) ^ o ^ n) + t[3] - 722521979 | 0) << 16 | r >>> 16) + i | 0) ^ i ^ o) + t[6] + 76029189 | 0) << 23 | n >>> 9) + r | 0;
n = ((n += ((r = ((r += ((i = ((i += ((o = ((o += (n ^ r ^ i) + t[9] - 640364487 | 0) << 4 | o >>> 28) + n | 0) ^ n ^ r) + t[12] - 421815835 | 0) << 11 | i >>> 21) + o | 0) ^ o ^ n) + t[15] + 530742520 | 0) << 16 | r >>> 16) + i | 0) ^ i ^ o) + t[2] - 995338651 | 0) << 23 | n >>> 9) + r | 0;
n = ((n += ((i = ((i += (n ^ ((o = ((o += (r ^ (n | ~i)) + t[0] - 198630844 | 0) << 6 | o >>> 26) + n | 0) | ~r)) + t[7] + 1126891415 | 0) << 10 | i >>> 22) + o | 0) ^ ((r = ((r += (o ^ (i | ~n)) + t[14] - 1416354905 | 0) << 15 | r >>> 17) + i | 0) | ~o)) + t[5] - 57434055 | 0) << 21 | n >>> 11) + r | 0;
n = ((n += ((i = ((i += (n ^ ((o = ((o += (r ^ (n | ~i)) + t[12] + 1700485571 | 0) << 6 | o >>> 26) + n | 0) | ~r)) + t[3] - 1894986606 | 0) << 10 | i >>> 22) + o | 0) ^ ((r = ((r += (o ^ (i | ~n)) + t[10] - 1051523 | 0) << 15 | r >>> 17) + i | 0) | ~o)) + t[1] - 2054922799 | 0) << 21 | n >>> 11) + r | 0;
n = ((n += ((i = ((i += (n ^ ((o = ((o += (r ^ (n | ~i)) + t[8] + 1873313359 | 0) << 6 | o >>> 26) + n | 0) | ~r)) + t[15] - 30611744 | 0) << 10 | i >>> 22) + o | 0) ^ ((r = ((r += (o ^ (i | ~n)) + t[6] - 1560198380 | 0) << 15 | r >>> 17) + i | 0) | ~o)) + t[13] + 1309151649 | 0) << 21 | n >>> 11) + r | 0;
n = ((n += ((i = ((i += (n ^ ((o = ((o += (r ^ (n | ~i)) + t[4] - 145523070 | 0) << 6 | o >>> 26) + n | 0) | ~r)) + t[11] - 1120210379 | 0) << 10 | i >>> 22) + o | 0) ^ ((r = ((r += (o ^ (i | ~n)) + t[2] + 718787259 | 0) << 15 | r >>> 17) + i | 0) | ~o)) + t[9] - 343485551 | 0) << 21 | n >>> 11) + r | 0;
e[0] = o + e[0] | 0;
e[1] = n + e[1] | 0;
e[2] = r + e[2] | 0;
e[3] = i + e[3] | 0;
};
e.prototype.start = function() {
this._dataLength = 0;
this._bufferLength = 0;
this._state.set(e.stateIdentity);
return this;
};
e.prototype.appendStr = function(t) {
var o, n, r = this._buffer8, i = this._buffer32, a = this._bufferLength;
for (n = 0; n < t.length; n += 1) {
if ((o = t.charCodeAt(n)) < 128) r[a++] = o; else if (o < 2048) {
r[a++] = 192 + (o >>> 6);
r[a++] = 63 & o | 128;
} else if (o < 55296 || o > 56319) {
r[a++] = 224 + (o >>> 12);
r[a++] = o >>> 6 & 63 | 128;
r[a++] = 63 & o | 128;
} else {
if ((o = 1024 * (o - 55296) + (t.charCodeAt(++n) - 56320) + 65536) > 1114111) throw new Error("Unicode standard supports code points up to U+10FFFF");
r[a++] = 240 + (o >>> 18);
r[a++] = o >>> 12 & 63 | 128;
r[a++] = o >>> 6 & 63 | 128;
r[a++] = 63 & o | 128;
}
if (a >= 64) {
this._dataLength += 64;
e._md5cycle(this._state, i);
a -= 64;
i[0] = i[16];
}
}
this._bufferLength = a;
return this;
};
e.prototype.appendAsciiStr = function(t) {
for (var o, n = this._buffer8, r = this._buffer32, i = this._bufferLength, a = 0; ;) {
o = Math.min(t.length - a, 64 - i);
for (;o--; ) n[i++] = t.charCodeAt(a++);
if (i < 64) break;
this._dataLength += 64;
e._md5cycle(this._state, r);
i = 0;
}
this._bufferLength = i;
return this;
};
e.prototype.appendByteArray = function(t) {
for (var o, n = this._buffer8, r = this._buffer32, i = this._bufferLength, a = 0; ;) {
o = Math.min(t.length - a, 64 - i);
for (;o--; ) n[i++] = t[a++];
if (i < 64) break;
this._dataLength += 64;
e._md5cycle(this._state, r);
i = 0;
}
this._bufferLength = i;
return this;
};
e.prototype.getState = function() {
var e = this._state;
return {
buffer: String.fromCharCode.apply(null, this._buffer8),
buflen: this._bufferLength,
length: this._dataLength,
state: [ e[0], e[1], e[2], e[3] ]
};
};
e.prototype.setState = function(e) {
var t, o = e.buffer, n = e.state, r = this._state;
this._dataLength = e.length;
this._bufferLength = e.buflen;
r[0] = n[0];
r[1] = n[1];
r[2] = n[2];
r[3] = n[3];
for (t = 0; t < o.length; t += 1) this._buffer8[t] = o.charCodeAt(t);
};
e.prototype.end = function(t) {
void 0 === t && (t = !1);
var o, n = this._bufferLength, r = this._buffer8, i = this._buffer32, a = 1 + (n >> 2);
this._dataLength += n;
r[n] = 128;
r[n + 1] = r[n + 2] = r[n + 3] = 0;
i.set(e.buffer32Identity.subarray(a), a);
if (n > 55) {
e._md5cycle(this._state, i);
i.set(e.buffer32Identity);
}
if ((o = 8 * this._dataLength) <= 4294967295) i[14] = o; else {
var s = o.toString(16).match(/(.*?)(.{0,8})$/);
if (null === s) return;
var l = parseInt(s[2], 16), c = parseInt(s[1], 16) || 0;
i[14] = l;
i[15] = c;
}
e._md5cycle(this._state, i);
return t ? this._state : e._hex(this._state);
};
e.stateIdentity = new Int32Array([ 1732584193, -271733879, -1732584194, 271733878 ]);
e.buffer32Identity = new Int32Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
e.hexChars = "0123456789abcdef";
e.hexOut = [];
e.onePassHasher = new e();
return e;
}();
o.Md5 = n;
"5d41402abc4b2a76b9719d911017c592" !== n.hashStr("hello") && console.error("Md5 self test failed.");
cc._RF.pop();
