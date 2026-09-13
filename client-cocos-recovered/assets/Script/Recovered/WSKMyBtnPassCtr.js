// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2eb5fjaAVVONZqKyN57QJKD", "WSKMyBtnPassCtr");
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
var i = e("./RoomInfoData"), a = e("./EventUtils"), s = e("./SoundUtils"), l = e("./gContext"), c = e("./GameMsgWSK"), u = e("./WSKEnum"), d = e("./WSKEventKeys"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!i.default.isWatcher()) {
l.default.eventUtils.on(d.default.data_status_change, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
l.default.eventUtils.on(d.default.data_round_change, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
this._updateUI();
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.btnNode.active = !1;
if (i.default.gameInfoWSK.status === u.eWSKGameStatus.Gameing) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoWSK.siteInfos.get(e);
if (t.roundType === u.eWSKRoundType.Turn) {
var o = i.default.gameInfoWSK.siteInfos.getLastPut(e);
if (o) {
if (l.default.gameLogic(i.default.config.index).isBiggerMustPut(i.default.config)) {
var n = o.putVirtualCards, r = o.putType;
l.default.gameLogic().tip(t.handCards, n, r).tips.length > 0 || (this.btnNode.active = !0);
} else this.btnNode.active = !0;
}
}
}
};
t.prototype.onClick = function() {
s.default.clickBtn();
c.default.getInstance().pass();
};
r([ h(cc.Node) ], t.prototype, "btnNode", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
