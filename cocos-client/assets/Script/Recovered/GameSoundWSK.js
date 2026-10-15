// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6209eVYludI34mkr+qZwGO+", "GameSoundWSK");
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
var r = require("./CommonEnum"), i = require("./RoomInfoData"), a = require("./gContext"), s = require("./pb"), l = require("./Singleton"), c = require("./SoundUtils"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype._playEffect = function(e, t) {
void 0 === t && (t = !1);
c.default.playEffect("Games/wsk/Sound/effect/" + e, t);
};
t.prototype._playGender = function(e, t, o) {
void 0 === o && (o = !1);
var n = "";
i.default.config.index === r.eGameIds.QCDG && (n = "wsk" + r.eGameIds.QCDG);
i.default.config.index !== r.eGameIds.QJSHZ && i.default.config.index !== r.eGameIds.QJWSKBD || (n = "wsk" + r.eGameIds.QJSHZ);
i.default.config.index === r.eGameIds.XSWSK && (n = "wsk" + r.eGameIds.XSWSK);
if (t === s.pb.eGender.WOMAN) {
var a = "Games/" + n + "/Sound/woman/";
c.default.playEffect(a + e, o);
} else {
a = "Games/" + n + "/Sound/man/";
c.default.playEffect(a + e, o);
}
};
t.prototype.gameStart = function() {
this._playEffect("game_start", !1);
};
t.prototype.cardRound = function() {
this._playEffect("card_round", !1);
};
t.prototype.rankShow = function() {
this._playEffect("rank_show", !1);
};
t.prototype.jiefeng = function() {
this._playEffect("jiefeng", !1);
};
t.prototype.callBanker = function(e) {
this._playGender("banker_call", e);
};
t.prototype.passBanker = function(e) {
this._playGender("banker_pass", e);
};
t.prototype.pass = function(e) {
var t = "buyao" + Math.floor(4 * Math.random());
this._playGender(t, e, !1);
};
t.prototype.showFirendCard = function() {
this._playEffect("show_firend_card", !1);
};
t.prototype.clock = function() {
this._playEffect("clock", !1);
};
t.prototype.selectCard = function() {
this._playEffect("select_card", !1);
};
t.prototype.selectCardEnd = function() {
this._playEffect("select_card_end", !1);
};
t.prototype.getScore = function() {
this._playEffect("get_score", !1);
};
t.prototype.showFirend = function() {
this._playEffect("show_firend", !1);
};
t.prototype.gameWin = function() {
this._playEffect("gamewin", !1);
};
t.prototype.gameLose = function() {
this._playEffect("gamelose", !1);
};
t.prototype.bombEffect = function() {
this._playEffect("effect_bomb", !1);
};
t.prototype.put = function(e, t, o) {
var n = a.default.gameLogic().putSoundName(e, t);
n && this._playGender(n, o, !1);
this._playEffect("put_card", !1);
};
t.prototype.warningOnly1 = function(e) {
var t = "warning_only_1";
i.default.config.index === r.eGameIds.XSWSK && (t = "baojing1");
this._playGender(t, e, !1);
};
t.prototype.warningOnly2 = function(e) {
var t = "warning_only_2";
i.default.config.index === r.eGameIds.XSWSK && (t = "baojing2");
this._playGender(t, e, !1);
};
t.prototype.showXiCard = function() {
this._playEffect("hall_roulette_replaceRoulette", !1);
};
t.prototype.callBankerHou = function() {
this._playEffect("hall_roulette_gifts", !1);
};
return t;
}(l.default);
o.default = u;
cc._RF.pop();
