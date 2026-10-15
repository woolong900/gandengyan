// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "edd4cxvrxFGRLJEC4r4ffTH", "MemberAntiAddictionTr");
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
var i = require("./gContext"), a = require("./Image"), s = require("./WindowConfig"), l = require("./SoundUtils"), c = require("./StringUtils"), u = require("./ClubMsg"), d = require("./ClubControl"), p = require("./EventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uid = 0;
t._memberData = null;
t.avatar = null;
t.nameLabel = null;
t.idLabel = null;
t.degreeLabel = null;
t.stateLabel = null;
t.timeLabel = null;
t.btnNode = null;
t.memberInfoPre = null;
return t;
}
t.prototype.setData = function(e, t) {
this._memberData = t;
this._uid = t.userId;
this.idLabel.string = t.uid + "";
this.degreeLabel.string = t.degressStr();
this.stateLabel.string = t.getFatigueNum() / 100 + "";
this.timeLabel.string = t.timeStr();
this.avatar.url = t.avatarUrl;
this.nameLabel.string = c.default.clip(t.nickname, 6);
};
t.prototype.onClick = function() {
var e = this;
l.default.clickBtn();
i.default.uiHelper.show(s.eWindowID.MsgBoxLayer, "<color=#5D461A>解除防沉迷，该玩家战绩将被清空</c>", "解除防沉迷", function() {
var t = {
clubId: d.default.getCurClubData().id,
userId: e._uid,
status: 1
};
u.default.memberReleaseProhibited(t, function(e, t) {
0 === e.error ? i.default.eventUtils.emit(p.default.data_club_member_manager_update) : i.default.uiHelper.showTip(e.what);
});
});
};
r([ m(a.default) ], t.prototype, "avatar", void 0);
r([ m(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ m(cc.Label) ], t.prototype, "idLabel", void 0);
r([ m(cc.Label) ], t.prototype, "degreeLabel", void 0);
r([ m(cc.Label) ], t.prototype, "stateLabel", void 0);
r([ m(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ m(cc.Node) ], t.prototype, "btnNode", void 0);
r([ m(cc.Prefab) ], t.prototype, "memberInfoPre", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
