// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
var n = o;
n.length = function(e) {
for (var t = 0, o = 0, n = 0; n < e.length; ++n) if ((o = e.charCodeAt(n)) < 128) t += 1; else if (o < 2048) t += 2; else if (55296 == (64512 & o) && 56320 == (64512 & e.charCodeAt(n + 1))) {
++n;
t += 4;
} else t += 3;
return t;
};
n.read = function(e, t, o) {
if (o - t < 1) return "";
for (var n, r = null, i = [], a = 0; t < o; ) {
if ((n = e[t++]) < 128) i[a++] = n; else if (n > 191 && n < 224) i[a++] = (31 & n) << 6 | 63 & e[t++]; else if (n > 239 && n < 365) {
n = ((7 & n) << 18 | (63 & e[t++]) << 12 | (63 & e[t++]) << 6 | 63 & e[t++]) - 65536;
i[a++] = 55296 + (n >> 10);
i[a++] = 56320 + (1023 & n);
} else i[a++] = (15 & n) << 12 | (63 & e[t++]) << 6 | 63 & e[t++];
if (a > 8191) {
(r || (r = [])).push(String.fromCharCode.apply(String, i));
a = 0;
}
}
if (r) {
a && r.push(String.fromCharCode.apply(String, i.slice(0, a)));
return r.join("");
}
return String.fromCharCode.apply(String, i.slice(0, a));
};
n.write = function(e, t, o) {
for (var n, r, i = o, a = 0; a < e.length; ++a) if ((n = e.charCodeAt(a)) < 128) t[o++] = n; else if (n < 2048) {
t[o++] = n >> 6 | 192;
t[o++] = 63 & n | 128;
} else if (55296 == (64512 & n) && 56320 == (64512 & (r = e.charCodeAt(a + 1)))) {
n = 65536 + ((1023 & n) << 10) + (1023 & r);
++a;
t[o++] = n >> 18 | 240;
t[o++] = n >> 12 & 63 | 128;
t[o++] = n >> 6 & 63 | 128;
t[o++] = 63 & n | 128;
} else {
t[o++] = n >> 12 | 224;
t[o++] = n >> 6 & 63 | 128;
t[o++] = 63 & n | 128;
}
return o - i;
};
