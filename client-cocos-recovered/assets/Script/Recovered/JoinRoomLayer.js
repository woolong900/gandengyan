// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "94f7aXx1jZM2LuKy3CjllMq", "JoinRoomLayer");
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
var i = e("./gContext"), a = e("./BaseComponent"), s = e("./ClubMsg"), l = e("./SoundUtils"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._type = 0;
t.titleLabel = null;
t.input = null;
t.roomNumArr = [];
return t;
}
t.prototype.start = function() {
this.roomNumArr = [];
};
t.prototype.setData = function(e) {
e = e || 0;
this._type = e;
1 === this._type && (this.titleLabel.string = "加入俱乐部");
};
t.prototype.renderNumber = function() {
var e = this;
this.input.getComponentsInChildren(cc.Label).forEach(function(t, o) {
t.node.active = !!e.roomNumArr[o];
e.roomNumArr[o] && (t.string = e.roomNumArr[o]);
});
};
t.prototype.onBtnNum = function(e, t) {
l.default.clickBtn();
if (this.roomNumArr.length < 6) {
this.roomNumArr.push(t);
this.renderNumber();
6 == this.roomNumArr.length && this.joinRoom();
}
};
t.prototype.onBtnReset = function() {
l.default.clickBtn();
this.roomNumArr = [];
this.renderNumber();
};
t.prototype.onBtnDelete = function() {
l.default.clickBtn();
this.roomNumArr.pop();
this.renderNumber();
};
t.prototype.joinRoom = function() {
for (var e = this, t = "", o = 0, n = this.roomNumArr.length; o < n; o++) t += this.roomNumArr[o];
var r = parseInt(t);
if (1 === this._type) {
var a = {
code: t
};
s.default.joinClub(a, function(t, o) {
if (o) ; else if (0 === t.res.error) {
i.default.uiHelper.remove(e);
i.default.msgBox.showOnlyOk("加入俱乐部请求已发送，请耐心等待俱乐部管理处理～");
}
});
} else i.default.gameMsgBase().joinRoom(r, !0);
};
r([ d(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ d(cc.Node) ], t.prototype, "input", void 0);
return t = r([ u ], t);
}(a.default);
o.default = p;
cc._RF.pop();
