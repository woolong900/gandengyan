// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4d07dQPLbtGZJY/lrzISTJf", "D7MyCardsRoundCtr");
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
var i = require("./D7MyCardsPointer"), a = require("./RoomInfoData"), s = require("./D7Enum"), l = require("./D7GameInfoData"), c = require("./D7CardUtils"), u = require("./gContext"), d = require("./D7EventKeys"), p = require("./EventUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = f.executionOrder, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
return t;
}
t.prototype.start = function() {
var e = this;
u.default.eventUtils.on([ d.default.data_put_turn ], function(t, o) {
o.pos === a.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, p.eOffType.OnDestroy);
u.default.eventUtils.on([ d.default.data_put_card ], function(t, o) {
if (o.pos === a.default.myAbsolutePos()) e.myCardsPointer.resetAllCards(!1); else {
var n = a.default.gameInfoD7.roundData();
if (n.type === l.eRoundTypeD7.Put) {
var r = n.lastAction();
r && r.state === l.eRoundStateD7.Turn && r.pos === a.default.myAbsolutePos() && (e._uiDirty = !0);
}
}
}, this, p.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
if (a.default.gameInfoD7.status === s.eD7GameStatus.Gameing) {
var e = a.default.gameInfoD7.roundData();
if (e.type === l.eRoundTypeD7.Put) {
var t = e.lastAction();
if (t) {
var o = a.default.myAbsolutePos();
if (t.pos === o) if (1 === e.actions.length) this.myCardsPointer.resetAllCards(!0); else {
var n = a.default.gameInfoD7.handCards(o), r = e.actions[0].cards, i = r.length;
if (i === n.length) {
this._setAllChoose(n);
u.default.eventUtils.emit(d.default.ui_my_card_choose_change);
return;
}
var p = c.default.isMain(r[0], a.default.gameInfoD7.mainCard), f = c.default.color(r[0]), h = 2 * Math.floor(i / 2), m = c.default.typeIds(n, f, p, a.default.gameInfoD7.mainCard), y = m.length;
if (y === i) {
this._setAllInvalid(n);
this._setChooseFoucsIds(m);
} else if (y < i) {
this.myCardsPointer.resetAllCards(!1);
this._setChooseFoucsIds(m);
} else {
this._setAllInvalid(n);
if (h > 0) {
var g = i % 2 == 1, _ = c.default.doubleIds(n, f, p, a.default.gameInfoD7.mainCard), v = _.length;
if (v === h) {
g && this._setNormalIds(m);
this._setChooseFoucsIds(_);
} else if (v > h) if (h >= 4 && c.default.isSeqMustPut()) {
for (var C = c.default.allSeqDoubbleIds(n, _, a.default.gameInfoD7.mainCard), b = [], D = [], S = [], w = 0, O = C.length; w < O; w++) {
var P = C[w].length;
P > h ? D.push(w) : P === h ? b.push(w) : S.push(w);
}
var I = b.length, R = D.length;
S.length;
if (1 === I && 0 === R) {
g && this._setNormalIds(m);
this._setChooseFoucsIds(C[b[0]]);
} else if (I + R >= 1) if (g) this._setNormalIds(m); else {
for (w = 0; w < I; w++) this._setNormalIds(C[b[w]]);
for (w = 0; w < R; w++) this._setNormalIds(C[D[w]]);
} else g ? this._setNormalIds(m) : this._setNormalIds(_);
} else g ? this._setNormalIds(m) : this._setNormalIds(_); else {
this._setNormalIds(m);
v > 0 && this._setChooseFoucsIds(_);
}
} else this._setNormalIds(m);
}
u.default.eventUtils.emit(d.default.ui_my_card_choose_change);
}
}
}
}
};
t.prototype._setAllInvalid = function(e) {
for (var t = 0, o = e.length; t < o; t++) this.myCardsPointer.getCard(t).setInvalid();
};
t.prototype._setAllChoose = function(e) {
for (var t = 0, o = e.length; t < o; t++) this.myCardsPointer.getCard(t).setChoose();
};
t.prototype._setChooseFoucsIds = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.myCardsPointer.getCard(n).setChooseFocus();
}
};
t.prototype._setNormalIds = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.myCardsPointer.getCard(n).setNormal();
}
};
r([ m(i.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ h, y(6) ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
