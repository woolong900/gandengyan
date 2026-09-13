// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0bc1cPYuYZCXIRxfpALqoZm", "GameLogicMJ_DYHH");
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
var r = require("./CardUtils"), i = require("./RoomInfoData"), a = require("./OperateConfig"), s = require("./CommonUtils"), l = require("./CommonEnum"), c = require("./GameSoundMJ"), u = require("./GameLogicMJ"), d = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = {}, a = Math.floor(t / 1e12) % 10, s = Math.floor(t / 1e11) % 10, c = Math.floor(t / 1e10) % 10, u = Math.floor(t / 1e9) % 10, d = Math.floor(t / 1e8) % 10, p = Math.floor(t / 1e7) % 10, f = Math.floor(t / 1e6) % 10, h = Math.floor(t / 1e5) % 10;
n = Math.floor(t / 1e4) % 10;
var m = Math.floor(t / 1e3) % 10, y = Math.floor(t / 100) % 10, g = Math.floor(t / 10) % 10, _ = Math.floor(t / 1) % 10;
i[3] = .1;
1 === o && (i[3] = .1);
2 === o && (i[3] = .2);
3 === o && (i[3] = .3);
4 === o && (i[3] = .4);
5 === o && (i[3] = .5);
6 === o && (i[3] = 1);
7 === o && (i[3] = 2);
0 === y && r.push(1);
1 === y && r.push(2);
1 === f && r.push(13);
1 === p && r.push(17);
1 === h && r.push(15);
0 === m && r.push(21);
1 === m && r.push(22);
2 === m && r.push(23);
3 === m && r.push(24);
0 === c && r.push(25);
1 === c && r.push(26);
2 === c && r.push(27);
3 === c && r.push(28);
4 === c && r.push(29);
5 === c && r.push(30);
0 === s && r.push(31);
1 === s && r.push(32);
2 === s && r.push(33);
3 === s && r.push(34);
4 === s && r.push(35);
5 === s && r.push(36);
8 === e && r.push(4);
12 === e && r.push(8);
16 === e && r.push(9);
1 === u && r.push(20);
1 === d && r.push(19);
0 === g && r.push(5);
1 === g && r.push(6);
2 === g && r.push(7);
0 === _ && r.push(10);
1 === _ && r.push(11);
2 === _ && r.push(12);
1 === a && r.push(37);
return {
index: l.eGameIds.DYHH,
ids: r,
ipLimit: n,
other: i
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n, r = e.IPStatus() ? "1" : "0", i = "0", a = e.peopleCount();
4 === a && (i = "0");
3 === a && (i = "1");
2 === a && (i = "2");
var s = "" + e.payType(), l = e.isChecked(20) ? "1" : "0", c = e.isChecked(19) ? "1" : "0", u = e.isChecked(1) ? "0" : "1", d = e.isChecked(15) ? "1" : "0", p = e.isChecked(13) ? "1" : "0", f = e.isChecked(17) ? "1" : "0", h = e.isChecked(37) ? "1" : "0", m = "0";
e.isChecked(21) && (m = "0");
e.isChecked(22) && (m = "1");
e.isChecked(23) && (m = "2");
e.isChecked(24) && (m = "3");
var y = "0";
e.isChecked(25) && (y = "0");
e.isChecked(26) && (y = "1");
e.isChecked(27) && (y = "2");
e.isChecked(28) && (y = "3");
e.isChecked(29) && (y = "4");
e.isChecked(30) && (y = "5");
var g = "0";
e.isChecked(31) && (g = "0");
e.isChecked(32) && (g = "1");
e.isChecked(33) && (g = "2");
e.isChecked(34) && (g = "3");
e.isChecked(35) && (g = "4");
e.isChecked(36) && (g = "5");
n = h + g + y + l + c + f + p + d + r + m + u + i + s;
var _ = 1, v = e.gameCount();
8 === v && (_ = 1);
12 === v && (_ = 3);
16 === v && (_ = 2);
var C = 1;
.1 === (o = e.getValue(3)) && (C = 1);
.2 === o && (C = 2);
.3 === o && (C = 3);
.4 === o && (C = 4);
.5 === o && (C = 5);
1 === o && (C = 6);
2 === o && (C = 7);
var b = parseInt(n);
return {
gameType: e.index,
num: _,
param1: C,
param2: b,
clubId: t
};
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.tabelDesc = function() {
return i.default.config.listDesc([ 1, 2 ], " ");
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(3);
};
t.prototype.fengDingDesc = function(e) {
return e.listDesc([ 21, 22, 23, 24 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 10, 11, 12 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 21, 22, 23, 24 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 13, 17, 15, 37 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 1, 2 ], t);
s = s && "" + t + s;
if (o) {
var l = e.listDesc([ 5, 6, 7 ], t);
return n + (l = l && "" + t + l + "房") + r + i + a + s;
}
return n + r + i + a + s;
};
t.prototype.tingTipType = function(e) {
return e.length > 20 ? u.eTingTipType.JZH : u.eTingTipType.NORMAL;
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(26) ? 15 : t.isChecked(27) ? 30 : t.isChecked(28) ? 60 : t.isChecked(29) ? 120 : t.isChecked(30) ? 300 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(26) || (!!e.isChecked(27) || (!!e.isChecked(28) || (!!e.isChecked(29) || !!e.isChecked(30))));
};
t.prototype.clubTableColor = function() {
return cc.color(185, 79, 79);
};
t.prototype.roomDetails = function(e) {
var t = "", o = "", n = [];
t += "支付：";
n = e.findCheckedIds([ 10, 11, 12 ]);
t += o = e.listDesc(n, "、");
n = e.findCheckedIds([ 1, 2 ]);
(o = e.listDesc(n, "、")) && (t = t + "\n玩法：" + o);
t = t + "\n底分：" + e.desc(3);
n = e.findCheckedIds([ 21, 22, 23, 24 ]);
(o = e.listDesc(n, "、")) && (t = t + "\n封顶：" + o);
if ((n = e.findCheckedIds([ 19, 20 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(n, "、");
}
n = e.findCheckedIds([ 13, 17, 15, 37 ]);
(o = e.listDesc(n, "、")) && (t = t + "\n其它：" + o);
n = e.findCheckedIds([ 25, 26, 27, 28, 29, 30 ]);
t = t + "\n托管：" + (o = e.listDesc(n, "、"));
n = e.findCheckedIds([ 31, 32, 33, 34, 35, 36 ]);
return t = t + "\n离线踢人：" + (o = e.listDesc(n, "、"));
};
t.prototype.isZiMo = function(e) {
return !!s.default.checkBit(e, 128);
};
t.prototype.canPut = function(t, o) {
if (i.default.gameInfo.isLaiZi(t) || i.default.gameInfo.isPiZi(t)) {
if (i.default.gameInfo.siteInfos.paiDunRemain() <= 0) return function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t], r = i.default.gameInfo.isLaiZi(n), a = i.default.gameInfo.isPiZi(n);
if (!r && !a) return !1;
}
return !0;
}(o);
}
return e.prototype.canPut.call(this, t, o);
};
t.prototype.isShowHead3DMul = function() {
return !0;
};
t.prototype.isShowHead2DMul = function() {
return !0;
};
t.prototype.head3DMul = function(e) {
for (var t = 0, o = 0, n = 0, s = 0, l = 0, c = 0, u = 0, d = 0, p = e.count(), f = 0; f < p; f++) {
var h = e.get(f);
if (h.category === a.eOperateCategory.Chi) {
var m = h.cards;
m.indexOf(i.default.gameInfo.lz) > -1 && u++;
m.indexOf(r.MJ_HZ_ID) > -1 && d++;
}
h.category === a.eOperateCategory.LaiZi && t++;
h.category === a.eOperateCategory.PiZi && o++;
if (h.category === a.eOperateCategory.Gang) {
h.subType === a.eGangType.BuGang && s++;
h.subType === a.eGangType.AnGang && n++;
h.subType === a.eGangType.MingGang && l++;
}
h.category === a.eOperateCategory.LiangDao && c++;
}
return o + 2 * t + 2 * n + l + s + c * (33 === i.default.gameInfo.lz ? 5 : 3) + 2 * u + d * (i.default.config.isChecked(2) ? 2 : 1);
};
t.prototype.getPzList = function(e) {
return i.default.config.isChecked(2) ? [ r.MJ_HZ_ID, 32 ] : [ r.MJ_HZ_ID ];
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
c.default.getInstance().outCard();
c.default.getInstance().playOperate("gang", o);
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
var i = o + n, s = this.findWarnType(t);
if (this.isQiDui(e, i)) return !0;
if (s === a.eOperateCategory.Null) {
if (this.isFengYiSe(e, t)) return !0;
if (this.isPengPengHu(e, t, i)) return !0;
}
if (this.needLZ_SimpleCheck(e) > i) return !1;
for (var l = this.jiangAny(e), c = 0, u = 0; u < l.length; u++) {
var d = r.default.cardColor(l[u]), p = r.default.cardValue(l[u]);
e[d][0] -= 2;
e[d][p] -= 2;
c = 0;
for (var f = 0; f < e.length; f++) if (0 != e[f][0]) {
c += this.needLZ_Color3N(e, f);
}
e[d][0] += 2;
e[d][p] += 2;
if (c <= i) return this._checkCanHu(e, t, o, n, s, l[u]);
}
if (i > 0) {
if (0 == e[r.eCardColor.Bamboo][0] + e[r.eCardColor.Characters][0] + e[r.eCardColor.Dots][0] + e[r.eCardColor.wind][0]) return !0;
for (u = 0; u < e.length; u++) if (0 !== e[u][0]) for (f = 1; f < e[u].length; f++) if (0 !== e[u][f]) {
e[u][0]--;
e[u][f]--;
c = 0;
for (var h = 0; h < e.length; h++) if (0 != e[h][0]) {
c += this.needLZ_Color3N(e, h);
}
e[u][f]++;
e[u][0]++;
if (c <= i - 1) {
p = r.default.card(u, f);
return this._checkCanHu(e, t, o, n, s, p);
}
}
}
return !1;
};
t.prototype._checkCanHu = function(e, t, o, n, r, i) {
return !0;
};
return t;
}(u.default);
o.default = d;
cc._RF.pop();
