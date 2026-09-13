// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "db9751F9WRGxJmh32k3qkaf", "MenuDeviceInfo");
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
var i = e("./UserData"), a = e("./StringUtils"), s = e("./ExUtils"), l = e("./GameConn"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.signNodes = [];
t.powerNode = null;
t.timeLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.timeLabel.string = a.default.dateFormat(i.default.millisecond, "hh:mm");
this.schedule(function() {
e.timeLabel.string = a.default.dateFormat(i.default.millisecond, "hh:mm");
}, 1, cc.macro.REPEAT_FOREVER, 0);
this.updatePower();
this.schedule(function() {
e.updatePower();
}, 60, cc.macro.REPEAT_FOREVER, 0);
this.updateSign(this._getSign());
this.schedule(function() {
e.updateSign(e._getSign());
}, 3, cc.macro.REPEAT_FOREVER, 0);
};
t.prototype._getSign = function() {
var e = l.default.getDelay();
return (e < 50 ? 6 : e < 80 ? 5 : e < 150 ? 4 : e < 300 ? 3 : e < 800 ? 2 : 1) - 1;
};
t.prototype.updateSign = function(e) {
for (var t = 0, o = this.signNodes.length; t < o; t++) this.signNodes[t].active = !1;
this.signNodes[e].active = !0;
};
t.prototype.updatePower = function() {
var e = s.default.batteryRate();
this.powerNode.width = 20 * e;
};
r([ d(cc.Node) ], t.prototype, "signNodes", void 0);
r([ d(cc.Node) ], t.prototype, "powerNode", void 0);
r([ d(cc.Label) ], t.prototype, "timeLabel", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
