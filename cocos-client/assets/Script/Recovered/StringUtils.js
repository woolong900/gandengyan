// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f52aa2mfUJL27S+wLD6Lc3j", "StringUtils");
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
var r = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.dateFormat = function(e, t, o) {
void 0 === o && (o = 8);
Date.prototype.Format = function(e) {
var t = {
"M+": this.getUTCMonth() + 1,
"d+": this.getUTCDate(),
"h+": this.getUTCHours(),
"m+": this.getUTCMinutes(),
"s+": this.getUTCSeconds(),
"q+": Math.floor((this.getUTCMonth() + 3) / 3),
S: this.getUTCMilliseconds()
};
/(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getUTCFullYear() + "").substr(4 - RegExp.$1.length)));
/(E+)/.test(e) && (e = e.replace(RegExp.$1, "week" + this.getUTCDay()));
for (var o in t) new RegExp("(" + o + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? t[o] : ("00" + t[o]).substr(("" + t[o]).length)));
return e;
};
e += 60 * o * 60 * 1e3;
return new Date(e).Format(t);
};
t.timeFormat = function(e, t) {
var o = Math.floor(e / 1e3) % 60, n = Math.floor(e / 6e4) % 60, r = Math.floor(e / 36e5) % 24, i = {
"d+": Math.floor(e / 864e5),
"h+": r,
"m+": n,
"s+": o,
S: e
};
for (var a in i) new RegExp("(" + a + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[a] : ("00" + i[a]).substr(("" + i[a]).length)));
return t;
};
t.intervalTimeFormat = function(e, t) {
var o = Math.floor(e / 60), n = Math.floor(e / 3600), r = Math.floor(e / 86400);
return "m" === t ? o + "" : "h" === t ? n + "" : "d" === t ? r + "" : "";
};
t.int2Str = function(e, t) {
void 0 === t && (t = "");
if (e < 0) return "";
if (0 == e) return "零";
var o = [ "十", "一", "二", "三", "四", "五", "六", "七", "八", "九" ], n = e + "";
if (1 == n.length) return o[e];
if (2 == n.length) {
if (10 == e) return o[0];
var r = "";
r = o[parseInt(n[0])] + t + o[0];
if ("0" == n[1]) ; else {
r = r + t + o[parseInt(n[1])];
}
return r;
}
};
t.clip = function(e, t) {
void 0 === t && (t = 6);
if ("string" != typeof e) return e;
for (var o = 0, n = parseInt("D83C", 16), r = parseInt("D83D", 16), i = parseInt("DF00", 16), a = parseInt("DFFF", 16), s = parseInt("DC00", 16), l = parseInt("DE4F", 16), c = function(e, t, o) {
return NaN !== e && (e >= t && e <= o);
}, u = 0, d = e.length; u < d; u++) {
if (++o > t) return e.substr(0, u) + "..";
var p = e.charCodeAt(u);
if (p === n || p === r) {
var f = e.charCodeAt(u + 1);
(c(f, i, a) || c(f, s, l)) && (u += 1);
}
}
return e;
};
t.replaceSpecialChar = function(e) {
return "string" != typeof e ? e : e = e.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
};
t.roomIdStr2Num = function(e) {
if (e && 6 === e.length) {
var t = parseInt(e);
if (t >= 1e5 && t <= 999999) return t;
}
return -1;
};
t.findRoomId = function(e) {
if (e) {
var t = e.match(/【房间号:(\d{6})】/i);
if (t) {
var o = t[1];
return this.roomIdStr2Num(o);
}
}
return -1;
};
t.strScore = function(e) {
return e >= 0 ? "+" + e : "" + e;
};
t.hideString = function(e) {
if (e) {
var t = e.length;
if (t > 2) {
for (var o = "", n = 0; n < t - 2; n++) o += "*";
return e[0] + o + e[t - 1];
}
}
return "**";
};
t.trimNotcie = function(e, t) {
void 0 === t && (t = 128);
(e = e || "").length > t && (e = e.slice(0, t));
return e = e.replace(/[\r\n]/g, "");
};
t.compareVersion = function(e, t) {
for (var o = e.split("."), n = t.split("."), r = Math.max(o.length, n.length); o.length < r; ) o.push("0");
for (;n.length < r; ) n.push("0");
for (var i = 0; i < r; i++) {
var a = parseInt(o[i]), s = parseInt(n[i]);
if (a > s) return 1;
if (a < s) return -1;
}
return 0;
};
return t;
}(cc.Component);
o.default = r;
cc._RF.pop();
