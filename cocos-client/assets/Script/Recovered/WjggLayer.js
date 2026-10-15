// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "0f7979A2AdOk69wn66EL8VD", "WjggLayer");
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
var i = require("./BaseComponent"), a = require("./GameConfig"), s = require("./Http"), l = require("./ScrollContens"), c = require("./WjggItem"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.item = null;
t.scrollNode = null;
t.scrollContent = null;
t.noDataRoot = null;
t.timeLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
setTimeout(function() {
e.initMsgData();
}, 1e3);
};
t.prototype.initMsgData = function() {
var e = this, t = a.default.gameBaseUrl() + "/v1/config?key=wjgg_notice", o = [], n = [], r = "";
s.default.get(t, null, function(t, i) {
if (t) cc.error("http login data err:", t); else try {
var a = JSON.parse(i);
if ("0" === a.err_code) {
var s = a.data[0];
s.playerId && (o = s.playerId.split(","));
n && (n = s.playerName.split(","));
r = s.time;
e.timeLabel.string = r || "";
if (o.length < 1 || o.length !== n.length) {
e.scrollNode.active = !1;
e.noDataRoot.active = !0;
e.timeLabel.string = "";
} else {
e.scrollNode.active = !0;
e.noDataRoot.active = !1;
e.timeLabel.node.active = !0;
e.scrollContent.load({
count: o.length,
cellSize: new cc.Size(847, 70),
viewSize: new cc.Size(864, 355),
spacing: cc.v2(0, 0),
column: 1,
data_cb: function(t, r) {
r || (r = cc.instantiate(e.item));
r.getComponent(c.default).setData(t + 1, o[t], n[t]);
return r;
}
});
}
}
} catch (t) {
cc.error("http login data error:", t);
e.node.active = !1;
e.noDataRoot.active = !0;
e.timeLabel.string = "";
}
});
};
r([ p(cc.Prefab) ], t.prototype, "item", void 0);
r([ p(cc.Node) ], t.prototype, "scrollNode", void 0);
r([ p(l.default) ], t.prototype, "scrollContent", void 0);
r([ p(cc.Node) ], t.prototype, "noDataRoot", void 0);
r([ p(cc.Label) ], t.prototype, "timeLabel", void 0);
return t = r([ d ], t);
}(i.default);
o.default = f;
cc._RF.pop();
