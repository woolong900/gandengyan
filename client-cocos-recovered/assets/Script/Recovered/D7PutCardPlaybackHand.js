// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "591bd/HpVxAWp33/Wxvcb+u", "D7PutCardPlaybackHand");
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
var i = require("./RoomInfoData"), a = require("./D7PutCardCtr"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./EventUtils"), u = require("./D7Enum"), d = require("./D7CardUtils"), p = require("./Loader"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.putRoot = null;
t.fanRoot = null;
t.jiaoRoot = null;
t.giveupRoot = null;
t.passRoot = null;
t.handCardsRoot = null;
t.putCtr = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (i.default.isPlayback()) {
if (0 === this.putCtr.uiPos) {
this.putRoot.y = this.putRoot.y + -110;
this.fanRoot.y = this.fanRoot.y + -110;
this.jiaoRoot.y = this.jiaoRoot.y + -110;
this.giveupRoot.y = this.giveupRoot.y + -110;
this.passRoot.y = this.passRoot.y + -110;
}
if (1 === this.putCtr.uiPos) {
this.putRoot.y = this.putRoot.y - 35;
this.putRoot.x = this.putRoot.x - 25;
this.fanRoot.y = this.fanRoot.y - 35;
this.jiaoRoot.y = this.jiaoRoot.y - 35;
this.giveupRoot.y = this.giveupRoot.y - 35;
this.giveupRoot.x = this.giveupRoot.x - 110;
this.passRoot.y = this.passRoot.y - 35;
this.passRoot.x = this.passRoot.x - 110;
}
if (2 === this.putCtr.uiPos) {
this.putRoot.x = this.putRoot.x - 90;
this.giveupRoot.x = this.giveupRoot.x - 130;
this.passRoot.x = this.passRoot.x - 130;
}
if (4 === this.putCtr.uiPos) {
this.putRoot.x = this.putRoot.x + 90;
this.giveupRoot.x = this.giveupRoot.x + 130;
this.passRoot.x = this.passRoot.x + 130;
}
if (5 === this.putCtr.uiPos) {
this.putRoot.y = this.putRoot.y - 35;
this.putRoot.x = this.putRoot.x + 25;
this.fanRoot.y = this.fanRoot.y - 35;
this.jiaoRoot.y = this.jiaoRoot.y - 35;
this.giveupRoot.y = this.giveupRoot.y - 35;
this.giveupRoot.x = this.giveupRoot.x + 110;
this.passRoot.y = this.passRoot.y - 35;
this.passRoot.x = this.passRoot.x + 110;
}
s.default.eventUtils.on([ l.default.data_hand_card_add, l.default.data_hand_card_remove, l.default.data_hand_card_reset, l.default.data_put_remain ], function(t, o) {
o.pos === e.putCtr.deskPos() && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_get_remain ], function(t, o) {
o.pos === e.putCtr.deskPos() && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_main_card_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
this._updateUI();
} else this.enabled = !1;
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
for (var e = this.handCardsRoot.childrenCount, t = 0; t < e; t++) this.handCardsRoot.children[t].active = !1;
for (var o = i.default.gameInfoD7.status, n = this.putCtr.deskPos(), r = [], a = (t = 0,
(r = o === u.eD7GameStatus.Free || o === u.eD7GameStatus.SingleEnd ? [] : i.default.gameInfoD7.handCards(n, !1)).length); t < a; t++) {
var s = this.handCardsRoot.children[t];
s.active = !0;
var l = d.default.imgPath(r[t]);
p.default.setImg(l, s);
}
};
r([ m(cc.Node) ], t.prototype, "putRoot", void 0);
r([ m(cc.Node) ], t.prototype, "fanRoot", void 0);
r([ m(cc.Node) ], t.prototype, "jiaoRoot", void 0);
r([ m(cc.Node) ], t.prototype, "giveupRoot", void 0);
r([ m(cc.Node) ], t.prototype, "passRoot", void 0);
r([ m(cc.Node) ], t.prototype, "handCardsRoot", void 0);
r([ m(a.default) ], t.prototype, "putCtr", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
