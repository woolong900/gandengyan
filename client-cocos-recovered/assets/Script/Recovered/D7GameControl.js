// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "30f147M0P5OcKLARrKfAhfn", "D7GameControl");
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
var i = e("./DismissRoomInfoData"), a = e("./gContext"), s = e("./EventKeys"), l = e("./RoomInfoData"), c = e("./D7Enum"), u = e("./UserData"), d = e("./EventUtils"), p = e("./D7EventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dismissRoot = null;
t.singleEndRoot = null;
t.dismissRoomPre = null;
t.singleEndPre = null;
t.totalEndPre = null;
t.liuJuPre = null;
t.captureRoot = null;
t.showFirend = null;
t.showTuoLaJi = null;
return t;
}
o = t;
t.prototype.onLoad = function() {
o._instance = this;
};
t.prototype.onDestroy = function() {
o._instance = null;
};
t.getInstance = function() {
return this._instance;
};
t.prototype.start = function() {
var e = this, t = cc.instantiate(this.dismissRoomPre);
this.dismissRoot.addChild(t);
this.dismissRoot.active = !1;
this._updateDismissVisible();
this.updateSingleEnd();
a.default.eventUtils.on(s.default.data_dismiss_state_change, function(t, o) {
e._updateDismissVisible();
if (!l.default.getTotalEndData() && l.default.gameInfoD7.status !== c.eD7GameStatus.Free && !i.default.destroying) {
var n = u.default.uid;
-1 !== i.default.disagreeList.indexOf(n) ? cc.log("玩家拒绝的时候，不提示~") : a.default.uiHelper.showTip("有玩家不同意解散房间~");
}
}, this, d.eOffType.OnDestroy);
a.default.eventUtils.on(p.default.data_status_change, function(t, o) {
var n = e;
o.o;
if (o.n === c.eD7GameStatus.SingleEnd) {
var r = l.default.myAbsolutePos();
l.default.players.getByPos(r).setReady(!1);
n.scheduleOnce(function() {
n.updateSingleEnd();
}, 1);
}
}, this, d.eOffType.OnDestroy);
a.default.eventUtils.on(p.default.ui_show_firend, function() {
e.showFirend.playAnimation("newAnimation", 1);
}, this, d.eOffType.OnDestroy);
a.default.eventUtils.on(p.default.ui_show_animation_tuolaji, function() {
e.showTuoLaJi.playAnimation("newAnimation", 1);
}, this, d.eOffType.OnDestroy);
a.default.eventUtils.on(s.default.data_room_destroyed, function(e, t) {
1 === t.reason ? a.default.msgBox.showOnlyOk("房主已解散房间！", function() {
l.default.leaveRoom();
}) : l.default.leaveRoom();
}, this, d.eOffType.OnDestroy);
a.default.eventUtils.on(s.default.data_game_total_end, function() {
e._updateTotalEnd();
}, this, d.eOffType.OnDestroy);
};
t.prototype._updateTotalEnd = function() {
var e = l.default.getTotalEndData();
e && (e.isNormalEnd || a.default.uiHelper.gameShow(this.totalEndPre));
};
t.prototype._updateDismissVisible = function() {
i.default.destroying ? this.dismissRoot.active = !0 : this.dismissRoot.active = !1;
};
t.prototype.updateSingleEnd = function() {
this.singleEndRoot.destroyAllChildren();
if (!l.default.isPlayback() && l.default.gameInfoD7.status === c.eD7GameStatus.SingleEnd) {
var e = l.default.myAbsolutePos();
if (!l.default.players.getByPos(e).isReady()) {
var t = cc.instantiate(this.singleEndPre);
this.singleEndRoot.addChild(t);
}
}
};
var o;
t._instance = null;
r([ m(cc.Node) ], t.prototype, "dismissRoot", void 0);
r([ m(cc.Node) ], t.prototype, "singleEndRoot", void 0);
r([ m(cc.Prefab) ], t.prototype, "dismissRoomPre", void 0);
r([ m(cc.Prefab) ], t.prototype, "singleEndPre", void 0);
r([ m(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
r([ m(cc.Prefab) ], t.prototype, "liuJuPre", void 0);
r([ m(cc.Node) ], t.prototype, "captureRoot", void 0);
r([ m(dragonBones.ArmatureDisplay) ], t.prototype, "showFirend", void 0);
r([ m(dragonBones.ArmatureDisplay) ], t.prototype, "showTuoLaJi", void 0);
return t = o = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
