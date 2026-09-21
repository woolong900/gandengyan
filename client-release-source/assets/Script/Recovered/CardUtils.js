// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "403095uyWhOhbtlc5aQENV0", "CardUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonEnum"), r = require("./pb");
o.MJ_BACK_ID = -1;
o.MJ_HIDE_ID = -2;
o.MJ_HZ_ID = 31;
o.CARD_COLOR_NORMAL = cc.color(255, 255, 255);
o.CARD_COLOR_LAIZI = cc.color(255, 250, 109);
o.CARD_COLOR_SELECT = cc.color(180, 180, 180);
o.CARD_COLOR_LIANGDAO = cc.color(210, 210, 210);
(function(e) {
e[e.Bamboo = 0] = "Bamboo";
e[e.Dots = 1] = "Dots";
e[e.Characters = 2] = "Characters";
e[e.wind = 3] = "wind";
})(o.eCardColor || (o.eCardColor = {}));
(function(e) {
e[e.Hand = 1] = "Hand";
e[e.Out = 2] = "Out";
e[e.Gang = 3] = "Gang";
e[e.PaiDun = 4] = "PaiDun";
e[e.LiangDao = 5] = "LiangDao";
})(o.eCardShowType || (o.eCardShowType = {}));
(function(e) {
e[e.Zhong = 31] = "Zhong";
e[e.Fa = 32] = "Fa";
e[e.Bai = 33] = "Bai";
e[e.Dong = 34] = "Dong";
e[e.Nan = 35] = "Nan";
e[e.Xi = 36] = "Xi";
e[e.Bei = 37] = "Bei";
})(o.eCardWind || (o.eCardWind = {}));
var i = function() {
function e() {}
e.isHide = function(e) {
return e === o.MJ_HIDE_ID;
};
e.isCovered = function(e) {
if (e === o.MJ_BACK_ID) return !0;
};
e.cardColor = function(e) {
return this._color(e);
};
e.cardValue = function(e) {
return this._value(e);
};
e.card = function(e, t) {
return 10 * e + t;
};
e._color = function(e) {
return Math.floor(e / 10);
};
e._value = function(e) {
return e % 10;
};
e.cardImgPath = function(e, t) {
var o = this._color(e), r = this._value(e);
if (!this._isNaN(o) && !this._isNaN(r)) return t === n.eGameView.View2D ? "Hall/Res/Texture/Card/MJ2D/mj_" + o + "_" + r : "Hall/Res/Texture/Card/MJ3D/mj_" + o + "_" + r;
};
e._isNaN = function(e) {
return e != e;
};
e.cardSoundPath = function(e, t) {
var o = this._color(e), n = this._value(e);
return t === r.pb.eGender.WOMAN ? "gender/woman/cards/mj_" + o + "_" + n : "gender/man/cards/mj_" + o + "_" + n;
};
return e;
}();
o.default = i;
cc._RF.pop();
