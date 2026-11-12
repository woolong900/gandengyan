// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "628f88QaMxFfZ51b4lJfcbu", "GDPosClockCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventUtils"), l = require("./GDPosCtr"), c = require("./GDEventKeys"), u = require("./GDEnum"), d = require("./GameSoundGD"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._endTime = 0;
t.posCtr = null;
t.rootNode = null;
t.timeLabel = null;
t.buttonRoot = null;
t.lastEventPos = -1;
t._timeOffset = 0;
return t;
}
t.prototype.onLoad = function() {
this._clockFrame = require("./PokerClockStyle").apply(this.rootNode);
};
t.prototype.start = function() {
var e = this;
this.schedule(this._updateTime, 1, cc.macro.REPEAT_FOREVER);
a.default.eventUtils.on(c.default.data_round_data_update, function(t, o) {
o.pos === e.posCtr.deskPos() && e._reset(!0);
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(c.default.clock_off_btn, function(t, o) {
if (0 === e.posCtr.uiPos) {
e._clockDirty = !1;
if (e._pendingClockReset) e.unschedule(e._pendingClockReset);
e._pendingClockReset = null;
e.rootNode.active = !1;
}
}, this, s.eOffType.OnDestroy);
this._reset();
};
t.prototype._reset = function(e) {
var t = this;
void 0 === e && (e = !1);
if (this._pendingClockReset) {
this.unschedule(this._pendingClockReset);
this._pendingClockReset = null;
}
this.rootNode.active = !1;
// Only the local seat owns this shared row, which also contains its clock.
if (this.posCtr.uiPos === 0) this.buttonRoot.active = !1;
this._clockDirty = !1;
if (i.default.gameInfoGD.b_isDelay_time && e) {
this._pendingClockReset = function() {
if (t._pendingClockReset !== reset) return;
t._pendingClockReset = null;
t._clockDirty = !0;
i.default.gameInfoGD.b_isDelay_time = !1;
};
var reset = this._pendingClockReset;
this.scheduleOnce(reset, 2);
} else this._clockDirty = !0;
};
t.prototype.lateUpdate = function() {
if (this._clockDirty) {
this._clockDirty = !1;
this.resetClockFuction();
}
};
t.prototype.onDestroy = function() {
if (this._pendingClockReset) this.unschedule(this._pendingClockReset);
this._pendingClockReset = null;
if (this._clockFrame) this._clockFrame.destroy();
this._clockFrame = null;
};
t.prototype.resetClockFuction = function() {
if (this.posCtr.uiPos === 0) this.buttonRoot.active = !0;
this.rootNode.active = !1;
var e = i.default.gameInfoGD.status;
if (e === u.eGDGameStatus.gongpai) {
var t = this.posCtr.deskPos();
if (o = i.default.gameInfoGD.siteInfos.get(t)) {
o.roundType === u.eRoundTypeGD.gongpai && this._resetShow();
}
}
if (e === u.eGDGameStatus.Gameing) {
var o;
t = this.posCtr.deskPos();
if (o = i.default.gameInfoGD.siteInfos.get(t)) {
o.roundType === u.eRoundTypeGD.Turn && this._resetShow();
}
}
};
t.prototype._resetShow = function() {
this._writeTime(i.default.getCountDown());
this.rootNode.active = !0;
if (this.timeLabel.setVertsDirty) this.timeLabel.setVertsDirty();
};
t.prototype._writeTime = function(value) {
// Bitmap fonts only contain 0–9: NaN/Infinity would render as an empty clock.
value = Number(value);
value = isFinite(value) ? Math.max(0, Math.ceil(value)) : 0;
var label = this.timeLabel;
label.enabled = !0;
if (label.node) label.node.active = !0;
label.string = String(value);
// Rebuild even when the value is unchanged (e.g. 0 after re-enabling a clock).
// Assigning the same string alone does not dirty Creator's bitmap geometry.
if (label.setVertsDirty) label.setVertsDirty();
};
t.prototype._updateTime = function() {
if (this.rootNode.active) {
var e = i.default.getCountDown();
if (this._timeOffset !== e) {
this._timeOffset = e;
e <= 5 && e >= 0 && d.default.getInstance().clock();
}
e < 0 && (e = 0);
this._writeTime(e);
}
};
r([ h(l.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "rootNode", void 0);
r([ h(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ h(cc.Node) ], t.prototype, "buttonRoot", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
