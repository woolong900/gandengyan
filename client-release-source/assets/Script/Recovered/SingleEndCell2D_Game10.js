// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ac35cK3Ah9MrrrdPA0uFbw+", "SingleEndCell2D_Game10");
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
var i = require("./SingleEndCell2D"), a = require("./RoomInfoData"), s = require("./OperateConfig"), l = require("./HuTypeConfig"), c = require("./Loader"), u = require("./SingleEndCell2D_GameBase"), d = cc._decorator, p = d.ccclass, f = (d.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateUI = function(e) {
var t = this.node.getComponent(i.default), o = a.default.gameInfo.singleEndInfo.players[e];
Math.abs(a.default.gameInfo.singleEndInfo.players[e].score) > 999 && (t.scoreLabel.node.x = t.scoreLabel.node.x - 30);
var n = this._mulDesc(o, a.default.gameInfo.singleEndInfo.horseSum), r = this._huDesc(o);
t.descLabel.string = n.join("  ") + "  " + r.join("  ");
if (o.huType > 0) {
c.default.setImg("Hall/Res/Texture/Game/GameEnd/single_flag_hu", t.huFlag);
}
};
t.prototype._mulDesc = function(e, t) {
var o = [], n = a.default.players.getByUid(e.uid).pos, r = a.default.gameInfo.siteInfos.get(n), i = r.operateList.collection(function(e) {
return e.category === s.eOperateCategory.Gang;
}), l = r.operateList.collection(function(e) {
return e.category === s.eOperateCategory.PiZi;
}), c = r.operateList.collection(function(e) {
return e.category === s.eOperateCategory.LaiZi;
});
o.push("杠牌次数：" + (i.length + l.length + c.length));
var u = e.mul;
o.push("番数：" + u);
e.huType > 0 && o.push("中马数：" + t);
return o;
};
t.prototype._huDesc = function(e) {
var t = a.default.config.index, o = e.huType, n = [];
if (o > 0) if ((n = l.default.customDesc(t, o)).length > 0) ; else {
var r = o & ~(64 | (s = 8));
n = l.default.configDesc(t, r);
var i = l.default.getHuWayInfo(t, o, [ 64, s ]);
i && n.push(i.desc);
} else if (!a.default.gameInfo.singleEndInfo.isLiuJu()) {
if (a.default.gameInfo.singleEndInfo.isZiMoEnd()) ; else {
var s = 8;
a.default.gameInfo.singleEndInfo.checkHuUserBit(s) ? e.isBQGUser() && (n = [ "被抢杠" ]) : e.isDPUser() && (n = [ "放炮" ]);
}
}
return n;
};
return t = r([ p ], t);
}(u.default));
o.default = f;
cc._RF.pop();
