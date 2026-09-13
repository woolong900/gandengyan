// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "43467P+N5pGm4yH6MK9Md9D", "GameLogicMJ_LTMJ");
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
var n, r = [], i = Math.floor(t / 1e14) % 10, a = Math.floor(t / 1e13) % 10, s = Math.floor(t / 1e12) % 10, l = Math.floor(t / 1e11) % 10, u = Math.floor(t / 1e10) % 10, d = Math.floor(t / 1e9) % 10;
n = Math.floor(t / 1e8) % 10;
var p = Math.floor(t / 1e7) % 10, f = Math.floor(t / 1e6) % 10, h = Math.floor(t / 1e5) % 10, m = Math.floor(t / 1e4) % 10, y = Math.floor(t / 1e3) % 10, g = Math.floor(t / 100) % 10, _ = Math.floor(t / 10) % 10, v = Math.floor(t / 1) % 10;
1 == i && r.push(200);
var C = Math.floor(o / 1) % 10, b = Math.floor(o / 10) % 10;
8 === e && r.push(7);
16 === e && r.push(8);
1 === s && r.push(24);
1 === l && r.push(23);
1 === u && r.push(22);
1 === d && r.push(3);
1 === p && r.push(20);
1 === f && r.push(19);
1 === h && r.push(17);
1 === m && r.push(18);
0 === y && r.push(1);
1 === y && r.push(2);
0 === g && r.push(4);
1 === g && r.push(5);
2 === g && r.push(6);
0 === _ && r.push(9);
1 === _ && r.push(10);
2 === _ && r.push(11);
3 === _ && r.push(21);
0 === v && r.push(12);
1 === v && r.push(13);
2 === v && r.push(14);
3 === v && r.push(15);
4 === v && r.push(16);
1 === a && r.push(25);
0 === C && r.push(41);
1 === C && r.push(42);
2 === C && r.push(43);
3 === C && r.push(44);
4 === C && r.push(45);
5 === C && r.push(46);
0 === b && r.push(30);
1 === b && r.push(31);
2 === b && r.push(32);
3 === b && r.push(33);
return {
index: c.eGameIds.LTMJ,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n, r = e.IPStatus() ? "1" : "0", i = "0", a = e.peopleCount();
4 === a && (i = "0");
3 === a && (i = "1");
2 === a && (i = "2");
var s = "" + e.payType(), l = e.isChecked(24) ? "1" : "0", c = e.isChecked(23) ? "1" : "0", u = e.isChecked(22) ? "1" : "0", d = e.isChecked(3) ? "1" : "0", p = e.isChecked(17) ? "1" : "0", f = e.isChecked(18) ? "1" : "0", h = e.isChecked(19) ? "1" : "0", m = e.isChecked(20) ? "1" : "0", y = e.isChecked(25) ? "1" : "0", g = e.isChecked(2) ? "1" : "0", _ = e.findCheckedIds([ 12, 13, 14, 15, 16 ]), v = "" + e.getValue(_[0]), C = e.isChecked(200) ? "1" : "0", b = "0";
e.isChecked(30) && (b = "0");
e.isChecked(31) && (b = "1");
e.isChecked(32) && (b = "2");
e.isChecked(33) && (b = "3");
var D = this.configCell2Str(e, [ 41, 42, 43, 44, 45, 46 ], [ "0", "1", "2", "3", "4", "5" ]);
o = C + y + l + c + u + d + r + m + h + p + f + g + i + s + v;
n = b + D;
var S = 1, w = e.gameCount();
8 === w && (S = 1);
16 === w && (S = 2);
var O = parseInt(o), P = parseInt(n);
return {
gameType: e.index,
num: S,
param1: P,
param2: O,
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
return e.isChecked(23);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(24);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 12, 13, 14, 15, 16 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 9, 10, 11, 21 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 12, 13, 14, 15, 16 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 1, 2, 3 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 17, 18, 19, 20, 22, 25, 200 ], t);
s = s && "" + t + s;
var l = e.listDesc([ 41, 42, 43, 44, 45, 46 ], t);
l = l && "" + t + l + "托管";
var c = e.listDesc([ 30, 31, 32, 33 ], t);
c = c && "" + t + c + "离线踢人";
if (o) {
var u = e.listDesc([ 4, 5, 6 ], t);
return n + (u = u && "" + t + u + "房") + r + i + a + s + l + c;
}
return n + r + i + a + s + l + c;
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tabelDesc = function() {
if (i.default.gameInfo.status === d.eGameStatus.Free) return "";
if (i.default.config.isChecked(19)) {
var e = i.default.gameInfo.pz;
if (r.default.cardColor(e) === r.eCardColor.wind) return "风豹";
}
if (i.default.config.isChecked(20)) {
e = i.default.gameInfo.pz;
if (this.isCard258(e)) return "将豹";
}
return "";
};
t.prototype.clubTableColor = function() {
return cc.color(63, 147, 97);
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 9, 10, 11, 21 ]), n = e.listDesc(o, "、");
t += n;
t += "\n玩法：";
o = e.findCheckedIds([ 1, 2, 3 ]);
t += n = e.listDesc(o, "、");
t += "\n封顶：";
o = e.findCheckedIds([ 12, 13, 14, 15, 16 ]);
t += n = e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 23, 24, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
t += "\n其它：";
o = e.findCheckedIds([ 17, 18, 19, 20, 22, 25 ]);
t += n = e.listDesc(o, "、");
t += this.roomTypeDesc(e, "\n托管：", [ 41, 42, 43, 44, 45, 46 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.getPzList = function(e) {
return 31 === e || 37 === e ? [ e, i.default.gameInfo.lz + 1 ] : 33 === e && i.default.config.isChecked(22) ? [ e, i.default.gameInfo.lz + 1 ] : [ e, r.MJ_HZ_ID ];
};
t.prototype.isZiMo = function(e) {
return !!s.default.checkBit(e, 4096) || (!!s.default.checkBit(e, 512) || !!s.default.checkBit(e, 1024));
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
if (i.default.config.isChecked(1) && !this.openCount(a)) return [];
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
if (l === a.eOperateCategory.WarnFYS) return !!this.isFengYiSe(e, t);
if (l === a.eOperateCategory.WarnJYS) return !!this.isJiangYiSe(e, t);
if (l === a.eOperateCategory.Null) {
if (this.openCount(t) <= 1) {
if (this.isJiangYiSe(e, t)) return !0;
if (this.isFengYiSe(e, t)) return !0;
}
if (this.isQiDui(e, s)) return !0;
if (this.isPengPengHu(e, t, s)) return !0;
}
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
var s = this.openCount(t);
if (s <= 1 && this.isQingYiSe(e, t)) return !0;
if (this.isLaiZi(i) || this.isCard258(i)) {
if (0 === s) return !0;
if (o <= 1) return !0;
}
return !1;
};
return t;
}(l.default);
o.default = p;
cc._RF.pop();
