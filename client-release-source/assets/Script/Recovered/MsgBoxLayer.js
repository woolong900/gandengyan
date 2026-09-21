// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e6ad8F9Z0ZHY6Lqha98jE34", "MsgBoxLayer");
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
var i = require("./BaseComponent"), a = require("./SoundUtils"), s = require("./gContext"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._confirmCB = null;
t.contentRichText = null;
t.titleLabel = null;
return t;
}
t.prototype.start = function() {};
t.prototype.setData = function(e, t, o) {
this.contentRichText.string = e;
this.titleLabel.string = t;
this._confirmCB = o;
};
t.prototype.onCLickConfirm = function() {
a.default.clickBtn();
this._confirmCB && this._confirmCB();
s.default.uiHelper.remove(this);
};
r([ u(cc.RichText) ], t.prototype, "contentRichText", void 0);
r([ u(cc.Label) ], t.prototype, "titleLabel", void 0);
return t = r([ c ], t);
}(i.default);
o.default = d;
cc._RF.pop();
