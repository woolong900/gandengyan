// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8342aLlLiNLzbfUFfFAxM5o", "ClubTableListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./gContext"), r = e("./EventKeys"), i = e("./CommonUtils"), a = function() {
function e(e) {
this._data = {};
this._count = 0;
this._clubID = 0;
this._init();
this._clubID = e;
}
e.prototype._init = function() {
this._count = 0;
this._data = {};
};
e.prototype._add = function(e) {
var t = e.id;
if (this._data[t]) cc.error("club table add error."); else {
this._data[t] = e;
this._count++;
n.default.eventUtils.emit(r.default.data_club_table_add, {
o: e,
clubID: this._clubID
});
}
};
e.prototype.update = function(e) {
var t = e.id;
if (this._data[t]) {
this._data[t] = e;
n.default.eventUtils.emit(r.default.data_club_table_update, {
o: e,
clubID: this._clubID
});
} else this._add(e);
};
e.prototype.remove = function(e) {
var t = this._data[e];
if (t) {
this._count--;
delete this._data[e];
n.default.eventUtils.emit(r.default.data_club_table_remove, {
o: t,
clubID: this._clubID
});
} else cc.error("删除了不存在的房间");
};
e.prototype.collection = function(e, t) {
return i.default.collection(this._data, e, t);
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype.destroy = function() {
this._init();
};
e.prototype.count = function() {
return this._count;
};
return e;
}();
o.default = a;
cc._RF.pop();
