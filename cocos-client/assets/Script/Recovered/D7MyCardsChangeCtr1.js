// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "98a70+xBZtMp7UHU6X6Ujpx", "D7MyCardsChangeCtr1");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./D7EventKeys"), l = require("./EventUtils"), c = require("./D7MyCardsPointer"), u = cc._decorator, d = u.ccclass, p = u.property, f = u.executionOrder, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t._chooseRemainCards = [];
t.myCardsPointer = null;
return t;
}
t.prototype.onLoad = function() {
cc.log("此组件组好配合D7MyCardsChangeCtr使用，玩家拿底牌之后，牌要提起来。");
};
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on([ s.default.data_get_remain, s.default.data_hand_card_remove, s.default.data_hand_card_reset ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ s.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
};
t.prototype._check = function(e) {
var t = e.length;
if (t > 0) {
if (this._chooseRemainCards.length === t) {
for (var o = 0; o < t; o++) if (e[o] !== this._chooseRemainCards[o]) return !0;
return !1;
}
return !0;
}
return !1;
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
var e = i.default.gameInfoD7.getRemainInfo.cards || [];
if (this._check(e)) {
this._chooseRemainCards = [].concat(e);
this.myCardsPointer.chooseCards(i.default.gameInfoD7.getRemainInfo.cards);
}
}
};
r([ p(c.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ d, f(2) ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
