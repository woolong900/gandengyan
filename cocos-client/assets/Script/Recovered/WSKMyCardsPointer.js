// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9f749rsCn5L9L6zmiLLfgmk", "WSKMyCardsPointer");
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
var i = require("./SafeAreaCtr"), a = require("./WSKMyCardItemCtr"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._totalW = 0;
t.rootNode = null;
t.cards = [];
return t;
}
t.prototype.onLoad = function() {
var e = i.default.offsetX();
this._totalW = cc.winSize.width - 2 * e - 30;
};
t.prototype.getCard = function(e) {
return this.cards[e];
};
t.prototype.hideAll = function() {
for (var e = 0, t = this.cards.length; e < t; e++) this.cards[e].node.active = !1;
};
t.prototype.getPosition = function(e, t) {
var o = this._computeSpace(t - 1), n = -(t - 1) * o / 2 + e * o;
return cc.v2(n, 0);
};
t.prototype.initPosition = function(e, t) {
var o = this.getPosition(e, t);
this.getCard(e).initPosition(o.x, o.y);
};
t.prototype._computeSpace = function(e) {
if (e <= 0) return 0;
var t = .93 * (this._totalW - 127);
return 68 * e <= t ? 68 : 31 * e <= t ? t / e : 31;
};
r([ c(cc.Node) ], t.prototype, "rootNode", void 0);
r([ c(a.default) ], t.prototype, "cards", void 0);
return t = r([ l ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
