// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "14f86Sq+DxD0Kdc1FYhohmF", "PopActivityLayer");
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
var i = require("./BaseComponent"), a = require("./UserData"), s = require("./SoundUtils"), h = require("./GameConfig"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.activity_1 = null;
t.activity_2 = null;
t.activityCloseBtn = null;
t.btnCloseNodeArr = [];
t._startTimes = "";
t._endTimes = "";
t._picUrl = "";
t._btnCloseOffsetX = 32;
t._btnCloseOffsetY = 32;
t._ImgX = 0;
t._ImgY = 0;
t._isStartDW = !1;
t._isTimeUpDW = !1;
return t;
}
t.prototype.onLoad = function() {
this.initFirstPageDialog();
};
t.prototype.initActivityImage = function() {
var e = this;
cc.loader.load(h.default.appDunUrl(this._picUrl), function(t, o) {
if (!t && o) {
var n = e.activity_2;
n.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(o);
n.x = e._ImgX;
n.y = e._ImgY;
var r = n.width / 2, i = n.height / 2;
e.activityCloseBtn.x = r - e._btnCloseOffsetX;
e.activityCloseBtn.y = i - e._btnCloseOffsetY;
e.showActivityView();
} else {
cc.error(t);
e.initActiveLayer();
}
});
};
t.prototype.initFirstPageDialog = function() {
var e = this, t = a.default.activityData;
if (t && null !== t) {
if (!t.picUrl || "" === t.picUrl || !t.startTime || "" === t.startTime || !t.endTime || "" === t.endTime) {
this.initActiveLayer();
return;
}
this._startTimes = t.startTime;
this._endTimes = t.endTime;
this._picUrl = t.picUrl;
this._btnCloseOffsetX = parseInt(t.btnCloseOffsetX) || 32;
this._btnCloseOffsetY = parseInt(t.btnCloseOffsetY) || 32;
var o = parseInt(t.btnCloseImgIndex) || 0;
(o >= this.btnCloseNodeArr.length || o <= 0) && (o = 0);
this.btnCloseNodeArr.forEach(function(t, n) {
if (n === o) {
t.active = !0;
e.activityCloseBtn = t;
} else t.active = !1;
});
this._ImgX = parseInt(t.ImgX) || 0;
this._ImgY = parseInt(t.ImgY) || 0;
var n = new Date(this._startTimes), r = new Date(this._endTimes);
this._isStartDW = a.default.millisecond >= n.getTime();
this._isTimeUpDW = a.default.millisecond >= r.getTime();
this.initActivityImage();
} else this.initActiveLayer();
};
t.prototype.showActivityView = function() {
if (this._isStartDW && !this._isTimeUpDW) {
this.activity_1.active = !1;
this.activity_2.active = !0;
} else this.initActiveLayer();
};
t.prototype.next = function() {
this.initActiveLayer();
};
t.prototype.onClickCloseDw = function() {
s.default.clickBtn();
this.initActiveLayer();
};
t.prototype.initActiveLayer = function() {
this._picUrl = "";
this._isStartDW = !1;
this._isTimeUpDW = !1;
this.activity_2.active = !1;
this.activity_1.active = !0;
};
t.prototype.onDestroy = function() {
a.default.showPopActivity = !1;
};
r([ u(cc.Node) ], t.prototype, "activity_1", void 0);
r([ u(cc.Node) ], t.prototype, "activity_2", void 0);
r([ u(cc.Node) ], t.prototype, "activityCloseBtn", void 0);
r([ u([ cc.Node ]) ], t.prototype, "btnCloseNodeArr", void 0);
return t = r([ c ], t);
}(i.default);
o.default = d;
cc._RF.pop();
