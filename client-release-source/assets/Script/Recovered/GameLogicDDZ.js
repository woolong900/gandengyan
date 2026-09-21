// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3cff5jCLFhFvLf/KqR1UUrU", "GameLogicDDZ");
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
var r = require("./GameLogicBase"), i = require("./CommonEnum"), a = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "玩法：", [ 4, 5, 6, 7 ]);
t += "\n底分：" + e.desc(15);
t += this.roomTypeDesc(e, "\n功能：", [ 19, 20, 200 ]);
t += this.roomTypeDesc(e, "\n支付：", [ 10, 11, 12 ]);
t += this.roomTypeDesc(e, "\n托管：", [ 40, 42, 43, 44, 45 ]);
t += this.roomTypeDesc(e, "\n离线踢人：", [ 31, 32, 33, 34 ]);
return t += this.roomTypeDesc(e, "\n其他：", [ 16, 21, 22 ]);
};
t.prototype.isAutoPass = function(e) {
return !1;
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(42) ? 30 : t.isChecked(43) ? 60 : t.isChecked(44) ? 120 : t.isChecked(45) ? 180 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(42) || (!!e.isChecked(43) || (!!e.isChecked(44) || !!e.isChecked(45)));
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isShowRemain = function(e) {
return !1;
};
t.prototype.allCards = function(e) {
cc.error("必须实现");
return [];
};
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.roomConfig2Param = function(e, t) {
var o = this.configCell2Str(e, [ 10, 11, 12 ], [ "0", "1", "2" ]), n = e.IPStatus() ? "1" : "0", r = this.configCell2Str(e, [ 19 ], [ "1" ]), i = this.configCell2Str(e, [ 20 ], [ "1" ]), a = this.configCell2Str(e, [ 4, 5, 6, 7 ], [ "0", "1", "2", "3" ]), s = this.configCell2Str(e, [ 31, 32, 33, 34 ], [ "0", "1", "2", "3" ]), l = this.configCell2Str(e, [ 200 ], [ "1" ]), c = this.configCell2Str(e, [ 40, 42, 43, 44, 45 ], [ "0", "1", "2", "3", "4" ]), u = this.configCell2Str(e, [ 16 ], [ "1" ]), d = this.configCell2Str(e, [ 21 ], [ "1" ]), p = this.configCell2Str(e, [ 22 ], [ "1" ]), f = e.getValue(15), h = [ 1, 2, 3, 5, 10, 20, 1.5, 2.5 ].indexOf(f) + 1, m = c + l + i + "0" + r + "00" + a + n + s + o, y = parseInt(p + d + u + h), g = parseInt(m), _ = 1, v = e.gameCount();
5 === v && (_ = 1);
10 === v && (_ = 2);
15 === v && (_ = 3);
var C = {
gameType: e.index,
num: _,
param1: y,
param2: g,
clubId: t
};
cc.log("DBZ:jsonData:", C);
return C;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {};
cc.log("roomParam2Config");
var a = Math.floor(t / 1) % 10, s = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = Math.floor(t / 1e4) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e6) % 10, f = (Math.floor(t / 1e7),
Math.floor(t / 1e8) % 10), h = Math.floor(t / 1e9) % 10, m = Math.floor(t / 1e10) % 10, y = Math.floor(o / 1) % 10, g = Math.floor(o / 10) % 10, _ = Math.floor(o / 100) % 10, v = Math.floor(o / 1e3) % 10;
r[15] = [ 1, 2, 3, 5, 10, 20, 1.5, 2.5 ][y - 1];
5 === e && n.push(1);
10 === e && n.push(2);
15 === e && n.push(3);
0 === c && n.push(4);
1 === c && n.push(5);
2 === c && n.push(6);
3 === c && n.push(7);
0 === a && n.push(10);
1 === a && n.push(11);
2 === a && n.push(12);
1 === u && n.push(13);
1 === d && n.push(17);
1 === p && n.push(19);
1 === f && n.push(20);
0 === s && n.push(31);
1 === s && n.push(32);
2 === s && n.push(33);
3 === s && n.push(34);
1 === h && n.push(200);
0 === m && n.push(40);
1 === m && n.push(42);
2 === m && n.push(43);
3 === m && n.push(44);
4 === m && n.push(45);
1 === g && n.push(16);
1 === _ && n.push(21);
1 === v && n.push(22);
n.push(18);
return {
index: i.eGameIds.DDZ,
ids: n,
ipLimit: l,
other: r
};
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = e.listDescDetails([ 4, 5, 6, 7, 10, 11, 12, 16, 21, 22, 200 ], t);
if (o) {
return n + "" + r;
}
return n + r;
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(15);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
return t;
}(r.default);
o.default = a;
cc._RF.pop();
