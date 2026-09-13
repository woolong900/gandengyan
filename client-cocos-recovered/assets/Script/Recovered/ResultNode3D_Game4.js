// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e770b9TIDJE1ZCmve50qHH+", "ResultNode3D_Game4");
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
var i = cc._decorator, a = i.ccclass, s = (i.property, e("./HuTypeConfig")), l = e("./RoomInfoData"), c = e("./gContext"), u = e("./ResultNode3D"), d = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateUI = function(e, t) {
var o = this.node.getComponent(u.default), n = this._huDesc(t);
o.updateDesc(n);
};
t.prototype._huDesc = function(e) {
var t = l.default.config.index, o = e.huType, n = [];
if (o > 0) {
var r = o & ~(1920 | (a = 64));
n = s.default.configDesc(t, r);
var i = s.default.getHuWayInfo(t, o, [ 256, a, 128, 1024 ]);
if (i) n.push(i.desc); else {
c.default.gameLogic().isZiMo(o) && n.push("自摸");
}
} else if (!l.default.gameInfo.singleEndInfo.isLiuJu()) {
if (l.default.gameInfo.singleEndInfo.isZiMoEnd()) ; else {
var a = 64;
l.default.gameInfo.singleEndInfo.checkHuUserBit(a) ? e.isBQGUser() && (n = [ "被抢杠" ]) : e.isDPUser() && (n = [ "放炮" ]);
}
}
return n;
};
return t = r([ a ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
