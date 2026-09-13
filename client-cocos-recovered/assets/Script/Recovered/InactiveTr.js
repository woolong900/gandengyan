// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f7195Mq8DZKxoSgcliKp1/N", "InactiveTr");
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
var i = e("./Image"), a = e("./ClubMsg"), s = e("./gContext"), l = e("./SoundUtils"), c = e("./ClubListData"), u = e("./EventKeys"), d = e("./StringUtils"), p = e("./UserData"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uid = 0;
t.userId = 0;
t._lastGame = 0;
t.headIm = null;
t.nameLabel = null;
t.idLabel = null;
t.identLabel = null;
t.stateLabel = null;
t.timeLabel = null;
t.lastLabel = null;
t.btnNode = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this._uid = e;
this.userId = t.userid;
this._lastGame = t.lastGame;
this.nameLabel.string = d.default.clip(t.nickname);
this.idLabel.string = t.uid + "";
this.identLabel.string = t.degressStr();
this.stateLabel.string = t.statusStr();
this.timeLabel.string = t.joinTimeStr();
this.lastLabel.string = t.lastGameStr();
this.headIm.url = t.avatarUrl;
o.permissionMaster() && t.uid !== p.default.uid ? this.btnNode.active = !0 : this.btnNode.active = !t.permissionAdmin();
};
t.prototype.onClickKickedOut = function() {
var e = this;
l.default.clickBtn();
s.default.msgBox.show("确定踢出俱乐部？", function() {
a.default.clubMemberKickout(c.default.focus, e.userId, function(e, t) {
if (t) s.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
s.default.uiHelper.showTip("踢出成功!");
s.default.eventUtils.emit(u.default.data_club_member_manager_update);
} else s.default.uiHelper.showTip(e.res.what);
});
});
};
r([ m(i.default) ], t.prototype, "headIm", void 0);
r([ m(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ m(cc.Label) ], t.prototype, "idLabel", void 0);
r([ m(cc.Label) ], t.prototype, "identLabel", void 0);
r([ m(cc.Label) ], t.prototype, "stateLabel", void 0);
r([ m(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ m(cc.Label) ], t.prototype, "lastLabel", void 0);
r([ m(cc.Node) ], t.prototype, "btnNode", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
