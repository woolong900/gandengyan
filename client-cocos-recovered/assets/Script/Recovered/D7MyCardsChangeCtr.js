// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ca2a48noIZHbblPwoaEY+OO", "D7MyCardsChangeCtr");
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
var i = e("./RoomInfoData"), a = e("./gContext"), s = e("./D7EventKeys"), l = e("./EventUtils"), c = e("./D7MyCardItemCtr"), u = e("./D7MyCardsPointer"), d = e("./D7Enum"), p = e("./UserData"), f = e("./D7CardUtils"), h = cc._decorator, m = h.ccclass, y = h.property, g = h.executionOrder, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
return t;
}
t.prototype.onLoad = function() {
cc.log("注意此脚本挂载顺序，一定要在其它关于手牌控制之前\n因为此脚本的update必须先走，给手牌刷新为默认状态。");
};
t.prototype.start = function() {
var e = this;
this._updateUI();
a.default.eventUtils.on([ s.default.data_hand_card_add, s.default.data_hand_card_remove, s.default.data_hand_card_reset, s.default.data_put_remain ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ s.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ s.default.data_get_remain ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on(s.default.data_main_card_change, function() {
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
this.myCardsPointer.hideAll();
var e = i.default.myAbsolutePos(), t = i.default.gameInfoD7.status, o = [];
o = t === d.eD7GameStatus.Free || t === d.eD7GameStatus.SingleEnd ? [] : i.default.gameInfoD7.handCards(e);
var n = [];
if (i.default.gameInfoD7.getRemainInfo.uid == p.default.uid) {
var r = i.default.gameInfoD7.getRemainInfo.cards || [];
n = [].concat(r);
}
for (var a = 0, s = o.length; a < s; a++) {
var l = this.myCardsPointer.getCard(a).node;
l.active = !0;
var u = this._checkFlag(o[a], n), h = f.default.isMain(o[a], i.default.gameInfoD7.mainCard);
l.getComponent(c.default).initCard(o[a], u, h);
}
};
t.prototype._checkFlag = function(e, t) {
if (e > 0) for (var o = 0, n = t.length; o < n; o++) if (t[o] === e) {
t[o] = 0;
return !0;
}
return !1;
};
r([ y(u.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ m, g(1) ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
