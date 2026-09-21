// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "09497DbDc1GZqsL8l44tQdq", "MsgBoxCommon");
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
var i = require("./gContext"), a = require("./SoundUtils"), s = require("./BaseComponent"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._content = "";
t._confirmCB = null;
t._cancelCB = null;
t._closeCB = null;
t._confirmRemove = !0;
t._cancelRemove = !0;
t.contentLabel = null;
t.confirmNode = null;
t.cancelNode = null;
t.closeNode = null;
t.confirmLabel = null;
t.cancelLabel = null;
return t;
}
t.prototype.start = function() {
this.contentLabel.string = this._content || "";
};
t.prototype.setContent = function(e) {
this._content = e;
return this;
};
t.prototype.setConfirmCB = function(e) {
this._confirmCB = e;
return this;
};
t.prototype.setCancelCB = function(e) {
this._cancelCB = e;
return this;
};
t.prototype.setCloseCB = function(e) {
this._closeCB = e;
return this;
};
t.prototype.setConfirmRemove = function(e) {
this._confirmRemove = e;
return this;
};
t.prototype.setCancelRemove = function(e) {
this._cancelRemove = e;
return this;
};
t.prototype.setShowCancel = function(e) {
if (e) {
this.cancelNode.active = !0;
this.confirmNode.x = -this.cancelNode.x;
} else {
this.cancelNode.active = !1;
this.confirmNode.x = 0;
}
return this;
};
t.prototype.setShowClose = function(e) {
this.closeNode.active = e;
return this;
};
t.prototype.setConfirmStr = function(e) {
this.confirmLabel.string = e;
};
t.prototype.setCancelStr = function(e) {
this.cancelLabel.string = e;
};
t.prototype.onClickOK = function() {
a.default.clickBtn();
this._confirmRemove && i.default.uiHelper.remove(this);
this._confirmCB && this._confirmCB();
};
t.prototype.onClickCancel = function() {
a.default.clickBtn();
this._cancelRemove && i.default.uiHelper.remove(this);
this._cancelCB && this._cancelCB();
};
t.prototype.onClickClose = function() {
a.default.clickBtn();
this._closeCB ? this._closeCB() : i.default.uiHelper.remove(this);
};
r([ u(cc.RichText) ], t.prototype, "contentLabel", void 0);
r([ u(cc.Node) ], t.prototype, "confirmNode", void 0);
r([ u(cc.Node) ], t.prototype, "cancelNode", void 0);
r([ u(cc.Node) ], t.prototype, "closeNode", void 0);
r([ u(cc.Label) ], t.prototype, "confirmLabel", void 0);
r([ u(cc.Label) ], t.prototype, "cancelLabel", void 0);
return t = r([ c ], t);
}(s.default);
o.default = d;
cc._RF.pop();
