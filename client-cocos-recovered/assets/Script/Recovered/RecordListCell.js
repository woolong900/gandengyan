// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f2135Xfm1VK2r/2vA+GTASx", "RecordListCell");
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
var i = require("./UserData"), a = require("./StringUtils"), s = require("./ColorUtils"), l = require("./gContext"), c = require("./Image"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = "";
t.roomId = null;
t.gameCount = null;
t.other = null;
t.timeLabel = null;
t.playersRoot = null;
t.players5Root = null;
t.recordDetailPre = null;
return t;
}
t.prototype.setData = function(e) {
this._index = e;
var t = i.default.gameRecordList.get(this._index);
this.roomId.string = "房号：" + t.roomId;
this.gameCount.string = "局数：" + t.gameCount + "/" + t.totalCount;
var o = l.default.gameLogic(t.config.index).allRuleDesc(t.config, "/");
o.length > 38 && (o = o.slice(0, 37));
this.other.string = o + "...";
this.timeLabel.string = a.default.dateFormat(t.time, "hh时mm分");
var n = t.playerSortByScore(), r = n.length > 4;
r ? this.players5Root.active = !0 : this.playersRoot.active = !0;
for (var u = 0; u < (n.length < 5 ? 4 : 5); u++) {
var d = n[u], p = r ? this.players5Root.getChildByName("player" + u) : this.playersRoot.getChildByName("player" + u);
if (d) {
p.active = !0;
p.getChildByName("avatar").getComponent(c.default).url = d.avatarUrl;
p.getChildByName("name").getComponent(cc.Label).string = a.default.clip(d.name, 6);
p.getChildByName("id").getComponent(cc.Label).string = "" + d.uid;
var f = p.getChildByName("score").getComponent(cc.Label);
f.string = "" + d.score;
d.score > 0 ? f.node.color = s.default.C_Score_Win : f.node.color = s.default.C_Score_Lose;
} else p.active = !1;
}
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
