// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "928efWZ1AVH2I3ZePB1Nr9L", "HuTipCell");
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
var i = require("./RoomInfoData"), a = require("./CardUtils"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.countLabel = null;
t.cardSprite = null;
t.cardBg = null;
t.laizi = null;
return t;
}
t.prototype.setData = function(e) {
if (i.default.gameInfo.isLaiZi(e)) {
this.cardBg.color = a.CARD_COLOR_LAIZI;
this.laizi.active = !0;
}
};
r([ c(cc.Label) ], t.prototype, "countLabel", void 0);
r([ c(cc.Sprite) ], t.prototype, "cardSprite", void 0);
r([ c(cc.Node) ], t.prototype, "cardBg", void 0);
r([ c(cc.Node) ], t.prototype, "laizi", void 0);
return t = r([ l ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
