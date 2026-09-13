// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "04121UgoEdIfrry3Vi6218T", "D7LocationLayer");
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
var i = e("./RoomInfoData"), a = e("./D7LocationCell"), s = e("./BaseComponent"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rootNode = null;
t.cellPre = null;
return t;
}
t.prototype.start = function() {
this._do(0, 1);
this._do(0, 2);
this._do(0, 3);
this._do(0, 4);
this._do(1, 2);
this._do(1, 3);
this._do(1, 4);
this._do(2, 3);
this._do(2, 4);
this._do(3, 4);
};
t.prototype._do = function(e, t) {
var o = i.default.players.getByPos(e), n = i.default.players.getByPos(t);
if (o && n) {
var r = cc.instantiate(this.cellPre);
this.rootNode.addChild(r);
r.getComponent(a.default).setData(o, n);
}
};
r([ u(cc.Node) ], t.prototype, "rootNode", void 0);
r([ u(cc.Prefab) ], t.prototype, "cellPre", void 0);
return t = r([ c ], t);
}(s.default);
o.default = d;
cc._RF.pop();
