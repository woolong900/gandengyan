// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "deec8dPyTlMtbGPvju8wEHF", "GameLogicMJ_QJHZ");
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
var n = [], r = {}, i = Math.floor(t / 1) % 10, a = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = Math.floor(t / 1e4) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e6) % 10, f = Math.floor(t / 1e7) % 10, h = Math.floor(t / 1e8) % 10, m = Math.floor(t / 1e9) % 10, y = Math.floor(t / 1e10) % 10, g = Math.floor(t / 1e11) % 10, _ = Math.floor(t / 1e12) % 10;
1 == Math.floor(t / 1e13) % 10 && n.push(200);
0 === i && n.push(1);
1 === i && n.push(2);
0 === a && n.push(20);
1 === a && n.push(21);
2 === a && n.push(22);
0 === l && n.push(23);
1 === l && n.push(24);
0 === c && n.push(18);
1 === c && n.push(19);
0 === u && n.push(25);
1 === u && n.push(26);
0 === d && n.push(11);
1 === d && n.push(12);
2 === d && n.push(13);
3 === d && n.push(14);
1 === p && n.push(28);
1 === f && n.push(27);
2 === h && n.push(3);
1 === h && n.push(4);
0 === h && n.push(5);
1 === m && n.push(16);
1 === y && n.push(15);
0 === g && n.push(7);
1 === g && n.push(8);
1 === _ && n.push(32);
var v = Math.floor(o / 1) % 10, C = Math.floor(o / 10) % 10, b = Math.floor(o / 100) % 10, D = Math.floor(o / 1e3) % 10, S = Math.floor(o / 1e4) % 10, w = Math.floor(o / 1e5) % 10, O = Math.floor(o / 1e6) % 10, P = Math.floor(o / 1e7) % 10, I = Math.floor(o / 1e8) % 10;
r[6] = [ .5, 1, 2, 2.5, 5, 10, 20, 50, 100 ][v];
w > 0 && (r[6] = [ .1, .2, .25 ][w - 1]);
1 === C && n.push(29);
1 === D && n.push(31);
1 === S && n.push(17);
1 === O && n.push(40);
8 === e && n.push(9);
16 === e && n.push(10);
0 === P && n.push(41);
1 === P && n.push(42);
2 === P && n.push(43);
3 === P && n.push(44);
4 === P && n.push(45);
5 === P && n.push(46);
0 === I && n.push(50);
1 === I && n.push(51);
2 === I && n.push(52);
3 === I && n.push(53);
return {
index: s.eGameIds.QJHZ,
ids: n,
ipLimit: b,
other: r
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n, r, i = "0";
e.isChecked(1) && (i = "0");
e.isChecked(2) && (i = "1");
var a = "0";
e.isChecked(20) && (a = "0");
e.isChecked(21) && (a = "1");
e.isChecked(22) && (a = "2");
var s = "0";
e.isChecked(23) && (s = "0");
e.isChecked(24) && (s = "1");
var l = "0";
e.isChecked(18) && (l = "0");
e.isChecked(19) && (l = "1");
var c = "0";
e.isChecked(25) && (c = "0");
e.isChecked(26) && (c = "1");
var u = "0";
e.isChecked(11) && (u = "0");
e.isChecked(12) && (u = "1");
e.isChecked(13) && (u = "2");
e.isChecked(14) && (u = "3");
var d = e.isChecked(28) ? "1" : "0", p = e.isChecked(27) ? "1" : "0", f = e.isChecked(29) ? "1" : "0", h = e.IPStatus() ? "1" : "0", m = "0";
e.peopleCount();
e.isChecked(3) && (m = "2");
e.isChecked(4) && (m = "1");
e.isChecked(5) && (m = "0");
o = e.getValue(6);
var y = e.isChecked(16) ? "1" : "0", g = e.isChecked(15) ? "1" : "0", _ = e.isChecked(31) ? "1" : "0", v = e.isChecked(40) ? "1" : "0", C = "0";
e.isChecked(7) ? C = "0" : e.isChecked(8) && (C = "1");
var b = e.isChecked(9) ? 1 : 2, D = e.isChecked(17) ? "1" : "0", S = e.isChecked(32) ? "1" : "0", w = e.isChecked(200) ? "1" : "0", O = "0";
e.isChecked(50) && (O = "0");
e.isChecked(51) && (O = "1");
e.isChecked(52) && (O = "2");
e.isChecked(53) && (O = "3");
var P = this.configCell2Str(e, [ 41, 42, 43, 44, 45, 46 ], [ "0", "1", "2", "3", "4", "5" ]);
n = w + S + C + g + y + m + p + d + u + c + l + s + a + i;
for (var I = "0", R = [ .5, 1, 2, 2.5, 5, 10, 20, 50, 100 ], k = 0; k < R.length; k++) R[k] == o && (I = k + "");
var j = "0", L = [ .1, .2, .25 ];
for (k = 0; k < R.length; k++) L[k] == o && (j = k + 1 + "");
r = O + P + v + j + D + _ + h + f + I;
var U = parseInt(n);
return {
gameType: e.index,
num: b,
param1: parseInt(r),
param2: U,
clubId: t
};
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(42) ? 15 : t.isChecked(43) ? 30 : t.isChecked(44) ? 60 : t.isChecked(45) ? 120 : t.isChecked(46) ? 300 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(42) || (!!e.isChecked(43) || (!!e.isChecked(44) || (!!e.isChecked(45) || !!e.isChecked(46))));
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(17);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(31);
};
t.prototype.scoreRuleDesc = function(e) {
return "底分" + e.getValue(6) + "分";
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 11, 12, 13, 14, 1, 2, 7, 8, 32, 15, 16, 23, 24, 40, 41, 42, 43, 44, 45, 46, 200 ], i = e.listDescDetails(r, t), a = "底分" + e.getValue(6) + "分/", s = e.listDesc([ 50, 51, 52, 53 ], t);
s = s && "" + t + s + "离线踢人";
if (o) {
return n + (e.listDescDetails([ 3, 4, 5 ], t) + t) + a + i + s;
}
return n + a + i + s;
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
o = e.findCheckedIds([ 1, 2 ]);
t = (t += n = e.listDesc(o, "、")) + "\n底分：" + e.getValue(6) + "分";
o = e.findCheckedIds([ 7, 8, 32 ]);
t += n = "、" + e.listDesc(o, "、");
t += "\n东风：";
t += n = 0 == (o = e.findCheckedIds([ 20, 21, 22 ])).length ? "关闭" : e.listDesc(o, "、");
t += "\n金顶翻倍：";
o = e.findCheckedIds([ 18, 19 ]);
t += n = e.listDesc(o, "、");
t += "\n倍数：";
o = e.findCheckedIds([ 23, 24 ]);
t += n = e.listDesc(o, "、");
t += "\n癞子：";
o = e.findCheckedIds([ 25, 26 ]);
t += n = e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 17, 31, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
o = e.findCheckedIds([ 32, 15, 16, 28, 27, 29, 40 ]);
if (n = e.listDesc(o, "、")) {
t += "\n其它：";
t += n;
}
t += this.roomTypeDesc(e, "\n托管：", [ 41, 42, 43, 44, 45, 46 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 50, 51, 52, 53 ]);
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tingTipType = function(e) {
return e.length > 20 ? l.eTingTipType.JZH : l.eTingTipType.NORMAL;
};
t.prototype.isSupportPiZi = function() {
return !r.default.config.isChecked(25);
};
t.prototype.isZiMo = function(e) {
return !!a.default.checkBit(e, 1) || (!!a.default.checkBit(e, 2) || !a.default.checkBit(e, 4) && (!a.default.checkBit(e, 8) && (!a.default.checkBit(e, 16) && (a.default.checkBit(e, 32),
!1))));
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
return !!r.default.gameInfo.isLaiZi(t) || e.prototype.isGangCard.call(this, t);
};
t.prototype.canPut = function(t, o) {
if (r.default.gameInfo.isFenggang()) return !1;
if (r.default.gameInfo.isLaiZi(t)) {
if (r.default.gameInfo.siteInfos.paiDunRemain() <= 0) return !!function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t], i = r.default.gameInfo.isLaiZi(n), a = r.default.gameInfo.isFeng(n);
if (!i && !a) return !1;
}
return !0;
}(o);
}
for (var n = 0; n < o.length; n++) if (o[n] >= 31 && o[n] <= 37) return !1;
return !(t >= 31 && t <= 37) && e.prototype.canPut.call(this, t, o);
};
t.prototype.fixGameView = function() {
return s.eGameView.View3D;
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
return r.default.config.isChecked(7) ? "(暗杠二倍)" : r.default.config.isChecked(8) ? "(暗杠四倍)" : r.default.config.isChecked(32) ? "(多风加倍)" : void 0;
};
t.prototype.tabelDesc = function() {
return r.default.config.listDesc([ 15, 16, 27, 28 ], " ");
};
t.prototype.is3CardGang = function(e) {
return !(!this.isSupportPiZi() || !this.isPiZi(e));
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
if (c > 1) return [];
var h = c;
if (!this._checkHu(l, a, c, 1)) return [];
if (0 === h) {
var m = r.default.gameInfo.lz;
r.default.config.isChecked(26) && s.push(m);
}
if (o && s.length > 0) return s;
for (u = i.eCardColor.Bamboo; u <= i.eCardColor.wind; u++) for (var y = 1; y < l[u].length; y++) if (!(u === i.eCardColor.wind && y > 7)) {
d = i.default.card(u, y);
if (!this.isLaiZi(d)) {
l[u][0]++;
l[u][y]++;
if (this._checkHu(l, a, c, 0)) {
s.push(d);
if (o) return s;
}
l[u][0]--;
l[u][y]--;
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
