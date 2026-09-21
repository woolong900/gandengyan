// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dc546uGaflPyJTLSW/NyljB", "TrAdjust");
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
t.rootNode = null;
t.im_line = null;
return t;
}
t.prototype.adjustWidth = function(e) {
var t = [], o = this.rootNode.width;
this.im_line && (this.im_line.node.width = e);
for (var n = this.rootNode.children, r = 0, i = n.length; r < i; r++) {
var a = n[r], s = a.width / o * e;
t.push(s);
a.width = s;
}
return t;
};
r([ s(cc.Node) ], t.prototype, "rootNode", void 0);
r([ s(cc.Sprite) ], t.prototype, "im_line", void 0);
return t = r([ a ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
