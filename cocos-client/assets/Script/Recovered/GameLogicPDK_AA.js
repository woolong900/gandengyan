// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "625f9mrfUFCUYTGsv8Y+yIN", "GameLogicPDK_AA");
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
var r = require("./GameLogicPDK"), i = require("./CommonEnum"), a = require("./CommonUtils"), s = [ 8, 9 ], l = [ 4, 5, 6, 7 ], c = [ 24, 25, 26, 27 ], u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {}, s = Math.floor(t / 1) % 10, l = Math.floor(t / 10) % 10, c = Math.floor(t / 100) % 10, u = Math.floor(t / 1e3) % 10, d = Math.floor(t / 1e4) % 10, p = Math.floor(t / 1e5) % 10, f = Math.floor(t / 1e6) % 10, h = Math.floor(t / 1e7) % 10, m = Math.floor(t / 1e8) % 10, y = Math.floor(t / 1e9) % 10, g = Math.floor(t / 1e10) % 10, _ = Math.floor(t / 1e11) % 10, v = Math.floor(t / 1e12) % 10, C = Math.floor(t / 1e13) % 10, b = Math.floor(t / 1e14) % 10, D = Math.floor(t / 1e15) % 10, S = a.default.checkBit(y, 2) ? 1 : 0, w = a.default.checkBit(y, 1) ? 1 : 0, O = a.default.checkBit(g, 4) ? 1 : 0, P = a.default.checkBit(g, 2) ? 1 : 0, I = a.default.checkBit(g, 1) ? 1 : 0, R = a.default.checkBit(D, 1) ? 1 : 0, k = a.default.checkBit(D, 2) ? 1 : 0, j = Math.floor(o / 1e3) % 10, L = Math.floor(o / 1e4) % 10, U = o % 10, N = 0, T = 0;
j - 1 >= 0 && (N = [ .1, .2, .5, 1, 2, 3, 5, 10 ][j - 1]);
L - 1 >= 0 && (T = [ 1.5, 2.5 ][L - 1]);
o < 1e3 && (N = o / 10);
0 == N && (N = T);
var M = 0, E = 0;
if (2 === d) M = 1; else if (3 === d) {
E = 1;
M = 1;
}
1 === M && n.push(200);
5 === e && n.push(1);
10 === e && n.push(2);
15 === e && n.push(3);
0 === l && n.push(4);
1 === l && n.push(5);
2 === l && n.push(6);
3 === l && n.push(7);
1 === s && n.push(8);
0 === s && n.push(9);
1 === c && n.push(10);
0 === c && n.push(11);
r[12] = N;
1 === h && n.push(13);
1 === S && n.push(14);
1 === w && n.push(15);
1 === m && n.push(16);
1 === p && n.push(17);
1 === O && n.push(18);
1 === P && n.push(19);
0 === f && n.push(20);
1 === f && n.push(21);
2 === f && n.push(22);
3 === f && n.push(23);
0 === _ && n.push(24);
1 === _ && n.push(25);
2 === _ && n.push(26);
3 === _ && n.push(27);
0 === u && n.push(28);
1 === u && n.push(29);
2 === u && n.push(30);
3 === u && n.push(31);
1 === C && n.push(32);
1 === I && n.push(33);
1 === v && n.push(40);
1 === b && n.push(34);
1 === R && n.push(35);
1 === k && n.push(41);
0 === U && n.push(44);
1 === U && n.push(45);
2 === U && n.push(46);
3 === U && n.push(47);
4 === U && n.push(48);
5 === U && n.push(49);
return {
index: i.eGameIds.PDKAA,
ids: n,
ipLimit: E,
other: r
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o = this.configCell2Str(e, [ 8, 9 ], [ "1", "0" ]), n = this.configCell2Str(e, [ 4, 5, 6, 7 ], [ "0", "1", "2", "0" ]), r = this.configCell2Str(e, [ 10, 11 ], [ "1", "0" ]), i = this.configCell2Str(e, [ 28, 29, 30, 31 ], [ "0", "1", "2", "3" ]), a = e.IPStatus() ? "1" : "0", s = this.configCell2Str(e, [ 17 ], [ "1" ]), l = this.configCell2Str(e, [ 20, 21, 22, 23 ], [ "0", "1", "2", "3" ]), c = this.configCell2Str(e, [ 13 ], [ "1" ]), u = this.configCell2Str(e, [ 16 ], [ "1" ]), d = this.configCell2Str(e, [ 14 ], [ "1" ]), p = this.configCell2Str(e, [ 15 ], [ "1" ]), f = this.configCell2Str(e, [ 18 ], [ "1" ]), h = this.configCell2Str(e, [ 19 ], [ "1" ]), m = this.configCell2Str(e, [ 33 ], [ "1" ]), y = this.configCell2Str(e, [ 24, 25, 26, 27 ], [ "0", "1", "2", "3" ]), g = this.configCell2Str(e, [ 40 ], [ "1" ]), _ = this.configCell2Str(e, [ 32 ], [ "1" ]), v = this.configCell2Str(e, [ 34 ], [ "1" ]), C = this.configCell2Str(e, [ 35 ], [ "1" ]), b = this.configCell2Str(e, [ 41 ], [ "1" ]), D = this.configCell2Str(e, [ 44, 45, 46, 47, 48, 49 ], [ "0", "1", "2", "3", "4", "5" ]), S = parseInt(d + p, 2), w = parseInt(f + h + m, 2), O = this.configCell2Str(e, [ 200 ], [ "1" ]), P = parseInt(O + a, 2), I = parseInt(b + C, 2), R = e.getValue(12), k = I + v + _ + g + y + w + S + u + c + l + s + P + i + r + n + o, j = [ .1, .2, .5, 1, 2, 3, 5, 10 ].indexOf(R), L = [ 1.5, 2.5 ].indexOf(R), U = j < 0 ? 0 : j + 1, N = L < 0 ? 0 : L + 1;
if (j < 0 && L < 0) {
cc.error("score error! 没有对应分数: ", R);
U = 1;
}
var T = 1e4 * N + 1e3 * U + parseInt(D), M = parseInt(k), E = 1, x = e.gameCount();
5 === x && (E = 1);
10 === x && (E = 2);
15 === x && (E = 3);
var B = {
gameType: e.index,
num: E,
param1: T,
param2: M,
clubId: t
};
cc.log("sendData: ", B);
return B;
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isRealTime = function(e) {
return e.isChecked(40);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(41);
};
t.prototype.scoreRuleDesc = function(e) {
return e.descDetails(12);
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = [ 4, 5, 6, 7, 12, 10, 11, 20, 21, 22, 23, 24, 25, 26, 27, 200 ], i = e.listDescDetails(r, t);
if (o) {
return n + (e.listDescDetails(s, t) + t) + i;
}
return n + i;
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "支付：", l);
t += this.roomTypeDesc(e, "\n人数：", s);
t += this.roomTypeDesc(e, "\n张数：", [ 10, 11 ]);
t += "\n底分：" + e.desc(12);
t += this.roomTypeDesc(e, "\n玩法：", [ 13, 14, 15, 16, 17, 32 ]);
t += this.roomTypeDesc(e, "\n功能：", [ 18, 19, 33, 34, 35, 40, 41, 200 ]);
t += this.roomTypeDesc(e, "\n红桃10扎鸟：", [ 20, 21, 22, 23 ]);
t += this.roomTypeDesc(e, "\n飘分：", [ 24, 25, 26, 27 ]);
t += this.roomTypeDesc(e, "\n托管：", [ 44, 45, 46, 47, 48, 49 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 28, 29, 30, 31 ]);
};
t.prototype.autoGameCountDown = function(t) {
return t.isChecked(45) ? 15 : t.isChecked(46) ? 30 : t.isChecked(47) ? 60 : t.isChecked(48) ? 120 : t.isChecked(49) ? 600 : e.prototype.autoGameCountDown.call(this, t);
};
t.prototype.isAutoGameRoom = function(e) {
return !!e.isChecked(45) || (!!e.isChecked(46) || (!!e.isChecked(47) || (!!e.isChecked(48) || !!e.isChecked(49))));
};
t.prototype.piaoValues = function(e) {
for (var t = e.findCheckedIds(c)[0], o = e.desc(t).split("/"), n = [], r = 0, i = o.length; r < i; r++) {
var a = parseInt(o[r]);
a && n.push(a);
}
return n;
};
t.prototype.isAutoPass = function(e) {
return !1;
};
t.prototype.isBiggerMustPut = function(e) {
return e.isChecked(19);
};
t.prototype.isHei3MustPut = function(e) {
return e.isChecked(17);
};
t.prototype.isShowRemain = function(e) {
return e.isChecked(18);
};
t.prototype.allCards = function(e) {
return e.isChecked(10) ? [ 12, 13, 14, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84, 91, 92, 93, 94, 101, 102, 103, 104, 111, 112, 113, 114, 121, 122, 123, 124, 131, 132, 133, 134 ] : [ 12, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84, 91, 92, 93, 94, 101, 102, 103, 104, 111, 112, 113, 114, 121, 122, 123, 124, 132, 133, 134 ];
};
t.prototype.isZhaNiao = function(e) {
return !e.isChecked(20);
};
t.prototype.descZhaNiao = function(e) {
return e.listDescDetails([ 20, 21, 22, 23 ], "");
};
t.prototype.ruleIsAAABomb = function(e) {
return e.isChecked(13);
};
t.prototype.ruleSupportFour2 = function(e) {
return e.isChecked(14);
};
t.prototype.ruleSupportFour3 = function(e) {
return e.isChecked(15);
};
t.prototype.ruleSupportFollowLackPut = function(e) {
return e.isChecked(16);
};
t.prototype.ruleIsCanNotSplitBomb = function(e) {
return e.isChecked(35);
};
return t;
}(r.default);
o.default = u;
cc._RF.pop();
