// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bcecfg55OlHdY4aAe/rHUrs", "AllianceClubInviteLayer");
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
var i = require("./BaseComponent"), a = require("./Image"), s = require("./SoundUtils"), l = require("./gContext"), c = require("./WindowConfig"), u = require("./ClubMsg"), d = require("./ClubListData"), p = require("./Constants"), f = require("./StringUtils"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.userid = 0;
t.member = !1;
t.head = null;
t.nameLabel = null;
t.uidLabel = null;
return t;
}
t.prototype.start = function() {};
t.prototype.setData = function(e, t) {
this.member = t;
this.userid = e.id;
this.head.url = e.avatarUrl || p.default.defHeadUrl;
this.nameLabel.string = f.default.clip(e.nickname, 8);
this.uidLabel.string = e.code;
};
t.prototype.onClickInvite = function() {
s.default.clickBtn();
if (!0 !== this.member) u.default.clubApplyInvite(d.default.focus, this.userid, function(e, t) {
if (t) l.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
l.default.uiHelper.showTip("邀请成功!");
l.default.uiHelper.remove(c.eWindowID.AllianceClubInviteLayer);
} else {
if (79 === e.res.error) {
l.default.uiHelper.showTip("邀请已达到最大次数");
return;
}
l.default.uiHelper.showTip(e.res.what);
}
}); else {
l.default.uiHelper.showTip("已是俱乐部成员!");
l.default.uiHelper.remove(c.eWindowID.AllianceClubInviteLayer);
}
};
r([ y(a.default) ], t.prototype, "head", void 0);
r([ y(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ y(cc.Label) ], t.prototype, "uidLabel", void 0);
return t = r([ m ], t);
}(i.default);
o.default = g;
cc._RF.pop();
