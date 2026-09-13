// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c0c3ftla8dIDbHsXTXCMusC", "GangShowCtr2D");
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
var i = require("./CardShowCtr2D"), a = require("./CardUtils"), s = require("./OperateConfig"), l = require("./gContext"), c = require("./RoomInfoData"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cardShows = [];
return t;
}
t.prototype.setData = function(e, t, o, n) {
var r = e.cards;
if (e.category === s.eOperateCategory.Gang) {
var i = r[0];
if (l.default.gameLogic().is3CardGang(i)) {
this.cardShows[0].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[1].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[2].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[3].setData(a.eCardShowType.Gang, a.MJ_HIDE_ID);
} else if (e.isAnGang()) {
this.cardShows[0].setData(a.eCardShowType.Gang, a.MJ_BACK_ID);
this.cardShows[1].setData(a.eCardShowType.Gang, a.MJ_BACK_ID);
this.cardShows[2].setData(a.eCardShowType.Gang, a.MJ_BACK_ID);
o && i > 0 && !c.default.isWatcher() ? this.cardShows[3].setData(a.eCardShowType.Gang, r[0]) : this.cardShows[3].setData(a.eCardShowType.Gang, a.MJ_BACK_ID);
} else {
this.cardShows[0].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[1].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[2].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[3].setData(a.eCardShowType.Gang, r[0]);
}
} else if (e.category === s.eOperateCategory.Peng) {
this.cardShows[0].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[1].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[2].setData(a.eCardShowType.Gang, r[0]);
e.pengIsGang() ? this.cardShows[3].setData(a.eCardShowType.Gang, r[0]) : this.cardShows[3].setData(a.eCardShowType.Gang, a.MJ_HIDE_ID);
} else if (e.category === s.eOperateCategory.Chi) {
this.cardShows[0].setData(a.eCardShowType.Gang, r[0]);
this.cardShows[1].setData(a.eCardShowType.Gang, r[1]);
this.cardShows[2].setData(a.eCardShowType.Gang, r[2]);
this.cardShows[3].setData(a.eCardShowType.Gang, a.MJ_HIDE_ID);
} else if (e.category === s.eOperateCategory.LiangDao) {
this.cardShows[0].setData(a.eCardShowType.LiangDao, r[0]);
this.cardShows[1].setData(a.eCardShowType.LiangDao, r[1]);
this.cardShows[2].setData(a.eCardShowType.LiangDao, r[2]);
this.cardShows[3].setData(a.eCardShowType.LiangDao, a.MJ_HIDE_ID);
}
if (n && l.default.gameLogic().isShowArrow()) {
var u = !1, d = 0;
if (e.isDingGang()) {
u = !0;
d = l.default.gameLogic().is3CardGang(r[0]) ? 1 : 3;
}
if (e.category === s.eOperateCategory.Peng && !e.pengIsGang()) {
u = !0;
d = 1;
}
if (u) {
var p = e.pointTo(t);
this.cardShows[d].setData(a.eCardShowType.Gang, r[0], !0, !1, p);
}
}
};
r([ p(i.default) ], t.prototype, "cardShows", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
