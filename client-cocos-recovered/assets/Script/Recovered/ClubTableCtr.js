// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b319f2e49JB1rsfH6xE1XLg", "ClubTableCtr");
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
var i = require("./ScrollContens"), a = require("./ClubControl"), s = require("./ClubTableItem"), l = require("./gContext"), c = require("./EventKeys"), u = require("./EventUtils"), d = require("./Storage"), p = require("./ClubListData"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.tablePre = null;
t.scrollContent = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
l.default.eventUtils.on([ c.default.data_club_table_add, c.default.data_club_table_remove, c.default.data_club_table_update, c.default.data_club_focus_change, c.default.data_club_setting_empty_change ], function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_club_table_scheme_update, function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this, t = a.default.getCurClubData();
if (t) {
var o = t.tableList(), n = function(e) {
if (e.havePlayer()) return !0;
var t = p.default.focus + "_" + e.schemeId;
return d.default.getClubWfConfig(t);
}, r = [];
r = t.enableEmptyRoomLast ? o.collection(n, function(e, t) {
var o = e.isGameing();
if (o !== t.isGameing()) return o ? -1 : 1;
var n = e.isFull();
if (n !== t.isFull()) return n ? -1 : 1;
var r = e.playerUids.length > 0;
return r !== t.playerUids.length > 0 ? r ? -1 : 1 : e.config().index - t.config().index;
}) : o.collection(n, function(e, t) {
var o = e.playerUids.length > 0, n = t.playerUids.length > 0;
if (o !== n) return n ? -1 : 1;
var r = e.isFull(), i = t.isFull();
if (r !== i) return i ? -1 : 1;
var a = e.isGameing(), s = t.isGameing();
return a !== s ? s ? -1 : 1 : e.config().index - t.config().index;
});
this.scrollContent.load({
count: r.length,
cellSize: new cc.Size(325, 290),
viewSize: new cc.Size(1280, 545),
row: 2,
padding: {
left: 40,
right: 40,
top: 10,
bottom: 0
},
spacing: cc.v2(60, -41),
data_cb: function(t, o) {
var n = parseInt(r[t]);
o || (o = cc.instantiate(e.tablePre));
o.getComponent(s.default).setData(n);
return o;
},
click_cb: function(e, t) {
var n = parseInt(r[e]);
if (!o.get(n).isGameing()) {
l.default.gameMsgBase().joinRoom(n);
d.default.lastGameClub.setValue(p.default.focus);
}
}
});
}
};
r([ m(cc.Prefab) ], t.prototype, "tablePre", void 0);
r([ m(i.default) ], t.prototype, "scrollContent", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
