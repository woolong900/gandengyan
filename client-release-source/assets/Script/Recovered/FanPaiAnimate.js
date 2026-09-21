// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d907cJUOzRMhbCLtAoESYDR", "FanPaiAnimate");
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
var i = cc._decorator, a = i.ccclass, s = i.property, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cardNode = null;
return t;
}
t.prototype.triggerAnimationEvent = function(e) {
this.cardNode.active = 0 != e;
if (2 == e) {
this.cardNode.x = 0;
this.cardNode.y = -24;
this.cardNode.scaleX = .9;
this.cardNode.scaleY = .36;
} else if (3 == e) {
this.cardNode.x = 0;
this.cardNode.y = -21;
this.cardNode.scaleX = .9;
this.cardNode.scaleY = .6;
} else if (4 == e) {
this.cardNode.x = 0;
this.cardNode.y = -7;
this.cardNode.scaleX = .9;
this.cardNode.scaleY = .9;
}
};
r([ s(cc.Node) ], t.prototype, "cardNode", void 0);
return t = r([ a ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
