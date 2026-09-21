// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8e6eaF3PVlG352fb02b39g4", "BaseHallScene");
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
var i = require("./SoundUtils"), a = require("./ExUtils"), s = require("./StringUtils"), l = require("./CommonEnum"), c = require("./gContext"), u = require("./GameConn"), d = cc._decorator, p = d.ccclass, f = (d.property,
function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
var e = this;
i.default.playMusicMain();
this._checkOnShow();
cc.game.on(cc.game.EVENT_SHOW, function() {
e.scheduleOnce(e._checkOnShow, .1);
}, this);
};
t.prototype._joinRoom = function(e) {
u.default.isOpen() ? c.default.gameMsgBase().joinRoom(e) : this.scheduleOnce(function() {
c.default.gameMsgBase().joinRoom(e);
}, 2);
};
t.prototype._checkOnShow = function() {
var e = this.inviteRoom();
if (e > 0) {
this._joinRoom(e);
a.default.cleanInviteData();
} else a.default.pasteText(function(e, t) {
if (e === l.eExCallBackMsg.success) {
var o = s.default.findRoomId(t);
if (o > 0) {
c.default.msgBox.showNoClose("您确定要进入房间" + o + "?", function() {
c.default.gameMsgBase().joinRoom(o);
});
a.default.cleanCopyText();
}
}
});
};
t.prototype.inviteRoom = function() {
var e = a.default.inviteData();
if (e && e.length > 0) try {
var t = JSON.parse(e).roomId;
return s.default.roomIdStr2Num(t);
} catch (e) {
cc.error(e);
}
return -1;
};
return t = r([ p ], t);
}(cc.Component));
o.default = f;
cc._RF.pop();
