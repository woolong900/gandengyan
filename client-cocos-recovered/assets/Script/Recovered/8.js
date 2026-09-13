// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = n(n);
function n(e) {
"undefined" != typeof Float32Array ? function() {
var t = new Float32Array([ -0 ]), o = new Uint8Array(t.buffer), n = 128 === o[3];
function r(e, n, r) {
t[0] = e;
n[r] = o[0];
n[r + 1] = o[1];
n[r + 2] = o[2];
n[r + 3] = o[3];
}
function i(e, n, r) {
t[0] = e;
n[r] = o[3];
n[r + 1] = o[2];
n[r + 2] = o[1];
n[r + 3] = o[0];
}
e.writeFloatLE = n ? r : i;
e.writeFloatBE = n ? i : r;
function a(e, n) {
o[0] = e[n];
o[1] = e[n + 1];
o[2] = e[n + 2];
o[3] = e[n + 3];
return t[0];
}
function s(e, n) {
o[3] = e[n];
o[2] = e[n + 1];
o[1] = e[n + 2];
o[0] = e[n + 3];
return t[0];
}
e.readFloatLE = n ? a : s;
e.readFloatBE = n ? s : a;
}() : function() {
function t(e, t, o, n) {
var r = t < 0 ? 1 : 0;
r && (t = -t);
if (0 === t) e(1 / t > 0 ? 0 : 2147483648, o, n); else if (isNaN(t)) e(2143289344, o, n); else if (t > 3.4028234663852886e38) e((r << 31 | 2139095040) >>> 0, o, n); else if (t < 1.1754943508222875e-38) e((r << 31 | Math.round(t / 1.401298464324817e-45)) >>> 0, o, n); else {
var i = Math.floor(Math.log(t) / Math.LN2);
e((r << 31 | i + 127 << 23 | 8388607 & Math.round(t * Math.pow(2, -i) * 8388608)) >>> 0, o, n);
}
}
e.writeFloatLE = t.bind(null, r);
e.writeFloatBE = t.bind(null, i);
function o(e, t, o) {
var n = e(t, o), r = 2 * (n >> 31) + 1, i = n >>> 23 & 255, a = 8388607 & n;
return 255 === i ? a ? NaN : Infinity * r : 0 === i ? 1.401298464324817e-45 * r * a : r * Math.pow(2, i - 150) * (a + 8388608);
}
e.readFloatLE = o.bind(null, a);
e.readFloatBE = o.bind(null, s);
}();
"undefined" != typeof Float64Array ? function() {
var t = new Float64Array([ -0 ]), o = new Uint8Array(t.buffer), n = 128 === o[7];
function r(e, n, r) {
t[0] = e;
n[r] = o[0];
n[r + 1] = o[1];
n[r + 2] = o[2];
n[r + 3] = o[3];
n[r + 4] = o[4];
n[r + 5] = o[5];
n[r + 6] = o[6];
n[r + 7] = o[7];
}
function i(e, n, r) {
t[0] = e;
n[r] = o[7];
n[r + 1] = o[6];
n[r + 2] = o[5];
n[r + 3] = o[4];
n[r + 4] = o[3];
n[r + 5] = o[2];
n[r + 6] = o[1];
n[r + 7] = o[0];
}
e.writeDoubleLE = n ? r : i;
e.writeDoubleBE = n ? i : r;
function a(e, n) {
o[0] = e[n];
o[1] = e[n + 1];
o[2] = e[n + 2];
o[3] = e[n + 3];
o[4] = e[n + 4];
o[5] = e[n + 5];
o[6] = e[n + 6];
o[7] = e[n + 7];
return t[0];
}
function s(e, n) {
o[7] = e[n];
o[6] = e[n + 1];
o[5] = e[n + 2];
o[4] = e[n + 3];
o[3] = e[n + 4];
o[2] = e[n + 5];
o[1] = e[n + 6];
o[0] = e[n + 7];
return t[0];
}
e.readDoubleLE = n ? a : s;
e.readDoubleBE = n ? s : a;
}() : function() {
function t(e, t, o, n, r, i) {
var a = n < 0 ? 1 : 0;
a && (n = -n);
if (0 === n) {
e(0, r, i + t);
e(1 / n > 0 ? 0 : 2147483648, r, i + o);
} else if (isNaN(n)) {
e(0, r, i + t);
e(2146959360, r, i + o);
} else if (n > 1.7976931348623157e308) {
e(0, r, i + t);
e((a << 31 | 2146435072) >>> 0, r, i + o);
} else {
var s;
if (n < 2.2250738585072014e-308) {
e((s = n / 5e-324) >>> 0, r, i + t);
e((a << 31 | s / 4294967296) >>> 0, r, i + o);
} else {
var l = Math.floor(Math.log(n) / Math.LN2);
1024 === l && (l = 1023);
e(4503599627370496 * (s = n * Math.pow(2, -l)) >>> 0, r, i + t);
e((a << 31 | l + 1023 << 20 | 1048576 * s & 1048575) >>> 0, r, i + o);
}
}
}
e.writeDoubleLE = t.bind(null, r, 0, 4);
e.writeDoubleBE = t.bind(null, i, 4, 0);
function o(e, t, o, n, r) {
var i = e(n, r + t), a = e(n, r + o), s = 2 * (a >> 31) + 1, l = a >>> 20 & 2047, c = 4294967296 * (1048575 & a) + i;
return 2047 === l ? c ? NaN : Infinity * s : 0 === l ? 5e-324 * s * c : s * Math.pow(2, l - 1075) * (c + 4503599627370496);
}
e.readDoubleLE = o.bind(null, a, 0, 4);
e.readDoubleBE = o.bind(null, s, 4, 0);
}();
return e;
}
function r(e, t, o) {
t[o] = 255 & e;
t[o + 1] = e >>> 8 & 255;
t[o + 2] = e >>> 16 & 255;
t[o + 3] = e >>> 24;
}
function i(e, t, o) {
t[o] = e >>> 24;
t[o + 1] = e >>> 16 & 255;
t[o + 2] = e >>> 8 & 255;
t[o + 3] = 255 & e;
}
function a(e, t) {
return (e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24) >>> 0;
}
function s(e, t) {
return (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0;
}
