// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e610fhhTtxGAqloJXx5REPs", "CheckType");
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
var i = e("./CheckCell"), a = e("./gContext"), s = e("./EventKeys"), l = e("./EventUtils"), c = e("./CheckCellStyle1"), u = e("./CreateRoomAssist"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._gameId = 0;
t._ids = [];
t._pos = [];
t.titleLabel = null;
t.layer = null;
t.cellPre = null;
t.cellStyle1Pre = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(s.default.ui_create_room_item_clicked, function() {
e._updatePos();
}, this, l.eOffType.OnDestroy);
};
t.prototype.setData = function(e, t, o) {
var n = this;
this._gameId = e;
var r = 990 * (cc.winSize.width / 1280);
this.node.width = r;
this.titleLabel.node.x = -r / 2 + 70;
var a = u.default.get(e), s = a.sortIds(t);
if (o) for (var l = s.length - 1; l >= 0; l--) {
a.isOnlyHall(s[l]) && s.splice(l, 1);
} else for (l = s.length - 1; l >= 0; l--) {
a.isOnlyClub(s[l]) && s.splice(l, 1);
}
for (l = s.length - 1; l >= 0; l--) {
a.isHide(s[l]) && s.splice(l, 1);
}
var d = s.length, p = a.lineCount(t), f = Math.ceil(d / p), h = 24 * (f - 1) + 38 * f;
this.titleLabel.string = a.typeName(t);
this.layer.height = h;
this.node.height = h + 12;
this._ids = s;
this.scheduleOnce(function() {
for (var o = n.layer.width, r = -o / 2, l = o / p, u = 0, d = s.length; u < d; u++) {
var f = s[u], h = r + u % p * l, m = 62 * Math.floor(u / p) + 19, y = a.cellStyle(f);
if (0 === y) {
var g = cc.instantiate(n.cellPre);
n.layer.addChild(g);
g.x = h;
g.y = -m;
g.getComponent(i.default).setData(e, t, f);
} else if (1 === y) {
g = cc.instantiate(n.cellStyle1Pre);
n.layer.addChild(g);
g.x = h;
g.y = -m;
g.getComponent(c.default).setData(e, t, f);
}
n._pos.push(cc.v2(h, -m));
}
n._updatePos();
});
};
t.prototype._updatePos = function() {
for (var e = u.default.get(this._gameId), t = 0, o = 0, n = this._ids.length; o < n; o++) {
var r = this._ids[o];
if (e.isVisible(r)) {
var i = this._pos[t];
this.layer.children[o].position = i;
t++;
}
}
};
r([ f(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ f(cc.Node) ], t.prototype, "layer", void 0);
r([ f(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "cellStyle1Pre", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
