// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "11613/yHeJE44QWMfQgsPke", "DBDMyCardItemCtr");
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
var i, a = e("./DBDCardUtils"), s = e("./Loader"), l = e("./RoomInfoData"), c = e("./UserData"), u = cc._decorator, d = u.ccclass, p = (u.property,
cc.color(255, 255, 255)), f = cc.color(67, 67, 67), h = cc.color(67, 67, 67);
(function(e) {
e[e.Normal = 0] = "Normal";
e[e.Invalid = 1] = "Invalid";
e[e.Choose = 2] = "Choose";
e[e.ChooseFocus = 3] = "ChooseFocus";
e[e.ShowRemain = 4] = "ShowRemain";
})(i || (i = {}));
var m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._card = 0;
t._initPos = cc.v2(0, 0);
t._initColor = p;
t._showAction = !1;
t._state = i.Normal;
return t;
}
t.prototype.initCard = function(e, t) {
void 0 === t && (t = !1);
this._card = e;
this.node.removeAllChildren();
if (l.default.gameInfoDBD.bankerUid === c.default.uid) {
var o = new cc.Node(), n = o.addComponent(cc.Sprite);
s.default.setImg("Games/dbd/poker/titleDiZhu", n);
this.node.addChild(o);
o.setPosition(33, 59);
}
var r = a.default.imgPath(e);
s.default.setImg(r, this.node);
this._showAction = t;
t ? this.setRemain() : this.setNormal();
};
t.prototype.reset = function() {
this._card = 0;
this._initColor = p;
this.setNormal();
};
t.prototype.initPosition = function(e, t) {
this._initPos = cc.v2(e, t);
this.node.x = e;
this.node.y = t;
this._updateUI();
};
t.prototype.setSelectColor = function() {
this._state !== i.Invalid && (this.node.color = f);
};
t.prototype.cleanSelectColor = function() {
this._state !== i.Invalid && (this.node.color = this._initColor);
};
t.prototype.setInvalid = function() {
return this._setState(i.Invalid);
};
t.prototype.setChoose = function() {
return this._setState(i.Choose);
};
t.prototype.setNormal = function() {
return !this._showAction && this._setState(i.Normal);
};
t.prototype.setChooseFocus = function() {
return this._setState(i.ChooseFocus);
};
t.prototype.setRemain = function() {
this._setState(i.ShowRemain);
this.showReaminCardsAction();
return !0;
};
t.prototype.showReaminCardsAction = function() {
var e = this;
this.node.stopAllActions();
var t = cc.delayTime(.3), o = cc.moveBy(.5, 0, -35), n = cc.callFunc(function() {
e.node.stopAllActions();
e._showAction = !1;
e.node.y = 0;
e.setNormal();
}), r = cc.sequence(t, o, n);
r.setTag(999);
this.node.runAction(r);
};
t.prototype.clicked = function() {
if (this._state !== i.Invalid && this._state !== i.ChooseFocus && this._state !== i.ShowRemain) return this._state === i.Choose ? this._setState(i.Normal) : this._state === i.Normal ? this._setState(i.Choose) : void 0;
};
t.prototype.isChoose = function() {
return this._state === i.Choose || this._state === i.ChooseFocus;
};
t.prototype.isInvalid = function() {
return this._state === i.Invalid;
};
t.prototype._setState = function(e) {
if (e === this._state) return !1;
this._state = e;
this._updateUI();
return !0;
};
t.prototype._updateUI = function() {
if (this._state === i.Normal) {
this.node.color = this._initColor;
this.node.y = this._initPos.y;
}
if (this._state === i.Choose) {
this.node.color = this._initColor;
this.node.y = this._initPos.y + 40;
}
if (this._state === i.ChooseFocus) {
this.node.color = this._initColor;
this.node.y = this._initPos.y + 40;
}
if (this._state === i.Invalid) {
this.node.color = h;
this.node.y = this._initPos.y;
}
if (this._state === i.ShowRemain) {
this.node.color = this._initColor;
this.node.y = this._initPos.y + 35;
}
};
return t = r([ d ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
