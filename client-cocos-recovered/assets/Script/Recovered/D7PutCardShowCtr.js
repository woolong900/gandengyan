// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4014aUVFEdHhKj4TGEvk+l6", "D7PutCardShowCtr");
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
var i = e("./D7PutCardCtr"), a = e("./RoomInfoData"), s = e("./D7GameInfoData"), l = e("./gContext"), c = e("./D7EventKeys"), u = e("./EventUtils"), d = e("./D7Enum"), p = e("./D7CardUtils"), f = e("./Loader"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.putCardCtr = null;
t.rootNode = null;
t.kill = null;
t.shuai = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on([ c.default.data_round_change, c.default.data_status_change, c.default.data_hide_all_cards ], function() {
e._updateUI();
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_put_card, function(t, o) {
o.pos === e.putCardCtr.deskPos() && e._actionShow(o.cards);
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.ui_show_animation_kill, function(t, o) {
if (o.pos === e.putCardCtr.deskPos()) {
var n = o.cards;
e.kill.node.position = e._position(n.length);
e.kill.playAnimation("newAnimation", 1);
}
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.ui_show_animation_shuai, function(t, o) {
if (o.pos === e.putCardCtr.deskPos()) {
var n = o.cards;
e.shuai.node.position = e._position(n.length);
e.shuai.playAnimation("newAnimation", 1);
}
}, this, u.eOffType.OnDestroy);
this._updateUI();
};
t.prototype._position = function(e) {
var t = this.rootNode.children[0], o = t.width, n = (t.height, (o + this.rootNode.getComponent(cc.Layout).spacingX) * (e - 1) + o), r = this.rootNode.x + (.5 - this.rootNode.anchorX) * n, i = this.rootNode.y;
return cc.v2(r, i);
};
t.prototype._updateUI = function() {
this._hideAll();
if (a.default.gameInfoD7.status === d.eD7GameStatus.Gameing) {
var e = this.putCardCtr.deskPos(), t = a.default.gameInfoD7.roundData();
if (t.type === s.eRoundTypeD7.Put) {
if (a.default.gameInfoD7.isRound && a.default.isWatcher()) return;
for (var o = t.actions, n = 0, r = o.length; n < r; n++) {
var i = o[n];
i.pos === e && i.state === s.eRoundStateD7.OK && this._showCards(i.cards);
}
}
}
};
t.prototype._actionShow = function(e) {
this._hideAll();
this._showCards(e);
};
t.prototype._showCards = function(e) {
for (var t = a.default.gameInfoD7.mainCard, o = l.default.gameLogic().isSupportAKK(a.default.config), n = l.default.gameLogic().isSupportAKKQQ(a.default.config), r = p.default.sortPutShow(e, t, o, n), i = 0, s = e.length; i < s; i++) this._show(i, r[i]);
};
t.prototype._show = function(e, t) {
var o = this.rootNode.getChildByName("card_" + e);
o.active = !0;
var n = p.default.imgPath(t);
f.default.setImg(n, o);
};
t.prototype._hideAll = function() {
for (var e = 0, t = this.rootNode.childrenCount; e < t; e++) {
this.rootNode.children[e].active = !1;
var o = this.rootNode.children[e].getComponent(cc.Sprite);
o ? o.spriteFrame = null : cc.error("set image node must have cc.Sprite component.");
}
};
r([ y(i.default) ], t.prototype, "putCardCtr", void 0);
r([ y(cc.Node) ], t.prototype, "rootNode", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "kill", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "shuai", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
