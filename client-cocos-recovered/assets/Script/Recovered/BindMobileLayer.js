// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0f23fbSx3JB37Daf4pK7Ogd", "BindMobileLayer");
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
var i = e("./gContext"), a = e("./BaseComponent"), s = e("./SoundUtils"), l = e("./CenterMsg"), c = e("./WindowConfig"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isUpdate = !1;
t.bgNode = null;
t.btnCloseNode = null;
t.tipLabel = null;
t.mobileLabel = null;
t.codeLabel = null;
t.sendCodeNode = null;
t.countDownNode = null;
t.countDownLabel = null;
t.inactiveNode = null;
t.successNode = null;
return t;
}
t.prototype.setData = function(e) {
this.isUpdate = e;
this.isUpdate && (this.tipLabel.string = "更换已绑定的手机号。");
};
t.prototype.sendCode = function() {
var e = this;
s.default.clickBtn();
var t = this.mobileLabel.string;
if (t) {
cc.log("发送验证码");
var o = {
mobile: t
};
l.default.getVerifyCode(o, function(t, o) {
if (!o) {
i.default.uiHelper.showTip("已发送验证码至手机！");
e.countDown();
}
});
} else i.default.uiHelper.showTip("请填写手机号!");
};
t.prototype.countDown = function() {
var e = this;
this.sendCodeNode.active = !1;
this.countDownNode.active = !0;
var t = 60;
this.schedule(function() {
if (0 == t) {
e.countDownNode.active = !1;
e.sendCodeNode.active = !0;
e.unscheduleAllCallbacks();
}
t--;
e.countDownLabel.string = t + "s";
}, 1);
};
t.prototype.bind = function() {
var e = this;
s.default.clickBtn();
var t = this.mobileLabel.string, o = this.codeLabel.string;
if (t) if (o) {
cc.log("验证的信息是：", t, o);
var n = {
mobile: t,
verificationCode: o
};
l.default.bindMobile(n, function(t, o) {
if (o) i.default.uiHelper.showTipNetError(); else if (0 === t.res.error) {
i.default.uiHelper.showTip("绑定成功！");
i.default.uiHelper.remove(e);
i.default.uiHelper.show(c.eWindowID.BindMobileOK);
} else i.default.uiHelper.showTip(t.res.what);
});
} else i.default.uiHelper.showTip("请填写验证码!"); else i.default.uiHelper.showTip("请填写手机号!");
};
r([ p(cc.Node) ], t.prototype, "bgNode", void 0);
r([ p(cc.Node) ], t.prototype, "btnCloseNode", void 0);
r([ p(cc.Label) ], t.prototype, "tipLabel", void 0);
r([ p(cc.Label) ], t.prototype, "mobileLabel", void 0);
r([ p(cc.Label) ], t.prototype, "codeLabel", void 0);
r([ p(cc.Node) ], t.prototype, "sendCodeNode", void 0);
r([ p(cc.Node) ], t.prototype, "countDownNode", void 0);
r([ p(cc.Label) ], t.prototype, "countDownLabel", void 0);
r([ p(cc.Node) ], t.prototype, "inactiveNode", void 0);
r([ p(cc.Node) ], t.prototype, "successNode", void 0);
return t = r([ d ], t);
}(a.default);
o.default = f;
cc._RF.pop();
