// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2ac94r0/xpPJZl3mCAEG6Up", "D7MyChooseCountDescCtr");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = e("./EventUtils"), l = e("./D7EventKeys"), c = e("./D7RoomUtils"), u = e("./D7GameInfoData"), d = e("./D7MyCardsPointer"), p = e("./D7Enum"), f = cc._decorator, h = f.ccclass, m = f.property, y = f.executionOrder, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
t.label = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
a.default.eventUtils.on([ l.default.data_get_remain, l.default.data_put_remain, l.default.data_put_turn, l.default.data_put_card ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on([ l.default.ui_my_card_choose_change, l.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.label.string = "";
var e = i.default.gameInfoD7.status;
if (e === p.eD7GameStatus.Calling || e === p.eD7GameStatus.Gameing) {
var t = i.default.myAbsolutePos(), o = -1;
if (c.default.getInstance().isViewDown(i.default.gameInfoD7.getRemainInfo.uid)) o = i.default.gameInfoD7.getRemainInfo.cards.length; else {
var n = i.default.gameInfoD7.roundData();
if (n.type === u.eRoundTypeD7.Put) {
var r = n.lastAction();
n.actions.length > 1 && r.pos === t && r.state === u.eRoundStateD7.Turn && (o = n.actions[0].cards.length);
}
}
if (!(o <= 0)) {
for (var a = 0, s = 0, l = i.default.gameInfoD7.handCards(t).length; s < l; s++) {
this.myCardsPointer.getCard(s).isChoose() && a++;
}
this.label.string = a > o ? "多" + (a - o) + "张" : a < o ? "缺" + (o - a) + "张" : "";
}
}
};
r([ m(d.default) ], t.prototype, "myCardsPointer", void 0);
r([ m(cc.Label) ], t.prototype, "label", void 0);
return t = r([ h, y(4) ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
