// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c9a1aoGTdxKsrxO//OxeT/d", "GameSoundDDZ");
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
var r = e("./Singleton"), i = e("./SoundUtils"), a = e("./pb"), s = e("./DDZCardUtils"), l = e("./CommonEnum"), c = e("./GameConfig"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype._playEffect = function(e, t) {
void 0 === t && (t = !1);
i.default.playEffect("Games/ddz/Sound/effect/" + e, t);
};
t.prototype._playGender = function(e, t, o) {
void 0 === o && (o = !1);
if (t === a.pb.eGender.WOMAN) {
var n = "Games/ddz/Sound/woman/";
i.default.playEffect(n + e, o);
} else {
n = "Games/ddz/Sound/man/";
i.default.playEffect(n + e, o);
}
};
t.prototype.clock = function() {
this._playEffect("clock", !1);
};
t.prototype.dealCard = function() {
this._playEffect("deal_card", !1);
};
t.prototype.selectCard = function() {
this._playEffect("select_card", !1);
};
t.prototype.selectCardEnd = function() {
this._playEffect("select_card_end", !1);
};
t.prototype.gameLose = function() {
this._playEffect("gamelose", !1);
};
t.prototype.gameWin = function() {
this._playEffect("gamewin", !1);
};
t.prototype.pass = function(e) {
var t = "buyao" + Math.floor(4 * Math.random());
this._playGender(t, e, !1);
};
t.prototype.jiaoDiZhu = function(e, t) {
var o = "BJDZ";
1 == e ? o = "JDZ" : 2 == e ? o = "BJB" : 3 == e && (o = "JB");
this._playGender(o, t, !1);
};
t.prototype.warningOnly = function(e, t) {
1 === t ? this._playGender("warning", e, !1) : 2 === t && this._playGender("warning2", e, !1);
};
t.prototype.wzSound = function(e) {
e && this._playEffect(e, !1);
};
t.prototype.put = function(e, t, o, n) {
var r = this._putSoundName(e, t, o);
r ? this._playGender(r, n, !1) : this._playEffect("xiaopai", !1);
};
t.prototype._putSoundName = function(e, t, o) {
if (e === s.eDDZOneHandType.Single) return s.default.soundName("put_single", t[0]);
if (e === s.eDDZOneHandType.Double) return s.default.soundName("put_double", t[0]);
if (e === s.eDDZOneHandType.SoftBomb || e === s.eDDZOneHandType.HardBomb) return "put_other_bomb";
if (e === s.eDDZOneHandType.KINGBOMB) return "wz_common";
var n = null;
e === s.eDDZOneHandType.Three && (n = s.default.soundName("put_three", t[0]));
e === s.eDDZOneHandType.ThreeOne && (n = "put_other_sandaiyi");
e === s.eDDZOneHandType.ThreeTwo && (n = "put_other_sandaiyidui");
e !== s.eDDZOneHandType.FeiJiOne && e !== s.eDDZOneHandType.FeiJiTwo && e !== s.eDDZOneHandType.FeiJi || (n = "put_other_feiji");
e === s.eDDZOneHandType.ShunZi && (n = "put_other_shunzi");
e === s.eDDZOneHandType.LianDui && (n = "put_other_liandui");
e !== s.eDDZOneHandType.FourOne && e !== s.eDDZOneHandType.FourTwo || (n = "put_other_sd2");
return n ? c.default.area() === l.eArea.QJ ? n : o ? n : this._randomBigger() : null;
};
t.prototype._randomBigger = function() {
return "dani" + Math.floor(3 * Math.random());
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
