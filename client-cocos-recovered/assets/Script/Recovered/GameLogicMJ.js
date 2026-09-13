// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "041daJYdYBLG7vuOA5Ijbtz", "GameLogicMJ");
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
var r, i = e("./OperateListData"), a = e("./GameLogicBase"), s = e("./CardUtils"), l = e("./RoomInfoData"), c = e("./OperateConfig"), u = e("./GameSoundMJ");
(function(e) {
e[e.NORMAL = 0] = "NORMAL";
e[e.JJH = 1] = "JJH";
e[e.JZH = 2] = "JZH";
})(r = o.eTingTipType || (o.eTingTipType = {}));
var d = function(e) {
n(t, e);
function t() {
var t = e.call(this) || this;
t.all258 = [];
t.laizi = -1;
for (var o = s.eCardColor.Bamboo; o <= s.eCardColor.Characters; o++) {
t.all258.push(s.default.card(o, 2));
t.all258.push(s.default.card(o, 5));
t.all258.push(s.default.card(o, 8));
}
return t;
}
t.prototype.cardStorageTotal = function(e) {
return 4;
};
t.prototype.tingCards = function(e, t) {
cc.warn("该游戏的听牌逻辑暂未实现~");
return [];
};
t.prototype.isTing = function(e, t) {
return !1;
};
t.prototype.tingTipType = function(e) {
return e.length > 20 ? r.JZH : this._isHuType258(e) ? r.JJH : r.NORMAL;
};
t.prototype.canPut = function(e, t) {
return !0;
};
t.prototype.tabelDesc = function() {
return "";
};
t.prototype.clubTableColor = function() {
return null;
};
t.prototype.roomDetails = function(e) {
return "";
};
t.prototype.isSupportPiZi = function() {
return !0;
};
t.prototype.tipDescOpen = function() {
return null;
};
t.prototype.tipDescGuo = function() {
return null;
};
t.prototype.isZiMo = function(e) {
return !1;
};
t.prototype.isShowHead3DMul = function() {
return !1;
};
t.prototype.isShowHead2DMul = function() {
return !1;
};
t.prototype.head3DMul = function(e) {
return 0;
};
t.prototype.getPzList = function(e) {
return [];
};
t.prototype.pzImgName = function() {
return "pz";
};
t.prototype.playSoundPutCard = function(e, t) {
u.default.getInstance().putCard(e, t);
};
t.prototype.isGangCard = function(e) {
return !1;
};
t.prototype.handSort = function() {
return function(e, t) {
var o = l.default.gameInfo.isLaiZi(e);
if (o !== l.default.gameInfo.isLaiZi(t)) return o ? -1 : 1;
var n = l.default.gameInfo.isPiZi(e);
return n !== l.default.gameInfo.isPiZi(t) ? n ? -1 : 1 : e - t;
};
};
t.prototype.fixGameView = function() {
return null;
};
t.prototype.paiDunOffset = function() {
return 0;
};
t.prototype.handMaxLen = function() {
return 14;
};
t.prototype.roomDescEx = function() {
return "";
};
t.prototype.is3CardGang = function(e) {
return !1;
};
t.prototype.isShowArrow = function() {
return !1;
};
t.prototype.isAnGangCardShow = function() {
return !1;
};
t.prototype.animationAg = function(e) {
return "angang";
};
t.prototype.animationMg = function(e) {
return "gang";
};
t.prototype.animationBg = function(e) {
return "bugang";
};
t.prototype.animationPZ = function(e) {
return "gang";
};
t.prototype.animationLZ = function(e) {
return "gang";
};
t.prototype.animationXXF = function(e) {
return "xxf";
};
t.prototype.soundAg = function(e) {
return "gang";
};
t.prototype.soundMg = function(e) {
return "gang";
};
t.prototype.soundBg = function(e) {
return "gang";
};
t.prototype.soundPZ = function(e) {
return "gang";
};
t.prototype.soundLZ = function(e) {
return "gang";
};
t.prototype.soundPeng = function(e) {
return "peng";
};
t.prototype.uiStyle1 = function() {
return !1;
};
t.prototype.uiStyle2 = function() {
return !1;
};
t.prototype.initCardArr = function() {
for (var e = new Array(4), t = 0; t < e.length; t++) {
e[t] = new Array(10);
for (var o = 0; o < e[t].length; o++) e[t][o] = 0;
}
return e;
};
t.prototype.isLaiZi = function(e) {
return l.default.gameInfo.isLaiZi(e);
};
t.prototype.isPiZi = function(e) {
return l.default.gameInfo.isPiZi(e);
};
t.prototype.jiangAny = function(e) {
for (var t = new Array(), o = s.eCardColor.Bamboo; o <= s.eCardColor.wind; o++) if (!(e[o][0] <= 1)) for (var n = 1; n < e[o].length; n++) if (e[o][n] >= 2) {
var r = s.default.card(o, n);
t.push(r);
}
return t;
};
t.prototype.jiang258 = function(e) {
for (var t = new Array(), o = s.eCardColor.Bamboo; o < s.eCardColor.wind; o++) {
if (e[o][2] >= 2) {
var n = s.default.card(o, 2);
t.push(n);
}
if (e[o][5] >= 2) {
n = s.default.card(o, 5);
t.push(n);
}
if (e[o][8] >= 2) {
n = s.default.card(o, 8);
t.push(n);
}
}
return t;
};
t.prototype.needLZ_QiDui = function(e) {
for (var t = 0, o = 0; o < e.length; o++) if (0 != e[o][0]) for (var n = 1; n < e[o].length; n++) t += e[o][n] % 2;
return t;
};
t.prototype.needLZ_SimpleCheck = function(e) {
for (var t = 0, o = 0, n = 0; n < e.length; n++) switch (e[n][0] % 3) {
case 1:
o++;
break;

case 2:
t++;
}
return t + o - 1;
};
t.prototype.needLZ_Color3N = function(e, t) {
return t === s.eCardColor.wind ? this.needLZ_Color3N3(e, t) : this.needLZ_Color3Nx(e, t);
};
t.prototype.needLZ_Color3N3 = function(e, t) {
var o = e[t];
if (0 === o[0]) return 0;
for (var n = 0, r = 1; r < o.length; r++) {
var i = o[r] % 3;
0 !== i && (n += 3 - i);
}
return n;
};
t.prototype.needLZ_Color3Nx = function(e, t) {
for (var o = e[t], n = 0, r = o.length, i = 0, a = 0, s = function(e, t) {
switch (t) {
case 1:
case 4:
if (e + 1 >= r || o[e + 1] - a == 0) {
n++;
i = a;
} else i = 1 + a;
if (e + 2 >= r || 0 == o[e + 2]) {
n++;
a = 0;
} else a = 1;
break;

case 2:
if (e + 1 >= r || e + 2 >= r || o[e + 1] - a <= 0 || (o[e + 1] - a) % 3 <= 1 && o[e + 2] <= 1) {
n++;
i = a;
a = 0;
break;
}
i = a + 2;
a = 2;
break;

case 0:
case 3:
i = a;
a = 0;
break;

default:
n = n + i - o[e];
i = a;
a = 0;
}
}, l = 1; l < r; l++) {
(f = o[l] - i) > 4 && (f %= 3);
s(l, f);
}
var c = 0, u = 0, d = 0, p = function(e, t) {
switch (t) {
case 1:
case 4:
if (e - 1 <= 0 || o[e - 1] - d == 0) {
c++;
u = d;
} else u = 1 + d;
if (e - 2 <= 0 || 0 == o[e - 2]) {
c++;
d = 0;
} else d = 1;
break;

case 2:
if (e - 1 <= 0 || e - 2 <= 0 || o[e - 1] - d <= 0 || (o[e - 1] - d) % 3 <= 1 && o[e - 2] <= 1) {
c++;
u = d;
d = 0;
break;
}
u = d + 2;
d = 2;
break;

case 0:
case 3:
u = d;
d = 0;
break;

default:
c = c + u - o[e];
u = d;
d = 0;
}
};
for (l = r - 1; l > 0; l--) {
var f;
(f = o[l] - u) > 4 && (f %= 3);
p(l, f);
}
c < n && (n = c);
return n;
};
t.prototype.openCount = function(e) {
var t = e.collection(i.default.filterChiPengGang).length;
return 0 == t ? 0 : t - e.collection(function(e) {
return e.category === c.eOperateCategory.Gang && (e.subType === c.eGangType.AnGang || e.subType === c.eGangType.BuGang);
}).length;
};
t.prototype.isQiDui = function(e, t) {
for (var o = t, n = 0; n < e.length; n++) o += e[n][0];
return 14 == o && t >= this.needLZ_QiDui(e);
};
t.prototype.isJiangYiSe = function(e, t) {
if (e[s.eCardColor.wind][0] > 0) return !1;
for (var o = s.eCardColor.Bamboo; o <= s.eCardColor.Characters; o++) {
if (e[o][0] !== e[o][2] + e[o][5] + e[o][8]) return !1;
}
for (var n = t.collection(i.default.filterChiPengGang), r = (o = 0, n.length); o < r; o++) {
var a = t.get(n[o]), l = a.cards[0];
if (l !== a.cards[1] || !this.isCard258(l)) return !1;
}
return !0;
};
t.prototype.isYiSe = function(e, t) {
for (var o = -1, n = 0; n < e.length; n++) if (e[n][0] > 0) {
if (o >= 0) return !1;
o = n;
}
for (var r = t.collection(i.default.filterChiPengGang), a = (n = 0, r.length); n < a; n++) {
var l = t.get(r[n]).cards[0];
if (s.default.cardColor(l) !== o) return !1;
}
return !0;
};
t.prototype.isFengYiSe = function(e, t) {
return !!(this.isYiSe(e, t) && e[s.eCardColor.wind][0] > 0);
};
t.prototype.isQingYiSe = function(e, t) {
return !(!this.isYiSe(e, t) || 0 !== e[s.eCardColor.wind][0]);
};
t.prototype.isPengPengHu = function(e, t, o) {
if (0 === t.collection(function(e) {
return e.category === c.eOperateCategory.Chi;
}).length) {
for (var n = 0, r = s.eCardColor.Bamboo; r <= s.eCardColor.wind; r++) n += this.needLZ_Color3N3(e, r);
if (n - 1 <= o) return !0;
}
return !1;
};
t.prototype.havePiZi = function(e) {
for (var t = l.default.gameInfo.pzList, o = 0, n = t.length; o < n; o++) {
var r = t[o], i = s.default.cardColor(r), a = s.default.cardValue(r);
if (e[i][a] > 0) return !0;
}
return !1;
};
t.prototype.isLiangLai = function(e) {
return e.collection(function(e) {
return e.isLiangLai();
}).length > 0;
};
t.prototype.findWarnType = function(e) {
var t = e.collection(function(e) {
if (e.isWarn_qqr() || e.isWarn_fys() || e.isWarn_jys() || e.isWarn_qys()) return !0;
})[0];
return t ? e.get(t).category : c.eOperateCategory.Null;
};
t.prototype.isCardInList = function(e, t) {
if (s.default.cardColor(t) !== s.eCardColor.wind) {
var o = s.default.cardValue(t);
if (-1 !== e.indexOf(o)) return !0;
}
return !1;
};
t.prototype.isCard258 = function(e) {
return this.isCardInList([ 2, 5, 8 ], e);
};
t.prototype._isHuType258 = function(e) {
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
return t;
}(a.default);
o.default = d;
cc._RF.pop();
