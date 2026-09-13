// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8142cHrAsxOAb++j6dHxJIX", "WindowMgr");
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
var i = e("./WindowConfig"), a = cc._decorator, s = a.ccclass, l = (a.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiData = null;
t.touchOutsideBehavior = i.eWindowTouchOutside.NOTPASS;
t.isShadow = !1;
t.actionShow = i.eWindowAnimateShow.NOTHING;
t.actionClose = i.eWindowAnimateClose.NOTHING;
t.isCleanUi = !0;
return t;
}
o = t;
t.prototype.setUiData = function(e) {
this._uiData = e;
};
t.prototype.getUiData = function() {
return this._uiData;
};
t.push = function(e, t) {
var n = {
root: e,
shadow: e.children[0],
pop: e.children[1],
config: t
};
o.stack.push(n);
};
t.isShow = function(e) {
for (var t = o.stack.length - 1; t >= 0; t--) {
if (o.stack[t].config.id === e) return !0;
}
return !1;
};
t.popup = function(e) {
for (var t = o.stack.length - 1; t >= 0; t--) {
if (o.stack[t].config.type === e) {
return o.stack.splice(t, 1)[0];
}
}
return null;
};
t.popupID = function(e) {
for (var t = o.stack.length - 1; t >= 0; t--) {
if (o.stack[t].config.id === e) {
return o.stack.splice(t, 1)[0];
}
}
return null;
};
t.clean = function() {
o.stack = [];
};
t.count = function() {
return o.stack.length;
};
t.getShowAction = function(e, t) {
return t === i.eWindowAnimateShow.DEFAULT;
};
t.getCloseAction = function(e, t, o) {
var n = void 0;
if (t === i.eWindowAnimateClose.DEFAULT) {
var r = cc.scaleTo(.2, 0).easing(cc.easeSineOut()), a = cc.delayTime(.01), s = cc.callFunc(function() {
o && o();
});
n = cc.sequence(r, a, s);
}
return n;
};
var o;
t.stack = [];
return t = o = r([ s ], t);
}(cc.Component));
o.default = l;
cc._RF.pop();
