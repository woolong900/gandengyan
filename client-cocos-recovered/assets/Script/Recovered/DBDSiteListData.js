// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0cac8J0q1lPd6WP/UVctFZi", "DBDSiteListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./DBDEnum"), r = function() {
function e() {
this._data = null;
this._data = Object.create(null);
}
e.prototype.add = function(e) {
var t = e.pos;
this._data[t] ? cc.error("site add error.") : this._data[t] = e;
};
e.prototype.upate = function(e) {
var t = e.pos;
this._data[t] ? this._data[t] = e : this.add(e);
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype._checkPut = function(e) {
var t = this.get(e);
if (t && t.roundType === n.eRoundTypeDBD.Put) return !0;
};
e.prototype.getLastPut = function(e) {
var t = (e - 1 + 4) % 4, o = (e - 2 + 4) % 4, n = (e - 3 + 4) % 4;
return this._checkPut(t) ? this.get(t) : this._checkPut(o) ? this.get(o) : this._checkPut(n) ? this.get(n) : null;
};
e.prototype.getNext = function(e, t) {
var o = (e + 1 + t) % t;
return this.get(o);
};
return e;
}();
o.default = r;
cc._RF.pop();
