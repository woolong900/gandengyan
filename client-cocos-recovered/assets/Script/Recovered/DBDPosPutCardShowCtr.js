// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9d4a0HFx3tPY6kBk3NEzsEo", "DBDPosPutCardShowCtr");
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
var i = e("./DBDPosCtr"), a = e("./DBDCardUtils"), s = e("./Loader"), l = e("./gContext"), c = e("./RoomInfoData"), u = e("./DBDEnum"), d = e("./DBDEventKeys"), p = e("./EventUtils"), f = e("./EventKeys"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.cardRoot = null;
t.bombAnimate = null;
t.sunZi = null;
t.lianDui = null;
t._isDizhu = !1;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on([ d.default.data_status_change ], function(t, o) {
var n = o.o, r = o.n;
n === u.eDBDGameStatus.Gameing && r === u.eDBDGameStatus.SingleEnd ? e._updateCards(!0) : e._updateCards(!1);
}, this, p.eOffType.OnDestroy);
l.default.eventUtils.on([ d.default.data_round_data_update ], function(t, o) {
o.pos === e.posCtr.deskPos() && e._updateCards(!0);
}, this, p.eOffType.OnDestroy);
l.default.eventUtils.on([ f.default.play_back_hand ], function(t, o) {
e._hideAll();
}, this, p.eOffType.OnDestroy);
this._updateCards(!1);
};
t.prototype._showCards = function(e, t) {
var o = e;
t && (o = a.default.sortPutCards2(e));
for (var n = 0, r = e.length; n < r; n++) this._show(n, o[n], r);
};
t.prototype._showCardsAnimate = function(e) {
var t = this, o = a.default.sortPutCards2(e), n = o.length, r = .8 / n;
r > .08 && (r = .08);
for (var i = function(e) {
s.scheduleOnce(function() {
t._show(e, o[e], n);
}, r * e);
}, s = this, l = 0; l < n; l++) i(l);
};
t.prototype._updateCards = function(e) {
this._hideAll();
var t = this.posCtr.deskPos(), o = c.default.gameInfoDBD.siteInfos.get(t), n = c.default.players.getByPos(t), r = n ? n.uid : 99999999999999, i = c.default.gameInfoDBD.bankerUid === r;
this._isDizhu = i;
if (c.default.gameInfoDBD.status === u.eDBDGameStatus.Gameing && o) {
var a = o.roundType, s = o.getPutCards(), l = o.putCardType;
if (a === u.eRoundTypeDBD.Put) {
this._showCards(s, !0);
e && this._showAnimate(l[0], s.length);
}
}
if (c.default.gameInfoDBD.status === u.eDBDGameStatus.SingleEnd && o) {
var d = o.handCards;
if (d.length > 0) e ? this._showCardsAnimate(d) : this._showCards(d, !0); else {
a = o.roundType, s = o.getPutCards();
a === u.eRoundTypeDBD.Put && this._showCards(s, !1);
}
}
};
t.prototype._showAnimate = function(e, t) {
if ([ a.eDBDOneHandType.BOMB, a.eDBDOneHandType.threeBOMB, a.eDBDOneHandType.SOFTBOMB, a.eDBDOneHandType.HARDBOMB, a.eDBDOneHandType.KINGBOMB ].includes(e)) {
this.bombAnimate.node.active = !0;
this.bombAnimate.setAnimation(0, "animation", !1);
}
var o = null;
e === a.eDBDOneHandType.ShunZi && (o = this.sunZi);
e === a.eDBDOneHandType.LianDui && (o = this.lianDui);
o && o.playAnimation("newAnimation", 1);
};
t.prototype._show = function(e, t, o) {
var n = this.cardRoot.getChildByName("card_" + e);
n.active = !0;
var r = a.default.imgPath(t);
s.default.setImg(r, n);
n.removeAllChildren();
if (this._isDizhu) {
var i = this._creatorTitle(n);
n.addChild(i);
}
};
t.prototype._hideAll = function() {
for (var e = 0, t = this.cardRoot.childrenCount; e < t; e++) this.cardRoot.children[e].active = !1;
};
t.prototype._creatorTitle = function(e) {
var t = cc.size(94, 96), o = e.width, n = e.height, r = o / 164, i = n / 218, a = t.width * r, l = t.height * i, c = new cc.Node();
c.setContentSize(a, l);
var u = c.addComponent(cc.Sprite);
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
s.default.setImg("Games/dbd/poker/titleDiZhu", u);
var d = o / 2 - a / 2, p = n / 2 - l / 2;
d = Math.floor(d);
p = Math.floor(p);
c.setPosition(d, p);
return c;
};
r([ y(i.default) ], t.prototype, "posCtr", void 0);
r([ y(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ y(sp.Skeleton) ], t.prototype, "bombAnimate", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "sunZi", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "lianDui", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
