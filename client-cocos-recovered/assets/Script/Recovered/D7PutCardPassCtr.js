// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b9180fQr8NNjK9hBUYi0ef/", "D7PutCardPassCtr");
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
var i = e("./RoomInfoData"), a = e("./D7GameInfoData"), s = e("./D7PutCardCtr"), l = e("./gContext"), c = e("./D7EventKeys"), u = e("./EventUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.putCardCtr = null;
t.bfNode = null;
t.bjNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.bfNode.active = !1;
this.bjNode.active = !1;
this._reset();
l.default.eventUtils.on([ c.default.data_fan_ok, c.default.data_jiao_ok, c.default.data_status_change, c.default.data_step_change ], function() {
e._reset();
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_fan_guo, function(t, o) {
o.pos === e.putCardCtr.deskPos() && e._showBF();
}, this, u.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_jiao_guo, function(t, o) {
o.pos === e.putCardCtr.deskPos() && e._showBJ();
}, this, u.eOffType.OnDestroy);
};
t.prototype._reset = function() {
this.bfNode.active = !1;
this.bjNode.active = !1;
var e = i.default.gameInfoD7.roundData();
if (e.type === a.eRoundTypeD7.Fan || e.type === a.eRoundTypeD7.Jiao) {
var t = e.lastAction();
if (t && t.state === a.eRoundStateD7.OK) return;
for (var o = e.actions, n = 0; n < o.length; n++) {
var r = o[n];
if (r.state === a.eRoundStateD7.Guo && r.pos === this.putCardCtr.deskPos()) {
e.type === a.eRoundTypeD7.Fan && (this.bfNode.active = !0);
e.type === a.eRoundTypeD7.Jiao && (this.bjNode.active = !0);
}
}
}
};
t.prototype._showBF = function() {
this.bjNode.active = !1;
this.bfNode.active = !0;
var e = this._action();
this.bfNode.runAction(e);
};
t.prototype._showBJ = function() {
this.bfNode.active = !1;
this.bjNode.active = !0;
var e = this._action();
this.bjNode.runAction(e);
};
t.prototype._action = function() {
var e = this, t = cc.callFunc(function() {
e.node.setScale(.6, .6);
}), o = cc.scaleTo(.3, 1).easing(cc.easeSineIn()).easing(cc.easeBackOut());
return cc.sequence(t, o);
};
r([ f(s.default) ], t.prototype, "putCardCtr", void 0);
r([ f(cc.Node) ], t.prototype, "bfNode", void 0);
r([ f(cc.Node) ], t.prototype, "bjNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
