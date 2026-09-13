// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6e095hLICNIKIffKxC98arE", "D7PlaybackUICtr");
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
var i = require("./RoomInfoData"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.roomInfoNode = null;
t.gameInfoNoae = null;
t.myOperateNode = null;
return t;
}
t.prototype.start = function() {
if (i.default.isPlayback()) {
this.roomInfoNode.active = !1;
this.gameInfoNoae.getComponent(cc.Widget).isAlignHorizontalCenter = !0;
this.myOperateNode.active = !1;
} else this.enabled = !1;
};
r([ l(cc.Node) ], t.prototype, "roomInfoNode", void 0);
r([ l(cc.Node) ], t.prototype, "gameInfoNoae", void 0);
r([ l(cc.Node) ], t.prototype, "myOperateNode", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
