// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c15b3AROS9JYbFb/8wzLjVs", "GameLogicMJ_HZHZ");
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
var r = e("./CardUtils"), i = e("./RoomInfoData"), a = e("./OperateConfig"), s = e("./CommonUtils"), l = e("./GameLogicMJ"), c = e("./CommonEnum"), u = e("./GameSoundMJ"), d = e("./GameInfoData"), p = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e12) % 10, a = Math.floor(t / 1e11) % 10, s = Math.floor(t / 1e10) % 10, l = Math.floor(t / 1e9) % 10, u = Math.floor(t / 1e8) % 10, d = Math.floor(t / 1e7) % 10;
n = Math.floor(t / 1e6) % 10;
var p = Math.floor(t / 1e5) % 10, f = Math.floor(t / 1e4) % 10, h = Math.floor(t / 1e3) % 10, m = Math.floor(t / 100) % 10, y = Math.floor(t / 10) % 10, g = Math.floor(t / 1) % 10;
8 === e && r.push(8);
16 === e && r.push(9);
0 === a && r.push(21);
1 === a && r.push(22);
2 === a && r.push(23);
3 === a && r.push(24);
4 === a && r.push(25);
5 === a && r.push(26);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
1 == s && r.push(200);
1 === l && r.push(20);
1 === u && r.push(19);
0 === d && r.push(17);
1 === p && r.push(15);
1 === f && r.push(14);
1 === h && r.push(13);
4 === g && r.push(18);
0 === g && r.push(1);
1 === g && r.push(2);
2 === g && r.push(3);
3 === g && r.push(4);
0 === m && r.push(5);
1 === m && r.push(6);
2 === m && r.push(7);
0 === y && r.push(10);
1 === y && r.push(11);
2 === y && r.push(12);
3 === y && r.push(16);
return {
index: c.eGameIds.HZHZ,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.IPStatus() ? "1" : "0", r = "0", i = e.peopleCount();
4 === i && (r = "0");
3 === i && (r = "1");
2 === i && (r = "2");
var a = "" + e.payType(), s = e.isChecked(200) ? "1" : "0", l = e.isChecked(20) ? "1" : "0", c = e.isChecked(19) ? "1" : "0", u = e.isChecked(17) ? "0" : "1";
4 == i && (u = "1");
var d = e.isChecked(15) ? "1" : "0", p = e.isChecked(14) ? "1" : "0", f = e.isChecked(13) ? "1" : "0", h = e.findCheckedIds([ 18, 1, 2, 3, 4 ]), m = "" + e.getValue(h[0]), y = "0";
e.isChecked(21) && (y = "0");
e.isChecked(22) && (y = "1");
e.isChecked(23) && (y = "2");
e.isChecked(24) && (y = "3");
e.isChecked(25) && (y = "4");
e.isChecked(26) && (y = "5");
var g = "0";
e.isChecked(30) && (g = "0");
e.isChecked(31) && (g = "1");
e.isChecked(32) && (g = "2");
e.isChecked(33) && (g = "3");
o = g + y + s + l + c + u + n + d + p + f + r + a + m;
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
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(22) ? 15 : t.isChecked(23) ? 30 : t.isChecked(24) ? 60 : t.isChecked(25) ? 120 : t.isChecked(26) ? 600 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(22) || (!!e.isChecked(23) || (!!e.isChecked(24) || (!!e.isChecked(25) || !!e.isChecked(26))));
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 18, 1, 2, 3, 4 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 10, 11, 12, 16 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 18, 1, 2, 3, 4 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 13, 14, 15, 17, 200 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 30, 31, 32, 33 ], t);
s = s && "" + t + s + "离线踢人";
if (o) {
var l = e.listDesc([ 5, 6, 7 ], t);
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
if (i.default.gameInfo.status === d.eGameStatus.Free) return "";
if (i.default.config.isChecked(13)) {
var e = i.default.gameInfo.pz;
if (r.default.cardColor(e) === r.eCardColor.wind) return "风豹";
}
if (i.default.config.isChecked(14)) {
e = i.default.gameInfo.pz;
if (this.isCard258(e)) return "将豹";
}
return "";
};
t.prototype.clubTableColor = function() {
return cc.color(185, 79, 79);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 10, 11, 12, 16 ]), n = e.listDesc(o, "、");
t += n;
o = e.findCheckedIds([ 18, 1, 2, 3, 4 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n玩法：" + n);
if ((o = e.findCheckedIds([ 19, 20, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
o = e.findCheckedIds([ 13, 14, 15, 17 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n其它：" + n);
t += this.roomTypeDesc(e, "\n托管：", [ 21, 22, 23, 24, 25, 26 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.isZiMo = function(e) {
return !!s.default.checkBit(e, 1024) || (!!s.default.checkBit(e, 128) || !!s.default.checkBit(e, 256));
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
return [ e, r.MJ_HZ_ID ];
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
var s = o + n, l = this.findWarnType(t);
if (l === a.eOperateCategory.Null) {
if (this.isFengYiSe(e, t)) return !0;
if (this.openCount(t) <= 1 && this.isJiangYiSe(e, t)) return !0;
if (this.isPengPengHu(e, t, s)) return !0;
} else if (l === a.eOperateCategory.WarnJYS) return !!this.isJiangYiSe(e, t);
if (this.needLZ_SimpleCheck(e) > s) return !1;
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
t.prototype._checkCanHu = function(e, t, o, n, r, i) {
if (r === a.eOperateCategory.WarnQYS) return !!this.isQingYiSe(e, t);
if (r === a.eOperateCategory.Null) {
if (this.openCount(t) <= 1 && this.isQingYiSe(e, t)) return !0;
if (o > 1) return !1;
if (this.isLaiZi(i) || this.isCard258(i)) return !0;
}
return !1;
};
return t;
}(l.default);
o.default = p;
cc._RF.pop();
