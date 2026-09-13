// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "77c92lwz6JK3Jbim68jOLN8", "InviteTr");
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
var i = require("./Image"), a = require("./ClubMsg"), s = require("./gContext"), l = require("./SoundUtils"), c = require("./ClubInviteUserListData"), u = require("./ClubListData"), d = require("./EventKeys"), p = require("./StringUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t.userToggle = null;
t.head = null;
t.nameLabel = null;
t.idLabel = null;
return t;
}
t.prototype.setData = function(e) {
this._index = e;
var t = c.default.get(e);
this.head.url = t.avatarUrl;
this.nameLabel.string = p.default.clip(t.nickname, 8);
this.idLabel.string = t.code;
};
t.prototype.start = function() {};
t.prototype.onClickInvite = function() {
l.default.clickBtn();
var e = c.default.get(this._index);
a.default.clubInviteSubUser(u.default.focus, [ e.id ], function(e, t) {
if (t) s.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
s.default.uiHelper.showTip("邀请成功!");
s.default.eventUtils.emit(d.default.data_club_inviteuser_list_update);
} else s.default.uiHelper.showTip(e.res.what);
});
};
t.prototype.onClickToggle = function(e) {
this.userToggle.isChecked = e || !this.userToggle.isChecked;
};
t.prototype.getUserId = function() {
if (this.userToggle.isChecked) {
return c.default.get(this._index).id;
}
return -1;
};
r([ m(cc.Toggle) ], t.prototype, "userToggle", void 0);
r([ m(i.default) ], t.prototype, "head", void 0);
r([ m(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ m(cc.Label) ], t.prototype, "idLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
