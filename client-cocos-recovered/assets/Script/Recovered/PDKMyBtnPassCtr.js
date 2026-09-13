// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e6e24J9XAtIjYx2NN+lnca/", "PDKMyBtnPassCtr");
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
var i = e("./gContext"), a = e("./RoomInfoData"), s = e("./PDKEnum"), l = e("./PDKEventKeys"), c = e("./EventUtils"), u = e("./SoundUtils"), d = e("./GameMsgPDK"), p = e("./PDKCardUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!a.default.isWatcher()) {
i.default.eventUtils.on(l.default.data_status_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
i.default.eventUtils.on(l.default.data_round_data_update, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
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
if (a.default.gameInfoPDK.status === s.ePDKGameStatus.Gameing) {
var e = a.default.myAbsolutePos(), t = a.default.gameInfoPDK.siteInfos.get(e);
if (t.roundType === s.eRoundTypePDK.Turn) if (t.turnType === s.ePDKTurnType.Normal) {
var o = a.default.gameInfoPDK.siteInfos.getLastPut(e);
if (o) {
if (i.default.gameLogic(a.default.config.index).isBiggerMustPut(a.default.config)) ; else {
var n = a.default.config.peopleCount(), r = a.default.gameInfoPDK.siteInfos.getNext(e, n).isWarning();
o.putCardType === p.ePDKOneHandType.Single && r || (this.btnNode.active = !0);
}
}
} else if (t.turnType === s.ePDKTurnType.NoBigger) {
i.default.gameLogic(a.default.config.index).isAutoPass(a.default.config) || (this.btnNode.active = !0);
}
}
};
t.prototype.onClick = function() {
u.default.clickBtn();
d.default.getInstance().pass();
};
r([ m(cc.Node) ], t.prototype, "btnNode", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
