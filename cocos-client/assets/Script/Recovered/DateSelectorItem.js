// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "95edbpjUSVNLLFA02rvSeNo", "DateSelectorItem");
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
var i = require("./EventKeys"), a = require("./SoundUtils"), s = require("./gContext"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t._selected = !1;
t._selectCB = null;
t.selectNode = null;
t.unselectNode = null;
t.selectLabel = null;
t.unselectLabel = null;
return t;
}
t.prototype.setData = function(e, t) {
this._index = e;
this._selectCB = t;
var o = e + 1;
this.selectLabel.string = "" + o;
this.unselectLabel.string = "" + o;
};
t.prototype.setSelect = function(e) {
this.selectNode.active = e;
this.unselectNode.active = !e;
this._selected = e;
};
t.prototype.setEnable = function(e) {
if (e) {
this.node.getComponent(cc.Button).enabled = !0;
this.unselectLabel.node.opacity = 255;
} else {
this.node.getComponent(cc.Button).enabled = !1;
this.unselectLabel.node.opacity = 102;
}
};
t.prototype.onClick = function() {
a.default.clickBtn();
if (this._selected) ; else {
this.setSelect(!0);
this._selectCB(this._index);
s.default.eventUtils.emit(i.default.ui_date_selector_time_reset);
setTimeout(function() {
s.default.eventUtils.emit(i.default.ui_date_selector_time_change, [ 0, 0, 0, 0, 0, 0 ]);
}, 0);
}
};
r([ u(cc.Node) ], t.prototype, "selectNode", void 0);
r([ u(cc.Node) ], t.prototype, "unselectNode", void 0);
r([ u(cc.Label) ], t.prototype, "selectLabel", void 0);
r([ u(cc.Label) ], t.prototype, "unselectLabel", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
