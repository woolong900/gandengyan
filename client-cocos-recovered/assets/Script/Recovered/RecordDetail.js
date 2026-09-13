// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2dbeaTFQT9Mebgm6yXuHbWE", "RecordDetail");
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
var i = e("./RecordDetailCell"), a = e("./BaseComponent"), s = e("./ScrollContens"), l = e("./UserData"), c = e("./StringUtils"), u = e("./Image"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = "";
t.playerRoot = null;
t.totalScoreRoot = null;
t.scrollContent = null;
t.cellPre = null;
return t;
}
t.prototype.setData = function(e) {
var t = this;
this._index = e;
for (var o = l.default.gameRecordList.get(e), n = 0, r = o.players.length; n < 5; n++) {
var a = o.players[n], s = this.playerRoot.getChildByName("avatar_" + n).getComponent(u.default), d = this.playerRoot.getChildByName("playerName_" + n).getComponent(cc.Label), p = this.playerRoot.getChildByName("uid_" + n).getComponent(cc.Label), f = this.totalScoreRoot.getChildByName("totalscore_" + n).getComponent(cc.Label);
if (r > 4) {
if (n > 3) {
this.playerRoot.getChildByName("avatar_" + n).active = !0;
this.playerRoot.getChildByName("playerName_" + n).active = !0;
this.totalScoreRoot.getChildByName("totalscore_" + n).active = !0;
}
this.playerRoot.getChildByName("avatar_" + n).x -= 35 + 26 * n;
this.playerRoot.getChildByName("playerName_" + n).x -= 35 + 26 * n;
this.playerRoot.getChildByName("uid_" + n).x -= 35 + 26 * n;
this.totalScoreRoot.getChildByName("totalscore_" + n).x -= 35 + 26 * n;
}
if (a) {
s.url = a.avatarUrl;
d.string = c.default.clip(a.name, 10);
p.string = "" + a.uid;
f.string = "" + a.score;
} else {
d.string = "";
p.string = "";
f.string = "";
}
}
var h = o.getDetailsData();
this.scrollContent.load({
count: h.count(),
cellSize: new cc.Size(1229, 80),
viewSize: new cc.Size(1229, 452),
spacing: cc.v2(0, -1),
column: 1,
data_cb: function(e, o) {
var n = cc.instantiate(t.cellPre);
n.getComponent(i.default).setData(t._index, e);
return n;
}
});
};
r([ f(cc.Node) ], t.prototype, "playerRoot", void 0);
r([ f(cc.Node) ], t.prototype, "totalScoreRoot", void 0);
r([ f(s.default) ], t.prototype, "scrollContent", void 0);
r([ f(cc.Prefab) ], t.prototype, "cellPre", void 0);
return t = r([ p ], t);
}(a.default);
o.default = h;
cc._RF.pop();
