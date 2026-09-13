// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1b819T6Y/pHBots49YYWUUR", "WSKPosNextContinueCtr");
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
var i = require("./EventUtils"), a = require("./gContext"), s = require("./WSKEventKeys"), l = require("./WSKPosCtr"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.dragon = null;
t.endNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(s.default.action_next_continue, function(t, o) {
if (o.pos === e.posCtr.deskPos()) {
e.dragon.node.active = !0;
e.dragon.node.scale = 1;
e.dragon.node.x = 0;
e.dragon.node.y = 0;
e.dragon.node.opacity = 255;
e.dragon.playAnimation("newAnimation", 1);
e.dragon.once(dragonBones.EventObject.COMPLETE, function() {
var t = e.endNode.convertToWorldSpaceAR(cc.v2(0, 0)), o = e.dragon.node.parent.convertToNodeSpaceAR(t), n = cc.moveTo(.4, cc.v2(o.x, o.y)).easing(cc.easeOut(2)), r = cc.scaleTo(.4, .3), i = cc.spawn(n, r), a = cc.fadeOut(.2);
e.dragon.node.runAction(cc.sequence(i, a));
});
}
}, this, i.eOffType.OnDestroy);
};
r([ d(l.default) ], t.prototype, "posCtr", void 0);
r([ d(dragonBones.ArmatureDisplay) ], t.prototype, "dragon", void 0);
r([ d(cc.Node) ], t.prototype, "endNode", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
