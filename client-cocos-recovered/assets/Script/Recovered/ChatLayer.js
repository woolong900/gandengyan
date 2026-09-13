// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b10e1hXOp1GSp+5GOq2Pjp6", "ChatLayer");
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
var i = cc._decorator, a = i.ccclass, s = i.property, l = e("./gContext"), c = e("./EmojiNode"), u = e("./TextNode"), d = e("./BaseComponent"), p = e("./CommonEnum"), f = e("./GameChatUtils"), h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.emojiScroll = null;
t.textScroll = null;
t.emojiPre = null;
t.textPre = null;
t.inputNode = null;
return t;
}
t.prototype.onLoad = function() {
this.node.width = cc.winSize.width;
};
t.prototype.start = function() {
this._loadEmoji();
this._loadText();
};
t.prototype._loadEmoji = function() {
for (var e = f.default.getInstance().emojiLen(), t = cc.find("view/content", this.emojiScroll.node), o = 0; o < e; o++) {
var n = cc.instantiate(this.emojiPre);
n.getComponent(c.default).setData(o + "", this);
t.addChild(n);
}
};
t.prototype._loadText = function() {
for (var e = cc.find("view/content", this.textScroll.node), t = f.default.getInstance().textList().length, o = 0; o < t; o++) {
var n = cc.instantiate(this.textPre);
n.getComponent(u.default).setData(o + "", this);
e.addChild(n);
}
};
t.prototype.chooseType = function(e, t) {
this.emojiScroll.node.active = 0 == t;
this.textScroll.node.active = 0 != t;
};
t.prototype.sendText = function() {
var e = this, t = this.inputNode.string;
if (t) if (t.length > 30) l.default.uiHelper.showTip("发送文本过长，请重新输入～"); else {
this.inputNode.string = "";
l.default.gameMsgBase().sendChatMsg(p.eChatMsgType.ChatInputText, t, function(t, o) {
o || 0 !== t.error || l.default.uiHelper.remove(e);
});
}
};
r([ s(cc.ScrollView) ], t.prototype, "emojiScroll", void 0);
r([ s(cc.ScrollView) ], t.prototype, "textScroll", void 0);
r([ s(cc.Prefab) ], t.prototype, "emojiPre", void 0);
r([ s(cc.Prefab) ], t.prototype, "textPre", void 0);
r([ s(cc.EditBox) ], t.prototype, "inputNode", void 0);
return t = r([ a ], t);
}(d.default);
o.default = h;
cc._RF.pop();
