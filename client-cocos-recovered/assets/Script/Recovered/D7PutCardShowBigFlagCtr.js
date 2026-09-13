// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "aa06aRjfX9JB4B4oVbUuP9/", "D7PutCardShowBigFlagCtr");
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
var i = e("./gContext"), a = e("./D7EventKeys"), s = e("./D7PutCardCtr"), l = e("./EventUtils"), c = e("./RoomInfoData"), u = e("./D7Enum"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.putCardCtr = null;
t.flagNode = null;
t.cardsRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on([ a.default.data_put_card, a.default.data_status_change, a.default.data_round_change ], function(t, o) {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.flagNode.active = !1;
if (!(c.default.gameInfoD7.status !== u.eD7GameStatus.Gameing || c.default.gameInfoD7.isRound && c.default.isWatcher())) {
var e = c.default.gameInfoD7.roundData(), t = e.maxPutIndex();
if (t >= 0 && e.actions[t].pos === this.putCardCtr.deskPos()) {
this.flagNode.active = !0;
this._position(e.actions[t].cards.length);
}
}
};
t.prototype._position = function(e) {
var t = this.cardsRoot.children[0], o = t.width, n = t.height, r = (o + this.cardsRoot.getComponent(cc.Layout).spacingX) * (e - 1) + o, i = this.cardsRoot.x + (1 - this.cardsRoot.anchorX) * r - this.flagNode.width / 2 + 11, a = this.cardsRoot.y + (this.flagNode.height - n) / 2;
this.flagNode.x = i;
this.flagNode.y = a;
};
r([ f(s.default) ], t.prototype, "putCardCtr", void 0);
r([ f(cc.Node) ], t.prototype, "flagNode", void 0);
r([ f(cc.Node) ], t.prototype, "cardsRoot", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
