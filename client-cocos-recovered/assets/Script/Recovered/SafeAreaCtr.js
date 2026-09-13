// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0a2ffAd3SlM16TC4y61jm4R", "SafeAreaCtr");
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
var i = e("./GameConfig"), a = e("./CommonEnum"), s = cc._decorator, l = s.ccclass, c = (s.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
o = t;
t.prototype.onLoad = function() {
var e = o.offsetX();
if (e > .001) {
var t = this.node.getComponent(cc.Widget);
if (t) {
t.isAlignLeft && (t.left = t.left + e);
t.isAlignRight && (t.right = t.right + e);
}
}
};
t.offsetX = function() {
if (i.default.platform === a.ePlatformType.iOS) {
var e = cc.sys.getSafeAreaRect(), t = cc.director.getWinSize(), o = t.width - e.width;
cc.log("rect is:", e.width);
cc.log("rect is:", e.height);
cc.log("winSize is:", t.width);
cc.log("winSize is:", t.height);
if (o > .001) {
o > 20 && (o -= 20);
return o / 2;
}
}
return 0;
};
var o;
return t = o = r([ l ], t);
}(cc.Component));
o.default = c;
cc._RF.pop();
