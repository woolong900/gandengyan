// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a0a40yYBc9Kc6CL8a9hVkNQ", "MsgTipHelper");
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
var i, a = e("./MsgTipItem"), s = cc._decorator, l = s.ccclass, c = s.property;
(function(e) {
e[e.COMMON = 1] = "COMMON";
e[e.WARNING = 2] = "WARNING";
e[e.RICHTEXT = 3] = "RICHTEXT";
})(i = o.eTipType || (o.eTipType = {}));
var u = function() {
function e(e, t) {
this._tipType = i.COMMON;
this._content = "";
this._tipType = e;
this._content = t;
}
Object.defineProperty(e.prototype, "tipType", {
get: function() {
return this._tipType;
},
set: function(e) {
throw "set tip type error.";
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(e.prototype, "content", {
get: function() {
return this._content;
},
set: function(e) {
throw "set content error.";
},
enumerable: !0,
configurable: !0
});
return e;
}(), d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.itemH = 0;
t.paddingY = 1;
t.itemHeight = 50;
t.speed = .6;
t._tipListData = [];
t._isCreating = !1;
t._uiDirty = !0;
t.strTipRoot = null;
t.itemPre = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.start = function() {
this.itemH = this.itemHeight + this.paddingY;
};
t.prototype.update = function() {
if (this._uiDirty) {
this.refreshUI();
0 == this._tipListData.length && (this._uiDirty = !1);
}
};
t.prototype.resetMoveAction = function() {
for (var e = this.strTipRoot.childrenCount, t = this.strTipRoot.children, o = 0; o < e; o++) {
var n = t[o];
n.stopAllActions();
n.runAction(cc.moveTo(1 * this.speed, 0, this.itemH * (e - o - 1)));
}
};
t.prototype.outAction = function(e) {
var t = cc.delayTime(1.5 * this.speed), o = cc.fadeOut(.5 * this.speed), n = cc.callFunc(function() {
e.destroy();
});
return cc.sequence(t, o, n);
};
t.prototype.createItem = function(e) {
if (this._tipListData.length > 0) {
var t = this._tipListData[0], o = cc.instantiate(this.itemPre);
o.setParent(this.strTipRoot);
o.getComponent(a.default).init(t.tipType, t.content);
var n = o.getChildByName("Node");
n.opacity = 255;
n.runAction(this.outAction(o));
o.position = cc.v2(0, -this.itemH / 2);
this.resetMoveAction();
this._tipListData.shift();
e("ok");
} else e("over");
};
t.prototype.refreshUI = function() {
var e = this;
if (e._isCreating) ; else {
e._isCreating = !0;
var t = function(o) {
"ok" == o && e.createItem(t);
"over" == o && (e._isCreating = !1);
"wait" == o && (e._isCreating = !1);
};
e.createItem(t);
}
};
t.prototype.show = function(e, t) {
var o = new u(t, e);
this._tipListData.push(o);
this._uiDirty = !0;
};
t.prototype.clean = function() {
this._tipListData = [];
this.strTipRoot.destroyAllChildren();
};
r([ c(cc.Node) ], t.prototype, "strTipRoot", void 0);
r([ c(cc.Prefab) ], t.prototype, "itemPre", void 0);
return t = r([ l ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
