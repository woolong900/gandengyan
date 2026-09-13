// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1d7e8uVWRVAIoSRlMjlEIRO", "GameSoundD7");
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
var r = e("./Singleton"), i = e("./SoundUtils"), a = e("./pb"), s = e("./D7CardUtils"), l = e("./RoomInfoData"), c = e("./gContext"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype._playEffect = function(e, t) {
void 0 === t && (t = !1);
i.default.playEffect("Games/d7/Sound/effect/" + e, t);
};
t.prototype._playGender = function(e, t, o) {
void 0 === o && (o = !1);
if (t === a.pb.eGender.WOMAN) {
var n = "Games/d7/Sound/woman/";
i.default.playEffect(n + e, o);
} else {
n = "Games/d7/Sound/man/";
i.default.playEffect(n + e, o);
}
};
t.prototype.dealCard = function(e) {
e ? this._playEffect("end_fapai", !1) : this._playEffect("fapai", !1);
};
t.prototype.gameStart = function() {
this._playEffect("gamestart", !1);
};
t.prototype.clock = function() {
this._playEffect("remind", !1);
};
t.prototype.gameLose = function() {
this._playEffect("gamelose", !1);
};
t.prototype.gameWin = function() {
this._playEffect("gamewin", !1);
};
t.prototype.showFirend = function() {
this._playEffect("mingji", !1);
};
t.prototype.selectCard = function() {
this._playEffect("select_card", !1);
};
t.prototype.getScore = function() {
this._playEffect("zhuafen", !1);
};
t.prototype.fan = function(e) {
this._playGender("action/sound_fanzhu", e, !1);
};
t.prototype.jiao = function(e) {
this._playGender("action/sound_jiaozhu", e, !1);
};
t.prototype.giveUp = function(e) {
this._playGender("action/sound_touxiang", e, !1);
};
t.prototype.put = function(e, t, o, n) {
var r = this._putSoundName(e);
r ? this._playGender(r, t, !1) : this._playEffect("xiaopai", !1);
};
t.prototype._putSoundName = function(e) {
var t = c.default.gameLogic().isSupportAKK(l.default.config), o = c.default.gameLogic().isSupportAKKQQ(l.default.config);
if (s.default.isValid(e, t, o, l.default.gameInfoD7.mainCard)) {
var n = e.length;
if (1 === n) {
var r = "single_";
if (i = s.default.soundName(e[0])) return "" + r + i;
}
if (2 === n) {
var i;
r = "couple_";
if (i = s.default.soundName(e[0])) return "" + r + i;
}
return n % 2 != 1 ? "tuolaji" : n <= 13 ? "bianlun_" + n : void 0;
}
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
