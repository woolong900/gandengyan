// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e19f5aMukREJ55sWx7UoKZw", "VoiceRoot");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.messageRoot = null;
t.realTimeRoot = null;
return t;
}
t.prototype.onLoad = function() {
if (a.default.gameLogic(i.default.config.index).isRealTime(i.default.config)) {
this.messageRoot.active = !1;
this.realTimeRoot.active = !0;
} else {
this.messageRoot.active = !0;
this.realTimeRoot.active = !1;
}
};
r([ c(cc.Node) ], t.prototype, "messageRoot", void 0);
r([ c(cc.Node) ], t.prototype, "realTimeRoot", void 0);
return t = r([ l ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
