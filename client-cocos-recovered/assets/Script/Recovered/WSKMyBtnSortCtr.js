// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "043f1mzWNBLmYj2tU7grwlc", "WSKMyBtnSortCtr");
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
var i = e("./RoomInfoData"), a = e("./EventUtils"), s = e("./SoundUtils"), l = e("./gContext"), c = e("./WSKEnum"), u = e("./WSKEventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.btnNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (i.default.isWatcher()) {
this.btnNode.active = !1;
this.enabled = !1;
} else {
l.default.eventUtils.on(u.default.data_status_change, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
l.default.eventUtils.on(u.default.data_round_change, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.btnNode.active = !1;
var e = i.default.gameInfoWSK.status;
if (e === c.eWSKGameStatus.Gameing || e === c.eWSKGameStatus.Calling) {
var t = i.default.myAbsolutePos();
i.default.gameInfoWSK.siteInfos.get(t).handCards.length > 0 && (this.btnNode.active = !0);
}
}
};
t.prototype.onClick = function() {
s.default.clickBtn();
var e = i.default.myAbsolutePos();
i.default.gameInfoWSK.siteInfos.get(e).tidyCards();
l.default.eventUtils.emit(u.default.ui_my_card_tidy);
};
r([ f(cc.Node) ], t.prototype, "btnNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
