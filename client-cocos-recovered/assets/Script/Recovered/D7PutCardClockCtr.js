// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "786ceog8dtIiLnu9A3tL1C1", "D7PutCardClockCtr");
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
var i = e("./RoomInfoData"), a = e("./D7Enum"), s = e("./gContext"), l = e("./D7EventKeys"), c = e("./EventUtils"), u = e("./D7PutCardCtr"), d = e("./UserData"), p = e("./D7GameInfoData"), f = e("./GameSoundD7"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._endTime = 0;
t.putCardCtr = null;
t.rootNode = null;
t.timeLabel = null;
t._timeOffset = 0;
return t;
}
t.prototype.start = function() {
var e = this;
if (i.default.isPlayback()) {
this.rootNode.active = !1;
this.enabled = !1;
} else {
this.schedule(this._updateTime, 1, cc.macro.REPEAT_FOREVER);
s.default.eventUtils.on(l.default.data_status_change, function() {
e._reset();
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_wating_jiao_time_change, function() {
e._reset();
}, this, c.eOffType.OnDestroy);
this._reset();
s.default.eventUtils.on([ l.default.data_jiao_ok, l.default.data_jiao_guo, l.default.data_fan_ok, l.default.data_fan_guo, l.default.data_put_card, l.default.data_put_remain ], function(t, o) {
o.pos === e.putCardCtr.deskPos() && (e.rootNode.active = !1);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_jiao_turn, l.default.data_fan_turn, l.default.data_put_turn ], function(t, o) {
o.pos === e.putCardCtr.deskPos() ? e._resetShow() : e.rootNode.active = !1;
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_get_remain ], function(t, o) {
if (0 === e.putCardCtr.uiPos) e.rootNode.active = !1; else {
o.pos === e.putCardCtr.deskPos() ? e._resetShow() : e.rootNode.active = !1;
}
}, this, c.eOffType.OnDestroy);
}
};
t.prototype._reset = function() {
this.rootNode.active = !1;
var e = i.default.gameInfoD7.status;
if (e === a.eD7GameStatus.Calling || e === a.eD7GameStatus.Gameing) {
var t = i.default.gameInfoD7.getRemainInfo.uid;
if (t > 0) {
if (0 !== this.putCardCtr.uiPos) {
var o = i.default.players.getByUid(t).pos;
this.putCardCtr.deskPos() === o && this._resetShow();
}
} else {
var n = i.default.gameInfoD7.roundData(), r = i.default.gameInfoD7.curOpUid;
if (n.type === p.eRoundTypeD7.Fan || n.type === p.eRoundTypeD7.Jiao || n.type === p.eRoundTypeD7.Put) {
var s = n.lastAction();
if (i.default.isWatcher()) {
o = i.default.players.getByUid(r).pos;
this.putCardCtr.deskPos() === o && this._resetShow();
} else s && s.pos === this.putCardCtr.deskPos() && this._resetShow();
} else {
var l = i.default.gameInfoD7.waitingJiaoEndTime();
if (l - d.default.millisecond > 0 && i.default.myAbsolutePos() === this.putCardCtr.deskPos()) {
this._endTime = l;
this.timeLabel.string = "" + Math.ceil((this._endTime - d.default.millisecond) / 1e3);
this.rootNode.active = !0;
}
}
}
}
};
t.prototype._resetShow = function() {
this._endTime = d.default.millisecond + 15e3;
this.timeLabel.string = "" + Math.ceil((this._endTime - d.default.millisecond) / 1e3);
this.rootNode.active = !0;
};
t.prototype._updateTime = function() {
if (this.rootNode.active) {
var e = Math.ceil((this._endTime - d.default.millisecond) / 1e3);
if (this._timeOffset !== e) {
this._timeOffset = e;
e <= 5 && e >= 0 && f.default.getInstance().clock();
}
e < 0 && (e = 0);
this.timeLabel.string = "" + e;
}
};
r([ y(u.default) ], t.prototype, "putCardCtr", void 0);
r([ y(cc.Node) ], t.prototype, "rootNode", void 0);
r([ y(cc.Label) ], t.prototype, "timeLabel", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
