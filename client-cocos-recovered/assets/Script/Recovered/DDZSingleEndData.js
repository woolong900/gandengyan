// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2c5cf4FW8FMP6AJFH0EbeAh", "DDZSingleEndData");
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
var r = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.time = 0;
t._players = [];
t._bChunTian = !1;
t._bFanChun = !1;
return t;
}
t.prototype.update = function(e) {
this.time = e.time;
this._players = e.players;
this._bFanChun = !1;
this._bChunTian = !1;
for (var t = 0, o = this._players.length; t < o; t++) if (this.playerIsFanChun(t)) {
this._bFanChun = !0;
break;
}
if (!this._bFanChun) for (t = 0, o = this._players.length; t < o; t++) if (this.playerIsChunTian(t)) {
this._bChunTian = !0;
break;
}
};
t.prototype.bChunTian = function() {
return this._bChunTian;
};
t.prototype.bFanChun = function() {
return this._bFanChun;
};
t.prototype.playerCount = function() {
return this._players.length;
};
t.prototype.playerUid = function(e) {
return this._players[e].uid;
};
t.prototype.playerBomb = function(e) {
return this._players[e].bomb_num || 0;
};
t.prototype.playerIsChunTian = function(e) {
return this._players[e].spring;
};
t.prototype.playerIsFanChun = function(e) {
return this._players[e].instead_spring;
};
t.prototype.playerScore = function(e) {
return this._players[e].winner_score || 0;
};
t.prototype.playerTotal = function(e) {
return this._players[e].total || 0;
};
t.prototype.playerInitCards = function(e) {
return this._players[e].card.init_card || [];
};
return t;
}(require("./Singleton").default);
o.default = r;
cc._RF.pop();
