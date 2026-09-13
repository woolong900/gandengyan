// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fac6cEX3lhBu4/GIeSODgLw", "ClubMemberAntiAddictionListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonUtils"), r = e("./gContext"), i = e("./EventKeys"), a = e("./ClubMemberAntiAddictionCellData"), s = function() {
function e(e) {
this._data = {};
this._count = 0;
this._online = 0;
this._masterUid = -1;
this._clubID = 0;
this.memberType = a.eClubMemberDegree.Player;
this.fatigueNum = 0;
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
r.default.eventUtils.emit(i.default.data_club_member_add, {
o: e,
clubID: this._clubID
});
}
};
e.prototype.updataClubData = function(e, t) {
this.memberType = e;
this.fatigueNum = t;
};
e.prototype.update = function(e) {
var t = e.uid, o = this._data[t];
e.degress === a.eClubMemberDegree.Master && (this._masterUid = e.uid);
if (o) {
e.onLine && !o.onLine && this._online++;
!e.onLine && o.onLine && this._online--;
this._data[t] = e;
r.default.eventUtils.emit(i.default.data_club_member_update, {
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
r.default.eventUtils.emit(i.default.data_club_member_remove, {
o: t,
clubID: this._clubID
});
} else cc.error("删除了不存在的成员");
};
e.prototype.collection = function(e, t) {
return n.default.collection(this._data, e, t);
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
