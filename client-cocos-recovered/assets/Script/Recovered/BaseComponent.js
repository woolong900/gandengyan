// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "172eaOQUvJFPKvTNDdJdyBR", "BaseComponent");
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
var i = e("./gContext"), a = e("./SoundUtils"), s = cc._decorator, l = s.ccclass, c = (s.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._windowID = -1;
return t;
}
t.prototype.onClickClose = function() {
a.default.clickBtn();
i.default.uiHelper.remove(this);
};
t.prototype.setData = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
cc.log("params is:", e.join(","));
};
t.prototype.setWindowID = function(e) {
this._windowID = e;
};
t.prototype.getWindowID = function() {
return this._windowID;
};
return t = r([ l ], t);
}(cc.Component));
o.default = c;
cc._RF.pop();
