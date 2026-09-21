// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a3940n95oNP2o3rif3dVleD", "DBDSingleEndCell");
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
var i = require("./Image"), a = require("./DBDSingleEndData"), s = require("./RoomInfoData"), l = require("./StringUtils"), c = require("./Loader"), u = require("./DBDCardUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
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
t.zhuang = null;
t.poolLabel = null;
t.endLabel = null;
t.totalLabel = null;
t.nongmin = null;
t.winTitle = null;
return t;
}
t.prototype.setData = function(e) {
var t = a.default.getInstance(), o = t.playerUid(e), n = s.default.players.getByUid(o);
this.headImg.url = n.headImg;
this.nameLabel.string = l.default.clip(n.name, 5);
this.idLabel.string = "" + o;
var r = s.default.gameInfoDBD.siteInfos.get(n.pos).handCards, i = t.playerInitCards(e), c = s.default.gameInfoDBD.bottomCard || [], d = i, p = (s.default.gameInfoDBD.bankerUid || 0) === o;
p && (d = d.concat(c));
var f = u.default.sortDesc(d, !0), h = this._updateCards(r, f, p), m = t.playerIsChunTian(e), y = t.playerIsFanChun(e);
this.flagChunTian.active = m;
this.flagFanChun.active = y;
this.chunTianRoot.active = m || y;
this.winTitle.active = h;
this.cardRoot.getChildByName("layer").active = !h;
var g = "" + r.length, _ = "" + t.playerBomb(e);
if (s.default.config.isChecked(6)) {
g = "" + t.playerExtraScore(e);
_ = "" + t.playerWinnerScore(e);
}
this.poolLabel.string = g;
this.endLabel.string = _;
this.totalLabel.string = "" + t.playerCulTotalScore(e);
this.zhuang.active = p;
this.nongmin.active = !p;
};
t.prototype._updateCards = function(e, t, o) {
void 0 === o && (o = !1);
for (var n = !0, r = 0, i = t.length; r < i; r++) {
var a = t[r], s = this.cardRoot.getChildByName("layer").getChildByName("card_" + r), l = u.default.imgPath(a, o);
c.default.setImg(l, s);
if (-1 === e.indexOf(a)) s.color = new cc.Color(138, 138, 138); else {
s.color = new cc.Color(255, 255, 255);
n = !1;
}
s.removeAllChildren();
if (o) {
var d = new cc.Node(), p = d.addComponent(cc.Sprite);
c.default.setImg("Games/dbd/poker/titleDiZhu", p);
d.setPosition(13, 23);
d.setContentSize(36.66, 36.48);
s.addChild(d);
}
}
return n;
};
r([ f(i.default) ], t.prototype, "headImg", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Label) ], t.prototype, "idLabel", void 0);
r([ f(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ f(cc.Node) ], t.prototype, "chunTianRoot", void 0);
r([ f(cc.Node) ], t.prototype, "flagChunTian", void 0);
r([ f(cc.Node) ], t.prototype, "flagFanChun", void 0);
r([ f(cc.Node) ], t.prototype, "zhuang", void 0);
r([ f(cc.Label) ], t.prototype, "poolLabel", void 0);
r([ f(cc.Label) ], t.prototype, "endLabel", void 0);
r([ f(cc.Label) ], t.prototype, "totalLabel", void 0);
r([ f(cc.Node) ], t.prototype, "nongmin", void 0);
r([ f(cc.Node) ], t.prototype, "winTitle", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
