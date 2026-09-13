// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "edaef1SSqBHq5SoTvaeRGa7", "GameSoundDBD");
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
var r = e("./Singleton"), i = e("./SoundUtils"), a = e("./pb"), s = e("./CommonEnum"), l = e("./GameConfig"), c = e("./DBDCardUtils"), u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._firstBuJiao = 0;
return t;
}
t.prototype._playEffect = function(e, t) {
void 0 === t && (t = !1);
i.default.playEffect("Games/dbd/Sound/effect/" + e, t);
};
t.prototype._playGender = function(e, t, o) {
void 0 === o && (o = !1);
if (t === a.pb.eGender.WOMAN) {
var n = "Games/dbd/Sound/woman/";
i.default.playEffect(n + e, o);
} else {
n = "Games/dbd/Sound/man/";
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
this._firstBuJiao = 0;
};
t.prototype.gameWin = function() {
this._playEffect("gamewin", !1);
this._firstBuJiao = 0;
};
t.prototype.pass = function(e) {
var t = "buyao" + Math.floor(4 * Math.random());
this._playGender(t, e, !1);
};
t.prototype.jiaoDiZhu = function(e, t) {
var o = "BJDZ";
if (1 === e) o = "JDZ"; else if (2 === e) {
o = "QDZ" + Math.floor(3 * Math.random());
} else 0 === e && (o = this._firstBuJiao > 0 ? "BQDZ" : "BJDZ");
this._playGender(o, t, !1);
e > 0 && (this._firstBuJiao = e);
};
t.prototype.jiaoScore = function(e, t) {
var o = "BJDZ";
if (e > 0) {
o = "QDZ" + Math.floor(3 * Math.random());
}
this._playGender(o, t, !1);
};
t.prototype.warningOnly1 = function(e) {
this._playGender("warning", e, !1);
};
t.prototype.put = function(e, t, o, n) {
var r = this._putSoundName(e, t, o);
r ? this._playGender(r, n, !1) : this._playEffect("xiaopai", !1);
};
t.prototype._putSoundName = function(e, t, o) {
if (e === c.eDBDOneHandType.Single) return c.default.soundName("put_single", t[0]);
if (e === c.eDBDOneHandType.Double) return c.default.soundName("put_double", t[0]);
if (e >= c.eDBDOneHandType.BOMB) return "put_other_bomb";
var n = null;
e === c.eDBDOneHandType.ShunZi && (n = "put_other_shunzi");
e === c.eDBDOneHandType.LianDui && (n = "put_other_liandui");
return n ? l.default.area() === s.eArea.QJ ? n : o ? n : this._randomBigger() : null;
};
t.prototype._randomBigger = function() {
return "dani" + Math.floor(3 * Math.random());
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
