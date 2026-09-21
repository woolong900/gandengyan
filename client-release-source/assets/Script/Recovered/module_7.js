// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
t.exports = n;
function n() {
this._listeners = {};
}
n.prototype.on = function(e, t, o) {
(this._listeners[e] || (this._listeners[e] = [])).push({
fn: t,
ctx: o || this
});
return this;
};
n.prototype.off = function(e, t) {
if (void 0 === e) this._listeners = {}; else if (void 0 === t) this._listeners[e] = []; else for (var o = this._listeners[e], n = 0; n < o.length; ) o[n].fn === t ? o.splice(n, 1) : ++n;
return this;
};
n.prototype.emit = function(e) {
var t = this._listeners[e];
if (t) {
for (var o = [], n = 1; n < arguments.length; ) o.push(arguments[n++]);
for (n = 0; n < t.length; ) t[n].fn.apply(t[n++].ctx, o);
}
return this;
};
