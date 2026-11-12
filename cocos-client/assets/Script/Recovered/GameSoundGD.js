// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "26c91qc5x9Ig4fKQT4XcqZ1", "GameSoundGD");
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
var r = require("./Singleton"), i = require("./SoundUtils"), a = require("./pb"), s = require("./CommonEnum"), l = require("./GameConfig"), c = require("./GDCardUtils"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype._playEffect = function(e, t) {
void 0 === t && (t = !1);
i.default.playEffect("Games/gd/Sound/effect/" + e, t);
};
t.prototype._playGender = function(e, t, o) {
void 0 === o && (o = !1);
if (t === a.pb.eGender.WOMAN) {
var n = "Games/gd/Sound/woman/";
i.default.playEffect(n + e, o);
} else {
n = "Games/gd/Sound/man/";
i.default.playEffect(n + e, o);
}
};
t.prototype.clock = function() {
this._playEffect("clock", !1);
};
t.prototype.showFirendCard = function() {
this._playEffect("show_firend_card", !1);
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
t.prototype.cardRound = function() {
this._playEffect("card_round", !1);
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
if (e === c.eGDOneHandType.Single) return c.default.soundName("put_single", t[0]);
if (e === c.eGDOneHandType.Double) return c.default.soundName("put_double", t[0]);
if (e >= c.eGDOneHandType.SiBomb && e != c.eGDOneHandType.TongHuaShun && e != c.eGDOneHandType.KINGBOMB) return "put_other_bomb";
if (e === c.eGDOneHandType.KINGBOMB) return "wz_common";
var n = null;
e === c.eGDOneHandType.Three && (n = c.default.soundName("put_three", t[0]));
e === c.eGDOneHandType.ThreeTwo && (n = "put_other_sandaiyidui");
e !== c.eGDOneHandType.FeiJiOne && e !== c.eGDOneHandType.FeiJiTwo && e !== c.eGDOneHandType.FeiJi || (n = "put_other_feiji");
e === c.eGDOneHandType.ShunZi && (n = "put_other_shunzi");
e === c.eGDOneHandType.LianDui && (n = "put_other_liandui");
e === c.eGDOneHandType.FeiJi && (n = "gangban");
e === c.eGDOneHandType.TongHuaShun && (n = "ths");
return n ? l.default.area() === s.eArea.QJ ? n : o ? n : this._randomBigger() : null;
};
t.prototype._randomBigger = function() {
return "dani" + Math.floor(3 * Math.random());
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
