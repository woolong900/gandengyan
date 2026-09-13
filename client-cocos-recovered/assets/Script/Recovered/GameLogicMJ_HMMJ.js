// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9f87czcHytKdLU/BJll1D6k", "GameLogicMJ_HMMJ");
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
var r = e("./CardUtils"), i = e("./RoomInfoData"), a = e("./CommonUtils"), s = e("./GameLogicMJ"), l = e("./CommonEnum"), c = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e11) % 10, a = Math.floor(t / 1e10) % 10, s = Math.floor(t / 1e9) % 10, c = Math.floor(t / 1e8) % 10, u = Math.floor(t / 1e7) % 10;
n = Math.floor(t / 1e6) % 10;
var d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e4) % 10, f = Math.floor(t / 1e3) % 10, h = Math.floor(t / 100) % 10, m = Math.floor(t / 10) % 10, y = Math.floor(t / 1) % 10;
8 === e && r.push(9);
16 === e && r.push(10);
1 === s && r.push(29);
1 == c && r.push(27);
1 == u && r.push(28);
0 == p && r.push(19);
1 == p && r.push(20);
2 == p && r.push(21);
3 == p && r.push(22);
4 == p && r.push(23);
5 == p && r.push(24);
0 == d && r.push(25);
1 == d && r.push(26);
0 === h && r.push(1);
1 === h && r.push(2);
2 === h && r.push(3);
3 === h && r.push(4);
0 == f && r.push(16);
1 == f && r.push(17);
2 == f && r.push(18);
0 === m && r.push(6);
1 === m && r.push(7);
2 === m && r.push(8);
0 === y && r.push(11);
1 === y && r.push(12);
2 === y && r.push(13);
3 === y && r.push(14);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
0 === a && r.push(41);
1 === a && r.push(42);
2 === a && r.push(43);
3 === a && r.push(44);
4 === a && r.push(45);
5 === a && r.push(46);
return {
index: l.eGameIds.HMMJ,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.IPStatus() ? "1" : "0", r = "0", i = e.peopleCount();
4 === i && (r = "0");
3 === i && (r = "1");
2 === i && (r = "2");
var a = "0";
e.isChecked(41) && (a = "0");
e.isChecked(42) && (a = "1");
e.isChecked(43) && (a = "2");
e.isChecked(44) && (a = "3");
e.isChecked(45) && (a = "4");
e.isChecked(46) && (a = "5");
var s = "0";
e.isChecked(30) && (s = "0");
e.isChecked(31) && (s = "1");
e.isChecked(32) && (s = "2");
e.isChecked(33) && (s = "3");
var l = "" + e.payType(), c = e.isChecked(29) ? "1" : "0", u = e.isChecked(27) ? "1" : "0", d = e.isChecked(28) ? "1" : "0", p = e.findCheckedIds([ 19, 20, 21, 22, 23, 24 ]), f = "" + e.getValue(p[0]), h = "1";
e.isChecked(26) && (h = "0");
var m = e.findCheckedIds([ 1, 2, 3, 4 ]), y = "" + e.getValue(m[0]), g = e.findCheckedIds([ 16, 17, 18 ]);
o = s + a + c + u + d + n + h + f + ("" + e.getValue(g[0])) + y + r + l;
var _ = 1, v = e.gameCount();
8 === v && (_ = 1);
16 === v && (_ = 2);
var C = parseInt(o);
return {
gameType: e.index,
num: _,
param1: 1,
param2: C,
clubId: t
};
};
t.prototype.isRealTime = function(e) {
return e.isChecked(27);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(29);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 1, 2, 3, 4 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 11, 12, 13, 14 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 1, 2, 3, 4 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 25, 26 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 41, 42, 43, 44, 45, 46 ], t);
s = s && "" + t + s + "托管";
var l = e.listDesc([ 30, 31, 32, 33 ], t);
l = l && "" + t + l + "离线踢人";
if (o) {
var c = e.listDesc([ 6, 7, 8 ], t);
return n + (c = c && "" + t + c + "房") + r + i + a + s + l;
}
return n + r + i + a + s + l;
};
t.prototype.cardStorageTotal = function(e) {
return this.isPiZi(e) ? 3 : 4;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 11, 12, 13, 14 ]), n = e.listDesc(o, "、");
t += n;
t += "\n玩法：";
o = e.findCheckedIds([ 1, 2, 3, 4 ]);
t += n = e.listDesc(o, "、");
t += "\n抢杠设置：";
o = e.findCheckedIds([ 25, 26 ]);
t += n = e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 27 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
t += "\n其它：";
o = e.findCheckedIds([ 16, 17, 18, 19, 20, 21, 22, 23, 24, 28 ]);
t += n = e.listDesc(o, "、");
t += this.roomTypeDesc(e, "\n托管：", [ 41, 42, 43, 44, 45, 46 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(42) ? 15 : t.isChecked(43) ? 30 : t.isChecked(44) ? 60 : t.isChecked(45) ? 120 : t.isChecked(46) ? 300 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(42) || (!!e.isChecked(43) || (!!e.isChecked(44) || (!!e.isChecked(45) || !!e.isChecked(46))));
};
t.prototype.tingCards = function(e, t) {
if (t) {
if (i.default.gameInfo.isLaiZi(t)) return [];
}
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
if (t) {
if (i.default.gameInfo.isLaiZi(t)) return !1;
}
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tingTipType = function(e) {
return e.length > 20 ? s.eTingTipType.JZH : s.eTingTipType.NORMAL;
};
t.prototype.canPut = function(t, o) {
var n = i.default.gameInfo.isLaiZi(t), r = i.default.config.isChecked(17);
if (n && !r) for (var a = o, s = 0, l = a.length; s < l; s++) if (a[s] !== t) return !1;
return e.prototype.canPut.call(this, t, o);
};
t.prototype.isGangCard = function(t) {
return 32 === t || e.prototype.isGangCard.call(this, t);
};
t.prototype.animationPZ = function(e) {
return "";
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.tipDescOpen = function() {
return null;
};
t.prototype.tipDescGuo = function() {
return null;
};
t.prototype.isZiMo = function(e) {
return !a.default.checkBit(e, 32) && !a.default.checkBit(e, 128);
};
t.prototype._tingCards = function(e, t, o) {
for (var n = e.handCards, a = e.operateList, s = [], l = this.initCardArr(), c = 0, u = 0; u < n.length; u++) {
var d = n[u];
if (this.isLaiZi(d)) c++; else {
var p = r.default.cardColor(d), f = r.default.cardValue(d);
l[p][0]++;
l[p][f]++;
}
}
if (null !== t && void 0 !== t) {
if (this.isLaiZi(t)) c--; else {
p = r.default.cardColor(t), f = r.default.cardValue(t);
l[p][0]--;
l[p][f]--;
}
}
if (this.havePiZi(l)) return [];
if (!this._checkHu(l, a, c, 1)) return [];
i.default.config.isChecked(18) || s.push(i.default.gameInfo.lz);
if (o) return s;
for (u = r.eCardColor.Bamboo; u <= r.eCardColor.wind; u++) for (var h = 1; h < l[u].length; h++) if (!(u === r.eCardColor.wind && h > 7)) {
d = r.default.card(u, h);
if (!this.isLaiZi(d) && !this.isPiZi(d)) {
l[u][0]++;
l[u][h]++;
this._checkHu(l, a, c, 0) && s.push(d);
l[u][0]--;
l[u][h]--;
}
}
return s;
};
t.prototype._checkHu = function(e, t, o, n) {
var i = o + n;
if (this.isQiDui(e, i)) return !0;
if (this.needLZ_SimpleCheck(e) > i) return !1;
if (this.isPengPengHu(e, t, i)) return !0;
for (var a = this.jiangAny(e), s = 0, l = 0; l < a.length; l++) {
var c = r.default.cardColor(a[l]), u = r.default.cardValue(a[l]);
e[c][0] -= 2;
e[c][u] -= 2;
s = 0;
for (var d = 0; d < e.length; d++) if (0 != e[d][0]) {
s += this.needLZ_Color3N(e, d);
}
e[c][0] += 2;
e[c][u] += 2;
if (s <= i) {
var p = this._checkCanHu(e, t, o, n);
if (p) return p;
}
}
if (i > 0) {
if (0 == e[r.eCardColor.Bamboo][0] + e[r.eCardColor.Characters][0] + e[r.eCardColor.Dots][0] + e[r.eCardColor.wind][0]) return !0;
for (l = 0; l < e.length; l++) if (0 !== e[l][0]) for (d = 1; d < e[l].length; d++) if (0 !== e[l][d]) {
e[l][0]--;
e[l][d]--;
s = 0;
for (var f = 0; f < e.length; f++) if (0 != e[f][0]) {
s += this.needLZ_Color3N(e, f);
}
e[l][d]++;
e[l][0]++;
if (s <= i - 1) return this._checkCanHu(e, t, o, n);
}
}
return !1;
};
t.prototype._checkCanHu = function(e, t, o, n) {
return this.isQingYiSe(e, t), !0;
};
t.prototype.clubTableColor = function() {
return cc.color(171, 63, 151);
};
return t;
}(s.default);
o.default = c;
cc._RF.pop();
