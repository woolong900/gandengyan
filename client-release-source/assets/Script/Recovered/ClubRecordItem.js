// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "50fa48QEQNKiLnKg5x2Q6Bp", "ClubRecordItem");
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
var i = require("./gContext"), a = require("./StringUtils"), s = require("./ColorUtils"), l = require("./CenterMsg"), c = require("./WindowConfig"), u = require("./UserData"), d = require("./Image"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.page = 1;
t._index = "";
t.infoNode = null;
t.playerInfoNode = null;
t.roomId = null;
t.gameName = null;
t.other = null;
t.timeLabel = null;
t.playersRoot = null;
t.players5Root = null;
t.recordDetailPre = null;
return t;
}
t.prototype.start = function() {};
t.prototype.playerRootNode = function() {
return u.default.gameRecordList.get(this._index).players.length > 4 ? this.players5Root : this.playersRoot;
};
t.prototype.setData = function(e) {
this._index = e;
var t = u.default.gameRecordList.get(this._index);
this.roomId.string = "房号：" + t.roomId;
this.gameName.string = "局数：" + t.gameCount + "/" + t.totalCount;
var o = i.default.gameLogic(t.config.index).allRuleDesc(t.config, "/");
o.length > 42 && (o = o.slice(0, 42));
this.other.string = o + "...";
this.timeLabel.string = a.default.dateFormat(t.time, "yyyy-MM-dd hh:mm");
var n = this.playerRootNode();
n.active = !0;
for (var r = 0; r < t.players.length; r++) for (var l = 0; l < t.players.length - 1; l++) {
var c = t.players[l], p = t.players[l + 1];
if (c.score < p.score) {
var f = p;
t.players[l + 1] = c;
t.players[l] = f;
}
}
var h = n.childrenCount - 1;
for (r = 0; r < h; r++) {
var m = t.players[r], y = n.getChildByName("frame" + r), g = y.getChildByName("avatar").getComponent(d.default), _ = y.getChildByName("name").getComponent(cc.Label), v = y.getChildByName("id").getComponent(cc.Label), C = y.getChildByName("score").getComponent(cc.Label), b = y.getChildByName("frame");
if (m) {
g.url = m.avatarUrl;
_.string = a.default.clip(m.name, 6);
v.string = "" + m.uid;
C.string = "" + m.score;
m.score > 0 ? C.node.color = s.default.C_Score_Win : C.node.color = s.default.C_Score_Lose;
b.active = !0;
} else {
_.string = "";
v.string = "";
C.string = "";
b.active = !1;
}
}
};
t.prototype.adjustWidth = function(e) {
var t = [], o = this.playerRootNode(), n = o.width - 178;
e -= 178;
for (var r = o.children, i = 0, a = r.length - 1; i < a; i++) {
var s = r[i], l = s.width / n * e;
t.push(l);
s.width = l;
}
return t;
};
t.prototype.recordReview = function() {
var e = this, t = this._index;
l.default.getRecordDetails(t, function(o, n, r) {
if (n) i.default.uiHelper.showTipNetError(); else if (0 === o.error) {
u.default.gameRecordList.get(t).setDetailsData(r);
i.default.uiHelper.showWithNode(c.eWindowID.RecordDetail, e.recordDetailPre, t);
} else i.default.uiHelper.showTip(o.what);
});
};
r([ h(cc.Node) ], t.prototype, "infoNode", void 0);
r([ h(cc.Node) ], t.prototype, "playerInfoNode", void 0);
r([ h(cc.Label) ], t.prototype, "roomId", void 0);
r([ h(cc.Label) ], t.prototype, "gameName", void 0);
r([ h(cc.Label) ], t.prototype, "other", void 0);
r([ h(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ h(cc.Node) ], t.prototype, "playersRoot", void 0);
r([ h(cc.Node) ], t.prototype, "players5Root", void 0);
r([ h(cc.Prefab) ], t.prototype, "recordDetailPre", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
