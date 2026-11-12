// Local room adapter for the original Qianjiang Dou Dizhu client scene.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7020dZ2DPlJmXvyK1hj3k9F", "DDZStandalone");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomInfoData"), r = require("./UserData"), i = require("./DDZEnum"), a = require("./gContext"), l = require("./DDZCardUtils"), s = function() {
function e() {}
e._sound = function() { return require("./GameSoundDDZ").default.getInstance(); };
e._warningVoice = function(pos, count) {
if (count !== 1 && count !== 2) return;
var self = this, token = this._roundToken;
setTimeout(function() {
if (token !== self._roundToken || !self.isActive() || self._roundFinished) return;
if (n.default.gameInfoDDZ.siteInfos.get(pos).handCards.length !== count) return;
self._sound().warningOnly(n.default.players.getByPos(pos).gender, count);
}, 500);
};
e._checked = function(id) {
return !!(n.default.config && n.default.config.isChecked && n.default.config.isChecked(id));
};
e._setStatus = function(status) {
var info = n.default.gameInfoDDZ;
if (info.updateStatus) info.updateStatus(status); else info.status = status;
};
e._setMultiplier = function(value) {
var info = n.default.gameInfoDDZ;
if (info.updateBetNum) info.updateBetNum(value); else info.betNum = value;
};
e._summary = function() {
var players = [];
for (var pos = 0; pos < 3; pos++) {
var player = n.default.players.getByPos(pos);
players.push({ uid: player.uid, score: player.score, winer: player.score > 0, details: [] });
}
n.default.setTotalEndData(new (require("./TotalEndData").default)({ time: r.default.second, isNormalEnd: true, players: players }));
a.default.eventUtils.emit(require("./EventKeys").default.data_game_total_end);
};
e.isActive = function() {
return "1" === cc.sys.localStorage.getItem("ddz_local_room") &&
!!this._roomId && this._roomId === n.default.roomId && !n.default.isPlayback();
};
e._deck = function() {
for (var e = [], t = 1; t <= 13; t++) for (var o = 1; o <= 4; o++) e.push(10 * t + o);
e.push(170, 180);
for (t = e.length - 1; t > 0; t--) {
var n = Math.floor(Math.random() * (t + 1)), r = e[t];
e[t] = e[n];
e[n] = r;
}
return e;
};
e._deal = function() {
if (this._matchFinished) return false;
if (this._roundNo >= this._roundLimit) { this._matchFinished = true; this._summary(); return false; }
this._roundToken = (this._roundToken || 0) + 1;
this._roundFinished = !1;
this._roundNo = (this._roundNo || 0) + 1;
this._currentPos = -1;
this._lastPutPos = -1;
this._lastPutCards = [];
this._lastPutType = l.eDDZOneHandType.Error;
this._passCount = 0;
this._phase = "dealing";
this._recordCountDown(-1);
this._landlordPos = -1;
this._bidOrder = 0;
this._playCounts = [0, 0, 0];
this._bombCounts = [0, 0, 0];
this._doubles = [1, 1, 1];
var e = this._deck(), t = e.slice(0, 17), o = e.slice(17, 34), r = e.slice(34, 51);
this._bottomCards = e.slice(51);
this._initialHands = [t.slice(), o.slice(), r.slice()];
// Match the original cleanReady flow: clear each seat before dealing and publish
// player updates so the ready/OK icon also disappears on an already-mounted table.
for (var pos = 0; pos < 3; pos++) {
var player = n.default.players.getByPos(pos);
if (player) {
var data = player.pbData();
data.ready = !1;
data.deal = !1;
data.isdouble = 1;
n.default.updatePlayerData(data);
}
}
n.default.updateGameData({
curStep: this._roundNo,
status: i.eDDZGameStatus.JiaoDiZhu,
siteInfos: [ {
pos: 0,
handCards: t
}, {
pos: 1,
handCards: o
}, {
pos: 2,
handCards: r
} ],
betNum: 1,
boomNum: 0,
bottomCard: []
});
var info = n.default.gameInfoDDZ;
info.b_isDelay_time = false;
info.m_bTriplePair = this._checked(16);
info.m_doubleMax = this._checked(21);
info.m_bLaiziRule = false;
info.m_iLaiziValue = 0;
info.m_iBaseScore = this._baseScore;
info.setBottomCard([]);
info.SetLandlordUid(0);
info.setBankerUid(0);
var self = this;
require("./PokerDealFlow").begin(this, function() {
self._beginChoice(Math.floor(Math.random() * 3), "bid");
});
};
e.start = function(e) {
// The historical server is unavailable. Never silently substitute a normal
// deck for a selected wildcard/flower deck whose dealing contract is unknown.
if (e && e.isChecked && (e.isChecked(5) || e.isChecked(6) || e.isChecked(7))) {
a.default.uiHelper.showTip("本地测试暂不支持赖子玩法，请选择无赖子");
return false;
}
cc.sys.localStorage.setItem("ddz_local_room", "1");
n.default.reset();
n.default.config = e;
n.default.roomId = 100000 + Math.floor(9e5 * Math.random());
this._roomId = n.default.roomId;
n.default.roomCode = String(n.default.roomId);
n.default.owner = Number(r.default.uid) || 1;
n.default.scoreRatio = 1;
n.default.belongClub = 0;
this._roundNo = 0;
this._matchFinished = false;
this._roundFinished = false;
this._phase = "waiting";
this._currentPos = -1;
this._roundToken = (this._roundToken || 0) + 1;
require("./PokerDealFlow").cancel(this);
this._roundLimit = e && e.gameCount ? Number(e.gameCount()) : 15;
if (!(this._roundLimit > 0)) this._roundLimit = 15;
this._baseScore = e && e.getValue ? Number(e.getValue(15)) : 1;
if (!(this._baseScore > 0)) this._baseScore = 1;
var t = Number(r.default.uid) || 1;
n.default.updatePlayerData([ {
uid: t,
headImg: r.default.headUrl,
name: r.default.nickname || "我",
ip: "127.0.0.1",
pos: 0,
score: 0,
gender: r.default.sex || 1,
deal: !1,
onLine: !0,
ready: !1
}, {
uid: t + 201,
name: "机器人小地",
pos: 1,
score: 0,
gender: 1,
onLine: !0,
ready: !0
}, {
uid: t + 202,
name: "机器人小主",
pos: 2,
score: 0,
gender: 2,
onLine: !0,
ready: !0
} ]);
// Enter the native Free state; only the player's Ready action may start round 1.
n.default.updateGameData({ curStep: 0, status: i.eDDZGameStatus.Free });
this._recordCountDown(-1);
return true;
};
e.ready = function() {
if (!this.isActive() || this._matchFinished || (this._phase !== "waiting" && !this._roundFinished)) return false;
var player = n.default.myPlayerData();
if (!player) return false;
var data = player.pbData();
data.ready = true;
n.default.updatePlayerData(data);
this._deal();
return true;
};
e._beginChoice = function(pos, phase) {
this._phase = phase;
this._currentPos = pos;
this._recordCountDown(pos);
n.default.gameInfoDDZ.siteInfos.get(pos).jiaoDiZhu(phase === "bid" ? 1 : 4);
if (pos !== n.default.myAbsolutePos()) {
var self = this, token = this._roundToken;
require("./PokerLocalTiming").schedule(this, "ddz", 650, function() {
if (token !== self._roundToken || !self.isActive() || self._phase !== phase || self._currentPos !== pos) return;
var hand = n.default.gameInfoDDZ.siteInfos.get(pos).handCards;
var strength = hand.filter(function(card) { return l.default.value(card) >= 15; }).length;
if (phase === "bid") self._bid(pos, strength >= 2 ? 1 : 0);
else self._double(pos, strength >= 3 ? 2 : 0);
});
}
};
e.bid = function(value) { return this._bid(n.default.myAbsolutePos(), value); };
e._bid = function(pos, value) {
if (!this.isActive() || this._roundFinished || this._phase !== "bid" || this._currentPos !== pos || (value !== 0 && value !== 1)) return false;
var site = n.default.gameInfoDDZ.siteInfos.get(pos);
site.setOtType(value, "call"); site.null();
this._sound().jiaoDiZhu(value, n.default.players.getByPos(pos).gender);
if (value) {
// Qianjiang: the first caller becomes landlord immediately; there is no rob phase.
this._assignLandlord(pos);
return true;
}
this._bidOrder++;
if (this._bidOrder < 3) this._beginChoice((pos + 1) % 3, "bid");
else {
this._roundFinished = true;
this._roundNo--; // An all-pass redeal is not a completed round.
var self = this, token = ++this._roundToken;
a.default.uiHelper.showTip("无人叫地主，重新发牌");
setTimeout(function() { if (token === self._roundToken && self.isActive()) self._deal(); }, 900);
}
return true;
};
e._assignLandlord = function(pos) {
this._landlordPos = pos;
var info = n.default.gameInfoDDZ, player = n.default.players.getByPos(pos), data = player.pbData();
data.deal = true; n.default.updatePlayerData(data);
info.SetLandlordUid(player.uid); info.setBankerUid(player.uid);
var site = info.siteInfos.get(pos);
site.udpateHandCards(site.handCards.concat(this._bottomCards));
info.setBottomCard(this._bottomCards);
if (this._checked(22)) { this._doubleOrder = 0; this._beginChoice((pos + 1) % 3, "double"); }
else this._beginPlay();
};
e.redouble = function(value) { return this._double(n.default.myAbsolutePos(), value); };
e._double = function(pos, value) {
if (!this.isActive() || this._roundFinished || this._phase !== "double" || this._currentPos !== pos || (value !== 0 && value !== 2)) return false;
this._doubles[pos] = value === 2 ? 2 : 1;
var player = n.default.players.getByPos(pos), data = player.pbData();
data.isdouble = value === 2 ? 2 : 1; n.default.updatePlayerData(data);
var site = n.default.gameInfoDDZ.siteInfos.get(pos);
// The UI enum is 2=不加倍, 3=加倍; wire input is 0/2, not 1/2.
site.setOtType(value === 2 ? 3 : 2, "double"); site.null();
this._sound().jiaoDiZhu(value === 2 ? 3 : 2, player.gender);
if (++this._doubleOrder < 3) this._beginChoice((pos + 1) % 3, "double"); else this._beginPlay();
return true;
};
e._beginPlay = function() {
this._phase = "play";
this._setStatus(i.eDDZGameStatus.Gameing);
this._startTurn(this._landlordPos);
};
e.dismiss = function() {
if (!this.isActive()) return;
require("./PokerDealFlow").cancel(this);
this._recordCountDown(-1);
// Invalidate both pending robot turns and the delayed next-round callback before
// resetting RoomInfoData, so they cannot revive or mutate a dismissed room.
this._roundToken = (this._roundToken || 0) + 1;
this._roundFinished = !0;
this._phase = "ended";
this._currentPos = -1;
this._lastPutPos = -1;
this._lastPutCards = [];
this._roomId = 0;
cc.sys.localStorage.removeItem("ddz_local_room");
n.default.leaveRoom(!0);
};
e._clearRound = function(e, t) {
for (var o = 0; o < 3; o++) e.get(o).null();
e.get(t).turn(i.eDDZTurnType.Normal);
};
e._recordCountDown = function(pos) {
for (var p = 0; p < 3; p++) {
var player = n.default.players.getByPos(p);
if (player) player.isTurn = p === pos;
}
var seconds = require("./GameLogicDDZ").default.getInstance().autoGameCountDown({ isChecked: this._checked.bind(this) });
n.default.setCountDown(pos < 0 ? 0 : r.default.second + seconds);
};
e._startTurn = function(e, t) {
void 0 === t && (t = 0);
if (this._roundFinished) return;
this._currentPos = e;
this._recordCountDown(e);
var o = n.default.gameInfoDDZ.siteInfos.get(e);
o && o.turn(i.eDDZTurnType.Normal);
if (0 !== e) {
var r = this, a = this._roundToken;
require("./PokerLocalTiming").schedule(this, "ddz", n.default.gameInfoDDZ.b_isDelay_time ? Math.max(t || 520, 2100) : t || 520, function() {
a === r._roundToken && r._runBotTurn(e);
});
}
};
e._clearTrick = function(e) {
var t = n.default.gameInfoDDZ.siteInfos;
for (var o = 0; o < 3; o++) t.get(o).null();
this._lastPutPos = -1;
this._lastPutCards = [];
this._lastPutType = l.eDDZOneHandType.Error;
this._passCount = 0;
this._startTurn(e, 420);
};
e._advanceAfterPass = function(e) {
this._passCount++;
if (this._passCount >= 2 && this._lastPutPos >= 0) {
this._clearTrick(this._lastPutPos);
return;
}
this._startTurn((e + 1) % 3, 420);
};
e._finishRound = function(e) {
if (this._roundFinished) return;
this._recordCountDown(-1);
this._roundFinished = !0;
this._roundToken++;
this._phase = "ended";
this._currentPos = -1;
var landlord = this._landlordPos, landlordWins = e === landlord;
var spring = landlordWins ? this._playCounts.every(function(count, pos) { return pos === landlord || count === 0; }) : this._playCounts[landlord] === 1;
if (spring) this._setMultiplier(n.default.gameInfoDDZ.betNum * 2);
var unit = this._baseScore * n.default.gameInfoDDZ.betNum;
var deltas = [0, 0, 0];
for (var p = 0; p < 3; p++) if (p !== landlord) {
var amount = unit * this._doubles[landlord] * this._doubles[p];
deltas[p] = landlordWins ? -amount : amount;
deltas[landlord] -= deltas[p];
}
this._lastSettlement = { winner: e, landlord: landlord, spring: spring, deltas: deltas, multiplier: n.default.gameInfoDDZ.betNum };
// Publish the same settlement model/status consumed by the original scene.
// Do not clear the last play or replace the native settlement with a timed redeal.
var endPlayers = [];
for (var t = 0; t < 3; t++) {
var player = n.default.players.getByPos(t), site = n.default.gameInfoDDZ.siteInfos.get(t);
player.updateScore(player.score + deltas[t], deltas[t]);
endPlayers.push({ uid: player.uid, total: player.score, winner_score: deltas[t],
bomb_num: this._bombCounts[t], spring: spring && landlordWins, instead_spring: spring && !landlordWins,
card: { init_card: this._initialHands[t].slice(), hand_card: site.handCards.slice() } });
site.udpateHandCards(site.handCards.slice());
}
require("./DDZSingleEndData").default.getInstance().update({ time: r.default.second, players: endPlayers });
this._setStatus(i.eDDZGameStatus.SingleEnd);
// AnalysisMsgDDZ uses the local remaining hand, including a farmer partner win.
this._sound()[n.default.gameInfoDDZ.siteInfos.get(n.default.myAbsolutePos()).handCards.length > 0 ? "gameLose" : "gameWin"]();
if (this._roundNo >= this._roundLimit) {
this._matchFinished = true;
this._summary();
}
};
e._applyPlay = function(e, t, o, r) {
if (r === l.eDDZOneHandType.SoftBomb || r === l.eDDZOneHandType.HardBomb || r === l.eDDZOneHandType.KINGBOMB)
n.default.gameInfoDDZ.b_isDelay_time = true;
var i = n.default.gameInfoDDZ.siteInfos.get(e);
i.putCard([ r ].concat(t, o), !0);
this._sound().put(r, t, this._lastPutPos < 0, n.default.players.getByPos(e).gender);
this._warningVoice(e, i.handCards.length);
this._lastPutPos = e;
this._lastPutCards = t.concat([]);
this._lastPutType = r;
this._passCount = 0;
this._playCounts[e]++;
if (r === l.eDDZOneHandType.SoftBomb || r === l.eDDZOneHandType.HardBomb || r === l.eDDZOneHandType.KINGBOMB) {
this._bombCounts[e]++;
var info = n.default.gameInfoDDZ, bombs = info.boomNum || 0;
if (!this._checked(21) || bombs < 6) this._setMultiplier(info.betNum * 2);
if (info.updateBoomNum) info.updateBoomNum(bombs + 1); else info.boomNum = bombs + 1;
}
if (0 === i.handCards.length) {
this._finishRound(e);
return;
}
this._startTurn((e + 1) % 3, 520);
};
e._makePlay = function(e, t, o) {
void 0 === t && (t = l.eDDZOneHandType.Error);
void 0 === o && (o = []);
var n = o.length > 0 ? l.default.getMainCardValue(o, t) : 0, r = l.default.oneHandType(e.concat([]), t, n);
if (r === l.eDDZOneHandType.Error) r = l.default.oneHandType(e.concat([]));
if (r === l.eDDZOneHandType.Error) return null;
var i = e.concat([]), a = e.concat([]);
if (l.default.m_arariLaiziReplaceValue && l.default.m_arariLaiziReplaceValue.length > 0) i = l.default.ArrayReplaceLaiziCards(i, 0);
i.sort(function(e, t) {
return e - t;
});
a.sort(function(e, t) {
return e - t;
});
i = l.default.MainAuxiliaryOrder(r, i);
a = l.default.MainAuxiliaryOrder(r, a);
return {
showCards: i,
handCards: a,
type: r
};
};
e._tipResponse = function(e) {
var t = l.default.DDZTip(e, this._lastPutCards, this._lastPutType), o = t && t.tips || [], n = [], r = l.default.getMainCardValue(this._lastPutCards, this._lastPutType);
for (var i = 0; i < o.length; i++) {
var a = o[i], s = [], c = Object.create(null), u = !0;
for (var d = 0; d < a.length; d++) {
var p = a[d];
if (p < 0 || p >= e.length || c[p]) {
u = !1;
break;
}
c[p] = !0;
s.push(e[p]);
}
if (!u || 0 === s.length) continue;
var f = l.default.oneHandType(s.concat([]), this._lastPutType, r), h = l.default.compareToPut(s.concat([]), this._lastPutCards, this._lastPutType);
if (f === l.eDDZOneHandType.Error || !(h > 0)) continue;
var m = f === l.eDDZOneHandType.SoftBomb || f === l.eDDZOneHandType.HardBomb || f === l.eDDZOneHandType.KINGBOMB ? 1 : 0;
n.push({
cards: s,
bomb: m,
main: l.default.getMainCardValue(s, f)
});
}
n.sort(function(e, t) {
return e.bomb - t.bomb || e.main - t.main || e.cards.length - t.cards.length;
});
return n.length > 0 ? n[0].cards : [];
};
e._leadCards = function(e) {
if (l.default.oneHandType(e.concat([])) !== l.eDDZOneHandType.Error) return e.concat([]);
var t = Object.create(null), o = [];
for (var n = 0; n < e.length; n++) {
var r = l.default.value(e[n]);
t[r] || (t[r] = [], o.push(r));
t[r].push(e[n]);
}
o.sort(function(e, t) {
return e - t;
});
var i = [], a = function(e, t) {
if (!e || 0 === e.length) return;
var o = l.default.oneHandType(e.concat([]));
o !== l.eDDZOneHandType.Error && i.push({
cards: e.concat([]),
priority: t,
main: l.default.getMainCardValue(e, o)
});
}, s = [], c = [];
for (n = 3; n <= 14; n++) {
if (t[n] && t[n].length >= 3) s.push(n); else {
if (s.length >= 2) c.push(s.concat([]));
s = [];
}
}
s.length >= 2 && c.push(s.concat([]));
for (n = 0; n < c.length; n++) {
var u = [];
for (var d = 0; d < c[n].length; d++) u = u.concat(t[c[n][d]].slice(0, 3));
a(u, 1);
}
s = [];
c = [];
for (n = 3; n <= 14; n++) {
if (t[n] && t[n].length >= 1) s.push(n); else {
if (s.length >= 5) c.push(s.concat([]));
s = [];
}
}
s.length >= 5 && c.push(s.concat([]));
for (n = 0; n < c.length; n++) {
u = [];
for (d = 0; d < c[n].length; d++) u.push(t[c[n][d]][0]);
a(u, 2);
}
s = [];
c = [];
for (n = 3; n <= 14; n++) {
if (t[n] && t[n].length >= 2) s.push(n); else {
if (s.length >= 3) c.push(s.concat([]));
s = [];
}
}
s.length >= 3 && c.push(s.concat([]));
for (n = 0; n < c.length; n++) {
u = [];
for (d = 0; d < c[n].length; d++) u = u.concat(t[c[n][d]].slice(0, 2));
a(u, 3);
}
var p = o.filter(function(e) {
return t[e].length >= 3 && e <= 15;
}), f = o.filter(function(e) {
return t[e].length >= 2 && e <= 15;
}), h = o.filter(function(e) {
return t[e].length < 4;
});
for (n = 0; n < p.length; n++) {
var m = p[n], y = f.filter(function(e) {
return e !== m;
})[0], g = h.filter(function(e) {
return e !== m;
})[0];
void 0 !== y && a(t[m].slice(0, 3).concat(t[y].slice(0, 2)), 4);
void 0 !== g && a(t[m].slice(0, 3).concat(t[g].slice(0, 1)), 5);
a(t[m].slice(0, 3), 6);
}
for (n = 0; n < f.length; n++) t[f[n]].length < 4 && a(t[f[n]].slice(0, 2), 7);
for (n = 0; n < o.length; n++) t[o[n]].length < 4 && a([ t[o[n]][0] ], 8);
if (0 === i.length) a([ e[e.length - 1] ], 9);
i.sort(function(e, t) {
return e.priority - t.priority || t.cards.length - e.cards.length || e.main - t.main;
});
return i.length > 0 ? i[0].cards : [ e[e.length - 1] ];
};
e._runBotTurn = function(e) {
if (!this.isActive() || this._roundFinished || this._phase !== "play" || this._currentPos !== e || 0 === e) return;
var t = n.default.gameInfoDDZ.siteInfos.get(e), o = [], r = this._lastPutPos < 0;
if (r) o = this._leadCards(t.handCards); else {
o = this._tipResponse(t.handCards);
if (e !== this._landlordPos && this._lastPutPos !== this._landlordPos && o.length !== t.handCards.length) o = [];
}
if (0 === o.length) {
t.pass();
this._sound().pass(n.default.players.getByPos(e).gender);
this._advanceAfterPass(e);
return;
}
var i = this._makePlay(o, r ? l.eDDZOneHandType.Error : this._lastPutType, r ? [] : this._lastPutCards);
if (!i) {
t.pass();
this._sound().pass(n.default.players.getByPos(e).gender);
this._advanceAfterPass(e);
return;
}
this._applyPlay(e, i.showCards, i.handCards, i.type);
};
e.putCard = function(e, t, o) {
if (!this.isActive()) return !1;
var r = n.default.myAbsolutePos();
if (this._roundFinished || this._phase !== "play" || this._currentPos !== r) return !1;
if (!Array.isArray(e) || !Array.isArray(t) || !t.length || e.length !== t.length) return false;
var remaining = n.default.gameInfoDDZ.siteInfos.get(r).handCards.slice();
for (var idx = 0; idx < t.length; idx++) {
var at = remaining.indexOf(t[idx]);
if (at < 0) return false;
remaining.splice(at, 1);
}
// Only the supported natural-card mode is admitted at room creation. Do not
// trust the UI-supplied type or displayed cards, even when they look plausible.
if (e.slice().sort(function(a,b){return a-b;}).join() !== t.slice().sort(function(a,b){return a-b;}).join()) return false;
var play = this._makePlay(t, this._lastPutType, this._lastPutCards);
if (!play || play.type !== o) return false;
if (!this._checked(16) && [l.eDDZOneHandType.ThreeTwo, l.eDDZOneHandType.FeiJiTwo, l.eDDZOneHandType.FourTwo].indexOf(o) >= 0) return false;
if (this._lastPutPos >= 0 && !(l.default.compareToPut(t.slice(), this._lastPutCards, this._lastPutType) > 0)) return false;
this._applyPlay(r, play.showCards, play.handCards, play.type);
return !0;
};
e.pass = function() {
if (!this.isActive()) return !1;
var e = n.default.myAbsolutePos(), t = n.default.gameInfoDDZ.siteInfos;
if (this._roundFinished || this._phase !== "play" || this._currentPos !== e || this._lastPutPos < 0) return !1;
t.get(e).pass();
this._sound().pass(n.default.players.getByPos(e).gender);
this._advanceAfterPass(e);
return !0;
};
return e;
}();
o.default = s;
cc._RF.pop();
