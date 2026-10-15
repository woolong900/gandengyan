// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4d27bYcCJ9MprvA5ZlzDdjg", "ClubMyRecordItem");
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
var i = require("./gContext"), a = require("./SoundUtils"), s = require("./WindowConfig"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._timeStr = 0;
t.userId = "";
t._data = null;
t.winLabel = null;
t.scoreLabel = null;
t.jushuLabel = null;
t.timeLabel = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this._timeStr = e;
this._data = o;
this.userId = o.uid;
this.timeLabel.string = t;
this.winLabel.string = o.winner + "";
this.scoreLabel.string = o.score + "";
this.jushuLabel.string = o.session + "";
};
t.prototype.start = function() {};
t.prototype.onClickLook = function() {
a.default.clickBtn();
i.default.uiHelper.show(s.eWindowID.ClubRecordDetailLayer, this._timeStr, this._data);
};
r([ u(cc.Label) ], t.prototype, "winLabel", void 0);
r([ u(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ u(cc.Label) ], t.prototype, "jushuLabel", void 0);
r([ u(cc.Label) ], t.prototype, "timeLabel", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
