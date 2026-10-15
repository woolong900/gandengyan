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
var i = require("./BaseComponent"), a = require("./GameConstant"), s = require("./SoundUtils"), l = require("./ExUtils"), c = require("./gContext"), u = require("./GameConfig"), d = require("./UserData"), p = require("./EventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._wechat = "";
t._tenQQ = "";
t._sending = !1;
t._messages = [];
t._serviceOnline = !1;
t._chatRoot = null;
t._statusLabel = null;
t._contactLabel = null;
t._editBox = null;
t._scroll = null;
t._messageContent = null;
t.serviceLabel = null;
t.qjNode = null;
t.hgNode = null;
t.qjServiceWechat = null;
t.qjServiceQQ = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._buildChatUi();
this._showServiceInfo();
c.default.eventUtils.on(p.default.data_wechat_change, function() {
e._showServiceInfo();
}, this);
c.default.eventUtils.on(p.default.data_tencentqq_change, function() {
e._showServiceInfo();
}, this);
c.default.eventUtils.on("support_chat_update", function(t, o) {
e._applySupport(o || {});
}, this);
this._requestHistory();
};
t.prototype._panel = function(e, t, o, n, r, i, a, s) {
var l = new cc.Node(t);
l.parent = e;
l.setContentSize(o, n);
l.setPosition(r || 0, i || 0);
var c = l.addComponent(cc.Graphics);
c.fillColor = a;
c.roundRect(-o / 2, -n / 2, o, n, s || 10);
c.fill();
return l;
};
t.prototype._label = function(e, t, o, n, r, i, a, s, l) {
var c = new cc.Node(t), u = c.addComponent(cc.Label);
c.parent = e;
c.setPosition(i || 0, a || 0);
c.setContentSize(s || 200, l || n + 8);
c.color = r || cc.color(86, 66, 34);
u.string = o || "";
u.fontSize = n || 20;
u.lineHeight = (n || 20) + 4;
u.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
u.verticalAlign = cc.Label.VerticalAlign.CENTER;
u.overflow = cc.Label.Overflow.SHRINK;
return u;
};
t.prototype._button = function(e, t, o, n, r, i, a, s) {
var l = this._panel(e, t, o, n, r, i, a, 10);
this._label(l, "Label", s, 18, cc.color(255, 255, 255), 0, 0, o - 10, n - 4);
l.on(cc.Node.EventType.TOUCH_END, function() {
this[t] && this[t]();
}, this);
return l;
};
t.prototype._buildEditBox = function(e) {
var t = this._panel(e, "MessageInput", 840, 64, 0, -178, cc.color(255, 253, 247), 12);
var o = new cc.Node("EditArea");
o.parent = t;
o.setContentSize(690, 56);
o.setPosition(-60, 0);
var n = new cc.Node("Text"), r = n.addComponent(cc.Label);
n.parent = o;
n.setContentSize(650, 48);
n.anchorX = 0;
n.setPosition(-325, 5);
n.color = cc.color(70, 56, 38);
r.fontSize = 19;
r.lineHeight = 24;
r.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
r.verticalAlign = cc.Label.VerticalAlign.CENTER;
r.overflow = cc.Label.Overflow.CLAMP;
var i = new cc.Node("Placeholder"), a = i.addComponent(cc.Label);
i.parent = o;
i.setContentSize(650, 48);
i.anchorX = 0;
i.setPosition(-325, 5);
i.color = cc.color(161, 145, 118);
a.string = "请输入您的问题（1–200字）";
a.fontSize = 18;
a.lineHeight = 24;
a.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
a.verticalAlign = cc.Label.VerticalAlign.CENTER;
a.overflow = cc.Label.Overflow.SHRINK;
var s = o.addComponent(cc.EditBox);
s.textLabel = r;
s.placeholderLabel = a;
s.textLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
s.placeholderLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
s.maxLength = 200;
s.inputMode = cc.EditBox.InputMode.ANY;
s.inputFlag = cc.EditBox.InputFlag.DEFAULT;
s.returnType = cc.EditBox.KeyboardReturnType.DONE;
this._editBox = s;
this._button(t, "sendSupport", 106, 38, 351, -8, cc.color(198, 126, 35), "发送");
};
t.prototype._buildChatUi = function() {
this.node.setContentSize(920, 520);
var e = this.node.getChildByName("WindowBg");
if (e) {
e.setContentSize(920, 520);
var t = e.getChildByName("TitleBg");
if (t) {
var o = t.getChildByName("Title");
o && o.getComponent(cc.Label) && (o.getComponent(cc.Label).string = "在线客服");
}
}
this.qjNode && (this.qjNode.active = !1);
this.hgNode && (this.hgNode.active = !1);
var r = new cc.Node("SupportChat");
r.parent = this.node;
r.setContentSize(880, 450);
r.setPosition(0, -18);
this._chatRoot = r;
this._statusLabel = this._label(r, "Status", "● 正在连接客服…", 18, cc.color(104, 80, 45), -305, 190, 250, 30);
this._statusLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
this._contactLabel = this._label(r, "Contact", "", 16, cc.color(113, 89, 55), 15, 190, 420, 30);
this._contactLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
this._button(r, "confirm", 86, 34, 285, 190, cc.color(65, 151, 102), "复制微信");
this._button(r, "confirmQQ", 82, 34, 380, 190, cc.color(74, 126, 168), "复制QQ");
this._panel(r, "MessageBg", 840, 280, 0, 0, cc.color(239, 232, 218), 12);
var i = new cc.Node("MessageView");
i.parent = r;
i.setContentSize(820, 260);
i.setPosition(0, 0);
var a = i.addComponent(cc.Mask);
a.type = cc.Mask.Type.RECT;
var s = new cc.Node("Content");
s.parent = i;
s.anchorY = 1;
s.setContentSize(810, 260);
s.setPosition(0, 130);
var l = i.addComponent(cc.ScrollView);
l.content = s;
l.horizontal = !1;
l.vertical = !0;
l.inertia = !0;
l.brake = .75;
this._scroll = l;
this._messageContent = s;
this._buildEditBox(r);
var f = this._label(r, "Context", "将自动携带玩家 ID与当前版本，如正在牌局中会同时携带房间信息。", 15, cc.color(132, 110, 76), -35, -220, 710, 26);
f.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
this._renderMessages();
};
t.prototype._timeText = function(e) {
var t = new Date(Number(e) || Date.now()), o = t.getHours(), n = t.getMinutes();
return (o < 10 ? "0" : "") + o + ":" + (n < 10 ? "0" : "") + n;
};
t.prototype._renderMessages = function() {
if (!this._messageContent) return;
this._messageContent.removeAllChildren();
var e = this._messages.length ? this._messages.slice(-30) : [ {
from: "admin", content: "您好，这里是官方客服。请描述您遇到的问题，我们会尽快回复。", createdAt: Date.now()
} ], t = [], o = 10;
for (var n = 0; n < e.length; n++) {
var r = String(e[n].content || ""), i = r.split("\n"), a = 0;
for (var s = 0; s < i.length; s++) a += Math.max(1, Math.ceil(i[s].length / 30));
var l = Math.max(58, 42 + 20 * a);
t.push(l);
o += l + 10;
}
var c = Math.max(260, o);
this._messageContent.setContentSize(810, c);
this._messageContent.setPosition(0, 130);
var u = 8;
for (n = 0; n < e.length; n++) {
var d = e[n], p = t[n], f = "player" === d.from, h = this._panel(this._messageContent, "Message" + n, 630, p, f ? 78 : -78, -u - p / 2, f ? cc.color(202, 132, 48) : cc.color(255, 252, 246), 14), m = this._label(h, "Text", (f ? "我" : "客服") + "  " + this._timeText(d.createdAt) + "\n" + String(d.content || ""), 17, f ? cc.color(255, 255, 255) : cc.color(83, 65, 42), 0, 0, 590, p - 12);
m.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
m.verticalAlign = cc.Label.VerticalAlign.CENTER;
m.overflow = cc.Label.Overflow.SHRINK;
u += p + 10;
}
var y = this;
this.scheduleOnce(function() {
y._scroll && y._scroll.scrollToBottom(.05);
}, 0);
};
t.prototype._showServiceInfo = function() {
this._wechat = d.default.serviceWechat || a.default.serviceWechat || "";
this._tenQQ = d.default.serviceQQ || a.default.serviceQQ || "";
this.qjServiceQQ && (this.qjServiceQQ.string = "Q Q 号：" + this._tenQQ);
this.qjServiceWechat && (this.qjServiceWechat.string = "微信号：" + this._wechat);
this.serviceLabel && (this.serviceLabel.string = "微信号：" + this._wechat);
this._contactLabel && (this._contactLabel.string = "服务时间 09:00–22:00  ·  微信 " + (this._wechat || "未设置") + "  ·  QQ " + (this._tenQQ || "未设置"));
};
t.prototype._requestHistory = function() {
c.default.gameMsgBase().gameJson({
msghead: "support_history",
msgdata: JSON.stringify({})
}, function(e, t, o) {
o && c.default.uiHelper.showTip("客服消息加载失败，请检查网络");
}, !0);
};
t.prototype._applySupport = function(e) {
if (e.conversation && Array.isArray(e.conversation.messages)) this._messages = e.conversation.messages;
void 0 !== e.serviceOnline && (this._serviceOnline = !!e.serviceOnline);
e.serviceWechat && (this._wechat = e.serviceWechat);
e.serviceQQ && (this._tenQQ = e.serviceQQ);
if (this._statusLabel) {
this._statusLabel.string = this._serviceOnline ? "● 客服在线" : "● 客服离线，可留言";
this._statusLabel.node.color = this._serviceOnline ? cc.color(43, 157, 102) : cc.color(171, 124, 53);
}
this._showServiceInfo();
this._renderMessages();
};
t.prototype.sendSupport = function() {
var e = this;
if (this._sending || !this._editBox) return;
var t = String(this._editBox.string || "").trim();
if (!t) return c.default.uiHelper.showTip("请先输入问题内容");
if (t.length > 200) return c.default.uiHelper.showTip("最多输入200个字");
s.default.clickBtn();
this._sending = !0;
c.default.gameMsgBase().gameJson({
msghead: "support_send",
msgdata: JSON.stringify({
content: t,
clientVersion: String(u.default.packageVer || "") + "/" + String(u.default.assertVer || "")
})
}, function(t, o, n) {
e._sending = !1;
if (n || !t || t.res && t.res.error) return c.default.uiHelper.showTip(t && t.res && t.res.what || "发送失败，请检查网络");
e._editBox.string = "";
}, !0);
};
t.prototype.confirm = function() {
s.default.clickBtn();
if (!this._wechat) return c.default.uiHelper.showTip("暂未设置客服微信");
l.default.copyText(this._wechat);
c.default.uiHelper.showTip("客服微信号已复制至剪贴板");
};
t.prototype.confirmQQ = function() {
s.default.clickBtn();
if (!this._tenQQ) return c.default.uiHelper.showTip("暂未设置客服QQ");
l.default.copyText(this._tenQQ);
c.default.uiHelper.showTip("客服QQ号已复制至剪贴板");
};
r([ m(cc.Label) ], t.prototype, "serviceLabel", void 0);
r([ m(cc.Node) ], t.prototype, "qjNode", void 0);
r([ m(cc.Node) ], t.prototype, "hgNode", void 0);
r([ m(cc.Label) ], t.prototype, "qjServiceWechat", void 0);
r([ m(cc.Label) ], t.prototype, "qjServiceQQ", void 0);
return t = r([ h ], t);
}(i.default);
o.default = y;
cc._RF.pop();
