// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b5c82FxsidBQ6k+ZMVCfkNo", "Loading");
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
var i = require("./BaseComponent"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._descStr = null;
t._delay = 0;
t.mask = null;
t.animationNode = null;
t.desc = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (this._delay > 0) {
this.mask.node.opacity = 0;
this.scheduleOnce(function() {
e.mask.node.opacity = 180;
}, this._delay);
} else e.mask.node.opacity = 180;
};
t.prototype.setData = function(e, t) {
var o = this;
this._delay = t;
if (e) {
this._descStr = e;
this.desc.string = this._descStr;
this.desc.node.opacity = 0;
this.scheduleOnce(function() {
o.desc.node.opacity = 255;
o.desc.node.x = -(o.desc.node.width + 20) / 2;
});
var n = cc.delayTime(.3), r = cc.callFunc(function() {
o.desc.string = o._descStr;
}), i = cc.delayTime(.3), a = cc.callFunc(function() {
o.desc.string = o._descStr + ".";
}), s = cc.delayTime(.3), l = cc.callFunc(function() {
o.desc.string = o._descStr + "..";
}), c = cc.delayTime(.3), u = cc.callFunc(function() {
o.desc.string = o._descStr + "...";
}), d = cc.repeatForever(cc.sequence(n, r, i, a, s, l, c, u));
this.node.runAction(d);
}
};
r([ l(cc.Sprite) ], t.prototype, "mask", void 0);
r([ l(dragonBones.ArmatureDisplay) ], t.prototype, "animationNode", void 0);
r([ l(cc.Label) ], t.prototype, "desc", void 0);
return t = r([ s ], t);
}(i.default);
o.default = c;
cc._RF.pop();
