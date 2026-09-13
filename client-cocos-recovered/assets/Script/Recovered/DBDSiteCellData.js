// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "54398Hwt1pE9ZhXjxn1dfes", "DBDSiteCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./gContext"), r = e("./DBDEnum"), i = e("./DBDEventKeys"), a = e("./DBDCardUtils"), s = function() {
function e(e) {
this.pos = 0;
this._jiaodizhu = 0;
this.handCards = [];
this._roundType = r.eRoundTypeDBD.Null;
this._putCards = [];
this._putCardType = [ a.eDBDOneHandType.Error ];
this._turnType = r.eDBDTurnType.Normal;
this._bidScore = [];
this._otType = -1;
this._isHasLazi = !1;
this._isPass = !1;
this.pos = e;
this._init();
}
e.prototype._init = function() {
this._jiaodizhu = 0;
this.handCards = [];
this._roundType = r.eRoundTypeDBD.Null;
this._putCards = [];
this._putCardType = [ a.eDBDOneHandType.Error ];
this._bidScore = [];
this._otType = -1;
this._isHasLazi = !1;
this._isPass = !1;
};
e.prototype.clean = function(e) {
if (e) {
this.udpateHandCards([]);
this._init();
} else this._init();
};
e.prototype.udpateHandCards = function(e) {
var t = a.default.sortDesc(e, !0);
this.handCards = t;
n.default.eventUtils.emit(i.default.data_hand_card_reset, {
pos: this.pos,
cards: t
});
};
e.prototype.setCurBidScore = function(e) {
this._bidScore = e;
};
e.prototype.getCurBidScore = function() {
return this._bidScore;
};
e.prototype.jiaoDizhuType = function() {
return this._jiaodizhu;
};
e.prototype.getOtType = function() {
return this._otType;
};
e.prototype.setOtType = function(e) {
this._otType = e;
e > -1 && n.default.eventUtils.emit(i.default.ui_jiaodizhu_change, {
pos: this.pos,
otType: e
});
};
e.prototype.putCard = function(e, t, o) {
void 0 === o && (o = !0);
for (var s = [].concat(e), l = [], c = Math.floor(s.length / 2), u = 0; u < c; u++) l.push(s[u + c]);
if (o) if (this.handCards.includes(a.DBD_HIDE_ID)) {
u = 0;
for (var d = l.length; u < d; u++) this.handCards.pop();
} else {
u = 0;
for (var p = l.length; u < p; u++) this._removeHand(l[u]);
}
cc.log("putCard: ", l);
this._putCardType = [ t ];
this._isHasLazi = a.default.isIncludLaizi(e);
var f = a.default.sortPutShow(l, this._putCardType);
this._roundData(r.eRoundTypeDBD.Put, f);
n.default.eventUtils.emit(i.default.data_hand_card_remove, {
pos: this.pos,
cards: l
});
};
e.prototype.turn = function(e) {
this._turnType = e;
this._roundData(r.eRoundTypeDBD.Turn, []);
};
e.prototype.pass = function() {
this._roundData(r.eRoundTypeDBD.Pass, []);
};
e.prototype.isWarning = function() {
return !1;
};
e.prototype.jiaoDiZhu = function(e) {
this._jiaodizhu = e;
this._roundData(r.eRoundTypeDBD.JiaoDiZhu, []);
};
e.prototype.null = function() {
this._roundData(r.eRoundTypeDBD.Null, []);
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
Object.defineProperty(e.prototype, "isHasLazi", {
get: function() {
return this._isHasLazi;
},
enumerable: !0,
configurable: !0
});
e.prototype.getPutCards = function() {
return this._putCards || [];
};
e.prototype._roundData = function(e, t) {
this._roundType = e;
this._putCards = t;
this._putCards.sort(function(e, t) {
return e - t;
});
n.default.eventUtils.emit(i.default.data_round_data_update, {
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
