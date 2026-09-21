// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f5d6cWsiZlJMZ2hSpCVMX5g", "WatcherViewCtr");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./UserData"), l = require("./SoundUtils"), c = require("./gContext"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._changeTime = 0;
t.allNodes = [];
return t;
}
t.prototype.start = function() {
for (var e = a.default.isWatcher(), t = !([ i.eGameIds.HZHZ, i.eGameIds.LTMJ, i.eGameIds.XSMJ, i.eGameIds.QCHZ, i.eGameIds.MCHZ, i.eGameIds.QCGD, i.eGameIds.QCHH, i.eGameIds.HMMJ, i.eGameIds.DYKKF ].includes(a.default.config.index) && 2 === a.default.config.peopleCount()) && e, o = 0, n = this.allNodes.length; o < n; o++) this.allNodes[o].active = t;
};
t.prototype.onClick = function(e, t) {
l.default.clickBtn();
if (s.default.millisecond - this._changeTime < 1e3) return c.default.uiHelper.showTip("切换视角过于频繁~");
this._changeTime = s.default.millisecond;
if (a.default.config.category() === i.eGameCategort.MJ) {
var o = (a.default.myAbsolutePos() + parseInt(t) + 4) % 4;
a.default.updateWatchPos(o);
}
if (a.default.config.category() === i.eGameCategort.WSK) {
o = (a.default.myAbsolutePos() + parseInt(t) + 4) % 4;
a.default.updateWatchPos(o);
}
};
r([ p(cc.Node) ], t.prototype, "allNodes", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
