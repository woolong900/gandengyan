// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "66e146CP4ZNza7VOBH6Ky1l", "TableBtns");
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
var i = e("./SoundUtils"), a = e("./gContext"), s = e("./GameMsgMJ"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./ExUtils"), d = e("./RoomInfoData"), p = e("./GameInfoData"), f = e("./CommonEnum"), h = e("./WindowConfig"), m = e("./ShareLayer"), y = e("./RoomUtils"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.view = f.eGameView.View2D;
t.btnInvite = null;
t.btnReady = null;
t.btnCopyText = null;
t.btnGameNext = null;
t.btnGameOver = null;
t.btnClubOnline = null;
t.btnClubInvite = null;
return t;
}
t.prototype.start = function() {};
t.prototype.onEnable = function() {
var e = this;
this.updateUI();
a.default.eventUtils.on(l.default.data_game_status_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDisable);
a.default.eventUtils.on(l.default.data_game_watch_pos_change, function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDisable);
a.default.eventUtils.on(l.default.data_player_update, function(t, o) {
var n = o.o, r = o.n;
if (r.isMe() && e.view === f.eGameView.View3D && n.pos !== r.pos) {
var i = y.default.getInstance().deskPos2ViewPos(r.pos, n.pos);
a.default.uiHelper.show(h.eWindowID.GameTableAnimation, i);
}
e._uiDirty = !0;
}, this, c.eOffType.OnDisable);
a.default.eventUtils.on([ l.default.data_player_add, l.default.data_player_remove ], function(t, o) {
e._uiDirty = !0;
}, this, c.eOffType.OnDisable);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
this._uiDirty = !1;
this.btnInvite.active = !1;
this.btnReady.active = !1;
this.btnCopyText.active = !1;
this.btnGameNext.active = !1;
this.btnGameOver.active = !1;
this.btnClubInvite.active = !1;
this.btnClubOnline.active = !1;
if (d.default.isWatcher()) d.default.gameInfo.status === p.eGameStatus.TotalEnd && (this.btnGameOver.active = !0); else if (d.default.gameInfo.status === p.eGameStatus.Free) {
this.btnCopyText.active = !0;
if (d.default.belongClub > 0) {
this.btnClubInvite.active = !0;
this.btnClubOnline.active = !0;
this.view === f.eGameView.View3D && (this.btnCopyText.y = -280);
} else {
this.btnInvite.active = !0;
this.view === f.eGameView.View3D && (this.btnCopyText.y = -191);
}
if (this.view === f.eGameView.View2D) {
(o = d.default.myPlayerData()) && !o.isReady() && (this.btnReady.active = !0);
} else {
this.btnReady.active = !0;
var e = d.default.config.peopleCount();
if (2 === e) {
this._update3DBtn(f.eViewPos.Down, "down", !0);
this._update3DBtn(f.eViewPos.Up, "up", !1);
this.btnReady.getChildByName("left").active = !1;
this.btnReady.getChildByName("right").active = !1;
} else {
this._update3DBtn(f.eViewPos.Left, "left", !1);
this._update3DBtn(f.eViewPos.Right, "right", !1);
this._update3DBtn(f.eViewPos.Down, "down", !0);
this._update3DBtn(f.eViewPos.Up, "up", !1);
if (3 === e) {
var t = y.default.getInstance().deskPos2ViewPos(f.eDeskPos.South);
this.btnReady.getChildByName([ "down", "left", "up", "right" ][t]).active = !1;
}
}
}
} else if (d.default.gameInfo.status === p.eGameStatus.SingleEnd) {
var o = d.default.myPlayerData();
this.view === f.eGameView.View3D && o && !o.isReady() && (this.btnGameNext.active = !0);
} else d.default.gameInfo.status === p.eGameStatus.TotalEnd && (this.btnGameOver.active = !0);
};
t.prototype._update3DBtn = function(e, t, o) {
var n = y.default.getInstance().viewPos2DeskPos(e), r = d.default.players.getByPos(n);
r ? r.isReady() ? this.btnReady.getChildByName(t).active = !1 : this.btnReady.getChildByName(t).active = o : this.btnReady.getChildByName(t).active = !0;
};
t.prototype.onClickInvite = function() {
i.default.clickBtn();
a.default.uiHelper.show(h.eWindowID.ShareLayer, m.eShareUIType.ShareGameInvite);
};
t.prototype.onClickReady = function() {
s.GameMsgMJ.getInstance().ready(!0);
};
t.prototype.onClickChangePos = function(e, t) {
var o = parseInt(t), n = y.default.getInstance().viewPos2DeskPos(o);
s.GameMsgMJ.getInstance().changePos(n, function() {});
};
t.prototype.onClickGameOver = function() {
i.default.clickBtn();
a.default.uiHelper.show(h.eWindowID.TotalEndLayer);
};
t.prototype.onClickGameNext = function() {
i.default.clickBtn();
s.GameMsgMJ.getInstance().ready(!1);
};
t.prototype.onClickCopyText = function() {
i.default.clickBtn();
var e = y.default.getInstance().shareTitle() + "," + y.default.getInstance().shareText() + "（复制此消息打开游戏可直接进入该房间）";
cc.log(e);
u.default.copyText(e);
a.default.uiHelper.showTip("已复制，打开微信直接粘贴~");
};
t.prototype.onClickClubInvite = function() {
i.default.clickBtn();
a.default.uiHelper.show(h.eWindowID.ShareLayer, m.eShareUIType.ShareGameInvite);
};
t.prototype.onClickClubOnline = function() {
i.default.clickBtn();
a.default.uiHelper.show(h.eWindowID.InvitePlayerLayer);
};
r([ v({
type: cc.Enum(f.eGameView),
displayName: "游戏视角",
serializable: !0
}) ], t.prototype, "view", void 0);
r([ v(cc.Node) ], t.prototype, "btnInvite", void 0);
r([ v(cc.Node) ], t.prototype, "btnReady", void 0);
r([ v(cc.Node) ], t.prototype, "btnCopyText", void 0);
r([ v(cc.Node) ], t.prototype, "btnGameNext", void 0);
r([ v(cc.Node) ], t.prototype, "btnGameOver", void 0);
r([ v(cc.Node) ], t.prototype, "btnClubOnline", void 0);
r([ v(cc.Node) ], t.prototype, "btnClubInvite", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
