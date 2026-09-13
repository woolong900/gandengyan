// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
var n = o;
n.length = function(e) {
var t = e.length;
if (!t) return 0;
for (var o = 0; --t % 4 > 1 && "=" === e.charAt(t); ) ++o;
return Math.ceil(3 * e.length) / 4 - o;
};
for (var r = new Array(64), i = new Array(123), a = 0; a < 64; ) i[r[a] = a < 26 ? a + 65 : a < 52 ? a + 71 : a < 62 ? a - 4 : a - 59 | 43] = a++;
n.encode = function(e, t, o) {
for (var n, i = null, a = [], s = 0, l = 0; t < o; ) {
var c = e[t++];
switch (l) {
case 0:
a[s++] = r[c >> 2];
n = (3 & c) << 4;
l = 1;
break;

case 1:
a[s++] = r[n | c >> 4];
n = (15 & c) << 2;
l = 2;
break;

case 2:
a[s++] = r[n | c >> 6];
a[s++] = r[63 & c];
l = 0;
}
if (s > 8191) {
(i || (i = [])).push(String.fromCharCode.apply(String, a));
s = 0;
}
}
if (l) {
a[s++] = r[n];
a[s++] = 61;
1 === l && (a[s++] = 61);
}
if (i) {
s && i.push(String.fromCharCode.apply(String, a.slice(0, s)));
return i.join("");
}
return String.fromCharCode.apply(String, a.slice(0, s));
};
n.decode = function(e, t, o) {
for (var n, r = o, a = 0, s = 0; s < e.length; ) {
var l = e.charCodeAt(s++);
if (61 === l && a > 1) break;
if (void 0 === (l = i[l])) throw Error("invalid encoding");
switch (a) {
case 0:
n = l;
a = 1;
break;

case 1:
t[o++] = n << 2 | (48 & l) >> 4;
n = l;
a = 2;
break;

case 2:
t[o++] = (15 & n) << 4 | (60 & l) >> 2;
n = l;
a = 3;
break;

case 3:
t[o++] = (3 & n) << 6 | l;
a = 0;
}
}
if (1 === a) throw Error("invalid encoding");
return o - r;
};
n.test = function(e) {
return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e);
};
