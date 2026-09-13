// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8ad2dohpLtAbaDMYYwAtKwU", "PDKMyCardItemCtr");
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
var i, a = e("./PDKCardUtils"), s = e("./Loader"), l = cc._decorator, c = l.ccclass, u = (l.property,
cc.color(255, 255, 255)), d = cc.color(67, 67, 67), p = cc.color(67, 67, 67);
(function(e) {
e[e.Normal = 0] = "Normal";
e[e.Invalid = 1] = "Invalid";
e[e.Choose = 2] = "Choose";
e[e.ChooseFocus = 3] = "ChooseFocus";
})(i || (i = {}));
var f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._card = 0;
t._initPos = cc.v2(0, 0);
t._initColor = u;
t._state = i.Normal;
return t;
}
t.prototype.initCard = function(e) {
this._card = e;
var t = a.default.imgPath(e);
s.default.setImg(t, this.node);
this.setNormal();
};
t.prototype.reset = function() {
this._card = 0;
this._initColor = u;
this.setNormal();
};
t.prototype.initPosition = function(e, t) {
this._initPos = cc.v2(e, t);
this.node.x = e;
this.node.y = t;
this._updateUI();
};
t.prototype.setSelectColor = function() {
this._state !== i.Invalid && (this.node.color = d);
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
return this._setState(i.Normal);
};
t.prototype.setChooseFocus = function() {
return this._setState(i.ChooseFocus);
};
t.prototype.clicked = function() {
if (this._state !== i.Invalid && this._state !== i.ChooseFocus) return this._state === i.Choose ? this._setState(i.Normal) : this._state === i.Normal ? this._setState(i.Choose) : void 0;
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
this.node.color = p;
this.node.y = this._initPos.y;
}
};
return t = r([ c ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
