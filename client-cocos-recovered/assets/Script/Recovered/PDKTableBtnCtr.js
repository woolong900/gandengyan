// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6edbbKscQxH85AQ+ZKLkskN", "PDKTableBtnCtr");
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
var i = e("./RoomInfoData"), a = e("./PDKEnum"), s = e("./SoundUtils"), l = e("./WindowConfig"), c = e("./gContext"), u = e("./ShareLayer"), d = e("./GameMsgPDK"), p = e("./PDKEventKeys"), f = e("./EventKeys"), h = e("./EventUtils"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.btnInvite = null;
t.btnReady = null;
t.btnClubOnline = null;
t.btnClubInvite = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.updateUI();
c.default.eventUtils.on([ p.default.data_status_change, f.default.data_player_update ], function() {
e._uiDirty = !0;
}, this, h.eOffType.OnDestroy);
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
if (!i.default.isPlayback() && !i.default.isWatcher() && i.default.gameInfoPDK.status === a.ePDKGameStatus.Free) {
if (i.default.belongClub > 0) {
this.btnClubInvite.active = !0;
this.btnClubOnline.active = !0;
} else this.btnInvite.active = !0;
var e = i.default.myPlayerData();
e && !e.isReady() && (this.btnReady.active = !0);
}
};
t.prototype.onClickInvite = function() {
s.default.clickBtn();
c.default.uiHelper.show(l.eWindowID.ShareLayer, u.eShareUIType.ShareGameInvite);
};
t.prototype.onClickReady = function() {
d.default.getInstance().ready(!0);
};
t.prototype.onClickClubInvite = function() {
s.default.clickBtn();
c.default.uiHelper.show(l.eWindowID.ShareLayer, u.eShareUIType.ShareGameInvite);
};
t.prototype.onClickClubOnline = function() {
s.default.clickBtn();
c.default.uiHelper.show(l.eWindowID.InvitePlayerLayer);
};
r([ g(cc.Node) ], t.prototype, "btnInvite", void 0);
r([ g(cc.Node) ], t.prototype, "btnReady", void 0);
r([ g(cc.Node) ], t.prototype, "btnClubOnline", void 0);
r([ g(cc.Node) ], t.prototype, "btnClubInvite", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
