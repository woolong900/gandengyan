// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3342e5kfSBPsrMTf1Qwz6TQ", "ClubTableSchemeItem");
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
var i = e("./SoundUtils"), a = e("./gContext"), s = e("./EventKeys"), l = e("./EventUtils"), c = e("./ClubListData"), u = e("./UserData"), d = e("./Storage"), p = e("./ClubControl"), f = e("./WindowConfig"), h = e("./ClubMsg"), m = e("./CreateRoomAssist"), y = e("./ClubSchemeColor"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._clubId = 0;
t._schemeId = 0;
t._uiDirty = !1;
t._index = 0;
t._gameId = 0;
t.gameName = null;
t.details = null;
t.btnClose = null;
t.btnModify = null;
t.btnDelete = null;
t.imInactive = null;
t.imCheck = null;
t.btnOffWf = null;
t.btnOnWf = null;
t.colorChooseNode = null;
t.maskNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(s.default.data_club_scheme_update, function(t, o) {
o.o.id === e._schemeId && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ s.default.ui_club_scheme_color_show ], function() {
e.maskNode.active = !0;
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on([ s.default.ui_club_scheme_color_hide ], function() {
e.maskNode.active = !1;
}, this, l.eOffType.OnDestroy);
};
t.prototype.setData = function(e, t, o) {
this._clubId = e;
this._schemeId = t;
this._index = o;
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = c.default.get(this._clubId), t = e.schemeList().get(this._schemeId), o = t.roomConfig.gameName(), n = "玩法" + this._index;
this.gameName.string = "<color=#5D461A><size=30>" + o + "</c></size><color=#BB6825><size=20> " + n + "</c></size>";
this.details.string = a.default.gameLogic(t.roomConfig.index).allRuleDesc(t.roomConfig, "/", !0);
this._gameId = t.roomConfig.index;
var r = u.default.uid;
if (e.memberList().get(r).permissionAdmin()) {
this.colorChooseNode.active = !0;
this.colorChooseNode.getComponent(y.default).setData({
color: t.color,
clubId: this._clubId,
schemeId: this._schemeId
});
this.gameName.node.x = -380;
this.details.node.x = -380;
this.btnClose.active = !0;
this.btnModify.active = !0;
this.btnDelete.active = !0;
this.btnOffWf.active = !t._auto;
this.btnOnWf.active = t._auto;
} else {
this.colorChooseNode.active = !1;
this.btnClose.active = !1;
this.btnModify.active = !1;
this.btnDelete.active = !1;
}
var i = this._clubId + "_" + this._schemeId, s = d.default.getClubWfConfig(i);
this.imCheck.node.active = s;
this.imInactive.node.active = !s;
};
t.prototype.onClickClose = function() {
var e = this;
i.default.clickBtn();
var t = c.default.get(this._clubId).schemeList().get(this._schemeId), o = "玩法" + this._index, n = "", r = "";
if (t._auto) {
n = "关闭之后，玩家将无法看到该房间，需要仍可开启，是否关闭";
r = "关闭玩法";
} else {
n = "开启之后，玩家将可以看到该房间，需要仍可关闭，是否开启";
r = "开启玩法";
}
var l = "<color=#5D461A>" + n + "</c><color=#BB6825>" + o + "</c>";
a.default.uiHelper.show(f.eWindowID.MsgBoxLayer, l, r, function() {
var o = !t._auto;
h.default.clubGameSchemeAuto(e._schemeId, o, function(e, t) {
if (t) a.default.uiHelper.showTip("设置玩法失败"); else if (0 === e.res.error) {
a.default.uiHelper.showTip("设置玩法成功");
a.default.eventUtils.emit(s.default.data_club_get_scheme_list);
h.default.getClubTableInfo(e._clubId, function() { a.default.eventUtils.emit(s.default.data_club_table_scheme_update); }, !0);
} else a.default.uiHelper.showTip(e.res.what);
});
});
};
t.prototype.onClickModify = function() {
i.default.clickBtn();
m.default.setData(2, this._gameId, this._schemeId, this._clubId);
a.default.uiHelper.show(f.eWindowID.CreateRoom, this._clubId);
};
t.prototype.onClickDelete = function() {
var e = this;
i.default.clickBtn();
var t = "<color=#5D461A>删除之后，玩家将无法看到该房间，无法再次开启，是否删除</c><color=#BB6825>" + ("玩法" + this._index) + "</c>";
a.default.uiHelper.show(f.eWindowID.MsgBoxLayer, t, "关闭玩法", function() {
h.default.clubGameSchemeDelete(e._schemeId, function(t, o) {
if (o) a.default.uiHelper.showTip("删除玩法失败"); else if (0 === t.res.error) {
a.default.uiHelper.showTip("删除玩法成功");
c.default.get(e._clubId).schemeList().remove(e._schemeId);
} else a.default.uiHelper.showTip(t.res.what);
});
});
};
t.prototype.onClickSwitch = function() {
i.default.clickBtn();
var e = !this.imCheck.node.active;
this.imCheck.node.active = e;
this.imInactive.node.active = !e;
this._updateWfConfig(e);
};
t.prototype._updateWfConfig = function(e) {
var t = p.default.getCurClubData().id + "_" + this._schemeId;
d.default.saveClubWfConfig(t, e);
a.default.eventUtils.emit(s.default.data_club_table_scheme_update);
};
t.prototype.getWfSwitch = function() {
return this.imCheck.node.active;
};
t.prototype.maskClick = function() {
i.default.clickBtn();
a.default.eventUtils.emit(s.default.ui_club_scheme_color_hide);
};
r([ v(cc.RichText) ], t.prototype, "gameName", void 0);
r([ v(cc.Label) ], t.prototype, "details", void 0);
r([ v(cc.Node) ], t.prototype, "btnClose", void 0);
r([ v(cc.Node) ], t.prototype, "btnModify", void 0);
r([ v(cc.Node) ], t.prototype, "btnDelete", void 0);
r([ v(cc.Sprite) ], t.prototype, "imInactive", void 0);
r([ v(cc.Sprite) ], t.prototype, "imCheck", void 0);
r([ v(cc.Node) ], t.prototype, "btnOffWf", void 0);
r([ v(cc.Node) ], t.prototype, "btnOnWf", void 0);
r([ v(cc.Node) ], t.prototype, "colorChooseNode", void 0);
r([ v(cc.Node) ], t.prototype, "maskNode", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
