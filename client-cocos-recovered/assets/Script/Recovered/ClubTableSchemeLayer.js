// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "617c09ujHxMILaXcAm8ybxR", "ClubTableSchemeLayer");
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
var i = e("./BaseComponent"), a = e("./ScrollContens"), s = e("./gContext"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./ClubControl"), d = e("./ClubTableSchemeItem"), p = e("./ClubMsg"), f = e("./SoundUtils"), h = e("./UserData"), m = e("./ClubListData"), y = e("./WindowConfig"), g = e("./CreateRoomAssist"), _ = cc._decorator, v = _.ccclass, C = _.property, b = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._itemAry = [];
t.scrollContent = null;
t.cellPre = null;
t.btnAdd = null;
t.btnOk = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on([ l.default.data_club_scheme_add, l.default.data_club_scheme_remove ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_club_get_scheme_list, l.default.data_reconnect_club ], function() {
e.loadSchemeListData();
}, this, c.eOffType.OnDestroy);
this.loadSchemeListData();
var t = h.default.uid, o = u.default.getCurClubData().memberList().get(t);
if (o && o.permissionAdmin()) {
this.btnAdd.active = !0;
this.btnOk.active = !1;
} else {
this.btnAdd.active = !1;
this.btnOk.active = !0;
}
};
t.prototype.loadSchemeListData = function() {
var e = this;
p.default.getSchemeList(m.default.focus, function(t, o) {
if (o) {
s.default.uiHelper.showTip("获取数据失败～");
s.default.uiHelper.remove(e);
} else if (0 === t.res.error) e._uiDirty = !0; else {
s.default.uiHelper.showTip(t.res.what);
s.default.uiHelper.remove(e);
}
}, !1);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this;
this._itemAry = [];
var t = u.default.getCurClubData(), o = t.schemeList().collection();
this.scrollContent.load({
count: o.length,
cellSize: new cc.Size(890, 101),
viewSize: new cc.Size(890, 457),
column: 1,
spacing: cc.v2(0, 15),
data_cb: function(n, r) {
var i = parseInt(o[n]);
r || (r = cc.instantiate(e.cellPre));
var a = r.getComponent(d.default);
a.setData(t.id, i, n + 1);
e._itemAry.push(a);
return r;
}
});
};
t.prototype.onClickAdd = function() {
f.default.clickBtn();
g.default.setData(1);
s.default.uiHelper.show(y.eWindowID.CreateRoom, m.default.focus);
};
r([ C(a.default) ], t.prototype, "scrollContent", void 0);
r([ C(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ C(cc.Node) ], t.prototype, "btnAdd", void 0);
r([ C(cc.Node) ], t.prototype, "btnOk", void 0);
return t = r([ v ], t);
}(i.default);
o.default = b;
cc._RF.pop();
