// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2fc94Uq19FBCos3taorksti", "GDSiteListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./GDEnum"), r = function() {
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
if (t && t.roundType === n.eRoundTypeGD.Put) return !0;
};
e.prototype._checkshowPut = function(e) {
var t = this.get(e), o = t.getPutCards();
if (t && 0 != o.length) return !0;
};
e.prototype.getLastPut = function(e) {
var t = (e - 1 + 4) % 4, o = (e - 2 + 4) % 4, n = (e - 3 + 4) % 4;
return this._checkPut(t) ? this.get(t) : this._checkPut(o) ? this.get(o) : this._checkPut(n) ? this.get(n) : null;
};
e.prototype.getputLastPut = function(e) {
var t = (e - 1 + 4) % 4, o = (e - 2 + 4) % 4, n = (e - 3 + 4) % 4;
return this._checkshowPut(t) ? this.get(t) : this._checkshowPut(o) ? this.get(o) : this._checkshowPut(n) ? this.get(n) : null;
};
e.prototype.getNext = function(e, t) {
var o = (e + 1 + t) % t;
return this.get(o);
};
e.prototype.setLastPut = function(e) {
var t = (e - 1 + 4) % 4, o = (e - 2 + 4) % 4, r = (e - 3 + 4) % 4;
this._checkPut(t) && this.get(t).set_roundData(n.eRoundTypeGD.Null);
this._checkPut(o) && this.get(o).set_roundData(n.eRoundTypeGD.Null);
this._checkPut(r) && this.get(r).set_roundData(n.eRoundTypeGD.Null);
return null;
};
return e;
}();
o.default = r;
cc._RF.pop();
