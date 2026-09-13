// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d474eN+YRlLIJBgvUQr77oU", "DBDCardUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
(function(e) {
e[e.Hei = 4] = "Hei";
e[e.Hong = 3] = "Hong";
e[e.Mei = 2] = "Mei";
e[e.Fang = 1] = "Fang";
})(o.eDBDCardColor || (o.eDBDCardColor = {}));
o.DBD_XiaoWang = 170;
o.DBD_DaWang = 180;
o.DBD_Hua = 190;
o.DBD_HIDE_ID = 0;
var n;
(function(e) {
e[e.Error = 0] = "Error";
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.ShunZi = 3] = "ShunZi";
e[e.LianDui = 4] = "LianDui";
e[e.BOMB = 6] = "BOMB";
e[e.threeBOMB = 7] = "threeBOMB";
e[e.SOFTBOMB = 8] = "SOFTBOMB";
e[e.HARDBOMB = 9] = "HARDBOMB";
e[e.KINGBOMB = 14] = "KINGBOMB";
})(n = o.eDBDOneHandType || (o.eDBDOneHandType = {}));
var r = function() {
function e() {}
e.isHide = function(e) {
return e === o.DBD_HIDE_ID;
};
e.imgPath = function(e, t) {
void 0 === t && (t = !1);
var n = this._color(e), r = this.value(e), i = n, a = r.toString(16);
if (r === o.DBD_XiaoWang) {
i = 5;
a = "e";
!0;
}
if (r === o.DBD_DaWang) {
i = 5;
a = "f";
!0;
}
if (r === o.DBD_Hua) {
i = 5;
a = "h";
!0;
}
if (14 === r) {
a = 1..toString(16);
}
if (15 === r) {
a = 2..toString(16);
}
return "Games/Poker/card_" + i + a;
};
e._color = function(e) {
return e % 10;
};
e.value = function(e) {
if (this.isLaizi(e)) return e;
var t = Math.floor(e / 10);
return 1 === t ? 14 : 2 === t ? 15 : t;
};
e.isLaizi = function(e) {
return e === o.DBD_XiaoWang || e === o.DBD_DaWang || e === o.DBD_Hua;
};
e.soundName = function(e, t) {
var o = this.value(t);
return 14 === o ? e + "1" : 15 === o ? e + "2" : e + o;
};
e._cards2CountArr = function(e) {
var t = Array(17);
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
e.isIncludLaizi = function(e) {
var t = this;
e.forEach(function(e) {
if (t.isLaizi(e)) return !0;
});
return !1;
};
e.isAllLaiCards = function(e) {
if (e.length <= 0) return !1;
for (var t = 0, o = 0; o < e.length; o++) {
var n = e[o];
this.isLaizi(n) && t++;
}
return t === e.length;
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
for (var t = this.checkLaiziNum(e), o = this.getCardsWithoutLaizi(e), n = [], r = 1; r < 17; r++) n[r] = 0;
o.forEach(function(e) {
n[e]++;
});
return {
laiNum: t,
cleanCards: o,
cardsCountArr: n
};
};
e.getAllPosibleLaiCards = function(e, t, o) {
var r = this, i = [].concat(e), a = [], s = [];
i.forEach(function(e, t) {
if (r.isLaizi(e)) a.push(e); else {
var o = r.value(e);
a.push(o);
}
});
if (t === n.Double || t === n.BOMB || t === n.threeBOMB || t === n.HARDBOMB || t === n.SOFTBOMB) {
var l = [], c = 0;
a.forEach(function(e) {
r.isLaizi(e) || (c = e);
});
for (var u = 0; u < e.length; u++) l.push(c);
s.push(l);
}
if (t === n.LianDui) {
s = this.getAllPosiblesOfLiandui(a, o);
i.length % 2 != 0 && (s = []);
}
if (t === n.ShunZi) {
s = this.getAllPosiblesOfShunzi(a, o);
i.length < 4 && (s = []);
}
return s;
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
var c = o + l;
if (0 === i[c]) {
r++;
s.push(0);
} else s.push(c);
}
if (0 === r) s[0] > t && !s.includes(15) && a.push(s); else if (r <= n) {
var u = [];
s.forEach(function(e, t) {
if (0 !== e) u.push(e); else {
var n = u[u.length - 1];
n ? u.push(n + 1) : u.push(o);
}
});
u[0] > t && !u.includes(15) && a.push(u);
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
return 1 === e.length && !this.isAllLaiCards(e);
};
e.isDuizi = function(e) {
return !this.isAllLaiCards(e) && 2 === e.length && (1 == this.checkLaiziNum(e) || this.isAllEqual(e));
};
e.isShunzi = function(e) {
if (e.length < 4 || e.length > 12) return !1;
var t = this.getCardsInfo(e), o = t.cleanCards, n = t.laiNum, r = t.cardsCountArr, i = o[0], a = o[o.length - 1];
if (3 === n && 4 === e.length && 15 !== a) return !0;
if (i === a || o.includes(15)) return !1;
for (var s = 0; s < o.length; s++) if (o[s] === o[s + 1]) return !1;
var l = 0;
for (s = i; s <= a; s++) {
0 === r[s] && l++;
}
return l <= n;
};
e.isLiandui = function(e) {
var t = e.length;
if (t % 2 != 0) return !1;
var o = this.getCardsInfo(e), n = o.cleanCards, r = o.laiNum, i = o.cardsCountArr, a = n[0], s = n[n.length - 1];
if (4 === t && 3 === r && 15 !== a) return !0;
if (n.includes(15)) return !1;
if (a == s && 2 === r && 4 === t) return !0;
for (var l = 0, c = a; c <= s; c++) {
var u = i[c];
if (u > 2) {
l = 999;
break;
}
0 === u ? l += 2 : 1 === u && (l += 1);
}
return l <= r;
};
e.isBomb = function(e) {
if (this.isAllLaiCards(e) && 3 === e.length) return !0;
if (e.length < 3 || e.length > 4 && this.isAllLaiCards(e)) return !1;
var t = this.getCardsWithoutLaizi(e);
return this.isAllEqual(t);
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
e.sortPutCards2 = function(e) {
var t = this;
e.sort(function(e, o) {
var n = t.value(e), r = t.value(o);
if (n !== r) return n - r;
var i = t._color(e), a = t._color(o);
return i !== a ? i - a : 0;
});
return e;
};
e.sortPutShow = function(e, t) {
void 0 === t && (t = [ n.Error ]);
return this.sortPutCards(e);
};
e.compare = function(e, t, o) {
void 0 === o && (o = !1);
var n = this.value(e), r = this.value(t);
if (n !== r) return r - n;
if (o) {
var i = this._color(e), a = this._color(t);
if (i !== a) return a - i;
}
return 0;
};
e.getCardBetween = function(t, o, n) {
return e.compare(t, o) < 0 ? -1 : e.compare(t, n) > 0 ? 1 : 0;
};
e.isValid = function(e, t) {
return !(this.oneHandType(e).indexOf(n.Error) > -1);
};
e.isIncludeBoom = function(e) {
for (var t = [ n.BOMB, n.threeBOMB, n.SOFTBOMB, n.HARDBOMB, n.KINGBOMB ], o = 0; o < t.length; o++) {
var r = t[o];
if (e.includes(r)) return !0;
}
return !1;
};
e.compareToPut = function(e, t, o) {
var r = this.oneHandType(e);
if (this.isIncludeBoom(r) && !this.isIncludeBoom([ o ])) return 1;
if (r[0] === n.Error) return -1;
var i = this.getMinCard(e), a = this.getMinCard(t);
if (r.includes(o) && e.length === t.length) return i - a;
if ([ n.BOMB, n.threeBOMB ].includes(o) && (r.includes(n.BOMB) || r.includes(n.threeBOMB))) return i - a;
for (var s = 0, l = 0; l < r.length; l++) {
var c = r[l];
c > s && (s = c);
}
return [ n.Single, n.Double, n.ShunZi, n.LianDui ].includes(s) ? -1 : s - o;
};
e.getMinCard = function(e) {
for (var t = 190, o = 0; o < e.length; o++) {
var n = this.value(e[o]);
t > n && (t = n);
}
return t;
};
e.checkCardTypeIsValid = function(e, t) {
for (var o = [], r = 0; r < e.length; r++) {
var i = e[r], a = 0;
(i === t || i > t) && (a = i);
t === n.ShunZi && (a = a === n.LianDui ? 0 : a);
a > 0 && o.push(a);
}
return o;
};
e.oneHandType = function(e) {
var t = this, o = (e = this.transCards(e)).length;
if (3 === o && this.isAllLaiCards(e)) return [ n.KINGBOMB ];
if (1 === o && this.isSingle(e)) return [ n.Single ];
if (2 === o && this.isDuizi(e)) return [ n.Double ];
if (3 === o && this.isBomb(e)) {
var r = !1;
e.forEach(function(e) {
t.isLaizi(e) && (r = !0);
});
return r ? [ n.BOMB ] : [ n.threeBOMB ];
}
if (4 === o) {
var i = this.isLiandui(e), a = this.isBomb(e), s = this.isShunzi(e);
if (i && a && s) {
var l = [ n.ShunZi, n.LianDui ], c = this.checkLaiziNum(e) > 0 ? n.SOFTBOMB : n.HARDBOMB;
l.push(c);
return l;
}
if (i && a) {
l = [ n.LianDui ], c = this.checkLaiziNum(e) > 0 ? n.SOFTBOMB : n.HARDBOMB;
l.push(c);
return l;
}
if (s && i) return [ n.ShunZi, n.LianDui ];
if (s) return [ n.ShunZi ];
if (i) return [ n.LianDui ];
if (a) return this.checkLaiziNum(e) > 0 ? [ n.SOFTBOMB ] : [ n.HARDBOMB ];
}
if (o > 4) {
i = this.isLiandui(e), s = this.isShunzi(e);
if (i && s) return [ n.ShunZi, n.LianDui ];
if (s) return [ n.ShunZi ];
if (i) return [ n.LianDui ];
}
return [ n.Error ];
};
e.dbdTip = function(e, t, o, r, a) {
void 0 === r && (r = !1);
void 0 === a && (a = !1);
var s = this._cards2CountArr(e);
return o !== n.Error || r ? o !== n.Single || r ? o === n.Double ? i.tipDouble(e, t, s) : o === n.ShunZi ? i.tipShunZi(e, t, t.length, s) : o === n.LianDui ? i.tipLianDui(e, t, t.length / 2, s) : o === n.BOMB ? i.tipBomb(n.BOMB, e, t, s, a) : o === n.threeBOMB ? i.tipBomb(n.threeBOMB, e, t, s, a) : o === n.SOFTBOMB ? i.tipBomb(n.SOFTBOMB, e, t, s, a) : o === n.HARDBOMB ? i.tipBomb(n.HARDBOMB, e, t, s, a) : {
tips: [],
invalids: []
} : i.tipSingle(e, t, s) : i.tipNull(e, s);
};
e.filterChooseCards = function(e, t, o) {
this._cards2CountArr(e);
return [];
};
e.findMaxShunZiWithClickId = function(e, t, o) {
t[0], t.length, this._cards2CountArr(e);
return [];
};
e.findMinShunZiWithClickId = function(e, t, o) {
t[0], t.length, this._cards2CountArr(e);
return [];
};
e.findMaxShunZi = function(e) {
this._cards2CountArr(e);
return [];
};
return e;
}();
o.default = r;
var i = function() {
function e() {}
e._tipSingle = function(e, t, o) {
var n = [];
n[0] = [];
n[1] = [];
n[2] = [];
n[3] = [];
e.forEach(function(e) {
if (e.value > o) {
var r = t[e.value], i = n[r - 1].length, a = n[r - 1][i - 1];
a && a[0].value === e.value || n[r - 1].push([ e ]);
}
});
return n[0].reverse().concat(n[1].reverse());
};
e._tipDouble = function(e, t, o, n) {
var r = [], i = [];
e.forEach(function(a, s) {
if (a.value > n) {
var l = o[a.value];
1 === l && t.length > 0 && i.push([ a, t[0][0] ]);
if (2 === l) {
var c = r.length, u = r[c - 1];
u && u[0].value === a.value || r.push([ a, e[s + 1] ]);
}
}
});
return r.reverse().concat(i.reverse());
};
e._getCards = function(e, t) {
for (var o = 0; o < e.length; o++) if (e[o].value === t) return e[o];
};
e._tipShunzi = function(e, t, o, n, r, i) {
var a = this;
void 0 === i && (i = 1);
var s = [], l = [];
if (n + (r - 1) / i === 14) return [];
for (var c = [].concat(e), u = function(e) {
for (var n = [], i = 0, u = 0; u < r; u++) {
var d = e + u, p = o[d];
if (!(d >= 15)) if (p > 0) n.push(d); else {
i++;
n.push(0);
}
}
if (0 === i) {
var f = [];
n.forEach(function(e) {
var t = a._getCards(c, e);
f.push(t);
});
if (f.length === r) {
f.reverse();
s.push(f);
}
} else if (i <= t.length) {
var h = [], m = 0;
n.forEach(function(e) {
if (e) {
var o = a._getCards(c, e);
h.push(o);
} else {
h.push(t[m][0]);
m++;
}
});
if (h.length === r) {
h.reverse();
l.push(h);
}
}
}, d = n + 1; d <= 14; d++) u(d);
return s.concat(l);
};
e._getLianDuiCardsIndex = function(e, t) {
for (var o = [], n = 0; n < e.length; n++) e[n].value === t && o.push(e[n].index);
return o;
};
e._tipLiandui = function(e, t, o, n, r, i) {
void 0 === i && (i = 1);
var a = 2 * r, s = [], l = [], c = t.length;
if (n + (r - 1) / i === 14) return [];
for (var u = function(n) {
for (var i = [], u = 0, p = 0; p < r; p++) {
var f = n + p, h = o[f];
if (!(f >= 15)) {
var m = d._getLianDuiCardsIndex(e, f);
if (2 === h) {
i.push(m[0]);
i.push(m[1]);
}
if (1 === h) {
u++;
i.push(m[0]);
i.push(0);
}
if (0 === h) {
u += 2;
i.push(0);
i.push(0);
}
}
}
if (0 === u) {
var y = [];
i.forEach(function(t) {
y.push(e[t - c]);
});
if (y.length === a) {
y.reverse();
s.push(y);
}
} else if (u > 0 && u <= c) {
var g = [], _ = 0;
i.forEach(function(o) {
if (o) g.push(e[o - c]); else {
g.push(t[_][0]);
_++;
}
});
if (g.length === a) {
g.reverse();
l.push(g);
}
}
}, d = this, p = n + 1; p <= 14; p++) u(p);
return s.concat(l);
};
e._tipThreeSoftBomb = function(e, t, o, n) {
var r = [], i = [];
e.forEach(function(a, s) {
var l = o[a.value];
if (a.value > n) if (1 == l && 2 == t.length) {
var c = r.length, u = r[c - 1];
u && u[0].value === a.value || r.push([ a, t[0][0], t[1][0] ]);
} else if (2 === l && 1 == t.length) {
c = i.length;
var d = i[c - 1];
d && d[0].value === a.value || i.push([ a, e[s + 1], t[0][0] ]);
}
});
return r.reverse().concat(i.reverse());
};
e._tipThreeHardBomb = function(e, t, o, n) {
var r = [];
e.forEach(function(t, i) {
var a = o[t.value];
if (t.value > n && 3 == a) {
var s = r.length, l = r[s - 1];
l && l[0].value === t.value || r.push([ t, e[i + 1], e[i + 2] ]);
}
});
return r.reverse();
};
e._tipFourSoftBomb = function(e, t, o, n) {
var r = [], i = [], a = [];
e.forEach(function(s, l) {
var c = o[s.value];
if (s.value > n) if (1 == c && 3 == t.length) {
var u = r.length, d = r[u - 1];
d && d[0].value === s.value || r.push([ s, t[0][0], t[1][0], t[2][0] ]);
} else if (2 === c && 2 == t.length) {
u = i.length;
var p = i[u - 1];
p && p[0].value === s.value || i.push([ s, e[l + 1], t[0][0], t[1][0] ]);
} else if (3 === c && 1 === t.length) {
u = a.length;
var f = a[u - 1];
f && f[0].value === s.value || a.push([ s, e[l + 1], e[l + 2], t[0][0] ]);
}
});
return r.reverse().concat(i.reverse()).concat(a.reverse());
};
e._tipFourHardBomb = function(e, t, o, n) {
var r = [];
e.forEach(function(t, i) {
var a = o[t.value];
if (t.value > n && 4 == a) {
var s = r.length, l = r[s - 1];
l && l[0].value === t.value || r.push([ t, e[i + 1], e[i + 2], e[i + 3] ]);
}
});
return r.reverse();
};
e._tipKingBoom = function(e) {
var t = [];
3 === e.length && t.push([ e[0][0], e[1][0], e[2][0] ]);
return t;
};
e._getNeedBoomCards = function(e, t) {
for (var o = [].concat(e), n = 0; n < o.length; n++) {
o[n][0].value <= t && o.splice(n, 1);
}
return o;
};
e.getTips = function(e, t, o, i, a) {
var s = [], l = [ n.BOMB, n.threeBOMB, n.SOFTBOMB, n.HARDBOMB ], c = [];
t.forEach(function(e, t) {
var o = {
value: r.value(e),
index: t
};
c.push(o);
});
for (var u = [], d = [].concat(c), p = d.length - 1; p >= 0; p--) r.isLaizi(d[p].value) && u.push(d.splice(p, 1));
var f = (o = r.transCards(o))[0], h = r.getCardsInfo(r.transCards(t)).cardsCountArr, m = o.length || 1;
if (e === n.Single) {
s = this._tipSingle(d, h, f);
}
if (e === n.Double) {
s = this._tipDouble(d, u, h, f);
}
if (e === n.ShunZi) {
s = this._tipShunzi(d, u, h, f, m);
}
if (e === n.LianDui) {
s = this._tipLiandui(d, u, h, f, m / 2);
}
if (e === n.BOMB || e === n.threeBOMB) {
var y = this._tipThreeHardBomb(d, u, h, f), g = this._tipThreeSoftBomb(d, u, h, f), _ = this._tipFourHardBomb(d, u, h, 0), v = this._tipFourSoftBomb(d, u, h, 0);
s = s.concat(y).concat(g).concat(_).concat(v);
}
if (e === n.SOFTBOMB) {
y = this._tipFourHardBomb(d, u, h, 0), g = this._tipFourSoftBomb(d, u, h, f);
s = s.concat(y).concat(g);
}
if (e === n.HARDBOMB) {
y = this._tipFourHardBomb(d, u, h, f);
s = s.concat(y);
}
if (!l.includes(e)) {
y = this._tipThreeHardBomb(d, u, h, 0), g = this._tipThreeSoftBomb(d, u, h, 0),
_ = this._tipFourHardBomb(d, u, h, 0), v = this._tipFourSoftBomb(d, u, h, 0);
s = s.concat(y).concat(g).concat(_).concat(v);
}
var C = this._tipKingBoom(u);
s = s.concat(C);
var b = [];
for (p = 0; p < s.length; p++) {
var D = s[p], S = [];
if (D) {
for (var w = 0; w < D.length; w++) {
var O = D[w];
O && S.push(O.index);
}
b.push(S);
}
}
return b;
};
e._newTip = function(e, t) {
for (var o = [], n = 0; n < t; n++) o.push(e - n);
return o;
};
e._filterByList = function(e, t) {
var o = [], n = t.length, i = e.length;
if (n <= 0) return this._newTip(i - 1, i);
for (var a = {}, s = 0, l = t.length; s < l; s++) for (var c = t[s], u = 0, d = c.length; u < d; u++) {
var p = e[c[u]];
a[r.value(p)] = !0;
}
for (s = 0, l = e.length; s < l; s++) {
p = e[s];
a[r.value(p)] || o.push(s);
}
return [];
};
e.tipNull = function(e, t) {
for (var o = [], i = [].concat(e), a = i.length - 1; a >= 0; a--) r.isLaizi(i[a]);
o[0] = this.getTips(n.Single, i, [ 0 ], !1);
o[1] = this.getTips(n.Double, i, [ 0, 0 ], !1);
o[2] = [];
o[3] = [];
for (a = 3; a < 15; a++) {
new Array(a).fill(0);
}
return {
tips: o = [].concat.apply([], o),
invalids: this._filterByList(i, o)
};
};
e.tipSingle = function(e, t, o) {
return {
tips: this.getTips(n.Single, e, t, !1),
invalids: []
};
};
e.tipDouble = function(e, t, o) {
var r = this.getTips(n.Double, e, t, !1);
return {
tips: r,
invalids: this._filterByList(e, r)
};
};
e.tipShunZi = function(e, t, o, r) {
var i = this.getTips(n.ShunZi, e, t, !1);
return {
tips: i,
invalids: this._filterByList(e, i)
};
};
e.tipLianDui = function(e, t, o, r) {
var i = this.getTips(n.LianDui, e, t, !1);
return {
tips: i,
invalids: this._filterByList(e, i)
};
};
e.tipBomb = function(e, t, o, n, r) {
void 0 === r && (r = !1);
var i = this.getTips(e, t, o, r);
return {
tips: i,
invalids: this._filterByList(t, i)
};
};
return e;
}();
cc._RF.pop();
