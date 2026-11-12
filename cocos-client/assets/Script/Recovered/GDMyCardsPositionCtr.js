// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "55637GtDRhGbbQ3VRqLfxFT", "GDMyCardsPositionCtr");
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
var i = require("./gContext"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./GDMyCardsPointer"), c = require("./GDEventKeys"), u = require("./GDEnum"), d = cc._decorator, p = d.ccclass, f = d.property, h = (d.executionOrder,
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
i.default.eventUtils.on([ c.default.data_hand_card_reset, c.default.data_hand_card_remove_firend, c.default.data_hand_card_remove ], function(t, o) {
o.pos === a.default.myAbsolutePos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ c.default.lipai_btn_click ], function(t, o) {
var n = o.cards;
e.myCardsPointer.node.setScale(.85);
e.myCardsPointer.node.setPosition(cc.v2(0, -232));
e.myCardsPointer.initShuPaiPosition(n);
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this.myCardsPointer._dealing) return;
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
if (this.myCardsPointer._dealing) { this._uiDirty = !0; return; }
var e = a.default.myAbsolutePos(), t = a.default.gameInfoGD.siteInfos.get(e).handCards, o = t.length;
if (0 != t.length) {
if (!a.default.gameInfoGD.lipaiBtnStuas) if (a.default.gameInfoGD.is_shuCard) {
if (a.default.gameInfoGD.status == u.eGDGameStatus.SingleEnd) return;
var n = this._getCardArray(t);
this.myCardsPointer.initShuPaiPosition(n);
} else for (i = 0; i < o; i++) this.myCardsPointer.initPosition(i, o);
} else for (var r = a.default.gameInfoGD.siteInfos.get(e).friendhandCards, i = 0; i < r.length; i++) this.myCardsPointer.initPosition(i, r.length);
};
t.prototype._getCardArray = function(e) {
for (var t = [], o = 0, n = -1, r = e.length - 1; r >= 0; r--) if (o != Math.floor(e[r] / 10)) {
t[++n] = [ e[r] ];
o = Math.floor(e[r] / 10);
} else t[n].push(e[r]);
return t;
};
r([ f(l.default) ], t.prototype, "myCardsPointer", void 0);
return t = r([ p ], t);
}(cc.Component));
o.default = h;
cc._RF.pop();
