// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c175fJBQgBCyICjLEgC1agX", "DBDMyBtnPutCtr");
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
var i = e("./gContext"), a = e("./DBDEventKeys"), s = e("./RoomInfoData"), l = e("./EventUtils"), c = e("./DBDEnum"), u = e("./DBDMyCardsPointer"), d = e("./DBDCardUtils"), p = e("./SoundUtils"), f = e("./GameMsgDBD"), h = e("./Loader"), m = e("./UserData"), y = cc._decorator, g = y.ccclass, _ = y.property, v = [ [ cc.v2(-431.25, 90), cc.v2(-143.75, 90), cc.v2(143.76, 90), cc.v2(431.2, 90), cc.v2(-383.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ], [ cc.v2(-287.5, 0), cc.v2(287.5, 0), cc.v2(143.76, 90), cc.v2(431.2, 90), cc.v2(-383.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ], [ cc.v2(-383.3, 0), cc.v2(0, 0), cc.v2(383.3, 0), cc.v2(431.2, 90), cc.v2(-383.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ], [ cc.v2(-431.25, 0), cc.v2(-143.75, 0), cc.v2(143.76, 0), cc.v2(431.2, 0), cc.v2(-383.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ], [ cc.v2(-383.3, 90), cc.v2(0, 90), cc.v2(383.3, 90), cc.v2(-287.5, -80), cc.v2(287.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ], [ cc.v2(-431.25, 90), cc.v2(-143.75, 90), cc.v2(143.76, 90), cc.v2(431.2, 90), cc.v2(-383.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ], [ cc.v2(-431.25, 90), cc.v2(-143.75, 90), cc.v2(143.76, 90), cc.v2(431.2, 90), cc.v2(-383.5, -80), cc.v2(0, -80), cc.v2(383.3, -80) ] ], C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._chooseCardsDESC = [];
t._allCards = [];
t._selectCards = [];
t._lastPutCard = 0;
t._lastPutCardType = 0;
t._validHandTypes = [];
t._lastPutCardValues = [];
t.putBtn = null;
t.myCardsPointer = null;
t.putCardTipsNode = null;
t.shunziNode = null;
t.cardPre = null;
t.tipsNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!s.default.isWatcher()) {
this._updateUI();
i.default.eventUtils.on([ a.default.data_round_data_update ], function(t, o) {
var n = s.default.myAbsolutePos();
o.pos === n && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.ui_my_card_choose_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
this.putCardTipsNode.on(cc.Node.EventType.TOUCH_END, function(t) {
e._removerCards();
for (var o = s.default.myAbsolutePos(), n = 0, r = s.default.gameInfoDBD.siteInfos.get(o).handCards.length; n < r; n++) {
e.myCardsPointer.getCard(n).setNormal();
}
}, this);
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.putBtn.node.active = !1;
this.putCardTipsNode.active = !1;
this.tipsNode.active = !1;
this._lastPutCard = 0;
this._lastPutCardValues = [ 0 ];
this._removerCards();
var e = s.default.myAbsolutePos(), t = s.default.gameInfoDBD.siteInfos.get(e);
if (t.roundType === c.eRoundTypeDBD.Turn) {
this.putBtn.node.active = !0;
for (var o = [], n = [], r = t.handCards, i = 0, a = r.length; i < a; i++) {
this.myCardsPointer.getCard(i).isChoose() ? o.push(r[i]) : n.push(r[i]);
}
o.sort(function(e, t) {
return e - t;
});
n.sort(function(e, t) {
return e - t;
});
if (d.default.isAllLaiCards(n)) {
this.tipsNode.active = !0;
this.putBtn.interactable = !1;
} else {
this._chooseCardsDESC = [].concat(o);
var l = s.default.gameInfoDBD.siteInfos.getLastPut(e), u = d.default.oneHandType(this._chooseCardsDESC), p = d.default.checkLaiziNum(this._chooseCardsDESC);
if (l) {
var f = l.getPutCards(), h = l.putCardType[0];
this._lastPutCardValues = f;
this._lastPutCardType = h;
this._lastPutCard = d.default.value(f[0]);
if (d.default.compareToPut(this._chooseCardsDESC, f, this._lastPutCardType) > 0) {
var m = d.default.getAllPosibleLaiCards(this._chooseCardsDESC, this._lastPutCardType, this._lastPutCard), y = d.default.checkCardTypeIsValid(u, this._lastPutCardType);
this._validHandTypes = y;
(y.length > 1 || m.length > 1) && p > 0 && (this._allCards = this._showCardsTip(this._chooseCardsDESC, this._lastPutCard, u));
this.putBtn.interactable = !0;
} else this.putBtn.interactable = !1;
} else {
var g = d.default.isValid(this._chooseCardsDESC, r.length);
this.putBtn.interactable = g;
this._lastPutCard = 0;
if (p <= 0 || !g) return;
this._allCards = this._showCardsTip(this._chooseCardsDESC, this._lastPutCard, u);
}
this.putCardTipsNode.active = this._allCards.length > 1;
this._updateTipsCardPos();
}
}
};
t.prototype._updateTipsCardPos = function() {
var e = this._allCards.length;
if (!(e <= 0)) for (var t = this.shunziNode.children, o = v[e - 1], n = 0; n < t.length; n++) {
t[n].position = o[n];
}
};
t.prototype._showCardsTip = function(e, t, o) {
var n = this;
o = o.length > 0 ? o : d.default.oneHandType(e);
var r = [], i = e.length, a = s.default.gameInfoDBD.bankerUid === m.default.uid, l = 1;
o.forEach(function(o, s) {
for (var c = d.default.getAllPosibleLaiCards(e, o, t), u = 0; u < c.length; u++) {
var p = n.shunziNode.getChildByName("node_" + l);
p.active = !0;
for (var f = c[u], m = [], y = 0; y < i; y++) {
var g = 10 * f[y] + y % 4 + 1, _ = cc.instantiate(n.cardPre);
_.getChildByName("title").active = a;
var v = d.default.imgPath(g);
h.default.setImg(v, _);
p.addChild(_);
var C = Math.floor(g / 10), b = 10 * (C = 15 === (C = 14 === C ? 1 : C) ? 2 : C) + g % 10;
m.push(b);
}
r.push(m);
l++;
}
});
this.shunziNode.width > 1168 && (this.shunziNode.width = 1168);
this.shunziNode.active = !0;
return r;
};
t.prototype.onClickPutCardsType = function(e, t) {
var o = this._allCards.length, n = this._allCards[t] || [];
n.length <= 0 && (n = this._allCards[t - o]);
this._selectCards = n;
cc.log("onClickPutCardsType: ", this._selectCards, this._lastPutCardValues, this._lastPutCardType);
if (this._lastPutCardValues.length > 0 && this._lastPutCardType > 0) if (d.default.compareToPut(this._selectCards, this._lastPutCardValues, this._lastPutCardType) > 0) {
this.onClick();
this._removerCards();
} else {
cc.error("牌型不合法！！！！");
i.default.uiHelper.showTip("牌型不合法~");
} else {
this.onClick();
this._removerCards();
}
};
t.prototype.onClick = function() {
p.default.clickBtn();
var e = [], t = d.default.checkLaiziNum(this._chooseCardsDESC);
if (3 !== t || 3 !== this._chooseCardsDESC.length) {
if (t > 0) if (this._selectCards && this._selectCards.length > 0) e = this._selectCards; else {
e = this._showCardsTip(this._chooseCardsDESC, this._lastPutCard, this._validHandTypes)[0];
} else e = this._chooseCardsDESC;
e.length <= 0 && cc.error("牌型不合法！！！: ", e);
f.default.getInstance().putCard(e, this._chooseCardsDESC);
} else {
e = this._chooseCardsDESC;
f.default.getInstance().putCard(e, this._chooseCardsDESC);
}
};
t.prototype._removerCards = function() {
this.shunziNode.children.forEach(function(e) {
e.removeAllChildren();
e.active = !1;
});
this.shunziNode.active = !1;
this._allCards = [];
this._selectCards = [];
this._lastPutCardType = 0;
this._validHandTypes = [];
this._lastPutCardValues = [];
this.putCardTipsNode.active = !1;
};
r([ _(cc.Button) ], t.prototype, "putBtn", void 0);
r([ _(u.default) ], t.prototype, "myCardsPointer", void 0);
r([ _(cc.Node) ], t.prototype, "putCardTipsNode", void 0);
r([ _(cc.Node) ], t.prototype, "shunziNode", void 0);
r([ _(cc.Prefab) ], t.prototype, "cardPre", void 0);
r([ _(cc.Node) ], t.prototype, "tipsNode", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
