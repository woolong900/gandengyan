// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c7bfaLL87tF95QG0AdTdKMz", "GDSingleEndCell");
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
var i = require("./RoomInfoData"), a = require("./Loader"), s = require("./StringUtils"), l = require("./Image"), c = require("./GDSingleEndData"), u = require("./GDCardUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.headImg = null;
t.nameLabel = null;
t.idLabel = null;
t.cardRoot = null;
t.chunTianRoot = null;
t.flagChunTian = null;
t.flagFanChun = null;
t.remainLabel = null;
t.bombLabel = null;
t.zhuang = null;
t.nongmin = null;
t.winTitle = null;
t.winLabel = null;
t.loseLabel = null;
t.labScore = null;
t.labelTotal = null;
return t;
}
t.prototype.setData = function(e) {
var t = c.default.getInstance(), o = t.playerUid(e), n = i.default.players.getByUid(o);
this.headImg.url = n.headImg;
this.nameLabel.string = s.default.clip(n.name, 6);
this.idLabel.string = "" + o;
var r = i.default.gameInfoGD.siteInfos.get(n.pos).handCards, a = u.default.sortDesc(t.playerInitCards(e), !0), l = (i.default.gameInfoGD.m_iLandlordUid || 0) === o, d = i.default.gameInfoGD.bottomCard || [];
l && (a = a.concat(d));
this._updateCards(r, a, l);
this.zhuang.active = l;
this.nongmin.active = !l;
var p = t.playerIsChunTian(e), f = t.playerIsFanChun(e);
this.flagChunTian.active = p;
this.flagFanChun.active = f;
this.chunTianRoot.active = p || f;
this.remainLabel.string = "" + r.length;
this.bombLabel.string = "" + t.playerBomb(e);
var h = t.playerScore(e);
this.labScore.string = "" + h / i.default.scoreRatio;
var m = t.playerTotal(e);
this.labelTotal.string = "" + m / i.default.scoreRatio;
this.winTitle.active = h > 0;
};
t.prototype._updateCards = function(e, t, o) {
void 0 === o && (o = !1);
t.length >= 21 ? this.cardRoot.getComponent(cc.Layout).spacingX = -43 : this.cardRoot.getComponent(cc.Layout).spacingX = -42;
for (var n = 0, r = t.length; n < r; n++) {
var i = t[n], s = this.cardRoot.getChildByName("card_" + n), l = u.default.imgPath(i);
a.default.setImg(l, s);
-1 === e.indexOf(i) ? s.color = new cc.Color(138, 138, 138) : s.color = new cc.Color(255, 255, 255);
s.removeAllChildren();
if (o) {
var c = new cc.Node(), d = c.addComponent(cc.Sprite);
a.default.setImg("Games/Poker/titleDiZhu", d);
s.addChild(c);
c.setPosition(13, 23);
c.setContentSize(36.66, 36.48);
}
}
};
r([ f(l.default) ], t.prototype, "headImg", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Label) ], t.prototype, "idLabel", void 0);
r([ f(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ f(cc.Node) ], t.prototype, "chunTianRoot", void 0);
r([ f(cc.Node) ], t.prototype, "flagChunTian", void 0);
r([ f(cc.Node) ], t.prototype, "flagFanChun", void 0);
r([ f(cc.Label) ], t.prototype, "remainLabel", void 0);
r([ f(cc.Label) ], t.prototype, "bombLabel", void 0);
r([ f(cc.Node) ], t.prototype, "zhuang", void 0);
r([ f(cc.Node) ], t.prototype, "nongmin", void 0);
r([ f(cc.Node) ], t.prototype, "winTitle", void 0);
r([ f(cc.Label) ], t.prototype, "winLabel", void 0);
r([ f(cc.Label) ], t.prototype, "loseLabel", void 0);
r([ f(cc.Label) ], t.prototype, "labScore", void 0);
r([ f(cc.Label) ], t.prototype, "labelTotal", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
