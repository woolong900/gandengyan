// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6a0ffHumU1GJbP43+/T2ZZW", "ListContentBtn");
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
var i = require("./SoundUtils"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.contentList = [];
t.parent = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.node.children.forEach(function(t, o) {
e.createEvent(t.getChildByName("inactive").getComponent(cc.Button), o);
});
this.updateBtnState(0);
};
t.prototype.setContent = function(e) {
this.contentList = e;
};
t.prototype.setParent = function(e) {
this.parent = e;
};
t.prototype.createEvent = function(e, t) {
var o = new cc.Component.EventHandler();
o.target = this.node;
o.component = "ListContentBtn";
o.handler = "onClick";
o.customEventData = "" + t;
e.clickEvents.push(o);
};
t.prototype.updateBtnState = function(e) {
this.node.children.forEach(function(t, o) {
if (o === e) {
t.getChildByName("inactive").active = !1;
t.getChildByName("active").active = !0;
} else {
t.getChildByName("inactive").active = !0;
t.getChildByName("active").active = !1;
}
});
};
t.prototype.onClick = function(e, t) {
i.default.clickBtn();
this.updateBtnState(parseInt(t));
if (this.contentList.length > 0) {
this.contentList.forEach(function(e) {
e.active = !1;
});
this.contentList[parseInt(t)].active = !0;
}
this.parent && this.parent.dispatchClick(parseInt(t));
};
r([ l ], t.prototype, "contentList", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
