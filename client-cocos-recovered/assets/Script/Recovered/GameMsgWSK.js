// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ceadfGlsopECI5fdhAcNErS", "GameMsgWSK");
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
var r = e("./RoomInfoData"), i = e("./SoundUtils"), a = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.ready = function(e) {
i.default.playReady();
if (e) {
var t = r.default.myPlayerData().pos + 1, o = {
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
t.prototype.bao = function() {
this.gameJson({
msghead: "gamehandcard"
}, null, !0);
};
t.prototype.putCard = function(e, t) {
var o = [].concat(e).concat(t), n = {
msghead: "gamesteps",
msgdata: JSON.stringify({
card: o
})
};
this.gameJson(n, null, !0);
};
t.prototype.pass = function() {
this.gameJson({
msghead: "gameguo"
}, null, !0);
};
t.prototype.roundDetails = function() {
this.gameJson({
msghead: "gamecurroundcards"
}, null, !0);
};
t.prototype.showXi = function(e) {
var t = {
msghead: "gameshowxicard",
msgdata: JSON.stringify({
card: e
})
};
this.gameJson(t, null, !0);
};
t._instance = null;
return t;
}(e("./GameMsgBase").default);
o.default = a;
cc._RF.pop();
