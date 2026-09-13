// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b18f1agfKlKX4qQn+A0X1++", "CardHighlight");
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
var i = e("./BaseComponent"), a = e("./CommonEnum"), s = e("./UserData"), l = e("./CardShowCtr2D"), c = e("./CardUtils"), u = e("./CardHandShowCtr3D"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.root = null;
t.card2d = null;
t.card3d = null;
return t;
}
t.prototype.setData = function(e) {
if (s.default.gameView === a.eGameView.View2D) {
(t = cc.instantiate(this.card2d)).getComponent(l.default).setData(c.eCardShowType.Hand, e);
this.root.addChild(t);
} else {
var t;
(t = cc.instantiate(this.card3d)).getComponent(u.default).setData(e);
this.root.addChild(t);
}
};
r([ f(cc.Node) ], t.prototype, "root", void 0);
r([ f(cc.Prefab) ], t.prototype, "card2d", void 0);
r([ f(cc.Prefab) ], t.prototype, "card3d", void 0);
return t = r([ p ], t);
}(i.default);
o.default = h;
cc._RF.pop();
