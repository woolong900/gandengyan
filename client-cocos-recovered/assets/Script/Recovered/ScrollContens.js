// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "071acC4NNFKb67mazKZxGtK", "ScrollContens");
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
var i = cc._decorator, a = i.ccclass, s = (i.property, i.disallowMultiple, i.menu), l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.firstLoad = !0;
return t;
}
t.prototype.onDestroy = function() {
this.clear();
};
t.prototype.onLoad = function() {
this.firstLoad = !0;
};
t.prototype.load = function(e) {
var t = this, o = this.node.getComponent(cc.ScrollView), n = this.node.getChildByName("scrollBar"), r = cc.find("view/content", this.node);
o.elastic = !1;
o.elastic = !1;
this.clear();
var i = this, a = e.count, s = e.cellSize, l = e.viewSize, c = e.column, u = e.row, d = e.padding || {
left: 0,
right: 0,
top: 0,
bottom: 0
}, p = e.spacing || new cc.Vec2(0, 0), f = e.data_cb, h = e.click_cb, m = e.highlight_cb, y = e.unhighlight_cb, g = e.focus, _ = !1;
if (this.firstLoad) {
this.firstLoad = !1;
g || (g = {
index: 0,
time: 0
});
}
var v = 0;
e.focus && e.focus.time && (v = e.focus.time);
var C = function() {
if (n) {
o.elastic = !1;
n.active = !1;
}
};
if (n) {
o.elastic = !0;
n.active = !0;
}
(function() {
for (var e = r.children.length, t = 0; t < e; t++) {
var o = r.children[t];
parseInt(o.name) >= a && o.destroy();
}
})();
if (a <= 0) C(); else {
(h || m || y) && (_ = !0);
this.checkAnchorPoint(r);
var b = !1;
if (c) u = Math.ceil(a / c); else if (u) {
b = !0;
c = Math.ceil(a / u);
} else {
c = 1;
u = Math.ceil(a / c);
}
var D = p.x * (c - 1) + s.width * c + d.left + d.right, S = p.y * (u - 1) + s.height * u + d.top + d.bottom;
if (D <= l.width) {
D = l.width;
o.horizontal && C();
}
if (S <= l.height) {
S = l.height;
o.vertical && C();
}
r.setContentSize(cc.size(D, S));
var w = function(e) {
var o = r.getChildByName("" + e), n = null;
if (o) {
n = o;
_ && t.setTouchCallBack(e, n, m, y, h);
} else {
(n = new cc.Node("" + e)).setContentSize(cc.size(s.width, s.height));
_ && t.setTouchCallBack(e, n, m, y, h);
var i = 0, a = 0;
b ? i = e - ((a = Math.ceil((e + 1) / u)) - 1) * u + 1 : a = e - ((i = Math.ceil((e + 1) / c)) - 1) * c + 1;
var l = s.width / 2 + d.left, g = s.height / 2 + d.top, v = l + (a - 1) * (p.x + s.width), C = 0 - (g + (i - 1) * (p.y + s.height));
n.position = cc.v2(v, C);
r.addChild(n, 0, e.toString());
}
var D = n.getChildByName("__cell__"), S = f(e, D);
if (S.getParent()) ; else {
n.destroyAllChildren();
n.addChild(S, 0, "__cell__");
}
}, O = 0, P = null, I = 0;
if (b) {
O = u * Math.ceil(l.width / (s.width + p.x));
I = ((P = this.getScrollDataH(g, o, u, s.width, D, p.x, d.left)).column_begin - 1) * u;
} else {
O = c * Math.ceil(l.height / (s.height + p.y));
I = ((P = this.getScrollDataV(g, o, c, s.height, S, p.y, d.top)).row_begin - 1) * c;
}
I > a && (I = a);
var R = 0, k = this.ascendingCreateCells(I, O, a - 1, w);
R += k.createCount;
var j = k.index, L = I - 1, U = i.descendingCreateCells(L, O - R, 0, w);
R += U.createCount;
L = U.index;
o.stopAutoScroll();
o.scrollToOffset(P.offset, v);
this.schedule(function() {
var e = void 0;
(function() {
if (0 == R % 2) if (L >= 0) {
e = i.descendingCreateCells(L, 1, 0, w);
L = e.index;
} else {
e = i.ascendingCreateCells(j, 1, a - 1, w);
j = e.index;
} else if (j >= a) {
e = i.descendingCreateCells(L, 1, 0, w);
L = e.index;
} else {
e = i.ascendingCreateCells(j, 1, a - 1, w);
j = e.index;
}
})();
R += e.createCount;
}, 0, a - R, 0);
}
};
t.prototype.clear = function() {
this.unscheduleAllCallbacks();
};
t.prototype.checkAnchorPoint = function(e) {
var t = e.getAnchorPoint();
if (0 === t.x && 1 === t.y) return !0;
throw Error("content anchorPoint must be (0, 1)");
};
t.prototype.setTouchCallBack = function(e, t, o, n, r) {
var i = !1;
t.targetOff(t);
t.on(cc.Node.EventType.TOUCH_START, function(n) {
if (o) if (i) ; else {
i = !0;
o(e, t);
}
}, t);
t.on(cc.Node.EventType.TOUCH_MOVE, function(e) {}, t);
t.on(cc.Node.EventType.TOUCH_END, function(o) {
i = !1;
n && n(e, t);
r && r(e, t);
}, t);
t.on(cc.Node.EventType.TOUCH_CANCEL, function(o) {
i = !1;
n && n(e, t);
}, t);
};
t.prototype.getScrollDataV = function(e, t, o, n, r, i, a) {
var s = 1, l = cc.v2(0, 0);
if (e && (e.percent || e.index || 0 === e.index || 0 === e.percent)) {
var c = e.percent, u = e.index;
if (c && u) throw Error("焦点只能设置某个节点位置：0-count-1，或百分比位置：0-100");
if (c) l.y = r * c / 100; else if (u) {
s = Math.ceil((u + 1) / o);
l.y = 1 === s ? 0 : (i + n) * (s - 1) + a - i / 2;
return {
row_begin: s,
offset: l
};
}
} else l = t.getScrollOffset();
if (l.y - a <= 0) s = 1; else {
((s = Math.ceil((l.y - a) / (n + i))) - 1) * (n + i) + a > l.y && (s -= 1);
s * (n + i) + a - i < l.y && (s += 1);
}
return {
row_begin: s,
offset: l
};
};
t.prototype.getScrollDataH = function(e, t, o, n, r, i, a) {
var s = 1, l = cc.v2(0, 0);
if (e && (e.percent || e.index || 0 === e.index || 0 === e.percent)) {
var c = e.percent, u = e.index;
if (c && u) throw Error("焦点只能设置某个节点位置：0-count-1，或百分比位置：0-100");
if (c) l.x = r * c / 100; else if (u) {
s = Math.ceil((u + 1) / o);
l.x = 1 === s ? 0 : (i + n) * (s - 1) + a - i / 2;
return {
column_begin: s,
offset: l
};
}
} else l = t.getScrollOffset();
var d = -l.x;
l.x = d;
if (d - a <= 0) s = 1; else {
((s = Math.ceil((d - a) / (n + i))) - 1) * (n + i) + a > d && (s -= 1);
s * (n + i) + a - i < d && (s += 1);
}
return {
column_begin: s,
offset: l
};
};
t.prototype.ascendingCreateCells = function(e, t, o, n) {
if (e > o || 0 === t) return {
index: e,
createCount: 0
};
var r = e + t - 1;
r > o && (r = o);
for (var i = r + 1 - e; e <= r; ) {
n(e);
e += 1;
}
return {
index: e,
createCount: i
};
};
t.prototype.descendingCreateCells = function(e, t, o, n) {
if (e < o || 0 === t) return {
index: e,
createCount: 0
};
var r = e - t + 1;
r <= o && (r = o);
for (var i = e - r + 1; e >= r; ) {
n(e);
e -= 1;
}
return {
index: e,
createCount: i
};
};
return t = r([ a, s("自定义脚本/ScrollContent") ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
