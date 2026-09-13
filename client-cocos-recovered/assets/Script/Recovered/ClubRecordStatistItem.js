// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6d866At0gBCpIpDXXLisQ7Q", "ClubRecordStatistItem");
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
var i = require("./Image"), a = require("./gContext"), s = require("./SoundUtils"), l = require("./StringUtils"), c = require("./WindowConfig"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._timeStr = 0;
t.userId = "";
t._data = null;
t.headIm = null;
t.nameLabel = null;
t.idLabel = null;
t.winLabel = null;
t.scoreLabel = null;
t.jushuLabel = null;
return t;
}
t.prototype.setData = function(e, t, o, n) {
this._timeStr = e;
this._data = t;
this.userId = t.uid;
this.nameLabel.string = l.default.clip(t.nickname);
this.idLabel.string = t.uid;
this.winLabel.string = t.winner + "";
this.scoreLabel.string = t.score + "";
this.jushuLabel.string = t.session + "";
this.headIm.url = t.avatarUrl;
this._data._start_date = o;
this._data._end_date = n;
};
t.prototype.start = function() {};
t.prototype.onClickLook = function() {
s.default.clickBtn();
a.default.uiHelper.show(c.eWindowID.ClubRecordDetailLayer, this._timeStr, this._data);
};
r([ p(i.default) ], t.prototype, "headIm", void 0);
r([ p(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ p(cc.Label) ], t.prototype, "idLabel", void 0);
r([ p(cc.Label) ], t.prototype, "winLabel", void 0);
r([ p(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ p(cc.Label) ], t.prototype, "jushuLabel", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
