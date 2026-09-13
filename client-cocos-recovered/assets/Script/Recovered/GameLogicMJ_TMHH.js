// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d677eentpdAG4TLXERgRaaS", "GameLogicMJ_TMHH");
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
var r = e("./RoomInfoData"), i = e("./CardUtils"), a = e("./CommonUtils"), s = e("./CommonEnum"), l = e("./GameLogicMJ"), c = e("./GameSoundMJ"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {}, i = Math.floor(t / 1) % 10, a = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = Math.floor(t / 1e4) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e6) % 10, f = Math.floor(t / 1e7) % 10, h = Math.floor(t / 1e8) % 10, m = Math.floor(t / 1e9) % 10, y = Math.floor(t / 1e10) % 10, g = Math.floor(t / 1e11) % 10, _ = Math.floor(t / 1e12) % 10, v = Math.floor(t / 1e13) % 10, C = Math.floor(t / 1e14) % 10;
1 == v && n.push(200);
0 === i && n.push(1);
1 === i && n.push(2);
0 === a && n.push(4);
1 === a && n.push(5);
2 === a && n.push(6);
r[3] = o / 10;
8 === e && n.push(7);
16 === e && n.push(8);
0 === l && n.push(9);
1 === l && n.push(10);
2 === l && n.push(11);
3 === l && n.push(12);
1 === c && n.push(13);
1 === u && n.push(14);
1 === d && n.push(15);
1 === p && n.push(16);
1 === h && n.push(17);
0 === m && n.push(18);
1 === m && n.push(19);
1 === y && n.push(20);
1 === g && n.push(21);
0 === _ && n.push(22);
1 === _ && n.push(23);
2 === _ && n.push(24);
3 === _ && n.push(25);
4 === _ && n.push(26);
0 === C && n.push(30);
1 === C && n.push(31);
2 === C && n.push(32);
3 === C && n.push(33);
return {
index: s.eGameIds.TMHH,
ids: n,
ipLimit: f,
other: r
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.isChecked(1) ? "0" : "1", r = "0", i = e.peopleCount();
2 === i && (r = "0");
3 === i && (r = "1");
4 === i && (r = "2");
o = e.getValue(3);
var a = e.isChecked(7) ? 1 : 2, s = "0";
e.isChecked(9) && (s = "0");
e.isChecked(10) && (s = "1");
e.isChecked(11) && (s = "2");
e.isChecked(12) && (s = "0");
var l = e.isChecked(13) ? "1" : "0", c = e.isChecked(14) ? "1" : "0", u = e.isChecked(15) ? "1" : "0", d = e.isChecked(16) ? "1" : "0", p = e.IPStatus() ? "1" : "0", f = e.isChecked(17) ? "1" : "0", h = e.isChecked(19) ? "1" : "0", m = e.isChecked(20) ? "1" : "0", y = e.isChecked(21) ? "1" : "0", g = "0";
e.isChecked(22) && (g = "0");
e.isChecked(23) && (g = "1");
e.isChecked(24) && (g = "2");
e.isChecked(25) && (g = "3");
e.isChecked(26) && (g = "4");
var _ = "0";
e.isChecked(30) && (_ = "0");
e.isChecked(31) && (_ = "1");
e.isChecked(32) && (_ = "2");
e.isChecked(33) && (_ = "3");
var v = e.isChecked(200) ? "1" : "0", C = parseInt(_ + v + g + y + m + h + f + p + d + u + c + l + s + r + n);
return {
gameType: e.index,
num: a,
param1: 10 * o,
param2: C,
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
return e.isChecked(21);
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(3);
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 9, 10, 11, 12, 1, 2, 3, 18, 19, 13, 14, 15, 16, 20, 22, 23, 24, 25, 26, 200 ], i = e.listDescDetails(r, t), a = e.listDesc([ 30, 31, 32, 33 ], t);
a = a && "" + t + a + "离线踢人";
if (o) {
return n + (e.listDescDetails([ 4, 5, 6 ], t) + t) + i + a;
}
return n + i + a;
};
t.prototype.cardStorageTotal = function(e) {
return this.isPiZi(e) ? 3 : 4;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付方式：";
var o = e.findCheckedIds([ 9, 10, 11, 12 ]), n = e.listDesc(o, "、");
t += n;
t += "\n玩法：";
o = e.findCheckedIds([ 1, 2 ]);
t += n = e.listDesc(o, "、");
t += "\n底分：";
var r = e.desc(3);
o = e.findCheckedIds([ 18, 19 ]);
t += n = r + "、" + e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 17, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
o = e.findCheckedIds([ 13, 14, 15, 16, 20 ]);
if (n = e.listDesc(o, "、")) {
t += "\n其它：";
t += n;
}
t += this.roomTypeDesc(e, "\n托管：", [ 22, 23, 24, 25, 26 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(23) ? 15 : t.isChecked(24) ? 30 : t.isChecked(25) ? 60 : t.isChecked(26) ? 120 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(23) || (!!e.isChecked(24) || (!!e.isChecked(25) || !!e.isChecked(26)));
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
return !0;
};
t.prototype.isZiMo = function(e) {
return !!a.default.checkBit(e, 1) || (!!a.default.checkBit(e, 2) || !a.default.checkBit(e, 4) && (!a.default.checkBit(e, 8) && (a.default.checkBit(e, 16),
!1)));
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
c.default.getInstance().outCard();
c.default.getInstance().playOperate("tm_lzg", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.getPzList = function(e) {
return [ e ];
};
t.prototype.isGangCard = function(t) {
return !!r.default.gameInfo.isLaiZi(t) || e.prototype.isGangCard.call(this, t);
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
return "";
};
t.prototype.tabelDesc = function() {
return r.default.config.listDesc([ 13, 14, 16, 20 ], " ");
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
return r.default.gameInfo.isPiZi(e) ? "chaotianxiao" : "heihuang";
};
t.prototype.animationMg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "chaotianxiao" : "dianhuang";
};
t.prototype.animationBg = function(e) {
return r.default.gameInfo.isPiZi(e) ? "chaotianxiao" : "penghuang";
};
t.prototype.animationLZ = function(e) {
return "shuailaizi";
};
t.prototype.soundAg = function(e) {
return r.default.gameInfo.isPiZi(e), "tm_heihuang";
};
t.prototype.soundMg = function(e) {
return r.default.gameInfo.isPiZi(e), "tm_dianhuang";
};
t.prototype.soundBg = function(e) {
return r.default.gameInfo.isPiZi(e), "tm_penghuang";
};
t.prototype.soundPeng = function(e) {
return "tm_peng";
};
t.prototype.soundPZ = function(e) {
return "qj_ct";
};
t.prototype.soundLZ = function(e) {
return "tm_lzg";
};
t.prototype.uiStyle1 = function() {
return !0;
};
t.prototype._tingCards = function(e, t, o) {
for (var n = e.handCards, a = e.operateList, s = [], l = this.initCardArr(), c = 0, u = 0; u < n.length; u++) {
var d = n[u];
if (this.isLaiZi(d)) c++; else {
var p = i.default.cardColor(d), f = i.default.cardValue(d);
l[p][0]++;
l[p][f]++;
}
}
if (null !== t && void 0 !== t) {
if (this.isLaiZi(t)) c--; else {
p = i.default.cardColor(t), f = i.default.cardValue(t);
l[p][0]--;
l[p][f]--;
}
}
if (c > 1) return [];
var h = c, m = r.default.config.isChecked(2);
if (!this._checkHu(l, a, c, 1)) return [];
if (0 === h) {
var y = r.default.gameInfo.lz;
m || s.push(y);
}
if (o && s.length > 0) return s;
for (u = i.eCardColor.Bamboo; u <= i.eCardColor.wind; u++) for (var g = 1; g < l[u].length; g++) if (!(u === i.eCardColor.wind && g > 7)) {
d = i.default.card(u, g);
if (!this.isLaiZi(d)) {
l[u][0]++;
l[u][g]++;
if (this._checkHu(l, a, c, 0)) {
s.push(d);
if (o) return s;
}
l[u][0]--;
l[u][g]--;
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
