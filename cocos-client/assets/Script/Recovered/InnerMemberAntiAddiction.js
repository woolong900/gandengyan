// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dda87LFSLFPe42jtVY8opi0", "InnerMemberAntiAddiction");
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
var i = require("./InnerCommon"), a = require("./ClubControl"), s = require("./ClubMemberCellData"), l = require("./TrAdjust"), c = require("./MemberAntiAddictionTr"), u = require("./gContext"), d = require("./EventKeys"), p = require("./EventUtils"), f = require("./ClubMsg"), h = cc._decorator, m = h.ccclass, y = (h.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._curPage = 1;
t._totalCount = 0;
t._ids = [];
t._searchStr = "";
t._memberListData = null;
t._isShowEditScore = !0;
return t;
}
t.prototype.start = function() {
var e = this, t = this.node.getComponent(i.default);
t.adjustHead(t.memberAntiAdicationTr, [ "成员信息", "身份", "战绩", "上次对局时间", "操作" ]);
u.default.eventUtils.on(d.default.ui_page_change, function(t, o) {
e._curPage !== o && (e._curPage = o);
e._uiDirty = !0;
}, this, p.eOffType.OnDestroy);
u.default.eventUtils.on(d.default.todo_club_list_search, function(t, o) {
e._searchStr = o;
e._setData(o);
e._uiDirty = !0;
}, this, p.eOffType.OnDestroy);
u.default.eventUtils.on(d.default.data_club_member_manager_update, function(t) {
e.getClubMember();
}, this, p.eOffType.OnDestroy);
this.getClubMember();
};
t.prototype.getClubMember = function() {
var e = this;
new Date();
f.default.getClubMemberAntiAddictionInfoCb(a.default.getCurClubData().id, function(t, o) {
if (o) {
u.default.uiHelper.showTip("获取防沉迷失败~");
e._isShowEditScore = !1;
e.node.getComponent(i.default).showAntiAdicationEdit(e._isShowEditScore, !1, 0);
} else if (t) {
if (e && e.node && e.node.isValid) {
e._memberListData = t;
var n = e._searchStr.length > 0 ? e._searchStr : null;
e._setData(n);
e._uiDirty = !0;
}
} else u.default.uiHelper.showTip("获取防沉迷失败~");
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateList();
}
};
t.prototype._setData = function(e) {
var t = null;
if (e) {
var o = e.trim();
o.length > 0 && (t = function(e) {
return !("" + e.uid != o && e.nickname != o && !e.remark.includes(o));
});
}
var n = this._memberListData, r = n.collection(t, function(e, t) {
return t.degress - e.degress;
});
this._totalCount = r.length;
this._ids = r;
var a = this.node.getComponent(i.default);
a.setPage(10, this._totalCount, this._curPage);
a.showNoDataTipNode(0 === r.length);
var l = n.memberType, c = !1;
c = l === s.eClubMemberDegree.Master;
l === s.eClubMemberDegree.Master || l === s.eClubMemberDegree.Admin ? this._isShowEditScore = !0 : this._isShowEditScore = !1;
a.showAntiAdicationEdit(this._isShowEditScore, c, n.fatigueNum);
};
t.prototype._updateList = function() {
var e = this, t = 0, o = this._totalCount, n = this._curPage - 1;
o = 10;
(t = 10 * n) + 10 > this._totalCount && (o = this._totalCount - t);
var r = this.node.getComponent(i.default);
r.scrollContent.load({
count: o,
cellSize: new cc.Size(r.innerW(), 87),
viewSize: new cc.Size(r.innerW(), 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(o, n) {
n || (n = cc.instantiate(r.memberAntiAdicationTr));
n.getComponent(l.default).adjustWidth(r.innerW());
var i = parseInt(e._ids[t + o]), a = n.getComponent(c.default), s = e._memberListData.get(i);
a.setData(i, s);
return n;
}
});
};
return t = r([ m ], t);
}(cc.Component));
o.default = y;
cc._RF.pop();
