// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "eb64eFaA6xJHIy/l9o5q4ow", "CardLayer3D");
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
var i = require("./RoomInfoData"), a = require("./CommonEnum"), s = require("./CardsManage3D"), l = require("./GameInfoData"), c = require("./CommonUtils"), u = require("./CardHandCtr"), d = require("./OperateListData"), p = require("./gContext"), f = require("./EventKeys"), h = require("./EventUtils"), m = require("./CardLayerBase"), y = require("./CardHandShowCtr3D"), g = require("./Constants"), _ = require("./CardUtils"), v = require("./GameControl"), C = require("./RoomUtils"), b = require("./GameSoundMJ"), D = cc._decorator, S = D.ccclass, w = D.property, O = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._handAnimate = !1;
t._oldLastHandValue = -1;
t.cardsManage3D = null;
t.cardPointer = null;
return t;
}
t.prototype.onEnable = function() {
var t = this;
p.default.eventUtils.on([ f.default.data_put_card ], function(e, o) {
var n = i.default.myAbsolutePos();
o.pos === n && (t._handAnimate = !0);
}, this, h.eOffType.OnDisable);
e.prototype.onEnable.call(this);
};
t.prototype.initUI = function() {
this._handAnimate = !1;
e.prototype.initUI.call(this);
};
t.prototype._updateCardPointer = function() {
var e = this.getShowCardPointerPos();
if (e >= 0) {
this.cardPointer.active = !0;
var t = C.default.getInstance().deskPos2ViewPos(e), o = i.default.gameInfo.siteInfos.get(e).outCards.length;
if (o > 0) {
var n = C.default.getInstance().isErRen(), r = this._outIndex(t, o - 1, n), a = [ cc.v2(0, 23), cc.v2(0, 27), cc.v2(0, 25), cc.v2(0, 27) ], s = a[t].x, l = a[t].y, c = this.cardsManage3D.outCardPosition(t, r);
this.cardPointer.active = !0;
this.cardPointer.position = c.add(cc.v2(s, l));
} else this.cardPointer.active = !1;
} else this.cardPointer.active = !1;
};
t.prototype._updateHand = function(e, t) {
this.cardsManage3D.hideHand(t);
this.cardsManage3D.hideHandShow(t);
i.default.gameInfo.status === l.eGameStatus.Gameing ? i.default.isPlayback() ? this._updateHandShow(e, t) : i.default.isWatcher() ? this._updateHandShow(e, t) : this._updateHandHide(e, t) : i.default.gameInfo.status !== l.eGameStatus.SingleEnd && i.default.gameInfo.status !== l.eGameStatus.TotalEnd || this._updateHandShow(e, t);
};
t.prototype._updateHandShow = function(e, t) {
for (var o = e.handCards.length, n = e.getSortedHandCards(), r = e.huCard(), i = this._handBeginIndex(o), a = 0, s = n.length; a < s; a++) {
var l = n[a];
this.cardsManage3D.handShow(t, a + i, l);
}
r > 0 && this.cardsManage3D.handShow(t, 13, r);
};
t.prototype._updateHandHide = function(e, t) {
var o = e.handCards.length, n = c.default.b3N2(o);
t === a.eViewPos.Down && this.cardsManage3D.updateHandDownPos(o);
for (var r = this._handBeginIndex(o), i = e.getSortedHandCards(), s = [], l = 0; l < o; l++) {
var d = i[l], f = this.cardsManage3D.hand(t, l + r, d);
if (f) {
s.push(f);
if (t === a.eViewPos.Down) {
var h = f.getComponent(y.default);
h.setData(d);
var m = h.handRoot.getComponent(u.default);
m || (m = h.handRoot.addComponent(u.default)).init(f);
m.setData(d, l, this);
m.tingTipActive = !1;
if (n) {
p.default.gameLogic().isTing(e, d) && (m.tingTipActive = !0);
}
if (n && l === o - 1) {
f.x = this.handX(l, !0);
this._oldLastHandValue = d;
} else f.x = this.handX(l, !1);
f.y = 0;
}
}
}
if (this._handAnimate && t === a.eViewPos.Down) {
cc.log("do animate");
this._handAnimate = !1;
this._doAnimation(i, s, o);
}
};
t.prototype._doAnimation = function(e, t, o) {
var n = this, r = this.getLastPutIndex();
this.setLastPutIndex(-1);
if (r < 0) cc.log("服务器通知打牌~"); else if (r >= e.length) cc.log("打出去的是最后一张牌~"); else {
var i = this.findIndex(e, this._oldLastHandValue);
if (i >= 0 && r >= 0) {
var a = 1;
r > i && (a = -1);
var s = r, l = .5;
i === o - 1 && (l = .3);
for (;s !== i; ) {
var c = t[s], u = c.x, d = c.y, p = u + 85 * a, f = d;
c.position = cc.v2(p, f);
c.runAction(cc.moveTo(l, cc.v2(u, d)));
s += a;
}
(function() {
var e = t[i], r = e.x, a = e.y, s = n.handX(o, !0);
e.position = cc.v2(s, 0);
var l = null;
if (i === o - 1) l = cc.moveTo(.3, cc.v2(r, a)); else {
var c = e.zIndex, u = cc.callFunc(function() {
e.zIndex = 1e3;
}), d = cc.moveTo(.1, cc.v2(s, 20)), p = cc.moveTo(.3, cc.v2(r, 20)), f = cc.moveTo(.1, cc.v2(r, a)), h = cc.callFunc(function() {
e.zIndex = c;
});
l = cc.sequence(u, d, p, f, h);
}
e.runAction(l);
})();
}
}
};
t.prototype.handX = function(e, t) {
var o = 83 * e - 554.5;
t && (o += 32);
return o;
};
t.prototype.findIndex = function(e, t) {
for (var o = e.length - 1; o >= 0; o--) if (e[o] === t) return o;
return -1;
};
t.prototype._updateGang = function(e, t) {
this.cardsManage3D.hideGang(t);
for (var o = C.default.getInstance().isAnGangShow(t), n = e.operateList.collection(d.default.filterGangShows), r = 0; r < n.length; r++) {
var i = parseInt(n[r]), a = e.operateList.get(i);
this.cardsManage3D.gang(t, r, a, o, !0);
}
};
t.prototype._updatePiZi = function(e, t) {
this.cardsManage3D.hidePiZi(t);
for (var o = e.operateList.collection(d.default.filterPiZiShows), n = [], r = 0; r < o.length; r++) {
void 0 != e.operateList.get(o[r]).cards[0] && n.push(o[r]);
}
for (r = 0; r < n.length; r++) {
var i = e.operateList.get(n[r]).cards[0];
this.cardsManage3D.pizi(t, r, i);
}
};
t.prototype._updateOut = function(e, t) {
this.cardsManage3D.hideOut(t);
for (var o = e.outCards, n = o.length, r = C.default.getInstance().isErRen(), i = 0; i < n; i++) {
var a = o[i], s = this._outIndex(t, i, r);
this.cardsManage3D.out(t, s, a);
}
for (var l = e.surplusCards, c = (i = 0, l.length); i < c; i++) {
a = l[i], s = this._outIndex(t, i + n, r);
this.cardsManage3D.out(t, s, a, !0);
}
};
t.prototype._updatePaiDun = function(e, t) {
this.cardsManage3D.hidePaiDun(t);
for (var o = e.paiDunCards, n = 0, r = o.length; n < r; n++) {
var i = o[n];
this._updatePaiDunOffset(t, n, i, r);
}
};
t.prototype._updatePaiDunOffset = function(e, t, o, n) {
var r = p.default.gameLogic().paiDunOffset();
this.cardsManage3D.paiDun(e, t, o, n + r);
};
t.prototype._handBeginIndex = function(e) {
c.default.b3N2(e) && (e -= 1);
return 13 - e;
};
t.prototype._outIndex = function(e, t, o) {
if ((e === a.eViewPos.Up || e === a.eViewPos.Down) && !o) {
var n = t % 7;
return 13 * Math.floor(t / 7) + (n + 4);
}
return t;
};
t.prototype.playAnimationHu = function() {
this.cardsManage3D.playHu();
};
t.prototype.playAnimationBegin = function(e) {
for (var t = this, o = this._getPlayerList(), n = [], r = p.default.gameLogic().handMaxLen(), s = Math.floor(r / 4), l = 0, c = cc.delayTime(.1), u = function(e) {
for (var i = function(i) {
var a = o[i];
if (a) {
var s = cc.callFunc(function() {
t._animationPD(l);
t._animationHand(a.pos, 4 * e, 4 * (e + 1) - 1, 14 - r);
l += 1;
});
n.push(s);
n.push(c);
}
}, a = 0; a < o.length; a++) i(a);
}, d = 0; d < s; d++) u(d);
var f = cc.callFunc(function() {
for (var e = i.default.myAbsolutePos(), n = a.eViewPos.Down; n <= a.eViewPos.Right; n++) {
var l = C.default.getInstance().viewPos2DeskPos(n, e), c = i.default.gameInfo.siteInfos.get(l);
c && t._updatePaiDun(c, n);
}
for (n = 0; n < o.length; n++) {
var u = o[n];
u && t._animationHand(u.pos, 4 * s, -1, 14 - r);
}
});
n.push(f);
n.push(cc.delayTime(.5));
var h = cc.callFunc(function() {
t._animationTidyHand(14 - r);
});
i.default.isWatcher() || n.push(h);
var m = cc.callFunc(function() {
v.default.getInstance().isPlayingBeginAnimation = !1;
e();
});
n.push(m);
this.node.runAction(cc.sequence(n));
};
t.prototype._getPlayerList = function() {
for (var e = a.eDeskPos.North, t = g.default.DeskMaskMJ, o = [], n = 0; n < t; n++) {
var r = (e + n) % t, s = i.default.players.getByPos(r);
o.push(s);
}
return o;
};
t.prototype.initBeginAnimation = function() {
this.initUI();
for (var e = i.default.myAbsolutePos(), t = a.eViewPos.Down; t <= a.eViewPos.Right; t++) {
var o = C.default.getInstance().viewPos2DeskPos(t, e), n = i.default.gameInfo.siteInfos.get(o);
if (n) {
this.cardsManage3D.hideHand(t);
this.cardsManage3D.hideHandShow(t);
this.cardsManage3D.hidePaiDun(t);
for (var r = 0, s = n.paiDunCards.length; r < s; r++) this._updatePaiDunOffset(t, r, _.MJ_BACK_ID, s);
}
}
};
t.prototype._animationPD = function(e) {
for (var t = this, o = i.default.gameInfo.beginPaiDunPos.pos, n = i.default.gameInfo.beginPaiDunPos.index, r = n + 4 * (e + 1) - 1, a = function(e) {
for (var n = 0, r = g.default.DeskMaskMJ, a = 0; a < r; a++) {
var s = (o + a) % r, l = i.default.gameInfo.siteInfos.get(s).paiDunCards.length, c = l + n;
if (c > e) {
var u = e - n, d = C.default.getInstance().deskPos2ViewPos(s);
t._updatePaiDunOffset(d, u, _.MJ_HIDE_ID, l);
break;
}
n = c;
}
}, s = n + 4 * e; s <= r; s++) a(s);
};
t.prototype._animationHand = function(e, t, o, n) {
var r = i.default.gameInfo.siteInfos.get(e).handCards, s = C.default.getInstance().deskPos2ViewPos(e);
-1 === o && (o = r.length - 1);
s === a.eViewPos.Down && b.default.getInstance().drawCard();
for (var l = t; l <= o; l++) {
var c = r[l];
if (i.default.isWatcher()) this.cardsManage3D.handShow(s, l + n, c); else {
var u = this.cardsManage3D.hand(s, l + n, c);
if (s === a.eViewPos.Down && u) {
var d = u.getComponent(y.default);
d.setData(c);
d.playAnimation();
}
}
}
};
t.prototype._animationTidyHand = function(e) {
for (var t = C.default.getInstance().viewPos2DeskPos(a.eViewPos.Down), o = i.default.gameInfo.siteInfos.get(t).getSortedHandCards(), n = o.length, r = 0; r < n; r++) {
var s = o[r], l = this.cardsManage3D.hand(a.eViewPos.Down, r + e, s);
if (l) {
var c = l.getComponent(y.default);
c.setData(s);
c.playAnimation();
}
}
b.default.getInstance().drawCard();
};
r([ w(s.default) ], t.prototype, "cardsManage3D", void 0);
r([ w(cc.Node) ], t.prototype, "cardPointer", void 0);
return t = r([ S ], t);
}(m.default);
o.default = O;
cc._RF.pop();
