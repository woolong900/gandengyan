// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "04366MR02tMb7x4CppH3rIe", "WSKPosChatCtr");
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
var i = e("./CommonEnum"), a = e("./RoomInfoData"), s = e("./ExVoice"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./SoundUtils"), d = e("./gContext"), p = e("./EmojiShowNode"), f = e("./TextShowNode"), h = e("./VioceShowNode"), m = e("./GameChatUtils"), y = e("./WSKPosCtr"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.chatText = null;
t.chatEmoji = null;
t.chatVoice = null;
t.voicePre = null;
t.emojiPre = null;
t.textPre = null;
return t;
}
t.prototype.start = function() {
var e = this;
d.default.eventUtils.on(l.default.data_chat_msg, function(t, o) {
var n = o.o, r = e.posCtr.deskPos(), s = a.default.players.getByPos(r);
if (s && s.uid === n.fromUid) if (n.type === i.eChatMsgType.ChatVoice) {
var l = Math.ceil(n.duration / 1e3);
!a.default.isWatcher() && e._showChatVoice(l, n.content);
} else if (n.type === i.eChatMsgType.ChatInputText) e._showChatText(n.content); else if (n.type === i.eChatMsgType.ChatText) {
var c = n.content, d = m.default.getInstance().textStr(c), p = m.default.getInstance().textSoundPath(parseInt(c), s.gender);
u.default.playEffect(p);
e._showChatText(d);
} else n.type === i.eChatMsgType.ChatEmoji ? e._showChatEmoji(n.content) : n.type === i.eChatMsgType.ChatGift || cc.error("不支持的消息类型～");
}, this, c.eOffType.OnDestroy);
};
t.prototype._showChatVoice = function(e, t) {
var o = this;
s.default.downloadRecordedFile(t, function(t, n) {
if (t === i.eExCallBackMsg.success && o.node && o.node.isValid) {
var r = cc.instantiate(o.voicePre);
r.getComponent(h.default).setData(o._posVoice(), e);
o.chatVoice.destroyAllChildren();
o.chatVoice.stopAllActions();
o.chatVoice.addChild(r);
var a = o._delayAction(e, function() {
o.chatVoice.destroyAllChildren();
});
o.chatVoice.runAction(a);
}
});
};
t.prototype._showChatText = function(e) {
var t = this, o = cc.instantiate(this.textPre);
o.getComponent(f.default).setData(this._posText(), e);
this.chatText.destroyAllChildren();
this.chatText.stopAllActions();
this.chatText.addChild(o);
var n = this._delayAction(3, function() {
t.chatText.destroyAllChildren();
});
this.chatText.runAction(n);
};
t.prototype._showChatEmoji = function(e) {
var t = this, o = cc.instantiate(this.emojiPre);
o.getComponent(p.default).setData(e);
this.chatEmoji.destroyAllChildren();
this.chatEmoji.stopAllActions();
this.chatEmoji.addChild(o);
var n = this._delayAction(3, function() {
t.chatEmoji.destroyAllChildren();
});
this.chatEmoji.runAction(n);
};
t.prototype._posVoice = function() {
var e = this.posCtr.uiPos;
return 0 === e || 3 === e ? i.eViewPos.Right : i.eViewPos.Left;
};
t.prototype._posText = function() {
var e = this.posCtr.uiPos;
return 0 === e || 3 === e ? i.eViewPos.RightTop : 2 === e ? i.eViewPos.RightBottom : i.eViewPos.LeftTop;
};
t.prototype._delayAction = function(e, t) {
var o = cc.delayTime(e), n = cc.callFunc(function() {
t();
});
return cc.sequence(o, n);
};
r([ v(y.default) ], t.prototype, "posCtr", void 0);
r([ v(cc.Node) ], t.prototype, "chatText", void 0);
r([ v(cc.Node) ], t.prototype, "chatEmoji", void 0);
r([ v(cc.Node) ], t.prototype, "chatVoice", void 0);
r([ v(cc.Prefab) ], t.prototype, "voicePre", void 0);
r([ v(cc.Prefab) ], t.prototype, "emojiPre", void 0);
r([ v(cc.Prefab) ], t.prototype, "textPre", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
