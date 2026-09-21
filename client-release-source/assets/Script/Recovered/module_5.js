// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = function(e, t) {
var o = new Array(arguments.length - 1), n = 0, r = 2, i = !0;
for (;r < arguments.length; ) o[n++] = arguments[r++];
return new Promise(function(r, a) {
o[n] = function(e) {
if (i) {
i = !1;
if (e) a(e); else {
for (var t = new Array(arguments.length - 1), o = 0; o < t.length; ) t[o++] = arguments[o];
r.apply(null, t);
}
}
};
try {
e.apply(t || null, o);
} catch (e) {
if (i) {
i = !1;
a(e);
}
}
});
};
