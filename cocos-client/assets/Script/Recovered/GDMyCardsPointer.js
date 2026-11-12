// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b3596pGASRNs4JFRLOXqojf", "GDMyCardsPointer");
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
var i = require("./gContext"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./GDMyCardItemCtr"), c = require("./GDEnum"), u = require("./GDEventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._spacingX = 0;
t.rootNode = null;
t.cards = [];
return t;
}
t.prototype.onLoad = function() {
this._spacingX = this.rootNode.getComponent(cc.Layout).spacingX;
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(u.default.data_status_change, function() {
a.default.gameInfoGD.status === c.eGDGameStatus.SingleEnd && e._resetAllCards();
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(u.default.gongpai_hand_card_rest, function() {
e._resetGongPaiAllCards();
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ u.default.hand_card_status ], function(t, o) {
e._resetCardsStuts();
}, this, s.eOffType.OnDestroy);
};
t.prototype.getCard = function(e) {
return this.cards[e];
};
t.prototype.getspacingX = function(e) {
var t = 1092 / (e - 1);
t > 80 && (t = 80);
this._spacingX = t;
};
t.prototype.getPosition = function(e, t) {
this.getspacingX(t);
var o = -this._spacingX * (t - 1) / 2 + e * this._spacingX;
return cc.v2(o, 0);
};
t.prototype.initPosition = function(e, t) {
var o = this.getPosition(e, t);
this.getCard(e).initPosition(o.x, o.y);
};
t.prototype._resetAllCards = function() {
for (var e = 0, t = this.cards.length; e < t; e++) {
this.cards[e].reset();
}
};
t.prototype._resetGongPaiAllCards = function() {
for (var e = 0, t = this.cards.length; e < t; e++) {
this.cards[e].resetGongPai();
}
};
t.prototype._resetCardsStuts = function() {
var localRoom = require("./GDStandalone").default;
if (localRoom.isActive()) {
this._resetGongPaiAllCards();
if (localRoom._phase === "tribute" && localRoom._currentPos === a.default.myAbsolutePos() && a.default.gameInfoGD.GongPaiStaus === 1) {
var options = localRoom._tributeOptions(localRoom._currentPos, false);
a.default.gameInfoGD.GongPaiMax = options[0];
// Auto-select a legal tribute using the adapter's rank comparison, including
// non-heart level cards. Keep the production network selection path intact.
for (var index = 0; index < this.cards.length; index++) if (this.cards[index].node.active && options.indexOf(this.cards[index].card) >= 0) {
this.cards[index].setGongPaiInvalid(); break;
}
}
return;
}
if (1 == a.default.gameInfoGD.GongPaiStaus) {
for (var e = 0, t = 0, o = this.cards.length; t < o; t++) {
if (180 == (n = this.cards[t].card)) {
e = n;
break;
}
Math.floor(n / 10) == Math.floor(a.default.gameInfoGD.bottomCard / 10) && n % 10 == 3 && (n = 0);
1 == Math.floor(n / 10) && Math.floor(n / 10) !== Math.floor(a.default.gameInfoGD.bottomCard / 10) && (n = 150);
if (n > e) {
if (170 == e) break;
Math.floor(e / 10) == Math.floor(a.default.gameInfoGD.bottomCard / 10) ? 170 == n && (e = n) : e = n;
}
}
for (t = 0, o = this.cards.length; t < o; t++) {
var n = this.cards[t].card;
this.cards[t].setGongPaiNormal();
150 == e && (e = 10);
if (Math.floor(e / 10) == Math.floor(n / 10) && n % 10 != 3) {
this.cards[t].setGongPaiInvalid();
break;
}
}
a.default.gameInfoGD.GongPaiMax = e;
}
};
t.prototype.reset = function() {
this._resetAllCards();
};
t.prototype.setCard = function(e, t, o, n) {
void 0 === o && (o = !1);
void 0 === n && (n = !1);
var r = this.getCard(e).node;
r.active = !0;
r.getComponent(l.default).initCard(t, o, n);
};
t.prototype.hideAll = function() {
for (var e = 0, t = this.cards.length; e < t; e++) this.cards[e].node.active = !1;
};
t.prototype.initShuPaiPosition = function(e) {
this.hideAll();
for (var t = 26, o = 0; o < e.length; o++) for (var n = 0; n < e[o].length; n++) {
var r = this.getShuPaiPosition(o, e.length, n);
this.getCard(t).initPosition(r.x, r.y);
this.setCard(t, e[o][n], !1);
t--;
}
};
t.prototype.getShuPaiPosition = function(e, t, o) {
var n = 0 + 60 * o, r = 566 - (1280 - (95 * (t - 1) + 139.4)) / 2 + -95 * e;
return cc.v2(r, n);
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(l.default) ], t.prototype, "cards", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
