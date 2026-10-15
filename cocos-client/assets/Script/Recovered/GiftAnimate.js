// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "66be8pVygVDD50Wm6xN96b/", "GiftAnimate");
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
var i = require("./SoundUtils"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.animation = null;
return t;
}
t.prototype.giftPlay = function(e) {
var t = this;
this.animation.play("gift_" + e);
this.animation.once(cc.Animation.EventType.FINISHED, function() {
t.node.removeFromParent();
t.node.destroy();
}, this);
};
t.prototype.onPlaySound = function(e) {
i.default.playJoy(e);
};
r([ l(cc.Animation) ], t.prototype, "animation", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
