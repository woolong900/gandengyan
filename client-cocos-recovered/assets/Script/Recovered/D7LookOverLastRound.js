// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "18ec1MZVQhErq9qXHwtEZMH", "D7LookOverLastRound");
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
var i = e("./RoomInfoData"), a = e("./D7RoomUtils"), s = e("./D7GameInfoData"), l = e("./D7CardUtils"), c = e("./Loader"), u = e("./gContext"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._viewRoot = [];
t.cards = [];
t.flags = [];
return t;
}
t.prototype._init = function() {
var e = i.default.config.peopleCount();
if (4 === e) {
this.cards[0].active = !0;
this.cards[1].active = !0;
this.cards[2].active = !1;
this.cards[3].active = !0;
this.cards[4].active = !1;
this.cards[5].active = !0;
this._viewRoot.push(this.cards[0], this.cards[1], this.cards[3], this.cards[5]);
} else if (5 === e) {
this.cards[0].active = !0;
this.cards[1].active = !0;
this.cards[2].active = !0;
this.cards[3].active = !1;
this.cards[4].active = !0;
this.cards[5].active = !0;
this._viewRoot.push(this.cards[0], this.cards[1], this.cards[2], this.cards[4], this.cards[5]);
}
};
t.prototype.onEnable = function() {
0 === this._viewRoot.length && this._init();
for (var e = 0, t = this._viewRoot.length; e < t; e++) {
var o = this._viewRoot[e];
this._hideAllChildren(o);
}
var n = i.default.gameInfoD7.lastRoundData();
if (n && n.type === s.eRoundTypeD7.Put) {
var r = n.maxPutIndex(), l = n.actions;
for (e = 0, t = l.length; e < t; e++) {
var c = l[e], u = c.pos, d = a.default.getInstance().deskPos2ViewPos(u);
o = this._viewRoot[d];
this.flags[e].active = r === e;
var p = c.cards;
this._showCards(p, o);
r === e && this._position(o, p.length, this.flags[e]);
}
}
};
t.prototype._hideAllChildren = function(e) {
for (var t = 0, o = e.childrenCount; t < o; t++) e.children[t].active = !1;
this.flags.forEach(function(e) {
e.active = !1;
});
};
t.prototype._showCards = function(e, t) {
for (var o = i.default.gameInfoD7.mainCard, n = u.default.gameLogic().isSupportAKK(i.default.config), r = u.default.gameLogic().isSupportAKKQQ(i.default.config), a = l.default.sortPutShow(e, o, n, r), s = 0, d = a.length; s < d; s++) {
var p = l.default.imgPath(a[s]), f = t.getChildByName("card_" + s);
f.active = !0;
c.default.setImg(p, f);
}
};
t.prototype._position = function(e, t, o) {
var n = e.children[0], r = n.width, i = n.height, a = (r + e.getComponent(cc.Layout).spacingX) * (t - 1) + r, s = e.x + (1 - e.anchorX) * a - o.width / 2 + 11, l = e.y + (o.height - i) / 2;
o.x = s;
o.y = l;
};
r([ f(cc.Node) ], t.prototype, "cards", void 0);
r([ f(cc.Node) ], t.prototype, "flags", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
