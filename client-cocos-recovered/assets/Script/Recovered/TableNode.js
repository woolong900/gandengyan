// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3223aa9gzFDg4TffXa7SxIE", "TableNode");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./EventKeys"), l = require("./EventUtils"), c = require("./CommonEnum"), u = require("./GameInfoData"), d = require("./StringUtils"), p = require("./Loader"), f = require("./DiceAnimate"), h = require("./GameControl"), m = require("./UserData"), y = require("./RoomUtils"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._curPinter = -100;
t.view = c.eGameView.View2D;
t.timeLabel = null;
t.posPointer = [];
t.posTextList = [];
t.gameName = null;
t.gameNameEx = null;
t.playerCount = null;
t.otherLabel = null;
t.diceRoot = null;
return t;
}
t.prototype._gameName = function() {
var e = i.default.config, t = i.default.config.index;
if (2 === t) {
if (2 === (o = e.peopleCount())) return "激情单挑";
if (3 === o) return "铁三角";
}
if (15 === t) {
var o = e.peopleCount(), n = e.isChecked(1) ? "癞晃" : "硬晃";
return 2 === o ? "两只脚 " + n : 3 === o ? "三只脚 " + n : "天门" + n;
}
return e.gameName();
};
t.prototype.start = function() {
this.gameName.string = this._gameName();
var e = a.default.gameLogic().roomDescEx();
this.gameNameEx.string = e;
if (m.default.gameView === c.eGameView.View2D) {
this.gameNameEx.string = "";
this.gameName.node.y = 180;
} else if (e) {
this.gameName.node.y = 205;
this.gameNameEx.node.y = 160;
} else this.gameName.node.y = 185;
if (this.view === c.eGameView.View3D) this.playerCount.string = ""; else {
var t = i.default.config.peopleCount(), o = d.default.int2Str(t);
this.playerCount.string = o + "人房";
}
};
t.prototype.onEnable = function() {
var e = this;
this.updateUI();
this.unschedule(this._updateTime);
this.schedule(this._updateTime, 1, cc.macro.REPEAT_FOREVER);
a.default.eventUtils.on([ s.default.data_player_update, s.default.data_operated_change, s.default.data_game_status_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_game_watch_pos_change, function() {
e._curPinter = -100;
e._uiDirty = !0;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on([ s.default.data_get_card, s.default.data_put_card, s.default.data_operated_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDisable);
};
t.prototype.update = function() {
if (this._uiDirty) {
if (h.default.getInstance().isPlayingBeginAnimation) return;
this.diceRoot && this.diceRoot.destroyAllChildren();
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.playAnimationDice = function() {
var e = this;
p.default.loadPre("Hall/Res/Prefab/Game/Animate/DiceAnimate", function(t) {
if (e.node && e.node.isValid) {
var o = cc.instantiate(t);
e.timeLabel.string = "";
o.getComponent(f.default).setData(function() {});
e.diceRoot.addChild(o);
}
});
};
t.prototype.endAnimationDice = function() {
this.diceRoot.destroyAllChildren();
};
t.prototype._updateText = function(e) {
var t = y.default.getInstance().viewPos2DeskPos(e), o = this.posTextList[e], n = [ "east", "south", "west", "north" ][t];
if (this.view === c.eGameView.View2D) {
var r = "Hall/Res/Texture/Game/2d/table/" + n;
p.default.setImg(r, o);
} else {
r = "Hall/Res/Texture/Game/3d/table/" + [ "down", "left", "up", "right" ][e] + "/" + n;
p.default.setImg(r, o);
}
};
t.prototype.updateUI = function() {
this._updateText(c.eViewPos.Down);
this._updateText(c.eViewPos.Left);
this._updateText(c.eViewPos.Right);
this._updateText(c.eViewPos.Up);
this._updateTime();
this.otherLabel.string = a.default.gameLogic().tabelDesc();
var e = i.default.gameInfo.playerPointer;
if (e !== this._curPinter) {
this._curPinter = e;
for (var t = 0, o = this.posPointer.length; t < o; t++) {
var n = this.posPointer[t];
n.stopAllActions();
n.active = !1;
}
if (this._curPinter !== c.eDeskPos.Stand) {
var r = y.default.getInstance().deskPos2ViewPos(this._curPinter), s = this.posPointer[r];
s.active = !0;
var l = cc.callFunc(function() {
s.opacity = 255;
}), u = cc.delayTime(.5), d = cc.callFunc(function() {
s.opacity = 0;
}), p = cc.sequence(l, u, d, u);
s.runAction(cc.repeatForever(p));
}
}
};
t.prototype._updateTime = function() {
if (i.default.gameInfo.status === u.eGameStatus.Free || i.default.gameInfo.status === u.eGameStatus.SingleEnd || h.default.getInstance().isPlayingBeginAnimation) this.timeLabel.string = ""; else {
var e = i.default.getCountDown();
this.timeLabel.string = e < 10 ? "0" + e : "" + e;
}
};
r([ v({
type: cc.Enum(c.eGameView),
displayName: "游戏视角",
serializable: !0
}) ], t.prototype, "view", void 0);
r([ v(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ v(cc.Node) ], t.prototype, "posPointer", void 0);
r([ v(cc.Sprite) ], t.prototype, "posTextList", void 0);
r([ v(cc.Label) ], t.prototype, "gameName", void 0);
r([ v(cc.Label) ], t.prototype, "gameNameEx", void 0);
r([ v(cc.Label) ], t.prototype, "playerCount", void 0);
r([ v(cc.Label) ], t.prototype, "otherLabel", void 0);
r([ v(cc.Node) ], t.prototype, "diceRoot", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
