// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "db950pl+3xB4pS80mi1ji79", "D7SiteCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./D7CardUtils"), r = e("./gContext"), i = e("./D7EventKeys"), a = function() {
function e(e) {
this.pos = 0;
this.handCards = [];
this.scoreCards = [];
this.pos = e;
this.handCards = [];
this.scoreCards = [];
}
e.prototype.update = function(e, t) {
var o = e.handCards, a = e.scoreCards || [];
this.handCards = n.default.sortDesc(o, t);
this.scoreCards = [].concat(a);
r.default.eventUtils.emit(i.default.data_hand_card_reset, {
pos: this.pos,
cards: o
});
r.default.eventUtils.emit(i.default.data_score_card_reset, {
pos: this.pos,
cards: a
});
};
e.prototype.reorderHand = function(e) {
this.handCards = n.default.sortDesc(this.handCards, e);
};
e.prototype.pushScoreCards = function(e) {
this.scoreCards = this.scoreCards.concat(e);
r.default.eventUtils.emit(i.default.data_score_card_add, {
pos: this.pos,
cards: e
});
};
e.prototype.pushHand = function(e, t) {
e = e || [];
this.handCards = this.handCards.concat(e);
this.handCards = n.default.sortDesc(this.handCards, t);
r.default.eventUtils.emit(i.default.data_hand_card_add, {
pos: this.pos,
cards: e
});
};
e.prototype.removeHand = function(e) {
for (var t = 0, o = e.length; t < o; t++) this._removeHand(e[t]);
r.default.eventUtils.emit(i.default.data_hand_card_remove, {
pos: this.pos,
cards: e
});
};
e.prototype.resetHand = function(e, t) {
this.handCards = n.default.sortDesc(e, t);
r.default.eventUtils.emit(i.default.data_hand_card_reset, {
pos: this.pos,
cards: e
});
};
e.prototype._removeHand = function(e) {
for (var t = this.handCards.length - 1; t >= 0; t--) if (0 == this.handCards[t] || e === this.handCards[t]) {
this.handCards.splice(t, 1);
break;
}
};
return e;
}();
o.default = a;
cc._RF.pop();
