// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9dda7AchghBf6C9MCUP4Xrt", "GameControl");
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
var i = e("./EventKeys"), a = e("./gContext"), s = e("./EventUtils"), l = e("./UserData"), c = e("./CommonEnum"), u = e("./SoundUtils"), d = e("./GameInfoData"), p = e("./ExUtils"), f = e("./RoomInfoData"), h = e("./Loader"), m = e("./DismissRoomInfoData"), y = e("./LiuJuAnimate"), g = e("./WindowConfig"), _ = e("./Control3D"), v = e("./MenuLayer"), C = e("./GameConfig"), b = e("./GameSoundMJ"), D = e("./ApplyBeginGameData"), S = cc._decorator, w = S.ccclass, O = S.property, P = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isPlayingBeginAnimation = !1;
t._menuLayer = null;
t.root2d = null;
t.root3d = null;
t.control3D = null;
t.rootMenu = null;
t.menuPre = null;
t.beginArmature = null;
t.liuJuPre = null;
t.singleEndRoot = null;
t.dismissRoot = null;
t.tingTipRoot = null;
t.singleEnd2DPre = null;
t.dismissRoomPre = null;
t.quickRoot = null;
t.qiuckGamePre = null;
t.captureRoot = null;
return t;
}
o = t;
t.getInstance = function() {
return this._instance;
};
Object.defineProperty(t.prototype, "isPlayingBeginAnimation", {
get: function() {
return this._isPlayingBeginAnimation;
},
set: function(e) {
this._isPlayingBeginAnimation = e;
},
enumerable: !0,
configurable: !0
});
t.prototype.playAnimationBegin = function() {
var e = this;
if (l.default.gameView === c.eGameView.View3D) {
b.default.getInstance().gameBegin();
e.beginArmature.node.active = !0;
e.beginArmature.playAnimation("newAnimation", 1);
e.beginArmature.once(dragonBones.EventObject.COMPLETE, function() {
e.scheduleOnce(function() {
e.beginArmature.node.active = !1;
}, .5);
}, e);
e.control3D.playAnimationBegin(function() {
e._menuLayer.showPiZi();
});
} else {
b.default.getInstance().gameBegin();
e.beginArmature.node.active = !0;
e.beginArmature.playAnimation("newAnimation", 1);
e.beginArmature.once(dragonBones.EventObject.COMPLETE, function() {
e.scheduleOnce(function() {
e.isPlayingBeginAnimation = !1;
e.beginArmature.node.active = !1;
e._menuLayer.showPiZi();
}, .5);
}, e);
}
};
t.prototype.playAnimationHu = function() {
l.default.gameView === c.eGameView.View3D && this.control3D.cardLayer3D && this.control3D.cardLayer3D.playAnimationHu();
};
t.prototype.onLoad = function() {
f.default.updateWatchPos(0);
var e = cc.instantiate(this.menuPre);
this.rootMenu.addChild(e);
this._menuLayer = e.getComponent(v.default);
o._instance = this;
};
t.prototype.start = function() {
var e = this;
u.default.playMusicGame("Hall/Sound/gameBgm");
a.default.eventUtils.on(i.default.data_game_view_changed, function() {
e.updateGameView();
e.updateSingleEnd2D();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(i.default.data_room_destroyed, function(e, t) {
1 === t.reason ? a.default.msgBox.showOnlyOk("房主已解散房间！", function() {
f.default.leaveRoom();
}) : f.default.leaveRoom();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(i.default.data_game_total_end, function() {
e.updateTotalEnd();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(i.default.data_dismiss_state_change, function(t, o) {
e.updateDismissVisible();
if (!f.default.getTotalEndData() && f.default.gameInfo.status !== d.eGameStatus.Free && !m.default.destroying) {
var n = l.default.uid;
-1 !== m.default.disagreeList.indexOf(n) ? cc.log("玩家拒绝的时候，不提示~") : a.default.uiHelper.showTip("有玩家不同意解散房间~");
}
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(i.default.data_apply_begin_game_state_change, function(t, o) {
e.updateQuickGameVisible();
}, this, s.eOffType.OnDestroy);
a.default.eventUtils.on(i.default.data_game_status_change, function(t, o) {
var n = o.o, r = o.n;
if (r === d.eGameStatus.SingleEnd || r === d.eGameStatus.TotalEnd) {
n === d.eGameStatus.Gameing && (f.default.gameInfo.singleEndInfo.isLiuJu() ? e.playLiuJu() : f.default.gameInfo.singleEndInfo.isInhorse() && e.playInhorse());
f.default.gameInfo.singleEndInfo.isInhorse() || e.showDelay();
}
r === d.eGameStatus.Gameing && f.default.isWatcher() && e.updateSingleEnd2D();
}, this, s.eOffType.OnDestroy);
if (f.default.isPlayback()) ; else {
C.default.area() === c.eArea.QJ ? h.default.loadPre("Hall/Res/Prefab/Game/TingTipNodeQJ", function(t) {
var o = cc.instantiate(t);
e._menuLayer.addTingNode(o);
}) : h.default.loadPre("Hall/Res/Prefab/Game/TingTipNode", function(t) {
var o = cc.instantiate(t);
o.x = -400;
o.y = -160;
e.tingTipRoot.addChild(o);
});
a.default.gameMsgBase().checkRealTimeSupport(f.default.config) || a.default.msgBox.showNoClose("此房间为语音房，您当前应用版本不支持该功能，是否下载最新版本体验该功能？", function() {
p.default.openWebpage(C.default.downloadUrl({
stop: 1
}));
}, function() {
a.default.gameMsgBase().dismissRoom(!0, null);
}, !1, !0, "前往下载", "退出房间");
}
var t = cc.instantiate(this.dismissRoomPre);
this.dismissRoot.addChild(t);
this.dismissRoot.active = !1;
this.quickRoot.addChild(cc.instantiate(this.qiuckGamePre));
this.quickRoot.active = !1;
this.updateGameView();
this.updateSingleEnd2D();
this.updateDismissVisible();
this.updateQuickGameVisible();
this.updateTotalEnd();
};
t.prototype.updateDismissVisible = function() {
m.default.destroying ? this.dismissRoot.active = !0 : this.dismissRoot.active = !1;
};
t.prototype.updateQuickGameVisible = function() {
D.default.applying ? this.quickRoot.active = !0 : this.quickRoot.active = !1;
};
t.prototype.updateSingleEnd2D = function() {
this.singleEndRoot.destroyAllChildren();
if (l.default.gameView !== c.eGameView.View3D && (f.default.gameInfo.status === d.eGameStatus.SingleEnd || f.default.gameInfo.status === d.eGameStatus.TotalEnd)) {
var e = l.default.uid;
if (!f.default.players.getByUid(e).isReady()) {
var t = cc.instantiate(this.singleEnd2DPre);
this.singleEndRoot.addChild(t);
}
}
};
t.prototype.updateGameView = function() {
if (l.default.gameView === c.eGameView.View2D) {
this.root2d.active = !0;
this.root3d.active = !1;
} else {
this.root2d.active = !1;
this.root3d.active = !0;
}
};
t.prototype.updateTotalEnd = function() {
var e = f.default.getTotalEndData();
e && (e.isNormalEnd || a.default.uiHelper.show(g.eWindowID.TotalEndLayer));
};
t.prototype.onDisable = function() {
p.default.cleanInviteData();
p.default.cleanCopyText();
};
t.prototype.playLiuJu = function() {
var e = this, t = cc.instantiate(this.liuJuPre);
t.getComponent(y.default).setData(function() {
if (e.node && e.node.isValid) {
cc.log("流局动画播放完成~");
t.removeFromParent();
t.destroy();
e.updateSingleEnd2D();
}
});
this.node.addChild(t);
};
t.prototype.playInhorse = function() {
var e = this;
console.log("显示中马");
h.default.loadPre("Hall/Res/Prefab/Game/Settlement/InHorseLayer", function(t) {
var o = cc.instantiate(t);
e.singleEndRoot.addChild(o);
});
this.scheduleOnce(function() {
e.updateSingleEnd2D();
}, 3.6);
};
t.prototype.showDelay = function() {
var e = this;
this.scheduleOnce(function() {
e.updateSingleEnd2D();
}, 1);
};
t.prototype.onDestroy = function() {
o._instance = null;
};
var o;
t._instance = null;
r([ O(cc.Node) ], t.prototype, "root2d", void 0);
r([ O(cc.Node) ], t.prototype, "root3d", void 0);
r([ O(_.default) ], t.prototype, "control3D", void 0);
r([ O(cc.Node) ], t.prototype, "rootMenu", void 0);
r([ O(cc.Prefab) ], t.prototype, "menuPre", void 0);
r([ O(dragonBones.ArmatureDisplay) ], t.prototype, "beginArmature", void 0);
r([ O(cc.Prefab) ], t.prototype, "liuJuPre", void 0);
r([ O(cc.Node) ], t.prototype, "singleEndRoot", void 0);
r([ O(cc.Node) ], t.prototype, "dismissRoot", void 0);
r([ O(cc.Node) ], t.prototype, "tingTipRoot", void 0);
r([ O(cc.Prefab) ], t.prototype, "singleEnd2DPre", void 0);
r([ O(cc.Prefab) ], t.prototype, "dismissRoomPre", void 0);
r([ O(cc.Node) ], t.prototype, "quickRoot", void 0);
r([ O(cc.Prefab) ], t.prototype, "qiuckGamePre", void 0);
r([ O(cc.Node) ], t.prototype, "captureRoot", void 0);
return t = o = r([ w ], t);
}(cc.Component);
o.default = P;
cc._RF.pop();
