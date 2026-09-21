// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
(function(t) {
"use strict";
var n = require("./module_1"), r = require("./module_4"), i = require("./module_3");
o.Buffer = l;
o.SlowBuffer = function(e) {
+e != e && (e = 0);
return l.alloc(+e);
};
o.INSPECT_MAX_BYTES = 50;
l.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function() {
try {
var e = new Uint8Array(1);
e.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
};
return 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
} catch (e) {
return !1;
}
}();
o.kMaxLength = a();
function a() {
return l.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function s(e, t) {
if (a() < t) throw new RangeError("Invalid typed array length");
if (l.TYPED_ARRAY_SUPPORT) (e = new Uint8Array(t)).__proto__ = l.prototype; else {
null === e && (e = new l(t));
e.length = t;
}
return e;
}
function l(e, t, o) {
if (!(l.TYPED_ARRAY_SUPPORT || this instanceof l)) return new l(e, t, o);
if ("number" == typeof e) {
if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
return p(this, e);
}
return c(this, e, t, o);
}
l.poolSize = 8192;
l._augment = function(e) {
e.__proto__ = l.prototype;
return e;
};
function c(e, t, o, n) {
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? m(e, t, o, n) : "string" == typeof t ? f(e, t, o) : y(e, t);
}
l.from = function(e, t, o) {
return c(null, e, t, o);
};
if (l.TYPED_ARRAY_SUPPORT) {
l.prototype.__proto__ = Uint8Array.prototype;
l.__proto__ = Uint8Array;
"undefined" != typeof Symbol && Symbol.species && l[Symbol.species] === l && Object.defineProperty(l, Symbol.species, {
value: null,
configurable: !0
});
}
function u(e) {
if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
if (e < 0) throw new RangeError('"size" argument must not be negative');
}
function d(e, t, o, n) {
u(t);
return t <= 0 ? s(e, t) : void 0 !== o ? "string" == typeof n ? s(e, t).fill(o, n) : s(e, t).fill(o) : s(e, t);
}
l.alloc = function(e, t, o) {
return d(null, e, t, o);
};
function p(e, t) {
u(t);
e = s(e, t < 0 ? 0 : 0 | g(t));
if (!l.TYPED_ARRAY_SUPPORT) for (var o = 0; o < t; ++o) e[o] = 0;
return e;
}
l.allocUnsafe = function(e) {
return p(null, e);
};
l.allocUnsafeSlow = function(e) {
return p(null, e);
};
function f(e, t, o) {
"string" == typeof o && "" !== o || (o = "utf8");
if (!l.isEncoding(o)) throw new TypeError('"encoding" must be a valid string encoding');
var n = 0 | _(t, o), r = (e = s(e, n)).write(t, o);
r !== n && (e = e.slice(0, r));
return e;
}
function h(e, t) {
var o = t.length < 0 ? 0 : 0 | g(t.length);
e = s(e, o);
for (var n = 0; n < o; n += 1) e[n] = 255 & t[n];
return e;
}
function m(e, t, o, n) {
t.byteLength;
if (o < 0 || t.byteLength < o) throw new RangeError("'offset' is out of bounds");
if (t.byteLength < o + (n || 0)) throw new RangeError("'length' is out of bounds");
t = void 0 === o && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, o) : new Uint8Array(t, o, n);
l.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = l.prototype : e = h(e, t);
return e;
}
function y(e, t) {
if (l.isBuffer(t)) {
var o = 0 | g(t.length);
if (0 === (e = s(e, o)).length) return e;
t.copy(e, 0, 0, o);
return e;
}
if (t) {
if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || $(t.length) ? s(e, 0) : h(e, t);
if ("Buffer" === t.type && i(t.data)) return h(e, t.data);
}
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function g(e) {
if (e >= a()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a().toString(16) + " bytes");
return 0 | e;
}
l.isBuffer = function(e) {
return !(null == e || !e._isBuffer);
};
l.compare = function(e, t) {
if (!l.isBuffer(e) || !l.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
if (e === t) return 0;
for (var o = e.length, n = t.length, r = 0, i = Math.min(o, n); r < i; ++r) if (e[r] !== t[r]) {
o = e[r];
n = t[r];
break;
}
return o < n ? -1 : n < o ? 1 : 0;
};
l.isEncoding = function(e) {
switch (String(e).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
};
l.concat = function(e, t) {
if (!i(e)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === e.length) return l.alloc(0);
var o;
if (void 0 === t) {
t = 0;
for (o = 0; o < e.length; ++o) t += e[o].length;
}
var n = l.allocUnsafe(t), r = 0;
for (o = 0; o < e.length; ++o) {
var a = e[o];
if (!l.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
a.copy(n, r);
r += a.length;
}
return n;
};
function _(e, t) {
if (l.isBuffer(e)) return e.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
"string" != typeof e && (e = "" + e);
var o = e.length;
if (0 === o) return 0;
for (var n = !1; ;) switch (t) {
case "ascii":
case "latin1":
case "binary":
return o;

case "utf8":
case "utf-8":
case void 0:
return z(e).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * o;

case "hex":
return o >>> 1;

case "base64":
return X(e).length;

default:
if (n) return z(e).length;
t = ("" + t).toLowerCase();
n = !0;
}
}
l.byteLength = _;
function v(e, t, o) {
var n = !1;
(void 0 === t || t < 0) && (t = 0);
if (t > this.length) return "";
(void 0 === o || o > this.length) && (o = this.length);
if (o <= 0) return "";
if ((o >>>= 0) <= (t >>>= 0)) return "";
e || (e = "utf8");
for (;;) switch (e) {
case "hex":
return M(this, t, o);

case "utf8":
case "utf-8":
return j(this, t, o);

case "ascii":
return N(this, t, o);

case "latin1":
case "binary":
return T(this, t, o);

case "base64":
return k(this, t, o);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return E(this, t, o);

default:
if (n) throw new TypeError("Unknown encoding: " + e);
e = (e + "").toLowerCase();
n = !0;
}
}
l.prototype._isBuffer = !0;
function C(e, t, o) {
var n = e[t];
e[t] = e[o];
e[o] = n;
}
l.prototype.swap16 = function() {
var e = this.length;
if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var t = 0; t < e; t += 2) C(this, t, t + 1);
return this;
};
l.prototype.swap32 = function() {
var e = this.length;
if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var t = 0; t < e; t += 4) {
C(this, t, t + 3);
C(this, t + 1, t + 2);
}
return this;
};
l.prototype.swap64 = function() {
var e = this.length;
if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var t = 0; t < e; t += 8) {
C(this, t, t + 7);
C(this, t + 1, t + 6);
C(this, t + 2, t + 5);
C(this, t + 3, t + 4);
}
return this;
};
l.prototype.toString = function() {
var e = 0 | this.length;
return 0 === e ? "" : 0 === arguments.length ? j(this, 0, e) : v.apply(this, arguments);
};
l.prototype.equals = function(e) {
if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
return this === e || 0 === l.compare(this, e);
};
l.prototype.inspect = function() {
var e = "", t = o.INSPECT_MAX_BYTES;
if (this.length > 0) {
e = this.toString("hex", 0, t).match(/.{2}/g).join(" ");
this.length > t && (e += " ... ");
}
return "<Buffer " + e + ">";
};
l.prototype.compare = function(e, t, o, n, r) {
if (!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
void 0 === t && (t = 0);
void 0 === o && (o = e ? e.length : 0);
void 0 === n && (n = 0);
void 0 === r && (r = this.length);
if (t < 0 || o > e.length || n < 0 || r > this.length) throw new RangeError("out of range index");
if (n >= r && t >= o) return 0;
if (n >= r) return -1;
if (t >= o) return 1;
t >>>= 0;
o >>>= 0;
n >>>= 0;
r >>>= 0;
if (this === e) return 0;
for (var i = r - n, a = o - t, s = Math.min(i, a), c = this.slice(n, r), u = e.slice(t, o), d = 0; d < s; ++d) if (c[d] !== u[d]) {
i = c[d];
a = u[d];
break;
}
return i < a ? -1 : a < i ? 1 : 0;
};
function b(e, t, o, n, r) {
if (0 === e.length) return -1;
if ("string" == typeof o) {
n = o;
o = 0;
} else o > 2147483647 ? o = 2147483647 : o < -2147483648 && (o = -2147483648);
o = +o;
isNaN(o) && (o = r ? 0 : e.length - 1);
o < 0 && (o = e.length + o);
if (o >= e.length) {
if (r) return -1;
o = e.length - 1;
} else if (o < 0) {
if (!r) return -1;
o = 0;
}
"string" == typeof t && (t = l.from(t, n));
if (l.isBuffer(t)) return 0 === t.length ? -1 : D(e, t, o, n, r);
if ("number" == typeof t) {
t &= 255;
return l.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? r ? Uint8Array.prototype.indexOf.call(e, t, o) : Uint8Array.prototype.lastIndexOf.call(e, t, o) : D(e, [ t ], o, n, r);
}
throw new TypeError("val must be string, number or Buffer");
}
function D(e, t, o, n, r) {
var i, a = 1, s = e.length, l = t.length;
if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
if (e.length < 2 || t.length < 2) return -1;
a = 2;
s /= 2;
l /= 2;
o /= 2;
}
function c(e, t) {
return 1 === a ? e[t] : e.readUInt16BE(t * a);
}
if (r) {
var u = -1;
for (i = o; i < s; i++) if (c(e, i) === c(t, -1 === u ? 0 : i - u)) {
-1 === u && (u = i);
if (i - u + 1 === l) return u * a;
} else {
-1 !== u && (i -= i - u);
u = -1;
}
} else {
o + l > s && (o = s - l);
for (i = o; i >= 0; i--) {
for (var d = !0, p = 0; p < l; p++) if (c(e, i + p) !== c(t, p)) {
d = !1;
break;
}
if (d) return i;
}
}
return -1;
}
l.prototype.includes = function(e, t, o) {
return -1 !== this.indexOf(e, t, o);
};
l.prototype.indexOf = function(e, t, o) {
return b(this, e, t, o, !0);
};
l.prototype.lastIndexOf = function(e, t, o) {
return b(this, e, t, o, !1);
};
function S(e, t, o, n) {
o = Number(o) || 0;
var r = e.length - o;
n ? (n = Number(n)) > r && (n = r) : n = r;
var i = t.length;
if (i % 2 != 0) throw new TypeError("Invalid hex string");
n > i / 2 && (n = i / 2);
for (var a = 0; a < n; ++a) {
var s = parseInt(t.substr(2 * a, 2), 16);
if (isNaN(s)) return a;
e[o + a] = s;
}
return a;
}
function w(e, t, o, n) {
return Y(z(t, e.length - o), e, o, n);
}
function O(e, t, o, n) {
return Y(q(t), e, o, n);
}
function P(e, t, o, n) {
return O(e, t, o, n);
}
function I(e, t, o, n) {
return Y(X(t), e, o, n);
}
function R(e, t, o, n) {
return Y(Q(t, e.length - o), e, o, n);
}
l.prototype.write = function(e, t, o, n) {
if (void 0 === t) {
n = "utf8";
o = this.length;
t = 0;
} else if (void 0 === o && "string" == typeof t) {
n = t;
o = this.length;
t = 0;
} else {
if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
t |= 0;
if (isFinite(o)) {
o |= 0;
void 0 === n && (n = "utf8");
} else {
n = o;
o = void 0;
}
}
var r = this.length - t;
(void 0 === o || o > r) && (o = r);
if (e.length > 0 && (o < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
n || (n = "utf8");
for (var i = !1; ;) switch (n) {
case "hex":
return S(this, e, t, o);

case "utf8":
case "utf-8":
return w(this, e, t, o);

case "ascii":
return O(this, e, t, o);

case "latin1":
case "binary":
return P(this, e, t, o);

case "base64":
return I(this, e, t, o);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return R(this, e, t, o);

default:
if (i) throw new TypeError("Unknown encoding: " + n);
n = ("" + n).toLowerCase();
i = !0;
}
};
l.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
function k(e, t, o) {
return 0 === t && o === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, o));
}
function j(e, t, o) {
o = Math.min(e.length, o);
for (var n = [], r = t; r < o; ) {
var i = e[r], a = null, s = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
if (r + s <= o) {
var l, c, u, d;
switch (s) {
case 1:
i < 128 && (a = i);
break;

case 2:
128 == (192 & (l = e[r + 1])) && (d = (31 & i) << 6 | 63 & l) > 127 && (a = d);
break;

case 3:
l = e[r + 1];
c = e[r + 2];
128 == (192 & l) && 128 == (192 & c) && (d = (15 & i) << 12 | (63 & l) << 6 | 63 & c) > 2047 && (d < 55296 || d > 57343) && (a = d);
break;

case 4:
l = e[r + 1];
c = e[r + 2];
u = e[r + 3];
128 == (192 & l) && 128 == (192 & c) && 128 == (192 & u) && (d = (15 & i) << 18 | (63 & l) << 12 | (63 & c) << 6 | 63 & u) > 65535 && d < 1114112 && (a = d);
}
}
if (null === a) {
a = 65533;
s = 1;
} else if (a > 65535) {
a -= 65536;
n.push(a >>> 10 & 1023 | 55296);
a = 56320 | 1023 & a;
}
n.push(a);
r += s;
}
return U(n);
}
var L = 4096;
function U(e) {
var t = e.length;
if (t <= L) return String.fromCharCode.apply(String, e);
for (var o = "", n = 0; n < t; ) o += String.fromCharCode.apply(String, e.slice(n, n += L));
return o;
}
function N(e, t, o) {
var n = "";
o = Math.min(e.length, o);
for (var r = t; r < o; ++r) n += String.fromCharCode(127 & e[r]);
return n;
}
function T(e, t, o) {
var n = "";
o = Math.min(e.length, o);
for (var r = t; r < o; ++r) n += String.fromCharCode(e[r]);
return n;
}
function M(e, t, o) {
var n = e.length;
(!t || t < 0) && (t = 0);
(!o || o < 0 || o > n) && (o = n);
for (var r = "", i = t; i < o; ++i) r += J(e[i]);
return r;
}
function E(e, t, o) {
for (var n = e.slice(t, o), r = "", i = 0; i < n.length; i += 2) r += String.fromCharCode(n[i] + 256 * n[i + 1]);
return r;
}
l.prototype.slice = function(e, t) {
var o, n = this.length;
e = ~~e;
t = void 0 === t ? n : ~~t;
e < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n);
t < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n);
t < e && (t = e);
if (l.TYPED_ARRAY_SUPPORT) (o = this.subarray(e, t)).__proto__ = l.prototype; else {
var r = t - e;
o = new l(r, void 0);
for (var i = 0; i < r; ++i) o[i] = this[i + e];
}
return o;
};
function x(e, t, o) {
if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
if (e + t > o) throw new RangeError("Trying to access beyond buffer length");
}
l.prototype.readUIntLE = function(e, t, o) {
e |= 0;
t |= 0;
o || x(e, t, this.length);
for (var n = this[e], r = 1, i = 0; ++i < t && (r *= 256); ) n += this[e + i] * r;
return n;
};
l.prototype.readUIntBE = function(e, t, o) {
e |= 0;
t |= 0;
o || x(e, t, this.length);
for (var n = this[e + --t], r = 1; t > 0 && (r *= 256); ) n += this[e + --t] * r;
return n;
};
l.prototype.readUInt8 = function(e, t) {
t || x(e, 1, this.length);
return this[e];
};
l.prototype.readUInt16LE = function(e, t) {
t || x(e, 2, this.length);
return this[e] | this[e + 1] << 8;
};
l.prototype.readUInt16BE = function(e, t) {
t || x(e, 2, this.length);
return this[e] << 8 | this[e + 1];
};
l.prototype.readUInt32LE = function(e, t) {
t || x(e, 4, this.length);
return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
};
l.prototype.readUInt32BE = function(e, t) {
t || x(e, 4, this.length);
return 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
};
l.prototype.readIntLE = function(e, t, o) {
e |= 0;
t |= 0;
o || x(e, t, this.length);
for (var n = this[e], r = 1, i = 0; ++i < t && (r *= 256); ) n += this[e + i] * r;
n >= (r *= 128) && (n -= Math.pow(2, 8 * t));
return n;
};
l.prototype.readIntBE = function(e, t, o) {
e |= 0;
t |= 0;
o || x(e, t, this.length);
for (var n = t, r = 1, i = this[e + --n]; n > 0 && (r *= 256); ) i += this[e + --n] * r;
i >= (r *= 128) && (i -= Math.pow(2, 8 * t));
return i;
};
l.prototype.readInt8 = function(e, t) {
t || x(e, 1, this.length);
return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
};
l.prototype.readInt16LE = function(e, t) {
t || x(e, 2, this.length);
var o = this[e] | this[e + 1] << 8;
return 32768 & o ? 4294901760 | o : o;
};
l.prototype.readInt16BE = function(e, t) {
t || x(e, 2, this.length);
var o = this[e + 1] | this[e] << 8;
return 32768 & o ? 4294901760 | o : o;
};
l.prototype.readInt32LE = function(e, t) {
t || x(e, 4, this.length);
return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
};
l.prototype.readInt32BE = function(e, t) {
t || x(e, 4, this.length);
return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
};
l.prototype.readFloatLE = function(e, t) {
t || x(e, 4, this.length);
return r.read(this, e, !0, 23, 4);
};
l.prototype.readFloatBE = function(e, t) {
t || x(e, 4, this.length);
return r.read(this, e, !1, 23, 4);
};
l.prototype.readDoubleLE = function(e, t) {
t || x(e, 8, this.length);
return r.read(this, e, !0, 52, 8);
};
l.prototype.readDoubleBE = function(e, t) {
t || x(e, 8, this.length);
return r.read(this, e, !1, 52, 8);
};
function B(e, t, o, n, r, i) {
if (!l.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (t > r || t < i) throw new RangeError('"value" argument is out of bounds');
if (o + n > e.length) throw new RangeError("Index out of range");
}
l.prototype.writeUIntLE = function(e, t, o, n) {
e = +e;
t |= 0;
o |= 0;
if (!n) {
B(this, e, t, o, Math.pow(2, 8 * o) - 1, 0);
}
var r = 1, i = 0;
this[t] = 255 & e;
for (;++i < o && (r *= 256); ) this[t + i] = e / r & 255;
return t + o;
};
l.prototype.writeUIntBE = function(e, t, o, n) {
e = +e;
t |= 0;
o |= 0;
if (!n) {
B(this, e, t, o, Math.pow(2, 8 * o) - 1, 0);
}
var r = o - 1, i = 1;
this[t + r] = 255 & e;
for (;--r >= 0 && (i *= 256); ) this[t + r] = e / i & 255;
return t + o;
};
l.prototype.writeUInt8 = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 1, 255, 0);
l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
this[t] = 255 & e;
return t + 1;
};
function A(e, t, o, n) {
t < 0 && (t = 65535 + t + 1);
for (var r = 0, i = Math.min(e.length - o, 2); r < i; ++r) e[o + r] = (t & 255 << 8 * (n ? r : 1 - r)) >>> 8 * (n ? r : 1 - r);
}
l.prototype.writeUInt16LE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 2, 65535, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else A(this, e, t, !0);
return t + 2;
};
l.prototype.writeUInt16BE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 2, 65535, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else A(this, e, t, !1);
return t + 2;
};
function H(e, t, o, n) {
t < 0 && (t = 4294967295 + t + 1);
for (var r = 0, i = Math.min(e.length - o, 4); r < i; ++r) e[o + r] = t >>> 8 * (n ? r : 3 - r) & 255;
}
l.prototype.writeUInt32LE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 4, 4294967295, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t + 3] = e >>> 24;
this[t + 2] = e >>> 16;
this[t + 1] = e >>> 8;
this[t] = 255 & e;
} else H(this, e, t, !0);
return t + 4;
};
l.prototype.writeUInt32BE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 4, 4294967295, 0);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else H(this, e, t, !1);
return t + 4;
};
l.prototype.writeIntLE = function(e, t, o, n) {
e = +e;
t |= 0;
if (!n) {
var r = Math.pow(2, 8 * o - 1);
B(this, e, t, o, r - 1, -r);
}
var i = 0, a = 1, s = 0;
this[t] = 255 & e;
for (;++i < o && (a *= 256); ) {
e < 0 && 0 === s && 0 !== this[t + i - 1] && (s = 1);
this[t + i] = (e / a >> 0) - s & 255;
}
return t + o;
};
l.prototype.writeIntBE = function(e, t, o, n) {
e = +e;
t |= 0;
if (!n) {
var r = Math.pow(2, 8 * o - 1);
B(this, e, t, o, r - 1, -r);
}
var i = o - 1, a = 1, s = 0;
this[t + i] = 255 & e;
for (;--i >= 0 && (a *= 256); ) {
e < 0 && 0 === s && 0 !== this[t + i + 1] && (s = 1);
this[t + i] = (e / a >> 0) - s & 255;
}
return t + o;
};
l.prototype.writeInt8 = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 1, 127, -128);
l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
e < 0 && (e = 255 + e + 1);
this[t] = 255 & e;
return t + 1;
};
l.prototype.writeInt16LE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 2, 32767, -32768);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else A(this, e, t, !0);
return t + 2;
};
l.prototype.writeInt16BE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 2, 32767, -32768);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else A(this, e, t, !1);
return t + 2;
};
l.prototype.writeInt32LE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 4, 2147483647, -2147483648);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
this[t + 2] = e >>> 16;
this[t + 3] = e >>> 24;
} else H(this, e, t, !0);
return t + 4;
};
l.prototype.writeInt32BE = function(e, t, o) {
e = +e;
t |= 0;
o || B(this, e, t, 4, 2147483647, -2147483648);
e < 0 && (e = 4294967295 + e + 1);
if (l.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else H(this, e, t, !1);
return t + 4;
};
function F(e, t, o, n, r, i) {
if (o + n > e.length) throw new RangeError("Index out of range");
if (o < 0) throw new RangeError("Index out of range");
}
function G(e, t, o, n, i) {
i || F(e, 0, o, 4);
r.write(e, t, o, n, 23, 4);
return o + 4;
}
l.prototype.writeFloatLE = function(e, t, o) {
return G(this, e, t, !0, o);
};
l.prototype.writeFloatBE = function(e, t, o) {
return G(this, e, t, !1, o);
};
function K(e, t, o, n, i) {
i || F(e, 0, o, 8);
r.write(e, t, o, n, 52, 8);
return o + 8;
}
l.prototype.writeDoubleLE = function(e, t, o) {
return K(this, e, t, !0, o);
};
l.prototype.writeDoubleBE = function(e, t, o) {
return K(this, e, t, !1, o);
};
l.prototype.copy = function(e, t, o, n) {
o || (o = 0);
n || 0 === n || (n = this.length);
t >= e.length && (t = e.length);
t || (t = 0);
n > 0 && n < o && (n = o);
if (n === o) return 0;
if (0 === e.length || 0 === this.length) return 0;
if (t < 0) throw new RangeError("targetStart out of bounds");
if (o < 0 || o >= this.length) throw new RangeError("sourceStart out of bounds");
if (n < 0) throw new RangeError("sourceEnd out of bounds");
n > this.length && (n = this.length);
e.length - t < n - o && (n = e.length - t + o);
var r, i = n - o;
if (this === e && o < t && t < n) for (r = i - 1; r >= 0; --r) e[r + t] = this[r + o]; else if (i < 1e3 || !l.TYPED_ARRAY_SUPPORT) for (r = 0; r < i; ++r) e[r + t] = this[r + o]; else Uint8Array.prototype.set.call(e, this.subarray(o, o + i), t);
return i;
};
l.prototype.fill = function(e, t, o, n) {
if ("string" == typeof e) {
if ("string" == typeof t) {
n = t;
t = 0;
o = this.length;
} else if ("string" == typeof o) {
n = o;
o = this.length;
}
if (1 === e.length) {
var r = e.charCodeAt(0);
r < 256 && (e = r);
}
if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
if ("string" == typeof n && !l.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
} else "number" == typeof e && (e &= 255);
if (t < 0 || this.length < t || this.length < o) throw new RangeError("Out of range index");
if (o <= t) return this;
t >>>= 0;
o = void 0 === o ? this.length : o >>> 0;
e || (e = 0);
var i;
if ("number" == typeof e) for (i = t; i < o; ++i) this[i] = e; else {
var a = l.isBuffer(e) ? e : z(new l(e, n).toString()), s = a.length;
for (i = 0; i < o - t; ++i) this[i + t] = a[i % s];
}
return this;
};
var W = /[^+\/0-9A-Za-z-_]/g;
function Z(e) {
if ((e = V(e).replace(W, "")).length < 2) return "";
for (;e.length % 4 != 0; ) e += "=";
return e;
}
function V(e) {
return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}
function J(e) {
return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function z(e, t) {
t = t || Infinity;
for (var o, n = e.length, r = null, i = [], a = 0; a < n; ++a) {
if ((o = e.charCodeAt(a)) > 55295 && o < 57344) {
if (!r) {
if (o > 56319) {
(t -= 3) > -1 && i.push(239, 191, 189);
continue;
}
if (a + 1 === n) {
(t -= 3) > -1 && i.push(239, 191, 189);
continue;
}
r = o;
continue;
}
if (o < 56320) {
(t -= 3) > -1 && i.push(239, 191, 189);
r = o;
continue;
}
o = 65536 + (r - 55296 << 10 | o - 56320);
} else r && (t -= 3) > -1 && i.push(239, 191, 189);
r = null;
if (o < 128) {
if ((t -= 1) < 0) break;
i.push(o);
} else if (o < 2048) {
if ((t -= 2) < 0) break;
i.push(o >> 6 | 192, 63 & o | 128);
} else if (o < 65536) {
if ((t -= 3) < 0) break;
i.push(o >> 12 | 224, o >> 6 & 63 | 128, 63 & o | 128);
} else {
if (!(o < 1114112)) throw new Error("Invalid code point");
if ((t -= 4) < 0) break;
i.push(o >> 18 | 240, o >> 12 & 63 | 128, o >> 6 & 63 | 128, 63 & o | 128);
}
}
return i;
}
function q(e) {
for (var t = [], o = 0; o < e.length; ++o) t.push(255 & e.charCodeAt(o));
return t;
}
function Q(e, t) {
for (var o, n, r, i = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {
n = (o = e.charCodeAt(a)) >> 8;
r = o % 256;
i.push(r);
i.push(n);
}
return i;
}
function X(e) {
return n.toByteArray(Z(e));
}
function Y(e, t, o, n) {
for (var r = 0; r < n && !(r + o >= t.length || r >= e.length); ++r) t[r + o] = e[r];
return r;
}
function $(e) {
return e != e;
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
