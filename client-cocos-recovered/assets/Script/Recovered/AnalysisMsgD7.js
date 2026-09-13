// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "57f42BNWppJQqSbEi5B3pVr", "AnalysisMsgD7");
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
var r = e("./AnalysisMsgBase"), i = e("./RoomInfoData"), a = e("./D7SingleEndData"), s = e("./D7Enum"), l = e("./D7GameInfoData"), c = e("./GameSoundD7"), u = e("./UserData"), d = e("./gContext"), p = e("./D7EventKeys"), f = e("./D7CardUtils"), h = e("./GameConn"), m = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
"game_info" === t && this._gameInfo(o);
"game_deal" === t && this._dealCard(o);
"game_owner" === t && this._jiaoFan(o);
"game_base" === t && this._petRemain(o);
"game_surrender" === t && this._giveUp(o);
"game_steps" === t && this._putCard(o);
"game_score" === t && this._getScore(o);
"game_fetch_base" === t && this._showRemain(o);
"game_friend" === t && this._showFirend(o);
"game_pass" === t && this._pass(o);
"game_operator" === t && this._turn(o);
"game_end" === t && this._gameEnd(o);
"game_steps_foul" === t && this._gameStepFoul(o);
e.prototype.parse.call(this, t, o);
};
t.prototype._gameStepFoul = function(e) {
switch (e.rule_type || 0) {
case 1:
cc.log("跟牌错误~~ ");
d.default.uiHelper.showTip("您出的牌不合规~");
h.default.reconnect();
}
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.prototype._gameInfo = function(e) {
var t = e.begin, o = e.deal_card, n = e.players, r = this._curGameCount, c = e.cur_op_uid, u = 0, f = e.banker || 0, h = e.friend || 0, m = e.friend_card || 0, y = e.owner_card || 0, g = [], _ = 0, v = [];
u = t ? o ? s.eD7GameStatus.Sending : s.eD7GameStatus.Gameing : 0 === this._curGameCount ? s.eD7GameStatus.Free : s.eD7GameStatus.SingleEnd;
var C = e.base_card || [];
C.length > 0 && (g = [].concat(C));
for (var b = [], D = [], S = [], w = null, O = 0, P = n.length; O < P; O++) {
var I = n[O], R = I.uid;
if (!(R <= 0)) {
var k = this._parsePlayer(I);
I.surrender && (_ = R);
1 === I.pass && b.push({
type: l.eRoundTypeD7.Jiao,
uid: R
});
2 === I.pass && b.push({
type: l.eRoundTypeD7.Fan,
uid: R
});
var j = I.owner_card || 0;
j > 0 && (w = {
uid: R,
card: j
});
var L = I.card, U = L.last_round_card || [];
U.length > 0 && D.push({
type: l.eRoundTypeD7.Put,
uid: R,
cards: U
});
var N = L.last_dis_card || [];
N.length > 0 && b.push({
type: l.eRoundTypeD7.Put,
uid: R,
cards: N
});
var T = L.hand_card || [], M = L.score_card || [];
S.push(U);
v.push({
pos: k.pos,
handCards: T,
scoreCards: M
});
}
}
var E = {
curStep: r,
curOpUid: c,
status: u,
zhuangUid: f,
friendUid: h,
friendCard: m,
mainCard: y,
putRemainCards: g,
giveUpUid: _,
siteInfos: v
};
i.default.updateGameData(E);
w && i.default.gameInfoD7.fanOK(w.uid, w.card);
var x = this._sortUids(e.last_round_uid, n);
this._dealRoundData(x, D);
var B = this._sortUids(e.bef_step_uid, n);
this._dealRoundData(B, b);
if (u === s.eD7GameStatus.SingleEnd) {
var A = e.player_fetch_base || !1, H = [].concat(C);
a.default.getInstance().updateBaseInfo(A, H);
a.default.getInstance().updateBaseTypeInfo(e.base_card_score || 0, e.base_card_type || 0, S);
this._gameEndData(e);
d.default.eventUtils.emit(p.default.data_hide_all_cards);
}
};
t.prototype._dealCard = function(e) {
this.cleanReady();
i.default.gameInfoD7.deal(e.card);
var t = i.default.myAbsolutePos(), o = i.default.gameInfoD7.handCards(t).length;
1 === o && c.default.getInstance().gameStart();
var n = i.default.config.peopleCount(), r = !1;
4 === n && 25 === o && (r = !0);
5 === n && 20 === o && (r = !0);
c.default.getInstance().dealCard(r);
};
t.prototype._jiaoFan = function(e) {
var t = e.uid, o = e.card || 0;
if (e.over || !1) {
i.default.gameInfoD7.fanOK(t, o);
c.default.getInstance().fan(i.default.players.getByUid(t).gender);
} else {
i.default.gameInfoD7.jiaoOK(t, o);
c.default.getInstance().jiao(i.default.players.getByUid(t).gender);
}
};
t.prototype._petRemain = function(e) {
var t = e.uid, o = e.card || [];
i.default.gameInfoD7.putRemain(t, o);
};
t.prototype._giveUp = function(e) {
var t = e.uid;
i.default.gameInfoD7.updateGiveUp(t);
c.default.getInstance().giveUp(i.default.players.getByUid(t).gender);
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card;
i.default.gameInfoD7.putCard(t, o, !0);
var n = i.default.players.getByUid(t), r = e.kill_card || !1, a = e.drop_cards || !1;
c.default.getInstance().put(o, n.gender, r, a);
r && d.default.eventUtils.emit(p.default.ui_show_animation_kill, {
pos: n.pos,
cards: o || []
});
a && d.default.eventUtils.emit(p.default.ui_show_animation_shuai, {
pos: n.pos,
cards: o || []
});
var s = i.default.gameInfoD7.roundData().putType;
if (s === f.eD7OneHandType.AABB || s === f.eD7OneHandType.AABB_6677 || s === f.eD7OneHandType.AABB_AA22) {
var l = i.default.gameInfoD7.roundData().maxPutIndex();
if (l >= 0) {
i.default.gameInfoD7.roundData().actions[l].pos === n.pos && d.default.eventUtils.emit(p.default.ui_show_animation_tuolaji, {
pos: n.pos
});
}
}
i.default.isWatcher() && i.default.gameInfoD7.updateRound(!1);
};
t.prototype._getScore = function(e) {
var t = e.uid, o = e.card, n = i.default.players.getByUid(t).pos;
i.default.gameInfoD7.siteInfos.get(n).pushScoreCards(o);
c.default.getInstance().getScore();
};
t.prototype._showRemain = function(e) {
var t = e.player, o = e.card, n = e.koudiType || 0;
a.default.getInstance().updateBaseInfo(t, o, n);
};
t.prototype._showFirend = function(e) {
var t = e.uid;
i.default.gameInfoD7.updateFriend(t, !0);
c.default.getInstance().showFirend();
};
t.prototype._pass = function(e) {
var t = e.uid;
e.over || !1 ? i.default.gameInfoD7.fanGuo(t) : i.default.gameInfoD7.jiaoGuo(t);
};
t.prototype._turn = function(e) {
var t = e.uid, o = e.ot, n = e.round || !1;
if (0 === o) {
i.default.gameInfoD7.updateStatus(s.eD7GameStatus.Gameing);
if ((u = e.friend_card || 0) > 0) {
i.default.gameInfoD7.updateFriendCard(u);
i.default.gameInfoD7.mainCard <= 0 && i.default.gameInfoD7.upadteMainCard(u);
}
var r = e.flick_card || !1, a = e.other_flick_card || 0, l = 0;
l = r ? 128 | a : a;
i.default.gameInfoD7.updateRound(n);
i.default.gameInfoD7.putTurn(t, l);
}
if (1 === o) {
l = e.owner_flag || 0;
i.default.gameInfoD7.updateStatus(s.eD7GameStatus.Calling);
i.default.gameInfoD7.jiaoTurn(t, l);
}
if (2 === o) {
l = e.owner_flag || 0;
i.default.gameInfoD7.updateStatus(s.eD7GameStatus.Calling);
i.default.gameInfoD7.fanTurn(t, l);
}
if (3 === o) {
var c = e.base_card || [], u = e.friend_card || 0;
i.default.gameInfoD7.updateStatus(s.eD7GameStatus.Calling);
i.default.gameInfoD7.getRemain(t, c, u);
}
if (4 === o) {
var d = e.ts;
i.default.gameInfoD7.updateStatus(s.eD7GameStatus.Calling);
i.default.gameInfoD7.updateWaitingJiaoTime(d);
}
};
t.prototype._gameEnd = function(e) {
for (var t = e.players || [], o = [], n = 0, r = t.length; n < r; n++) {
var s = t[n], l = s.uid, d = s.score;
this.addScore(l, d);
l === u.default.uid && d;
o.push(s.last_round_card);
}
a.default.getInstance().updateBaseTypeInfo(e.base_card_score || 0, e.base_card_type || 0, o);
this._gameEndData(e);
a.default.getInstance().isLiuJu() && i.default.gameInfoD7.roundData().clean();
var p = i.default.myAbsolutePos(), f = a.default.getInstance().playerScore(p);
f > 0 && c.default.getInstance().gameWin();
f < 0 && c.default.getInstance().gameLose();
};
t.prototype._gameEndData = function(e) {
var t = e.end_ts, o = e.hz ? 1 : 2, n = e.players;
a.default.getInstance().update({
time: t,
endType: o,
players: n
});
i.default.gameInfoD7.updateStatus(s.eD7GameStatus.SingleEnd);
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
cc.error("数据错误:", o);
};
t.prototype._sortUids = function(e, t) {
var o = [];
if (e && e > 0) {
for (var n = [], r = [], i = !1, a = 0, s = t.length; a < s; a++) {
var l = t[a].uid;
if (!(l <= 0)) {
e === l && (i = !0);
i ? r.push(l) : n.push(l);
}
}
o = r.concat(n);
}
return o;
};
t.prototype._dealRoundData = function(e, t) {
for (var o = function(e) {
for (var o = 0, n = t.length; o < n; o++) {
var r = t[o];
if (r.uid == e) return r;
}
}, n = 0; n < e.length; n++) {
var r = o(e[n]);
if (r) {
r.type === l.eRoundTypeD7.Fan && i.default.gameInfoD7.fanGuo(r.uid);
r.type === l.eRoundTypeD7.Jiao && i.default.gameInfoD7.jiaoGuo(r.uid);
if (r.type === l.eRoundTypeD7.Put) {
0 === n && i.default.gameInfoD7.putTurn(r.uid, 0);
i.default.gameInfoD7.putCard(r.uid, r.cards, !1);
}
}
}
};
return t;
}(r.default);
o.default = m;
cc._RF.pop();
