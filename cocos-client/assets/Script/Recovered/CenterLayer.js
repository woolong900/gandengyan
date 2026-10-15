// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "62902xhWNlOf47ivfGd+rbo", "CenterLayer");
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
var i = require("./gContext"), a = require("./UserData"), s = require("./SoundUtils"), l = require("./WindowConfig"), c = require("./ShareLayer"), u = require("./EventKeys"), d = require("./EventUtils"), p = require("./ClubListData"), f = require("./ClubMsg"), h = require("./Constants"), m = require("./BaseHallScene"), y = require("./ClubInviteMsgListData"), g = require("./StringUtils"), _ = require("./Storage"), v = require("./CreateRoomAssist"), C = require("./RoomInfoData"), b = require("./GameConfig"), D = require("./ExUtils"), S = cc._decorator, w = S.ccclass, O = S.property, P = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.avatarNode = null;
t.marqueeNode = null;
t.shareTip = null;
t.msgTip = null;
t.cardNumberLabel = null;
t.headerBg = null;
t.headerBg01 = null;
t.btnAgent = null;
t.backBtn = null;
t.createBtn = null;
t.userInfoPre = null;
t.realNamePre = null;
t.realNameOkPre = null;
t.bindInviteCodePre = null;
t.bindInviteCodeOkPre = null;
t.mobilePre = null;
t.mobileOkPre = null;
t.inviteMsgPre = null;
t.contactPre = null;
t.joinRoomPre = null;
t.settingPre = null;
return t;
}
t.prototype.start = function() {
var t = this;
e.prototype.start.call(this);
this.updateUserInfo();
i.default.eventUtils.on(u.default.data_card_num_change, function() {
t.updateUserInfo();
}, this, d.eOffType.OnDestroy);
this.getAgentInfo();
this.bindShareEvent();
this.bindCardNumChange();
this.bindMarqueeChange();
this.checkInviteMsg();
this.bindMsgUpdate();
this.schedule(function() {
f.default.getClubInviteMsgList(null, !0);
}, 5, cc.macro.REPEAT_FOREVER);
var mobileBtn = this.node.getChildByName("LeftBtns").getChildByName("BtnMobile");
mobileBtn && (mobileBtn.active = !1);
this.node.getChildByName("box").getChildByName("BtnBuyCard").active = !a.default.isReivew;
this.node.getChildByName("rightShopBtn").getChildByName("BtnShop").active = !a.default.isReivew;
a.default.showPopActivity && (a.default.realName ? i.default.uiHelper.show(l.eWindowID.PopActivity) : i.default.uiHelper.showWithNode(l.eWindowID.NameCertificationPopUp, this.realNamePre));
this.updateCreateBtn();
i.default.eventUtils.on(u.default.pulic_game_free2begin, function(e, t) {
if (!C.default.isWatcher()) {
i.default.msgBox.showOnlyOk("<color=#5D461A>您所在的房间已开始游戏，请移步牌桌~</c>", function() {
i.default.uiHelper.loadScene(C.default.gameSceneName());
});
}
}, this, d.eOffType.OnDestroy);
i.default.eventUtils.on(u.default.data_room_destroyed, function(e, o) {
t.updateCreateBtn();
}, this, d.eOffType.OnDestroy);
};
t.prototype.getAgentInfo = function() {
var e = this;
f.default.clubAgentInfo(function(t, o) {
if (o) ; else {
a.default.isAgent = t.code.length > 0;
e.headerBg.active = !0;
e.headerBg01.active = !1;
e.btnAgent.active = !1;
}
}, !0);
};
t.prototype.toAgent = function() {
var e = b.default.agentPlatformUrl(a.default.token);
cc.sys.isNative ? D.default.openWebpage(e) : window.open(e, "_blank");
};
t.prototype.updateCreateBtn = function() {
this.backBtn.active = C.default.isInRoom();
this.createBtn.active = !C.default.isInRoom();
};
t.prototype.bindCardNumChange = function() {
var e = this;
i.default.eventUtils.on(u.default.data_card_num_change, function() {
e.cardNumberLabel.string = a.default.cardNum + "";
}, this);
};
t.prototype.bindMarqueeChange = function() {
var e = this;
i.default.eventUtils.on(u.default.data_marquee_change, function(t) {
e.marqueeNode.getComponent(cc.Label).string = a.default.hallMarquee;
}, this);
};
t.prototype.updateUserInfo = function() {
var e = a.default.nickname;
this.avatarNode.getChildByName("UserName").getComponent(cc.Label).string = g.default.clip(e, 7);
this.avatarNode.getChildByName("UserId").getComponent(cc.Label).string = "ID:" + (a.default.uid ? a.default.uid.toString() : "");
this.avatarNode.getChildByName("UserHead").getComponent("Image").url = a.default.headUrl;
this.cardNumberLabel.string = a.default.cardNum + "";
this.marqueeNode.getComponent(cc.Label).string = a.default.hallMarquee;
};
t.prototype.setCardInfo = function() {};
t.prototype.checkInviteMsg = function() {
this.msgTip.active = y.default.count() > 0;
};
t.prototype.bindMsgUpdate = function() {
var e = this;
i.default.eventUtils.on([ u.default.data_club_invite_msg_add, u.default.data_club_invite_msg_remove, u.default.data_club_invite_msg_update ], function() {
e.checkInviteMsg();
}, this);
};
t.prototype.bindShareEvent = function() {
var e = this;
i.default.eventUtils.on(u.default.ui_share_wxcircle_end, function() {
e.shareTip.active = !0;
e.shareTip.y = -360 - e.shareTip.height / 2;
var t = cc.moveTo(.5, cc.v2(0, 0)).easing(cc.easeBackIn());
e.shareTip.runAction(t);
e.scheduleOnce(function() {
e.shareTip.active = !1;
}, 2);
}, this);
};
t.prototype._showClubUI = function() {
if (p.default.haveClub()) {
var e = 0, t = _.default.lastGameClub.getValue();
if (p.default.get(t)) e = t; else {
var o = p.default.collection();
e = parseInt(o[0]);
}
f.default.getClubData(e, function(e, t) {
t ? i.default.uiHelper.showTipNetError() : 0 === e.error ? i.default.uiHelper.loadScene(h.default.ClubSceneName) : f.default.leaveClub(null, !0);
});
} else i.default.uiHelper.show(l.eWindowID.NotJoinClubLayer);
};
t.prototype.onBtnClub = function() {
var e = this;
s.default.clickBtn();
a.default.isReivew ? i.default.uiHelper.show(l.eWindowID.JoinRoom) : f.default.getClubList(function(t, o) {
o ? i.default.uiHelper.showTipNetError() : 0 === t.res.error ? e._showClubUI() : i.default.uiHelper.showTip(t.res.what);
});
};
t.prototype.onBtnPlayer = function() {
s.default.clickBtn();
i.default.uiHelper.showWithNode(l.eWindowID.UserInfoLayer, this.userInfoPre);
};
t.prototype.onBtnRecords = function() {
s.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.RecordList);
};
t.prototype.onBtnActivity = function() {
s.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.ActivityLayer);
};
t.prototype.onBtnRoller = function() {
s.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.RollerLayer);
};
t.prototype.onBtnBuyCard = function() {
s.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.ShoppingMall);
};
t.prototype.onBtnRealName = function() {
s.default.clickBtn();
a.default.realName ? i.default.uiHelper.showWithNode(l.eWindowID.NameCertificationOK, this.realNameOkPre) : i.default.uiHelper.showWithNode(l.eWindowID.NameCertification, this.realNamePre);
};
t.prototype.onBtnCode = function() {
s.default.clickBtn();
i.default.uiHelper.showWithNode(l.eWindowID.InviteCode, this.bindInviteCodePre);
};
t.prototype.onBtnMobile = function() {
s.default.clickBtn();
a.default.mobile ? i.default.uiHelper.showWithNode(l.eWindowID.BindMobileOK, this.mobileOkPre) : i.default.uiHelper.showWithNode(l.eWindowID.BindMobile, this.mobilePre);
};
t.prototype.onBtnShare = function() {
s.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.ShareLayer, c.eShareUIType.ShareHall);
};
t.prototype.onBtnJoin = function() {
s.default.clickBtn();
i.default.uiHelper.showWithNode(l.eWindowID.JoinRoom, this.joinRoomPre);
};
t.prototype.onBtnCreateRoom = function() {
s.default.clickBtn();
v.default.setData(0, -1, 0, 0);
i.default.uiHelper.show(l.eWindowID.CreateRoom);
};
t.prototype.onBtnBackToGame = function() {
i.default.uiHelper.loadScene(C.default.gameSceneName());
};
t.prototype.onBtnRules = function() {
s.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.RulesLayer);
};
t.prototype.onBtnSetting = function() {
s.default.clickBtn();
i.default.uiHelper.showWithNode(l.eWindowID.Setting, this.settingPre, 1);
};
t.prototype.onBtnMsg = function() {
s.default.clickBtn();
i.default.uiHelper.showWithNode(l.eWindowID.InviteMsgLayer, this.inviteMsgPre);
};
t.prototype.onBtnContact = function() {
s.default.clickBtn();
i.default.uiHelper.showWithNode(l.eWindowID.ContactLayer, this.contactPre);
};
t.prototype.update = function(e) {
this.marqueeNode.x -= 1;
this.marqueeNode.x < -this.marqueeNode.width / 2 && (this.marqueeNode.x = this.marqueeNode.getParent().width);
};
r([ O(cc.Node) ], t.prototype, "avatarNode", void 0);
r([ O(cc.Node) ], t.prototype, "marqueeNode", void 0);
r([ O(cc.Node) ], t.prototype, "shareTip", void 0);
r([ O(cc.Node) ], t.prototype, "msgTip", void 0);
r([ O(cc.Label) ], t.prototype, "cardNumberLabel", void 0);
r([ O(cc.Node) ], t.prototype, "headerBg", void 0);
r([ O(cc.Node) ], t.prototype, "headerBg01", void 0);
r([ O(cc.Node) ], t.prototype, "btnAgent", void 0);
r([ O(cc.Node) ], t.prototype, "backBtn", void 0);
r([ O(cc.Node) ], t.prototype, "createBtn", void 0);
r([ O(cc.Prefab) ], t.prototype, "userInfoPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "realNamePre", void 0);
r([ O(cc.Prefab) ], t.prototype, "realNameOkPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "bindInviteCodePre", void 0);
r([ O(cc.Prefab) ], t.prototype, "bindInviteCodeOkPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "mobilePre", void 0);
r([ O(cc.Prefab) ], t.prototype, "mobileOkPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "inviteMsgPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "contactPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "joinRoomPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "settingPre", void 0);
return t = r([ w ], t);
}(m.default);
o.default = P;
cc._RF.pop();
