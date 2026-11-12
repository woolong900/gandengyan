// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3e0b1gkbN5M/7PgFFIV5nyA", "WSKMeanLayer");
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
var i = require("./RoomInfoData"), a = require("./UserData"), s = require("./EventUtils"), l = require("./SoundUtils"), c = require("./gContext"), u = require("./ClubMsg"), d = require("./WSKEventKeys"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
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
t.btnForceDestroy = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.restoreMenuButtonFrames();
this.node.zIndex = 100;
this.popMenu.active = !1;
c.default.eventUtils.on(d.default.data_status_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this.update();
this.btnForceDestroy && (this.btnForceDestroy.active = !1);
if (i.default.isPlayback()) {
this.btnLocation.active = !1;
this.chatNode.active = !1;
this.voiceNode.active = !1;
this.btnExit.active = !0;
this.btnDissolve.active = !1;
this.watchNode && (this.watchNode.active = !1);
} else {
this.watchNode && (this.watchNode.active = c.default.gameLogic().isAllowWatch(i.default.config));
if (i.default.isWatcher()) {
var t = i.default.players.getByUid(a.default.uid);
t && t.isManager ? this.btnForceDestroy && (this.btnForceDestroy.active = !0) : this.btnForceDestroy && (this.btnForceDestroy.active = !1);
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
t.prototype.restoreMenuButtonFrames = function() {
if (this._menuFrames) return;
this._menuFrames = [];
var drawer = this.popMenu && this.popMenu.getChildByName("sz_db");
var buttons = drawer && drawer.getChildByName("Btns");
if (!drawer || !buttons) return;
var owned = this._menuFrames;
function restore(node, rect, rotated, width, height) {
var sprite = node && node.getComponent(cc.Sprite);
if (!sprite || !sprite.spriteFrame) return;
var frame = new cc.SpriteFrame(sprite.spriteFrame.getTexture(),
cc.rect.apply(cc, rect), rotated, cc.v2(0, 0), cc.size(rect[2], rect[3]));
owned.push(frame);
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.type = cc.Sprite.Type.SIMPLE;
sprite.trim = true;
sprite.spriteFrame = frame;
node.setContentSize(width, height);
}
// SceneWSK authors a 450px drawer. TRIMMED sizing otherwise shrinks it to
// the 269px atlas crop. Retain its original anchor, position and gradient.
restore(drawer, [3, 3, 269, 720], false, 450, 720);
// WSK uses its own atlas (1ee0cabd5), with different Y coordinates from DDZ.
// Recovered imports clamp rotated frame widths to 338-278=60, losing icons.
var specs = [["BtnExit",198,127],["BtnJS",331,127],["BtnQZJS",3,189],
["BtnLocation",464,124],["BtnSetting",594,124]];
for (var index = 0; index < specs.length; index++) {
var spec = specs[index];
restore(buttons.getChildByName(spec[0]), [278,spec[1],spec[2],57], true, spec[2],57);
}
// Return-to-hall uses a separate, unrotated image; never substitute DDZ art.
restore(this.btnBack, [0,0,127,57], false,127,57);
var layout = buttons.getComponent(cc.Layout);
if (layout) layout.updateLayout();
};
t.prototype.onDestroy = function() {
if (this._menuFrames) this._menuFrames.forEach(function(frame) { frame.destroy(); });
this._menuFrames = null;
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.btnBack.active = i.default.isGameFree();
}
};
t.prototype.onClickBackHall = function() {
l.default.clickBtn();
c.default.msgBox.showNoClose("<color=#5D461A>返回大厅，您的房间仍会保留哦！</c>", function() {
i.default.leaveRoom(!1);
});
};
t.prototype.onClickWatch = function() {
l.default.clickBtn();
c.default.uiHelper.gameShow(this.watchPlayerLayer);
};
t.prototype.onClickExit = function() {
l.default.clickBtn();
if (i.default.isPlayback()) i.default.leaveRoom(); else {
this.popMenu.active = !1;
c.default.msgBox.customExitRoom();
}
};
t.prototype.onClickForceDestroy = function() {
l.default.clickBtn();
c.default.msgBox.show("该房间正在游戏中，确定解散吗?", function() {
u.default.closeTable(i.default.roomId, function(e, t) {
t ? c.default.uiHelper.showTip("网络异常～") : 0 === e.res.error || c.default.uiHelper.showTip(e.res.what);
});
});
};
t.prototype.onClickDissolve = function() {
l.default.clickBtn();
this.popMenu.active = !1;
c.default.msgBox.customExitRoom();
};
t.prototype.onClickMenuOut = function() {
this.popMenu.active = !1;
};
t.prototype.onClickMenu = function() {
l.default.clickBtn();
this.popMenu.active ? this.popMenu.active = !1 : this.popMenu.active = !0;
};
t.prototype.onClickSetting = function() {
l.default.clickBtn();
this.popMenu.active = !1;
c.default.uiHelper.gameShow(this.settingPre);
};
t.prototype.onClickChat = function() {
l.default.clickBtn();
c.default.uiHelper.gameShow(this.chatPre);
};
t.prototype.onClickLocation = function() {
l.default.clickBtn();
this.popMenu.active = !1;
c.default.uiHelper.gameShow(this.locationPre);
};
r([ h(cc.Node) ], t.prototype, "popMenu", void 0);
r([ h(cc.Node) ], t.prototype, "btnBack", void 0);
r([ h(cc.Node) ], t.prototype, "btnExit", void 0);
r([ h(cc.Node) ], t.prototype, "btnDissolve", void 0);
r([ h(cc.Node) ], t.prototype, "btnLocation", void 0);
r([ h(cc.Node) ], t.prototype, "chatNode", void 0);
r([ h(cc.Node) ], t.prototype, "voiceNode", void 0);
r([ h(cc.Prefab) ], t.prototype, "chatPre", void 0);
r([ h(cc.Prefab) ], t.prototype, "settingPre", void 0);
r([ h(cc.Prefab) ], t.prototype, "locationPre", void 0);
r([ h(cc.Node) ], t.prototype, "watchNode", void 0);
r([ h(cc.Prefab) ], t.prototype, "watchPlayerLayer", void 0);
r([ h(cc.Node) ], t.prototype, "btnForceDestroy", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
