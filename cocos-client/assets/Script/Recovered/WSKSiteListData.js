// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "509b5vTZylJVp9lslWH544T", "WSKSiteListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./WSKEnum"), r = function() {
function e() {
this._data = null;
this._lastPutPos = -1;
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
if (t && t.roundType === n.eWSKRoundType.Put) return !0;
};
e.prototype.setLastPut = function(e) {
this._lastPutPos = e;
};
e.prototype.clearLastPut = function(e) {
void 0 !== e && this._lastPutPos !== e || (this._lastPutPos = -1);
};
e.prototype.getLastPut = function(e) {
if (this._lastPutPos >= 0 && this._lastPutPos !== e && this._checkPut(this._lastPutPos)) return this.get(this._lastPutPos);
var t = (e - 1 + 4) % 4, o = (e - 2 + 4) % 4, n = (e - 3 + 4) % 4;
return this._checkPut(t) ? this.get(t) : this._checkPut(o) ? this.get(o) : this._checkPut(n) ? this.get(n) : null;
};
e.prototype._nextHandLen = function(e, t, o) {
var n = (e + o + t) % t;
return this.get(n).handCards.length;
};
e.prototype.isNextWaring = function(e, t) {
for (var o = 1; o < t - 1; o++) {
var n = this._nextHandLen(e, t, o);
if (1 === n) return !0;
if (n > 1) return !1;
}
return !1;
};
return e;
}();
o.default = r;
cc._RF.pop();
