// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4ce30JeimtH5rJ86U8lPicM", "InHorseLayer");
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
var i = e("./BaseComponent"), a = e("./RoomInfoData"), s = e("./CardUtils"), l = e("./CardShowCtr2D"), c = e("./UserData"), u = e("./CommonEnum"), d = e("./CardHandShowCtr3D"), p = e("./Loader"), f = cc._decorator, h = f.ccclass, m = f.property, y = cc.color(153, 153, 153), g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cardPre = null;
t.card3DPre = null;
t.container = null;
return t;
}
t.prototype.start = function() {
this.show();
};
t.prototype.show = function() {
var e = this, t = a.default.gameInfo.singleEndInfo.inHorse, o = a.default.gameInfo.singleEndInfo.notInHorse, n = t.length + o.length;
this.container.width = 6 == n ? 320 : n > 6 ? 440 : 80 * n + 40 * (n - 1);
this.container.height = t.length + o.length > 4 ? 280 : 120;
t.forEach(function(t) {
e.createCard(t, !1);
});
o.forEach(function(t) {
e.createCard(t, !0);
});
};
t.prototype.createCard = function(e, t) {
var o;
if (c.default.gameView == u.eGameView.View2D) {
(n = (o = cc.instantiate(this.cardPre)).getComponent(l.default)).setData(s.eCardShowType.Hand, e);
this.setStyle(n, t);
} else {
var n;
(n = (o = cc.instantiate(this.card3DPre)).getComponent(d.default)).setData(e);
n._updateUI = function() {};
this.setStyle(n, t);
}
if (!t) {
var r = new cc.Node();
r.addComponent(cc.Sprite);
p.default.setImg("Hall/Res/Texture/Game/ma_badge", r);
o.addChild(r);
r.x = -17.7;
r.y = c.default.gameView == u.eGameView.View2D ? 15 : 21.8;
}
this.container.addChild(o);
};
t.prototype.setStyle = function(e, t) {
e.handRoot.scaleX = 80 / e.handRoot.width;
e.handRoot.scaleY = 120 / e.handRoot.height;
if (t) {
e.handRoot.color = y;
if (c.default.gameView == u.eGameView.View2D) {
e.handRoot.children[0].color = y;
e.handRoot.children[1].color = y;
} else e.handRoot.children[0].color = y;
}
};
r([ m(cc.Prefab) ], t.prototype, "cardPre", void 0);
r([ m(cc.Prefab) ], t.prototype, "card3DPre", void 0);
r([ m(cc.Node) ], t.prototype, "container", void 0);
return t = r([ h ], t);
}(i.default);
o.default = g;
cc._RF.pop();
