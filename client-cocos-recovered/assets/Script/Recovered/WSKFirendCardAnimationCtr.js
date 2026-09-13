// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0ba98lPAlhJ75uREoGCx7NV", "WSKFirendCardAnimationCtr");
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
var i = require("./RoomInfoData"), a = require("./Loader"), s = require("./GameSoundWSK"), l = require("./gContext"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.card = null;
return t;
}
t.prototype.randomCard = function() {
var e = Math.floor(13 * Math.random()) + 1, t = Math.floor(4 * Math.random()) + 1, o = l.default.gameLogic().newCard(e, t), n = l.default.gameLogic().cardImgPath(o);
a.default.setImg(n, this.card);
s.default.getInstance().cardRound();
};
t.prototype.setRealCard = function() {
var e = i.default.gameInfoWSK.friendCard, t = l.default.gameLogic().cardImgPath(e);
a.default.setImg(t, this.card);
s.default.getInstance().cardRound();
};
r([ d(cc.Node) ], t.prototype, "card", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
