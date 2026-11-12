// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b1546zAgBJGqp9A+aneSR1I", "GDPosPutCardShowCtr");
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
var i = require("./Loader"), a = require("./gContext"), s = require("./RoomInfoData"), l = require("./EventUtils"), c = require("./GDEnum"), u = require("./GDEventKeys"), d = require("./GDCardUtils"), p = require("./GDRoomUtils"), f = require("./GDGameControl"), h = require("./GDPosCtr"), m = require("./GameSoundGD"), g = cc._decorator, y = g.ccclass, _ = g.property, v = function(e) {
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
t.tonghuashun = null;
t.hj = null;
t.jiefeng = null;
t._isDizhu = !1;
t._delayComponent = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.cardRoot.getComponent(cc.Layout).enabled = !1;
2 == this.posCtr.uiPos && (this.cardRoot.x = 0);
a.default.eventUtils.on([ u.default.data_status_change ], function(t, o) {
var n = o.o, r = o.n;
n === c.eGDGameStatus.Gameing && r === c.eGDGameStatus.SingleEnd ? e._updateCards(!0) : r != c.eGDGameStatus.gongpai && e._updateCards(!1);
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ u.default.romove_gongpai ], function(t, o) {
var n = o.pos, r = o.cards;
n === e.posCtr.deskPos() && e._showgongpai(r, !0);
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ u.default.data_round_data_update ], function(t, o) {
var n = o.pos;
if (o.pos === e.posCtr.deskPos()) {
s.default.gameInfoGD.siteInfos.get(n).roundType === c.eRoundTypeGD.Pass ? e.showPass() : e._updateCards(!0);
}
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ u.default.data_round_data_update_jiefeng ], function(t, o) {
var n = o.pos;
if (o.pos === e.posCtr.deskPos()) {
s.default.gameInfoGD.siteInfos.get(n).roundType === c.eRoundTypeGD.Pass ? e.showPass() : e._updateCards(!0);
}
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on(u.default.playback_data_remain, function() {
e._hideAll();
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on(u.default.player_jiefeng, function(t, o) {
if (0 == e.posCtr.uiPos) {
var n = s.default.players.getByUid(o.uid);
a.default.uiHelper.showTip(n.name + "接风");
e.jiefeng.playAnimation("newAnimation", 1);
}
e._hideAll();
}, this, l.eOffType.OnDestroy);
this._updateCards(!1);
};
t.prototype.showPass = function() {
var e = this;
this._hideAll();
this.passNode.active = !0;
if (s.default.isPlayback()) {
this.passNode.stopAllActions();
cc.tween(this.passNode).delay(1.5).call(function() {
e.passNode.active = !1;
}).start();
}
};
t.prototype._showCards = function(e, t, o) {
void 0 === o && (o = d.eGDOneHandType.Double);
for (var n = e, r = 0, i = e.length; r < i; r++) this._show(r, n[r], i, o);
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
0 == this.posCtr.uiPos && (s.default.isPlayback() ? this.cardRoot.y = -140 : this.cardRoot.y = 40);
this.passNode.active = !1;
var o = this.posCtr.deskPos(), n = s.default.players.getByPos(o);
if (s.default.gameInfoGD.b_isDelay_time) {
this._delayComponent = function() {
s.default.gameInfoGD.status === c.eGDGameStatus.SingleEnd || t._hideAll();
};
this.scheduleOnce(this._delayComponent, 1.5);
} else this._hideAll();
var r = n ? n.uid : 99999999999999, i = s.default.gameInfoGD.bankerUid === r;
this._isDizhu = i;
if (s.default.gameInfoGD.status === c.eGDGameStatus.Gameing) {
var a = this.posCtr.uiPos;
if (p = s.default.gameInfoGD.siteInfos.get(o)) {
var l = p.roundType, u = p.getPuariRealCards(), d = p.putCardType;
if (l === c.eRoundTypeGD.Put) {
if (this._delayComponent) {
this.unschedule(this._delayComponent);
this._delayComponent = null;
}
this._showCards(u, !1, d);
e && this._showAnimate(d, u.length, a);
}
}
}
s.default.gameInfoGD.status === c.eGDGameStatus.gongpai && n && (n.gongPai >= 10 || n.gongPai <= -10) && this._showgongpai([ n.gongPai ]);
if (s.default.gameInfoGD.status === c.eGDGameStatus.SingleEnd) {
0 == this.posCtr.uiPos && (this.cardRoot.y = -100);
this._hideAll();
var p, f = this.posCtr.deskPos();
if (p = s.default.gameInfoGD.siteInfos.get(f)) {
var h = p.handCards;
if (h.length > 0) e ? this._showCardsAnimate(h) : this._showCards(h, !0); else {
l = p.roundType, u = p.getPutCards();
l === c.eRoundTypeGD.Put && this._showCards(u, !1);
}
}
}
};
t.prototype.getAmimBoomAngle = function(e, t) {
var o = 0;
0 == e && 1 == t && (o = 135);
0 == e && 2 == t && (o = -135);
1 == e && 1 != t && (o = -135);
2 == e && 1 == t && (o = 135);
2 == e && 3 == t && (o = -135);
3 == e && 3 != t && (o = 135);
return o;
};
t.prototype._showAnimate = function(e, t, o) {
var n = this;
if ([ d.eGDOneHandType.SiBomb, d.eGDOneHandType.WuBomb, d.eGDOneHandType.LiuBomb, d.eGDOneHandType.QiBomb, d.eGDOneHandType.BaBomb, d.eGDOneHandType.JiuBomb, d.eGDOneHandType.ShiBomb ].includes(e)) {
this.bombAnimate.playAnimation("newAnimation", 1);
this.bombAnimate.node.setPosition(cc.v2(-280, 0));
this.bombAnimate.node.x = this._ax(t, .5);
var r = p.default.getInstance().viewPos2DeskPos(o), i = s.default.gameInfoGD.siteInfos.getputLastPut(r), l = r, c = 4;
if (i) {
l = i.pos;
c = i.getPutCards().length;
} else {
var u = s.default.gameInfoGD.nextRound;
if (u) {
l = u.pos;
c = u.cards;
s.default.gameInfoGD.nextRound = void 0;
}
}
var h = p.default.getInstance().deskPos2ViewPos(l), g = this.bombAnimate.node.position;
if (a.default.gameLogic(s.default.config.index).isErRen(s.default.config)) {
0 == this.posCtr.uiPos && l != r && (h = 2);
2 == this.posCtr.uiPos && (h = l == r ? 2 : 0);
}
var y = this.putCardRootArray[h], _ = this.getPlayerPutPos(c, h), v = y.convertToWorldSpaceAR(_), C = this.bombAnimate.node.parent.convertToNodeSpaceAR(v), b = cc.callFunc(function() {
this._cardRootShake(h);
m.default.getInstance().wzSound("zd_Bomb");
}, this), D = this.getAmimBoomAngle(this.posCtr.uiPos, h), S = cc.sequence(cc.spawn(cc.rotateBy(.5, D), this.createBezier(.5, g, C, 100, 60)), b);
this.bombAnimate.node.angle = D;
this.bombAnimate.node.runAction(S);
}
if (e === d.eGDOneHandType.KINGBOMB) {
this.animBg.opacity = 100;
this.hj.node.stopAllActions();
this.hj.playAnimation("newAnimation", 0);
this.hj.node.active = !0;
this.hj.node.x = this._ax(t, .5);
this.hj.node.y = 100;
m.default.getInstance().wzSound("wz_common");
v = this.posCtr.node.parent.convertToWorldSpaceAR(cc.v2(0, 100));
var w = this.hj.node.parent.convertToNodeSpaceAR(v);
cc.tween(this.hj.node).set({
scaleY: 1.2
}).to(.3, {
y: 900
}).set({
scaleY: -1.2
}).set({
x: w.x
}).to(.3, {
position: w
}).call(function() {
f.default.getInstance().viewShake();
m.default.getInstance().wzSound("zd_Bomb");
n.hj.node.active = !1;
n.wangzha.playAnimation("newAnimation", 1);
n.wangzha.node.setPosition(w);
cc.tween(n.animBg).to(.5, {
opacity: 0
}).start();
}).start();
}
var O = null;
e === d.eGDOneHandType.Three && (O = this.three3);
e === d.eGDOneHandType.ThreeTwo && (O = this.three2);
e === d.eGDOneHandType.FeiJi && (O = this.feiJiAnimate);
e === d.eGDOneHandType.ShunZi && (O = this.sunZi);
e === d.eGDOneHandType.LianDui && (O = this.lianDui);
e === d.eGDOneHandType.TongHuaShun && (O = this.tonghuashun);
if (O) {
O.playAnimation("newAnimation", 1);
e === d.eGDOneHandType.Three || e === d.eGDOneHandType.ThreeTwo || e === d.eGDOneHandType.FeiJi ? O.node.x = this._ax(t, .5) : O.node.x = this._ax(t, 0, (t - 4) / 2);
}
};
t.prototype.createBezier = function(e, t, o, n, r) {
var i = 3.14159 * r / 180, a = t.x + (o.x - t.x) / 4, s = cc.v2(a, n + t.y + Math.cos(i) * Math.abs(a)), l = t.x + (o.x - t.x) / 2, c = cc.v2(l, n + t.y + Math.cos(i) * Math.abs(l));
return cc.bezierTo(e, [ s, c, o ]).easing(cc.easeInOut(.5));
};
t.prototype.getPlayerPutPos = function(e, t) {
if (a.default.gameLogic(s.default.config.index).isErRen(s.default.config)) {
if (0 == this.posCtr.uiPos) return cc.v2(0, 0);
if (2 == this.posCtr.uiPos) return cc.v2(0, 40);
}
if (0 == t) return cc.v2(0, 40);
if (1 == t) {
var o = -(53 + 45 * (e - 2));
return cc.v2(o / 2, 0);
}
if (2 == t) return cc.v2(0, 40);
if (3 == t) {
o = 53 + 45 * (e - 2);
return cc.v2(o / 2, 0);
}
};
t.prototype._ax = function(e, t, o) {
void 0 === o && (o = 0);
e > 10 && 0 !== this.posCtr.uiPos && 2 !== this.posCtr.uiPos && (e = 10);
var n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX, i = r * (e - 1) + n;
return (t - this.cardRoot.anchorX) * i + o * r;
};
t.prototype._px = function(e, t) {
var o = this._ax(t, 0), n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX;
0 !== this.posCtr.uiPos && 2 !== this.posCtr.uiPos && (e %= 10);
return o + n / 2 + e * r;
};
t.prototype._py = function(e, t) {
return -40 * (e = 0 !== this.posCtr.uiPos && 2 !== this.posCtr.uiPos ? Math.floor(e / 10) : 0);
};
t.prototype._showgongpai = function(e, t) {
void 0 === t && (t = !1);
var o = this.cardRoot.getChildByName("card_0");
o.active = !0;
var n = e[0], r = 0;
if (t) r = s.default.gameInfoGD.GongPaiputShow; else {
n <= -10 && (r = 2);
n >= 10 && (r = 1);
n < 0 && (n *= -1);
}
var a = d.default.imgPath(n, !1, !0);
i.default.setImg(a, o);
o.removeAllChildren();
s.default.gameInfoGD.bottomCard;
if (n % 10 == 0 && 170 != n && 180 != n) {
var l = new cc.Node(), c = l.addComponent(cc.Sprite);
c.sizeMode = cc.Sprite.SizeMode.CUSTOM;
i.default.setImg("Games/GdPoker/jipai_laizi", c);
o.addChild(l);
l.width = o.width;
l.height = o.height;
l.setPosition(0, 0);
}
var u = "Games/GdPoker/jinLog";
2 == r && (u = "Games/GdPoker/huanLog");
var p = new cc.Node(), f = p.addComponent(cc.Sprite);
i.default.setImg(u, f);
o.addChild(p);
p.setScale(1, 1);
p.setPosition(13, 29);
o.x = this._px(0, 1);
o.y = this._py(0, 1);
};
t.prototype._show = function(e, t, o, n) {
void 0 === n && (n = d.eGDOneHandType.Double);
var r = this.cardRoot.getChildByName("card_" + e);
r.active = !0;
var a = d.default.imgPath(t, !1, !0);
i.default.setImg(a, r);
r.removeAllChildren();
var l = s.default.gameInfoGD.bottomCard;
if (t % 10 == 0 && 170 != t && 180 != t) {
var c = new cc.Node(), u = c.addComponent(cc.Sprite);
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
i.default.setImg("Games/GdPoker/jipai_laizi", u);
r.addChild(c);
c.width = r.width;
c.height = r.height;
c.setPosition(0, 0);
}
if (Math.floor(l / 10) == Math.floor(t / 10)) {
var p = new cc.Node(), f = p.addComponent(cc.Sprite);
f.sizeMode = cc.Sprite.SizeMode.CUSTOM;
i.default.setImg("Games/GdPoker/jipai_laizi", f);
r.addChild(p);
p.width = r.width;
p.height = r.height;
p.setPosition(0, 0);
if (t % 10 == 3) {
var h = new cc.Node(), m = h.addComponent(cc.Sprite);
i.default.setImg("Games/GdPoker/peipaibiao", m);
r.addChild(h);
h.setScale(.8, .8);
h.setPosition(-27, -24);
}
}
r.x = this._px(e, o);
r.y = this._py(e, o);
};
t.prototype._hideAll = function() {
for (var e = 0, t = this.cardRoot.childrenCount; e < t; e++) this.cardRoot.children[e].active = !1;
};
t.prototype._creatorTitle = function(e) {
var t = cc.size(94, 96), o = e.width, n = e.height, r = o / 164, a = n / 218, s = t.width * r, l = t.height * a, c = new cc.Node();
c.setContentSize(s, l);
var u = c.addComponent(cc.Sprite);
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
i.default.setImg("Games/Poker/titleDiZhu", u);
var d = o / 2 - s / 2, p = n / 2 - l / 2;
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
r([ _(h.default) ], t.prototype, "posCtr", void 0);
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
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "tonghuashun", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "hj", void 0);
r([ _(dragonBones.ArmatureDisplay) ], t.prototype, "jiefeng", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
