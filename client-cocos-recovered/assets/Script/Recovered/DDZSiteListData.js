// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "14f198LTexHF5S85VRr6Pg8", "DDZSiteListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./DDZEnum"), r = function() {
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
if (t && t.roundType === n.eRoundTypeDDZ.Put) return !0;
};
e.prototype.getLastPut = function(e) {
var t = (e - 1 + 3) % 3, o = (e - 2 + 3) % 3;
return this._checkPut(t) ? this.get(t) : this._checkPut(o) ? this.get(o) : null;
};
e.prototype.getNext = function(e, t) {
var o = (e + 1 + t) % t;
return this.get(o);
};
return e;
}();
o.default = r;
cc._RF.pop();
