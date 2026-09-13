// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6f4ed9ddG9PO7A4jj//ivdi", "Control3D");
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
var i = e("./Loader"), a = e("./RoomInfoData"), s = e("./CommonEnum"), l = e("./PaiDunAnimate"), c = e("./CardLayer3D"), u = e("./TableNode"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cardLayerRoot = null;
t.animationRoot = null;
t.cardLayer3D = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
i.default.loadPre("Hall/Res/Prefab/Game/D3/CardLayer3D", function(t) {
if (e.node && e.node.isValid) {
var o = cc.instantiate(t);
e.cardLayerRoot.addChild(o);
e.cardLayer3D = o.getComponent(c.default);
}
});
};
t.prototype.playAnimationBegin = function(e) {
var t = this;
this.animationRoot.destroyAllChildren();
this.cardLayerRoot.active = !1;
var o = this._getPDAnimateLen();
cc.loader.loadResDir("Hall/Res/Animate/pd_ani/pd" + o, function() {
i.default.loadPre("Hall/Res/Prefab/Game/Animate/pd_ani", function(n) {
var r = cc.instantiate(n);
t.animationRoot.addChild(r);
var i = r.getComponent(l.default);
i.init(o);
i.play(function() {
t.animationRoot.destroyAllChildren();
t.cardLayerRoot.active = !0;
if (t.cardLayer3D) {
t.cardLayer3D.initBeginAnimation();
t.scheduleOnce(function() {
var o = t.node.getChildByName("TableNode3D").getComponent(u.default);
o.playAnimationDice();
t.cardLayer3D.playAnimationBegin(function() {
o.endAnimationDice();
e && e();
});
}, .5);
}
});
});
});
};
t.prototype._getPDAnimateLen = function() {
for (var e = 0, t = s.eDeskPos.East; t <= s.eDeskPos.North; t++) if (a.default.gameInfo && a.default.gameInfo.siteInfos) {
var o = a.default.gameInfo.siteInfos.get(t);
if (o) {
var n = o.paiDunCards.length;
n > e && (e = n);
}
}
return Math.floor(e / 2);
};
r([ f(cc.Node) ], t.prototype, "cardLayerRoot", void 0);
r([ f(cc.Node) ], t.prototype, "animationRoot", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
