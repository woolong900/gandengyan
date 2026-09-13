// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c0b72La24BMF4RCPhvWnJV6", "CardShowCtr2D");
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
var i = require("./CommonEnum"), a = require("./CardUtils"), s = require("./Loader"), l = require("./gContext"), c = require("./EventKeys"), u = require("./EventUtils"), d = require("./RoomInfoData"), p = require("./CardShowCtrBase"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._type = 0;
t._value = 0;
t._bindSelect = !0;
t._bgNode = null;
t._cardNode = null;
t._oldColor = cc.color(255, 255, 255);
t.showPos = i.eViewPos.Down;
t.rootNode = null;
t.handRoot = null;
t.outRoot = null;
t.gangRoot = null;
t.handCard = null;
t.outCard = null;
t.gangCard = null;
t.anGangNode = null;
t.gangNode = null;
t.handBg = null;
t.outBg = null;
t.gangBg = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (this._bindSelect) {
l.default.eventUtils.on(c.default.ui_hand_select_change, function(t, o) {
if (e._type === a.eCardShowType.Out || e._type === a.eCardShowType.Gang) if (o.card === e._value) {
e._bgNode && (e._bgNode.color = a.CARD_COLOR_SELECT);
e._cardNode && (e._cardNode.color = a.CARD_COLOR_SELECT);
} else {
e._bgNode && (e._bgNode.color = e._oldColor);
e._cardNode && (e._cardNode.color = e._oldColor);
}
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_hand_select_clean, function(t, o) {
if (e._type === a.eCardShowType.Out || e._type === a.eCardShowType.Gang) {
e._bgNode && (e._bgNode.color = e._oldColor);
e._cardNode && (e._cardNode.color = e._oldColor);
}
}, this, u.eOffType.OnDestroy);
}
};
t.prototype.setData = function(e, t, o, n, r) {
void 0 === o && (o = !0);
void 0 === n && (n = !1);
void 0 === r && (r = -1);
this._bindSelect = o;
this.handRoot.active = !1;
this.outRoot.active = !1;
this.gangRoot.active = !1;
var c = null;
if (e === a.eCardShowType.Hand) {
this.handRoot.active = !0;
this._bgNode = this.handBg;
this._cardNode = this.handCard;
c = this.handRoot;
} else if (e === a.eCardShowType.Out) {
this.outRoot.active = !0;
this._bgNode = this.outBg;
this._cardNode = this.outCard;
c = this.outRoot;
} else if (e === a.eCardShowType.Gang) {
this.gangRoot.active = !0;
this._bgNode = this.gangBg;
this._cardNode = this.gangCard;
c = this.gangRoot;
} else if (e === a.eCardShowType.LiangDao) {
this.gangRoot.active = !0;
this._bgNode = this.gangBg;
this._cardNode = this.gangCard;
c = this.gangRoot;
}
this._cardNode && this.updateArrow(this._cardNode, r);
if (a.default.isHide(t)) this.rootNode.active = !1; else {
this.rootNode.active = !0;
var u = d.default.gameInfo.isPiZi(t), p = d.default.gameInfo.isLaiZi(t), f = d.default.gameInfo.isFeng(t);
if (c) {
var h = c.getChildByName("lz");
h && (h.active = p);
var m = c.getChildByName("pz");
if (m) {
m.active = u;
if (u) {
var y = l.default.gameLogic().pzImgName();
s.default.setImg("Hall/Res/Texture/Card/" + y, m);
}
}
}
p ? this._oldColor = a.CARD_COLOR_LAIZI : f && d.default.config.index == i.eGameIds.QJHZ ? this._oldColor = a.CARD_COLOR_LAIZI : this._oldColor = cc.color(255, 255, 255);
e === a.eCardShowType.LiangDao && (this._oldColor = a.CARD_COLOR_LIANGDAO);
if (n) {
this._bgNode && (this._bgNode.color = a.CARD_COLOR_SELECT);
this._cardNode && (this._cardNode.color = a.CARD_COLOR_SELECT);
} else {
this._bgNode && (this._bgNode.color = this._oldColor);
this._cardNode && (this._cardNode.color = this._oldColor);
}
if (e !== this._type || t !== this._value) {
this._type = e;
this._value = t;
if (e === a.eCardShowType.Hand) {
if (this.showPos === i.eViewPos.Down) {
var g = a.default.cardImgPath(t, i.eGameView.View2D);
s.default.setImg(g, this.handCard);
}
} else if (e === a.eCardShowType.Out) {
g = a.default.cardImgPath(t, i.eGameView.View2D);
s.default.setImg(g, this.outCard);
} else if (e === a.eCardShowType.Gang) if (a.default.isCovered(t)) {
this.anGangNode.active = !0;
this.gangNode.active = !1;
} else {
this.anGangNode.active = !1;
this.gangNode.active = !0;
g = a.default.cardImgPath(t, i.eGameView.View2D);
s.default.setImg(g, this.gangCard);
} else if (e === a.eCardShowType.LiangDao) if (a.default.isCovered(t)) {
this.anGangNode.active = !0;
this.gangNode.active = !1;
} else {
this.anGangNode.active = !1;
this.gangNode.active = !0;
g = a.default.cardImgPath(t, i.eGameView.View2D);
s.default.setImg(g, this.gangCard);
}
}
}
};
r([ m({
type: cc.Enum(i.eViewPos),
displayName: "显示位置",
serializable: !0
}) ], t.prototype, "showPos", void 0);
r([ m(cc.Node) ], t.prototype, "rootNode", void 0);
r([ m(cc.Node) ], t.prototype, "handRoot", void 0);
r([ m(cc.Node) ], t.prototype, "outRoot", void 0);
r([ m(cc.Node) ], t.prototype, "gangRoot", void 0);
r([ m(cc.Node) ], t.prototype, "handCard", void 0);
r([ m(cc.Node) ], t.prototype, "outCard", void 0);
r([ m(cc.Node) ], t.prototype, "gangCard", void 0);
r([ m(cc.Node) ], t.prototype, "anGangNode", void 0);
r([ m(cc.Node) ], t.prototype, "gangNode", void 0);
r([ m(cc.Node) ], t.prototype, "handBg", void 0);
r([ m(cc.Node) ], t.prototype, "outBg", void 0);
r([ m(cc.Node) ], t.prototype, "gangBg", void 0);
return t = r([ h ], t);
}(p.default);
o.default = y;
cc._RF.pop();
