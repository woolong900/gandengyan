// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "28b84agZ3pGWqU/ZU0W+XX1", "AnalysisMsgDDZ");
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
var r = require("./AnalysisMsgBase"), i = require("./RoomInfoData"), a = require("./GameSoundDDZ"), s = require("./DDZEnum"), l = require("./DDZCardUtils"), c = require("./DDZSingleEndData"), u = require("./DDZGameControl"), d = require("./UserData"), p = require("./DDZEventKeys"), f = require("./gContext"), h = require("./UserData"), m = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
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
e.prototype.parse.call(this, t, o);
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.prototype._gameBegin = function(e) {
i.default.gameInfoDDZ.m_iLaiziValue = 0;
this._gameInfo(e);
u.default.getInstance().playAnimationBegin();
};
t.prototype._gameInfo = function(e) {
var t = e.begin, o = e.drift_stage, n = e.players, r = e.step, a = e.bottom_card || [ 0, 0, 0, 0 ], l = e.landlord || 0, c = 1;
if (l > 0) {
var u = i.default.players.getByUid(l), d = !0, p = u.pbData();
if (d !== u.deal) {
p.deal = d;
i.default.updatePlayerData(p);
}
} else for (var f = 0, m = n.length; f < m; f++) {
if (S = n[f].uid) {
var y = (w = i.default.players.getByUid(S)).pbData();
d = !1;
if (y && y.deal != d) {
y.deal = d;
i.default.updatePlayerData(y);
}
}
}
var g = r || 0, _ = 0;
_ = o ? s.eDDZGameStatus.JiaoDiZhu : t ? s.eDDZGameStatus.Gameing : 0 === g ? s.eDDZGameStatus.Free : s.eDDZGameStatus.SingleEnd;
var v = 0, C = [], b = [];
for (f = 0, m = n.length; f < m; f++) {
var D = n[f], S = D.uid;
v = (D.bomb_num || 0) + v;
if (!(S <= 0)) {
var w = this._parsePlayer(D), O = D.card || {};
O.last_pass && b.push({
type: s.eRoundTypeDDZ.Pass,
pos: w.pos,
cards: []
});
var P = O.last_dis_card || [];
P.length > 0 && b.push({
type: s.eRoundTypeDDZ.Put,
pos: w.pos,
cards: P
});
var I = this._newHandCards(O.hand_card, O.hand_card_num);
D.drift || !1 ? D.drift_score || 0 : -1;
C.push({
pos: w.pos,
handCards: I
});
var R = i.default.gameInfoDDZ.siteInfos.get(w.pos), k = D.pass;
R.setIsPass(k);
S == h.default.uid && (c = D.bet_num || 1);
}
}
var j = {
curStep: g,
status: _,
siteInfos: C,
betNum: c,
boomNum: v,
bottomCard: a
};
i.default.updateGameData(j);
i.default.gameInfoDDZ.setBottomCard(a);
i.default.gameInfoDDZ.setBankerUid(l);
i.default.gameInfoDDZ.SetLandlordUid(l);
_ === s.eDDZGameStatus.SingleEnd && this._gameEndData(e);
for (f = 0, m = b.length; f < m; f++) {
var L = b[f], U = L.pos;
R = i.default.gameInfoDDZ.siteInfos.get(U);
L.type === s.eRoundTypeDDZ.Pass && R.pass();
L.type === s.eRoundTypeDDZ.Put && R.putCard(L.cards, !1);
}
};
t.prototype._dealRedouble = function(e) {
var t = e.uid, o = e.cul_op, n = i.default.players.getByUid(t), r = n.pos, s = i.default.gameInfoDDZ.siteInfos.get(r);
if (2 == o) {
if (i.default.gameInfoDDZ.getLandlordPos() == r) {
i.default.gameInfoDDZ.setBetNum();
i.default.isPlayback() || (i.default.gameInfoDDZ.b_isDelay_time = !0);
} else i.default.gameInfoDDZ.getLandlordPos() == i.default.myAbsolutePos() ? i.default.gameInfoDDZ.setBetNum(1) : i.default.myAbsolutePos() == r && i.default.gameInfoDDZ.setBetNum(1);
n.setIsDoublee(2);
f.default.eventUtils.emit(p.default.ui_double_update);
}
null != o && void 0 != o && s.setOtType(++o);
s.null();
a.default.getInstance().jiaoDiZhu(o, n.gender);
};
t.prototype._dealBottomcard = function(e) {
var t = i.default.gameInfoDDZ.m_iLandlordUid, o = e.bot_card || [];
if (t > 0) {
var n = o;
!i.default.isPlayback() && (d.default.uid !== t || n.length <= 0) && (n = 4 == n.length ? [ 0, 0, 0, 0 ] : [ 0, 0, 0 ]);
i.default.gameInfoDDZ.getRemain(t, n, o);
}
};
t.prototype._dealDrift = function(e) {
var t = e.uid, o = (e.bot_card, e.grade_type), n = e.landlord_uid || 0, r = i.default.players.getByUid(t), s = r.pos, l = i.default.gameInfoDDZ.siteInfos.get(s);
null != o && void 0 != o && l.setOtType(o);
l.null();
i.default.gameInfoDDZ.b_isPlayDZ_Anim = !0;
1 == o && i.default.myAbsolutePos() == s && i.default.gameInfoDDZ.setBetNum();
if (n > 0) {
f.default.eventUtils.emit(p.default.ui_dzlog_update);
i.default.gameInfoDDZ.setBankerUid(n);
i.default.gameInfoDDZ.SetLandlordUid(n);
var c = i.default.players.getByUid(n), u = c.pbData();
if (!0 !== c.deal) {
u.deal = !0;
i.default.updatePlayerData(u);
}
}
a.default.getInstance().jiaoDiZhu(o, r.gender);
};
t.prototype._gameEnd = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], s = r.uid, l = r.total;
this.updateScore(s, l);
}
this._gameEndData(e);
var c = i.default.myAbsolutePos();
i.default.gameInfoDDZ.siteInfos.get(c).handCards.length > 0 ? a.default.getInstance().gameLose() : a.default.getInstance().gameWin();
};
t.prototype._gameEndData = function(e) {
var t = e.end_ts, o = e.players;
c.default.getInstance().update({
time: t,
players: o
});
for (var n = !1, r = 0, a = o.length; r < a; r++) {
var l = o[r], u = l.uid, d = l.card || {}, p = this._newHandCards(d.hand_card, d.hand_card_num), f = i.default.players.getByUid(u);
i.default.gameInfoDDZ.siteInfos.get(f.pos).udpateHandCards(p);
(l.spring || l.instead_spring) && (n = !0);
}
n && i.default.gameInfoDDZ.setBetNum();
i.default.gameInfoDDZ.updateStatus(s.eDDZGameStatus.SingleEnd);
};
t.prototype._newHandCards = function(e, t) {
e = e || [];
t = t || 0;
if (e.length > 0) return e;
for (var o = 0; o < t; o++) e.push(l.DDZ_HIDE_ID);
return e;
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card, n = i.default.players.getByUid(t), r = n.pos, s = i.default.gameInfoDDZ.siteInfos.get(r), c = o[0];
s.putCard(o);
var u = s.getPutCards(), d = i.default.gameInfoDDZ.siteInfos.getLastPut(r);
a.default.getInstance().put(c, u, !d, n.gender);
switch (c) {
case l.eDDZOneHandType.SoftBomb:
i.default.gameInfoDDZ.setBoomNum();
i.default.isPlayback() || (i.default.gameInfoDDZ.b_isDelay_time = !0);
break;

case l.eDDZOneHandType.HardBomb:
case l.eDDZOneHandType.KINGBOMB:
i.default.isPlayback() || (i.default.gameInfoDDZ.b_isDelay_time = !0);
i.default.gameInfoDDZ.setBoomNum();
i.default.gameInfoDDZ.m_iLaiziValue > 0 && i.default.gameInfoDDZ.setBoomNum();
}
var p = s.handCards.length;
1 !== p && 2 !== p || setTimeout(function() {
a.default.getInstance().warningOnly(n.gender, p);
}, 500);
};
t.prototype._pass = function(e) {
var t = e.uid, o = i.default.players.getByUid(t), n = o.pos;
i.default.gameInfoDDZ.siteInfos.get(n).pass();
a.default.getInstance().pass(o.gender);
};
t.prototype._turn = function(e) {
var t = e.uid, o = e.ot, n = (e.round, e.pass), r = (e.cul_bid_score, i.default.players.getByUid(t).pos), a = i.default.gameInfoDDZ.siteInfos.get(r);
a.setIsPass(n);
if (3 == o) {
i.default.gameInfoDDZ.updateStatus(s.eDDZGameStatus.Gameing);
a.turn(s.eDDZTurnType.Normal);
} else {
i.default.gameInfoDDZ.updateStatus(s.eDDZGameStatus.JiaoDiZhu);
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
s.isdouble = a;
i.default.updatePlayerData(s);
}
return o;
}
cc.error("数据错误:", o);
};
return t;
}(r.default);
o.default = m;
cc._RF.pop();
