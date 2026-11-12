// Local room adapter for the GuanDan client restored from the original
// Qianjiang r234 package.  The original client module is complete, but the
// historical server implementation is not part of this repository.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7d6acN9CZpMmL8qYKhGxk2S", "GDStandalone");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./RoomInfoData"), r = require("./UserData"), i = require("./GDEnum"), a = require("./gContext"), s = require("./GDEventKeys"), rules = require("./GDCardUtils"), l = function() {
function e() {}
e._sound = function() { return require("./GameSoundGD").default.getInstance(); };
e._warningVoice = function(pos, count) {
if (count !== 1 && count !== 2) return;
var self = this, token = this._roundToken;
setTimeout(function() {
if (token !== self._roundToken || !self.isActive() || self._roundFinished) return;
if (n.default.gameInfoGD.siteInfos.get(pos).handCards.length !== count) return;
self._sound().warningOnly(n.default.players.getByPos(pos).gender, count);
}, 500);
};
e._checked = function(id) { return !!(n.default.config && n.default.config.isChecked && n.default.config.isChecked(id)); };
e._recordCountDown = function(pos) {
// Match AnalysisMsgBase.recordCountDown, before publishing the turn event so
// mounted clocks see the new deadline immediately (not the previous turn's 0).
for (var p = 0; p < 4; p++) {
var player = n.default.players.getByPos(p);
if (player) player.isTurn = p === pos;
}
var seconds = require("./GameLogicGD").default.getInstance().autoGameCountDown({ isChecked: this._checked.bind(this) });
n.default.setCountDown(pos < 0 ? 0 : r.default.second + seconds);
};
e._status = function(status) {
var info = n.default.gameInfoGD;
if (info.updateStatus) info.updateStatus(status); else info.status = status;
};
e._summary = function() {
var players = [];
for (var pos = 0; pos < 4; pos++) {
var player = n.default.players.getByPos(pos);
players.push({ uid: player.uid, score: player.score, winer: player.score > 0, details: [] });
}
n.default.setTotalEndData(new (require("./TotalEndData").default)({ time: r.default.second, isNormalEnd: true, players: players }));
a.default.eventUtils.emit(require("./EventKeys").default.data_game_total_end);
};
e.isActive = function() {
return "1" === cc.sys.localStorage.getItem("gd_local_room") &&
!!this._roomId && this._roomId === n.default.roomId && !n.default.isPlayback();
};
e._deck = function() {
for (var e = [], t = 0; t < 2; t++) {
for (var o = 1; o <= 13; o++) for (var n = 1; n <= 4; n++) e.push(10 * o + n);
e.push(170, 180);
}
for (t = e.length - 1; t > 0; t--) {
var r = Math.floor(Math.random() * (t + 1)), i = e[t];
e[t] = e[r];
e[r] = i;
}
return e;
};
e._deal = function() {
if (this._matchFinished) return false;
if (this._roundNo >= this._roundLimit) { this._matchFinished = true; this._summary(); return false; }
this._roundToken = (this._roundToken || 0) + 1;
this._roundFinished = !1;
this._roundNo = (this._roundNo || 0) + 1;
this._finished = [];
this._lastPutPos = -1;
this._lastPutCards = [];
this._lastPutType = 0;
this._passed = [];
this._phase = "dealing";
this._currentPos = -1;
this._recordCountDown(-1);
// Reset layout caches before publishing cards; the native deal animation runs
// once the scene is ready, before tribute/play and its countdown may begin.
var previousInfo = n.default.gameInfoGD;
if (previousInfo) {
previousInfo.is_shuCard = !1;
previousInfo.lipaiBtnStuas = !1;
previousInfo.lipaiHandCards = [];
previousInfo.lipaiHandCardsAry = [];
}
var e = this._deck(), t = [], level = this._levels[this._levelTeam];
var levelCard = (level === 14 ? 1 : level) * 10;
for (var seatPos = 0; seatPos < 4; seatPos++) {
var readyPlayer = n.default.players.getByPos(seatPos);
if (readyPlayer && readyPlayer.pbData) {
var playerData = readyPlayer.pbData(); playerData.ready = false;
n.default.updatePlayerData(playerData);
}
}
for (var o = 0; o < 4; o++) t.push(e.slice(27 * o, 27 * (o + 1)));
this._initialHands = t.map(function(cards) { return cards.slice(); });
n.default.updateGameData({
curStep: this._roundNo,
status: i.eGDGameStatus.Gameing,
siteInfos: [ {
pos: 0,
handCards: t[0],
card_step_out: 0
}, {
pos: 1,
handCards: t[1],
card_step_out: 0
}, {
pos: 2,
handCards: t[2],
card_step_out: 0
}, {
pos: 3,
handCards: t[3],
card_step_out: 0
} ],
betNum: 1,
boomNum: 0,
bottomCard: levelCard,
friendCard: 0
});
n.default.gameInfoGD.setBottomCard(levelCard);
n.default.gameInfoGD.setSelfOtheCard((this._levels[0] === 14 ? 1 : this._levels[0]) * 10, (this._levels[1] === 14 ? 1 : this._levels[1]) * 10);
n.default.gameInfoGD.GongPaiStaus = 0;
n.default.gameInfoGD.gongPaiArray = [];
n.default.gameInfoGD.boomUid = 0;
n.default.gameInfoGD.b_isDelay_time = false;
var self = this;
require("./PokerDealFlow").begin(this, function() {
self._phase = "play";
if (self._previousRanks) self._prepareTribute(); else self._startTurn(0);
});
};
e.start = function(e) {
if (e && e.isChecked && (e.isChecked(5) || e.isChecked(6))) {
a.default.uiHelper.showTip("本地测试暂支持四人经典玩法；团团转和二人玩法尚未接入");
return false;
}
cc.sys.localStorage.setItem("gd_local_room", "1");
n.default.reset();
n.default.config = e;
n.default.roomId = 100000 + Math.floor(9e5 * Math.random());
this._roomId = n.default.roomId;
this._roundNo = 0;
this._matchFinished = false;
this._roundFinished = false;
this._phase = "waiting";
this._currentPos = -1;
this._roundToken = (this._roundToken || 0) + 1;
require("./PokerDealFlow").cancel(this);
this._levels = [2, 2];
this._levelTeam = 0;
this._previousRanks = null;
this._roundLimit = e && e.gameCount ? Number(e.gameCount()) : 12;
if (!(this._roundLimit > 0)) this._roundLimit = 12;
this._baseScore = e && e.getValue ? Number(e.getValue(15)) : 1;
if (!(this._baseScore > 0)) this._baseScore = 1;
n.default.roomCode = String(n.default.roomId);
n.default.owner = Number(r.default.uid) || 1;
// Original GD uses tenths of a displayed point in player/settlement messages.
// The table divides by 10; generic settlement UI uses this room ratio.
n.default.scoreRatio = 10;
n.default.belongClub = 0;
var t = Number(r.default.uid) || 1;
n.default.updatePlayerData([ {
uid: t,
headImg: r.default.headUrl,
name: r.default.nickname || "我",
ip: "127.0.0.1",
pos: 0,
score: 0,
gender: r.default.sex || 1,
onLine: !0,
ready: !1
}, {
uid: t + 101,
name: "机器人小江",
pos: 1,
score: 0,
gender: 1,
onLine: !0,
ready: !0
}, {
uid: t + 102,
name: "机器人小湖",
pos: 2,
score: 0,
gender: 2,
onLine: !0,
ready: !0
}, {
uid: t + 103,
name: "机器人小清",
pos: 3,
score: 0,
gender: 1,
onLine: !0,
ready: !0
} ]);
// Keep the native Ready button visible until the human player confirms.
n.default.updateGameData({ curStep: 0, status: i.eGDGameStatus.Free, bottomCard: 20, friendCard: 0 });
n.default.gameInfoGD.setSelfOtheCard(20, 20);
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
this._deal(); return true;
};
// Classic four-seat upgrade/tribute uses the original client's card coding,
// gongpai status, selection widgets and supplycard callback. No network calls.
e._tributeValue = function(card) {
var rank = Math.floor(card / 10), level = n.default.gameInfoGD.bottomCard / 10;
if (rank === level && card % 10 === 3) return -1;
return card >= 170 ? card : rank === level ? 160 : rank === 1 ? 140 : rank * 10;
};
e._tributeOptions = function(pos, returning) {
var self = this, hand = n.default.gameInfoGD.siteInfos.get(pos).handCards;
if (returning) {
var low = hand.filter(function(card) {
var rank = Math.floor(card / 10);
return rank >= 2 && rank <= 10 && rank !== n.default.gameInfoGD.bottomCard / 10;
});
// Rare no-low-card hands: expose the lowest non-wildcard as an explicit local
// fallback instead of creating an impossible, permanently blocked return turn.
if (low.length) return low;
var usable = hand.filter(function(card) { return self._tributeValue(card) >= 0; });
var min = Math.min.apply(Math, usable.map(function(card) { return self._tributeValue(card); }));
return usable.filter(function(card) { return self._tributeValue(card) === min; });
}
var maximum = Math.max.apply(Math, hand.map(function(card) { return self._tributeValue(card); }));
return hand.filter(function(card) { return self._tributeValue(card) === maximum; });
};
e._prepareTribute = function() {
var ranks = this._previousRanks, self = this;
var doubleDown = ranks[0] % 2 === ranks[1] % 2;
var donors = doubleDown ? ranks.slice(2) : [ranks[3]];
var bigJokers = donors.reduce(function(sum, pos) { return sum + n.default.gameInfoGD.siteInfos.get(pos).handCards.filter(function(c) { return c === 180; }).length; }, 0);
if (bigJokers === 2) {
a.default.eventUtils.emit(s.default.kanggong_anim_play);
this._startTurn(ranks[0]); return;
}
donors.sort(function(x, y) { return self._tributeValue(self._tributeOptions(y, false)[0]) - self._tributeValue(self._tributeOptions(x, false)[0]); });
this._tributePairs = donors.map(function(pos, index) { return { from: pos, to: ranks[index] }; });
this._tributeTasks = this._tributePairs.map(function(pair) { return { pos: pair.from, to: pair.to, returning: false, pair: pair }; });
this._tributeTasks = this._tributeTasks.concat(this._tributePairs.map(function(pair) { return { pos: pair.to, to: pair.from, returning: true, pair: pair }; }));
this._tributeLeader = donors[0];
this._nextTribute();
};
e._nextTribute = function() {
var info = n.default.gameInfoGD;
if (!this._tributeTasks.length) {
info.GongPaiStaus = 0;
info.curGongPaiUid = 0;
this._phase = "play";
for (var p = 0; p < 4; p++) info.siteInfos.get(p).null();
this._status(i.eGDGameStatus.Gameing);
// Refresh after the status change so tribute-only disabled card states clear.
info.siteInfos.get(n.default.myAbsolutePos()).udpateHandCards(info.siteInfos.get(n.default.myAbsolutePos()).handCards.slice());
this._startTurn(this._tributeLeader); return;
}
var task = this._tributeTasks[0], pos = task.pos;
this._phase = "tribute";
this._currentPos = pos;
info.GongPaiStaus = task.returning ? 2 : 1;
info.curGongPaiUid = n.default.players.getByPos(pos).uid;
info.GongPaiMax = this._tributeOptions(pos, task.returning)[0];
this._status(i.eGDGameStatus.gongpai);
this._recordCountDown(pos);
info.siteInfos.get(pos).turnGongPai(i.eGDTurnType.Normal);
a.default.eventUtils.emit(s.default.data_status_gongpai, { pos: pos });
if (pos !== n.default.myAbsolutePos()) {
var self = this, token = this._roundToken;
setTimeout(function() {
if (token === self._roundToken && self.isActive() && self._phase === "tribute" && self._currentPos === pos) self._supply(pos, self._tributeOptions(pos, task.returning)[0]);
}, 800);
}
};
e.supply = function(card) { return this._supply(n.default.myAbsolutePos(), card); };
e._supply = function(pos, card) {
if (!this.isActive() || this._roundFinished || this._phase !== "tribute" || this._currentPos !== pos) return false;
var task = this._tributeTasks[0];
if (!task || this._tributeOptions(pos, task.returning).indexOf(card) < 0) return false;
var info = n.default.gameInfoGD, from = info.siteInfos.get(pos), to = info.siteInfos.get(task.to);
from.gongCard([card]);
if (!task.returning) task.pair.card = card;
else {
// Hold tribute off-hand until the exchange is complete, as the native
// supplycard/exchangecard flow does (never publish an oversized 28-card hand).
from.udpateHandCards(from.handCards.concat([task.pair.card]));
to.udpateHandCards(to.handCards.concat([card]));
task.pair.card = null;
}
this._tributeTasks.shift();
this._nextTribute();
return true;
};
e.dismiss = function() {
if (!this.isActive()) return;
require("./PokerDealFlow").cancel(this);
this._recordCountDown(-1);
this._roundToken++;
this._roundFinished = !0;
this._currentPos = -1;
this._roomId = 0;
cc.sys.localStorage.removeItem("gd_local_room");
n.default.leaveRoom(!0);
};
e._startTurn = function(pos) {
if (!this.isActive() || this._roundFinished || this._phase !== "play") return;
this._currentPos = pos;
this._recordCountDown(pos);
n.default.gameInfoGD.siteInfos.get(pos).turn(i.eGDTurnType.Normal);
if (pos !== n.default.myAbsolutePos()) {
var self = this, token = this._roundToken;
require("./PokerLocalTiming").schedule(this, "gd", n.default.gameInfoGD.b_isDelay_time ? 2100 : 800, function() {
if (token === self._roundToken && self.isActive()) self._runBotTurn(pos);
});
}
};
e._nextActive = function(pos) {
for (var j = 1; j <= 4; j++) {
var next = (pos + j) % 4;
if (this._finished.indexOf(next) < 0) return next;
}
return -1;
};
e._advance = function(pos) {
var activeOthers = [];
for (var j = 0; j < 4; j++) if (j !== this._lastPutPos && this._finished.indexOf(j) < 0) activeOthers.push(j);
var self = this;
if (this._lastPutPos >= 0 && activeOthers.every(function(p) { return self._passed.indexOf(p) >= 0; })) {
var leader = this._lastPutPos;
// If the winner of this trick is out, their partner gets the lead (接风).
if (this._finished.indexOf(leader) >= 0) {
var partner = (leader + 2) % 4;
leader = this._finished.indexOf(partner) < 0 ? partner : this._nextActive(leader);
}
for (j = 0; j < 4; j++) n.default.gameInfoGD.siteInfos.get(j).null();
this._lastPutPos = -1;
this._lastPutCards = [];
this._lastPutType = 0;
this._passed = [];
this._startTurn(leader);
} else this._startTurn(this._nextActive(pos));
};
e._finishRound = function() {
if (this._roundFinished) return;
this._recordCountDown(-1);
this._roundFinished = !0;
this._roundToken++;
this._currentPos = -1;
this._phase = "ended";
var team = this._finished[0] % 2, partner = (this._finished[0] + 2) % 4;
var points = 5 - (this._finished.indexOf(partner) + 1);
var upgrade = points === 3 && this._checked(54) ? 4 : points;
this._levels[team] = Math.min(14, this._levels[team] + upgrade);
this._levelTeam = team;
this._previousRanks = this._finished.slice();
var unit = this._baseScore * (n.default.gameInfoGD.betNum || 1);
var endPlayers = [], info = n.default.gameInfoGD;
var doubleDown = this._finished[0] % 2 === this._finished[1] % 2;
for (var pos = 0; pos < 4; pos++) {
var player = n.default.players.getByPos(pos), score = (pos % 2 === team ? points : -points) * unit * n.default.scoreRatio;
if (player) player.updateScore(player.score + score, score);
var site = info.siteInfos.get(pos), rank = this._finished.indexOf(pos) + 1;
// In a double-down finish the losing seats have not gone out (rank 0).
if (doubleDown && pos % 2 !== team) rank = 0;
endPlayers.push({ uid: player.uid, total: player.score, card_score: score, winner_score: score,
card_step_out: rank, card: { init_card: this._initialHands[pos].slice(), hand_card: site.handCards.slice() } });
site.udpateHandCards(site.handCards.slice());
site.udpateEndScore(score);
site.updateRank(rank, false);
}
this._lastSettlement = { ranks: this._finished.slice(), team: team, points: points, upgrade: upgrade, unit: unit };
require("./GDSingleEndData").default.getInstance().update({ time: r.default.second, players: endPlayers });
info.endShuangShang = doubleDown;
a.default.eventUtils.emit(s.default.end_shuangshang);
this._status(i.eGDGameStatus.SingleEnd);
this._sound()[n.default.myAbsolutePos() % 2 === team ? "gameWin" : "gameLose"]();
info.boomUid = 0;
if (this._roundNo >= this._roundLimit) { this._matchFinished = true; this._summary(); }
};
e._applyPlay = function(pos, play) {
var sites = n.default.gameInfoGD.siteInfos, site = sites.get(pos);
if (play.type >= rules.eGDOneHandType.SiBomb) n.default.gameInfoGD.b_isDelay_time = true;
sites.setLastPut(pos);
site.putCard([play.type].concat(play.showCards, play.handCards), !0);
this._sound().put(play.type, play.showCards, this._lastPutPos < 0, n.default.players.getByPos(pos).gender);
this._warningVoice(pos, site.handCards.length);
this._lastPutPos = pos;
this._lastPutCards = play.showCards.slice();
this._lastPutType = play.type;
this._passed = [];
// Mirror AnalysisMsgGD: once the first player is out, only their partner's
// qualifying bombs contribute to the multiplier.
if (!this._finished.length || pos === (this._finished[0] + 2) % 4) {
var kind = play.type, types = rules.eGDOneHandType;
var doubles = this._checked(25) ? kind >= types.WuBomb : this._checked(26) ? (kind >= types.TongHuaShun || kind === types.LiuBomb) : this._checked(27) ? (kind >= types.LiuBomb && kind !== types.TongHuaShun) : false;
if (doubles) {
var info = n.default.gameInfoGD, next = (info.betNum || 1) * 2;
if (info.updateBetNum) info.updateBetNum(next); else info.betNum = next;
}
}
if (!site.handCards.length) {
this._finished.push(pos);
site.updateRank(this._finished.length, !0);
if (this._finished.length === 2 && this._finished[0] % 2 === this._finished[1] % 2) {
for (var p = 0; p < 4; p++) if (this._finished.indexOf(p) < 0) {
// Keep an internal order for the next tribute, but neither loser has gone
// out: the original double-down presentation must not announce rank 3/4.
this._finished.push(p);
}
this._finishRound(); return;
}
if (this._finished.length === 3) {
var last = this._nextActive(pos);
this._finished.push(last);
sites.get(last).updateRank(4, !0);
this._finishRound();
return;
}
}
this._advance(pos);
};
e._makePlay = function(cards, preferredShown, preferredType) {
var util = rules.default, previous = this._lastPutCards || [], lastType = this._lastPutType || 0;
if (previous.length && !(util.compareToPut(cards.slice(), previous, lastType) > 0)) return null;
var type = util.oneHandType(cards.slice(), lastType, previous.length ? util.getMainCardValue(previous, lastType) : 0);
if (!type) return null;
var variants = [], choices = Math.max(1, util.m_arariLaiziReplaceValue.length);
function suited(shown, kind) {
if (kind === rules.eGDOneHandType.TongHuaShun) {
var natural = shown.filter(function(card) { return card % 10 !== 0; });
var suit = natural.length ? natural[0] % 10 : 1;
shown = shown.map(function(card) { return card % 10 === 0 ? card + suit : card; });
}
return shown;
}
function key(cards) { return cards.slice().sort(function(a,b) { return a-b; }).join(","); }
for (var k = 0; k < choices; k++) {
var shown = cards.slice(), kind = util.m_ariChooseType[k] || type;
if (util.m_arariLaiziReplaceValue.length) shown = util.ArrayReplaceLaiziCards(shown, k);
shown.sort(function(a, b) { return a - b; });
shown = suited(util.MainAuxiliaryOrder(kind, shown), kind);
variants.push({ handCards: cards.slice(), showCards: shown, type: kind });
}
for (k = 0; k < variants.length; k++) {
var play = variants[k];
if (preferredShown && (play.type !== preferredType || key(play.showCards) !== key(suited(preferredShown.slice(), preferredType)))) continue;
// Multiple wildcard interpretations can differ in strength; validate the actual
// displayed interpretation and preserve the player's choice from the chooser.
if (!previous.length || util.compareToPut(play.showCards.slice(), previous, lastType) > 0) return play;
}
return null;
};
// Generate candidates from the robot's OWN cards. The recovered GDTip helper
// reads myAbsolutePos() internally and therefore cannot be used for other seats.
e._candidates = function(hand) {
var util = rules.default, groups = {}, wild = [], result = [], seen = {};
hand.forEach(function(card) {
if (util.isLaizi(card)) wild.push(card);
else { var rank = util.value(card); (groups[rank] || (groups[rank] = [])).push(card); }
});
function add(cards) {
if (!cards.length) return;
var key = cards.slice().sort(function(a,b) { return a-b; }).join(",");
if (!seen[key]) { seen[key] = !0; result.push(cards); }
}
function build(needs, suit) {
var cards = [], usedWild = 0;
for (var j = 0; j < needs.length; j++) {
var rank = needs[j][0] === 1 ? 14 : needs[j][0], count = needs[j][1];
var group = (groups[rank] || []).filter(function(card) { return !suit || card % 10 === suit; });
var take = Math.min(count, group.length), missing = count - take;
if (missing && (rank >= 170 || usedWild + missing > wild.length)) return;
cards = cards.concat(group.slice(0, take), wild.slice(usedWild, usedWild + missing));
usedWild += missing;
}
add(cards);
}
hand.forEach(function(card) { add([card]); });
for (var rank = 2; rank <= 14; rank++) {
for (var count = 2; count <= 10; count++) build([[rank, count]]);
for (var pair = 2; pair <= 14; pair++) if (pair !== rank) build([[rank, 3], [pair, 2]]);
build([[rank, 3], [170, 2]]);
build([[rank, 3], [180, 2]]);
}
build([[170, 2]]); build([[180, 2]]); build([[170, 2], [180, 2]]);
// Five-card straights, three consecutive pairs, two consecutive triples.
[[5,1], [3,2], [2,3]].forEach(function(spec) {
for (var low = 1; low <= 15 - spec[0]; low++) {
var needs = [];
for (var k = 0; k < spec[0]; k++) needs.push([low + k, spec[1]]);
build(needs);
if (spec[1] === 1) for (var suit = 1; suit <= 4; suit++) build(needs, suit);
}
});
add(hand.slice());
return result;
};
e._choosePlay = function(hand) {
var self = this, util = rules.default, plays = [];
this._candidates(hand).forEach(function(cards) {
var play = self._makePlay(cards);
if (play) plays.push(play);
});
function strength(play) {
var rank = util.getMainCardValue(play.showCards, play.type);
return rank === n.default.gameInfoGD.m_iLaiziValue ? 160 : rank;
}
plays.sort(function(a, b) {
// Finish if possible; otherwise conserve bombs and use the weakest valid reply.
var finish = Number(b.handCards.length === hand.length) - Number(a.handCards.length === hand.length);
var bomb = Number(a.type >= 13) - Number(b.type >= 13);
return finish || bomb || (self._lastPutPos < 0 ? b.handCards.length - a.handCards.length : 0) || a.type - b.type || strength(a) - strength(b);
});
return plays[0] || null;
};
e._runBotTurn = function(pos) {
if (!this.isActive() || this._roundFinished || this._phase !== "play" || this._currentPos !== pos) return;
var site = n.default.gameInfoGD.siteInfos.get(pos), play = this._choosePlay(site.handCards);
// Do not overtake a teammate unless this play goes out.
if (play && this._lastPutPos >= 0 && this._lastPutPos % 2 === pos % 2 && play.handCards.length !== site.handCards.length) play = null;
if (play) this._applyPlay(pos, play);
else {
site.pass();
this._sound().pass(n.default.players.getByPos(pos).gender);
this._passed.push(pos);
this._advance(pos);
}
};
e.putCard = function(shown, cards, type) {
if (!this.isActive() || this._roundFinished || this._phase !== "play") return !1;
if (!Array.isArray(cards) || !cards.length || !Array.isArray(shown) || shown.length !== cards.length) return false;
var pos = n.default.myAbsolutePos();
if (this._currentPos !== pos) return !1;
var hand = n.default.gameInfoGD.siteInfos.get(pos).handCards.slice();
for (var j = 0; j < cards.length; j++) {
var index = hand.indexOf(cards[j]);
if (index < 0) return !1;
hand.splice(index, 1);
}
var play = this._makePlay(cards, shown, type);
if (!play) return !1;
this._applyPlay(pos, play);
return !0;
};
e.pass = function() {
if (!this.isActive() || this._roundFinished || this._phase !== "play" || this._lastPutPos < 0) return !1;
var pos = n.default.myAbsolutePos();
if (this._currentPos !== pos) return !1;
n.default.gameInfoGD.siteInfos.get(pos).pass();
this._sound().pass(n.default.players.getByPos(pos).gender);
this._passed.push(pos);
this._advance(pos);
return !0;
};
return e;
}();
o.default = l;
cc._RF.pop();
