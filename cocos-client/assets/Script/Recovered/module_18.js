// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = r;
var n = require("./module_20");
(r.prototype = Object.create(n.EventEmitter.prototype)).constructor = r;
function r(e, t, o) {
if ("function" != typeof e) throw TypeError("rpcImpl must be a function");
n.EventEmitter.call(this);
this.rpcImpl = e;
this.requestDelimited = Boolean(t);
this.responseDelimited = Boolean(o);
}
r.prototype.rpcCall = function e(t, o, r, i, a) {
if (!i) throw TypeError("request must be specified");
var s = this;
if (!a) return n.asPromise(e, s, t, o, r, i);
if (s.rpcImpl) try {
return s.rpcImpl(t, o[s.requestDelimited ? "encodeDelimited" : "encode"](i).finish(), function(e, o) {
if (e) {
s.emit("error", e, t);
return a(e);
}
if (null !== o) {
if (!(o instanceof r)) try {
o = r[s.responseDelimited ? "decodeDelimited" : "decode"](o);
} catch (e) {
s.emit("error", e, t);
return a(e);
}
s.emit("data", o, t);
return a(null, o);
}
s.end(!0);
});
} catch (e) {
s.emit("error", e, t);
setTimeout(function() {
a(e);
}, 0);
return;
} else setTimeout(function() {
a(Error("already ended"));
}, 0);
};
r.prototype.end = function(e) {
if (this.rpcImpl) {
e || this.rpcImpl(null, null, null);
this.rpcImpl = null;
this.emit("end").off();
}
return this;
};
