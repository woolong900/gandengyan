// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "85c2dV7BmNFTpjBxc59wWmD", "ClubTableDetailsLayer");
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
var i = require("./BaseComponent"), a = require("./ClubControl"), s = require("./gContext"), l = require("./EventKeys"), c = require("./EventUtils"), u = require("./UserData"), d = require("./SoundUtils"), p = require("./ClubMsg"), f = require("./ClubTableDetailsItem"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t._uiDirty = !1;
t.roomInfoLabel = null;
t.members = [];
t.destroyNode = null;
t.watchNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on(l.default.data_club_table_remove, function(t, o) {
if (o.o.id == e._index) {
s.default.uiHelper.remove(e);
s.default.uiHelper.showTip("该房间已被解散～");
}
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on(l.default.data_club_table_update, function(t, o) {
o.o.id == e._index && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
};
t.prototype.setData = function(e) {
this._index = e;
this._updateUI();
};
t.prototype._updateUI = function() {
var e = a.default.getCurClubData(), t = e.tableList().get(this._index), o = t.config();
this.roomInfoLabel.string = s.default.gameLogic(o.index).allRuleDesc(o, "/");
for (var n = o.peopleCount(), r = t.isGameing(), i = 0, l = this.members.length; i < l; i++) {
var c = this.members[i];
if (i < n) {
c.active = !0;
c.getComponent(f.default).setData(t.playerUids[i], this._index, r);
} else c.active = !1;
}
this.watchNode.active = !1;
s.default.gameLogic(t.config().index).isAllowWatch(t.config()) && (this.watchNode.active = t.isGameing());
this.destroyNode.active = !1;
var d = e.memberList().get(u.default.uid);
d && d.permissionAdmin() && (this.destroyNode.active = !0);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.onClickDestroy = function() {
d.default.clickBtn();
var e = a.default.getCurClubData().tableList().get(this._index);
s.default.msgBox.show("是否强制解散此房间?", function() {
p.default.closeTable(e.id, function(e, t) {
t ? s.default.uiHelper.showTip("获取数据失败～") : 0 === e.res.error || s.default.uiHelper.showTip(e.res.what);
});
});
};
t.prototype.onClickWatch = function() {
d.default.clickBtn();
a.default.getCurClubData().tableList().get(this._index);
s.default.gameMsgBase().joinRoom(this._index);
};
r([ y(cc.Label) ], t.prototype, "roomInfoLabel", void 0);
r([ y(cc.Node) ], t.prototype, "members", void 0);
r([ y(cc.Node) ], t.prototype, "destroyNode", void 0);
r([ y(cc.Node) ], t.prototype, "watchNode", void 0);
return t = r([ m ], t);
}(i.default);
o.default = g;
cc._RF.pop();
