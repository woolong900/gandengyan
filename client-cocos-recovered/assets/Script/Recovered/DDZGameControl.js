// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c11c6q2cntK4L3AxynRbOZz", "DDZGameControl");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./RoomInfoData"), l = e("./DismissRoomInfoData"), c = e("./UserData"), u = e("./DDZEnum"), d = e("./EventUtils"), p = e("./DDZEventKeys"), f = e("./DDZSingleEndData"), h = e("./DDZAnimationBeginCtr"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dismissRoot = null;
t.singleEndRoot = null;
t.dismissRoomPre = null;
t.singleEndPre = null;
t.totalEndPre = null;
t.captureRoot = null;
t.chunTianSpine = null;
t.fanChunTianSpine = null;
t.animationBeginCtr = null;
t.mainCamera = null;
t.bg_node_one = null;
t.bg_node_two = null;
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
t.prototype.viewShake = function() {
cc.tween(this.mainCamera).to(.04, {
x: -15
}).to(.04, {
x: 15
}).to(.04, {
x: -15
}).to(.04, {
x: 15
}).to(.02, {
x: 0
}).start();
};
t.prototype.changeBg = function() {
if (1 == cc.sys.localStorage.getItem("my_choose_bg")) {
this.bg_node_one.active = !1;
this.bg_node_two.active = !0;
} else {
this.bg_node_one.active = !0;
this.bg_node_two.active = !1;
}
};
t.prototype.start = function() {
var e = this, t = cc.instantiate(this.dismissRoomPre);
this.dismissRoot.addChild(t);
this.dismissRoot.active = !1;
this._updateDismissVisible();
this.updateSingleEnd();
this.changeBg();
i.default.eventUtils.on(a.default.data_dismiss_state_change, function(t, o) {
e._updateDismissVisible();
if (!s.default.getTotalEndData() && s.default.gameInfoDDZ.status !== u.eDDZGameStatus.Free && !l.default.destroying) {
var n = c.default.uid;
-1 !== l.default.disagreeList.indexOf(n) ? cc.log("玩家拒绝的时候，不提示~") : i.default.uiHelper.showTip("有玩家不同意解散房间~");
}
}, this, d.eOffType.OnDestroy);
i.default.eventUtils.on(p.default.data_status_change, function(t, o) {
o.o;
if (o.n === u.eDDZGameStatus.SingleEnd) {
if (f.default.getInstance().bChunTian()) {
e.chunTianSpine.node.active = !0;
e.chunTianSpine.setAnimation(0, "animation", !1);
}
if (f.default.getInstance().bFanChun()) {
e.fanChunTianSpine.node.active = !0;
e.fanChunTianSpine.setAnimation(0, "animation", !1);
}
e.scheduleOnce(function() {
e.updateSingleEnd();
}, 1.5);
}
}, this, d.eOffType.OnDestroy);
i.default.eventUtils.on(p.default.playback_data_chuntian, function(t, o) {
if (1 == o.chuntianType) {
e.chunTianSpine.node.active = !0;
e.chunTianSpine.setAnimation(0, "animation", !1);
}
if (2 == o.chuntianType) {
e.fanChunTianSpine.node.active = !0;
e.fanChunTianSpine.setAnimation(0, "animation", !1);
}
}, this, d.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_room_destroyed, function(e, t) {
1 === t.reason ? i.default.msgBox.showOnlyOk("房主已解散房间！", function() {
s.default.leaveRoom();
}) : s.default.leaveRoom();
}, this, d.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_game_total_end, function() {
e._updateTotalEnd();
}, this, d.eOffType.OnDestroy);
};
t.prototype._updateTotalEnd = function() {
var e = s.default.getTotalEndData();
e && (e.isNormalEnd || i.default.uiHelper.gameShow(this.totalEndPre));
};
t.prototype._updateDismissVisible = function() {
l.default.destroying ? this.dismissRoot.active = !0 : this.dismissRoot.active = !1;
};
t.prototype.updateSingleEnd = function() {
this.singleEndRoot.destroyAllChildren();
if (!s.default.isPlayback() && s.default.gameInfoDDZ.status === u.eDDZGameStatus.SingleEnd) {
var e = s.default.myAbsolutePos();
if (!s.default.players.getByPos(e).isReady()) {
var t = cc.instantiate(this.singleEndPre);
this.singleEndRoot.addChild(t);
}
}
};
t.prototype.playAnimationBegin = function() {
this.animationBeginCtr.play();
};
var o;
t._instance = null;
r([ g(cc.Node) ], t.prototype, "dismissRoot", void 0);
r([ g(cc.Node) ], t.prototype, "singleEndRoot", void 0);
r([ g(cc.Prefab) ], t.prototype, "dismissRoomPre", void 0);
r([ g(cc.Prefab) ], t.prototype, "singleEndPre", void 0);
r([ g(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
r([ g(cc.Node) ], t.prototype, "captureRoot", void 0);
r([ g(sp.Skeleton) ], t.prototype, "chunTianSpine", void 0);
r([ g(sp.Skeleton) ], t.prototype, "fanChunTianSpine", void 0);
r([ g(h.default) ], t.prototype, "animationBeginCtr", void 0);
r([ g(cc.Node) ], t.prototype, "mainCamera", void 0);
r([ g(cc.Node) ], t.prototype, "bg_node_one", void 0);
r([ g(cc.Node) ], t.prototype, "bg_node_two", void 0);
return t = o = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
