// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "40afdUTpTdFs63owDbhFoBT", "PDKMyCardsTouchCtr");
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
var i = require("./PDKMyCardsPointer"), a = require("./RoomInfoData"), s = require("./GameSoundPDK"), l = require("./gContext"), c = require("./PDKEventKeys"), u = require("./PDKCardUtils"), d = require("./PDKMyCardsTouchUtils"), p = require("./PDKEnum"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._rects = [];
t._beginIndex = -1;
t._endIndex = -1;
t.myCardsPointer = null;
t.touchLayer = null;
return t;
}
t.prototype._touchBegin = function() {
this._beginIndex = -1;
this._rects = [];
for (var e = a.default.myAbsolutePos(), t = a.default.gameInfoPDK.siteInfos.get(e).handCards.length - 1; t >= 0; t--) {
var o = this.myCardsPointer.getCard(t).node, n = o.convertToWorldSpaceAR(cc.v2(0, 0)), r = new cc.Rect(n.x - o.width / 2, n.y - o.height / 2, o.width, o.height);
this._rects.push(r);
}
};
t.prototype._doMove = function(e) {
this._cleanSelect();
for (var t = this._beginIndex, o = this._endIndex, n = 0, r = this._rects.length; n < r; n++) {
if (this._rects[n].contains(e)) {
this._beginIndex >= 0 || (this._beginIndex = r - 1 - n);
this._endIndex = r - 1 - n;
break;
}
}
t === this._beginIndex && o === this._endIndex || s.default.getInstance().selectCard();
this._setSelect(this._beginIndex, this._endIndex);
};
t.prototype._realIndex = function(e, t) {
if (e >= 0 && t >= 0) {
var o = e, n = t;
if (e > t) {
o = t;
n = e;
}
return {
s: o,
e: n,
b: !0
};
}
return {
s: -1,
e: -1,
b: !1
};
};
t.prototype._getValidSelect = function(e, t) {
for (var o = [], n = e; n <= t; n++) {
this.myCardsPointer.getCard(n).isInvalid() || o.push(n);
}
return o;
};
t.prototype._setSelect = function(e, t) {
var o = this._realIndex(e, t), n = o.s, r = o.e;
if (o.b) for (var i = n; i <= r; i++) {
this.myCardsPointer.getCard(i).setSelectColor();
}
};
t.prototype._cleanSelect = function() {
for (var e = 0; e < this._rects.length; e++) {
this.myCardsPointer.getCard(e).cleanSelectColor();
}
};
t.prototype._selectEnd = function(e, t) {
this._cleanSelect();
var o = this._realIndex(e, t), n = o.s, r = o.e;
if (o.b) {
var i = this._getValidSelect(n, r);
if (!(i.length < 1)) {
var s = a.default.myAbsolutePos(), c = a.default.gameInfoPDK.siteInfos.getLastPut(s), f = a.default.gameInfoPDK.siteInfos.get(s).handCards;
if (c) {
var h = c.putCardType, m = c.getPutCards();
h === u.ePDKOneHandType.Single ? d.default.followSingle(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.Double ? d.default.followDouble(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.ShunZi ? d.default.followShunZi(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.LianDui ? d.default.followLianDui(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.Three || h === u.ePDKOneHandType.Three1 || h === u.ePDKOneHandType.Three2 ? d.default.followThree(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.FeiJiFull || h === u.ePDKOneHandType.FeiJiLack ? d.default.followFeiJi(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.Four2 || h === u.ePDKOneHandType.Four2_AAA || h === u.ePDKOneHandType.Four3 || h === u.ePDKOneHandType.Four3_AAA ? d.default.followFourWith(this.myCardsPointer, i, f, m) : h === u.ePDKOneHandType.BOMB ? d.default.followBomb(this.myCardsPointer, i, f, m) : d.default.followOther(this.myCardsPointer, i, f, m);
} else {
var y = a.default.gameInfoPDK.siteInfos.get(s), g = l.default.gameLogic(a.default.config.index).isHei3MustPut(a.default.config);
d.default.put(this.myCardsPointer, i, f, y.turnType === p.ePDKTurnType.Hei3 && g);
}
}
}
};
t.prototype._touchEnd = function() {
if (this._beginIndex >= 0) {
this._selectEnd(this._beginIndex, this._endIndex);
s.default.getInstance().selectCardEnd();
l.default.eventUtils.emit(c.default.ui_my_card_choose_change);
} else this._cleanAllChoosed();
};
t.prototype._cleanAllChoosed = function() {
for (var e = !1, t = a.default.myAbsolutePos(), o = 0, n = a.default.gameInfoPDK.siteInfos.get(t).handCards.length; o < n; o++) {
var r = this.myCardsPointer.getCard(o);
if (r.isChoose()) {
r.clicked();
e || r.isChoose() || (e = !0);
}
}
e && l.default.eventUtils.emit(c.default.ui_my_card_choose_change);
};
t.prototype.start = function() {
var e = this;
if (!a.default.isWatcher()) {
this.touchLayer.on(cc.Node.EventType.TOUCH_START, function(t) {
e._touchBegin();
e._doMove(t.getLocation());
}, this);
this.touchLayer.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
e._doMove(t.getLocation());
}, this);
this.touchLayer.on(cc.Node.EventType.TOUCH_END, function(t) {
e._doMove(t.getLocation());
e._touchEnd();
}, this);
this.touchLayer.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
e._doMove(t.getLocation());
e._touchEnd();
}, this);
}
};
r([ m(i.default) ], t.prototype, "myCardsPointer", void 0);
r([ m(cc.Node) ], t.prototype, "touchLayer", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
