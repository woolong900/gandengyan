// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "62ab91WSotL4LuB/1ktmDdi", "TableAnimate");
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
var i = e("./BaseComponent"), a = e("./CommonEnum"), s = e("./gContext"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.animation = null;
return t;
}
t.prototype.setData = function(e) {
var t = this, o = this.animation.getAnimationState("table_ani");
if (e === a.eViewPos.Left) {
o.wrapMode = cc.WrapMode.Normal;
o.repeatCount = 1;
this.animation.play();
} else if (e === a.eViewPos.Right) {
o.wrapMode = cc.WrapMode.Reverse;
o.repeatCount = 1;
this.animation.play();
} else {
if (e !== a.eViewPos.Up) {
cc.error("错误");
return;
}
o.wrapMode = cc.WrapMode.Normal;
o.repeatCount = 2;
this.animation.play();
}
this.animation.once(cc.Animation.EventType.FINISHED, function() {
s.default.uiHelper.remove(t);
}, this);
};
r([ u(cc.Animation) ], t.prototype, "animation", void 0);
return t = r([ c ], t);
}(i.default);
o.default = d;
cc._RF.pop();
