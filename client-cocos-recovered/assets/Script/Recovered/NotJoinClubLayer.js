// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ce9b72RkGFOkJyoDir6rlon", "NotJoinClubLayer");
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
var i = require("./BaseComponent"), a = require("./gContext"), s = require("./WindowConfig"), l = require("./SoundUtils"), c = require("./ClubMsg"), u = require("./GameConstant"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.bgNode = null;
return t;
}
t.prototype.onLoad = function() {
this.bgNode.width = cc.winSize.width;
this.bgNode.height = cc.winSize.height;
};
t.prototype.onClickCreate = function() {
l.default.clickBtn();
c.default.clubAgentInfo(function(e, t) {
t || (e.code.length > 0 ? e.balanceCard >= u.default.limitOfCreateClub ? a.default.uiHelper.show(s.eWindowID.CreateClubLayer) : a.default.msgBox.showOnlyOk("房卡不足" + u.default.limitOfCreateClub + "张，无法创建俱乐部\n请在代理后台充值房卡!") : a.default.uiHelper.show(s.eWindowID.CreateClubTipLayer));
});
};
t.prototype.onClickJoin = function() {
l.default.clickBtn();
a.default.uiHelper.show(s.eWindowID.JoinRoom, 1);
};
r([ f(cc.Node) ], t.prototype, "bgNode", void 0);
return t = r([ p ], t);
}(i.default);
o.default = h;
cc._RF.pop();
