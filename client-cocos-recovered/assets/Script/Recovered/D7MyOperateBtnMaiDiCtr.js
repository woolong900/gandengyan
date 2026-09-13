// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "69dc0+3gz1IGI8ASpO7y/Ve", "D7MyOperateBtnMaiDiCtr");
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
var i = e("./RoomInfoData"), a = e("./D7RoomUtils"), s = e("./gContext"), l = e("./EventUtils"), c = e("./D7EventKeys"), u = e("./D7MyCardsPointer"), d = e("./GameMsgD7"), p = e("./SoundUtils"), f = e("./D7GameInfoData"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
t.but = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
s.default.eventUtils.on([ c.default.data_get_remain, c.default.data_put_remain ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
s.default.eventUtils.on([ c.default.ui_my_card_choose_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.but.node.active = !1;
var e = a.default.getInstance().isViewDown(i.default.gameInfoD7.getRemainInfo.uid);
if (i.default.isWatcher()) this.but.interactable = !1; else if (e) {
this.but.node.active = !0;
for (var t = 0, o = i.default.myAbsolutePos(), n = 0, r = i.default.gameInfoD7.handCards(o).length; n < r; n++) {
this.myCardsPointer.getCard(n).isChoose() && t++;
}
t === i.default.gameInfoD7.getRemainInfo.cards.length ? this.but.interactable = !0 : this.but.interactable = !1;
}
};
t.prototype.onClick = function() {
p.default.clickBtn();
for (var e = i.default.myAbsolutePos(), t = i.default.gameInfoD7.handCards(e), o = i.default.gameInfoD7.getRemainInfo.friendCard, n = [], r = 0, a = 0, l = 0, c = 0, u = t.length; c < u; c++) {
var h = this.myCardsPointer.getCard(c), m = t[c], y = h.isChoose();
y && n.push(m);
m === o && (y ? r++ : a++);
m === i.default.gameInfoD7.mainCard && y && l++;
}
s.default.msgBox.showNoClose("是否确认埋底？", function() {
if (i.default.gameInfoD7.zhuangUid === i.default.players.getByPos(e).uid) {
if (a < 1) return s.default.uiHelper.showTip("朋友牌不可以全部埋底~");
} else if (r >= 1) return s.default.uiHelper.showTip("朋友牌不可以全部埋底~");
if (i.default.gameInfoD7.roundData().type === f.eRoundTypeD7.Fan && l > 0) return s.default.uiHelper.showTip("反主的牌不能埋底~");
d.default.getInstance().putRemain(n);
});
};
r([ y(u.default) ], t.prototype, "myCardsPointer", void 0);
r([ y(cc.Button) ], t.prototype, "but", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
