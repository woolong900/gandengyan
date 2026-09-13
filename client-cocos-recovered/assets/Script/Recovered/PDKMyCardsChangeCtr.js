// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1d643cBQ2lBkqxLgt4nCl70", "PDKMyCardsChangeCtr");
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
var i = e("./gContext"), a = e("./PDKEventKeys"), s = e("./RoomInfoData"), l = e("./EventUtils"), c = e("./PDKEnum"), u = e("./PDKMyCardsPointer"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.myCardsPointer = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
i.default.eventUtils.on([ a.default.data_hand_card_remove, a.default.data_hand_card_reset ], function(t, o) {
o.pos === s.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.data_status_change ], function() {
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
for (var e = s.default.myAbsolutePos(), t = s.default.gameInfoPDK.status, o = [], n = 0, r = (o = t === c.ePDKGameStatus.Free || t === c.ePDKGameStatus.SingleEnd || t === c.ePDKGameStatus.Piaoing ? [] : s.default.gameInfoPDK.siteInfos.get(e).handCards).length; n < r; n++) this.myCardsPointer.setCard(n, o[n]);
};
r([ f(u.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
