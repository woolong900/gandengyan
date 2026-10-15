// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "bc871XvC7xONIMHViG++Y/P", "D7PlayerFlagCtr");
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
var i = require("./D7PlayerCtr"), a = require("./RoomInfoData"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./EventUtils"), u = require("./EventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.playerCtr = null;
t.flagWhat = null;
t.flagXian = null;
t.flagZhuang = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on([ l.default.data_zhuang_change, l.default.data_firend_change, l.default.data_status_change, u.default.data_player_add ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
this.updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
var e = this.playerCtr.getPlayer();
if (e) {
this.flagZhuang.active = a.default.gameInfoD7.isZhuang(e.uid);
this.flagXian.active = a.default.gameInfoD7.isXian(e.uid);
this.flagZhuang.active || this.flagXian.active ? this.flagWhat.active = !1 : this.flagWhat.active = !0;
}
};
r([ f(i.default) ], t.prototype, "playerCtr", void 0);
r([ f(cc.Node) ], t.prototype, "flagWhat", void 0);
r([ f(cc.Node) ], t.prototype, "flagXian", void 0);
r([ f(cc.Node) ], t.prototype, "flagZhuang", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
