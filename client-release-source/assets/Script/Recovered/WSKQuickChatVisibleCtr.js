// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bca2dxftmdOuqjga/No+w1+", "WSKQuickChatVisibleCtr");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./gContext"), c = require("./WSKEnum"), u = require("./WSKEventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rootNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(u.default.data_status_change, function() {
e.updateUI();
}, this, s.eOffType.OnDestroy);
this.updateUI();
};
t.prototype.updateUI = function() {
this.rootNode.active = !0;
if (a.default.config.index !== i.eGameIds.QJSHZ) return this.rootNode.active = !1;
a.default.isPlayback() || a.default.isWatcher() ? this.rootNode.active = !1 : a.default.gameInfoWSK.status === c.eWSKGameStatus.Free && (this.rootNode.active = !1);
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
