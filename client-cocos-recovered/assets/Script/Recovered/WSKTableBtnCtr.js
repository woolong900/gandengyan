// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "84e52Qs1ylA3rcOkPYccPny", "WSKTableBtnCtr");
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
var i = e("./RoomInfoData"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./WindowConfig"), c = e("./SoundUtils"), u = e("./gContext"), d = e("./GameMsgWSK"), p = e("./ShareLayer"), f = e("./WSKEnum"), h = e("./WSKEventKeys"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
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
u.default.eventUtils.on([ h.default.data_status_change, a.default.data_player_update ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
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
if (!i.default.isPlayback() && !i.default.isWatcher() && i.default.gameInfoWSK.status === f.eWSKGameStatus.Free) {
if (i.default.belongClub > 0) {
this.btnClubInvite.active = !0;
this.btnClubOnline.active = !0;
} else this.btnInvite.active = !0;
var e = i.default.myPlayerData();
e && !e.isReady() && (this.btnReady.active = !0);
}
};
t.prototype.onClickInvite = function() {
c.default.clickBtn();
u.default.uiHelper.show(l.eWindowID.ShareLayer, p.eShareUIType.ShareGameInvite);
};
t.prototype.onClickReady = function() {
d.default.getInstance().ready(!0);
};
t.prototype.onClickClubInvite = function() {
c.default.clickBtn();
u.default.uiHelper.show(l.eWindowID.ShareLayer, p.eShareUIType.ShareGameInvite);
};
t.prototype.onClickClubOnline = function() {
c.default.clickBtn();
u.default.uiHelper.show(l.eWindowID.InvitePlayerLayer);
};
r([ g(cc.Node) ], t.prototype, "btnInvite", void 0);
r([ g(cc.Node) ], t.prototype, "btnReady", void 0);
r([ g(cc.Node) ], t.prototype, "btnClubOnline", void 0);
r([ g(cc.Node) ], t.prototype, "btnClubInvite", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
