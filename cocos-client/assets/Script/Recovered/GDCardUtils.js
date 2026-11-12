// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3d5986ONCJJNb9vaNp1xez/", "GDCardUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./RoomInfoData");
(function(e) {
e[e.Hei = 4] = "Hei";
e[e.Hong = 3] = "Hong";
e[e.Mei = 2] = "Mei";
e[e.Fang = 1] = "Fang";
})(n = o.eGDCardColor || (o.eGDCardColor = {}));
o.GD_XiaoWang = 170;
o.GD_DaWang = 180;
o.GD_HuaPai = 190;
o.GD_HIDE_ID = 0;
var i;
(function(e) {
e[e.Error = 0] = "Error";
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.ShunZi = 3] = "ShunZi";
e[e.LianDui = 4] = "LianDui";
e[e.Three = 5] = "Three";
e[e.FeiJi = 6] = "FeiJi";
e[e.FeiJiOne = 8] = "FeiJiOne";
e[e.ThreeTwo = 7] = "ThreeTwo";
e[e.FeiJiTwo = 10] = "FeiJiTwo";
e[e.FourOne = 12] = "FourOne";
e[e.TongHuaShun = 15] = "TongHuaShun";
e[e.SiBomb = 13] = "SiBomb";
e[e.WuBomb = 14] = "WuBomb";
e[e.LiuBomb = 16] = "LiuBomb";
e[e.QiBomb = 17] = "QiBomb";
e[e.BaBomb = 18] = "BaBomb";
e[e.JiuBomb = 19] = "JiuBomb";
e[e.ShiBomb = 20] = "ShiBomb";
e[e.KINGBOMB = 21] = "KINGBOMB";
})(i = o.eGDOneHandType || (o.eGDOneHandType = {}));
var a = function() {
function e() {}
e.isHide = function(e) {
return e === o.GD_HIDE_ID;
};
e._color = function(e) {
return e % 10;
};
e.value = function(e) {
if (e == o.GD_XiaoWang || e == o.GD_DaWang || e == o.GD_HuaPai) return e;
var t = Math.floor(e / 10);
return 1 === t ? 14 : t;
};
e.isLaizi = function(e) {
var t = this._color(e), o = this.value(e);
14 == o && (o = 1);
15 == o && (o = 2);
if (o == r.default.gameInfoGD.m_iLaiziValue && 3 == t) return !0;
};
e.imgPath = function(e, t, n) {
void 0 === t && (t = !1);
void 0 === n && (n = !1);
// The recovered Web host includes the original shared Poker deck, but not
// GdPoker. Compact layouts must change size/position, never request absent
// faces and leave old images on pooled card nodes. Native keeps its own deck.
var compactDeck = cc.sys.isBrowser ? "Games/Poker/" : "Games/GdPoker/";
if (0 == e) return r.default.gameInfoGD.is_shuCard || r.default.gameInfoGD.lipaiBtnStuas ? compactDeck + "card_00" : "Games/Poker/card_00";
var i = this._color(e), a = this.value(e), s = i;
if (0 == i) {
s = 3;
!0;
}
var l = a.toString(16);
if (a === o.GD_XiaoWang) {
s = 5;
l = "e";
}
if (a === o.GD_DaWang) {
s = 5;
l = "f";
}
if (a === o.GD_HuaPai) {
s = 5;
l = "h";
}
if (14 === a) {
l = 1..toString(16);
}
var c = "";
if (t) c = "Games/smallPoker/card_" + s + l; else if (r.default.gameInfoGD.is_shuCard || r.default.gameInfoGD.lipaiBtnStuas) {
c = compactDeck + "card_" + s + l;
n && (c = "Games/Poker/card_" + s + l);
} else c = "Games/Poker/card_" + s + l;
return c;
};
e.isAllLaiCards = function(e) {
var t = this;
return e.every(function(e) {
return t.isLaizi(e);
});
};
e.soundName = function(e, t) {
var n = this.value(t);
return 14 === n ? e + "1" : 2 === n ? e + "2" : "put_double" != e || n !== o.GD_DaWang && n !== o.GD_XiaoWang ? e + n : e + "W";
};
e._cards2CountArr = function(e) {
var t = Array(26);
t.fill(0);
for (var o = 0, n = e.length; o < n; o++) {
var r = e[o];
t[this.value(r)]++;
}
return t;
};
e.transCards = function(e) {
var t = this, o = e.map(function(e) {
return t.value(e);
});
o.sort(function(e, t) {
return e - t;
});
return o;
};
e.checkLaiziNum = function(e) {
var t = this, o = 0;
this.cur_oneHandCrad.length > 1 && this.cur_oneHandCrad.forEach(function(e) {
var n = t._color(e), i = t.value(e);
14 == i && (i = 1);
i == r.default.gameInfoGD.m_iLaiziValue && 3 == n && t.isLaizi(e) && o++;
});
return o;
};
e.checkLaiziNum_tonghua = function(e) {
var t = this, o = 0;
e.length > 1 && e.forEach(function(e) {
var n = t._color(e), i = t.value(e);
14 == i && (i = 1);
i == r.default.gameInfoGD.m_iLaiziValue && 3 == n && t.isLaizi(e) && o++;
});
return o;
};
e.getCardsWithoutLaizi = function(e) {
for (var t = [].concat(this.cur_oneHandCrad), o = t.length - 1; o >= 0; o--) this.isLaizi(t[o]) && t.splice(o, 1)[0];
return this.transCards(t);
};
e.getTipCardsInfo = function(e) {
for (var t = [].concat(e), o = this.checkLaiziNum(t), n = this.getCardsWtipLaizi(t), r = [], i = 1; i <= 26; i++) r[i] = 0;
r[170] = 0;
r[180] = 0;
r[190] = 0;
n.forEach(function(e) {
r[e]++;
});
return {
laiNum: o,
cleanCards: n,
cardsCountArr: r
};
};
e.getTipCardsInfo_tonghua = function(e) {
for (var t = [].concat(e), o = this.checkLaiziNum_tonghua(t), n = this.getCardsWtipLaizi(t), r = [], i = 1; i <= 26; i++) r[i] = 0;
r[170] = 0;
r[180] = 0;
r[190] = 0;
n.forEach(function(e) {
r[e]++;
});
return {
laiNum: o,
cleanCards: n,
cardsCountArr: r
};
};
e.getCardsWtipLaizi = function(e) {
for (var t = [].concat(e), o = t.length - 1; o >= 0; o--) this.isLaizi(t[o]) && t.splice(o, 1)[0];
return this.transCards(t);
};
e.isAllEqual = function(e) {
var t = new Set(e);
return 1 === Array.from(t).length;
};
e.getCardsInfo = function(e) {
for (var t = [].concat(e), o = this.checkLaiziNum(t), n = this.getCardsWithoutLaizi(t), r = [], i = 1; i <= 26; i++) r[i] = 0;
r[170] = 0;
r[180] = 0;
r[190] = 0;
n.forEach(function(e) {
r[e]++;
});
return {
laiNum: o,
cleanCards: n,
cardsCountArr: r
};
};
e.getAllPosiblesOfShunzi = function(e, t) {
var o = this.getCardsInfo(e), n = o.laiNum, r = o.cleanCards;
r.sort(function(e, t) {
return e - t;
});
var i = o.cardsCountArr, a = [], s = r[0], l = r[r.length - 1], c = s - n, u = l + n;
c <= 3 && (c = 3);
u >= 14 && (u = 14);
for (var d = function(o) {
for (var r = 0, s = [], l = 0; l < e.length; l++) {
var u = o + l;
if (0 === i[u]) {
r++;
s.push(0);
} else s.push(u);
}
if (0 === r) s[0] > t && a.push(s); else if (r <= n) {
var d = [];
s.forEach(function(e, t) {
if (0 !== e) d.push(e); else {
var o = d[d.length - 1];
o ? d.push(o + 1) : d.push(c);
}
});
d[0] > t && a.push(d);
}
}, p = c; p <= u; p++) d(p);
return a;
};
e.getAllPosiblesOfLiandui = function(e, t) {
for (var o = this.getCardsInfo(e), n = o.cleanCards, r = o.cardsCountArr, i = [], a = [], s = 0, l = r.length; s < l; s++) {
r[s] > 0 && a.push(s);
s > 0 && s < l - 1 && 0 == r[s] && r[s - 1] > 0 && r[s + 1] > 0 && a.push(s);
}
var c = n[0], u = n[n.length - 1];
if (a.length < e.length / 2) if (3 == c) {
a.push(u + 1);
i.push(a);
} else if (14 == n[n.length - 1]) {
a.unshift(c - 1);
i.push(a);
} else {
var d = [].concat(a);
d.unshift(c - 1);
var p = [].concat(a);
p.push(u + 1);
i.push(d);
i.push(p);
} else i.push(a);
var f = [];
for (s = 0; s < i.length; s++) {
var h = i[s].concat(i[s]);
h.sort(function(e, t) {
return e - t;
});
f.push(h);
}
return f;
};
e.isSingle = function(e) {
return 1 == e.length && 190 != e[0];
};
e.isDuizi = function(e) {
if (2 != e.length) return !1;
var t = [].concat(e), o = this.getCardsInfo(t), n = o.cleanCards, i = o.laiNum;
if (2 == i) {
this.m_arariLaiziReplaceValue[0] = [ 10 * r.default.gameInfoGD.m_iLaiziValue, 10 * r.default.gameInfoGD.m_iLaiziValue ];
return !0;
}
for (var a = 0, s = 0; s < n.length; s++) {
var l = n[s];
this.isLaizi(l) || (a = l);
}
if (1 == i && (170 == n[0] || 180 == n[0])) return !1;
1 == i && (this.m_arariLaiziReplaceValue[0] = [ 10 * a ]);
return 2 === e.length && 1 === i || this.isAllEqual(e);
};
e.countOccurrences = function(e, t) {
return e.filter(function(e) {
return e === t;
}).length;
};
e.isHuoJian = function(e) {
if (4 != e.length) return !1;
var t = this.getCardsInfo(e).cleanCards;
if (4 != t.length) return !1;
var o = this.countOccurrences(t, 170), n = this.countOccurrences(t, 180);
return 2 == o && 2 == n;
};
e.isShunzi = function(e, t) {
void 0 === t && (t = 0);
var o = e.length;
if (5 != o) return !1;
if (t + o - 1 == 14) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, a = n.laiNum;
if (5 == a && 5 == o) return !1;
var s = n.cardsCountArr, l = r[0], c = r[r.length - 1], u = 0;
r.forEach(function(e) {
u += e;
});
if (14 == c && u <= 28) {
l = 1;
c = r[r.length - 2];
}
if (c - l + 1 > o || l <= t) return !1;
for (var d = 0; d < r.length; d++) if (r[d] === r[d + 1]) return !1;
if (a > 0) {
var p = [];
for (d = l; d <= c; d++) {
var f = s[d];
1 == d && (f = s[14]);
if (0 === f) {
if (0 == a) return !1;
a--;
p.push(10 * d);
}
}
if (0 == a) {
this.m_arariLaiziReplaceValue.push(p);
this.m_ariChooseType.push(i.ShunZi);
} else {
if (!(0 < a)) return !1;
var h = [];
if (2 == l || l - t == 1) {
for (var m = 0; m < a; m++) h.push(10 * (c + m + 1));
this.m_arariLaiziReplaceValue.push(p.concat(h));
this.m_ariChooseType.push(i.ShunZi);
} else if (14 == c) {
for (m = 0; m < a; m++) h.push(10 * (l - m - 1));
this.m_arariLaiziReplaceValue.push(p.concat(h));
this.m_ariChooseType.push(i.ShunZi);
} else {
for (var g = c, y = a; y > 0 && ++g <= 14; y--) h.push(10 * g);
if (y > 0) {
g = l;
for (;y > 0; y--) {
g--;
h.push(10 * g);
}
}
this.m_arariLaiziReplaceValue.push(p.concat(h));
this.m_ariChooseType.push(i.TongHuaShun);
}
}
return !0;
}
return !0;
};
e.isTongHuaShunzi = function(e, t) {
void 0 === t && (t = 0);
var o = e.length;
if (5 != o) return !1;
var n = this.getCardsInfo(e), a = n.cleanCards, s = n.laiNum, l = n.cardsCountArr, c = a[0], u = a[a.length - 1], d = 0;
a.forEach(function(e) {
d += e;
});
if (14 == u && d <= 28) {
c = 1;
u = a[a.length - 2];
}
var p = r.default.gameInfoGD.bottomCard + 3, f = this.cur_oneHandCrad;
f = f.filter(function(e) {
return e != p;
});
for (var h = 0; h < f.length; h++) {
if (this._color(f[h]) != this._color(f[h + 1]) && h != f.length - 1) return !1;
}
if (u - c + 1 > o || c <= t) return !1;
for (h = 0; h < a.length; h++) if (a[h] === a[h + 1]) return !1;
if (s > 0) {
var m = [];
for (h = c; h <= u; h++) {
var g = l[h];
1 == h && (g = l[14]);
if (0 === g) {
if (0 == s) return !1;
s--;
m.push(10 * h);
}
}
if (0 == s) {
this.m_arariLaiziReplaceValue.push(m);
this.m_ariChooseType.push(i.TongHuaShun);
} else {
if (!(0 < s)) return !1;
var y = [];
if (2 == c || c - t == 1) {
for (var _ = 0; _ < s; _++) y.push(10 * (u + _ + 1));
this.m_arariLaiziReplaceValue.push(m.concat(y));
this.m_ariChooseType.push(i.TongHuaShun);
} else if (14 == u) {
for (_ = 0; _ < s; _++) y.push(10 * (c - _ - 1));
this.m_arariLaiziReplaceValue.push(m.concat(y));
this.m_ariChooseType.push(i.TongHuaShun);
} else {
for (var v = u, C = s; C > 0 && ++v <= 14; C--) y.push(10 * v);
if (C > 0) {
v = c;
for (;C > 0; C--) {
v--;
y.push(10 * v);
}
}
this.m_arariLaiziReplaceValue.push(m.concat(y));
this.m_ariChooseType.push(i.TongHuaShun);
}
}
return !0;
}
return !0;
};
e.isLiandui = function(e, t) {
void 0 === t && (t = 0);
var n = e.length;
if (6 !== n) return !1;
if (t + n / 2 - 1 == 14) return !1;
var r = this.getCardsInfo(e), a = r.cleanCards, s = r.laiNum, l = r.cardsCountArr, c = a[0], u = a[a.length - 1], d = 0;
a.forEach(function(e) {
d += e;
});
if (14 == u && d <= 38) {
c = 1;
u = a[a.length - 3];
}
if (a.includes(o.GD_DaWang) || a.includes(o.GD_XiaoWang)) return !1;
if (c <= t) return !1;
if (u - c + 1 > n / 2) return !1;
for (var p = [], f = c; f <= u; f++) {
var h = l[f];
1 == f && (h = l[14]);
if (h > 2) return !1;
if (0 == h) {
s -= 2;
p.push(10 * f, 10 * f);
} else if (1 == h) {
s--;
p.push(10 * f);
}
}
var m = [];
if (0 == s && a.length < n) {
this.m_arariLaiziReplaceValue.push(p);
this.m_ariChooseType.push(i.LianDui);
}
if (s > 0) {
var g = c, y = s, _ = t + 1;
0 == t && (_ = 2);
var v = !1;
if (g > _) {
for (g = c - 1; g >= _; g--) {
m.push(10 * g, 10 * g);
if (0 == (y -= 2)) break;
}
g = u;
for (;y > 0; ) {
g++;
m.push(10 * g, 10 * g);
y -= 2;
}
this.m_arariLaiziReplaceValue.push(p.concat(m));
this.m_ariChooseType.push(i.LianDui);
v = !0;
}
var C = s;
m = [];
for (g = u + 1; g <= 14; g++) {
m.push(10 * g, 10 * g);
if (0 == (C -= 2)) break;
}
g = c;
for (;C > 0; ) {
g--;
m.push(10 * g, 10 * g);
C -= 2;
}
v ? this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, p.concat(m)) : this.m_arariLaiziReplaceValue.push(p.concat(m));
this.m_ariChooseType.push(i.LianDui);
}
return !0;
};
e.isThree = function(e) {
if (3 != e.length) return !1;
var t = this.getCardsInfo(e), n = t.cleanCards, i = n[0], a = n[n.length - 1], s = t.laiNum, l = t.cardsCountArr;
if (3 == s) {
this.m_arariLaiziReplaceValue[0] = [ 10 * r.default.gameInfoGD.m_iLaiziValue, 10 * r.default.gameInfoGD.m_iLaiziValue, 10 * r.default.gameInfoGD.m_iLaiziValue ];
return !0;
}
if (2 == s) {
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return !0;
}
if (1 == s) {
if (i == a) {
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return !0;
}
return !1;
}
return i === a && 3 == l[i];
};
e.isThreeTwo = function(e, t) {
void 0 === t && (t = 0);
if (5 != e.length) return !1;
var n = this.getCardsInfo(e), a = n.cleanCards, s = n.laiNum;
if (5 == s) return !1;
var l = a[0], c = a[a.length - 1];
if (c == o.GD_DaWang && l == o.GD_XiaoWang) return !1;
if (l == r.default.gameInfoGD.m_iLaiziValue || c == o.GD_DaWang || c == o.GD_XiaoWang) {
var u = c;
c = l;
l = u;
}
if (t == r.default.gameInfoGD.m_iLaiziValue) return !1;
var d = n.cardsCountArr;
if (3 == d[l] && 2 == d[c] || 3 == d[c] && 2 == d[l]) return !0;
if (4 == d[l] || 4 == d[c]) return !1;
if (s > 0) {
if (l != c && d[l] + d[c] + s != 5) return !1;
var p = t + 1;
if (0 == t) {
p = 2;
4;
}
if (2 == s) {
if (l == c) {
this.m_arariLaiziReplaceValue.push([ 10 * r.default.gameInfoGD.m_iLaiziValue, 10 * r.default.gameInfoGD.m_iLaiziValue ]);
this.m_ariChooseType.push(i.ThreeTwo);
return !0;
}
if (p > c && c != r.default.gameInfoGD.m_iLaiziValue) return !1;
if (p > l) {
2 == d[c] && c != o.GD_DaWang && c != o.GD_XiaoWang ? this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * l ]) : this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ]);
this.m_ariChooseType.push(i.ThreeTwo);
} else {
if (2 == d[l]) l == o.GD_XiaoWang || l == o.GD_DaWang ? this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ]) : 2 == d[l] && this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ], [ 10 * l, 10 * c ]); else {
if (l == o.GD_XiaoWang || l == o.GD_DaWang) return !1;
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * c ], [ 10 * l, 10 * l ]);
}
this.m_ariChooseType.push(i.ThreeTwo, i.ThreeTwo);
}
} else if (1 == s) {
if (p > c && c != r.default.gameInfoGD.m_iLaiziValue) return !1;
if (3 == d[l]) {
if (p > l) return !1;
if (c == o.GD_DaWang || c == o.GD_XiaoWang) return !1;
this.m_arariLaiziReplaceValue.push([ 10 * c ]);
this.m_ariChooseType.push(i.ThreeTwo);
} else if (3 == d[c]) {
if (l == o.GD_DaWang || l == o.GD_XiaoWang) return !1;
this.m_arariLaiziReplaceValue.push([ 10 * l ]);
this.m_ariChooseType.push(i.ThreeTwo);
} else if (p > l) if (c == o.GD_DaWang || c == o.GD_XiaoWang) ; else {
this.m_arariLaiziReplaceValue.push([ 10 * c ]);
this.m_ariChooseType.push(i.ThreeTwo);
} else if (l == o.GD_DaWang || l == o.GD_XiaoWang) {
this.m_arariLaiziReplaceValue.push([ 10 * c ]);
this.m_ariChooseType.push(i.ThreeTwo, i.ThreeTwo);
} else {
this.m_arariLaiziReplaceValue.push([ 10 * c ], [ 10 * l ]);
this.m_ariChooseType.push(i.ThreeTwo, i.ThreeTwo);
}
}
return !0;
}
return !1;
};
e.isFeiJi = function(e, t) {
void 0 === t && (t = 0);
var n = e.length;
if (6 != n) return !1;
if (t + n / 3 - 1 == 14) return !1;
var r = this.getCardsInfo(e), a = r.cleanCards, s = r.cardsCountArr;
if (a.includes(o.GD_DaWang) || a.includes(o.GD_XiaoWang)) return !1;
var l = a[0], c = a[a.length - 1], u = r.laiNum, d = 0;
a.forEach(function(e) {
d += e;
});
if (14 == c && d <= 48) {
l = 1;
c = a[a.length - 4];
}
if (14 == c && 2 == l) {
l = 1;
c = a[a.length - 4];
}
if (l <= t) return !1;
if (c - l + 1 > n / 3) return !1;
for (var p = [], f = u, h = l; h <= c; h++) {
var m = s[h];
1 == h && (m = s[14]);
if (m > 3) return !1;
if (0 == m) {
f -= 3;
p.push(10 * h, 10 * h, 10 * h);
} else if (1 == m) {
f -= 2;
p.push(10 * h, 10 * h);
} else if (2 == m) {
f--;
p.push(10 * h);
}
}
if (f > 0) {
var g = [], y = t + 1;
0 == t && (y = 3);
var _ = !1, v = l - 1;
if (v >= y) {
g.push(10 * v, 10 * v, 10 * v);
this.m_arariLaiziReplaceValue.push(p.concat(g));
this.m_ariChooseType.push(i.FeiJi);
_ = !0;
}
(g = []).push(10 * (v = c + 1), 10 * v, 10 * v);
_ ? this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, p.concat(g)) : this.m_arariLaiziReplaceValue.push(p.concat(g));
this.m_ariChooseType.push(i.FeiJi);
} else if (u > 0) {
this.m_arariLaiziReplaceValue.push(p);
this.m_ariChooseType.push(i.FeiJi);
}
return !0;
};
e.isSiBomb = function(e, t) {
void 0 === t && (t = 0);
if (4 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.isWuBomb = function(e, t) {
void 0 === t && (t = 0);
if (5 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.isLiuBomb = function(e, t) {
void 0 === t && (t = 0);
if (6 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.isQiBomb = function(e, t) {
void 0 === t && (t = 0);
if (7 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.isBaBomb = function(e, t) {
void 0 === t && (t = 0);
if (8 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.isJiuBomb = function(e, t) {
void 0 === t && (t = 0);
if (9 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.isShiBomb = function(e, t) {
void 0 === t && (t = 0);
if (10 != e.length) return !1;
var n = this.getCardsInfo(e), r = n.cleanCards, i = r[0], a = r[r.length - 1], s = n.laiNum;
n.cardsCountArr;
if (a == o.GD_DaWang || a == o.GD_XiaoWang) return !1;
if (2 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return this.isAllEqual(r);
}
} else if (1 == s && i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return this.isAllEqual(r);
}
return this.isAllEqual(r);
};
e.sortDesc = function(e, t) {
var o = this;
void 0 === t && (t = !1);
var n = e || [];
n.sort(function(e, n) {
return o.compare(e, n, t);
});
return n;
};
e.compare = function(e, t, n) {
void 0 === n && (n = !1);
var i = this.value(e), a = this.value(t), s = r.default.gameInfoGD.m_iLaiziValue;
if (i !== a) {
1 == s && (s = 14);
return a == o.GD_DaWang ? a : i == o.GD_DaWang ? -i : a == o.GD_XiaoWang ? a : i == o.GD_XiaoWang ? -i : a == s ? a : i == s ? -i : a - i;
}
if (n) {
var l = this._color(e), c = this._color(t);
if (l !== c) return c - l;
}
return 0;
};
e.sortPutCards = function(e) {
var t = this;
e.sort(function(e, o) {
var n = t.value(e), r = t.value(o);
if (n !== r) return r - n;
var i = t._color(e), a = t._color(o);
return i !== a ? a - i : 0;
});
return e;
};
e.ArrayReplaceLaiziCards = function(e, t) {
if (0 == this.m_arariLaiziReplaceValue.length) return e;
for (var o = 0, n = e.length - 1; n >= 0; n--) if (190 == e[n] || this.isLaizi(e[n])) {
var i = 0;
190 == e[n] && (i += 5);
o < this.m_arariLaiziReplaceValue[t].length ? e[n] = this.m_arariLaiziReplaceValue[t][o++] : 190 == e[n] && 0 != r.default.gameInfoGD.m_iLaiziValue && (e[n] = 10 * r.default.gameInfoGD.m_iLaiziValue);
14 == Math.floor(e[n] / 10) && (e[n] = 10);
e[n] += i;
}
return e;
};
e.MainAuxiliaryOrder = function(e, t) {
switch (e) {
case 3:
case 15:
if (1 == Math.floor(t[0] / 10) && Math.floor(t[4] / 10) >= 10) {
t.push(t[0]);
t.splice(0, 1);
}
break;

case 4:
if (1 == Math.floor(t[0] / 10) && Math.floor(t[5] / 10) >= 10) {
t.push(t[0]);
t.splice(0, 1);
}
if (1 == Math.floor(t[0] / 10) && Math.floor(t[4] / 10) >= 10) {
t.push(t[0]);
t.splice(0, 1);
}
break;

case 6:
if (1 == Math.floor(t[0] / 10) && Math.floor(t[3] / 10) >= 10) {
t.push(t[0]);
t.splice(0, 1);
}
if (1 == Math.floor(t[0] / 10) && Math.floor(t[3] / 10) >= 10) {
t.push(t[0]);
t.splice(0, 1);
}
if (1 == Math.floor(t[0] / 10) && Math.floor(t[3] / 10) >= 10) {
t.push(t[0]);
t.splice(0, 1);
}
break;

case 7:
if (Math.floor(t[0] / 10) != Math.floor(t[2] / 10)) if (Math.floor(t[0] / 10) == r.default.gameInfoGD.m_iLaiziValue && t[0] % 10 == 3) ; else {
t.push(t[0], t[1]);
t.splice(0, 2);
}
break;

case 8:
var o = [], n = t.length, i = n / 4;
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[2] / 10)) {
t.push(t[0], t[1], t[2]);
t.splice(0, 3);
}
for (var a = n - 1; a >= 2; a--) if (2 != Math.floor(t[a] / 10) && Math.floor(t[a] / 10) == Math.floor(t[a - 2] / 10)) {
if (a >= 3 && 0 == i && Math.floor(t[a] / 10) == Math.floor(t[a - 3] / 10)) {
cc.log("放到后面", i);
break;
}
o.unshift(t[a], t[a - 1], t[a - 2]);
t.splice(a - 2, 3);
a -= 2;
i--;
}
t = o.concat(t);
break;

case 10:
o = [];
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[2] / 10) && 1 != Math.floor(t[3] / 10)) {
t.push(t[0], t[1], t[2]);
t.splice(0, 3);
}
for (a = t.length - 1; a >= 2; a--) if (a >= 3 && Math.floor(t[a] / 10) == Math.floor(t[a - 3] / 10)) a -= 3; else if (2 != Math.floor(t[a] / 10) && Math.floor(t[a] / 10) == Math.floor(t[a - 2] / 10)) {
o.unshift(t[a], t[a - 1], t[a - 2]);
t.splice(a - 2, 3);
a -= 2;
}
t = o.concat(t);
break;

case 12:
case 14:
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[3] / 10) || 2 == Math.floor(t[0] / 10) && 2 == Math.floor(t[3] / 10)) break;
var s = [];
for (a = t.length - 1; a >= 4; a--) if (Math.floor(t[a] / 10) == Math.floor(t[a - 3] / 10)) {
s = t.splice(a - 3, 4);
t.unshift(s[3], s[2], s[1], s[0]);
break;
}
}
return t;
};
e.compareToPut = function(e, t, n) {
if (n == i.KINGBOMB) return !1;
if (e.length != t.length && 2 != e.length && e.length < 4) return !1;
var a = this.getMainCardValue(t, n), s = this.oneHandType(e, n, a);
if (s == i.KINGBOMB) return 100;
if (s[0] === i.Error) return -1;
var l = e.concat([]);
if (1 == this.m_arariLaiziReplaceValue.length) {
(l = this.ArrayReplaceLaiziCards(l, 0)).sort(function(e, t) {
return e - t;
});
l = this.MainAuxiliaryOrder(s, l);
} else if (s == i.FeiJiOne || s == i.FeiJiTwo) {
l.sort(function(e, t) {
return e - t;
});
l = this.MainAuxiliaryOrder(s, l);
}
if (this.m_arariLaiziReplaceValue.length > 1 && s != i.ThreeTwo) return 10;
var c = this.getMainCardValue(l, s), u = this.transCards(e);
return s == n ? n == i.TongHuaShun ? u.length < t.length ? -1 : c <= a && u.length == t.length ? -1 : 10 : c == Math.floor(r.default.gameInfoGD.bottomCard / 10) && n != i.LianDui && n != i.ShunZi && n != i.FeiJi && a != o.GD_XiaoWang && a != o.GD_DaWang && a != Math.floor(r.default.gameInfoGD.bottomCard / 10) ? 10 : a == Math.floor(r.default.gameInfoGD.bottomCard / 10) && n != i.LianDui && n != i.ShunZi && n != i.FeiJi ? c == o.GD_XiaoWang || c == o.GD_DaWang ? 10 : -1 : e.length === t.length ? c - a : -1 : n != i.SiBomb && n != i.WuBomb || s != i.TongHuaShun ? n == i.SiBomb || n == i.WuBomb || n == i.LiuBomb || n == i.QiBomb || n == i.BaBomb || n == i.JiuBomb ? this.getBombMax(u, t, n) : 4 == u.length && this.isSiBomb(u) && n != i.TongHuaShun ? 10 : 5 == e.length && this.isWuBomb(u) && n != i.TongHuaShun ? 10 : 6 == e.length && this.isLiuBomb(u) ? 10 : 7 == e.length && this.isQiBomb(u) ? 10 : 8 == e.length && this.isBaBomb(u) ? 10 : 9 == e.length && this.isJiuBomb(u) ? 10 : 10 == e.length && this.isShiBomb(u) ? 10 : e.length >= 5 && this.isTongHuaShunzi(u) ? 10 : -1 : 10;
};
e.getBombMax = function(e, t, o) {
if (e.length < t.length) return -1;
if (e.length == t.length) console.log("正常不会出现在这里！！！！！！！！"); else {
var n = this.getCardsWithoutLaizi(e);
if (this.isAllEqual(n)) return 10;
}
};
e.getMainCardValue = function(e, t) {
if (0 == t) return 0;
var o = 190, n = 0;
if (t == i.ThreeTwo || t == i.FourOne) {
return this.value(e[2]);
}
if (t == i.FeiJiOne || t == i.FeiJiTwo) {
return this.value(e[0]);
}
if (t == i.LianDui || t == i.ShunZi || t == i.FeiJi || t == i.TongHuaShun) {
for (var r = 0; r < e.length; r++) {
o > (a = this.value(e[r])) && (o = a);
}
if (2 == o) {
for (r = 0; r < e.length; r++) {
n < (a = this.value(e[r])) && (n = a);
}
if (14 == n) return o = 1;
}
return o;
}
for (r = 0; r < e.length; r++) {
var a;
o > (a = this.value(e[r])) && (o = a);
}
return o;
};
e.isValid = function(e, t) {
return this.oneHandType(e) !== i.Error;
};
e.oneHandType = function(e, t, o) {
void 0 === t && (t = 0);
void 0 === o && (o = 0);
this.cur_oneHandCrad = e;
this.m_ariChooseType = [];
this.m_arariLaiziReplaceValue = [];
var n = this.transCards(e), r = n.length;
if (1 === r && this.isSingle(n)) return i.Single;
if (2 === r && this.isDuizi(n)) return i.Double;
if (3 === r && this.isThree(n)) return i.Three;
if (r >= 4) {
var a = this.isSiBomb(n), s = this.isWuBomb(n), l = this.isLiuBomb(n), c = this.isQiBomb(n), u = this.isBaBomb(n), d = this.isJiuBomb(n), p = this.isShiBomb(n), f = this.isTongHuaShunzi(n);
if (this.isHuoJian(n)) return i.KINGBOMB;
if (a) return i.SiBomb;
if (s) return i.WuBomb;
if (l) return i.LiuBomb;
if (c) return i.QiBomb;
if (u) return i.BaBomb;
if (d) return i.JiuBomb;
if (p) return i.ShiBomb;
if (f) return i.TongHuaShun;
if (t > 0) switch (t) {
case i.ShunZi:
return this.isShunzi(n, o) ? i.ShunZi : i.Error;

case i.ThreeTwo:
return this.isThreeTwo(n, o) ? i.ThreeTwo : i.Error;

case i.LianDui:
return this.isLiandui(n, o) ? i.LianDui : i.Error;

case i.FeiJi:
return this.isFeiJi(n, o) ? i.FeiJi : i.Error;
}
var h;
h = this.isThreeTwo(n);
var m = this.isShunzi(n), g = this.isFeiJi(n);
if (this.isLiandui(n)) return i.LianDui;
if (m) return i.ShunZi;
if (g) return i.FeiJi;
!1;
!1;
if (h) return i.ThreeTwo;
}
return i.Error;
};
e.handIsTongHua = function(e) {
this.getHandCardsInfo(e);
};
e.checkHandLaiziNum = function(e) {
var t = this, o = 0;
e.length > 1 && e.forEach(function(e) {
var n = t._color(e);
t.value(e) == r.default.gameInfoGD.m_iLaiziValue && 3 == n && t.isLaizi(e) && o++;
});
return o;
};
e.getHandCardsWithoutLaizi = function(e) {
for (var t = [].concat(e), o = t.length - 1; o >= 0; o--) this.isLaizi(t[o]) && t.splice(o, 1)[0];
return t;
};
e.getHandCardsInfo = function(e) {
for (var t = [].concat(e), o = this.checkHandLaiziNum(t), n = this.getHandCardsWithoutLaizi(t), r = [], i = [], a = [], s = [], l = 0; l < n.length; l++) {
var c = n[l], u = this._color(c);
1 == u && a.push(c);
2 == u && s.push(c);
3 == u && i.push(c);
4 == u && r.push(c);
}
return {
laiNum: o,
HT: r,
RT: i,
FK: a,
MH: s
};
};
e.tonghuaTip = function(e, t, o, n) {
return l._tipTongHuaShun(e, t, o, n);
};
e.lipai = function(e) {
return l.lipai(e);
};
e.GDTip = function(e, t, o, n, r) {
void 0 === n && (n = !1);
void 0 === r && (r = !1);
var a = this._cards2CountArr(e);
return o === i.Error ? l.tipNull(e, a) : o === i.Single ? l.tipSingle(e, t, a) : o === i.Double ? l.tipDouble(e, t, a) : o === i.ShunZi ? l.tipShunZi(e, t, t.length, a) : o === i.LianDui ? l.tipLianDui(e, t, t.length / 2, a) : o === i.Three ? l.tipThree(e, t, a) : o === i.FeiJi ? l.tipFeiJi(e, t, t.length, a) : o === i.FeiJiOne ? l.tipFeiJiOne(e, t, t.length, a) : o === i.ThreeTwo ? l.tipThreeTwo(e, t, a) : o === i.FeiJiTwo ? l.tipFeiJiTwo(e, t, t.length, a) : o === i.FourOne ? l.tipFourOne(e, t, a) : o === i.SiBomb ? l.tipHardBomb(e, t, a, i.SiBomb) : o === i.WuBomb ? l.tipHardBomb(e, t, a, i.WuBomb) : o === i.LiuBomb ? l.tipHardBomb(e, t, a, i.LiuBomb) : o === i.QiBomb ? l.tipHardBomb(e, t, a, i.QiBomb) : o === i.BaBomb ? l.tipHardBomb(e, t, a, i.BaBomb) : o === i.JiuBomb ? l.tipHardBomb(e, t, a, i.JiuBomb) : o === i.ShiBomb ? l.tipHardBomb(e, t, a, i.ShiBomb) : o === i.TongHuaShun ? l.tipHardBomb(e, t, a, i.TongHuaShun) : o === i.KINGBOMB ? l.tipKingBomb(e, t, a) : {
tips: [],
invalids: []
};
};
return e;
}();
o.default = a;
var s = require("./GDMyRoundTipCtr"), l = function() {
function e() {}
e.getIndexInValue = function(e, t) {
for (var o = 0; o < t.length; o++) if (t[o].index == e) return t[o].value;
};
e._tipSingle = function(e, t, n) {
var i = this;
void 0 === n && (n = 0);
for (var l = [], c = r.default.myAbsolutePos(), u = r.default.gameInfoGD.siteInfos.get(c).handCards, d = [], p = 0; p < u.length; p++) {
var f = {
value: u[p],
index: p
};
d.push(f);
}
l[0] = [];
l[1] = [];
l[2] = [];
l[3] = [];
l[4] = [];
l[5] = [];
l[6] = [];
l[7] = [];
l[8] = [];
l[9] = [];
var h = [];
n == r.default.gameInfoGD.m_iLaiziValue && (n = 160);
JSON.parse(JSON.stringify(e)).forEach(function(e) {
if (a.isLaizi(i.getIndexInValue(e.index, d))) 0 == h.length && n != o.GD_DaWang && n != o.GD_XiaoWang && 0 != n && 160 != n && h.push([ e ]); else if (e.value == r.default.gameInfoGD.m_iLaiziValue && 160 != n && n != o.GD_DaWang && n != o.GD_XiaoWang || e.value > n) {
var s = t[e.value], c = l[s - 1].length, u = l[s - 1][c - 1];
if (!u || u[0].value !== e.value) {
4 == s && (e.index = e.index + 3);
l[s - 1].push([ e ]);
}
}
});
h.length > 0 && s.SetTipIndex(1);
return h.concat(l[0].reverse()).concat(l[1].reverse()).concat(l[2].reverse()).concat(l[3].reverse()).concat(l[4].reverse()).concat(l[3].reverse()).concat(l[5].reverse()).concat(l[6].reverse()).concat(l[7].reverse()).concat(l[8].reverse()).concat(l[9].reverse());
};
e._tipDouble = function(e, t, o, n) {
void 0 === n && (n = 0);
var i = [], a = [];
n == r.default.gameInfoGD.m_iLaiziValue && (n = 160);
e.forEach(function(t, s) {
if (t.value > n || t.value == r.default.gameInfoGD.m_iLaiziValue && 160 != n && 170 != n && 180 != n) {
var l = o[t.value];
if (2 === l) {
var c = i.length;
(u = i[c - 1]) && u[0].value === t.value || i.push([ t, e[s + 1] ]);
}
if (3 == l) {
var u;
c = a.length;
(u = a[c - 1]) && u[0].value === t.value || a.push([ t, e[s + 1] ]);
}
}
});
var l = [];
if (0 != n && t.length > 0) {
for (var c = this._tipSingle(e, o, n), u = 0; u < c.length; u++) if (c[u][0].value <= 14) {
c[u].push(t[0]);
l.push(c[u]);
}
t >= 2 && 0 != n && l.push([ t[0], t[1] ]);
s.SetTipIndex(l.length);
}
return l.concat(i.reverse()).concat(a.reverse()).concat([].reverse());
};
e._tipThree = function(e, t, o, n) {
void 0 === n && (n = 0);
var i = [], a = [].concat(e), l = t.length, c = [], u = [], d = [];
if (n == r.default.gameInfoGD.m_iLaiziValue) return [];
for (var p = n + 1; p <= 14; p++) {
var f = o[y = p], h = this._getCardsIndex(a, y);
3 == f && i.push([ e[h[0]], e[h[1]], e[h[2]] ]);
n > 0 && (2 == f && l >= 1 ? d.push([ e[h[0]], e[h[1]], t[0] ]) : 1 == f && l >= 2 && u.push([ e[h[0]], t[0], t[1] ]));
}
if (i.length > 1) for (var m = 0; m < i.length; m++) {
if (i[m][0].value == r.default.gameInfoGD.m_iLaiziValue) {
var g = i.splice(m, 1)[0];
i.push(g);
break;
}
}
if (n + 1 > Math.floor(r.default.gameInfoGD.bottomCard / 10) && n != Math.floor(r.default.gameInfoGD.bottomCard / 10)) {
var y, _ = o[y = Math.floor(r.default.gameInfoGD.bottomCard / 10)];
h = this._getCardsIndex(a, y);
3 == _ ? i.push([ e[h[0]], e[h[1]], e[h[2]] ]) : 4 == _ && c.push([ e[h[0]], e[h[1]], e[h[2]] ]);
n > 0 && (2 == _ && l >= 1 ? d.push([ e[h[0]], e[h[1]], t[0] ]) : 1 == _ && l >= 2 && u.push([ e[h[0]], t[0], t[1] ]));
}
var v = [];
v = i.concat(c);
if (n > 0) {
l >= 3 && r.default.gameInfoGD.m_iLaiziValue > n && u.push([ t[0], t[1], t[2] ]);
v = d.concat(u).concat(v);
s.SetTipIndex(u.length + d.length);
}
return v;
};
e._tipThreeOne = function(e, t, o, n) {
var r = [];
if (e.length < 4) return r;
for (var i = this._tipThree(e, t, o, n), a = this._tipSingle(e, o), s = 0; s < i.length; s++) for (var l = [].concat(i[s]), c = 0; c < a.length; c++) if (a[c][0].value != i[s][0].value) {
l.push(a[c][0]);
r.push(l);
break;
}
return r;
};
e._tipThreeTwo = function(e, t, o, n) {
var r = [];
if (e.length < 5) return r;
for (var i = this._tipThree(e, t, o, n), a = this._tipDouble(e, t, o, 0), s = 0; s < i.length; s++) for (var l = [].concat(i[s]), c = 0; c < a.length; c++) if (a[c][0].value != i[s][0].value) {
l.push(a[c][0], a[c][1]);
r.push(l);
break;
}
return r;
};
e._tipShunzi = function(e, t, o, n, r, i) {
var a = this;
void 0 === i && (i = 1);
var l = [], c = [];
14 == n && (n = 1);
if (n + (r - 1) / i === 14) return [];
for (var u = [].concat(e), d = function(e) {
for (var n = [], i = 0, s = 0; s < r; s++) {
var d = e + s;
if (!(d > 14)) {
if (o[d] > 0) n.push(d); else {
i++;
n.push(0);
}
}
}
if (0 === i) {
var p = [];
n.forEach(function(e) {
var t = a._getCards(u, e);
p.push(t);
});
if (p.length === r) {
p.reverse();
l.push(p);
}
} else if (i <= t.length) {
var f = [], h = 0;
n.forEach(function(e) {
if (0 != e) {
var o = a._getCards(u, e);
f.push(o);
} else f.push(t[h++]);
});
if (f.length === r) {
f.reverse();
c.push(f);
}
}
}, p = n + 1; p <= 14; p++) d(p);
s.SetTipIndex(c.length);
return c.concat(l);
};
e._tipLiandui = function(e, t, o, n, r, i) {
void 0 === i && (i = 1);
var a = r / 2, l = [], c = [ [], [], [], [], [] ];
14 == n && (n = 1);
var u = t.length;
if (n + (a - 1) / i === 14) return [];
for (var d = n + 1; d <= 14; d++) {
for (var p = [], f = 0, h = 0; f < a; f++) {
var m = d + f, g = o[m];
if (m > 14) break;
var y = this._getCardsIndex(e, m);
if (g >= 2) {
p.push(e[y[0]]);
p.push(e[y[1]]);
}
if (1 === g) {
if (!(u - h > 0)) break;
p.push(e[y[0]]);
p.push(t[h++]);
}
if (0 === g) {
if (!(u - h > 1)) break;
p.push(t[h++]);
p.push(t[h++]);
}
}
f == a && (0 != h ? c[h - 1].push(p) : l.push(p));
}
for (var _ = [], v = 0; v < 5; v++) _ = _.concat(c[v]);
s.SetTipIndex(_.length);
return l.concat(_);
};
e.sortArrPai = function(e) {
for (var t = r.default.gameInfoGD.m_iLaiziValue, o = 0; o < e.length; o++) if (e[o][0].value == t) {
var n = e[o];
e.splice(o, 1);
e.push(n);
return e;
}
};
e._tipSoftBomb = function(e, t, n, i, a, s) {
void 0 === i && (i = 0);
void 0 === a && (a = !1);
void 0 === s && (s = !1);
var l = [], c = 0;
if (i == r.default.gameInfoGD.m_iLaiziValue && a) return [];
for (var u = 0; u < t.length; u++) {
var d = [];
switch (u) {
case 0:
d = this._tipThree(e, t, n);
for (var p = 0; p < d.length; p++) if (d[p][0].value > i) {
d[p].push(t[0]);
if (s) {
if (++c == t.length) {
l.push(d[p]);
break;
}
if (c > t.length) {
c--;
break;
}
}
l.push(d[p]);
} else {
var f = r.default.gameInfoGD.m_iLaiziValue;
if (d[p][0].value == f) {
d[p].push(t[0]);
if (s) {
if (++c == t.length) {
l.push(d[p]);
break;
}
if (c > t.length) {
c--;
break;
}
}
l.push(d[p]);
}
}
break;

case 1:
d = this._tipDouble(e, t, n);
for (p = 0; p < d.length && (d[p][0].value != o.GD_DaWang && d[p][0].value != o.GD_XiaoWang); p++) if (d[p][0].value > i) {
d[p].push(t[0], t[1]);
if (s) {
if ((c += 2) == t.length) {
l.push(d[p]);
break;
}
if (c > t.length) {
c -= 2;
break;
}
}
l.push(d[p]);
} else {
f = r.default.gameInfoGD.m_iLaiziValue;
if (d[p][0].value == f) {
d[p].push(t[0], t[1]);
if (s) {
if ((c += 2) == t.length) {
l.push(d[p]);
break;
}
if (c > t.length) {
c -= 2;
break;
}
}
l.push(d[p]);
}
}
}
}
s && l.push(c);
return l;
};
e._tipWuBomb = function(e, t, o, n, i) {
void 0 === n && (n = 0);
void 0 === i && (i = !1);
var a = [];
if (n == r.default.gameInfoGD.m_iLaiziValue && i) return [];
for (var s = 0; s < t.length; s++) {
var l = [];
switch (s) {
case 0:
l = this._tipHardBomb(e, t, o, 4);
for (var c = 0; c < l.length; c++) if (l[c][0].value > n) {
l[c].push(t[0]);
a.push(l[c]);
} else {
var u = r.default.gameInfoGD.m_iLaiziValue;
if (l[c][0].value == u) {
l[c].push(t[0]);
a.push(l[c]);
}
}
break;

case 1:
l = this._tipThree(e, t, o);
for (c = 0; c < l.length; c++) if (l[c][0].value > n) {
l[c].push(t[0], t[1]);
a.push(l[c]);
} else {
u = r.default.gameInfoGD.m_iLaiziValue;
if (l[c][0].value == u) {
l[c].push(t[0], t[1]);
a.push(l[c]);
}
}
}
}
return a;
};
e._tipLiuBomb = function(e, t, o, n, i, a) {
void 0 === n && (n = 0);
void 0 === i && (i = !1);
void 0 === a && (a = !1);
var s = [], l = 0;
if (n == r.default.gameInfoGD.m_iLaiziValue && i) return [];
for (var c = 0; c < t.length; c++) {
var u = [];
switch (c) {
case 0:
u = this._tipHardBomb(e, t, o, 5);
for (var d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
} else {
var p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
}
}
break;

case 1:
u = this._tipHardBomb(e, t, o, 4);
for (d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
} else {
p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
}
}
}
}
a && s.push(l);
return s;
};
e._tipQiBomb = function(e, t, o, n, i, a) {
void 0 === n && (n = 0);
void 0 === i && (i = !1);
void 0 === a && (a = !1);
var s = [], l = 0;
if (n == r.default.gameInfoGD.m_iLaiziValue && i) return [];
for (var c = 0; c < t.length; c++) {
var u = [];
switch (c) {
case 0:
u = this._tipHardBomb(e, t, o, 6);
for (var d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
} else {
var p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
}
}
break;

case 1:
u = this._tipHardBomb(e, t, o, 5);
for (d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
} else {
p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
}
}
}
}
a && s.push(l);
return s;
};
e._tipBaBomb = function(e, t, o, n, i, a) {
void 0 === n && (n = 0);
void 0 === i && (i = !1);
void 0 === a && (a = !1);
var s = [], l = 0;
if (n == r.default.gameInfoGD.m_iLaiziValue && i) return [];
for (var c = 0; c < t.length; c++) {
var u = [];
switch (c) {
case 0:
u = this._tipHardBomb(e, t, o, 7);
for (var d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
} else {
var p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
}
}
break;

case 1:
u = this._tipHardBomb(e, t, o, 6);
for (d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
} else {
p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
}
}
}
}
a && s.push(l);
return s;
};
e._tipJiuBomb = function(e, t, o, n, i, a) {
void 0 === n && (n = 0);
void 0 === i && (i = !1);
void 0 === a && (a = !1);
var s = [], l = 0;
if (n == r.default.gameInfoGD.m_iLaiziValue && i) return [];
for (var c = 0; c < t.length; c++) {
var u = [];
switch (c) {
case 0:
u = this._tipHardBomb(e, t, o, 8);
for (var d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
} else {
var p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
}
}
break;

case 1:
u = this._tipHardBomb(e, t, o, 7);
for (d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
} else {
p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
}
}
}
}
a && s.push(l);
return s;
};
e._tipShiBomb = function(e, t, o, n, i, a) {
void 0 === n && (n = 0);
void 0 === i && (i = !1);
void 0 === a && (a = !1);
var s = [], l = 0;
if (n == r.default.gameInfoGD.m_iLaiziValue && i) return [];
for (var c = 0; c < t.length; c++) {
var u = [];
switch (c) {
case 0:
u = this._tipHardBomb(e, t, o, 9);
for (var d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
} else {
var p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0]);
if (a) {
if (++l == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l--;
break;
}
}
s.push(u[d]);
}
}
break;

