// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4b365xA2tdO8r7rKCxeu8KT", "WSKSingleEndData");
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
var r = e("./RoomInfoData"), i = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.time = 0;
t.endType = 1;
t._players = [];
return t;
}
t.prototype.update = function(e) {
this.time = e.time;
this.endType = e.endType;
this._players = e.players;
};
t.prototype.resultStr = function() {
return 1 === this.endType ? "半\n拱" : 2 === this.endType ? "拱" : 3 === this.endType ? "干\n边" : 4 === this.endType ? "清\n拱" : 5 === this.endType ? "包" : void 0;
};
t.prototype.pickUpScore = function(e) {
return this._players[e].grasp_score || 0;
};
t.prototype.bombScore = function(e) {
return (this._players[e].bomb_score || 0) / r.default.scoreRatio;
};
t.prototype.score = function(e) {
return this._players[e].score / r.default.scoreRatio;
};
return t;
}(e("./Singleton").default);
o.default = i;
cc._RF.pop();
