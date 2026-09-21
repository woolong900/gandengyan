// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f2c0e3iCjBEx72KRMfmCPuN", "DBDMyCardsTouchUtils");
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
var r = require("./Singleton"), i = require("./DBDCardUtils"), a = function(e) {
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
(c = this._allChooseIds(e, o)).length > 1 && this._clickIds(e, t);
} else this._clickIds(e, t);
} else {
s = o[a];
var l = i.default.value(s);
if (i.default.compare(s, r) > 0) if (i.default.isBomb(l)) if (this._isValueChoosed(e, o, l)) {
var c = this._allChooseIds(e, o);
if (this._isAllEqu(c, o)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
}
}
} else if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else if (this._isAllEqu(t, o)) {
s = o[a = t[0]], l = i.default.value(s);
if (i.default.isBomb(l)) {
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
if (i.default.compare(l, r) > 0) if (i.default.isBomb(c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, t, 1);
this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
}
}
} else if (2 === a) if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else if (this._isAllEqu(t, o)) {
l = o[s = t[0]], c = i.default.value(l);
if (i.default.compare(l, r) > 0) if (i.default.isBomb(c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
} else {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
}
} else this._clickIds(e, t); else if (this._isAnyOneChoosed(e, t)) this._clickIds(e, t); else if (this._isAllEqu(t, o)) {
l = o[s = t[0]], c = i.default.value(l);
if (i.default.isBomb(c)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, c, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
};
t.followShunZi = function(e, t, o, n) {
var r = t.length;
if (this._isAnyOneChoosed(e, t)) return this._clickIds(e, t);
if (1 === r) {
var a = o[m = t[0]];
if ((p = (d = this._allChooseCards(e, o)).length) > 0) if (i.default.compareToPut(d, n, i.eDBDOneHandType.ShunZi) > 0) {
if (i.default.oneHandType(d)[0] === i.eDBDOneHandType.ShunZi) {
var s = i.default.getCardBetween(a, d[p - 1], d[0]);
if (0 === s) this._changeChooseByValue(e, o, m); else if (s > 0) {
if (h = i.default.findMinShunZiWithClickId(o, n, m)) {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
this._clickIdsExcludeChoosed(e, o, h);
} else {
this._cleanAllChoose(e, o);
var l = i.default.value(a);
this._clickByValue(e, o, l, [], -1);
}
} else {
if (h = i.default.findMaxShunZiWithClickId(o, n, m)) {
this._cleanAllChoose(e, o);
this._clickIds(e, t);
this._clickIdsExcludeChoosed(e, o, h);
} else {
this._cleanAllChoose(e, o);
l = i.default.value(a);
this._clickByValue(e, o, l, [], -1);
}
}
} else this._clickIds(e, t);
} else {
l = i.default.value(a);
if (i.default.isBomb(l)) {
var c = this._allChooseIds(e, o), u = [].concat(c).concat(t);
if (this._isAllEqu(u, o)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
} else {
if (h = i.default.findMinShunZiWithClickId(o, n, m)) {
this._clickIds(e, t);
this._clickIdsExcludeChoosed(e, o, h);
} else {
l = i.default.value(a);
if (i.default.isBomb(l)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
}
}
} else {
var d, p;
if ((p = (d = this._allChooseCards(e, o)).length) > 0) {
c = this._allChooseIds(e, o), u = [].concat(c).concat(t);
if (this._isAllEqu(u, o)) {
a = o[m = t[0]], l = i.default.value(a);
if (i.default.isBomb(l)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else this._clickIds(e, t);
} else this._clickIds(e, t);
} else if (this._isAllEqu(t, o)) {
a = o[m = t[0]], l = i.default.value(a);
if (i.default.isBomb(l)) {
this._cleanAllChoose(e, o);
this._clickByValue(e, o, l, [], -1);
} else {
var f = t[0];
(h = i.default.findMinShunZiWithClickId(o, n, f)) ? this._clickIdsExcludeChoosed(e, o, h) : this._clickIds(e, t);
}
} else {
var h, m = t[0];
(h = i.default.findMinShunZiWithClickId(o, n, m)) ? this._clickIdsExcludeChoosed(e, o, h) : this._clickIds(e, t);
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
void 0 === n && (n = !1);
if (this._isAnyOneChoosed(e, t)) return this._clickIds(e, t);
this._putShunZi(e, t, o, n);
};
t._putShunZi = function(e, t, o, n) {
var r = this._newCardsByIds(o, t), a = i.default.findMaxShunZi(r);
if (a) for (var s = 0, l = a.length; s < l; s++) {
var c = r[a[s]];
this._chooseInIdsByCard(e, o, t, c);
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
