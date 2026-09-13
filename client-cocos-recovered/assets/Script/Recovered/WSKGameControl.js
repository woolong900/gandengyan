// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "28d8dPrPsVH0bJXE9vPJe28", "WSKGameControl");
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
}, i = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(r, i) {
function a(e) {
try {
l(n.next(e));
} catch (e) {
i(e);
}
}
function s(e) {
try {
l(n.throw(e));
} catch (e) {
i(e);
}
}
function l(e) {
e.done ? r(e.value) : new o(function(t) {
t(e.value);
}).then(a, s);
}
l((n = n.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var o, n, r, i, a = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function s(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n),
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(r = a.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < r[1]) {
a.label = r[1];
r = i;
break;
}
if (r && a.label < r[2]) {
a.label = r[2];
a.ops.push(i);
break;
}
r[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var s = e("./DismissRoomInfoData"), l = e("./RoomInfoData"), c = e("./UserData"), u = e("./EventKeys"), d = e("./EventUtils"), p = e("./GameLogicWSK"), f = e("./GameSoundWSK"), h = e("./gContext"), m = e("./WSKEnum"), y = e("./WSKEventKeys"), g = e("./WSKAnimationBeginCtr"), _ = e("./WSKChangePosCtr"), v = e("./WSKFirendCardShowCtr"), C = cc._decorator, b = C.ccclass, D = C.property, S = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dismissRoot = null;
t.singleEndRoot = null;
t.dismissRoomPre = null;
t.singleEndPre = null;
t.totalEndPre = null;
t.captureRoot = null;
t.showFirend = null;
t.dragonBomb = null;
t.dragonKing = null;
t.dragon510k = null;
t.animationBeginCtr = null;
t.changePosCtr = null;
t.friendCardShowCtr = null;
t.bAreaOnOff1 = !0;
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
h.default.eventUtils.on(u.default.data_dismiss_state_change, function(t, o) {
e._updateDismissVisible();
if (!l.default.getTotalEndData() && l.default.gameInfoWSK.status !== m.eWSKGameStatus.Free && !s.default.destroying) {
var n = c.default.uid;
-1 !== s.default.disagreeList.indexOf(n) ? cc.log("自己拒绝的时候，不提示~") : h.default.uiHelper.showTip("有玩家不同意解散房间~");
}
}, this, d.eOffType.OnDestroy);
h.default.eventUtils.on(y.default.data_status_change, function(t, o) {
o.o;
o.n === m.eWSKGameStatus.SingleEnd && e.scheduleOnce(function() {
e.updateSingleEnd();
}, 1);
}, this, d.eOffType.OnDestroy);
h.default.eventUtils.on(u.default.data_room_destroyed, function(e, t) {
1 === t.reason ? h.default.msgBox.showOnlyOk("房主已解散房间！", function() {
l.default.leaveRoom();
}) : l.default.leaveRoom();
}, this, d.eOffType.OnDestroy);
h.default.eventUtils.on(u.default.data_game_total_end, function() {
e._updateTotalEnd();
}, this, d.eOffType.OnDestroy);
this.bAreaOnOff1 && h.default.eventUtils.on(y.default.action_firend_show, function() {
e.showFirend.playAnimation("newAnimation", 1);
}, this, d.eOffType.OnDestroy);
h.default.eventUtils.on(y.default.action_put_show, function(t, o) {
var n = o.pos, r = l.default.gameInfoWSK.siteInfos.get(n), i = r.putType;
if (i === p.eWSKOneHandType.Bomb && r.putRealCards.length > 3) {
f.default.getInstance().bombEffect();
e.dragonBomb.node.active = !0;
e.dragonBomb.playAnimation("Sprite", 1);
}
if (i === p.eWSKOneHandType.BombKing) {
f.default.getInstance().bombEffect();
e.dragonKing.node.active = !0;
e.dragonKing.playAnimation("Sprite", 1);
}
if (i === p.eWSKOneHandType.WSKFalse || i === p.eWSKOneHandType.WSKTrue) {
e.dragon510k.node.active = !0;
f.default.getInstance().bombEffect();
e.dragon510k.playAnimation("Sprite", 1);
}
}, this, d.eOffType.OnDestroy);
};
t.prototype._updateTotalEnd = function() {
var e = l.default.getTotalEndData();
e && (e.isNormalEnd || h.default.uiHelper.gameShow(this.totalEndPre));
};
t.prototype._updateDismissVisible = function() {
s.default.destroying ? this.dismissRoot.active = !0 : this.dismissRoot.active = !1;
};
t.prototype.updateSingleEnd = function() {
this.singleEndRoot.destroyAllChildren();
if (!l.default.isPlayback() && l.default.gameInfoWSK.status === m.eWSKGameStatus.SingleEnd) {
var e = l.default.myAbsolutePos();
if (!l.default.players.getByPos(e).isReady()) {
var t = cc.instantiate(this.singleEndPre);
this.singleEndRoot.addChild(t);
}
}
};
t.prototype.playAnimationBegin = function(e) {
return i(this, void 0, void 0, function() {
var t, o;
return a(this, function(n) {
switch (n.label) {
case 0:
if (!e) return [ 3, 4 ];
t = -1;
o = -1;
if (2 === e.length) {
t = e[0];
o = e[1];
}
this.changePosCtr.stopUpdate();
this.animationBeginCtr.ctrRoot.active = !1;
this.animationBeginCtr.clockRoot.active = !1;
return [ 4, this.friendCardShowCtr.play() ];

case 1:
n.sent();
return [ 4, this.animationBeginCtr.play() ];

case 2:
n.sent();
return [ 4, this.changePosCtr.play(t, o) ];

case 3:
n.sent();
this.changePosCtr.beginUpdate();
return [ 3, 6 ];

case 4:
return [ 4, this.animationBeginCtr.play() ];

case 5:
n.sent();
n.label = 6;

case 6:
return [ 2 ];
}
});
});
};
var o;
t._instance = null;
r([ D(cc.Node) ], t.prototype, "dismissRoot", void 0);
r([ D(cc.Node) ], t.prototype, "singleEndRoot", void 0);
r([ D(cc.Prefab) ], t.prototype, "dismissRoomPre", void 0);
r([ D(cc.Prefab) ], t.prototype, "singleEndPre", void 0);
r([ D(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
r([ D(cc.Node) ], t.prototype, "captureRoot", void 0);
r([ D(dragonBones.ArmatureDisplay) ], t.prototype, "showFirend", void 0);
r([ D(dragonBones.ArmatureDisplay) ], t.prototype, "dragonBomb", void 0);
r([ D(dragonBones.ArmatureDisplay) ], t.prototype, "dragonKing", void 0);
r([ D(dragonBones.ArmatureDisplay) ], t.prototype, "dragon510k", void 0);
r([ D(g.default) ], t.prototype, "animationBeginCtr", void 0);
r([ D(_.default) ], t.prototype, "changePosCtr", void 0);
r([ D(v.default) ], t.prototype, "friendCardShowCtr", void 0);
r([ D({
displayName: "朋友牌动画",
serializable: !0,
tooltip: "地区开关控制：游戏中，玩家出朋友牌时，是否播放动画"
}) ], t.prototype, "bAreaOnOff1", void 0);
return t = o = r([ b ], t);
}(cc.Component);
o.default = S;
cc._RF.pop();
