// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "99b39DdMoRFQrqc2GNtKWp7", "ClubAccumulatedRecordListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonUtils"), r = new (function() {
function e() {
this._data = {};
this._init();
}
e.prototype._init = function() {
this._data = {};
};
e.prototype._add = function(e) {
var t = e.userId;
this._data[t] ? cc.error("club geli add error.") : this._data[t] = e;
};
e.prototype._update = function(e) {
var t = e.userId;
this._data[t] ? this._data[t] = e : this._add(e);
};
e.prototype._destroy = function() {
this._init();
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
};
e.prototype.get = function(e) {
return this._data[e];
};
return e;
}())();
o.default = r;
cc._RF.pop();
