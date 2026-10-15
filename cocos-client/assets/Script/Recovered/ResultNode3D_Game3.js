// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d0d88v+d7ZKfp/FgNvm+gpj", "ResultNode3D_Game3");
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
var i = require("./ResultNode3D_GameBase"), a = require("./HuTypeConfig"), s = require("./RoomInfoData"), l = require("./gContext"), c = require("./ResultNode3D"), u = cc._decorator, d = u.ccclass, p = (u.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateUI = function(e, t) {
var o = this.node.getComponent(c.default), n = this._huDesc(t);
o.updateDesc(n);
};
t.prototype._huDesc = function(e) {
var t = s.default.config.index, o = e.huType, n = [];
if (o > 0) if ((n = a.default.customDesc(t, o)).length > 0) {
l.default.gameLogic().isZiMo(o) && n.push("自摸");
} else {
var r = o & ~(96 | (c = 128));
n = a.default.configDesc(t, r);
var i = a.default.getHuWayInfo(t, o, [ 64, c ]);
if (i) n.push(i.desc); else {
l.default.gameLogic().isZiMo(o) && n.push("自摸");
}
} else if (!s.default.gameInfo.singleEndInfo.isLiuJu()) {
if (s.default.gameInfo.singleEndInfo.isZiMoEnd()) ; else {
var c = 128;
s.default.gameInfo.singleEndInfo.checkHuUserBit(c) ? e.isBQGUser() && (n = [ "被抢杠" ]) : e.isDPUser() && (n = [ "放炮" ]);
}
}
return n;
};
return t = r([ d ], t);
}(i.default));
o.default = p;
cc._RF.pop();
