// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c7dd3tMe55Oj7hglgItKGe4", "D7PutCardJiaoCtr");
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
var i = require("./D7EventKeys"), a = require("./EventUtils"), s = require("./D7PutCardCtr"), l = require("./gContext"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.putCardCtr = null;
t.jiaoNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(i.default.data_jiao_ok, function(t, o) {
o.pos === e.putCardCtr.deskPos() && e._show();
}, this, a.eOffType.OnDestroy);
};
t.prototype._show = function() {
var e = this;
this.jiaoNode.active = !0;
this.scheduleOnce(function() {
e.jiaoNode.active = !1;
}, 3);
};
r([ d(s.default) ], t.prototype, "putCardCtr", void 0);
r([ d(cc.Node) ], t.prototype, "jiaoNode", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
