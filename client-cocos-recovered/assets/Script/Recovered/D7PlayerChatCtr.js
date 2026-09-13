// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8fc12c2mBFH2p3ISJj4veZ/", "D7PlayerChatCtr");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./CommonEnum"), l = require("./EmojiShowNode"), c = require("./TextShowNode"), u = require("./SoundUtils"), d = require("./EventUtils"), p = require("./ExVoice"), f = require("./VioceShowNode"), h = require("./D7PlayerCtr"), m = require("./GameChatUtils"), y = require("./RoomInfoData"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerCtr = null;
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
i.default.eventUtils.on(a.default.data_chat_msg, function(t, o) {
var n = o.o, r = e.playerCtr.getPlayer();
if (r && r.uid === n.fromUid) if (n.type === s.eChatMsgType.ChatVoice) {
var i = Math.ceil(n.duration / 1e3);
!y.default.isWatcher() && e._showChatVoice(i, n.content);
} else if (n.type === s.eChatMsgType.ChatInputText) e._showChatText(n.content); else if (n.type === s.eChatMsgType.ChatText) {
var a = n.content, l = m.default.getInstance().textStr(a), c = m.default.getInstance().textSoundPath(parseInt(a), r.gender);
u.default.playEffect(c);
e._showChatText(l);
} else n.type === s.eChatMsgType.ChatEmoji ? e._showChatEmoji(n.content) : n.type === s.eChatMsgType.ChatGift || cc.error("不支持的消息类型～");
}, this, d.eOffType.OnDestroy);
};
t.prototype._showChatVoice = function(e, t) {
var o = this;
p.default.downloadRecordedFile(t, function(t, n) {
if (t === s.eExCallBackMsg.success && o.node && o.node.isValid) {
var r = cc.instantiate(o.voicePre);
r.getComponent(f.default).setData(o._posVoice(), e);
o.chatVoice.destroyAllChildren();
o.chatVoice.stopAllActions();
o.chatVoice.addChild(r);
var i = o._delayAction(e, function() {
o.chatVoice.destroyAllChildren();
});
o.chatVoice.runAction(i);
}
});
};
t.prototype._showChatText = function(e) {
var t = this, o = cc.instantiate(this.textPre);
o.getComponent(c.default).setData(this._posText(), e);
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
o.getComponent(l.default).setData(e);
this.chatEmoji.destroyAllChildren();
this.chatEmoji.stopAllActions();
this.chatEmoji.addChild(o);
var n = this._delayAction(3, function() {
t.chatEmoji.destroyAllChildren();
});
this.chatEmoji.runAction(n);
};
t.prototype._posVoice = function() {
var e = this.playerCtr.uiPos;
return 0 === e || 4 === e || 5 === e ? s.eViewPos.Right : s.eViewPos.Left;
};
t.prototype._posText = function() {
var e = this.playerCtr.uiPos;
return 0 === e || 4 === e || 5 === e ? s.eViewPos.RightTop : 3 === e ? s.eViewPos.RightBottom : s.eViewPos.LeftTop;
};
t.prototype._delayAction = function(e, t) {
var o = cc.delayTime(e), n = cc.callFunc(function() {
t();
});
return cc.sequence(o, n);
};
r([ v(h.default) ], t.prototype, "playerCtr", void 0);
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
