// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0901aNCJytNUZhl1T7l2zr4", "ClubInviteMsgListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonUtils"), r = e("./gContext"), i = e("./EventKeys"), a = new (function() {
function e() {
this._data = {};
this._count = 0;
this.init();
}
e.prototype.init = function() {
this._count = 0;
this._data = {};
};
e.prototype._add = function(e) {
var t = e.id;
if (this._data[t]) cc.error("add error."); else {
this._data[t] = e;
this._count++;
r.default.eventUtils.emit(i.default.data_club_invite_msg_add);
}
};
e.prototype.update = function(e) {
var t = e.id;
if (this._data[t]) {
this._data[t] = e;
r.default.eventUtils.emit(i.default.data_club_invite_msg_update);
} else this._add(e);
};
e.prototype.remove = function(e) {
if (this._data[e]) {
this._count--;
delete this._data[e];
r.default.eventUtils.emit(i.default.data_club_invite_msg_remove);
} else cc.error("删除了不存在的邀请信息");
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
e.prototype.count = function() {
return this._count;
};
return e;
}())();
o.default = a;
cc._RF.pop();
