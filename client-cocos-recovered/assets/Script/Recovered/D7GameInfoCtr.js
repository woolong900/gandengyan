// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "764750vKYJMtadAtRM4HVeK", "D7GameInfoCtr");
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
var i = require("./RoomInfoData"), a = require("./D7CardUtils"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./D7Enum"), u = require("./EventUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.friendRoot = null;
t.mainRoot = null;
t.rootNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on([ l.default.data_firend_card_change, l.default.data_main_card_change, l.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
if (i.default.gameInfoD7.status !== c.eD7GameStatus.Free) {
this.rootNode.active = !0;
var e = i.default.gameInfoD7.friendCard;
this._showFlag(this.friendRoot, e);
var t = i.default.gameInfoD7.mainCard;
this._showFlag(this.mainRoot, t);
} else this.rootNode.active = !1;
};
t.prototype._showFlag = function(e, t) {
for (var o = 0, n = e.childrenCount; o < n; o++) e.children[o].active = !1;
if (t > 0) {
var r = this._nodeName(t);
e.getChildByName(r).active = !0;
}
};
t.prototype._nodeName = function(e) {
return e === a.D7_DaHua ? "dh" : e === a.D7_XiaoHua ? "xh" : e === a.D7_DaWang ? "dw" : e === a.D7_XiaoWang ? "xw" : "color" + a.default.color(e);
};
r([ f(cc.Node) ], t.prototype, "friendRoot", void 0);
r([ f(cc.Node) ], t.prototype, "mainRoot", void 0);
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
