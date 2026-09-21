// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e80c6I7OEVEp6oAGcvn+IJt", "GameLogicMJ_QCHH");
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
var r = require("./CardUtils"), i = require("./RoomInfoData"), a = require("./CommonUtils"), s = require("./GameLogicMJ"), l = require("./CommonEnum"), c = require("./GameSoundMJ"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e10) % 10, a = Math.floor(t / 1e9) % 10, s = Math.floor(t / 1e8) % 10, c = Math.floor(t / 1e7) % 10, u = Math.floor(t / 1e6) % 10, d = Math.floor(t / 1e5) % 10;
n = Math.floor(t / 1e4) % 10;
var p = Math.floor(t / 1e3) % 10, f = Math.floor(t / 100) % 10, h = Math.floor(t / 10) % 10, m = Math.floor(t / 1) % 10;
1 == a && r.push(200);
8 === e && r.push(10);
16 === e && r.push(11);
0 === c && r.push(19);
1 === c && r.push(20);
2 === c && r.push(21);
3 === c && r.push(22);
4 === c && r.push(23);
1 === s && r.push(24);
1 === u && r.push(18);
1 === d && r.push(17);
1 === p && r.push(16);
0 === f && r.push(1);
1 === f && r.push(2);
2 === f && r.push(3);
3 === f && r.push(4);
4 === f && r.push(5);
5 === f && r.push(6);
0 === h && r.push(7);
1 === h && r.push(8);
2 === h && r.push(9);
0 === m && r.push(12);
1 === m && r.push(13);
2 === m && r.push(14);
3 === m && r.push(15);
0 === i && r.push(30);
1 === i && r.push(31);
2 === i && r.push(32);
3 === i && r.push(33);
return {
index: l.eGameIds.QCHH,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.isChecked(24) ? "1" : "0", r = e.isChecked(18) ? "1" : "0", i = e.IPStatus() ? "1" : "0", a = "0", s = e.peopleCount();
4 === s && (a = "0");
3 === s && (a = "1");
2 === s && (a = "2");
var l = "" + e.payType(), c = "0";
e.isChecked(16) && (c = "1");
var u = e.isChecked(17) ? "1" : "0", d = e.findCheckedIds([ 1, 2, 3, 4, 5, 6 ]), p = "" + e.getValue(d[0]), f = e.isChecked(200) ? "1" : "0", h = "0";
e.isChecked(19) && (h = "0");
e.isChecked(20) && (h = "1");
e.isChecked(21) && (h = "2");
e.isChecked(22) && (h = "3");
e.isChecked(23) && (h = "4");
var m = "0";
e.isChecked(30) && (m = "0");
e.isChecked(31) && (m = "1");
e.isChecked(32) && (m = "2");
e.isChecked(33) && (m = "3");
o = m + f + n + h + r + u + i + c + p + a + l;
var y = 1, g = e.gameCount();
8 === g && (y = 1);
16 === g && (y = 2);
var _ = parseInt(o);
return {
gameType: e.index,
num: y,
param1: 1,
param2: _,
clubId: t
};
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(18);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(24);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(20) ? 15 : t.isChecked(21) ? 30 : t.isChecked(22) ? 60 : t.isChecked(23) ? 120 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(20) || (!!e.isChecked(21) || (!!e.isChecked(22) || !!e.isChecked(23)));
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 1, 2, 3, 4, 5, 6 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 16, 17, 20, 21, 22, 23, 200 ], i = e.listDescDetails(r, t), a = e.listDesc([ 30, 31, 32, 33 ], t);
a = a && "" + t + a + "离线踢人";
if (o) {
return n + (e.listDescDetails([ 7, 8, 9 ], t) + t) + i + a;
}
return n + i + a;
};
t.prototype.cardStorageTotal = function(e) {
return this.isPiZi(e) ? 3 : 4;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "支付：", [ 12, 13, 14, 15 ]);
t += this.roomTypeDesc(e, "\n底分：", [ 6, 1, 2, 3, 4, 5 ]);
t += this.roomTypeDesc(e, "\n玩法：", [ 16, 17 ]);
t += this.roomTypeDesc(e, "\n功能：", [ 18, 200 ]);
t += this.roomTypeDesc(e, "\n托管：", [ 19, 20, 21, 22, 23 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 30, 31, 32, 33 ]);
};
t.prototype.tingCards = function(e, t) {
if (t) {
if (i.default.gameInfo.isLaiZi(t)) return [];
}
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
if (t) {
if (i.default.gameInfo.isLaiZi(t)) return !1;
}
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tingTipType = function(e) {
return e.length > 20 ? s.eTingTipType.JZH : s.eTingTipType.NORMAL;
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.getPzList = function(e) {
return i.default.config.isChecked(16) ? [ r.MJ_HZ_ID ] : [];
};
t.prototype.isGangCard = function(t) {
var o = i.default.gameInfo.isPiZi(t), n = i.default.gameInfo.isLaiZi(t);
return !(!o && !n) || e.prototype.isGangCard.call(this, t);
};
t.prototype.isZiMo = function(e) {
return !a.default.checkBit(e, 128) && !a.default.checkBit(e, 512);
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
c.default.getInstance().outCard();
c.default.getInstance().playOperate("gang", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
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
if (this.isQiDui(e, i)) return !0;
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
if (0 == this.openCount(t)) return !0;
if (this.isQingYiSe(e, t)) return !0;
if (o >= 2) {
return this.isLiangLai(t);
}
return !0;
};
return t;
}(s.default);
o.default = u;
cc._RF.pop();
