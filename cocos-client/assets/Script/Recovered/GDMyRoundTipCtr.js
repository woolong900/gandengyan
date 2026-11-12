// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "36625/Tg5hK3KLz9JAdrlVf", "GDMyRoundTipCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventUtils"), l = require("./SoundUtils"), c = require("./GDMyCardsPointer"), u = require("./GDEventKeys"), d = require("./GDEnum"), p = require("./GDCardUtils"), f = cc._decorator, h = f.ccclass, m = f.property, g = f.executionOrder, y = 0;
t.exports = {
SetTipIndex: function(e) {
y = e;
}
};
var _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._tips = [];
t._uiDirty = !1;
t.btnTip = null;
t.cardsPointer = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!i.default.isWatcher()) {
a.default.eventUtils.on(u.default.data_round_data_update, function(t, o) {
o.pos === i.default.myAbsolutePos() && e._resetAllCards(!0);
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.btnTip.active = !1;
if (i.default.gameInfoGD.status === d.eGDGameStatus.Gameing) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoGD.siteInfos.get(e);
if (t.roundType === d.eRoundTypeGD.Turn) {
1 != i.default.gameInfoGD.GongPaiStaus && 2 != i.default.gameInfoGD.GongPaiStaus && this._resetAllCards(!0);
t.turnType;
var o = i.default.config.peopleCount(), n = i.default.gameInfoGD.siteInfos.getLastPut(e), r = i.default.gameInfoGD.siteInfos.getNext(e, o).isWarning();
if (n) {
var a = n.getPutCards(), s = n.putCardType, l = p.default.GDTip(t.handCards, a, s, r);
this._resetTip(l.tips);
}
}
}
};
t.prototype._resetAllCards = function(e) {
for (var t = !1, o = 0, n = this.cardsPointer.cards.length; o < n; o++) {
var r = this.cardsPointer.getCard(o);
t = t || r.isChoose();
r.setNormal();
}
t && e && a.default.eventUtils.emit(u.default.ui_my_card_choose_change);
};
t.prototype._resetTip = function(e) {
this.btnTip.active = !0;
this._tips = e;
};
t.prototype._invalid = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.cardsPointer.getCard(n).setInvalid();
}
};
t.prototype._cleanAllChoosed = function() {
for (var e = i.default.myAbsolutePos(), t = (i.default.gameInfoGD.siteInfos.get(e).handCards,
0); t < 27; t++) {
this.cardsPointer.getCard(t).setNormal();
}
};
t.prototype._choose = function(e) {
this._cleanAllChoosed();
if (i.default.gameInfoGD.is_shuCard) if (i.default.gameInfoGD.lipaiBtnStuas) for (var t = 0, o = (r = this.changeCardToLPids(e)).length; t < o; t++) {
var n = this.shupaiIndex(r[t]);
this.cardsPointer.getCard(n).setChoose();
} else for (t = 0, o = e.length; t < o; t++) {
n = this.shupaiIndex(e[t]);
this.cardsPointer.getCard(n).setChoose();
} else if (i.default.gameInfoGD.lipaiBtnStuas) {
var r;
for (t = 0, o = (r = this.changeCardToLPids(e)).length; t < o; t++) {
n = this.shupaiIndex(r[t]);
this.cardsPointer.getCard(n).setChoose();
}
} else for (t = 0, o = e.length; t < o; t++) {
n = e[t];
this.cardsPointer.getCard(n).setChoose();
}
a.default.eventUtils.emit(u.default.ui_my_card_choose_change);
};
t.prototype.shupaiIndex = function(e) {
var t = i.default.myAbsolutePos();
return 26 - (i.default.gameInfoGD.siteInfos.get(t).handCards.length - 1) + e;
};
t.prototype._checkChoose = function(e) {
for (var t = 0, o = i.default.myAbsolutePos(), n = 0, r = i.default.gameInfoGD.siteInfos.get(o).handCards.length; n < r; n++) this.cardsPointer.getCard(n).isChoose() && t++;
var a = e.length;
if (t === a) {
for (n = 0; n < a; n++) {
var s = e[n];
if (!this.cardsPointer.getCard(s).isChoose()) return !0;
}
return !1;
}
return !0;
};
t.prototype.onClickTip = function() {
this._cleanAllChoosed();
l.default.clickBtn();
if (this._tips.length >= 1) {
var e = this._tips.length, t = y % e, o = this._tips[t];
if (this._checkChoose(o)) this._tip(); else {
y++;
this._tip();
}
}
};
t.prototype.changeCardToLPids = function(e) {
for (var t = i.default.myAbsolutePos(), o = i.default.gameInfoGD.siteInfos.get(t).handCards, n = [], r = 0, a = e.length; r < a; r++) for (var s = 0; s < o.length; s++) {
var l = o[s];
if (s == e[r]) {
n.push(l);
break;
}
}
var c = i.default.gameInfoGD.lipaiHandCards, u = JSON.parse(JSON.stringify(c)), d = [];
for (r = 0, a = n.length; r < a; r++) for (s = u.length - 1; s >= 0; s--) {
if ((l = u[s]) == n[r]) {
d.push(s);
u[s] = 0;
break;
}
}
return d;
};
t.prototype._tip = function() {
var e = this._tips.length, t = y % e, o = this._tips[t];
this._choose(o);
y++;
};
r([ m(cc.Node) ], t.prototype, "btnTip", void 0);
r([ m(c.default) ], t.prototype, "cardsPointer", void 0);
return t = r([ h, g(1e3) ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
