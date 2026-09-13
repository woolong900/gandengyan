// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2323d89xDZJeboC8Fm3fxFO", "ClubApplyListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonUtils"), r = new (function() {
function e() {
this._count = 0;
this._data = {};
this.init();
}
e.prototype.init = function() {
this._count = 0;
this._data = {};
};
e.prototype.add = function(e) {
this._count++;
var t = e.uid;
this._data[t] ? cc.error("club geli add error.") : this._data[t] = e;
};
e.prototype.update = function(e) {
var t = e.uid;
this._data[t] ? this._data[t] = e : this.add(e);
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype.getLength = function() {
return this._count;
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
};
e.prototype.destroy = function() {
this.init();
};
return e;
}())();
o.default = r;
cc._RF.pop();
