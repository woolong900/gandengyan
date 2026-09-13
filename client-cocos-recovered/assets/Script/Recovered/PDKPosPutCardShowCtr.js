// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "47a4bDUqoNPpIIeHmlj9MNY", "PDKPosPutCardShowCtr");
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
var i = e("./PDKPosCtr"), a = e("./PDKCardUtils"), s = e("./Loader"), l = e("./gContext"), c = e("./RoomInfoData"), u = e("./PDKEnum"), d = e("./PDKEventKeys"), p = e("./EventUtils"), f = e("./EventKeys"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.cardRoot = null;
t.bombAnimate = null;
t.feiJiAnimate = null;
t.four2 = null;
t.four3 = null;
t.three2 = null;
t.sunZi = null;
t.lianDui = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.cardRoot.getComponent(cc.Layout).enabled = !1;
l.default.eventUtils.on([ d.default.data_status_change ], function(t, o) {
var n = o.o, r = o.n;
n === u.ePDKGameStatus.Gameing && r === u.ePDKGameStatus.SingleEnd ? e._updateCards(!0) : e._updateCards(!1);
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
for (var o = e, n = 0, r = e.length; n < r; n++) this._show(n, o[n], r);
};
t.prototype._showCardsAnimate = function(e) {
var t = this, o = e.length, n = .8 / o;
n > .08 && (n = .08);
for (var r = function(r) {
i.scheduleOnce(function() {
t._show(r, e[r], o);
}, n * r);
}, i = this, a = 0; a < o; a++) r(a);
};
t.prototype._updateCards = function(e) {
this._hideAll();
if (c.default.gameInfoPDK.status === u.ePDKGameStatus.Gameing) {
var t = this.posCtr.deskPos();
if (i = c.default.gameInfoPDK.siteInfos.get(t)) {
var o = i.roundType, n = i.getPutCards(), r = i.putCardType;
if (o === u.eRoundTypePDK.Put) {
this._showCards(n, !1);
e && this._showAnimate(r, n.length);
}
}
}
if (c.default.gameInfoPDK.status === u.ePDKGameStatus.SingleEnd) {
var i;
t = this.posCtr.deskPos();
if (i = c.default.gameInfoPDK.siteInfos.get(t)) {
var a = i.handCards;
if (a.length > 0) e ? this._showCardsAnimate(a) : this._showCards(a, !0); else {
o = i.roundType, n = i.getPutCards();
o === u.eRoundTypePDK.Put && this._showCards(n, !1);
}
}
}
};
t.prototype._showAnimate = function(e, t) {
if (e === a.ePDKOneHandType.BOMB) {
this.bombAnimate.node.active = !0;
this.bombAnimate.setAnimation(0, "animation", !1);
this.bombAnimate.node.x = this._ax(t, .5);
}
var o = null;
e === a.ePDKOneHandType.Three2 && (o = this.three2);
e !== a.ePDKOneHandType.Four2 && e !== a.ePDKOneHandType.Four2_AAA || (o = this.four2);
e !== a.ePDKOneHandType.Four3 && e !== a.ePDKOneHandType.Four3_AAA || (o = this.four3);
e === a.ePDKOneHandType.FeiJiFull && (o = this.feiJiAnimate);
e === a.ePDKOneHandType.FeiJiLack && (o = this.feiJiAnimate);
e === a.ePDKOneHandType.ShunZi && (o = this.sunZi);
e === a.ePDKOneHandType.LianDui && (o = this.lianDui);
if (o) {
o.playAnimation("newAnimation", 1);
e === a.ePDKOneHandType.Three2 || e === a.ePDKOneHandType.Four2 || e === a.ePDKOneHandType.Four2_AAA || e === a.ePDKOneHandType.Four3 || e === a.ePDKOneHandType.Four3_AAA ? o.node.x = this._ax(t, .5) : o.node.x = this._ax(t, 0, (t - 4) / 2);
}
};
t.prototype._ax = function(e, t, o) {
void 0 === o && (o = 0);
e > 10 && 0 !== this.posCtr.uiPos && (e = 10);
var n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX, i = r * (e - 1) + n;
return (t - this.cardRoot.anchorX) * i + o * r;
};
t.prototype._px = function(e, t) {
var o = this._ax(t, 0), n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX;
0 !== this.posCtr.uiPos && (e %= 10);
return o + n / 2 + e * r;
};
t.prototype._py = function(e, t) {
return -40 * (e = 0 !== this.posCtr.uiPos ? Math.floor(e / 10) : 0);
};
t.prototype._show = function(e, t, o) {
var n = this.cardRoot.getChildByName("card_" + e);
n.active = !0;
var r = a.default.imgPath(t);
s.default.setImg(r, n);
n.x = this._px(e, o);
n.y = this._py(e, o);
};
t.prototype._hideAll = function() {
for (var e = 0, t = this.cardRoot.childrenCount; e < t; e++) this.cardRoot.children[e].active = !1;
};
r([ y(i.default) ], t.prototype, "posCtr", void 0);
r([ y(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ y(sp.Skeleton) ], t.prototype, "bombAnimate", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "feiJiAnimate", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "four2", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "four3", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "three2", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "sunZi", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "lianDui", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
