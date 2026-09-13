// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c3e4cYdeflOBbdAGPvk+gQ0", "ClubListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonUtils"), r = e("./gContext"), i = e("./EventKeys"), a = new (function() {
function e() {
this._data = {};
this._count = 0;
this._focus = 0;
this.init();
}
e.prototype.haveClub = function() {
return this._count > 0;
};
e.prototype.init = function() {
this._count = 0;
this._focus = 0;
this._data = {};
};
Object.defineProperty(e.prototype, "focus", {
get: function() {
return this._focus;
},
set: function(e) {
this._focus = e;
r.default.eventUtils.emit(i.default.data_club_focus_change);
},
enumerable: !0,
configurable: !0
});
e.prototype._add = function(e) {
var t = e.id;
if (this._data[t]) cc.error("site add error."); else {
this._data[t] = e;
this._count++;
}
};
e.prototype.update = function(e) {
var t = e.id;
this._data[t] ? this._data[t] = e : this._add(e);
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
};
e.prototype.destroy = function() {
this.init();
};
e.prototype.setAnitOff = function(e, t) {
this._data[e].enableAntiAddiction = t;
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype.count = function() {
return this._count;
};
return e;
}())();
o.default = a;
cc._RF.pop();
