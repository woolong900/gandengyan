// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "79c971TXG1PB4jIwBxEKDpD", "LocationData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e(e) {
this.longitude = "";
this.latitude = "";
this.country = "";
this.province = "";
this.city = "";
this.citycode = "";
this.district = "";
this.adcode = "";
this.address = "";
if (e) {
this.latitude = e.latitude || this.latitude;
this.longitude = e.longitude || this.longitude;
this.country = e.country || "";
this.province = e.province || "";
this.city = e.city || "";
this.citycode = e.citycode || "";
this.district = e.district || "";
this.adcode = e.adcode || "";
this.address = e.address || "未知";
}
}
e.prototype.desc = function() {
return this.address && this.address.length > 0 ? this.address : "未知";
};
e._radian = function(e) {
return parseFloat(e) * Math.PI / 180;
};
e.distance = function(t, o) {
var n = function(e) {
var t = Math.sin(e / 2);
return t * t;
}, r = e._radian(t.latitude), i = e._radian(o.latitude), a = e._radian(t.longitude) - e._radian(o.longitude), s = n(r - i) + Math.cos(r) * Math.cos(i) * n(a), l = 12756274 * Math.asin(Math.sqrt(s));
return Math.round(l);
};
e.prototype.distanceTo = function(t) {
return e.distance(this, t);
};
return e;
}();
o.default = n;
cc._RF.pop();
