// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b66c8haqWlJYKFF1bT7fi5D", "DDZMyBtnPutCtr");
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
var i = e("./gContext"), a = e("./DDZEventKeys"), s = e("./RoomInfoData"), l = e("./EventUtils"), c = e("./DDZEnum"), u = e("./DDZMyCardsPointer"), d = e("./DDZCardUtils"), p = e("./SoundUtils"), f = e("./GameMsgDDZ"), h = e("./Loader"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._spacingX = 25;
t._cardsTypeWidthOffest = 30;
t._cardsRootOffest = 70;
t._cardsWith = 69;
t._minWith = 550;
t._uiDirty = !1;
t._chooseCardsDESC = [];
t._selectCards = [];
t._lastPutCardValues = [];
t._lastPutCardType = 0;
t.putBtn = null;
t.myCardsPointer = null;
t.nodeChoosePutCards = null;
t.cardPre = null;
t.choosePutCardsMask = null;
t.choosePutTitle = null;
t.tipsUnablePut = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!s.default.isWatcher()) {
this._updateUI();
i.default.eventUtils.on([ a.default.data_round_data_update ], function(t, o) {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.ui_my_card_choose_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
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
this.choosePutCardsMask.active = !1;
this.nodeChoosePutCards.active = !1;
this.choosePutTitle.active = !1;
this.ResetChooseNode();
this._lastPutCardValues = [];
var e = s.default.myAbsolutePos(), t = s.default.gameInfoDDZ.siteInfos.get(e);
if (t.roundType === c.eRoundTypeDDZ.Turn) {
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
this._chooseCardsDESC = [].concat(o);
var l = s.default.gameInfoDDZ.siteInfos.getLastPut(e);
d.default.oneHandType(this._chooseCardsDESC);
if (l) {
var u = l.getPutCards(), p = l.putCardType;
this._lastPutCardValues = u;
this._lastPutCardType = p;
d.default.compareToPut(this._chooseCardsDESC, u, this._lastPutCardType) > 0 ? this.putBtn.interactable = !0 : this.putBtn.interactable = !1;
} else {
var f = d.default.isValid(this._chooseCardsDESC, r.length);
this.putBtn.interactable = f;
this._lastPutCardValues = [];
this._lastPutCardType = 0;
}
}
};
t.prototype._updateTipsCardPos = function() {
if (!(len <= 0)) for (var e = this.shunziNode.children, t = TIPS_CARDS_POS_ARR[len - 1], o = 0; o < e.length; o++) {
e[o].position = t[o];
}
};
t.prototype.OnChoosePutCards = function(e, t) {
var o = t, n = this._chooseCardsDESC.concat([]);
(n = d.default.ArrayReplaceLaiziCards(n, o)).sort(function(e, t) {
return e - t;
});
n = d.default.MainAuxiliaryOrder(d.default.m_ariChooseType[o], n);
f.default.getInstance().putCard(n, this._chooseCardsDESC, d.default.m_ariChooseType[t]);
};
t.prototype.ShowChooseCards = function(e) {
for (var t = d.default.m_arariLaiziReplaceValue, o = 0, n = 0; n < t.length; n++) {
var r = this.nodeChoosePutCards.getChildByName("node_" + n);
r.active = !0;
var i = e.concat([]);
(i = d.default.ArrayReplaceLaiziCards(i, n)).sort(function(e, t) {
return e - t;
});
i = d.default.MainAuxiliaryOrder(d.default.m_ariChooseType[n], i);
var a = this.getCardsWidth(i.length);
r.width = a + this._cardsTypeWidthOffest;
o = r.width;
for (var s = 0; s < i.length; s++) {
var l = cc.instantiate(this.cardPre), c = d.default.imgPath(i[s]);
h.default.setImg(c, l);
l.scale = .7;
r.addChild(l);
l.position = this.getPosition(s, i.length);
}
}
var u = 2 * o + this._cardsRootOffest;
this.nodeChoosePutCards.width = u < this._minWith ? this._minWith : u;
this.nodeChoosePutCards.getComponent(cc.Layout).paddingLeft = (this.nodeChoosePutCards.width - 2 * o) / 2;
};
t.prototype.getPosition = function(e, t) {
var o = -this._spacingX * (t - 1) / 2 + e * this._spacingX;
return cc.v2(o, 0);
};
t.prototype.getCardsWidth = function(e) {
return this._cardsWith + e * this._spacingX;
};
t.prototype.IsOnlyHuapaiAndWang = function(e) {
if (e.includes(d.DDZ_HuaPai)) {
for (var t = 0; t < e.length; t++) if (e[t] != d.DDZ_DaWang && e[t] != d.DDZ_XiaoWang && e[t] != d.DDZ_HuaPai) return !1;
return !0;
}
return !1;
};
t.prototype.onClick = function() {
var e = this;
p.default.clickBtn();
var t = new Array();
(t = this._chooseCardsDESC.concat([])).length <= 0 && cc.error("牌型不合法！！！: ", t);
for (var o = s.default.myAbsolutePos(), n = s.default.gameInfoDDZ.siteInfos.get(o), r = [], i = 0; i < n.handCards.length; i++) {
this.myCardsPointer.getCard(i).isChoose() || r.push(n.handCards[i]);
}
if (this.IsOnlyHuapaiAndWang(r)) {
this.tipsUnablePut.node.active = !0;
this.tipsUnablePut.scheduleOnce(function() {
this.node.active = !1;
}, 2);
} else {
var a = d.default.getMainCardValue(this._lastPutCardValues, this._lastPutCardType), l = d.default.oneHandType(this._chooseCardsDESC, this._lastPutCardType, a);
if (d.default.m_arariLaiziReplaceValue.length >= 2) {
this.ShowChooseCards(this._chooseCardsDESC);
this.choosePutCardsMask.active = !0;
this.nodeChoosePutCards.active = !0;
this.scheduleOnce(function() {
var t = e.nodeChoosePutCards.height / 2 + e.nodeChoosePutCards.y;
e.choosePutTitle.y = t;
e.choosePutTitle.active = !0;
}, .05);
} else {
1 == d.default.m_arariLaiziReplaceValue.length && (t = d.default.ArrayReplaceLaiziCards(t, 0)).sort(function(e, t) {
return e - t;
});
t = d.default.MainAuxiliaryOrder(l, t);
this._chooseCardsDESC = d.default.MainAuxiliaryOrder(l, this._chooseCardsDESC);
f.default.getInstance().putCard(t, this._chooseCardsDESC, l);
}
}
};
t.prototype.ResetChooseNode = function() {
this.nodeChoosePutCards.children.forEach(function(e) {
e.removeAllChildren();
e.active = !1;
});
};
t.prototype.clickEixt = function() {
this.nodeChoosePutCards.active = !1;
this.choosePutCardsMask.active = !1;
this.choosePutTitle.active = !1;
this.nodeChoosePutCards.children.forEach(function(e) {
e.removeAllChildren();
e.active = !1;
});
};
r([ g(cc.Button) ], t.prototype, "putBtn", void 0);
r([ g(u.default) ], t.prototype, "myCardsPointer", void 0);
r([ g(cc.Node) ], t.prototype, "nodeChoosePutCards", void 0);
r([ g(cc.Prefab) ], t.prototype, "cardPre", void 0);
r([ g(cc.Node) ], t.prototype, "choosePutCardsMask", void 0);
r([ g(cc.Node) ], t.prototype, "choosePutTitle", void 0);
r([ g(cc.Sprite) ], t.prototype, "tipsUnablePut", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
