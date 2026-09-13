// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3bfea+v02BBu6ebqZ9Me5QZ", "ClubRecordList");
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
var i = e("./ClubRecordItem"), a = e("./Loader"), s = e("./InnerBase"), l = e("./ScrollContens"), c = e("./SoundUtils"), u = e("./TrAdjust"), d = e("./ClubRecordStatistItem"), p = e("./ClubRecordBiaoItem"), f = e("./ClubMsg"), h = e("./gContext"), m = e("./ClubControl"), y = e("./CenterMsg"), g = e("./UserData"), _ = e("./ClubRecordListData"), v = e("./GameRecordListData"), C = e("./EventKeys"), b = e("./EventUtils"), D = e("./PageHandle"), S = e("./ClubAccumulatedRecordListData"), w = e("./GameConfig"), O = e("./CommonEnum"), P = cc._decorator, I = P.ccclass, R = P.property, k = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curPage = 1;
t._totalCount = 0;
t._contentWidth = 0;
t._uiListDirty = !1;
t._uiDirty = !1;
t._selectBtn = 0;
t._curSecond = 0;
t._curStartSecond = 0;
t._curEndSecond = 0;
t._ids = [];
t._start_date = 0;
t._end_date = 0;
t.pageNode = null;
t.dateNode = null;
t.dataTimeNode = null;
t.pageHandle = null;
t.statistPre = null;
t.recordListPre = null;
t.titlePre = null;
t.statistContentNode = null;
t.statistScrollContent = null;
t.titleRoot = null;
t.statistInactiveNode = null;
t.statistActiveNode = null;
t.listInactive = null;
t.listActive = null;
t.statistNoDataTipNode = null;
t.contentNode = null;
t.scrollContent = null;
t.listNoDataTipNode = null;
t.biaoPre = null;
t.titleBiaoRoot = null;
t.biaoContentNode = null;
t.biaoScrollContent = null;
t.biaoListNoDataTipNode = null;
t.biaoInactive = null;
t.biaoActive = null;
t.biaoNode = null;
t._searchStr = "";
t._orderScoreUpArrow = null;
t._orderScoreDownArrow = null;
return t;
}
t.prototype.onLoad = function() {
this.node.width = this.adjustW;
this._contentWidth = this.adjustW - 16;
};
t.prototype.start = function() {
var e = this;
this._selectBtn = 0;
this.adjustHead(this.titleRoot, this.statistPre, [ "成员信息", "大赢家次数", "总分", "参与场次", "战绩回放" ]);
h.default.eventUtils.on(C.default.ui_page_change, function(t, o) {
if (e._curPage !== o) {
e._curPage = o;
e._uiListDirty = !0;
}
}, this, b.eOffType.OnDestroy);
h.default.eventUtils.on(C.default.todo_club_list_search, function(t, o) {
if (0 === e._selectBtn) e.getRecordStatistList(o); else if (1 === e._selectBtn) e.getClubRecordList(o); else if (2 === e._selectBtn) {
e._searchStr = o;
e.getRecordBiaoList();
}
}, this, b.eOffType.OnDestroy);
h.default.eventUtils.on(C.default.ui_date_selector_change, function(t, o) {
if (o != 1e3 * e._curSecond) {
e._curPage = 1;
e._curSecond = o / 1e3;
0 === e._selectBtn ? e.getRecordStatistList("") : e.getClubRecordList("");
}
}, this, b.eOffType.OnDestroy);
h.default.eventUtils.on(C.default.ui_date_selector_time_change, function(t, o) {
e.resetHeadSortIco();
60 * o[0] * 60 + 60 * o[1] + o[2] == 0 ? e._start_date = 0 : e._start_date = e.getStartDateTimeStamp(o[0], o[1], o[2]);
60 * o[3] * 60 + 60 * o[4] + o[5] == 0 ? e._end_date = 0 : e._end_date = e.getEndDateTimeStamp(o[3], o[4], o[5]);
60 * o[0] * 60 + 60 * o[1] + o[2] == 0 && 60 * o[3] * 60 + 60 * o[4] + o[5] != 0 && (e._start_date = e.getStartDateTimeStamp(o[0], o[1], o[2]));
60 * o[3] * 60 + 60 * o[4] + o[5] == 0 && 60 * o[0] * 60 + 60 * o[1] + o[2] != 0 && (e._end_date = e.getEndDateTimeStamp(o[3], o[4], o[5]));
0 === e._selectBtn ? e.getRecordStatistList("") : 1 === e._selectBtn ? e.getClubRecordList("") : 2 === e._selectBtn && e.getRecordBiaoList();
}, this, b.eOffType.OnDestroy);
this.getRecordStatistList("");
this.loadDatepicker();
this.scheduleOnce(function() {
e.loadDateTimePicker();
}, 0);
if (w.default.area() === O.eArea.QJ) {
var t = m.default.getCurClubData().enableAntiAddiction;
if (!1 === t) this.biaoNode.active = !1; else if (!0 === t) this.biaoNode.active = !0; else {
var o;
o = 1 == (1 & t) && 2 == (2 & t) && 4 == (4 & t);
this.biaoNode.active = !!o;
}
}
};
t.prototype.getDayTimeStamp = function() {
return this._curSecond > 0 ? 86400 * Math.floor((this._curSecond + 28800) / 86400) - 28800 : 86400 * Math.floor((g.default.second + 28800) / 86400) - 28800;
};
t.prototype.getStartDateTimeStamp = function(e, t, o) {
return this.getDayTimeStamp() + 60 * e * 60 + 60 * t + o;
};
t.prototype.getEndDateTimeStamp = function(e, t, o) {
return this.getDayTimeStamp() + 60 * e * 60 + 60 * t + o;
};
t.prototype.getCurSelectTime = function() {
return this._curSecond > 0 ? this._curSecond : g.default.second;
};
t.prototype.getRecordStatistList = function(e) {
var t = this, o = this.getDayTimeStamp();
f.default.clubRecordStatisticsDayList(m.default.getCurClubData().id, e, o, this._start_date, this._end_date, function(e, o) {
o ? h.default.uiHelper.showTip("获取统计列表失败~") : 0 === e.res.error ? t._uiDirty = !0 : h.default.uiHelper.showTip("获取统计列表失败~");
});
};
t.prototype.getRecordBiaoList = function() {
var e = this;
f.default.clubAccumulatedRecordList(m.default.getCurClubData().id, function(t, o) {
o ? h.default.uiHelper.showTip("获取战绩表失败~") : 0 === t.res.error ? e._uiDirty = !0 : h.default.uiHelper.showTip("获取战绩表失败~");
});
};
t.prototype.getClubRecordList = function(e) {
var t = this, o = this.getDayTimeStamp();
y.default.getClubRecordList(m.default.getCurClubData().id, o, e, this._start_date, this._end_date, function(e, o) {
o ? h.default.uiHelper.showTip("获取战绩列表失败~") : 0 === e.error && (t._uiDirty = !0);
});
};
t.prototype.createPage = function() {
var e = this;
a.default.loadPre("Hall/Res/Prefab/Club/ClubCommon/PageHandle", function(t) {
var o = cc.instantiate(t);
e.pageHandle = o.getComponent(D.default);
e.pageNode.addChild(o);
});
};
t.prototype.loadDatepicker = function() {
var e = this;
a.default.loadPre("Hall/Res/Prefab/Club/ClubCommon/DateSelector", function(t) {
var o = cc.instantiate(t);
e.dateNode.addChild(o);
});
};
t.prototype.loadDateTimePicker = function() {
var e = this;
a.default.loadPre("Hall/Res/Prefab/Club/ClubCommon/DateTimeSelector", function(t) {
var o = cc.instantiate(t);
e.dataTimeNode.addChild(o);
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
if (0 === this._selectBtn) {
this._updateStatistUI();
this._updateStatist();
} else if (1 === this._selectBtn) {
this._updateListUI();
this._updateList();
} else if (2 === this._selectBtn) {
this._updateBiaoUI();
this._updateBiao();
}
} else if (this._uiListDirty) {
this._uiListDirty = !1;
0 === this._selectBtn ? this._updateStatist() : 1 === this._selectBtn ? this._updateList() : 2 === this._selectBtn && this._updateBiao();
}
};
t.prototype._updateBiaoUI = function() {
this.dataTimeNode.active = !1;
this.dateNode.active = !1;
this.adjustHead(this.titleBiaoRoot, this.statistPre, [ "成员信息", "大赢家次数", "总分", "参与场次", "操作" ]);
var e = null;
if (this._searchStr) {
var t = this._searchStr.trim();
t.length > 0 && (e = function(e) {
return !("" + e.code != t && e.nickname != t && !e.remark.includes(t));
});
}
var o = S.default.collection(e, function(e, t) {
return e.weight - t.weight;
});
this._ids = o;
this._totalCount = o.length;
var n = Math.ceil(this._totalCount / 10);
n < 1 && (n = 1);
this.pageHandle.setData(n);
this.biaoListNoDataTipNode.active = 0 === this._totalCount;
};
t.prototype._updateBiao = function() {
var e = this, t = 0, o = this._ids, n = o.length, r = this._curPage - 1;
n = 10;
(t = 10 * r) + 10 > this._totalCount && (n = this._totalCount - t);
this.biaoScrollContent.load({
count: n,
cellSize: new cc.Size(this._contentWidth, 87),
viewSize: new cc.Size(this._contentWidth, 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(n, r) {
(r = cc.instantiate(e.biaoPre)).getComponent(u.default).adjustWidth(e._contentWidth);
var i = parseInt(o[t + n]), a = r.getComponent(p.default), s = S.default.get(i);
a.setData(s);
return r;
}
});
};
t.prototype._sortStatist = function(e) {
void 0 === e && (e = !1);
var t = _.default.collection(null, function(t, o) {
return e ? o.score - t.score : t.score - o.score;
});
this._totalCount = t.length;
this._ids = t;
this._updateStatist();
};
t.prototype._updateStatistUI = function() {
this.dataTimeNode.active = !0;
this.dateNode.active = !0;
var e = _.default.collection(null, function(e, t) {
return e.weight - t.weight;
});
this._totalCount = e.length;
this._ids = e;
var t = Math.ceil(this._totalCount / 10);
t < 1 && (t = 1);
this.pageHandle.setData(t);
this.statistNoDataTipNode.active = 0 === this._totalCount;
};
t.prototype._updateStatist = function() {
var e = this, t = 0, o = this._ids, n = o.length, r = this._curPage - 1;
n = 10;
(t = 10 * r) + 10 > this._totalCount && (n = this._totalCount - t);
var i = this.getCurSelectTime();
this.statistScrollContent.load({
count: n,
cellSize: new cc.Size(this._contentWidth, 87),
viewSize: new cc.Size(this._contentWidth, 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(n, r) {
(r = cc.instantiate(e.statistPre)).getComponent(u.default).adjustWidth(e._contentWidth);
var a = parseInt(o[t + n]), s = r.getComponent(d.default), l = _.default.get(a);
s.setData(i, l, e._start_date, e._end_date);
return r;
}
});
};
t.prototype._updateListUI = function() {
this.dataTimeNode.active = !0;
this.dateNode.active = !0;
var e = g.default.gameRecordList.collection(null, v.default.timerSort);
this._totalCount = e.length;
this._ids = e;
var t = Math.ceil(this._totalCount / 10);
t < 1 && (t = 1);
this.pageHandle.setData(t);
this.listNoDataTipNode.active = 0 === this._totalCount;
};
t.prototype._updateList = function() {
var e = this, t = 0, o = this._ids.length, n = this._curPage - 1;
o = 10;
(t = 10 * n) + 10 > this._totalCount && (o = this._totalCount - t);
var r = this._contentWidth + 271 + 15;
this.scrollContent.load({
count: o,
cellSize: new cc.Size(r, 128),
viewSize: new cc.Size(r, 600),
column: 1,
data_cb: function(o, n) {
(n = cc.instantiate(e.recordListPre)).setContentSize(r, 128);
var a = n.getComponent(i.default);
a.setData(e._ids[t + o]);
a.adjustWidth(r);
return n;
}
});
};
t.prototype.adjustHead = function(e, t, o) {
var n = this;
e.removeAllChildren();
var r = cc.instantiate(t).getComponent(u.default).adjustWidth(this._contentWidth), i = r.length;
if (i === o.length) for (var a = function(t) {
var i = o[t], a = cc.instantiate(s.titlePre);
a.width = r[t];
a.getChildByName("Title").getComponent(cc.Label).string = i;
if ("总分" === i && 0 === s._selectBtn) {
a.getChildByName("paixu").active = !0;
s._orderScoreUpArrow = a.getChildByName("paixu").getChildByName("upActive");
s._orderScoreDownArrow = a.getChildByName("paixu").getChildByName("downActive");
var l = !0;
a.getChildByName("paixu").on(cc.Node.EventType.TOUCH_END, function(e) {
l = !l;
n._orderScoreUpArrow.active = !l;
n._orderScoreDownArrow.active = l;
n._sortStatist(l);
}, s);
}
e.addChild(a);
}, s = this, l = 0; l < i; l++) a(l); else cc.error("len error.");
};
t.prototype.resetHeadSortIco = function() {
this._orderScoreUpArrow.active = !1;
this._orderScoreDownArrow.active = !1;
};
t.prototype.onClickStatist = function() {
c.default.clickBtn();
if (0 !== this._selectBtn) {
this._selectBtn = 0;
this.getRecordStatistList("");
this.showBtnState(0);
}
};
t.prototype.onClicklist = function() {
c.default.clickBtn();
if (1 !== this._selectBtn) {
this._selectBtn = 1;
this.getClubRecordList("");
this.showBtnState(1);
}
};
t.prototype.onClickBiao = function() {
c.default.clickBtn();
if (2 !== this._selectBtn) {
this._selectBtn = 2;
this.getRecordBiaoList();
this.showBtnState(2);
}
};
t.prototype.showBtnState = function(e) {
this._searchStr = "";
this._curPage = 1;
this.resetHeadSortIco();
if (0 === e) {
this.statistContentNode.active = !0;
this.contentNode.active = !1;
this.biaoContentNode.active = !1;
this.statistActiveNode.active = !0;
this.statistInactiveNode.active = !1;
this.listInactive.active = !0;
this.listActive.active = !1;
this.biaoInactive.active = !0;
this.biaoActive.active = !1;
} else if (1 === e) {
this.statistContentNode.active = !1;
this.contentNode.active = !0;
this.biaoContentNode.active = !1;
this.statistActiveNode.active = !1;
this.statistInactiveNode.active = !0;
this.listInactive.active = !1;
this.listActive.active = !0;
this.biaoInactive.active = !0;
this.biaoActive.active = !1;
} else if (2 === e) {
this.statistContentNode.active = !1;
this.contentNode.active = !1;
this.biaoContentNode.active = !0;
this.statistActiveNode.active = !1;
this.statistInactiveNode.active = !0;
this.listInactive.active = !0;
this.listActive.active = !1;
this.biaoInactive.active = !1;
this.biaoActive.active = !0;
}
};
r([ R(cc.Node) ], t.prototype, "pageNode", void 0);
r([ R(cc.Node) ], t.prototype, "dateNode", void 0);
r([ R(cc.Node) ], t.prototype, "dataTimeNode", void 0);
r([ R(D.default) ], t.prototype, "pageHandle", void 0);
r([ R(cc.Prefab) ], t.prototype, "statistPre", void 0);
r([ R(cc.Prefab) ], t.prototype, "recordListPre", void 0);
r([ R(cc.Prefab) ], t.prototype, "titlePre", void 0);
r([ R(cc.Node) ], t.prototype, "statistContentNode", void 0);
r([ R(l.default) ], t.prototype, "statistScrollContent", void 0);
r([ R(cc.Node) ], t.prototype, "titleRoot", void 0);
r([ R(cc.Node) ], t.prototype, "statistInactiveNode", void 0);
r([ R(cc.Node) ], t.prototype, "statistActiveNode", void 0);
r([ R(cc.Node) ], t.prototype, "listInactive", void 0);
r([ R(cc.Node) ], t.prototype, "listActive", void 0);
r([ R(cc.Node) ], t.prototype, "statistNoDataTipNode", void 0);
r([ R(cc.Node) ], t.prototype, "contentNode", void 0);
r([ R(l.default) ], t.prototype, "scrollContent", void 0);
r([ R(cc.Node) ], t.prototype, "listNoDataTipNode", void 0);
r([ R(cc.Prefab) ], t.prototype, "biaoPre", void 0);
r([ R(cc.Node) ], t.prototype, "titleBiaoRoot", void 0);
r([ R(cc.Node) ], t.prototype, "biaoContentNode", void 0);
r([ R(l.default) ], t.prototype, "biaoScrollContent", void 0);
r([ R(cc.Node) ], t.prototype, "biaoListNoDataTipNode", void 0);
r([ R(cc.Node) ], t.prototype, "biaoInactive", void 0);
r([ R(cc.Node) ], t.prototype, "biaoActive", void 0);
r([ R(cc.Node) ], t.prototype, "biaoNode", void 0);
return t = r([ I ], t);
}(s.default);
o.default = k;
cc._RF.pop();
