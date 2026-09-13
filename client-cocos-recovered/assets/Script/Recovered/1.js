// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
o.byteLength = function(e) {
var t = c(e), o = t[0], n = t[1];
return 3 * (o + n) / 4 - n;
};
o.toByteArray = function(e) {
var t, o, n = c(e), a = n[0], s = n[1], l = new i(u(e, a, s)), d = 0, p = s > 0 ? a - 4 : a;
for (o = 0; o < p; o += 4) {
t = r[e.charCodeAt(o)] << 18 | r[e.charCodeAt(o + 1)] << 12 | r[e.charCodeAt(o + 2)] << 6 | r[e.charCodeAt(o + 3)];
l[d++] = t >> 16 & 255;
l[d++] = t >> 8 & 255;
l[d++] = 255 & t;
}
if (2 === s) {
t = r[e.charCodeAt(o)] << 2 | r[e.charCodeAt(o + 1)] >> 4;
l[d++] = 255 & t;
}
if (1 === s) {
t = r[e.charCodeAt(o)] << 10 | r[e.charCodeAt(o + 1)] << 4 | r[e.charCodeAt(o + 2)] >> 2;
l[d++] = t >> 8 & 255;
l[d++] = 255 & t;
}
return l;
};
o.fromByteArray = function(e) {
for (var t, o = e.length, r = o % 3, i = [], a = 0, s = o - r; a < s; a += 16383) i.push(p(e, a, a + 16383 > s ? s : a + 16383));
if (1 === r) {
t = e[o - 1];
i.push(n[t >> 2] + n[t << 4 & 63] + "==");
} else if (2 === r) {
t = (e[o - 2] << 8) + e[o - 1];
i.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "=");
}
return i.join("");
};
for (var n = [], r = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, l = a.length; s < l; ++s) {
n[s] = a[s];
r[a.charCodeAt(s)] = s;
}
r["-".charCodeAt(0)] = 62;
r["_".charCodeAt(0)] = 63;
function c(e) {
var t = e.length;
if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
var o = e.indexOf("=");
-1 === o && (o = t);
return [ o, o === t ? 0 : 4 - o % 4 ];
}
function u(e, t, o) {
return 3 * (t + o) / 4 - o;
}
function d(e) {
return n[e >> 18 & 63] + n[e >> 12 & 63] + n[e >> 6 & 63] + n[63 & e];
}
function p(e, t, o) {
for (var n, r = [], i = t; i < o; i += 3) {
n = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (255 & e[i + 2]);
r.push(d(n));
}
return r.join("");
}
