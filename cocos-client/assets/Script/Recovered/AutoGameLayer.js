// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "84efbb57qtKob7j5SDH8hy3", "AutoGameLayer");
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
var i = require("./UserData"), a = require("./EventKeys"), s = require("./EventUtils"), l = require("./SoundUtils"), c = require("./gContext"), u = require("./RoomInfoData"), d = require("./CommonEnum"), p = require("./GameInfoData"), f = require("./DBDEnum"), h = require("./PDKEnum"), m = require("./DDZEnum"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.autoRoot = null;
t.timeRoot = null;
t.timeLabel = null;
t.flashNode = null;
t._offset = -1;
return t;
}
t.prototype.start = function() {
var e = this;
this.schedule(function() {
e._updateTime();
}, 1, cc.macro.REPEAT_FOREVER, 0);
c.default.eventUtils.on(a.default.data_player_auto_game_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = u.default.myAbsolutePos();
null != u.default.players.getByPos(e) && !u.default.isWatcher() && u.default.players.getByPos(e).isAutoGameing() ? this.autoRoot.active = !0 : this.autoRoot.active = !1;
};
t.prototype._updateTime = function() {
this.timeRoot.active = !1;
this.flashNode.active = !1;
if (c.default.gameLogic().isAutoGameRoom(u.default.config)) {
var e = u.default.players.getByUid(i.default.uid);
if (e && !e.isAutoGameing()) {
var t = [ d.eGameCategort.MJ, d.eGameCategort.DBD, d.eGameCategort.PDK, d.eGameCategort.DDZ ], o = u.default.gameInfo.status === p.eGameStatus.Gameing, n = u.default.gameInfoDBD.status === f.eDBDGameStatus.Gameing, r = u.default.gameInfoPDK.status === h.ePDKGameStatus.Gameing, a = u.default.gameInfoDDZ.status === m.eDDZGameStatus.Gameing, s = o || n || r || a;
if (t.includes(u.default.config.category()) && s && e.isTurn) {
var y = u.default.getCountDown();
if (!(y <= 0) && y >= 0 && y <= 10) {
this.timeRoot.active = !0;
this.timeLabel.string = "托管倒计时：" + y;
if (this._offset !== y) {
if (y <= 5) {
l.default.warning();
this.flashNode.active = !0;
this.flashNode.stopAllActions();
this.flashNode.opacity = 255;
var g = cc.fadeTo(.4, 0), _ = cc.fadeTo(.4, 255), v = cc.sequence(g, _);
this.flashNode.runAction(v);
}
this._offset = y;
}
}
}
}
}
};
t.prototype.onClickClose = function() {
l.default.clickBtn();
c.default.gameMsgBase().autoGame();
};
r([ _(cc.Node) ], t.prototype, "autoRoot", void 0);
r([ _(cc.Node) ], t.prototype, "timeRoot", void 0);
r([ _(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ _(cc.Node) ], t.prototype, "flashNode", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
