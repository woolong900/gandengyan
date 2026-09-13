// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5ca23Tp6NVKX5yYdn+o+sQ/", "EventUtils");
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
var i, a = e("./EventUtilsComponent"), s = {};
(function(e) {
e[e.OnDisable = 0] = "OnDisable";
e[e.OnDestroy = 1] = "OnDestroy";
e[e.Manual = 2] = "Manual";
})(i = o.eOffType || (o.eOffType = {}));
var l = cc._decorator, c = l.ccclass, u = (l.property, function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._datas = [];
return t;
}
t.prototype.update = function() {
for (var e = 0, t = this._datas.length; e < t; e++) {
var o = this._datas[e].event, n = this._datas[e].param;
this._emit(o, n);
}
this._datas = [];
};
t.prototype.ListenerCount = function(e) {
return (s[e] || []).length || 0;
};
t.prototype._off = function(e, t) {
var o = s[e];
if (o) {
for (var n = 0; n < o.length; n++) {
if (o[n].callback == t) {
o.splice(n, 1);
break;
}
}
o.length < 1 && delete s[e];
}
};
t.prototype.on = function(e, t, o, n) {
void 0 === n && (n = i.OnDisable);
var r = function(e) {
var t = [];
"string" == typeof e ? t.push(e) : t = e;
return t;
}(e);
r.forEach(function(e) {
s[e] || (s[e] = new Array());
s[e].push({
callback: t,
target: o
});
});
var l = {
events: r,
callback: t
};
if (o && o instanceof cc.Component && (n === i.OnDisable || n === i.OnDestroy)) {
var c = o.node.getComponent(a.default);
c || (c = o.node.addComponent(a.default));
if (n === i.OnDisable) if (o.node.activeInHierarchy) c.pushDisableId(l); else {
cc.warn("Event Utils warning: node is not active, event id:", l);
var u = o.node.active;
o.node.active = !0;
c.pushDisableId(l);
o.node.active = u;
} else if (n == i.OnDestroy) if (o.node.activeInHierarchy) c.pushDestroyId(l); else {
cc.warn("Event Utils warning: node is not active, event id:", l);
u = o.node.active;
o.node.active = !0;
c.pushDestroyId(l);
o.node.active = u;
}
}
return l;
};
t.prototype.off = function(e) {
var t = this;
if (e) {
var o = e.events, n = e.callback;
o.forEach(function(e) {
t._off(e, n);
});
}
};
t.prototype.emit = function(e, t) {
this._datas.push({
event: e,
param: t
});
};
t.prototype._emit = function(e, t) {
var o = [], n = s[e];
if (n) {
for (var r = 0; r < n.length; r++) o.push(n[r]);
o.forEach(function(o) {
if (o.target instanceof cc.Component && !o.target.isValid) {
console.warn("事件处理异常：绑定事件的component已无效，但是监听没关闭");
console.warn("event is:" + e);
console.warn("event target is:" + o.target);
} else try {
o.callback.call(o.target, e, t);
} catch (e) {
console.error(e);
}
});
}
};
return t = r([ c ], t);
}(cc.Component));
o.default = u;
cc._RF.pop();
