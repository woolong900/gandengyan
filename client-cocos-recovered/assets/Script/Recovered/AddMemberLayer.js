// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "60a5c3N0nZNwIO+LMgN3IpF", "AddMemberLayer");
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
var i = e("./BaseComponent"), a = e("./SoundUtils"), s = e("./BanDeskmateTr"), l = e("./ClubControl"), c = e("./gContext"), u = e("./EventKeys"), d = e("./EventUtils"), p = e("./ClubIsolateListData"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.groupid = 0;
t.titleLabel = null;
t.searchEditBox = null;
t.bankDeskPrefab = null;
t.contentNode = null;
t._ids = [];
t._searchStr = "";
return t;
}
t.prototype.start = function() {
var e = this;
c.default.eventUtils.on(u.default.todo_club_list_search, function(t, o) {
e._upData(o);
e._updateList();
}, this, d.eOffType.OnDestroy);
this._upData(null);
this._updateList();
};
t.prototype.setData = function(e, t) {
this.groupid = e;
this.titleLabel.string = "禁止同桌  组" + t;
};
t.prototype._upData = function(e) {
var t = function(e) {
return !0;
};
if (e) {
var o = e.trim();
o.length > 0 && (t = function(e) {
return !("" + e.uid != o && e.nickname != o && !e.remark.includes(o));
});
}
var n = l.default.getCurClubData().memberList().collection(function(e) {
return t(e);
}, function(e, t) {
return t.degress - e.degress;
});
this._ids = n;
};
t.prototype._updateList = function() {
this.contentNode.destroyAllChildren();
for (var e = this._ids.length, t = 0; t < e; t++) {
var o = parseInt(this._ids[t]), n = cc.instantiate(this.bankDeskPrefab);
this.contentNode.addChild(n);
var r = n.getComponent(s.default);
r.setData(o, this.groupid, !1);
var i = l.default.getCurClubData().memberList().get(o), a = p.default.get(this.groupid);
for (var c in a.isolateMembers) if (a.isolateMembers[c].user_id === i.userid) {
r.setData(o, this.groupid, !0);
break;
}
}
};
t.prototype.onClickSearch = function() {
a.default.clickBtn();
var e = this.searchEditBox.string || "";
if ((e = e.trim()) !== this._searchStr) {
this._searchStr = e;
c.default.eventUtils.emit(u.default.todo_club_list_search, e);
}
};
t.prototype.onDestroy = function() {};
r([ m(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ m(cc.EditBox) ], t.prototype, "searchEditBox", void 0);
r([ m(cc.Prefab) ], t.prototype, "bankDeskPrefab", void 0);
r([ m(cc.Node) ], t.prototype, "contentNode", void 0);
return t = r([ h ], t);
}(i.default);
o.default = y;
cc._RF.pop();
