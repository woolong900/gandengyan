// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d89ddUO535N6alAOQvVNr8z", "GDMyCardItemCtr");
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
var i, a = require("./Loader"), s = require("./RoomInfoData"), l = require("./GDCardUtils"), c = require("./gContext"), u = require("./GDEventKeys"), d = cc._decorator, p = d.ccclass, f = (d.property,
cc.color(255, 255, 255)), h = cc.color(67, 67, 67), m = cc.color(67, 67, 67);
(function(e) {
e[e.Normal = 0] = "Normal";
e[e.Invalid = 1] = "Invalid";
e[e.Choose = 2] = "Choose";
e[e.ChooseFocus = 3] = "ChooseFocus";
e[e.ShowRemain = 4] = "ShowRemain";
e[e.GongInvalid = 5] = "GongInvalid";
})(i || (i = {}));
var g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._card = 0;
t._initPos = cc.v2(0, 0);
t._initColor = f;
t._showAction = !1;
t._state = i.Normal;
t._GongPaistate = !1;
return t;
}
t.prototype.initCard = function(e, t, o) {
void 0 === t && (t = !1);
void 0 === o && (o = !1);
this._card = e;
this.node.removeAllChildren();
this._state = i.Normal;
this._initColor = f;
this.node.color = this._initColor;
this.node.y = this._initPos.y;
if (s.default.gameInfoGD.is_shuCard) {
this.node.width = 125;
this.node.height = 166;
} else if (s.default.gameInfoGD.lipaiBtnStuas) {
this.node.width = 125;
this.node.height = 166;
} else {
this.node.width = 164;
this.node.height = 218;
}
var n = l.default.imgPath(e);
// A reused node must not display its previous card while a new face loads.
this.node.getComponent(cc.Sprite).spriteFrame = null;
a.default.setImg(n, this.node);
var r = s.default.gameInfoGD.bottomCard;
if (Math.floor(r / 10) == Math.floor(e / 10)) {
var c = new cc.Node(), u = c.addComponent(cc.Sprite);
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
a.default.setImg("Games/GdPoker/jipai_laizi", u);
this.node.addChild(c);
if (s.default.gameInfoGD.is_shuCard) {
c.width = 125;
c.height = 166;
} else if (s.default.gameInfoGD.lipaiBtnStuas) {
c.width = 125;
c.height = 166;
} else {
c.width = 164;
c.height = 218;
}
c.setPosition(0, 0);
if (e % 10 == 3) {
var d = "Games/GdPoker/peipaibiao";
(s.default.gameInfoGD.is_shuCard || s.default.gameInfoGD.lipaiBtnStuas) && (d = "Games/GdPoker/yuan_pei");
var p = new cc.Node(), h = p.addComponent(cc.Sprite);
a.default.setImg(d, h);
this.node.addChild(p);
if (s.default.gameInfoGD.is_shuCard) {
p.setPosition(5, 50);
p.setScale(1.2, 1.2);
} else if (s.default.gameInfoGD.lipaiBtnStuas) {
p.setPosition(5, 50);
p.setScale(1.2, 1.2);
} else {
p.setPosition(-63, -45);
p.setScale(1.5, 1.5);
}
}
}
this._showAction = t;
t ? this.setRemain() : this.setNormal();
if (o) {
this._state = i.Invalid;
this._initColor = m;
this.node.color = this._initColor;
}
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
t.prototype.reset = function() {
this._card = 0;
this._initColor = f;
this.setNormal();
};
t.prototype.resetGongPai = function() {
this.setNormalAll();
};
t.prototype.initPosition = function(e, t) {
this._initPos = cc.v2(e, t);
this.node.x = e;
this.node.y = t;
this._updateUI();
};
t.prototype.setSelectColor = function() {
this._state != i.GongInvalid && this._state !== i.Invalid && (this._state !== i.ChooseFocus ? this.node.color = h : this.node.color = f);
};
t.prototype.cleanSelectColor = function() {
this._state !== i.Invalid && this._state !== i.GongInvalid && (this.node.color = this._initColor);
};
t.prototype.setInvalid = function() {
return this._setState(i.Invalid);
};
t.prototype.setGongPaiInvalid = function() {
this._state = i.GongInvalid;
this.node.color = h;
this.node.y = this._initPos.y;
c.default.eventUtils.emit(u.default.gongpai_select_btn, {
btn: !0
});
this._GongPaistate = !0;
};
t.prototype.setGongPaiNormal = function() {
if (this._state != i.GongInvalid) return this._setState(i.Normal);
};
t.prototype.setChoose = function() {
return this._setState(i.Choose);
};
t.prototype.setNormal = function() {
return !this._showAction && this._setState(i.Normal);
};
t.prototype.setNormalAll = function() {
this._GongPaistate = !1;
return this._setState(i.Normal);
};
t.prototype.setChooseFocus = function() {
if (this._state != i.GongInvalid) return this._setState(i.ChooseFocus);
};
t.prototype.clicked = function() {
if (this._state !== i.Invalid && this._state !== i.ChooseFocus) return this._state === i.Choose ? this._setState(i.Normal) : this._state === i.Normal ? this._setState(i.Choose) : void 0;
};
t.prototype.isChoose = function() {
return this._state === i.Choose || this._state === i.ChooseFocus || this._state === i.GongInvalid;
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
if (this._state === i.GongInvalid) {
this.node.color = m;
this.node.y = this._initPos.y;
}
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
this.node.color = m;
this.node.y = this._initPos.y;
}
if (this._state === i.ShowRemain) {
this.node.color = this._initColor;
this.node.y = this._initPos.y;
}
};
Object.defineProperty(t.prototype, "card", {
get: function() {
return this._card;
},
enumerable: !0,
configurable: !0
});
return t = r([ p ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
