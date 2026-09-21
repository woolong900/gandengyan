// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c8577g7Fm5EP7mTkPFibkVk", "ClubQuitRecordListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonUtils"), r = new (function() {
function e() {
this._data = {};
this._init();
}
e.prototype._init = function() {
this._data = {};
};
e.prototype._add = function(e) {
var t = e.uid;
this._data[t] ? cc.error("club tuichu add error.") : this._data[t] = e;
};
e.prototype._update = function(e) {
var t = e.uid;
this._data[t] ? this._data[t] = e : this._add(e);
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
};
e.prototype._destroy = function() {
this._init();
};
return e;
}())();
o.default = r;
cc._RF.pop();
