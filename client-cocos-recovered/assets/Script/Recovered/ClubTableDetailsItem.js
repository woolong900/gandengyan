// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6c4ediNdyFG04WW5tuucY8P", "ClubTableDetailsItem");
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
var i = e("./SoundUtils"), a = e("./Image"), s = e("./ClubControl"), l = e("./StringUtils"), c = e("./UserData"), u = e("./Storage"), d = e("./ClubListData"), p = e("./gContext"), f = e("./ClubMsg"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._roomId = 0;
t._uid = 0;
t.hasPlayerNode = null;
t.noPlayerNode = null;
t.nameLabel = null;
t.idLabel = null;
t.avatar = null;
t.kickNode = null;
t.onlineNode = null;
t.offlineNode = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this._roomId = t;
if (e) {
this._uid = e;
var n = s.default.getCurClubData().memberList().get(e);
if (n) {
this.hasPlayerNode.active = !0;
this.noPlayerNode.active = !1;
this.nameLabel.string = l.default.clip(n.nickname, 6);
this.avatar.url = n.avatarUrl;
var r = s.default.getCurClubData().memberList().get(c.default.uid);
this.kickNode.active = r.permissionAdmin();
r.permissionAdmin() ? this.idLabel.string = n.uid + "" : this.idLabel.string = l.default.hideString(n.uid + "");
this.onlineNode.active = n.onLine || !1;
this.offlineNode.active = !this.onlineNode.active;
} else {
this.hasPlayerNode.active = !1;
this.noPlayerNode.active = !0;
}
} else {
this.hasPlayerNode.active = !1;
this.noPlayerNode.active = !0;
}
o && (this.kickNode.active = !1);
};
t.prototype.kickOut = function() {
i.default.clickBtn();
f.default.clubRoomMemberKickout(this._roomId, this._uid + "", function(e, t) {
t ? p.default.uiHelper.showTip("踢人失败～") : p.default.uiHelper.showTip("玩家已被踢出！");
});
};
t.prototype.join = function() {
i.default.clickBtn();
p.default.gameMsgBase().joinRoom(this._roomId);
u.default.lastGameClub.setValue(d.default.focus);
};
r([ y(cc.Node) ], t.prototype, "hasPlayerNode", void 0);
r([ y(cc.Node) ], t.prototype, "noPlayerNode", void 0);
r([ y(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ y(cc.Label) ], t.prototype, "idLabel", void 0);
r([ y(a.default) ], t.prototype, "avatar", void 0);
r([ y(cc.Node) ], t.prototype, "kickNode", void 0);
r([ y(cc.Node) ], t.prototype, "onlineNode", void 0);
r([ y(cc.Node) ], t.prototype, "offlineNode", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
