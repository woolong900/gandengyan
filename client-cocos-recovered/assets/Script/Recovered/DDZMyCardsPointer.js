// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9daf1RQ0JVPCqnlqrfGfxKV", "DDZMyCardsPointer");
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
var i = e("./gContext"), a = e("./DDZEventKeys"), s = e("./RoomInfoData"), l = e("./DDZEnum"), c = e("./EventUtils"), u = e("./DDZMyCardItemCtr"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._spacingX = 0;
t.rootNode = null;
t.cards = [];
return t;
}
t.prototype.onLoad = function() {
this._spacingX = this.rootNode.getComponent(cc.Layout).spacingX;
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.data_status_change, function() {
s.default.gameInfoDDZ.status === l.eDDZGameStatus.SingleEnd && e._resetAllCards();
}, this, c.eOffType.OnDestroy);
};
t.prototype.getCard = function(e) {
return this.cards[e];
};
t.prototype.getPosition = function(e, t) {
var o = -this._spacingX * (t - 1) / 2 + e * this._spacingX;
return cc.v2(o, 0);
};
t.prototype.initPosition = function(e, t) {
var o = this.getPosition(e, t);
this.getCard(e).initPosition(o.x, o.y);
};
t.prototype._resetAllCards = function() {
for (var e = 0, t = this.cards.length; e < t; e++) {
this.cards[e].reset();
}
};
t.prototype.reset = function() {
this._resetAllCards();
};
t.prototype.setCard = function(e, t, o) {
void 0 === o && (o = !1);
var n = this.getCard(e).node;
n.active = !0;
n.getComponent(u.default).initCard(t, o);
};
t.prototype.hideAll = function() {
for (var e = 0, t = this.cards.length; e < t; e++) this.cards[e].node.active = !1;
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(u.default) ], t.prototype, "cards", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
