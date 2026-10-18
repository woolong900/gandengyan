// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d9512E5eJFPypwrDqw6h2M9", "ClubLayer");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./EventUtils"), l = require("./BaseComponent"), c = require("./SoundUtils"), u = require("./WindowConfig"), d = require("./ClubPopupConfig"), p = require("./SafeAreaCtr"), f = require("./ClubListData"), h = require("./UserData"), m = require("./ClubMemberCellData"), y = require("./RoomInfoData"), g = require("./ClubMsg"), _ = cc._decorator, v = _.ccclass, C = _.property, b = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.clubListbeginPos = null;
t.contentBeginPos = null;
t.contentRoot = null;
t.clubListRoot = null;
t.recordBtnNode = null;
t.msgBtnNode = null;
t.inviteMsgPre = null;
t.myRecordBtnNode = null;
t._uiDirty = !0;
return t;
}
t.prototype.onLoad = function() {
var e = p.default.offsetX();
this.contentRoot.width = cc.winSize.width - 2 * e;
// 原顶部栏和它的子节点完全不动，只在右侧添加一块同纹理的背景补片。
// 补片不承载任何按钮或文字，避免宽度、锚点或 Widget 变更带动原元素。
var topPanal = this.contentRoot.getChildByName("TopPanal");
if (topPanal && e > .001) {
var topSprite = topPanal.getComponent(cc.Sprite);
if (topSprite && topSprite.spriteFrame) {
var topExtension = new cc.Node("TopPanalRightExtension");
topExtension.parent = this.contentRoot;
topExtension.width = e + 5;
topExtension.height = topPanal.height;
topExtension.anchorX = 0;
topExtension.anchorY = topPanal.anchorY;
// onLoad 时顶部栏的 Widget 尚未完成宽屏对齐，不能使用它当前的预制体宽度。
// 安全内容区右边界是稳定坐标，补片从这里开始并多覆盖 5px 到屏幕外沿。
topExtension.x = this.contentRoot.width / 2;
topExtension.y = topPanal.y;
topExtension.color = topPanal.color;
topExtension.opacity = topPanal.opacity;
var extensionSprite = topExtension.addComponent(cc.Sprite);
extensionSprite.spriteFrame = topSprite.spriteFrame;
extensionSprite.type = topSprite.type;
extensionSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
topExtension.setSiblingIndex(topPanal.getSiblingIndex());
}
}
// 左侧仍按原安全区裁切，右侧单独延伸到屏幕边缘。
// 调整遮罩锚点而不移动子节点，避免改变左侧俱乐部列表的原有布局。
var t = cc.winSize.width - e;
this.node.width = t;
this.node.height = cc.winSize.height;
this.node.anchorX = (cc.winSize.width / 2 - e) / t;
var o = this.node.getChildByName("Bg");
if (o && o.width > 0 && o.height > 0) {
var n = Math.max(cc.winSize.width / o.width, cc.winSize.height / o.height);
o.scaleX = n;
o.scaleY = n;
}
var r = -cc.winSize.width / 2 + e;
this.clubListRoot.x = r;
this.clubListbeginPos = cc.v2(r, 0);
this.contentBeginPos = cc.v2(0, 0);
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_club_list_hide, function() {
e.contentRoot.runAction(cc.moveTo(.3, e.contentBeginPos));
e.clubListRoot.runAction(cc.moveTo(.3, e.clubListbeginPos));
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.ui_club_list_show, function() {
e.contentRoot.runAction(cc.moveTo(.3, e.contentBeginPos.add(cc.v2(300, 0))));
e.clubListRoot.runAction(cc.moveTo(.3, e.clubListbeginPos.add(cc.v2(300, 0))));
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_club_focus_change, function() {
e.updateBtnState();
}, this, s.eOffType.OnDestroy);
this.updateBtnState();
i.default.eventUtils.on(a.default.pulic_game_free2begin, function(e, t) {
if (!y.default.isWatcher()) {
i.default.msgBox.showOnlyOk("<color=#5D461A>您所在的房间已开始游戏，请移步牌桌~</c>", function() {
i.default.uiHelper.loadScene(y.default.gameSceneName());
});
}
}, this, s.eOffType.OnDestroy);
};
t.prototype.updateBtnState = function() {
var e = f.default.get(f.default.focus);
if (e) {
var t = e.memberList().get(h.default.uid);
if (t.degress == m.eClubMemberDegree.Admin || t.degress === m.eClubMemberDegree.Master) {
this.recordBtnNode.active = !0;
this.msgBtnNode.active = !0;
} else {
this.recordBtnNode.active = !1;
this.msgBtnNode.active = !1;
}
this.myRecordBtnNode.active = e.enablePersonRecord;
}
};
t.prototype.onClickMember = function() {
c.default.clickBtn();
g.default.getClubListCb(function(e, t) {
t ? i.default.uiHelper.showTipNetError() : 0 === e.res.error && e.clubs.forEach(function(e) {
e.id === f.default.focus && i.default.uiHelper.show(u.eWindowID.ClubPopupBase, d.eClubPopupType.Member, e.antiAddiction);
});
});
};
t.prototype.onClickMsg = function() {
c.default.clickBtn();
i.default.uiHelper.showWithNode(u.eWindowID.InviteMsgLayer, this.inviteMsgPre);
};
t.prototype.onClickRecord = function() {
c.default.clickBtn();
g.default.getClubListCb(function(e, t) {
t ? i.default.uiHelper.showTipNetError() : 0 === e.res.error ? i.default.uiHelper.show(u.eWindowID.ClubPopupBase, d.eClubPopupType.Record) : i.default.uiHelper.showTipNetError();
});
};
t.prototype.onClickStarGame = function() {
c.default.clickBtn();
};
t.prototype.onClickMyRecord = function() {
c.default.clickBtn();
g.default.getClubListCb(function(e, t) {
t ? i.default.uiHelper.showTipNetError() : 0 === e.res.error ? i.default.uiHelper.show(u.eWindowID.ClubMyRecordLayer) : i.default.uiHelper.showTipNetError();
});
};
r([ C(cc.Node) ], t.prototype, "contentRoot", void 0);
r([ C(cc.Node) ], t.prototype, "clubListRoot", void 0);
r([ C(cc.Node) ], t.prototype, "recordBtnNode", void 0);
r([ C(cc.Node) ], t.prototype, "msgBtnNode", void 0);
r([ C(cc.Prefab) ], t.prototype, "inviteMsgPre", void 0);
r([ C(cc.Node) ], t.prototype, "myRecordBtnNode", void 0);
return t = r([ v ], t);
}(l.default);
o.default = b;
cc._RF.pop();
