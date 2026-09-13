// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2b775kVyA9IO6t2gYSK9DmD", "ResultNode3D_Game12");
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
var i = e("./ResultNode3D_GameBase"), a = e("./HuTypeConfig"), s = e("./RoomInfoData"), l = e("./ResultNode3D"), c = cc._decorator, u = c.ccclass, d = (c.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateUI = function(e, t) {
var o = this.node.getComponent(l.default), n = this._huDesc(t, s.default.gameInfo.singleEndInfo.horseSum);
o.updateDesc(n);
};
t.prototype._huDesc = function(e, t) {
var o = s.default.config.index, n = e.huType, r = [];
if (n > 0) if ((r = a.default.customDesc(o, n)).length > 0) ; else {
var i = n & ~(384 | (c = 512));
r = a.default.configDesc(o, i);
var l = a.default.getHuWayInfo(o, n, [ 256, c ]);
l && r.push(l.desc);
r.push("炮数：" + t);
} else if (!s.default.gameInfo.singleEndInfo.isLiuJu()) {
if (s.default.gameInfo.singleEndInfo.isZiMoEnd()) ; else {
var c = 512;
s.default.gameInfo.singleEndInfo.checkHuUserBit(c) ? e.isBQGUser() && (r = [ "被抢杠" ]) : e.isDPUser() && (r = [ "放炮" ]);
}
}
return r;
};
return t = r([ u ], t);
}(i.default));
o.default = d;
cc._RF.pop();
