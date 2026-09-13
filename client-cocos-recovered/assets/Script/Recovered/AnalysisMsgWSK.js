// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d9869WyOf5MGqUrZd5Y1pv7", "AnalysisMsgWSK");
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
var r = e("./WSKEnum"), i = e("./WSKEventKeys"), a = e("./WSKSingleEndData"), s = e("./WSKGameControl"), l = e("./CommonEnum"), c = e("./RoomInfoData"), u = e("./GameLogicWSK"), d = e("./GameSoundWSK"), p = e("./gContext"), f = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
"game_info" === t && this._gameInfo(o);
"game_step" === t && this._putCard(o);
"game_pass" === t && this._pass(o);
"game_operator" === t && this._turn(o);
"game_successor" === t && this._next(o);
"game_score" === t && this._getScore(o);
"game_friend" === t && this._showFirend(o);
"game_handcard" === t && this._callBanker(o);
"game_friendcard" === t && this._showFirendCard(o);
"game_begin" === t && this._gameBegin(o);
"game_end" === t && this._gameEnd(o);
"game_curroundcards" === t && this._roundDetails(o);
"game_showxicard" === t && this._showXiCards(o);
e.prototype.parse.call(this, t, o);
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.prototype._gameBegin = function(e) {
for (var t = e.exchange_position || [], o = [], n = 0, r = t.length; n < r; n += 2) {
var i = c.default.players.getByUid(t[n]).pbData(), a = t[n + 1];
o.push(a);
i.pos = a;
c.default.updatePlayerData(i);
}
this._gameInfo(e);
d.default.getInstance().gameStart();
e.exchange_position ? s.default.getInstance().playAnimationBegin(o) : s.default.getInstance().playAnimationBegin();
};
t.prototype._gameEnd = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], i = r.uid, s = r.total;
this.updateScore(i, s);
}
this._gameEndData(e);
var l = c.default.myAbsolutePos();
a.default.getInstance().score(l) > 0 ? d.default.getInstance().gameWin() : d.default.getInstance().gameLose();
};
t.prototype._roundDetails = function(e) {
p.default.eventUtils.emit(i.default.data_round_details_change, e.cur_round);
};
t.prototype._gameInfo = function(e) {
var t = e.begin, o = e.players, n = e.step, i = e.game_stage, a = e.friend_card || 0;
(e.hard_card_uid || 0) > 0 && (a = -1);
var s = n || 0, u = 0;
if (t) if (c.default.config.index === l.eGameIds.QCDG) u = r.eWSKGameStatus.Calling; else if (c.default.config.index === l.eGameIds.XSWSK) switch (i) {
case 3:
u = r.eWSKGameStatus.ShowXiPai;
break;

case 2:
u = r.eWSKGameStatus.Gameing;
break;

case 1:
u = r.eWSKGameStatus.Calling;
break;

case 0:
u = r.eWSKGameStatus.Gameing;
} else u = r.eWSKGameStatus.Gameing; else u = 0 === s ? r.eWSKGameStatus.Free : r.eWSKGameStatus.SingleEnd;
for (var d = [], p = [], f = 0, h = o.length; f < h; f++) {
var m = o[f];
if (!(m.uid <= 0)) {
var y = this._parsePlayer(m).pos, g = m.card_step_out || 0, _ = m.grasp_score || 0, v = m.card.hand_card || [], C = m.show_xi_card || [];
d.push({
pos: y,
rank: g,
pickScore: _,
handCards: v,
xiCards: C
});
var b = m.card.last_dis_card || [];
b.length > 0 && p.push({
type: r.eWSKRoundType.Put,
pos: y,
cards: b
});
m.pass && p.push({
type: r.eWSKRoundType.Pass,
pos: y,
cards: []
});
}
}
var D = {
curStep: s,
status: u,
zhuangUid: e.banker_uid || 0,
friendUid: e.friend_uid || 0,
friendCard: a,
tableScore: e.desktop_score || 0,
tableScoreCards: e.desk_card_scores || [],
siteInfos: d,
allPutCards: e.step_card_info || []
};
c.default.updateGameData(D);
u === r.eWSKGameStatus.SingleEnd && this._gameEndData(e);
for (f = 0, h = p.length; f < h; f++) {
var S = p[f], w = (y = S.pos, c.default.gameInfoWSK.siteInfos.get(y));
S.type === r.eWSKRoundType.Pass && w.pass();
var O = S.cards.length, P = S.cards.slice(0, O / 2), I = S.cards.slice(O / 2);
S.type === r.eWSKRoundType.Put && c.default.gameInfoWSK.putCard(S.pos, P, I, !1);
}
};
t.prototype._parsePlayer = function(e) {
var t = e.uid, o = c.default.players.getByUid(t);
if (o) {
var n = !!e.ready, r = e.total || 0;
if (o.isReady() !== n || r !== o.score) {
var i = o.pbData();
i.ready = n;
i.score = r;
c.default.updatePlayerData(i);
}
return o;
}
cc.error("数据错误:", o);
};
t.prototype._gameEndData = function(e) {
var t = e.end_ts, o = e.players;
a.default.getInstance().update({
time: t,
endType: e.card_type,
players: o
});
for (var n = 0, i = o.length; n < i; n++) {
var s = o[n], l = s.uid, u = s.card || {}, d = s.show_xi_card || [], p = this._newHandCards(u.hand_card, u.hand_card_num), f = c.default.players.getByUid(l);
c.default.gameInfoWSK.siteInfos.get(f.pos).udpateHandCards(p);
c.default.gameInfoWSK.siteInfos.get(f.pos).updateXiCard(d, !1);
c.default.gameInfoWSK.siteInfos.get(f.pos).updatePickUpScore(s.grasp_score || 0, !1);
}
c.default.gameInfoWSK.updateStatus(r.eWSKGameStatus.SingleEnd);
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card;
c.default.config.index === l.eGameIds.XSWSK && o.includes(0) && o.shift();
var n = c.default.players.getByUid(t), r = n.pos, i = o.length, a = o.slice(0, i / 2), s = o.slice(i / 2);
this._checkNextPut(r);
c.default.gameInfoWSK.putCard(r, a, s, !0);
if (0 === c.default.gameInfoWSK.siteInfos.get(r).handCards.length) {
for (var u = 0, p = c.default.config.peopleCount(), f = 0; f < p; f++) 0 === c.default.gameInfoWSK.siteInfos.get(f).handCards.length && u++;
c.default.gameInfoWSK.siteInfos.get(r).updateRank(u, !0);
}
var h = c.default.gameInfoWSK.siteInfos.get(r).putType, m = c.default.gameInfoWSK.siteInfos.get(r).putVirtualCards;
d.default.getInstance().put(h, m, n.gender);
var y = c.default.gameInfoWSK.siteInfos.get(r).handCards.length;
1 === y && setTimeout(function() {
d.default.getInstance().warningOnly1(n.gender);
}, 1e3);
2 === y && setTimeout(function() {
d.default.getInstance().warningOnly2(n.gender);
}, 1e3);
};
t.prototype._pass = function(e) {
var t = e.uid, o = c.default.players.getByUid(t), n = o.pos;
c.default.gameInfoWSK.siteInfos.get(n).pass();
if (c.default.gameInfoWSK.status === r.eWSKGameStatus.Calling) d.default.getInstance().passBanker(o.gender); else {
this._checkNextPut(n);
d.default.getInstance().pass(o.gender);
}
};
t.prototype._checkNextPut = function(e) {
var t = c.default.config.peopleCount();
if (3 === t) {
var o = (e + 1) % t;
0 === (n = c.default.gameInfoWSK.siteInfos.get(o)).handCards.length && n.putRealCards.length > 0 && n.cleanRound();
}
if (4 === t) {
var n;
o = (e + 1) % t;
if (0 === (n = c.default.gameInfoWSK.siteInfos.get(o)).handCards.length) if (n.putRealCards.length > 0) n.cleanRound(); else {
var r = (e + 1) % t, i = c.default.gameInfoWSK.siteInfos.get(r);
0 === i.handCards.length && i.putRealCards.length > 0 && i.cleanRound();
}
}
};
t.prototype._turn = function(e) {
var t = e.uid, o = e.ot, n = c.default.players.getByUid(t).pos;
1 === o && c.default.gameInfoWSK.updateStatus(r.eWSKGameStatus.Calling);
if (2 === o) {
c.default.gameInfoWSK.updateStatus(r.eWSKGameStatus.Gameing);
if (e.round) {
this._cleanRound(0);
this._cleanRound(1);
this._cleanRound(2);
this._cleanRound(3);
}
}
3 === o && c.default.gameInfoWSK.updateStatus(r.eWSKGameStatus.ShowXiPai);
c.default.gameInfoWSK.siteInfos.get(n).turn();
};
t.prototype._next = function(e) {
var t = e.uid;
this._turn({
uid: t,
ot: 2,
round: !0
});
var o = c.default.players.getByUid(t);
p.default.eventUtils.emit(i.default.action_next_continue, {
pos: o.pos
});
d.default.getInstance().jiefeng();
};
t.prototype._getScore = function(e) {
var t = e.uid, o = e.score, n = c.default.players.getByUid(t).pos;
c.default.gameInfoWSK.pickUpScore(n, o);
d.default.getInstance().getScore();
};
t.prototype._showFirend = function(e) {
var t = e.uid;
c.default.gameInfoWSK.updateFriend(t, !0);
d.default.getInstance().showFirend();
};
t.prototype._callBanker = function(e) {
var t = e.uid;
c.default.gameInfoWSK.updateFriendCard(-1, !1);
c.default.gameInfoWSK.updateZhuang(t, !0);
var o = c.default.players.getByUid(t);
if (c.default.config.index === l.eGameIds.XSWSK) {
d.default.getInstance().callBankerHou();
cc.log("浠水五十K 吼牌！！！");
} else d.default.getInstance().callBanker(o.gender);
};
t.prototype._showXiCards = function(e) {
var t = e.uid, o = e.card, n = c.default.players.getByUid(t).pos, i = c.default.gameInfoWSK.siteInfos.get(n);
i.cleanRound();
c.default.gameInfoWSK.status === r.eWSKGameStatus.ShowXiPai && c.default.gameInfoWSK.updateStatus(r.eWSKGameStatus.Calling);
if (o) {
i.updateXiCard(o, !0);
d.default.getInstance().showXiCard();
}
};
t.prototype._showFirendCard = function(e) {
var t = e.deal_uid, o = e.friend_card;
if (c.default.gameInfoWSK.status === r.eWSKGameStatus.Calling) {
c.default.gameInfoWSK.updateStatus(r.eWSKGameStatus.Gameing);
this._resetGameData();
}
c.default.gameInfoWSK.updateFriendCard(o, !0);
c.default.gameInfoWSK.updateZhuang(t, !0);
if (c.default.config.index === l.eGameIds.QJSHZ) {
var n = (c.default.players.getByUid(t).pos + 2) % 4, i = c.default.players.getByPos(n).uid;
c.default.gameInfoWSK.updateFriend(i, !1);
}
};
t.prototype._resetGameData = function() {
this._cleanRound(0);
this._cleanRound(1);
this._cleanRound(2);
this._cleanRound(3);
this._updatePickUpScore(0);
this._updatePickUpScore(1);
this._updatePickUpScore(2);
this._updatePickUpScore(3);
};
t.prototype._newHandCards = function(e, t) {
e = e || [];
t = t || 0;
if (e.length > 0) return e;
for (var o = 0; o < t; o++) e.push(u.WSK_CARD_HIDE_ID);
return e;
};
t.prototype._cleanRound = function(e) {
var t = c.default.gameInfoWSK.siteInfos.get(e);
t && t.cleanRound();
};
t.prototype._updatePickUpScore = function(e) {
var t = c.default.gameInfoWSK.siteInfos.get(e);
t && t.updatePickUpScore(0, !1);
};
return t;
}(e("./AnalysisMsgBase").default);
o.default = f;
cc._RF.pop();
