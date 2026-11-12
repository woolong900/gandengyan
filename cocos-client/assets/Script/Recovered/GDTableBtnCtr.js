// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f59d1H8BEZLS4s2je4YpX3o", "GDTableBtnCtr");
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
var i = require("./RoomInfoData"), a = require("./SoundUtils"), s = require("./WindowConfig"), l = require("./gContext"), c = require("./ShareLayer"), u = require("./EventKeys"), d = require("./EventUtils"), p = require("./GDEnum"), f = require("./GDEventKeys"), h = require("./GameMsgGD"), m = require("./TextureRender"), g = cc._decorator, y = g.ccclass, _ = g.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnInvite = null;
t.btnReady = null;
t.btnClubOnline = null;
t.btnClubInvite = null;
t.shareEnd = null;
t.next = null;
t.gameend = null;
t.totalEndPre = null;
return t;
}
t.prototype.start = function() {
require("./PokerActionButtonStyle").applyGdTable(this);
var e = this;
this.updateUI();
l.default.eventUtils.on([ u.default.data_player_update ], function() {
e._uiDirty = !0;
}, this, d.eOffType.OnDestroy);
l.default.eventUtils.on([ f.default.data_status_change ], function(t, o) {
e._uiDirty = !0;
}, this, d.eOffType.OnDestroy);
l.default.eventUtils.on([ u.default.data_game_total_end ], function(t, o) {
e.next.active = !1;
e.gameend.active = !0;
}, this, d.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
this.btnInvite.active = !1;
this.btnReady.active = !1;
this.btnClubInvite.active = !1;
this.btnClubOnline.active = !1;
this.shareEnd.active = !1;
this.next.active = !1;
this.gameend.active = !1;
// Replay has its own previous/next controls and must never offer live ready.
if (i.default.isPlayback()) return;
if (i.default.gameInfoGD.status === p.eGDGameStatus.SingleEnd) {
var e = i.default.myPlayerData(), t = i.default.getTotalEndData();
if (!e.isReady()) if (t) {
this.gameend.active = !0;
this.shareEnd.active = !0;
} else {
this.shareEnd.active = !0;
this.next.active = !0;
}
}
if (!i.default.isPlayback() && !i.default.isWatcher() && i.default.gameInfoGD.status === p.eGDGameStatus.Free) {
if (i.default.belongClub > 0) {
this.btnClubInvite.active = !0;
this.btnClubOnline.active = !0;
} else this.btnInvite.active = !0;
(e = i.default.myPlayerData()) && !e.isReady() && (this.btnReady.active = !0);
}
};
t.prototype.onClickEnd = function() {
a.default.clickBtn();
this.node.destroy();
l.default.uiHelper.gameShow(this.totalEndPre);
};
t.prototype.onClickInvite = function() {
a.default.clickBtn();
l.default.uiHelper.show(s.eWindowID.ShareLayer, c.eShareUIType.ShareGameInvite);
};
t.prototype.onClickReady = function() {
h.default.getInstance().ready(!0);
};
t.prototype.onClickClubInvite = function() {
a.default.clickBtn();
l.default.uiHelper.show(s.eWindowID.ShareLayer, c.eShareUIType.ShareGameInvite);
};
t.prototype.onClickClubOnline = function() {
a.default.clickBtn();
l.default.uiHelper.show(s.eWindowID.InvitePlayerLayer);
};
t.prototype.onClickNext = function() {
if (i.default.isPlayback()) return;
a.default.clickBtn();
h.default.getInstance().ready(!1);
this.shareEnd.active = !1;
this.next.active = !1;
};
t.prototype.onClickShare = function() {
a.default.clickBtn();
l.default.msgBox.customExitRoom();
};
r([ _(cc.Node) ], t.prototype, "btnInvite", void 0);
r([ _(cc.Node) ], t.prototype, "btnReady", void 0);
r([ _(cc.Node) ], t.prototype, "btnClubOnline", void 0);
r([ _(cc.Node) ], t.prototype, "btnClubInvite", void 0);
r([ _(cc.Node) ], t.prototype, "shareEnd", void 0);
r([ _(cc.Node) ], t.prototype, "next", void 0);
r([ _(cc.Node) ], t.prototype, "gameend", void 0);
r([ _(cc.Prefab) ], t.prototype, "totalEndPre", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
