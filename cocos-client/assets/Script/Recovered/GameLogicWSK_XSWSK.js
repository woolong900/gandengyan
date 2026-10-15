// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ccf41UszldI8Y+ySFwIEEPO", "GameLogicWSK_XSWSK");
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
e[e.WSK_Fang = 8] = "WSK_Fang";
e[e.WSK_Mei = 9] = "WSK_Mei";
e[e.WSK_Hong = 10] = "WSK_Hong";
e[e.WSK_Hei = 11] = "WSK_Hei";
e[e.Bomb5 = 12] = "Bomb5";
e[e.BombKing2_XX = 13] = "BombKing2_XX";
e[e.BombKing2_DX = 14] = "BombKing2_DX";
e[e.BombKing2_DD = 15] = "BombKing2_DD";
e[e.Bomb6 = 16] = "Bomb6";
e[e.BombKing3 = 17] = "BombKing3";
e[e.Bomb7 = 18] = "Bomb7";
e[e.BombKing4 = 19] = "BombKing4";
e[e.Bomb8 = 20] = "Bomb8";
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
var n = [], r = Math.floor(t / 1) % 10, a = Math.floor(t / 10) % 10, s = Math.floor(t / 100) % 10, l = (Math.floor(t / 1e3),
Math.floor(t / 1e4) % 10), c = Math.floor(t / 1e5) % 10, u = Math.floor(t / 1e6) % 10;
o /= 10;
1 == u && n.push(200);
3 === e && n.push(1);
6 === e && n.push(2);
9 === e && n.push(3);
12 === e && n.push(4);
0 === r && n.push(5);
1 === r && n.push(6);
2 === r && n.push(7);
3 === r && n.push(8);
1 === c && n.push(20);
1 === l && n.push(17);
0 === a && n.push(28);
1 === a && n.push(29);
2 === a && n.push(30);
3 === a && n.push(31);
1 === o && n.push(9);
2 === o && n.push(10);
3 === o && n.push(11);
5 === o && n.push(12);
10 === o && n.push(13);
n.push(18);
return {
index: i.eGameIds.XSWSK,
ids: n,
ipLimit: s,
other: {}
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = this.configCell2Str(e, [ 5, 6, 7, 8 ], [ "0", "1", "2", "3" ]), n = this.configCell2Str(e, [ 28, 29, 30, 31 ], [ "0", "1", "2", "3" ]), r = e.IPStatus() ? "1" : "0", i = this.configCell2Str(e, [ 17 ], [ "1" ]), a = this.configCell2Str(e, [ 9, 10, 11, 12, 13 ], [ "10", "20", "30", "50", "100" ]), s = this.configCell2Str(e, [ 20 ], [ "1" ]), l = this.configCell2Str(e, [ 200 ], [ "1" ]), c = parseInt(l + s + i + "0" + r + n + o), u = 1, d = e.gameCount();
3 === d && (u = 1);
6 === d && (u = 2);
9 === d && (u = 3);
12 === d && (u = 4);
var p = {
gameType: e.index,
num: u,
param1: parseInt(a),
param2: c,
clubId: t
};
cc.log("jsonData: ", p);
return p;
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
return !1;
};
t.prototype.allCards = function(t) {
return e.prototype.allCards.call(this, t);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 9, 10, 11, 12, 13 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 17, 28, 29, 30, 31, 200 ], i = [].concat([ 5, 6, 7, 8 ]).concat([ 9, 10, 11, 12, 13 ]).concat(r);
return n + e.listDescDetails(i, t);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "支付：", [ 5, 6, 7, 8 ]);
t += this.roomTypeDesc(e, "\n底分：", [ 9, 10, 11, 12, 13 ]);
t += this.roomTypeDesc(e, "\n功能：", [ 17, 20, 200 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 28, 29, 30, 31 ]);
};
t.prototype.init = function(e) {
this.ruleBombMinNum = 3;
this.ruleSeq1MinLen = 3;
this.ruleSeq2MinLen = 3;
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
var n = [].concat(e), i = this.cards2CountArr(n), s = this.sortDesc(n), l = t.length, c = [];
if (!(l > 0)) return {
tips: c = this._tipNull(s, i),
Invalids: []
};
var u = t[0];
o === a.eWSKOneHandType.Single && (c = this._tipSingle(s, i, u));
o === a.eWSKOneHandType.Double && (c = this._tipDouble(s, i, u));
o === a.eWSKOneHandType.Three && (c = this._tipBomb3(s, i, u));
o === a.eWSKOneHandType.Seq1 && (c = this._tipSeq(s, i, u, 1, l));
o === a.eWSKOneHandType.Seq2 && (c = this._tipSeq(s, i, u, 2, l / 2));
if (o === a.eWSKOneHandType.WSKTrue) {
var d = this.cardColor(u);
d === a.eWSKCardColor.Fang && (c = this._tipWSKTrue(s, i, u, r.WSK_Fang));
d === a.eWSKCardColor.Mei && (c = this._tipWSKTrue(s, i, u, r.WSK_Mei));
d === a.eWSKCardColor.Hong && (c = this._tipWSKTrue(s, i, u, r.WSK_Hong));
d === a.eWSKCardColor.Hei && (c = this._tipWSKTrue(s, i, u, r.WSK_Hei));
}
o === a.eWSKOneHandType.WSKFalse && (c = this._tipWSKFalse(s, i));
if (o === a.eWSKOneHandType.Bomb) {
3 === l && (c = this._tipBomb3(s, i, u));
4 === l && (c = this._tipBomb4(s, i, u));
5 === l && (c = this._tipBomb5(s, i, u));
6 === l && (c = this._tipBomb6(s, i, u));
7 === l && (c = this._tipBomb7(s, i, u));
8 === l && (c = this._tipBomb8(s, i, u));
}
if (o === a.eWSKOneHandType.BombKing) {
2 === l && (c = this._tipKing2(s, i, u));
3 === l && (c = this._tipKing3(s, i, u));
4 === l && (c = this._tipKing4(s, i, u));
}
return {
tips: c,
Invalids: this._findInvalies(n, c, t, o)
};
};
t.prototype.soundName = function(e, t) {
var o = this.cardValue(t);
return o === a.WSK_Card_Value_A ? e + "1" : o === a.WSK_Card_Value_2 ? e + "2" : o === a.WSK_Card_Value_XW ? e + "20" : o === a.WSK_Card_Value_DW ? e + "21" : e + o;
};
t.prototype.putSoundName = function(e, t) {
return e === a.eWSKOneHandType.Single ? this.soundName("put_single", t[0]) : e === a.eWSKOneHandType.Double ? this.soundName("put_double", t[0]) : e === a.eWSKOneHandType.Bomb ? (t.length,
"put_other_bomb") : e === a.eWSKOneHandType.Seq1 ? "put_other_shunzi" : e === a.eWSKOneHandType.Seq2 ? "put_other_liandui" : e === a.eWSKOneHandType.BombKing ? "put_other_bomb" : e === a.eWSKOneHandType.WSKFalse ? "put_other_bomb" : e === a.eWSKOneHandType.WSKTrue ? "put_other_bomb" : void 0;
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
return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipBombs(e, t, r.Bomb3, r.Bomb4))).concat(this._getTip510ks(e, r.WSK_False, r.WSK_False))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
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
return o = (o = (o = (o = (o = (o = (o = (o = o.concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipWSKTrue = function(e, t, o, n) {
var i = [], a = n + 1;
a <= r.WSK_Hei && (i = i.concat(this._getTip510ks(e, a, r.WSK_Hei)));
return i = (i = (i = (i = (i = (i = (i = i.concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipKing2 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = n.concat(this._getTipKings(e, r.BombKing2_DD, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipKing3 = function(e, t, o) {
var n = [];
return n = (n = n.concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipKing4 = function(e, t, o) {
var n = [];
return n = n.concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb3 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 3))).concat(this._getTipBombs(e, t, r.Bomb4, r.Bomb4))).concat(this._getTip510ks(e, r.WSK_False, r.WSK_False))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb4 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 4))).concat(this._getTip510ks(e, r.WSK_False, r.WSK_False))).concat(this._getTip510ks(e, r.WSK_Fang, r.WSK_Hei))).concat(this._getTipBombs(e, t, r.Bomb5, r.Bomb5))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb5 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 5))).concat(this._getTipKings(e, r.BombKing2_XX, r.BombKing2_DD))).concat(this._getTipBombs(e, t, r.Bomb6, r.Bomb6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb6 = function(e, t, o) {
var n = [];
return n = (n = (n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 6))).concat(this._getTipKings(e, r.BombKing3, r.BombKing3))).concat(this._getTipBombs(e, t, r.Bomb7, r.Bomb7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb7 = function(e, t, o) {
var n = [];
return n = (n = (n = n.concat(this._getTipMoreThanOne(e, t, o, 7))).concat(this._getTipKings(e, r.BombKing4, r.BombKing4))).concat(this._getTipBombs(e, t, r.Bomb8, r.Bomb8));
};
t.prototype._tipBomb8 = function(e, t, o) {
var n = [];
return n = n.concat(this._getTipMoreThanOne(e, t, o, 8));
};
return t;
}(a.default);
o.default = s;
cc._RF.pop();
