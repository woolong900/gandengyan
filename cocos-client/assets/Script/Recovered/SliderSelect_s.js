// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "527f58Jb3dJtIzHwF4ZoBKq", "SliderSelect_s");
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
var i = cc._decorator, a = i.ccclass, s = i.property, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._listen_b = !1;
t.threshold_n = 1;
return t;
}
t.prototype.onLoad = function() {
this._list_o = this.node.getComponent(cc.ScrollView);
this._content_o = this._list_o.content;
this._layout_o = this._content_o.getComponent(cc.Layout);
this._view_o = this._content_o.parent;
this._last_pos_o = this._content_o.position;
this._event_scrolling();
};
t.prototype.onEnable = function() {
this.listen_b = !0;
this.node.on("scroll-ended", this._event_scroll_ended, this);
this.node.on(cc.Node.EventType.TOUCH_START, this._event_touch_start, this);
this.node.on(cc.Node.EventType.TOUCH_END, this._event_touch_end_and_cancel, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._event_touch_end_and_cancel, this);
};
t.prototype.onDisable = function() {
this.listen_b = !1;
this.node.off("scroll-ended", this._event_scrolling, this);
this.node.off(cc.Node.EventType.TOUCH_START, this._event_touch_start, this);
this.node.off(cc.Node.EventType.TOUCH_END, this._event_touch_end_and_cancel, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._event_touch_end_and_cancel, this);
};
t.prototype._jump_to_item = function(e) {
var t = new cc.Size(this._list_o.node.width, this._content_o.height - this._view_o.height), o = (this._content_o.children[e].y + this._content_o.height * this._content_o.anchorY - .5 * this._view_o.height) / t.height;
if (o > 1 || o < 0) return o;
this.listen_b = !1;
this._list_o.stopAutoScroll();
this._list_o.scrollTo(cc.v2(0, o), this.threshold_n);
return o;
};
t.prototype.update_view = function() {
this._layout_o.updateLayout();
this._event_scrolling();
};
t.prototype._event_scrolling = function() {
if (this._content_o.children.length && !(this._content_o.height <= this._view_o.height)) {
var e, t, o, n, r = new cc.Vec3(), i = new cc.Vec3();
this._content_o.position.sub(this._last_pos_o, r);
this._last_pos_o = this._content_o.position;
if (!(r.y > this.threshold_n)) {
var a = new cc.Size(this._content_o.children[0].width, this._content_o.children[0].height + this._layout_o.spacingY);
this._view_o.parent.convertToWorldSpaceAR(cc.Vec3.ZERO, r);
this._content_o.convertToNodeSpaceAR(r, i);
e = this._content_o.height - this._content_o.anchorY * this._content_o.height;
t = 0;
if ((e -= this._layout_o.paddingTop + this._content_o.children[0].height + .5 * this._layout_o.spacingY) <= i.y) {
this._selected_n = t;
if (this._list_o.isScrolling()) return;
if ((n = this._jump_to_item(t)) >= 0 && n <= 1) return;
}
(o = this._content_o.children.length - 1) < 1 && (o = 1);
for (t = 1; t < o; ++t) if ((e -= a.height) <= i.y) {
for (var s = 0; s < this._content_o.children.length - 1; s++) this._content_o.children[s].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
this._content_o.children[t].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
this._selected_n = t;
if (this._list_o.isScrolling()) return;
if ((n = this._jump_to_item(t)) < 0) {
this._jump_to_item(t - 1);
return;
}
if (n <= 1) return;
}
if ((e -= this._content_o.children[0].height + .5 * this._layout_o.spacingY + this._layout_o.paddingBottom) <= i.y) {
this._selected_n = t;
if (this._list_o.isScrolling()) return;
this._jump_to_item(t);
}
}
}
};
t.prototype._event_scroll_ended = function() {
this.listen_b || (this.listen_b = !0);
this._event_scrolling();
};
t.prototype._event_touch_start = function() {
this.listen_b || (this.listen_b = !0);
};
t.prototype._event_touch_end_and_cancel = function() {
this._list_o.isAutoScrolling() || this._event_scrolling();
};
Object.defineProperty(t.prototype, "selected_n", {
get: function() {
return this._selected_n;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t.prototype, "listen_b", {
get: function() {
return this._listen_b;
},
set: function(e) {
this._listen_b = e;
this._listen_b ? this.node.on("scrolling", this._event_scrolling, this) : this.node.off("scrolling", this._event_scrolling, this);
},
enumerable: !0,
configurable: !0
});
t.prototype.jump_to_0 = function() {
this._list_o.scrollTo(cc.v2(0, 2), this.threshold_n);
this._list_o.setContentPosition(cc.v2(0, 148));
this._selected_n = 2;
};
t.prototype.selectIndex = function() {
return this._selected_n;
};
r([ s({
displayName: "阈值",
type: cc.Float,
min: .1
}) ], t.prototype, "threshold_n", void 0);
return t = r([ a ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
