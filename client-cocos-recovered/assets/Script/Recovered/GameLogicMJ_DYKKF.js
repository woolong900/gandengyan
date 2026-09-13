// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "669473R8JdEsa2ch86whoc8", "GameLogicMJ_DYKKF");
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
var r = e("./CardUtils"), i = e("./RoomInfoData"), a = e("./OperateConfig"), s = e("./CommonUtils"), l = e("./GameLogicMJ"), c = e("./CommonEnum"), u = e("./GameSoundMJ"), d = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e12) % 10, a = Math.floor(t / 1e11) % 10, s = Math.floor(t / 1e10) % 10, l = Math.floor(t / 1e9) % 10, u = Math.floor(t / 1e8) % 10;
n = Math.floor(t / 1e7) % 10;
var d = Math.floor(t / 1e6) % 10, p = Math.floor(t / 1e5) % 10, f = Math.floor(t / 1e4) % 10, h = Math.floor(t / 1e3) % 10, m = Math.floor(t / 100) % 10, y = Math.floor(t / 10) % 10, g = Math.floor(t / 1) % 10;
0 === g && r.push(18);
1 === g && r.push(31);
2 === g && r.push(32);
3 === g && r.push(33);
1 === h && r.push(22);
1 === f && r.push(23);
1 === p && r.push(13);
1 === d && r.push(17);
1 === u && r.push(15);
0 === a && r.push(1);
1 === a && r.push(2);
2 === a && r.push(3);
3 === a && r.push(41);
4 === a && r.push(42);
5 === a && r.push(43);
0 === i && r.push(24);
1 === i && r.push(28);
2 === i && r.push(25);
3 === i && r.push(26);
4 === i && r.push(27);
5 === i && r.push(29);
8 === e && r.push(4);
12 === e && r.push(8);
16 === e && r.push(9);
1 === s && r.push(20);
1 === l && r.push(19);
0 === m && r.push(5);
1 === m && r.push(6);
2 === m && r.push(7);
0 === y && r.push(10);
1 === y && r.push(11);
2 === y && r.push(12);
return {
index: c.eGameIds.DYKKF,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.IPStatus() ? "1" : "0", r = "0", i = e.peopleCount();
4 === i && (r = "0");
3 === i && (r = "1");
2 === i && (r = "2");
var a = "" + e.payType(), s = e.isChecked(20) ? "1" : "0", l = e.isChecked(19) ? "1" : "0", c = "0";
e.isChecked(18) && (c = "0");
e.isChecked(31) && (c = "1");
e.isChecked(32) && (c = "2");
e.isChecked(33) && (c = "3");
var u = e.isChecked(22) ? "1" : "0", d = e.isChecked(23) ? "1" : "0", p = e.isChecked(13) ? "1" : "0", f = e.isChecked(17) ? "1" : "0", h = e.isChecked(15) ? "1" : "0", m = "0";
e.isChecked(1) && (m = "0");
e.isChecked(2) && (m = "1");
e.isChecked(3) && (m = "2");
e.isChecked(41) && (m = "3");
e.isChecked(42) && (m = "4");
e.isChecked(43) && (m = "5");
var y = "0";
e.isChecked(24) && (y = "0");
e.isChecked(25) && (y = "2");
e.isChecked(26) && (y = "3");
e.isChecked(27) && (y = "4");
e.isChecked(28) && (y = "1");
e.isChecked(29) && (y = "5");
o = y + m + s + l + +h + n + f + p + d + u + r + a + c;
var g = 1, _ = e.gameCount();
8 === _ && (g = 1);
12 === _ && (g = 3);
16 === _ && (g = 2);
var v = parseInt(o);
return {
gameType: e.index,
num: g,
param1: 1,
param2: v,
clubId: t
};
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 18, 31, 32, 33 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 10, 11, 12 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 13, 17, 15 ], t);
i = i && "" + t + i;
if (o) {
var a = e.listDesc([ 5, 6, 7 ], t);
return n + (a = a && "" + t + a + "房") + r + "" + i;
}
return n + r + "" + i;
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(2) ? 15 : t.isChecked(3) ? 30 : t.isChecked(41) ? 60 : t.isChecked(42) ? 120 : t.isChecked(43) ? 300 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(2) || (!!e.isChecked(3) || (!!e.isChecked(41) || (!!e.isChecked(42) || !!e.isChecked(43))));
};
t.prototype.clubTableColor = function() {
return cc.color(185, 79, 79);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 10, 11, 12 ]), n = e.listDesc(o, "、");
t += n;
o = e.findCheckedIds([ 18, 31, 32, 33 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n底分：" + n);
if ((o = e.findCheckedIds([ 19, 20 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
o = e.findCheckedIds([ 22, 23 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n全球人：" + n);
o = e.findCheckedIds([ 13, 17, 15 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n其它：" + n);
o = e.findCheckedIds([ 1, 2, 3, 41, 42, 43 ]);
t = t + "\n托管：" + (n = e.listDesc(o, "、"));
o = e.findCheckedIds([ 24, 25, 26, 27, 28, 29 ]);
return t = t + "\n离线踢人：" + (n = e.listDesc(o, "、"));
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
t.prototype.isZiMo = function(e) {
return !!s.default.checkBit(e, 1024) || !!s.default.checkBit(e, 256);
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
for (var t = 0, o = 0, n = 0, r = 0, i = 0, s = 0, l = e.count(), c = 0; c < l; c++) {
var u = e.get(c);
u.category === a.eOperateCategory.LaiZi && t++;
u.category === a.eOperateCategory.PiZi && o++;
if (u.category === a.eOperateCategory.Gang) {
u.subType === a.eGangType.BuGang && r++;
u.subType === a.eGangType.AnGang && n++;
u.subType === a.eGangType.MingGang && i++;
}
u.category === a.eOperateCategory.WarnQQR && s++;
}
return o + 2 * t + 2 * n + i + r + 2 * s;
};
t.prototype.getPzList = function(e) {
return [ r.MJ_HZ_ID, 32 ];
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
u.default.getInstance().outCard();
u.default.getInstance().playOperate("gang", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.isGangCard = function(t) {
var o = i.default.gameInfo.isPiZi(t), n = i.default.gameInfo.isLaiZi(t);
return !(!o && !n) || e.prototype.isGangCard.call(this, t);
};
t.prototype._tingCards = function(e, t, o) {
var n = e.handCards, a = e.operateList;
if (0 == this.openCount(a)) return [];
for (var s = [], l = this.initCardArr(), c = 0, u = 0; u < n.length; u++) {
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
var s = o + n;
if (this.needLZ_SimpleCheck(e) > s) return !1;
var l = this.findWarnType(t);
if (l === a.eOperateCategory.Null) {
if (this.isFengYiSe(e, t)) return !0;
if (this.isJiangYiSe(e, t)) return !0;
if (this.isPengPengHu(e, t, s)) return !0;
} else if (l === a.eOperateCategory.WarnJYS) return !!this.isJiangYiSe(e, t);
for (var c = this.jiangAny(e), u = 0, d = 0; d < c.length; d++) {
var p = r.default.cardColor(c[d]), f = r.default.cardValue(c[d]);
e[p][0] -= 2;
e[p][f] -= 2;
u = 0;
for (var h = 0; h < e.length; h++) if (0 != e[h][0]) {
u += this.needLZ_Color3N(e, h);
}
e[p][0] += 2;
e[p][f] += 2;
if (u <= s) {
var m = this._checkCanHu(e, t, o, n, l, c[d]);
if (m) return m;
}
}
if (s > 0) {
if (0 == e[r.eCardColor.Bamboo][0] + e[r.eCardColor.Characters][0] + e[r.eCardColor.Dots][0] + e[r.eCardColor.wind][0]) return !0;
for (d = 0; d < e.length; d++) if (0 !== e[d][0]) for (h = 1; h < e[d].length; h++) if (0 !== e[d][h]) {
e[d][0]--;
e[d][h]--;
u = 0;
for (var y = 0; y < e.length; y++) if (0 != e[y][0]) {
u += this.needLZ_Color3N(e, y);
}
e[d][h]++;
e[d][0]++;
if (u <= s - 1) {
f = r.default.card(d, h);
if (this._checkCanHu(e, t, o, n, l, f)) return !0;
if (this.isCard258(f)) return !1;
}
}
}
if (s > 1) {
u = 0;
for (y = 0; y < e.length; y++) if (0 != e[y][0]) {
u += this.needLZ_Color3N(e, y);
}
if (u <= s - 2) return this._checkCanHu(e, t, o, n, l, i.default.gameInfo.lz);
}
return !1;
};
t.prototype._checkCanHu = function(e, t, o, n, r, s) {
if (this.openCount(t) <= 0) return !1;
if (this.isPengPengHu(e, t, o)) return !0;
if (r >= 0) return !0;
if (r === a.eOperateCategory.Null) {
if (this.openCount(t) <= 1 && this.isQingYiSe(e, t)) return !0;
if (o > 1) return !1;
if (1 === e.length && i.default.config.isChecked(23)) return !0;
if (this.isLaiZi(s) || this.isCard258(s)) return !0;
}
return !1;
};
return t;
}(l.default);
o.default = d;
cc._RF.pop();
