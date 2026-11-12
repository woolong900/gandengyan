// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "66318cetH5Oh4Hijtc+Itxr", "GDGameInfo");
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
var i = require("./gContext"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./GDEventKeys"), c = require("./GDEnum"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.selfLevel = null;
t.otherLevel = null;
t.curLevel = null;
t.levelTip = null;
t.levelRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(l.default.data_get_remain, function(t, o) {
e._updateLevel(!0);
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(l.default.playback_data_jipai, function(t, o) {
e._updateLevel(!0);
}, this, s.eOffType.OnDestroy);
this._updateLevel();
};
t.prototype._updateLevel = function(e) {
void 0 === e && (e = !1);
if (a.default.gameInfoGD.status != c.eGDGameStatus.Free) {
this.levelRoot.active = !0;
this.selfLevel.string = this._getLevelValue(a.default.gameInfoGD.selfLevel);
this.otherLevel.string = this._getLevelValue(a.default.gameInfoGD.otherLevel);
if (e) {
this.curLevel.string = this._getLevelValue(a.default.gameInfoGD.bottomCard);
this.levelTip.active = !0;
cc.tween(this.levelTip).set({
opacity: 255
}).to(2, {
opacity: 0
}).start();
}
} else this.levelRoot.active = !1;
};
t.prototype._getLevelValue = function(e) {
var t = e / 10;
return 11 == t ? "J" : 12 == t ? "Q" : 13 == t ? "K" : 1 == t ? "A" : t + "";
};
r([ p(cc.Label) ], t.prototype, "selfLevel", void 0);
r([ p(cc.Label) ], t.prototype, "otherLevel", void 0);
r([ p(cc.Label) ], t.prototype, "curLevel", void 0);
r([ p(cc.Node) ], t.prototype, "levelTip", void 0);
r([ p(cc.Node) ], t.prototype, "levelRoot", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
