// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e053eUgm2BHuIqif+9mPJZW", "WSKMyCardsChangeCtr");
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
var i = e("./RoomInfoData"), a = e("./EventUtils"), s = e("./gContext"), l = e("./WSKEnum"), c = e("./WSKEventKeys"), u = e("./WSKMyCardItemCtr"), d = e("./WSKMyCardsPointer"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
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
s.default.eventUtils.on([ c.default.data_hand_card_change ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, a.eOffType.OnDestroy);
s.default.eventUtils.on([ c.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.myCardsPointer.hideAll();
for (var e = i.default.myAbsolutePos(), t = i.default.gameInfoWSK.status, o = [], n = 0, r = (o = t === l.eWSKGameStatus.Free || t === l.eWSKGameStatus.SingleEnd ? [] : i.default.gameInfoWSK.siteInfos.get(e).handCards).length; n < r; n++) {
var a = this.myCardsPointer.getCard(n).node;
a.active = !0;
var c = o[n], d = s.default.gameLogic().score(c);
a.getComponent(u.default).initCard(o[n], d > 0);
}
};
r([ h(d.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
