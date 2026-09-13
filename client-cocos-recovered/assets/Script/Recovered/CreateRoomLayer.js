// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "977cdS27O5FbZ26XCuDcTn8", "CreateRoomLayer");
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
var i = require("./RoomConfigListData"), a = require("./CheckType"), s = require("./BtnGame"), l = require("./gContext"), c = require("./EventKeys"), u = require("./EventUtils"), d = require("./BaseComponent"), p = require("./ExUtils"), f = require("./UserData"), h = require("./SoundUtils"), m = require("./Storage"), y = require("./ClubMsg"), g = require("./CreateRoomAssist"), _ = require("./GameConfig"), v = cc._decorator, C = v.ccclass, b = v.property, D = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._chooseGameId = -1;
t._clubId = 0;
t.contentNdoe = null;
t.typePre = null;
t.rootNode = null;
t.listNode = null;
t.btnGame = null;
t.ipNotChoose = null;
t.ipChoosed = null;
t.cardRoot = null;
t.backTitleLabel = null;
t.createBtnNode = null;
t.savaeBtnNode = null;
t.maskNode = null;
t.allGameList = null;
return t;
}
t.prototype.onLoad = function() {
this.rootNode.width = cc.winSize.width;
};
t.prototype.setData = function(e) {
this._clubId = e || 0;
this.cardRoot.active = !f.default.isReivew;
};
t.prototype.start = function() {
var e = this, t = g.default.getClubScheme();
this.savaeBtnNode.active = t > 0;
this.createBtnNode.active = t <= 0;
this.backTitleLabel.string = t > 0 ? "玩法设置" : "创建房间";
var o = g.default.collectionGames(), n = o[0], r = 0;
if (t <= 0) {
var i = m.default.lastCreateRoomGameId.getValue();
-1 !== (r = o.indexOf(i)) && (n = i);
}
this.allGameList.setContentPosition(cc.v2(0, 91 * r));
for (var a = 0, d = o.length; a < d; a++) {
var p = cc.instantiate(this.btnGame), f = p.getComponent(s.default), h = o[a];
f.setData(h, h === n);
this.listNode.addChild(p);
}
this._lockCreateRoomScroll(this.allGameList, this.listNode);
this._lockCreateRoomScroll(this.allGameList, this.listNode);
l.default.eventUtils.on(c.default.ui_create_room_game_clicked, function(t, o) {
if (o !== e._chooseGameId) {
e._chooseGameId = o;
e._updateUI();
}
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.ui_create_room_note_show, function() {
e.maskNode.active = !0;
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.emit(c.default.ui_create_room_game_clicked, n);
};
t.prototype._updateUI = function() {
this.contentNdoe.destroyAllChildren();
i.default.get(this._chooseGameId).replaceDYJPay();
for (var e = g.default.get(this._chooseGameId).sortTypes(), t = 0, o = e.length; t < o; t++) {
var n = parseInt(e[t]), r = cc.instantiate(this.typePre);
this.contentNdoe.addChild(r);
var s = r.getComponent(a.default), l = this._clubId > 0;
s.setData(this._chooseGameId, n, l);
}
this._lockCreateRoomScroll(this.contentNdoe && this.contentNdoe.parent && this.contentNdoe.parent.parent && this.contentNdoe.parent.parent.getComponent(cc.ScrollView), this.contentNdoe);
this._updateIp();
};
t.prototype._lockCreateRoomScroll = function(e, t) {
if (!t) return;
var o = t.getComponent(cc.Layout);
if (o) {
o._layoutDirty = !0;
o.updateLayout();
}
if (!(t.height > 0)) {
var n = o && void 0 !== o.spacingY ? o.spacingY : 0, r = (o && o.paddingTop || 0) + (o && o.paddingBottom || 0), i = t.children, a = 0;
for (var s = 0; s < i.length; s++) if (i[s].activeInHierarchy) {
a++;
r += i[s].height;
}
r += Math.max(0, a - 1) * n;
t.height = Math.max(r, 1);
}
if (e) {
e.elastic = !1;
e._calculateBoundary && e._calculateBoundary();
}
};
t.prototype._lockCreateRoomScroll = function(e, t) {
if (!t) return;
var o = t.getComponent(cc.Layout);
if (o) {
o._layoutDirty = !0;
o.updateLayout();
}
if (!(t.height > 0)) {
var n = o && void 0 !== o.spacingY ? o.spacingY : 0, r = (o && o.paddingTop || 0) + (o && o.paddingBottom || 0), i = t.children, a = 0;
for (var s = 0; s < i.length; s++) if (i[s].activeInHierarchy) {
a++;
r += i[s].height;
}
r += Math.max(0, a - 1) * n;
t.height = Math.max(r, 1);
}
if (e) {
e.elastic = !1;
e._calculateBoundary && e._calculateBoundary();
}
};
t.prototype._updateIp = function() {
var e = g.default.get(this._chooseGameId).IPStatus();
this.ipChoosed.active = e;
this.ipNotChoose.active = !e;
};
t.prototype.onClickIP = function() {
h.default.clickBtn();
g.default.get(this._chooseGameId).negationIP();
this._updateIp();
};
t.prototype.onClickCreate = function() {
h.default.clickBtn();
var e = i.default.get(this._chooseGameId);
if (e.IPStatus()) {
if (!p.default.checkLocationEnabled()) {
l.default.msgBox.showNoClose("定位权限未开启，请开启后再次尝试", function() {
p.default.openSettingLocation();
});
return;
}
if (!p.default.checkPermissionLocation()) {
l.default.msgBox.showNoClose("定位权限未开启，请开启后再次尝试", function() {
p.default.openSettings();
});
return;
}
}
l.default.gameMsgBase().checkRealTimeSupport(e) ? l.default.gameMsgBase().createRoom(e, this._clubId, function(t, o) {
if (o) l.default.uiHelper.showTipNetError(); else if (t.res.error < 0) l.default.uiHelper.showTipNetError(); else if (t.res.error > 0) l.default.uiHelper.showTip(t.res.what); else {
m.default.lastCreateRoomGameId.setValue(e.index);
l.default.gameMsgBase().joinRoom(t.roomId);
}
}) : l.default.msgBox.showNoClose("您当前应用版本不支持语音房功能，是否下载最新版本体验该功能？", function() {
p.default.openWebpage(_.default.downloadUrl({
stop: 1
}));
}, function() {
l.default.gameMsgBase().dismissRoom(!0, null);
}, !0, !0, "前往下载", "修改玩法");
};
t.prototype.onClickSave = function() {
var e = this;
h.default.clickBtn();
var t = g.default.get(this._chooseGameId), o = g.default.getClubScheme();
if (1 === o && t) y.default.clubGameSchemeAdd(this._clubId, "", t, function(t, o) {
if (o) l.default.uiHelper.showTip("新增玩法失败"); else if (0 === t.res.error) {
l.default.uiHelper.showTip("新增玩法成功");
l.default.eventUtils.emit(c.default.data_club_get_scheme_list);
l.default.uiHelper.remove(e);
}
}); else if (2 === o && t) {
var n = g.default.getSchemeId(), r = g.default.getSchemeData().color;
y.default.clubGameSchemeEdit(n, "", this._clubId, r, t, function(t, o) {
if (o) l.default.uiHelper.showTip("修改玩法失败"); else if (0 === t.res.error) {
l.default.uiHelper.showTip("修改玩法成功");
l.default.eventUtils.emit(c.default.data_club_get_scheme_list);
l.default.uiHelper.remove(e);
} else l.default.uiHelper.showTip(t.res.what);
});
}
};
t.prototype.onClickMask = function() {
h.default.clickBtn();
this.maskNode.active = !1;
l.default.eventUtils.emit(c.default.ui_create_room_note_hide);
};
t.prototype.onDestroy = function() {
g.default.getClubScheme() <= 0 && i.default.save();
};
r([ b(cc.Node) ], t.prototype, "contentNdoe", void 0);
r([ b(cc.Prefab) ], t.prototype, "typePre", void 0);
r([ b(cc.Node) ], t.prototype, "rootNode", void 0);
r([ b(cc.Node) ], t.prototype, "listNode", void 0);
r([ b(cc.Prefab) ], t.prototype, "btnGame", void 0);
r([ b(cc.Node) ], t.prototype, "ipNotChoose", void 0);
r([ b(cc.Node) ], t.prototype, "ipChoosed", void 0);
r([ b(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ b(cc.Label) ], t.prototype, "backTitleLabel", void 0);
r([ b(cc.Node) ], t.prototype, "createBtnNode", void 0);
r([ b(cc.Node) ], t.prototype, "savaeBtnNode", void 0);
r([ b(cc.Node) ], t.prototype, "maskNode", void 0);
r([ b(cc.ScrollView) ], t.prototype, "allGameList", void 0);
return t = r([ C ], t);
}(d.default);
o.default = D;
cc._RF.pop();
