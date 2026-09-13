// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
(function(t) {
"use strict";
var n = o;
n.asPromise = require("./module_5");
n.base64 = require("./module_6");
n.EventEmitter = require("./module_7");
n.float = require("./module_8");
n.inquire = require("./module_9");
n.utf8 = require("./module_11");
n.pool = require("./module_10");
n.LongBits = require("./module_19");
n.global = "undefined" != typeof window && window || "undefined" != typeof t && t || "undefined" != typeof self && self || this;
n.emptyArray = Object.freeze ? Object.freeze([]) : [];
n.emptyObject = Object.freeze ? Object.freeze({}) : {};
n.isNode = Boolean(n.global.process && n.global.process.versions && n.global.process.versions.node);
n.isInteger = Number.isInteger || function(e) {
return "number" == typeof e && isFinite(e) && Math.floor(e) === e;
};
n.isString = function(e) {
return "string" == typeof e || e instanceof String;
};
n.isObject = function(e) {
return e && "object" == typeof e;
};
n.isset = n.isSet = function(e, t) {
var o = e[t];
return !(null == o || !e.hasOwnProperty(t)) && ("object" != typeof o || (Array.isArray(o) ? o.length : Object.keys(o).length) > 0);
};
n.Buffer = function() {
try {
var e = n.inquire("buffer").Buffer;
return e.prototype.utf8Write ? e : null;
} catch (e) {
return null;
}
}();
n._Buffer_from = null;
n._Buffer_allocUnsafe = null;
n.newBuffer = function(e) {
return "number" == typeof e ? n.Buffer ? n._Buffer_allocUnsafe(e) : new n.Array(e) : n.Buffer ? n._Buffer_from(e) : "undefined" == typeof Uint8Array ? e : new Uint8Array(e);
};
n.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array;
n.Long = n.global.dcodeIO && n.global.dcodeIO.Long || n.global.Long || n.inquire("long");
n.key2Re = /^true|false|0|1$/;
n.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
n.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
n.longToHash = function(e) {
return e ? n.LongBits.from(e).toHash() : n.LongBits.zeroHash;
};
n.longFromHash = function(e, t) {
var o = n.LongBits.fromHash(e);
return n.Long ? n.Long.fromBits(o.lo, o.hi, t) : o.toNumber(Boolean(t));
};
function r(e, t, o) {
for (var n = Object.keys(t), r = 0; r < n.length; ++r) void 0 !== e[n[r]] && o || (e[n[r]] = t[n[r]]);
return e;
}
n.merge = r;
n.lcFirst = function(e) {
return e.charAt(0).toLowerCase() + e.substring(1);
};
function i(e) {
function t(e, o) {
if (!(this instanceof t)) return new t(e, o);
Object.defineProperty(this, "message", {
get: function() {
return e;
}
});
Error.captureStackTrace ? Error.captureStackTrace(this, t) : Object.defineProperty(this, "stack", {
value: new Error().stack || ""
});
o && r(this, o);
}
(t.prototype = Object.create(Error.prototype)).constructor = t;
Object.defineProperty(t.prototype, "name", {
get: function() {
return e;
}
});
t.prototype.toString = function() {
return this.name + ": " + this.message;
};
return t;
}
n.newError = i;
n.ProtocolError = i("ProtocolError");
n.oneOfGetter = function(e) {
for (var t = {}, o = 0; o < e.length; ++o) t[e[o]] = 1;
return function() {
for (var e = Object.keys(this), o = e.length - 1; o > -1; --o) if (1 === t[e[o]] && void 0 !== this[e[o]] && null !== this[e[o]]) return e[o];
};
};
n.oneOfSetter = function(e) {
return function(t) {
for (var o = 0; o < e.length; ++o) e[o] !== t && delete this[e[o]];
};
};
n.toJSONOptions = {
longs: String,
enums: String,
bytes: String,
json: !0
};
n._configure = function() {
var e = n.Buffer;
if (e) {
n._Buffer_from = e.from !== Uint8Array.from && e.from || function(t, o) {
return new e(t, o);
};
n._Buffer_allocUnsafe = e.allocUnsafe || function(t) {
return new e(t);
};
} else n._Buffer_from = n._Buffer_allocUnsafe = null;
};
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
