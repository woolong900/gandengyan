// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b6fe9ZU5m1HrrXigcfiN0Na", "GameLogicMJ_YJLY");
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
var r = e("./CardUtils"), i = e("./RoomInfoData"), a = e("./CommonUtils"), s = e("./GameLogicMJ"), l = e("./CommonEnum"), c = e("./GameSoundMJ"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], i = Math.floor(t / 1e11) % 10, a = Math.floor(t / 1e10) % 10, s = Math.floor(t / 1e9) % 10, c = Math.floor(t / 1e8) % 10;
n = Math.floor(t / 1e7) % 10;
var u = Math.floor(t / 1e6) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e4) % 10, f = Math.floor(t / 1e3) % 10, h = Math.floor(t / 100) % 10, m = Math.floor(t / 10) % 10, y = Math.floor(t / 1) % 10;
8 === e && r.push(10);
16 === e && r.push(11);
1 === i && r.push(25);
1 === a && r.push(24);
1 === s && r.push(23);
1 === c && r.push(22);
1 === u && r.push(21);
1 === d && r.push(20);
1 === p && r.push(19);
0 === y && r.push(16);
1 === y && r.push(17);
2 === y && r.push(18);
0 === m && r.push(1);
1 === m && r.push(2);
2 === m && r.push(3);
3 === m && r.push(4);
4 === m && r.push(5);
5 === m && r.push(6);
0 === h && r.push(7);
1 === h && r.push(8);
2 === h && r.push(9);
0 === f && r.push(12);
1 === f && r.push(13);
2 === f && r.push(14);
3 === f && r.push(15);
return {
index: l.eGameIds.YJLY,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.IPStatus() ? "1" : "0", r = "0", i = e.peopleCount();
4 === i && (r = "0");
3 === i && (r = "1");
2 === i && (r = "2");
var a = "" + e.payType(), s = e.isChecked(25) ? "1" : "0", l = e.isChecked(24) ? "1" : "0", c = e.isChecked(23) ? "1" : "0", u = e.isChecked(22) ? "1" : "0", d = e.isChecked(21) ? "1" : "0", p = e.isChecked(20) ? "1" : "0", f = e.isChecked(19) ? "1" : "0", h = e.findCheckedIds([ 1, 2, 3, 4, 5, 6 ]), m = "" + e.getValue(h[0]), y = e.findCheckedIds([ 16, 17, 18 ]);
o = s + l + c + u + n + d + p + f + a + r + m + ("" + e.getValue(y[0]));
var g = 1, _ = e.gameCount();
8 === _ && (g = 1);
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
return e.isChecked(24);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(25);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 1, 2, 3, 4, 5, 6 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 12, 13, 14, 15 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 1, 2, 3, 4, 5, 6 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 16, 17, 18, 19, 20, 21, 22, 23 ], t);
a = a && "" + t + a;
if (o) {
var s = e.listDesc([ 7, 8, 9 ], t);
return n + (s = s && "" + t + s + "房") + r + i + a;
}
return n + r + i + a;
};
t.prototype.cardStorageTotal = function(e) {
return this.isPiZi(e) ? 3 : 4;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += "支付：";
var o = e.findCheckedIds([ 12, 13, 14, 15 ]), n = e.listDesc(o, "、");
t += n;
o = e.findCheckedIds([ 1, 2, 3, 4, 5, 6 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n底分：" + n);
o = e.findCheckedIds([ 16, 17, 18, 19, 20, 21, 22, 23 ]);
(n = e.listDesc(o, "、")) && (t = t + "\n玩法：" + n);
if ((o = e.findCheckedIds([ 24 ])).length > 0) {
t += "\n功能：";
t += e.listDesc(o, "、");
}
return t;
};
t.prototype.isZiMo = function(e) {
return !(!a.default.checkBit(e, 1) && !a.default.checkBit(e, 2));
};
t.prototype.tingCards = function(e, t) {
return this._tingCards(e, t, !1);
};
t.prototype.isTing = function(e, t) {
return this._tingCards(e, t, !0).length > 0;
};
t.prototype.tingTipType = function(e) {
return e.length > 15 ? s.eTingTipType.JZH : s.eTingTipType.NORMAL;
};
t.prototype.isSupportPiZi = function() {
return !1;
};
t.prototype.playSoundPutCard = function(t, o) {
if (this.isGangCard(t)) {
c.default.getInstance().outCard();
c.default.getInstance().playOperate("gang", o);
} else e.prototype.playSoundPutCard.call(this, t, o);
};
t.prototype.getPzList = function(e) {
return [ e ];
};
t.prototype.isGangCard = function(t) {
return !!i.default.gameInfo.isLaiZi(t) || e.prototype.isGangCard.call(this, t);
};
t.prototype.paiDunOffset = function() {
return i.default.config.isChecked(22) && 2 == i.default.config.peopleCount() ? 8 : 0;
};
t.prototype.pzImgName = function() {
return "ct";
};
t.prototype.handSort = function() {
return function(e, t) {
var o = i.default.gameInfo.isLaiZi(e);
return o !== i.default.gameInfo.isLaiZi(t) ? o ? -1 : 1 : e - t;
};
};
t.prototype.is3CardGang = function(e) {
return !!this.isPiZi(e);
};
t.prototype.isShowArrow = function() {
return !0;
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
if (c > 1) return [];
var h = c;
if (!this._checkHu(l, a, c, 1)) return [];
if (0 === h) {
var m = i.default.gameInfo.lz;
s.push(m);
}
for (u = r.eCardColor.Bamboo; u <= r.eCardColor.wind; u++) for (var y = 1; y < l[u].length; y++) if (!(u === r.eCardColor.wind && y > 7)) {
d = r.default.card(u, y);
if (!this.isLaiZi(d)) {
l[u][0]++;
l[u][y]++;
this._checkHu(l, a, c, 0) && s.push(d);
l[u][0]--;
l[u][y]--;
}
}
s.length > 15 && !i.default.config.isChecked(20) && (s.length = 0);
return s;
};
t.prototype._checkHu = function(e, t, o, n) {
var i = o + n;
if (this.needLZ_SimpleCheck(e) > i) return !1;
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
return !0;
};
return t;
}(s.default);
o.default = u;
cc._RF.pop();
