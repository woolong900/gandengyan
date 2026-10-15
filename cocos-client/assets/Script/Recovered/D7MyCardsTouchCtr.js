// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c56634rUKZNn63GW7hWSuUp", "D7MyCardsTouchCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./D7EventKeys"), l = require("./D7MyCardsPointer"), c = require("./GameSoundD7"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._rects = [];
t._beginIndex = -1;
t._endIndex = -1;
t.myCardsPointer = null;
return t;
}
t.prototype._touchBegin = function() {
this._beginIndex = -1;
this._rects = [];
for (var e = i.default.myAbsolutePos(), t = i.default.gameInfoD7.handCards(e).length - 1; t >= 0; t--) {
var o = this.myCardsPointer.getCard(t).node, n = o.convertToWorldSpaceAR(cc.v2(0, 0)), r = new cc.Rect(n.x - o.width / 2, n.y - o.height / 2, o.width, o.height);
this._rects.push(r);
}
};
t.prototype._doMove = function(e) {
this._setCardUnselect();
for (var t = this._beginIndex, o = this._endIndex, n = 0, r = this._rects.length; n < r; n++) {
if (this._rects[n].contains(e)) {
this._beginIndex >= 0 || (this._beginIndex = r - 1 - n);
this._endIndex = r - 1 - n;
break;
}
}
t === this._beginIndex && o === this._endIndex || c.default.getInstance().selectCard();
this._setCardSelect();
};
t.prototype._setCardSelect = function() {
this._cardAction(this._beginIndex, this._endIndex, 2);
};
t.prototype._setCardUnselect = function() {
this._cardAction(0, this._rects.length - 1, 1);
};
t.prototype._touchEnd = function() {
if (this._beginIndex >= 0) {
this._cardAction(this._beginIndex, this._endIndex, 3);
a.default.eventUtils.emit(s.default.ui_my_card_choose_change);
} else this._clickAllChoosed();
};
t.prototype._clickAllChoosed = function() {
for (var e = !1, t = i.default.myAbsolutePos(), o = 0, n = i.default.gameInfoD7.handCards(t).length; o < n; o++) {
var r = this.myCardsPointer.getCard(o);
if (r.isChoose()) {
r.clicked();
e || r.isChoose() || (e = !0);
}
}
e && a.default.eventUtils.emit(s.default.ui_my_card_choose_change);
};
t.prototype._cardAction = function(e, t, o) {
if (e >= 0 && t >= 0) {
var n = e, r = t;
if (e > t) {
n = t;
r = e;
}
for (var i = n; i <= r; i++) {
var a = this.myCardsPointer.getCard(i);
if (1 === o) a.cleanSelectColor(); else if (2 === o) a.setSelectColor(); else if (3 === o) {
a.cleanSelectColor();
a.clicked();
}
}
}
};
t.prototype.start = function() {
var e = this;
if (i.default.isPlayback()) this.enabled = !1; else if (!i.default.isWatcher()) {
this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
e._touchBegin();
e._doMove(t.getLocation());
}, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
e._doMove(t.getLocation());
}, this);
this.node.on(cc.Node.EventType.TOUCH_END, function(t) {
e._doMove(t.getLocation());
e._touchEnd();
}, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
e._doMove(t.getLocation());
e._touchEnd();
}, this);
}
};
r([ p(l.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
