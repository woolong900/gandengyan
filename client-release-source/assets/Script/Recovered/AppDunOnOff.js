// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c1eb53cfYNOxKEHFEUl6v+e", "AppDunOnOff");
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
var i = require("./gContext"), a = require("./Http"), s = cc._decorator, l = s.ccclass, c = (s.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
i.default.eventUtils.emit("on_off_ok");
};
t.prototype._get = function(e) {
var t = this;
a.default.get(e, null, function(o, n) {
if (o) ; else try {
var r = JSON.parse(n);
if (0 == r.err_code) {
r.data;
i.default.eventUtils.emit("on_off_ok");
return;
}
} catch (e) {}
t.scheduleOnce(function() {
t._get(e);
}, 1);
});
};
return t = r([ l ], t);
}(cc.Component));
o.default = c;
cc._RF.pop();
