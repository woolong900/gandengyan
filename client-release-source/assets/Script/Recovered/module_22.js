// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = i;
var n = require("./module_21");
(i.prototype = Object.create(n.prototype)).constructor = i;
var r = require("./module_20");
function i() {
n.call(this);
}
i._configure = function() {
i.alloc = r._Buffer_allocUnsafe;
i.writeBytesBuffer = r.Buffer && r.Buffer.prototype instanceof Uint8Array && "set" === r.Buffer.prototype.set.name ? function(e, t, o) {
t.set(e, o);
} : function(e, t, o) {
if (e.copy) e.copy(t, o, 0, e.length); else for (var n = 0; n < e.length; ) t[o++] = e[n++];
};
};
i.prototype.bytes = function(e) {
r.isString(e) && (e = r._Buffer_from(e, "base64"));
var t = e.length >>> 0;
this.uint32(t);
t && this._push(i.writeBytesBuffer, t, e);
return this;
};
function a(e, t, o) {
e.length < 40 ? r.utf8.write(e, t, o) : t.utf8Write ? t.utf8Write(e, o) : t.write(e, o);
}
i.prototype.string = function(e) {
var t = r.Buffer.byteLength(e);
this.uint32(t);
t && this._push(a, t, e);
return this;
};
i._configure();
