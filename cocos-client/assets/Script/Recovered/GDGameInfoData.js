// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "31503pPOVBOzaWk0dKIFLwp", "GDGameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomInfoData"), r = require("./EventKeys"), i = require("./gContext"), a = require("./GDEnum"), s = require("./GDEventKeys"), l = require("./GDCardUtils"), c = require("./GDSiteCellData"), u = require("./GDSiteListData"), d = function() {
function e() {
this.curStep = 0;
this.status = a.eGDGameStatus.Free;
this.siteInfos = null;
this.discards = [];
this.bottomCard = 0;
this.m_iBaseScore = 0;
this.bankerUid = 0;
this.m_iLandlordUid = 0;
this.isDraw = !1;
this.boomNum = 0;
this.betNum = 1;
this.m_iJiaofen = 0;
this.m_doubleMax = !1;
this.m_bLaiziRule = !1;
this.m_iLaiziValue = 0;
this.selfLevel = -1;
this.otherLevel = -1;
this.b_isPlayDZ_Anim = !1;
this.b_isDelay_time = !1;
this.is_shuCard = !1;
this.is_beginAnim = !1;
this.is_cardOut = !1;
this.curPlayerNum = 4;
this.curGongPaiUid = 0;
this.GongPaiStaus = 0;
this.GongPaiputShow = 0;
this.GongPaiMax = 0;
this.gongpaiplayerNum = 0;
this.endShuangShang = !1;
this.friendCard = 0;
this.boomUid = 0;
this.gongPaiArray = [];
this.nextRound = void 0;
this.lipaiHandCards = [];
this.lipaiHandCardsAry = [];
this.lipaiBtnStuas = !1;
this.siteInfos = new u.default();
for (var e = 0; e < 4; e++) {
var t = new c.default(e);
this.siteInfos.upate(t);
}
}
e.prototype.update = function(e) {
this.m_iBaseScore = n.default.config.getValue(15);
var t = 0;
if (e.bottomCard) {
t = e.bottomCard || 0;
this.m_iLaiziValue = t / 10;
}
for (var o = e.siteInfos || [], r = 0, i = o.length; r < i; r++) {
var s = o[r], l = s.pos, c = this.siteInfos.get(l);
c.clean(!1);
c.udpateHandCards(s.handCards);
c.updateRank(s.card_step_out, !1);
}
this.updateFriendCard(e.friendCard, !1);
this.updateStep(e.curStep || 0);
this.updateStatus(e.status || a.eGDGameStatus.Free);
this.updateBetNum(e.betNum || 1);
};
e.prototype.updatebeginAnim = function(e) {
this.is_beginAnim = e;
i.default.eventUtils.emit(s.default.player_beginAnim);
};
e.prototype.updateStatus = function(e) {
var t = this.status, o = e;
if (t !== o) {
this.status = e;
i.default.eventUtils.emit(s.default.data_status_change, {
o: t,
n: o
});
}
t === a.eGDGameStatus.Free && o !== a.eGDGameStatus.Free && i.default.eventUtils.emit(r.default.pulic_game_free2begin);
};
e.prototype.setBoomNum = function(e) {
var t = i.default.gameLogic(n.default.config.index).isBoomFB(n.default.config);
1 == t ? e >= l.eGDOneHandType.WuBomb && this.setBetNum() : 2 == t ? (e >= l.eGDOneHandType.TongHuaShun || e == l.eGDOneHandType.LiuBomb) && this.setBetNum() : 3 == t && e >= l.eGDOneHandType.LiuBomb && e != l.eGDOneHandType.TongHuaShun && this.setBetNum();
};
e.prototype.setBetNum = function() {
1 == this.betNum ? this.betNum += 1 : this.betNum = 2 * this.betNum;
i.default.eventUtils.emit(s.default.data_score_update, {});
};
e.prototype.setBankerUid = function(e) {
this.bankerUid = e;
};
e.prototype.SetLandlordUid = function(e) {
this.m_iLandlordUid = e;
};
e.prototype.getLandlordPos = function() {
var e = n.default.players.getByUid(this.m_iLandlordUid);
return e && e.deal ? e.pos : -1;
};
e.prototype.getRemain = function(e, t, o) {
for (var r = n.default.players.getByUid(e), i = this.siteInfos.get(r.pos), a = i.handCards || [], s = 0; s < t.length; s++) a.push(t[s]);
if (n.default.gameInfoGD.m_bLaiziRule) {
var l = n.default.myAbsolutePos(), c = n.default.gameInfoGD.siteInfos.get(l);
c.udpateHandCards(c.handCards);
}
this.setBottomCard(o);
i.udpateHandCards(a);
};
e.prototype.setBottomCard = function(e) {
this.bottomCard = e;
i.default.eventUtils.emit(s.default.data_get_remain, {});
};
e.prototype.setSelfOtheCard = function(e, t) {
this.selfLevel = e;
this.otherLevel = t;
i.default.eventUtils.emit(s.default.data_get_remain, {});
};
e.prototype.updateStep = function(e) {
if (this.curStep !== e) {
this.curStep = e;
i.default.eventUtils.emit(s.default.data_step_change);
}
};
e.prototype.updateBetNum = function(e) {
this.betNum = e;
i.default.eventUtils.emit(s.default.data_score_update);
};
e.prototype.updateBoomNum = function(e) {
if (this.boomNum !== e) {
this.boomNum = e;
i.default.eventUtils.emit(s.default.data_score_update);
}
};
e.prototype.updateFriendCard = function(e, t) {
this.friendCard = e;
i.default.eventUtils.emit(s.default.data_friend_card_change, {
action: t
});
};
return e;
}();
o.default = d;
cc._RF.pop();
