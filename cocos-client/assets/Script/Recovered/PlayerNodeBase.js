// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "da57cQvjTpAd4I94nDGrkvr", "PlayerNodeBase");
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
var i = require("./CommonEnum"), a = require("./VioceShowNode"), s = require("./EmojiShowNode"), l = require("./TextShowNode"), c = require("./RoomInfoData"), u = require("./Image"), d = require("./gContext"), p = require("./EventKeys"), f = require("./EventUtils"), h = require("./StringUtils"), m = require("./OperateListData"), y = require("./OperateAnimate"), g = require("./ExVoice"), _ = require("./CardHighlight"), v = require("./SoundUtils"), C = require("./WindowConfig"), b = require("./GameInfoData"), D = require("./UserData"), S = require("./RoomUtils"), w = require("./GameChatUtils"), O = cc._decorator, P = O.ccclass, I = O.property, R = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t._viewPos = 0;
t.headNode = null;
t.descLabel = null;
t.mulLabel = null;
t.readyNode = null;
t.chatEmojiRoot = null;
t.chatVoiceRoot = null;
t.chatTextRoot = null;
t.offLineNode = null;
t.operateAnimateRoot = null;
t.highlightRoot = null;
t.headImg = null;
t.score = null;
t.zhuang = null;
t.operateRoot = null;
t.operateLabel = null;
t.nameLabel = null;
t.voicePre = null;
t.emojiPre = null;
t.textPre = null;
t.animationPre = null;
t.cardHighlightPre = null;
return t;
}
t.prototype.setData = function(e) {
this._viewPos = e;
};
t.prototype.start = function() {
var e = this;
this.scheduleOnce(function() {
e.initDetailBg();
e.initReady();
e.initDesc();
e.initMul();
e.initChatEmoji();
e.initChatVoice();
e.initChatText();
e.initOffline();
e.initOperate();
e.initHighlight();
e.initResult();
e.initOperateTableShow();
});
this.headNode.active = !1;
};
t.prototype.onEnable = function() {
var e = this;
d.default.eventUtils.on([ p.default.data_game_score_change ], function(t, o) {
var n = S.default.getInstance().viewPos2DeskPos(e._viewPos);
o.pos === n && e.showScoreAnimate(o.dt);
e._uiDirty = !0;
}, this, f.eOffType.OnDisable);
d.default.eventUtils.on([ p.default.data_player_update, p.default.data_player_add, p.default.data_player_remove, p.default.data_game_watch_pos_change ], function() {
e._uiDirty = !0;
}, this, f.eOffType.OnDisable);
d.default.eventUtils.on([ p.default.data_operated_change ], function(t, o) {
var n = S.default.getInstance().viewPos2DeskPos(e._viewPos);
if (o.pos === n) {
if (c.default.players.getByPos(n)) {
var r = o.index, i = c.default.gameInfo.siteInfos.get(n).operateList.get(r);
if (null != i) {
var a = i.animationPath(c.default.config.index);
a && e.showAnimate(a);
}
e._uiDirty = !0;
}
}
}, this, f.eOffType.OnDisable);
d.default.eventUtils.on(p.default.data_chat_msg, function(t, o) {
var n = o.o, r = e.getPlayer();
if (r && r.uid === n.fromUid) if (n.type === i.eChatMsgType.ChatVoice) {
var a = Math.ceil(n.duration / 1e3);
n.fromUid != D.default.uid && n.fromUid != D.default.uid && !c.default.isWatcher() && e.showVoice(a, n.content);
} else if (n.type === i.eChatMsgType.ChatInputText) e.showText(n.content); else if (n.type === i.eChatMsgType.ChatText) {
var s = n.content, l = w.default.getInstance().textStr(s), u = w.default.getInstance().textSoundPath(parseInt(s), r.gender);
v.default.playEffect(u);
e.showText(l);
} else n.type === i.eChatMsgType.ChatEmoji ? e.showEmoji(n.content) : n.type === i.eChatMsgType.ChatGift || cc.error("不支持的消息类型～");
}, this, f.eOffType.OnDisable);
d.default.eventUtils.on(p.default.data_put_card, function(t, o) {
var n = o.pos, r = o.card, a = S.default.getInstance().deskPos2ViewPos(n);
a === e._viewPos && a !== i.eViewPos.Down && e.showHighlightCard(r);
}, this, f.eOffType.OnDisable);
this._uiDirty = !0;
};
t.prototype.onClick = function() {
v.default.clickBtn();
if (c.default.isWatcher()) return d.default.uiHelper.showTip("旁观中，不能查看用户信息~");
if (this._viewPos === i.eViewPos.Down || c.default.isPlayback()) ; else {
var e = this.getPlayer();
e && d.default.uiHelper.show(C.eWindowID.GiftLayer, e.uid);
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
var e = this.getPlayer();
if (e) {
this.headNode.active = !0;
this.headImg.url = e.headImg;
this.score.string = e.scoreDesc();
this.nameLabel.string = h.default.clip(e.name);
this.zhuang.active = e.deal;
var t = e.pos, o = c.default.gameInfo.siteInfos.get(t);
if (o) {
var n = o.operateList.collection(m.default.filterLiangShows);
if (n.length > 0) {
var r = o.operateList.get(n[0]).smallText;
this.operateRoot.active = !0;
this.operateLabel.string = r;
} else this.operateRoot.active = !1;
} else this.operateRoot.active = !1;
this.readyNode.active = e.isReady();
this.offLineNode.active = !e.isOnLine();
if (c.default.gameInfo.status !== b.eGameStatus.Free) if (D.default.gameView === i.eGameView.View3D) {
if (d.default.gameLogic().isShowHead3DMul()) if (c.default.gameInfo.status === b.eGameStatus.Gameing) {
var a = d.default.gameLogic().head3DMul(o.operateList);
this.mulLabel.string = "x" + a;
} else for (var s = 0, l = (u = c.default.gameInfo.singleEndInfo.players).length; s < l; s++) if (u[s].uid === e.uid) {
a = u[s].mul;
this.mulLabel.string = "x" + a;
break;
}
} else if (D.default.gameView === i.eGameView.View2D && d.default.gameLogic().isShowHead2DMul()) if (c.default.gameInfo.status === b.eGameStatus.Gameing) {
a = d.default.gameLogic().head3DMul(o.operateList);
this.mulLabel.string = "x" + a;
} else {
var u;
for (s = 0, l = (u = c.default.gameInfo.singleEndInfo.players).length; s < l; s++) if (u[s].uid === e.uid) {
a = u[s].mul;
this.mulLabel.string = "x" + a;
break;
}
}
} else {
this.headNode.active = !1;
this.descLabel.string = "";
this.readyNode.active = !1;
this.offLineNode.active = !1;
}
}
};
t.prototype.showAnimate = function(e) {
var t = cc.instantiate(this.animationPre);
t.getComponent(y.default).setData(e);
this.operateAnimateRoot.addChild(t);
};
t.prototype.showVoice = function(e, t) {
var o = this;
g.default.downloadRecordedFile(t, function(t, n) {
if (t === i.eExCallBackMsg.success && o.node && o.node.isValid) {
var r = cc.instantiate(o.voicePre);
r.getComponent(a.default).setData(o.posVoice(), e);
o.chatVoiceRoot.destroyAllChildren();
o.chatVoiceRoot.stopAllActions();
o.chatVoiceRoot.addChild(r);
var s = o.showDelayAction(e, function() {
o.chatVoiceRoot.destroyAllChildren();
});
o.chatVoiceRoot.runAction(s);
}
});
};
t.prototype.showDelayAction = function(e, t) {
var o = cc.delayTime(e), n = cc.callFunc(function() {
t();
});
return cc.sequence(o, n);
};
t.prototype.getPlayer = function() {
var e = S.default.getInstance().viewPos2DeskPos(this._viewPos);
return c.default.players.getByPos(e);
};
t.prototype.showEmoji = function(e) {
var t = this, o = cc.instantiate(this.emojiPre);
o.getComponent(s.default).setData(e);
this.chatEmojiRoot.destroyAllChildren();
this.chatEmojiRoot.stopAllActions();
this.chatEmojiRoot.addChild(o);
var n = this.showDelayAction(3, function() {
t.chatEmojiRoot.destroyAllChildren();
});
this.chatEmojiRoot.runAction(n);
};
t.prototype.showText = function(e) {
var t = this, o = cc.instantiate(this.textPre);
o.getComponent(l.default).setData(this.posText(), e);
this.chatTextRoot.destroyAllChildren();
this.chatTextRoot.stopAllActions();
this.chatTextRoot.addChild(o);
var n = this.showDelayAction(3, function() {
t.chatTextRoot.destroyAllChildren();
});
this.chatTextRoot.runAction(n);
};
t.prototype.showHighlightCard = function(e) {
var t = this, o = cc.instantiate(this.cardHighlightPre);
o.getComponent(_.default).setData(e);
this.highlightRoot.destroyAllChildren();
this.highlightRoot.stopAllActions();
this.highlightRoot.addChild(o);
var n = this.showDelayAction(.75, function() {
t.highlightRoot.destroyAllChildren();
});
this.highlightRoot.runAction(n);
};
t.prototype.showScoreAnimate = function(e) {};
t.prototype.initDetailBg = function() {};
t.prototype.initReady = function() {};
t.prototype.initDesc = function() {};
t.prototype.initMul = function() {};
t.prototype.initChatEmoji = function() {};
t.prototype.initChatVoice = function() {};
t.prototype.initChatText = function() {};
t.prototype.initOffline = function() {};
t.prototype.initOperate = function() {};
t.prototype.initHighlight = function() {};
t.prototype.initResult = function() {};
t.prototype.initOperateTableShow = function() {};
t.prototype.posText = function() {
return i.eViewPos.Down;
};
t.prototype.posVoice = function() {
return i.eViewPos.Down;
};
r([ I(cc.Node) ], t.prototype, "headNode", void 0);
r([ I(cc.Label) ], t.prototype, "descLabel", void 0);
r([ I(cc.Label) ], t.prototype, "mulLabel", void 0);
r([ I(cc.Node) ], t.prototype, "readyNode", void 0);
r([ I(cc.Node) ], t.prototype, "chatEmojiRoot", void 0);
r([ I(cc.Node) ], t.prototype, "chatVoiceRoot", void 0);
r([ I(cc.Node) ], t.prototype, "chatTextRoot", void 0);
r([ I(cc.Node) ], t.prototype, "offLineNode", void 0);
r([ I(cc.Node) ], t.prototype, "operateAnimateRoot", void 0);
r([ I(cc.Node) ], t.prototype, "highlightRoot", void 0);
r([ I(u.default) ], t.prototype, "headImg", void 0);
r([ I(cc.Label) ], t.prototype, "score", void 0);
r([ I(cc.Node) ], t.prototype, "zhuang", void 0);
r([ I(cc.Node) ], t.prototype, "operateRoot", void 0);
r([ I(cc.Label) ], t.prototype, "operateLabel", void 0);
r([ I(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ I(cc.Prefab) ], t.prototype, "voicePre", void 0);
r([ I(cc.Prefab) ], t.prototype, "emojiPre", void 0);
r([ I(cc.Prefab) ], t.prototype, "textPre", void 0);
r([ I(cc.Prefab) ], t.prototype, "animationPre", void 0);
r([ I(cc.Prefab) ], t.prototype, "cardHighlightPre", void 0);
return t = r([ P ], t);
}(cc.Component);
o.default = R;
cc._RF.pop();
