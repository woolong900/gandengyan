// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c8ddaWpkkNAC5AtAkPctt7V", "SingleEndInfoData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./SingleEndPlayerData"), r = require("./UserData"), i = require("./gContext"), a = require("./CommonUtils"), s = require("./GameSoundMJ"), l = function() {
function e() {
this.time = 0;
this.endType = 1;
this.players = [];
this.inHorse = [];
this.notInHorse = [];
this.horseSum = 0;
this._isZiMoEnd = null;
}
e.prototype.clean = function() {
this.time = 0;
this.endType = 1;
this.players = [];
this.inHorse = [];
this.notInHorse = [];
this._isZiMoEnd = null;
};
e.prototype.setData = function(e, t) {
if (e) {
var o = null;
this.time = e.time;
this.endType = e.endType;
this.inHorse = e.inHorse;
this.notInHorse = e.notInhorse;
this.horseSum = e.horseSum;
this.players = [];
for (var i = e.players || [], a = 0, l = i.length; a < l; a++) {
var c = new n.default(i[a]);
this.players.push(c);
c.uid === r.default.uid && (o = c.huType > 0 ? 1 : -1);
}
this.isLiuJu() && (o = 0);
t && null !== o && s.default.getInstance().gameEnd(o);
} else this.clean();
};
e.prototype.isLiuJu = function() {
return 1 === this.endType;
};
e.prototype.isInhorse = function() {
return 3 === this.endType;
};
e.prototype.isZiMoEnd = function() {
if (null === this._isZiMoEnd) {
this._isZiMoEnd = !1;
for (var e = 0; e < this.players.length; e++) {
var t = this.players[e].huType;
if (t > 0) {
this._isZiMoEnd = i.default.gameLogic().isZiMo(t);
break;
}
}
}
return this._isZiMoEnd;
};
e.prototype.checkHuUserBit = function(e) {
for (var t = 0, o = this.players.length; t < o; t++) {
var n = this.players[t].huType;
if (n > 0 && a.default.checkBit(n, e)) return !0;
}
return !1;
};
return e;
}();
o.default = l;
cc._RF.pop();
