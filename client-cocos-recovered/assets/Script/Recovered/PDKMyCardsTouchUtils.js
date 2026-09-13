// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "04be89YoJdM1681tBoNsUl7", "PDKMyCardsTouchUtils");
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
var r = e("./Singleton"), i = e("./PDKCardUtils"), a = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.followSingle = function(e, t, o, n) {
var r = n[0];
if (1 === t.length) {
var a = t[0];
if (this._isAnyOneChoosed(e, t)) {
var s = o[a];
if (i.default.compare(s, r) > 0) {
(u = this._allChooseIds(e, o)).length > 1 && this._clickIds(e, t);
} else this._clickIds(e, t);
} else {
s = o[a];
var l = i.default.value(s);
if (i.default.compare(s, r) > 0) {
var c = i.default.valueCount(o, l);
if (i.default.isBomb(l, c)) if (this._isValueChoosed(e, o, l)) {
var u = this._allChooseIds(e, o);
if (this._isAllEqu(u, o)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else if (i.default.ruleIsCanSplitBomb()) {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
}
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
}
}
} else if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else if (this._isAllEqu(t, o)) {
s = o[a = t[0]], l = i.default.value(s), c = i.default.valueCount(o, l);
if (i.default.isBomb(l, c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
};
t.followDouble = function(e, t, o, n) {
var r = n[0], a = t.length;
if (1 === a) {
var s = t[0];
if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else {
var l = o[s], c = i.default.value(l);
if (i.default.compare(l, r) > 0) {
var u = i.default.valueCount(o, c);
if (i.default.isBomb(c, u)) if (i.default.ruleIsCanSplitBomb()) if (this._isValueChoosed(e, o, c)) {
var d = this._allChooseIds(e, o);
if (this._isAllEqu(d, o)) if (d.length >= 2) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else this._clickIds(e, t); else this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, t, 1);
this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, t, 1);
this._clickIds(e, t);
}
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
}
}
} else if (2 === a) if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else if (this._isAllEqu(t, o)) {
l = o[s = t[0]], c = i.default.value(l);
if (i.default.compare(l, r) > 0) {
u = i.default.valueCount(o, c);
if (i.default.isBomb(c, u)) if (i.default.ruleIsCanSplitBomb()) if (this._isValueChoosed(e, o, c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
}
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
}
} else this._clickIds(e, t); else if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else if (this._isAllEqu(t, o)) {
l = o[s = t[0]], c = i.default.value(l), u = i.default.valueCount(o, c);
if (i.default.isBomb(c, u)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
};
t.followShunZi = function(e, t, o, n) {
var r = t.length;
if (this._isAnyOneChoosed(e, t)) return this._clickIds(e, t);
if (1 === r) {
var a = o[y = t[0]];
if ((f = (p = this._allChooseCards(e, o)).length) > 0) if (i.default.compareToPut(p, n, i.ePDKOneHandType.ShunZi) > 0) {
if (i.default.oneHandType(p) === i.ePDKOneHandType.ShunZi) {
var s = i.default.getCardBetween(a, p[f - 1], p[0]);
if (0 === s) this._changeChooseByValue(e, o, y); else if (s > 0) {
if (m = i.default.findMinShunZiWithClickId(o, n, y)) {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
this._clickIdsExcludeChoosed(e, o, m);
} else {
this._cleanAllChoose(e, o);
var l = i.default.value(a);
this._clickByValue(e, o, l, [], -1);
}
} else {
if (m = i.default.findMaxShunZiWithClickId(o, n, y)) {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
this._clickIdsExcludeChoosed(e, o, m);
} else {
this._cleanAllChoose(e, o);
l = i.default.value(a);
this._clickByValue(e, o, l, [], -1);
}
}
} else this._clickIds(e, t);
} else {
l = i.default.value(a);
var c = i.default.valueCount(o, l);
if (i.default.isBomb(l, c)) {
var u = this._allChooseIds(e, o), d = [].concat(u).concat(t);
if (this._isAllEqu(d, o)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
} else {
if (m = i.default.findMinShunZiWithClickId(o, n, y)) {
this._clickIds(e, t);
this._clickIdsExcludeChoosed(e, o, m);
} else {
l = i.default.value(a), c = i.default.valueCount(o, l);
if (i.default.isBomb(l, c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
}
}
} else {
var p, f;
if ((f = (p = this._allChooseCards(e, o)).length) > 0) {
u = this._allChooseIds(e, o), d = [].concat(u).concat(t);
if (this._isAllEqu(d, o)) {
a = o[y = t[0]], l = i.default.value(a), c = i.default.valueCount(o, l);
if (i.default.isBomb(l, c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
} else if (this._isAllEqu(t, o)) {
a = o[y = t[0]], l = i.default.value(a), c = i.default.valueCount(o, l);
if (i.default.isBomb(l, c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else {
var h = t[0];
(m = i.default.findMinShunZiWithClickId(o, n, h)) ? this._clickIdsExcludeChoosed(e, o, m) : this._clickIds(e, t);
}
} else {
var m, y = t[0];
(m = i.default.findMinShunZiWithClickId(o, n, y)) ? this._clickIdsExcludeChoosed(e, o, m) : this._clickIds(e, t);
}
}
};
t.followThree = function(e, t, o, n) {
this._clickIds(e, t);
};
t.followFeiJi = function(e, t, o, n) {
this._clickIds(e, t);
};
t.followLianDui = function(e, t, o, n) {
this._clickIds(e, t);
};
t.followFourWith = function(e, t, o, n) {
this._clickIds(e, t);
};
t.followBomb = function(e, t, o, n) {
if (this._isAnyOneChoosed(e, t)) return this._clickIds(e, t);
if (this._isAllEqu(t, o)) {
var r = o[t[0]], a = i.default.value(r);
this._cleanAllChoose(e, o);
this._clickByValue(e, o, a, [], -1);
} else this._clickIds(e, t);
};
t.followOther = function(e, t, o, n) {
this._clickIds(e, t);
};
t.put = function(e, t, o, n) {
if (this._isAnyOneChoosed(e, t)) return this._clickIds(e, t);
this._putShunZi(e, t, o, n);
};
t._putShunZi = function(e, t, o, n) {
var r = this._newCardsByIds(o, t), a = i.default.findMaxShunZi(r);
if (a) {
if (n) {
var s = a[0], l = a[a.length - 1], c = r[s], u = r[l], d = i.default.findHei3Id(o), p = o[d];
0 === i.default.getCardBetween(p, c, u) && this._clickIds(e, [ d ]);
}
for (var f = 0, h = a.length; f < h; f++) {
var m = r[a[f]];
this._chooseInIdsByCard(e, o, t, m);
}
} else this._clickIds(e, t);
};
t._putOther = function(e, t, o, n) {
this._clickIds(e, t);
};
t._newCardsByIds = function(e, t) {
for (var o = [], n = 0, r = t.length; n < r; n++) {
var i = e[t[n]];
o.push(i);
}
return o;
};
t._chooseInIdsByCard = function(e, t, o, n) {
for (var r = 0, a = o.length; r < a; r++) {
var s = o[r], l = e.getCard(s);
if (!l.isChoose() && 0 === i.default.compare(n, t[s])) {
l.clicked();
break;
}
}
};
t._allChooseIds = function(e, t) {
for (var o = [], n = 0, r = t.length; n < r; n++) e.getCard(n).isChoose() && o.push(n);
return o;
};
t._allChooseCards = function(e, t) {
for (var o = [], n = 0, r = t.length; n < r; n++) if (e.getCard(n).isChoose()) {
var i = t[n];
o.push(i);
}
return o;
};
t._changeChooseByValue = function(e, t, o) {
var n = e.getCard(o);
n.isChoose() || n.clicked();
for (var r = t[o], a = i.default.value(r), s = 0, l = t.length; s < l; s++) if (s !== o) {
var c = e.getCard(s);
if (c.isChoose()) {
var u = t[s];
if (i.default.value(u) === a) {
c.clicked();
break;
}
}
}
};
t._cleanAllChoose = function(e, t) {
for (var o = 0, n = t.length; o < n; o++) {
var r = e.getCard(o);
r.isChoose() && r.clicked();
}
};
t._isAnyOneChoosed = function(e, t) {
for (var o = 0, n = (t = t || []).length; o < n; o++) {
var r = t[o];
if (e.getCard(r).isChoose()) return !0;
}
return !1;
};
t._clickByValue = function(e, t, o, n, r) {
n = n || [];
for (var a = 0, s = t.length - 1; s >= 0; s--) if (-1 === n.indexOf(s)) {
var l = t[s];
if (i.default.value(l) === o) {
e.getCard(s).clicked();
a++;
}
if (r > 0 && a === r) break;
}
};
t._clickIdsExcludeChoosed = function(e, t, o) {
for (var n = {}, r = 0, a = t.length; r < a; r++) if (e.getCard(r).isChoose()) {
var s = t[r];
n[i.default.value(s)] = !0;
}
for (r = 0, a = o.length; r < a; r++) {
var l = o[r];
s = t[l];
n[i.default.value(s)] || e.getCard(l).clicked();
}
};
t._clickIds = function(e, t) {
for (var o = 0, n = t.length; o < n; o++) {
var r = t[o];
e.getCard(r).clicked();
}
};
t._isValueChoosed = function(e, t, o) {
for (var n = 0, r = t.length; n < r; n++) if (e.getCard(n).isChoose()) {
var a = t[n];
if (i.default.value(a) === o) return !0;
}
return !1;
};
t._isAllEqu = function(e, t) {
if (e.length < 1) return !0;
for (var o = this._getValueByIdsArray(0, e, t), n = 1, r = e.length; n < r; n++) if (this._getValueByIdsArray(n, e, t) !== o) return !1;
return !0;
};
t._getValueByIdsArray = function(e, t, o) {
var n = o[t[e]];
return i.default.value(n);
};
return t;
}(r.default);
o.default = a;
cc._RF.pop();
