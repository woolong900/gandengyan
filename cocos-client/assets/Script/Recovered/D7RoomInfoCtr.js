// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "62ca4u2Fs5KWJGxPY2Cp5IW", "D7RoomInfoCtr");
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
var i = require("./StringUtils"), a = require("./UserData"), s = require("./GameConn"), l = require("./ExUtils"), c = require("./RoomInfoData"), u = require("./EventUtils"), d = require("./D7EventKeys"), p = require("./gContext"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.signNodes = [];
t.powerNode = null;
t.timeLabel = null;
t.roomLabel = null;
t.gameCount = null;
t.detailsBg = null;
t.detailsLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.roomLabel.string = "" + c.default.roomId;
this._updateGameCount();
this._updateDetail();
this._showDetail();
p.default.eventUtils.on(d.default.data_step_change, function(t, o) {
e._updateGameCount();
}, this, u.eOffType.OnDestroy);
this.timeLabel.string = i.default.dateFormat(a.default.millisecond, "hh:mm");
this.schedule(function() {
e.timeLabel.string = i.default.dateFormat(a.default.millisecond, "hh:mm");
}, 1, cc.macro.REPEAT_FOREVER, 0);
this.updatePower();
this.schedule(function() {
e.updatePower();
}, 60, cc.macro.REPEAT_FOREVER, 0);
this.updateSign(this._getSign());
this.schedule(function() {
e.updateSign(e._getSign());
}, 3, cc.macro.REPEAT_FOREVER, 0);
};
t.prototype._updateGameCount = function() {
var e = c.default.config.gameCount();
this.gameCount.string = c.default.gameInfoD7.curStep + "/" + e;
};
t.prototype._getSign = function() {
var e = s.default.getDelay();
return (e < 50 ? 6 : e < 80 ? 5 : e < 150 ? 4 : e < 300 ? 3 : e < 800 ? 2 : 1) - 1;
};
t.prototype.updateSign = function(e) {
for (var t = 0, o = this.signNodes.length; t < o; t++) this.signNodes[t].active = !1;
this.signNodes[e].active = !0;
};
t.prototype.updatePower = function() {
var e = l.default.batteryRate();
this.powerNode.width = 20 * e;
};
t.prototype.onClickDetails = function() {
this.detailsBg.active ? this.detailsBg.active = !1 : this._showDetail();
};
t.prototype._updateDetail = function() {
var e = this;
this.detailsLabel.string = p.default.gameLogic().roomDetails(c.default.config);
this.scheduleOnce(function() {
var t = e.detailsLabel.node.width + 20, o = e.detailsLabel.node.height + 10;
e.detailsBg.width = t;
e.detailsBg.height = o;
});
};
t.prototype._showDetail = function() {
var e = this;
this.detailsBg.active = !0;
this.detailsBg.opacity = 255;
var t = cc.delayTime(3), o = cc.fadeOut(.3), n = cc.callFunc(function() {
e.detailsBg.active = !1;
});
this.detailsBg.stopAllActions();
this.detailsBg.runAction(cc.sequence(t, o, n));
};
r([ m(cc.Node) ], t.prototype, "signNodes", void 0);
r([ m(cc.Node) ], t.prototype, "powerNode", void 0);
r([ m(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ m(cc.Label) ], t.prototype, "roomLabel", void 0);
r([ m(cc.Label) ], t.prototype, "gameCount", void 0);
r([ m(cc.Node) ], t.prototype, "detailsBg", void 0);
r([ m(cc.Label) ], t.prototype, "detailsLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
