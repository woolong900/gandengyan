// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c6d6fxGIYpMBpWz+oi5g4m4", "ContactLayer");
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
var i = require("./BaseComponent"), a = require("./GameConstant"), s = require("./SoundUtils"), l = require("./ExUtils"), c = require("./gContext"), u = require("./GameConfig"), d = require("./CommonEnum"), p = require("./UserData"), f = require("./EventKeys"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._wechat = "";
t._tenQQ = "";
t.serviceLabel = null;
t.qjNode = null;
t.hgNode = null;
t.qjServiceWechat = null;
t.qjServiceQQ = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._showServiceInfo();
c.default.eventUtils.on(f.default.data_wechat_change, function(t) {
e._showServiceInfo();
}, this);
c.default.eventUtils.on(f.default.data_tencentqq_change, function(t) {
e._showServiceInfo();
}, this);
};
t.prototype._showServiceInfo = function() {
this._wechat = p.default.serviceWechat || a.default.serviceWechat;
this._tenQQ = p.default.serviceQQ || a.default.serviceQQ;
if (u.default.area() === d.eArea.QJ) {
this.qjServiceQQ.string = "Q Q 号：" + this._tenQQ;
this.qjServiceWechat.string = "微信号：" + this._wechat;
this.qjNode.active = !0;
this.hgNode.active = !1;
} else {
this.qjNode.active = !1;
this.hgNode.active = !0;
}
this.serviceLabel.string = "微信号：" + this._wechat;
};
t.prototype.confirm = function() {
s.default.clickBtn();
l.default.copyText(this._wechat);
c.default.uiHelper.showTip("客服微信号已复制至剪贴板");
c.default.uiHelper.remove(this);
};
t.prototype.confirmQQ = function() {
s.default.clickBtn();
l.default.copyText(this._tenQQ);
c.default.uiHelper.showTip("客服QQ号已复制至剪贴板");
c.default.uiHelper.remove(this);
};
r([ y(cc.Label) ], t.prototype, "serviceLabel", void 0);
r([ y(cc.Node) ], t.prototype, "qjNode", void 0);
r([ y(cc.Node) ], t.prototype, "hgNode", void 0);
r([ y(cc.Label) ], t.prototype, "qjServiceWechat", void 0);
r([ y(cc.Label) ], t.prototype, "qjServiceQQ", void 0);
return t = r([ m ], t);
}(i.default);
o.default = g;
cc._RF.pop();
