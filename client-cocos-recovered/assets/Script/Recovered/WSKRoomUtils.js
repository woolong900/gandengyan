// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "216b0RCddRKaYABH8l/is9L", "WSKRoomUtils");
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
var i = e("./RoomInfoData"), a = e("./Singleton"), s = cc._decorator, l = s.ccclass, c = (s.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.viewPos2DeskPos = function(e, t) {
null !== t && void 0 !== t || (t = i.default.myAbsolutePos());
return (e + t) % i.default.config.peopleCount();
};
t.prototype.deskPos2ViewPos = function(e, t) {
void 0 !== t && null !== t || (t = i.default.myAbsolutePos());
var o = e - t, n = i.default.config.peopleCount();
return (n + o) % n;
};
t.prototype.uiPos2ViewPos = function(e) {
return e;
};
t.prototype.isViewDown = function(e) {
return e > 0 && i.default.players.getByUid(e).pos === i.default.myAbsolutePos();
};
return t = r([ l ], t);
}(a.default));
o.default = c;
cc._RF.pop();
