// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = d;
var n, r = require("./module_20"), i = r.LongBits, a = r.base64, s = r.utf8;
function l(e, t, o) {
this.fn = e;
this.len = t;
this.next = void 0;
this.val = o;
}
function c() {}
function u(e) {
this.head = e.head;
this.tail = e.tail;
this.len = e.len;
this.next = e.states;
}
function d() {
this.len = 0;
this.head = new l(c, 0, 0);
this.tail = this.head;
this.states = null;
}
var p = function() {
return r.Buffer ? function() {
return (d.create = function() {
return new n();
})();
} : function() {
return new d();
};
};
d.create = p();
d.alloc = function(e) {
return new r.Array(e);
};
r.Array !== Array && (d.alloc = r.pool(d.alloc, r.Array.prototype.subarray));
d.prototype._push = function(e, t, o) {
this.tail = this.tail.next = new l(e, t, o);
this.len += t;
return this;
};
function f(e, t, o) {
t[o] = 255 & e;
}
function h(e, t) {
this.len = e;
this.next = void 0;
this.val = t;
}
h.prototype = Object.create(l.prototype);
h.prototype.fn = function(e, t, o) {
for (;e > 127; ) {
t[o++] = 127 & e | 128;
e >>>= 7;
}
t[o] = e;
};
d.prototype.uint32 = function(e) {
this.len += (this.tail = this.tail.next = new h((e >>>= 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5, e)).len;
return this;
};
d.prototype.int32 = function(e) {
return e < 0 ? this._push(m, 10, i.fromNumber(e)) : this.uint32(e);
};
d.prototype.sint32 = function(e) {
return this.uint32((e << 1 ^ e >> 31) >>> 0);
};
function m(e, t, o) {
for (;e.hi; ) {
t[o++] = 127 & e.lo | 128;
e.lo = (e.lo >>> 7 | e.hi << 25) >>> 0;
e.hi >>>= 7;
}
for (;e.lo > 127; ) {
t[o++] = 127 & e.lo | 128;
e.lo = e.lo >>> 7;
}
t[o++] = e.lo;
}
d.prototype.uint64 = function(e) {
var t = i.from(e);
return this._push(m, t.length(), t);
};
d.prototype.int64 = d.prototype.uint64;
d.prototype.sint64 = function(e) {
var t = i.from(e).zzEncode();
return this._push(m, t.length(), t);
};
d.prototype.bool = function(e) {
return this._push(f, 1, e ? 1 : 0);
};
function y(e, t, o) {
t[o] = 255 & e;
t[o + 1] = e >>> 8 & 255;
t[o + 2] = e >>> 16 & 255;
t[o + 3] = e >>> 24;
}
d.prototype.fixed32 = function(e) {
return this._push(y, 4, e >>> 0);
};
d.prototype.sfixed32 = d.prototype.fixed32;
d.prototype.fixed64 = function(e) {
var t = i.from(e);
return this._push(y, 4, t.lo)._push(y, 4, t.hi);
};
d.prototype.sfixed64 = d.prototype.fixed64;
d.prototype.float = function(e) {
return this._push(r.float.writeFloatLE, 4, e);
};
d.prototype.double = function(e) {
return this._push(r.float.writeDoubleLE, 8, e);
};
var g = r.Array.prototype.set ? function(e, t, o) {
t.set(e, o);
} : function(e, t, o) {
for (var n = 0; n < e.length; ++n) t[o + n] = e[n];
};
d.prototype.bytes = function(e) {
var t = e.length >>> 0;
if (!t) return this._push(f, 1, 0);
if (r.isString(e)) {
var o = d.alloc(t = a.length(e));
a.decode(e, o, 0);
e = o;
}
return this.uint32(t)._push(g, t, e);
};
d.prototype.string = function(e) {
var t = s.length(e);
return t ? this.uint32(t)._push(s.write, t, e) : this._push(f, 1, 0);
};
d.prototype.fork = function() {
this.states = new u(this);
this.head = this.tail = new l(c, 0, 0);
this.len = 0;
return this;
};
d.prototype.reset = function() {
if (this.states) {
this.head = this.states.head;
this.tail = this.states.tail;
this.len = this.states.len;
this.states = this.states.next;
} else {
this.head = this.tail = new l(c, 0, 0);
this.len = 0;
}
return this;
};
d.prototype.ldelim = function() {
var e = this.head, t = this.tail, o = this.len;
this.reset().uint32(o);
if (o) {
this.tail.next = e.next;
this.tail = t;
this.len += o;
}
return this;
};
d.prototype.finish = function() {
for (var e = this.head.next, t = this.constructor.alloc(this.len), o = 0; e; ) {
e.fn(e.val, t, o);
o += e.len;
e = e.next;
}
return t;
};
d._configure = function(e) {
n = e;
d.create = p();
n._configure();
};
