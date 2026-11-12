// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "135883atTlCSbWWc45MRXOg", "GDFirendCardAnimationCtr");
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
var i = require("./RoomInfoData"), a = require("./Loader"), s = require("./GameSoundGD"), l = require("./gContext"), c = require("./GDCardUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.card = null;
return t;
}
t.prototype.randomCard = function() {
var e = Math.floor(12 * Math.random()) + 1, t = Math.floor(4 * Math.random()) + 1, o = l.default.gameLogic().newCard(e, t), n = c.default.imgPath(o, !1, !0);
a.default.setImg(n, this.card);
s.default.getInstance().cardRound();
};
t.prototype.setRealCard = function() {
var e = i.default.gameInfoGD.friendCard, t = c.default.imgPath(e);
a.default.setImg(t, this.card);
s.default.getInstance().cardRound();
};
r([ p(cc.Node) ], t.prototype, "card", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
