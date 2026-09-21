// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3204fDR3KpMD6Mf1fyKDNJV", "D7RoomUtils");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = require("./Singleton"), i = require("./RoomInfoData"), a = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.viewPos2DeskPos = function(e, t) {
null !== t && void 0 !== t || (t = i.default.myAbsolutePos());
return (e + t) % i.default.config.peopleCount();
};
t.prototype.deskPos2ViewPos = function(e, t) {
void 0 !== t && null !== t || (t = i.default.myAbsolutePos());
var o = e - t, n = i.default.config.peopleCount();
return (n + o) % n;
};
t.prototype.uiPos2ViewPos = function(e) {
if (0 === e) return 0;
var t = i.default.config.peopleCount();
if (4 === t) if (i.default.isPlayback()) {
if (0 === e) return 0;
if (1 === e) return 1;
if (4 === e) return 2;
if (5 === e) return 3;
} else {
if (0 === e) return 0;
if (1 === e) return 1;
if (3 === e) return 2;
if (5 === e) return 3;
}
if (5 === t) {
if (0 === e) return 0;
if (1 === e) return 1;
if (2 === e) return 2;
if (4 === e) return 3;
if (5 === e) return 4;
}
return -1;
};
t.prototype.isViewDown = function(e) {
return e > 0 && i.default.players.getByUid(e).pos === i.default.myAbsolutePos();
};
return t;
}(r.default);
o.default = a;
cc._RF.pop();
