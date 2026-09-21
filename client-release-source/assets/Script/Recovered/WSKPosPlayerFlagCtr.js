// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "92d1esHnUdJP7ZdKhvomjjX", "WSKPosPlayerFlagCtr");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./gContext"), c = require("./WSKEnum"), u = require("./WSKEventKeys"), d = require("./WSKPosCtr"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.flagZhuang = null;
t.flagFriend = null;
t.flagBao = null;
t.flagHou = null;
t.baoAnimate = null;
t.houAnimate = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(u.default.data_friend_change, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on(u.default.data_zhuang_change, function(t, o) {
o.action && a.default.gameInfoWSK.is1V3() ? e._getPlayer().uid === a.default.gameInfoWSK.zhuangUid && (a.default.config.index === i.eGameIds.XSWSK ? e._playHou() : e._playBao()) : e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._playBao = function() {
var e = this;
this.baoAnimate.node.active = !0;
this.baoAnimate.node.scale = 1;
this.baoAnimate.node.x = 0;
this.baoAnimate.node.y = 0;
var t = this.flagBao.convertToWorldSpaceAR(cc.v2(-this.flagBao.x, -this.flagBao.y)), o = this.baoAnimate.node.convertToNodeSpaceAR(t);
this.baoAnimate.playAnimation("newAnimation", 1);
this.baoAnimate.once(dragonBones.EventObject.COMPLETE, function() {
var t = cc.bezierTo(.4, [ cc.v2(0, 0), cc.v2(o.x / 2, o.y / 2 + 80), cc.v2(o.x, o.y) ]).easing(cc.easeOut(3)), n = cc.scaleTo(.4, .3), r = cc.spawn(t, n), i = cc.callFunc(function() {
e.baoAnimate.node.active = !1;
e._uiDirty = !0;
}), a = cc.sequence(r, i);
e.baoAnimate.node.runAction(a);
}, this);
};
t.prototype._playHou = function() {
var e = this;
this.houAnimate.node.active = !0;
this.houAnimate.node.scale = 1;
this.houAnimate.node.x = 0;
this.houAnimate.node.y = 0;
var t = this.flagBao.convertToWorldSpaceAR(cc.v2(-this.flagBao.x, -this.flagBao.y)), o = this.houAnimate.node.convertToNodeSpaceAR(t);
this.houAnimate.playAnimation("newAnimation", 1);
this.houAnimate.once(dragonBones.EventObject.COMPLETE, function() {
var t = cc.bezierTo(.4, [ cc.v2(0, 0), cc.v2(o.x / 2, o.y / 2 + 80), cc.v2(o.x, o.y) ]).easing(cc.easeOut(3)), n = cc.scaleTo(.4, .3), r = cc.spawn(t, n), i = cc.callFunc(function() {
e.houAnimate.node.active = !1;
e._uiDirty = !0;
}), a = cc.sequence(r, i);
e.houAnimate.node.runAction(a);
}, this);
};
t.prototype._updateUI = function() {
this.flagZhuang.active = !1;
this.flagBao.active = !1;
this.flagFriend.active = !1;
this.flagHou.active = !1;
if (a.default.gameInfoWSK.status !== c.eWSKGameStatus.Free && a.default.gameInfoWSK.status !== c.eWSKGameStatus.Calling) {
var e = this._getPlayer();
if (e) {
if (e.uid === a.default.gameInfoWSK.zhuangUid) {
a.default.gameInfoWSK.is1V3() ? a.default.config.index === i.eGameIds.XSWSK ? this.flagHou.active = !0 : this.flagBao.active = !0 : this.flagZhuang.active = !0;
}
e.uid === a.default.gameInfoWSK.friendUid && (this.flagFriend.active = !0);
}
}
};
t.prototype._getPlayer = function() {
var e = this.posCtr.deskPos();
return a.default.players.getByPos(e);
};
r([ h(d.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "flagZhuang", void 0);
r([ h(cc.Node) ], t.prototype, "flagFriend", void 0);
r([ h(cc.Node) ], t.prototype, "flagBao", void 0);
r([ h(cc.Node) ], t.prototype, "flagHou", void 0);
r([ h(dragonBones.ArmatureDisplay) ], t.prototype, "baoAnimate", void 0);
r([ h(dragonBones.ArmatureDisplay) ], t.prototype, "houAnimate", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
