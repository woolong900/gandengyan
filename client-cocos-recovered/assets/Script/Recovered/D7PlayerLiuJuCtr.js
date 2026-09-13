// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a68c623CKdBhpiPzavMCyYf", "D7PlayerLiuJuCtr");
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
var i = e("./gContext"), a = e("./D7SingleEndData"), s = e("./RoomInfoData"), l = e("./D7Enum"), c = e("./Loader"), u = e("./D7CardUtils"), d = e("./D7EventKeys"), p = e("./EventUtils"), f = e("./D7PutCardCtr"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.cardRoot = null;
t.scoreLabel = null;
t.playerCtr = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on([ d.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, p.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.cardRoot.active = !1;
this.scoreLabel.string = "";
var e = a.default.getInstance();
if (s.default.gameInfoD7.status === l.eD7GameStatus.SingleEnd && e.isLiuJu()) {
this.cardRoot.active = !0;
this.scoreLabel.string = "";
var t = this.playerCtr.deskPos(), o = s.default.players.getByPos(t);
if (o) {
this.cardRoot.active = !0;
for (var n = e.playerCount(), r = 0; r < n; r++) {
if (e.playerUid(r) == o.uid) {
var i = e.playHzCards(r), c = u.default.sortDesc(i, 0);
this._setCards(c);
this.scoreLabel.string = e.playHzPoints(r) / 10 + "点";
}
}
}
}
};
t.prototype._setCards = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t], r = u.default.imgPath(n);
c.default.setImg(r, this.cardRoot.children[t]);
}
};
t.prototype.findPlayer = function(e) {
for (var t = a.default.getInstance().playerCount(), o = 0; o < t; o++) a.default.getInstance().playerUid(o);
};
r([ y(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ y(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ y(f.default) ], t.prototype, "playerCtr", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
