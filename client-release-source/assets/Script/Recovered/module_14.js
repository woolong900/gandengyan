// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = l;
var n, r = require("./module_20"), i = r.LongBits, a = r.utf8;
function s(e, t) {
return RangeError("index out of range: " + e.pos + " + " + (t || 1) + " > " + e.len);
}
function l(e) {
this.buf = e;
this.pos = 0;
this.len = e.length;
}
var c = "undefined" != typeof Uint8Array ? function(e) {
if (e instanceof Uint8Array || Array.isArray(e)) return new l(e);
throw Error("illegal buffer");
} : function(e) {
if (Array.isArray(e)) return new l(e);
throw Error("illegal buffer");
}, u = function() {
return r.Buffer ? function(e) {
return (l.create = function(e) {
return r.Buffer.isBuffer(e) ? new n(e) : c(e);
})(e);
} : c;
};
l.create = u();
l.prototype._slice = r.Array.prototype.subarray || r.Array.prototype.slice;
l.prototype.uint32 = function() {
var e = 4294967295;
return function() {
e = (127 & this.buf[this.pos]) >>> 0;
if (this.buf[this.pos++] < 128) return e;
e = (e | (127 & this.buf[this.pos]) << 7) >>> 0;
if (this.buf[this.pos++] < 128) return e;
e = (e | (127 & this.buf[this.pos]) << 14) >>> 0;
if (this.buf[this.pos++] < 128) return e;
e = (e | (127 & this.buf[this.pos]) << 21) >>> 0;
if (this.buf[this.pos++] < 128) return e;
e = (e | (15 & this.buf[this.pos]) << 28) >>> 0;
if (this.buf[this.pos++] < 128) return e;
if ((this.pos += 5) > this.len) {
this.pos = this.len;
throw s(this, 10);
}
return e;
};
}();
l.prototype.int32 = function() {
return 0 | this.uint32();
};
l.prototype.sint32 = function() {
var e = this.uint32();
return e >>> 1 ^ -(1 & e) | 0;
};
function d() {
var e = new i(0, 0), t = 0;
if (!(this.len - this.pos > 4)) {
for (;t < 3; ++t) {
if (this.pos >= this.len) throw s(this);
e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0;
if (this.buf[this.pos++] < 128) return e;
}
e.lo = (e.lo | (127 & this.buf[this.pos++]) << 7 * t) >>> 0;
return e;
}
for (;t < 4; ++t) {
e.lo = (e.lo | (127 & this.buf[this.pos]) << 7 * t) >>> 0;
if (this.buf[this.pos++] < 128) return e;
}
e.lo = (e.lo | (127 & this.buf[this.pos]) << 28) >>> 0;
e.hi = (e.hi | (127 & this.buf[this.pos]) >> 4) >>> 0;
if (this.buf[this.pos++] < 128) return e;
t = 0;
if (this.len - this.pos > 4) for (;t < 5; ++t) {
e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0;
if (this.buf[this.pos++] < 128) return e;
} else for (;t < 5; ++t) {
if (this.pos >= this.len) throw s(this);
e.hi = (e.hi | (127 & this.buf[this.pos]) << 7 * t + 3) >>> 0;
if (this.buf[this.pos++] < 128) return e;
}
throw Error("invalid varint encoding");
}
l.prototype.bool = function() {
return 0 !== this.uint32();
};
function p(e, t) {
return (e[t - 4] | e[t - 3] << 8 | e[t - 2] << 16 | e[t - 1] << 24) >>> 0;
}
l.prototype.fixed32 = function() {
if (this.pos + 4 > this.len) throw s(this, 4);
return p(this.buf, this.pos += 4);
};
l.prototype.sfixed32 = function() {
if (this.pos + 4 > this.len) throw s(this, 4);
return 0 | p(this.buf, this.pos += 4);
};
function f() {
if (this.pos + 8 > this.len) throw s(this, 8);
return new i(p(this.buf, this.pos += 4), p(this.buf, this.pos += 4));
}
l.prototype.float = function() {
if (this.pos + 4 > this.len) throw s(this, 4);
var e = r.float.readFloatLE(this.buf, this.pos);
this.pos += 4;
return e;
};
l.prototype.double = function() {
if (this.pos + 8 > this.len) throw s(this, 4);
var e = r.float.readDoubleLE(this.buf, this.pos);
this.pos += 8;
return e;
};
l.prototype.bytes = function() {
var e = this.uint32(), t = this.pos, o = this.pos + e;
if (o > this.len) throw s(this, e);
this.pos += e;
return Array.isArray(this.buf) ? this.buf.slice(t, o) : t === o ? new this.buf.constructor(0) : this._slice.call(this.buf, t, o);
};
l.prototype.string = function() {
var e = this.bytes();
return a.read(e, 0, e.length);
};
l.prototype.skip = function(e) {
if ("number" == typeof e) {
if (this.pos + e > this.len) throw s(this, e);
this.pos += e;
} else do {
if (this.pos >= this.len) throw s(this);
} while (128 & this.buf[this.pos++]);
return this;
};
l.prototype.skipType = function(e) {
switch (e) {
case 0:
this.skip();
break;

case 1:
this.skip(8);
break;

case 2:
this.skip(this.uint32());
break;

case 3:
for (;4 != (e = 7 & this.uint32()); ) this.skipType(e);
break;

case 5:
this.skip(4);
break;

default:
throw Error("invalid wire type " + e + " at offset " + this.pos);
}
return this;
};
l._configure = function(e) {
n = e;
l.create = u();
n._configure();
var t = r.Long ? "toLong" : "toNumber";
r.merge(l.prototype, {
int64: function() {
return d.call(this)[t](!1);
},
uint64: function() {
return d.call(this)[t](!0);
},
sint64: function() {
return d.call(this).zzDecode()[t](!1);
},
fixed64: function() {
return f.call(this)[t](!0);
},
sfixed64: function() {
return f.call(this)[t](!1);
}
});
};
