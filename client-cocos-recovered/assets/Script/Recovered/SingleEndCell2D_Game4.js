// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a7f97hhJbRL061FoxKVq5xR", "SingleEndCell2D_Game4");
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
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("./SingleEndCell2D"), a = e("./RoomInfoData"), s = e("./SingleEndPlayerData"), l = e("./gContext"), c = e("./OperateConfig"), u = e("./HuTypeConfig"), d = e("./Loader"), p = e("./CardUtils"), f = e("./SingleEndCell2D_GameBase"), h = cc._decorator, m = h.ccclass, y = (h.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateUI = function(e) {
var t = this.node.getComponent(i.default), o = a.default.gameInfo.singleEndInfo.players[e], n = this._mulDesc(o), r = this._huDesc(o);
t.descLabel.string = n.join("  ") + "   " + r.join("  ");
var l = null;
o.huType > 0 && (l = "single_flag_hu");
o.specialFlag === s.eHuSpecial.YangGuangDing && (l = "single_flag_ygd");
o.specialFlag === s.eHuSpecial.ZhuDuZi && (l = "single_flag_zdz");
o.specialFlag === s.eHuSpecial.JingDing && (l = "single_flag_jd");
o.specialFlag === s.eHuSpecial.FengDing && (l = "single_flag_fd");
l && d.default.setImg("Hall/Res/Texture/Game/GameEnd/" + l, t.huFlag);
if (o.huType > 0) {
var c = a.default.gameInfo.pz;
if (p.default.cardColor(c) === p.eCardColor.wind) a.default.config.isChecked(13) && d.default.setImg("Hall/Res/Texture/Game/GameEnd/single_rule_fb", t.ruleFlag); else {
var u = p.default.cardValue(c);
2 !== u && 5 !== u && 8 !== u || a.default.config.isChecked(14) && d.default.setImg("Hall/Res/Texture/Game/GameEnd/single_rule_jb", t.ruleFlag);
}
}
};
t.prototype._mulDesc = function(e) {
var t = [], o = a.default.players.getByUid(e.uid).pos, n = a.default.gameInfo.siteInfos.get(o).operateList, r = n.collection(function(e) {
return e.category === c.eOperateCategory.PiZi;
});
t.push("痞子杠：" + r.length);
var i = n.collection(function(e) {
return e.category === c.eOperateCategory.LaiZi;
});
t.push("癞子杠：" + i.length);
var s = e.mul;
t.push("番数：" + s);
return t;
};
t.prototype._huDesc = function(e) {
var t = a.default.config.index, o = e.huType, n = [];
if (o > 0) {
var r = o & ~(1920 | (s = 64));
n = u.default.configDesc(t, r);
var i = u.default.getHuWayInfo(t, o, [ 256, s, 128, 1024 ]);
if (i) n.push(i.desc); else {
l.default.gameLogic().isZiMo(o) && n.push("自摸");
}
} else if (!a.default.gameInfo.singleEndInfo.isLiuJu()) {
if (a.default.gameInfo.singleEndInfo.isZiMoEnd()) ; else {
var s = 64;
a.default.gameInfo.singleEndInfo.checkHuUserBit(s) ? e.isBQGUser() && (n = [ "被抢杠" ]) : e.isDPUser() && (n = [ "放炮" ]);
}
}
return n;
};
return t = r([ m ], t);
}(f.default));
o.default = y;
cc._RF.pop();
