// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3b2f9AGREZAEYtWdalPeSnS", "EventUtilsComponent");
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
var i = require("./gContext"), a = cc._decorator, s = a.ccclass, l = (a.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.disableOffIds = [];
t.destroyOffIds = [];
return t;
}
t.prototype.pushDisableId = function(e) {
this.disableOffIds.push(e);
};
t.prototype.pushDestroyId = function(e) {
this.destroyOffIds.push(e);
};
t.prototype.onDisable = function() {
for (var e = 0; e < this.disableOffIds.length; e++) {
var t = this.disableOffIds[e];
i.default.eventUtils.off(t);
}
this.disableOffIds = [];
};
t.prototype.onDestroy = function() {
this.onDisable();
for (var e = 0; e < this.destroyOffIds.length; e++) {
var t = this.destroyOffIds[e];
i.default.eventUtils.off(t);
}
this.destroyOffIds = [];
};
return t = r([ s ], t);
}(cc.Component));
o.default = l;
cc._RF.pop();
