// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "47ac1ATec1J44r6WIF/K8uA", "RulesLayer");
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
var i = require("./Loader"), a = require("./BaseComponent"), s = require("./SoundUtils"), l = require("./RoomConfigListData"), c = require("./ScrollContens"), u = require("./RulesBtnCell"), d = require("./RoomConfig"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.scrollNode = null;
t.listNode = null;
t.noDataNode = null;
t.scrollContent = null;
t.btnPre = null;
t.ruleDescRoot = null;
return t;
}
t.prototype.start = function() {
for (var e = this, t = l.default.collectionShow(), o = t.length - 1; o >= 0; o--) 0 === d.default[t[o]].ruleDescImgs.length && t.splice(o, 1);
var n = t.length > 0;
this.scrollNode.active = n;
this.listNode.active = n;
this.noDataNode.active = !n;
if (n) {
var r = [], i = 0;
this.scrollContent.load({
count: t.length,
cellSize: new cc.Size(269, 93),
viewSize: new cc.Size(269, 558),
column: 1,
spacing: cc.v2(0, 2),
data_cb: function(o) {
var n = t[o], a = cc.instantiate(e.btnPre), s = a.getComponent(u.default);
s.setData(n);
i === o && s.check();
r[o] = s;
return a;
},
click_cb: function(o) {
s.default.clickBtn();
if (o !== i) {
r[i].uncheck();
r[i = o].check();
var n = t[i];
e._updateUI(n);
}
}
});
var a = t[i];
this._updateUI(a);
}
};
t.prototype._updateUI = function(e) {
this.ruleDescRoot.destroyAllChildren();
for (var t = l.default.get(e).rulesImgPaths(), o = 0, n = t.length; o < n; o++) {
var r = t[o], a = new cc.Node(), s = a.addComponent(cc.Sprite);
i.default.setImg(r, s);
this.ruleDescRoot.addChild(a);
}
};
r([ h(cc.Node) ], t.prototype, "scrollNode", void 0);
r([ h(cc.Node) ], t.prototype, "listNode", void 0);
r([ h(cc.Node) ], t.prototype, "noDataNode", void 0);
r([ h(c.default) ], t.prototype, "scrollContent", void 0);
r([ h(cc.Prefab) ], t.prototype, "btnPre", void 0);
r([ h(cc.Node) ], t.prototype, "ruleDescRoot", void 0);
return t = r([ f ], t);
}(a.default);
o.default = m;
cc._RF.pop();
