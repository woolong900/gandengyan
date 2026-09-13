// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "54099TvLMJKeZ5jo8DqfJQM", "WSKAnimationBeginCtr");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = e("./WSKMyCardItemCtr"), l = e("./WSKMyCardsPointer"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.myCardsPointer = null;
t.ctrRoot = null;
t.clockRoot = null;
return t;
}
t.prototype.play = function() {
var e = this;
return new Promise(function(t) {
for (var o = i.default.myAbsolutePos(), n = i.default.gameInfoWSK.siteInfos.get(o).handCards, r = n.length, l = 0; l < r; l++) {
(d = e.myCardsPointer.getCard(l).node).active = !0;
var c = n[l], u = a.default.gameLogic().score(c);
d.getComponent(s.default).initCard(c, u > 0);
d.x = 0;
}
e.ctrRoot.active = !1;
e.clockRoot.active = !1;
e.scheduleOnce(function() {
e.ctrRoot.active = !0;
e.clockRoot.active = !0;
t();
}, .8);
for (l = 0; l < r; l++) {
var d;
(d = e.myCardsPointer.getCard(l).node).stopAllActions();
var p = e.myCardsPointer.getPosition(l, r);
d.runAction(cc.moveTo(.8, p));
}
});
};
r([ d(l.default) ], t.prototype, "myCardsPointer", void 0);
r([ d(cc.Node) ], t.prototype, "ctrRoot", void 0);
r([ d(cc.Node) ], t.prototype, "clockRoot", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
