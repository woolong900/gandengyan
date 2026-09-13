// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "90467uonjxFaKgB3D9w8nUE", "InnerMemberUnusual");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./ClubControl"), c = e("./TrAdjust"), u = e("./FrozenTr"), d = e("./SoundUtils"), p = e("./InnerBase"), f = e("./ScrollContens"), h = e("./InactiveTr"), m = e("./ClubMsg"), y = e("./UserData"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._curPage = 1;
t._totalCount = 0;
t._ids = [];
t._contentWidth = 0;
t._selectBtn = 0;
t._searchStr = "";
t._memberListData = null;
t.frozenTr = null;
t.inactiveTr = null;
t.titlePre = null;
t.contentNode = null;
t.scrollContent = null;
t.titleRoot = null;
t.zombieInactiveNode = null;
t.zombieActiveNode = null;
t.abnormalInactive = null;
t.abnormalActive = null;
t.noDataTipNode = null;
return t;
}
t.prototype.onLoad = function() {
this.node.width = this.adjustW;
this._contentWidth = this.adjustW - 16;
};
t.prototype.start = function() {
var e = this;
this._selectBtn = 0;
this.adjustHead(this.frozenTr, [ "成员信息", "身份", "状态", "所属", "操作" ]);
i.default.eventUtils.on(a.default.ui_page_change, function(t, o) {
e._curPage !== o && (e._curPage = o);
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.todo_club_list_search, function(t, o) {
e._searchStr = o;
e._setData(o);
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_club_member_manager_update, function(t) {
e.getClubMember();
}, this, s.eOffType.OnDestroy);
this.getClubMember();
};
t.prototype.getClubMember = function() {
var e = this;
m.default.getClubMemberInfoCb(l.default.getCurClubData().id, function(t, o) {
if (o) i.default.uiHelper.showTip("获取异常列表失败~"); else if (t) {
if (e && e.node && e.isValid) {
e._memberListData = t;
var n = e._searchStr.length > 0 ? e._searchStr : null;
e._setData(n);
e._uiDirty = !0;
}
} else i.default.uiHelper.showTip("获取异常列表失败~");
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateList();
}
};
t.prototype._setData = function(e) {
var t = this, o = function(e) {
return e.freeze;
}, n = function(e) {
return e.inActiveState();
}, r = function(e) {
return !0;
};
if (e) {
var i = e.trim();
i.length > 0 && (r = function(e) {
return !("" + e.uid != i && e.nickname != i && !e.remark.includes(i));
});
}
var a = this._memberListData.collection(function(e) {
return 0 === t._selectBtn ? o(e) && r(e) : n(e) && r(e);
}, function(e, t) {
return t.degress - e.degress;
});
this._totalCount = a.length;
this.noDataTipNode.active = 0 === a.length;
this._ids = a;
};
t.prototype._updateList = function() {
var e = this, t = 0, o = this._totalCount, n = this._memberListData.get(y.default.uid);
this.scrollContent.load({
count: o,
cellSize: new cc.Size(this._contentWidth, 87),
viewSize: new cc.Size(this._contentWidth, 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(o, r) {
(r = 0 === e._selectBtn ? cc.instantiate(e.frozenTr) : cc.instantiate(e.inactiveTr)).getComponent(c.default).adjustWidth(e._contentWidth);
var i = parseInt(e._ids[t + o]), a = 0 === e._selectBtn ? r.getComponent(u.default) : r.getComponent(h.default), s = e._memberListData.get(i);
a.setData(i, s, n);
return r;
}
});
};
t.prototype.adjustHead = function(e, t) {
this.titleRoot.removeAllChildren();
var o = cc.instantiate(e).getComponent(c.default).adjustWidth(this._contentWidth), n = o.length;
if (n === t.length) for (var r = 0; r < n; r++) {
var i = t[r], a = cc.instantiate(this.titlePre);
a.width = o[r];
a.getChildByName("Title").getComponent(cc.Label).string = i;
this.titleRoot.addChild(a);
} else cc.error("len error.");
};
t.prototype.onClickAbnormalBtn = function() {
d.default.clickBtn();
this._selectBtn = 0;
this._setData(null);
this._updateList();
this.showBtnState(!0);
this.adjustHead(this.frozenTr, [ "成员信息", "身份", "状态", "所属", "操作" ]);
};
t.prototype.onClickZombiesBtn = function() {
d.default.clickBtn();
this._selectBtn = 1;
this._setData(null);
this._updateList();
this.showBtnState(!1);
this.adjustHead(this.inactiveTr, [ "成员信息", "身份", "状态", "加入时间", "上次对局", "操作" ]);
};
t.prototype.showBtnState = function(e) {
this.abnormalActive.active = e;
this.abnormalInactive.active = !e;
this.zombieInactiveNode.active = e;
this.zombieActiveNode.active = !e;
};
r([ v(cc.Prefab) ], t.prototype, "frozenTr", void 0);
r([ v(cc.Prefab) ], t.prototype, "inactiveTr", void 0);
r([ v(cc.Prefab) ], t.prototype, "titlePre", void 0);
r([ v(cc.Node) ], t.prototype, "contentNode", void 0);
r([ v(f.default) ], t.prototype, "scrollContent", void 0);
r([ v(cc.Node) ], t.prototype, "titleRoot", void 0);
r([ v(cc.Node) ], t.prototype, "zombieInactiveNode", void 0);
r([ v(cc.Node) ], t.prototype, "zombieActiveNode", void 0);
r([ v(cc.Node) ], t.prototype, "abnormalInactive", void 0);
r([ v(cc.Node) ], t.prototype, "abnormalActive", void 0);
r([ v(cc.Node) ], t.prototype, "noDataTipNode", void 0);
return t = r([ _ ], t);
}(p.default);
o.default = C;
cc._RF.pop();
