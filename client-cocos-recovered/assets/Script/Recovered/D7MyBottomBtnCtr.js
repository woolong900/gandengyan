// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "733feRFKMxO/aAcln+E04yS", "D7MyBottomBtnCtr");
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
var i = e("./RoomInfoData"), a = e("./D7Enum"), s = e("./gContext"), l = e("./D7EventKeys"), c = e("./EventUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnScore = null;
t.btnDiPai = null;
t.btnLast = null;
t.lookOverScore = null;
t.lookOverDiPai = null;
t.lastRoundNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on(l.default.data_status_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
this._updateUI();
this.btnScore.on(cc.Node.EventType.TOUCH_START, function(t) {
e.lookOverScore.active = !0;
}, this);
this.btnScore.on(cc.Node.EventType.TOUCH_MOVE, function(e) {}, this);
this.btnScore.on(cc.Node.EventType.TOUCH_END, function(t) {
e.lookOverScore.active = !1;
}, this);
this.btnScore.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
e.lookOverScore.active = !1;
}, this);
this.btnDiPai.on(cc.Node.EventType.TOUCH_START, function(t) {
e.lookOverDiPai.active = !0;
}, this);
this.btnDiPai.on(cc.Node.EventType.TOUCH_MOVE, function(e) {}, this);
this.btnDiPai.on(cc.Node.EventType.TOUCH_END, function(t) {
e.lookOverDiPai.active = !1;
}, this);
this.btnDiPai.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
e.lookOverDiPai.active = !1;
}, this);
this.btnLast.on(cc.Node.EventType.TOUCH_START, function(t) {
e.lastRoundNode.active = !0;
}, this);
this.btnLast.on(cc.Node.EventType.TOUCH_MOVE, function(e) {}, this);
this.btnLast.on(cc.Node.EventType.TOUCH_END, function(t) {
e.lastRoundNode.active = !1;
}, this);
this.btnLast.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
e.lastRoundNode.active = !1;
}, this);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.btnDiPai.active = !1;
this.btnScore.active = !1;
this.btnLast.active = !1;
if (i.default.gameInfoD7.status === a.eD7GameStatus.Gameing) {
this.btnScore.active = !0;
this.btnLast.active = !0;
i.default.gameInfoD7.putRemainCards.length > 0 && (this.btnDiPai.active = !0);
}
this.btnDiPai.active || (this.lookOverDiPai.active = !1);
this.btnScore.active || (this.lookOverScore.active = !1);
this.btnLast.active || (this.lastRoundNode.active = !1);
};
r([ p(cc.Node) ], t.prototype, "btnScore", void 0);
r([ p(cc.Node) ], t.prototype, "btnDiPai", void 0);
r([ p(cc.Node) ], t.prototype, "btnLast", void 0);
r([ p(cc.Node) ], t.prototype, "lookOverScore", void 0);
r([ p(cc.Node) ], t.prototype, "lookOverDiPai", void 0);
r([ p(cc.Node) ], t.prototype, "lastRoundNode", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
