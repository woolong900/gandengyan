// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ca824wn1+NDJZWJ/4L4VRlW", "CardHuTip");
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
var i = require("./CardUtils"), a = require("./CommonEnum"), s = require("./Loader"), l = require("./RoomInfoData"), c = require("./gContext"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._cardValue = 0;
t._uiDirty = !0;
t.cardSprite = null;
t.count = null;
t.laizi = null;
t.cardBg = null;
return t;
}
t.prototype.setData = function(e) {
this._cardValue = e;
};
t.prototype.start = function() {
this.update();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
var e = i.default.cardImgPath(this._cardValue, a.eGameView.View2D);
s.default.setImg(e, this.cardSprite);
if (l.default.gameInfo.isLaiZi(this._cardValue)) {
this.laizi.active = !0;
this.cardBg.color = i.CARD_COLOR_LAIZI;
}
s.default.setImg(i.default.cardImgPath(this._cardValue, a.eGameView.View2D), this.cardSprite);
this.count.string = l.default.gameInfo.siteInfos.anyCardRemain(this._cardValue, c.default.gameLogic().cardStorageTotal(this._cardValue)) + "张";
}
};
r([ p(cc.Sprite) ], t.prototype, "cardSprite", void 0);
r([ p(cc.Label) ], t.prototype, "count", void 0);
r([ p(cc.Node) ], t.prototype, "laizi", void 0);
r([ p(cc.Node) ], t.prototype, "cardBg", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