case 1:
u = this._tipHardBomb(e, t, o, 8);
for (d = 0; d < u.length; d++) if (u[d][0].value > n) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
} else {
p = r.default.gameInfoGD.m_iLaiziValue;
if (u[d][0].value == p) {
u[d].push(t[0], t[1]);
if (a) {
if ((l += 2) == t.length) {
s.push(u[d]);
break;
}
if (l > t.length) {
l -= 2;
break;
}
}
s.push(u[d]);
}
}
}
}
a && s.push(l);
return s;
};
e._tipHardBomb = function(e, t, o, n, i, a) {
void 0 === n && (n = 4);
void 0 === i && (i = 0);
void 0 === a && (a = !1);
var s = [];
t.length;
if (i == r.default.gameInfoGD.m_iLaiziValue && a) return [];
for (var l = i + 1; l <= 14; l++) {
var c = [], u = l, d = o[u];
if (u != r.default.gameInfoGD.m_iLaiziValue) {
var p = this._getCardsIndex(e, u);
if (d === n && 1 != u) for (var f = 0; f < n; f++) c.push(e[p[f]]);
c.length > 0 && s.push(c);
}
}
var h = r.default.gameInfoGD.m_iLaiziValue;
if (o[h] == n) {
for (p = this._getCardsIndex(e, h), c = [], f = 0; f < n; f++) c.push(e[p[f]]);
s.push(c);
}
return s;
};
e._tipTongHuaShun = function(e, t, o, i, a, s, l) {
var c = this;
void 0 === a && (a = 0);
void 0 === s && (s = 5);
void 0 === l && (l = 1);
var u = [], d = [];
14 == a && (a = 1);
if (a + (s - 1) / l === 14) return [];
o[1] = o[14];
for (var p = [].concat(e), f = [].concat(i), h = function(e) {
for (var n = [], r = 0, i = 0; i < s; i++) {
var a = e + i;
if (!(a > 14)) {
if (o[a] > 0) n.push(a); else {
r++;
n.push(0);
}
}
}
if (0 === r) {
var l = [];
n.forEach(function(e) {
1 == e && (e = 14);
var t = c._getCards(p, e);
l.push(t);
});
if (l.length === s) {
l.reverse();
u.push(l);
}
} else if (r <= t.length) {
var f = [], h = 0;
n.forEach(function(e) {
if (0 != e) {
var o = c._getCards(p, e);
f.push(o);
} else {
var n = c._getIndexCards(t[h++].index);
f.push(n[0]);
}
});
if (f.length === s) {
f.reverse();
d.push(f);
}
}
}, m = a + 1; m <= 14; m++) h(m);
var g = d.concat(u), y = [];
for (m = 0; m < g.length; m++) {
for (var _ = !1, v = !1, C = !1, b = !1, D = 0, S = 0, w = 0, O = 0, P = t.length, I = 0, R = 0; R < g[m].length; R++) {
var k = [];
if (g[m][R].value != 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
for (var j = this._getCardsNum(f, g[m][R].value), L = 0; L < j.length; L++) {
var U = this._color(j[L]);
k.push(U);
}
-1 == k.indexOf(n.Fang) && w++;
-1 == k.indexOf(n.Mei) && O++;
-1 == k.indexOf(n.Hei) && D++;
-1 == k.indexOf(n.Hong) && S++;
} else I++;
}
D + I <= P && (_ = !0);
S + I <= P && (v = !0);
O + I <= P && (b = !0);
w + I <= P && (C = !0);
if (_) {
var T = [], N = 0;
for (L = 0; L < g[m].length; L++) {
if ((x = g[m][L]).value != 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
var M = 10 * x.value + 4;
14 == x.value && (M = 14);
(G = this._getCards(f, M)) ? T.push(G) : N++;
} else T.push(x);
}
if (N > 0) {
var E = this._getLaiZiCards(N);
T = T.concat(E);
}
y.push(T);
}
if (C) {
for (T = [], N = 0, L = 0; L < g[m].length; L++) {
if ((x = g[m][L]).value != 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
M = 10 * x.value + 1;
14 == x.value && (M = 11);
(G = this._getCards(f, M)) ? T.push(G) : N++;
} else T.push(x);
}
if (N > 0) {
E = this._getLaiZiCards(N);
T = T.concat(E);
}
y.push(T);
}
if (v) {
for (T = [], N = 0, L = 0; L < g[m].length; L++) {
if ((x = g[m][L]).value != 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
M = 10 * x.value + 3;
14 == x.value && (M = 13);
(G = this._getCards(f, M)) ? T.push(G) : N++;
} else T.push(x);
}
if (N > 0) {
E = this._getLaiZiCards(N);
T = T.concat(E);
}
y.push(T);
}
if (b) {
for (T = [], N = 0, L = 0; L < g[m].length; L++) {
var x;
if ((x = g[m][L]).value != 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
var G;
M = 10 * x.value + 2;
14 == x.value && (M = 12);
(G = this._getCards(f, M)) ? T.push(G) : N++;
} else T.push(x);
}
if (N > 0) {
E = this._getLaiZiCards(N);
T = T.concat(E);
}
y.push(T);
}
}
return y;
};
e.lipai = function(e) {
for (var t = [], o = 0; o < e.length; o++) {
var n = {
value: a.value(e[o]),
index: o
};
t.push(n);
}
var r = a.getTipCardsInfo_tonghua(e).cardsCountArr, i = [], s = JSON.parse(JSON.stringify(t)), l = [];
for (o = 0; o < e.length; o++) {
n = {
value: e[o],
index: o
};
l.push(n);
}
var c = JSON.parse(JSON.stringify(l));
for (o = s.length - 1; o >= 0; o--) if (a.isLaizi(l[o].value)) {
n = {
value: s[o].value,
index: s[o].index
};
i.push(n);
s.splice(o, 1);
}
for (o = c.length - 1; o >= 0; o--) if (a.isLaizi(l[o].value)) {
n = {
value: c[o].value,
index: c[o].index
};
c.splice(o, 1);
}
var u = s, d = c, p = e, f = i, h = r, m = [], g = [], y = void 0;
for (o = 0; o < 5; o++) {
var _ = this._tipHardBomb(u, f, h, 4);
m = m.concat(_);
u = (y = this.splitlist(u, _, p, d)).newArray;
h = y.countArr;
p = y.cards;
d = y.cleanCards_laizi;
var v = this.sortths(u, f, h, d);
if (0 == v.length || 5 != v[0].length) break;
g = g.concat(v);
var C = this.getListLaizi(v[0]);
f.splice(0, C);
u = (y = this.splitlist(u, v, p, d)).newArray;
h = y.countArr;
p = y.cards;
d = y.cleanCards_laizi;
}
var b = [], D = [], S = this._tipKingBomb(u, f, h);
if (S) {
u = (y = this.splitlist(u, S, p)).newArray;
h = y.countArr;
p = y.cards;
D = D.concat(S);
}
var w = this._tipSoftBomb(u, f, h, 0, !1, !0);
if (w && w.length > 1) {
var O = w.pop();
f.splice(0, O);
m = m.concat(w);
u = (y = this.splitlist(u, w, p)).newArray;
h = y.countArr;
p = y.cards;
}
m = this.sortBombAry(m);
var P = this._tipLiuBomb(u, f, h, 0, !1, !0);
if (P && P.length > 1) {
O = P.pop();
f.splice(0, O);
b = b.concat(P);
u = (y = this.splitlist(u, P, p)).newArray;
h = y.countArr;
p = y.cards;
}
var I = this._tipHardBomb(u, f, h, 5);
if (I) {
g = g.concat(I);
u = (y = this.splitlist(u, I, p)).newArray;
h = y.countArr;
p = y.cards;
}
var R = this._tipQiBomb(u, f, h, 0, !1, !0);
if (R && R.length > 1) {
O = R.pop();
f.splice(0, O);
b = b.concat(R);
u = (y = this.splitlist(u, R, p)).newArray;
h = y.countArr;
p = y.cards;
}
var k = this._tipHardBomb(u, f, h, 6);
if (k) {
b = b.concat(k);
u = (y = this.splitlist(u, k, p)).newArray;
h = y.countArr;
p = y.cards;
}
var j = this._tipBaBomb(u, f, h, 0, !1, !0);
if (j && j.length > 1) {
O = j.pop();
f.splice(0, O);
b = b.concat(j);
u = (y = this.splitlist(u, j, p)).newArray;
h = y.countArr;
p = y.cards;
}
var L = this._tipHardBomb(u, f, h, 7);
if (L) {
b = b.concat(L);
u = (y = this.splitlist(u, L, p)).newArray;
h = y.countArr;
p = y.cards;
}
var U = this._tipShiBomb(u, f, h, 0, !1, !0);
if (U && U.length > 1) {
O = U.pop();
f.splice(0, O);
b = b.concat(U);
u = (y = this.splitlist(u, U, p)).newArray;
h = y.countArr;
p = y.cards;
}
var T = this._tipJiuBomb(u, f, h, 0, !1, !0);
if (T && T.length > 1) {
O = T.pop();
f.splice(0, O);
b = b.concat(T);
u = (y = this.splitlist(u, T, p)).newArray;
h = y.countArr;
p = y.cards;
}
var N = this._tipHardBomb(u, f, h, 8);
if (N) {
b = b.concat(N);
u = (y = this.splitlist(u, N, p)).newArray;
h = y.countArr;
p = y.cards;
}
var M = JSON.parse(JSON.stringify(b));
for (o = 0; o < b.length; o++) {
var E = b[o];
if (4 == E.length) {
m.push(E);
M.splice(o, 1);
}
}
for (var x = 0; x < f.length; x++) {
var G = f[x];
u.splice(G.index, 0, G);
}
return this.getHandcardAry(u, m, g, M, D, e);
};
e.sortBombAry = function(e) {
for (var t = 0, o = [], n = 0; n < e.length; n++) {
var i = e[n], a = i[0].value;
if (a > t || a == r.default.gameInfoGD.m_iLaiziValue) {
o.push(i);
t = o[0][0].value;
} else {
o.unshift(i);
t = o[0][0].value;
}
}
return o;
};
e.getHandcardAry = function(e, t, o, n, r, i) {
for (var a = [], s = 0; s < e.length; s++) {
var l = i[e[s].index];
a.push(l);
}
var c = this._getCardArray(a);
for (s = 0; s < t.length; s++) {
for (var u = t[s], d = 0; d < u.length; d++) {
l = i[u[d].index];
u[d] = l;
}
c.push(u);
}
for (s = o.length - 1; s >= 0; s--) {
var p = o[s];
for (d = 0; d < p.length; d++) {
l = i[p[d].index];
p[d] = l;
}
c.push(p);
}
for (s = 0; s < n.length; s++) {
var f = n[s];
for (d = 0; d < f.length; d++) {
l = i[f[d].index];
f[d] = l;
}
c.push(f);
}
for (s = 0; s < r.length; s++) {
var h = r[s];
for (d = 0; d < h.length; d++) {
l = i[h[d].index];
h[d] = l;
}
c.push(h);
}
return c;
};
e._getCardArray = function(e) {
for (var t = [], o = 0, n = -1, r = e.length - 1; r >= 0; r--) if (o != Math.floor(e[r] / 10)) {
t[++n] = [ e[r] ];
o = Math.floor(e[r] / 10);
} else t[n].push(e[r]);
return t;
};
e.splitlist = function(e, t, o, n) {
void 0 === n && (n = void 0);
for (var r = e, i = [], s = 0; s < t.length; s++) for (var l = t[s], c = 0; c < l.length; c++) {
if (void 0 == (d = l[c])) break;
i.push(d);
}
var u = JSON.parse(JSON.stringify(o));
for (s = 0; s < i.length; s++) for (l = i[s], c = 0; c < r.length; c++) {
var d = r[c];
if (l.index != d.index) ; else {
u[d.index] = 0;
r.splice(c, 1);
n && n.splice(c, 1);
}
}
return {
newArray: r,
countArr: a.getTipCardsInfo_tonghua(u).cardsCountArr,
cards: u,
cleanCards_laizi: n
};
};
e.getListLaizi = function(e) {
for (var t = 0, o = 0; o < e.length; o++) {
e[o].value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3 && t++;
}
return t;
};
e.sortths = function(e, t, o, i) {
for (var a = this, s = [], l = [], c = [], u = 0; u < t.length; u++) {
var d = t[u];
c.push(d.index);
}
o[1] = o[14];
for (var p = [].concat(e), f = [].concat(i), h = function(e) {
for (var n = [], r = 0, i = 0; i < 5; i++) {
var c = e - i;
if (!(c < 1)) {
if (o[c] > 0) n.push(c); else {
r++;
n.push(0);
}
}
}
if (0 === r) {
var u = [];
n.forEach(function(e) {
1 == e && (e = 14);
var t = a._getCards(p, e);
u.push(t);
});
if (5 === u.length) {
u.reverse();
s.push(u);
}
} else if (r <= t.length) {
var d = [], f = 0;
n.forEach(function(e) {
if (0 != e) {
var o = a._getCards(p, e);
d.push(o);
} else {
var n = a._getIndexCards(t[f++].index);
d.push(n[0]);
}
});
if (5 === d.length) {
d.reverse();
d && l.push(d);
}
}
}, m = 14; m >= 1; m--) h(m);
var g = l.concat(s), y = [], _ = [];
for (m = 0; m < g.length; m++) {
for (var v = !1, C = !1, b = !1, D = !1, S = 0, w = 0, O = 0, P = 0, I = t.length, R = 0, k = 0; k < g[m].length; k++) {
var j = [];
if (void 0 == g[m][k]) break;
if (g[m][k].value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3 && c.indexOf(g[m][k].index) >= 0) {
console.log(c.indexOf(g[m][k].index));
R++;
} else {
var L = this._getCardsNum(f, g[m][k].value);
for (u = 0; u < L.length; u++) {
var U = this._color(L[u]);
j.push(U);
}
-1 == j.indexOf(n.Fang) && O++;
-1 == j.indexOf(n.Mei) && P++;
-1 == j.indexOf(n.Hei) && S++;
-1 == j.indexOf(n.Hong) && w++;
}
}
S + R <= I && (v = !0);
w + R <= I && (C = !0);
P + R <= I && (D = !0);
O + R <= I && (b = !0);
if (v) {
var T = [];
for (u = 0; u < g[m].length && void 0 != g[m][u]; u++) {
if ((E = g[m][u]).value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3 && c.indexOf(g[m][u].index) >= 0) T.push(E); else {
var N = 10 * E.value + 4;
14 == E.value && (N = 14);
if (x = this._getCards(f, N)) T.push(x); else {
var M = this._getLaiZiCards(1);
T.push(M[0]);
}
}
}
y.push(T);
}
if (b) {
for (T = [], u = 0; u < g[m].length && void 0 != g[m][u]; u++) {
if ((E = g[m][u]).value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3 && c.indexOf(g[m][u].index) >= 0) T.push(E); else {
N = 10 * E.value + 1;
14 == E.value && (N = 11);
if (x = this._getCards(f, N)) T.push(x); else {
M = this._getLaiZiCards(1);
T.push(M[0]);
}
}
}
y.push(T);
}
if (C) {
for (T = [], u = 0; u < g[m].length && void 0 != g[m][u]; u++) {
if ((E = g[m][u]).value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3 && c.indexOf(g[m][u].index) >= 0) T.push(E); else {
N = 10 * E.value + 3;
14 == E.value && (N = 13);
if (x = this._getCards(f, N)) T.push(x); else {
M = this._getLaiZiCards(1);
T.push(M[0]);
}
}
}
y.push(T);
}
if (D) {
for (T = [], u = 0; u < g[m].length && void 0 != g[m][u]; u++) {
var E;
if ((E = g[m][u]).value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3 && c.indexOf(g[m][u].index) >= 0) T.push(E); else {
var x;
N = 10 * E.value + 2;
14 == E.value && (N = 12);
if (x = this._getCards(f, N)) T.push(x); else {
M = this._getLaiZiCards(1);
T.push(M[0]);
}
}
}
y.push(T);
}
_ = _.concat(y);
y = [];
}
for (m = 0; m < _.length; m++) {
var G = _[m], B = !1;
for (k = 0; k < G.length; k++) {
if ((d = G[k]).value == 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
B = !0;
break;
}
}
if (!B) {
var A = [];
A.push(_[m]);
return A;
}
}
var H = [];
_.length > 0 && H.push(_[0]);
return H;
};
e._color = function(e) {
return e % 10;
};
e._tipKingBomb = function(e, t, o) {
for (var n = [], r = [], i = [ 170, 170, 180, 180 ], a = [].concat(e), s = 0; s < i.length; s++) {
var l = i[s], c = o[l], u = this._getCards(a, l);
2 == c && r.push(u);
}
if (4 == r.length) {
r[1] = {
value: 170,
index: 3
};
r[3] = {
value: 180,
index: 1
};
n.push(r);
}
return n;
};
e._tipFoueOne = function(e, t, o, n) {
var r = [];
if (e.length < 6) return r;
var i = this._tipHardBomb(e, t, o, 4, n);
i = i.concat(this._tipSoftBomb(e, t, o, n));
s.SetTipIndex(i.length);
for (var a = 0; a < i.length; a++) {
var l = [].concat(i[a]), c = JSON.parse(JSON.stringify(e)), u = JSON.parse(JSON.stringify(t)), d = JSON.parse(JSON.stringify(o));
this.RemoveLeftCards(c, u, d, l);
var p = c.concat(u), f = this._tipSingle(p, d);
f.length < 2 ? l.push(p[0], p[1]) : l.push(f[0][0], f[1][0]);
r.push(l);
}
return r;
};
e._tipFoueTwo = function(e, t, o, n) {
var r = [];
if (e.length < 8) return r;
var i = this._tipHardBomb(e, t, o, 4, n);
i = i.concat(this._tipSoftBomb(e, t, o, n));
for (var a = 0; a < i.length; a++) {
var l = [].concat(i[a]), c = JSON.parse(JSON.stringify(e)), u = JSON.parse(JSON.stringify(t)), d = JSON.parse(JSON.stringify(o));
this.RemoveLeftCards(c, u, d, l);
var p = this._tipDouble(c, u, d, 0);
if (p.length >= 2) {
l.push(p[0][0], p[0][1], p[1][0], p[1][1]);
r.push(l);
} else if (1 == p.length && 4 == d[p[0][0].value]) {
var f = JSON.parse(JSON.stringify(p[0][0])), h = JSON.parse(JSON.stringify(p[0][0]));
f.index = f.index + 2;
h.index = h.index + 3;
l.push(p[0][0], p[0][1], f, h);
r.push(l);
break;
}
}
s.SetTipIndex(r.length);
return r;
};
e._tipFeiJi = function(e, t, o, n, r) {
var i = [], a = t.length, l = [ [], [], [], [], [] ];
14 == n && (n = 1);
if (n + 1 === 14) return [];
if (e.length + t.length < r) return [];
for (var c = n + 1; c <= 14; c++) {
for (var u = [], d = 0, p = 0; d < 2; d++) {
var f = c + d, h = o[f];
if (f > 14) break;
var m = this._getCardsIndex(e, f);
if (h >= 3) {
u.push(e[m[0]]);
u.push(e[m[1]]);
u.push(e[m[2]]);
} else {
if (3 - h > a - p) break;
if (1 == h) {
u.push(e[m[0]]);
u.push(t[p++]);
u.push(t[p++]);
}
if (2 == h) {
u.push(e[m[0]], e[m[1]]);
u.push(t[p++]);
}
if (0 == h) {
u.push(t[p++]);
u.push(t[p++]);
u.push(t[p++]);
}
}
}
2 == d && (0 == p ? i.push(u) : l[p].push(u));
}
for (var g = [], y = 0; y < 5; y++) g = g.concat(l[y]);
s.SetTipIndex(g.length);
return [].concat(g).concat(i);
};
e.RemoveLeftCards = function(e, t, o, n) {
for (var r = 0; r < n.length; r++) {
if (a.isLaizi(n[r].value)) {
for (var i = 0; i < t.length; i++) if (t[i].index == n[r].index) {
t.splice(i, 1);
break;
}
} else for (var s = 0; s < e.length; s++) if (e[s].index == n[r].index) {
e.splice(s, 1);
break;
}
o[n[r].value]--;
}
};
e._tipFeijiOne = function(e, t, o, n, r) {
var i = [];
if (e.length + t.length < r) return i;
for (var a = r / 4 * 3, s = this._tipFeiJi(e, t, o, n, a), l = 0; l < s.length; l++) {
var c = JSON.parse(JSON.stringify(s[l])), u = JSON.parse(JSON.stringify(e)), d = JSON.parse(JSON.stringify(t)), p = JSON.parse(JSON.stringify(o));
this.RemoveLeftCards(u, d, p, c);
var f = u.concat(d), h = this._tipSingle(f, p), m = a / 3;
if (h.length < m) for (var g = 0; g < m; g++) c.push(f[g]); else for (g = 0; g < m; g++) c.push(h[g][0]);
i.push(c);
}
return i;
};
e._tipFeijiTwo = function(e, t, o, n, r) {
var i = [];
if (e.length + t.length < r) return i;
var a = r / 5 * 3, l = this._tipFeiJi(e, t, o, n, a);
if (0 == l.length) return i;
for (var c = 0, u = 0; u < l.length; u++) {
var d = [].concat(l[u]), p = JSON.parse(JSON.stringify(e)), f = JSON.parse(JSON.stringify(t)), h = JSON.parse(JSON.stringify(o));
this.RemoveLeftCards(p, f, h, d);
for (var m = this._tipDouble(p, f, h, 0), g = a / 3, y = 0; y < m.length; y++) {
if (4 == h[m[y][0].value] && g >= 2) {
var _ = JSON.parse(JSON.stringify(m[y][0])), v = JSON.parse(JSON.stringify(m[y][0]));
_.index = _.index + 2;
v.index = v.index + 3;
d.push(m[y][0], m[y][1], _, v);
g -= 2;
} else {
d.push(m[y][0], m[y][1]);
g--;
}
if (0 == g) {
i.push(d);
f.length != t && c++;
break;
}
}
}
s.SetTipIndex(c);
return i;
};
e._getCards = function(e, t) {
for (var o = 0; o < e.length; o++) {
1 == t && (t = 14);
if (e[o].value === t) return e[o];
}
};
e._getIndexCards = function(e) {
for (var t = r.default.myAbsolutePos(), o = r.default.gameInfoGD.siteInfos.get(t).handCards, n = [], i = 0; i < o.length; i++) if (i === e) {
var a = {
value: o[i],
index: i
};
n.push(a);
return n;
}
return n;
};
e._getLaiZiCards = function(e) {
for (var t = r.default.myAbsolutePos(), o = r.default.gameInfoGD.siteInfos.get(t).handCards, n = [], i = 0; i < o.length; i++) {
if (o[i] == 10 * r.default.gameInfoGD.m_iLaiziValue + 3) {
var a = {
value: o[i],
index: i
};
n.push(a);
}
if (n.length == e) return n;
}
return [];
};
e._getCardsIndex = function(e, t) {
for (var o = [], n = 0; n < e.length; n++) e[n].value === t && o.push(n);
return o;
};
e._getCardsNum = function(e, t) {
for (var o = [], n = 0; n < e.length; n++) {
Math.floor(e[n].value / 10) === t && o.push(e[n].value);
14 == t && 1 == Math.floor(e[n].value / 10) && o.push(e[n].value);
}
return o;
};
e.getTips = function(e, t, o) {
if (e == i.KINGBOMB) return [];
for (var n = [], r = [ i.SiBomb, i.WuBomb, i.LiuBomb, i.QiBomb, i.BaBomb, i.JiuBomb, i.ShiBomb, i.KINGBOMB, i.TongHuaShun ], l = [], c = 0; c < t.length; c++) {
var u = {
value: a.value(t[c]),
index: c
};
l.push(u);
}
var d = a.value(o[0]), p = a.getTipCardsInfo(t).cardsCountArr, f = o.length || 1, h = [], m = JSON.parse(JSON.stringify(l)), g = [];
for (c = 0; c < t.length; c++) {
u = {
value: t[c],
index: c
};
g.push(u);
}
var y = JSON.parse(JSON.stringify(g));
for (c = m.length - 1; c >= 0; c--) if (a.isLaizi(g[c].value)) {
u = {
value: m[c].value,
index: m[c].index
};
h.push(u);
m.splice(c, 1);
}
for (c = y.length - 1; c >= 0; c--) if (a.isLaizi(g[c].value)) {
u = {
value: y[c].value,
index: y[c].index
};
y.splice(c, 1);
}
s.SetTipIndex(0);
if (e === i.Single) {
var _ = this._tipSingle(l, p, d);
n = n.concat(_);
}
if (e === i.Double) {
var v = this._tipDouble(m, h, p, d);
n = n.concat(v);
}
if (e === i.ShunZi) {
var C = this._tipShunzi(m, h, p, d, f);
n = n.concat(C);
}
if (e === i.LianDui) {
var b = this._tipLiandui(m, h, p, d, f);
n = n.concat(b);
}
if (e === i.Three) {
var D = this._tipThree(m, h, p, d);
n = n.concat(D);
}
if (e === i.FeiJi) {
var S = this._tipFeiJi(m, h, p, d, f);
n = n.concat(S);
}
if (e === i.FeiJiOne) {
var w = this._tipFeijiOne(m, h, p, d, f);
n = n.concat(w);
}
if (e === i.ThreeTwo) {
var O = this._tipThreeTwo(m, h, p, d);
n = n.concat(O);
}
if (e === i.FeiJiTwo) {
var P = this._tipFeijiTwo(m, h, p, d, f);
n = n.concat(P);
}
if (e === i.FourOne) {
var I = this._tipFoueOne(m, h, p, d);
n = n.concat(I);
}
if (e === i.SiBomb) {
var R = this._tipSoftBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 4, d, !0);
n = (n = n.concat(k)).concat(R);
var j = this._tipWuBomb(m, h, p), L = this._tipHardBomb(m, h, p, 5);
n = n.concat(L).concat(j);
var U = this._tipTongHuaShun(m, h, p, y);
n = n.concat(U);
var T = this._tipLiuBomb(m, h, p), N = this._tipHardBomb(m, h, p, 6);
n = n.concat(N).concat(T);
var M = this._tipQiBomb(m, h, p), E = this._tipHardBomb(m, h, p, 7);
n = n.concat(E).concat(M);
var x = this._tipBaBomb(m, h, p), G = this._tipHardBomb(m, h, p, 8);
n = n.concat(G).concat(x);
var B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
var H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.WuBomb) {
R = this._tipWuBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 5, d, !0);
n = (n = n.concat(k)).concat(R);
U = this._tipTongHuaShun(m, h, p, y);
n = n.concat(U);
T = this._tipLiuBomb(m, h, p), N = this._tipHardBomb(m, h, p, 6);
n = n.concat(N).concat(T);
M = this._tipQiBomb(m, h, p), E = this._tipHardBomb(m, h, p, 7);
n = n.concat(E).concat(M);
x = this._tipBaBomb(m, h, p), G = this._tipHardBomb(m, h, p, 8);
n = n.concat(G).concat(x);
B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.TongHuaShun) {
U = this._tipTongHuaShun(m, h, p, y, d);
n = n.concat(U);
R = this._tipLiuBomb(m, h, p), k = this._tipHardBomb(m, h, p, 6);
n = (n = n.concat(k)).concat(R);
M = this._tipQiBomb(m, h, p), E = this._tipHardBomb(m, h, p, 7);
n = n.concat(E).concat(M);
x = this._tipBaBomb(m, h, p), G = this._tipHardBomb(m, h, p, 8);
n = n.concat(G).concat(x);
B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.LiuBomb) {
R = this._tipLiuBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 6, d, !0);
n = (n = n.concat(k)).concat(R);
M = this._tipQiBomb(m, h, p), E = this._tipHardBomb(m, h, p, 7);
n = n.concat(E).concat(M);
x = this._tipBaBomb(m, h, p), G = this._tipHardBomb(m, h, p, 8);
n = n.concat(G).concat(x);
B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.QiBomb) {
R = this._tipQiBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 7, d, !0);
n = (n = n.concat(k)).concat(R);
x = this._tipBaBomb(m, h, p), G = this._tipHardBomb(m, h, p, 8);
n = n.concat(G).concat(x);
B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.BaBomb) {
R = this._tipBaBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 8, d, !0);
n = (n = n.concat(k)).concat(R);
B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.JiuBomb) {
R = this._tipJiuBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 9, d, !0);
n = (n = n.concat(k)).concat(R);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
if (e === i.ShiBomb) {
R = this._tipShiBomb(m, h, p, d, !0), k = this._tipHardBomb(m, h, p, 10, d, !0);
n = (n = n.concat(k)).concat(R);
}
if (!r.includes(e)) {
var K = this._tipSoftBomb(m, h, p);
k = this._tipHardBomb(m, h, p, 4);
n = n.concat(k).concat(K);
j = this._tipWuBomb(m, h, p), L = this._tipHardBomb(m, h, p, 5);
n = n.concat(L).concat(j);
U = this._tipTongHuaShun(m, h, p, y);
n = n.concat(U);
T = this._tipLiuBomb(m, h, p), N = this._tipHardBomb(m, h, p, 6);
n = n.concat(N).concat(T);
M = this._tipQiBomb(m, h, p), E = this._tipHardBomb(m, h, p, 7);
n = n.concat(E).concat(M);
x = this._tipBaBomb(m, h, p), G = this._tipHardBomb(m, h, p, 8);
n = n.concat(G).concat(x);
B = this._tipJiuBomb(m, h, p), A = this._tipHardBomb(m, h, p, 9);
n = n.concat(A).concat(B);
H = this._tipShiBomb(m, h, p), F = this._tipHardBomb(m, h, p, 10);
n = n.concat(F).concat(H);
}
var W = this._tipKingBomb(m, h, p);
n = n.concat(W);
var Z = [];
for (c = 0; c < n.length; c++) {
var V = n[c], J = [];
if (V) {
for (var z = 0; z < V.length; z++) {
var q = V[z];
q && J.push(q.index);
}
Z.push(J);
}
}
return Z;
};
e.tipNull = function(e, t) {
var o = [], n = [].concat(e);
o[0] = this.getTips(i.Single, n, [ 0 ]);
o[1] = this.getTips(i.Double, n, [ 0, 0 ]);
o[2] = [];
o[3] = [];
return {
tips: o = [].concat.apply([], o),
invalids: []
};
};
e.tipSingle = function(e, t, o) {
return {
tips: this.getTips(i.Single, e, t),
invalids: []
};
};
e.tipDouble = function(e, t, o) {
return {
tips: this.getTips(i.Double, e, t),
invalids: []
};
};
e.tipShunZi = function(e, t, o, n) {
return {
tips: this.getTips(i.ShunZi, e, t),
invalids: []
};
};
e.tipLianDui = function(e, t, o, n) {
return {
tips: this.getTips(i.LianDui, e, t),
invalids: []
};
};
e.tipThree = function(e, t, o) {
return {
tips: this.getTips(i.Three, e, t),
invalids: []
};
};
e.tipThreeTwo = function(e, t, o) {
return {
tips: this.getTips(i.ThreeTwo, e, t),
invalids: []
};
};
e.tipFourOne = function(e, t, o) {
return {
tips: this.getTips(i.FourOne, e, t),
invalids: []
};
};
e.tipFeiJi = function(e, t, o, n) {
return {
tips: this.getTips(i.FeiJi, e, t),
invalids: []
};
};
e.tipFeiJiOne = function(e, t, o, n) {
return {
tips: this.getTips(i.FeiJiOne, e, t),
invalids: []
};
};
e.tipFeiJiTwo = function(e, t, o, n) {
return {
tips: this.getTips(i.FeiJiTwo, e, t),
invalids: []
};
};
e.tipHardBomb = function(e, t, o, n) {
return {
tips: this.getTips(n, e, t),
invalids: []
};
};
e.tipKingBomb = function(e, t, o) {
return {
tips: this.getTips(i.KINGBOMB, e, t),
invalids: []
};
};
return e;
}();
cc._RF.pop();
