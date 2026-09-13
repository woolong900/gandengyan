// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7a99721qK9IIZnyf1Dsbj+R", "AnalysisMsgPDK");
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
var r = e("./AnalysisMsgBase"), i = e("./RoomInfoData"), a = e("./GameSoundPDK"), s = e("./PDKEnum"), l = e("./PDKCardUtils"), c = e("./PDKSingleEndData"), u = e("./PDKGameControl"), d = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.parse = function(t, o) {
"game_info" === t && this._gameInfo(o);
"game_drift" === t && this._dealDrift(o);
"game_step" === t && this._putCard(o);
"game_pass" === t && this._pass(o);
"game_operator" === t && this._turn(o);
"game_begin" === t && this._gameBegin(o);
"game_end" === t && this._gameEnd(o);
"game_scorechange" === t && this._scoreChange(o);
e.prototype.parse.call(this, t, o);
};
t.prototype.parseGame = function(e) {
this.parse("game_info", e);
};
t.prototype._gameBegin = function(e) {
this._gameInfo(e);
u.default.getInstance().playAnimationBegin();
};
t.prototype._gameInfo = function(e) {
var t = e.begin, o = e.drift_stage, n = e.players, r = e.step || 0, a = 0;
a = o ? s.ePDKGameStatus.Piaoing : t ? s.ePDKGameStatus.Gameing : 0 === r ? s.ePDKGameStatus.Free : s.ePDKGameStatus.SingleEnd;
for (var l = [], c = [], u = 0, d = n.length; u < d; u++) {
var p = n[u];
if (!(p.uid <= 0)) {
var f = this._parsePlayer(p), h = p.card || {};
h.last_pass && c.push({
type: s.eRoundTypePDK.Pass,
pos: f.pos,
cards: []
});
var m = h.last_dis_card || [];
m.length > 0 && c.push({
type: s.eRoundTypePDK.Put,
pos: f.pos,
cards: m
});
var y = this._newHandCards(h.hand_card, h.hand_card_num), g = 0;
g = p.drift || !1 ? p.drift_score || 0 : -1;
l.push({
pos: f.pos,
piao: g,
handCards: y
});
}
}
var _ = {
curStep: r,
status: a,
siteInfos: l
};
i.default.updateGameData(_);
a === s.ePDKGameStatus.SingleEnd && this._gameEndData(e);
for (u = 0, d = c.length; u < d; u++) {
var v = c[u], C = v.pos, b = i.default.gameInfoPDK.siteInfos.get(C);
v.type === s.eRoundTypePDK.Pass && b.pass();
v.type === s.eRoundTypePDK.Put && b.putCard(v.cards, !1);
}
};
t.prototype._gameEnd = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], s = r.uid, l = r.total;
this.updateScore(s, l);
}
this._gameEndData(e);
var c = i.default.myAbsolutePos();
i.default.gameInfoPDK.siteInfos.get(c).handCards.length > 0 ? a.default.getInstance().gameLose() : a.default.getInstance().gameWin();
};
t.prototype._scoreChange = function(e) {
for (var t = e.players || [], o = 0, n = t.length; o < n; o++) {
var r = t[o], a = r.uid, s = r.score, l = r.total;
i.default.players.getByUid(a).updateScore(l, s);
}
};
t.prototype._gameEndData = function(e) {
var t = e.end_ts, o = e.players;
c.default.getInstance().update({
time: t,
players: o
});
for (var n = 0, r = o.length; n < r; n++) {
var a = o[n], l = a.uid, u = a.card || {}, d = this._newHandCards(u.hand_card, u.hand_card_num), p = i.default.players.getByUid(l);
i.default.gameInfoPDK.siteInfos.get(p.pos).udpateHandCards(d);
}
i.default.gameInfoPDK.updateStatus(s.ePDKGameStatus.SingleEnd);
};
t.prototype._newHandCards = function(e, t) {
e = e || [];
t = t || 0;
if (e.length > 0) return e;
for (var o = 0; o < t; o++) e.push(l.PDK_HIDE_ID);
return e;
};
t.prototype._dealDrift = function(e) {
var t = e.uid, o = e.drift_score, n = i.default.players.getByUid(t).pos;
i.default.gameInfoPDK.siteInfos.get(n).updatePiao(o);
};
t.prototype._putCard = function(e) {
var t = e.uid, o = e.card, n = i.default.players.getByUid(t), r = n.pos, s = i.default.gameInfoPDK.siteInfos.get(r);
s.putCard(o);
var l = s.putCardType, c = s.getPutCards(), u = i.default.gameInfoPDK.siteInfos.getLastPut(r);
a.default.getInstance().put(l, c, !u, n.gender);
1 === s.handCards.length && setTimeout(function() {
a.default.getInstance().warningOnly1(n.gender);
}, 500);
};
t.prototype._pass = function(e) {
var t = e.uid, o = i.default.players.getByUid(t), n = o.pos;
i.default.gameInfoPDK.siteInfos.get(n).pass();
a.default.getInstance().pass(o.gender);
};
t.prototype._turn = function(e) {
var t = e.uid, o = e.ot, n = i.default.players.getByUid(t).pos;
if (1 == o) {
var r = i.default.gameInfoPDK.siteInfos.get(n), a = e.step_card_type || 0;
0 === a && r.turn(s.ePDKTurnType.Normal);
1 === a && r.turn(s.ePDKTurnType.NoBigger);
2 === a && r.turn(s.ePDKTurnType.Hei3);
3 === a && r.turn(s.ePDKTurnType.Last);
}
if (2 == o && i.default.gameInfoPDK.status !== s.ePDKGameStatus.Piaoing) {
i.default.gameInfoPDK.updateStep(i.default.gameInfoPDK.curStep + 1);
i.default.gameInfoPDK.updateStatus(s.ePDKGameStatus.Piaoing);
i.default.gameInfoPDK.siteInfos.get(0) && i.default.gameInfoPDK.siteInfos.get(0).clean(!0);
i.default.gameInfoPDK.siteInfos.get(1) && i.default.gameInfoPDK.siteInfos.get(1).clean(!0);
i.default.gameInfoPDK.siteInfos.get(2) && i.default.gameInfoPDK.siteInfos.get(2).clean(!0);
this._cleanReady(0);
this._cleanReady(1);
this._cleanReady(2);
var l = i.default.myAbsolutePos();
(r = i.default.gameInfoPDK.siteInfos.get(l)).updatePiao(-1);
}
this.recordCountDown(i.default.players.getByPos(n).uid);
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
cc.error("数据错误:", o);
};
return t;
}(r.default);
o.default = d;
cc._RF.pop();
