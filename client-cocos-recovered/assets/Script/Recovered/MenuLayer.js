// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "37250ayX+dO7onC6Es1hhpZ", "MenuLayer");
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
var i = e("./gContext"), a = e("./CommonEnum"), s = e("./SoundUtils"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./UserData"), d = e("./RoomInfoData"), p = e("./WindowConfig"), f = e("./GameControl"), h = e("./MenuRoomInfo"), m = e("./SafeAreaCtr"), y = e("./ClubMsg"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.popMenu = null;
t.btnBack = null;
t.btnExit = null;
t.btnDissolve = null;
t.btn3D = null;
t.btn2D = null;
t.chatPre = null;
t.btnForceDestroy = null;
t.locationNode = null;
t.chatNode = null;
t.voiceNode = null;
t.watchNode = null;
t.watchPlayerLayer = null;
t.tingRoot = null;
t.menuRoomInfo = null;
return t;
}
t.prototype.start = function() {
var e = this, t = m.default.offsetX();
this.node.width = cc.winSize.width - 2 * t;
i.default.eventUtils.on([ l.default.data_game_view_changed, l.default.data_game_status_change ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
this.popMenu.active = !1;
this.update();
if (d.default.isPlayback()) {
this.locationNode.active = !1;
this.chatNode.active = !1;
this.voiceNode.active = !1;
this.watchNode.active = !1;
} else {
if (d.default.isWatcher()) {
this.chatNode.active = !1;
this.voiceNode.active = !1;
this.locationNode.active = !1;
} else {
this.chatNode.active = !0;
this.voiceNode.active = !0;
this.locationNode.active = !0;
}
this.watchNode.active = i.default.gameLogic().isAllowWatch(d.default.config);
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
if (i.default.gameLogic().fixGameView()) {
this.btn2D.active = !1;
this.btn3D.active = !1;
} else {
if (u.default.gameView === a.eGameView.View2D) {
this.btn2D.active = !1;
this.btn3D.active = !0;
} else {
this.btn2D.active = !0;
this.btn3D.active = !1;
}
}
d.default.isWatcher() ? this.btnBack.active = !1 : this.btnBack.active = d.default.isGameFree();
this.btnForceDestroy.active = !1;
if (d.default.isPlayback()) {
this.btnBack.active = !1;
this.btnExit.active = !0;
this.btnDissolve.active = !1;
this.btn2D.active = !1;
this.btn3D.active = !1;
} else if (d.default.isWatcher()) {
var e = d.default.players.getByUid(u.default.uid);
e && e.isManager ? this.btnForceDestroy.active = !0 : this.btnForceDestroy.active = !1;
this.btnDissolve.active = !1;
this.btnExit.active = !0;
} else if (d.default.isFangZhu()) {
this.btnExit.active = !1;
this.btnDissolve.active = !0;
} else {
this.btnExit.active = !0;
this.btnDissolve.active = !1;
}
}
};
t.prototype.addTingNode = function(e) {
this.tingRoot.addChild(e);
};
t.prototype.onClickMenuOut = function() {
this.popMenu.active = !1;
};
t.prototype.onClickChat = function() {
s.default.clickBtn();
i.default.uiHelper.show(p.eWindowID.ChatLayer);
};
t.prototype.onClickWatch = function() {
s.default.clickBtn();
i.default.uiHelper.gameShow(this.watchPlayerLayer);
};
t.prototype.onClickMenu = function() {
s.default.clickBtn();
this.popMenu.active ? this.popMenu.active = !1 : this.popMenu.active = !0;
};
t.prototype.onClickLocation = function() {
s.default.clickBtn();
i.default.uiHelper.show(p.eWindowID.LocationLayer);
};
t.prototype.onClickBackHall = function() {
s.default.clickBtn();
i.default.msgBox.showNoClose("<color=#5D461A>返回大厅，您的房间仍会保留哦！</c>", function() {
d.default.leaveRoom(!1);
});
};
t.prototype.onClickExit = function() {
s.default.clickBtn();
if (d.default.isPlayback()) d.default.leaveRoom(); else {
this.popMenu.active = !1;
i.default.msgBox.customExitRoom();
}
};
t.prototype.onClickDissolve = function() {
s.default.clickBtn();
this.popMenu.active = !1;
i.default.msgBox.customExitRoom();
};
t.prototype.onClickForceDestroy = function() {
s.default.clickBtn();
i.default.msgBox.show("该房间正在游戏中，确定解散吗?", function() {
y.default.closeTable(d.default.roomId, function(e, t) {
t ? i.default.uiHelper.showTip("网络异常～") : 0 === e.res.error || i.default.uiHelper.showTip(e.res.what);
});
});
};
t.prototype.onClickSetting = function() {
s.default.clickBtn();
this.popMenu.active = !1;
i.default.uiHelper.show(p.eWindowID.Setting);
};
t.prototype.onClick2D = function() {
s.default.clickBtn();
u.default.gameView = a.eGameView.View2D;
this.popMenu.active = !1;
f.default.getInstance().isPlayingBeginAnimation = !1;
};
t.prototype.onClick3D = function() {
s.default.clickBtn();
u.default.gameView = a.eGameView.View3D;
this.popMenu.active = !1;
f.default.getInstance().isPlayingBeginAnimation = !1;
};
t.prototype.showPiZi = function() {
this.menuRoomInfo.showPiZi();
};
r([ v(cc.Node) ], t.prototype, "popMenu", void 0);
r([ v(cc.Node) ], t.prototype, "btnBack", void 0);
r([ v(cc.Node) ], t.prototype, "btnExit", void 0);
r([ v(cc.Node) ], t.prototype, "btnDissolve", void 0);
r([ v(cc.Node) ], t.prototype, "btn3D", void 0);
r([ v(cc.Node) ], t.prototype, "btn2D", void 0);
r([ v(cc.Prefab) ], t.prototype, "chatPre", void 0);
r([ v(cc.Node) ], t.prototype, "btnForceDestroy", void 0);
r([ v(cc.Node) ], t.prototype, "locationNode", void 0);
r([ v(cc.Node) ], t.prototype, "chatNode", void 0);
r([ v(cc.Node) ], t.prototype, "voiceNode", void 0);
r([ v(cc.Node) ], t.prototype, "watchNode", void 0);
r([ v(cc.Prefab) ], t.prototype, "watchPlayerLayer", void 0);
r([ v(cc.Node) ], t.prototype, "tingRoot", void 0);
r([ v(h.default) ], t.prototype, "menuRoomInfo", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
