// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "082d1EC9WpPwKOIhbDoUdYM", "DDZCardUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomInfoData");
(function(e) {
e[e.Hei = 4] = "Hei";
e[e.Hong = 3] = "Hong";
e[e.Mei = 2] = "Mei";
e[e.Fang = 1] = "Fang";
})(o.eDDZCardColor || (o.eDDZCardColor = {}));
o.DDZ_XiaoWang = 170;
o.DDZ_DaWang = 180;
o.DDZ_HuaPai = 190;
o.DDZ_HIDE_ID = 0;
var r;
(function(e) {
e[e.Error = 0] = "Error";
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.ShunZi = 3] = "ShunZi";
e[e.LianDui = 4] = "LianDui";
e[e.Three = 5] = "Three";
e[e.FeiJi = 6] = "FeiJi";
e[e.ThreeOne = 7] = "ThreeOne";
e[e.FeiJiOne = 8] = "FeiJiOne";
e[e.ThreeTwo = 9] = "ThreeTwo";
e[e.FeiJiTwo = 10] = "FeiJiTwo";
e[e.FourOne = 12] = "FourOne";
e[e.FourTwo = 14] = "FourTwo";
e[e.SoftBomb = 15] = "SoftBomb";
e[e.HardBomb = 16] = "HardBomb";
e[e.KINGBOMB = 33] = "KINGBOMB";
})(r = o.eDDZOneHandType || (o.eDDZOneHandType = {}));
var i = function() {
function e() {}
e.isHide = function(e) {
return e === o.DDZ_HIDE_ID;
};
e._color = function(e) {
return e % 10;
};
e.value = function(e) {
if (e == o.DDZ_XiaoWang || e == o.DDZ_DaWang || e == o.DDZ_HuaPai) return e;
var t = Math.floor(e / 10);
return 1 === t ? 14 : 2 === t ? 15 : t;
};
e.isLaizi = function(e) {
14 == e ? e = 1 : 15 == e && (e = 2);
return 190 === e || e == n.default.gameInfoDDZ.m_iLaiziValue;
};
e.imgPath = function(e, t) {
void 0 === t && (t = !1);
if (0 == e) return "Games/Poker/card_00";
var r = this._color(e), i = this.value(e), a = r;
0 == r && (a = 6);
var s = i.toString(16);
if (i === o.DDZ_XiaoWang) {
a = 5;
s = "e";
}
if (i === o.DDZ_DaWang) {
a = 5;
s = "f";
}
if (i === o.DDZ_HuaPai) {
a = 5;
s = "h";
}
if (14 === i) {
s = 1..toString(16);
}
if (15 === i) {
s = 2..toString(16);
}
n.default.gameInfoDDZ.m_iLaiziValue > 0 && s == n.default.gameInfoDDZ.m_iLaiziValue.toString(16) && (a = 6);
5 == r && (a = 7);
return t ? "Games/smallPoker/card_" + a + s : "Games/Poker/card_" + a + s;
};
e.isAllLaiCards = function(e) {
var t = this;
return e.every(function(e) {
return t.isLaizi(e);
});
};
e.soundName = function(e, t) {
var o = this.value(t);
return 14 === o ? e + "1" : 15 === o ? e + "2" : e + o;
};
e._cards2CountArr = function(e) {
var t = Array(20);
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
e.length > 1 && e.forEach(function(e) {
t.isLaizi(e) && o++;
});
return o;
};
e.getCardsWithoutLaizi = function(e) {
for (var t = [].concat(e), o = t.length - 1; o >= 0; o--) this.isLaizi(t[o]) && t.splice(o, 1)[0];
return t;
};
e.isAllEqual = function(e) {
var t = new Set(e);
return 1 === Array.from(t).length;
};
e.getCardsInfo = function(e) {
for (var t = [].concat(e), o = this.checkLaiziNum(t), n = this.getCardsWithoutLaizi(t), r = [], i = 1; i <= 20; i++) r[i] = 0;
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
if (0 === r) s[0] > t && !s.includes(15) && a.push(s); else if (r <= n) {
var d = [];
s.forEach(function(e, t) {
if (0 !== e) d.push(e); else {
var o = d[d.length - 1];
o ? d.push(o + 1) : d.push(c);
}
});
d[0] > t && !d.includes(15) && a.push(d);
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
var t = [].concat(e), o = this.getCardsInfo(t), r = o.cleanCards, i = o.laiNum;
if (2 == i) {
this.m_arariLaiziReplaceValue[0] = [ 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ];
return !0;
}
for (var a = 0, s = 0; s < r.length; s++) {
var l = r[s];
if (170 === l || 180 === l) return !1;
this.isLaizi(l);
a = l;
}
1 == i && (this.m_arariLaiziReplaceValue[0] = [ 10 * a ]);
return 2 === e.length && 1 === i || this.isAllEqual(e);
};
e.isHuoJian = function(e) {
if (2 != e.length) return !1;
var t = this.getCardsInfo(e).cleanCards;
return t.includes(170) && t.includes(180);
};
e.isShunzi = function(e, t) {
void 0 === t && (t = 0);
var o = e.length;
if (o < 5 || o > 12) return !1;
if (t + o - 1 == 14) return !1;
var n = this.getCardsInfo(e), i = n.cleanCards, a = n.laiNum;
if (5 == a && 5 == o) return !1;
var s = n.cardsCountArr, l = i[0], c = i[i.length - 1];
if (c >= 15) return !1;
if (c - l + 1 > o || l <= t) return !1;
for (var u = 0; u < i.length; u++) if (i[u] === i[u + 1]) return !1;
if (a > 0) {
var d = [];
for (u = l; u <= c; u++) {
if (0 === s[u]) {
if (0 == a) return !1;
a--;
d.push(10 * u);
}
}
if (0 == a) {
this.m_arariLaiziReplaceValue.push(d);
this.m_ariChooseType.push(r.ShunZi);
} else {
if (!(0 < a)) return !1;
var p = [];
if (3 == l || l - t == 1) {
for (var f = 0; f < a; f++) p.push(10 * (c + f + 1));
this.m_arariLaiziReplaceValue.push(d.concat(p));
this.m_ariChooseType.push(r.ShunZi);
} else if (14 == c) {
for (f = 0; f < a; f++) p.push(10 * (l - f - 1));
this.m_arariLaiziReplaceValue.push(d.concat(p));
this.m_ariChooseType.push(r.ShunZi);
} else {
for (var h = l, m = a; m > 0 && (--h >= 3 && h > t); m--) p.push(10 * h);
if (m > 0) {
h = c;
for (;m > 0; m--) {
h++;
p.push(10 * h);
}
}
this.m_arariLaiziReplaceValue.push(d.concat(p));
this.m_ariChooseType.push(r.ShunZi);
if (12 != o) {
p = [];
h = c;
for (var y = a; y > 0 && ++h <= 14; y--) p.push(10 * h);
if (y > 0) {
h = l;
for (;y > 0; y--) {
h--;
p.push(10 * h);
}
}
this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, d.concat(p));
this.m_ariChooseType.push(r.ShunZi);
}
}
}
return !0;
}
return !0;
};
e.isLiandui = function(e, t) {
void 0 === t && (t = 0);
var n = e.length;
if (n % 2 != 0) return !1;
if (t + n / 2 - 1 == 14) return !1;
var i = this.getCardsInfo(e), a = i.cleanCards, s = i.laiNum, l = i.cardsCountArr, c = a[0], u = a[a.length - 1];
if (a.includes(15) || a.includes(o.DDZ_DaWang) || a.includes(o.DDZ_XiaoWang)) return !1;
if (c <= t) return !1;
if (u - c + 1 > n / 2) return !1;
for (var d = [], p = c; p <= u; p++) {
var f = l[p];
if (f > 2) return !1;
if (0 == f) {
s -= 2;
d.push(10 * p, 10 * p);
} else if (1 == f) {
s--;
d.push(10 * p);
}
}
var h = [];
if (0 == s && a.length < n) {
this.m_arariLaiziReplaceValue.push(d);
this.m_ariChooseType.push(r.LianDui);
}
if (s > 0) {
var m = c, y = s, g = t + 1;
0 == t && (g = 3);
var _ = !1;
if (m > g) {
for (m = c - 1; m >= g; m--) {
h.push(10 * m, 10 * m);
if (0 == (y -= 2)) break;
}
m = u;
for (;y > 0; ) {
m++;
h.push(10 * m, 10 * m);
y -= 2;
}
this.m_arariLaiziReplaceValue.push(d.concat(h));
this.m_ariChooseType.push(r.LianDui);
_ = !0;
}
var v = s;
h = [];
for (m = u + 1; m <= 14; m++) {
h.push(10 * m, 10 * m);
if (0 == (v -= 2)) break;
}
m = c;
for (;v > 0; ) {
m--;
h.push(10 * m, 10 * m);
v -= 2;
}
_ ? this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, d.concat(h)) : this.m_arariLaiziReplaceValue.push(d.concat(h));
this.m_ariChooseType.push(r.LianDui);
}
return !0;
};
e.isThree = function(e) {
if (3 != e.length) return !1;
var t = this.getCardsInfo(e), r = t.cleanCards, i = r[0], a = r[r.length - 1], s = t.laiNum, l = t.cardsCountArr;
if (3 == s) {
this.m_arariLaiziReplaceValue[0] = [ 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ];
return !0;
}
if (2 == s) {
if (a == o.DDZ_DaWang || a == o.DDZ_XiaoWang) return !1;
this.m_arariLaiziReplaceValue[0] = [ 10 * i, 10 * i ];
return !0;
}
if (1 == s) {
if (i == a) {
this.m_arariLaiziReplaceValue[0] = [ 10 * i ];
return !0;
}
return !1;
}
return i === a && 3 == l[i];
};
e.isThreeOne = function(e, t) {
void 0 === t && (t = 0);
if (4 != e.length) return !1;
var i = this.getCardsInfo(e), a = i.cleanCards, s = a[0], l = a[a.length - 1], c = i.laiNum, u = i.cardsCountArr;
if (3 == c && (l == o.DDZ_DaWang || l == o.DDZ_XiaoWang)) {
this.m_arariLaiziReplaceValue[0] = [ 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ];
return !0;
}
if (3 == u[s] || 3 == u[l]) return !0;
if (0 == c) return !1;
if (c >= 3 || s == l) return !1;
if (u[s] + u[l] + c != 4) return !1;
if (2 == u[s]) {
if (s > t) {
this.m_arariLaiziReplaceValue[0] = [ 10 * s ];
return !0;
}
return !1;
}
if (2 == u[l]) {
if (l > t) {
this.m_arariLaiziReplaceValue[0] = [ 10 * l ];
return !0;
}
return !1;
}
if (s > t) {
if (s == o.DDZ_XiaoWang) return !1;
if (l == o.DDZ_XiaoWang || l == o.DDZ_DaWang) this.m_arariLaiziReplaceValue.push([ 10 * s, 10 * s ]); else {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * l ], [ 10 * s, 10 * s ]);
this.m_ariChooseType.push(r.ThreeOne, r.ThreeOne);
}
return !0;
}
if (l > t && l != o.DDZ_XiaoWang && l != o.DDZ_DaWang) {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * l ]);
return !0;
}
return !1;
};
e.isThreeTwo = function(e, t) {
void 0 === t && (t = 0);
if (5 != e.length) return !1;
var i = this.getCardsInfo(e), a = i.cleanCards, s = i.laiNum;
if (5 == s) return !1;
var l = a[0], c = a[a.length - 1];
if (c == o.DDZ_XiaoWang || c == o.DDZ_DaWang) return !1;
if (15 == t) return !1;
var u = i.cardsCountArr;
if (3 == u[l] && 2 == u[c] || 3 == u[c] && 2 == u[l]) return !0;
if (4 == u[l] || 4 == u[c]) return !1;
if (s > 0) {
if (l != c && u[l] + u[c] + s != 5) return !1;
var d = t + 1;
if (0 == t) {
d = 3;
4;
}
if (4 == s) {
if (d > n.default.gameInfoDDZ.m_iLaiziValue && d > l) return !1;
if (n.default.gameInfoDDZ.m_iLaiziValue > l) {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
if (l >= d) {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * l, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
}
} else {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * l, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
if (n.default.gameInfoDDZ.m_iLaiziValue >= d) {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
}
}
} else if (3 == s) if (l == c) {
if (d > n.default.gameInfoDDZ.m_iLaiziValue && d > l) return !1;
if (n.default.gameInfoDDZ.m_iLaiziValue > l) {
this.m_arariLaiziReplaceValue.push([ 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
if (l >= d) {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
}
} else {
this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
if (n.default.gameInfoDDZ.m_iLaiziValue >= d) {
this.m_arariLaiziReplaceValue.push([ 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
}
}
} else {
if (d > c) return !1;
if (d > l) {
this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c, 10 * l ]);
this.m_ariChooseType.push(r.ThreeTwo);
} else {
this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c, 10 * l ], [ 10 * l, 10 * l, 10 * c ]);
this.m_ariChooseType.push(r.ThreeTwo, r.ThreeTwo);
}
} else if (2 == s) {
if (l == c) {
this.m_arariLaiziReplaceValue.push([ 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue ]);
this.m_ariChooseType.push(r.ThreeTwo);
return !0;
}
if (d > c) return !1;
if (d > l) {
2 == u[c] ? this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * l ]) : this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ]);
this.m_ariChooseType.push(r.ThreeTwo);
} else {
2 == u[l] ? this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ], [ 10 * l, 10 * c ]) : this.m_arariLaiziReplaceValue.push([ 10 * l, 10 * c ], [ 10 * l, 10 * l ]);
this.m_ariChooseType.push(r.ThreeTwo, r.ThreeTwo);
}
} else if (1 == s) {
if (d > c) return !1;
if (3 == u[l]) {
if (d > l) return !1;
this.m_arariLaiziReplaceValue.push([ 10 * c ]);
this.m_ariChooseType.push(r.ThreeTwo);
} else if (3 == u[c]) {
this.m_arariLaiziReplaceValue.push([ 10 * l ]);
this.m_ariChooseType.push(r.ThreeTwo);
} else if (d > l) {
this.m_arariLaiziReplaceValue.push([ 10 * c ]);
this.m_ariChooseType.push(r.ThreeTwo);
} else {
this.m_arariLaiziReplaceValue.push([ 10 * c ], [ 10 * l ]);
this.m_ariChooseType.push(r.ThreeTwo, r.ThreeTwo);
}
}
return !0;
}
return !1;
};
e.isFeiJi = function(e, t) {
void 0 === t && (t = 0);
var n = e.length;
if (n < 6 || n % 3 != 0) return !1;
if (t + n / 3 - 1 == 14) return !1;
var i = this.getCardsInfo(e), a = i.cleanCards, s = i.cardsCountArr;
if (a.includes(15) || a.includes(o.DDZ_DaWang) || a.includes(o.DDZ_XiaoWang)) return !1;
var l = a[0], c = a[a.length - 1], u = i.laiNum;
if (l <= t) return !1;
if (c - l + 1 > n / 3) return !1;
for (var d = [], p = u, f = l; f <= c; f++) {
var h = s[f];
if (h > 3) return !1;
if (0 == h) {
p -= 3;
d.push(10 * f, 10 * f, 10 * f);
} else if (1 == h) {
p -= 2;
d.push(10 * f, 10 * f);
} else if (2 == h) {
p--;
d.push(10 * f);
}
}
if (p > 0) {
var m = [], y = t + 1;
0 == t && (y = 3);
var g = !1, _ = l - 1;
if (_ >= y) {
m.push(10 * _, 10 * _, 10 * _);
this.m_arariLaiziReplaceValue.push(d.concat(m));
this.m_ariChooseType.push(r.FeiJi);
g = !0;
}
(m = []).push(10 * (_ = c + 1), 10 * _, 10 * _);
g ? this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, d.concat(m)) : this.m_arariLaiziReplaceValue.push(d.concat(m));
this.m_ariChooseType.push(r.FeiJi);
} else if (u > 0) {
this.m_arariLaiziReplaceValue.push(d);
this.m_ariChooseType.push(r.FeiJi);
}
return !0;
};
e.isFeiJiOne = function(e, t) {
void 0 === t && (t = 0);
var o = e.length;
if (o < 8 || o % 4 != 0) return !1;
var n = o / 4, i = n;
if (t + n - 1 == 14) return !1;
var a = this.getCardsInfo(e), s = a.cleanCards, l = a.laiNum, c = a.cardsCountArr;
if (s.length > n && s[n] <= t) return !1;
for (var u = !1, d = [], p = 0, f = !1, h = s.length - 1; h >= s.length - 1 - n; h--) {
i = n;
if ((C = s[h]) <= t) return !1;
if (!(C >= 15)) {
u = !0;
var m = l;
d = [];
var y = C + 1;
if (!f && 14 != C && m >= 3 && 0 == c[y]) {
f = !0;
m -= 3;
d.push(10 * y, 10 * y, 10 * y);
h++;
i--;
} else f = !1;
for (var g = C; g > C - i; g--) {
p = g;
if (c[g] < 3) {
if (!(m >= (S = 3 - c[g]))) {
u = !1;
break;
}
m -= S;
(w = new Array(3 - c[g])).fill(10 * g);
d = d.concat(w);
}
}
if (u) {
if (m != l) {
this.m_arariLaiziReplaceValue.push(d);
this.m_ariChooseType.push(r.FeiJiOne);
}
break;
}
}
}
var _ = !1, v = !1;
for (h = 0; h <= n; h++) {
var C;
if ((C = s[h]) + i - 1 >= 15) break;
i = n;
var b = l;
d = [];
var D = C;
if (!v && 3 != C && b >= 3) {
v = !0;
b -= 3;
D--;
d.push(10 * D, 10 * D, 10 * D);
h--;
i--;
} else v = !1;
if (0 != p && D >= p || D <= t) break;
_ = !0;
for (g = C; g < C + i; g++) if (c[g] < 3) {
var S, w;
if (!(b >= (S = 3 - c[g]))) {
_ = !1;
break;
}
b -= S;
(w = new Array(3 - c[g])).fill(10 * g);
d = d.concat(w);
}
if (_) {
if (b != l) {
this.m_arariLaiziReplaceValue.push(d);
this.m_ariChooseType.push(r.FeiJiOne);
}
break;
}
}
return !(!u && !_);
};
e.isFeiJiTwo = function(e, t) {
void 0 === t && (t = 0);
var o = e.length;
if (o < 10 || o % 5 != 0) return !1;
for (var i = this.getCardsInfo(e), a = i.cleanCards, s = i.laiNum, l = i.cardsCountArr, c = o / 5, u = c, d = c, p = !1, f = [], h = 0, m = !1, y = !1, g = a.length - 1; g > 0; g--) {
u = c;
if ((O = a[g]) <= t) return !1;
if (!(O >= 15)) {
p = !0;
var _ = s;
f = [];
var v = O + 1;
if (!m && 14 != O && _ >= 3 && 0 == l[v]) {
m = !0;
_ -= 3;
f.push(10 * v, 10 * v, 10 * v);
g++;
u--;
} else m = !1;
for (var C = a.concat([]), b = O; b > O - u; b--) {
h = b;
if (l[b] < 3) {
if (!(_ >= (R = 3 - l[b]))) {
p = !1;
break;
}
_ -= R;
(k = new Array(3 - l[b])).fill(10 * b);
f = f.concat(k);
}
C.splice(C.indexOf(b), l[b]);
}
if (p) {
d = c;
for (var D = 0; D < C.length; D++) {
if (4 == l[j = C[D]]) {
d -= 2;
D += 3;
} else if (2 == l[j]) {
d--;
D++;
} else if (3 == l[j]) {
if (!(_ > 0)) break;
d -= 2;
D += 2;
_--;
f.push(10 * j);
} else if (1 == l[j]) {
if (!(_ > 0)) break;
d--;
_--;
f.push(10 * j);
}
}
}
if (_ > 0 && 2 * d == _) if (2 == _) {
f.push(10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue);
d = 0;
} else if (4 == _) {
f.push(10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue);
d = 0;
}
if (p && 0 == d) {
y = !0;
if (_ != s) {
this.m_arariLaiziReplaceValue.push(f);
this.m_ariChooseType.push(r.FeiJiTwo);
}
break;
}
}
}
var S = !1, w = !1;
for (g = 0; g < a.length; g++) {
var O = a[g];
u = c;
var P = s;
f = [];
var I = O;
if (!w && 3 != O && P >= 3) {
w = !0;
P -= 3;
I--;
f.push(10 * I, 10 * I, 10 * I);
g--;
u--;
} else w = !1;
if (0 != h && I >= h || I <= t) break;
S = !0;
for (C = a.concat([]), b = O; b < O + u; b++) {
if (l[b] < 3) {
var R, k;
if (!(P >= (R = 3 - l[b]))) {
S = !1;
break;
}
P -= R;
(k = new Array(3 - l[b])).fill(10 * b);
f = f.concat(k);
}
C.splice(C.indexOf(b), l[b]);
}
if (S) {
d = c;
for (D = 0; D < C.length; D++) {
var j;
if (4 == l[j = C[D]]) {
d -= 2;
D += 3;
} else if (2 == l[j]) {
d--;
D++;
} else if (3 == l[j]) {
if (!(P > 0)) break;
d -= 2;
D += 2;
P--;
f.push(10 * j);
} else if (1 == l[j]) {
if (!(P > 0)) break;
d--;
P--;
f.push(10 * j);
}
}
}
if (P > 0 && 2 * d == P) if (2 == P) {
f.push(10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue);
d = 0;
} else if (4 == P) {
f.push(10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue, 10 * n.default.gameInfoDDZ.m_iLaiziValue);
d = 0;
}
if (S && 0 == d) {
y = !0;
if (P != s) {
this.m_arariLaiziReplaceValue.push(f);
this.m_ariChooseType.push(r.FeiJiTwo);
}
break;
}
}
return !!y;
};
e.isSoftBomb = function(e) {
if (4 != e.length) return !1;
if (e.includes(o.DDZ_XiaoWang) || e.includes(o.DDZ_DaWang)) return !1;
var t = this.getCardsWithoutLaizi(e);
if (0 == t.length && e.includes(o.DDZ_HuaPai)) {
var r = 10 * n.default.gameInfoDDZ.m_iLaiziValue;
this.m_arariLaiziReplaceValue[0] = [ r, r, r, r ];
return !0;
}
if (this.isAllEqual(t) && t.length <= 3 && t.length > 0) {
this.m_arariLaiziReplaceValue[0] = new Array(4 - t.length);
this.m_arariLaiziReplaceValue[0].fill(10 * t[0]);
return !0;
}
return this.isAllEqual(t) && t.length <= 3;
};
e.isHardBomb = function(e) {
if (e.includes(o.DDZ_HuaPai)) return !1;
var t = this.getCardsWithoutLaizi(e);
return 0 == t.length || this.isAllEqual(t) && 4 === t.length;
};
e.isFourOne = function(e, t) {
void 0 === t && (t = 0);
if (6 != e.length) return !1;
var i = this.getCardsInfo(e), a = i.cleanCards, s = i.laiNum, l = i.cardsCountArr;
if (15 == t) return !1;
var c = t + 1;
0 == t && (c = 3);
var u = n.default.gameInfoDDZ.m_iLaiziValue;
if (1 == a.length) {
if ((h = a[0]) >= o.DDZ_XiaoWang) return !1;
if (c > u || c > h) return !1;
if (h >= c) {
this.m_arariLaiziReplaceValue.push([ 10 * h, 10 * h, 10 * h ]);
this.m_ariChooseType.push(r.FourOne);
return !0;
}
return !1;
}
if (2 == a.length) {
if (c > u && c > a[1]) return !1;
if (a[0] == a[1]) if (u > a[0]) {
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u, 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourOne);
this.m_arariLaiziReplaceValue.push([ 10 * a[0], 10 * a[0] ]);
this.m_ariChooseType.push(r.FourOne);
} else {
this.m_arariLaiziReplaceValue.push([ 10 * a[0], 10 * a[0] ]);
this.m_ariChooseType.push(r.FourOne);
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u, 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourOne);
} else if (u > a[1] && u >= c) {
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u, 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourOne);
if (a[0] >= c) {
this.m_arariLaiziReplaceValue.push([ 10 * a[0], 10 * a[0], 10 * a[0] ]);
this.m_ariChooseType.push(r.FourOne);
} else if (a[1] >= c) {
this.m_arariLaiziReplaceValue.push([ 10 * a[1], 10 * a[1], 10 * a[1] ]);
this.m_ariChooseType.push(r.FourOne);
}
} else if (a[1] > u && a[1] >= c) {
if (a[1] <= 15) {
this.m_arariLaiziReplaceValue.push([ 10 * a[1], 10 * a[1], 10 * a[1] ]);
this.m_ariChooseType.push(r.FourOne);
} else {
if (c > u && c > a[0]) return !1;
if (a[0] >= o.DDZ_XiaoWang) {
if (c > u) return !1;
} else if (a[0] > u) {
this.m_arariLaiziReplaceValue.push([ 10 * a[0], 10 * a[0], 10 * a[0] ]);
this.m_ariChooseType.push(r.FourOne);
} else {
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u, 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourOne);
}
}
if (a[0] >= c && u > a[0] || c <= a[0] && u < c) {
this.m_arariLaiziReplaceValue.push([ 10 * a[0], 10 * a[0], 10 * a[0] ]);
this.m_ariChooseType.push(r.FourOne);
} else if (u >= c && u < a[0] || c > a[0] && u >= c) {
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u, 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourOne);
}
}
return !0;
}
for (var d = !1, p = 0; p < a.length; p++) {
if ((h = a[p]) >= o.DDZ_XiaoWang) break;
if (h >= c && s >= 4 - l[h]) {
if (s > 0) {
(m = new Array(4 - l[h])).fill(10 * h);
this.m_arariLaiziReplaceValue.push(m);
this.m_ariChooseType.push(r.FourOne);
}
c = h;
d = !0;
break;
}
}
for (var f = a.length - 1; f > 0; f--) {
var h;
if ((h = a[f]) <= c) break;
if (!(h >= o.DDZ_XiaoWang)) {
if (s >= 4 - l[h] && s > 0) {
var m;
(m = new Array(4 - l[h])).fill(10 * h);
this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, m);
this.m_ariChooseType.push(r.FourOne);
}
break;
}
}
return d;
};
e.isFourTwo = function(e, t) {
void 0 === t && (t = 0);
if (8 != e.length) return !1;
var i = this.getCardsInfo(e), a = i.cleanCards, s = i.laiNum, l = i.cardsCountArr, c = a[0], u = a[a.length - 1];
if (15 == t) return !1;
if (u == o.DDZ_XiaoWang || u == o.DDZ_DaWang) return !1;
var d = n.default.gameInfoDDZ.m_iLaiziValue, p = t + 1;
0 == t && (p = 3);
if (s >= 4) {
if (c == u) {
if (3 == l[c]) {
this.m_arariLaiziReplaceValue.push([ 10 * c ]);
this.m_ariChooseType.push(r.FourTwo);
} else if (4 == l[c]) {
this.m_arariLaiziReplaceValue.push([ 10 * d, 10 * d, 10 * d, 10 * d ]);
this.m_ariChooseType.push(r.FourTwo);
}
return !0;
}
if (l[c] + l[u] + s == 8 && (2 == l[c] || 2 == l[u])) {
if (p > d || p > u) return !1;
if (d > u && d >= p) {
this.m_arariLaiziReplaceValue.push([ 10 * d, 10 * d, 10 * d, 10 * d ]);
this.m_ariChooseType.push(r.FourTwo);
if (c >= p) {
this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ]);
this.m_ariChooseType.push(r.FourTwo);
} else if (u >= p) {
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourTwo);
}
} else if (u > d && u >= p) {
this.m_arariLaiziReplaceValue.push([ 10 * u, 10 * u ]);
this.m_ariChooseType.push(r.FourTwo);
if (c >= p && d > c || d < c && d < p) {
this.m_arariLaiziReplaceValue.push([ 10 * c, 10 * c ]);
this.m_ariChooseType.push(r.FourTwo);
} else if (d >= p && d < c || d > c && d >= p) {
this.m_arariLaiziReplaceValue.push([ 10 * d, 10 * d, 10 * d, 10 * d ]);
this.m_ariChooseType.push(r.FourTwo);
}
}
return !0;
}
}
for (var f = !1, h = [], m = 0; m < a.length; m++) {
var y = a[m];
h = [];
var g = a.concat([]), _ = s;
if (y >= o.DDZ_XiaoWang) break;
if (y >= p && _ >= 4 - l[y]) {
if (_ > 0) {
var v = new Array(4 - l[y]);
_ -= 4 - l[y];
v.fill(10 * y);
h = v.concat([]);
}
g.splice(g.indexOf(y), l[y]);
m += l[y] - 1;
if (0 == g.length) {
f = !0;
p = y + 1;
break;
}
if (g[0] == g[g.length - 1]) {
f = !1;
break;
}
if (l[g[0]] + l[g[g.length - 1]] + _ == 4) {
for (var C = 0; C < g.length; C++) {
if (1 == l[g[C]] || 3 == l[g[C]]) {
if (!(_ > 0)) {
f = !1;
break;
}
_--;
h.push(10 * g[C]);
C += l[g[C]] - 1;
f = !0;
} else f = !0;
p = y + 1;
}
break;
}
}
}
if (f && s > 0) {
this.m_arariLaiziReplaceValue.push(h);
this.m_ariChooseType.push(r.FourTwo);
}
for (var b = !1, D = a.length - 1; D > 0; D--) {
if ((y = a[D]) < p) break;
if (!(y >= o.DDZ_XiaoWang)) {
h = [];
g = a.concat([]);
var S = s;
if (S >= 4 - l[y]) {
if (S > 0) {
v = new Array(4 - l[y]);
S -= 4 - l[y];
v.fill(10 * y);
h = v.concat([]);
}
g.splice(g.indexOf(y), l[y]);
if (0 == g.length) {
b = !0;
break;
}
if (g[0] == g[g.length - 1]) {
1 != l[g[0]] && 3 != l[g[0]] || h.push(10 * g[0]);
f = !0;
b = !0;
break;
}
if (l[g[0]] + l[g[g.length - 1]] + S == 4) {
for (C = 0; C < g.length; C++) if (1 == l[g[C]] || 3 == l[g[C]]) {
if (!(S > 0)) {
b = !1;
break;
}
S--;
h.push(10 * g[C]);
C += l[g[C]] - 1;
b = !0;
} else b = !0;
break;
}
}
}
}
if (b && s > 0) {
this.m_arariLaiziReplaceValue.splice(this.m_arariLaiziReplaceValue.length - 1, 0, h);
this.m_ariChooseType.push(r.FourTwo);
}
return f;
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
e.compare = function(e, t, o) {
void 0 === o && (o = !1);
var r = this.value(e), i = this.value(t), a = n.default.gameInfoDDZ.m_iLaiziValue;
if (r !== i) {
1 == a ? a = 14 : 2 == a && (a = 15);
return i == a ? i : r == a ? -r : i - r;
}
if (o) {
var s = this._color(e), l = this._color(t);
if (s !== l) return l - s;
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
for (var o = 0, r = e.length - 1; r >= 0; r--) if (190 == e[r] || this.isLaizi(Math.floor(e[r] / 10))) {
var i = 0;
190 == e[r] && (i += 5);
o < this.m_arariLaiziReplaceValue[t].length ? e[r] = this.m_arariLaiziReplaceValue[t][o++] : 190 == e[r] && 0 != n.default.gameInfoDDZ.m_iLaiziValue && (e[r] = 10 * n.default.gameInfoDDZ.m_iLaiziValue);
14 == Math.floor(e[r] / 10) ? e[r] = 10 : 15 == Math.floor(e[r] / 10) && (e[r] = 20);
e[r] += i;
}
return e;
};
e.MainAuxiliaryOrder = function(e, t) {
switch (e) {
case 3:
if (1 == Math.floor(t[0] / 10)) {
t.push(t[0]);
t.splice(0, 1);
}
break;

case 4:
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[1] / 10)) {
t.push(t[0], t[1]);
t.splice(0, 2);
}
break;

case 6:
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[2] / 10)) {
t.push(t[0], t[1], t[2]);
t.splice(0, 3);
}
break;

