// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5e486/2g1JNdq+mUl0MwEvU", "DDZMenuLayer");
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
var i = require("./SoundUtils"), a = require("./gContext"), s = require("./RoomInfoData"), l = require("./DDZEventKeys"), c = require("./EventUtils"), u = require("./UserData"), d = require("./ClubMsg"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.popMenu = null;
t.menuBtn = null;
t.btnBack = null;
t.btnExit = null;
t.btnDissolve = null;
t.btnLocation = null;
t.chatNode = null;
t.voiceNode = null;
t.chatLayerPre = null;
t.settingPre = null;
t.locationPre = null;
t.watchNode = null;
t.watchPlayerLayer = null;
t.btnForceDestroy = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(l.default.data_status_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
this.popMenu.active = !1;
this.btnForceDestroy.active = !1;
if (s.default.isPlayback()) {
this.btnLocation.active = !1;
this.chatNode.active = !1;
this.voiceNode.active = !1;
this.btnBack.active = !1;
this.btnExit.active = !0;
this.btnDissolve.active = !1;
this.watchNode.active = !1;
} else {
this.watchNode.active = a.default.gameLogic().isAllowWatch(s.default.config);
if (s.default.isWatcher()) {
var t = s.default.players.getByUid(u.default.uid);
t && t.isManager ? this.btnForceDestroy.active = !0 : this.btnForceDestroy.active = !1;
this.btnDissolve.active = !1;
this.btnExit.active = !0;
this.btnLocation.active = !1;
this.voiceNode.active = !1;
this.chatNode.active = !1;
} else {
this.btnLocation.active = !0;
this.chatNode.active = !0;
this.voiceNode.active = !0;
if (s.default.isFangZhu()) {
this.btnExit.active = !1;
this.btnDissolve.active = !0;
} else {
this.btnExit.active = !0;
this.btnDissolve.active = !1;
}
}
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.btnBack.active = s.default.isGameFree();
}
};
t.prototype.onClickWatch = function() {
i.default.clickBtn();
a.default.uiHelper.gameShow(this.watchPlayerLayer);
};
t.prototype.onClickBackHall = function() {
a.default.msgBox.showNoClose("<color=#5D461A>返回大厅，您的房间仍会保留哦！</c>", function() {
s.default.leaveRoom(!1);
});
};
t.prototype.onClickExit = function() {
i.default.clickBtn();
if (s.default.isPlayback()) s.default.leaveRoom(); else {
this.popMenu.active = !1;
a.default.msgBox.customExitRoom();
}
};
t.prototype.onClickForceDestroy = function() {
i.default.clickBtn();
a.default.msgBox.show("该房间正在游戏中，确定解散吗?", function() {
d.default.closeTable(s.default.roomId, function(e, t) {
t ? a.default.uiHelper.showTip("网络异常～") : 0 === e.res.error || a.default.uiHelper.showTip(e.res.what);
});
});
};
t.prototype.onClickDissolve = function() {
i.default.clickBtn();
this.popMenu.active = !1;
a.default.msgBox.customExitRoom();
};
t.prototype.onClickMenuOut = function() {
this.popMenu.active = !1;
};
t.prototype.onClickMenu = function() {
i.default.clickBtn();
this.popMenu.active ? this.popMenu.active = !1 : this.popMenu.active = !0;
};
t.prototype.onClickSetting = function() {
i.default.clickBtn();
this.popMenu.active = !1;
a.default.uiHelper.gameShow(this.settingPre);
};
t.prototype.onClickChat = function() {
i.default.clickBtn();
a.default.uiHelper.gameShow(this.chatLayerPre);
};
t.prototype.onClickLocation = function() {
i.default.clickBtn();
this.popMenu.active = !1;
a.default.uiHelper.gameShow(this.locationPre);
};
r([ h(cc.Node) ], t.prototype, "popMenu", void 0);
r([ h(cc.Node) ], t.prototype, "menuBtn", void 0);
r([ h(cc.Node) ], t.prototype, "btnBack", void 0);
r([ h(cc.Node) ], t.prototype, "btnExit", void 0);
r([ h(cc.Node) ], t.prototype, "btnDissolve", void 0);
r([ h(cc.Node) ], t.prototype, "btnLocation", void 0);
r([ h(cc.Node) ], t.prototype, "chatNode", void 0);
r([ h(cc.Node) ], t.prototype, "voiceNode", void 0);
r([ h(cc.Prefab) ], t.prototype, "chatLayerPre", void 0);
r([ h(cc.Prefab) ], t.prototype, "settingPre", void 0);
r([ h(cc.Prefab) ], t.prototype, "locationPre", void 0);
r([ h(cc.Node) ], t.prototype, "watchNode", void 0);
r([ h(cc.Prefab) ], t.prototype, "watchPlayerLayer", void 0);
r([ h(cc.Node) ], t.prototype, "btnForceDestroy", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
