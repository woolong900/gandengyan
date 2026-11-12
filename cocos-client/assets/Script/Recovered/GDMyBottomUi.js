// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "add38FsoRBECKLlhhA47rrt", "GDMyBottomUi");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventUtils"), l = require("./GDEventKeys"), c = require("./GDEnum"), u = require("./GDCardUtils"), d = require("./SoundUtils"), p = require("./GDMyCardsPointer"), f = cc._decorator, h = f.ccclass, m = f.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.shuPaiBtn = null;
t.liPaiBtn = null;
t.hengPai = null;
t.shuPai = null;
t.liPai = null;
t.huiFu = null;
t.btnRoot = null;
t.clockRoot = null;
t.cardsPointer = null;
t.htBtn = null;
t.fkBtn = null;
t.redBtn = null;
t.mhBtn = null;
t.betNum = null;
t.liBtn = null;
t.hengBtn = null;
t.htArray = [];
t.redArray = [];
t.fkArray = [];
t.mhArray = [];
t.htTipIndex = 0;
t.fkTipIndex = 0;
t.redTipIndex = 0;
t.mhTipIndex = 0;
return t;
}
t.prototype.start = function() {
var e = this;
if (i.default.isPlayback()) {
this.hengBtn.interactable = !1;
this.liBtn.interactable = !1;
}
i.default.gameInfoGD.is_shuCard ? this.shuPaiBtn.spriteFrame = this.hengPai : this.shuPaiBtn.spriteFrame = this.shuPai;
a.default.eventUtils.on(l.default.player_beginAnim, function(t, o) {
e.updateButton();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(l.default.data_score_update, function(t, o) {
e._updateBoomShow();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on([ l.default.data_hand_card_remove ], function(t, o) {
if (o.pos === i.default.myAbsolutePos()) {
e.getAllTongHuaCards();
e.updateButton();
e.restLiPai();
}
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on([ l.default.data_status_change ], function(t, o) {
o.o, o.n;
e.updateButton();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on([ l.default.data_hand_card_reset ], function(t, o) {
if (o && o.pos === i.default.myAbsolutePos()) {
e.getAllTongHuaCards();
e.updateButton();
}
}, this, s.eOffType.OnDestroy);
this.getAllTongHuaCards();
this._updateBoomShow();
this.updateButton();
};
t.prototype.updateButton = function() {
if (!i.default.isPlayback()) {
// Local rounds and hand-mode changes must use the native layout reset too.
this.restEndways();
this.liPaiBtn.spriteFrame = i.default.gameInfoGD.lipaiBtnStuas ? this.huiFu : this.liPai;
var e = i.default.myAbsolutePos(), t = i.default.gameInfoGD.siteInfos.get(e).handCards;
if (i.default.gameInfoGD.status == c.eGDGameStatus.gongpai || 0 == t.length || i.default.gameInfoGD.is_beginAnim || i.default.gameInfoGD.status == c.eGDGameStatus.SingleEnd || i.default.isPlayback() || i.default.isWatcher()) {
this.hengBtn.interactable = !1;
this.liBtn.interactable = !1;
} else {
this.hengBtn.interactable = !0;
this.liBtn.interactable = !0;
}
}
};
t.prototype.restEndways = function() {
var info = i.default.gameInfoGD;
this.shuPaiBtn.spriteFrame = info.is_shuCard ? this.hengPai : this.shuPai;
this.btnRoot.setPosition(cc.v2(0, info.is_shuCard || info.lipaiBtnStuas ? 63 : -23));
};
t.prototype.endways = function() {
i.default.gameInfoGD.lipaiBtnStuas = !1;
this.liPaiBtn.spriteFrame = this.liPai;
if (i.default.gameInfoGD.is_shuCard) {
i.default.gameInfoGD.is_shuCard = !1;
this.shuPaiBtn.spriteFrame = this.shuPai;
this.btnRoot.setPosition(cc.v2(0, -23));
} else {
i.default.gameInfoGD.is_shuCard = !0;
this.shuPaiBtn.spriteFrame = this.hengPai;
this.btnRoot.setPosition(cc.v2(0, 63));
}
var e = i.default.myAbsolutePos(), t = i.default.gameInfoGD.siteInfos.get(e).handCards;
a.default.eventUtils.emit(l.default.data_hand_card_reset, {
pos: e,
cards: t
});
};
t.prototype.getAllTongHuaCards = function() {
if (!i.default.isWatcher()) {
for (var e = i.default.myAbsolutePos(), t = i.default.gameInfoGD.siteInfos.get(e).handCards, o = [], n = [], r = 0; r < t.length; r++) {
var a = {
value: t[r],
index: r
}, s = {
value: u.default.value(t[r]),
index: r
};
o.push(s);
n.push(a);
}
var l = u.default.getTipCardsInfo_tonghua(t).cardsCountArr, c = [], d = JSON.parse(JSON.stringify(o)), p = JSON.parse(JSON.stringify(n));
for (r = d.length - 1; r >= 0; r--) if (u.default.isLaizi(n[r].value)) {
a = {
value: d[r].value,
index: d[r].index
};
c.push(a);
d.splice(r, 1);
p.splice(r, 1);
}
var f = u.default.tonghuaTip(d, c, l, p), h = [], m = [], g = [], y = [];
this.htArray = [];
this.fkArray = [];
this.mhArray = [];
this.redArray = [];
for (r = 0; r < f.length; r++) for (var _ = f[r], v = 0, C = 0; C < _.length; C++) {
var b = _[C];
if (b.value !== 10 * i.default.gameInfoGD.m_iLaiziValue + 3) {
(v = b.value % 10) == u.eGDCardColor.Fang && h.push(_);
v == u.eGDCardColor.Hei && m.push(_);
v == u.eGDCardColor.Hong && g.push(_);
v == u.eGDCardColor.Mei && y.push(_);
break;
}
}
for (C = 0; C < h.length; C++) {
var D = h[C], S = [];
for (r = 0; r < D.length; r++) {
var w = D[r].index;
S.push(w);
}
this.fkArray.push(S);
}
for (C = 0; C < m.length; C++) {
for (D = m[C], S = [], r = 0; r < D.length; r++) {
w = D[r].index;
S.push(w);
}
this.htArray.push(S);
}
for (C = 0; C < g.length; C++) {
for (D = g[C], S = [], r = 0; r < D.length; r++) {
w = D[r].index;
S.push(w);
}
this.redArray.push(S);
}
for (C = 0; C < y.length; C++) {
for (D = y[C], S = [], r = 0; r < D.length; r++) {
w = D[r].index;
S.push(w);
}
this.mhArray.push(S);
}
this.fkTipIndex = 0;
this.htTipIndex = 0;
this.mhTipIndex = 0;
this.redTipIndex = 0;
this.htArray = this.uniqueArray2D(this.htArray);
this.fkArray = this.uniqueArray2D(this.fkArray);
this.mhArray = this.uniqueArray2D(this.mhArray);
this.redArray = this.uniqueArray2D(this.redArray);
this.restHsBtn();
}
};
t.prototype.restHsBtn = function() {
this.fkArray.length > 0 ? this.fkBtn.active = !0 : this.fkBtn.active = !1;
this.mhArray.length > 0 ? this.mhBtn.active = !0 : this.mhBtn.active = !1;
this.redArray.length > 0 ? this.redBtn.active = !0 : this.redBtn.active = !1;
this.htArray.length > 0 ? this.htBtn.active = !0 : this.htBtn.active = !1;
};
t.prototype.clickHt = function() {
this._cleanAllChoosed();
d.default.clickBtn();
if (this.htArray.length >= 1) {
var e = this.htArray[this.htTipIndex];
this._checkChoose(e), this._tip(u.eGDCardColor.Hei);
}
};
t.prototype.clickFk = function() {
this._cleanAllChoosed();
d.default.clickBtn();
if (this.fkArray.length >= 1) {
var e = this.fkArray[this.fkTipIndex];
this._checkChoose(e), this._tip(u.eGDCardColor.Fang);
}
};
t.prototype.clickMh = function() {
this._cleanAllChoosed();
d.default.clickBtn();
if (this.mhArray.length >= 1) {
var e = this.mhArray[this.mhTipIndex];
this._checkChoose(e), this._tip(u.eGDCardColor.Mei);
}
};
t.prototype.clickRed = function() {
this._cleanAllChoosed();
d.default.clickBtn();
if (this.redArray.length >= 1) {
var e = this.redArray[this.redTipIndex];
this._checkChoose(e), this._tip(u.eGDCardColor.Hong);
}
};
t.prototype.retsLiPaiBtn = function() {
this.liPaiBtn.spriteFrame = this.liPai;
};
t.prototype.clickLiPai = function() {
d.default.clickBtn();
if (i.default.gameInfoGD.lipaiBtnStuas) {
this.liPaiBtn.spriteFrame = this.liPai;
i.default.gameInfoGD.lipaiBtnStuas = !1;
this.restEndways();
var e = i.default.myAbsolutePos(), t = i.default.gameInfoGD.siteInfos.get(e).handCards;
a.default.eventUtils.emit(l.default.data_hand_card_reset, {
pos: e,
cards: t
});
} else {
this.liPaiBtn.spriteFrame = this.huiFu;
i.default.gameInfoGD.lipaiBtnStuas = !0;
var o = i.default.myAbsolutePos(), n = i.default.gameInfoGD.siteInfos.get(o).handCards;
// Always derive from the authoritative current hand, including after restore,
// hand resets and tribute exchanges; cached groups may belong to an old hand.
var r = u.default.lipai(n.slice());
i.default.gameInfoGD.lipaiHandCardsAry = r;
this.sortLiPaiAry();
this.btnRoot.setPosition(cc.v2(0, 63));
a.default.eventUtils.emit(l.default.lipai_btn_click, {
pos: o,
cards: r
});
}
};
t.prototype.restLiPai = function() {
if (i.default.gameInfoGD.lipaiBtnStuas) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoGD.siteInfos.get(e).handCards, o = i.default.gameInfoGD.lipaiHandCardsAry;
o = u.default.lipai(t);
i.default.gameInfoGD.lipaiHandCardsAry = o;
this.sortLiPaiAry();
this.cardsPointer.initShuPaiPosition(o);
}
};
t.prototype.sortLiPaiAry = function() {
var e = i.default.gameInfoGD.lipaiHandCardsAry, t = [];
if (0 != e.length) for (var o = 0; o < e.length; o++) for (var n = e[o], r = 0; r < n.length; r++) {
var a = n[r];
t.unshift(a);
}
i.default.gameInfoGD.lipaiHandCards = t;
};
t.prototype._tip = function(e) {
if (e == u.eGDCardColor.Fang) {
this._choose(this.fkArray[this.fkTipIndex]);
this.fkTipIndex++;
this.fkTipIndex > this.fkArray.length - 1 && (this.fkTipIndex = 0);
}
if (e == u.eGDCardColor.Hei) {
this._choose(this.htArray[this.htTipIndex]);
this.htTipIndex++;
this.htTipIndex > this.htArray.length - 1 && (this.htTipIndex = 0);
}
if (e == u.eGDCardColor.Hong) {
this._choose(this.redArray[this.redTipIndex]);
this.redTipIndex++;
this.redTipIndex > this.redArray.length - 1 && (this.redTipIndex = 0);
}
if (e == u.eGDCardColor.Mei) {
this._choose(this.mhArray[this.mhTipIndex]);
this.mhTipIndex++;
this.mhTipIndex > this.mhArray.length - 1 && (this.mhTipIndex = 0);
}
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
a.default.eventUtils.emit(l.default.ui_my_card_choose_change);
};
t.prototype.changeCardToLPids = function(e) {
for (var t = i.default.myAbsolutePos(), o = i.default.gameInfoGD.siteInfos.get(t).handCards, n = [], r = 0, a = e.length; r < a; r++) for (var s = 0; s < o.length; s++) {
var l = o[s];
if (s == e[r]) {
n.push(l);
break;
}
}
var c = JSON.parse(JSON.stringify(i.default.gameInfoGD.lipaiHandCards)), u = [];
for (r = 0, a = n.length; r < a; r++) for (s = 0; s < c.length; s++) {
if ((l = c[s]) == n[r]) {
u.push(s);
c[s] = 0;
break;
}
}
return u;
};
t.prototype._cleanAllChoosed = function() {
for (var e = i.default.myAbsolutePos(), t = (i.default.gameInfoGD.siteInfos.get(e).handCards,
0); t < 27; t++) {
this.cardsPointer.getCard(t).setNormal();
}
};
t.prototype.shupaiIndex = function(e) {
var t = i.default.myAbsolutePos();
return 26 - (i.default.gameInfoGD.siteInfos.get(t).handCards.length - 1) + e;
};
t.prototype.uniqueArray2D = function(e) {
e.forEach(function(e) {
e.sort(function(e, t) {
return e - t;
});
});
var t = new Set();
return e.filter(function(e) {
var o = JSON.stringify(e);
return !t.has(o) && t.add(o);
});
};
t.prototype._updateBoomShow = function() {
this.betNum.string = "倍数x" + i.default.gameInfoGD.betNum;
};
r([ m(cc.Sprite) ], t.prototype, "shuPaiBtn", void 0);
r([ m(cc.Sprite) ], t.prototype, "liPaiBtn", void 0);
r([ m(cc.SpriteFrame) ], t.prototype, "hengPai", void 0);
r([ m(cc.SpriteFrame) ], t.prototype, "shuPai", void 0);
r([ m(cc.SpriteFrame) ], t.prototype, "liPai", void 0);
r([ m(cc.SpriteFrame) ], t.prototype, "huiFu", void 0);
r([ m(cc.Node) ], t.prototype, "btnRoot", void 0);
r([ m(cc.Node) ], t.prototype, "clockRoot", void 0);
r([ m(p.default) ], t.prototype, "cardsPointer", void 0);
r([ m(cc.Node) ], t.prototype, "htBtn", void 0);
r([ m(cc.Node) ], t.prototype, "fkBtn", void 0);
r([ m(cc.Node) ], t.prototype, "redBtn", void 0);
r([ m(cc.Node) ], t.prototype, "mhBtn", void 0);
r([ m(cc.Label) ], t.prototype, "betNum", void 0);
r([ m(cc.Button) ], t.prototype, "liBtn", void 0);
r([ m(cc.Button) ], t.prototype, "hengBtn", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
