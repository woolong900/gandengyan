// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "03ebfXuXx5EF5dcSrMfm+Vg", "GameSoundPDK");
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
var r = require("./Singleton"), i = require("./SoundUtils"), a = require("./pb"), s = require("./PDKCardUtils"), l = require("./CommonEnum"), c = require("./GameConfig"), u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype._playEffect = function(e, t) {
void 0 === t && (t = !1);
i.default.playEffect("Games/pdk/Sound/effect/" + e, t);
};
t.prototype._playGender = function(e, t, o) {
void 0 === o && (o = !1);
if (t === a.pb.eGender.WOMAN) {
var n = "Games/pdk/Sound/woman/";
i.default.playEffect(n + e, o);
} else {
n = "Games/pdk/Sound/man/";
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
t.prototype.warningOnly1 = function(e) {
this._playGender("warning", e, !1);
};
t.prototype.put = function(e, t, o, n) {
var r = this._putSoundName(e, t, o);
r ? this._playGender(r, n, !1) : this._playEffect("xiaopai", !1);
};
t.prototype._putSoundName = function(e, t, o) {
if (e === s.ePDKOneHandType.Single) return s.default.soundName("put_single", t[0]);
if (e === s.ePDKOneHandType.Double) return s.default.soundName("put_double", t[0]);
if (e === s.ePDKOneHandType.BOMB) return "put_other_bomb";
var n = null;
e === s.ePDKOneHandType.Three && (n = s.default.soundName("put_three", t[0]));
e === s.ePDKOneHandType.Three1 && (n = "put_other_sandaiyi");
e === s.ePDKOneHandType.Three2 && (n = "put_other_sandaiyidui");
e !== s.ePDKOneHandType.FeiJiFull && e !== s.ePDKOneHandType.FeiJiLack || (n = "put_other_feiji");
e === s.ePDKOneHandType.ShunZi && (n = "put_other_shunzi");
e === s.ePDKOneHandType.LianDui && (n = "put_other_liandui");
e !== s.ePDKOneHandType.Four2 && e !== s.ePDKOneHandType.Four2_AAA || (n = "put_other_4_2");
e !== s.ePDKOneHandType.Four3 && e !== s.ePDKOneHandType.Four3_AAA || (n = "put_other_4_3");
if (n) {
if (c.default.area() === l.eArea.QJ) return n;
if (o) return n;
this._randomBigger();
}
return null;
};
t.prototype._randomBigger = function() {
return "dani" + Math.floor(3 * Math.random());
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
