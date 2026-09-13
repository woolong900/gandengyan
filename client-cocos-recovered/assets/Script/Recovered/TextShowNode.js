// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9af0ealkTpAK7v/PMuePn3o", "TextShowNode");
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
var i = e("./CommonEnum"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rt = null;
t.rb = null;
t.lt = null;
t.lb = null;
return t;
}
t.prototype.setData = function(e, t) {
this.rt.active = !1;
this.rb.active = !1;
this.lt.active = !1;
this.lb.active = !1;
var o = null;
e === i.eViewPos.LeftTop && (o = this.lt);
e === i.eViewPos.LeftBottom && (o = this.lb);
e === i.eViewPos.RightTop && (o = this.rt);
e === i.eViewPos.RightBottom && (o = this.rb);
o.active = !0;
var n = o.getChildByName("bg"), r = o.getChildByName("label");
t.length <= 10 ? r.getComponent(cc.Label).overflow = cc.Label.Overflow.NONE : r.getComponent(cc.Label).overflow = cc.Label.Overflow.RESIZE_HEIGHT;
r.getComponent(cc.Label).string = t || "";
var a = r.height;
this.scheduleOnce(function() {
var e = r.height + 30 + 34 - a;
e < 64 && (e = 64);
n.height = e;
n.width = r.width + 40;
});
};
r([ l(cc.Node) ], t.prototype, "rt", void 0);
r([ l(cc.Node) ], t.prototype, "rb", void 0);
r([ l(cc.Node) ], t.prototype, "lt", void 0);
r([ l(cc.Node) ], t.prototype, "lb", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
