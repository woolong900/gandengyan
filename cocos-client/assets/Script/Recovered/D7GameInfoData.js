// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d439d+ZKKpNQ4HhGHQZQf9g", "D7GameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r, i = require("./D7SiteListData"), a = require("./D7Enum"), s = require("./D7SiteCellData"), l = require("./gContext"), c = require("./D7EventKeys"), u = require("./RoomInfoData"), d = require("./D7CardUtils"), p = require("./CommonUtils"), f = require("./EventKeys"), h = function() {
function e() {
this.curStep = 0;
this.curOpUid = 0;
this.siteInfos = null;
this.status = a.eD7GameStatus.Free;
this.zhuangUid = 0;
this.friendUid = 0;
this.friendCard = 0;
this.mainCard = 0;
this.putRemainCards = [];
this.getRemainInfo = {
uid: 0
};
this.giveUpUid = 0;
this._waitingJiaoTime = 0;
this._roundData = new m();
this._lastRoundData = new m();
this.isRound = !1;
this.siteInfos = new i.default();
for (var e = 0; e < 5; e++) {
var t = new s.default(e);
this.siteInfos.upate(t);
}
}
e.prototype.update = function(e) {
this.upadteMainCard(e.mainCard || 0);
this.updateStatus(e.status || a.eD7GameStatus.Free);
for (var t = e.siteInfos || [], o = [], n = 0, r = t.length; n < r; n++) {
var i = t[n], s = i.pos;
this.siteInfos.get(s).update(i, this.mainCard);
o.push(i.handCards.length);
}
this.putRemainCards = e.putRemainCards;
this.updateStep(e.curStep || 0);
this.updateZhuang(e.zhuangUid || 0);
this.updateFriend(e.friendUid || 0);
this.updateFriendCard(e.friendCard || 0);
this.updateGiveUp(e.giveUpUid || 0);
this.updateCurOpUid(e.curOpUid || 0);
this._roundData = new m();
this._lastRoundData = new m();
!o.some(function(e, t) {
return e !== o[0];
}) && (this.isRound = !0);
};
e.prototype.updateRound = function(e) {
this.isRound = e;
};
e.prototype.updateWaitingJiaoTime = function(e) {
if (this._waitingJiaoTime !== e) {
this._waitingJiaoTime = e;
l.default.eventUtils.emit(c.default.data_wating_jiao_time_change);
}
};
e.prototype.waitingJiaoEndTime = function() {
return 1e3 * this._waitingJiaoTime;
};
e.prototype.updateCurOpUid = function(e) {
this.curOpUid = e;
};
e.prototype.updateStep = function(e) {
if (this.curStep !== e) {
this.curStep = e;
l.default.eventUtils.emit(c.default.data_step_change);
}
};
e.prototype.updateZhuang = function(e) {
if (this.zhuangUid !== e) {
this.zhuangUid = e;
l.default.eventUtils.emit(c.default.data_zhuang_change);
}
};
e.prototype.updateFriend = function(e, t) {
void 0 === t && (t = !1);
if (this.friendUid !== e) {
this.friendUid = e;
l.default.eventUtils.emit(c.default.data_firend_change);
}
t && l.default.eventUtils.emit(c.default.ui_show_firend);
};
e.prototype.updateFriendCard = function(e) {
if (this.friendCard !== e) {
this.friendCard = e;
l.default.eventUtils.emit(c.default.data_firend_card_change);
}
};
e.prototype.upadteMainCard = function(e) {
if (this.mainCard !== e) {
this.mainCard = e;
for (var t = u.default.config.peopleCount(), o = 0; o < t; o++) {
this.siteInfos.get(o).reorderHand(this.mainCard);
}
l.default.eventUtils.emit(c.default.data_main_card_change);
}
};
e.prototype.updateStatus = function(e) {
var t = this.status, o = e;
if (t !== o) {
this.status = e;
l.default.eventUtils.emit(c.default.data_status_change, {
o: t,
n: o
});
}
t === a.eD7GameStatus.Free && o === a.eD7GameStatus.Sending && l.default.eventUtils.emit(f.default.pulic_game_free2begin);
};
e.prototype.updateGiveUp = function(e) {
if (this.giveUpUid !== e) {
this.giveUpUid = e;
this.giveUpUid > 0 && this._roundData.clean();
l.default.eventUtils.emit(c.default.data_give_up_change);
}
};
e.prototype.roundFanData = function() {
if (this._roundData.type === n.Fan) {
var e = this._roundData.actions[0];
if (e && e.state === r.OK && e.cards.length > 0) return {
pos: e.pos,
card: e.cards[0]
};
}
return null;
};
e.prototype.roundData = function() {
return this._roundData;
};
e.prototype.lastRoundData = function() {
return this._lastRoundData;
};
e.prototype.handCards = function(e, t) {
void 0 === t && (t = !0);
if (t && this.giveUpUid > 0) return [];
var o = u.default.gameInfoD7.siteInfos.get(e);
if (!o) return [];
var n = o.handCards, r = u.default.gameInfoD7.getRemainInfo.uid;
if (r > 0 && u.default.players.getByUid(r).pos === e) {
var i;
i = u.default.gameInfoD7.getRemainInfo.cards;
var a = n.concat(i);
return d.default.sortDesc(a, this.mainCard);
}
return [].concat(n);
};
e.prototype.jiaoOK = function(e, t) {
this.updateWaitingJiaoTime(0);
this.updateZhuang(e);
if (t > 0) {
this.updateFriendCard(t);
this.upadteMainCard(t);
}
var o = u.default.players.getByUid(e).pos;
this._roundData.jiaoOK(o, t);
};
e.prototype.jiaoGuo = function(e) {
this.updateWaitingJiaoTime(0);
var t = u.default.players.getByUid(e).pos;
this._roundData.jiaoGuo(t);
};
e.prototype.jiaoTurn = function(e, t) {
this.updateWaitingJiaoTime(0);
var o = u.default.players.getByUid(e).pos;
this._roundData.jiaoTurn(o, t);
};
e.prototype.deal = function(e) {
if (this.status !== a.eD7GameStatus.Sending) {
var t = {
curStep: this.curStep + 1,
curOpUid: this.curOpUid,
status: a.eD7GameStatus.Sending,
zhuangUid: 0,
friendUid: 0,
friendCard: 0,
mainCard: 0,
putRemainCards: [],
giveUpUid: 0,
siteInfos: [ {
pos: 0,
handCards: [],
scoreCards: []
}, {
pos: 1,
handCards: [],
scoreCards: []
}, {
pos: 2,
handCards: [],
scoreCards: []
}, {
pos: 3,
handCards: [],
scoreCards: []
}, {
pos: 4,
handCards: [],
scoreCards: []
} ]
};
this.update(t);
}
var o = u.default.myAbsolutePos();
u.default.gameInfoD7.siteInfos.get(o).pushHand([ e ], this.mainCard);
};
e.prototype.fanOK = function(e, t) {
var o = u.default.players.getByUid(e).pos;
this.upadteMainCard(t);
this._roundData.fanOK(o, t);
};
e.prototype.fanGuo = function(e) {
var t = u.default.players.getByUid(e).pos;
this._roundData.fanGuo(t);
};
e.prototype.fanTurn = function(e, t) {
var o = u.default.players.getByUid(e).pos;
this._roundData.fanTurn(o, t);
};
e.prototype.putCard = function(e, t, o) {
void 0 === o && (o = !0);
var n = u.default.players.getByUid(e).pos;
o && this.siteInfos.get(n).removeHand(t);
this._roundData.putCard(n, t);
};
e.prototype.putTurn = function(e, t) {
var o = u.default.players.getByUid(e).pos;
if (this._roundData.type === n.Put) {
if (this._roundData.okCount() === u.default.config.peopleCount()) {
this._lastRoundData = this._roundData;
this._roundData = new m();
}
}
this.isRound ? this._roundData.type = 0 : this._roundData.type = 3;
this._roundData.putTurn(o, t);
};
e.prototype.getRemain = function(e, t, o) {
this.getRemainInfo = {
uid: e,
cards: t || [],
friendCard: o
};
var n = u.default.players.getByUid(e);
l.default.eventUtils.emit(c.default.data_get_remain, {
pos: n.pos,
cards: t
});
};
e.prototype.putRemain = function(e, t) {
var o = u.default.players.getByUid(e);
t = t || [];
var n = this.handCards(o.pos);
this.getRemainInfo = {
uid: 0
};
this.putRemainCards = [].concat(t);
if (t.length > 0) {
for (var r = 0, i = t.length; r < i; r++) p.default.removeArrayValue(n, t[r]);
this.siteInfos.get(o.pos).resetHand(n, this.mainCard);
}
l.default.eventUtils.emit(c.default.data_put_remain, {
pos: o.pos,
cards: t
});
};
e.prototype.isZhuang = function(e) {
return this.zhuangUid > 0 && e === this.zhuangUid || this.friendUid > 0 && this.friendUid === e;
};
e.prototype.isXian = function(e) {
return !this.isZhuang(e) && this.friendUid > 0;
};
return e;
}();
o.default = h;
(function(e) {
e[e.Null = 0] = "Null";
e[e.Jiao = 1] = "Jiao";
e[e.Fan = 2] = "Fan";
e[e.Put = 3] = "Put";
})(n = o.eRoundTypeD7 || (o.eRoundTypeD7 = {}));
(function(e) {
e[e.Turn = 0] = "Turn";
e[e.Guo = 1] = "Guo";
e[e.OK = 2] = "OK";
})(r = o.eRoundStateD7 || (o.eRoundStateD7 = {}));
var m = function() {
function e() {
this.type = n.Null;
this.actions = [];
this._putScoreCards = [];
this._putMaxinIndex = -1;
this._okCount = 0;
this.putType = d.eD7OneHandType.Null;
}
e.prototype.lastData = function() {
var e = this.actions.length;
return e > 0 ? this.actions[e - 1] : null;
};
e.prototype.clean = function() {
this.type = n.Null;
this.actions = [];
this._putScoreCards = [];
this._putMaxinIndex = -1;
this._okCount = 0;
this.putType = d.eD7OneHandType.Null;
};
e.prototype.okCount = function() {
return this._okCount;
};
e.prototype.maxPutIndex = function() {
return this._putMaxinIndex;
};
e.prototype.jiaoTurn = function(e, t) {
this._setType(n.Jiao);
var o = {
pos: e,
state: r.Turn,
cards: [ t ]
};
this._pushData(o);
l.default.eventUtils.emit(c.default.data_jiao_turn, {
pos: e,
cards: []
});
};
e.prototype.jiaoGuo = function(e) {
this._setType(n.Jiao);
var t = {
pos: e,
state: r.Guo,
cards: []
};
this._pushData(t);
l.default.eventUtils.emit(c.default.data_jiao_guo, {
pos: e,
cards: []
});
};
e.prototype.jiaoOK = function(e, t) {
this._setType(n.Jiao);
var o = {
pos: e,
state: r.OK,
cards: [ t ]
};
this._pushData(o);
l.default.eventUtils.emit(c.default.data_jiao_ok, {
pos: e,
cards: [ t ]
});
};
e.prototype.fanTurn = function(e, t) {
this._setType(n.Fan);
var o = {
pos: e,
state: r.Turn,
cards: [ t ]
};
this._pushData(o);
l.default.eventUtils.emit(c.default.data_fan_turn, {
pos: e,
cards: []
});
};
e.prototype.fanGuo = function(e) {
this._setType(n.Fan);
var t = {
pos: e,
state: r.Guo,
cards: []
};
this._pushData(t);
l.default.eventUtils.emit(c.default.data_fan_guo, {
pos: e,
cards: []
});
};
e.prototype.fanOK = function(e, t) {
this._setType(n.Fan, !0);
var o = {
pos: e,
state: r.OK,
cards: [ t ]
};
this._pushData(o);
l.default.eventUtils.emit(c.default.data_fan_ok, {
pos: e,
cards: [ t ]
});
};
e.prototype.putCard = function(e, t) {
this._setType(n.Put);
var o = {
pos: e,
state: r.OK,
cards: t
};
this._pushData(o);
for (var i = 0, a = t.length; i < a; i++) {
var s = t[i];
d.default.score(s) > 0 && this._putScoreCards.push(s);
l.default.eventUtils.emit(c.default.data_round_put_score_change);
}
if (1 === this._okCount) {
this._putMaxinIndex = 0;
var p = l.default.gameLogic().isSupportAKK(u.default.config), f = l.default.gameLogic().isSupportAKKQQ(u.default.config);
this.putType = d.default.oneHandType(t, p, f, u.default.gameInfoD7.mainCard);
} else {
var h = this.actions[this._putMaxinIndex].cards, m = t;
if (d.default.compareOneHand(h, m, u.default.gameInfoD7.mainCard, this.putType) < 0) for (i = this.actions.length - 1; i >= 0; i--) if (this.actions[i].state === r.OK) {
this._putMaxinIndex = i;
break;
}
}
l.default.eventUtils.emit(c.default.data_put_card, {
pos: e,
cards: t
});
};
e.prototype.putTurn = function(e, t) {
this._setType(n.Put);
var o = {
pos: e,
state: r.Turn,
cards: [ t ]
};
this._pushData(o);
l.default.eventUtils.emit(c.default.data_put_turn, {
pos: e,
cards: []
});
};
e.prototype.roundScore = function() {
return d.default.scoreCount(this._putScoreCards);
};
e.prototype.lastAction = function() {
var e = this.actions.length;
return e > 0 ? this.actions[e - 1] : null;
};
e.prototype._pushData = function(e) {
for (var t = -1, o = e.state === r.OK, n = 0, i = this.actions.length; n < i; n++) {
var a = this.actions[n];
if (a.pos === e.pos) {
t = n;
a.state === r.OK && (o = !1);
break;
}
}
if (t >= 0) this.actions.splice(t, 1, e); else {
var s = !1;
if (e.state !== r.Turn) {
var l = this.actions[0];
l && l.state === r.Turn && (s = !0);
}
s ? this.actions.unshift(e) : this.actions.push(e);
}
o && this._okCount++;
};
e.prototype._setType = function(e, t) {
void 0 === t && (t = !1);
if (this.type !== e || t) {
this.clean();
this.type = e;
this._putScoreCards.length > 0 && l.default.eventUtils.emit(c.default.data_round_put_score_change);
l.default.eventUtils.emit(c.default.data_round_change);
}
};
return e;
}();
cc._RF.pop();
