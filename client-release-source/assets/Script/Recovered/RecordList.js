// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b3dafulmFlNiruUfXE56lBv", "RecordList");
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
var i = require("./gContext"), a = require("./RecordListCell"), s = require("./BaseComponent"), l = require("./WindowConfig"), c = require("./ScrollContens"), u = require("./UserData"), d = require("./GameRecordListData"), p = require("./SoundUtils"), f = require("./RoomConfig"), h = require("./CenterMsg"), m = require("./CommonUtils"), y = require("./EventKeys"), g = require("./EventUtils"), _ = cc._decorator, v = _.ccclass, C = _.property, b = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._gameId = -1;
t.scrollContent = null;
t.cellPre = null;
t.recordDetailsPre = null;
t.gameNameLabel = null;
t.choosePanal = null;
t.chooseContainer = null;
t.chooseItem = null;
t.gameName = null;
t.triangle = null;
t.noDataTipNode = null;
return t;
}
t.prototype.start = function() {
var e = this, t = m.default.todayBeginTime() / 1e3;
this._getData(t);
i.default.eventUtils.on(y.default.ui_date_selector_change, function(t, o) {
e._getData(o / 1e3);
}, this, g.eOffType.OnDestroy);
i.default.eventUtils.on(y.default.ui_record_game_choose, function(t, o) {
e._gameId = parseInt(o);
e._updateList();
}, this, g.eOffType.OnDestroy);
};
t.prototype._getData = function(e) {
var t = this;
h.default.getMyRecordList(e, function(e, o) {
o ? i.default.uiHelper.showTipNetError() : 0 === e.error ? t._uiDirty = !0 : i.default.uiHelper.showTip(e.what);
});
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateList();
}
};
t.prototype._updateList = function() {
var e = this, t = null;
if (this._gameId > 0) {
this.gameNameLabel.string = f.default[this._gameId].name;
t = function(t) {
return t.gameId === e._gameId;
};
} else this.gameNameLabel.string = "所有玩法";
var o = u.default.gameRecordList.collection(t, d.default.timerSort);
o.length < 1 ? this.noDataTipNode.active = !0 : this.noDataTipNode.active = !1;
this._updateDayStat(o);
this._updateDayStat(o);
var n = this.scrollContent.node.getChildByName("view").getChildByName("content");
n && n.childrenCount > 0 && n.removeAllChildren(!0);
this.scrollContent.load({
count: o.length,
cellSize: new cc.Size(1234, 137),
viewSize: new cc.Size(1234, 530),
padding: {
left: 0,
right: 0,
top: 1,
bottom: 0
},
spacing: cc.v2(0, -1),
column: 1,
data_cb: function(t, n) {
n || (n = cc.instantiate(e.cellPre));
n.getComponent(a.default).setData(o[t]);
return n;
},
click_cb: function(t, n) {
if (u.default.gameRecordList.get(o[t]).getDetailsData()) i.default.uiHelper.showWithNode(l.eWindowID.RecordDetail, e.recordDetailsPre, o[t]); else {
var r = o[t];
h.default.getRecordDetails(r, function(t, o, n) {
if (o) i.default.uiHelper.showTipNetError(); else if (0 === t.error) {
u.default.gameRecordList.get(r).setDetailsData(n);
i.default.uiHelper.showWithNode(l.eWindowID.RecordDetail, e.recordDetailsPre, r);
} else i.default.uiHelper.showTip(t.what);
});
}
}
});
};
t.prototype._updateDayStat = function(e) {
var t = this.node.getChildByName("bg"), o = t && t.getChildByName("DateSelector");
if (!o) return;
var n = o.getChildByName("DateInput"), r = n && n.getChildByName("input_date");
r = r && r.getChildByName("DateLabel");
var i = 36, a = function(s, l) {
var c = t.getChildByName(s);
if (!c) {
c = r ? cc.instantiate(r) : new cc.Node(s);
c.name = s;
var b = c.getComponent(cc.Label);
if (!b) {
b = c.addComponent(cc.Label);
b.useSystemFont = !0;
b.fontFamily = "sans-serif-medium";
b.fontSize = 26;
b.lineHeight = 26;
c.color = new cc.Color(93, 70, 26);
}
c.setAnchorPoint(1, .5);
t.addChild(c);
}
var d = c.getComponent(cc.Label);
d.overflow = 0;
d.horizontalAlign = 2;
d.string = l;
d._updateRenderData && d._updateRenderData(!0);
return c;
};
var s = 0, l = u.default.uid;
for (var c = 0; c < e.length; c++) {
var d = u.default.gameRecordList.get(e[c]);
if (d && d.players) for (var p = 0; p < d.players.length; p++) if (Number(d.players[p].uid) === Number(l)) {
s += d.players[p].score;
break;
}
}
var f = a("DayScore", "总分：" + s), h = a("DayGames", "总场次：" + e.length);
var m = o.x - ((n && n.width) || 260) / 2;
f.setPosition(m - i, o.y);
h.setPosition(m - i - f.width - i, o.y);
};
t.prototype._updateDayStat = function(e) {
var t = this.node.getChildByName("bg"), o = t && t.getChildByName("DateSelector");
if (!o) return;
var n = o.getChildByName("DateInput"), r = n && n.getChildByName("input_date");
r = r && r.getChildByName("DateLabel");
var i = 36, a = function(s, l) {
var c = t.getChildByName(s);
if (!c) {
c = r ? cc.instantiate(r) : new cc.Node(s);
c.name = s;
var b = c.getComponent(cc.Label);
if (!b) {
b = c.addComponent(cc.Label);
b.useSystemFont = !0;
b.fontFamily = "sans-serif-medium";
b.fontSize = 26;
b.lineHeight = 26;
c.color = new cc.Color(93, 70, 26);
}
c.setAnchorPoint(1, .5);
t.addChild(c);
}
var d = c.getComponent(cc.Label);
d.overflow = 0;
d.horizontalAlign = 2;
d.string = l;
d._updateRenderData && d._updateRenderData(!0);
return c;
};
var s = 0, l = u.default.uid;
for (var c = 0; c < e.length; c++) {
var d = u.default.gameRecordList.get(e[c]);
if (d && d.players) for (var p = 0; p < d.players.length; p++) if (Number(d.players[p].uid) === Number(l)) {
s += d.players[p].score;
break;
}
}
var f = a("DayScore", "总分：" + s), h = a("DayGames", "总场次：" + e.length);
var m = o.x - ((n && n.width) || 260) / 2;
f.setPosition(m - i, o.y);
h.setPosition(m - i - f.width - i, o.y);
};
t.prototype._addItem = function(e, t) {
var o = cc.instantiate(this.chooseItem);
o.children[0].getComponent(cc.Label).string = t;
o.parent = this.chooseContainer;
o.active = !0;
this._createEvent(o.getComponent(cc.Button), e);
return o;
};
t.prototype._loadChoosePanal = function() {
var e = this, t = Object.keys(f.default), o = this._addItem(-1, "所有玩法");
t.forEach(function(t, n) {
var r = parseInt(t);
if (u.default.isGameShow(r)) {
var i = f.default[r].name;
o = e._addItem(r, i);
}
});
o && (o.children[1].active = !1);
};
t.prototype._createEvent = function(e, t) {
var o = new cc.Component.EventHandler();
o.target = this.node;
o.component = "RecordList";
o.handler = "onClickChooseGame";
o.customEventData = "" + t;
e.clickEvents.push(o);
};
t.prototype.onClickShowChoose = function() {
p.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.RecordGameChoose, this._gameId);
};
t.prototype.onClickChooseGame = function(e, t) {
p.default.clickBtn();
this.choosePanal.active = !1;
this.triangle.angle = 0;
this._gameId = parseInt(t);
this._updateList();
};
t.prototype.onClickHidePanal = function() {
p.default.clickBtn();
this.choosePanal.active = !1;
this.triangle.angle = 0;
};
t.prototype.onClickRecordCheck = function() {
p.default.clickBtn();
i.default.uiHelper.show(l.eWindowID.RecordCheck);
};
r([ C(c.default) ], t.prototype, "scrollContent", void 0);
r([ C(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ C(cc.Prefab) ], t.prototype, "recordDetailsPre", void 0);
r([ C(cc.Label) ], t.prototype, "gameNameLabel", void 0);
r([ C(cc.Node) ], t.prototype, "choosePanal", void 0);
r([ C(cc.Node) ], t.prototype, "chooseContainer", void 0);
r([ C(cc.Node) ], t.prototype, "chooseItem", void 0);
r([ C(cc.Label) ], t.prototype, "gameName", void 0);
r([ C(cc.Node) ], t.prototype, "triangle", void 0);
r([ C(cc.Node) ], t.prototype, "noDataTipNode", void 0);
return t = r([ v ], t);
}(s.default);
o.default = b;
cc._RF.pop();
