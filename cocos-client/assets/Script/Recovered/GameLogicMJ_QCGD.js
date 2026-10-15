// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4dd0c5SCA1Js7txwCe8yHjO", "GameLogicMJ_QCGD");
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
var r = require("./CardUtils"), i = require("./RoomInfoData"), a = require("./OperateConfig"), s = require("./CommonUtils"), l = require("./GameLogicMJ"), c = require("./CommonEnum"), u = require("./GameSoundMJ"), d = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e11) % 10, a = Math.floor(t / 1e10) % 10, s = Math.floor(t / 1e9) % 10, l = Math.floor(t / 1e8) % 10;
n = Math.floor(t / 1e7) % 10;
var u = Math.floor(t / 1e6) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e4) % 10, f = Math.floor(t / 1e3) % 10, h = Math.floor(t / 100) % 10, m = Math.floor(t / 10) % 10, y = Math.floor(t / 1) % 10;
8 === e && r.push(10);
16 === e && r.push(11);
1 === s && r.push(27);
1 === l && r.push(26);
1 === u && r.push(25);
1 === p && r.push(23);
0 === d && r.push(21);
1 === d && r.push(22);
0 === h && r.push(7);
1 === h && r.push(8);
2 === h && r.push(9);
0 === m && r.push(16);
1 === m && r.push(17);
2 === m && r.push(18);
3 === m && r.push(19);
4 === m && r.push(20);
5 === m && r.push(24);
0 === y && r.push(1);
1 === y && r.push(2);
2 === y && r.push(3);
3 === y && r.push(4);
4 === y && r.push(5);
5 === y && r.push(6);
0 === f && r.push(12);
1 === f && r.push(13);
2 === f && r.push(14);
3 === f && r.push(15);
0 === a && r.push(41);
1 === a && r.push(42);
2 === a && r.push(43);
3 === a && r.push(44);
4 === a && r.push(45);
5 === a && r.push(46);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
return {
index: c.eGameIds.QCGD,
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
var l = "0";
e.isChecked(30) && (l = "0");
e.isChecked(31) && (l = "1");
e.isChecked(32) && (l = "2");
e.isChecked(33) && (l = "3");
var c = e.isChecked(27) ? "1" : "0", u = e.isChecked(26) ? "1" : "0", d = e.isChecked(23) ? "1" : "0", p = e.isChecked(25) ? "1" : "0", f = e.findCheckedIds([ 21, 22 ]), h = "" + e.getValue(f[0]), m = e.findCheckedIds([ 1, 2, 3, 4, 5, 6 ]), y = "" + e.getValue(m[0]), g = e.findCheckedIds([ 16, 17, 18, 19, 20, 24 ]), _ = "" + e.getValue(g[0]), v = this.configCell2Str(e, [ 41, 42, 43, 44, 45, 46 ], [ "0", "1", "2", "3", "4", "5" ]), C = parseInt(l + v + c + u + o + p + h + d + i + n + _ + y);
return {
gameType: e.index,
num: a,
param1: 1,
param2: C,
clubId: t
};
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(42) ? 15 : t.isChecked(43) ? 30 : t.isChecked(44) ? 60 : t.isChecked(45) ? 120 : t.isChecked(46) ? 300 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(42) || (!!e.isChecked(43) || (!!e.isChecked(44) || (!!e.isChecked(45) || !!e.isChecked(46))));
};
t.prototype.isRealTime = function(e) {
return e.isChecked(26);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(27);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 1, 2, 3, 4, 5, 6 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 12, 13, 14, 15 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 1, 2, 3, 4, 5, 6 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 16, 17, 18, 19, 20, 24 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 21, 22, 23, 25 ], t);
s = s && "" + t + s;
var l = e.listDesc([ 41, 42, 43, 44, 45, 46 ], t);
l = l && "" + t + l + "托管";
var c = e.listDesc([ 30, 31, 32, 33 ], t);
c = c && "" + t + c + "离线踢人";
if (o) {
var u = e.listDesc([ 7, 8, 9 ], t);
return n + (u = u && "" + t + u + "房") + r + i + a + s + l + c;
}
return n + r + i + a + s + l + c;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 12, 13, 14, 15 ]), n = e.listDesc(o, "、");
t += n;
t += "\n底分：";
o = e.findCheckedIds([ 1, 2, 3, 4, 5, 6 ]);
t += n = e.listDesc(o, "、");
t += "\n买马：";
o = e.findCheckedIds([ 16, 17, 18, 19, 20, 24 ]);
t += n = e.listDesc(o, "、");
if ((o = e.findCheckedIds([ 26 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
t += "\n其它：";
o = e.findCheckedIds([ 21, 22, 23, 25 ]);
t += n = e.listDesc(o, "、");
t += this.roomTypeDesc(e, "\n托管：", [ 41, 42, 43, 44, 45, 46 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tabelDesc = function() {
return "";
};
t.prototype.clubTableColor = function() {
return cc.color(197, 116, 26);
};
t.prototype.getPzList = function(e) {
return i.default.config.isChecked(22) ? [ r.MJ_HZ_ID ] : [];
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.paiDunOffset = function() {
return i.default.config.isChecked(22) && i.default.config.isChecked(25) ? 8 : 0;
};
t.prototype.handSort = function() {
return function(e, t) {
if (i.default.config.isChecked(22)) {
var o = i.default.gameInfo.isPiZi(e);
if (o !== i.default.gameInfo.isPiZi(t)) return o ? -1 : 1;
var n = e === r.MJ_HZ_ID;
if (n !== (t === r.MJ_HZ_ID)) return n ? -1 : 1;
}
var a = i.default.gameInfo.isLaiZi(e);
return a !== i.default.gameInfo.isLaiZi(t) ? a ? -1 : 1 : e - t;
};
};
t.prototype.isZiMo = function(e) {
return !(!s.default.checkBit(e, 1) && !s.default.checkBit(e, 2)) || (!!s.default.checkBit(e, 32) || !!s.default.checkBit(e, 64));
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
var n = i.default.gameInfo.isPiZi(t), a = i.default.gameInfo.isLaiZi(t);
if (n || a) {
u.default.getInstance().outCard();
u.default.getInstance().playOperate("gang", o);
} else i.default.config.isChecked(22) && t == r.MJ_HZ_ID ? u.default.getInstance().playOperate("gang", o) : e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.isGangCard = function(t) {
var o = i.default.gameInfo.isPiZi(t), n = i.default.gameInfo.isLaiZi(t);
return !!(o || n || i.default.config.isChecked(22) && t == r.MJ_HZ_ID) || e.prototype.isGangCard.call(this, t);
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
this.openCount(t);
return !0;
};
return t;
}(l.default);
o.default = d;
cc._RF.pop();
