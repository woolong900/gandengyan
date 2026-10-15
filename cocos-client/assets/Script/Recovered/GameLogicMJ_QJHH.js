// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "25216KOztRMR6pLzoWX85Ry", "GameLogicMJ_QJHH");
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
var r = require("./RoomInfoData"), i = require("./CardUtils"), a = require("./CommonUtils"), s = require("./CommonEnum"), l = require("./GameLogicMJ"), c = require("./GameSoundMJ"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {}, i = Math.floor(t / 1) % 10, a = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = Math.floor(t / 1e4) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e6) % 10, f = Math.floor(t / 1e7) % 10, h = Math.floor(t / 1e8) % 10, m = Math.floor(t / 1e9) % 10, y = Math.floor(t / 1e10) % 10, g = Math.floor(t / 1e11) % 10, _ = Math.floor(t / 1e12) % 10, v = Math.floor(t / 1e13) % 10, C = Math.floor(t / 1e14) % 10, b = Math.floor(t / 1e15) % 10, D = Math.floor(o / 1) % 10, S = 0, w = 1;
if (o >= 1e3) {
1 == (S = Math.floor(o / 1e3) % 10) && (w = 1);
2 == S && (w = 2);
3 == S && (w = 2.5);
4 == S && (w = 5);
5 == S && (w = 10);
6 == S && (w = 20);
7 == S && (w = 25);
} else w = o / 10;
r[6] = w;
0 === i && n.push(1);
1 === i && n.push(2);
2 === i && n.push(26);
0 === a && n.push(3);
1 === a && n.push(4);
2 === a && n.push(5);
0 === l && n.push(7);
1 === l && n.push(8);
8 === e && n.push(9);
16 === e && n.push(10);
1 == b && n.push(200);
0 === c && n.push(11);
1 === c && n.push(12);
2 === c && n.push(13);
3 === c && n.push(14);
1 === u && n.push(15);
2 === u && n.push(16);
3 === u && n.push(17);
1 === d && n.push(18);
1 === p && n.push(19);
1 === f && n.push(20);
1 === h && n.push(21);
1 === y && n.push(22);
1 === g && n.push(23);
1 === _ && n.push(24);
1 === v && n.push(25);
0 === C && n.push(28);
1 === C && n.push(29);
2 === C && n.push(30);
3 === C && n.push(31);
4 === C && n.push(32);
0 === D && n.push(40);
1 === D && n.push(41);
2 === D && n.push(42);
3 === D && n.push(43);
return {
index: s.eGameIds.QJHH,
ids: n,
ipLimit: m,
other: r
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = void 0, n = "0";
e.isChecked(1) && (n = "0");
e.isChecked(2) && (n = "1");
e.isChecked(26) && (n = "2");
var r = "0", i = e.peopleCount();
2 === i && (r = "0");
3 === i && (r = "1");
4 === i && (r = "2");
var a = e.getValue(6);
1 == a && (o = 1);
2 == a && (o = 2);
2.5 == a && (o = 3);
5 == a && (o = 4);
10 == a && (o = 5);
20 == a && (o = 6);
25 == a && (o = 7);
var s = e.isChecked(7) ? "0" : "1", l = e.isChecked(9) ? 1 : 2, c = "0";
e.isChecked(11) && (c = "0");
e.isChecked(12) && (c = "1");
e.isChecked(13) && (c = "2");
e.isChecked(14) && (c = "3");
var u = "0";
e.isChecked(15) && (u = "1");
e.isChecked(16) && (u = "2");
e.isChecked(17) && (u = "3");
e.isChecked(27) && (u = "0");
var d = e.isChecked(18) ? "1" : "0", p = e.isChecked(19) ? "1" : "0", f = e.isChecked(20) ? "1" : "0", h = e.isChecked(21) ? "1" : "0", m = e.IPStatus() ? "1" : "0", y = e.isChecked(22) ? "1" : "0", g = e.isChecked(23) ? "1" : "0", _ = e.isChecked(24) ? "1" : "0", v = e.isChecked(25) ? "1" : "0", C = "0";
e.isChecked(28) && (C = "0");
e.isChecked(29) && (C = "1");
e.isChecked(30) && (C = "2");
e.isChecked(31) && (C = "3");
e.isChecked(32) && (C = "4");
var b = "0";
e.isChecked(40) && (b = "0");
e.isChecked(41) && (b = "1");
e.isChecked(42) && (b = "2");
e.isChecked(43) && (b = "3");
var D = e.isChecked(200) ? "1" : "0";
o = o + "00" + b;
var S = parseInt(D + C + v + _ + g + y + m + h + f + p + d + u + c + s + r + n);
return {
gameType: e.index,
num: l,
param1: parseInt(o),
param2: S,
clubId: t
};
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(22);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(24);
};
t.prototype.isQuickBegin = function(e) {
return e.isChecked(25);
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(6);
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 11, 12, 13, 14, 1, 2, 6, 7, 8, 20, 21, 23, 25, 28, 29, 30, 31, 32, 200 ], i = e.listDescDetails(r, t), a = e.listDesc([ 40, 41, 42, 43 ], t);
a = a && "" + t + a + "离线踢人";
if (o) {
return n + (e.listDescDetails([ 3, 4, 5 ], t) + t) + i + a;
}
return n + i + a;
};
t.prototype.cardStorageTotal = function(e) {
return this.isPiZi(e) ? 3 : 4;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "房费：";
var o = e.findCheckedIds([ 11, 12, 13, 14 ]), n = e.listDesc(o, "、");
t += n;
t += "\n玩法：";
o = e.findCheckedIds([ 1, 2, 26 ]);
t += n = e.listDesc(o, "、");
t += "\n底分：";
var r = e.desc(6);
o = e.findCheckedIds([ 7, 8 ]);
t += n = r + "、" + e.listDesc(o, "、");
t += "\n喜钱：";
t += n = 0 == (o = e.findCheckedIds([ 15, 16, 17 ])).length ? "关闭" : e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 22, 24, 25, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
o = e.findCheckedIds([ 20, 21, 23 ]);
if (n = e.listDesc(o, "、")) {
t += "\n其它：";
t += n;
}
t += this.roomTypeDesc(e, "\n托管：", [ 28, 29, 30, 31, 32 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 40, 41, 42, 43 ]);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(29) ? 15 : t.isChecked(30) ? 30 : t.isChecked(31) ? 60 : t.isChecked(32) ? 120 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(29) || (!!e.isChecked(30) || (!!e.isChecked(31) || !!e.isChecked(32)));
};
t.prototype.tingCards = function(e, t) {
if (r.default.config.isChecked(26) && t) {
if (r.default.gameInfo.isLaiZi(t)) return [];
}
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
if (r.default.config.isChecked(26) && t) {
if (r.default.gameInfo.isLaiZi(t)) return !1;
}
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tingTipType = function(e) {
return e.length > 20 ? l.eTingTipType.JZH : l.eTingTipType.NORMAL;
};
t.prototype.isSupportPiZi = function() {
return !0;
};
t.prototype.isZiMo = function(e) {
return !!a.default.checkBit(e, 1) || (!!a.default.checkBit(e, 2) || !a.default.checkBit(e, 4) && (!a.default.checkBit(e, 16) && (a.default.checkBit(e, 32),
!1)));
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
c.default.getInstance().outCard();
c.default.getInstance().playOperate("qj_lzg", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.getPzList = function(e) {
return [ e ];
};
t.prototype.isGangCard = function(t) {
return r.default.config.isChecked(26) ? e.prototype.isGangCard.call(this, t) : !!r.default.gameInfo.isLaiZi(t) || e.prototype.isGangCard.call(this, t);
};
t.prototype.canPut = function(t, o) {
if (r.default.gameInfo.isLaiZi(t)) {
if (r.default.gameInfo.siteInfos.paiDunRemain() <= 0) return !!function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
if (!r.default.gameInfo.isLaiZi(n)) return !1;
}
return !0;
}(o);
}
return e.prototype.canPut.call(this, t, o);
};
t.prototype.fixGameView = function() {
return s.eGameView.View3D;
};
t.prototype.paiDunOffset = function() {
return 4 === r.default.config.peopleCount() ? 0 : 8;
};
t.prototype.handMaxLen = function() {
return r.default.config.isChecked(19) ? 11 : 14;
};
t.prototype.pzImgName = function() {
return "ct";
};
t.prototype.handSort = function() {
return function(e, t) {
var o = r.default.gameInfo.isLaiZi(e);
return o !== r.default.gameInfo.isLaiZi(t) ? o ? -1 : 1 : e - t;
};
};
t.prototype.roomDescEx = function() {
return r.default.config.isChecked(7) ? "(暗杠四倍)" : "(暗杠二倍)";
};
t.prototype.tabelDesc = function() {
return r.default.config.listDesc([ 20, 21, 23 ], " ");
};
t.prototype.is3CardGang = function(e) {
return !!this.isPiZi(e);
};
t.prototype.isShowArrow = function() {
return !0;
};
t.prototype.isAnGangCardShow = function() {
return !0;
};
t.prototype.animationAg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "chaotianxiao" : "menxiao";
};
t.prototype.animationMg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "chaotianxiao" : "dianxiao";
};
t.prototype.animationBg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "chaotianxiao" : "huitouxiao";
};
t.prototype.animationLZ = function(e) {
return "shuailaizi";
};
t.prototype.soundAg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "qj_ctx" : "qj_ag";
};
t.prototype.soundMg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "qj_ctx" : "qj_mg";
};
t.prototype.soundBg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "qj_ctx" : "qj_bg";
};
t.prototype.soundPZ = function(e) {
return "qj_ct";
};
t.prototype.soundLZ = function(e) {
return "qj_lzg";
};
t.prototype.uiStyle1 = function() {
return !0;
};
t.prototype._tingCards = function(e, t, o) {
for (var n = e.handCards, a = e.operateList, s = [], l = this.initCardArr(), c = 0, u = 0; u < n.length; u++) {
var d = n[u];
if (this.isLaiZi(d)) c++; else {
var p = i.default.cardColor(d), f = i.default.cardValue(d);
if (l && l[p]) {
l[p][0]++;
l[p][f]++;
}
}
}
if (null !== t && void 0 !== t) {
if (this.isLaiZi(t)) c--; else {
p = i.default.cardColor(t), f = i.default.cardValue(t);
if (l && l[p]) {
l[p][0]--;
l[p][f]--;
}
}
}
var h = r.default.config.isChecked(26);
if (h) ; else if (c > 1) return [];
var m = c, y = r.default.config.isChecked(2);
if (1 === c && y) {
var g = r.default.gameInfo.lz;
p = i.default.cardColor(g), f = i.default.cardValue(g);
l[p][0]++;
l[p][f]++;
c = 0;
}
if (!this._checkHu(l, a, c, 1)) return [];
if (h) s.push(r.default.gameInfo.lz); else if (0 === m) {
g = r.default.gameInfo.lz;
if (y) {
p = i.default.cardColor(g), f = i.default.cardValue(g);
l[p][0]++;
l[p][f]++;
this._checkHu(l, a, c, 0) && s.push(g);
l[p][0]--;
l[p][f]--;
} else s.push(g);
}
if (o && s.length > 0) return s;
for (u = i.eCardColor.Bamboo; u <= i.eCardColor.wind; u++) for (var _ = 1; _ < l[u].length; _++) if (!(u === i.eCardColor.wind && _ > 7)) {
d = i.default.card(u, _);
if (!this.isLaiZi(d)) {
l[u][0]++;
l[u][_]++;
if (this._checkHu(l, a, c, 0)) {
s.push(d);
if (o) return s;
}
l[u][0]--;
l[u][_]--;
}
}
return s;
};
t.prototype._checkHu = function(e, t, o, n) {
var r = o + n;
if (this.needLZ_SimpleCheck(e) > r) return !1;
for (var a = this.jiangAny(e), s = 0, l = 0; l < a.length; l++) {
var c = i.default.cardColor(a[l]), u = i.default.cardValue(a[l]);
e[c][0] -= 2;
e[c][u] -= 2;
s = 0;
for (var d = 0; d < e.length; d++) if (0 != e[d][0]) {
s += this.needLZ_Color3N(e, d);
}
e[c][0] += 2;
e[c][u] += 2;
if (s <= r) {
var p = this._checkCanHu(e, t, o, n);
if (p) return p;
}
}
if (r > 0) {
if (0 == e[i.eCardColor.Bamboo][0] + e[i.eCardColor.Characters][0] + e[i.eCardColor.Dots][0] + e[i.eCardColor.wind][0]) return !0;
for (l = 0; l < e.length; l++) if (0 !== e[l][0]) for (d = 1; d < e[l].length; d++) if (0 !== e[l][d]) {
e[l][0]--;
e[l][d]--;
s = 0;
for (var f = 0; f < e.length; f++) if (0 != e[f][0]) {
s += this.needLZ_Color3N(e, f);
}
e[l][d]++;
e[l][0]++;
if (s <= r - 1) return this._checkCanHu(e, t, o, n);
}
}
return !1;
};
t.prototype._checkCanHu = function(e, t, o, n) {
return !0;
};
t.prototype.clubTableColor = function() {
return cc.color(60, 133, 181);
};
return t;
}(l.default);
o.default = u;
cc._RF.pop();
