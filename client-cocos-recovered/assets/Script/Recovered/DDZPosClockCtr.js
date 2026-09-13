// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ba42fO7wXxB0IjjlGJSHdaZ", "DDZPosClockCtr");
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
var i = require("./DDZPosCtr"), a = require("./RoomInfoData"), s = require("./GameSoundDDZ"), l = require("./DDZEnum"), c = require("./gContext"), u = require("./DDZEventKeys"), d = require("./EventUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
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
t.prototype.start = function() {
var e = this;
this.schedule(this._updateTime, 1, cc.macro.REPEAT_FOREVER);
c.default.eventUtils.on(u.default.data_round_data_update, function(t, o) {
if (o.pos === e.posCtr.deskPos()) {
var n = 0 == o.cards.length;
e._reset(n);
}
}, this, d.eOffType.OnDestroy);
this._reset();
};
t.prototype._reset = function(e) {
var t = this;
void 0 === e && (e = !1);
this.rootNode.active = !1;
this.buttonRoot.active = !1;
a.default.gameInfoDDZ.b_isDelay_time && e ? this.scheduleOnce(function() {
t.resetClockFuction();
a.default.gameInfoDDZ.b_isDelay_time = !1;
}, 2) : this.resetClockFuction();
};
t.prototype.resetClockFuction = function() {
this.buttonRoot.active = !0;
var e = a.default.gameInfoDDZ.status;
if (e === l.eDDZGameStatus.JiaoDiZhu) {
var t = this.posCtr.deskPos();
if (o = a.default.gameInfoDDZ.siteInfos.get(t)) {
o.roundType === l.eRoundTypeDDZ.JiaoDiZhu && this._resetShow();
}
}
if (e === l.eDDZGameStatus.Gameing) {
var o;
t = this.posCtr.deskPos();
if (o = a.default.gameInfoDDZ.siteInfos.get(t)) {
o.roundType === l.eRoundTypeDDZ.Turn && this._resetShow();
}
}
};
t.prototype._resetShow = function() {
this.timeLabel.string = a.default.getCountDown() + "";
this.rootNode.active = !0;
};
t.prototype._updateTime = function() {
if (this.rootNode.active) {
var e = a.default.getCountDown();
if (this._timeOffset !== e) {
this._timeOffset = e;
e <= 5 && e >= 0 && s.default.getInstance().clock();
}
e < 0 && (e = 0);
this.timeLabel.string = "" + e;
}
};
r([ h(i.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "rootNode", void 0);
r([ h(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ h(cc.Node) ], t.prototype, "buttonRoot", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
