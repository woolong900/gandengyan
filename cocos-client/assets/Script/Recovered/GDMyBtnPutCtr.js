// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5f4aajnlj9NI7IMen0udnKN", "GDMyBtnPutCtr");
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
var i = require("./gContext"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./SoundUtils"), c = require("./Loader"), u = require("./GDMyCardsPointer"), d = require("./GDEventKeys"), p = require("./GDEnum"), f = require("./GDCardUtils"), h = require("./GameMsgGD"), m = cc._decorator, g = m.ccclass, y = m.property, _ = function(e) {
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
if (!a.default.isWatcher()) {
this._updateUI();
i.default.eventUtils.on([ d.default.data_round_data_update ], function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ d.default.ui_my_card_choose_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
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
var e = a.default.myAbsolutePos(), t = a.default.gameInfoGD.siteInfos.get(e);
if (t.roundType === p.eRoundTypeGD.Turn) {
this.putBtn.node.active = !0;
var o = [], n = [], r = t.handCards;
if (a.default.gameInfoGD.is_shuCard) if (a.default.gameInfoGD.lipaiBtnStuas) for (var i = 26 - (r = a.default.gameInfoGD.lipaiHandCards).length, s = 26; s > 26 - r.length; s--) {
this.myCardsPointer.getCard(s).isChoose() ? o.push(r[s - i - 1]) : n.push(r[s - i - 1]);
} else for (i = 26 - r.length, s = 26; s > 26 - r.length; s--) {
this.myCardsPointer.getCard(s).isChoose() ? o.push(r[s - i - 1]) : n.push(r[s - i - 1]);
} else if (a.default.gameInfoGD.lipaiBtnStuas) for (i = 26 - (r = a.default.gameInfoGD.lipaiHandCards).length,
s = 26; s > 26 - r.length; s--) {
this.myCardsPointer.getCard(s).isChoose() ? o.push(r[s - i - 1]) : n.push(r[s - i - 1]);
} else {
s = 0;
for (var l = r.length; s < l; s++) {
this.myCardsPointer.getCard(s).isChoose() ? o.push(r[s]) : n.push(r[s]);
}
}
o.sort(function(e, t) {
return e - t;
});
n.sort(function(e, t) {
return e - t;
});
this._chooseCardsDESC = [].concat(o);
var c = a.default.gameInfoGD.siteInfos.getLastPut(e);
f.default.oneHandType(this._chooseCardsDESC);
if (c) {
var u = c.getPutCards(), d = c.putCardType;
this._lastPutCardValues = u;
this._lastPutCardType = d;
f.default.compareToPut(this._chooseCardsDESC, u, this._lastPutCardType) > 0 ? this.putBtn.interactable = !0 : this.putBtn.interactable = !1;
} else {
var h = f.default.isValid(this._chooseCardsDESC, r.length);
this.putBtn.interactable = h;
this._lastPutCardValues = [];
this._lastPutCardType = 0;
}
}
};
t.prototype.OnChoosePutCards = function(e, t) {
var o = t, n = this._chooseCardsDESC.concat([]);
(n = f.default.ArrayReplaceLaiziCards(n, o)).sort(function(e, t) {
return e - t;
});
n = f.default.MainAuxiliaryOrder(f.default.m_ariChooseType[o], n);
h.default.getInstance().putCard(n, this._chooseCardsDESC, f.default.m_ariChooseType[t]);
};
t.prototype.ShowChooseCards = function(e) {
for (var t = f.default.m_arariLaiziReplaceValue, o = 0, n = 0; n < t.length; n++) {
var r = this.nodeChoosePutCards.getChildByName("node_" + n);
r.active = !0;
var i = e.concat([]);
(i = f.default.ArrayReplaceLaiziCards(i, n)).sort(function(e, t) {
return e - t;
});
i = f.default.MainAuxiliaryOrder(f.default.m_ariChooseType[n], i);
var a = this.getCardsWidth(i.length);
r.width = a + this._cardsTypeWidthOffest;
o = r.width;
for (var s = 0; s < i.length; s++) {
var l = cc.instantiate(this.cardPre), u = f.default.imgPath(i[s]);
c.default.setImg(u, l);
l.scale = .7;
r.addChild(l);
l.position = this.getPosition(s, i.length);
}
}
var d = 2 * o + this._cardsRootOffest;
this.nodeChoosePutCards.width = d < this._minWith ? this._minWith : d;
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
if (e.includes(f.GD_HuaPai)) {
for (var t = 0; t < e.length; t++) if (e[t] != f.GD_DaWang && e[t] != f.GD_XiaoWang && e[t] != f.GD_HuaPai) return !1;
return !0;
}
return !1;
};
t.prototype.onClick = function() {
var e = this;
l.default.clickBtn();
var t = new Array();
(t = this._chooseCardsDESC.concat([])).length <= 0 && cc.error("牌型不合法！！！: ", t);
for (var o = a.default.myAbsolutePos(), n = a.default.gameInfoGD.siteInfos.get(o), r = [], i = 0; i < n.handCards.length; i++) {
this.myCardsPointer.getCard(i).isChoose() || r.push(n.handCards[i]);
}
if (this.IsOnlyHuapaiAndWang(r)) {
this.tipsUnablePut.node.active = !0;
this.tipsUnablePut.scheduleOnce(function() {
this.node.active = !1;
}, 2);
} else {
var s = f.default.getMainCardValue(this._lastPutCardValues, this._lastPutCardType), c = f.default.oneHandType(this._chooseCardsDESC, this._lastPutCardType, s);
if (f.default.m_arariLaiziReplaceValue.length >= 2) {
this.ShowChooseCards(this._chooseCardsDESC);
this.choosePutCardsMask.active = !0;
this.nodeChoosePutCards.active = !0;
this.scheduleOnce(function() {
var t = e.nodeChoosePutCards.height / 2 + e.nodeChoosePutCards.y;
e.choosePutTitle.y = t;
e.choosePutTitle.active = !0;
}, .05);
} else {
1 == f.default.m_arariLaiziReplaceValue.length && (t = f.default.ArrayReplaceLaiziCards(t, 0)).sort(function(e, t) {
return e - t;
});
t = f.default.MainAuxiliaryOrder(c, t);
this._chooseCardsDESC = f.default.MainAuxiliaryOrder(c, this._chooseCardsDESC);
h.default.getInstance().putCard(t, this._chooseCardsDESC, c);
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
t.prototype.onClickJiao = function(e, t) {
var o = a.default.myAbsolutePos(), n = [], r = [], s = a.default.gameInfoGD.siteInfos.get(o).handCards;
if (a.default.gameInfoGD.is_shuCard) for (var c = 26 - s.length, u = 26; u > 26 - s.length; u--) {
this.myCardsPointer.getCard(u).isChoose() ? n.push(s[u - c - 1]) : r.push(s[u - c - 1]);
} else {
u = 0;
for (var p = s.length; u < p; u++) {
this.myCardsPointer.getCard(u).isChoose() ? n.push(s[u]) : r.push(s[u]);
}
}
n.sort(function(e, t) {
return e - t;
});
r.sort(function(e, t) {
return e - t;
});
this._chooseCardsDESC = [].concat(n);
l.default.clickBtn();
if (1 == this._chooseCardsDESC.length) {
var m = this._chooseCardsDESC[0];
if (f.default.value(m) == a.default.gameInfoGD.m_iLaiziValue && m % 10 == 3) {
console.log("不能给赖子");
return;
}
h.default.getInstance().jiaodizhu(this._chooseCardsDESC[0]);
i.default.eventUtils.emit(d.default.gongpai_hand_card_rest);
i.default.eventUtils.emit(d.default.clock_off_btn);
} else console.log("只能送一张");
};
r([ y(cc.Button) ], t.prototype, "putBtn", void 0);
r([ y(u.default) ], t.prototype, "myCardsPointer", void 0);
r([ y(cc.Node) ], t.prototype, "nodeChoosePutCards", void 0);
r([ y(cc.Prefab) ], t.prototype, "cardPre", void 0);
r([ y(cc.Node) ], t.prototype, "choosePutCardsMask", void 0);
r([ y(cc.Node) ], t.prototype, "choosePutTitle", void 0);
r([ y(cc.Sprite) ], t.prototype, "tipsUnablePut", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
