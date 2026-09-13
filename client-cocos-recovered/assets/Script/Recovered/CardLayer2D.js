// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "80da1/gqG9NyINGxwygKvFB", "CardLayer2D");
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
var i = require("./RoomInfoData"), a = require("./CommonEnum"), s = require("./CardShowCtr2D"), l = require("./CardUtils"), c = require("./GangShowCtr2D"), u = require("./CardPosConfig2D"), d = require("./CardsManage2D"), p = require("./CardHandCtr"), f = require("./OperateListData"), h = require("./CommonUtils"), m = require("./GameInfoData"), y = require("./CardLayerBase"), g = require("./gContext"), _ = require("./RoomUtils"), v = cc.v2(-640, -360), C = cc._decorator, b = C.ccclass, D = C.property, S = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cardsManage2D = null;
t.cardPointer = null;
return t;
}
t.prototype.start = function() {};
t.prototype._updateCardPointer = function() {
var e = this.getShowCardPointerPos();
if (e >= 0) {
this.cardPointer.active = !0;
var t = _.default.getInstance().deskPos2ViewPos(e), o = i.default.gameInfo.siteInfos.get(e).outCards.length;
if (o > 0) {
var n = this.cardsManage2D.out(t, o - 1), r = [ cc.v2(0, 25), cc.v2(0, 22), cc.v2(0, 25), cc.v2(0, 22) ], a = r[t].x, s = r[t].y;
this.cardPointer.x = n.parent.position.x + n.position.x + a;
this.cardPointer.y = n.parent.position.y + n.position.y + s;
} else this.cardPointer.active = !1;
} else this.cardPointer.active = !1;
};
t.prototype._updateHand = function(e, t) {
this.cardsManage2D.hideHand(t);
this.cardsManage2D.hideHandShow(t);
i.default.gameInfo.status === m.eGameStatus.Gameing ? i.default.isPlayback() ? this._updateHandShow(e, t) : i.default.isWatcher() ? this._updateHandShow(e, t) : this._updateHandHide(e, t) : i.default.gameInfo.status !== m.eGameStatus.SingleEnd && i.default.gameInfo.status !== m.eGameStatus.TotalEnd || this._updateHandShow(e, t);
};
t.prototype._updateHandShow = function(e, t) {
for (var o = e.handCards.length, n = u.default[t].handShowGrid, r = this._handBeginPos(o, t, n), i = e.getSortedHandCards(), a = i.length, c = h.default.b3N2(a), d = 0, p = a; d < p; d++) {
var f = i[d];
(_ = this.cardsManage2D.handShow(t, d)).getComponent(s.default).setData(l.eCardShowType.Gang, f);
if (c && d === p - 1) {
var m = u.default[t].lastHandSpace, y = cc.v2(n.spacing.width * (o - 1) + m.x, n.spacing.height * (o - 1) + m.y);
_.position = r.add(y);
} else this._updateCard(_, d, u.default[t].handShowGrid, r);
}
var g = e.huCard();
if (g > 0) {
var _;
(_ = this.cardsManage2D.handShow(t, a)).getComponent(s.default).setData(l.eCardShowType.Gang, g);
m = u.default[t].lastHandSpace, y = cc.v2(n.spacing.width * a + m.x, n.spacing.height * a + m.y);
_.position = r.add(y);
}
};
t.prototype._updateHandHide = function(e, t) {
for (var o = e.handCards.length, n = u.default[t].handGrid, r = this._handBeginPos(o, t, n), i = e.getSortedHandCards(), c = h.default.b3N2(i.length), d = 0, f = i.length; d < f; d++) {
var m = i[d], y = this.cardsManage2D.hand(t, d), _ = y.getComponent(s.default);
_.setData(l.eCardShowType.Hand, m);
if (t === a.eViewPos.Down) {
var v = _.handRoot.getComponent(p.default);
v || (v = _.handRoot.addComponent(p.default)).init(y);
v.setData(m, d, this);
v.tingTipActive = !1;
if (c) {
g.default.gameLogic().isTing(e, m) && (v.tingTipActive = !0);
}
}
if (c && d === f - 1) {
var C = u.default[t].lastHandSpace, b = cc.v2(n.spacing.width * (o - 1) + C.x, n.spacing.height * (o - 1) + C.y);
y.position = r.add(b);
} else this._updateCard(y, d, u.default[t].handGrid, r, 200);
}
};
t.prototype._updateGang = function(e, t) {
this.cardsManage2D.hideGang(t);
for (var o = u.default[t].gangGrid, n = v.add(o.beginPos), r = e.operateList.collection(f.default.filterGangShows), i = 0; i < r.length; i++) {
var a = this.cardsManage2D.gang(t, i), s = a.getComponent(c.default), l = e.operateList.get(r[i]), d = _.default.getInstance().isAnGangShow(t);
s.setData(l, e.pos, d, !0);
this._updateCard(a, i, o, n);
}
};
t.prototype._updatePiZi = function(e, t) {
this.cardsManage2D.hidePiZi(t);
for (var o = u.default[t].piZiGrid, n = v.add(o.beginPos), r = e.operateList.collection(f.default.filterPiZiShows), i = [], a = 0; a < r.length; a++) {
void 0 != (c = e.operateList.get(r[a])).cards[0] && i.push(r[a]);
}
for (a = 0; a < i.length; a++) {
var c = e.operateList.get(i[a]), d = this.cardsManage2D.pizi(t, a);
d.getComponent(s.default).setData(l.eCardShowType.Out, c.cards[0]);
this._updateCard(d, a, o, n);
}
};
t.prototype._updateOut = function(e, t) {
this.cardsManage2D.hideOut(t);
var o = u.default[t].outGrid;
t !== a.eViewPos.Up && t !== a.eViewPos.Down || _.default.getInstance().isErRen() && (o = u.default[t].outGrid2);
for (var n = v.add(o.beginPos), r = e.outCards, i = r.length, c = 0; c < i; c++) {
var d = r[c];
(h = this.cardsManage2D.out(t, c)).getComponent(s.default).setData(l.eCardShowType.Out, d);
this._updateCard(h, c, o, n);
}
for (var p = e.surplusCards, f = (c = 0, p.length); c < f; c++) {
var h, m = c + i;
d = p[c];
(h = this.cardsManage2D.out(t, m)).getComponent(s.default).setData(l.eCardShowType.Out, d, !0, !0);
this._updateCard(h, m, o, n);
}
};
t.prototype._handBeginPos = function(e, t, o) {
var n = u.default[t].gangGrid, r = u.default[t].gangSpaceToHand, i = o.beginPos.x, a = o.beginPos.y, s = 4 - Math.floor(e / 3);
if (s > 0) {
var l = n.spacing.width, c = n.spacing.height, d = s - 1 + .5, p = cc.size(l * d, c * d), f = cc.v2(o.spacing.width / 2, o.spacing.height / 2);
if (0 === r.y) {
i = n.beginPos.x + p.width + r.x + f.x;
a = o.beginPos.y;
} else if (0 == r.x) {
i = o.beginPos.x;
a = n.beginPos.y + p.height + r.y + f.y;
} else cc.error("手牌offset 配置错误");
}
var h = cc.v2(i, a);
return v.add(h);
};
t.prototype._updateCard = function(e, t, o, n, r) {
void 0 === r && (r = 100);
var i = n, a = o.zAdd, s = o.line, l = o.column, c = o.spacing.width, u = o.spacing.height, d = r + t * a;
e.zIndex = d;
var p = 0, f = 0;
if (s > 0) {
p = t % s;
f = Math.floor(t / s);
} else if (l > 0) {
p = Math.floor(t / l);
f = t % l;
} else cc.error("line row error.");
e.x = i.x + f * c;
e.y = i.y + p * u;
};
r([ D(d.default) ], t.prototype, "cardsManage2D", void 0);
r([ D(cc.Node) ], t.prototype, "cardPointer", void 0);
return t = r([ b ], t);
}(y.default);
o.default = S;
cc._RF.pop();
