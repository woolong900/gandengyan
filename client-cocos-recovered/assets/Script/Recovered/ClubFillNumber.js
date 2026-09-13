// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fafd9W046ROEZ+sxIuu5D/z", "ClubFillNumber");
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
var i = e("./BaseComponent"), a = e("./SoundUtils"), s = e("./EventKeys"), l = e("./WindowConfig"), c = e("./gContext"), u = e("./ClubMsg"), d = e("./ClubControl"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.recordCodeNumArr = [];
t.inputLabel = null;
t._oldInputNum = [];
t._maxNum = 9;
return t;
}
t.prototype.start = function() {};
t.prototype.setData = function(e) {
this._oldInputNum = e;
this.recordCodeNumArr = e;
this.renderNumber();
if (this.recordCodeNumArr.length > 0 && "0" === this.recordCodeNumArr[0]) {
this.recordCodeNumArr = [];
this.inputLabel.string = "";
}
};
t.prototype.onBtnNum = function(e, t) {
a.default.clickBtn();
if (this.recordCodeNumArr.length < this._maxNum + 1 && "-" === this.recordCodeNumArr[0] || this.recordCodeNumArr.length <= this._maxNum && "-" !== this.recordCodeNumArr[0]) {
this.recordCodeNumArr.push(t);
var o = this.recordCodeNumArr.join("");
if (!/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(o) || "00" === o || "-0" === o || "-00" === o || this.inputLabel.string.length > this._maxNum - 1) {
c.default.uiHelper.showTip("无效的数字，请重新输入");
this.recordCodeNumArr.pop();
}
this.renderNumber();
}
};
t.prototype.renderNumber = function() {
var e = this.recordCodeNumArr.join("");
this.inputLabel.string = e;
};
t.prototype.onBtnReset = function() {
a.default.clickBtn();
this.recordCodeNumArr = [];
this.renderNumber();
};
t.prototype.onBtnDelete = function() {
a.default.clickBtn();
this.recordCodeNumArr.pop();
this.renderNumber();
};
t.prototype.onBtnOk = function() {
a.default.clickBtn();
var e = this.inputLabel.string, t = e.split("");
if (t.length > this._maxNum + 1 && "-" === t[0] || t.length > this._maxNum && "-" !== t[0] || t.length > 1 && "0" === t[0]) this.resetInputNum(); else {
c.default.uiHelper.remove(l.eWindowID.ClubFillNumber);
var o = {
id: d.default.getCurClubData().id,
FatigueVal: parseInt(e)
};
u.default.clubEditFatigueVal(o, function(t, o) {
if (0 === t.error) {
c.default.eventUtils.emit(s.default.data_club_fill_number, e);
c.default.eventUtils.emit(s.default.data_club_member_manager_update);
} else c.default.uiHelper.showTip(t.what);
});
}
};
t.prototype.resetInputNum = function() {
c.default.uiHelper.showTip("无效的数字，请重新输入");
this.recordCodeNumArr = [];
this.renderNumber();
};
r([ h(cc.Label) ], t.prototype, "inputLabel", void 0);
return t = r([ f ], t);
}(i.default);
o.default = m;
cc._RF.pop();
