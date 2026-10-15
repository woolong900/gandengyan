// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bc3bdJGIn1ACph830zcXxe2", "ClubMsg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./GameConn"), r = require("./gContext"), i = require("./ClubCellData"), a = require("./ClubListData"), s = require("./ClubMemberCellData"), l = require("./ClubTableCellData"), c = require("./ClubMemberListData"), u = require("./EventKeys"), d = require("./ClubTableSchemeCellData"), p = require("./ClubInviteMsgListData"), f = require("./ClubInviteMsgCellData"), h = require("./ClubIsolateListData"), m = require("./ClubIsolateGroupData"), y = require("./ClubApplyListData"), g = require("./ClubApplyCellData"), _ = require("./ClubQuitRecordListData"), v = require("./ClubQuitRecordCellData"), C = require("./ClubInviteUserListData"), b = require("./ClubInviteUserCellData"), D = require("./ClubRecordListData"), S = require("./ClubRecordCellData"), w = require("./ClubMemberAntiAddictionListData"), O = require("./ClubMemberAntiAddictionCellData"), P = require("./ClubAccumulatedRecordListData"), I = require("./ClubAccumulatedRecordCellData"), R = require("./ClubControl"), k = require("./ClubOpRecordListData"), j = require("./ClubOpRecordCellData"), L = require("./ClubMyRecordListData"), U = require("./ClubMyRecordCellData"), N = function() {
function e() {}
e.prototype.getClubList = function(e, t) {
void 0 === t && (t = !1);
n.default.sendMsg(113, {}, function(t, o, n) {
if (n) e(t, n); else {
if (0 === t.res.error) {
a.default.destroy();
for (var s = t.clubs || [], l = 0, c = s.length; l < c; l++) {
var d = s[l], p = new i.default(d);
a.default.update(p);
}
r.default.eventUtils.emit(u.default.data_club_list_change);
}
e(t, n);
}
}, t);
};
e.prototype.getClubListCb = function(e, t) {
void 0 === t && (t = !1);
n.default.sendMsg(113, {}, function(t, o, n) {
if (n) e(t, n); else {
if (0 === t.res.error) {
var r = R.default.getCurClubData().clubID;
t.clubs.forEach(function(e) {
if (e.code === r) {
var t = e.antiAddiction, o = !1;
1 == (1 & t) && 2 == (2 & t) && 4 == (4 & t) && (o = !0);
a.default.setAnitOff(a.default.focus, o);
}
});
e(t, n);
}
e(t, n);
}
}, t);
};
e.prototype.quitClub = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(115, o, function(e, o, n) {
t(e, n || null);
}, !1);
};
e.prototype.leaveClub = function(e, t) {
void 0 === t && (t = !1);
n.default.sendMsg(116, null, function(t, o, n) {
n ? e && e(t, n) : e && e(t, null);
}, t);
};
e.prototype.joinClub = function(e, t) {
n.default.sendMsg(117, e, function(e, o, n) {
if (n) t(e, n); else {
e.res.error && r.default.uiHelper.showTip(e.res.what);
t(e, null);
}
}, !1);
};
e.prototype.getClubInviteMsgList = function(e, t) {
void 0 === t && (t = !1);
n.default.sendMsg(118, {}, function(t, o, n) {
if (n) e && e(null, n); else {
if (0 === t.res.error) {
p.default.destroy();
for (var r = 0, i = t.invites.length; r < i; r++) {
var a = t.invites[r], s = new f.default(a);
p.default.update(s);
}
}
e && e(t.res, null);
}
}, t);
};
e.prototype.agreeInvite = function(e, t) {
var o = this, r = {
id: e
};
n.default.sendMsg(119, r, function(n, r, i) {
if (i) t(n.res, i); else {
if (0 === n.res.error) {
p.default.remove(e);
o.getClubList(function() {}, !0);
}
t(n.res, null);
}
}, !1);
};
e.prototype.disagreeInvite = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(120, o, function(o, n, r) {
if (r) t(o.res, r); else {
0 === o.res.error && p.default.remove(e);
t(o.res, null);
}
}, !1);
};
e.prototype.getClubMemberAntiAddictionInfo = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
clubId: e
};
n.default.sendMsg(161, r, function(o, n, r) {
if (r) t(o, r); else {
if (0 === o.res.error) {
var i = o.fatigueNum, s = a.default.get(e).memberAntiAddictionList(), l = a.default.get(e).curPlayerMemberType(), c = s.collection(), u = {};
s.updataClubData(l, i);
for (var d = 0, p = o.members.length; d < p; d++) {
var f = new O.default(o.members[d]);
s.update(f);
u[f.uid] = !0;
}
for (d = 0, p = c.length; d < p; d++) {
var h = parseInt(c[d]);
if (!u[h]) {
var m = s.get(h);
m ? s.remove(m.uid) : cc.error("remove error.");
}
}
}
t(o, null);
}
}, o);
};
e.prototype.getClubMemberAntiAddictionInfoCb = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
clubId: e
};
n.default.sendMsg(161, r, function(o, n, r) {
if (r) t(null, r); else if (0 === o.res.error) {
var i = o.fatigueNum, s = new w.default(e), l = a.default.get(e).curPlayerMemberType();
s.updataClubData(l, i);
for (var c = 0, u = o.members.length; c < u; c++) {
var d = new O.default(o.members[c]);
s.update(d);
}
t(s, null);
} else t(null, null);
}, o);
};
e.prototype.memberReleaseProhibited = function(e, t) {
var o = e;
n.default.sendMsg(162, o, function(e, o, n) {
t(e.res, n || null);
}, !1);
};
e.prototype.clubEditFatigueVal = function(e, t) {
var o = e;
n.default.sendMsg(160, o, function(e, o, n) {
t(e.res, n || null);
}, !1);
};
e.prototype.getClubMemberInfo = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
clubId: e
};
n.default.sendMsg(121, r, function(o, n, r) {
if (r) t(o, r); else {
if (0 === o.res.error) {
for (var i = a.default.get(e).memberList(), l = i.collection(), c = {}, u = 0, d = o.members.length; u < d; u++) {
var p = new s.default(o.members[u]);
i.update(p);
c[p.uid] = !0;
}
for (u = 0, d = l.length; u < d; u++) {
var f = parseInt(l[u]);
if (!c[f]) {
var h = i.get(f);
h ? i.remove(h.uid) : cc.error("remove error.");
}
}
}
t(o, null);
}
}, o);
};
e.prototype.getClubMemberInfoCb = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
clubId: e
};
n.default.sendMsg(121, r, function(o, n, r) {
if (r) t(null, r); else if (0 === o.res.error) {
for (var i = new c.default(e), a = 0, l = o.members.length; a < l; a++) {
var u = new s.default(o.members[a]);
i.update(u);
}
t(i, null);
} else t(null, null);
}, o);
};
e.prototype.getClubTableInfo = function(e, t, o) {
void 0 === o && (o = !1);
var request = {
clubId: e
};
n.default.sendMsg(122, request, function(response, unused, networkError) {
if (networkError) t(response, networkError); else {
if (0 === response.res.error) {
var tableList = a.default.get(e).tableList();
tableList.destroy();
for (var roomIndex = 0, roomCount = response.rooms.length; roomIndex < roomCount; roomIndex++) {
var roomData = new l.default(response.rooms[roomIndex]);
tableList.update(roomData);
}
r.default.eventUtils.emit(u.default.data_club_table_scheme_update);
}
t(response, null);
}
}, o);
};
e.prototype.closeTable = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
id: e
};
n.default.sendMsg(123, r, function(e, o, n) {
t(e, n || null);
}, o);
};
e.prototype.getSchemeList = function(e, t, o) {
void 0 === o && (o = !1);
var r = {
clubId: e
};
n.default.sendMsg(124, r, function(o, n, r) {
if (r) t && t(o, r); else {
if (0 === o.res.error) {
var i = a.default.get(e).schemeList();
i.destroy();
for (var s = 0, l = o.data.length; s < l; s++) {
var c = new d.default(o.data[s]);
i.update(c);
}
}
t && t(o, null);
}
}, o);
};
e.prototype.getClubData = function(e, t) {
var o = this, n = 3, i = !1, s = null, l = function(e, o) {
if (i) return;
if (o) {
i = !0;
r.default.uiHelper.removeLoading();
t && t(null, o);
} else if (!e || !e.res || 0 !== e.res.error) {
i = !0;
r.default.uiHelper.removeLoading();
t && t(e && e.res || null, null);
} else if (0 === --n) {
i = !0;
a.default.focus = u;
r.default.uiHelper.removeLoading();
t && t(s.res, null);
}
}, u = e;
r.default.uiHelper.showLoading();
o.getClubMemberInfo(e, function(e, t) {
l(e, t);
}, !0);
o.getClubTableInfo(e, function(e, t) {
l(e, t);
}, !0);
o.getSchemeList(e, function(e, t) {
s = e;
l(e, t);
}, !0);
};
e.prototype.getIsolateList = function(e, t, o) {
void 0 === o && (o = !0);
var i = {
clubId: e
};
n.default.sendMsg(128, i, function(e, o, n) {
if (n) t(null, n); else {
if (0 === e.res.error) {
h.default.destroy();
for (var i = 0, a = e.data.length; i < a; i++) {
var s = e.data[i], l = new m.default(s);
h.default.update(l);
}
r.default.eventUtils.emit(u.default.data_club_isolategroup_update);
}
t(e, null);
}
}, o);
};
e.prototype.addIsolateGroup = function(e, t) {
var o = {
clubId: e
};
n.default.sendMsg(129, o, function(e, o, n) {
t(e, n || null);
}, !1);
};
e.prototype.delIsolateGroup = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(130, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
e.prototype.addIsolate = function(e, t, o) {
var r = {
groupId: e,
userId: t
};
n.default.sendMsg(131, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.delIsolate = function(e, t, o) {
var r = {
groupId: e,
userId: t
};
n.default.sendMsg(132, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubMemberFreeze = function(e, t, o, r) {
var i = {
clubId: e,
userId: t,
status: o
};
n.default.sendMsg(133, i, function(e, t, o) {
o ? r(null, o) : r(e, null);
}, !1);
};
e.prototype.clubMemberRemark = function(e, t, o, r) {
var i = {
clubId: e,
userId: t,
remark: o
};
n.default.sendMsg(134, i, function(e, t, o) {
o ? r(null, o) : r(e, null);
}, !1);
};
e.prototype.clubMemberSetRole = function(e, t, o, r) {
var i = {
clubId: e,
userId: t,
role: o
};
n.default.sendMsg(135, i, function(e, t, o) {
o ? r(null, o) : r(e, null);
}, !1);
};
e.prototype.clubMemberKickout = function(e, t, o) {
var r = {
clubId: e,
userId: t
};
n.default.sendMsg(136, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubApplyList = function(e, t) {
var o = {
clubId: e
};
n.default.sendMsg(137, o, function(e, o, n) {
if (n) t(null, n); else {
y.default.destroy();
for (var r = 0, i = e.data.length; r < i; r++) {
var a = e.data[r], s = new g.default(a);
y.default.update(s);
}
t(e, null);
}
}, !1);
};
e.prototype.clubApplyAgree = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(138, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
e.prototype.clubApplyReject = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(139, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
e.prototype.clubApplyInviteUserSearch = function(e, t, o) {
var r = {
clubId: e,
userCode: t
};
n.default.sendMsg(140, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubApplyInvite = function(e, t, o) {
var r = {
clubId: e,
userId: t
};
n.default.sendMsg(141, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubQuitList = function(e, t) {
var o = {
clubId: e
};
n.default.sendMsg(142, o, function(e, o, n) {
if (n) t(null, n); else {
_.default._destroy();
for (var r = 0; r < e.data.length; r++) {
var i = e.data[r], a = new v.default(i);
_.default._update(a);
}
t(e, null);
}
}, !1);
};
e.prototype.clubInviteUserList = function(e, t) {
var o = {
clubId: e
};
n.default.sendMsg(143, o, function(e, o, n) {
if (n) t(null, n); else {
C.default.destroy();
for (var r = 0; r < e.data.length; r++) {
var i = e.data[r], a = new b.default(i);
C.default._update(a);
}
t(e, null);
}
}, !1);
};
e.prototype.clubInviteSubUser = function(e, t, o) {
var r = {
clubId: e,
userId: t
};
n.default.sendMsg(144, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubRecordStatisticsDayList = function(e, t, o, r, i, a) {
var s = {
clubId: e,
userCode: t,
date: o,
startDate: r,
endDate: i
};
n.default.sendMsg(146, s, function(e, t, o) {
if (o) a(null, o); else {
D.default._destroy();
for (var n = 0; n < e.data.length; n++) {
var r = e.data[n], i = new S.default(r, n);
D.default._update(i);
}
a(e, null);
}
}, !1);
};
e.prototype.clubGameUserDayRecordList = function(e, t, o) {
var r = {
clubId: e,
time: t
};
n.default.sendMsg(166, r, function(e, t, n) {
if (n) o(null, n); else {
L.default._destroy();
for (var r = 0; r < e.data.length; r++) {
var i = e.data[r], a = new U.default(i, r);
L.default._update(a);
}
o(e, null);
}
}, !1);
};
e.prototype.clubAccumulatedRecordList = function(e, t) {
var o = {
clubId: e
};
n.default.sendMsg(163, o, function(e, o, n) {
if (n) t(null, n); else {
P.default._destroy();
if (e.members && e.members.length > 0) for (var r = 0; r < e.members.length; r++) {
var i = e.members[r], a = new I.default(i, r);
P.default._update(a);
}
t(e, null);
}
}, !1);
};
e.prototype.clubOpRecordList = function(e, t) {
var o = {
clubId: e
};
n.default.sendMsg(164, o, function(e, o, n) {
if (n) t(null, n); else {
k.default._destroy();
for (var r = 0; r < e.data.length; r++) {
var i = e.data[r], a = new j.default(i, r);
k.default._update(a);
}
t(e, null);
}
}, !1);
};
e.prototype.clubCreate = function(e, t) {
var o = {
name: e
};
n.default.sendMsg(147, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
e.prototype.clubGameSchemeAdd = function(e, t, o, i) {
var a = r.default.gameLogic(o.index).roomConfig2Param(o, e), s = {
clubId: e,
name: "",
gameType: a.gameType,
num: a.num,
param1: a.param1,
param2: a.param2
};
n.default.sendMsg(149, s, function(e, t, o) {
o ? i(null, o) : i(e, null);
}, !1);
};
e.prototype.clubGameSchemeEdit = function(e, t, o, i, a, s) {
var l = r.default.gameLogic(a.index).roomConfig2Param(a, o), c = {
id: e,
name: "",
gameType: l.gameType,
num: l.num,
param1: l.param1,
param2: l.param2,
color: i
};
n.default.sendMsg(150, c, function(e, t, o) {
o ? s(null, o) : s(e, null);
}, !1);
};
e.prototype.clubGameSchemeAuto = function(e, t, o) {
var r = {
id: e,
status: t
};
n.default.sendMsg(151, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubGameSchemeDelete = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(152, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
e.prototype.clubAgentInfo = function(e, t) {
void 0 === t && (t = !1);
n.default.sendMsg(153, null, function(t, o, n) {
n ? e(null, n) : e(t, null);
}, t);
};
e.prototype.getInviteList = function(e) {
n.default.sendMsg(154, {}, function(t, o, n) {
n ? e(null, n) : e(t, null);
}, !1);
};
e.prototype.sendInvite = function(e, t) {
var o = {
userId: e
};
n.default.sendMsg(155, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
e.prototype.rejectInvite = function(e, t, o) {
var r = {
id: e,
blockClub: t
};
n.default.sendMsg(156, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.edit = function(e, t) {
var o = e.id, r = {
id: o,
name: e.name,
announcement: e.announcement,
emptyRoomLast: e.emptyRoomLast,
roomInvite: e.roomInvite,
closed: e.closed,
playerNodismissRoom: e.playerNodismissRoom,
quitApply: e.quitApply,
antiAddiction: e.antiAddiction,
member_Record: e.member_Record
};
n.default.sendMsg(145, r, function(e, n, i) {
if (i) t(null, i); else {
if (0 === e.res.error) {
var s = a.default.get(o);
s && s.update(r);
}
t(e, null);
}
}, !1);
};
e.prototype.clubRoomMemberKickout = function(e, t, o) {
var r = {
id: e,
userCode: t
};
n.default.sendMsg(157, r, function(e, t, n) {
n ? o(null, n) : o(e, null);
}, !1);
};
e.prototype.clubDisimiss = function(e, t) {
var o = {
id: e
};
n.default.sendMsg(158, o, function(e, o, n) {
n ? t(null, n) : t(e, null);
}, !1);
};
return e;
}();
o.ClubMsg = N;
var T = new N();
o.default = T;
cc._RF.pop();
