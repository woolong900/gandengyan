// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "120a4TXdDtKhYcKM1czL6FB", "GameRecordListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonUtils"), r = function() {
function e() {
this.totalCount = 0;
this._data = null;
this._belongClub = 0;
this._count = 0;
this._data = Object.create(null);
this._count = 0;
}
e.prototype.add = function(e) {
var t = e.id;
if (this._data[t]) cc.error("site add error."); else {
this._data[t] = e;
this._count++;
}
};
e.prototype.update = function(e) {
var t = e.id;
this._data[t] ? this._data[t] = e : this.add(e);
};
Object.defineProperty(e.prototype, "belongClub", {
get: function() {
return this._belongClub;
},
set: function(e) {
this._belongClub = e || 0;
},
enumerable: !0,
configurable: !0
});
e.prototype.destroy = function() {
this._data = {};
};
e.prototype.get = function(e) {
return this._data[e];
};
e.timerSort = function(e, t) {
return t.time > e.time ? 1 : -1;
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
};
e.prototype.count = function() {
return this._count;
};
return e;
}();
o.default = r;
cc._RF.pop();
