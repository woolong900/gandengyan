// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "01194YrmFlJwrZJmeH9Pw5i", "PDKRoomInfoCtr");
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
var i = require("./StringUtils"), a = require("./UserData"), s = require("./ExUtils"), l = require("./GameConn"), c = require("./gContext"), u = require("./RoomInfoData"), d = require("./PDKEventKeys"), p = require("./EventUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.signNodes = [];
t.powerNode = null;
t.timeLabel = null;
t.roomId = null;
t.gameCount = null;
t.detailBg = null;
t.desc = null;
return t;
}
t.prototype.start = function() {
var e = this;
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
this.roomId.string = "" + u.default.roomId;
this._updateDetail();
this._showDetail();
this._updateGameCount();
c.default.eventUtils.on(d.default.data_step_change, function() {
e._updateGameCount();
}, this, p.eOffType.OnDestroy);
};
t.prototype.onClickDetail = function() {
this.detailBg.active ? this.detailBg.active = !1 : this._showDetail();
};
t.prototype._updateGameCount = function() {
var e = u.default.config.gameCount();
this.gameCount.string = u.default.gameInfoPDK.curStep + "/" + e;
};
t.prototype._getSign = function() {
var e = l.default.getDelay();
return (e < 50 ? 6 : e < 80 ? 5 : e < 150 ? 4 : e < 300 ? 3 : e < 800 ? 2 : 1) - 1;
};
t.prototype.updateSign = function(e) {
for (var t = 0, o = this.signNodes.length; t < o; t++) this.signNodes[t].active = !1;
this.signNodes[e].active = !0;
};
t.prototype.updatePower = function() {
var e = s.default.batteryRate();
this.powerNode.width = 20 * e;
};
t.prototype._showDetail = function() {
var e = this;
this.detailBg.active = !0;
this.detailBg.opacity = 255;
var t = cc.delayTime(3), o = cc.fadeOut(.3), n = cc.callFunc(function() {
e.detailBg.active = !1;
});
this.detailBg.stopAllActions();
this.detailBg.runAction(cc.sequence(t, o, n));
};
t.prototype._updateDetail = function() {
var e = this, t = c.default.gameLogic().roomDetails(u.default.config);
this.desc.string = t;
this.scheduleOnce(function() {
var t = e.desc.node.width + 20;
e.detailBg.height = e.desc.node.height + 10;
e.detailBg.width = t;
});
};
r([ m(cc.Node) ], t.prototype, "signNodes", void 0);
r([ m(cc.Node) ], t.prototype, "powerNode", void 0);
r([ m(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ m(cc.Label) ], t.prototype, "roomId", void 0);
r([ m(cc.Label) ], t.prototype, "gameCount", void 0);
r([ m(cc.Node) ], t.prototype, "detailBg", void 0);
r([ m(cc.Label) ], t.prototype, "desc", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
