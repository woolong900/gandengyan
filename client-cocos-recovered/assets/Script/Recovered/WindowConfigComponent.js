// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9d091JevBRFKa4hBk1fT8HD", "WindowConfigComponent");
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
var i = require("./WindowConfig"), a = cc._decorator, s = a.ccclass, l = a.property, c = a.menu, u = a.disallowMultiple, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.windowID = 0;
t.windowType = i.eWindowType.COMMON;
t.touchOutsideBehavior = i.eWindowTouchOutside.NOTPASS;
t.isShadow = !1;
t.isSingleton = !0;
t.actionShow = i.eWindowAnimateShow.NOTHING;
return t;
}
t.prototype.config = function() {
return {
id: this.windowID,
type: this.windowType,
shadow: this.isShadow,
outside: this.touchOutsideBehavior,
animateShow: this.actionShow,
animateClose: i.eWindowAnimateClose.NOTHING,
singleton: this.isSingleton
};
};
r([ l({
type: cc.Integer,
displayName: "窗口唯一标识ID",
serializable: !0,
tooltip: "窗口唯一标识ID"
}) ], t.prototype, "windowID", void 0);
r([ l({
type: cc.Enum(i.eWindowType),
displayName: "指定父节点",
serializable: !0,
tooltip: "指定类型对应父节点"
}) ], t.prototype, "windowType", void 0);
r([ l({
type: cc.Enum(i.eWindowTouchOutside),
displayName: "点击窗口行为",
serializable: !0,
tooltip: "点击窗口外面行为"
}) ], t.prototype, "touchOutsideBehavior", void 0);
r([ l({
displayName: "显示遮罩",
serializable: !0,
tooltip: "是否显示遮罩"
}) ], t.prototype, "isShadow", void 0);
r([ l({
displayName: "是否只允许弹出一个",
serializable: !0,
tooltip: "是否只允许弹出一个"
}) ], t.prototype, "isSingleton", void 0);
r([ l({
type: cc.Enum(i.eWindowAnimateShow),
displayName: "弹出动画",
serializable: !0,
tooltip: "窗口弹出的动画方式"
}) ], t.prototype, "actionShow", void 0);
return t = r([ s, c("自定义脚本/UIWindowConfig"), u ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
