// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "edc79AUQpBEq43+6Ls1iMTP", "PDKCardUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n;
(function(e) {
e[e.Hei = 4] = "Hei";
e[e.Hong = 3] = "Hong";
e[e.Mei = 2] = "Mei";
e[e.Fang = 1] = "Fang";
})(n = o.ePDKCardColor || (o.ePDKCardColor = {}));
o.PDK_HIDE_ID = 0;
var r, i = 30 + n.Hei;
(function(e) {
e[e.Error = 0] = "Error";
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.ShunZi = 3] = "ShunZi";
e[e.LianDui = 4] = "LianDui";
e[e.FeiJiFull = 5] = "FeiJiFull";
e[e.FeiJiLack = 6] = "FeiJiLack";
e[e.Three = 7] = "Three";
e[e.Three1 = 8] = "Three1";
e[e.Three2 = 9] = "Three2";
e[e.Four3 = 10] = "Four3";
e[e.Four3_AAA = 11] = "Four3_AAA";
e[e.Four2 = 12] = "Four2";
e[e.Four2_AAA = 13] = "Four2_AAA";
e[e.BOMB = 14] = "BOMB";
})(r = o.ePDKOneHandType || (o.ePDKOneHandType = {}));
var a = !1, s = !1, l = !1, c = !1, u = !1, d = function() {
function e() {}
e.setRule = function(e, t, o, n, r) {
a = e;
s = t;
l = o;
c = n;
u = r;
};
e.sortDesc = function(e, t) {
var o = this;
void 0 === t && (t = !1);
e.sort(function(e, n) {
return -o.compare(e, n, t);
});
return e;
};
e.isZhaNiao = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var r = e[t];
if (10 === this.value(r) && this._color(r) === n.Hong) return !0;
}
return !1;
};
e.sortPutCards = function(e) {
var t = this;
e.sort(function(e, o) {
var n = t.value(e), r = t.value(o);
if (n !== r) return n - r;
var i = t._color(e), a = t._color(o);
return i !== a ? a - i : 0;
});
return e;
};
e.sortPutShow = function(e, t) {
var o = [ r.FeiJiFull, r.FeiJiLack, r.Three1, r.Three2 ];
return -1 !== o.indexOf(t) ? this._sortPutShowThreeX(e) : -1 !== (o = [ r.Four3, r.Four2, r.Four2_AAA, r.Four3_AAA ]).indexOf(t) ? this._sortPutShow_FourX(e) : this.sortPutCards(e);
};
e._sortPutShowThreeX = function(e) {
for (var t = [], o = [], n = this._maxSeqInfo(e, 3), r = n.beginValue, i = n.beginValue + n.maxCount - 1, a = {}, s = 0, l = e.length; s < l; s++) {
var c = e[s], u = this.value(c), d = a[u] || 0;
a[u] = d + 1;
u >= r && u <= i ? d >= 3 ? o.push(c) : t.push(c) : o.push(c);
}
this.sortPutCards(t);
this.sortPutCards(o);
return t.concat(o);
};
e._sortPutShow_FourX = function(e) {
for (var t = [], o = [], n = this._cards2CountArr(e), r = 0, i = e.length; r < i; r++) {
var a = e[r], s = this.value(a);
this.isBomb(s, n[s]) ? t.push(a) : o.push(a);
}
this.sortPutCards(t);
this.sortPutCards(o);
return t.concat(o);
};
e.compare = function(e, t, o) {
void 0 === o && (o = !1);
var n = this.value(e), r = this.value(t);
if (n !== r) return n - r;
if (o) {
var i = this._color(e), a = this._color(t);
if (i !== a) return i - a;
}
return 0;
};
e.isValid = function(e, t) {
var o = this.oneHandType(e);
return o !== r.Error && (o !== r.FeiJiLack && o !== r.Three && o !== r.Three1 || !(!c || e.length !== t));
};
e.checkPutWithRuleBombSplit = function(e, t) {
if (u) {
for (var o = [], n = 0, i = e.length; n < i; n++) {
var a = e[n];
o.push(t[a]);
}
var s = this.oneHandType(o);
if (s === r.BOMB || s === r.Four2 || s === r.Four2_AAA || s === r.Four3 || s === r.Four3_AAA) return !0;
var l = this._cards2CountArr(t);
for (n = 0, i = e.length; n < i; n++) {
a = e[n];
if (!this.isCanSplit(a, t, l)) return !1;
}
}
return !0;
};
e.getCardBetween = function(t, o, n) {
return e.compare(t, o) < 0 ? -1 : e.compare(t, n) > 0 ? 1 : 0;
};
e.compareToPut = function(e, t, o) {
var n = this.oneHandType(e);
if (n === r.Error) return -1;
if (n === o) {
if (e.length === t.length || o === r.BOMB) {
var i = this.sortPutShow([].concat(e), n);
return this.compare(i[0], t[0]);
}
return -1;
}
return n === r.BOMB ? 1 : -1;
};
e.maxCount = function(e) {
return this._maxSeqInfo(e).maxCount;
};
e.oneHandType = function(e) {
var t = e.length;
if (t < 1) return r.Error;
if (1 === t) return r.Single;
var o = this._maxSeqInfo(e);
if (2 === t) return 2 === o.maxCount ? r.Double : r.Error;
if (3 === t) return 3 === o.maxCount ? this.isBomb(o.beginValue, o.maxCount) ? r.BOMB : r.Three : r.Error;
if (2 === o.maxCount) return 2 * o.maxLen === t ? r.LianDui : r.Error;
if (4 === t) return 3 === o.maxCount ? this.isBomb(o.beginValue, o.maxCount) ? r.Error : r.Three1 : 4 === o.maxCount ? r.BOMB : r.Error;
if (1 === o.maxCount) return o.maxLen === t ? r.ShunZi : r.Error;
if (5 === t) return 3 === o.maxCount ? this.isBomb(o.beginValue, o.maxCount) ? s ? r.Four2_AAA : r.Error : r.Three2 : r.Error;
if (6 === t) return 3 === o.maxCount ? 1 === o.maxLen ? this.oneHandType([ e[0], e[1], e[2] ]) === r.BOMB && l ? r.Four3_AAA : r.Error : this.isBomb(o.beginValue, o.maxCount) || this.isBomb(o.beginValue + 1, o.maxCount) ? l ? r.Four3_AAA : r.Error : r.FeiJiLack : 4 === o.maxCount && s ? r.Four2 : r.Error;
if (7 === t && 4 === o.maxCount) return l ? r.Four3 : r.Error;
if (3 === o.maxCount && o.maxLen >= 2) return this._getFeJiType(t, o);
if (4 === o.maxCount) {
var n = this._maxSeqInfo(e, 3);
if (3 === n.maxCount && n.maxLen >= 2) return this._getFeJiType(t, n);
}
return r.Error;
};
e._getFeJiType = function(e, t) {
for (var o = 0; o < t.maxLen; o++) {
var n = t.beginValue + o;
if (this.isBomb(n, 3)) return r.Error;
}
for (var i = 2; i <= t.maxLen; i++) {
if (e === 5 * i) return r.FeiJiFull;
if (e < 5 * i) return r.FeiJiLack;
}
return r.Error;
};
e._maxSeqInfo = function(e, t) {
void 0 === t && (t = 4);
for (var o = this._cards2CountArr(e), n = 0, r = 3; r <= 15; r++) o[r] > n && (n = o[r]);
n > t && (n = t);
return this._statisticsCountArr(o, n);
};
e._cards2CountArr = function(e) {
for (var t = [], o = 0; o <= 15; o++) t.push(0);
o = 0;
for (var n = e.length; o < n; o++) {
var r = e[o];
t[this.value(r)]++;
}
return t;
};
e._statisticsCountArr = function(e, t) {
for (var o = function(o) {
for (var n = 0, r = o; r <= 14 && e[r] >= t; r++) n++;
return n;
}, n = 0, r = 0, i = 3; i <= 14; i++) if (e[i] >= t) {
var a = o(i);
if (a > n) {
r = i;
n = a;
}
a > 0 && (i = i + a - 1);
}
if (n < 1 && e[15] >= t) {
n = 1;
r = 15;
}
return {
maxCount: t,
beginValue: r,
maxLen: n
};
};
e.isHide = function(e) {
return e === o.PDK_HIDE_ID;
};
e.isBomb = function(e, t) {
return 4 === t || !(3 !== t || !a || 14 !== e);
};
e.isCanSplit = function(e, t, o) {
if (u) {
var n = t[e], r = this.value(n), i = o[r];
if (this.isBomb(r, i)) return !1;
}
return !0;
};
e.ruleIsCanSplitBomb = function() {
return !u;
};
e.imgPath = function(e) {
return "Games/Poker/card_" + this._color(e) + Math.floor(e / 10).toString(16);
};
e.soundName = function(e, t) {
var o = this.value(t);
return 14 === o ? e + "1" : 15 === o ? e + "2" : e + o;
};
e._color = function(e) {
return e % 10;
};
e.value = function(e) {
var t = Math.floor(e / 10);
return 1 === t ? 14 : 2 === t ? 15 : t;
};
e.valueCount = function(e, t) {
return this._cards2CountArr(e)[t];
};
e.checkHei3 = function(e) {
return -1 !== (e = e || []).indexOf(i);
};
e.tipWithHei3 = function(e) {
var t = this._cards2CountArr(e);
return p.tipNullWithCard(e, t, i);
};
e.findHei3Id = function(e) {
for (var t = e.length - 1; t >= 0; t--) if (e[t] === i) return t;
return -1;
};
e.tip = function(e, t, o, n) {
void 0 === n && (n = !1);
var i = this._cards2CountArr(e);
return o === r.Error ? n ? p.tipNullNextWaring(e, i) : p.tipNull(e, i) : o === r.Single ? n ? p.tipSingleNextWaring(e, t[0], i) : p.tipSingle(e, t[0], i) : o === r.Double ? p.tipDouble(e, t[0], i) : o === r.ShunZi ? p.tipShunZi(e, t[0], t.length, i) : o === r.LianDui ? p.tipLianDui(e, t[0], t.length / 2, i) : o === r.Three2 ? p.tipThree2(e, t[0], i) : o === r.FeiJiFull ? p.tipFeiJi(e, t[0], t.length / 5, i) : o === r.Four2 ? p.tipFour2(e, t[0], i) : o === r.Four3 ? p.tipFour3(e, t[0], i) : o === r.Four2_AAA ? p.tipBomb(e, 0, i) : o === r.Four3_AAA ? p.tipBomb(e, 0, i) : o === r.BOMB ? p.tipBomb(e, t[0], i) : {
tips: [],
invalids: []
};
};
e.filterChooseCards = function(e, t, o) {
var n = this._cards2CountArr(e);
return p.findSunZi(e, n, t, o);
};
e.findMaxShunZiWithClickId = function(e, t, o) {
var n = t[0], r = t.length, i = this._cards2CountArr(e);
return p.findSequenceWithId(e, n, r, 1, i, o, !0);
};
e.findMinShunZiWithClickId = function(e, t, o) {
var n = t[0], r = t.length, i = this._cards2CountArr(e);
return p.findSequenceWithId(e, n, r, 1, i, o, !1);
};
e.findMaxShunZi = function(e) {
var t = this._cards2CountArr(e);
return p.findMaxSequence(e, 5, 1, t);
};
return e;
}();
o.default = d;
var p = function() {
function e() {}
e._filterByList = function(e, t) {
var o = [], n = t.length, r = e.length;
if (n <= 0) return this._newTip(r - 1, r);
for (var i = {}, a = 0, s = t.length; a < s; a++) for (var l = t[a], c = 0, u = l.length; c < u; c++) {
var p = e[l[c]];
i[d.value(p)] = !0;
}
for (a = 0, s = e.length; a < s; a++) {
p = e[a];
i[d.value(p)] || o.push(a);
}
return o;
};
e._bombs = function(e, t, o) {
void 0 === o && (o = 0);
for (var n = [], r = e.length - 1; r >= 0; ) {
var i = e[r], a = d.value(i), s = t[a];
a > o && d.isBomb(a, s) && n.push(this._newTip(r, s));
r -= s;
}
return n;
};
e.tipNull = function(e, t) {
for (var o = [], n = [], r = [], i = [], a = e.length - 1; a >= 0; ) {
var s = e[a], l = d.value(s), c = t[l];
1 === c && o.push(this._newTip(a, 1));
2 === c && n.push(this._newTip(a, 2));
c > 2 && (d.isBomb(l, c) ? i.push(this._newTip(a, c)) : r.push(this._newTip(a, c)));
a -= c;
}
return {
tips: o.concat(n).concat(r).concat(i),
invalids: []
};
};
e.tipNullNextWaring = function(e, t) {
for (var o = [], n = [], r = [], i = e.length - 1; i >= 0; ) {
var a = e[i], s = d.value(a), l = t[s];
2 === l && o.push(this._newTip(i, 2));
l > 2 && (d.isBomb(s, l) ? r.push(this._newTip(i, l)) : n.push(this._newTip(i, l)));
i -= l;
}
var c = [].concat(o).concat(n).concat(r);
d.isCanSplit(0, e, t) && c.push(this._newTip(0, 1));
return {
tips: c,
invalids: []
};
};
e.tipNullWithCard = function(e, t, o) {
var n = e.length - 1, r = [], i = e[n], a = t[d.value(i)];
r.push(this._newTip(n, a));
var s = function() {
for (var t = n; t >= 0; t--) if (e[t] === o) return t;
}, l = this._seqLen(o, 1, t);
if (l >= 5) {
var c = this._newSunZi(n, l, e, t, 1), u = s();
c[0] = u;
r.push(c);
}
var p = this._seqLen(o, 2, t);
if (p >= 2) {
c = this._newSunZi(n, p, e, t, 2), u = s();
c[0] !== u && c[1] !== u && (c[1] = u);
r.push(c);
}
return {
tips: r,
invalids: []
};
};
e.tipSingle = function(e, t, o) {
for (var n = [], r = [], i = this._bombs(e, o), a = e.length - 1; a >= 0; ) {
var s = e[a], l = o[d.value(s)];
d.compare(s, t) > 0 && d.isCanSplit(a, e, o) && (1 === l ? n.push(this._newTip(a, 1)) : r.push(this._newTip(a, 1)));
a -= l;
}
var c = n.concat(r).concat(i);
return {
tips: c,
invalids: this._filterByList(e, c)
};
};
e.tipSingleNextWaring = function(e, t, o) {
var n = [], r = this._bombs(e, o);
if (d.isCanSplit(0, e, o)) {
var i = e[0];
d.value(i) > d.value(t) && n.push(this._newTip(0, 1));
}
return {
tips: n = n.concat(r),
invalids: this._filterByList(e, n)
};
};
e.tipDouble = function(e, t, o) {
for (var n = [], r = [], i = this._bombs(e, o), a = e.length - 1; a >= 0; ) {
var s = e[a], l = o[d.value(s)];
d.compare(s, t) > 0 && d.isCanSplit(a, e, o) && l >= 2 && (2 === l ? n.push(this._newTip(a, l)) : r.push(this._newTip(a, 2)));
a -= l;
}
var c = n.concat(r).concat(i);
return {
tips: c,
invalids: this._filterByList(e, c)
};
};
e.tipShunZi = function(e, t, o, n) {
return this._tipSequence(e, t, o, 1, n);
};
e.tipLianDui = function(e, t, o, n) {
return this._tipSequence(e, t, o, 2, n);
};
e._tipSequence = function(e, t, o, n, r) {
for (var i = [], a = this._bombs(e, r), s = e.length - 1; s >= 0; ) {
var l = e[s], c = r[d.value(l)];
if (d.compare(l, t) > 0) {
this._seqLen(l, n, r) >= o && i.push(this._newSunZi(s, o, e, r, n));
}
s -= c;
}
var u = i.concat(a);
return {
tips: u,
invalids: this._filterByList(e, u)
};
};
e.findSequenceWithId = function(e, t, o, n, r, i, a) {
var s = e[i];
if (d.compare(s, t) <= 0) return null;
for (var l = [], c = e.length - 1; c >= 0; ) {
var u = e[c], p = r[d.value(u)];
if (d.compare(u, t) > 0) {
this._seqLen(u, n, r) >= o && l.push(this._newSunZi(c, o, e, r, n));
}
c -= p;
}
if (a) for (c = l.length - 1; c >= 0; c--) {
var f = e[(y = l[c])[0]], h = e[y[o - 1]];
if (0 === d.getCardBetween(s, f, h)) return y;
} else {
c = 0;
for (var m = l.length; c < m; c++) {
var y;
f = e[(y = l[c])[0]], h = e[y[o - 1]];
if (0 === d.getCardBetween(s, f, h)) return y;
}
}
return null;
};
e.findMaxSequence = function(e, t, o, n) {
for (var r = t - 1, i = null, a = e.length - 1; a >= 0; ) {
var s = e[a], l = n[d.value(s)], c = this._seqLen(s, o, n);
if (c > r) {
r = c;
i = this._newSunZi(a, r, e, n, o);
}
a -= l;
}
return i;
};
e.tipThree2 = function(e, t, o) {
for (var n = d.value(t), r = !1, i = n + 1; i <= 15; i++) if (o[i] >= 3) {
r = !0;
break;
}
var a = this._bombs(e, o);
if (!r) {
return {
tips: a,
invalids: this._filterByList(e, a)
};
}
var s = [];
for (i = e.length - 1; i >= 0; ) {
var l = e[i], c = d.value(l), u = o[c];
3 === u && c > n && !d.isBomb(c, u) && s.push(this._newTip(i, 3));
i -= u;
}
var p = e.length;
if (1 === s.length && p <= 5) {
var f = [ this._newTip(p - 1, p) ];
return {
tips: a.concat(f),
invalids: []
};
}
return {
tips: this._merageAddition2(s, e, o).concat(a),
invalids: []
};
};
e.tipFeiJi = function(e, t, o, n) {
for (var r = [], i = this._bombs(e, n), a = e.length - 1; a >= 0; ) {
var s = e[a], l = n[d.value(s)];
if (d.compare(s, t) > 0) {
if (this._seqLen(s, 3, n) >= o) {
var c = this._newSunZi(a, o, e, n, 3), u = e[c[c.length - 1]], p = d.value(u);
d.isBomb(p, 3) || r.push(c);
}
}
a -= l;
}
var f = e.length;
if (r.length > 0 && f <= 5 * o) {
return {
tips: h = [ this._newTip(f - 1, f) ].concat(i),
invalids: []
};
}
if (r.length > 0) {
var h;
return {
tips: h = r.concat(i),
invalids: []
};
}
return {
tips: h = i,
invalids: this._filterByList(e, h)
};
};
e.tipFour2 = function(e, t, o) {
return this._tipFour(e, t, o, 2);
};
e.tipFour3 = function(e, t, o) {
return this._tipFour(e, t, o, 3);
};
e._tipFour = function(e, t, o, n) {
for (var r = !1, i = d.value(t) + 1; i <= 15; i++) d.isBomb(i, o[i]) && (r = !0);
var a = this._bombs(e, o);
if (!r) {
return {
tips: a,
invalids: this._filterByList(e, a)
};
}
var s = e.length, l = a.length;
if (1 === l && s <= l + n) {
var c = [ this._newTip(s - 1, s) ];
return {
tips: a.concat(c),
invalids: []
};
}
return {
tips: a,
invalids: []
};
};
e.tipBomb = function(e, t, o) {
var n = d.value(t), r = this._bombs(e, o, n);
return {
tips: r,
invalids: this._filterByList(e, r)
};
};
e.findSunZi = function(e, t, o, n) {
for (var r = o - 5 + 1, i = o; i <= r; i++) {
var a = e[i], s = this._seqLen(a, 1, t);
if (s >= 5) return this._newSunZi(i, s, e, t, 1);
}
return null;
};
e._seqLen = function(e, t, o) {
for (var n = d.value(e), r = 0, i = n; i <= 14; i++) {
var a = o[i];
if (u && d.isBomb(n, a)) break;
if (!(a >= t)) break;
r++;
}
return r;
};
e._mergeCellIds = function(e, t, o) {
for (var n = 0; n < t.length; n++) {
var r = t[n], i = [].concat(e).concat(r);
o.push(i);
}
};
e._mergeIds = function(e, t, o) {
for (var n = 0, r = e.length; n < r; n++) this._mergeCellIds(e[n], t, o);
};
e._merageAddition2 = function(e, t, o) {
var n = [], r = this._additionSingle2(t, o);
this._mergeIds(e, r, n);
var i = this._additionDouble2(t, o);
this._mergeIds(e, i, n);
for (var a = 0, s = e.length; a < s; a++) {
var l = t[e[a][0]], c = d.value(l), u = this._additionOther2(t, o, c);
this._mergeCellIds(e[a], u, n);
}
return 0 === n.length ? e : n;
};
e._additionSingle2 = function(e, t) {
for (var o = [], n = [], r = e.length - 1; r >= 0; ) {
var i = e[r], a = t[d.value(i)];
1 === a && n.push(r);
r -= a;
}
var s = n.length;
for (r = 0; r < s - 1; r++) o.push([ n[r], n[r + 1] ]);
return o;
};
e._additionDouble2 = function(e, t) {
for (var o = [], n = [], r = e.length - 1; r >= 0; ) {
var i = e[r], a = t[d.value(i)];
2 === a && n.push(r);
r -= a;
}
var s = n.length;
for (r = 0; r < s; r++) {
var l = n[r];
o.push([ l, l - 1 ]);
}
return o;
};
e._additionOther2 = function(e, t, o) {
for (var n = [], r = [], i = e.length - 1; i >= 0; ) {
var a = e[i], s = d.value(a);
s !== o && d.isCanSplit(i, e, t) && r.push(i);
i -= t[s];
}
if (r.length < 2) return n;
n.push([ r[0], r[1] ]);
i = 1;
for (var l = r.length; i < l - 1; i++) n.push([ r[i], r[i + 1] ]);
return n;
};
e._newTip = function(e, t) {
for (var o = [], n = 0; n < t; n++) o.push(e - n);
return o;
};
e._newSunZi = function(e, t, o, n, r) {
for (var i = [], a = 0, s = 0; s < t; s++) {
var l = e - a, c = this._newTip(l, r);
i = i.concat(c);
var u = o[l];
a += n[d.value(u)];
}
return i;
};
return e;
}();
cc._RF.pop();
