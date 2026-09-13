// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "90d74sZRTZNiYXSOYV0wpe9", "PDKAnimationBeginCtr");
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
var i = e("./RoomInfoData"), a = e("./PDKMyCardsPointer"), s = e("./PDKCardUtils"), l = e("./GameSoundPDK"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.myCardsPointer = null;
t.ctrRoot = null;
t.clockRoot = null;
return t;
}
t.prototype.play = function() {
for (var e = this, t = i.default.myAbsolutePos(), o = i.default.gameInfoPDK.siteInfos.get(t).handCards, n = o.length, r = this.myCardsPointer.getCard(0).node.width, a = cc.winSize.width / 2 + r, c = 0; c < n; c++) {
this.myCardsPointer.setCard(c, s.PDK_HIDE_ID);
this.myCardsPointer.getCard(c).node.x = a;
}
var u = .09 * (n - 1) + .18, d = .04 * n;
this.ctrRoot.active = !1;
this.clockRoot.active = !1;
this.scheduleOnce(function() {
e.ctrRoot.active = !0;
e.clockRoot.active = !0;
}, u + d);
var p = function(t) {
var r = .09 * t, i = cc.delayTime(r), a = cc.callFunc(function() {
l.default.getInstance().dealCard();
}), s = f.myCardsPointer.getPosition(t, n), c = cc.moveTo(.18, s), d = u - r - .18 + .04 * (n - t), p = cc.delayTime(d), h = cc.callFunc(function() {
e.myCardsPointer.setCard(t, o[t]);
}), m = cc.sequence(i, a, c, p, h), y = f.myCardsPointer.getCard(t).node;
y.stopAllActions();
y.runAction(m);
}, f = this;
for (c = 0; c < n; c++) p(c);
};
r([ d(a.default) ], t.prototype, "myCardsPointer", void 0);
r([ d(cc.Node) ], t.prototype, "ctrRoot", void 0);
r([ d(cc.Node) ], t.prototype, "clockRoot", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
