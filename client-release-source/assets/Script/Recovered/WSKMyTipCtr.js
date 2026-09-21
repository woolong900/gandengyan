// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "47507G97/pFDZz/xsjkWm+l", "WSKMyTipCtr");
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
var i = require("./RoomInfoData"), a = require("./EventUtils"), s = require("./GameLogicWSK"), l = require("./SoundUtils"), c = require("./gContext"), u = require("./WSKEnum"), d = require("./WSKEventKeys"), p = require("./WSKMyCardsPointer"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
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
c.default.eventUtils.on(d.default.data_round_change, function(t, o) {
o.pos === i.default.myAbsolutePos() && e._resetAllCards(!0);
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
c.default.eventUtils.on(d.default.ui_my_card_tidy, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
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
if (i.default.gameInfoWSK.status === u.eWSKGameStatus.Gameing) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoWSK.siteInfos.get(e);
if (t.roundType === u.eWSKRoundType.Turn) {
this._resetAllCards(!0);
var o = i.default.gameInfoWSK.siteInfos.getLastPut(e);
if (o) {
var n = o.putVirtualCards, r = o.putType, a = c.default.gameLogic().tip(t.handCards, n, r);
this._resetTip(a.tips);
this._invalid(a.Invalids);
} else {
a = c.default.gameLogic().tip(t.handCards, [], s.eWSKOneHandType.Error);
this._resetTip(a.tips);
this._invalid(a.Invalids);
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
t && e && c.default.eventUtils.emit(d.default.ui_my_card_choose_change);
};
t.prototype._resetTip = function(e) {
this.btnTip.active = e.length > 0;
this._tipIndex = 0;
this._tips = e;
};
t.prototype._invalid = function(e) {
var t = this;
this._changeCardsState(e, function(e) {
t.cardsPointer.getCard(e).setInvalid();
});
};
t.prototype._choose = function(e) {
var t = this;
this._cleanAllChoosed();
this._changeCardsState(e, function(e) {
t.cardsPointer.getCard(e).setChoose();
});
c.default.eventUtils.emit(d.default.ui_my_card_choose_change);
};
t.prototype._changeCardsState = function(e, t) {
for (var o = i.default.myAbsolutePos(), n = i.default.gameInfoWSK.siteInfos.get(o).handCards, r = [].concat(n), a = 0, s = e.length; a < s; a++) {
var l = e[a], c = r.indexOf(l);
if (c >= 0) {
t(c);
r[c] = -100;
} else cc.error("逻辑错误，没有手牌没查到此牌~");
}
};
t.prototype._cleanAllChoosed = function() {
for (var e = i.default.myAbsolutePos(), t = 0, o = i.default.gameInfoWSK.siteInfos.get(e).handCards.length; t < o; t++) {
var n = this.cardsPointer.getCard(t);
n.isChoose() && n.clicked();
}
};
t.prototype._isChooseEquTip = function(e) {
for (var t = [], o = i.default.myAbsolutePos(), n = i.default.gameInfoWSK.siteInfos.get(o).handCards, r = 0, a = n.length; r < a; r++) if (this.cardsPointer.getCard(r).isChoose()) {
var s = n[r];
t.push(s);
}
var l = e.length;
if (l === t.length) {
var u = c.default.gameLogic().sortDesc(e), d = c.default.gameLogic().sortDesc(t);
for (r = 0; r < l; r++) if (u[r] !== d[r]) return !1;
return !0;
}
return !1;
};
t.prototype.onClickTip = function() {
l.default.clickBtn();
if (this._tips.length > 1) {
var e = this._tips.length, t = this._tipIndex % e, o = this._tips[t];
if (this._isChooseEquTip(o)) {
this._tipIndex++;
this._tip();
} else this._tip();
} else this._tip();
};
t.prototype._tip = function() {
var e = this._tips.length, t = this._tipIndex % e, o = this._tips[t];
this._choose(o);
this._tipIndex++;
};
r([ m(cc.Node) ], t.prototype, "btnTip", void 0);
r([ m(p.default) ], t.prototype, "cardsPointer", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
