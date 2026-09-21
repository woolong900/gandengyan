// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = function(e, t, o) {
var n = o || 8192, r = n >>> 1, i = null, a = n;
return function(o) {
if (o < 1 || o > r) return e(o);
if (a + o > n) {
i = e(n);
a = 0;
}
var s = t.call(i, a, a += o);
7 & a && (a = 1 + (7 | a));
return s;
};
};
