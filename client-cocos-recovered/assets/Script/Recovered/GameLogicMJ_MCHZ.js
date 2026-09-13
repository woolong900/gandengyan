// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4321fOVhh9NGoi6E8zIR7uH", "GameLogicMJ_MCHZ");
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
var r = e("./CardUtils"), i = e("./RoomInfoData"), a = e("./OperateConfig"), s = e("./CommonUtils"), l = e("./GameLogicMJ"), c = e("./CommonEnum"), u = e("./GameInfoData"), d = e("./GameSoundMJ"), p = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(o / 100) % 10, a = Math.floor(o / 10) % 10, s = Math.floor(o / 1) % 10, l = Math.floor(t / 1e13) % 10, u = Math.floor(t / 1e12) % 10, d = Math.floor(t / 1e11) % 10;
n = Math.floor(t / 1e10) % 10;
var p = Math.floor(t / 1e9) % 10, f = Math.floor(t / 1e8) % 10, h = Math.floor(t / 1e7) % 10, m = Math.floor(t / 1e6) % 10, y = Math.floor(t / 1e5) % 10, g = Math.floor(t / 1e4) % 10, _ = Math.floor(t / 1e3) % 10, v = Math.floor(t / 100) % 10, C = Math.floor(t / 10) % 10, b = Math.floor(t / 1) % 10;
8 === e && r.push(9);
16 === e && r.push(10);
1 === l && r.push(25);
1 === u && r.push(23);
1 === d && r.push(24);
1 === p && r.push(22);
1 === f && r.push(21);
1 === h && r.push(20);
1 === m && r.push(19);
1 === y && r.push(18);
1 === g && r.push(17);
1 === _ && r.push(16);
1 !== _ && r.push(27);
0 === v && r.push(11);
1 === v && r.push(12);
2 === v && r.push(13);
3 === v && r.push(14);
0 === C && r.push(6);
1 === C && r.push(7);
2 === C && r.push(8);
0 === b && r.push(1);
1 === b && r.push(2);
2 === b && r.push(3);
3 === b && r.push(4);
4 === b && r.push(5);
5 === b && r.push(15);
1 === a && r.push(200);
0 === s && r.push(40);
1 === s && r.push(42);
2 === s && r.push(43);
3 === s && r.push(44);
4 === s && r.push(45);
5 === s && r.push(46);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
return {
index: c.eGameIds.MCHZ,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.isChecked(23) ? "1" : "0", r = e.IPStatus() ? "1" : "0", i = "0", a = e.peopleCount();
4 === a && (i = "0");
3 === a && (i = "1");
2 === a && (i = "2");
var s = "" + e.payType(), l = e.isChecked(25) ? "1" : "0", c = e.isChecked(24) ? "1" : "0", u = e.isChecked(22) ? "1" : "0", d = e.isChecked(21) ? "1" : "0", p = e.isChecked(20) ? "1" : "0", f = e.isChecked(19) ? "1" : "0", h = e.isChecked(18) ? "1" : "0", m = e.isChecked(17) ? "1" : "0", y = e.isChecked(16) ? "1" : "0", g = e.findCheckedIds([ 1, 2, 3, 4, 5, 15 ]), _ = "" + e.getValue(g[0]), v = this.configCell2Str(e, [ 200 ], [ "1" ]), C = this.configCell2Str(e, [ 40, 42, 43, 44, 45, 46 ], [ "0", "1", "2", "3", "4", "5" ]), b = "0";
e.isChecked(30) && (b = "0");
e.isChecked(31) && (b = "1");
e.isChecked(32) && (b = "2");
e.isChecked(33) && (b = "3");
o = l + n + c + r + u + d + p + f + h + m + y + s + i + _;
var D = b + v + C, S = 1, w = e.gameCount();
8 === w && (S = 1);
16 === w && (S = 2);
var O = parseInt(o);
return {
gameType: e.index,
num: S,
param1: parseInt(D),
param2: O,
clubId: t
};
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(42) ? 15 : t.isChecked(43) ? 30 : t.isChecked(44) ? 60 : t.isChecked(45) ? 120 : t.isChecked(46) ? 300 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(42) || (!!e.isChecked(43) || (!!e.isChecked(44) || (!!e.isChecked(45) || !!e.isChecked(46))));
};
t.prototype.isRealTime = function(e) {
return e.isChecked(23);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(25);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 1, 2, 3, 4, 5, 15 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 11, 12, 13, 14 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 1, 2, 3, 4, 5, 15 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 16, 27, 17, 18, 19, 20, 21, 24, 22, 200 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 30, 31, 32, 33 ], t);
s = s && "" + t + s + "离线踢人";
if (o) {
var l = e.listDesc([ 6, 7, 8 ], t);
return n + (l = l && "" + t + l + "房") + r + i + a + s;
}
return n + r + i + a + s;
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tabelDesc = function() {
if (i.default.gameInfo.status === u.eGameStatus.Free) return "";
var e = i.default.gameInfo.dice1 === i.default.gameInfo.dice2 && i.default.config.isChecked(19) && 0 != i.default.gameInfo.dice2, t = "";
if (i.default.config.isChecked(17)) {
var o = i.default.gameInfo.lz;
r.default.cardColor(o) === r.eCardColor.wind && (t += "风翻 ");
}
if (i.default.config.isChecked(18)) {
o = i.default.gameInfo.lz;
this.isCard258(o) && (t += "将翻 ");
}
i.default.config.isChecked(20) && i.default.gameInfo.specialRuleFlag && (t += "连宝翻 ");
e && (t += "豹翻");
return t;
};
t.prototype.clubTableColor = function() {
return cc.color(82, 39, 101);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 11, 12, 13, 14 ]), n = e.listDesc(o, "、");
t += n;
o = e.findCheckedIds([ 1, 2, 3, 4, 5, 15 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n底分：" + n);
o = e.findCheckedIds([ 16, 27, 17, 18, 19, 20, 21, 24, 22 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n玩法：" + n);
o = e.findCheckedIds([ 200 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n其他：" + n);
t += this.roomTypeDesc(e, "\n托管：", [ 40, 42, 43, 44, 45, 46 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.isZiMo = function(e) {
return !!s.default.checkBit(e, 2048) || (!!s.default.checkBit(e, 256) || !!s.default.checkBit(e, 512));
};
t.prototype.canPut = function(t, o) {
var n = i.default.gameInfo.isLaiZi(t), r = i.default.gameInfo.isPiZi(t);
if (n || r) {
if (function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t], r = i.default.gameInfo.isPiZi(n), a = i.default.gameInfo.isLaiZi(n);
if (!r && !a) return !1;
}
return !0;
}(o)) return !0;
var a = i.default.config.peopleCount();
if (i.default.gameInfo.siteInfos.paiDunRemain() <= a) return !1;
}
return e.prototype.canPut.call(this, t, o);
};
t.prototype.isShowHead3DMul = function() {
return !0;
};
t.prototype.head3DMul = function(e) {
for (var t = 0, o = 0, n = 0, r = 0, i = 0, s = e.count(), l = 0; l < s; l++) {
var c = e.get(l);
c.category === a.eOperateCategory.LaiZi && t++;
c.category === a.eOperateCategory.PiZi && o++;
if (c.category === a.eOperateCategory.Gang) {
c.subType === a.eGangType.BuGang && r++;
c.subType === a.eGangType.AnGang && n++;
c.subType === a.eGangType.MingGang && i++;
}
}
return o + 2 * t + 2 * n + i + r;
};
t.prototype.getPzList = function(e) {
return 31 === e ? [ e, 33 ] : [ e, r.MJ_HZ_ID ];
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
d.default.getInstance().outCard();
d.default.getInstance().playOperate("gang", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.isGangCard = function(t) {
var o = i.default.gameInfo.isPiZi(t), n = i.default.gameInfo.isLaiZi(t);
return !(!o && !n) || e.prototype.isGangCard.call(this, t);
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
var a = o + n;
if (i.default.config.isChecked(16) && this.isQiDui(e, a)) return !0;
if (this.isPengPengHu(e, t, a)) {
if (i.default.config.isChecked(16)) return !0;
if (0 != this.openCount(t)) return !0;
}
if (i.default.config.isChecked(16)) {
if (this.isJiangYiSe(e, t)) return !0;
if (this.isFengYiSe(e, t)) return !0;
} else {
if (0 != this.openCount(t) && this.isJiangYiSe(e, t)) return !0;
if (0 != this.openCount(t) && this.isFengYiSe(e, t)) return !0;
}
if (this.needLZ_SimpleCheck(e) > a) return !1;
for (var s = this.jiangAny(e), l = 0, c = 0; c < s.length; c++) {
var u = r.default.cardColor(s[c]), d = r.default.cardValue(s[c]);
e[u][0] -= 2;
e[u][d] -= 2;
l = 0;
for (var p = 0; p < e.length; p++) if (0 != e[p][0]) {
l += this.needLZ_Color3N(e, p);
}
e[u][0] += 2;
e[u][d] += 2;
if (l <= a) {
var f = this._checkCanHu(e, t, o, n, s[c]);
if (f) return f;
}
}
if (a > 0) {
if (0 == e[r.eCardColor.Bamboo][0] + e[r.eCardColor.Characters][0] + e[r.eCardColor.Dots][0] + e[r.eCardColor.wind][0]) return !0;
for (c = 0; c < e.length; c++) if (0 !== e[c][0]) for (p = 1; p < e[c].length; p++) if (0 !== e[c][p]) {
e[c][0]--;
e[c][p]--;
l = 0;
for (var h = 0; h < e.length; h++) if (0 != e[h][0]) {
l += this.needLZ_Color3N(e, h);
}
e[c][p]++;
e[c][0]++;
if (l <= a - 1) {
d = r.default.card(c, p);
if (this._checkCanHu(e, t, o, n, d)) return !0;
if (this.isCard258(d)) return !1;
}
}
}
if (a > 1) {
l = 0;
for (h = 0; h < e.length; h++) if (0 != e[h][0]) {
l += this.needLZ_Color3N(e, h);
}
if (l <= a - 2) return this._checkCanHu(e, t, o, n, i.default.gameInfo.lz);
}
return !1;
};
t.prototype.tingTipType = function(e) {
var t = i.default.myAbsolutePos(), o = i.default.gameInfo.siteInfos.get(t).handCards;
return 1 === o.length && this.isLaiZi(o[0]) && i.default.config.isChecked(23) ? l.eTingTipType.JZH : e.length > 20 ? l.eTingTipType.JZH : this._isHuType_258(e) ? l.eTingTipType.JJH : l.eTingTipType.NORMAL;
};
t.prototype._isHuType_258 = function(e) {
for (var t = {}, o = 0, n = e.length; o < n; o++) {
var r = e[o];
if (this.isCard258(r)) t[r] = !0; else if (!this.isLaiZi(r)) return !1;
}
var i = this.all258;
for (o = 0, n = i.length; o < n; o++) {
if (!t[r = i[o]] && !this.isPiZi(r)) return !1;
}
return !0;
};
t.prototype._checkCanHu = function(e, t, o, n, r) {
var a = this.openCount(t);
if (i.default.config.isChecked(16)) {
if (this.isLaiZi(r) || this.isCard258(r)) {
if (0 === a) return !0;
if (o <= 1) return !0;
}
} else {
if (0 == a) return !1;
if (this.isQingYiSe(e, t)) return !0;
if (this.isFengYiSe(e, t)) return !0;
}
return !!this.isQingYiSe(e, t) || (!!this.isFengYiSe(e, t) || !(o > 1) && !(!this.isLaiZi(r) && !this.isCard258(r)));
};
return t;
}(l.default);
o.default = p;
cc._RF.pop();
