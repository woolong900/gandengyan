// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8ed39d4Q7ZPpaq7mX3Uw653", "DDZGameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./DDZSiteListData"), r = e("./DDZSiteCellData"), i = e("./gContext"), a = e("./DDZEnum"), s = e("./DDZEventKeys"), l = e("./EventKeys"), c = e("./RoomInfoData"), u = function() {
function e() {
this.curStep = 0;
this.status = a.eDDZGameStatus.Free;
this.siteInfos = null;
this.discards = [];
this.bottomCard = [];
this.m_iBaseScore = 0;
this.bankerUid = 0;
this.m_iLandlordUid = 0;
this.isDraw = !1;
this.boomNum = 0;
this.betNum = 1;
this.m_iJiaofen = 0;
this.m_bTriplePair = !0;
this.m_doubleMax = !0;
this.m_bLaiziRule = !1;
this.m_iLaiziValue = 0;
this.b_isPlayDZ_Anim = !1;
this.b_isDelay_time = !1;
this.siteInfos = new n.default();
for (var e = 0; e < 3; e++) {
var t = new r.default(e);
this.siteInfos.upate(t);
}
}
e.prototype.update = function(e) {
this.m_iBaseScore = c.default.config.getValue(15);
if (this.m_bLaiziRule) {
var t = 0;
e.bottomCard && (t = e.bottomCard[1] || 0);
170 == t || 180 == t || 190 == t ? this.m_iLaiziValue = 3 : 13 == Math.floor(t / 10) ? this.m_iLaiziValue = 1 : 0 != t && (this.m_iLaiziValue = Math.floor(t / 10) + 1);
}
for (var o = e.siteInfos || [], n = 0, r = o.length; n < r; n++) {
var i = o[n], s = i.pos, l = this.siteInfos.get(s);
l.clean(!1);
l.udpateHandCards(i.handCards);
}
this.updateStep(e.curStep || 0);
this.updateStatus(e.status || a.eDDZGameStatus.Free);
this.updateBetNum(e.betNum || 1);
this.updateBoomNum(e.boomNum || 0);
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
t === a.eDDZGameStatus.Free && o !== a.eDDZGameStatus.Free && i.default.eventUtils.emit(l.default.pulic_game_free2begin);
};
e.prototype.setBoomNum = function() {
if (c.default.gameInfoDDZ.m_doubleMax && this.boomNum >= 6) {
this.boomNum += 1;
i.default.eventUtils.emit(s.default.data_score_update, {});
} else {
this.boomNum += 1;
this.setBetNum();
}
};
e.prototype.setBetNum = function(e) {
void 0 === e && (e = 2);
1 == e ? this.betNum += e : this.betNum *= e;
i.default.eventUtils.emit(s.default.data_score_update, {});
};
e.prototype.setBankerUid = function(e) {
this.bankerUid = e;
};
e.prototype.SetLandlordUid = function(e) {
this.m_iLandlordUid = e;
};
e.prototype.getLandlordPos = function() {
var e = c.default.players.getByUid(this.m_iLandlordUid);
return e && e.deal ? e.pos : -1;
};
e.prototype.getRemain = function(e, t, o) {
for (var n = c.default.players.getByUid(e), r = this.siteInfos.get(n.pos), i = r.handCards || [], a = 0; a < t.length; a++) i.push(t[a]);
if (c.default.gameInfoDDZ.m_bLaiziRule) {
var s = o[1];
170 == s || 180 == s || 190 == s ? c.default.gameInfoDDZ.m_iLaiziValue = 3 : 13 == Math.floor(s / 10) ? c.default.gameInfoDDZ.m_iLaiziValue = 1 : 0 != s && (c.default.gameInfoDDZ.m_iLaiziValue = Math.floor(s / 10) + 1);
var l = c.default.myAbsolutePos(), u = c.default.gameInfoDDZ.siteInfos.get(l);
u.udpateHandCards(u.handCards);
}
this.setBottomCard(o);
r.udpateHandCards(i);
};
e.prototype.setBottomCard = function(e) {
this.bottomCard = e;
i.default.eventUtils.emit(s.default.data_get_remain, {});
};
e.prototype.updateStep = function(e) {
if (this.curStep !== e) {
this.curStep = e;
i.default.eventUtils.emit(s.default.data_step_change);
}
};
e.prototype.updateBetNum = function(e) {
if (this.betNum !== e) {
this.betNum = e;
i.default.eventUtils.emit(s.default.data_score_update);
}
};
e.prototype.updateBoomNum = function(e) {
if (this.boomNum !== e) {
this.boomNum = e;
i.default.eventUtils.emit(s.default.data_score_update);
}
};
return e;
}();
o.default = u;
cc._RF.pop();
