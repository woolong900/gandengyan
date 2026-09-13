// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5c28dFokEtKkYUv0i3u5FwO", "ClubManageLayer");
var n = this && this.__extends || function() {
var e = function(t, o) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
})(t, o);
};
return function(t, o) {
e(t, o);
function n() {
this.constructor = t;
}
t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype, new n());
};
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("./BaseComponent"), a = e("./ClubControl"), s = e("./UserData"), l = e("./gContext"), c = e("./SoundUtils"), u = e("./ClubMsg"), d = e("./ClubListData"), p = e("./Constants"), f = e("./WindowConfig"), h = e("./EventUtils"), m = e("./EventKeys"), y = e("./GameConfig"), g = e("./CommonEnum"), _ = cc._decorator, v = _.ccclass, C = _.property, b = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.clubName = null;
t.emptyCheckNode = null;
t.emptyUnCheckNode = null;
t.inviteCheckNode = null;
t.inviteUnCheckNode = null;
t.dyCheckNode = null;
t.dyUnCheckNode = null;
t.playerCannotDismissCheckNode = null;
t.playerCannotDismissUnCheckNode = null;
t.quitClubCheckNode = null;
t.quitClubUnCheckNode = null;
t.AntiAddictionCheckNode = null;
t.AntiAddictionUnCheckNode = null;
t.personalRecordCheckNode = null;
t.personalRecordUnCheckNode = null;
t.clubNotice = null;
t.exitNode = null;
t.exitLabel = null;
t.maskNode = null;
t.dyTipNode = null;
t.layoutBox = null;
t.antiAddictionCheckboxNode = null;
t.personalRecordCheckboxNode = null;
t._isRefreshAntiAddication = !1;
t._antiAddictionNum = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
l.default.eventUtils.on([ m.default.data_club_setting_update, m.default.data_club_focus_change ], function() {
e._uiDirty = !0;
}, this, h.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.setData = function(e) {
this._isRefreshAntiAddication = !0;
this._antiAddictionNum = e;
};
t.prototype._updateUI = function() {
var e = a.default.getCurClubData();
if (e) {
this.clubName.string = e.clubName;
var t = e.memberList().get(s.default.uid);
if (t.permissionMaster()) {
this.exitLabel.string = "解散俱乐部";
this.exitNode.active = !0;
} else {
this.exitNode.active = !0;
this.exitLabel.string = "退出俱乐部";
}
this.emptyCheckNode.active = !e.enableEmptyRoomLast;
this.emptyUnCheckNode.active = e.enableEmptyRoomLast;
this.inviteCheckNode.active = !e.enableRoomInvite;
this.inviteUnCheckNode.active = e.enableRoomInvite;
this.dyCheckNode.active = e.enableClosed;
this.dyUnCheckNode.active = !e.enableClosed;
this.playerCannotDismissCheckNode.active = e.enablePlayerNoDismiss;
this.playerCannotDismissUnCheckNode.active = !e.enablePlayerNoDismiss;
this.quitClubCheckNode.active = e.enableQuitApply;
this.quitClubUnCheckNode.active = !e.enableQuitApply;
this.personalRecordCheckNode.active = e.enablePersonRecord;
this.personalRecordUnCheckNode.active = !e.enablePersonRecord;
if (y.default.area() === g.eArea.QJ) {
var o = e.enableAntiAddiction;
this._isRefreshAntiAddication && (o = this._antiAddictionNum);
if (t.permissionMaster()) if (!1 === o) {
this.antiAddictionCheckboxNode.active = !o;
this.AntiAddictionCheckNode.active = o;
this.AntiAddictionUnCheckNode.active = !o;
} else if (!0 === o) {
this.antiAddictionCheckboxNode.active = o;
this.AntiAddictionCheckNode.active = o;
this.AntiAddictionUnCheckNode.active = !o;
} else if (1 == (1 & o) && 2 == (2 & o)) {
this.antiAddictionCheckboxNode.active = !0;
var n = 4 == (4 & o);
this.AntiAddictionCheckNode.active = n;
this.AntiAddictionUnCheckNode.active = !n;
} else this.antiAddictionCheckboxNode.active = !1; else this.antiAddictionCheckboxNode.active = !1;
var r = this.layoutBox.children;
this.antiAddictionCheckboxNode.active && this.personalRecordCheckboxNode.active ? r.forEach(function(e, t) {
e.height = 60;
}) : r.forEach(function(e, t) {
e.height = 90;
});
}
this.clubNotice.string = e.notice || "";
} else l.default.uiHelper.remove(this);
};
t.prototype.onClickRename = function() {
c.default.clickBtn();
l.default.uiHelper.show(f.eWindowID.ClubRenameLayer);
};
t.prototype.onClickEmpty = function() {
c.default.clickBtn();
var e = this._curClubData();
e.emptyRoomLast = !e.emptyRoomLast;
this._editClub(e);
};
t.prototype.onClickInvite = function() {
c.default.clickBtn();
var e = this._curClubData();
e.roomInvite = !e.roomInvite;
this._editClub(e);
};
t.prototype.onClickClosed = function() {
c.default.clickBtn();
var e = this._curClubData();
e.closed = !e.closed;
this._editClub(e);
};
t.prototype.onClickAntiAddiction = function() {
c.default.clickBtn();
var e = this._curClubData(), t = e.antiAddiction, o = t;
this._isRefreshAntiAddication = !1;
!0 === t || !1 === t || (o = 1 == (1 & t) && 2 == (2 & t) && 4 == (4 & t));
e.antiAddiction = !o;
this._editClub(e);
};
t.prototype.onClickPersonRecord = function() {
c.default.clickBtn();
var e = this._curClubData();
e.member_Record = !e.member_Record;
this._editClub(e);
};
t.prototype.onClickPlayerDismiss = function() {
c.default.clickBtn();
var e = this._curClubData();
e.playerNodismissRoom = !e.playerNodismissRoom;
this._editClub(e);
};
t.prototype.onClickQuitClub = function() {
c.default.clickBtn();
var e = this._curClubData();
e.quitApply = !e.quitApply;
this._editClub(e);
};
t.prototype.onClickClosedDetails = function() {
c.default.clickBtn();
this.maskNode.active = !0;
this.dyTipNode.active = !0;
};
t.prototype.onClickMask = function() {
c.default.clickBtn();
this.maskNode.active = !1;
};
t.prototype.onClickSave = function() {
c.default.clickBtn();
var e = this._curClubData(), t = this.clubNotice.string;
t = t.trim();
if (e.hasOwnProperty("announcement") && e.announcement !== t) if (t.length > 128) l.default.uiHelper.showTip("俱乐部公告输入过长，请重新编辑~"); else {
e.announcement = t;
this._editClub(e);
} else cc.error("公告没做改变哦~");
};
t.prototype.onDissolveClub = function() {
var e = this;
c.default.clickBtn();
var t = a.default.getCurClubData();
t.memberList().get(s.default.uid).permissionMaster() ? l.default.msgBox.showNoClose("解散操作成功后，将不可撤销，您确定解散您的俱乐部吗？", function() {
u.default.clubDisimiss(t.id, function(t, o) {
if (o) l.default.uiHelper.showTipNetError(); else if (0 === t.res.error) {
l.default.uiHelper.remove(e);
e._reLoadClub();
} else l.default.uiHelper.showTip(t.res.what);
});
}) : l.default.msgBox.show("退出操作不可取消，确定退出俱乐部吗？", function() {
u.default.quitClub(t.id, function(t, o) {
if (o) l.default.uiHelper.showTipNetError(); else if (0 === t.res.error) {
l.default.uiHelper.remove(e);
e._reLoadClub();
} else l.default.uiHelper.showTip(t.res.what);
});
});
};
t.prototype._curClubData = function() {
var e = a.default.getCurClubData();
return e.notice === this.clubNotice.string ? {
id: e.id,
emptyRoomLast: e.enableEmptyRoomLast,
roomInvite: e.enableRoomInvite,
closed: e.enableClosed,
playerNodismissRoom: e.enablePlayerNoDismiss,
quitApply: e.enableQuitApply,
antiAddiction: e.enableAntiAddiction,
member_Record: e.enablePersonRecord
} : {
id: e.id,
announcement: e.notice,
emptyRoomLast: e.enableEmptyRoomLast,
roomInvite: e.enableRoomInvite,
closed: e.enableClosed,
playerNodismissRoom: e.enablePlayerNoDismiss,
quitApply: e.enableQuitApply,
antiAddiction: e.enableAntiAddiction,
member_Record: e.enablePersonRecord
};
};
t.prototype._editClub = function(e) {
var t = this;
u.default.edit(e, function(e, o) {
if (o) ; else if (0 === e.res.error) l.default.uiHelper.showTip("修改成功~"); else {
l.default.uiHelper.showTip(e.res.what);
t.antiAddictionCheckboxNode && t.antiAddictionCheckboxNode.active && u.default.getClubListCb(function(e, o) {
o ? l.default.uiHelper.showTipNetError() : 0 === e.res.error && t._updateUI();
}, !0);
}
});
};
t.prototype._reLoadClub = function() {
u.default.getClubList(function(e, t) {
if (t) l.default.uiHelper.showTipNetError(); else if (0 === e.res.error) if (d.default.haveClub()) if (d.default.get(d.default.focus)) cc.log("当前俱乐部还在～"); else {
var o = d.default.collection(), n = parseInt(o[0]);
u.default.getClubData(n, function(e, t) {
t ? l.default.uiHelper.showTipNetError() : 0 === e.error || l.default.msgBox.showOnlyOk("俱乐部数据异常～", function() {
l.default.uiHelper.loadScene(p.default.HallSceneName);
});
});
} else l.default.uiHelper.loadScene(p.default.HallSceneName);
});
};
r([ C(cc.Label) ], t.prototype, "clubName", void 0);
r([ C(cc.Node) ], t.prototype, "emptyCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "emptyUnCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "inviteCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "inviteUnCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "dyCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "dyUnCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "playerCannotDismissCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "playerCannotDismissUnCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "quitClubCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "quitClubUnCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "AntiAddictionCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "AntiAddictionUnCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "personalRecordCheckNode", void 0);
r([ C(cc.Node) ], t.prototype, "personalRecordUnCheckNode", void 0);
r([ C(cc.EditBox) ], t.prototype, "clubNotice", void 0);
r([ C(cc.Node) ], t.prototype, "exitNode", void 0);
r([ C(cc.Label) ], t.prototype, "exitLabel", void 0);
r([ C(cc.Node) ], t.prototype, "maskNode", void 0);
r([ C(cc.Node) ], t.prototype, "dyTipNode", void 0);
r([ C(cc.Node) ], t.prototype, "layoutBox", void 0);
r([ C(cc.Node) ], t.prototype, "antiAddictionCheckboxNode", void 0);
r([ C(cc.Node) ], t.prototype, "personalRecordCheckboxNode", void 0);
return t = r([ v ], t);
}(i.default);
o.default = b;
cc._RF.pop();
