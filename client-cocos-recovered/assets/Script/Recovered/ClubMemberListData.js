// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3fa53YVB6xPtJgufMgenyT3", "ClubMemberListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./ClubMemberCellData"), r = require("./CommonUtils"), i = require("./gContext"), a = require("./EventKeys"), s = function() {
function e(e) {
this._data = {};
this._count = 0;
this._online = 0;
this._masterUid = -1;
this._clubID = 0;
this._clubID = e;
this._init();
}
e.prototype._init = function() {
this._count = 0;
this._online = 0;
this._data = {};
};
e.prototype._add = function(e) {
var t = e.uid;
if (this._data[t]) cc.error("club menber add error."); else {
this._data[t] = e;
this._count++;
e.onLine && this._online++;
i.default.eventUtils.emit(a.default.data_club_member_add, {
o: e,
clubID: this._clubID
});
}
};
e.prototype.update = function(e) {
var t = e.uid, o = this._data[t];
e.degress === n.eClubMemberDegree.Master && (this._masterUid = e.uid);
if (o) {
e.onLine && !o.onLine && this._online++;
!e.onLine && o.onLine && this._online--;
this._data[t] = e;
i.default.eventUtils.emit(a.default.data_club_member_update, {
o: e,
clubID: this._clubID
});
} else this._add(e);
};
e.prototype.remove = function(e) {
var t = this._data[e];
if (t) {
t.onLine && this._online--;
this._count--;
delete this._data[e];
i.default.eventUtils.emit(a.default.data_club_member_remove, {
o: t,
clubID: this._clubID
});
} else cc.error("删除了不存在的成员");
};
e.prototype.collection = function(e, t) {
return r.default.collection(this._data, e, t);
};
e.prototype.destroy = function() {
this._init();
};
e.prototype.get = function(e) {
return this._data[e];
};
e.prototype.count = function() {
return this._count;
};
e.prototype.onLineCount = function() {
return this._online;
};
e.prototype.clubMaster = function() {
return this.get(this._masterUid);
};
return e;
}();
o.default = s;
cc._RF.pop();
