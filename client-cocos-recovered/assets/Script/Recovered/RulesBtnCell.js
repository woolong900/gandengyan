// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f065alnridP6INHADdC9WS3", "RulesBtnCell");
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
var i = e("./RoomConfigListData"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isCheck = !1;
t._gameId = 0;
t.checkNode = null;
t.uncheckNode = null;
t.checkLabel = null;
t.uncheckLabel = null;
return t;
}
t.prototype.setData = function(e) {
this._gameId = e;
var t = i.default.get(e).gameName();
this.checkLabel.string = t;
this.uncheckLabel.string = t;
};
t.prototype.check = function() {
this._isCheck = !0;
this._updateUI();
};
t.prototype.uncheck = function() {
this._isCheck = !1;
this._updateUI();
};
t.prototype._updateUI = function() {
if (this._isCheck) {
this.checkNode.active = !0;
this.uncheckNode.active = !1;
} else {
this.checkNode.active = !1;
this.uncheckNode.active = !0;
}
};
r([ l(cc.Node) ], t.prototype, "checkNode", void 0);
r([ l(cc.Node) ], t.prototype, "uncheckNode", void 0);
r([ l(cc.Label) ], t.prototype, "checkLabel", void 0);
r([ l(cc.Label) ], t.prototype, "uncheckLabel", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
