// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "42ce1M+xY1GhLjPJRfzOj8c", "GameLogicD7_XS");
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
var r = require("./GameLogicD7"), i = require("./CommonEnum"), a = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.getInstance = function() {
this._instance || (this._instance = new t());
return this._instance;
};
t.prototype.roomParam2Config = function(e, t, o) {
var n, r = [], a = Math.floor(t / 1e8) % 10, s = Math.floor(t / 1e7) % 10, l = Math.floor(t / 1e6) % 10, c = Math.floor(t / 1e5) % 10, u = Math.floor(t / 1e4) % 10;
n = Math.floor(t / 1e3) % 10;
var d = Math.floor(t / 100) % 10, p = Math.floor(t / 10) % 10, f = Math.floor(t / 1) % 10;
4 === e && r.push(1);
8 === e && r.push(2);
12 === e && r.push(3);
16 === e && r.push(22);
0 === l && r.push(18);
1 === l && r.push(19);
2 === l && r.push(20);
3 === l && r.push(21);
1 == c && r.push(17);
1 == u && r.push(16);
1 == s && r.push(23);
1 == a && r.push(200);
0 === f && r.push(4);
1 === f && r.push(5);
2 === f && r.push(6);
3 === f && r.push(7);
0 === p && r.push(8);
1 === p && r.push(9);
0 === d && r.push(10);
1 === d && r.push(11);
2 === d && r.push(12);
3 === d && r.push(13);
return {
index: i.eGameIds.D7XS,
ids: r,
ipLimit: n
};
};
t.prototype.roomConfig2Param = function(e, t) {
var o, n = e.IPStatus() ? "1" : "0", r = "0", i = e.peopleCount();
4 === i && (r = "0");
5 === i && (r = "1");
var a = "" + e.payType(), s = e.isChecked(16) ? "1" : "0", l = e.isChecked(17) ? "1" : "0", c = e.findCheckedIds([ 18, 19, 20, 21 ]), u = c.length > 0 ? "" + e.getValue(c[0]) : "0", d = e.findCheckedIds([ 4, 5, 6, 7 ]), p = "" + e.getValue(d[0]), f = e.isChecked(23) ? "1" : "0";
o = (e.isChecked(200) ? "1" : "0") + f + u + l + s + n + a + r + p;
var h = 1, m = e.gameCount();
4 === m && (h = 1);
8 === m && (h = 2);
12 === m && (h = 3);
16 === m && (h = 4);
var y = parseInt(o);
return {
gameType: e.index,
num: h,
param1: 1,
param2: y,
clubId: t
};
};
t.prototype.roomDetails = function(e) {
var t = "";
t += this.roomTypeDesc(e, "支付：", [ 10, 11, 12, 13 ]);
t += this.roomTypeDesc(e, "\n人数：", [ 8, 9 ]);
t += this.roomTypeDesc(e, "\n底分：", [ 4, 5, 6, 7 ]);
t += this.roomTypeDesc(e, "\n玩法：", [ 17 ]);
t += this.roomTypeDesc(e, "\n功能：", [ 16, 23, 200 ]);
return t += this.roomTypeDesc(e, "\n离线踢人：", [ 18, 19, 20, 21 ]);
};
t.prototype.scoreRuleDesc = function(e) {
return e.listDesc([ 4, 5, 6, 7 ], "");
};
t.prototype.allRuleDesc = function(e, t, o) {
var n = e.gameName(), r = e.listDesc([ 10, 11, 12, 13 ], t);
r = r && "" + t + r;
var i = e.listDesc([ 4, 5, 6, 7 ], t);
i = i && "" + t + i;
var a = e.listDesc([ 17 ], t);
a = a && "" + t + a;
var s = e.listDesc([ 18, 19, 20, 21, 200 ], t);
s = s && "" + t + s;
if (o) {
var l = e.listDesc([ 8, 9 ], t);
return n + (l = l && "" + t + l + "房") + r + i + a + s;
}
return n + r + i + a + s;
};
t.prototype.remainNum = function(e) {
return 12;
};
t.prototype.hideHuDongBiaoqing = function(e) {
return e.isChecked(200);
};
t.prototype.isSupportAKK = function(e) {
return !0;
};
t.prototype.isSupportAKKQQ = function(e) {
return !0;
};
t.prototype.isRealTime = function(e) {
return e.isChecked(16);
};
t.prototype.isAllowWatch = function(e) {
return e.isChecked(23);
};
return t;
}(r.default);
o.default = a;
cc._RF.pop();
