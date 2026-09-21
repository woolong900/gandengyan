// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f4afaczLCNOapvcqBofQ9RM", "D7MeanLayer");
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
var i = require("./RoomInfoData"), a = require("./EventUtils"), s = require("./SoundUtils"), l = require("./gContext"), c = require("./D7EventKeys"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.popMenu = null;
t.btnBack = null;
t.btnExit = null;
t.btnDissolve = null;
t.btnLocation = null;
t.chatNode = null;
t.voiceNode = null;
t.chatPre = null;
t.settingPre = null;
t.locationPre = null;
t.watchNode = null;
t.watchPlayerLayer = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.popMenu.active = !1;
l.default.eventUtils.on(c.default.data_status_change, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
this.update();
if (i.default.isPlayback()) {
this.btnLocation.active = !1;
this.chatNode.active = !1;
this.voiceNode.active = !1;
this.btnExit.active = !0;
this.btnDissolve.active = !1;
this.watchNode && (this.watchNode.active = !1);
} else {
this.watchNode && (this.watchNode.active = l.default.gameLogic().isAllowWatch(i.default.config));
if (i.default.isWatcher()) {
this.btnDissolve.active = !1;
this.btnExit.active = !0;
this.btnLocation.active = !1;
this.voiceNode.active = !1;
this.chatNode.active = !1;
} else {
this.btnLocation.active = !0;
this.chatNode.active = !0;
this.voiceNode.active = !0;
if (i.default.isFangZhu()) {
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
this.btnBack.active = i.default.isGameFree();
}
};
t.prototype.onClickBackHall = function() {
s.default.clickBtn();
l.default.msgBox.showNoClose("<color=#5D461A>返回大厅，您的房间仍会保留哦！</c>", function() {
i.default.leaveRoom(!1);
});
};
t.prototype.onClickWatch = function() {
s.default.clickBtn();
l.default.uiHelper.gameShow(this.watchPlayerLayer);
};
t.prototype.onClickExit = function() {
s.default.clickBtn();
if (i.default.isPlayback()) i.default.leaveRoom(); else {
this.popMenu.active = !1;
l.default.msgBox.customExitRoom();
}
};
t.prototype.onClickDissolve = function() {
s.default.clickBtn();
this.popMenu.active = !1;
l.default.msgBox.customExitRoom();
};
t.prototype.onClickMenuOut = function() {
this.popMenu.active = !1;
};
t.prototype.onClickMenu = function() {
s.default.clickBtn();
this.popMenu.active ? this.popMenu.active = !1 : this.popMenu.active = !0;
};
t.prototype.onClickSetting = function() {
s.default.clickBtn();
this.popMenu.active = !1;
l.default.uiHelper.gameShow(this.settingPre);
};
t.prototype.onClickChat = function() {
s.default.clickBtn();
l.default.uiHelper.gameShow(this.chatPre);
};
t.prototype.onClickLocation = function() {
s.default.clickBtn();
this.popMenu.active = !1;
l.default.uiHelper.gameShow(this.locationPre);
};
r([ p(cc.Node) ], t.prototype, "popMenu", void 0);
r([ p(cc.Node) ], t.prototype, "btnBack", void 0);
r([ p(cc.Node) ], t.prototype, "btnExit", void 0);
r([ p(cc.Node) ], t.prototype, "btnDissolve", void 0);
r([ p(cc.Node) ], t.prototype, "btnLocation", void 0);
r([ p(cc.Node) ], t.prototype, "chatNode", void 0);
r([ p(cc.Node) ], t.prototype, "voiceNode", void 0);
r([ p(cc.Prefab) ], t.prototype, "chatPre", void 0);
r([ p(cc.Prefab) ], t.prototype, "settingPre", void 0);
r([ p(cc.Prefab) ], t.prototype, "locationPre", void 0);
r([ p(cc.Node) ], t.prototype, "watchNode", void 0);
r([ p(cc.Prefab) ], t.prototype, "watchPlayerLayer", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
