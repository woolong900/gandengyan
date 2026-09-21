// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8b053Qld0pFGIQDAKgmOf/K", "NameCertificationSuccess");
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
var i = require("./UserData"), a = require("./BaseComponent"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nameLabel = null;
t.cardLabel = null;
return t;
}
t.prototype.start = function() {
this.nameLabel.string = i.default.realName.slice(0, 1) + "**";
this.cardLabel.string = i.default.idCard.indexOf("*") >= 0 ? i.default.idCard : i.default.idCard.slice(0, 6) + "********" + i.default.idCard.slice(-4, i.default.idCard.length);
};
r([ c(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ c(cc.Label) ], t.prototype, "cardLabel", void 0);
return t = r([ l ], t);
}(a.default);
o.default = u;
cc._RF.pop();
