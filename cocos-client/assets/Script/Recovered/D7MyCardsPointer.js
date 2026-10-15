// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f414fgR3d5Ca4nb1c4To1IN", "D7MyCardsPointer");
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
var i = require("./D7MyCardItemCtr"), a = require("./RoomInfoData"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./EventUtils"), u = require("./D7Enum"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cards = [];
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on(l.default.data_status_change, function() {
a.default.gameInfoD7.status === u.eD7GameStatus.SingleEnd && e._resetAllCards();
}, this, c.eOffType.OnDestroy);
};
t.prototype.getCard = function(e) {
return this.cards[e];
};
t.prototype.chooseCards = function(e) {
for (var t = [].concat(e), o = a.default.myAbsolutePos(), n = a.default.gameInfoD7.handCards(o), r = 0, i = n.length; r < i; r++) {
var c = this.getCard(r), u = n[r], d = t.indexOf(u);
if (d >= 0) {
c.setChoose();
t.splice(d, 1);
} else c.setNormal();
}
s.default.eventUtils.emit(l.default.ui_my_card_choose_change);
};
t.prototype._resetAllCards = function() {
for (var e = 0, t = this.cards.length; e < t; e++) {
this.cards[e].reset();
}
};
t.prototype.resetAllCards = function(e) {
for (var t = !1, o = 0, n = this.cards.length; o < n; o++) {
var r = this.getCard(o);
t = t || r.isChoose();
r.setNormal();
}
t && e && s.default.eventUtils.emit(l.default.ui_my_card_choose_change);
};
t.prototype.hideAll = function() {
for (var e = 0, t = this.cards.length; e < t; e++) this.cards[e].node.active = !1;
};
r([ f(i.default) ], t.prototype, "cards", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
