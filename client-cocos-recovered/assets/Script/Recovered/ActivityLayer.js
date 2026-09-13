// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bb726gTUqVIi6LBoUggBhwW", "ActivityLayer");
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
var i = require("./ListContentBtn"), a = require("./gContext"), s = require("./BaseComponent"), l = require("./SoundUtils"), c = require("./CenterMsg"), u = require("./UserData"), d = require("./GameConstant"), p = require("./GameConfig"), f = require("./CommonEnum"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.list = null;
t.content = null;
t.input = null;
t.activityRoot = null;
t.wechat = null;
t.tencent = null;
return t;
}
t.prototype.start = function() {
if (u.default.isReivew) {
this.activityRoot.getChildByName("Btn0").removeFromParent();
this.activityRoot.getChildByName("Btn1").removeFromParent();
this.dispatchClick(2);
}
this.list.getComponent(i.default).setParent(this);
this.wechat.getComponent(cc.Label).string = u.default.serviceWechat || d.default.serviceWechat;
this.tencent.getComponent(cc.Label).string = u.default.serviceQQ || d.default.serviceQQ;
p.default.area() === f.eArea.QJ && (this.tencent.active = !0);
};
t.prototype.dispatchClick = function(e) {
for (var t = 1; t < 6; t++) this.content.getChildByName("page_" + t).active = !1;
var o = e + 1;
this.content.getChildByName("page_" + o).active = !0;
};
t.prototype.sendMsg = function() {
var e = this;
l.default.clickBtn();
var t = this.input.string;
if (t) {
var o = {
content: t
};
c.default.applyAgent(o, function(t, o) {
if (!o) {
e.input.string = "";
a.default.uiHelper.showTip("发送成功！");
}
});
} else a.default.uiHelper.showTip("请填写您的联系方式！");
};
r([ y(cc.Node) ], t.prototype, "list", void 0);
r([ y(cc.Node) ], t.prototype, "content", void 0);
r([ y(cc.EditBox) ], t.prototype, "input", void 0);
r([ y(cc.Node) ], t.prototype, "activityRoot", void 0);
r([ y(cc.Node) ], t.prototype, "wechat", void 0);
r([ y(cc.Node) ], t.prototype, "tencent", void 0);
return t = r([ m ], t);
}(s.default);
o.default = g;
cc._RF.pop();
