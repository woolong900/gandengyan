// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "cb2cdSFpqBKU47hr9Pq2a5q", "TotalEndShare");
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
var i = require("./RoomInfoData"), a = require("./StringUtils"), s = require("./TotalEndShareCell"), l = require("./gContext"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rootNode = null;
t.descLabel = null;
t.cellPre = null;
t.cellPre1 = null;
return t;
}
t.prototype.start = function() {
var e = i.default.getTotalEndData(), t = i.default.config.gameCount(), o = i.default.config.playName(), n = l.default.gameLogic().scoreRuleDesc(i.default.config), r = "" + a.default.dateFormat(1e3 * e.time, "yyyy-MM-dd hh:mm:ss"), c = "房号：" + i.default.roomId, u = "局数：" + t + "局", d = "玩法：" + o + "  " + n;
this.descLabel.string = r + "\n" + c + "\n" + u + "\n" + d;
for (var p = 0, f = e.players.length; p < f; p++) {
var h = null;
(h = f > 4 ? cc.instantiate(this.cellPre1) : cc.instantiate(this.cellPre)).getComponent(s.default).setData(p);
this.rootNode.addChild(h);
}
};
r([ d(cc.Node) ], t.prototype, "rootNode", void 0);
r([ d(cc.Label) ], t.prototype, "descLabel", void 0);
r([ d(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ d(cc.Prefab) ], t.prototype, "cellPre1", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
