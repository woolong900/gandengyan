// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f53586824dPp44LwqyZnDhK", "D7CardUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.D7_HIDE = 0;
o.D7_Fix_Main = 7;
o.D7_XiaoWang = 140;
o.D7_DaWang = 150;
o.D7_XiaoHua = 160;
o.D7_DaHua = 170;
var n, r;
(function(e) {
e[e.King = 5] = "King";
e[e.Hei = 4] = "Hei";
e[e.Hong = 3] = "Hong";
e[e.Mei = 2] = "Mei";
e[e.Fang = 1] = "Fang";
})(n = o.eD7CardColor || (o.eD7CardColor = {}));
(function(e) {
e[e.Null = 0] = "Null";
e[e.Single = 1] = "Single";
e[e.Double = 2] = "Double";
e[e.AKK = 3] = "AKK";
e[e.AAK = 4] = "AAK";
e[e.AKKQQ = 5] = "AKKQQ";
e[e.AAKKQ = 6] = "AAKKQ";
e[e.AABB = 7] = "AABB";
e[e.AABB_AA22 = 8] = "AABB_AA22";
e[e.AABB_6677 = 9] = "AABB_6677";
})(r = o.eD7OneHandType || (o.eD7OneHandType = {}));
var i = function() {
function e() {}
e.isHide = function(e) {
return e === o.D7_HIDE;
};
e.value = function(e) {
return 140 === e ? o.D7_XiaoWang : 150 === e ? o.D7_DaWang : 160 === e ? o.D7_XiaoHua : 170 === e ? o.D7_DaHua : Math.floor(e / 10);
};
e.color = function(e) {
return this._color(e);
};
e.card = function(e, t) {
return e === n.King ? t : 10 * t + e;
};
e.score = function(t) {
var o = e.value(t);
return 5 === o ? 5 : 10 === o ? 10 : 13 === o ? 10 : 0;
};
e.scoreCount = function(e) {
for (var t = 0, o = 0, n = e.length; o < n; o++) t += this.score(e[o]);
return t;
};
e.isMain = function(e, t) {
if (e === o.D7_HIDE) return !1;
if (e === o.D7_DaHua) return !0;
if (e === o.D7_XiaoHua) return !0;
if (e === o.D7_DaWang) return !0;
if (e === o.D7_XiaoWang) return !0;
if (this.value(e) === o.D7_Fix_Main) return !0;
var n = this.color(t);
return this.color(e) === n;
};
e.doubleIds = function(t, o, n, r) {
for (var i = [], a = 0, s = t.length; a < s - 1; a++) {
var l = t[a];
if (l === t[a + 1]) {
var c = this.isMain(l, r);
if (n) {
if (!c) break;
i.push(a);
i.push(a + 1);
} else {
if (c) continue;
if (e.color(l) === o) {
i.push(a);
i.push(a + 1);
}
}
}
}
return i;
};
e.doubleCount = function(e, t, o, n) {
return this.doubleIds(e, t, o, n).length / 2;
};
e.typeIds = function(t, o, n, r) {
for (var i = [], a = 0, s = t.length; a < s; a++) {
var l = t[a], c = this.isMain(l, r);
if (n) {
if (!c) break;
i.push(a);
} else {
if (c) continue;
e.color(l) === o && i.push(a);
}
}
return i;
};
e.typeCount = function(e, t, o, n) {
return this.typeIds(e, t, o, n).length;
};
e.sortDesc = function(e, t) {
var o = this, n = [].concat(e = e || []), r = t ? this.color(t) : 0;
n.sort(function(e, t) {
return -o.compare(e, t, r);
});
return n;
};
e.sortAsc = function(e, t) {
var o = this, n = [].concat(e = e || []), r = t ? this.color(t) : 0;
n.sort(function(e, t) {
return o.compare(e, t, r);
});
return n;
};
e._compareOneHandValidAndSameType = function(e, t, o) {
if (e.length > 2) {
var n = e[2], r = t[2], i = this.value(n), a = this.value(r);
return this.compareValue(i, a);
}
n = e[0], r = t[0];
return this.compare(n, r, o, !1);
};
e._minNext = function(e, t) {
if (e === o.D7_DaHua) return o.D7_XiaoHua;
if (e === o.D7_XiaoHua) return o.D7_DaWang;
if (e === o.D7_DaWang) return o.D7_XiaoWang;
if (e === o.D7_XiaoWang) return -1;
var n = this.color(e), r = this.value(e);
if (1 === r) return this.card(n, 13);
if (2 === r) return this.card(n, 1);
var i = r - 1, a = this.card(n, i);
return i !== o.D7_Fix_Main || t ? a : this._minNext(a, t);
};
e._dealWith_AAK_AKK_AAKKQ_AKKQQ = function(e) {
for (var t = this, o = !1, n = 0, r = e.length; n < r; n++) if (13 === this.value(e[n])) {
o = !0;
break;
}
var i = [].concat(e = e || []);
i.sort(function(e, n) {
var r = t.value(e), i = t.value(n);
return -t.compareValue(r, i, o);
});
return i;
};
e.compareOneHand = function(e, t, o, n) {
if (n === r.Null) return 1;
var i = e.length;
if (t.length !== i) return 1;
var a = this.color(o), s = e[0], l = t[0], c = this.isMain(s, o), u = this.isMain(l, o);
if (c) {
if (u) {
if (n === r.AAK || n === r.AAKKQ) {
var d = this._dealWith_AAK_AKK_AAKKQ_AKKQQ(t);
if (this._minNext(d[i - 2], !0) === d[i - 1]) {
var p = d.slice(0, i - 1);
return this.isValid(p, !1, !1, o) ? this.compare(e[i - 1], t[i - 1], o) : 1;
}
return 1;
}
if (n === r.AKK || n === r.AKKQQ) {
d = this._dealWith_AAK_AKK_AAKKQ_AKKQQ(t);
if (this._minNext(d[0], !0) === d[1]) {
p = d.slice(1, i);
return this.isValid(p, !1, !1, o) ? this.compare(e[i - 1], t[i - 1], o) : 1;
}
return 1;
}
return this.isValid(t, !1, !1, o) ? this._compareOneHandValidAndSameType(e, t, a) : 1;
}
return 1;
}
if (u) {
if (n === r.AAK || n === r.AAKKQ) {
d = this._dealWith_AAK_AKK_AAKKQ_AKKQQ(t);
if (this._minNext(d[i - 2], !0) === d[i - 1]) {
p = d.slice(0, i - 1);
return this.isValid(p, !1, !1, o) ? -1 : 1;
}
return 1;
}
if (n === r.AKK || n === r.AKKQQ) {
d = this._dealWith_AAK_AKK_AAKKQ_AKKQQ(t);
if (this._minNext(d[0], !0) === d[1]) {
p = d.slice(1, i);
return this.isValid(p, !1, !1, o) ? -1 : 1;
}
return 1;
}
return this.isValid(t, !1, !1, o) ? -1 : 1;
}
if (this.color(s) === this.color(l)) {
var f = n == r.AAK || n == r.AKK, h = n === r.AAKKQ || n == r.AKKQQ;
return this.isValid(t, f, h, o) ? this._compareOneHandValidAndSameType(e, t, a) : 1;
}
return 1;
};
e.isTypeAA22 = function(e) {
0;
var t = e.length - 1, o = this.value(e[0]), n = this.value(e[t]);
return 2 === o && 1 === n;
};
e.isSeqMustPut = function() {
return !0;
};
e.sortPutShow = function(t, o, n, i) {
var a = e.oneHandType(t, n, i, o);
if (a === r.AABB_AA22 || a === r.AABB_6677) {
var s = [].concat(t);
s.sort(function(t, o) {
var n = e.value(t), i = e.value(o);
return e.compareValue(n, i, a !== r.AABB_AA22);
});
return s;
}
return this.sortAsc(t);
};
e.compareValue = function(e, t, o) {
void 0 === o && (o = !0);
if (o) {
var n = 1 === e;
if (n !== (1 === t)) return n ? 1 : -1;
}
return e - t;
};
e.compare = function(e, t, r, i) {
void 0 === i && (i = !0);
var a = this.color(e), s = this.color(t), l = this.value(e), c = this.value(t), u = a === n.King;
if (u !== (s === n.King)) return u ? 1 : -1;
var d = l === o.D7_Fix_Main;
if (d !== (c === o.D7_Fix_Main)) return d ? 1 : -1;
var p = a === r;
return p !== (s === r) ? p ? 1 : -1 : i && a !== s ? a - s : this.compareValue(l, c);
};
e.oneHandType = function(e, t, o, n) {
var i = e.length;
if (0 === i) return r.Null;
if (1 === i) return r.Single;
if (2 === i) return e[0] === e[1] ? r.Double : r.Null;
for (var a = this.color(e[0]), s = 1, l = e.length; s < l; s++) if (a !== this.color(e[s])) return r.Null;
var c = this.sortAsc(e);
if (this.isMain(c[0], n)) {
t = !1;
o = !1;
}
if (3 === i) {
if (t) {
var u = this.value(c[0]), d = this.value(c[1]), p = this.value(c[2]);
return 13 === u && 1 === p ? 13 === d ? r.AKK : r.AAK : r.Null;
}
return r.Null;
}
if (i % 2 == 1) {
if (o) {
if (1 !== this.value(c[i - 1])) return r.Null;
if (13 !== this.value(c[i - 3])) return r.Null;
if (this.value(c[0]) + 1 !== this.value(c[2])) return r.Null;
var f = this.value(c[i - 2]), h = 0, m = i;
1 === f ? h = 1 : m -= 1;
var y = c.slice(h, m);
return this._isAABB_NoKing(y, n) ? 1 === f ? r.AAKKQ : r.AKKQQ : r.Null;
}
return r.Null;
}
return this._isAABB_Sorted(c, n);
};
e.isValid = function(e, t, o, n) {
return this.oneHandType(e, t, o, n) !== r.Null;
};
e._isAABB_Sorted = function(e, t) {
if (this.color(e[0]) === n.King) return this._isAABB_King(e) ? r.AABB : r.Null;
var o = e.length, i = this.value(e[0]), a = this.value(e[1]), s = this.value(e[o - 1]), l = this.value(e[o - 2]);
if (i !== a || s !== l) return r.Null;
if (2 === i) if (e[o - 1] === t) {
var c = this.value(e[o - 3]);
if (c === this.value(e[o - 4]) && 1 === c) {
(u = e.slice(0, o - 4)).push(t, t);
return this._isAABB_NoKing(u, t) ? r.AABB_AA22 : r.Null;
}
} else if (1 === s) {
var u = e.slice(0, o - 2);
return this._isAABB_NoKing(u, t) ? r.AABB_AA22 : r.Null;
}
return this._isAABB_NoKing(e, t);
};
e._isAABB_NoKing = function(e, t) {
var n = this, i = function(e, t) {
for (var r = n.value(e[0]), i = 0, a = e.length; i < a; ) {
var s = e[i];
if (s !== e[i + 1]) return !1;
if (r !== n.value(s)) return !1;
r += 1;
t && r === o.D7_Fix_Main && (r += 1);
14 === r && (r = 1);
i += 2;
}
return !0;
}, a = e.length, s = e[a - 1], l = e[a - 2];
if (this.color(t) === this.color(e[0])) {
if (s === t) {
if (s !== l) return r.Null;
var c = e.slice(0, a - 2);
if (i(c, !0)) {
var u = c[0], d = c[c.length - 1], p = this.value(u), f = this.value(d), h = this.compareValue(p, o.D7_Fix_Main), m = this.compareValue(f, o.D7_Fix_Main);
return h < 0 ? m > 0 ? r.AABB_6677 : this._minNext(t, !0) === d ? r.AABB_6677 : r.Null : this._minNext(u, !0) === t ? r.AABB_6677 : r.Null;
}
return r.Null;
}
return i(e, !1) ? r.AABB : r.Null;
}
return i(e, !0) ? r.AABB : r.Null;
};
e._isAABB_King = function(e) {
for (var t = this.value(e[0]), o = 0, n = e.length; o < n; ) {
var r = e[o];
if (r !== e[o + 1]) return !1;
if (t !== this.value(r)) return !1;
t += 10;
o += 2;
}
return !0;
};
e.seqDoubbleIds = function(t, o, n, r) {
for (var i = [], a = [], s = t, l = n.length; s < l - 1; s += 2) {
var c = n[s], u = n[s + 1], d = o[c], p = o[u];
i.push(d, p);
if (!e.isValid(i, !1, !1, r)) return a;
a.push(c, u);
}
return a;
};
e.allSeqDoubbleIds = function(e, t, o) {
var r = this, i = [], a = this.color(o), s = function(t) {
for (var n = 0, a = t.length; n < a - 3; ) {
var s = r.seqDoubbleIds(n, e, t, o);
s.length > 2 && i.push(s);
n += s.length;
}
};
if (a !== n.King) {
var l = t[(g = t.length) - 1], c = e[l];
if (this.color(c) === a) {
for (var u = [], d = [], p = 0, f = t.length; p < f; p++) {
var h = t[p], m = e[h], y = this.color(m);
y === n.King && u.push(h);
y === a && d.push(h);
}
d.sort(function(t, o) {
var n = e[t], i = e[o], a = r.value(n), s = r.value(i);
return -r.compareValue(a, s);
});
s(u);
s(d);
} else s(t);
} else s(t);
var g, _ = t[(g = t.length) - 2], v = t[g - 1];
if (2 === (c = this.value(e[_]))) {
var C = [];
for (p = 0, f = g; p < f - 3; p += 2) {
var b = t[p], D = t[p + 1];
if (1 === this.value(e[b])) {
C.push(b, D);
break;
}
}
if (C.length > 0) {
var S = i.length;
if (S > 0) {
var w = i[S - 1], O = w[w.length - 1];
2 === this.value(e[O]) ? w.push(C[0], C[1]) : i.push([ _, v, C[0], C[1] ]);
} else i.push([ _, v, C[0], C[1] ]);
}
}
return i;
};
e.imgPath = function(e) {
var t = this._color(e), n = this.value(e), r = n.toString(16);
n === o.D7_XiaoWang && (r = "e");
n === o.D7_DaWang && (r = "f");
n === o.D7_XiaoHua && (r = "g");
n === o.D7_DaHua && (r = "h");
return "Games/Poker/card_" + t + r;
};
e.soundName = function(e) {
var t = this._color(e), r = this.value(e);
return r === o.D7_XiaoWang ? "xiaowang" : r === o.D7_DaWang ? "dawang" : r === o.D7_XiaoHua ? "huapai" : r === o.D7_DaHua ? "huapai" : t === n.Hei ? "heitao_" + r : t === n.Hong ? "hongtao_" + r : t === n.Mei ? "meihua_" + r : t === n.Fang ? "fangkuai_" + r : void 0;
};
e._color = function(e) {
return e >= 140 ? n.King : e % 10;
};
e.getRemainNum = function(e) {
for (var t = 0, o = 0; o < e.length; o++) 5 == this.value(e[o]) ? t += 5 : 10 != this.value(e[o]) && 13 != this.value(e[o]) || (t += 10);
return t;
};
return e;
}();
o.default = i;
cc._RF.pop();
