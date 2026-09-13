// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5d4896c7yRA14/GmXYPG+Eo", "WSKPosShowXiCardCtr");
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
var i = e("./Loader"), a = e("./EventUtils"), s = e("./gContext"), l = e("./WSKEventKeys"), c = e("./WSKPosCtr"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._xiCards = [];
t.posCtr = null;
t.cardRoot = null;
t.cardsNodes = [];
t.xiNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on(l.default.data_xi_card_change, function(t, o) {
if (o.pos === e.posCtr.deskPos() && o.action) {
e._xiCards = o.cards;
e._xiCards.length > 0 && e._updateUi();
}
}, this, a.eOffType.OnDestroy);
};
t.prototype._updateUi = function() {
this._showAction();
for (var e = 0; e < this._xiCards.length; e++) {
var t = this._xiCards[e] + 1, o = s.default.gameLogic().cardImgPath(t), n = this.cardsNodes[e];
n.node.active = !0;
i.default.setImg(o, n);
}
};
t.prototype._showAction = function() {
var e = this;
this.cardRoot.active = !0;
this.xiNode.active = !0;
setTimeout(function() {
e.cardRoot.active = !1;
e.xiNode.active = !1;
}, 1e3);
};
t.prototype._doAction = function(e) {
e.active = !0;
var t = cc.callFunc(function() {
e.setScale(0, 0);
e.active = !1;
}), o = cc.scaleTo(.2, 1).easing(cc.easeSineIn()).easing(cc.easeBackOut()), n = cc.sequence(t, o);
e.stopAllActions();
e.runAction(n);
};
r([ p(c.default) ], t.prototype, "posCtr", void 0);
r([ p(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ p(cc.Sprite) ], t.prototype, "cardsNodes", void 0);
r([ p(cc.Node) ], t.prototype, "xiNode", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
