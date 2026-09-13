// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9aa9ftO42JFvJS07JeJKeT1", "SingleEndCell2D_Game15");
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
var i = e("./SingleEndCell2D_GameBase"), a = e("./RoomInfoData"), s = e("./OperateConfig"), l = e("./HuTypeConfig"), c = e("./gContext"), u = e("./SingleEndCell2D"), d = e("./Loader"), p = cc._decorator, f = p.ccclass, h = (p.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateUI = function(e) {
var t = this.node.getComponent(u.default), o = a.default.gameInfo.singleEndInfo.players[e], n = this._mulDesc(o), r = this._huDesc(o);
t.descLabel.string = n.join("  ") + "  " + r.join("  ");
if (o.huType > 0) {
d.default.setImg("Hall/Res/Texture/Game/GameEnd/single_flag_hu", t.huFlag);
}
};
t.prototype._mulDesc = function(e) {
var t = [], o = a.default.players.getByUid(e.uid).pos, n = a.default.gameInfo.siteInfos.get(o).operateList.collection(function(e) {
return e.category === s.eOperateCategory.Gang;
});
t.push("杠牌次数：" + n.length);
return t;
};
t.prototype._huDesc = function(e) {
var t = a.default.config.index, o = e.huType, n = [];
if (o > 0) if ((n = l.default.customDesc(t, o)).length > 0) {
c.default.gameLogic().isZiMo(o) && n.push("自摸");
} else {
var r = o & ~(s = 8);
n = l.default.configDesc(t, r);
var i = l.default.getHuWayInfo(t, o, [ s ]);
if (i) n.push(i.desc); else {
c.default.gameLogic().isZiMo(o) && n.push("自摸");
}
} else if (!a.default.gameInfo.singleEndInfo.isLiuJu()) {
if (a.default.gameInfo.singleEndInfo.isZiMoEnd()) ; else {
var s = 8;
a.default.gameInfo.singleEndInfo.checkHuUserBit(s) ? e.isBQGUser() && (n = [ "被抢杠" ]) : e.isDPUser() && (n = [ "放炮" ]);
}
}
return n;
};
return t = r([ f ], t);
}(i.default));
o.default = h;
cc._RF.pop();
