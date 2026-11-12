// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "05152CkGr9JYp8vj/a1I5Re", "AnalysisMsgGD");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = require("./AnalysisMsgBase"), i = require("./RoomInfoData"), a = require("./GameSoundDDZ"), s = require("./DDZCardUtils"), l = require("./UserData"), c = require("./gContext"), u = require("./GDGameControl"), d = require("./GDEnum"), p = require("./GDEventKeys"), f = require("./GameSoundGD"), h = require("./GDCardUtils"), m = require("./GDSingleEndData"), g = require("./GDRoomUtils"), y = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
if (require('./PokerNetworkFlow').route(this,t,o)) return;
cc.log(t, o);
"game_info" === t && this._gameInfo(o);
"game_biddealer" === t && this._dealDrift(o);
"game_redouble" === t && this._dealRedouble(o);
"game_bottomcard" === t && this._dealBottomcard(o);
"game_step" === t && this._putCard(o);
"game_pass" === t && this._pass(o);
"game_operator" === t && this._turn(o);
"game_begin" === t && this._gameBegin(o);
"game_end" === t && this._gameEnd(o);
"game_successor" === t && this._gameSuccessor(o);
"game_supplycard" === t && this._jinGongCard(o);
"game_exchangecard" === t && this._exchangecard(o);
"game_combatsupply" === t && this._combatsupply(o);
"game_friendhandcard" === t && this._game_friendhandcard(o);
e.prototype.parse.call(this, t, o);
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.prototype._gameBegin = function(e) {
i.default.gameInfoGD.gongpaiplayerNum = 0;
i.default.gameInfoGD.m_iLaiziValue = 0;
i.default.gameInfoGD.gongPaiArray = [];
i.default.gameInfoGD.GongPaiputShow = 0;
for (var t = e.exchange_position || [], o = [], n = 0, r = t.length; n < r; n += 2) {
var a = i.default.players.getByUid(t[n]).pbData(), s = t[n + 1];
o.push(s);
a.pos = s;
i.default.updatePlayerData(a);
}
var l = e.players;
for (n = 0, r = l.length; n < r; n++) 0 != l[n].cul_supply_card && i.default.gameInfoGD.gongpaiplayerNum++;
this._gameInfo(e, !0);
c.default.eventUtils.emit(p.default.data_piao_score_change_hide);
i.default.gameInfoGD.endShuangShang = !1;
i.default.gameInfoGD.lipaiHandCardsAry = [];
c.default.eventUtils.emit(p.default.end_shuangshang);
var done=require('./PokerNetworkFlow').begin(this), self=this;
u.default.getInstance().playAnimationBegin(e.exchange_position ? o : undefined,function(){
if(e.anti_tribute)self._combatsupply({});
done();
});
};
t.prototype._gameInfo = function(e, t) {
void 0 === t && (t = !1);
var o = e.begin, n = e.drift_stage, r = e.players, a = e.step, s = e.level_card || 20, c = e.landlord || 0, u = e.bomb_bet_score || 1, p = e.friend_card || 0;
// Authoritative reconnect/tribute snapshots must also clear a previous
// tribute phase, otherwise normal play can retain tribute-only card states.
if (void 0 !== e.game_stage) {
i.default.gameInfoGD.GongPaiStaus = e.game_stage === 1 || e.game_stage === 2 ? e.game_stage : 0;
if (!i.default.gameInfoGD.GongPaiStaus) i.default.gameInfoGD.curGongPaiUid = 0;
}
i.default.gameInfoGD.status === d.eGDGameStatus.Gameing && i.default.gameInfoGD.updateFriendCard(p, !0);
for (var f = 0, m = r.length; f < m; f++) {
if (O = r[f].uid) {
var g = (P = i.default.players.getByUid(O)).pbData();
i.default.updatePlayerData(g);
}
}
var y = a || 0, _ = 0;
_ = n ? d.eGDGameStatus.JiaoDiZhu : o ? d.eGDGameStatus.Gameing : 0 === y ? d.eGDGameStatus.Free : d.eGDGameStatus.SingleEnd;
var v = 0, C = [], b = [], D = [ 20, 20, 20, 20 ], S = 0;
for (f = 0, m = r.length; f < m; f++) {
var w = r[f], O = w.uid;
v = (w.bomb_num || 0) + v;
if (O <= 0) !1; else {
D[f] = w.self_level_card;
O == l.default.uid && (S = f);
var P = this._parsePlayer(w), I = w.card || {};
I.last_pass && b.push({
type: d.eRoundTypeGD.Pass,
pos: P.pos,
cards: []
});
var R = I.last_dis_card || [];
R.length > 0 && b.push({
type: d.eRoundTypeGD.Put,
pos: P.pos,
cards: R
});
var k = this._newHandCards(I.hand_card, I.hand_card_num);
w.drift || !1 ? w.drift_score || 0 : -1;
C.push({
pos: P.pos,
handCards: k,
card_step_out: w.card_step_out
});
var j = i.default.gameInfoGD.siteInfos.get(P.pos), L = w.pass;
j.setIsPass(L);
j.updateRank(w.card_step_out, !1);
if (1 == w.card_step_out && 0 == t) {
var U = r[f + 2], T = r[f - 2];
U && (i.default.gameInfoGD.boomUid = U.uid);
T && (i.default.gameInfoGD.boomUid = T.uid);
}
I.friend_card && (j.friendhandCards = h.default.sortDesc(I.friend_card, !0));
}
}
var N = D[S], M = 20;
M = 2 == r.length ? 0 == S ? D[S + 1] : D[S - 1] : 3 == S ? D[S - 1] : D[S + 1];
var E = {
curStep: y,
status: _,
siteInfos: C,
betNum: u,
boomNum: v,
bottomCard: s,
friendCard: p
};
i.default.updateGameData(E);
i.default.gameInfoGD.setSelfOtheCard(N, M);
i.default.gameInfoGD.setBottomCard(s);
i.default.gameInfoGD.setBankerUid(c);
i.default.gameInfoGD.SetLandlordUid(c);
_ === d.eGDGameStatus.SingleEnd && this._gameEndData(e);
for (f = 0, m = b.length; f < m; f++) {
var x = b[f], G = x.pos;
j = i.default.gameInfoGD.siteInfos.get(G);
x.type === d.eRoundTypeGD.Pass && j.pass();
x.type === d.eRoundTypeGD.Put && j.putCard(x.cards, !1);
}
if (1 == e.game_stage || 2 == e.game_stage) {
i.default.gameInfoGD.updateStatus(d.eGDGameStatus.gongpai);
i.default.gameInfoGD.GongPaiputShow = e.game_stage;
for (f = 0, m = r.length; f < m; f++) {
if (O = r[f].uid) {
P = i.default.players.getByUid(O);
if (2 == r.length) 0 != r[f].card_step_out && 4 != r[f].card_step_out ? r[f].cul_supply_card >= 10 && (P.gongPai = -r[f].cul_supply_card) : r[f].cul_supply_card >= 10 && (P.gongPai = r[f].cul_supply_card); else {
var B = r[f + 2], A = r[f - 2], H = B;
A && (H = A);
0 != H.card_step_out && 4 != H.card_step_out && 0 != r[f].card_step_out && 4 != r[f].card_step_out ? r[f].cul_supply_card >= 10 && (P.gongPai = -r[f].cul_supply_card) : r[f].cul_supply_card >= 10 && (P.gongPai = r[f].cul_supply_card);
}
}
}
}
};
t.prototype._game_friendhandcard = function(e) {
var t = i.default.myAbsolutePos();
i.default.gameInfoGD.siteInfos.get(t).friendhandCards = h.default.sortDesc(e.friend_hand_card, !0);
c.default.eventUtils.emit(p.default.data_hand_card_remove_firend, {
pos: t
});
};
t.prototype._dealRedouble = function(e) {
var t = e.uid, o = e.cul_op, n = i.default.players.getByUid(t), r = n.pos, s = i.default.gameInfoGD.siteInfos.get(r);
null != o && void 0 != o && s.setOtType(++o);
s.null();
a.default.getInstance().jiaoDiZhu(o, n.gender);
};
t.prototype._dealBottomcard = function(e) {
var t = i.default.gameInfoGD.m_iLandlordUid, o = e.bot_card || [];
if (t > 0) {
var n = o;
!i.default.isPlayback() && (l.default.uid !== t || n.length <= 0) && (n = 4 == n.length ? [ 0, 0, 0, 0 ] : [ 0, 0, 0 ]);
i.default.gameInfoGD.getRemain(t, n, o);
}
};
t.prototype._dealDrift = function(e) {
var t = e.uid, o = (e.bot_card, e.grade_type), n = e.landlord_uid || 0, r = i.default.players.getByUid(t), a = r.pos, s = i.default.gameInfoGD.siteInfos.get(a);
null != o && void 0 != o && s.setOtType(o);
s.null();
i.default.gameInfoGD.b_isPlayDZ_Anim = !0;
if (n > 0) {
c.default.eventUtils.emit(p.default.ui_dzlog_update);
i.default.gameInfoGD.setBankerUid(n);
i.default.gameInfoGD.SetLandlordUid(n);
var l = i.default.players.getByUid(n), u = l.pbData();
if (!0 !== l.deal) {
u.deal = !0;
i.default.updatePlayerData(u);
}
}
f.default.getInstance().jiaoDiZhu(o, r.gender);
};
t.prototype._gameSuccessor = function(e) {
var t = i.default.myAbsolutePos();
i.default.gameInfoGD.siteInfos.setLastPut(t);
var o = e.uid;
c.default.eventUtils.emit(p.default.player_jiefeng, {
uid: o
});
var n = {
ot: 3,
pass: !1,
round: !0,
step_card_type: 0,
ts: 0,
uid: o
};
this._turn(n);
};
t.prototype._gameEnd = function(e) {
for (var t = e.players || [], o = 0, n = 0, r = t.length; n < r; n++) {
var a = t[n], s = a.uid, c = a.total;
this.updateScore(s, c);
s == l.default.uid && (o = a.card_score);
}
this._gameEndData(e);
o < 0 ? f.default.getInstance().gameLose() : f.default.getInstance().gameWin();
i.default.gameInfoGD.boomUid = 0;
};
t.prototype._gameEndData = function(e) {
var t = e.end_ts, o = e.players;
m.default.getInstance().update({
time: t,
players: o
});
for (var n = !0, r = 0, a = o.length; r < a; r++) {
var s = o[r], l = s.uid, u = s.card || {}, f = this._newHandCards(u.hand_card, u.hand_card_num), h = i.default.players.getByUid(l);
i.default.gameInfoGD.siteInfos.get(h.pos).udpateHandCards(f);
i.default.gameInfoGD.siteInfos.get(h.pos).udpateEndScore(s.card_score);
i.default.gameInfoGD.siteInfos.get(h.pos).updateRank(s.card_step_out, !1);
3 == s.card_step_out && (n = !1);
}
i.default.gameInfoGD.endShuangShang = n;
c.default.eventUtils.emit(p.default.end_shuangshang);
i.default.gameInfoGD.updateStatus(d.eGDGameStatus.SingleEnd);
};
t.prototype._newHandCards = function(e, t) {
e = e || [];
t = t || 0;
if (e.length > 0) return e;
for (var o = 0; o < t; o++) e.push(s.DDZ_HIDE_ID);
return e;
};
t.prototype._jinGongCard = function(e) {
var t = e.uid, o = e.card, n = i.default.players.getByUid(t).pos;
i.default.gameInfoGD.siteInfos.get(n).gongCard(o);
var r = i.default.gameInfoGD.gongpaiplayerNum;
i.default.gameInfoGD.gongPaiArray.length >= r / 2 && (i.default.gameInfoGD.GongPaiputShow = 2);
i.default.gameInfoGD.gongPaiArray.push(t);
};
t.prototype._combatsupply = function(e) {
c.default.eventUtils.emit(p.default.kanggong_anim_play);
};
t.prototype._exchangecard = function(e) {
for (var t = e.uid, o = e.distribution_cards, n = 0; n < t.length; n++) {
var r = t[n];
if (r == l.default.uid) {
var a = i.default.players.getByUid(r).pos;
(c = (s = i.default.gameInfoGD.siteInfos.get(a)).handCards).push(o[n]);
s.udpateHandCards(c);
} else {
var s, c;
a = i.default.players.getByUid(r).pos;
26 == (c = (s = i.default.gameInfoGD.siteInfos.get(a)).handCards).length && c.push(i.default.isPlayback() ? o[n] : 0);
s.udpateHandCards(c);
}
}
i.default.gameInfoGD.GongPaiStaus = 0;
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card, n = i.default.myAbsolutePos();
if (0 == i.default.gameInfoGD.siteInfos.get(n).handCards.length) {
var r = g.default.getInstance().getFriendUid(n), a = i.default.gameInfoGD.siteInfos.get(n);
r == t && a.friendPutCard(o, n);
}
var s = i.default.players.getByUid(t), l = s.pos, c = i.default.gameInfoGD.siteInfos.get(l), u = o[0];
c.putCard(o);
var d = c.getPutCards(), p = i.default.gameInfoGD.siteInfos.getLastPut(l);
f.default.getInstance().put(u, d, !p, s.gender);
if (u >= h.eGDOneHandType.SiBomb) {
0 != i.default.gameInfoGD.boomUid && i.default.gameInfoGD.boomUid != t || i.default.gameInfoGD.setBoomNum(u);
i.default.isPlayback() || (i.default.gameInfoGD.b_isDelay_time = !0);
}
if (0 === i.default.gameInfoGD.siteInfos.get(l).handCards.length) {
for (var m = 0, y = i.default.config.peopleCount(), _ = 0; _ < y; _++) 0 === i.default.gameInfoGD.siteInfos.get(_).handCards.length && m++;
if (1 == m) {
r = g.default.getInstance().getFriendUid(l);
i.default.gameInfoGD.boomUid = r;
}
i.default.gameInfoGD.siteInfos.get(l).updateRank(m, !0);
}
this._checkNextPut(l, u >= h.eGDOneHandType.SiBomb);
var v = c.handCards.length;
1 !== v && 2 !== v || setTimeout(function() {
f.default.getInstance().warningOnly(s.gender, v);
}, 500);
};
t.prototype._checkNextPut = function(e, t) {
i.default.config.peopleCount();
var o = (e + 1) % 4, n = i.default.gameInfoGD.siteInfos.get(o);
if (0 === n.handCards.length) if (n.getPutCards().length > 0) {
t && (i.default.gameInfoGD.nextRound = {
pos: o,
cards: n.getPutCards().length
});
n.cleanRound();
} else {
var r = (e + 2) % 4, a = i.default.gameInfoGD.siteInfos.get(r);
if (0 === a.handCards.length && a.getPutCards().length > 0) {
t && (i.default.gameInfoGD.nextRound = {
pos: o,
cards: a.getPutCards().length
});
a.cleanRound();
}
}
};
t.prototype._pass = function(e) {
var t = e.uid, o = i.default.players.getByUid(t), n = o.pos;
i.default.gameInfoGD.siteInfos.get(n).pass();
this._checkNextPut(n, !1);
f.default.getInstance().pass(o.gender);
};
t.prototype._turn = function(e) {
var t = e.uid, o = e.ot, n = (e.round, e.pass), r = (e.cul_bid_score, i.default.players.getByUid(t).pos), a = i.default.gameInfoGD.siteInfos.get(r);
a.setIsPass(n);
if (3 == o) {
i.default.gameInfoGD.updateStatus(d.eGDGameStatus.Gameing);
var s = a.getPutCards();
a.turn(d.eGDTurnType.Normal, s);
} else if (1 == o || 2 == o) {
i.default.gameInfoGD.curGongPaiUid = t;
i.default.gameInfoGD.GongPaiStaus = o;
a.turnGongPai(d.eGDTurnType.Normal);
c.default.eventUtils.emit(p.default.data_status_gongpai, {
pos: r
});
i.default.gameInfoGD.updateStatus(d.eGDGameStatus.gongpai);
} else {
i.default.gameInfoGD.updateStatus(d.eGDGameStatus.JiaoDiZhu);
a.jiaoDiZhu(o);
}
this.recordCountDown(i.default.players.getByPos(r).uid);
};
t.prototype._cleanReady = function(e) {
var t = i.default.players.getByPos(e);
if (t && t.isReady()) {
var o = t.pbData();
o.ready = !1;
i.default.updatePlayerData(o);
}
};
t.prototype._parsePlayer = function(e) {
var t = e.uid, o = i.default.players.getByUid(t);
if (o) {
var n = !!e.ready, r = e.total || 0, a = e.op_redouble || 1;
if (o.isReady() !== n || r !== o.score || a !== o.isDouble) {
var s = o.pbData();
s.ready = n;
s.score = r;
i.default.updatePlayerData(s);
}
o.setSelfLevel(e.self_level_card);
o.setFriend(e.friend_team);
return o;
}
cc.error("数据错误:", o);
};
t.prototype._cleanRound = function(e) {
var t = i.default.gameInfoGD.siteInfos.get(e);
t && t.cleanRound();
};
return t;
}(r.default);
o.default = y;
cc._RF.pop();
