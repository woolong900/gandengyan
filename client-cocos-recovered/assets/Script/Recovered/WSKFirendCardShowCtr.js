// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "60f66zPq7JBLabUOIkm2U6y", "WSKFirendCardShowCtr");
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
var i = e("./RoomInfoData"), a = e("./Loader"), s = e("./EventUtils"), l = e("./GameSoundWSK"), c = e("./gContext"), u = e("./WSKEnum"), d = e("./WSKEventKeys"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.bgNode = null;
t.cardSprite = null;
t.animationNode = null;
t.animation = null;
t.endNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
c.default.eventUtils.on(d.default.data_friend_card_change, function(t, o) {
o.action ? e._playAnimation(function(t) {
2 === t && (e._uiDirty = !0);
}) : e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.play = function() {
var e = this;
return new Promise(function(t) {
e.enabled = !1;
e.bgNode.active = !1;
e.cardSprite.node.active = !1;
e._playAnimation(function(o) {
1 === o && t();
2 === o && (e.enabled = !0);
});
});
};
t.prototype._playAnimation = function(e) {
var t = this;
this.animationNode.active = !0;
this.animationNode.scale = 1;
this.animationNode.x = 0;
this.animationNode.y = 50;
this.animation.play();
this.animation.once(cc.Animation.EventType.FINISHED, function() {
l.default.getInstance().showFirendCard();
var o = t.endNode.convertToWorldSpaceAR(cc.v2(0, 0)), n = t.animationNode.parent.convertToNodeSpaceAR(o), r = cc.moveTo(.4, cc.v2(n.x, n.y)).easing(cc.easeOut(2)), i = cc.scaleTo(.4, .3), a = cc.spawn(r, i), s = cc.callFunc(function() {
t.animationNode.active = !1;
e(2);
}), c = cc.sequence(cc.delayTime(.3), a, s);
e(1);
t.animationNode.runAction(c);
}, this);
};
t.prototype._updateUI = function() {
this.bgNode.active = !1;
this.cardSprite.node.active = !1;
if (this._isShow()) {
var e = i.default.gameInfoWSK.friendCard, t = c.default.gameLogic().cardImgPath(e);
this.bgNode.active = !0;
this.cardSprite.node.active = !0;
a.default.setImg(t, this.cardSprite);
}
};
t.prototype._isShow = function() {
var e = i.default.gameInfoWSK.status;
return e !== u.eWSKGameStatus.Calling && (e !== u.eWSKGameStatus.ShowXiPai && (e !== u.eWSKGameStatus.Free && (!i.default.gameInfoWSK.is1V3() && !(i.default.gameInfoWSK.friendCard <= 0))));
};
r([ h(cc.Node) ], t.prototype, "bgNode", void 0);
r([ h(cc.Sprite) ], t.prototype, "cardSprite", void 0);
r([ h(cc.Node) ], t.prototype, "animationNode", void 0);
r([ h(cc.Animation) ], t.prototype, "animation", void 0);
r([ h(cc.Node) ], t.prototype, "endNode", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
