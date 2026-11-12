// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e278akjYHdFIJOH0io05klH", "GameLogicGD");
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
var r = require("./GameLogicBase"), i = require("./CommonEnum"), a = require("./GDCardUtils"), s = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "玩法：", [ 4, 5, 6 ]);
t += "\n底分：" + e.desc(15);
t += this.roomTypeDesc(e, "\n功能：", [ 19, 20, 200 ]);
t += this.roomTypeDesc(e, "\n支付：", [ 10, 11, 12 ]);
t += this.roomTypeDesc(e, "\n托管：", [ 40, 42, 43, 44, 45 ]);
t += this.roomTypeDesc(e, "\n离线踢人：", [ 31, 32, 33, 34 ]);
t += this.roomTypeDesc(e, "\n翻倍：", [ 24, 25, 26, 27 ]);
t += this.roomTypeDesc(e, "\n牌数：", [ 22, 23 ]);
t += this.roomTypeDesc(e, "\n级牌：", [ 50, 51 ]);
return t += this.roomTypeDesc(e, "\n升级：", [ 53, 54 ]);
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
t.prototype.isBoomFB = function(e) {
return e.isChecked(24) ? 0 : e.isChecked(25) ? 1 : e.isChecked(26) ? 2 : e.isChecked(27) ? 3 : -1;
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isShowRemain = function(e) {
return !1;
};
t.prototype.isErRen = function(e) {
return e.isChecked(6);
};
t.prototype.isShowHandNum = function(e) {
return e.isChecked(22);
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
var o = this.configCell2Str(e, [ 10, 11, 12 ], [ "0", "1", "2" ]), n = e.IPStatus() ? "1" : "0", r = this.configCell2Str(e, [ 19 ], [ "1" ]), i = this.configCell2Str(e, [ 20 ], [ "1" ]), a = this.configCell2Str(e, [ 4, 5, 6 ], [ "0", "1", "2" ]), s = this.configCell2Str(e, [ 31, 32, 33, 34 ], [ "0", "1", "2", "3" ]), l = this.configCell2Str(e, [ 200 ], [ "1" ]), c = this.configCell2Str(e, [ 40, 42, 43, 44, 45 ], [ "0", "1", "2", "3", "4" ]), u = this.configCell2Str(e, [ 22, 23 ], [ "0", "1" ]), d = this.configCell2Str(e, [ 24, 25, 26, 27 ], [ "0", "1", "2", "3" ]), p = this.configCell2Str(e, [ 50, 51 ], [ "1", "2" ]), f = this.configCell2Str(e, [ 53, 54 ], [ "1", "2" ]), h = e.getValue(15), m = [ 1, 2, 3, 4, 5 ].indexOf(h) + 1, g = c + l + i + "0" + r + n + s + o, y = parseInt(f + p + d + "1" + u + a + m), _ = parseInt(g), v = 1, C = e.gameCount();
4 === C && (v = 1);
8 === C && (v = 2);
12 === C && (v = 3);
var b = {
gameType: e.index,
num: v,
param1: y,
param2: _,
clubId: t
};
cc.log("DBZ:jsonData:", b);
return b;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n = [], r = {};
cc.log("roomParam2Config");
var a = Math.floor(t / 1) % 10, s = Math.floor(t / 10) % 10, l = Math.floor(t / 100) % 10, c = Math.floor(t / 1e3) % 10, u = (Math.floor(t / 1e4),
Math.floor(t / 1e5) % 10), d = Math.floor(t / 1e6) % 10, p = Math.floor(t / 1e7) % 10, f = Math.floor(o / 1) % 10, h = Math.floor(o / 10) % 10, m = Math.floor(o / 100) % 10, g = (Math.floor(o / 1e3),
Math.floor(o / 1e4) % 10), y = Math.floor(o / 1e5) % 10, _ = Math.floor(o / 1e6) % 10;
r[15] = [ 1, 2, 3, 4, 5 ][f - 1];
4 === e && n.push(1);
8 === e && n.push(2);
12 === e && n.push(3);
0 === h && n.push(4);
1 === h && n.push(5);
2 === h && n.push(6);
0 === a && n.push(10);
1 === a && n.push(11);
2 === a && n.push(12);
0 === m && n.push(22);
1 === m && n.push(23);
1 === c && n.push(19);
1 === u && n.push(20);
0 === s && n.push(31);
1 === s && n.push(32);
2 === s && n.push(33);
3 === s && n.push(34);
0 === g && n.push(24);
1 === g && n.push(25);
2 === g && n.push(26);
3 === g && n.push(27);
1 === d && n.push(200);
0 === p && n.push(40);
1 === p && n.push(42);
2 === p && n.push(43);
3 === p && n.push(44);
4 === p && n.push(45);
1 === y && n.push(50);
2 === y && n.push(51);
1 === _ && n.push(53);
2 === _ && n.push(54);
n.push(18);
return {
index: i.eGameIds.GD,
ids: n,
ipLimit: l,
other: r
};
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName() + t, r = e.listDescDetails([ 4, 5, 6, 10, 11, 12, 22, 23, 24, 25, 26, 27, 50, 51, 53, 54, 200 ], t);
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
t.prototype.newCard = function(e, t) {
if (e === a.GD_XiaoWang) return 170;
if (e === a.GD_DaWang) return 180;
14 === e && (e = 1);
return 10 * e + t;
};
return t;
}(r.default);
o.default = s;
cc._RF.pop();
