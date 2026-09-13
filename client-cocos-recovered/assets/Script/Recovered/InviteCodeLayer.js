// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "66f4etp7LVJs4L9GfVnWpoB", "InviteCodeLayer");
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
t.bgNode = null;
t.btnCloseNode = null;
t.inviteTipLabel = null;
t.inviteCodeLabel = null;
t.inactiveNode = null;
t.successNode = null;
t.successCodeLabel = null;
return t;
}
t.prototype.start = function() {
var e = this, n = function() {
var o = l.default.myInviteCode || "", h = e.inactiveNode;
e.inviteTipLabel.string = "绑定推荐人邀请码，可获得" + l.default.inviteCodeAward + "张房卡哦！";
if (!h) return;
var tip = e.inviteTipLabel.node, name = h.getChildByName("LabelName"), input = h.getChildByName("InputName"), hint = h.getChildByName("LabelTip");
if (tip) tip.y = 171;
if (input) input.y = 1;
if (hint) hint.y = -54;
if (name) {
name.setAnchorPoint(1, .5);
name.setPosition(-128.4, -4);
}
var row = h.getChildByName("MyInviteRow");
if (!row) {
row = new cc.Node("MyInviteRow");
row.setPosition(0, 90);
h.addChild(row);
if (name) {
var title = cc.instantiate(name);
title.name = "MyTitle";
title.setPosition(name.x, 0);
var tw = title.getComponent(cc.Widget);
if (tw) tw.destroy();
title.getComponent(cc.Label).string = "我的邀请码：";
row.addChild(title);
}
var bg = input && input.getChildByName("BACKGROUND_SPRITE");
var box = bg ? cc.instantiate(bg) : new cc.Node("MyCodeBox");
box.name = "MyCodeBox";
var ww = box.getComponent(cc.Widget);
if (ww) { ww.enabled = !1; ww.destroy(); }
box.setContentSize(363, 56);
box.setPosition(input ? input.x : 63.5, 0);
row.addChild(box);
var code = new cc.Node("MyCode"), cl = code.addComponent(cc.Label);
cl.useSystemFont = !0;
cl.fontFamily = "sans-serif-medium";
cl.fontSize = 30;
cl.lineHeight = 36;
cl.horizontalAlign = 0;
cl.verticalAlign = 1;
cl.spacingX = 4;
code.color = new cc.Color(151, 56, 26);
code.setAnchorPoint(0, .5);
var tl = input && input.getChildByName("TEXT_LABEL");
code.setPosition(tl ? tl.x : -173, 1);
box.addChild(code);
var src = h.getChildByName("BtnSign"), copy = src ? cc.instantiate(src) : new cc.Node("CopyInvite");
copy.name = "CopyInvite";
var bw = copy.getComponent(cc.Widget);
if (bw) bw.destroy();
var bc = copy.getComponent(cc.Button);
if (bc) bc.clickEvents = [];
else copy.addComponent(cc.Button);
copy.setScale(src ? .5 : 1, src ? .5 : 1);
copy.setPosition((input ? input.x : 63.5) + 254, 0);
var lab = copy.getChildByName("Label");
if (lab && lab.getComponent(cc.Label)) lab.getComponent(cc.Label).string = "复 制";
row.addChild(copy);
copy.on(cc.Node.EventType.TOUCH_END, function() {
s.default.clickBtn();
jsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "copyText", "(Ljava/lang/String;)Ljava/lang/String;", l.default.myInviteCode || "");
i.default.uiHelper.showTip("复制成功！");
});
}
var show = row.getChildByName("MyCodeBox");
show = show && show.getChildByName("MyCode");
if (show) show.getComponent(cc.Label).string = o;
if (show && input) { var t2 = input.getChildByName("TEXT_LABEL"); if (t2) show.x = t2.x; }
var bound = l.default.inviteCode || "";
if (bound) {
e.inviteTipLabel.string = "已绑定推荐人邀请码";
if (e.inviteCodeLabel) {
e.inviteCodeLabel.useSystemFont = !0;
e.inviteCodeLabel.fontFamily = "sans-serif-medium";
e.inviteCodeLabel.fontSize = 30;
e.inviteCodeLabel.string = bound;
e.inviteCodeLabel.node.active = !0;
}
if (input) {
var eb = input.getComponent(cc.EditBox);
if (eb) {
eb.string = bound;
eb.enabled = !1;
}
var ph = input.getChildByName("PLACEHOLDER_LABEL");
if (ph) ph.active = !1;
var tl = input.getChildByName("TEXT_LABEL");
if (tl) tl.active = !0;
}
var sign = h.getChildByName("BtnSign");
if (sign) {
var sb = sign.getComponent(cc.Button);
if (sb) {
sb.interactable = !1;
sb.clickEvents = [];
}
var sl = sign.getChildByName("Label");
if (sl && sl.getComponent(cc.Label)) sl.getComponent(cc.Label).string = "已绑定";
}
}
};
c.default.getInviteCode(function() { n(); }, !1);
};
t.prototype.bind = function() {
var e = this;
s.default.clickBtn();
var t = this.inviteCodeLabel.string;
if (t) {
cc.log("发送的邀请码：", t);
var o = {
inviteCode: t
};
c.default.bindInviteCode(o, function(t, o) {
if (o) i.default.uiHelper.showTipNetError(); else if (0 === t.res.error) {
i.default.uiHelper.showTip("绑定成功！");
e.start();
} else i.default.uiHelper.showTip(t.res.what);
});
} else i.default.uiHelper.showTip("请您输入邀请码！");
};
r([ f(cc.Node) ], t.prototype, "bgNode", void 0);
r([ f(cc.Node) ], t.prototype, "btnCloseNode", void 0);
r([ f(cc.Label) ], t.prototype, "inviteTipLabel", void 0);
r([ f(cc.Label) ], t.prototype, "inviteCodeLabel", void 0);
r([ f(cc.Node) ], t.prototype, "inactiveNode", void 0);
r([ f(cc.Node) ], t.prototype, "successNode", void 0);
r([ f(cc.Label) ], t.prototype, "successCodeLabel", void 0);
return t = r([ p ], t);
}(a.default);
o.default = h;
cc._RF.pop();
