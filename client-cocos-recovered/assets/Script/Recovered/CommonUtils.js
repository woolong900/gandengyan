// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "419d2a6egRNG6j1kuDRVQ+M", "CommonUtils");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonEnum"), r = e("./CardUtils"), i = e("./StringUtils"), a = e("./UserData"), s = e("./RoomConfig"), l = function() {
function e() {}
e.isMobile = function(e) {
return e === n.ePlatformType.iOS || e === n.ePlatformType.android;
};
e.clone = function(e) {
var t = null;
if ("object" == typeof e) if (null === e) t = null; else if (e instanceof Array) {
t = [];
for (var o = 0, n = e.length; o < n; o++) t.push(this.clone(e[o]));
} else {
t = {};
for (var r in e) t[r] = this.clone(e[r]);
} else t = e;
return t;
};
e.collection = function(e, t, o) {
var n = [];
if (t) for (var r in e) void 0 === e[r] || null === e[r] ? cc.log("Remove object item please use object.delete[key].") : t(e[r]) && n.push(r); else for (var r in e) void 0 === e[r] || null === e[r] ? cc.log("Remove object item please use object.delete[key].") : n.push(r);
o && n.sort(function(t, n) {
return o(e[t], e[n]);
});
return n;
};
e.compareVersion = function(e, t) {
for (var o = e.split("."), n = t.split("."), r = 0; r < o.length; ++r) {
var i = parseInt(o[r]), a = parseInt(n[r]) || 0;
if (i !== a) return i - a;
}
return n.length > o.length ? -1 : 0;
};
e.objectValue = function(e, t, o) {
if (!e) return o;
var n = e[t];
return void 0 === n || null === n ? o : n;
};
e.b3N2 = function(e) {
return e % 3 == 2;
};
e.valueCount = function(e, t) {
for (var o = 0, n = 0, r = (e = e || []).length; n < r; n++) e[n] === t && o++;
return o;
};
e.bit2MJList = function(e, t) {
for (var o = [], n = 0; n < t; n++) if (n <= 30) {
(e & 1 << n) > 0 ? o.push(r.MJ_BACK_ID) : o.push(r.MJ_HIDE_ID);
} else {
(e / (1 << 30) & 1 << n - 30) > 0 ? o.push(r.MJ_BACK_ID) : o.push(r.MJ_HIDE_ID);
}
return o;
};
e.checkBit = function(e, t) {
return (e & t) > 0;
};
e.todayBeginTime = function() {
var e = i.default.dateFormat(a.default.millisecond, "yyyy/MM/dd");
return new Date(e + " GMT+8").getTime();
};
e.gameNum2Count = function(e, t) {
var o = s.default[e].gameCountMul * t;
3 === t && (s.default[e].index !== n.eGameIds.XSMJ && s.default[e].index !== n.eGameIds.DYKKF && s.default[e].index !== n.eGameIds.DYHH || (o = 12));
return o;
};
e.removeArrayValue = function(e, t) {
for (var o = e.length - 1; o >= 0; o--) if (t === e[o]) {
e.splice(o, 1);
break;
}
return e;
};
e.removeArrayList = function(e, t) {
for (var o = 0, n = t.length; o < n; o++) e = this.removeArrayValue(e, t[o]);
return e;
};
return e;
}();
o.default = l;
cc._RF.pop();
