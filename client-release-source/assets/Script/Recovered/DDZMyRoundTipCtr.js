// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "79701xd0MZLCJO+n0+U0eki", "DDZMyRoundTipCtr");
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
var i = require("./RoomInfoData"), a = require("./DDZEnum"), s = require("./DDZCardUtils"), l = require("./gContext"), c = require("./DDZEventKeys"), u = require("./EventUtils"), d = require("./DDZMyCardsPointer"), p = require("./SoundUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = f.executionOrder, g = 0;
t.exports = {
SetTipIndex: function(e) {
g = e;
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
if (i.default.gameInfoDDZ.status === a.eDDZGameStatus.Gameing) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoDDZ.siteInfos.get(e);
if (t.roundType === a.eRoundTypeDDZ.Turn) {
this._resetAllCards(!0);
t.turnType;
var o = i.default.config.peopleCount(), n = i.default.gameInfoDDZ.siteInfos.getLastPut(e), r = i.default.gameInfoDDZ.siteInfos.getNext(e, o).isWarning();
if (n) {
var l = n.getPutCards(), c = n.putCardType, u = s.default.DDZTip(t.handCards, l, c, r);
this._resetTip(u.tips);
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
this._tips = e;
};
t.prototype._invalid = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.cardsPointer.getCard(n).setInvalid();
}
};
t.prototype._cleanAllChoosed = function() {
for (var e = i.default.myAbsolutePos(), t = 0, o = i.default.gameInfoDDZ.siteInfos.get(e).handCards.length; t < o; t++) {
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
for (var t = 0, o = i.default.myAbsolutePos(), n = 0, r = i.default.gameInfoDDZ.siteInfos.get(o).handCards.length; n < r; n++) this.cardsPointer.getCard(n).isChoose() && t++;
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
if (this._tips.length >= 1) {
var e = this._tips.length, t = g % e, o = this._tips[t];
if (this._checkChoose(o)) this._tip(); else {
g++;
this._tip();
}
}
};
t.prototype._tip = function() {
var e = this._tips.length, t = g % e, o = this._tips[t];
this._choose(o);
g++;
};
r([ m(cc.Node) ], t.prototype, "btnTip", void 0);
r([ m(d.default) ], t.prototype, "cardsPointer", void 0);
return t = r([ h, y(1e3) ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
