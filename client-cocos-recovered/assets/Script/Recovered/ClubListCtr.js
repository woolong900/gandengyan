// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5f6b3a5QBdDoZMAjPOYBW6z", "ClubListCtr");
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
var i = e("./gContext"), a = e("./ScrollContens"), s = e("./WindowConfig"), l = e("./SoundUtils"), c = e("./ClubListData"), u = e("./EventKeys"), d = e("./ClubItem"), p = e("./EventUtils"), f = e("./ClubMsg"), h = e("./Constants"), m = e("./GameConstant"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isUiOut = !1;
t._uiDirty = !1;
t.flagShowNode = null;
t.flagHideNode = null;
t.maskNode = null;
t.scrollContent = null;
t.clubCellPre = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateClubList();
this._updateShow();
i.default.eventUtils.on([ u.default.data_club_list_change ], function() {
e._uiDirty = !0;
}, this, p.eOffType.OnDestroy);
};
t.prototype._updateShow = function() {
if (this._isUiOut) {
this.flagShowNode.active = !0;
this.maskNode.active = !0;
this.flagHideNode.active = !1;
} else {
this.flagShowNode.active = !1;
this.maskNode.active = !1;
this.flagHideNode.active = !0;
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateClubList();
}
};
t.prototype._updateClubList = function() {
var e = this, t = c.default.collection(), o = t.length;
this.scrollContent.load({
count: o,
cellSize: new cc.Size(277, 95),
viewSize: new cc.Size(278, 515),
column: 1,
spacing: cc.v2(0, 7),
data_cb: function(o, n) {
n || (n = cc.instantiate(e.clubCellPre));
var r = n.getComponent(d.default), i = parseInt(t[o]);
r.setData(i);
return n;
},
click_cb: function(e, o) {
l.default.clickBtn();
var n = parseInt(t[e]);
f.default.getClubData(n, function(e, t) {
t ? i.default.uiHelper.showTipNetError() : 0 === e.error ? c.default.focus = n : i.default.msgBox.showOnlyOk("俱乐部数据异常～", function() {
i.default.uiHelper.loadScene(h.default.HallSceneName);
});
});
}
});
};
t.prototype.onClickCreateClub = function() {
l.default.clickBtn();
f.default.clubAgentInfo(function(e, t) {
t || (e.code.length > 0 ? e.balanceCard >= m.default.limitOfCreateClub ? i.default.uiHelper.show(s.eWindowID.CreateClubLayer) : i.default.msgBox.showOnlyOk("房卡不足" + m.default.limitOfCreateClub + "张，无法创建俱乐部\n请在代理后台充值房卡!") : i.default.uiHelper.show(s.eWindowID.CreateClubTipLayer));
});
};
t.prototype.onClickJoinClub = function() {
l.default.clickBtn();
i.default.uiHelper.show(s.eWindowID.JoinRoom, 1);
};
t.prototype.onClickShowHide = function() {
l.default.clickBtn();
if (this._isUiOut) {
this._isUiOut = !1;
i.default.eventUtils.emit(u.default.ui_club_list_hide);
} else {
this._isUiOut = !0;
i.default.eventUtils.emit(u.default.ui_club_list_show);
}
this._updateShow();
};
r([ _(cc.Node) ], t.prototype, "flagShowNode", void 0);
r([ _(cc.Node) ], t.prototype, "flagHideNode", void 0);
r([ _(cc.Node) ], t.prototype, "maskNode", void 0);
r([ _(a.default) ], t.prototype, "scrollContent", void 0);
r([ _(cc.Prefab) ], t.prototype, "clubCellPre", void 0);
return t = r([ g ], t);
}(cc.Component);
o.default = v;
cc._RF.pop();
