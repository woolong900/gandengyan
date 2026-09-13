// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "21d79ulV9JHlrOmAcdjkuVr", "GameLogicWSK_QJWSKBD");
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
var r, i = e("./CommonEnum"), a = e("./GameLogicWSK");
(function(e) {
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.Three = 3] = "Three";
e[e.Seq2 = 4] = "Seq2";
e[e.Seq3 = 5] = "Seq3";
e[e.WSK_False = 6] = "WSK_False";
e[e.Bomb4_Small = 7] = "Bomb4_Small";
e[e.WSK_Fang = 8] = "WSK_Fang";
e[e.WSK_Mei = 9] = "WSK_Mei";
e[e.WSK_Hong = 10] = "WSK_Hong";
e[e.WSK_Hei = 11] = "WSK_Hei";
e[e.Bomb4_Big = 12] = "Bomb4_Big";
e[e.Bomb5 = 13] = "Bomb5";
e[e.Bomb6 = 14] = "Bomb6";
e[e.Bomb7 = 15] = "Bomb7";
e[e.Bomb8 = 16] = "Bomb8";
e[e.BombKing4 = 17] = "BombKing4";
e[e.WSK_Double_Fang = 18] = "WSK_Double_Fang";
e[e.WSK_Double_Mei = 19] = "WSK_Double_Mei";
e[e.WSK_Double_Hong = 20] = "WSK_Double_Hong";
e[e.WSK_Double_Hei = 21] = "WSK_Double_Hei";
})(r || (r = {}));
var s = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isWSKTrueBiggerBomb4 = !1;
return t;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {}, a = Math.floor(t / 1) % 10, s = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = Math.floor(t / 1e4) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e6) % 10, f = Math.floor(t / 1e7) % 10, h = Math.floor(t / 1e8) % 10, m = Math.floor(t / 1e9) % 10, y = Math.floor(t / 1e10) % 10, g = Math.floor(t / 1e11) % 10;
1 == Math.floor(t / 1e12) % 10 && n.push(200);
3 === e && n.push(1);
6 === e && n.push(2);
9 === e && n.push(3);
12 === e && n.push(4);
0 === a && n.push(5);
1 === a && n.push(6);
2 === a && n.push(7);
3 === a && n.push(8);
r[9] = o / 10;
1 === h && n.push(10);
0 === h && n.push(11);
2 === h && n.push(32);
1 === u && n.push(12);
1 === f && n.push(13);
1 === c && n.push(14);
1 === d && n.push(15);
1 === p && n.push(16);
1 === y && n.push(17);
1 === m && n.push(19);
1 === g && n.push(20);
0 === s && n.push(28);
1 === s && n.push(29);
2 === s && n.push(30);
3 === s && n.push(31);
return {
index: i.eGameIds.QJWSKBD,
ids: n,
ipLimit: l,
other: r
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = this.configCell2Str(e, [ 5, 6, 7, 8 ], [ "0", "1", "2", "3" ]), n = this.configCell2Str(e, [ 28, 29, 30, 31 ], [ "0", "1", "2", "3" ]), r = e.IPStatus() ? "1" : "0", i = this.configCell2Str(e, [ 14 ], [ "1" ]), a = this.configCell2Str(e, [ 12 ], [ "1" ]), s = this.configCell2Str(e, [ 13 ], [ "1" ]), l = this.configCell2Str(e, [ 32, 10, 11 ], [ "2", "1", "0" ]), c = this.configCell2Str(e, [ 19 ], [ "1" ]), u = this.configCell2Str(e, [ 20 ], [ "1" ]), d = this.configCell2Str(e, [ 16 ], [ "1" ]), p = this.configCell2Str(e, [ 17 ], [ "1" ]), f = this.configCell2Str(e, [ 15 ], [ "1" ]), h = 10 * e.getValue(9), m = this.configCell2Str(e, [ 200 ], [ "1" ]), y = parseInt(m + u + p + c + l + s + d + f + a + i + r + n + o), g = 1, _ = e.gameCount();
3 === _ && (g = 1);
6 === _ && (g = 2);
9 === _ && (g = 3);
12 === _ && (g = 4);
return {
gameType: e.index,
num: g,
param1: h,
param2: y,
clubId: t
};
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isBiggerMustPut = function(e) {
return !0;
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.isRecordCard = function(e) {
return e.isChecked(17);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
t.prototype.allCards = function(t) {
return 3 === t.peopleCount() ? [ 180, 180, 170, 170, 11, 11, 12, 12, 13, 13, 14, 14, 21, 21, 22, 22, 23, 23, 24, 24, 51, 51, 52, 52, 53, 53, 54, 54, 71, 71, 72, 72, 73, 73, 74, 74, 81, 81, 82, 82, 83, 83, 84, 84, 91, 91, 92, 92, 93, 93, 94, 94, 101, 101, 102, 102, 103, 103, 104, 104, 111, 111, 112, 112, 113, 113, 114, 114, 121, 121, 122, 122, 123, 123, 124, 124, 131, 131, 132, 132, 133, 133, 134, 134 ] : t.isChecked(13) ? [ 180, 180, 170, 170, 11, 11, 12, 12, 13, 13, 14, 14, 21, 21, 22, 22, 23, 23, 24, 24, 51, 51, 52, 52, 53, 53, 54, 54, 61, 61, 62, 62, 63, 63, 64, 64, 71, 71, 72, 72, 73, 73, 74, 74, 81, 81, 82, 82, 83, 83, 84, 84, 91, 91, 92, 92, 93, 93, 94, 94, 101, 101, 102, 102, 103, 103, 104, 104, 111, 111, 112, 112, 113, 113, 114, 114, 121, 121, 122, 122, 123, 123, 124, 124, 131, 131, 132, 132, 133, 133, 134, 134 ] : e.prototype.allCards.call(this, t);
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(9);
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = [ 12, 13, 200 ], r = [].concat([ 32, 10, 11 ]).concat([ 5, 6, 7, 8 ]).concat([ 9 ]).concat(n);
return e.listDescDetails(r, t);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "支付：", [ 5, 6, 7, 8 ]);
t += "\n底分：" + e.desc(9);
t += "\n功能：" + e.desc(200);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 28, 29, 30, 31 ]);
};
t.prototype.tableRuleDesc = function(e) {
var t = "", o = [];
e.isChecked(12) ? o.push("尾游可以捡分") : o.push("尾游不能捡分");
e.isChecked(13) && o.push("去掉34");
e.isChecked(14) && o.push("真五十K大过四炸");
e.isChecked(15) && o.push("高级防作弊");
e.isChecked(16) && o.push("去分牌");
for (var n = 0, r = o.length; n < r; n++) t ? t = t + " " + o[n] : t += o[n];
return t;
};
t.prototype.init = function(e) {
this.ruleBombMinNum = 4;
this.ruleSeq1MinLen = -1;
this.ruleSeq2MinLen = -1;
this.ruleSeq3MinLen = -1;
this.ruleRazzList = [];
this.ruleIsRazzCanReplaceTo510k = !1;
this.ruleRazzIsCanPut = !1;
this.ruleRazzPutAsCard = 0;
this._isWSKTrueBiggerBomb4 = e.isChecked(14);
};
t.prototype.oneHandInfo = function(t) {
var o = t.length;
if (4 === o && this.isSameColor(t, a.eWSKCardColor.King)) return [ {
type: a.eWSKOneHandType.BombKing,
cards: [].concat(t)
} ];
if (6 === o && this.isSameColor(t)) {
var n = this.cards2CountArr(t);
if (2 === n[a.WSK_Card_Value_5] && 2 === n[a.WSK_Card_Value_10] && 2 === n[a.WSK_Card_Value_K]) return [ {
type: a.eWSKOneHandType.WSKTrue,
cards: [].concat(t)
} ];
}
return e.prototype.oneHandInfo.call(this, t);
};
t.prototype.tip = function(e, t, o) {
var n = [].concat(e), i = this.cards2CountArr(n), s = this.sortDesc(n), l = [];
if (!(t.length > 0)) return {
tips: l = this._tipNull(s, i),
Invalids: []
};
var c = t[0];
o === a.eWSKOneHandType.Single && (l = this._tipSingle(s, i, c));
o === a.eWSKOneHandType.Double && (l = this._tipDouble(s, i, c));
o === a.eWSKOneHandType.Three && (l = this._tipThree(s, i, c));
o === a.eWSKOneHandType.Seq2 && (l = this._tipSeq(s, i, c, 2, t.length / 2));
o === a.eWSKOneHandType.Seq3 && (l = this._tipSeq(s, i, c, 3, t.length / 3));
if (o === a.eWSKOneHandType.WSKTrue) {
var u = this.cardColor(c);
if (6 === t.length) {
u === a.eWSKCardColor.Fang && (l = this._tipWSKTrueDouble(s, i, c, r.WSK_Double_Fang));
u === a.eWSKCardColor.Mei && (l = this._tipWSKTrueDouble(s, i, c, r.WSK_Double_Mei));
u === a.eWSKCardColor.Hong && (l = this._tipWSKTrueDouble(s, i, c, r.WSK_Double_Hong));
} else {
u === a.eWSKCardColor.Fang && (l = this._tipWSKTrue(s, i, c, r.WSK_Fang));
u === a.eWSKCardColor.Mei && (l = this._tipWSKTrue(s, i, c, r.WSK_Mei));
u === a.eWSKCardColor.Hong && (l = this._tipWSKTrue(s, i, c, r.WSK_Hong));
u === a.eWSKCardColor.Hei && (l = this._tipWSKTrue(s, i, c, r.WSK_Hei));
}
}
o === a.eWSKOneHandType.WSKFalse && (l = this._tipWSKFalse(s, i));
if (o === a.eWSKOneHandType.Bomb) {
var d = t.length;
l = this._tipBomb(s, i, c, d);
}
o === a.eWSKOneHandType.BombKing && (l = this._tipKing(s));
return {
tips: l,
Invalids: this._findInvalies(n, l, t, o)
};
};
t.prototype.putSoundName = function(e, t) {
if (e === a.eWSKOneHandType.Single) {
return (o = this.cardValue(t[0])) === a.WSK_Card_Value_A ? "put_1_1" : o === a.WSK_Card_Value_2 ? "put_1_2" : o === a.WSK_Card_Value_XW ? "king_x" : o === a.WSK_Card_Value_DW ? "king_d" : "put_1_" + o;
}
if (e === a.eWSKOneHandType.Double) {
return (o = this.cardValue(t[0])) === a.WSK_Card_Value_A ? "put_2_1" : o === a.WSK_Card_Value_2 ? "put_2_2" : o === a.WSK_Card_Value_XW ? "king_xx" : o === a.WSK_Card_Value_DW ? "king_dd" : "put_2_" + o;
}
if (e === a.eWSKOneHandType.Three || e === a.eWSKOneHandType.Bomb) {
var o = this.cardValue(t[0]), n = t.length;
return o === a.WSK_Card_Value_A ? "put_" + n + "_1" : o === a.WSK_Card_Value_2 ? "put_" + n + "_2" : "put_" + n + "_" + o;
}
if (e === a.eWSKOneHandType.Seq2) {
if ((n = t.length) > 6) return "seq2";
o = this.cardValue(t[0]);
if (4 === n) return "seq2_2_" + o;
if (6 === n) return "seq2_3_" + o;
}
if (e === a.eWSKOneHandType.Seq3) return "seq3";
if (e === a.eWSKOneHandType.WSKFalse) return "wsk_false";
if (e === a.eWSKOneHandType.WSKTrue) {
if (6 === (n = t.length)) return "wsk_liti";
var r = this.cardColor(t[0]);
if (r === a.eWSKCardColor.Fang) return "wsk_fang";
if (r === a.eWSKCardColor.Mei) return "wsk_mei";
if (r === a.eWSKCardColor.Hong) return "wsk_hong";
if (r === a.eWSKCardColor.Hei) return "wsk_hei";
}
return e === a.eWSKOneHandType.BombKing ? "king_4" : void 0;
};
t.prototype.oneHandWeight = function(e, t) {
var o = e.length;
if (t === a.eWSKOneHandType.Single) return r.Single;
if (t === a.eWSKOneHandType.Double) return r.Double;
if (t === a.eWSKOneHandType.Three) return r.Three;
if (t === a.eWSKOneHandType.Seq2) return r.Seq2;
if (t === a.eWSKOneHandType.Seq3) return r.Seq3;
if (t === a.eWSKOneHandType.Bomb) {
if (4 === o) return this._isWSKTrueBiggerBomb4 ? r.Bomb4_Small : r.Bomb4_Big;
if (5 === o) return r.Bomb5;
if (6 === o) return r.Bomb6;
if (7 === o) return r.Bomb7;
if (8 === o) return r.Bomb8;
}
if (t === a.eWSKOneHandType.BombKing) return r.BombKing4;
if (t === a.eWSKOneHandType.WSKFalse) return r.WSK_False;
if (t === a.eWSKOneHandType.WSKTrue) {
var n = this.cardColor(e[0]);
if (3 === e.length) {
if (n === a.eWSKCardColor.Hei) return r.WSK_Hei;
if (n === a.eWSKCardColor.Hong) return r.WSK_Hong;
if (n === a.eWSKCardColor.Mei) return r.WSK_Mei;
if (n === a.eWSKCardColor.Fang) return r.WSK_Fang;
}
if (6 === e.length) {
if (n === a.eWSKCardColor.Hei) return r.WSK_Double_Hei;
if (n === a.eWSKCardColor.Hong) return r.WSK_Double_Hong;
if (n === a.eWSKCardColor.Mei) return r.WSK_Double_Mei;
if (n === a.eWSKCardColor.Fang) return r.WSK_Double_Fang;
}
}
cc.error("不应该走到此逻辑，检查代码逻辑错误~");
};
t.prototype._findInvalies = function(e, t, o, n) {
for (var i = [], s = this.oneHandWeight(o, n), l = [], c = {}, u = 0, d = t.length; u < d; u++) {
var p = t[u];
if (s >= r.WSK_False) {
if (this.oneHandInfo(p)[0].type === a.eWSKOneHandType.WSKTrue) {
i = i.concat(p);
continue;
}
}
for (var f = 0, h = p.length; f < h; f++) {
var m = p[f];
c[this.cardValue(m)] = !0;
}
}
for (u = 0, d = e.length; u < d; u++) {
m = e[u];
c[this.cardValue(m)] || l.push(m);
}
if (0 === i.length) return l;
var y = [];
for (u = l.length - 1; u >= 0; u--) {
m = l[u];
-1 === i.indexOf(m) && y.push(m);
}
return y;
};
t.prototype._tipNull = function(e, t) {
for (var o = this, n = [], r = e.length - 1; r >= 0; ) {
var i = e[r], a = t[this.cardValue(i)], s = this._newTip(e, r, a);
n.push(s);
r -= a;
}
n.sort(function(e, t) {
return o.compareBomb(e, t);
});
return n;
};
t.prototype._tipSingle = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipSingle(e, t, o))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipDouble = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipDouble(e, t, o))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipThree = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipThree(e, t, o))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipSeq = function(e, t, o, n, r) {
var i = [];
return i = (i = i.concat(this._getTipSeq(e, t, o, n, r))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipWSKFalse = function(e, t) {
var o = [];
return o = (o = (o = (o = this._isWSKTrueBiggerBomb4 ? (o = o.concat(this._getTipBombs(e, t, r.Bomb4_Small, r.Bomb4_Small))).concat(this._getTipWSKs(e, r.WSK_Fang, r.WSK_Hei)) : (o = o.concat(this._getTipWSKs(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb4_Big, r.Bomb4_Big))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipWSKDoubles(e, r.WSK_Double_Fang, r.WSK_Double_Hei));
};
t.prototype._tipWSKTrue = function(e, t, o, n) {
var i = [], a = n + 1;
a <= r.WSK_Hei && (i = i.concat(this._getTipWSKs(e, a, r.WSK_Hei)));
this._isWSKTrueBiggerBomb4 || (i = i.concat(this._getTipBombs(e, t, r.Bomb4_Big, r.Bomb4_Big)));
return i = (i = (i = i.concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipWSKDoubles(e, r.WSK_Double_Fang, r.WSK_Double_Hei));
};
t.prototype._tipWSKTrueDouble = function(e, t, o, n) {
var i = [], a = n + 1;
a <= r.WSK_Double_Hei && (i = i.concat(this._getTipWSKDoubles(e, a, r.WSK_Double_Hei)));
return i;
};
t.prototype._tipBomb = function(e, t, o, n) {
var i = [];
i = i.concat(this._getTipMoreThanOne(e, t, o, n));
4 === n && this._isWSKTrueBiggerBomb4 && (i = i.concat(this._getTipWSKs(e, r.WSK_Fang, r.WSK_Hei)));
var a = r.Bomb8 + 1, s = r.Bomb8;
4 === n && (a = r.Bomb5);
5 === n && (a = r.Bomb6);
6 === n && (a = r.Bomb7);
7 === n && (a = r.Bomb8);
a <= s && (i = i.concat(this._getTipBombs(e, t, a, s)));
return i = (i = i.concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipWSKDoubles(e, r.WSK_Double_Fang, r.WSK_Double_Hei));
};
t.prototype._tipKing = function(e) {
var t = [];
return t = t.concat(this._getTipWSKDoubles(e, r.WSK_Double_Fang, r.WSK_Double_Hei));
};
t.prototype._getTipMoreThanOne = function(e, t, o, n) {
for (var r = [], i = e.length - 1; i >= 0; ) {
var s = e[i], l = this.cardValue(s);
if (l > a.WSK_Card_Value_2) break;
var c = t[l];
c === n && this.compare(s, o, !1) > 0 && r.push(this._newTip(e, i, c));
i -= c;
}
return r;
};
t.prototype._getTipSingle = function(e, t, o) {
for (var n = [], r = [], i = [], a = e.length - 1; a >= 0; ) {
var s = e[a], l = t[this.cardValue(s)];
if (this.compare(s, o, !1) > 0) {
1 === l && n.push(this._newTip(e, a, 1));
2 === l && r.push(this._newTip(e, a, 1));
3 === l && i.push(this._newTip(e, a, 1));
}
a -= l;
}
return [].concat(n).concat(r).concat(i);
};
t.prototype._getTipDouble = function(e, t, o) {
for (var n = [], r = [], i = e.length - 1; i >= 0; ) {
var a = e[i], s = t[this.cardValue(a)];
if (this.compare(a, o, !1) > 0) {
2 === s && n.push(this._newTip(e, i, 2));
3 === s && r.push(this._newTip(e, i, 2));
}
i -= s;
}
return [].concat(n).concat(r);
};
t.prototype._getTipThree = function(e, t, o) {
for (var n = [], r = e.length - 1; r >= 0; ) {
var i = e[r], a = t[this.cardValue(i)];
this.compare(i, o, !1) > 0 && 3 === a && n.push(this._newTip(e, r, 3));
r -= a;
}
return n;
};
t.prototype._getTipSeq = function(e, t, o, n, r) {
for (var i = function(e, t, o) {
for (var r = 0, i = o.length; r < i; r++) if (r >= e && r <= t && !(o[r] >= n)) return !1;
return !0;
}, s = [], l = e.length - 1; l >= 0; ) {
var c = e[l], u = this.cardValue(c), d = u + r - 1;
if (d > a.WSK_Card_Value_A) break;
var p = t[u];
if (this.compare(c, o, !1) <= 0) ; else {
i(u, d, t) && s.push(this._newSeqTip(e, l, n, r, t));
}
l -= p;
}
return s;
};
t.prototype._getTipAllBomb = function(e, t, o) {
var n = [];
n = n.concat(this._getTipWSKs(e, r.WSK_False, r.WSK_False));
return n = (n = (n = (n = this._isWSKTrueBiggerBomb4 ? (n = n.concat(this._getTipBombs(e, t, r.Bomb4_Small, r.Bomb4_Small))).concat(this._getTipWSKs(e, r.WSK_Fang, r.WSK_Hei)) : (n = n.concat(this._getTipWSKs(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb4_Big, r.Bomb4_Big))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipWSKDoubles(e, r.WSK_Double_Fang, r.WSK_Double_Hei));
};
t.prototype._getTipBombs = function(e, t, o, n) {
for (var r = this, i = [], s = e.length - 1; s >= 0; ) {
var l = e[s], c = this.cardValue(l), u = t[c];
if (c > a.WSK_Card_Value_2) break;
if (u >= this.ruleBombMinNum) {
var d = this._newTip(e, s, u), p = this.oneHandWeight(d, a.eWSKOneHandType.Bomb);
p >= o && p <= n && i.push(d);
}
s -= u;
}
i.sort(function(e, t) {
return r.compareBomb(e, t);
});
return i;
};
t.prototype._getTipWSKs = function(e, t, o) {
var n = this, r = [], i = this._split510kCards(e), s = i._510kReal, l = -1, c = function(e, i) {
for (var a = e.length - 1; a >= 0; a -= 3) {
var s = [ e[a - 2], e[a - 1], e[a - 0] ], c = n.oneHandWeight(s, i);
if (c >= t && c <= o) {
c !== l && r.push(s);
l = c;
}
}
};
c(i._510kFake, a.eWSKOneHandType.WSKFalse);
c(s, a.eWSKOneHandType.WSKTrue);
return r;
};
t.prototype._getTipWSKDoubles = function(e, t, o) {
var n = this, r = [];
(function(e, i) {
for (var a = e.length - 1; a >= 3; a -= 3) {
var s = e[a - 0], l = e[a - 3];
if (n.cardColor(s) === n.cardColor(l)) {
var c = [ e[a - 5], e[a - 4], e[a - 3], e[a - 2], e[a - 1], e[a - 0] ], u = n.oneHandWeight(c, i);
u >= t && u <= o && r.push(c);
}
}
})(this._split510kCards(e)._510kReal, a.eWSKOneHandType.WSKTrue);
return r;
};
t.prototype._getTipKings = function(e, t, o) {
for (var n = [], r = 0, i = e.length; r < i; r++) {
var s = e[r];
if (this.cardColor(s) !== a.eWSKCardColor.King) break;
n.push(s);
}
return 4 === n.length ? [ n ] : [];
};
return t;
}(a.default);
o.default = s;
cc._RF.pop();
