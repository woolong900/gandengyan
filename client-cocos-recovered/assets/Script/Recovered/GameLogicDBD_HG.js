// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e3562QvInhLIb3QEUliEQ5w", "GameLogicDBD_HG");
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
var r = e("./GameLogicDBD"), i = e("./CommonEnum"), a = [ 10, 11, 12 ], s = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {}, a = Math.floor(t / 1) % 10, s = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = Math.floor(t / 1e4) % 10, d = Math.floor(t / 1e5) % 10, p = Math.floor(t / 1e6) % 10, f = Math.floor(t / 1e7) % 10, h = Math.floor(t / 1e8) % 10, m = Math.floor(t / 1e9) % 10, y = (Math.floor(t / 1e10),
Math.floor(t / 1e11) % 10), g = Math.floor(t / 1e12) % 10, _ = Math.floor(t / 1e13) % 10, v = Math.floor(t / 1e14) % 10;
r[15] = [ 1, 2, 3, 5, 10 ][o - 1];
8 === e && n.push(1);
12 === e && n.push(2);
16 === e && n.push(3);
0 === c && n.push(4);
1 === c && n.push(5);
2 === c && n.push(6);
1 === u && n.push(7);
1 === d && n.push(8);
1 === p && n.push(9);
0 === a && n.push(10);
1 === a && n.push(11);
2 === a && n.push(12);
1 === f && n.push(13);
1 === h && n.push(17);
1 === m && n.push(19);
1 === y && n.push(20);
0 === s && n.push(31);
1 === s && n.push(32);
2 === s && n.push(33);
3 === s && n.push(34);
1 === g && n.push(16);
1 === _ && n.push(200);
0 === v && n.push(40);
1 === v && n.push(41);
2 === v && n.push(42);
3 === v && n.push(43);
4 === v && n.push(44);
5 === v && n.push(45);
n.push(18);
return {
index: i.eGameIds.DBDAA,
ids: n,
ipLimit: l,
other: r
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = this.configCell2Str(e, [ 10, 11, 12 ], [ "0", "1", "2" ]), n = e.IPStatus() ? "1" : "0", r = this.configCell2Str(e, [ 19 ], [ "1" ]), i = this.configCell2Str(e, [ 20 ], [ "1" ]), a = this.configCell2Str(e, [ 4, 5, 6 ], [ "0", "1", "2" ]), s = "0" === a ? this.configCell2Str(e, [ 7 ], [ "1" ]) : "0", l = this.configCell2Str(e, [ 8 ], [ "1" ]), c = this.configCell2Str(e, [ 9 ], [ "1" ]), u = this.configCell2Str(e, [ 13 ], [ "1" ]), d = this.configCell2Str(e, [ 17 ], [ "1" ]), p = this.configCell2Str(e, [ 31, 32, 33, 34 ], [ "0", "1", "2", "3" ]), f = this.configCell2Str(e, [ 16 ], [ "1" ]), h = this.configCell2Str(e, [ 200 ], [ "1" ]), m = this.configCell2Str(e, [ 40, 41, 42, 43, 44, 45 ], [ "0", "1", "2", "3", "4", "5" ]), y = e.getValue(15), g = [ 1, 2, 3, 5, 10 ].indexOf(y) + 1, _ = parseInt(m + h + f + i + "0" + r + d + u + c + l + s + a + n + p + o), v = 1, C = e.gameCount();
8 === C && (v = 1);
12 === C && (v = 3);
16 === C && (v = 2);
var b = {
gameType: e.index,
num: v,
param1: g,
param2: _,
clubId: t
};
cc.log("DBD:jsonData:", b);
return b;
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(19);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(20);
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(15);
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = e.listDescDetails([ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 16, 200 ], t);
if (o) {
return n + "" + r;
}
return n + r;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "玩法：", [ 4, 5, 6, 7, 8, 9, 13, 17, 16 ]);
t += "\n底分：" + e.desc(15);
t += this.roomTypeDesc(e, "\n功能：", [ 19, 20, 200 ]);
t += this.roomTypeDesc(e, "\n支付：", a);
t += this.roomTypeDesc(e, "\n托管：", [ 40, 41, 42, 43, 44, 45 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 31, 32, 33, 34 ]);
};
t.prototype.isAutoPass = function(e) {
return !1;
};
t.prototype.isShowRemain = function(e) {
return !0;
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(41) ? 15 : t.isChecked(42) ? 30 : t.isChecked(43) ? 60 : t.isChecked(44) ? 120 : t.isChecked(45) ? 600 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(41) || (!!e.isChecked(42) || (!!e.isChecked(43) || (!!e.isChecked(44) || !!e.isChecked(45))));
};
t.prototype.allCards = function(e) {
return [ 11, 12, 13, 14, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84, 91, 92, 93, 94, 101, 102, 103, 104, 111, 112, 113, 114, 121, 122, 123, 124, 131, 132, 133, 134, 170, 180, 190 ];
};
return t;
}(r.default);
o.default = s;
cc._RF.pop();
