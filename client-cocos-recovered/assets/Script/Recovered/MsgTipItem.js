// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8f0a1MYoeZIM6KhKi7zKZT4", "MsgTipItem");
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
var i = e("./MsgTipHelper"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.bgSprite = null;
t.contentLabel = null;
t._content = "";
return t;
}
t.prototype.start = function() {
this.contentLabel.string = "";
};
t.prototype.update = function() {
if (this._uiDirty) {
this.refreshUI();
this._uiDirty = !1;
}
};
t.prototype.init = function(e, t) {
e == i.eTipType.COMMON && (t = "<color=#FFFFFF>" + t + "</color>");
e == i.eTipType.WARNING && (t = "<color=#E01111>" + t + "</color>");
e == i.eTipType.RICHTEXT && (t = t);
this._content = t;
this._uiDirty = !0;
};
t.prototype.refreshUI = function() {
this.contentLabel.string = this._content;
var e = this.contentLabel.node.width + 76;
this.bgSprite.node.width = e > 470 ? e : 470;
};
r([ l(cc.Sprite) ], t.prototype, "bgSprite", void 0);
r([ l(cc.RichText) ], t.prototype, "contentLabel", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
