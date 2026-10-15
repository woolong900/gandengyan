// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "698e8PcO39CJZEIwKmwKNPP", "GameLogicMJ_XSMJ");
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
var r = require("./CardUtils"), i = require("./RoomInfoData"), a = require("./OperateConfig"), s = require("./CommonUtils"), l = require("./GameLogicMJ"), c = require("./CommonEnum"), u = require("./GameSoundMJ"), d = require("./GameInfoData"), p = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e14) % 10, a = Math.floor(t / 1e13) % 10, s = Math.floor(t / 1e12) % 10, l = Math.floor(t / 1e11) % 10, u = Math.floor(t / 1e10) % 10, d = Math.floor(t / 1e9) % 10, p = Math.floor(t / 1e8) % 10;
n = Math.floor(t / 1e7) % 10;
var f = Math.floor(t / 1e6) % 10, h = Math.floor(t / 1e5) % 10, m = Math.floor(t / 1e4) % 10, y = Math.floor(t / 1e3) % 10, g = Math.floor(t / 100) % 10, _ = Math.floor(t / 10) % 10, v = Math.floor(t / 1) % 10;
8 === e && r.push(7);
12 === e && r.push(20);
16 === e && r.push(8);
0 === l && r.push(21);
1 === l && r.push(22);
2 === l && r.push(23);
3 === l && r.push(24);
4 === l && r.push(25);
5 === l && r.push(29);
1 == a && r.push(200);
1 === s && r.push(26);
1 === u && r.push(19);
1 === d && r.push(18);
1 === p && r.push(17);
1 === f && r.push(14);
1 === h && r.push(13);
1 === m && r.push(15);
1 === y && r.push(12);
0 === v && r.push(1);
1 === v && r.push(2);
2 === v && r.push(3);
3 === v && r.push(27);
4 === v && r.push(28);
0 === _ && r.push(4);
1 === _ && r.push(5);
2 === _ && r.push(6);
0 === g && r.push(9);
1 === g && r.push(10);
2 === g && r.push(11);
3 === g && r.push(16);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
return {
index: c.eGameIds.XSMJ,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = e.IPStatus() ? "1" : "0", n = "0", r = e.peopleCount();
4 === r && (n = "0");
3 === r && (n = "1");
2 === r && (n = "2");
var i = "" + e.payType(), a = 1, s = e.gameCount();
8 === s && (a = 1);
16 === s && (a = 2);
12 === s && (a = 3);
var l = "0";
e.isChecked(200) && (l = "1");
var c = "0";
e.isChecked(21) && (c = "0");
e.isChecked(22) && (c = "1");
e.isChecked(23) && (c = "2");
e.isChecked(24) && (c = "3");
e.isChecked(25) && (c = "4");
e.isChecked(29) && (c = "5");
var u = "0";
e.isChecked(30) && (u = "0");
e.isChecked(31) && (u = "1");
e.isChecked(32) && (u = "2");
e.isChecked(33) && (u = "3");
var d = e.isChecked(26) ? "1" : "0", p = e.isChecked(19) ? "1" : "0", f = e.isChecked(18) ? "1" : "0", h = e.isChecked(17) ? "1" : "0", m = e.isChecked(12) ? "1" : "0", y = e.isChecked(13) ? "1" : "0", g = e.isChecked(14) ? "1" : "0", _ = e.isChecked(15) ? "1" : "0", v = e.findCheckedIds([ 1, 2, 3, 27, 28 ]), C = "" + e.getValue(v[0]), b = parseInt(u + l + d + c + p + f + h + o + g + y + _ + m + i + n + C);
return {
gameType: e.index,
num: a,
param1: 1,
param2: b,
clubId: t
};
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(26);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(22) ? 15 : t.isChecked(23) ? 30 : t.isChecked(24) ? 60 : t.isChecked(25) ? 120 : t.isChecked(29) ? 600 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(22) || (!!e.isChecked(23) || (!!e.isChecked(24) || (!!e.isChecked(25) || !!e.isChecked(29))));
};
t.prototype.scoreRuleDesc = function(e, t) {
return e.listDesc([ 28, 1, 2, 3, 27 ], "", t);
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 9, 10, 11, 16 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 28, 1, 2, 3, 27 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 12, 13, 14, 15, 17, 18, 200 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 30, 31, 32, 33 ], t);
s = s && "" + t + s + "离线踢人";
if (o) {
var l = e.listDesc([ 4, 5, 6 ], t);
return n + (l = l && "" + t + l + "房") + r + i + a + s;
}
return n + r + i + a + s;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 9, 10, 11, 16 ]), n = e.listDesc(o, "、");
t += n;
t += "\n玩法：";
o = e.findCheckedIds([ 28, 1, 2, 3, 27 ]);
t += n = e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 19, 26, 200 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
t += "\n其它：";
o = e.findCheckedIds([ 12, 13, 14, 15, 17, 18 ]);
t += n = e.listDesc(o, "、");
t += this.roomTypeDesc(e, "\n托管：", [ 21, 22, 23, 24, 25, 29 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.tingCards = function(e, t) {
var o = this._tingCards(e, t, !1);
cc.log("tingCards>>>>>list:", o);
return o;
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tabelDesc = function() {
if (i.default.gameInfo.status === d.eGameStatus.Free) return "";
if (i.default.config.isChecked(12)) {
var e = i.default.gameInfo.pz;
if (r.default.cardColor(e) === r.eCardColor.wind) return "风豹";
}
if (i.default.config.isChecked(13)) {
e = i.default.gameInfo.pz;
if (r.default.cardColor(e) !== r.eCardColor.wind && r.default.cardValue(e) % 2 == 1) return "单豹";
}
if (i.default.config.isChecked(14)) {
e = i.default.gameInfo.pz;
if (r.default.cardColor(e) !== r.eCardColor.wind && r.default.cardValue(e) % 2 == 0) return "双豹";
}
return "";
};
t.prototype.clubTableColor = function() {
return cc.color(197, 116, 26);
};
t.prototype.getPzList = function(e) {
return 31 === e ? [ e, 33 ] : 33 === e ? [ e, 32 ] : [ e, r.MJ_HZ_ID ];
};
t.prototype.handSort = function() {
return function(e, t) {
var o = i.default.gameInfo.isPiZi(e);
if (o !== i.default.gameInfo.isPiZi(t)) return o ? -1 : 1;
var n = e === r.MJ_HZ_ID;
if (n !== (t === r.MJ_HZ_ID)) return n ? -1 : 1;
var a = i.default.gameInfo.isLaiZi(e);
return a !== i.default.gameInfo.isLaiZi(t) ? a ? -1 : 1 : e - t;
};
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
var n = i.default.gameInfo.isPiZi(t), r = i.default.gameInfo.isLaiZi(t);
if (n || r) {
u.default.getInstance().outCard();
u.default.getInstance().playOperate("gang", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.isGangCard = function(t) {
var o = i.default.gameInfo.isPiZi(t), n = i.default.gameInfo.isLaiZi(t);
cc.log(">>>>>>>>>>>>>>isGangCard bPz:", o);
cc.log(">>>>>>>>>>>>>>isGangCard bLz:", n);
if (o || n) return !0;
cc.log(">>>>>>>>>>>>>>isGangCard super.isGangCard(card):", e.prototype.isGangCard.call(this, t));
return e.prototype.isGangCard.call(this, t);
};
t.prototype._tingCards = function(e, t, o) {
var n = e.handCards, a = e.operateList;
if (i.default.config.isChecked(18) && !this.openCount(a)) return [];
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
if (this.havePiZi(l)) {
cc.log(">>>>>>>>>>>>>>>>>_tingCards 如果手里还有痞子，则不能胡");
return [];
}
if (this._checkHu(l, a, c, 1)) {
s.push(i.default.gameInfo.lz);
if (o) return s;
}
for (u = r.eCardColor.Bamboo; u <= r.eCardColor.wind; u++) for (var h = 1; h < l[u].length; h++) if (!(u === r.eCardColor.wind && h > 7 || l[u][h] >= 4)) {
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
cc.log("_checkHu >>>>>>>>>>>>>> bol:", m);
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
var g = this._checkCanHu(e, t, o, n, l, f);
cc.log("_checkHu >>>>>>>>>>>>>> bCanHu:", g);
if (g) return !0;
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
cc.log("_checkCanHu>>>>>>>>>>>>>>> WarnQYS baoType:", r);
cc.log("_checkCanHu>>>>>>>>>>>>>>> WarnQYS baoType === eOperateCategory.WarnQYS:", r === a.eOperateCategory.WarnQYS);
if (r === a.eOperateCategory.WarnQYS) return !!this.isQingYiSe(e, t);
var s = this.openCount(t);
if (s <= 1 && this.isQingYiSe(e, t)) return !0;
if (this.isLaiZi(i) || this.isCard258(i)) {
cc.log("_checkCanHu 屁胡，将必须是2、5、8>>>>>>>>>>>>>>> openCount:", s);
cc.log("_checkCanHu, 屁胡，将必须是2、5、8 (realLaiNum + freeRazzNum) <= 1:", o + n <= 1);
if (0 === s) return !0;
if (o + n <= 1) return !0;
}
return !1;
};
return t;
}(l.default);
o.default = p;
cc._RF.pop();
