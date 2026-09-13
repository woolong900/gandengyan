// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "059adXBF7tPMYpGnBZF6x4J", "WSKPosPutCardShowCtr");
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
var i = e("./RoomInfoData"), a = e("./Loader"), s = e("./EventKeys"), l = e("./EventUtils"), c = e("./gContext"), u = e("./WSKEnum"), d = e("./WSKEventKeys"), p = e("./WSKPosCtr"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.cardRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.cardRoot.getComponent(cc.Layout).enabled = !1;
c.default.eventUtils.on([ d.default.data_status_change ], function(t, o) {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
c.default.eventUtils.on([ d.default.data_round_change ], function(t, o) {
o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
c.default.eventUtils.on([ s.default.play_back_hand ], function(t, o) {
e._hideAll();
}, this, l.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this._hideAll();
var e = i.default.gameInfoWSK.status;
if (e === u.eWSKGameStatus.Gameing) {
var t = this.posCtr.deskPos();
if (r = i.default.gameInfoWSK.siteInfos.get(t)) {
var o = r.roundType, n = (r.putRealCards, r.putVirtualCards);
o === u.eWSKRoundType.Put && this._showCards(n);
}
}
if (e === u.eWSKGameStatus.SingleEnd) {
var r;
t = this.posCtr.deskPos();
if (r = i.default.gameInfoWSK.siteInfos.get(t)) {
var a = r.handCards;
if (a.length > 0) {
var s = c.default.gameLogic().sortDesc(a);
this._showCardsAnimate(s);
} else {
if ((o = r.roundType) === u.eWSKRoundType.Put) {
r.putRealCards, n = r.putVirtualCards;
this._showCards(n);
}
}
}
}
};
t.prototype._showCards = function(e) {
for (var t = e, o = 0, n = e.length; o < n; o++) this._show(o, t[o], n);
};
t.prototype._showCardsAnimate = function(e) {
var t = this, o = e.length, n = .8 / o;
n > .08 && (n = .08);
for (var r = function(r) {
i.scheduleOnce(function() {
t._show(r, e[r], o);
}, n * r);
}, i = this, a = 0; a < o; a++) r(a);
};
t.prototype._show = function(e, t, o) {
var n = this.cardRoot.getChildByName("card_" + e);
n.active = !0;
var r = c.default.gameLogic().cardImgPath(t);
n && n.isValid && n.getComponent(cc.Sprite) && (n.getComponent(cc.Sprite).spriteFrame = null);
a.default.setImg(r, n);
t === i.default.gameInfoWSK.friendCard ? n.color = cc.color(154, 162, 186) : n.color = cc.color(255, 255, 255);
n.getChildByName("zp").active = c.default.gameLogic().score(t) > 0;
n.x = this._px(e, o);
n.y = this._py(e, o);
};
t.prototype._isMulLine = function() {
return 1 === this.posCtr.uiPos || (3 === this.posCtr.uiPos || void 0);
};
t.prototype._ax = function(e, t, o) {
void 0 === o && (o = 0);
this._isMulLine() && e > 10 && (e = 10);
var n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX, i = r * (e - 1) + n;
return (t - this.cardRoot.anchorX) * i + o * r;
};
t.prototype._px = function(e, t) {
var o = this._ax(t, 0), n = this.cardRoot.children[0].width, r = n + this.cardRoot.getComponent(cc.Layout).spacingX;
this._isMulLine() && (e %= 10);
return o + n / 2 + e * r;
};
t.prototype._py = function(e, t) {
return -40 * (e = this._isMulLine() ? Math.floor(e / 10) : 0);
};
t.prototype._hideAll = function() {
for (var e = 0, t = this.cardRoot.childrenCount; e < t; e++) this.cardRoot.children[e].active = !1;
};
r([ m(p.default) ], t.prototype, "posCtr", void 0);
r([ m(cc.Node) ], t.prototype, "cardRoot", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
