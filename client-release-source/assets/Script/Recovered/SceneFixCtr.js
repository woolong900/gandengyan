// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "13ebeBgljBHXLpdrUJAHAwp", "SceneFixCtr");
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
var i = cc._decorator, a = i.ccclass, s = (i.property, function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
var e = this.node.getComponent(cc.Canvas);
if (cc.winSize.width / cc.winSize.height < 16 / 9) {
e.fitHeight = !0;
e.fitWidth = !0;
} else {
e.fitHeight = !0;
e.fitWidth = !1;
}
};
t.prototype.start = function() {
var e = -1;
cc.game.on(cc.game.EVENT_HIDE, function() {
e = new Date().getTime();
}, this);
cc.game.on(cc.game.EVENT_SHOW, function() {
if (e > 0) {
new Date().getTime() - e > 18e5 && cc.game.restart();
}
}, this);
};
return t = r([ a ], t);
}(cc.Component));
o.default = s;
cc._RF.pop();
