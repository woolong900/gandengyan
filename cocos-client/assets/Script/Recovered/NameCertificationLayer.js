// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "753eddO5rhLHbKSb7AdL0C9", "NameCertificationLayer");
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
var i = require("./gContext"), a = require("./BaseComponent"), s = require("./SoundUtils"), l = require("./UserData"), c = require("./CenterMsg"), u = require("./WindowConfig"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nameLabel = null;
t.idCardLabel = null;
return t;
}
t.prototype.register = function() {
var e = this;
s.default.clickBtn();
var t = this.nameLabel.string.replace(/[\s\u00a0]+/g, "").replace(/["�]/g, "�"), o = this.idCardLabel.string.replace(/\s+/g, "").toUpperCase();
if (t) if (o) {
var n = {
realName: t,
idCard: o
};
c.default.bindRealName(n, function(n, r) {
if (r) i.default.uiHelper.showTipNetError(); else if (0 === n.res.error) {
i.default.uiHelper.showTip("绑定成功！");
l.default.realName = t;
l.default.idCard = o;
i.default.uiHelper.remove(e);
i.default.uiHelper.show(u.eWindowID.NameCertificationOK);
} else i.default.uiHelper.showTip(n.res.what);
});
} else i.default.uiHelper.showTip("身份证号还没填哦~"); else i.default.uiHelper.showTip("姓名还没填哦~");
};
t.prototype.onClickClose = function() {
s.default.clickBtn();
i.default.uiHelper.remove(this);
l.default.showPopActivity && i.default.uiHelper.show(u.eWindowID.PopActivity);
};
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Label) ], t.prototype, "idCardLabel", void 0);
return t = r([ p ], t);
}(a.default);
o.default = h;
cc._RF.pop();
