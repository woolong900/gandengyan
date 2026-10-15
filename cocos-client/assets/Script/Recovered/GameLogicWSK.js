// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "65bf4b30hBKJ7RfgrmQD4Ae", "GameLogicWSK");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r, i, a = require("./CommonUtils"), s = require("./GameLogicBase");
(function(e) {
e[e.Any = 6] = "Any";
e[e.King = 5] = "King";
e[e.Hei = 4] = "Hei";
e[e.Hong = 3] = "Hong";
e[e.Mei = 2] = "Mei";
e[e.Fang = 1] = "Fang";
})(r = o.eWSKCardColor || (o.eWSKCardColor = {}));
(function(e) {
e[e.Error = 0] = "Error";
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.Three = 3] = "Three";
e[e.Seq1 = 4] = "Seq1";
e[e.Seq2 = 5] = "Seq2";
e[e.Seq3 = 6] = "Seq3";
e[e.WSKTrue = 7] = "WSKTrue";
e[e.WSKFalse = 8] = "WSKFalse";
e[e.Bomb = 9] = "Bomb";
e[e.BombKing = 10] = "BombKing";
})(i = o.eWSKOneHandType || (o.eWSKOneHandType = {}));
o.WSK_CARD_HIDE_ID = 0;
o.WSK_Card_Value_XW = 16;
o.WSK_Card_Value_DW = 17;
o.WSK_Card_Value_XH = 18;
o.WSK_Card_Value_DH = 19;
o.WSK_Card_Value_3 = 3;
o.WSK_Card_Value_5 = 5;
o.WSK_Card_Value_10 = 10;
o.WSK_Card_Value_K = 13;
o.WSK_Card_Value_A = 14;
o.WSK_Card_Value_2 = 15;
var l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.ruleBombMinNum = 4;
t.ruleSeq1MinLen = -1;
t.ruleSeq2MinLen = 2;
t.ruleSeq3MinLen = 2;
t.ruleRazzList = [];
t.ruleIsRazzCanReplaceTo510k = !0;
t.ruleRazzIsCanPut = !1;
t.ruleRazzPutAsCard = 0;
return t;
}
t.prototype.roomDetails = function(e) {
return "";
};
t.prototype.init = function(e) {
cc.error("初始化必须实现，主要用于设置游戏差异化的东西~");
};
t.prototype.isBiggerMustPut = function(e) {
return !1;
};
t.prototype.isRecordCard = function(e) {
return !1;
};
t.prototype.allCards = function(e) {
return [ 180, 180, 170, 170, 11, 11, 12, 12, 13, 13, 14, 14, 21, 21, 22, 22, 23, 23, 24, 24, 31, 31, 32, 32, 33, 33, 34, 34, 41, 41, 42, 42, 43, 43, 44, 44, 51, 51, 52, 52, 53, 53, 54, 54, 61, 61, 62, 62, 63, 63, 64, 64, 71, 71, 72, 72, 73, 73, 74, 74, 81, 81, 82, 82, 83, 83, 84, 84, 91, 91, 92, 92, 93, 93, 94, 94, 101, 101, 102, 102, 103, 103, 104, 104, 111, 111, 112, 112, 113, 113, 114, 114, 121, 121, 122, 122, 123, 123, 124, 124, 131, 131, 132, 132, 133, 133, 134, 134 ];
};
t.prototype.newCard = function(e, t) {
if (e === o.WSK_Card_Value_XW) return 170;
if (e === o.WSK_Card_Value_DW) return 180;
e === o.WSK_Card_Value_2 && (e = 2);
e === o.WSK_Card_Value_A && (e = 1);
return 10 * e + t;
};
t.prototype.cardColor = function(e) {
return this._color(e);
};
t.prototype.cardValue = function(e) {
if (170 === e) return o.WSK_Card_Value_XW;
if (180 === e) return o.WSK_Card_Value_DW;
var t = Math.floor(e / 10);
return 1 === t ? o.WSK_Card_Value_A : 2 === t ? o.WSK_Card_Value_2 : t;
};
t.prototype.cardImgPath = function(e) {
var t = this._color(e), o = Math.floor(e / 10).toString(16);
170 === e && (o = "e");
180 === e && (o = "f");
return "Games/Poker/card_" + t + o;
};
t.prototype.score = function(e) {
var t = this.cardValue(e);
return t === o.WSK_Card_Value_5 ? 5 : t === o.WSK_Card_Value_10 ? 10 : t === o.WSK_Card_Value_K ? 10 : 0;
};
t.prototype.sortDesc = function(e) {
return this._sortDesc(e);
};
t.prototype.sortBomb = function(e) {
var t = this._split510kCards(e), o = t._510kReal, n = t._510kFake, r = t.other, i = this.cards2CountArr(r), a = this._splitBombCards(r, i), s = a.bombs, l = this._sortDesc(a.other);
return [].concat(o).concat(n).concat(s).concat(l);
};
t.prototype.sortScore = function(e) {
var t = this._splitScoresCards(e), o = this._sortDesc(t.scores), n = this._sortDesc(t.others);
return o.concat(n);
};
t.prototype.sortPutShow = function(e) {
var t = this;
e.sort(function(e, o) {
var n = t.cardValue(e), r = t.cardValue(o);
if (n !== r) return n - r;
var i = t._color(e), a = t._color(o);
return i !== a ? a - i : 0;
});
return e;
};
t.prototype.compareToPut = function(e, t, o) {
var n = this.oneHandInfo(e), r = n.length;
if (0 === n.length) return [];
for (var a = [], s = t[0], l = this.oneHandWeight(t, o), c = 0; c < r; c++) {
var u = n[c], d = u.type, p = u.cards;
if (d !== o) {
if (-1 !== [ i.Single, i.Double, i.Three, i.Seq1, i.Seq2, i.Seq3 ].indexOf(d)) continue;
}
var f = this.oneHandWeight(p, d);
if (f === l) {
var h = this.sortPutShow(p)[0];
this.compare(h, s, !1) > 0 && a.push(u);
} else f > l && a.push(u);
}
return a;
};
t.prototype.oneHandInfo = function(e) {
if (e.length < 1) return [];
var t = this._splitRazzCards(e), o = t.razzs, n = t.other, a = o.length, s = n.length;
if (0 === s) {
if (this.ruleRazzIsCanPut) {
for (var l = [], c = 0; c < a; c++) {
var u = this.newCard(this.ruleRazzPutAsCard, r.Any);
l.push(u);
}
return this.oneHandInfo(l);
}
return [];
}
var d = this._sortDesc(n), p = this.cards2CountArr(e), f = d[0], h = d[s - 1], m = [];
return m = this.cardValue(f) === this.cardValue(h) ? (m = m.concat(this._oneHandInfo510k(d, p, a))).concat(this._oneHandInfoSame(d, a)) : (m = (m = (m = m.concat(this._oneHandInfoSeq(d, p, a, this.ruleSeq1MinLen, i.Seq1, 1))).concat(this._oneHandInfoSeq(d, p, a, this.ruleSeq2MinLen, i.Seq2, 2))).concat(this._oneHandInfoSeq(d, p, a, this.ruleSeq3MinLen, i.Seq3, 3))).concat(this._oneHandInfo510k(d, p, a));
};
t.prototype.isSupport = function(e) {
return !(e < 0);
};
t.prototype.oneHandWeight = function(e, t) {
cc.error("每种类型的牌，不一样，处理非炸弹所有的情况");
return 0;
};
t.prototype.compare = function(e, t, o) {
var n = this.cardValue(e), r = this.cardValue(t);
if (n !== r) return n - r;
if (o) {
return this.cardColor(e) - this.cardColor(t);
}
return 0;
};
t.prototype.tip = function(e, t, o) {
cc.error("子类必须实现~");
return {
tips: [],
Invalids: []
};
};
t.prototype.putSoundName = function(e, t) {
cc.error("子类必须实现~");
return null;
};
t.prototype.isSameColor = function(e, t) {
var o = e[0], n = this.cardColor(o);
if (n !== (t = t || n)) return !1;
for (var r = 1, i = e.length; r < i; r++) if (this.cardColor(e[r]) !== n) return !1;
return !0;
};
t.prototype.isBomb = function(e) {
return !!(this.isSupport(this.ruleBombMinNum) && e >= this.ruleBombMinNum);
};
t.prototype.cards2CountArr = function(e) {
for (var t = [], n = 0; n <= o.WSK_Card_Value_DH; n++) t.push(0);
n = 0;
for (var r = e.length; n < r; n++) {
var i = e[n];
t[this.cardValue(i)]++;
}
return t;
};
t.prototype._splitScoresCards = function(e) {
for (var t = [], o = [], n = 0, r = e.length; n < r; n++) {
var i = e[n];
this.score(i) > 0 ? t.push(i) : o.push(i);
}
return {
scores: t,
others: o
};
};
t.prototype._split510kCards = function(e) {
var t = this._splitScoresCards(e), o = t.scores, n = [];
n = (n = (n = (n = n.concat(this._findReal510k(o, r.Hei))).concat(this._findReal510k(o, r.Hong))).concat(this._findReal510k(o, r.Mei))).concat(this._findReal510k(o, r.Fang));
o = a.default.removeArrayList(o, n);
var i = this._find510k(o);
o = a.default.removeArrayList(o, i);
return {
_510kReal: n,
_510kFake: i,
other: t.others.concat(o)
};
};
t.prototype._splitBombCards = function(e, t) {
for (var o = this, n = this.sortDesc(e), r = [], i = [], a = n.length - 1; a >= 0; ) {
var s = n[a], l = t[this.cardValue(s)];
this.isBomb(l) ? r.push(this._newTip(n, a, l).reverse()) : i = i.concat(this._newTip(n, a, l));
a -= l;
}
r.sort(function(e, t) {
return -o.compareBomb(e, t);
});
var c = [];
for (a = 0; a < r.length; a++) c = c.concat(r[a]);
return {
bombs: c,
other: i
};
};
t.prototype._splitRazzCards = function(e) {
if (this.ruleRazzList.length < 1) return {
razzs: [],
other: e
};
for (var t = [], o = [], n = 0, r = e.length; n < r; n++) {
var i = e[n];
-1 === this.ruleRazzList.indexOf(i) ? t.push(i) : o.push(i);
}
return {
razzs: t,
other: o
};
};
t.prototype._seqNeedRazzNum = function(e, t) {
for (var n = 0, r = 0, i = 0, a = e.length; i < a; i++) {
if (e[i] > t) return 999;
if (e[i] > 0 && (i < o.WSK_Card_Value_3 || i > o.WSK_Card_Value_A)) return 999;
}
for (i = o.WSK_Card_Value_3; i <= o.WSK_Card_Value_A; i++) if (e[i] > 0) {
n = i;
break;
}
for (i = o.WSK_Card_Value_A; i >= o.WSK_Card_Value_3; i--) if (e[i] > 0) {
r = i;
break;
}
var s = 0;
for (i = n; i <= r; i++) {
s += t - e[i];
}
return s;
};
t.prototype._color = function(e) {
return e >= 140 ? r.King : e % 10;
};
t.prototype._findReal510k = function(e, t) {
for (var o = [], n = 0, r = e.length; n < r; n++) {
var i = e[n];
this.cardColor(i) === t && o.push(i);
}
return this._find510k(o);
};
t.prototype._find510k = function(e) {
for (var t = this.cards2CountArr(e), n = t[o.WSK_Card_Value_5], r = t[o.WSK_Card_Value_10], i = t[o.WSK_Card_Value_K], a = this._sortDesc(e), s = [], l = Math.min(n, r, i); l > 0; ) {
var c = s.length / 3, u = a[c], d = a[i + c], p = a[i + r + c];
s.push(u, d, p);
l--;
}
return s;
};
t.prototype._sortDesc = function(e) {
var t = this, o = [].concat(e);
o.sort(function(e, o) {
return -t.compare(e, o, !0);
});
return o;
};
t.prototype._addRazzs = function(e, t, o) {
for (var n = 0; n < o; n++) {
var i = this.newCard(t, r.Any);
e.push(i);
}
return e;
};
t.prototype._seqFillRazz = function(e, t, o, n, r) {
for (var i = [], a = function(t, o, n) {
if (!(n <= 0)) for (var r = 0; r < n; r++) t.push(e[o + r]);
}, s = 0, l = o; l >= n; l--) {
var c = t[l];
this._addRazzs(i, l, r - c);
a(i, s, c);
s += c;
}
return i;
};
t.prototype._oneHandInfoSeq = function(e, t, n, r, i, a) {
var s = e.length, l = s + n, c = r * a, u = (o.WSK_Card_Value_A - o.WSK_Card_Value_3 + 1) * a, d = e[0], p = e[s - 1], f = this.cardValue(d), h = this.cardValue(p), m = l / a;
if (!this.isSupport(r)) return [];
if (l < c) return [];
if (l > u) return [];
var y = n - this._seqNeedRazzNum(t, a);
if (y < 0) return [];
if (0 === y) return [ {
type: i,
cards: this._seqFillRazz(e, t, f, h, a)
} ];
if (y % a == 0) {
var g = h - y / a;
g < o.WSK_Card_Value_3 && (g = o.WSK_Card_Value_3);
var _ = g + m - 1, v = f + y / a;
v > o.WSK_Card_Value_A && (v = o.WSK_Card_Value_A);
var C = v - m + 1;
return g === C ? [ {
type: i,
cards: this._seqFillRazz(e, t, _, g, a)
} ] : [ {
type: i,
cards: this._seqFillRazz(e, t, _, g, a)
}, {
type: i,
cards: this._seqFillRazz(e, t, C, v, a)
} ];
}
return [];
};
t.prototype._oneHandInfo510k = function(e, t, n) {
var a = e.length;
if (3 !== a + n) return [];
if (a < 1) return [];
if (n > 0) {
if (this.ruleIsRazzCanReplaceTo510k) {
0 === t[o.WSK_Card_Value_K] && n--;
0 === t[o.WSK_Card_Value_10] && n--;
0 === t[o.WSK_Card_Value_5] && n--;
if (0 === n) {
var s = [].concat(e);
0 === t[o.WSK_Card_Value_K] && s.push(this.newCard(o.WSK_Card_Value_K, r.Any));
0 === t[o.WSK_Card_Value_10] && s.push(this.newCard(o.WSK_Card_Value_10, r.Any));
0 === t[o.WSK_Card_Value_5] && s.push(this.newCard(o.WSK_Card_Value_5, r.Any));
return [ {
type: i.WSKFalse,
cards: this._sortDesc(s)
} ];
}
return [];
}
return [];
}
return 1 === t[o.WSK_Card_Value_5] && 1 === t[o.WSK_Card_Value_10] && 1 === t[o.WSK_Card_Value_K] ? this.isSameColor(e) ? [ {
type: i.WSKTrue,
cards: [].concat(e)
} ] : [ {
type: i.WSKFalse,
cards: [].concat(e)
} ] : [];
};
t.prototype._oneHandInfoSame = function(e, t) {
var o = e.length + t, n = this.cardValue(e[0]), r = this._addRazzs([], n, t).concat(e);
return this.isBomb(o) ? [ {
type: i.Bomb,
cards: r
} ] : 1 === o ? [ {
type: i.Single,
cards: r
} ] : 2 === o ? [ {
type: i.Double,
cards: r
} ] : 3 === o ? [ {
type: i.Three,
cards: r
} ] : [];
};
t.prototype._newTip = function(e, t, o) {
for (var n = [], r = 0; r < o; r++) {
var i = e[t - r];
n.push(i);
}
return n;
};
t.prototype._newSeqTip = function(e, t, o, n, r) {
for (var i = [], a = 0, s = 0; s < n; s++) {
var l = t - a, c = this._newTip(e, l, o);
i = i.concat(c);
var u = e[l];
a += r[this.cardValue(u)];
}
return i;
};
t.prototype.compareBomb = function(e, t) {
var o = e.length, n = t.length;
if (o != n) return o - n;
var r = e[0], i = t[0];
return this.compare(r, i, !1);
};
t.prototype.hideHuDongBiaoqing = function(e) {
return !1;
};
return t;
}(s.default);
o.default = l;
cc._RF.pop();
