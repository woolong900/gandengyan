// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "29701lLIvBL8Z7n4dK9MJ8H", "ClubRecordDetailLayer");
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
var i = require("./BaseComponent"), a = require("./ScrollContens"), s = require("./ClubRecordDetailCell"), l = require("./WindowConfig"), c = require("./gContext"), u = require("./CenterMsg"), d = require("./ClubControl"), p = require("./UserData"), f = require("./GameRecordListData"), h = require("./StringUtils"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._contentWidth = 0;
t._uiDirty = !1;
t._uid = "";
t._time = 0;
t._start_date = 0;
t._end_date = 0;
t.timeLabel = null;
t.totalSessionLabel = null;
t.totalScoreLabel = null;
t.currentScoreLabel = null;
t.scrollContent = null;
t.cellPre = null;
t.recordDetailsPre = null;
t.noDataTipNode = null;
return t;
}
t.prototype.onLoad = function() {
this.node.width = cc.winSize.width - 20;
this._contentWidth = cc.winSize.width - 20;
};
t.prototype.start = function() {
this.getClubRecordList();
};
t.prototype.setData = function(e, t) {
this._uid = t.uid;
this._time = e;
this.timeLabel.string = h.default.dateFormat(1e3 * e, "yyyy-MM-dd");
this.totalSessionLabel.string = "总场次：" + t.session;
this.totalScoreLabel.string = "总分：" + t.score;
this._start_date = t._start_date;
this._end_date = t._end_date;
};
t.prototype.getDayTimeStamp = function() {
return 86400 * Math.floor((this._time + 28800) / 86400) - 28800;
};
t.prototype.getClubRecordList = function() {
var e = this, t = this.getDayTimeStamp();
u.default.getClubRecordList(d.default.getCurClubData().id, t, this._uid, this._start_date, this._end_date, function(t, o) {
o ? c.default.uiHelper.showTip("获取战绩列表失败~") : t && (e._uiDirty = !0);
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateList();
}
};
t.prototype._updateList = function() {
var e = this, t = p.default.gameRecordList.collection(null, f.default.timerSort);
t.length < 1 ? this.noDataTipNode.active = !0 : this.noDataTipNode.active = !1;
this.scrollContent.load({
count: t.length,
cellSize: new cc.Size(this._contentWidth, 137),
viewSize: new cc.Size(this._contentWidth, 529),
padding: {
left: 0,
right: 0,
top: 1,
bottom: 0
},
spacing: cc.v2(0, -1),
column: 1,
data_cb: function(o, n) {
n || (n = cc.instantiate(e.cellPre));
var r = n.getComponent(s.default);
r.setData(t[o], e._contentWidth);
r.adjustWidth(e._contentWidth);
return n;
},
click_cb: function(o, n) {
if (p.default.gameRecordList.get(t[o]).getDetailsData()) c.default.uiHelper.showWithNode(l.eWindowID.RecordDetail, e.recordDetailsPre, t[o]); else {
var r = t[o];
u.default.getRecordDetails(r, function(t, o, n) {
if (o) c.default.uiHelper.showTipNetError(); else if (0 === t.error) {
p.default.gameRecordList.get(r).setDetailsData(n);
c.default.uiHelper.showWithNode(l.eWindowID.RecordDetail, e.recordDetailsPre, r);
} else c.default.uiHelper.showTip(t.what);
});
}
}
});
};
r([ g(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ g(cc.Label) ], t.prototype, "totalSessionLabel", void 0);
r([ g(cc.Label) ], t.prototype, "totalScoreLabel", void 0);
r([ g(cc.Label) ], t.prototype, "currentScoreLabel", void 0);
r([ g(a.default) ], t.prototype, "scrollContent", void 0);
r([ g(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ g(cc.Prefab) ], t.prototype, "recordDetailsPre", void 0);
r([ g(cc.Node) ], t.prototype, "noDataTipNode", void 0);
return t = r([ y ], t);
}(i.default);
o.default = _;
cc._RF.pop();
