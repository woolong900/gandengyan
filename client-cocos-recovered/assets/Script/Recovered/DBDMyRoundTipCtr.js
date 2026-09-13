// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e794b1A8i5IwY3NNkBG8ywC", "DBDMyRoundTipCtr");
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
var i = e("./RoomInfoData"), a = e("./DBDEnum"), s = e("./DBDCardUtils"), l = e("./gContext"), c = e("./DBDEventKeys"), u = e("./EventUtils"), d = e("./DBDMyCardsPointer"), p = e("./SoundUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = f.executionOrder, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._tipIndex = 0;
t._tips = [];
t._uiDirty = !1;
t.btnTip = null;
t.cardsPointer = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!i.default.isWatcher()) {
l.default.eventUtils.on(c.default.data_round_data_update, function(t, o) {
o.pos === i.default.myAbsolutePos() && e._resetAllCards(!0);
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
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
if (i.default.gameInfoDBD.status === a.eDBDGameStatus.Gameing) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoDBD.siteInfos.get(e), o = t.handCards;
if (t.roundType === a.eRoundTypeDBD.Turn) {
if (t.getIsPass()) return;
this._resetAllCards(!0);
var n = i.default.config.peopleCount(), r = i.default.gameInfoDBD.siteInfos.getLastPut(e), l = i.default.gameInfoDBD.siteInfos.getNext(e, n).isWarning();
if (r) {
var c = r.getPutCards(), u = r.putCardType, d = u[0] === s.eDBDOneHandType.BOMB || u[0] == s.eDBDOneHandType.SOFTBOMB, p = s.default.dbdTip(o, c, u[0], l, d);
this._resetTip(p.tips);
this._invalid(p.invalids);
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
t && e && l.default.eventUtils.emit(c.default.ui_my_card_choose_change);
};
t.prototype._resetTip = function(e) {
this.btnTip.active = !0;
this._tipIndex = 0;
for (var t = [], o = 0; o < e.length; o++) e[o].length > 0 && t.push(e[o]);
this._tips = t;
};
t.prototype._invalid = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.cardsPointer.getCard(n).setInvalid();
}
};
t.prototype._cleanAllChoosed = function() {
for (var e = i.default.myAbsolutePos(), t = 0, o = i.default.gameInfoDBD.siteInfos.get(e).handCards.length; t < o; t++) {
this.cardsPointer.getCard(t).setNormal();
}
};
t.prototype._choose = function(e) {
this._cleanAllChoosed();
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.cardsPointer.getCard(n).setChoose();
}
l.default.eventUtils.emit(c.default.ui_my_card_choose_change);
};
t.prototype._checkChoose = function(e) {
for (var t = 0, o = i.default.myAbsolutePos(), n = 0, r = i.default.gameInfoDBD.siteInfos.get(o).handCards.length; n < r; n++) this.cardsPointer.getCard(n).isChoose() && t++;
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
p.default.clickBtn();
if (this._tips.length > 1) {
var e = this._tips.length, t = this._tipIndex % e, o = this._tips[t];
if (this._checkChoose(o)) this._tip(); else {
this._tipIndex++;
this._tip();
}
} else this._tip();
};
t.prototype._tip = function() {
var e = this._tips.length, t = this._tipIndex % e, o = this._tips[t];
this._choose(o);
this._tipIndex++;
};
r([ m(cc.Node) ], t.prototype, "btnTip", void 0);
r([ m(d.default) ], t.prototype, "cardsPointer", void 0);
return t = r([ h, y(1e3) ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
