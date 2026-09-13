// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1e11cL/CG1ET5xe6JXC05kK", "VoiceControl");
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
var i, a = e("./ExVoice"), s = e("./RoomInfoData"), l = e("./CommonEnum"), c = e("./gContext"), u = e("./EventKeys"), d = cc._decorator, p = d.ccclass;
d.property;
(function(e) {
e.eJoinFail = "join_fail";
e.ePermissionClose = "permission_close";
})(i || (i = {}));
var f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._error = null;
t._isOpenSpeaker = !1;
return t;
}
o = t;
t.prototype.onLoad = function() {
if (c.default.gameLogic(s.default.config.index).isRealTime(s.default.config)) {
a.default.setMode(0);
this._joinRoom();
} else a.default.setMode(1);
o._instance = this;
};
t.getInstance = function() {
return this._instance;
};
t.prototype.openSpeaker = function() {
if (this._error === i.eJoinFail) this._joinRoom(); else {
a.default.openSpeaker() && (this.isOpenSpeaker = !0);
}
};
t.prototype.closeSpeaker = function() {
a.default.closeSpeaker() && (this.isOpenSpeaker = !1);
};
Object.defineProperty(t.prototype, "isOpenSpeaker", {
get: function() {
return this._isOpenSpeaker;
},
set: function(e) {
if (this._isOpenSpeaker !== e) {
this._isOpenSpeaker = e;
c.default.eventUtils.emit(u.default.todo_voice_real_time_change);
}
},
enumerable: !0,
configurable: !0
});
t.prototype._joinRoom = function() {
var e = this;
if (!s.default.isPlayback() && !s.default.isWatcher()) {
this._error = "join_fail";
a.default.joinRoom(s.default.roomId, function(t, o) {
if (t === l.eExCallBackMsg.success) {
e._error = null;
a.default.openSpeaker();
a.default.openMic();
e.isOpenSpeaker = !0;
} else e.isOpenSpeaker = !1;
});
}
};
t.prototype.onDestroy = function() {
c.default.gameLogic(s.default.config.index).isRealTime(s.default.config) && a.default.quitRoom(s.default.roomId, function(e, t) {
l.eExCallBackMsg.success;
});
o._instance = null;
};
var o;
t._instance = null;
return t = o = r([ p ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
