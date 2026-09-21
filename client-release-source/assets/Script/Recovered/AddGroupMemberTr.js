// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "139f2e5nGBAuZX5rhDAW1hA", "AddGroupMemberTr");
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
var i = require("./SoundUtils"), a = require("./gContext"), s = require("./WindowConfig"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._groupId = 0;
t._idx = 0;
t.rootNode = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this._groupId = e;
this._idx = t;
this.rootNode.width = o;
};
t.prototype.onAddGroupClick = function() {
i.default.clickBtn();
a.default.uiHelper.show(s.eWindowID.AddMemberLayer, this._groupId, this._idx);
};
r([ u(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
