// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c9b62aZNAtD+IBufGgAWChZ", "GDJiaodizhuCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventUtils"), l = require("./SoundUtils"), c = require("./GDEventKeys"), u = require("./GDEnum"), d = require("./UserData"), p = require("./GameMsgGD"), f = require("./GDMyCardsPointer"), h = require("./GDCardUtils"), m = cc._decorator, g = m.ccclass, y = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
t.jiaodizhu = null;
t.jiaodizhu_sprrt = null;
t.huan_hui = null;
t.huan = null;
t.jin_hui = null;
t.jin = null;
t.kanggongAnimate = null;
return t;
}
t.prototype.start = function() {
require("./PokerActionButtonStyle").applyTribute(this);
var e = this;
a.default.eventUtils.on(c.default.kanggong_anim_play, function(t, o) {
e.playKangGong();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.gongpai_select_btn, function(t, o) {
e._resetBtnStuts(o.btn);
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.off_btn_gongpai, function(t, o) {
o.pos == i.default.myAbsolutePos() && (e.jiaodizhu.active = !1);
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.data_status_gongpai, function(t, o) {
o.pos == i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
i.default.gameInfoGD.status == u.eGDGameStatus.gongpai && i.default.gameInfoGD.curGongPaiUid == d.default.uid && (this._uiDirty = !0);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.playKangGong = function() {
this.kanggongAnimate.node.active = !0;
this.kanggongAnimate.playAnimation("newAnimation", 1);
};
t.prototype._updateUI = function() {
this.jiaodizhu.active = !1;
1 == i.default.gameInfoGD.GongPaiStaus && this._updateBtnSprit(!0, !1);
2 == i.default.gameInfoGD.GongPaiStaus && this._updateBtnSprit(!1);
i.default.gameInfoGD.status === u.eGDGameStatus.gongpai && (this.jiaodizhu.active = !0);
};
t.prototype._updateBtnSprit = function(e, t) {
void 0 === e && (e = !1);
void 0 === t && (t = !0);
if (1 == i.default.gameInfoGD.GongPaiStaus) {
t || this._updateHandCards();
require("./PokerActionButtonStyle").updateTribute(this, false, e);
}
if (2 == i.default.gameInfoGD.GongPaiStaus) {
t || this._updateHandCards();
require("./PokerActionButtonStyle").updateTribute(this, true, e);
}
};
t.prototype._updateHandCards = function() {
1 == i.default.gameInfoGD.GongPaiStaus && a.default.eventUtils.emit(c.default.hand_card_status);
2 == i.default.gameInfoGD.GongPaiStaus && a.default.eventUtils.emit(c.default.hand_card_status);
};
t.prototype._resetBtnStuts = function(e) {
var t = [], o = i.default.myAbsolutePos(), n = i.default.gameInfoGD.siteInfos.get(o).handCards, r = i.default.gameInfoGD.GongPaiMax;
if (i.default.gameInfoGD.is_shuCard) for (var a = 26 - n.length, s = 26; s > 26 - n.length; s--) {
this.myCardsPointer.getCard(s).isChoose() && t.push(n[s - a - 1]);
} else {
s = 0;
for (var l = n.length; s < l; s++) {
this.myCardsPointer.getCard(s).isChoose() && t.push(n[s]);
}
}
var localRoom = require("./GDStandalone").default;
if (localRoom.isActive()) {
var options = localRoom._phase === "tribute" && localRoom._currentPos === o ? localRoom._tributeOptions(o, i.default.gameInfoGD.GongPaiStaus === 2) : [];
this._updateBtnSprit(t.length === 1 && options.indexOf(t[0]) >= 0);
return;
}
if (1 == i.default.gameInfoGD.GongPaiStaus) {
var c = t[0] || 0, u = h.default.value(c) == i.default.gameInfoGD.m_iLaiziValue && c % 10 == 3;
1 != t.length || Math.floor(r / 10) != Math.floor(t[0] / 10) || u ? e || this._updateBtnSprit(!1) : this._updateBtnSprit(!0);
}
2 == i.default.gameInfoGD.GongPaiStaus && (1 == t.length && Math.floor(t[0] / 10) < 11 && Math.floor(t[0] / 10) != Math.floor(i.default.gameInfoGD.bottomCard / 10) && 1 != Math.floor(t[0] / 10) ? this._updateBtnSprit(!0) : this._updateBtnSprit(!1));
};
t.prototype.onClickCancelJiaodizhu = function(e) {
l.default.clickBtn();
p.default.getInstance().jiaodizhu(0);
};
t.prototype.onClickJiao = function(e, t) {
l.default.clickBtn();
p.default.getInstance().jiaodizhu(1);
};
t.prototype.onClickCancelRedouble = function(e) {
l.default.clickBtn();
p.default.getInstance().DoRedouble(0);
};
t.prototype.onClickRedouble = function(e, t) {
l.default.clickBtn();
p.default.getInstance().DoRedouble(2);
};
r([ y(f.default) ], t.prototype, "myCardsPointer", void 0);
r([ y(cc.Node) ], t.prototype, "jiaodizhu", void 0);
r([ y(cc.Sprite) ], t.prototype, "jiaodizhu_sprrt", void 0);
r([ y(cc.SpriteFrame) ], t.prototype, "huan_hui", void 0);
r([ y(cc.SpriteFrame) ], t.prototype, "huan", void 0);
r([ y(cc.SpriteFrame) ], t.prototype, "jin_hui", void 0);
r([ y(cc.SpriteFrame) ], t.prototype, "jin", void 0);
r([ y(dragonBones.ArmatureDisplay) ], t.prototype, "kanggongAnimate", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
