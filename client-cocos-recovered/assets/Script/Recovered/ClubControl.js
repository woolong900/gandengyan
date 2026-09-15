// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e63d6zJRNhD0YplDe4HjdO3", "ClubControl");
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
var i = require("./ClubMsg"), a = require("./ClubListData"), s = require("./gContext"), l = require("./WindowMgr"), c = require("./WindowConfig"), u = require("./EventKeys"), d = require("./EventUtils"), p = cc._decorator, f = p.ccclass, h = (p.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
this.schedule(this._upateData, 3, cc.macro.REPEAT_FOREVER, 0);
this.schedule(function() {
var e = a.default.focus;
i.default.getClubTableInfo(e, function(e, t) {}, !0);
}, 1, cc.macro.REPEAT_FOREVER, 0);
this.schedule(this._showInvite, 1, cc.macro.REPEAT_FOREVER, 0);
m.clean();
s.default.eventUtils.on(u.default.data_club_focus_change, function() {
m.clean();
}, this, d.eOffType.OnDestroy);
};
t.prototype.onDestroy = function() {
m.clean();
if (a.default.focus > 0) {
a.default.focus = -1;
i.default.leaveClub(null, !0);
}
};
t.getCurClubData = function() {
return a.default.get(a.default.focus);
};
t.prototype._upateData = function() {
var e = a.default.focus;
e > 0 && i.default.getClubMemberInfo(e, function(e, t) {}, !0);
};
t.pushInvteData = function(e) {
m.push(e);
};
t.refreshInbox = function() {
i.default.getClubInviteMsgList(null, !0);
};
t.remove = function(e) {
e ? m.remove(e) : m.clean();
};
t.prototype._showInvite = function() {
if (l.default.isShow(c.eWindowID.ClubInviteTipLayer)) ; else {
var e = m.getInvite();
e && s.default.uiHelper.show(c.eWindowID.ClubInviteTipLayer, e);
}
};
return t = r([ f ], t);
}(cc.Component));
o.default = h;
var m = function() {
function e() {}
e.clean = function() {
this._inviteList = [];
};
e.push = function(e) {
var t = h.getCurClubData();
if (t && t.clubID === e.clubInfo.code) {
for (var o = !0, n = 0, r = this._inviteList.length; n < r; n++) {
if (this._inviteList[n].inviterInfo.code === e.inviterInfo.code) {
cc.log("重复的邀请~");
o = !1;
}
}
if (o) {
this._inviteList.length >= 1 && this._inviteList.shift();
this._inviteList.push(e);
}
}
};
e.remove = function(e) {
for (var t = this._inviteList.length - 1; t >= 0; t--) {
this._inviteList[t].inviterInfo.code == e && this._inviteList.splice(t, 1);
}
};
e.getInvite = function() {
for (var e = h.getCurClubData(), t = 0, o = this._inviteList.length; t < o; t++) {
var n = this._inviteList[t];
if (n.clubInfo.code === e.clubID) {
var r = {
id: n.id,
clubInfo: {
code: n.clubInfo.code,
name: n.clubInfo.name
},
inviterInfo: {
code: n.inviterInfo.code,
name: n.inviterInfo.name
},
roomInfo: {
gameType: n.roomInfo.gameType,
id: n.roomInfo.id,
num: n.roomInfo.num,
param1: n.roomInfo.param1,
param2: n.roomInfo.param2
}
};
this._inviteList = this._inviteList.slice(t + 1);
return r;
}
}
this._inviteList = [];
return null;
};
e._inviteList = [];
return e;
}();
cc._RF.pop();
