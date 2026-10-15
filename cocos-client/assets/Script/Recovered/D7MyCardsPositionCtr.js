// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c365187I4lO0LCntF5BmfdX", "D7MyCardsPositionCtr");
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
var i = require("./RoomInfoData"), a = require("./D7CardUtils"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./EventUtils"), u = require("./D7MyCardsPointer"), d = require("./SafeAreaCtr"), p = cc._decorator, f = p.ccclass, h = p.property, m = p.executionOrder, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._totalW = 0;
t.myCardsPointer = null;
t.rootNode = null;
return t;
}
t.prototype.onLoad = function() {
var e = d.default.offsetX();
this._totalW = cc.winSize.width - 2 * e - 30;
};
t.prototype.start = function() {
var e = this;
this._updateUI();
s.default.eventUtils.on([ l.default.data_hand_card_add, l.default.data_hand_card_remove, l.default.data_hand_card_reset, l.default.data_put_remain, l.default.data_get_remain ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_main_card_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoD7.handCards(e), o = t.length, n = 0;
o > 25 && (n = 0);
this._isMain(t[0]) === this._isMain(t[o - 1]) && (n = 0);
var r = n + o, a = this._computeSpace(r - 1), s = r, l = !0;
n > 0 && (l = !1);
if (r <= s) for (var c = -(r - 1) * a / 2, u = 0, d = 0; d < o; d++) {
this.myCardsPointer.getCard(d).initPosition(c, u);
c += a;
if (l) ; else if (d + 1 < o && this._isMain(t[d]) && !this._isMain(t[d + 1])) {
c += n * a;
l = !0;
}
} else {
c = -(s - 1) * a / 2, u = 80;
var p = r - s;
for (d = 0; d < p; d++) {
this.myCardsPointer.getCard(d).initPosition(c, u);
c += a;
}
c = -(s - 1) * a / 2;
u = 0;
for (d = p; d < o; d++) {
this.myCardsPointer.getCard(d).initPosition(c, u);
c += a;
}
}
};
t.prototype._computeSpace = function(e) {
return 73 * e + 127 <= this._totalW ? 73 : 31 * e + 127 <= this._totalW ? (this._totalW - 127) / e : 31;
};
t.prototype._isMain = function(e) {
return a.default.isMain(e, i.default.gameInfoD7.mainCard);
};
r([ h(u.default) ], t.prototype, "myCardsPointer", void 0);
r([ h(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ f, m(3) ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
