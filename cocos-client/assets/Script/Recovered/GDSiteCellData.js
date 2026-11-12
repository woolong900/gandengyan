// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "60622GkAAJP8K/d5MoUm/K+", "GDSiteCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./gContext"), r = require("./GDEnum"), i = require("./GDEventKeys"), a = require("./GDCardUtils"), s = function() {
function e(e) {
this.pos = 0;
this.handCards = [];
this.friendhandCards = [];
this._jiaodizhu = 0;
this._roundType = r.eRoundTypeGD.Null;
this._putCards = [];
this._ariRealCards = [];
this._putCardType = a.eGDOneHandType.Error;
this._turnType = r.eGDTurnType.Normal;
this._otType = -1;
this._isPass = !1;
this._endScore = 0;
this._rank = 0;
this.pos = e;
this._init();
}
e.prototype._init = function() {
this._jiaodizhu = 0;
this.handCards = [];
this._roundType = r.eRoundTypeGD.Null;
this._putCards = [];
this._ariRealCards = [];
this._putCardType = a.eGDOneHandType.Error;
this._rank = 0;
this._endScore = 0;
};
e.prototype.clean = function(e) {
if (e) {
this.udpateHandCards([]);
this._init();
} else this._init();
};
e.prototype.udpateHandCards = function(e) {
this.handCards = a.default.sortDesc(e, !0);
n.default.eventUtils.emit(i.default.data_hand_card_reset, {
pos: this.pos,
cards: this.handCards
});
};
e.prototype.udpateEndScore = function(e) {
this._endScore = e;
n.default.eventUtils.emit(i.default.data_piao_score_change, {
pos: this.pos
});
};
e.prototype.putCard = function(e, t) {
void 0 === t && (t = !0);
var o = [], s = [];
this._putCardType = e[0];
for (var l = 1; l < e.length; l++) l <= (e.length - 1) / 2 ? o.push(e[l]) : s.push(e[l]);
if (t) if (this.handCards[0] === a.GD_HIDE_ID) {
l = 0;
for (var c = s.length; l < c; l++) this.handCards.pop();
} else for (l = 0; l < s.length; l++) this._removeHand(s[l]);
this._roundData(r.eRoundTypeGD.Put, o, s);
n.default.eventUtils.emit(i.default.data_hand_card_remove, {
pos: this.pos,
cards: s
});
};
e.prototype.friendPutCard = function(e, t) {
var o = [], r = [];
this._putCardType = e[0];
for (var a = 1; a < e.length; a++) a <= (e.length - 1) / 2 ? o.push(e[a]) : r.push(e[a]);
for (a = 0; a < r.length; a++) this._removeFriendHand(r[a]);
n.default.eventUtils.emit(i.default.data_hand_card_remove_firend, {
pos: t,
cards: r
});
};
e.prototype.gongCard = function(e, t) {
void 0 === t && (t = !0);
t && this._removeHand(e[0]);
n.default.eventUtils.emit(i.default.data_hand_card_remove, {
pos: this.pos,
cards: e
});
n.default.eventUtils.emit(i.default.romove_gongpai, {
pos: this.pos,
cards: e
});
n.default.eventUtils.emit(i.default.off_btn_gongpai, {
pos: this.pos
});
};
e.prototype.turn = function(e, t) {
void 0 === t && (t = []);
this._turnType = e;
this._roundData(r.eRoundTypeGD.Turn, t);
};
e.prototype.turnGongPai = function(e) {
this._turnType = e;
this._roundData(r.eRoundTypeGD.gongpai, []);
};
e.prototype.pass = function() {
this._roundData(r.eRoundTypeGD.Pass, []);
};
e.prototype.isWarning = function() {
return 1 === this.handCards.length;
};
e.prototype.jiaoDiZhu = function(e) {
this._jiaodizhu = e;
this._roundData(r.eRoundTypeGD.JiaoDiZhu, []);
};
e.prototype.null = function() {
this._roundData(r.eRoundTypeGD.Null, []);
};
e.prototype.getOtType = function() {
return this._otType;
};
e.prototype.jiaoDizhuType = function() {
return this._jiaodizhu;
};
e.prototype.setOtType = function(e) {
this._otType = e;
e > -1 && n.default.eventUtils.emit(i.default.ui_jiaodizhu_change, {
pos: this.pos,
otType: e
});
};
Object.defineProperty(e.prototype, "roundType", {
get: function() {
return this._roundType;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "endScore", {
get: function() {
return this._endScore;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "putCardType", {
get: function() {
return this._putCardType;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "turnType", {
get: function() {
return this._turnType;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "rank", {
get: function() {
return this._rank;
},
enumerable: !0,
configurable: !0
});
e.prototype.setIsPass = function(e) {
this._isPass = e;
};
e.prototype.getIsPass = function() {
return this._isPass;
};
e.prototype.getPutCards = function() {
return this._putCards;
};
e.prototype.getPuariRealCards = function() {
return this._ariRealCards;
};
e.prototype._roundData = function(e, t, o) {
void 0 === o && (o = []);
this._roundType = e;
this._putCards = t;
this._ariRealCards = o;
n.default.eventUtils.emit(i.default.data_round_data_update, {
pos: this.pos,
cards: t,
ariRealCards: o
});
};
e.prototype.set_roundData = function(e) {
this._roundType = e;
n.default.eventUtils.emit(i.default.data_round_data_update_jiefeng, {
pos: this.pos
});
};
e.prototype._removeHand = function(e) {
for (var t = this.handCards.length - 1; t >= 0; t--) if (e === this.handCards[t]) {
this.handCards.splice(t, 1);
break;
}
};
e.prototype._removeFriendHand = function(e) {
for (var t = this.friendhandCards.length - 1; t >= 0; t--) if (e === this.friendhandCards[t]) {
this.friendhandCards.splice(t, 1);
break;
}
};
e.prototype.updateRank = function(e, t) {
this._rank = e;
n.default.eventUtils.emit(i.default.data_rank_change, {
pos: this.pos,
action: t
});
};
e.prototype.cleanRound = function() {
this._ariRealCards = [];
this._putCards = [];
this._putCardType = 0;
this.set_roundData(r.eRoundTypeGD.Null);
};
return e;
}();
o.default = s;
cc._RF.pop();
