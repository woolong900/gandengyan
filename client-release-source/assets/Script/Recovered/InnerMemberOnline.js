// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bbb6e8+VzpH2KbBIva/0wDL", "InnerMemberOnline");
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
var i = require("./InnerCommon"), a = require("./gContext"), s = require("./EventKeys"), l = require("./EventUtils"), c = require("./ClubControl"), u = require("./TrAdjust"), d = require("./MemberOnlineTr"), p = require("./ClubMsg"), f = require("./UserData"), h = cc._decorator, m = h.ccclass, y = (h.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._curPage = 1;
t._totalCount = 0;
t._ids = [];
t._memberListData = null;
return t;
}
t.prototype.start = function() {
var e = this, t = this.node.getComponent(i.default);
t.adjustHead(t.memberOnlineTr, [ "头像", "昵称", "ID", "状态" ]);
a.default.eventUtils.on(s.default.ui_page_change, function(t, o) {
e._curPage !== o && (e._curPage = o);
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on(s.default.todo_club_list_search, function(t, o) {
e._setData(o);
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
p.default.getClubMemberInfoCb(c.default.getCurClubData().id, function(t, o) {
if (o) a.default.uiHelper.showTip("获取在线列表失败~"); else if (t) {
if (e && e.node && e.isValid) {
e._memberListData = t;
e._setData(null);
e._uiDirty = !0;
}
} else a.default.uiHelper.showTip("获取在线列表失败~");
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateList();
}
};
t.prototype._setData = function(e) {
var t = function(e) {
return e.onLine;
}, o = function(e) {
return !0;
};
if (e) {
var n = e.trim();
n.length > 0 && (o = function(e) {
return !("" + e.uid != n && e.nickname != n && !e.remark.includes(n));
});
}
var r = this._memberListData.collection(function(e) {
return t(e) && o(e);
}, function(e, t) {
return t.degress - e.degress;
});
this._totalCount = r.length;
this._ids = r;
var a = this.node.getComponent(i.default);
a.setPage(10, this._totalCount, this._curPage);
a.showNoDataTipNode(0 === r.length);
};
t.prototype._updateList = function() {
var e = this, t = 0, o = this._totalCount, n = this._curPage - 1;
o = 10;
(t = 10 * n) + 10 > this._totalCount && (o = this._totalCount - t);
var r = this._memberListData.get(f.default.uid), a = this.node.getComponent(i.default);
a.scrollContent.load({
count: o,
cellSize: new cc.Size(a.innerW(), 87),
viewSize: new cc.Size(a.innerW(), 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(o, n) {
n || (n = cc.instantiate(a.memberOnlineTr));
n.getComponent(u.default).adjustWidth(a.innerW());
var i = parseInt(e._ids[t + o]), s = n.getComponent(d.default), l = e._memberListData.get(i);
s.setData(i, l, r);
return n;
}
});
};
return t = r([ m ], t);
}(cc.Component));
o.default = y;
cc._RF.pop();
