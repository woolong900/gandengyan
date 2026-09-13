// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "cef1cuzazJNS6kgwPAlw39J", "Heartbeat");
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
var i = e("./GameConn"), a = e("./UserData"), s = cc._decorator, l = s.ccclass, c = (s.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._heartbeatDt = 3e3;
t._sendTime = 0;
t._retTime = -1;
t._isSending = !1;
return t;
}
t.prototype.update = function() {
var e = this, t = a.default.millisecond;
if (t - this._retTime > this._heartbeatDt) if (i.default.isOpen()) if (this._isSending) {
var o = t - this._sendTime;
o > 3e3 && i.default.setDelay(o);
o > 2e4 && i.default.reconnect();
} else {
this._isSending = !0;
this._sendTime = t;
i.default.sendMsg(99, null, function(t, o, n) {
n || a.default.syncTime(t.time);
e._isSending = !1;
e._retTime = a.default.millisecond;
i.default.setDelay(e._retTime - e._sendTime);
}, !0);
} else {
this._isSending = !1;
i.default.setDelay(999999);
}
};
return t = r([ l ], t);
}(cc.Component));
o.default = c;
cc._RF.pop();
