// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ebaee6ohcpOJJJzW8LzvO5f", "WSKMyCardsPositionCtr");
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
var i = require("./RoomInfoData"), a = require("./EventUtils"), s = require("./gContext"), l = require("./WSKEventKeys"), c = require("./WSKMyCardsPointer"), u = cc._decorator, d = u.ccclass, p = u.property, f = (u.executionOrder,
function(e) {
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
s.default.eventUtils.on([ l.default.data_hand_card_change ], function(t, o) {
o.pos === i.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, a.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
for (var e = i.default.myAbsolutePos(), t = i.default.gameInfoWSK.siteInfos.get(e).handCards.length, o = 0; o < t; o++) this.myCardsPointer.initPosition(o, t);
};
r([ p(c.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ d ], t);
}(cc.Component));
o.default = f;
cc._RF.pop();
