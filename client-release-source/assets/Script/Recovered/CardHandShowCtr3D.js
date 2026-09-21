// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e399cBvBlVDWoKeheo/mnys", "CardHandShowCtr3D");
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
var i = require("./RoomInfoData"), a = require("./CardUtils"), s = require("./Loader"), l = require("./CommonEnum"), c = require("./gContext"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._playing = !1;
t._cardValue = 0;
t.lzNode = null;
t.pzNode = null;
t.handRoot = null;
t.cardSprite = null;
t.cardAnimation = null;
t.animateRoot = null;
t.animation = null;
return t;
}
t.prototype.setData = function(e) {
this._cardValue = e;
this._updateUI();
};
t.prototype.start = function() {
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.playAnimation = function() {
var e = this;
this._uiDirty = !0;
this._playing = !0;
this.handRoot.active = !1;
this.animateRoot.active = !0;
this.animation.play();
this.animation.once(cc.Animation.EventType.FINISHED, function() {
e._uiDirty = !0;
e._playing = !1;
}, this);
};
t.prototype._updateUI = function() {
if (this._playing) {
this.handRoot.active = !1;
this.animateRoot.active = !0;
} else {
this.animateRoot.active = !1;
this.handRoot.active = !0;
}
var e = i.default.gameInfo.isPiZi(this._cardValue), t = i.default.gameInfo.isLaiZi(this._cardValue);
this.lzNode.active = t;
this.pzNode.active = e;
if (e) {
var o = c.default.gameLogic().pzImgName();
s.default.setImg("Hall/Res/Texture/Card/" + o, this.pzNode);
}
if (t) {
this.handRoot.color = a.CARD_COLOR_LAIZI;
this.animateRoot.color = a.CARD_COLOR_LAIZI;
} else {
this.handRoot.color = a.CARD_COLOR_NORMAL;
this.animateRoot.color = a.CARD_COLOR_NORMAL;
}
var n = a.default.cardImgPath(this._cardValue, l.eGameView.View3D);
s.default.setImg(n, this.cardSprite);
s.default.setImg(n, this.cardAnimation);
};
r([ p(cc.Node) ], t.prototype, "lzNode", void 0);
r([ p(cc.Node) ], t.prototype, "pzNode", void 0);
r([ p(cc.Node) ], t.prototype, "handRoot", void 0);
r([ p(cc.Sprite) ], t.prototype, "cardSprite", void 0);
r([ p(cc.Sprite) ], t.prototype, "cardAnimation", void 0);
r([ p(cc.Node) ], t.prototype, "animateRoot", void 0);
r([ p(cc.Animation) ], t.prototype, "animation", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