case 7:
if (Math.floor(t[0] / 10) != Math.floor(t[1] / 10)) {
t.push(t[0]);
t.shift();
}
break;

case 9:
if (Math.floor(t[0] / 10) != Math.floor(t[2] / 10)) {
t.push(t[0], t[1]);
t.splice(0, 2);
}
break;

case 8:
var o = [], n = t.length, r = n / 4;
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[2] / 10)) {
t.push(t[0], t[1], t[2]);
t.splice(0, 3);
}
for (var i = n - 1; i >= 2; i--) if (2 != Math.floor(t[i] / 10) && Math.floor(t[i] / 10) == Math.floor(t[i - 2] / 10)) {
if (i >= 3 && 0 == r && Math.floor(t[i] / 10) == Math.floor(t[i - 3] / 10)) {
cc.log("放到后面", r);
break;
}
o.unshift(t[i], t[i - 1], t[i - 2]);
t.splice(i - 2, 3);
i -= 2;
r--;
}
t = o.concat(t);
break;

case 10:
o = [];
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[2] / 10) && 1 != Math.floor(t[3] / 10)) {
t.push(t[0], t[1], t[2]);
t.splice(0, 3);
}
for (i = t.length - 1; i >= 2; i--) if (i >= 3 && Math.floor(t[i] / 10) == Math.floor(t[i - 3] / 10)) i -= 3; else if (2 != Math.floor(t[i] / 10) && Math.floor(t[i] / 10) == Math.floor(t[i - 2] / 10)) {
o.unshift(t[i], t[i - 1], t[i - 2]);
t.splice(i - 2, 3);
i -= 2;
}
t = o.concat(t);
break;

