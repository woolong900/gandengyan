// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f7314KxQI1HeJaf539u2l/j", "D7SingleEndData");
var n = this && this.__extends || function() {
var e = function(t, o) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
})(t, o);
};
return function(t, o) {
e(t, o);
function n() {
this.constructor = t;
}
t.prototype = null === o ? Object.create(o) : (n.prototype = o.prototype, new n());
};
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = e("./Singleton"), i = e("./RoomInfoData"), a = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.time = 0;
t.endType = 1;
t._players = [];
t._isKou = !1;
t._baseCards = [];
t._baseNum = 0;
t._baseType = 0;
t._gameEndPai = [];
t._lastPaiNUM = 0;
return t;
}
t.prototype.update = function(e) {
this.time = e.time;
this.endType = e.endType;
this._players = e.players;
this.isLiuJu() && this.updateBaseInfo(!1, []);
};
t.prototype.updateBaseInfo = function(e, t, o) {
void 0 === o && (o = 0);
this._isKou = e;
this._baseCards = t;
this._baseType = o;
};
t.prototype.updateBaseTypeInfo = function(e, t, o) {
this._baseNum = e;
this._baseType = t;
this._gameEndPai = o;
};
t.prototype.gameEndPai = function() {
return this._gameEndPai;
};
t.prototype.restgGameEndPai = function() {
this._gameEndPai = [];
this._lastPaiNUM = 0;
};
t.prototype.lastPaiNUM = function() {
return this._lastPaiNUM;
};
t.prototype.setLastPaiNUM = function(e) {
this._lastPaiNUM = e;
};
t.prototype.isKou = function() {
return this._isKou;
};
t.prototype.baseCards = function() {
return this._baseCards;
};
t.prototype.baseNum = function() {
return this._baseNum;
};
t.prototype.baseType = function() {
return this._baseType;
};
t.prototype.isLiuJu = function() {
return 1 === this.endType;
};
t.prototype.playerCount = function() {
return this._players.length;
};
t.prototype.playerUid = function(e) {
return this._players[e].uid;
};
t.prototype.playerLevel = function(e) {
return this._players[e].level || 0;
};
t.prototype.playerFan = function(e) {
return this._players[e].over_count || 0;
};
t.prototype.playerKou = function(e) {
return this._players[e].base_score || 0;
};
t.prototype.playerZhua = function(e) {
return this._players[e].card_score || 0;
};
t.prototype.playerGroup = function(e) {
return this._players[e].group_score || 0;
};
t.prototype.playerScore = function(e) {
return (this._players[e].score || 0) / i.default.scoreRatio;
};
t.prototype.playHzPoints = function(e) {
return this._players[e].hz_points || 0;
};
t.prototype.playHzCards = function(e) {
return this._players[e].hand_cards || [];
};
return t;
}(r.default);
o.default = a;
cc._RF.pop();
