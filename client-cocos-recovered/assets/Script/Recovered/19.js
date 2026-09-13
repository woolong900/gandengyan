// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = r;
var n = e("./20");
function r(e, t) {
this.lo = e >>> 0;
this.hi = t >>> 0;
}
var i = r.zero = new r(0, 0);
i.toNumber = function() {
return 0;
};
i.zzEncode = i.zzDecode = function() {
return this;
};
i.length = function() {
return 1;
};
var a = r.zeroHash = "\0\0\0\0\0\0\0\0";
r.fromNumber = function(e) {
if (0 === e) return i;
var t = e < 0;
t && (e = -e);
var o = e >>> 0, n = (e - o) / 4294967296 >>> 0;
if (t) {
n = ~n >>> 0;
o = ~o >>> 0;
if (++o > 4294967295) {
o = 0;
++n > 4294967295 && (n = 0);
}
}
return new r(o, n);
};
r.from = function(e) {
if ("number" == typeof e) return r.fromNumber(e);
if (n.isString(e)) {
if (!n.Long) return r.fromNumber(parseInt(e, 10));
e = n.Long.fromString(e);
}
return e.low || e.high ? new r(e.low >>> 0, e.high >>> 0) : i;
};
r.prototype.toNumber = function(e) {
if (!e && this.hi >>> 31) {
var t = 1 + ~this.lo >>> 0, o = ~this.hi >>> 0;
t || (o = o + 1 >>> 0);
return -(t + 4294967296 * o);
}
return this.lo + 4294967296 * this.hi;
};
r.prototype.toLong = function(e) {
return n.Long ? new n.Long(0 | this.lo, 0 | this.hi, Boolean(e)) : {
low: 0 | this.lo,
high: 0 | this.hi,
unsigned: Boolean(e)
};
};
var s = String.prototype.charCodeAt;
r.fromHash = function(e) {
return e === a ? i : new r((s.call(e, 0) | s.call(e, 1) << 8 | s.call(e, 2) << 16 | s.call(e, 3) << 24) >>> 0, (s.call(e, 4) | s.call(e, 5) << 8 | s.call(e, 6) << 16 | s.call(e, 7) << 24) >>> 0);
};
r.prototype.toHash = function() {
return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
};
r.prototype.zzEncode = function() {
var e = this.hi >> 31;
this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0;
this.lo = (this.lo << 1 ^ e) >>> 0;
return this;
};
r.prototype.zzDecode = function() {
var e = -(1 & this.lo);
this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0;
this.hi = (this.hi >>> 1 ^ e) >>> 0;
return this;
};
r.prototype.length = function() {
var e = this.lo, t = (this.lo >>> 28 | this.hi << 4) >>> 0, o = this.hi >>> 24;
return 0 === o ? 0 === t ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : t < 16384 ? t < 128 ? 5 : 6 : t < 2097152 ? 7 : 8 : o < 128 ? 9 : 10;
};
