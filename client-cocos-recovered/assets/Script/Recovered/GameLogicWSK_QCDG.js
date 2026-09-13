// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "57300JYVoFCB4CNOt0fnw1G", "GameLogicWSK_QCDG");
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
var r, i = require("./CommonEnum"), a = require("./GameLogicWSK");
(function(e) {
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.Seq1 = 3] = "Seq1";
e[e.Seq2 = 4] = "Seq2";
e[e.Bomb3 = 5] = "Bomb3";
e[e.Bomb4 = 6] = "Bomb4";
e[e.WSK_False = 7] = "WSK_False";
e[e.Bomb5 = 8] = "Bomb5";
e[e.WSK_Fang = 9] = "WSK_Fang";
e[e.WSK_Mei = 10] = "WSK_Mei";
e[e.WSK_Hong = 11] = "WSK_Hong";
e[e.WSK_Hei = 12] = "WSK_Hei";
e[e.Bomb6 = 13] = "Bomb6";
e[e.BombKing2_XX = 14] = "BombKing2_XX";
e[e.BombKing2_DX = 15] = "BombKing2_DX";
e[e.BombKing2_DD = 16] = "BombKing2_DD";
e[e.Bomb7 = 17] = "Bomb7";
e[e.BombKing3 = 18] = "BombKing3";
e[e.Bomb8 = 19] = "Bomb8";
e[e.BombKing4 = 20] = "BombKing4";
})(r || (r = {}));
var s = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = Math.floor(t / 1e7) % 10, a = Math.floor(t / 1e6) % 10, s = Math.floor(t / 1) % 10, l = Math.floor(t / 10) % 10, c = Math.floor(t / 100) % 10, u = Math.floor(t / 1e3) % 10, d = Math.floor(t / 1e4) % 10, p = Math.floor(t / 1e5) % 10;
o /= 10;
1 == r && n.push(200);
3 === e && n.push(1);
6 === e && n.push(2);
9 === e && n.push(3);
12 === e && n.push(4);
0 === s && n.push(5);
1 === s && n.push(6);
2 === s && n.push(7);
3 === s && n.push(8);
1 === a && n.push(20);
1 === p && n.push(17);
1 === d && n.push(19);
0 === u && n.push(14);
1 === u && n.push(15);
2 === u && n.push(16);
0 === l && n.push(28);
1 === l && n.push(29);
2 === l && n.push(30);
3 === l && n.push(31);
5 === o && n.push(9);
10 === o && n.push(10);
20 === o && n.push(11);
30 === o && n.push(12);
50 === o && n.push(13);
n.push(18);
return {
index: i.eGameIds.QCDG,
ids: n,
ipLimit: c,
other: {}
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = this.configCell2Str(e, [ 5, 6, 7, 8 ], [ "0", "1", "2", "3" ]), n = this.configCell2Str(e, [ 28, 29, 30, 31 ], [ "0", "1", "2", "3" ]), r = e.IPStatus() ? "1" : "0", i = this.configCell2Str(e, [ 14, 15, 16 ], [ "0", "1", "2" ]), a = this.configCell2Str(e, [ 19 ], [ "1" ]), s = this.configCell2Str(e, [ 17 ], [ "1" ]), l = this.configCell2Str(e, [ 9, 10, 11, 12, 13 ], [ "5", "10", "20", "30", "50" ]), c = this.configCell2Str(e, [ 20 ], [ "1" ]), u = this.configCell2Str(e, [ 200 ], [ "1" ]), d = parseInt(u + c + s + a + i + r + n + o), p = 1, f = e.gameCount();
3 === f && (p = 1);
6 === f && (p = 2);
9 === f && (p = 3);
12 === f && (p = 4);
return {
gameType: e.index,
num: p,
param1: 10 * parseInt(l),
param2: d,
clubId: t
};
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(17);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
t.prototype.isRecordCard = function(e) {
return e.isChecked(19);
};
t.prototype.allCards = function(t) {
return e.prototype.allCards.call(this, t);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 9, 10, 11, 12, 13 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 14, 15, 16, 17, 28, 29, 30, 31, 200 ], i = [].concat([ 5, 6, 7, 8 ]).concat([ 9, 10, 11, 12, 13 ]).concat(r);
return n + e.listDescDetails(i, t);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "支付：", [ 5, 6, 7, 8 ]);
t += this.roomTypeDesc(e, "\n底分：", [ 9, 10, 11, 12, 13 ]);
t += this.roomTypeDesc(e, "\n玩法：", [ 14, 15, 16 ]);
t += this.roomTypeDesc(e, "\n功能：", [ 17, 20, 200 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 28, 29, 30, 31 ]);
};
t.prototype.init = function(e) {
this.ruleBombMinNum = 3;
this.ruleSeq1MinLen = 3;
this.ruleSeq2MinLen = 2;
this.ruleSeq3MinLen = -1;
this.ruleRazzList = [];
this.ruleIsRazzCanReplaceTo510k = !1;
this.ruleRazzIsCanPut = !1;
this.ruleRazzPutAsCard = 0;
};
t.prototype.oneHandInfo = function(t) {
return t.length > 1 && this.isSameColor(t, a.eWSKCardColor.King) ? [ {
type: a.eWSKOneHandType.BombKing,
cards: [].concat(t)
} ] : e.prototype.oneHandInfo.call(this, t);
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
o === a.eWSKOneHandType.Three && (l = this._tipBomb3(s, i, c));
o === a.eWSKOneHandType.Seq1 && (l = this._tipSeq(s, i, c, 1, t.length));
o === a.eWSKOneHandType.Seq2 && (l = this._tipSeq(s, i, c, 2, t.length / 2));
if (o === a.eWSKOneHandType.WSKTrue) {
var u = this.cardColor(c);
u === a.eWSKCardColor.Fang && (l = this._tipWSKTrue(s, i, c, r.WSK_Fang));
u === a.eWSKCardColor.Mei && (l = this._tipWSKTrue(s, i, c, r.WSK_Mei));
u === a.eWSKCardColor.Hong && (l = this._tipWSKTrue(s, i, c, r.WSK_Hong));
u === a.eWSKCardColor.Hei && (l = this._tipWSKTrue(s, i, c, r.WSK_Hei));
}
o === a.eWSKOneHandType.WSKFalse && (l = this._tipWSKFalse(s, i));
if (o === a.eWSKOneHandType.Bomb) {
3 === (d = t.length) && (l = this._tipBomb3(s, i, c));
4 === d && (l = this._tipBomb4(s, i, c));
5 === d && (l = this._tipBomb5(s, i, c));
6 === d && (l = this._tipBomb6(s, i, c));
7 === d && (l = this._tipBomb7(s, i, c));
8 === d && (l = this._tipBomb8(s, i, c));
}
if (o === a.eWSKOneHandType.BombKing) {
var d;
2 === (d = t.length) && (l = this._tipKing2(s, i, c));
3 === d && (l = this._tipKing3(s, i, c));
}
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
return (o = this.cardValue(t[0])) === a.WSK_Card_Value_A ? "put_2_1" : o === a.WSK_Card_Value_2 ? "put_2_2" : "put_2_" + o;
}
if (e === a.eWSKOneHandType.Bomb) {
if (3 === t.length) {
var o;
return (o = this.cardValue(t[0])) === a.WSK_Card_Value_A ? "put_3_1" : o === a.WSK_Card_Value_2 ? "put_3_2" : "put_3_" + o;
}
return "bomb";
}
if (e === a.eWSKOneHandType.Seq2) return "seq2";
if (e === a.eWSKOneHandType.BombKing) {
return "king_" + t.length;
}
return e === a.eWSKOneHandType.WSKFalse ? "bomb_510K" : e === a.eWSKOneHandType.WSKTrue ? "bomb_510K_same" : void 0;
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
t.prototype.oneHandWeight = function(e, t) {
var o = e.length;
if (t === a.eWSKOneHandType.Single) return r.Single;
if (t === a.eWSKOneHandType.Double) return r.Double;
if (t === a.eWSKOneHandType.Seq1) return r.Seq1;
if (t === a.eWSKOneHandType.Seq2) return r.Seq2;
if (t === a.eWSKOneHandType.Bomb) {
if (3 === o) return r.Bomb3;
if (4 === o) return r.Bomb4;
if (5 === o) return r.Bomb5;
if (6 === o) return r.Bomb6;
if (7 === o) return r.Bomb7;
if (8 === o) return r.Bomb8;
}
if (t === a.eWSKOneHandType.BombKing) {
if (4 === o) return r.BombKing4;
if (3 === o) return r.BombKing3;
if (2 === o) {
var n = this.cardValue(e[0]);
return n === this.cardValue(e[1]) ? n === a.WSK_Card_Value_DW ? r.BombKing2_DD : r.BombKing2_XX : r.BombKing2_DX;
}
}
if (t === a.eWSKOneHandType.WSKFalse) return r.WSK_False;
if (t === a.eWSKOneHandType.WSKTrue) {
var i = this.cardColor(e[0]);
if (i === a.eWSKCardColor.Hei) return r.WSK_Hei;
if (i === a.eWSKCardColor.Hong) return r.WSK_Hong;
if (i === a.eWSKCardColor.Mei) return r.WSK_Mei;
if (i === a.eWSKCardColor.Fang) return r.WSK_Fang;
}
cc.error("不应该走到此逻辑，检查代码逻辑错误~");
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
t.prototype._getTipSingle = function(e, t, o) {
for (var n = [], r = [], i = e.length - 1; i >= 0; ) {
var a = e[i], s = t[this.cardValue(a)];
if (this.compare(a, o, !1) > 0) {
1 === s && n.push(this._newTip(e, i, 1));
2 === s && r.push(this._newTip(e, i, 1));
}
i -= s;
}
return [].concat(n).concat(r);
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
t.prototype._getTip510ks = function(e, t, o) {
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
t.prototype._getTipKings = function(e, t, o) {
for (var n = [], r = 0, i = e.length; r < i; r++) {
var s = e[r];
if (this.cardColor(s) !== a.eWSKCardColor.King) break;
n.push(s);
}
var l = n.length;
if (0 === l) return [];
var c = -1;
return (c = l > 1 ? this.oneHandWeight(n, a.eWSKOneHandType.BombKing) : this.oneHandWeight(n, a.eWSKOneHandType.Single)) >= t && c <= o ? [ n ] : [];
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
t.prototype._getTipAllBomb = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipBombs(e, t, r.Bomb3, r.Bomb4))).concat(this._getTip510ks(e, r.WSK_False, r.WSK_False))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipSingle = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipSingle(e, t, o))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipDouble = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 2))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipSeq = function(e, t, o, n, r) {
var i = [];
return i = (i = i.concat(this._getTipSeq(e, t, o, n, r))).concat(this._getTipAllBomb(e, t, o));
};
t.prototype._tipWSKFalse = function(e, t) {
var o = [];
return o = (o = (o = (o = (o = (o = (o = (o = o.concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipWSKTrue = function(e, t, o, n) {
var i = [], a = n + 1;
a <= r.WSK_Hei && (i = i.concat(this._getTip510ks(e, a, r.WSK_Hei)));
return i = (i = (i = (i = (i = (i = i.concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipKing2 = function(e, t, o) {
var n = [];
return n = (n = (n = n.concat(this._getTipKings(e, r.BombKing2_DD, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipKing3 = function(e, t, o) {
var n = [];
return n = n.concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb3 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 3))).concat(this._getTipBombs(e, t, r.Bomb4, r.Bomb4))).concat(this._getTip510ks(e, r.WSK_False, r.WSK_False))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipBomb4 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 4))).concat(this._getTip510ks(e, r.WSK_False, r.WSK_False))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipBomb5 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 5))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipBomb6 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 6))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipBomb7 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 7))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
t.prototype._tipBomb8 = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 8))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4));
};
return t;
}(a.default);
o.default = s;
cc._RF.pop();
