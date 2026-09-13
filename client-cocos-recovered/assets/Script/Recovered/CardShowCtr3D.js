// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ec6089HvRJOKrMi4+Ewisr6", "CardShowCtr3D");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./CardUtils"), l = require("./EventUtils"), c = require("./CommonEnum"), u = require("./Loader"), d = require("./RoomInfoData"), p = require("./CardShowCtrBase"), f = cc._decorator, h = f.ccclass, m = (f.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._value = 0;
t._oldColor = cc.color(255, 255, 255);
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_hand_select_change, function(t, o) {
o.card === e._value ? e.node.color = s.CARD_COLOR_SELECT : e.node.color = e._oldColor;
}, this, l.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_hand_select_clean, function(t, o) {
e.node.color = e._oldColor;
}, this, l.eOffType.OnDestroy);
};
t.prototype.setData = function(e, t) {
this._value = e;
d.default.gameInfo.isLaiZi(e) ? this._oldColor = s.CARD_COLOR_LAIZI : d.default.config.index == c.eGameIds.QJHZ && d.default.gameInfo.isFeng(e) ? this._oldColor = s.CARD_COLOR_LAIZI : this._oldColor = s.CARD_COLOR_NORMAL;
this.node.color = this._oldColor;
var o = s.default.cardImgPath(e, c.eGameView.View3D);
u.default.setImg(o, this.node.children[0]);
this.updateArrow(this.node.children[0], t);
this.udpateFlag(this.node.children[0], e);
};
return t = r([ h ], t);
}(p.default));
o.default = m;
cc._RF.pop();
