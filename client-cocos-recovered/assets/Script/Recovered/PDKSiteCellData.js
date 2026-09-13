// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c8b9cjld75I6ICqocrtXoyf", "PDKSiteCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./PDKCardUtils"), r = require("./gContext"), i = require("./PDKEventKeys"), a = require("./PDKEnum"), s = function() {
function e(e) {
this.pos = 0;
this._piaoScore = -1;
this.handCards = [];
this._roundType = a.eRoundTypePDK.Null;
this._putCards = [];
this._putCardType = n.ePDKOneHandType.Error;
this._turnType = a.ePDKTurnType.Normal;
this.pos = e;
this._init();
}
e.prototype._init = function() {
this._piaoScore = -1;
this.handCards = [];
this._roundType = a.eRoundTypePDK.Null;
this._putCards = [];
this._putCardType = n.ePDKOneHandType.Error;
};
e.prototype.clean = function(e) {
if (e) {
this.updatePiao(-1);
this.udpateHandCards([]);
this._init();
} else this._init();
};
e.prototype.updatePiao = function(e) {
if (this._piaoScore !== e) {
this._piaoScore = e;
r.default.eventUtils.emit(i.default.data_piao_score_change, {
pos: this.pos,
score: e
});
}
};
e.prototype.udpateHandCards = function(e) {
this.handCards = n.default.sortDesc(e, !0);
r.default.eventUtils.emit(i.default.data_hand_card_reset, {
pos: this.pos,
cards: this.handCards
});
};
e.prototype.bCanPiao = function() {
return -1 === this._piaoScore;
};
e.prototype.piaoScore = function() {
return this._piaoScore;
};
e.prototype.putCard = function(e, t) {
void 0 === t && (t = !0);
if (t) if (this.handCards[0] === n.PDK_HIDE_ID) for (var o = 0, s = e.length; o < s; o++) this.handCards.pop(); else for (o = 0,
s = e.length; o < s; o++) this._removeHand(e[o]);
this._putCardType = n.default.oneHandType(e);
var l = n.default.sortPutShow(e, this._putCardType);
this._roundData(a.eRoundTypePDK.Put, l);
r.default.eventUtils.emit(i.default.data_hand_card_remove, {
pos: this.pos,
cards: e
});
};
e.prototype.turn = function(e) {
this._turnType = e;
this._roundData(a.eRoundTypePDK.Turn, []);
};
e.prototype.pass = function() {
this._roundData(a.eRoundTypePDK.Pass, []);
};
e.prototype.isWarning = function() {
return 1 === this.handCards.length;
};
Object.defineProperty(e.prototype, "roundType", {
get: function() {
return this._roundType;
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
e.prototype.getPutCards = function() {
return this._putCards;
};
e.prototype._roundData = function(e, t) {
this._roundType = e;
this._putCards = t;
r.default.eventUtils.emit(i.default.data_round_data_update, {
pos: this.pos,
cards: t
});
};
e.prototype._removeHand = function(e) {
for (var t = this.handCards.length - 1; t >= 0; t--) if (e === this.handCards[t]) {
this.handCards.splice(t, 1);
break;
}
};
return e;
}();
o.default = s;
cc._RF.pop();
