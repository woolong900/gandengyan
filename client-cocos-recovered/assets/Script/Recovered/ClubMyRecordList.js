// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dcf05IZXv1J3794FageDhVs", "ClubMyRecordList");
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
var i = e("./ScrollContens"), a = e("./TrAdjust"), s = e("./ClubMyRecordItem"), l = e("./ClubMsg"), c = e("./gContext"), u = e("./ClubControl"), d = e("./UserData"), p = e("./PageHandle"), f = e("./BaseComponent"), h = e("./StringUtils"), m = e("./ClubMyRecordListData"), y = cc._decorator, g = y.ccclass, _ = y.property, v = {
1: "今日战绩",
2: "昨日战绩"
}, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curPage = 1;
t._totalCount = 0;
t._contentWidth = 0;
t._curSecond = 0;
t._ids = [];
t._curMillisecond = 0;
t._yesterdayMillisecond = 0;
t._dayTime = [];
t.pageNode = null;
t.pageHandle = null;
t.statistPre = null;
t.recordListPre = null;
t.titlePre = null;
t.statistContentNode = null;
t.statistScrollContent = null;
t.titleRoot = null;
t.statistNoDataTipNode = null;
t.bgNode = null;
t.topNode = null;
return t;
}
t.prototype.onLoad = function() {
this.bgNode.width = cc.winSize.width;
this.bgNode.height = cc.winSize.height;
this._contentWidth = cc.winSize.width - 6;
};
t.prototype.start = function() {
this.adjustHead(this.titleRoot, this.statistPre, [ "时间", "大赢家次数", "参与场次", "总分", "战绩回放" ]);
this.statistContentNode.width = this._contentWidth;
this.topNode.width = cc.winSize.width;
var e = h.default.dateFormat(d.default.millisecond, "yyyy/MM/dd"), t = new Date(e + " GMT+8");
this._curMillisecond = t.getTime() / 1e3;
this._yesterdayMillisecond = this.getDayTimeStamp() - 86400;
this.getRecordStatistList();
};
t.prototype.getDayTimeStamp = function() {
return this._curSecond > 0 ? 86400 * Math.floor((this._curSecond + 28800) / 86400) - 28800 : 86400 * Math.floor((d.default.second + 28800) / 86400) - 28800;
};
t.prototype.getRecordStatistList = function() {
var e = this;
this._dayTime = [ {
keyS: "1",
date: this._curMillisecond
}, {
keyS: "2",
date: this._yesterdayMillisecond
} ];
l.default.clubGameUserDayRecordList(u.default.getCurClubData().id, this._dayTime, function(t, o) {
if (o) c.default.uiHelper.showTip("获取个人战绩列表失败~"); else if (0 === t.res.error) {
e._updateStatistUI();
e._updateStatist();
} else c.default.uiHelper.showTip("获取个人战绩列表失败~");
});
};
t.prototype._updateStatistUI = function() {
var e = m.default.collection(null, function(e, t) {
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
this.statistScrollContent.load({
count: n,
cellSize: new cc.Size(this._contentWidth, 87),
viewSize: new cc.Size(this._contentWidth, 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(n, r) {
(r = cc.instantiate(e.statistPre)).getComponent(a.default).adjustWidth(e._contentWidth);
var i = parseInt(o[t + n]), l = r.getComponent(s.default), c = m.default.get(i), u = v[c.keyS], d = 0;
"1" === c.keyS ? d = e._curMillisecond : "2" === c.keyS && (d = e._yesterdayMillisecond);
l.setData(d, u, c);
return r;
}
});
};
t.prototype.adjustHead = function(e, t, o) {
e.removeAllChildren();
var n = cc.instantiate(t).getComponent(a.default).adjustWidth(this._contentWidth - 6 - 10), r = n.length;
if (r === o.length) for (var i = 0; i < r; i++) {
var s = o[i], l = cc.instantiate(this.titlePre);
l.width = n[i];
l.getChildByName("Title").getComponent(cc.Label).string = s;
e.addChild(l);
} else cc.error("len error.");
};
r([ _(cc.Node) ], t.prototype, "pageNode", void 0);
r([ _(p.default) ], t.prototype, "pageHandle", void 0);
r([ _(cc.Prefab) ], t.prototype, "statistPre", void 0);
r([ _(cc.Prefab) ], t.prototype, "recordListPre", void 0);
r([ _(cc.Prefab) ], t.prototype, "titlePre", void 0);
r([ _(cc.Node) ], t.prototype, "statistContentNode", void 0);
r([ _(i.default) ], t.prototype, "statistScrollContent", void 0);
r([ _(cc.Node) ], t.prototype, "titleRoot", void 0);
r([ _(cc.Node) ], t.prototype, "statistNoDataTipNode", void 0);
r([ _(cc.Node) ], t.prototype, "bgNode", void 0);
r([ _(cc.Node) ], t.prototype, "topNode", void 0);
return t = r([ g ], t);
}(f.default);
o.default = C;
cc._RF.pop();
