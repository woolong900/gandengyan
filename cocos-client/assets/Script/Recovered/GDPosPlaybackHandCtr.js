// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "db791G0yqlMULylLdL3RvtU", "GDPosPlaybackHandCtr");
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
var i = require("./gContext"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./Loader"), c = require("./GDPosCtr"), u = require("./GDEventKeys"), d = require("./GDCardUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.cardsRoot = null;
t.disCardRoot = null;
t.disCardNum = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on([ u.default.data_hand_card_remove, u.default.data_hand_card_reset ], function(t, o) {
o && o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(u.default.data_step_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this.posCtr.deskPos();
if (e < 0) {
for (var t = d.default.sortDesc(a.default.gameInfoGD.discards || [], !0), o = 0, n = t.length; o < n; o++) {
var r = t[o];
(p = this.cardsRoot.getChildByName("card_" + o)).active = !0;
p.color = cc.color(128, 128, 128);
var i = d.default.imgPath(r);
l.default.setImg(i, p);
}
if (t.length > 0) {
this.disCardRoot.active = !0;
this.disCardNum.string = "" + t.length;
}
} else {
this._cleanShow();
var s = a.default.players.getByPos(e), c = (s && s.uid, a.default.gameInfoGD.siteInfos.get(e)), u = d.default.sortDesc(c.handCards, !0);
for (o = 0, n = u.length; o < n; o++) {
var p;
r = u[o];
(p = this.cardsRoot.getChildByName("card_" + o)).active = !0;
if (0 == this.posCtr.uiPos) {
var f = this.getPosition(o, n);
p.setPosition(f.x, f.y);
}
i = d.default.imgPath(r);
l.default.setImg(i, p);
p.removeAllChildren();
var h = a.default.gameInfoGD.bottomCard;
if (Math.floor(h / 10) == Math.floor(r / 10)) {
var m = new cc.Node(), g = m.addComponent(cc.Sprite);
g.sizeMode = cc.Sprite.SizeMode.CUSTOM;
l.default.setImg("Games/GdPoker/jipai_laizi", g);
p.addChild(m);
m.width = 73;
m.height = 98;
m.setPosition(0, 0);
if (r % 10 == 3) {
var y = new cc.Node(), _ = y.addComponent(cc.Sprite);
l.default.setImg("Games/GdPoker/peipaibiao", _);
p.addChild(y);
y.setPosition(-25, -25);
y.setScale(.8, .8);
}
}
}
}
};
t.prototype.getPosition = function(e, t) {
var o = -35 * (t - 1) / 2 + 35 * e;
return cc.v2(o, 0);
};
t.prototype._creatorTitle = function(e) {
var t = cc.size(94, 96), o = e.width, n = e.height, r = o / 164, i = n / 218, a = t.width * r, s = t.height * i, c = new cc.Node();
c.setContentSize(a, s);
var u = c.addComponent(cc.Sprite);
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
l.default.setImg("Games/Poker/titleDiZhu", u);
var d = o / 2 - a / 2, p = n / 2 - s / 2;
d = Math.floor(d);
p = Math.floor(p);
c.setPosition(d, p);
return c;
};
t.prototype._cleanShow = function() {
for (var e = 0, t = this.cardsRoot.childrenCount; e < t; e++) this.cardsRoot.children[e].active = !1;
};
r([ h(c.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "cardsRoot", void 0);
r([ h(cc.Node) ], t.prototype, "disCardRoot", void 0);
r([ h(cc.Label) ], t.prototype, "disCardNum", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
