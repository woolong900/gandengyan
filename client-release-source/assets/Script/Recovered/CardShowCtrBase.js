// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e46d4YNPjVMdKH1bIrpWNH3", "CardShowCtrBase");
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
var i = require("./CommonEnum"), a = require("./Loader"), s = require("./RoomInfoData"), l = require("./gContext"), c = cc._decorator, u = c.ccclass, d = (c.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.updateArrow = function(e, t) {
void 0 === t && (t = -1);
if (t === i.eViewPos.Left || t === i.eViewPos.Right || t === i.eViewPos.Up) {
if (n = e.parent.getChildByName("arrow")) ; else {
(n = new cc.Node()).addComponent(cc.Sprite);
a.default.setImg("Hall/Res/Texture/Game/card_arrow", n);
e.parent.addChild(n, 1, "arrow");
}
n.active = !0;
n.color = e.color;
n.opacity = e.opacity;
n.x = e.x;
n.y = e.y;
var o = 0;
if (t === i.eViewPos.Left || t === i.eViewPos.Right) {
n.scaleX = e.scaleY;
n.scaleY = e.scaleX;
n.skewX = -e.skewY;
n.skewY = -e.skewX;
o = t === i.eViewPos.Left ? 90 : -90;
} else {
n.scaleX = e.scaleX;
n.scaleY = e.scaleY;
n.skewX = e.skewX;
n.skewY = e.skewY;
}
n.rotation = e.rotation + o;
} else {
var n;
(n = e.parent.getChildByName("arrow")) && (n.active = !1);
}
};
t.prototype.udpateFlag = function(e, t) {
var o = e.getChildByName("pz");
if (o) {
o.active = !1;
if (s.default.gameInfo.isPiZi(t)) {
o.active = !0;
var n = l.default.gameLogic().pzImgName();
a.default.setImg("Hall/Res/Texture/Card/" + n, o);
}
if (s.default.gameInfo.isLaiZi(t)) {
o.active = !0;
a.default.setImg("Hall/Res/Texture/Card/lz", o);
}
}
};
return t = r([ u ], t);
}(cc.Component));
o.default = d;
cc._RF.pop();
