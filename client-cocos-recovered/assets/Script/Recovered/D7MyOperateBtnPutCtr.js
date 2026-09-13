// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "133dfMN1OZFMY4/t3Iyq7dG", "D7MyOperateBtnPutCtr");
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
var i = e("./RoomInfoData"), a = e("./D7GameInfoData"), s = e("./D7CardUtils"), l = e("./gContext"), c = e("./D7EventKeys"), u = e("./EventUtils"), d = e("./D7MyCardsPointer"), p = e("./GameMsgD7"), f = e("./CommonUtils"), h = cc._decorator, m = h.ccclass, y = h.property, g = h.executionOrder, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._bClickCheck = !1;
t._chooseCardsDESC = [];
t._putCards = [];
t.myCardsPointer = null;
t.btn = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
l.default.eventUtils.on([ c.default.data_put_turn, c.default.data_put_card ], function(t, o) {
var n = i.default.myAbsolutePos();
o.pos === n && (e._uiDirty = !0);
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on([ c.default.ui_my_card_choose_change, c.default.data_give_up_change ], function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._cleanData = function() {
this._bClickCheck = !1;
this._chooseCardsDESC = [];
this._putCards = [];
};
t.prototype._updateUI = function() {
this._cleanData();
this.btn.node.active = !1;
var e = i.default.myAbsolutePos(), t = i.default.gameInfoD7.roundData();
if (t.type === a.eRoundTypeD7.Put) {
var o = t.lastAction();
if (o && o.pos === e && o.state === a.eRoundStateD7.Turn && !i.default.isWatcher()) {
this.btn.node.active = !0;
for (var n = [], r = i.default.gameInfoD7.handCards(e), c = 0, u = r.length; c < u; c++) {
this.myCardsPointer.getCard(c).isChoose() && n.push(r[c]);
}
this._chooseCardsDESC = [].concat(n);
if (1 === t.actions.length) {
var d = n.length, p = n[0], f = n[d - 1], h = s.default.color(p) === s.default.color(f), m = i.default.gameInfoD7.mainCard, y = s.default.isMain(p, m) && s.default.isMain(f, m), g = !s.default.isMain(p, m) && !s.default.isMain(f, m), _ = t.actions[0].cards[0];
if (this._checkFlick(f, _)) this.btn.interactable = !!y || !!h && g; else {
var v = l.default.gameLogic().isSupportAKK(i.default.config), C = l.default.gameLogic().isSupportAKKQQ(i.default.config);
s.default.isValid(n, v, C, i.default.gameInfoD7.mainCard) ? this.btn.interactable = !0 : this.btn.interactable = !1;
}
} else {
var b = t.actions[0].cards, D = b.length;
if (n.length === D) {
this.btn.interactable = !0;
this._putCards = [].concat(b);
this._bClickCheck = !0;
} else this.btn.interactable = !1;
}
}
}
};
t.prototype._checkFlick = function(e, t) {
var o = function(e, t, o, n) {
return !(!f.default.checkBit(o, n) || s.default.color(e) !== t);
}, n = !1;
if (f.default.checkBit(t, 128)) {
n = s.default.isMain(e, i.default.gameInfoD7.mainCard);
}
return n = (n = (n = (n = n || o(e, s.eD7CardColor.Hei, t, 1)) || o(e, s.eD7CardColor.Hong, t, 2)) || o(e, s.eD7CardColor.Mei, t, 4)) || o(e, s.eD7CardColor.Fang, t, 8);
};
t.prototype.onClick = function() {
this._bClickCheck ? this._isCanPut(this._chooseCardsDESC, this._putCards) ? p.default.getInstance().putCard(this._chooseCardsDESC) : l.default.uiHelper.showTip("牌型不合法，有对必须出对~") : p.default.getInstance().putCard(this._chooseCardsDESC);
};
t.prototype._isCanPut = function(e, t) {
var o = e.length, n = t.length;
if (o !== n) return !1;
if (1 === n) return !0;
var r = Math.floor(n / 2), a = s.default.isMain(t[0], i.default.gameInfoD7.mainCard), l = s.default.color(t[0]), c = i.default.myAbsolutePos(), u = i.default.gameInfoD7.handCards(c), d = s.default.doubleIds(u, l, a, i.default.gameInfoD7.mainCard), p = d.length / 2, f = 0;
f = p < r ? p : r;
return s.default.doubleCount(e, l, a, i.default.gameInfoD7.mainCard) >= f && this._checkSeq(d, e, t);
};
t.prototype._checkSeq = function(e, t, o) {
var n = function(e) {
for (var t = 0, o = 0, n = e.length; o < n; o++) {
var r = e[o].length;
r > t && (t = r);
}
return t;
}, r = i.default.myAbsolutePos(), a = i.default.gameInfoD7.handCards(r), l = o.length, c = 0;
if (!(l >= 4)) return !0;
var u = 2 * Math.floor(l / 2);
(c = n(s.default.allSeqDoubbleIds(a, e, i.default.gameInfoD7.mainCard))) > u && (c = u);
if (c > 0) {
var d = s.default.isMain(o[0], i.default.gameInfoD7.mainCard), p = s.default.color(o[0]), f = s.default.doubleIds(t, p, d, i.default.gameInfoD7.mainCard);
return n(s.default.allSeqDoubbleIds(t, f, i.default.gameInfoD7.mainCard)) >= c;
}
return !0;
};
r([ y(d.default) ], t.prototype, "myCardsPointer", void 0);
r([ y(cc.Button) ], t.prototype, "btn", void 0);
return t = r([ m, g(7) ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
