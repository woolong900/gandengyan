// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7b4d2gafsdJ/r9FbQsxB1YS", "DDZSiteCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./DDZCardUtils"), r = require("./gContext"), i = require("./DDZEventKeys"), a = require("./DDZEnum"), s = function() {
function e(e) {
this.pos = 0;
this.handCards = [];
this._jiaodizhu = 0;
this._roundType = a.eRoundTypeDDZ.Null;
this._putCards = [];
this._putCardType = n.eDDZOneHandType.Error;
this._turnType = a.eDDZTurnType.Normal;
this._otType = -1;
this._isPass = !1;
this.pos = e;
this._init();
}
e.prototype._init = function() {
this._jiaodizhu = 0;
this.handCards = [];
this._roundType = a.eRoundTypeDDZ.Null;
this._putCards = [];
this._putCardType = n.eDDZOneHandType.Error;
};
e.prototype.clean = function(e) {
if (e) {
this.udpateHandCards([]);
this._init();
} else this._init();
};
e.prototype.udpateHandCards = function(e) {
this.handCards = n.default.sortDesc(e, !0);
r.default.eventUtils.emit(i.default.data_hand_card_reset, {
pos: this.pos,
cards: this.handCards
});
};
e.prototype.putCard = function(e, t) {
void 0 === t && (t = !0);
var o = [], s = [];
this._putCardType = e[0];
for (var l = 1; l < e.length; l++) l <= (e.length - 1) / 2 ? o.push(e[l]) : s.push(e[l]);
if (t) if (this.handCards[0] === n.DDZ_HIDE_ID) {
l = 0;
for (var c = s.length; l < c; l++) this.handCards.pop();
} else for (l = 0; l < s.length; l++) this._removeHand(s[l]);
this._roundData(a.eRoundTypeDDZ.Put, o);
r.default.eventUtils.emit(i.default.data_hand_card_remove, {
pos: this.pos,
cards: s
});
};
e.prototype.turn = function(e) {
this._turnType = e;
this._roundData(a.eRoundTypeDDZ.Turn, []);
};
e.prototype.pass = function() {
this._roundData(a.eRoundTypeDDZ.Pass, []);
};
e.prototype.isWarning = function() {
return 1 === this.handCards.length;
};
e.prototype.jiaoDiZhu = function(e) {
this._jiaodizhu = e;
this._roundData(a.eRoundTypeDDZ.JiaoDiZhu, []);
};
e.prototype.null = function() {
this._roundData(a.eRoundTypeDDZ.Null, []);
};
e.prototype.getOtType = function() {
return this._otType;
};
e.prototype.jiaoDizhuType = function() {
return this._jiaodizhu;
};
e.prototype.setOtType = function(e) {
this._otType = e;
e > -1 && r.default.eventUtils.emit(i.default.ui_jiaodizhu_change, {
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
e.prototype.setIsPass = function(e) {
this._isPass = e;
};
e.prototype.getIsPass = function() {
return this._isPass;
};
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
