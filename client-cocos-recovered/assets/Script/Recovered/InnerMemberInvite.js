// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "23864r5IGdCy6m3nvO6mh8z", "InnerMemberInvite");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./TrAdjust"), c = e("./InviteTr"), u = e("./ClubMsg"), d = e("./ClubListData"), p = e("./WindowConfig"), f = e("./InnerBase"), h = e("./ScrollContens"), m = e("./SoundUtils"), y = e("./ClubInviteUserListData"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curPage = 1;
t._totalCount = 0;
t._ids = [];
t._contentWidth = 0;
t._itemAry = [];
t.scrollContent = null;
t.inviteOtherTr = null;
t.titlePre = null;
t.titleRoot = null;
t.allBtn = null;
t.checkSp = null;
t.noDataTipNode = null;
return t;
}
t.prototype.onLoad = function() {
this.node.width = this.adjustW;
this._contentWidth = this.adjustW - 16;
};
t.prototype.start = function() {
var e = this;
this.adjustHead(this.inviteOtherTr, [ "全选", "头像", "昵称", "ID", "操作" ]);
i.default.eventUtils.on(a.default.ui_page_change, function(t, o) {
e._curPage !== o && (e._curPage = o);
e._updateList();
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.todo_club_list_search, function(t, o) {
e.getSearchData(o);
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_club_inviteuser_list_update, function() {
e.getInviteUserList();
}, this, s.eOffType.OnDestroy);
this.getInviteUserList();
};
t.prototype.getInviteUserList = function() {
var e = this;
u.default.clubInviteUserList(d.default.focus, function(t, o) {
if (o) i.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
if (e && e.node && e.node.isValid) {
e._setData(null);
e._updateList();
}
} else i.default.uiHelper.showTip(t.res.what);
});
};
t.prototype.getSearchData = function(e) {
u.default.clubApplyInviteUserSearch(d.default.focus, e, function(e, t) {
if (t) i.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
if (!e.info) {
i.default.uiHelper.showTip("玩家不存在");
return;
}
i.default.uiHelper.show(p.eWindowID.AllianceClubInviteLayer, e.info, e.member);
} else {
if (79 === e.res.error) {
i.default.uiHelper.showTip("查询已达到最大次数");
return;
}
i.default.uiHelper.showTip(e.res.what);
}
});
};
t.prototype._setData = function(e) {
if (e) {
var t = e.trim();
t.length > 0 && function(e) {
return !("" + e.uid != t && e.nickname != t && !e.remark.includes(t));
};
}
var o = y.default.collection();
this._totalCount = o.length;
this.noDataTipNode.active = 0 === o.length;
this._ids = o;
};
t.prototype._updateList = function() {
var e = this, t = 0, o = this._totalCount;
this._itemAry = [];
this.scrollContent.load({
count: o,
cellSize: new cc.Size(this._contentWidth, 87),
viewSize: new cc.Size(this._contentWidth, 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(o, n) {
n || (n = cc.instantiate(e.inviteOtherTr));
n.getComponent(l.default).adjustWidth(e._contentWidth);
var r = parseInt(e._ids[t + o]), i = n.getComponent(c.default);
i.setData(r);
e._itemAry.push(i);
return n;
}
});
};
t.prototype.adjustHead = function(e, t) {
var o = cc.instantiate(e).getComponent(l.default).adjustWidth(this._contentWidth), n = o.length;
if (n === t.length) for (var r = 0; r < n; r++) {
var i = t[r], a = cc.instantiate(this.titlePre);
a.width = o[r];
a.getChildByName("Title").getComponent(cc.Label).string = i;
r > 0 && (a.getChildByName("Title").getComponent(cc.Label).node.getChildByName("btn_all").getComponent(cc.Button).node.active = !1);
if (0 === r) {
var s = a.getChildByName("Title").getComponent(cc.Label);
s.node.color = cc.color(93, 70, 26, 255);
s.fontSize = 24;
this.allBtn = a.getChildByName("Title").getComponent(cc.Label).node.getChildByName("btn_all").getComponent(cc.Button);
this.allBtn.node.on("click", this.onClickAll, this);
this.checkSp = this.allBtn.node.getChildByName("check").getComponent(cc.Sprite);
}
this.titleRoot.addChild(a);
} else cc.error("len error.");
};
t.prototype.onClickInvite = function() {
var e = this;
m.default.clickBtn();
for (var t = [], o = 0; o < this._itemAry.length; o++) {
var n = this._itemAry[o].getUserId();
n > 0 && t.push(n);
}
0 !== t.length ? u.default.clubInviteSubUser(d.default.focus, t, function(t, o) {
if (o) i.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
i.default.uiHelper.showTip("邀请成功!");
e.checkSp.node.active = !1;
e.getInviteUserList();
} else i.default.uiHelper.showTip(t.res.what);
}) : i.default.uiHelper.showTip("请选择您要邀请的用户");
};
t.prototype.onClickAll = function(e) {
if (0 !== this._itemAry.length) {
var t = !this.checkSp.node.active;
this.checkSp.node.active = t;
for (var o = 0; o < this._itemAry.length; o++) {
this._itemAry[o].onClickToggle(t);
}
} else i.default.uiHelper.showTip("当前没有可邀请的用户!");
};
r([ v(h.default) ], t.prototype, "scrollContent", void 0);
r([ v(cc.Prefab) ], t.prototype, "inviteOtherTr", void 0);
r([ v(cc.Prefab) ], t.prototype, "titlePre", void 0);
r([ v(cc.Node) ], t.prototype, "titleRoot", void 0);
r([ v(cc.Button) ], t.prototype, "allBtn", void 0);
r([ v(cc.Sprite) ], t.prototype, "checkSp", void 0);
r([ v(cc.Node) ], t.prototype, "noDataTipNode", void 0);
return t = r([ _ ], t);
}(f.default);
o.default = C;
cc._RF.pop();
