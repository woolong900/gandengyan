// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3481cH38FhCsrmtPHFMKF2l", "ChooseChiLayer");
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
var i = require("./CardChooseChi"), a = require("./gContext"), s = require("./GameMsgMJ"), l = require("./BaseComponent"), c = require("./UserData"), u = require("./CommonEnum"), d = require("./OperateConfig"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._list = [];
t.chooseList = [];
t.chiPre2D = null;
t.chiPre3D = null;
return t;
}
t.prototype.findFocus = function(e) {
var t = function(e) {
var t = e[0], o = e[1];
return 2 == Math.abs(t - o) ? (t + o) / 2 : -1;
}, o = t(e[0]);
if (o > 0) return o;
var n = t(e[1]);
if (n > 0) return n;
var r = 0, i = 0;
if (e[0][0] > e[1][0]) {
r = Math.min(e[0][0], e[0][1]);
i = Math.max(e[1][0], e[1][1]);
} else {
r = Math.min(e[1][0], e[1][1]);
i = Math.max(e[0][0], e[0][1]);
}
return t([ r, i ]);
};
t.prototype.setData = function(e) {
this._list = e;
};
t.prototype.draw = function(e) {
var t = this.chooseList[e], o = this._list[e].cards;
t.active = !0;
t.destroyAllChildren();
for (var n = o[0], r = [ o[0], o[1], o[2] ].sort(), a = [ -70, 0, 70 ], s = 0, l = r.length; s < l; s++) {
var d = r[s], p = this.chiPre2D;
c.default.gameView === u.eGameView.View3D && (p = this.chiPre3D);
var f = cc.instantiate(p);
f.getComponent(i.default).setData(d, n === d);
f.x = a[s];
t.addChild(f);
}
};
t.prototype.start = function() {
for (var e = 0; e < this.chooseList.length; e++) this.chooseList[e].active = !1;
e = 0;
for (var t = this._list.length; e < t; e++) this.draw(e);
};
t.prototype.onClick = function(e, t) {
var o = this._list[t], n = [ o.cards[0], o.cards[1], o.cards[2] ];
s.GameMsgMJ.getInstance().operate(d.eOperateCategory.Chi, null, n, function(e, t) {
if (t) a.default.uiHelper.showTip("网络异常~"); else {
e.error < 0 && a.default.uiHelper.showTip("网络异常~");
e.error > 0 && a.default.uiHelper.showTip("" + e.what);
}
});
a.default.uiHelper.remove(this);
};
r([ h(cc.Node) ], t.prototype, "chooseList", void 0);
r([ h(cc.Prefab) ], t.prototype, "chiPre2D", void 0);
r([ h(cc.Prefab) ], t.prototype, "chiPre3D", void 0);
return t = r([ f ], t);
}(l.default);
o.default = m;
cc._RF.pop();
