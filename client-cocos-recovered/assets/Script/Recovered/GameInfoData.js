// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e4ae5acIKRKHL2VtaM8zi1a", "GameInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./CommonEnum"), i = require("./SiteInfoListData"), a = require("./SingleEndInfoData"), s = require("./SiteInfoCellData"), l = require("./CardUtils"), c = require("./gContext"), u = require("./EventKeys");
(function(e) {
e[e.Free = 0] = "Free";
e[e.Gameing = 1] = "Gameing";
e[e.SingleEnd = 2] = "SingleEnd";
e[e.TotalEnd = 3] = "TotalEnd";
})(n = o.eGameStatus || (o.eGameStatus = {}));
var d = function() {
function e() {
this.curStep = 0;
this.pz = 0;
this.lz = 0;
this.siteInfos = new i.default();
this.singleEndInfo = new a.default();
this.cardPointer = r.eDeskPos.Stand;
this.playerPointer = r.eDeskPos.Stand;
this.status = n.Free;
this.beginPaiDunPos = {
index: 0,
pos: 0
};
this.owner = 0;
this.dice1 = 1;
this.dice2 = 1;
this.specialRuleFlag = 0;
this.cun_num = 0;
this._positivePaiDunPointer = null;
this._negativePaiDunPointer = null;
this._pzList = null;
this._putCardVirtual = null;
this._fengGang = !1;
this.clickCard = !1;
}
e.prototype.clean = function() {
this.curStep = 0;
this.pz = 0;
this.lz = 0;
this.siteInfos.clean();
this.singleEndInfo.setData(null);
this.cardPointer = r.eDeskPos.Stand;
this.playerPointer = r.eDeskPos.Stand;
this.status = n.Free;
this.beginPaiDunPos = {
pos: r.eDeskPos.East,
index: 0
};
this.owner = 0;
this._positivePaiDunPointer = null;
this._negativePaiDunPointer = null;
this._pzList = null;
this._putCardVirtual = null;
this._fengGang = !1;
};
e.prototype.setPutCardVirtual = function(e) {
this._putCardVirtual = e ? {
uid: e.uid,
card: e.card
} : null;
};
e.prototype.getPutCardVirtual = function() {
return this._putCardVirtual;
};
e.prototype.checkPutCardVirtual = function(e) {
return !(!e || !this._putCardVirtual || e.card !== this._putCardVirtual.card || e.uid !== this._putCardVirtual.uid);
};
e.prototype.setData = function(e) {
var t = this.status, o = this.curStep;
this.clean();
if (e) {
this.curStep = e.count || 0;
this.pz = e.pz || 0;
this.lz = e.lz || 0;
this.cardPointer = e.cardPointer;
this.playerPointer = e.playerPointer;
this.status = e.status || n.Free;
this.beginPaiDunPos.index = e.beginPaiDunPos.index;
this.beginPaiDunPos.pos = e.beginPaiDunPos.pos;
this.owner = e.owner || 0;
this.dice1 = e.dice1;
this.dice2 = e.dice2;
this.cun_num = e.cun || 0;
this.specialRuleFlag = e.specialRuleFlag;
for (var r = e.siteInfos || [], i = 0, a = r.length; i < a; i++) {
var l = r[i], d = new s.default(l);
this.siteInfos.upate(d);
}
this.status !== n.SingleEnd && this.status !== n.TotalEnd || this.singleEndInfo.setData(e.singleEndInfo, t === n.Gameing);
this.siteInfos.statisAllOuts();
}
var p = this.status;
t !== p && c.default.eventUtils.emit(u.default.data_game_status_change, {
o: t,
n: p
});
t === n.Free && p === n.Gameing && c.default.eventUtils.emit(u.default.pulic_game_free2begin);
this.curStep !== o && c.default.eventUtils.emit(u.default.data_game_step_change);
};
e.prototype.updateSiteInfo = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t], r = new s.default(n);
this.siteInfos.upate(r);
}
};
Object.defineProperty(e.prototype, "pzList", {
get: function() {
this._pzList || (this._pzList = c.default.gameLogic().getPzList(this.pz));
return this._pzList;
},
enumerable: !0,
configurable: !0
});
e.prototype.getCard = function(e, t, o) {
if (o) for (var n = r.eDeskPos.East; n <= r.eDeskPos.North; n++) {
var i = o[n];
if (i) for (var a = 0, s = i.length; a < s; a++) this.siteInfos.get(n).updatePaiDunCard(a, i[a]);
}
this.siteInfos.get(e).getCard(t);
this.updatePlayerPointer(e);
};
e.prototype.hzgUpdateCard = function(e, t) {
this.setGangDelay();
if (t) for (var o = r.eDeskPos.East; o <= r.eDeskPos.North; o++) {
var n = t[o];
if (n) for (var i = 0, a = n.length; i < a; i++) this.siteInfos.get(o).updatePaiDunCard(i, n[i]);
}
this.updatePlayerPointer(e);
};
e.prototype.isFenggang = function() {
return this._fengGang;
};
e.prototype.setGangDelay = function() {
var e = this;
this._fengGang = !0;
setTimeout(function() {
e._fengGang = !1;
}, 500);
};
e.prototype.putCard = function(e, t) {
if (null != e) {
var o = e.pos;
c.default.gameLogic().playSoundPutCard(t, e.gender);
this.siteInfos.get(o).putCard(t);
this.updateCardPointer(o);
}
};
e.prototype.updatePlayerPointer = function(e) {
if (e !== this.playerPointer) {
this.playerPointer = e;
c.default.eventUtils.emit(u.default.data_player_pointer_change, {
pos: e
});
}
};
e.prototype.updateCardPointer = function(e) {
this.cardPointer = e;
c.default.eventUtils.emit(u.default.data_card_pointer_change, {
pos: e
});
};
e.prototype.removePaiDunCard = function(e) {
var t = null;
if (t = e > 0 ? this.positivePaiDunPointer(e) : e < 0 ? this.negativePaiDunPointer(-1 * e - 1) : this.positivePaiDunPointer()) {
var o = t.pos, n = t.index;
this.siteInfos.get(o).updatePaiDunCard(n, l.MJ_HIDE_ID);
} else cc.error("remove pai dun card error.");
};
e.prototype.positivePaiDunPointer = function(e) {
var t = this;
void 0 === e && (e = 0);
this._positivePaiDunPointer || (this._positivePaiDunPointer = {
pos: this.beginPaiDunPos.pos,
index: this.beginPaiDunPos.index
});
var o = function(e, o) {
for (var n = e.pos, r = e.index, i = 0; i < 4; i++) {
var a = (n + i) % 4, s = t.siteInfos.get(a);
if (s) {
for (var c = s.paiDunCards, u = r, d = c.length; u < d; u++) {
var p = c[u];
if (l.default.isCovered(p)) {
if (!(o > 0)) return {
pos: a,
index: u
};
o -= 1;
u % 2 == 0 && u++;
}
}
r = 0;
}
}
}(this._positivePaiDunPointer, e);
0 === e && (this._positivePaiDunPointer = o);
return {
pos: o.pos,
index: o.index
};
};
e.prototype.negativePaiDunPointer = function(e) {
var t = this;
void 0 === e && (e = 0);
if (!this._negativePaiDunPointer) if (this.beginPaiDunPos.index < 2) {
var o = (this.beginPaiDunPos.pos + 4 - 1) % 4, n = this.siteInfos.get(o).paiDunCards.length - 1 - 1;
this._negativePaiDunPointer = {
pos: o,
index: n
};
} else {
o = this.beginPaiDunPos.pos, n = this.beginPaiDunPos.index;
n -= n % 2 == 0 ? 2 : 1;
this._negativePaiDunPointer = {
pos: o,
index: n
};
}
var r = function(e, o) {
for (var n = e.pos, r = e.index, i = 0; i < 4; i++) {
var a = (n + 4 - i) % 4, s = t.siteInfos.get(a);
if (s) {
for (var c = s.paiDunCards, u = r; u >= 0; u--) {
var d = c[u];
if (l.default.isCovered(d)) {
if (!(o > 0)) return {
pos: a,
index: u
};
o -= 1;
u % 2 == 0 && u--;
}
}
r = c.length - 1;
}
}
}(this._negativePaiDunPointer, e);
0 === e && (this._negativePaiDunPointer = r);
return {
pos: r.pos,
index: r.index
};
};
e.prototype.isLaiZi = function(e) {
return e === this.lz;
};
e.prototype.isFeng = function(e) {
return e >= 31 && e < 37;
};
e.prototype.isPiZi = function(e) {
return -1 !== this.pzList.indexOf(e);
};
e.prototype.isOwner = function(e) {
return e === this.owner;
};
e.prototype.sortCard = function(e) {
var t = this;
e.sort(function(e, o) {
if (e === o) return -1;
var n = t.isLaiZi(e), r = t.isLaiZi(o);
if (n !== r) return r ? 1 : -1;
var i = t.isPiZi(e), a = t.isPiZi(o);
return i !== a ? a ? 1 : -1 : e - o;
});
};
e.prototype._getPaiDunPointer = function(e, t, o) {
for (var n = function(e, t, o, n) {
if (o > 0) {
for (var r = t, i = e.length; r < i; r++) {
var a = e[r];
if (l.default.isCovered(a)) {
if (!(n > 0)) return {
index: r,
offset: 0
};
n -= 1;
}
}
return {
index: -1,
offset: n
};
}
for (r = t; r >= 0; r--) {
a = e[r];
if (l.default.isCovered(a)) {
if (!(n > 0)) return {
index: r,
offset: 0
};
n -= 1;
}
}
return {
index: -1,
offset: n
};
}, r = e.index, i = 0; i < 4; i++) {
var a = (e.pos + i * t + 4) % 4, s = n(this.siteInfos.get(a).paiDunCards, r, t, o);
if (s.index > 0) return {
pos: a,
index: s.index
};
o = s.offset;
}
};
return e;
}();
o.default = d;
cc._RF.pop();
