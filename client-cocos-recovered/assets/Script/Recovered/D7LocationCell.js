// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "190f47XYgdGjIyN1F9n00cU", "D7LocationCell");
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
var i = e("./LocationData"), a = e("./Image"), s = e("./StringUtils"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.left = null;
t.right = null;
t.distanceLabel = null;
return t;
}
t.prototype.setData = function(e, t) {
this._updateUI(e, t);
};
t.prototype._updateUI = function(e, t) {
this._updateHead(this.left, e);
this._updateHead(this.right, t);
if (e.location && t.location && e.location.latitude && e.location.longitude && t.location.latitude && t.location.longitude) {
var o = i.default.distance(e.location, t.location);
if (o > 1e3) {
var n = (o / 1e3).toFixed(2);
this.distanceLabel.string = n + "千米";
} else this.distanceLabel.string = o + "米";
} else this.distanceLabel.string = "未知";
};
t.prototype._updateHead = function(e, t) {
e.getChildByName("head").getComponent(a.default).url = t.headImg;
e.getChildByName("name").getComponent(cc.Label).string = s.default.clip(t.name);
e.getChildByName("id").getComponent(cc.Label).string = "" + t.uid;
};
r([ u(cc.Node) ], t.prototype, "left", void 0);
r([ u(cc.Node) ], t.prototype, "right", void 0);
r([ u(cc.Label) ], t.prototype, "distanceLabel", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