case 12:
case 14:
if (1 == Math.floor(t[0] / 10) && 1 == Math.floor(t[3] / 10) || 2 == Math.floor(t[0] / 10) && 2 == Math.floor(t[3] / 10)) break;
var a = [];
for (i = t.length - 1; i >= 4; i--) if (Math.floor(t[i] / 10) == Math.floor(t[i - 3] / 10)) {
a = t.splice(i - 3, 4);
t.unshift(a[3], a[2], a[1], a[0]);
break;
}
}
return t;
};
e.compareToPut = function(e, t, o) {
if (o == r.KINGBOMB) return !1;
if (e.length != t.length && 2 != e.length && 4 != e.length) return !1;
var n = this.getMainCardValue(t, o), i = this.oneHandType(e, o, n);
if (i == r.KINGBOMB) return 100;
if (i[0] === r.Error) return -1;
var a = e.concat([]);
if (1 == this.m_arariLaiziReplaceValue.length) {
(a = this.ArrayReplaceLaiziCards(a, 0)).sort(function(e, t) {
return e - t;
});
a = this.MainAuxiliaryOrder(i, a);
} else if (i == r.FeiJiOne || i == r.FeiJiTwo) {
a.sort(function(e, t) {
return e - t;
});
a = this.MainAuxiliaryOrder(i, a);
}
if (this.m_arariLaiziReplaceValue.length > 1) return 10;
var s = this.getMainCardValue(a, i);
return i == o ? e.length === t.length ? s - n : -1 : o == r.HardBomb ? -1 : i == r.HardBomb || i == r.SoftBomb ? 100 : -1;
};
e.getMainCardValue = function(e, t) {
if (0 == t) return 0;
var o = 190;
if (t == r.ThreeOne || t == r.ThreeTwo || t == r.FourOne) {
return this.value(e[2]);
}
if (t == r.FeiJiOne || t == r.FeiJiTwo) {
return this.value(e[0]);
}
if (t == r.FourTwo) return this.value(e[7]) == this.value(e[4]) ? this.value(e[0]) == this.value(e[3]) && this.value(e[0]) > this.value(e[7]) ? this.value(e[0]) : this.value(e[7]) : this.value(e[2]);
for (var n = 0; n < e.length; n++) {
var i = this.value(e[n]);
o > i && (o = i);
}
return o;
};
e.isValid = function(e, t) {
return this.oneHandType(e) !== r.Error;
};
e.oneHandType = function(e, t, o) {
void 0 === t && (t = 0);
void 0 === o && (o = 0);
this.m_ariChooseType = [];
this.m_arariLaiziReplaceValue = [];
var i = this.transCards(e), a = i.length;
if (1 === a && this.isSingle(i)) return r.Single;
if (2 === a) {
if (this.isDuizi(i)) return r.Double;
if (this.isHuoJian(i)) return r.KINGBOMB;
}
if (3 === a && this.isThree(i)) return r.Three;
if (4 === a) {
if (this.isHardBomb(i)) return r.HardBomb;
if (this.isSoftBomb(i)) return r.SoftBomb;
if (this.isThreeOne(i, o)) return r.ThreeOne;
}
if (a >= 5) {
if (t > 0) switch (t) {
case r.ShunZi:
return this.isShunzi(i, o) ? r.ShunZi : r.Error;

case r.ThreeTwo:
return this.isThreeTwo(i, o) ? r.ThreeTwo : r.Error;

case r.LianDui:
return this.isLiandui(i, o) ? r.LianDui : r.Error;

case r.FeiJi:
return this.isFeiJi(i, o) ? r.FeiJi : r.Error;

case r.FeiJiOne:
return this.isFeiJiOne(i, o) ? r.FeiJiOne : r.Error;

case r.FeiJiTwo:
return this.isFeiJiTwo(i, o) ? r.FeiJiTwo : r.Error;

case r.FourOne:
return this.isFourOne(i, o) ? r.FourOne : r.Error;

case r.FourTwo:
return this.isFourTwo(i, o) ? r.FourTwo : r.Error;
}
var s = !1;
n.default.gameInfoDDZ.m_bTriplePair && (s = this.isThreeTwo(i));
var l = this.isShunzi(i), c = this.isFeiJi(i), u = this.isLiandui(i), d = this.isFourOne(i), p = !1;
n.default.gameInfoDDZ.m_bTriplePair && (p = this.isFourTwo(i));
var f = !1;
c || (f = this.isFeiJiOne(i));
var h = !1;
n.default.gameInfoDDZ.m_bTriplePair && (h = this.isFeiJiTwo(i));
if (u) return r.LianDui;
if (c) return r.FeiJi;
if (p) return r.FourTwo;
if (d) return r.FourOne;
if (h) return r.FeiJiTwo;
if (f) return r.FeiJiOne;
if (s) return r.ThreeTwo;
if (l) return r.ShunZi;
}
return r.Error;
};
e.DDZTip = function(e, t, o, n, i) {
void 0 === n && (n = !1);
void 0 === i && (i = !1);
var a = this._cards2CountArr(e);
return o === r.Error ? s.tipNull(e, a) : o === r.Single ? s.tipSingle(e, t, a) : o === r.Double ? s.tipDouble(e, t, a) : o === r.ShunZi ? s.tipShunZi(e, t, t.length, a) : o === r.LianDui ? s.tipLianDui(e, t, t.length / 2, a) : o === r.Three ? s.tipThree(e, t, a) : o === r.FeiJi ? s.tipFeiJi(e, t, t.length, a) : o === r.ThreeOne ? s.tipThreeOne(e, t, a) : o === r.FeiJiOne ? s.tipFeiJiOne(e, t, t.length, a) : o === r.ThreeTwo ? s.tipThreeTwo(e, t, a) : o === r.FeiJiTwo ? s.tipFeiJiTwo(e, t, t.length, a) : o === r.FourOne ? s.tipFourOne(e, t, a) : o === r.FourTwo ? s.tipFourTwo(e, t, a) : o === r.SoftBomb ? s.tipSoftBomb(e, t, a) : o === r.HardBomb ? s.tipHardBomb(e, t, a) : o === r.KINGBOMB ? s.tipKingBomb(e, t, a) : {
tips: [],
invalids: []
};
};
return e;
}();
o.default = i;
var a = require("./DDZMyRoundTipCtr"), s = function() {
function e() {}
e._tipSingle = function(e, t, n) {
void 0 === n && (n = 0);
var r = [];
r[0] = [];
r[1] = [];
r[2] = [];
r[3] = [];
var s = [];
JSON.parse(JSON.stringify(e)).forEach(function(e) {
if (i.isLaizi(e.value)) 0 == s.length && e.value != o.DDZ_HuaPai && 0 != n && e.value > n && s.push([ e ]); else if (e.value > n) {
var a = t[e.value], l = r[a - 1].length, c = r[a - 1][l - 1];
if (!c || c[0].value !== e.value) {
4 == a && (e.index = e.index + 3);
r[a - 1].push([ e ]);
}
}
});
s.length > 0 && a.SetTipIndex(1);
return s.concat(r[0].reverse()).concat(r[1].reverse()).concat(r[2].reverse()).concat(r[3].reverse());
};
e._tipDouble = function(e, t, o, n) {
void 0 === n && (n = 0);
var r = [], i = [], s = [];
e.forEach(function(t, a) {
if (t.value > n) {
var l = o[t.value];
if (2 === l) {
var c = r.length;
(u = r[c - 1]) && u[0].value === t.value || r.push([ t, e[a + 1] ]);
}
if (3 == l) {
c = i.length;
(u = i[c - 1]) && u[0].value === t.value || i.push([ t, e[a + 1] ]);
}
if (4 == l) {
var u;
c = s.length;
(u = s[c - 1]) && u[0].value === t.value || s.push([ t, e[a + 1] ]);
}
}
});
var l = [];
if (0 != n && t.length > 0) {
for (var c = this._tipSingle(e, o, n), u = 0; u < c.length; u++) if (c[u][0].value <= 15) {
c[u].push(t[0]);
l.push(c[u]);
}
t >= 2 && 0 != n && l.push([ t[0], t[1] ]);
a.SetTipIndex(l.length);
}
return l.concat(r.reverse()).concat(i.reverse()).concat(s.reverse());
};
e._tipThree = function(e, t, o, r) {
void 0 === r && (r = 0);
for (var i = [], s = [].concat(e), l = t.length, c = [], u = [], d = [], p = r + 1; p <= 15; p++) {
var f = p, h = o[f], m = this._getCardsIndex(s, f);
3 == h ? i.push([ e[m[0]], e[m[1]], e[m[2]] ]) : 4 == h && c.push([ e[m[0]], e[m[1]], e[m[2]] ]);
r > 0 && (2 == h && l >= 1 ? d.push([ e[m[0]], e[m[1]], t[0] ]) : 1 == h && l >= 2 && u.push([ e[m[0]], t[0], t[1] ]));
}
var y = [];
y = i.concat(c);
if (r > 0) {
l >= 3 && n.default.gameInfoDDZ.m_iLaiziValue > r && u.push([ t[0], t[1], t[2] ]);
y = d.concat(u).concat(y);
a.SetTipIndex(u.length + d.length);
}
return y;
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
var s = this;
void 0 === i && (i = 1);
var l = [], c = [];
if (n + (r - 1) / i === 14) return [];
for (var u = [].concat(e), d = function(e) {
for (var n = [], i = 0, a = 0; a < r; a++) {
var d = e + a;
if (!(d >= 15)) {
if (o[d] > 0) n.push(d); else {
i++;
n.push(0);
}
}
}
if (0 === i) {
var p = [];
n.forEach(function(e) {
var t = s._getCards(u, e);
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
var o = s._getCards(u, e);
f.push(o);
} else f.push(t[h++]);
});
if (f.length === r) {
f.reverse();
c.push(f);
}
}
}, p = n + 1; p <= 14; p++) d(p);
a.SetTipIndex(c.length);
return c.concat(l);
};
e._tipLiandui = function(e, t, o, n, r, i) {
void 0 === i && (i = 1);
var s = r / 2, l = [], c = [ [], [], [], [], [] ], u = t.length;
if (n + (s - 1) / i === 14) return [];
for (var d = n + 1; d <= 14; d++) {
for (var p = [], f = 0, h = 0; f < s; f++) {
var m = d + f, y = o[m];
if (m >= 15) break;
var g = this._getCardsIndex(e, m);
if (y >= 2) {
p.push(e[g[0]]);
p.push(e[g[1]]);
}
if (1 === y) {
if (!(u - h > 0)) break;
p.push(e[g[0]]);
p.push(t[h++]);
}
if (0 === y) {
if (!(u - h > 1)) break;
p.push(t[h++]);
p.push(t[h++]);
}
}
f == s && (0 != h ? c[h - 1].push(p) : l.push(p));
}
for (var _ = [], v = 0; v < 5; v++) _ = _.concat(c[v]);
a.SetTipIndex(_.length);
return l.concat(_);
};
e._tipSoftBomb = function(e, t, r, i) {
void 0 === i && (i = 0);
for (var a = [], s = 0; s < t.length; s++) {
var l = [];
switch (s) {
case 0:
l = this._tipThree(e, t, r);
for (var c = 0; c < l.length; c++) if (l[c][0].value > i) {
l[c].push(t[0]);
a.push(l[c]);
}
break;

case 1:
l = this._tipDouble(e, t, r);
for (c = 0; c < l.length; c++) if (l[c][0].value > i) {
l[c].push(t[0], t[1]);
a.push(l[c]);
}
break;

case 2:
l = this._tipSingle(e, r);
for (c = 0; c < l.length; c++) if (l[c][0].value <= 15 && l[c][0].value > i) {
l[c].push(t[0], t[1], t[2]);
a.push(l[c]);
}
break;

case 3:
t[0].value == o.DDZ_HuaPai && n.default.gameInfoDDZ.m_iLaiziValue > i && a.push([ t[0], t[1], t[2], t[3] ]);
}
}
return a;
};
e._tipHardBomb = function(e, t, r, i) {
void 0 === i && (i = 0);
for (var a = [], s = t.length, l = i + 1; l <= 15; l++) {
var c = [], u = l, d = r[u], p = this._getCardsIndex(e, u);
if (4 === d) for (var f = 0; f < 4; f++) c.push(e[p[f]]);
c.length > 0 && a.push(c);
}
s >= 4 && n.default.gameInfoDDZ.m_iLaiziValue > i && (t[0].value != o.DDZ_HuaPai ? a.push([ t[0], t[1], t[2], t[3] ]) : s > 4 && a.push([ t[1], t[2], t[3], t[4] ]));
return a;
};
e._tipKingBomb = function(e, t, o) {
for (var n = [], r = [], i = [ 170, 180 ], a = [].concat(e), s = 0; s < i.length; s++) {
var l = i[s], c = o[l], u = this._getCards(a, l);
c > 0 && r.push(u);
}
2 == r.length && n.push(r);
return n;
};
e._tipFoueOne = function(e, t, o, n) {
var r = [];
if (e.length < 6) return r;
var i = this._tipHardBomb(e, t, o, n);
i = i.concat(this._tipSoftBomb(e, t, o, n));
a.SetTipIndex(i.length);
for (var s = 0; s < i.length; s++) {
var l = [].concat(i[s]), c = JSON.parse(JSON.stringify(e)), u = JSON.parse(JSON.stringify(t)), d = JSON.parse(JSON.stringify(o));
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
var i = this._tipHardBomb(e, t, o, n);
i = i.concat(this._tipSoftBomb(e, t, o, n));
for (var s = 0; s < i.length; s++) {
var l = [].concat(i[s]), c = JSON.parse(JSON.stringify(e)), u = JSON.parse(JSON.stringify(t)), d = JSON.parse(JSON.stringify(o));
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
a.SetTipIndex(r.length);
return r;
};
e._tipFeiJi = function(e, t, o, n, r) {
var i = r / 3, s = [], l = t.length, c = [ [], [], [], [], [] ];
if (n + (i - 1) === 14) return [];
if (e.length + t.length < r) return [];
for (var u = n + 1; u <= 14; u++) {
for (var d = [], p = 0, f = 0; p < i; p++) {
var h = u + p, m = o[h];
if (h >= 15) break;
var y = this._getCardsIndex(e, h);
if (m >= 3) {
d.push(e[y[0]]);
d.push(e[y[1]]);
d.push(e[y[2]]);
} else {
if (3 - m > l - f) break;
if (1 == m) {
d.push(e[y[0]]);
d.push(t[f++]);
d.push(t[f++]);
}
if (2 == m) {
d.push(e[y[0]], e[y[1]]);
d.push(t[f++]);
}
if (0 == m) {
d.push(t[f++]);
d.push(t[f++]);
d.push(t[f++]);
}
}
}
p == i && (0 == f ? s.push(d) : c[f].push(d));
}
for (var g = [], _ = 0; _ < 5; _++) g = g.concat(c[_]);
a.SetTipIndex(g.length);
return [].concat(g).concat(s);
};
e.RemoveLeftCards = function(e, t, o, n) {
for (var r = 0; r < n.length; r++) {
if (i.isLaizi(n[r].value)) {
for (var a = 0; a < t.length; a++) if (t[a].index == n[r].index) {
t.splice(a, 1);
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
if (h.length < m) for (var y = 0; y < m; y++) c.push(f[y]); else for (y = 0; y < m; y++) c.push(h[y][0]);
i.push(c);
}
return i;
};
e._tipFeijiTwo = function(e, t, o, n, r) {
var i = [];
if (e.length + t.length < r) return i;
var s = r / 5 * 3, l = this._tipFeiJi(e, t, o, n, s);
if (0 == l.length) return i;
for (var c = 0, u = 0; u < l.length; u++) {
var d = [].concat(l[u]), p = JSON.parse(JSON.stringify(e)), f = JSON.parse(JSON.stringify(t)), h = JSON.parse(JSON.stringify(o));
this.RemoveLeftCards(p, f, h, d);
for (var m = this._tipDouble(p, f, h, 0), y = s / 3, g = 0; g < m.length; g++) {
if (4 == h[m[g][0].value] && y >= 2) {
var _ = JSON.parse(JSON.stringify(m[g][0])), v = JSON.parse(JSON.stringify(m[g][0]));
_.index = _.index + 2;
v.index = v.index + 3;
d.push(m[g][0], m[g][1], _, v);
y -= 2;
} else {
d.push(m[g][0], m[g][1]);
y--;
}
if (0 == y) {
i.push(d);
f.length != t && c++;
break;
}
}
}
a.SetTipIndex(c);
return i;
};
e._getCards = function(e, t) {
for (var o = 0; o < e.length; o++) if (e[o].value === t) return e[o];
};
e._getCardsIndex = function(e, t) {
for (var o = [], n = 0; n < e.length; n++) e[n].value === t && o.push(n);
return o;
};
e.getTips = function(e, t, o) {
if (e == r.KINGBOMB) return [];
for (var n = [], s = [ r.SoftBomb, r.HardBomb, r.KINGBOMB ], l = [], c = 0; c < t.length; c++) {
var u = {
value: i.value(t[c]),
index: c
};
l.push(u);
}
var d = i.value(o[0]), p = i.getCardsInfo(i.transCards(t)).cardsCountArr, f = o.length || 1, h = [], m = JSON.parse(JSON.stringify(l));
for (c = m.length - 1; c >= 0; c--) if (i.isLaizi(m[c].value)) {
u = {
value: m[c].value,
index: m[c].index
};
h.push(u);
m.splice(c, 1);
}
a.SetTipIndex(0);
if (e === r.Single) {
var y = this._tipSingle(l, p, d);
n = n.concat(y);
}
if (e === r.Double) {
var g = this._tipDouble(m, h, p, d);
n = n.concat(g);
}
if (e === r.ShunZi) {
var _ = this._tipShunzi(m, h, p, d, f);
n = n.concat(_);
}
if (e === r.LianDui) {
var v = this._tipLiandui(m, h, p, d, f);
n = n.concat(v);
}
if (e === r.Three) {
var C = this._tipThree(m, h, p, d);
n = n.concat(C);
}
if (e === r.FeiJi) {
var b = this._tipFeiJi(m, h, p, d, f);
n = n.concat(b);
}
if (e === r.ThreeOne) {
var D = this._tipThreeOne(m, h, p, d);
n = n.concat(D);
}
if (e === r.FeiJiOne) {
var S = this._tipFeijiOne(m, h, p, d, f);
n = n.concat(S);
}
if (e === r.ThreeTwo) {
var w = this._tipThreeTwo(m, h, p, d);
n = n.concat(w);
}
if (e === r.FeiJiTwo) {
var O = this._tipFeijiTwo(m, h, p, d, f);
n = n.concat(O);
}
if (e === r.FourOne) {
var P = this._tipFoueOne(m, h, p, d);
n = n.concat(P);
}
if (e === r.FourTwo) {
var I = this._tipFoueTwo(m, h, p, d);
n = n.concat(I);
}
if (e === r.SoftBomb) {
var R = this._tipSoftBomb(m, h, p, d);
n = n.concat(R);
var k = this._tipHardBomb(m, h, p);
n = n.concat(k);
}
if (e === r.HardBomb) {
k = this._tipHardBomb(m, h, p, d);
n = n.concat(k);
}
if (!s.includes(e)) {
var j = this._tipSoftBomb(m, h, p), L = this._tipHardBomb(m, h, p);
n = n.concat(L).concat(j);
}
var U = this._tipKingBomb(m, h, p);
n = n.concat(U);
var N = [];
for (c = 0; c < n.length; c++) {
var T = n[c], M = [];
if (T) {
for (var E = 0; E < T.length; E++) {
var x = T[E];
x && M.push(x.index);
}
N.push(M);
}
}
return N;
};
e.tipNull = function(e, t) {
var o = [], n = [].concat(e);
o[0] = this.getTips(r.Single, n, [ 0 ]);
o[1] = this.getTips(r.Double, n, [ 0, 0 ]);
o[2] = [];
o[3] = [];
return {
tips: o = [].concat.apply([], o),
invalids: []
};
};
e.tipSingle = function(e, t, o) {
return {
tips: this.getTips(r.Single, e, t),
invalids: []
};
};
e.tipDouble = function(e, t, o) {
return {
tips: this.getTips(r.Double, e, t),
invalids: []
};
};
e.tipShunZi = function(e, t, o, n) {
return {
tips: this.getTips(r.ShunZi, e, t),
invalids: []
};
};
e.tipLianDui = function(e, t, o, n) {
return {
tips: this.getTips(r.LianDui, e, t),
invalids: []
};
};
e.tipThree = function(e, t, o) {
return {
tips: this.getTips(r.Three, e, t),
invalids: []
};
};
e.tipThreeOne = function(e, t, o) {
return {
tips: this.getTips(r.ThreeOne, e, t),
invalids: []
};
};
e.tipThreeTwo = function(e, t, o) {
return {
tips: this.getTips(r.ThreeTwo, e, t),
invalids: []
};
};
e.tipFourOne = function(e, t, o) {
return {
tips: this.getTips(r.FourOne, e, t),
invalids: []
};
};
e.tipFourTwo = function(e, t, o) {
return {
tips: this.getTips(r.FourTwo, e, t),
invalids: []
};
};
e.tipFeiJi = function(e, t, o, n) {
return {
tips: this.getTips(r.FeiJi, e, t),
invalids: []
};
};
e.tipFeiJiOne = function(e, t, o, n) {
return {
tips: this.getTips(r.FeiJiOne, e, t),
invalids: []
};
};
e.tipFeiJiTwo = function(e, t, o, n) {
return {
tips: this.getTips(r.FeiJiTwo, e, t),
invalids: []
};
};
e.tipSoftBomb = function(e, t, o) {
return {
tips: this.getTips(r.SoftBomb, e, t),
invalids: []
};
};
e.tipHardBomb = function(e, t, o) {
return {
tips: this.getTips(r.HardBomb, e, t),
invalids: []
};
};
e.tipLaiBomb = function(e, t, o) {
return {
tips: this.getTips(r.HardBomb, e, t),
invalids: []
};
};
e.tipKingBomb = function(e, t, o) {
return {
tips: this.getTips(r.KINGBOMB, e, t),
invalids: []
};
};
return e;
}();
cc._RF.pop();
