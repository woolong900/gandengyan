// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "731efq5njtMIoTNc3DWs7wr", "GDMenuLayer");
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
var i = require("./SoundUtils"), a = require("./gContext"), s = require("./RoomInfoData"), l = require("./EventUtils"), c = require("./UserData"), u = require("./ClubMsg"), d = require("./GDEventKeys"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
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
var drawer = this.popMenu && this.popMenu.getChildByName("sz_db");
var drawerSprite = drawer && drawer.getComponent(cc.Sprite);
if (drawerSprite) drawerSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
if (drawer) drawer.setContentSize(450, 720);
this.node.zIndex = 100;
this.restoreMenuButtonFrames();
// Recovered frames can report the whole atlas as originalSize. Keep the menu
// controls at their authored 57px size so transparent hit boxes cannot cover play.
var controls = [ this.chatNode, this.btnLocation, this.menuBtn, this.watchNode ];
for (var controlIndex = 0; controlIndex < controls.length; controlIndex++) {
var control = controls[controlIndex], sprite = control && control.getComponent(cc.Sprite);
if (!sprite) continue;
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.trim = !0;
control.setContentSize(57, 57);
var widget = control.getComponent(cc.Widget);
widget && widget.updateAlignment();
}
a.default.eventUtils.on(d.default.data_status_change, function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
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
var t = s.default.players.getByUid(c.default.uid);
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
t.prototype.restoreMenuButtonFrames = function() {
// Creator's texture importer clamps rotated atlas rectangles against the unrotated
// texture width (338 - 278 = 60), cutting off the icons. Restore the native DDZ
// frame geometry, including its logical size and zero trim offset, before layout.
var drawer = this.popMenu && this.popMenu.getChildByName("sz_db");
var buttons = drawer && drawer.getChildByName("Btns");
if (!buttons) return;
var frames = [ [ "BtnJS", 3, 127 ], [ "BtnExit", 136, 127 ], [ "BtnSetting", 269, 124 ] ];
for (var index = 0; index < frames.length; index++) {
var spec = frames[index], node = buttons.getChildByName(spec[0]);
var sprite = node && node.getComponent(cc.Sprite);
if (!sprite || !sprite.spriteFrame) continue;
var texture = sprite.spriteFrame.getTexture();
var frame = new cc.SpriteFrame(texture, cc.rect(278, spec[1], spec[2], 57),
!0, cc.v2(0, 0), cc.size(spec[2], 57));
frame.name = "gd_menu_" + spec[0];
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.spriteFrame = frame;
node.setContentSize(spec[2], 57);
}
var layout = buttons.getComponent(cc.Layout);
layout && layout.updateLayout();
// RAW sizing uses the importer's incorrect whole-atlas originalSize (338x774),
// causing the location button's invisible hit box to cover the room header.
var location = this.btnLocation, locationSprite = location && location.getComponent(cc.Sprite);
if (locationSprite && locationSprite.spriteFrame) {
locationSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
locationSprite.spriteFrame = new cc.SpriteFrame(locationSprite.spriteFrame.getTexture(),
cc.rect(278, 651, 57, 57), !1, cc.v2(0, 0), cc.size(57, 57));
location.setContentSize(57, 57);
var locationWidget = location.getComponent(cc.Widget);
locationWidget && locationWidget.updateAlignment();
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
u.default.closeTable(s.default.roomId, function(e, t) {
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
