// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9dda3ht2MlDaohtcO9ZvHUE", "PDKPosPositionPutCardCtr");
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
var i = e("./RoomInfoData"), a = e("./PDKPosCtr"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.cardRoot = null;
t.animateRoot = null;
return t;
}
t.prototype.start = function() {
var e = 128;
i.default.isPlayback() && (e = 190);
if (2 === this.posCtr.uiPos) {
this.cardRoot.x = e;
this.animateRoot.x = e;
}
if (1 === this.posCtr.uiPos) {
this.cardRoot.x = -e;
this.animateRoot.x = -e;
}
if (0 === this.posCtr.uiPos) {
this.cardRoot.x = 0;
this.animateRoot.x = 0;
if (i.default.isPlayback()) {
this.cardRoot.y = this.cardRoot.y = -112;
this.animateRoot.y = -155;
} else {
this.cardRoot.y = -32;
this.animateRoot.y = -75;
}
}
};
r([ c(a.default) ], t.prototype, "posCtr", void 0);
r([ c(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ c(cc.Node) ], t.prototype, "animateRoot", void 0);
return t = r([ l ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
