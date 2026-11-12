// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5c35b+WBFJHR4yGZJPdx+jR", "GDMyCardsChangeCtr");
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
var i = require("./gContext"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./GDMyCardsPointer"), c = require("./GDEventKeys"), u = require("./GDEnum"), d = require("./GDCardUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
t.duiyoupai = null;
return t;
}
t.prototype.onLoad = function() {
var sprite = this.duiyoupai && this.duiyoupai.getComponent(cc.Sprite);
var source = sprite && sprite.spriteFrame;
if (!source) return;
// 115e5c564.png.meta: rotated 183x52. The recovered web pack wrongly
// clips this to 55x52, leaving only the first character and part of the next.
this._friendHandFrame = new cc.SpriteFrame(source.getTexture(),
cc.rect(447, 3, 183, 52), true, cc.v2(0, 0), cc.size(183, 52));
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.type = cc.Sprite.Type.SIMPLE;
sprite.trim = true;
sprite.spriteFrame = this._friendHandFrame;
this.duiyoupai.setContentSize(183, 52);
};
t.prototype.onDestroy = function() {
if (this._friendHandFrame) this._friendHandFrame.destroy();
this._friendHandFrame = null;
};
t.prototype.start = function() {
var e = this;
this.duiyoupai.active = !1;
this._updateUI();
i.default.eventUtils.on([ c.default.data_hand_card_remove, c.default.data_hand_card_reset, c.default.data_hand_card_remove_firend ], function(t, o) {
if (o.pos === a.default.myAbsolutePos()) {
// Clear synchronously: the deal animation disables this controller's parent
// before its next update, but the prompt is a sibling and remains visible.
e.duiyoupai.active = !1;
e._uiDirty = !0;
}
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(c.default.data_status_change, function() {
if (a.default.gameInfoGD.status !== u.eGDGameStatus.Gameing) e.duiyoupai.active = !1;
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this.myCardsPointer._dealing) { this.duiyoupai.active = !1; return; }
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.duiyoupai.active = !1;
if (this.myCardsPointer._dealing) { this._uiDirty = !0; return; }
var e = a.default.myAbsolutePos(), t = a.default.gameInfoGD.status, o = (a.default.gameInfoGD.bottomCard,
a.default.gameInfoGD.siteInfos.get(e).handCards);
if (t === u.eGDGameStatus.SingleEnd) {
a.default.gameInfoGD.is_shuCard = !1;
a.default.gameInfoGD.lipaiBtnStuas = !1;
o = [];
}
if (0 != o.length || t != u.eGDGameStatus.Gameing) {
this.duiyoupai.active = !1;
if (!a.default.gameInfoGD.lipaiBtnStuas) {
this.myCardsPointer.hideAll();
if (a.default.gameInfoGD.is_shuCard) {
this.myCardsPointer.node.setScale(.85);
this.myCardsPointer.node.setPosition(cc.v2(0, -232));
} else {
this.myCardsPointer.node.setScale(1);
this.myCardsPointer.node.setPosition(cc.v2(0, -195));
for (s = 0, l = o.length; s < l; s++) this.myCardsPointer.setCard(s, o[s], !1);
}
i.default.eventUtils.emit(c.default.ui_my_card_choose_change);
}
} else {
this.myCardsPointer.hideAll();
a.default.gameInfoGD.is_shuCard = !1;
a.default.gameInfoGD.lipaiBtnStuas = !1;
var n = a.default.gameInfoGD.siteInfos.get(e).friendhandCards;
a.default.gameInfoGD.siteInfos.get(e).friendhandCards = d.default.sortDesc(n, !0);
var r = a.default.gameInfoGD.siteInfos.get(e).friendhandCards;
// Empty own hand alone is not enough: only label an actual teammate hand.
this.duiyoupai.active = r.length > 0;
this.myCardsPointer.node.setScale(1);
this.myCardsPointer.node.setPosition(cc.v2(0, -195));
for (var s = 0, l = r.length; s < l; s++) this.myCardsPointer.setCard(s, r[s], !1, !0);
}
};
r([ h(l.default) ], t.prototype, "myCardsPointer", void 0);
r([ h(cc.Node) ], t.prototype, "duiyoupai", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
