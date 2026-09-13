// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a3f1cHFq09MnKXlDj/IZ3i7", "DDZPosPutCardShowCtr");
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
var i = e("./DDZPosCtr"), a = e("./DDZCardUtils"), s = e("./Loader"), l = e("./gContext"), c = e("./RoomInfoData"), u = e("./DDZEnum"), d = e("./DDZEventKeys"), p = e("./EventUtils"), f = e("./DDZGameControl"), h = e("./GameSoundDDZ"), m = e("./DDZRoomUtils"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.cardRoot = null;
t.passNode = null;
t.animBg = null;
t.putCardRootArray = [];
t.bombAnimate = null;
t.feiJiAnimate = null;
t.four2 = null;
t.four3 = null;
t.three3 = null;
t.three2 = null;
t.three1 = null;
t.sunZi = null;
t.lianDui = null;
t.wangzha = null;
t.hj = null;
t._isDizhu = !1;
t._delayComponent = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.cardRoot.getComponent(cc.Layout).enabled = !1;
l.default.eventUtils.on([ d.default.data_status_change ], function(t, o) {
var n = o.o, r = o.n;
n === u.eDDZGameStatus.Gameing && r === u.eDDZGameStatus.SingleEnd ? e._updateCards(!0) : e._updateCards(!1);
}, this, p.eOffType.OnDestroy);
l.default.eventUtils.on([ d.default.data_round_data_update ], function(t, o) {
var n = o.pos;
if (o.pos === e.posCtr.deskPos()) {
c.default.gameInfoDDZ.siteInfos.get(n).roundType === u.eRoundTypeDDZ.Pass ? e.showPass() : e._updateCards(!0);
}
}, this, p.eOffType.OnDestroy);
l.default.eventUtils.on(d.default.playback_data_remain, function() {
e._hideAll();
}, this, p.eOffType.OnDestroy);
this._updateCards(!1);
};
t.prototype.showPass = function() {
var e = this;
this._hideAll();
this.passNode.active = !0;
if (c.default.isPlayback()) {
this.passNode.stopAllActions();
cc.tween(this.passNode).delay(1.5).call(function() {
e.passNode.active = !1;
}).start();
}
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
var t = this;
this.passNode.active = !1;
if (c.default.gameInfoDDZ.b_isDelay_time) {
this._delayComponent = function() {
t._hideAll();
};
this.scheduleOnce(this._delayComponent, 1.5);
} else this._hideAll();
var o = this.posCtr.deskPos(), n = c.default.players.getByPos(o), r = n ? n.uid : 99999999999999, i = c.default.gameInfoDDZ.bankerUid === r;
this._isDizhu = i;
if (c.default.gameInfoDDZ.status === u.eDDZGameStatus.Gameing) {
var a = this.posCtr.uiPos;
if (p = c.default.gameInfoDDZ.siteInfos.get(o)) {
var s = p.roundType, l = p.getPutCards(), d = p.putCardType;
if (s === u.eRoundTypeDDZ.Put) {
if (this._delayComponent) {
this.unschedule(this._delayComponent);
this._delayComponent = null;
}
this._showCards(l, !1);
e && this._showAnimate(d, l.length, a);
}
}
}
if (c.default.gameInfoDDZ.status === u.eDDZGameStatus.SingleEnd) {
var p, f = this.posCtr.deskPos();
if (p = c.default.gameInfoDDZ.siteInfos.get(f)) {
var h = p.handCards;
if (h.length > 0) e ? this._showCardsAnimate(h) : this._showCards(h, !0); else {
s = p.roundType, l = p.getPutCards();
s === u.eRoundTypeDDZ.Put && this._showCards(l, !1);
}
}
}
};
t.prototype.getAmimBoomAngle = function(e, t) {
var o = 0;
0 == e && 1 == t && (o = 135);
0 == e && 2 == t && (o = -135);
1 == e && 1 != t && (o = -135);
2 == e && 2 != t && (o = 135);
return o;
};
t.prototype._showAnimate = function(e, t, o) {
var n = this;
if ([ a.eDDZOneHandType.SoftBomb, a.eDDZOneHandType.HardBomb ].includes(e)) {
this.bombAnimate.playAnimation("newAnimation", 1);
this.bombAnimate.node.setPosition(cc.v2(-280, 0));
this.bombAnimate.node.x = this._ax(t, .5);
var r = m.default.getInstance().viewPos2DeskPos(o), i = c.default.gameInfoDDZ.siteInfos.getLastPut(r), s = r, l = 4;
if (i) {
s = i.pos;
l = i.getPutCards().length;
}
var u = m.default.getInstance().deskPos2ViewPos(s), d = this.bombAnimate.node.position, p = this.putCardRootArray[u], y = this.getPlayerPutPos(l, u), g = p.convertToWorldSpaceAR(y), _ = this.bombAnimate.node.parent.convertToNodeSpaceAR(g), v = cc.callFunc(function() {
this._cardRootShake(u);
h.default.getInstance().wzSound("zd_Bomb");
}, this), C = this.getAmimBoomAngle(this.posCtr.uiPos, u), b = cc.sequence(cc.spawn(cc.rotateBy(.5, C), this.createBezier(.5, d, _, 100, 60)), v);
this.bombAnimate.node.angle = C;
this.bombAnimate.node.runAction(b);
}
if (e === a.eDDZOneHandType.KINGBOMB) {
this.animBg.opacity = 100;
this.hj.node.stopAllActions();
this.hj.playAnimation("newAnimation", 0);
this.hj.node.active = !0;
this.hj.node.x = this._ax(t, .5);
this.hj.node.y = 100;
h.default.getInstance().wzSound("wz_common");
g = this.posCtr.node.parent.convertToWorldSpaceAR(cc.v2(0, 100));
var D = this.hj.node.parent.convertToNodeSpaceAR(g);
cc.tween(this.hj.node).set({
scaleY: 1.2
}).to(.3, {
y: 900
}).set({
scaleY: -1.2
}).set({
x: D.x
}).to(.3, {
position: D
}).call(function() {
f.default.getInstance().viewShake();
h.default.getInstance().wzSound("zd_Bomb");
n.hj.node.active = !1;
n.wangzha.playAnimation("newAnimation", 1);
n.wangzha.node.setPosition(D);
cc.tween(n.animBg).to(.5, {
opacity: 0
}).start();
}).start();
}
var S = null;
e === a.eDDZOneHandType.Three && (S = this.three3);
e === a.eDDZOneHandType.ThreeTwo && (S = this.three2);
e === a.eDDZOneHandType.ThreeOne && (S = this.three1);
e !== a.eDDZOneHandType.FourOne && e !== a.eDDZOneHandType.FourTwo || (S = this.four2);
e !== a.eDDZOneHandType.FeiJi && e !== a.eDDZOneHandType.FeiJiOne && e !== a.eDDZOneHandType.FeiJiTwo || (S = this.feiJiAnimate);
e === a.eDDZOneHandType.ShunZi && (S = this.sunZi);
e === a.eDDZOneHandType.LianDui && (S = this.lianDui);
if (S) {
S.playAnimation("newAnimation", 1);
e === a.eDDZOneHandType.Three || e === a.eDDZOneHandType.ThreeTwo || e === a.eDDZOneHandType.FourOne || e === a.eDDZOneHandType.FourTwo || e === a.eDDZOneHandType.ThreeOne ? S.node.x = this._ax(t, .5) : S.node.x = this._ax(t, 0, (t - 4) / 2);
}
};
t.prototype.createBezier = function(e, t, o, n, r) {
var i = 3.14159 * r / 180, a = t.x + (o.x - t.x) / 4, s = cc.v2(a, n + t.y + Math.cos(i) * Math.abs(a)), l = t.x + (o.x - t.x) / 2, c = cc.v2(l, n + t.y + Math.cos(i) * Math.abs(l));
return cc.bezierTo(e, [ s, c, o ]).easing(cc.easeInOut(.5));
};
t.prototype.getPlayerPutPos = function(e, t) {
if (0 == t) return cc.v2(0, 0);
if (1 == t) {
var o = -(73 + 28 * (e - 1));
return cc.v2(o / 2, 0);
}
if (2 == t) {
o = 73 + 28 * (e - 1);
return cc.v2(o / 2, 0);
}
};
t.prototype._ax = function(e, t, o) {
void 0 === o && (o = 0);
e > 11 && 0 !== this.posCtr.uiPos && (e = 11);
var n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX, i = r * (e - 1) + n;
return (t - this.cardRoot.anchorX) * i + o * r;
};
t.prototype._px = function(e, t) {
var o = this._ax(t, 0), n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX;
0 !== this.posCtr.uiPos && (e %= 11);
return o + n / 2 + e * r;
};
t.prototype._py = function(e, t) {
return -40 * (e = 0 !== this.posCtr.uiPos ? Math.floor(e / 11) : 0);
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
n.x = this._px(e, o);
n.y = this._py(e, o);
};
t.prototype._hideAll = function() {
for (var e = 0, t = this.cardRoot.childrenCount; e < t; e++) this.cardRoot.children[e].active = !1;
};
t.prototype._creatorTitle = function(e) {
var t = cc.size(94, 96), o = e.width, n = e.height, r = o / 164, i = n / 218, a = t.width * r, l = t.height * i, c = new cc.Node();
c.setContentSize(a, l);
var u = c.addComponent(cc.Sprite);
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
s.default.setImg("Games/Poker/titleDiZhu", u);
var d = o / 2 - a / 2, p = n / 2 - l / 2;
d = Math.floor(d);
p = Math.floor(p);
c.setPosition(d, p);
return c;
};
t.prototype._cardRootShake = function(e) {
cc.tween(this.putCardRootArray[e]).delay(.05).by(.2, {
y: 70
}, {
easing: cc.easing.backOut
}).delay(.15).by(.15, {
y: -70
}, {
easing: cc.easing.backOut
}).start();
};
r([ _(i.default) ], t.prototype, "posCtr", void 0);
r([ _(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ _(cc.Node) ], t.prototype, "passNode", void 0);
r([ _(cc.Node) ], t.prototype, "animBg", void 0);
r([ _(cc.Node) ], t.prototype, "putCardRootArray", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "bombAnimate", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "feiJiAnimate", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "four2", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "four3", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "three3", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "three2", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "three1", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "sunZi", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "lianDui", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "wangzha", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "hj", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
