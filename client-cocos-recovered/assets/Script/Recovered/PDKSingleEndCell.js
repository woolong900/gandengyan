// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fad578ZTCtEMYRUZFdJJz8g", "PDKSingleEndCell");
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
var i = require("./Image"), a = require("./PDKSingleEndData"), s = require("./RoomInfoData"), l = require("./StringUtils"), c = require("./Loader"), u = require("./PDKCardUtils"), d = require("./gContext"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.headImg = null;
t.nameLabel = null;
t.idLabel = null;
t.cardRoot = null;
t.flag10 = null;
t.chunTianRoot = null;
t.flagChunTian = null;
t.flagFanChun = null;
t.remainLabel = null;
t.bombLabel = null;
t.piaoLabel = null;
t.winLabel = null;
t.loseLabel = null;
return t;
}
t.prototype.setData = function(e) {
var t = a.default.getInstance(), o = t.playerUid(e), n = s.default.players.getByUid(o);
this.headImg.url = n.headImg;
this.nameLabel.string = l.default.clip(n.name, 6);
this.idLabel.string = "" + o;
var r = s.default.gameInfoPDK.siteInfos.get(n.pos).handCards, i = u.default.sortDesc(t.playerInitCards(e), !0);
this._updateCards(r, i);
this.flag10.active = !1;
d.default.gameLogic().isZhaNiao(s.default.config) && (this.flag10.active = u.default.isZhaNiao(i));
var c = t.playerIsChunTian(e), p = t.playerIsFanChun(e);
this.flagChunTian.active = c;
this.flagFanChun.active = p;
this.chunTianRoot.active = c || p;
this.remainLabel.string = "" + r.length;
this.bombLabel.string = "" + t.playerBomb(e);
this.piaoLabel.string = "" + t.playerPiao(e);
var f = t.playerScore(e);
if (f >= 0) {
this.winLabel.string = "" + f;
this.loseLabel.string = "";
} else {
this.winLabel.string = "";
this.loseLabel.string = "" + f;
}
};
t.prototype._updateCards = function(e, t) {
for (var o = 0, n = t.length; o < n; o++) {
var r = t[o], i = this.cardRoot.getChildByName("card_" + o), a = u.default.imgPath(r);
c.default.setImg(a, i);
-1 === e.indexOf(r) ? i.color = new cc.Color(138, 138, 138) : i.color = new cc.Color(255, 255, 255);
}
};
r([ h(i.default) ], t.prototype, "headImg", void 0);
r([ h(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ h(cc.Label) ], t.prototype, "idLabel", void 0);
r([ h(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ h(cc.Node) ], t.prototype, "flag10", void 0);
r([ h(cc.Node) ], t.prototype, "chunTianRoot", void 0);
r([ h(cc.Node) ], t.prototype, "flagChunTian", void 0);
r([ h(cc.Node) ], t.prototype, "flagFanChun", void 0);
r([ h(cc.Label) ], t.prototype, "remainLabel", void 0);
r([ h(cc.Label) ], t.prototype, "bombLabel", void 0);
r([ h(cc.Label) ], t.prototype, "piaoLabel", void 0);
r([ h(cc.Label) ], t.prototype, "winLabel", void 0);
r([ h(cc.Label) ], t.prototype, "loseLabel", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
