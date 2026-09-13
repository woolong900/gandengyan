// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6f559M6/ZJOSapk7XO2mf3/", "FanPiZiAnimateCtr");
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
var i = e("./CardShowCtr2D"), a = e("./CardUtils"), s = e("./RoomInfoData"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._beginPos = null;
t._beginScale = 0;
t.animation = null;
t.card = null;
t.pzCardNode = null;
t.lzCardNode = null;
return t;
}
t.prototype.onLoad = function() {
this._beginPos = cc.v2(this.node.x, this.node.y);
this._beginScale = this.card.node.scale;
};
t.prototype.play = function() {
this.card.node.active = !0;
this.card.setData(a.eCardShowType.Hand, s.default.gameInfo.pz);
this.pzCardNode.active = !1;
this.lzCardNode.active = !1;
this._actionMove(.2, .2, .3);
this.animation.play();
this._actionScale(.2, .2, .3);
};
t.prototype._actionMove = function(e, t, o) {
var n = this, r = cc.winSize.width, i = cc.winSize.height, a = this.node.parent.convertToNodeSpaceAR(cc.v2(r / 2, i / 2)), s = cc.v2(a.x, a.y);
this.node.position = s;
var l = cc.delayTime(e + t), c = cc.moveTo(t, this._beginPos).easing(cc.easeOut(1)), u = cc.callFunc(function() {
n.card.node.active = !1;
n.pzCardNode.active = !0;
n.lzCardNode.active = !0;
});
this.node.stopAllActions();
this.node.runAction(cc.sequence(l, c, u));
};
t.prototype._actionScale = function(e, t, o) {
this.card.node.scale = 1;
var n = cc.scaleTo(e, 1.5), r = cc.delayTime(t), i = cc.scaleTo(t, this._beginScale);
this.card.node.runAction(cc.sequence(n, r, i));
};
r([ u(cc.Animation) ], t.prototype, "animation", void 0);
r([ u(i.default) ], t.prototype, "card", void 0);
r([ u(cc.Node) ], t.prototype, "pzCardNode", void 0);
r([ u(cc.Node) ], t.prototype, "lzCardNode", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
