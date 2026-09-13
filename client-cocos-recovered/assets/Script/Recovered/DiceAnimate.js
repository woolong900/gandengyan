// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "893724LEbZM3obXZ7R9nbxy", "DiceAnimate");
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
var i = e("./Loader"), a = e("./RoomInfoData"), s = e("./GameSoundMJ"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._finishCB = null;
t.animation = null;
t.dicea = null;
t.diceb = null;
return t;
}
t.prototype.setData = function(e) {
this._finishCB = e;
};
t.prototype.start = function() {
var e = this;
s.default.getInstance().dice();
this.animation.play();
this.animation.once(cc.Animation.EventType.FINISHED, function() {
e._finishCB && e._finishCB();
}, this);
};
t.prototype.triggerAnimationEvent = function() {
i.default.setImg("Hall/Res/Animate/dice/a" + a.default.gameInfo.dice1, this.dicea);
i.default.setImg("Hall/Res/Animate/dice/a" + a.default.gameInfo.dice2, this.diceb);
};
r([ u(cc.Animation) ], t.prototype, "animation", void 0);
r([ u(cc.Sprite) ], t.prototype, "dicea", void 0);
r([ u(cc.Sprite) ], t.prototype, "diceb", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
