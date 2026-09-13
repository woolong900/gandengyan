// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7925d63/nNCCpqSSTPjssgG", "ClubRenameLayer");
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
var i = e("./BaseComponent"), a = e("./SoundUtils"), s = e("./gContext"), l = e("./ClubControl"), c = e("./ClubMsg"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._name = "";
t.editeBox = null;
return t;
}
t.prototype.start = function() {
this.editeBox.string = l.default.getCurClubData().clubName || "";
this._name = this.editeBox.string;
};
t.prototype.onClickCancel = function() {
a.default.clickBtn();
s.default.uiHelper.remove(this);
};
t.prototype.onClickConfirm = function() {
a.default.clickBtn();
var e = this.editeBox.string;
if ((e = e.trim()).length < 1) s.default.uiHelper.showTip("俱乐部名称不能为空~"); else if (e.length > 8) s.default.uiHelper.showTip("俱乐部名称过长，请重新输入~"); else if (e !== this._name) {
var t = l.default.getCurClubData();
c.default.edit({
id: t.id,
name: e,
emptyRoomLast: t.enableEmptyRoomLast,
roomInvite: t.enableRoomInvite,
closed: t.enableClosed,
playerNodismissRoom: t.enablePlayerNoDismiss,
quitApply: t.enableQuitApply,
antiAddiction: t.enableAntiAddiction,
member_Record: t.enablePersonRecord
}, function(e, t) {
t || 0 === e.res.error || s.default.uiHelper.showTip(e.res.what);
});
s.default.uiHelper.remove(this);
} else s.default.uiHelper.remove(this);
};
r([ p(cc.EditBox) ], t.prototype, "editeBox", void 0);
return t = r([ d ], t);
}(i.default);
o.default = f;
cc._RF.pop();
