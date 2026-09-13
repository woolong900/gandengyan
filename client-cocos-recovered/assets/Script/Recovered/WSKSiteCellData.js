// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5ee42mkbMdGz4o9Swb2ex2u", "WSKSiteCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = e("./GameLogicWSK"), i = e("./Storage"), a = e("./gContext"), s = e("./WSKEnum"), l = e("./WSKEventKeys");
(function(e) {
e[e.Desc = 0] = "Desc";
e[e.Bomb = 1] = "Bomb";
e[e.Score = 2] = "Score";
})(n || (n = {}));
var c = function() {
function e(e) {
this.pos = 0;
this._rank = 0;
this._pickScore = 0;
this._handCards = [];
this._handSortType = n.Desc;
this._handSortCards = [];
this._xiCards = [];
this._roundType = s.eWSKRoundType.Null;
this._putRealCards = [];
this._putVirtualCards = [];
this._putCardType = 0;
this.pos = e;
this._handSortType = n.Desc;
this._init();
}
e.prototype._init = function() {
this._rank = 0;
this._pickScore = 0;
this._handCards = [];
this._handSortCards = [];
this._xiCards = [];
this._roundType = s.eWSKRoundType.Null;
this._putRealCards = [];
this._putVirtualCards = [];
this._putCardType = 0;
};
e.prototype.clean = function(e) {
this._init();
};
e.prototype.putCard = function(e, t, o) {
void 0 === o && (o = !0);
if (o) if (this._handCards[0] === r.WSK_CARD_HIDE_ID) for (var n = 0, i = e.length; n < i; n++) this._handCards.pop(); else for (n = 0,
i = e.length; n < i; n++) this._removeHand(e[n]);
var c = a.default.gameLogic().oneHandInfo(t);
this._putCardType = c[0].type;
this._putRealCards = e;
this._putVirtualCards = a.default.gameLogic().sortPutShow(t);
this._sortHandCards(this._handSortType);
this._updateRoundType(s.eWSKRoundType.Put);
o && a.default.eventUtils.emit(l.default.action_put_show, {
pos: this.pos
});
};
e.prototype.pass = function() {
this._updateRoundType(s.eWSKRoundType.Pass);
};
e.prototype.turn = function() {
this._updateRoundType(s.eWSKRoundType.Turn);
};
e.prototype.cleanRound = function() {
this._putRealCards = [];
this._putVirtualCards = [];
this._putCardType = 0;
this._updateRoundType(s.eWSKRoundType.Null);
};
e.prototype.updateRank = function(e, t) {
this._rank = e;
a.default.eventUtils.emit(l.default.data_rank_change, {
pos: this.pos,
action: t
});
};
e.prototype.udpateHandCards = function(e) {
this._handCards = e;
this._sortHandCards(this._handSortType);
};
e.prototype.updatePickUpScore = function(e, t) {
var o = e - this._pickScore;
this._pickScore = e;
a.default.eventUtils.emit(l.default.data_pick_score_change, {
dt: o,
pos: this.pos,
action: t
});
};
e.prototype.updateXiCard = function(e, t) {
this._xiCards = e;
a.default.eventUtils.emit(l.default.data_xi_card_change, {
pos: this.pos,
action: t,
cards: e
});
};
Object.defineProperty(e.prototype, "rank", {
get: function() {
return this._rank;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "roundType", {
get: function() {
return this._roundType;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "putVirtualCards", {
get: function() {
return this._putVirtualCards;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "putRealCards", {
get: function() {
return this._putRealCards;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "putType", {
get: function() {
return this._putCardType;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "handCards", {
get: function() {
return this._handSortCards;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "pickScore", {
get: function() {
return this._pickScore;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "xiCards", {
get: function() {
return this._xiCards;
},
enumerable: !0,
configurable: !0
});
e.prototype.sortCards = function(e) {
this._sortHandCards(e);
};
e.prototype.tidyCards = function() {
var e = (this._handSortType + 1) % 3;
i.default.wskHandCardsSortType.setValue(e);
this._sortHandCards(e);
};
e.prototype._updateRoundType = function(e) {
this._roundType = e;
a.default.eventUtils.emit(l.default.data_round_change, {
pos: this.pos
});
};
e.prototype._sortHandCards = function(e) {
this._handSortType = e;
e === n.Bomb && (this._handSortCards = a.default.gameLogic().sortBomb(this._handCards));
e === n.Desc && (this._handSortCards = a.default.gameLogic().sortDesc(this._handCards));
e === n.Score && (this._handSortCards = a.default.gameLogic().sortScore(this._handCards));
a.default.eventUtils.emit(l.default.data_hand_card_change, {
pos: this.pos
});
};
e.prototype._removeHand = function(e) {
for (var t = this._handCards.length - 1; t >= 0; t--) if (e === this._handCards[t]) {
this._handCards.splice(t, 1);
break;
}
};
return e;
}();
o.default = c;
cc._RF.pop();
