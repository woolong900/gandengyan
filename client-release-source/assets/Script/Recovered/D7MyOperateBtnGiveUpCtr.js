// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "38baeq4f1FIwadsdLjMwWih", "D7MyOperateBtnGiveUpCtr");
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
var i = require("./RoomInfoData"), a = require("./D7RoomUtils"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./EventUtils"), u = require("./SoundUtils"), d = require("./D7Enum"), p = require("./GameMsgD7"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btn = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on([ l.default.data_status_change, l.default.data_put_card ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.btn.node.active = !1;
if (!i.default.isWatcher() && i.default.gameInfoD7.status === d.eD7GameStatus.Gameing && a.default.getInstance().isViewDown(i.default.gameInfoD7.zhuangUid)) {
var e = i.default.myAbsolutePos(), t = i.default.config.peopleCount(), o = !1;
4 === t && 25 === i.default.gameInfoD7.handCards(e).length && (o = !0);
5 === t && 20 === i.default.gameInfoD7.handCards(e).length && (o = !0);
if (o) {
var n = i.default.gameInfoD7.friendCard, r = i.default.gameInfoD7.handCards(e), s = i.default.gameInfoD7.putRemainCards;
2 === this._countArray(r, n) + this._countArray(s, n) && (this.btn.node.active = !0);
}
}
};
t.prototype._countArray = function(e, t) {
for (var o = 0, n = 0, r = e.length; n < r; n++) {
e[n] === t && o++;
}
return o;
};
t.prototype.onClick = function() {
u.default.clickBtn();
s.default.msgBox.showNoClose("是否确认<color=bb6825> 认输 </c>？", function() {
p.default.getInstance().giveUp();
});
};
r([ m(cc.Button) ], t.prototype, "btn", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
