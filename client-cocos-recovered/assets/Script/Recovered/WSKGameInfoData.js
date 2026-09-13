// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6d319pNDhlGzbtqwOfJ4FYp", "WSKGameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./WSKEnum"), r = e("./WSKSiteCellData"), i = e("./WSKSiteListData"), a = e("./gContext"), s = e("./WSKEventKeys"), l = e("./EventKeys"), c = function() {
function e() {
this.curStep = 0;
this.status = n.eWSKGameStatus.Free;
this.siteInfos = null;
this.zhuangUid = 0;
this.friendUid = 0;
this.friendCard = 0;
this._tableScore = 0;
this._tableScoreCards = [];
this.allPutCards = [];
this.siteInfos = new i.default();
for (var e = 0; e < 4; e++) {
var t = new r.default(e);
this.siteInfos.upate(t);
}
}
e.prototype.update = function(e) {
for (var t = e.siteInfos || [], o = 0, r = t.length; o < r; o++) {
var i = t[o], l = i.pos, c = this.siteInfos.get(l);
c.clean(!1);
c.udpateHandCards(i.handCards);
c.updateRank(i.rank, !1);
c.updatePickUpScore(i.pickScore, !1);
c.updateXiCard(i.xiCards, !1);
}
this.updateStep(e.curStep || 0);
this.updateStatus(e.status || n.eWSKGameStatus.Free);
this.updateFriend(e.friendUid, !1);
this.updateFriendCard(e.friendCard, !1);
this.updateZhuang(e.zhuangUid, !1);
if (this._tableScore !== e.tableScore) {
this._tableScore = e.tableScore;
this._tableScoreCards = e.tableScoreCards || [];
a.default.eventUtils.emit(s.default.data_table_score_change);
}
this.allPutCards = [].concat(e.allPutCards);
};
e.prototype.updateStatus = function(e) {
var t = this.status, o = e;
if (t !== o) {
this.status = e;
a.default.eventUtils.emit(s.default.data_status_change, {
o: t,
n: o
});
}
t === n.eWSKGameStatus.Free && o !== n.eWSKGameStatus.Free && a.default.eventUtils.emit(l.default.pulic_game_free2begin);
};
e.prototype.updateStep = function(e) {
if (this.curStep !== e) {
this.curStep = e;
a.default.eventUtils.emit(s.default.data_step_change);
}
};
e.prototype.updateZhuang = function(e, t) {
this.zhuangUid = e;
a.default.eventUtils.emit(s.default.data_zhuang_change, {
action: t
});
};
e.prototype.updateFriendCard = function(e, t) {
this.friendCard = e;
a.default.eventUtils.emit(s.default.data_friend_card_change, {
action: t
});
};
e.prototype.is1V3 = function() {
return this.zhuangUid > 0 && -1 === this.friendCard;
};
e.prototype.updateFriend = function(e, t) {
if (this.friendUid !== e) {
this.friendUid = e;
a.default.eventUtils.emit(s.default.data_friend_change);
t && a.default.eventUtils.emit(s.default.action_firend_show);
}
};
e.prototype.putCard = function(e, t, o, n) {
void 0 === n && (n = !0);
var r = this.siteInfos.get(e);
if (n) {
for (var i = 0, l = 0, c = t.length; l < c; l++) {
var u = t[l], d = a.default.gameLogic().score(u);
d > 0 && this._tableScoreCards.push(u);
i += d;
}
if (i > 0) {
this._tableScore = this._tableScore + i;
a.default.eventUtils.emit(s.default.data_table_score_add);
}
this.allPutCards = this.allPutCards.concat(t);
}
r.putCard(t, o, n);
};
e.prototype.pickUpScore = function(e, t) {
var o = this.siteInfos.get(e), n = o.pickScore;
o.updatePickUpScore(n + t, !0);
this._tableScore = 0;
this._tableScoreCards = [];
a.default.eventUtils.emit(s.default.data_table_score_change);
};
Object.defineProperty(e.prototype, "tableScore", {
get: function() {
return this._tableScore;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "tableScoreCards", {
get: function() {
return this._tableScoreCards;
},
enumerable: !0,
configurable: !0
});
return e;
}();
o.default = c;
cc._RF.pop();
