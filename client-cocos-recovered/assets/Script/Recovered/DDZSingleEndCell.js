// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3ee35wcVqBEFp2DvLzLbjiN", "DDZSingleEndCell");
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
var i = e("./Image"), a = e("./DDZSingleEndData"), s = e("./RoomInfoData"), l = e("./StringUtils"), c = e("./Loader"), u = e("./DDZCardUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
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
var t = a.default.getInstance(), o = t.playerUid(e), n = s.default.players.getByUid(o);
this.headImg.url = n.headImg;
this.nameLabel.string = l.default.clip(n.name, 6);
this.idLabel.string = "" + o;
var r = s.default.gameInfoDDZ.siteInfos.get(n.pos).handCards, i = u.default.sortDesc(t.playerInitCards(e), !0), c = (s.default.gameInfoDDZ.m_iLandlordUid || 0) === o, d = s.default.gameInfoDDZ.bottomCard || [];
c && (i = i.concat(d));
this._updateCards(r, i, c);
this.zhuang.active = c;
this.nongmin.active = !c;
var p = t.playerIsChunTian(e), f = t.playerIsFanChun(e);
this.flagChunTian.active = p;
this.flagFanChun.active = f;
this.chunTianRoot.active = p || f;
this.remainLabel.string = "" + r.length;
this.bombLabel.string = "" + t.playerBomb(e);
var h = t.playerScore(e);
this.labScore.string = "" + h / s.default.scoreRatio;
var m = t.playerTotal(e);
this.labelTotal.string = "" + m / s.default.scoreRatio;
this.winTitle.active = h > 0;
};
t.prototype._updateCards = function(e, t, o) {
void 0 === o && (o = !1);
t.length >= 21 ? this.cardRoot.getComponent(cc.Layout).spacingX = -43 : this.cardRoot.getComponent(cc.Layout).spacingX = -42;
for (var n = 0, r = t.length; n < r; n++) {
var i = t[n], a = this.cardRoot.getChildByName("card_" + n), s = u.default.imgPath(i);
c.default.setImg(s, a);
-1 === e.indexOf(i) ? a.color = new cc.Color(138, 138, 138) : a.color = new cc.Color(255, 255, 255);
a.removeAllChildren();
if (o) {
var l = new cc.Node(), d = l.addComponent(cc.Sprite);
c.default.setImg("Games/Poker/titleDiZhu", d);
a.addChild(l);
l.setPosition(13, 23);
l.setContentSize(36.66, 36.48);
}
}
};
r([ f(i.default) ], t.prototype, "headImg", void 0);
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
