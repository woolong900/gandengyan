// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "448e0AtRQBG/qONbi+/XkYR", "GDGameControl");
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
var s = require("./gContext"), l = require("./EventKeys"), c = require("./RoomInfoData"), u = require("./DismissRoomInfoData"), d = require("./UserData"), p = require("./EventUtils"), f = require("./GDAnimationBeginCtr"), h = require("./GDEnum"), m = require("./GDEventKeys"), g = require("./GDChangePosCtr"), y = require("./GDFirendCardShowCtr"), _ = cc._decorator, v = _.ccclass, C = _.property, b = function(e) {
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
t.changePosCtr = null;
t.friendCardShowCtr = null;
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
require("./PokerDealFlow").detach(require("./GDStandalone").default, this.animationBeginCtr);
(this._wskBackgroundFrames || []).forEach(function(frame) { frame.destroy(); });
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
// SceneWSK uses two simultaneous layers, not two selectable full-screen skins.
// Reuse its room backdrop and transparent table, without moving GD controls.
if (this._wskBackgroundFrames || this._wskBackgroundLoading) return;
this._wskBackgroundLoading = true;
var self = this, textures = [], pending = 2, failed = false;
var paths = ["609a7ea7-dcd3-4770-9830-847e4aecacbf", "3c0b7016-913a-4f33-bed7-bfea3215336e"];
paths.forEach(function(path, index) {
cc.loader.loadRes("_RecoveredDependencies/Textures/" + path, cc.Texture2D, function(error, texture) {
if (!cc.isValid(self.node)) return;
if (error || !texture) failed = true;
textures[index] = texture;
if (--pending) return;
self._wskBackgroundLoading = false;
if (failed || !cc.isValid(self.bg_node_one) || !cc.isValid(self.bg_node_two)) return;
self._wskBackgroundFrames = textures.map(function(value) { return new cc.SpriteFrame(value); });
[self.bg_node_one, self.bg_node_two].forEach(function(node, i) {
var sprite = node.getComponent(cc.Sprite);
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.type = cc.Sprite.Type.SIMPLE;
sprite.spriteFrame = self._wskBackgroundFrames[i];
node.active = true;
node.setScale(1, 1);
node.setPosition(0, i === 0 ? 0 : -23.5);
node.setContentSize(i === 0 ? 1700 : 1280, i === 0 ? 720 : 673);
});
// Match SceneWSK/bg2's bottom/left/right widget, preserving its 673px height.
var table = self.bg_node_two;
var widget = table.getComponent(cc.Widget) || table.addComponent(cc.Widget);
widget.isAlignLeft = widget.isAlignRight = widget.isAlignBottom = true;
widget.isAlignTop = widget.isAlignHorizontalCenter = widget.isAlignVerticalCenter = false;
widget.left = widget.right = widget.bottom = 0;
widget.updateAlignment();
// GD's original title was baked into its old full-screen background. The
// dormant game_name node inherited a 跑得快 sprite, so it must not be enabled
// unchanged when switching to the shared ShuoHuZi table.
var title = table.getChildByName("game_name");
if (title) {
title.active = true;
title.y = 135.5;
var titleSprite = title.getComponent(cc.Sprite);
if (titleSprite) titleSprite.enabled = false;
// Cocos allows only one render component per node, even when the Sprite is
// disabled. Put the replacement label on its own child.
var labelNode = title.getChildByName("gd_title_text");
if (!labelNode) { labelNode = new cc.Node("gd_title_text"); title.addChild(labelNode); }
var titleLabel = labelNode.getComponent(cc.Label) || labelNode.addComponent(cc.Label);
titleLabel.string = "元来掼蛋";
titleLabel.fontSize = 48; titleLabel.lineHeight = 56; titleLabel.isBold = true;
titleLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
titleLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
labelNode.setContentSize(330, 66);
labelNode.color = cc.color(22, 121, 135, 255);
}
});
});
};
t.prototype.start = function() {
require("./PokerActionButtonStyle").apply(this.node);
var e = this, t = cc.instantiate(this.dismissRoomPre);
this.dismissRoot.addChild(t);
this.dismissRoot.active = !1;
this._updateDismissVisible();
this.updateSingleEnd();
this.changeBg();
var localRoom = require("./GDStandalone").default;
if (localRoom.isActive()) require("./PokerDealFlow").attach(localRoom, this.animationBeginCtr);
s.default.eventUtils.on(l.default.data_dismiss_state_change, function(t, o) {
e._updateDismissVisible();
if (!c.default.getTotalEndData() && c.default.gameInfoGD.status !== h.eGDGameStatus.Free && !u.default.destroying) {
var n = d.default.uid;
-1 !== u.default.disagreeList.indexOf(n) ? cc.log("玩家拒绝的时候，不提示~") : s.default.uiHelper.showTip("有玩家不同意解散房间~");
}
}, this, p.eOffType.OnDestroy);
s.default.eventUtils.on(m.default.data_status_change, function(e, t) {
t.o, t.n;
h.eGDGameStatus.SingleEnd;
}, this, p.eOffType.OnDestroy);
s.default.eventUtils.on(m.default.playback_data_chuntian, function(t, o) {
if (1 == o.chuntianType) {
e.chunTianSpine.node.active = !0;
e.chunTianSpine.setAnimation(0, "animation", !1);
}
if (2 == o.chuntianType) {
e.fanChunTianSpine.node.active = !0;
e.fanChunTianSpine.setAnimation(0, "animation", !1);
}
}, this, p.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_room_destroyed, function(e, t) {
1 === t.reason ? s.default.msgBox.showOnlyOk("房主已解散房间！", function() {
c.default.leaveRoom();
}) : c.default.leaveRoom();
}, this, p.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_game_total_end, function() {
e._updateTotalEnd();
}, this, p.eOffType.OnDestroy);
};
t.prototype._updateTotalEnd = function() {
var e = c.default.getTotalEndData();
e && (e.isNormalEnd || s.default.uiHelper.gameShow(this.totalEndPre));
};
t.prototype._updateDismissVisible = function() {
u.default.destroying ? this.dismissRoot.active = !0 : this.dismissRoot.active = !1;
};
t.prototype.updateSingleEnd = function() {};
t.prototype.playAnimationBegin = function(e, complete) {
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
if (complete) complete();
return [ 2 ];
}
});
});
};
var o;
t._instance = null;
r([ C(cc.Node) ], t.prototype, "dismissRoot", void 0);
r([ C(cc.Node) ], t.prototype, "singleEndRoot", void 0);
r([ C(cc.Prefab) ], t.prototype, "dismissRoomPre", void 0);
r([ C(cc.Prefab) ], t.prototype, "singleEndPre", void 0);
r([ C(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
r([ C(cc.Node) ], t.prototype, "captureRoot", void 0);
r([ C(sp.Skeleton) ], t.prototype, "chunTianSpine", void 0);
r([ C(sp.Skeleton) ], t.prototype, "fanChunTianSpine", void 0);
r([ C(f.default) ], t.prototype, "animationBeginCtr", void 0);
r([ C(g.default) ], t.prototype, "changePosCtr", void 0);
r([ C(y.default) ], t.prototype, "friendCardShowCtr", void 0);
r([ C(cc.Node) ], t.prototype, "mainCamera", void 0);
r([ C(cc.Node) ], t.prototype, "bg_node_one", void 0);
r([ C(cc.Node) ], t.prototype, "bg_node_two", void 0);
return t = o = r([ v ], t);
}(cc.Component);
o.default = b;
cc._RF.pop();
