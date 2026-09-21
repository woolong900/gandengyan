// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6b28fOi3ApCbJqhGMTS+K1a", "PDKPosClockCtr");
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
var i = require("./PDKPosCtr"), a = require("./RoomInfoData"), s = require("./UserData"), l = require("./GameSoundPDK"), c = require("./PDKEnum"), u = require("./gContext"), d = require("./PDKEventKeys"), p = require("./EventUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._endTime = 0;
t.posCtr = null;
t.rootNode = null;
t.timeLabel = null;
t._timeOffset = 0;
return t;
}
t.prototype.start = function() {
var e = this;
this.schedule(this._updateTime, 1, cc.macro.REPEAT_FOREVER);
u.default.eventUtils.on(d.default.data_status_change, function() {
e._reset();
}, this, p.eOffType.OnDestroy);
u.default.eventUtils.on(d.default.data_round_data_update, function(t, o) {
o.pos === e.posCtr.deskPos() && e._reset();
}, this, p.eOffType.OnDestroy);
u.default.eventUtils.on(d.default.data_piao_score_change, function(t, o) {
e._reset();
}, this, p.eOffType.OnDestroy);
this._reset();
};
t.prototype._reset = function() {
this.rootNode.active = !1;
var e = a.default.gameInfoPDK.status;
if (e === c.ePDKGameStatus.Piaoing) {
var t = a.default.myAbsolutePos();
if (this.posCtr.deskPos() === t) {
(o = a.default.gameInfoPDK.siteInfos.get(t)).bCanPiao() && this._resetShow();
}
}
if (e === c.ePDKGameStatus.Gameing) {
var o, n = this.posCtr.deskPos();
if (o = a.default.gameInfoPDK.siteInfos.get(n)) {
o.roundType === c.eRoundTypePDK.Turn && this._resetShow();
}
}
};
t.prototype._resetShow = function() {
this._endTime = s.default.millisecond + 1e3 * a.default.getCountDown();
this.timeLabel.string = "" + Math.ceil((this._endTime - s.default.millisecond) / 1e3);
this.rootNode.active = !0;
};
t.prototype._updateTime = function() {
if (this.rootNode.active) {
var e = Math.ceil((this._endTime - s.default.millisecond) / 1e3);
if (this._timeOffset !== e) {
this._timeOffset = e;
e <= 5 && e >= 0 && l.default.getInstance().clock();
}
e < 0 && (e = 0);
this.timeLabel.string = "" + e;
}
};
r([ m(i.default) ], t.prototype, "posCtr", void 0);
r([ m(cc.Node) ], t.prototype, "rootNode", void 0);
r([ m(cc.Label) ], t.prototype, "timeLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
