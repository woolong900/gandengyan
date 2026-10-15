// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "79da8sZx4tMEb76EyU3fBJm", "GameLogicMJ_HZHH");
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
var r = require("./CardUtils"), i = require("./RoomInfoData"), a = require("./CommonUtils"), s = require("./GameLogicMJ"), l = require("./CommonEnum"), c = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e10) % 10, a = Math.floor(t / 1e9) % 10, s = Math.floor(t / 1e8) % 10, c = Math.floor(t / 1e7) % 10, u = Math.floor(t / 1e6) % 10, d = Math.floor(t / 1e5) % 10;
n = Math.floor(t / 1e4) % 10;
var p = Math.floor(t / 1e3) % 10, f = Math.floor(t / 100) % 10, h = Math.floor(t / 10) % 10, m = Math.floor(t / 1) % 10;
8 === e && r.push(9);
16 === e && r.push(10);
0 === a && r.push(20);
1 === a && r.push(21);
2 === a && r.push(22);
3 === a && r.push(23);
4 === a && r.push(24);
5 === a && r.push(25);
1 == s && r.push(200);
1 === c && r.push(19);
1 == u && r.push(18);
1 == d && r.push(16);
0 == p && r.push(14);
1 == p && r.push(15);
0 === f && r.push(1);
1 === f && r.push(2);
2 === f && r.push(3);
3 === f && r.push(4);
4 === f && r.push(5);
0 === h && r.push(6);
1 === h && r.push(7);
2 === h && r.push(8);
0 === m && r.push(11);
1 === m && r.push(12);
2 === m && r.push(13);
3 === m && r.push(17);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
return {
index: l.eGameIds.HZHH,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.IPStatus() ? "1" : "0", r = "0", i = e.peopleCount();
4 === i && (r = "0");
3 === i && (r = "1");
2 === i && (r = "2");
var a = "" + e.payType(), s = e.isChecked(19) ? "1" : "0", l = e.isChecked(18) ? "1" : "0", c = e.isChecked(16) ? "1" : "0", u = "1";
e.isChecked(14) && (u = "0");
var d = "0";
e.isChecked(20) && (d = "0");
e.isChecked(21) && (d = "1");
e.isChecked(22) && (d = "2");
e.isChecked(23) && (d = "3");
e.isChecked(24) && (d = "4");
e.isChecked(25) && (d = "5");
var p = "0";
e.isChecked(30) && (p = "0");
e.isChecked(31) && (p = "1");
e.isChecked(32) && (p = "2");
e.isChecked(33) && (p = "3");
var f = e.findCheckedIds([ 1, 2, 3, 4, 5 ]), h = "" + e.getValue(f[0]);
o = p + d + (e.isChecked(200) ? "1" : "0") + s + l + c + n + u + h + r + a;
var m = 1, y = e.gameCount();
8 === y && (m = 1);
16 === y && (m = 2);
var g = parseInt(o);
return {
gameType: e.index,
num: m,
param1: 1,
param2: g,
clubId: t
};
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(21) ? 15 : t.isChecked(22) ? 30 : t.isChecked(23) ? 60 : t.isChecked(24) ? 120 : t.isChecked(25) ? 600 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(21) || (!!e.isChecked(22) || (!!e.isChecked(23) || (!!e.isChecked(24) || !!e.isChecked(25))));
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(18);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(19);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 1, 2, 3, 4, 5 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 11, 12, 13, 17 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 1, 2, 3, 4, 5 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 14, 15, 16, 200 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 30, 31, 32, 33 ], t);
s = s && "" + t + s + "离线踢人";
if (o) {
var l = e.listDesc([ 6, 7, 8 ], t);
return n + (l = l && "" + t + l + "房") + r + i + a + s;
}
return n + r + i + a + s;
};
t.prototype.cardStorageTotal = function(e) {
return this.isPiZi(e) ? 3 : 4;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 11, 12, 13, 17 ]), n = e.listDesc(o, "、");
t += n;
t += "\n玩法：";
o = e.findCheckedIds([ 1, 2, 3, 4, 5 ]);
t += n = e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 18, 19, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
t += "\n其它：";
o = e.findCheckedIds([ 14, 15, 16 ]);
t += n = e.listDesc(o, "、");
t += this.roomTypeDesc(e, "\n托管：", [ 20, 21, 22, 23, 24, 25 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
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
if (i.default.gameInfo.isLaiZi(t)) for (var n = o, r = 0, a = n.length; r < a; r++) if (n[r] !== t) return !1;
return e.prototype.canPut.call(this, t, o);
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.tipDescOpen = function() {
var e = i.default.myAbsolutePos(), t = i.default.gameInfo.siteInfos.get(e), o = t.handCards.length, n = 0;
if (o > 12) for (var r = 0; r < o; r++) this.isLaiZi(t.handCards[r]) && n++;
return n > 1 ? "你手上有两个癞子，开口后只能胡大胡哦！" : null;
};
t.prototype.tipDescGuo = function() {
var e = i.default.myAbsolutePos(), t = i.default.gameInfo.siteInfos.get(e).operateOptions();
if (t) {
if (t.collection(function(e) {
return e.isLiangLai();
}).length > 0) return "不亮癞只能胡大胡哦~";
}
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
s.push(i.default.gameInfo.lz);
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
if (0 == this.openCount(t)) return !0;
if (this.isQingYiSe(e, t)) return !0;
if (o >= 2) {
return this.isLiangLai(t);
}
return !0;
};
t.prototype.clubTableColor = function() {
return cc.color(171, 63, 151);
};
return t;
}(s.default);
o.default = c;
cc._RF.pop();
