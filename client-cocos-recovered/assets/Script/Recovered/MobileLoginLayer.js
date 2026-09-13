// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5e9beVJO8NIR6jeMqn1ZMa4", "MobileLoginLayer");
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
var i = require("./BaseComponent"), a = require("./SoundUtils"), s = require("./gContext"), l = require("./Http"), c = require("./GameConfig"), u = require("./Storage"), d = require("./CommonEnum"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.parent = null;
t.btnCloseNode = null;
t.mobileLabel = null;
t.codeLabel = null;
t.sendCodeNode = null;
t.countDownNode = null;
t.countDownLabel = null;
return t;
}
t.prototype.start = function() {};
t.prototype.setData = function(e) {
this.parent = e;
this.parent.startCount && this.showCountDown();
u.default.loginMobile.getValue() && (this.mobileLabel.string = u.default.loginMobile.getValue());
};
t.prototype.sendCode = function() {
var e = this;
a.default.clickBtn();
var t = this.mobileLabel.string;
if (t) {
var o = c.default.accountServerAddr + "/mobile/sms?mobile=" + t;
o = c.default.appDunUrl(o);
l.default.get(o, "", function(t, o) {
if (!t) {
var n = JSON.parse(o);
if ("0" == n.err_code) {
s.default.uiHelper.showTip("已发送验证码至手机！");
u.default.loginMobile.setValue(e.mobileLabel.string);
e.countDown();
} else s.default.uiHelper.showTip(n.err_msg);
}
});
} else s.default.uiHelper.showTip("请填写手机号!");
};
t.prototype.showCountDown = function() {
this.sendCodeNode.active = !1;
this.countDownNode.active = !0;
};
t.prototype.stopCountDown = function() {
this.sendCodeNode.active = !0;
this.countDownNode.active = !1;
};
t.prototype.countDown = function() {
this.showCountDown();
this.parent.startCount = !0;
this.countDownLabel.string = this.parent.time + "s";
this.parent.countDown();
};
t.prototype.update = function() {
this.countDownLabel.string = this.parent.time + "s";
0 === this.parent.time && this.stopCountDown();
};
t.prototype.mobileLogin = function() {
a.default.clickBtn();
u.default.lastLoginType.setValue(d.eAccountType.mobile);
var e = this.mobileLabel.string, t = this.codeLabel.string;
if (e) if (t) {
var o = {
mobile: e,
appName: c.default.appName,
accountType: "mobile",
code: t
};
this.parent._mobileLogin(o);
} else s.default.uiHelper.showTip("请填写验证码!"); else s.default.uiHelper.showTip("请填写手机号!");
};
r([ h(cc.Node) ], t.prototype, "btnCloseNode", void 0);
r([ h(cc.EditBox) ], t.prototype, "mobileLabel", void 0);
r([ h(cc.EditBox) ], t.prototype, "codeLabel", void 0);
r([ h(cc.Node) ], t.prototype, "sendCodeNode", void 0);
r([ h(cc.Node) ], t.prototype, "countDownNode", void 0);
r([ h(cc.Label) ], t.prototype, "countDownLabel", void 0);
return t = r([ f ], t);
}(i.default);
o.default = m;
cc._RF.pop();
