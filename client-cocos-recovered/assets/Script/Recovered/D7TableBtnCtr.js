// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f602dD73PRBaIFinXs5IwjI", "D7TableBtnCtr");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./D7EventKeys"), l = e("./EventUtils"), c = e("./RoomInfoData"), u = e("./D7Enum"), d = e("./SoundUtils"), p = e("./WindowConfig"), f = e("./ShareLayer"), h = e("./GameMsgD7"), m = e("./D7GameControl"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnInvite = null;
t.btnReady = null;
t.btnGameNext = null;
t.btnGameOver = null;
t.btnShowSingle = null;
t.btnClubOnline = null;
t.btnClubInvite = null;
t.totalPre = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.updateUI();
i.default.eventUtils.on([ s.default.data_status_change, a.default.data_player_update ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
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
this.btnGameNext.active = !1;
this.btnGameOver.active = !1;
this.btnShowSingle.active = !1;
this.btnClubInvite.active = !1;
this.btnClubOnline.active = !1;
if (!c.default.isPlayback() && !c.default.isWatcher()) if (c.default.gameInfoD7.status === u.eD7GameStatus.Free) {
if (c.default.belongClub > 0) {
this.btnClubInvite.active = !0;
this.btnClubOnline.active = !0;
} else this.btnInvite.active = !0;
(e = c.default.myPlayerData()) && !e.isReady() && (this.btnReady.active = !0);
} else if (c.default.gameInfoD7.status === u.eD7GameStatus.SingleEnd) {
if (c.default.gameInfoD7.curStep === c.default.config.gameCount()) {
this.btnGameOver.active = !0;
this.btnShowSingle.active = !0;
} else {
var e;
if ((e = c.default.myPlayerData()) && !e.isReady()) {
this.btnGameNext.active = !0;
this.btnShowSingle.active = !0;
}
}
}
};
t.prototype.onClickInvite = function() {
d.default.clickBtn();
i.default.uiHelper.show(p.eWindowID.ShareLayer, f.eShareUIType.ShareGameInvite);
};
t.prototype.onClickReady = function() {
h.default.getInstance().ready(!0);
};
t.prototype.onClickGameOver = function() {
d.default.clickBtn();
i.default.uiHelper.gameShow(this.totalPre);
};
t.prototype.onClickGameNext = function() {
h.default.getInstance().ready(!1);
};
t.prototype.onClickShowSingle = function() {
d.default.clickBtn();
m.default.getInstance().updateSingleEnd();
};
t.prototype.onClickClubInvite = function() {
d.default.clickBtn();
i.default.uiHelper.show(p.eWindowID.ShareLayer, f.eShareUIType.ShareGameInvite);
};
t.prototype.onClickClubOnline = function() {
d.default.clickBtn();
i.default.uiHelper.show(p.eWindowID.InvitePlayerLayer);
};
r([ _(cc.Node) ], t.prototype, "btnInvite", void 0);
r([ _(cc.Node) ], t.prototype, "btnReady", void 0);
r([ _(cc.Node) ], t.prototype, "btnGameNext", void 0);
r([ _(cc.Node) ], t.prototype, "btnGameOver", void 0);
r([ _(cc.Node) ], t.prototype, "btnShowSingle", void 0);
r([ _(cc.Node) ], t.prototype, "btnClubOnline", void 0);
r([ _(cc.Node) ], t.prototype, "btnClubInvite", void 0);
r([ _(cc.Prefab) ], t.prototype, "totalPre", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
