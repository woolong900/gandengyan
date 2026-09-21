// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "949e0PeY9lPH6VQf2lVnWhD", "OperateCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonUtils"), r = require("./OperateConfig"), i = require("./CommonEnum"), a = require("./HuTypeConfig"), s = require("./gContext"), l = require("./Constants"), c = function() {
function e(e) {
this.category = 0;
this.cards = [];
this.draw_card = [];
this.smallText = null;
this.bigImgPath = null;
this.tableShowText = null;
this.subType = -1;
this.weight = 0;
this._pointTo = -1;
this._pengIsBuGang = !1;
this.category = e.index;
this.subType = e.subType;
var t = e.cards || [];
this.draw_card = e.draw_card || [];
this._pointTo = e.pointTo;
this.cards = n.default.clone(t);
this.smallText = this._initSmallText();
this.bigImgPath = this._initBigImgPath();
this.tableShowText = this._initTableShowText();
this.weight = r.default[this.category] ? r.default[this.category].weight : 1;
if (this.category === r.eOperateCategory.Peng) {
var o = this.cards[0];
this.cards = [ o, o, o ];
} else if (this.category === r.eOperateCategory.Gang) {
o = this.cards[0];
s.default.gameLogic().is3CardGang(o) ? this.cards = [ o, o, o ] : this.subType === r.eGangType.BuGang ? this.cards = [ o ] : this.cards = [ o, o, o, o ];
}
}
e.prototype.pointTo = function(e) {
var t = l.default.DeskMaskMJ, o = this._pointTo;
return e === o ? -1 : o === (e - 1 + t) % t ? i.eViewPos.Left : o === (e + 1 + t) % t ? i.eViewPos.Right : o === (e + 2) % t ? i.eViewPos.Up : -1;
};
e.prototype.setPengIsGang = function() {
this.category === r.eOperateCategory.Peng ? this._pengIsBuGang = !0 : cc.error("只有碰的牌，补杠的时候才能修改此状态.");
};
e.prototype.pengIsGang = function() {
return this._pengIsBuGang;
};
e.prototype.isInOutStatis = function() {
if (this.cards.length > 0) {
if (-1 !== [ r.eOperateCategory.PiZi, r.eOperateCategory.LaiZi, r.eOperateCategory.Peng, r.eOperateCategory.Chi, r.eOperateCategory.Gang ].indexOf(this.category)) return !0;
}
return !1;
};
e.prototype.isAnGang = function() {
return this.category === r.eOperateCategory.Gang && this.subType === r.eGangType.AnGang;
};
e.prototype.isDingGang = function() {
return this.category === r.eOperateCategory.Gang && this.subType === r.eGangType.MingGang;
};
e.prototype.isLiangLai = function() {
return this.category === r.eOperateCategory.WarnLL;
};
e.prototype.isWarn_qys = function() {
return this.category === r.eOperateCategory.WarnQYS;
};
e.prototype.isWarn_jys = function() {
return this.category === r.eOperateCategory.WarnJYS;
};
e.prototype.isWarn_qqr = function() {
return this.category === r.eOperateCategory.WarnQQR;
};
e.prototype.isWarn_fys = function() {
return this.category === r.eOperateCategory.WarnFYS;
};
e.prototype.isShowCard = function() {
return this.category === r.eOperateCategory.ShowCard;
};
e.prototype.showCardStage = function() {
return this.category === r.eOperateCategory.LiangDao;
};
e.prototype.isWarn = function() {
return -1 !== [ r.eOperateCategory.WarnLL, r.eOperateCategory.WarnFYS, r.eOperateCategory.WarnJYS, r.eOperateCategory.WarnQYS, r.eOperateCategory.WarnQQR, r.eOperateCategory.ShowCard, r.eOperateCategory.LiangDao ].indexOf(this.category);
};
e.prototype._initSmallText = function() {
var e = r.default[this.category];
return e ? e.smallText : "";
};
e.prototype._initBigImgPath = function() {
var e = r.default[this.category] ? r.default[this.category].bigImg : null;
return e ? "Hall/Res/Texture/Game/operates/big/" + e : null;
};
e.prototype._initTableShowText = function() {
var e = r.default[this.category];
return e ? e.tableShowText : null;
};
e.prototype.animationPath = function(e) {
var t = this._animationName(e);
return t ? "Hall/Res/Texture/Game/operates/animate/" + t : null;
};
e.prototype.sound = function(e) {
switch (this.category) {
case r.eOperateCategory.Guo:
return null;

case r.eOperateCategory.Hu:
return this._huSound(e, this.subType);

case r.eOperateCategory.Gang:
if (this.subType === r.eGangType.AnGang) return s.default.gameLogic().soundAg(this.cards[0]);
if (this.subType === r.eGangType.BuGang) return s.default.gameLogic().soundBg(this.cards[0]);
if (this.subType === r.eGangType.MingGang) return s.default.gameLogic().soundMg(this.cards[0]);
break;

case r.eOperateCategory.Peng:
return s.default.gameLogic().soundPeng(this.cards[0]);

case r.eOperateCategory.Chi:
return "chi";

case r.eOperateCategory.LaiZi:
return s.default.gameLogic().soundLZ(this.cards[0]);

case r.eOperateCategory.PiZi:
return s.default.gameLogic().soundPZ(this.cards[0]);

case r.eOperateCategory.LiangDao:
return null;
}
return null;
};
e.prototype._animationName = function(e) {
switch (this.category) {
case r.eOperateCategory.Guo:
return null;

case r.eOperateCategory.Hu:
return this._huAnimationName(e, this.subType);

case r.eOperateCategory.Gang:
if (this.subType === r.eGangType.AnGang) return s.default.gameLogic().animationAg(this.cards[0]);
if (this.subType === r.eGangType.BuGang) return s.default.gameLogic().animationBg(this.cards[0]);
if (this.subType === r.eGangType.MingGang) return s.default.gameLogic().animationMg(this.cards[0]);
break;

case r.eOperateCategory.Peng:
return "peng";

case r.eOperateCategory.Chi:
return "chi";

case r.eOperateCategory.LaiZi:
return s.default.gameLogic().animationLZ(this.cards[0]);

case r.eOperateCategory.PiZi:
return s.default.gameLogic().animationPZ(this.cards[0]);

case r.eOperateCategory.WarnLL:
return "lianglai";

case r.eOperateCategory.WarnQYS:
return "baoqingyise";

case r.eOperateCategory.WarnJYS:
return "baojiangyise";

case r.eOperateCategory.WarnQQR:
return "baoquanqiuren";

case r.eOperateCategory.WarnFYS:
return "baofengyise";

case r.eOperateCategory.ShowCard:
return "liangpai";

case r.eOperateCategory.XXF:
return "xxf";

case r.eOperateCategory.LiangDao:
return "liangdao";
}
return null;
};
e.prototype._sortIds = function(e) {
var t = Object.keys(e);
t.sort(function(t, o) {
return e[t].weight - e[o].weight;
});
return t;
};
e.prototype._huAnimationName = function(e, t) {
for (var o = "hu", r = a.HuTypeBitConfig[e], i = this._sortIds(r), s = 0; s < i.length; s++) {
var l = parseInt(i[s]);
if (n.default.checkBit(t, l)) {
o = r[l].animation || o;
break;
}
}
return o;
};
e.prototype._huSound = function(e, t) {
var o = null, r = a.HuTypeBitConfig[e];
if (e === i.eGameIds.QJHH && r[16] && n.default.checkBit(t, 16)) return r[16].sound || "hu";
for (var h = this._sortIds(r), l = 0; l < h.length; l++) {
var c = parseInt(h[l]);
if (n.default.checkBit(t, c)) {
o = r[c].sound;
break;
}
}
o || (o = s.default.gameLogic().isZiMo(t) ? "zimo" : "hu");
return o;
};
return e;
}();
o.default = c;
cc._RF.pop();
