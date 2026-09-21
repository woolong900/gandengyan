// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bdbd5LWQK1DP4KuWtyL7e7N", "SiteInfoListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
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
e.prototype.anyCardRemain = function(e, t) {
var o = 0;
for (var n in this._data) {
o += this._data[n].putoutStatis(e);
}
return t - o;
};
e.prototype.statisAllOuts = function() {
for (var e in this._data) {
this._data[e].statisAllOuts();
}
};
e.prototype.paiDunRemain = function() {
var e = 0;
for (var t in this._data) {
e += this._data[t].paiDunNum();
}
return e;
};
e.prototype.clean = function() {
this._data = Object.create(null);
};
return e;
}();
o.default = n;
cc._RF.pop();
