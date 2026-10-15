// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a7ccb75/LNMAaVRuwlBrk+Q", "RecordCheck");
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
var i = require("./BaseComponent"), a = require("./SoundUtils"), s = require("./CenterMsg"), l = require("./gContext"), c = require("./PlaybackData"), u = require("./RoomInfoData"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.recordCodeNumArr = [];
t.inputLabel = null;
return t;
}
t.prototype.start = function() {
this.recordCodeNumArr = [];
this.renderNumber();
};
t.prototype.renderNumber = function() {
this.inputLabel.string = this.recordCodeNumArr.join("");
};
t.prototype.onBtnNum = function(e, t) {
a.default.clickBtn();
if (this.recordCodeNumArr.length < 11) {
this.recordCodeNumArr.push(t);
this.renderNumber();
if (11 === this.recordCodeNumArr.length) {
if (u.default.isInRoom()) {
l.default.msgBox.customCheckGameRecord();
return;
}
var o = this.inputLabel.string;
s.default.getRecordPlayback(o, function(e, t) {
t ? l.default.uiHelper.showTipNetError() : 0 === e.error ? c.default.init(0, null) : l.default.uiHelper.showTip(e.what);
});
}
}
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
r([ f(cc.Label) ], t.prototype, "inputLabel", void 0);
return t = r([ p ], t);
}(i.default);
o.default = h;
cc._RF.pop();
