// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "43301MDBxtCRbWmI5Q++fY3", "ClubTableSchemeListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonUtils"), r = require("./gContext"), i = require("./EventKeys"), a = function() {
function e(e) {
this._data = {};
this._clubID = 0;
this.init();
this._clubID = e;
}
e.prototype.init = function() {
this._data = {};
};
e.prototype._add = function(e) {
var t = e.id;
if (this._data[t]) ; else {
this._data[t] = e;
r.default.eventUtils.emit(i.default.data_club_scheme_add, {
o: e
});
}
};
e.prototype.update = function(e) {
var t = e.id;
if (this._data[t]) this._data[t] = e; else {
this._add(e);
r.default.eventUtils.emit(i.default.data_club_scheme_update, {
o: e
});
}
};
e.prototype.remove = function(e) {
var t = this._data[e];
if (t) {
delete this._data[e];
r.default.eventUtils.emit(i.default.data_club_scheme_remove, {
o: t
});
} else cc.error("删除了不存在的房间");
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
};
e.prototype.destroy = function() {
this.init();
};
e.prototype.get = function(e) {
return this._data[e];
};
return e;
}();
o.default = a;
cc._RF.pop();
