// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "07ef8hEX2RGbKfZk6OAL0Yn", "ClubInfoTopPanal");
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
var i = e("./ClubControl"), a = e("./ClubListData"), s = e("./gContext"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./SoundUtils"), d = e("./ExUtils"), p = e("./WindowConfig"), f = e("./Constants"), h = e("./StringUtils"), m = e("./UserData"), y = e("./ClubMsg"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._memberDirty = !1;
t._tableDirty = !1;
t.clubName = null;
t.clubId = null;
t.notice = null;
t.memberLabel = null;
t.tableLabel = null;
t.cardLabel = null;
t.btnScheme = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
s.default.eventUtils.on([ l.default.data_club_member_add, l.default.data_club_member_update, l.default.data_club_member_remove ], function(t, o) {
o.clubID === a.default.focus && (e._memberDirty = !0);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_club_table_add, l.default.data_club_table_update, l.default.data_club_table_remove ], function(t, o) {
o.clubID === a.default.focus && (e._tableDirty = !0);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_club_focus_change, function() {
e._resetNotice();
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_club_setting_notice_change, function(t) {
var o = a.default.focus, n = a.default.get(o);
e.notice.string = h.default.trimNotcie(n.notice);
}, this);
s.default.eventUtils.on(l.default.data_club_setting_name_change, function() {
e.clubName.string = i.default.getCurClubData().clubName;
}, this, c.eOffType.OnDestroy);
};
t.prototype._updateUI = function() {
var e = a.default.focus, t = a.default.get(e);
this.clubName.string = t.clubName;
this.clubId.string = "ID:" + t.clubID;
this.notice.string = h.default.trimNotcie(t.notice);
this._updateMember();
this._updateTabel();
this.cardLabel.string = "" + t.cardNum;
this.btnScheme.active = !0;
};
t.prototype._updateMember = function() {
var e = a.default.focus, t = a.default.get(e).memberList();
if (t) {
var o = t.count(), n = t.onLineCount();
this.memberLabel.string = "在线：" + n + "/" + o;
}
};
t.prototype._updateTabel = function() {
var e = a.default.focus, t = a.default.get(e).tableList();
this.tableLabel.string = "桌子：" + t.count();
};
t.prototype._resetNotice = function() {
var e = this.notice.node;
e.x = e.getParent().width / 2;
};
t.prototype.update = function() {
var e = this.notice.node;
e.x -= 1;
e.x < -e.width - e.getParent().width / 2 && this._resetNotice();
if (this._uiDirty) {
this._uiDirty = !1;
this._tableDirty = !1;
this._memberDirty = !1;
this._updateUI();
}
if (this._tableDirty) {
this._tableDirty = !1;
this._updateTabel();
}
if (this._memberDirty) {
this._memberDirty = !1;
this._updateMember();
}
};
t.prototype.onClickCopy = function() {
u.default.clickBtn();
var e = a.default.focus, t = a.default.get(e);
d.default.copyText(t.clubID);
s.default.uiHelper.showTip("复制成功！");
};
t.prototype.onClickBack = function() {
u.default.clickBtn();
s.default.uiHelper.loadScene(f.default.HallSceneName);
};
t.prototype.onClickClubDetails = function() {
u.default.clickBtn();
var e = a.default.focus, t = a.default.get(e);
t && t.memberList().get(m.default.uid).permissionAdmin() ? y.default.getClubListCb(function(t, o) {
o ? s.default.uiHelper.showTipNetError() : 0 === t.res.error && t.clubs.forEach(function(t) {
t.id === e && s.default.uiHelper.show(p.eWindowID.ClubManageLayer, t.antiAddiction);
});
}) : s.default.uiHelper.show(p.eWindowID.ClubDetailsLayer);
};
t.prototype.onClickScheme = function() {
u.default.clickBtn();
s.default.uiHelper.show(p.eWindowID.ClubTableSchemeLayer);
};
r([ v(cc.Label) ], t.prototype, "clubName", void 0);
r([ v(cc.Label) ], t.prototype, "clubId", void 0);
r([ v(cc.Label) ], t.prototype, "notice", void 0);
r([ v(cc.Label) ], t.prototype, "memberLabel", void 0);
r([ v(cc.Label) ], t.prototype, "tableLabel", void 0);
r([ v(cc.Label) ], t.prototype, "cardLabel", void 0);
r([ v(cc.Node) ], t.prototype, "btnScheme", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
