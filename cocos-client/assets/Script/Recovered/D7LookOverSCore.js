// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f3d74uYMCxHJr7d2PVOJ6dS", "D7LookOverSCore");
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
var i = require("./RoomInfoData"), a = require("./D7CardUtils"), s = require("./Loader"), l = require("./D7RoomUtils"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._viewRoot = [];
t.cards = [];
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
for (var e = i.default.config.peopleCount(), t = 0; t < e; t++) {
var o = l.default.getInstance().deskPos2ViewPos(t), n = this._viewRoot[o];
this._hideAllChildren(n);
for (var r = i.default.gameInfoD7.siteInfos.get(t).scoreCards || [], c = 0, u = r.length; c < u; c++) {
var d = r[c], p = a.default.imgPath(d), f = n.getChildByName("card_" + c);
f.active = !0;
s.default.setImg(p, f);
}
}
};
t.prototype._hideAllChildren = function(e) {
for (var t = 0, o = e.childrenCount; t < o; t++) e.children[t].active = !1;
};
r([ d(cc.Node) ], t.prototype, "cards", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
