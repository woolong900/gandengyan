// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "63a1cOqlSlJBo5+I/yrZxSH", "ClubRecordDetailCell");
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
var i = require("./StringUtils"), a = require("./ColorUtils"), s = require("./gContext"), l = require("./UserData"), c = require("./Image"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = "";
t._width = 0;
t.roomId = null;
t.gameCount = null;
t.other = null;
t.timeLabel = null;
t.playersRoot = null;
t.players5Root = null;
t.recordDetailPre = null;
return t;
}
t.prototype.onLoad = function() {
this.node.width = this._width;
};
t.prototype.playerRootNode = function() {
return l.default.gameRecordList.get(this._index).players.length > 4 ? this.players5Root : this.playersRoot;
};
t.prototype.setData = function(e, t) {
this._index = e;
this._width = t;
var o = l.default.gameRecordList.get(this._index);
this.roomId.string = "房号：" + o.roomId;
this.gameCount.string = "局数：" + o.gameCount + "/" + o.totalCount;
var n = s.default.gameLogic(o.config.index).allRuleDesc(o.config, "/");
n.length > 32 && (n = n.slice(0, 32));
this.other.string = n + "...";
this.timeLabel.string = i.default.dateFormat(o.time, "yyyy-MM-dd hh:mm");
var r = this.playerRootNode();
r.active = !0;
for (var u = 0; u < o.players.length; u++) for (var d = 0; d < o.players.length - 1; d++) {
var p = o.players[d], f = o.players[d + 1];
if (p.score < f.score) {
var h = f;
o.players[d + 1] = p;
o.players[d] = h;
}
}
var m = r.childrenCount;
for (u = 0; u < m; u++) {
var y = o.players[u], g = r.getChildByName("player" + u);
if (y) {
g.active = !0;
g.getChildByName("avatar").getComponent(c.default).url = y.avatarUrl;
g.getChildByName("name").getComponent(cc.Label).string = i.default.clip(y.name, 6);
g.getChildByName("id").getComponent(cc.Label).string = "" + y.uid;
var _ = g.getChildByName("score").getComponent(cc.Label);
_.string = "" + y.score;
y.score > 0 ? _.node.color = a.default.C_Score_Win : _.node.color = a.default.C_Score_Lose;
} else g.active = !1;
}
};
t.prototype.adjustWidth = function(e) {
for (var t = [], o = this.playerRootNode(), n = o.width, r = o.children, i = 0, a = r.length; i < a; i++) {
var s = r[i], l = s.width / n * e;
t.push(l);
s.width = l;
}
return t;
};
t.prototype._otherDesc = function(e, t) {
var o = "";
if (!t) return o;
for (var n = 0, r = t.length; n < r; n++) {
var i = t[n];
o = o + "/" + e.desc(i);
}
return o;
};
r([ p(cc.Label) ], t.prototype, "roomId", void 0);
r([ p(cc.Label) ], t.prototype, "gameCount", void 0);
r([ p(cc.Label) ], t.prototype, "other", void 0);
r([ p(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ p(cc.Node) ], t.prototype, "playersRoot", void 0);
r([ p(cc.Node) ], t.prototype, "players5Root", void 0);
r([ p(cc.Prefab) ], t.prototype, "recordDetailPre", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
