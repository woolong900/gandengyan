// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f2243NuOgdDo7BHC5OdzxeK", "SiteInfoCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./OperateListData"), r = e("./OperateCellData"), i = e("./CardUtils"), a = e("./gContext"), s = e("./EventKeys"), l = e("./CommonUtils"), c = e("./OperateConfig"), u = e("./RoomUtils"), d = function() {
function e(e) {
this.pos = 0;
this.operateList = new n.default();
this.outCards = [];
this.handCards = [];
this.paiDunCards = [];
this.surplusCards = [];
this._operateOptions = null;
this._putoutStatis = {};
this._paiDunNum = 0;
this._handCardsSorted = [];
this._handSelectIndex = -1;
this._isSelectCard = !0;
this.pos = e.pos;
this.operateList.clean();
for (var t = e.operateList || [], o = 0, i = t.length; o < i; o++) {
var a = t[o], s = new r.default(a);
this._pushOperate(s, !1);
}
this.outCards = [];
var l = e.outCards || [];
for (o = 0, i = l.length; o < i; o++) this._pushOutCard(l[o], !1);
this.surplusCards = [];
var c = e.surplusCards || [];
for (o = 0, i = c.length; o < i; o++) this.surplusCards.push(c[o]);
this.handCards = [];
var u = e.handCards || [];
this.handCards = this.handCards.concat(u);
this._paiDunNum = 0;
var d = e.paiDunCards || [];
this._initPaiDunCard(d);
this._sordHandCards(!0);
this._handSelectIndex = -1;
}
e.prototype.setIsSelectCard = function(e) {
this._isSelectCard = e;
};
e.prototype.putoutStatis = function(e) {
return this._putoutStatis[e] || 0;
};
e.prototype.setCheckHandCards = function(e) {
this.handCards = e;
};
e.prototype.statisAllOuts = function() {
var e = this;
this._putoutStatis = {};
this._statistics(this.handCards);
this._statistics(this.outCards);
for (var t = this.operateList.collection(function(t) {
return t.isAnGang() ? u.default.getInstance().isAnGangShow(e.pos) : t.isInOutStatis();
}), o = 0, n = t.length; o < n; o++) this._statistics(this.operateList.get(t[o]).cards);
};
e.prototype.paiDunNum = function() {
var e = this.surplusCards.length;
return e > 0 ? e : this._paiDunNum;
};
e.prototype.popOutCard = function() {
return this._popOutCard(!0);
};
e.prototype.lastOutCard = function() {
var e = this.outCards.length;
return this.outCards[e - 1];
};
e.prototype.anyCardSum = function(e) {
for (var t = 0, o = 0, n = this.handCards.length; o < n; o++) this.handCards[o] === e && (t += 1);
return t;
};
e.prototype.getCard = function(e) {
this.handCards.push(e);
this._sordHandCards(!0);
this.cleanSelectHandCard();
a.default.eventUtils.emit(s.default.data_hand_card_add, {
pos: this.pos,
card: e
});
a.default.eventUtils.emit(s.default.data_get_card, {
pos: this.pos,
card: e
});
};
e.prototype.putCard = function(e) {
this.handCards[0] > 0 ? this.removeHandCards([ e ], !0) : this.removeHandCards([ i.MJ_BACK_ID ], !0);
if (a.default.gameLogic().isGangCard(e)) ; else {
this._pushOutCard(e, !0);
a.default.eventUtils.emit(s.default.data_put_card, {
pos: this.pos,
card: e
});
}
this.updateOperateOptions(null);
this.cleanSelectHandCard();
};
e.prototype.addOperate = function(e) {
this._pushOperate(e, !0);
this.cleanSelectHandCard();
};
e.prototype.updateOperateOptions = function(e) {
var t = !1, o = !1;
this._operateOptions && this._operateOptions.count() > 0 && (t = !0);
e && e.count() > 0 && (o = !0);
this._operateOptions = e;
t !== o && a.default.eventUtils.emit(s.default.data_choose_operate_change, {
pos: this.pos
});
};
e.prototype.operateOptions = function() {
return this._operateOptions;
};
e.prototype.bCanPutCard = function() {
return !(this.handCards.length % 3 != 2 || !this._isSelectCard);
};
e.prototype.huCard = function() {
var e = this.operateList.collection(function(e) {
return e.category === c.eOperateCategory.Hu;
});
if (e.length > 0) {
var t = e[0];
return this.operateList.get(t).cards[0];
}
return -1;
};
e.prototype.updatePaiDunCard = function(e, t) {
void 0 === t && (t = i.MJ_HIDE_ID);
var o = this.paiDunCards[e];
if (void 0 === o || null === o) cc.error("更新牌墩错误"); else if (o !== t) {
o === i.MJ_BACK_ID && t !== i.MJ_BACK_ID && (this._paiDunNum = this._paiDunNum - 1);
o > 0 && (this._paiDunNum = this._paiDunNum - 1);
this.paiDunCards[e] = t;
a.default.eventUtils.emit(s.default.data_pai_dun_change, {
pos: this.pos,
index: e
});
}
};
e.prototype.isHandCardVisible = function() {
return this.handCards.length > 0 && this.handCards[0] > 0;
};
e.prototype._statistics = function(e, t) {
void 0 === t && (t = 1);
for (var o = 0, n = e.length; o < n; o++) {
var r = e[o];
if (r > 0) {
this._putoutStatis[r] = this._putoutStatis[r] || 0;
this._putoutStatis[r] = this._putoutStatis[r] + t;
}
}
};
e.prototype._pushOperate = function(e, t) {
this.operateList.push(e);
t && a.default.eventUtils.emit(s.default.data_operated_change, {
pos: this.pos,
index: this.operateList.count() - 1
});
};
e.prototype._pushOutCard = function(e, t) {
this.outCards.push(e);
t && a.default.eventUtils.emit(s.default.data_out_card_change, {
pos: this.pos
});
};
e.prototype._popOutCard = function(e) {
var t = this.outCards.pop();
e && a.default.eventUtils.emit(s.default.data_out_card_change, {
pos: this.pos
});
return t;
};
e.prototype.removeHandCards = function(e, t) {
for (var o = this, n = function(e) {
for (var t = 0, n = o.handCards.length; t < n; t++) if (o.handCards[t] === e) {
o.handCards.splice(t, 1);
break;
}
}, r = 0, i = e.length; r < i; r++) n(e[r]);
this._sordHandCards(!1);
t && a.default.eventUtils.emit(s.default.data_hand_card_remove, {
pos: this.pos,
cards: e
});
};
e.prototype.getSortedHandCards = function() {
var e = this.huCard();
if (e > 0) {
var t = this._handCardsSorted.length;
if (l.default.b3N2(t)) {
for (var o = [], n = !0, r = t - 1; r >= 0; r--) {
var i = this._handCardsSorted[r];
i === e && n ? n = !1 : o.push(i);
}
return o = o.reverse();
}
}
return this._handCardsSorted;
};
e.prototype.selectHandCard = function(e) {
if (this._handSelectIndex !== e) {
this._handSelectIndex = e;
var t = this._handCardsSorted[e];
a.default.eventUtils.emit(s.default.ui_hand_select_change, {
index: this._handSelectIndex,
card: t
});
}
};
e.prototype.cleanSelectHandCard = function() {
if (this._handSelectIndex >= 0) {
this._handSelectIndex = -1;
a.default.eventUtils.emit(s.default.data_hand_select_clean);
}
};
e.prototype._initPaiDunCard = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this.paiDunCards.push(n);
n !== i.MJ_HIDE_ID && (this._paiDunNum = this._paiDunNum + 1);
}
};
e.prototype._sortCards = function(e, t) {
void 0 === t && (t = []);
for (var o = [], n = 0, r = e.length; n < r; n++) {
var i = e[n];
if (t.length > 0) {
var s = t.indexOf(i);
if (s >= 0) {
t.splice(s, 1);
continue;
}
}
o.push(i);
}
o.sort(a.default.gameLogic().handSort());
return o;
};
e.prototype._sordHandCards = function(e) {
var t = [], o = this.handCards.length;
if (l.default.b3N2(o)) if (e) {
var n = this.handCards[o - 1];
(t = this._sortCards(this.handCards, [ n ])).push(n);
} else t = this._sortCards(this.handCards); else t = this._sortCards(this.handCards);
this._handCardsSorted = t;
};
return e;
}();
o.default = d;
cc._RF.pop();
