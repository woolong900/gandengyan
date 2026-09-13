// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "59591xZDFdEvq/tjQ5sA8y7", "D7PutCardGiveUpCtr");
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
var i = require("./D7PutCardCtr"), a = require("./RoomInfoData"), s = require("./gContext"), l = require("./D7EventKeys"), c = require("./EventUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.putCardCtr = null;
t.giveUpNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateUI();
s.default.eventUtils.on([ l.default.data_give_up_change, l.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.giveUpNode.active = !1;
var e = a.default.gameInfoD7.giveUpUid;
e > 0 && a.default.players.getByUid(e).pos === this.putCardCtr.deskPos() && (this.giveUpNode.active = !0);
};
r([ p(i.default) ], t.prototype, "putCardCtr", void 0);
r([ p(cc.Node) ], t.prototype, "giveUpNode", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
