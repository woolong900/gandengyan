// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "702a4Sxz7hF04FtkQhQE9X4", "ScrollViewOptimization");
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
var i = cc._decorator, a = i.ccclass, s = (i.property, i.menu), l = i.requireComponent, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._sv = null;
t._con = null;
t._top = null;
t._bottom = null;
t._left = null;
t._right = null;
return t;
}
t.prototype.start = function() {
this._sv = this.node.getComponent(cc.ScrollView);
this._con = this._sv.content;
this._top = this._sv.node.getContentSize().height / 2;
this._bottom = -this._top;
this._right = this._sv.node.getContentSize().width / 2;
this._left = -this._right;
};
t.prototype.update = function() {
var e = this, t = this._con.children;
if (!(t.length <= 0)) {
var o = t[0].getContentSize(), n = o.width / 2, r = o.height / 2, i = this._top + r, a = this._bottom - r, s = this._left - n, l = this._right + n;
t.forEach(function(t) {
var o = t.position.add(e._con.position);
o.x > s && o.x < l && o.y > a && o.y < i ? t.group = "UI" : t.group = "NoRender";
});
}
};
return t = r([ a, s("自定义脚本/ScrollViewOptimization"), l(cc.ScrollView) ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
