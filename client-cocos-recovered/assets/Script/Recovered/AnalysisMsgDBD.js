// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f6b3bSKCblNW42kjcCRK8D0", "AnalysisMsgDBD");
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
var r = e("./AnalysisMsgBase"), i = e("./RoomInfoData"), a = e("./DBDEnum"), s = e("./DBDCardUtils"), l = e("./DBDSingleEndData"), c = e("./GameSoundDBD"), u = e("./UserData"), d = e("./DBDGameControl"), p = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
cc.log(t, o);
"game_info" === t && this._gameInfo(o);
"game_biddealer" === t && this._dealDrift(o);
"game_step" === t && this._putCard(o);
"game_pass" === t && this._pass(o);
"game_operator" === t && this._turn(o);
"game_begin" === t && this._gameBegin(o);
"game_end" === t && this._gameEnd(o);
"game_curroundcards" === t && this._roundDetails(o);
e.prototype.parse.call(this, t, o);
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.prototype._gameBegin = function(e) {
this._gameInfo(e);
this._scoreChange(e);
d.default.getInstance().playAnimationBegin();
};
t.prototype._gameInfo = function(e) {
var t = e.begin, o = e.game_stage, n = e.players, r = e.step, s = e.bottom_card || [ 0, 0, 0, 0, 0 ], l = e.landlord || 0, c = e.bet_num || 0, u = e.hall_score || 0, d = e.hz || !1;
i.default.gameInfoDBD.setBottomCard(s);
if (l > 0) {
var p = i.default.players.getByUid(l), f = !0, h = p.pbData();
if (f !== p.deal) {
h.deal = f;
i.default.updatePlayerData(h);
}
} else for (var m = 0, y = n.length; m < y; m++) {
if (w = n[m].uid) {
var g = (I = i.default.players.getByUid(w)).pbData();
f = !1;
if (g && g.deal != f) {
g.deal = f;
i.default.updatePlayerData(g);
}
}
}
var _ = r || 0, v = 0;
v = 1 === o ? a.eDBDGameStatus.JiaoDiZhu : t ? a.eDBDGameStatus.Gameing : 0 === _ ? a.eDBDGameStatus.Free : a.eDBDGameStatus.SingleEnd;
var C = 0, b = [], D = [];
for (m = 0, y = n.length; m < y; m++) {
var S = n[m], w = S.uid, O = S.extra_score, P = S.pass;
C = (S.bomb_num || 0) + C;
if (!(w <= 0)) {
var I = this._parsePlayer(S), R = S.card || {}, k = R.last_dis_card || [], j = R.step_cards_type || 0, L = k;
k.indexOf(0) > -1 && (L = []);
L.length > 0 && D.push({
type: a.eRoundTypeDBD.Put,
pos: I.pos,
cards: L,
stepCardType: j
});
var U = this._newHandCards(R.hand_card);
S.ready, S.bid_op;
b.push({
pos: I.pos,
handCards: U
});
(x = i.default.gameInfoDBD.siteInfos.get(I.pos)).setCurBidScore(O);
x.setIsPass(P);
}
}
var N = {
curStep: _,
status: v,
siteInfos: b
}, T = i.default.config.isChecked(6) ? u : c;
i.default.updateGameData(N);
i.default.gameInfoDBD.setBankerUid(l);
i.default.gameInfoDBD.updateBetNum(T);
i.default.gameInfoDBD.setIsDraw(d);
i.default.gameInfoDBD.setBoomNum(C);
v === a.eDBDGameStatus.SingleEnd && this._gameEndData(e);
for (m = 0, y = D.length; m < y; m++) {
var M = D[m], E = M.pos, x = i.default.gameInfoDBD.siteInfos.get(E);
M.type === a.eRoundTypeDBD.Pass && x.pass();
M.type === a.eRoundTypeDBD.Put && x.putCard(M.cards, M.stepCardType, !1);
}
};
t.prototype._roundDetails = function(e) {
cc.error("出牌详情: ", e);
};
t.prototype._gameEnd = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o].uid, a = i.default.players.getByUid(r), s = a.pbData();
if (!1 !== a.deal) {
s.deal = !1;
i.default.updatePlayerData(s);
}
}
this._gameEndData(e);
var l = i.default.myAbsolutePos();
i.default.gameInfoDBD.siteInfos.get(l).handCards.length > 0 ? c.default.getInstance().gameLose() : c.default.getInstance().gameWin();
var u = e.hall_score || 0, d = e.hz || !1;
i.default.gameInfoDBD.updateBetNum(u);
i.default.gameInfoDBD.setIsDraw(d);
};
t.prototype._scoreChange = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], a = r.uid, s = r.score, l = r.total;
i.default.players.getByUid(a).updateScore(l, s);
}
};
t.prototype._gameEndData = function(e) {
var t = e.end_ts, o = e.players;
l.default.getInstance().update({
time: t,
players: o
});
for (var n = 0, r = o.length; n < r; n++) {
var s = o[n], c = s.uid, u = s.card || {}, d = this._newHandCards(u.hand_card), p = i.default.players.getByUid(c);
i.default.gameInfoDBD.siteInfos.get(p.pos).udpateHandCards(d);
}
i.default.gameInfoDBD.updateStatus(a.eDBDGameStatus.SingleEnd);
};
t.prototype._newHandCards = function(e, t) {
void 0 === t && (t = 0);
e = e || [];
t = t || e.length;
if (e.length > 0) return e;
for (var o = 0; o < t; o++) e.push(s.DBD_HIDE_ID);
return e;
};
t.prototype._dealDrift = function(e) {
var t = e.uid, o = e.bot_card || [], n = e.grade_type, r = e.dealer_uid || 0, a = e.cul_inject_uid || 0, s = i.default.players.getByUid(t), l = s.pos, d = i.default.gameInfoDBD.siteInfos.get(l);
null != n && void 0 != n && d.setOtType(n);
d.null();
i.default.gameInfoDBD.setBankerUid(r);
if (r > 0) {
var p = o;
(u.default.uid !== r || o.length <= 0) && (p = [ 0, 0, 0, 0, 0 ]);
i.default.gameInfoDBD.getRemain(r, p, o);
var f = i.default.players.getByUid(r), h = f.pbData();
if (!0 !== f.deal) {
h.deal = !0;
i.default.updatePlayerData(h);
}
}
if (i.default.config.isChecked(4) && 2 === n && i.default.config.isChecked(7)) {
var m = i.default.gameInfoDBD.betNum;
m *= 2;
i.default.gameInfoDBD.updateBetNum(m);
}
if (i.default.config.isChecked(6)) {
var y = i.default.config.getValue(15), g = i.default.players.getByUid(a), _ = 0;
if (i.default.isPlayback()) {
_ = a;
i.default.gameInfoDBD.updateBetNum(_);
} else if (g) {
m = g.score - y;
_ = i.default.gameInfoDBD.betNum + y;
this.updateScore(a, m);
i.default.gameInfoDBD.updateBetNum(_);
}
c.default.getInstance().jiaoScore(n, s.gender);
} else {
var v = n;
null !== v && void 0 !== v || (v = o[0]);
c.default.getInstance().jiaoDiZhu(v, s.gender);
}
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card, n = (e.dealer_friend, i.default.players.getByUid(t)), r = n.pos, a = i.default.gameInfoDBD.siteInfos.get(r);
a.putCard(o, e.step_cards_type || 0);
var l = a.putCardType, u = [ s.eDBDOneHandType.BOMB, s.eDBDOneHandType.threeBOMB ], d = i.default.gameInfoDBD.boomNum;
u.indexOf(l[0]) > -1 ? d += 1 : l[0] === s.eDBDOneHandType.SOFTBOMB ? d += 2 : l[0] === s.eDBDOneHandType.HARDBOMB ? d += 3 : l[0] === s.eDBDOneHandType.KINGBOMB && (i.default.config.isChecked(16) ? d += 5 : d += 1);
i.default.gameInfoDBD.setBoomNum(d);
var p = a.getPutCards(), f = i.default.gameInfoDBD.siteInfos.getLastPut(r);
c.default.getInstance().put(l[0], p, !f, n.gender);
1 === a.handCards.length && setTimeout(function() {
c.default.getInstance().warningOnly1(n.gender);
}, 500);
};
t.prototype._pass = function(e) {
var t = e.uid, o = i.default.players.getByUid(t), n = o.pos;
i.default.gameInfoDBD.siteInfos.get(n).pass();
c.default.getInstance().pass(o.gender);
};
t.prototype._turn = function(e) {
var t = e.uid, o = e.ot, n = (e.round, e.pass), r = e.cul_bid_score, s = i.default.players.getByUid(t).pos, l = i.default.gameInfoDBD.siteInfos.get(s);
l.setIsPass(n);
if (3 == o) {
i.default.gameInfoDBD.updateStatus(a.eDBDGameStatus.Gameing);
l.turn(a.eDBDTurnType.Normal);
} else {
i.default.gameInfoDBD.updateStatus(a.eDBDGameStatus.JiaoDiZhu);
l.jiaoDiZhu(o);
l.setCurBidScore(r);
i.default.gameInfoDBD.setBottomCard([]);
}
this.recordCountDown(i.default.players.getByPos(s).uid);
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
var n = !!e.ready, r = e.total || 0;
if (o.isReady() !== n || r !== o.score) {
var a = o.pbData();
a.ready = n;
a.score = r;
i.default.updatePlayerData(a);
}
return o;
}
};
return t;
}(r.default);
o.default = p;
cc._RF.pop();
