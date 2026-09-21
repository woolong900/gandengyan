// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9a1a9jzNDdMKJzdSjQrSahv", "D7SiteListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {
this._data = null;
this._data = Object.create(null);
}
e.prototype._add = function(e) {
var t = e.pos;
this._data[t] ? cc.error("site add error.") : this._data[t] = e;
};
e.prototype.upate = function(e) {
var t = e.pos;
this._data[t] ? this._data[t] = e : this._add(e);
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype.clean = function() {
this._data = Object.create(null);
};
return e;
}();
o.default = n;
cc._RF.pop();
