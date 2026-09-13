// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "42b1cx/J/xEeJyMrrOPff33", "CardsManage2D");
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
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("./CommonEnum"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t, o = null !== e && e.apply(this, arguments) || this;
o._cache = ((t = {})[i.eViewPos.Down] = {
handShow: [],
hand: [],
gang: [],
pizi: [],
out: []
}, t[i.eViewPos.Left] = {
handShow: [],
hand: [],
gang: [],
pizi: [],
out: []
}, t[i.eViewPos.Up] = {
handShow: [],
hand: [],
gang: [],
pizi: [],
out: []
}, t[i.eViewPos.Right] = {
handShow: [],
hand: [],
gang: [],
pizi: [],
out: []
}, t);
o.cardDown = null;
o.cardLeft = null;
o.cardUp = null;
o.cardRight = null;
o.gangDownPre = null;
o.gangLeftPre = null;
o.gangUpPre = null;
o.gangRightPre = null;
o.downRoot = null;
o.leftRoot = null;
o.upRoot = null;
o.rightRoot = null;
return o;
}
t.prototype.hideHandShow = function(e) {
this._hideCache(e, "handShow");
};
t.prototype.handShow = function(e, t) {
return this._typeCache(e, "hand", t);
};
t.prototype.hideHand = function(e) {
this._hideCache(e, "hand");
};
t.prototype.hand = function(e, t) {
return this._typeCache(e, "hand", t);
};
t.prototype.hideGang = function(e) {
this._hideCache(e, "gang");
};
t.prototype.gang = function(e, t) {
return this._typeCache(e, "gang", t);
};
t.prototype.hidePiZi = function(e) {
this._hideCache(e, "pizi");
};
t.prototype.pizi = function(e, t) {
return this._typeCache(e, "pizi", t);
};
t.prototype.hideOut = function(e) {
this._hideCache(e, "out");
};
t.prototype.out = function(e, t) {
return this._typeCache(e, "out", t);
};
t.prototype.liangdao = function(e, t) {
return this._typeCache(e, "gang", t);
};
t.prototype._typeCache = function(e, t, o) {
var n = this._cache[e][t];
if (void 0 === o || null === o) ; else {
var r = n.length;
if (o > r) cc.error("cache index error"); else if (o !== r) {
(a = n[o]).active = !0;
return a;
}
}
var i = this._root(e);
if ("gang" === t) {
var a = cc.instantiate(this._gangPrefab(e));
n.push(a);
i.addChild(a);
return a;
}
a = cc.instantiate(this._cardPrefab(e));
n.push(a);
i.addChild(a);
return a;
};
t.prototype._hideCache = function(e, t) {
for (var o = this._cache[e][t], n = 0, r = o.length; n < r; n++) o[n].active = !1;
};
t.prototype._cardPrefab = function(e) {
return i.eViewPos.Down === e ? this.cardDown : i.eViewPos.Left === e ? this.cardLeft : i.eViewPos.Right === e ? this.cardRight : i.eViewPos.Up === e ? this.cardUp : void 0;
};
t.prototype._gangPrefab = function(e) {
return i.eViewPos.Down === e ? this.gangDownPre : i.eViewPos.Left === e ? this.gangLeftPre : i.eViewPos.Right === e ? this.gangRightPre : i.eViewPos.Up === e ? this.gangUpPre : void 0;
};
t.prototype._root = function(e) {
return i.eViewPos.Down === e ? this.downRoot : i.eViewPos.Left === e ? this.leftRoot : i.eViewPos.Right === e ? this.rightRoot : i.eViewPos.Up === e ? this.upRoot : void 0;
};
r([ l(cc.Prefab) ], t.prototype, "cardDown", void 0);
r([ l(cc.Prefab) ], t.prototype, "cardLeft", void 0);
r([ l(cc.Prefab) ], t.prototype, "cardUp", void 0);
r([ l(cc.Prefab) ], t.prototype, "cardRight", void 0);
r([ l(cc.Prefab) ], t.prototype, "gangDownPre", void 0);
r([ l(cc.Prefab) ], t.prototype, "gangLeftPre", void 0);
r([ l(cc.Prefab) ], t.prototype, "gangUpPre", void 0);
r([ l(cc.Prefab) ], t.prototype, "gangRightPre", void 0);
r([ l(cc.Node) ], t.prototype, "downRoot", void 0);
r([ l(cc.Node) ], t.prototype, "leftRoot", void 0);
r([ l(cc.Node) ], t.prototype, "upRoot", void 0);
r([ l(cc.Node) ], t.prototype, "rightRoot", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
