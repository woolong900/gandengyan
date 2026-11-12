// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "234e7rIZ3BIo6jsc9du1C0o", "GameMsgGD");
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
var r = require("./GameMsgBase"), i = require("./RoomInfoData"), a = require("./SoundUtils"), s = require("./GDCardUtils"), localRoom = require("./GDStandalone"), l = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.ready = function(e) {
if (i.default.isPlayback()) return;
a.default.playReady();
if (localRoom.default.isActive()) {
localRoom.default.ready();
return;
}
if (e) {
var t = i.default.myPlayerData().pos + 1, o = {
msghead: "gameready",
msgdata: JSON.stringify({
site: t
})
};
this.gameJson(o, null, !0);
} else {
o = {
msghead: "gameready",
msgdata: JSON.stringify({})
};
this.gameJson(o, null, !0);
}
};
t.prototype.jiaodizhu = function(e) {
if (localRoom.default.isActive()) {
var adapter = localRoom.default, token = adapter._roundToken;
// The native button clears selection/clock after sending. Deliver the local
// reply after that cleanup, like the original asynchronous server response.
setTimeout(function() { if (adapter.isActive() && token === adapter._roundToken) adapter.supply(Number(e)); }, 0);
return;
}
var t = {
msghead: "supplycard",
msgdata: JSON.stringify({
card: [ e ]
})
};
this.gameJson(t, null, !0);
};
t.prototype.DoRedouble = function(e) {
var t = {
msghead: "gameredouble",
msgdata: JSON.stringify({
score: e
})
};
this.gameJson(t, null, !0);
};
t.prototype.putCard = function(e, t, o) {
void 0 === o && (o = 0);
if (localRoom.default.isActive()) {
i.default.gameInfoGD.lipaiHandCardsAry = [];
localRoom.default.putCard(e.concat([]), t.concat([]), o);
return;
}
i.default.gameInfoGD.lipaiHandCardsAry = [];
for (var n = [], r = 0; r < e.length; r++) e[r] % 10 == 0 && 170 != e[r] && 180 != e[r] ? n[r] = i.default.gameInfoGD.bottomCard + 3 : n[r] = e[r];
t = n;
var a = new Array();
if (o == s.eGDOneHandType.TongHuaShun) for (var l = e, c = (l = l.filter(function(e) {
return e % 10 != 0;
}))[0] % 10, u = 0; u < e.length; u++) e[u] % 10 == 0 && (e[u] = e[u] + c);
a.push(o);
var d = a.concat(e, t), p = {
msghead: "gamesteps",
msgdata: JSON.stringify({
card: d
})
};
this.gameJson(p, null, !0);
};
t.prototype.findUniqueValues = function(e, t, o) {
for (var n = JSON.parse(JSON.stringify(t)), r = [], i = 0; i < e.length; i++) {
var a = e[i];
if (-1 != n.indexOf(a)) {
var s = -1 != n.indexOf(a);
n.splice(s, 1);
} else {
r.push(i);
if (r.length == o) return r;
}
}
};
t.prototype.pass = function() {
if (localRoom.default.isActive()) {
localRoom.default.pass();
return;
}
this.gameJson({
msghead: "gameguo"
}, null, !0);
};
t._instance = null;
return t;
}(r.default);
o.default = l;
cc._RF.pop();
