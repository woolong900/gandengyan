// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1d3ddoUj3tIsrdsCWUtiOpQ", "GameSoundMJ");
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
var r = e("./Singleton"), i = e("./SoundUtils"), a = e("./pb"), s = e("./CardUtils"), l = e("./RoomInfoData"), c = e("./CommonEnum"), u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._base = "Hall/Sound/";
return t;
}
t.prototype.playEffect = function(e, t) {
void 0 === t && (t = !1);
this._playEffect(this._base, e, t);
};
t.prototype._playEffect = function(e, t, o) {
void 0 === o && (o = !1);
i.default.playEffect(e + t, o);
};
t.prototype.clickCard = function() {
this.playEffect("clickCard", !1);
};
t.prototype.outCard = function() {
this.playEffect("outCard", !1);
};
t.prototype.playOperate = function(e, t) {
if (e) {
var o = "";
o = t === a.pb.eGender.WOMAN ? "gender/woman/operates/" + e : "gender/man/operates/" + e;
this.playEffect(o, !1);
}
};
t.prototype.putCard = function(e, t) {
var o = s.default.cardSoundPath(e, t);
this.playEffect("outCard", !1);
l.default.config.index === c.eGameIds.TMHH ? this._playEffect("Games/mj15/Sound/", o) : this.playEffect(o);
};
t.prototype.dice = function() {
this.playEffect("dice", !1);
};
t.prototype.drawCard = function() {
this.playEffect("drawcard", !1);
};
t.prototype.gameBegin = function() {
this.playEffect("kaiju", !1);
};
t.prototype.gameEnd = function(e) {
e > 0 && this._gameEndWin();
0 === e && this._gameEndPass();
e < 0 && this._gameEndLose();
};
t.prototype._gameEndPass = function() {
this.playEffect("liuju", !1);
};
t.prototype._gameEndLose = function() {
this.playEffect("lose", !1);
};
t.prototype._gameEndWin = function() {
this.playEffect("win", !1);
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
