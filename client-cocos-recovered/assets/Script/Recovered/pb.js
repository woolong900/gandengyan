// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7066dw3bW9IqJq6IR3uC8Lp", "pb");
var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, r = e("./12"), i = r.Reader, a = r.Writer, s = r.util, l = r.roots.default || (r.roots.default = {});
l.pb = function() {
var e = {};
e.eGender = function() {
var e = {}, t = Object.create(e);
t[e[0] = "UNKNOWN"] = 0;
t[e[1] = "MAN"] = 1;
t[e[2] = "WOMAN"] = 2;
return t;
}();
e.SCResult = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.error = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.what = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.error && Object.hasOwnProperty.call(e, "error") && t.uint32(8).int64(e.error);
null != e.what && Object.hasOwnProperty.call(e, "what") && t.uint32(18).string(e.what);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCResult(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.error = e.int64();
break;

case 2:
n.what = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.error && e.hasOwnProperty("error") && !(s.isInteger(e.error) || e.error && s.isInteger(e.error.low) && s.isInteger(e.error.high)) ? "error: integer|Long expected" : null != e.what && e.hasOwnProperty("what") && !s.isString(e.what) ? "what: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCResult) return e;
var t = new l.pb.SCResult();
null != e.error && (s.Long ? (t.error = s.Long.fromValue(e.error)).unsigned = !1 : "string" == typeof e.error ? t.error = parseInt(e.error, 10) : "number" == typeof e.error ? t.error = e.error : "object" === n(e.error) && (t.error = new s.LongBits(e.error.low >>> 0, e.error.high >>> 0).toNumber()));
null != e.what && (t.what = String(e.what));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.error = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.error = t.longs === String ? "0" : 0;
o.what = "";
}
null != e.error && e.hasOwnProperty("error") && ("number" == typeof e.error ? o.error = t.longs === String ? String(e.error) : e.error : o.error = t.longs === String ? s.Long.prototype.toString.call(e.error) : t.longs === Number ? new s.LongBits(e.error.low >>> 0, e.error.high >>> 0).toNumber() : e.error);
null != e.what && e.hasOwnProperty("what") && (o.what = e.what);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.GoodsInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.cardNumber = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.price = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.plus = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).int64(e.id);
null != e.cardNumber && Object.hasOwnProperty.call(e, "cardNumber") && t.uint32(16).int64(e.cardNumber);
null != e.price && Object.hasOwnProperty.call(e, "price") && t.uint32(24).int64(e.price);
null != e.plus && Object.hasOwnProperty.call(e, "plus") && t.uint32(32).int64(e.plus);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.GoodsInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.int64();
break;

case 2:
n.cardNumber = e.int64();
break;

case 3:
n.price = e.int64();
break;

case 4:
n.plus = e.int64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !(s.isInteger(e.id) || e.id && s.isInteger(e.id.low) && s.isInteger(e.id.high)) ? "id: integer|Long expected" : null != e.cardNumber && e.hasOwnProperty("cardNumber") && !(s.isInteger(e.cardNumber) || e.cardNumber && s.isInteger(e.cardNumber.low) && s.isInteger(e.cardNumber.high)) ? "cardNumber: integer|Long expected" : null != e.price && e.hasOwnProperty("price") && !(s.isInteger(e.price) || e.price && s.isInteger(e.price.low) && s.isInteger(e.price.high)) ? "price: integer|Long expected" : null != e.plus && e.hasOwnProperty("plus") && !(s.isInteger(e.plus) || e.plus && s.isInteger(e.plus.low) && s.isInteger(e.plus.high)) ? "plus: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.GoodsInfo) return e;
var t = new l.pb.GoodsInfo();
null != e.id && (s.Long ? (t.id = s.Long.fromValue(e.id)).unsigned = !1 : "string" == typeof e.id ? t.id = parseInt(e.id, 10) : "number" == typeof e.id ? t.id = e.id : "object" === n(e.id) && (t.id = new s.LongBits(e.id.low >>> 0, e.id.high >>> 0).toNumber()));
null != e.cardNumber && (s.Long ? (t.cardNumber = s.Long.fromValue(e.cardNumber)).unsigned = !1 : "string" == typeof e.cardNumber ? t.cardNumber = parseInt(e.cardNumber, 10) : "number" == typeof e.cardNumber ? t.cardNumber = e.cardNumber : "object" === n(e.cardNumber) && (t.cardNumber = new s.LongBits(e.cardNumber.low >>> 0, e.cardNumber.high >>> 0).toNumber()));
null != e.price && (s.Long ? (t.price = s.Long.fromValue(e.price)).unsigned = !1 : "string" == typeof e.price ? t.price = parseInt(e.price, 10) : "number" == typeof e.price ? t.price = e.price : "object" === n(e.price) && (t.price = new s.LongBits(e.price.low >>> 0, e.price.high >>> 0).toNumber()));
null != e.plus && (s.Long ? (t.plus = s.Long.fromValue(e.plus)).unsigned = !1 : "string" == typeof e.plus ? t.plus = parseInt(e.plus, 10) : "number" == typeof e.plus ? t.plus = e.plus : "object" === n(e.plus) && (t.plus = new s.LongBits(e.plus.low >>> 0, e.plus.high >>> 0).toNumber()));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.id = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.id = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.cardNumber = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.cardNumber = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.price = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.price = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.plus = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.plus = t.longs === String ? "0" : 0;
}
null != e.id && e.hasOwnProperty("id") && ("number" == typeof e.id ? o.id = t.longs === String ? String(e.id) : e.id : o.id = t.longs === String ? s.Long.prototype.toString.call(e.id) : t.longs === Number ? new s.LongBits(e.id.low >>> 0, e.id.high >>> 0).toNumber() : e.id);
null != e.cardNumber && e.hasOwnProperty("cardNumber") && ("number" == typeof e.cardNumber ? o.cardNumber = t.longs === String ? String(e.cardNumber) : e.cardNumber : o.cardNumber = t.longs === String ? s.Long.prototype.toString.call(e.cardNumber) : t.longs === Number ? new s.LongBits(e.cardNumber.low >>> 0, e.cardNumber.high >>> 0).toNumber() : e.cardNumber);
null != e.price && e.hasOwnProperty("price") && ("number" == typeof e.price ? o.price = t.longs === String ? String(e.price) : e.price : o.price = t.longs === String ? s.Long.prototype.toString.call(e.price) : t.longs === Number ? new s.LongBits(e.price.low >>> 0, e.price.high >>> 0).toNumber() : e.price);
null != e.plus && e.hasOwnProperty("plus") && ("number" == typeof e.plus ? o.plus = t.longs === String ? String(e.plus) : e.plus : o.plus = t.longs === String ? s.Long.prototype.toString.call(e.plus) : t.longs === Number ? new s.LongBits(e.plus.low >>> 0, e.plus.high >>> 0).toNumber() : e.plus);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.Location = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.longitude = "";
e.prototype.latitude = "";
e.prototype.country = "";
e.prototype.province = "";
e.prototype.city = "";
e.prototype.citycode = "";
e.prototype.district = "";
e.prototype.adcode = "";
e.prototype.address = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.longitude && Object.hasOwnProperty.call(e, "longitude") && t.uint32(10).string(e.longitude);
null != e.latitude && Object.hasOwnProperty.call(e, "latitude") && t.uint32(18).string(e.latitude);
null != e.country && Object.hasOwnProperty.call(e, "country") && t.uint32(26).string(e.country);
null != e.province && Object.hasOwnProperty.call(e, "province") && t.uint32(34).string(e.province);
null != e.city && Object.hasOwnProperty.call(e, "city") && t.uint32(42).string(e.city);
null != e.citycode && Object.hasOwnProperty.call(e, "citycode") && t.uint32(50).string(e.citycode);
null != e.district && Object.hasOwnProperty.call(e, "district") && t.uint32(58).string(e.district);
null != e.adcode && Object.hasOwnProperty.call(e, "adcode") && t.uint32(66).string(e.adcode);
null != e.address && Object.hasOwnProperty.call(e, "address") && t.uint32(74).string(e.address);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.Location(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.longitude = e.string();
break;

case 2:
n.latitude = e.string();
break;

case 3:
n.country = e.string();
break;

case 4:
n.province = e.string();
break;

case 5:
n.city = e.string();
break;

case 6:
n.citycode = e.string();
break;

case 7:
n.district = e.string();
break;

case 8:
n.adcode = e.string();
break;

case 9:
n.address = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.longitude && e.hasOwnProperty("longitude") && !s.isString(e.longitude) ? "longitude: string expected" : null != e.latitude && e.hasOwnProperty("latitude") && !s.isString(e.latitude) ? "latitude: string expected" : null != e.country && e.hasOwnProperty("country") && !s.isString(e.country) ? "country: string expected" : null != e.province && e.hasOwnProperty("province") && !s.isString(e.province) ? "province: string expected" : null != e.city && e.hasOwnProperty("city") && !s.isString(e.city) ? "city: string expected" : null != e.citycode && e.hasOwnProperty("citycode") && !s.isString(e.citycode) ? "citycode: string expected" : null != e.district && e.hasOwnProperty("district") && !s.isString(e.district) ? "district: string expected" : null != e.adcode && e.hasOwnProperty("adcode") && !s.isString(e.adcode) ? "adcode: string expected" : null != e.address && e.hasOwnProperty("address") && !s.isString(e.address) ? "address: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.Location) return e;
var t = new l.pb.Location();
null != e.longitude && (t.longitude = String(e.longitude));
null != e.latitude && (t.latitude = String(e.latitude));
null != e.country && (t.country = String(e.country));
null != e.province && (t.province = String(e.province));
null != e.city && (t.city = String(e.city));
null != e.citycode && (t.citycode = String(e.citycode));
null != e.district && (t.district = String(e.district));
null != e.adcode && (t.adcode = String(e.adcode));
null != e.address && (t.address = String(e.address));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.longitude = "";
o.latitude = "";
o.country = "";
o.province = "";
o.city = "";
o.citycode = "";
o.district = "";
o.adcode = "";
o.address = "";
}
null != e.longitude && e.hasOwnProperty("longitude") && (o.longitude = e.longitude);
null != e.latitude && e.hasOwnProperty("latitude") && (o.latitude = e.latitude);
null != e.country && e.hasOwnProperty("country") && (o.country = e.country);
null != e.province && e.hasOwnProperty("province") && (o.province = e.province);
null != e.city && e.hasOwnProperty("city") && (o.city = e.city);
null != e.citycode && e.hasOwnProperty("citycode") && (o.citycode = e.citycode);
null != e.district && e.hasOwnProperty("district") && (o.district = e.district);
null != e.adcode && e.hasOwnProperty("adcode") && (o.adcode = e.adcode);
null != e.address && e.hasOwnProperty("address") && (o.address = e.address);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PlayerInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.uid = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.headImg = "";
e.prototype.name = "";
e.prototype.ip = "";
e.prototype.location = null;
e.prototype.onLine = !1;
e.prototype.ready = !1;
e.prototype.pos = 0;
e.prototype.score = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.gender = 0;
e.prototype.deal = !1;
e.prototype.isAutoGameing = !1;
e.prototype.isTurn = !1;
e.prototype.isManager = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.uid && Object.hasOwnProperty.call(e, "uid") && t.uint32(8).int64(e.uid);
null != e.headImg && Object.hasOwnProperty.call(e, "headImg") && t.uint32(18).string(e.headImg);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(26).string(e.name);
null != e.ip && Object.hasOwnProperty.call(e, "ip") && t.uint32(34).string(e.ip);
null != e.location && Object.hasOwnProperty.call(e, "location") && l.pb.Location.encode(e.location, t.uint32(42).fork()).ldelim();
null != e.onLine && Object.hasOwnProperty.call(e, "onLine") && t.uint32(48).bool(e.onLine);
null != e.ready && Object.hasOwnProperty.call(e, "ready") && t.uint32(56).bool(e.ready);
null != e.pos && Object.hasOwnProperty.call(e, "pos") && t.uint32(64).int32(e.pos);
null != e.score && Object.hasOwnProperty.call(e, "score") && t.uint32(72).int64(e.score);
null != e.gender && Object.hasOwnProperty.call(e, "gender") && t.uint32(80).int32(e.gender);
null != e.deal && Object.hasOwnProperty.call(e, "deal") && t.uint32(88).bool(e.deal);
null != e.isAutoGameing && Object.hasOwnProperty.call(e, "isAutoGameing") && t.uint32(96).bool(e.isAutoGameing);
null != e.isTurn && Object.hasOwnProperty.call(e, "isTurn") && t.uint32(104).bool(e.isTurn);
null != e.isManager && Object.hasOwnProperty.call(e, "isManager") && t.uint32(112).bool(e.isManager);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.PlayerInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.uid = e.int64();
break;

case 2:
n.headImg = e.string();
break;

case 3:
n.name = e.string();
break;

case 4:
n.ip = e.string();
break;

case 5:
n.location = l.pb.Location.decode(e, e.uint32());
break;

case 6:
n.onLine = e.bool();
break;

case 7:
n.ready = e.bool();
break;

case 8:
n.pos = e.int32();
break;

case 9:
n.score = e.int64();
break;

case 10:
n.gender = e.int32();
break;

case 11:
n.deal = e.bool();
break;

case 12:
n.isAutoGameing = e.bool();
break;

case 13:
n.isTurn = e.bool();
break;

case 14:
n.isManager = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.uid && e.hasOwnProperty("uid") && !(s.isInteger(e.uid) || e.uid && s.isInteger(e.uid.low) && s.isInteger(e.uid.high))) return "uid: integer|Long expected";
if (null != e.headImg && e.hasOwnProperty("headImg") && !s.isString(e.headImg)) return "headImg: string expected";
if (null != e.name && e.hasOwnProperty("name") && !s.isString(e.name)) return "name: string expected";
if (null != e.ip && e.hasOwnProperty("ip") && !s.isString(e.ip)) return "ip: string expected";
if (null != e.location && e.hasOwnProperty("location")) {
var t = l.pb.Location.verify(e.location);
if (t) return "location." + t;
}
if (null != e.onLine && e.hasOwnProperty("onLine") && "boolean" != typeof e.onLine) return "onLine: boolean expected";
if (null != e.ready && e.hasOwnProperty("ready") && "boolean" != typeof e.ready) return "ready: boolean expected";
if (null != e.pos && e.hasOwnProperty("pos") && !s.isInteger(e.pos)) return "pos: integer expected";
if (null != e.score && e.hasOwnProperty("score") && !(s.isInteger(e.score) || e.score && s.isInteger(e.score.low) && s.isInteger(e.score.high))) return "score: integer|Long expected";
if (null != e.gender && e.hasOwnProperty("gender")) switch (e.gender) {
default:
return "gender: enum value expected";

case 0:
case 1:
case 2:
}
return null != e.deal && e.hasOwnProperty("deal") && "boolean" != typeof e.deal ? "deal: boolean expected" : null != e.isAutoGameing && e.hasOwnProperty("isAutoGameing") && "boolean" != typeof e.isAutoGameing ? "isAutoGameing: boolean expected" : null != e.isTurn && e.hasOwnProperty("isTurn") && "boolean" != typeof e.isTurn ? "isTurn: boolean expected" : null != e.isManager && e.hasOwnProperty("isManager") && "boolean" != typeof e.isManager ? "isManager: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.PlayerInfo) return e;
var t = new l.pb.PlayerInfo();
null != e.uid && (s.Long ? (t.uid = s.Long.fromValue(e.uid)).unsigned = !1 : "string" == typeof e.uid ? t.uid = parseInt(e.uid, 10) : "number" == typeof e.uid ? t.uid = e.uid : "object" === n(e.uid) && (t.uid = new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber()));
null != e.headImg && (t.headImg = String(e.headImg));
null != e.name && (t.name = String(e.name));
null != e.ip && (t.ip = String(e.ip));
if (null != e.location) {
if ("object" !== n(e.location)) throw TypeError(".pb.PlayerInfo.location: object expected");
t.location = l.pb.Location.fromObject(e.location);
}
null != e.onLine && (t.onLine = Boolean(e.onLine));
null != e.ready && (t.ready = Boolean(e.ready));
null != e.pos && (t.pos = 0 | e.pos);
null != e.score && (s.Long ? (t.score = s.Long.fromValue(e.score)).unsigned = !1 : "string" == typeof e.score ? t.score = parseInt(e.score, 10) : "number" == typeof e.score ? t.score = e.score : "object" === n(e.score) && (t.score = new s.LongBits(e.score.low >>> 0, e.score.high >>> 0).toNumber()));
switch (e.gender) {
case "UNKNOWN":
case 0:
t.gender = 0;
break;

case "MAN":
case 1:
t.gender = 1;
break;

case "WOMAN":
case 2:
t.gender = 2;
}
null != e.deal && (t.deal = Boolean(e.deal));
null != e.isAutoGameing && (t.isAutoGameing = Boolean(e.isAutoGameing));
null != e.isTurn && (t.isTurn = Boolean(e.isTurn));
null != e.isManager && (t.isManager = Boolean(e.isManager));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.uid = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.uid = t.longs === String ? "0" : 0;
o.headImg = "";
o.name = "";
o.ip = "";
o.location = null;
o.onLine = !1;
o.ready = !1;
o.pos = 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.score = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.score = t.longs === String ? "0" : 0;
o.gender = t.enums === String ? "UNKNOWN" : 0;
o.deal = !1;
o.isAutoGameing = !1;
o.isTurn = !1;
o.isManager = !1;
}
null != e.uid && e.hasOwnProperty("uid") && ("number" == typeof e.uid ? o.uid = t.longs === String ? String(e.uid) : e.uid : o.uid = t.longs === String ? s.Long.prototype.toString.call(e.uid) : t.longs === Number ? new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber() : e.uid);
null != e.headImg && e.hasOwnProperty("headImg") && (o.headImg = e.headImg);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.ip && e.hasOwnProperty("ip") && (o.ip = e.ip);
null != e.location && e.hasOwnProperty("location") && (o.location = l.pb.Location.toObject(e.location, t));
null != e.onLine && e.hasOwnProperty("onLine") && (o.onLine = e.onLine);
null != e.ready && e.hasOwnProperty("ready") && (o.ready = e.ready);
null != e.pos && e.hasOwnProperty("pos") && (o.pos = e.pos);
null != e.score && e.hasOwnProperty("score") && ("number" == typeof e.score ? o.score = t.longs === String ? String(e.score) : e.score : o.score = t.longs === String ? s.Long.prototype.toString.call(e.score) : t.longs === Number ? new s.LongBits(e.score.low >>> 0, e.score.high >>> 0).toNumber() : e.score);
null != e.gender && e.hasOwnProperty("gender") && (o.gender = t.enums === String ? l.pb.eGender[e.gender] : e.gender);
null != e.deal && e.hasOwnProperty("deal") && (o.deal = e.deal);
null != e.isAutoGameing && e.hasOwnProperty("isAutoGameing") && (o.isAutoGameing = e.isAutoGameing);
null != e.isTurn && e.hasOwnProperty("isTurn") && (o.isTurn = e.isTurn);
null != e.isManager && e.hasOwnProperty("isManager") && (o.isManager = e.isManager);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PaiDunPointer = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.pos = 0;
e.prototype.index = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.pos && Object.hasOwnProperty.call(e, "pos") && t.uint32(8).int32(e.pos);
null != e.index && Object.hasOwnProperty.call(e, "index") && t.uint32(16).int32(e.index);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.PaiDunPointer(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.pos = e.int32();
break;

case 2:
n.index = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.pos && e.hasOwnProperty("pos") && !s.isInteger(e.pos) ? "pos: integer expected" : null != e.index && e.hasOwnProperty("index") && !s.isInteger(e.index) ? "index: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.PaiDunPointer) return e;
var t = new l.pb.PaiDunPointer();
null != e.pos && (t.pos = 0 | e.pos);
null != e.index && (t.index = 0 | e.index);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.pos = 0;
o.index = 0;
}
null != e.pos && e.hasOwnProperty("pos") && (o.pos = e.pos);
null != e.index && e.hasOwnProperty("index") && (o.index = e.index);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PbClubRoom = function() {
function e(e) {
this.players = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.status = 0;
e.prototype.owner = null;
e.prototype.gameType = 0;
e.prototype.num = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.players = s.emptyArray;
e.prototype.curPlayers = 0;
e.prototype.maxPlayers = 0;
e.prototype.curStep = 0;
e.prototype.maxStep = 0;
e.prototype.schemeId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(16).uint32(e.status);
null != e.owner && Object.hasOwnProperty.call(e, "owner") && l.pb.PbClubRoom.Player.encode(e.owner, t.uint32(26).fork()).ldelim();
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(32).uint32(e.gameType);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(40).uint32(e.num);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(48).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(56).uint64(e.param2);
if (null != e.players && e.players.length) for (var o = 0; o < e.players.length; ++o) l.pb.PbClubRoom.Player.encode(e.players[o], t.uint32(66).fork()).ldelim();
null != e.curPlayers && Object.hasOwnProperty.call(e, "curPlayers") && t.uint32(72).uint32(e.curPlayers);
null != e.maxPlayers && Object.hasOwnProperty.call(e, "maxPlayers") && t.uint32(80).uint32(e.maxPlayers);
null != e.curStep && Object.hasOwnProperty.call(e, "curStep") && t.uint32(88).uint32(e.curStep);
null != e.maxStep && Object.hasOwnProperty.call(e, "maxStep") && t.uint32(96).uint32(e.maxStep);
null != e.schemeId && Object.hasOwnProperty.call(e, "schemeId") && t.uint32(104).uint32(e.schemeId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.PbClubRoom(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.status = e.uint32();
break;

case 3:
n.owner = l.pb.PbClubRoom.Player.decode(e, e.uint32());
break;

case 4:
n.gameType = e.uint32();
break;

case 5:
n.num = e.uint32();
break;

case 6:
n.param1 = e.uint64();
break;

case 7:
n.param2 = e.uint64();
break;

case 8:
n.players && n.players.length || (n.players = []);
n.players.push(l.pb.PbClubRoom.Player.decode(e, e.uint32()));
break;

case 9:
n.curPlayers = e.uint32();
break;

case 10:
n.maxPlayers = e.uint32();
break;

case 11:
n.curStep = e.uint32();
break;

case 12:
n.maxStep = e.uint32();
break;

case 13:
n.schemeId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id)) return "id: integer expected";
if (null != e.status && e.hasOwnProperty("status") && !s.isInteger(e.status)) return "status: integer expected";
if (null != e.owner && e.hasOwnProperty("owner")) {
if (o = l.pb.PbClubRoom.Player.verify(e.owner)) return "owner." + o;
}
if (null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType)) return "gameType: integer expected";
if (null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num)) return "num: integer expected";
if (null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high))) return "param1: integer|Long expected";
if (null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high))) return "param2: integer|Long expected";
if (null != e.players && e.hasOwnProperty("players")) {
if (!Array.isArray(e.players)) return "players: array expected";
for (var t = 0; t < e.players.length; ++t) {
var o;
if (o = l.pb.PbClubRoom.Player.verify(e.players[t])) return "players." + o;
}
}
return null != e.curPlayers && e.hasOwnProperty("curPlayers") && !s.isInteger(e.curPlayers) ? "curPlayers: integer expected" : null != e.maxPlayers && e.hasOwnProperty("maxPlayers") && !s.isInteger(e.maxPlayers) ? "maxPlayers: integer expected" : null != e.curStep && e.hasOwnProperty("curStep") && !s.isInteger(e.curStep) ? "curStep: integer expected" : null != e.maxStep && e.hasOwnProperty("maxStep") && !s.isInteger(e.maxStep) ? "maxStep: integer expected" : null != e.schemeId && e.hasOwnProperty("schemeId") && !s.isInteger(e.schemeId) ? "schemeId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.PbClubRoom) return e;
var t = new l.pb.PbClubRoom();
null != e.id && (t.id = e.id >>> 0);
null != e.status && (t.status = e.status >>> 0);
if (null != e.owner) {
if ("object" !== n(e.owner)) throw TypeError(".pb.PbClubRoom.owner: object expected");
t.owner = l.pb.PbClubRoom.Player.fromObject(e.owner);
}
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
if (e.players) {
if (!Array.isArray(e.players)) throw TypeError(".pb.PbClubRoom.players: array expected");
t.players = [];
for (var o = 0; o < e.players.length; ++o) {
if ("object" !== n(e.players[o])) throw TypeError(".pb.PbClubRoom.players: object expected");
t.players[o] = l.pb.PbClubRoom.Player.fromObject(e.players[o]);
}
}
null != e.curPlayers && (t.curPlayers = e.curPlayers >>> 0);
null != e.maxPlayers && (t.maxPlayers = e.maxPlayers >>> 0);
null != e.curStep && (t.curStep = e.curStep >>> 0);
null != e.maxStep && (t.maxStep = e.maxStep >>> 0);
null != e.schemeId && (t.schemeId = e.schemeId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.players = []);
if (t.defaults) {
o.id = 0;
o.status = 0;
o.owner = null;
o.gameType = 0;
o.num = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
o.curPlayers = 0;
o.maxPlayers = 0;
o.curStep = 0;
o.maxStep = 0;
o.schemeId = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
null != e.owner && e.hasOwnProperty("owner") && (o.owner = l.pb.PbClubRoom.Player.toObject(e.owner, t));
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
if (e.players && e.players.length) {
o.players = [];
for (var r = 0; r < e.players.length; ++r) o.players[r] = l.pb.PbClubRoom.Player.toObject(e.players[r], t);
}
null != e.curPlayers && e.hasOwnProperty("curPlayers") && (o.curPlayers = e.curPlayers);
null != e.maxPlayers && e.hasOwnProperty("maxPlayers") && (o.maxPlayers = e.maxPlayers);
null != e.curStep && e.hasOwnProperty("curStep") && (o.curStep = e.curStep);
null != e.maxStep && e.hasOwnProperty("maxStep") && (o.maxStep = e.maxStep);
null != e.schemeId && e.hasOwnProperty("schemeId") && (o.schemeId = e.schemeId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Player = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.code = "";
e.prototype.nickname = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(18).string(e.code);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(26).string(e.nickname);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.PbClubRoom.Player(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.code = e.string();
break;

case 3:
n.nickname = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.PbClubRoom.Player) return e;
var t = new l.pb.PbClubRoom.Player();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.code && (t.code = String(e.code));
null != e.nickname && (t.nickname = String(e.nickname));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.code = "";
o.nickname = "";
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.SCPing = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.time = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.time && Object.hasOwnProperty.call(e, "time") && t.uint32(8).int64(e.time);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCPing(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.time = e.int64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.time && e.hasOwnProperty("time") && !(s.isInteger(e.time) || e.time && s.isInteger(e.time.low) && s.isInteger(e.time.high)) ? "time: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCPing) return e;
var t = new l.pb.SCPing();
null != e.time && (s.Long ? (t.time = s.Long.fromValue(e.time)).unsigned = !1 : "string" == typeof e.time ? t.time = parseInt(e.time, 10) : "number" == typeof e.time ? t.time = e.time : "object" === n(e.time) && (t.time = new s.LongBits(e.time.low >>> 0, e.time.high >>> 0).toNumber()));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) if (s.Long) {
var n = new s.Long(0, 0, !1);
o.time = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.time = t.longs === String ? "0" : 0;
null != e.time && e.hasOwnProperty("time") && ("number" == typeof e.time ? o.time = t.longs === String ? String(e.time) : e.time : o.time = t.longs === String ? s.Long.prototype.toString.call(e.time) : t.longs === Number ? new s.LongBits(e.time.low >>> 0, e.time.high >>> 0).toNumber() : e.time);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSLogin = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.token = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.token && Object.hasOwnProperty.call(e, "token") && t.uint32(10).string(e.token);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSLogin(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.token = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.token && e.hasOwnProperty("token") && !s.isString(e.token) ? "token: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSLogin) return e;
var t = new l.pb.CSLogin();
null != e.token && (t.token = String(e.token));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.token = "");
null != e.token && e.hasOwnProperty("token") && (o.token = e.token);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCLogin = function() {
function e(e) {
this.info = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.uid = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.sex = 0;
e.prototype.roomId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.cardNum = 0;
e.prototype.ip = "";
e.prototype.info = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.uid && Object.hasOwnProperty.call(e, "uid") && t.uint32(16).int64(e.uid);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(26).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(34).string(e.nickname);
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(40).int32(e.sex);
null != e.roomId && Object.hasOwnProperty.call(e, "roomId") && t.uint32(48).int64(e.roomId);
null != e.cardNum && Object.hasOwnProperty.call(e, "cardNum") && t.uint32(56).int32(e.cardNum);
null != e.ip && Object.hasOwnProperty.call(e, "ip") && t.uint32(66).string(e.ip);
if (null != e.info && e.info.length) for (var o = 0; o < e.info.length; ++o) l.pb.SCLogin.guide.encode(e.info[o], t.uint32(74).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCLogin(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.uid = e.int64();
break;

case 3:
n.avatarUrl = e.string();
break;

case 4:
n.nickname = e.string();
break;

case 5:
n.sex = e.int32();
break;

case 6:
n.roomId = e.int64();
break;

case 7:
n.cardNum = e.int32();
break;

case 8:
n.ip = e.string();
break;

case 9:
n.info && n.info.length || (n.info = []);
n.info.push(l.pb.SCLogin.guide.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.uid && e.hasOwnProperty("uid") && !(s.isInteger(e.uid) || e.uid && s.isInteger(e.uid.low) && s.isInteger(e.uid.high))) return "uid: integer|Long expected";
if (null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl)) return "avatarUrl: string expected";
if (null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname)) return "nickname: string expected";
if (null != e.sex && e.hasOwnProperty("sex")) switch (e.sex) {
default:
return "sex: enum value expected";

case 0:
case 1:
case 2:
}
if (null != e.roomId && e.hasOwnProperty("roomId") && !(s.isInteger(e.roomId) || e.roomId && s.isInteger(e.roomId.low) && s.isInteger(e.roomId.high))) return "roomId: integer|Long expected";
if (null != e.cardNum && e.hasOwnProperty("cardNum") && !s.isInteger(e.cardNum)) return "cardNum: integer expected";
if (null != e.ip && e.hasOwnProperty("ip") && !s.isString(e.ip)) return "ip: string expected";
if (null != e.info && e.hasOwnProperty("info")) {
if (!Array.isArray(e.info)) return "info: array expected";
for (var t = 0; t < e.info.length; ++t) {
var o;
if (o = l.pb.SCLogin.guide.verify(e.info[t])) return "info." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCLogin) return e;
var t = new l.pb.SCLogin();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCLogin.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.uid && (s.Long ? (t.uid = s.Long.fromValue(e.uid)).unsigned = !1 : "string" == typeof e.uid ? t.uid = parseInt(e.uid, 10) : "number" == typeof e.uid ? t.uid = e.uid : "object" === n(e.uid) && (t.uid = new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber()));
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
switch (e.sex) {
case "UNKNOWN":
case 0:
t.sex = 0;
break;

case "MAN":
case 1:
t.sex = 1;
break;

case "WOMAN":
case 2:
t.sex = 2;
}
null != e.roomId && (s.Long ? (t.roomId = s.Long.fromValue(e.roomId)).unsigned = !1 : "string" == typeof e.roomId ? t.roomId = parseInt(e.roomId, 10) : "number" == typeof e.roomId ? t.roomId = e.roomId : "object" === n(e.roomId) && (t.roomId = new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber()));
null != e.cardNum && (t.cardNum = 0 | e.cardNum);
null != e.ip && (t.ip = String(e.ip));
if (e.info) {
if (!Array.isArray(e.info)) throw TypeError(".pb.SCLogin.info: array expected");
t.info = [];
for (var o = 0; o < e.info.length; ++o) {
if ("object" !== n(e.info[o])) throw TypeError(".pb.SCLogin.info: object expected");
t.info[o] = l.pb.SCLogin.guide.fromObject(e.info[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.info = []);
if (t.defaults) {
o.res = null;
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.uid = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.uid = t.longs === String ? "0" : 0;
o.avatarUrl = "";
o.nickname = "";
o.sex = t.enums === String ? "UNKNOWN" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.roomId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.roomId = t.longs === String ? "0" : 0;
o.cardNum = 0;
o.ip = "";
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.uid && e.hasOwnProperty("uid") && ("number" == typeof e.uid ? o.uid = t.longs === String ? String(e.uid) : e.uid : o.uid = t.longs === String ? s.Long.prototype.toString.call(e.uid) : t.longs === Number ? new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber() : e.uid);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.sex && e.hasOwnProperty("sex") && (o.sex = t.enums === String ? l.pb.eGender[e.sex] : e.sex);
null != e.roomId && e.hasOwnProperty("roomId") && ("number" == typeof e.roomId ? o.roomId = t.longs === String ? String(e.roomId) : e.roomId : o.roomId = t.longs === String ? s.Long.prototype.toString.call(e.roomId) : t.longs === Number ? new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber() : e.roomId);
null != e.cardNum && e.hasOwnProperty("cardNum") && (o.cardNum = e.cardNum);
null != e.ip && e.hasOwnProperty("ip") && (o.ip = e.ip);
if (e.info && e.info.length) {
o.info = [];
for (var r = 0; r < e.info.length; ++r) o.info[r] = l.pb.SCLogin.guide.toObject(e.info[r], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.guide = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.guideKey = 0;
e.prototype.guideContent = "";
e.prototype.culGuideSteps = 0;
e.prototype.maxGuideSteps = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.guideKey && Object.hasOwnProperty.call(e, "guideKey") && t.uint32(8).uint32(e.guideKey);
null != e.guideContent && Object.hasOwnProperty.call(e, "guideContent") && t.uint32(18).string(e.guideContent);
null != e.culGuideSteps && Object.hasOwnProperty.call(e, "culGuideSteps") && t.uint32(24).uint32(e.culGuideSteps);
null != e.maxGuideSteps && Object.hasOwnProperty.call(e, "maxGuideSteps") && t.uint32(32).uint32(e.maxGuideSteps);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCLogin.guide(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.guideKey = e.uint32();
break;

case 2:
n.guideContent = e.string();
break;

case 3:
n.culGuideSteps = e.uint32();
break;

case 4:
n.maxGuideSteps = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.guideKey && e.hasOwnProperty("guideKey") && !s.isInteger(e.guideKey) ? "guideKey: integer expected" : null != e.guideContent && e.hasOwnProperty("guideContent") && !s.isString(e.guideContent) ? "guideContent: string expected" : null != e.culGuideSteps && e.hasOwnProperty("culGuideSteps") && !s.isInteger(e.culGuideSteps) ? "culGuideSteps: integer expected" : null != e.maxGuideSteps && e.hasOwnProperty("maxGuideSteps") && !s.isInteger(e.maxGuideSteps) ? "maxGuideSteps: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCLogin.guide) return e;
var t = new l.pb.SCLogin.guide();
null != e.guideKey && (t.guideKey = e.guideKey >>> 0);
null != e.guideContent && (t.guideContent = String(e.guideContent));
null != e.culGuideSteps && (t.culGuideSteps = e.culGuideSteps >>> 0);
null != e.maxGuideSteps && (t.maxGuideSteps = e.maxGuideSteps >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.guideKey = 0;
o.guideContent = "";
o.culGuideSteps = 0;
o.maxGuideSteps = 0;
}
null != e.guideKey && e.hasOwnProperty("guideKey") && (o.guideKey = e.guideKey);
null != e.guideContent && e.hasOwnProperty("guideContent") && (o.guideContent = e.guideContent);
null != e.culGuideSteps && e.hasOwnProperty("culGuideSteps") && (o.culGuideSteps = e.culGuideSteps);
null != e.maxGuideSteps && e.hasOwnProperty("maxGuideSteps") && (o.maxGuideSteps = e.maxGuideSteps);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.SCIdVerifyInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.realName = "";
e.prototype.idCard = "";
e.prototype.giveCard = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.realName && Object.hasOwnProperty.call(e, "realName") && t.uint32(18).string(e.realName);
null != e.idCard && Object.hasOwnProperty.call(e, "idCard") && t.uint32(26).string(e.idCard);
null != e.giveCard && Object.hasOwnProperty.call(e, "giveCard") && t.uint32(32).uint32(e.giveCard);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCIdVerifyInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.realName = e.string();
break;

case 3:
n.idCard = e.string();
break;

case 4:
n.giveCard = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.realName && e.hasOwnProperty("realName") && !s.isString(e.realName) ? "realName: string expected" : null != e.idCard && e.hasOwnProperty("idCard") && !s.isString(e.idCard) ? "idCard: string expected" : null != e.giveCard && e.hasOwnProperty("giveCard") && !s.isInteger(e.giveCard) ? "giveCard: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCIdVerifyInfo) return e;
var t = new l.pb.SCIdVerifyInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCIdVerifyInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.realName && (t.realName = String(e.realName));
null != e.idCard && (t.idCard = String(e.idCard));
null != e.giveCard && (t.giveCard = e.giveCard >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.realName = "";
o.idCard = "";
o.giveCard = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.realName && e.hasOwnProperty("realName") && (o.realName = e.realName);
null != e.idCard && e.hasOwnProperty("idCard") && (o.idCard = e.idCard);
null != e.giveCard && e.hasOwnProperty("giveCard") && (o.giveCard = e.giveCard);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSIdVerify = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.realName = "";
e.prototype.idCard = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.realName && Object.hasOwnProperty.call(e, "realName") && t.uint32(10).string(e.realName);
null != e.idCard && Object.hasOwnProperty.call(e, "idCard") && t.uint32(18).string(e.idCard);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSIdVerify(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.realName = e.string();
break;

case 2:
n.idCard = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.realName && e.hasOwnProperty("realName") && !s.isString(e.realName) ? "realName: string expected" : null != e.idCard && e.hasOwnProperty("idCard") && !s.isString(e.idCard) ? "idCard: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSIdVerify) return e;
var t = new l.pb.CSIdVerify();
null != e.realName && (t.realName = String(e.realName));
null != e.idCard && (t.idCard = String(e.idCard));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.realName = "";
o.idCard = "";
}
null != e.realName && e.hasOwnProperty("realName") && (o.realName = e.realName);
null != e.idCard && e.hasOwnProperty("idCard") && (o.idCard = e.idCard);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCIdVerify = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCIdVerify(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCIdVerify) return e;
var t = new l.pb.SCIdVerify();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCIdVerify.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCBindInviteCodeInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.username = "";
e.prototype.inviteCode = "";
e.prototype.mobile = "";
e.prototype.giveCard = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.username && Object.hasOwnProperty.call(e, "username") && t.uint32(18).string(e.username);
null != e.inviteCode && Object.hasOwnProperty.call(e, "inviteCode") && t.uint32(26).string(e.inviteCode);
null != e.mobile && Object.hasOwnProperty.call(e, "mobile") && t.uint32(34).string(e.mobile);
null != e.giveCard && Object.hasOwnProperty.call(e, "giveCard") && t.uint32(40).uint32(e.giveCard);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCBindInviteCodeInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.username = e.string();
break;

case 3:
n.inviteCode = e.string();
break;

case 4:
n.mobile = e.string();
break;

case 5:
n.giveCard = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.username && e.hasOwnProperty("username") && !s.isString(e.username) ? "username: string expected" : null != e.inviteCode && e.hasOwnProperty("inviteCode") && !s.isString(e.inviteCode) ? "inviteCode: string expected" : null != e.mobile && e.hasOwnProperty("mobile") && !s.isString(e.mobile) ? "mobile: string expected" : null != e.giveCard && e.hasOwnProperty("giveCard") && !s.isInteger(e.giveCard) ? "giveCard: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCBindInviteCodeInfo) return e;
var t = new l.pb.SCBindInviteCodeInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCBindInviteCodeInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.username && (t.username = String(e.username));
null != e.inviteCode && (t.inviteCode = String(e.inviteCode));
null != e.mobile && (t.mobile = String(e.mobile));
null != e.giveCard && (t.giveCard = e.giveCard >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.username = "";
o.inviteCode = "";
o.mobile = "";
o.giveCard = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.username && e.hasOwnProperty("username") && (o.username = e.username);
null != e.inviteCode && e.hasOwnProperty("inviteCode") && (o.inviteCode = e.inviteCode);
null != e.mobile && e.hasOwnProperty("mobile") && (o.mobile = e.mobile);
null != e.giveCard && e.hasOwnProperty("giveCard") && (o.giveCard = e.giveCard);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSBindInviteCode = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.inviteCode = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.inviteCode && Object.hasOwnProperty.call(e, "inviteCode") && t.uint32(10).string(e.inviteCode);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSBindInviteCode(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.inviteCode = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.inviteCode && e.hasOwnProperty("inviteCode") && !s.isString(e.inviteCode) ? "inviteCode: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSBindInviteCode) return e;
var t = new l.pb.CSBindInviteCode();
null != e.inviteCode && (t.inviteCode = String(e.inviteCode));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.inviteCode = "");
null != e.inviteCode && e.hasOwnProperty("inviteCode") && (o.inviteCode = e.inviteCode);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCBindInviteCode = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCBindInviteCode(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCBindInviteCode) return e;
var t = new l.pb.SCBindInviteCode();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCBindInviteCode.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCBindMobileInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.mobile = "";
e.prototype.giveCard = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.mobile && Object.hasOwnProperty.call(e, "mobile") && t.uint32(18).string(e.mobile);
null != e.giveCard && Object.hasOwnProperty.call(e, "giveCard") && t.uint32(24).uint32(e.giveCard);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCBindMobileInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.mobile = e.string();
break;

case 3:
n.giveCard = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.mobile && e.hasOwnProperty("mobile") && !s.isString(e.mobile) ? "mobile: string expected" : null != e.giveCard && e.hasOwnProperty("giveCard") && !s.isInteger(e.giveCard) ? "giveCard: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCBindMobileInfo) return e;
var t = new l.pb.SCBindMobileInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCBindMobileInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.mobile && (t.mobile = String(e.mobile));
null != e.giveCard && (t.giveCard = e.giveCard >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.mobile = "";
o.giveCard = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.mobile && e.hasOwnProperty("mobile") && (o.mobile = e.mobile);
null != e.giveCard && e.hasOwnProperty("giveCard") && (o.giveCard = e.giveCard);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSGetVerificationCode = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.mobile = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.mobile && Object.hasOwnProperty.call(e, "mobile") && t.uint32(10).string(e.mobile);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGetVerificationCode(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.mobile = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.mobile && e.hasOwnProperty("mobile") && !s.isString(e.mobile) ? "mobile: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGetVerificationCode) return e;
var t = new l.pb.CSGetVerificationCode();
null != e.mobile && (t.mobile = String(e.mobile));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.mobile = "");
null != e.mobile && e.hasOwnProperty("mobile") && (o.mobile = e.mobile);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGetVerificationCode = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGetVerificationCode(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGetVerificationCode) return e;
var t = new l.pb.SCGetVerificationCode();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGetVerificationCode.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSBindMobile = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.mobile = "";
e.prototype.verificationCode = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.mobile && Object.hasOwnProperty.call(e, "mobile") && t.uint32(10).string(e.mobile);
null != e.verificationCode && Object.hasOwnProperty.call(e, "verificationCode") && t.uint32(18).string(e.verificationCode);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSBindMobile(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.mobile = e.string();
break;

case 2:
n.verificationCode = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.mobile && e.hasOwnProperty("mobile") && !s.isString(e.mobile) ? "mobile: string expected" : null != e.verificationCode && e.hasOwnProperty("verificationCode") && !s.isString(e.verificationCode) ? "verificationCode: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSBindMobile) return e;
var t = new l.pb.CSBindMobile();
null != e.mobile && (t.mobile = String(e.mobile));
null != e.verificationCode && (t.verificationCode = String(e.verificationCode));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.mobile = "";
o.verificationCode = "";
}
null != e.mobile && e.hasOwnProperty("mobile") && (o.mobile = e.mobile);
null != e.verificationCode && e.hasOwnProperty("verificationCode") && (o.verificationCode = e.verificationCode);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCBindMobile = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCBindMobile(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCBindMobile) return e;
var t = new l.pb.SCBindMobile();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCBindMobile.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSSetUserSex = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.sex = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(10).string(e.sex);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSSetUserSex(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.sex = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.sex && e.hasOwnProperty("sex") && !s.isString(e.sex) ? "sex: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSSetUserSex) return e;
var t = new l.pb.CSSetUserSex();
null != e.sex && (t.sex = String(e.sex));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.sex = "");
null != e.sex && e.hasOwnProperty("sex") && (o.sex = e.sex);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCSetUserSex = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCSetUserSex(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCSetUserSex) return e;
var t = new l.pb.SCSetUserSex();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCSetUserSex.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSSetUserInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.nikeName = "";
e.prototype.avatarUrl = "";
e.prototype.sex = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.nikeName && Object.hasOwnProperty.call(e, "nikeName") && t.uint32(10).string(e.nikeName);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(26).string(e.sex);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSSetUserInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.nikeName = e.string();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.sex = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.nikeName && e.hasOwnProperty("nikeName") && !s.isString(e.nikeName) ? "nikeName: string expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.sex && e.hasOwnProperty("sex") && !s.isString(e.sex) ? "sex: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSSetUserInfo) return e;
var t = new l.pb.CSSetUserInfo();
null != e.nikeName && (t.nikeName = String(e.nikeName));
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.sex && (t.sex = String(e.sex));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.nikeName = "";
o.avatarUrl = "";
o.sex = "";
}
null != e.nikeName && e.hasOwnProperty("nikeName") && (o.nikeName = e.nikeName);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.sex && e.hasOwnProperty("sex") && (o.sex = e.sex);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCSetUserInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCSetUserInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCSetUserInfo) return e;
var t = new l.pb.SCSetUserInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCSetUserInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSUserOpGuide = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.guideKey = 0;
e.prototype.culOpSteps = 0;
e.prototype.opStatus = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.guideKey && Object.hasOwnProperty.call(e, "guideKey") && t.uint32(8).uint32(e.guideKey);
null != e.culOpSteps && Object.hasOwnProperty.call(e, "culOpSteps") && t.uint32(16).uint32(e.culOpSteps);
null != e.opStatus && Object.hasOwnProperty.call(e, "opStatus") && t.uint32(24).uint32(e.opStatus);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSUserOpGuide(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.guideKey = e.uint32();
break;

case 2:
n.culOpSteps = e.uint32();
break;

case 3:
n.opStatus = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.guideKey && e.hasOwnProperty("guideKey") && !s.isInteger(e.guideKey) ? "guideKey: integer expected" : null != e.culOpSteps && e.hasOwnProperty("culOpSteps") && !s.isInteger(e.culOpSteps) ? "culOpSteps: integer expected" : null != e.opStatus && e.hasOwnProperty("opStatus") && !s.isInteger(e.opStatus) ? "opStatus: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSUserOpGuide) return e;
var t = new l.pb.CSUserOpGuide();
null != e.guideKey && (t.guideKey = e.guideKey >>> 0);
null != e.culOpSteps && (t.culOpSteps = e.culOpSteps >>> 0);
null != e.opStatus && (t.opStatus = e.opStatus >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.guideKey = 0;
o.culOpSteps = 0;
o.opStatus = 0;
}
null != e.guideKey && e.hasOwnProperty("guideKey") && (o.guideKey = e.guideKey);
null != e.culOpSteps && e.hasOwnProperty("culOpSteps") && (o.culOpSteps = e.culOpSteps);
null != e.opStatus && e.hasOwnProperty("opStatus") && (o.opStatus = e.opStatus);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCUserOpGuide = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCUserOpGuide(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCUserOpGuide) return e;
var t = new l.pb.SCUserOpGuide();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCUserOpGuide.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSAgentApply = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.content = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.content && Object.hasOwnProperty.call(e, "content") && t.uint32(10).string(e.content);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSAgentApply(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.content = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.content && e.hasOwnProperty("content") && !s.isString(e.content) ? "content: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSAgentApply) return e;
var t = new l.pb.CSAgentApply();
null != e.content && (t.content = String(e.content));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.content = "");
null != e.content && e.hasOwnProperty("content") && (o.content = e.content);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCAgentApply = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCAgentApply(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCAgentApply) return e;
var t = new l.pb.SCAgentApply();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCAgentApply.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCPaymentQrCodeInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.weChatUrl = "";
e.prototype.aliPayUrl = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.weChatUrl && Object.hasOwnProperty.call(e, "weChatUrl") && t.uint32(18).string(e.weChatUrl);
null != e.aliPayUrl && Object.hasOwnProperty.call(e, "aliPayUrl") && t.uint32(26).string(e.aliPayUrl);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCPaymentQrCodeInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.weChatUrl = e.string();
break;

case 3:
n.aliPayUrl = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.weChatUrl && e.hasOwnProperty("weChatUrl") && !s.isString(e.weChatUrl) ? "weChatUrl: string expected" : null != e.aliPayUrl && e.hasOwnProperty("aliPayUrl") && !s.isString(e.aliPayUrl) ? "aliPayUrl: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCPaymentQrCodeInfo) return e;
var t = new l.pb.SCPaymentQrCodeInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCPaymentQrCodeInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.weChatUrl && (t.weChatUrl = String(e.weChatUrl));
null != e.aliPayUrl && (t.aliPayUrl = String(e.aliPayUrl));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.weChatUrl = "";
o.aliPayUrl = "";
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.weChatUrl && e.hasOwnProperty("weChatUrl") && (o.weChatUrl = e.weChatUrl);
null != e.aliPayUrl && e.hasOwnProperty("aliPayUrl") && (o.aliPayUrl = e.aliPayUrl);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSPaymentQrCodeEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.weChatUrl = "";
e.prototype.aliPayUrl = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.weChatUrl && Object.hasOwnProperty.call(e, "weChatUrl") && t.uint32(10).string(e.weChatUrl);
null != e.aliPayUrl && Object.hasOwnProperty.call(e, "aliPayUrl") && t.uint32(18).string(e.aliPayUrl);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSPaymentQrCodeEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.weChatUrl = e.string();
break;

case 2:
n.aliPayUrl = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.weChatUrl && e.hasOwnProperty("weChatUrl") && !s.isString(e.weChatUrl) ? "weChatUrl: string expected" : null != e.aliPayUrl && e.hasOwnProperty("aliPayUrl") && !s.isString(e.aliPayUrl) ? "aliPayUrl: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSPaymentQrCodeEdit) return e;
var t = new l.pb.CSPaymentQrCodeEdit();
null != e.weChatUrl && (t.weChatUrl = String(e.weChatUrl));
null != e.aliPayUrl && (t.aliPayUrl = String(e.aliPayUrl));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.weChatUrl = "";
o.aliPayUrl = "";
}
null != e.weChatUrl && e.hasOwnProperty("weChatUrl") && (o.weChatUrl = e.weChatUrl);
null != e.aliPayUrl && e.hasOwnProperty("aliPayUrl") && (o.aliPayUrl = e.aliPayUrl);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCPaymentQrCodeEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCPaymentQrCodeEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCPaymentQrCodeEdit) return e;
var t = new l.pb.SCPaymentQrCodeEdit();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCPaymentQrCodeEdit.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCShare = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.giveCardNum = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.giveCardNum && Object.hasOwnProperty.call(e, "giveCardNum") && t.uint32(16).uint32(e.giveCardNum);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCShare(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.giveCardNum = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.giveCardNum && e.hasOwnProperty("giveCardNum") && !s.isInteger(e.giveCardNum) ? "giveCardNum: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCShare) return e;
var t = new l.pb.SCShare();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCShare.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.giveCardNum && (t.giveCardNum = e.giveCardNum >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.giveCardNum = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.giveCardNum && e.hasOwnProperty("giveCardNum") && (o.giveCardNum = e.giveCardNum);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSCardGoods = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(8).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(16).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(24).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(32).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSCardGoods(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.limit = e.uint32();
break;

case 2:
n.offset = e.uint32();
break;

case 3:
n.page = e.uint32();
break;

case 4:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSCardGoods) return e;
var t = new l.pb.CSCardGoods();
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCCardGoods = function() {
function e(e) {
this.goods = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.goods = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.goods && e.goods.length) for (var o = 0; o < e.goods.length; ++o) l.pb.SCCardGoods.Good.encode(e.goods[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCCardGoods(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.goods && n.goods.length || (n.goods = []);
n.goods.push(l.pb.SCCardGoods.Good.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.goods && e.hasOwnProperty("goods")) {
if (!Array.isArray(e.goods)) return "goods: array expected";
for (var t = 0; t < e.goods.length; ++t) {
var o;
if (o = l.pb.SCCardGoods.Good.verify(e.goods[t])) return "goods." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCCardGoods) return e;
var t = new l.pb.SCCardGoods();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCCardGoods.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.goods) {
if (!Array.isArray(e.goods)) throw TypeError(".pb.SCCardGoods.goods: array expected");
t.goods = [];
for (var o = 0; o < e.goods.length; ++o) {
if ("object" !== n(e.goods[o])) throw TypeError(".pb.SCCardGoods.goods: object expected");
t.goods[o] = l.pb.SCCardGoods.Good.fromObject(e.goods[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.goods = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.goods && e.goods.length) {
o.goods = [];
for (var n = 0; n < e.goods.length; ++n) o.goods[n] = l.pb.SCCardGoods.Good.toObject(e.goods[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Good = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.name = "";
e.prototype.number = 0;
e.prototype.largess = 0;
e.prototype.description = "";
e.prototype.price = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.number && Object.hasOwnProperty.call(e, "number") && t.uint32(24).uint32(e.number);
null != e.largess && Object.hasOwnProperty.call(e, "largess") && t.uint32(32).uint32(e.largess);
null != e.description && Object.hasOwnProperty.call(e, "description") && t.uint32(42).string(e.description);
null != e.price && Object.hasOwnProperty.call(e, "price") && t.uint32(48).uint32(e.price);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCCardGoods.Good(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.name = e.string();
break;

case 3:
n.number = e.uint32();
break;

case 4:
n.largess = e.uint32();
break;

case 5:
n.description = e.string();
break;

case 6:
n.price = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.number && e.hasOwnProperty("number") && !s.isInteger(e.number) ? "number: integer expected" : null != e.largess && e.hasOwnProperty("largess") && !s.isInteger(e.largess) ? "largess: integer expected" : null != e.description && e.hasOwnProperty("description") && !s.isString(e.description) ? "description: string expected" : null != e.price && e.hasOwnProperty("price") && !s.isInteger(e.price) ? "price: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCCardGoods.Good) return e;
var t = new l.pb.SCCardGoods.Good();
null != e.id && (t.id = e.id >>> 0);
null != e.name && (t.name = String(e.name));
null != e.number && (t.number = e.number >>> 0);
null != e.largess && (t.largess = e.largess >>> 0);
null != e.description && (t.description = String(e.description));
null != e.price && (t.price = e.price >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.name = "";
o.number = 0;
o.largess = 0;
o.description = "";
o.price = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.number && e.hasOwnProperty("number") && (o.number = e.number);
null != e.largess && e.hasOwnProperty("largess") && (o.largess = e.largess);
null != e.description && e.hasOwnProperty("description") && (o.description = e.description);
null != e.price && e.hasOwnProperty("price") && (o.price = e.price);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(8).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(16).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(24).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(32).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.limit = e.uint32();
break;

case 2:
n.offset = e.uint32();
break;

case 3:
n.page = e.uint32();
break;

case 4:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubList) return e;
var t = new l.pb.CSClubList();
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubList = function() {
function e(e) {
this.clubs = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.clubs = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.clubs && e.clubs.length) for (var o = 0; o < e.clubs.length; ++o) l.pb.SCClubList.Club.encode(e.clubs[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.clubs && n.clubs.length || (n.clubs = []);
n.clubs.push(l.pb.SCClubList.Club.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.clubs && e.hasOwnProperty("clubs")) {
if (!Array.isArray(e.clubs)) return "clubs: array expected";
for (var t = 0; t < e.clubs.length; ++t) {
var o;
if (o = l.pb.SCClubList.Club.verify(e.clubs[t])) return "clubs." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubList) return e;
var t = new l.pb.SCClubList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.clubs) {
if (!Array.isArray(e.clubs)) throw TypeError(".pb.SCClubList.clubs: array expected");
t.clubs = [];
for (var o = 0; o < e.clubs.length; ++o) {
if ("object" !== n(e.clubs[o])) throw TypeError(".pb.SCClubList.clubs: object expected");
t.clubs[o] = l.pb.SCClubList.Club.fromObject(e.clubs[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.clubs = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.clubs && e.clubs.length) {
o.clubs = [];
for (var n = 0; n < e.clubs.length; ++n) o.clubs[n] = l.pb.SCClubList.Club.toObject(e.clubs[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Club = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.avatarUrl = "";
e.prototype.name = "";
e.prototype.code = "";
e.prototype.announcement = "";
e.prototype.maxUsers = 0;
e.prototype.roomNum = 0;
e.prototype.affiliationsCount = 0;
e.prototype.memberType = 0;
e.prototype.balanceCard = 0;
e.prototype.emptyRoomLast = !1;
e.prototype.roomInvite = !1;
e.prototype.closed = !1;
e.prototype.playerNodismissRoom = !1;
e.prototype.quitApply = !1;
e.prototype.antiAddiction = 0;
e.prototype.member_Record = !1;
e.prototype.clubMerge = 0;
e.prototype.clubLevel = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(26).string(e.name);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(34).string(e.code);
null != e.announcement && Object.hasOwnProperty.call(e, "announcement") && t.uint32(42).string(e.announcement);
null != e.maxUsers && Object.hasOwnProperty.call(e, "maxUsers") && t.uint32(48).uint32(e.maxUsers);
null != e.roomNum && Object.hasOwnProperty.call(e, "roomNum") && t.uint32(56).uint32(e.roomNum);
null != e.affiliationsCount && Object.hasOwnProperty.call(e, "affiliationsCount") && t.uint32(64).uint32(e.affiliationsCount);
null != e.memberType && Object.hasOwnProperty.call(e, "memberType") && t.uint32(72).uint32(e.memberType);
null != e.balanceCard && Object.hasOwnProperty.call(e, "balanceCard") && t.uint32(80).int32(e.balanceCard);
null != e.emptyRoomLast && Object.hasOwnProperty.call(e, "emptyRoomLast") && t.uint32(88).bool(e.emptyRoomLast);
null != e.roomInvite && Object.hasOwnProperty.call(e, "roomInvite") && t.uint32(96).bool(e.roomInvite);
null != e.closed && Object.hasOwnProperty.call(e, "closed") && t.uint32(104).bool(e.closed);
null != e.playerNodismissRoom && Object.hasOwnProperty.call(e, "playerNodismissRoom") && t.uint32(112).bool(e.playerNodismissRoom);
null != e.quitApply && Object.hasOwnProperty.call(e, "quitApply") && t.uint32(120).bool(e.quitApply);
null != e.antiAddiction && Object.hasOwnProperty.call(e, "antiAddiction") && t.uint32(128).uint32(e.antiAddiction);
null != e.member_Record && Object.hasOwnProperty.call(e, "member_Record") && t.uint32(136).bool(e.member_Record);
null != e.clubMerge && Object.hasOwnProperty.call(e, "clubMerge") && t.uint32(144).uint32(e.clubMerge);
null != e.clubLevel && Object.hasOwnProperty.call(e, "clubLevel") && t.uint32(152).uint32(e.clubLevel);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubList.Club(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.name = e.string();
break;

case 4:
n.code = e.string();
break;

case 5:
n.announcement = e.string();
break;

case 6:
n.maxUsers = e.uint32();
break;

case 7:
n.roomNum = e.uint32();
break;

case 8:
n.affiliationsCount = e.uint32();
break;

case 9:
n.memberType = e.uint32();
break;

case 10:
n.balanceCard = e.int32();
break;

case 11:
n.emptyRoomLast = e.bool();
break;

case 12:
n.roomInvite = e.bool();
break;

case 13:
n.closed = e.bool();
break;

case 14:
n.playerNodismissRoom = e.bool();
break;

case 15:
n.quitApply = e.bool();
break;

case 16:
n.antiAddiction = e.uint32();
break;

case 17:
n.member_Record = e.bool();
break;

case 18:
n.clubMerge = e.uint32();
break;

case 19:
n.clubLevel = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.announcement && e.hasOwnProperty("announcement") && !s.isString(e.announcement) ? "announcement: string expected" : null != e.maxUsers && e.hasOwnProperty("maxUsers") && !s.isInteger(e.maxUsers) ? "maxUsers: integer expected" : null != e.roomNum && e.hasOwnProperty("roomNum") && !s.isInteger(e.roomNum) ? "roomNum: integer expected" : null != e.affiliationsCount && e.hasOwnProperty("affiliationsCount") && !s.isInteger(e.affiliationsCount) ? "affiliationsCount: integer expected" : null != e.memberType && e.hasOwnProperty("memberType") && !s.isInteger(e.memberType) ? "memberType: integer expected" : null != e.balanceCard && e.hasOwnProperty("balanceCard") && !s.isInteger(e.balanceCard) ? "balanceCard: integer expected" : null != e.emptyRoomLast && e.hasOwnProperty("emptyRoomLast") && "boolean" != typeof e.emptyRoomLast ? "emptyRoomLast: boolean expected" : null != e.roomInvite && e.hasOwnProperty("roomInvite") && "boolean" != typeof e.roomInvite ? "roomInvite: boolean expected" : null != e.closed && e.hasOwnProperty("closed") && "boolean" != typeof e.closed ? "closed: boolean expected" : null != e.playerNodismissRoom && e.hasOwnProperty("playerNodismissRoom") && "boolean" != typeof e.playerNodismissRoom ? "playerNodismissRoom: boolean expected" : null != e.quitApply && e.hasOwnProperty("quitApply") && "boolean" != typeof e.quitApply ? "quitApply: boolean expected" : null != e.antiAddiction && e.hasOwnProperty("antiAddiction") && !s.isInteger(e.antiAddiction) ? "antiAddiction: integer expected" : null != e.member_Record && e.hasOwnProperty("member_Record") && "boolean" != typeof e.member_Record ? "member_Record: boolean expected" : null != e.clubMerge && e.hasOwnProperty("clubMerge") && !s.isInteger(e.clubMerge) ? "clubMerge: integer expected" : null != e.clubLevel && e.hasOwnProperty("clubLevel") && !s.isInteger(e.clubLevel) ? "clubLevel: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubList.Club) return e;
var t = new l.pb.SCClubList.Club();
null != e.id && (t.id = e.id >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.name && (t.name = String(e.name));
null != e.code && (t.code = String(e.code));
null != e.announcement && (t.announcement = String(e.announcement));
null != e.maxUsers && (t.maxUsers = e.maxUsers >>> 0);
null != e.roomNum && (t.roomNum = e.roomNum >>> 0);
null != e.affiliationsCount && (t.affiliationsCount = e.affiliationsCount >>> 0);
null != e.memberType && (t.memberType = e.memberType >>> 0);
null != e.balanceCard && (t.balanceCard = 0 | e.balanceCard);
null != e.emptyRoomLast && (t.emptyRoomLast = Boolean(e.emptyRoomLast));
null != e.roomInvite && (t.roomInvite = Boolean(e.roomInvite));
null != e.closed && (t.closed = Boolean(e.closed));
null != e.playerNodismissRoom && (t.playerNodismissRoom = Boolean(e.playerNodismissRoom));
null != e.quitApply && (t.quitApply = Boolean(e.quitApply));
null != e.antiAddiction && (t.antiAddiction = e.antiAddiction >>> 0);
null != e.member_Record && (t.member_Record = Boolean(e.member_Record));
null != e.clubMerge && (t.clubMerge = e.clubMerge >>> 0);
null != e.clubLevel && (t.clubLevel = e.clubLevel >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.avatarUrl = "";
o.name = "";
o.code = "";
o.announcement = "";
o.maxUsers = 0;
o.roomNum = 0;
o.affiliationsCount = 0;
o.memberType = 0;
o.balanceCard = 0;
o.emptyRoomLast = !1;
o.roomInvite = !1;
o.closed = !1;
o.playerNodismissRoom = !1;
o.quitApply = !1;
o.antiAddiction = 0;
o.member_Record = !1;
o.clubMerge = 0;
o.clubLevel = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.announcement && e.hasOwnProperty("announcement") && (o.announcement = e.announcement);
null != e.maxUsers && e.hasOwnProperty("maxUsers") && (o.maxUsers = e.maxUsers);
null != e.roomNum && e.hasOwnProperty("roomNum") && (o.roomNum = e.roomNum);
null != e.affiliationsCount && e.hasOwnProperty("affiliationsCount") && (o.affiliationsCount = e.affiliationsCount);
null != e.memberType && e.hasOwnProperty("memberType") && (o.memberType = e.memberType);
null != e.balanceCard && e.hasOwnProperty("balanceCard") && (o.balanceCard = e.balanceCard);
null != e.emptyRoomLast && e.hasOwnProperty("emptyRoomLast") && (o.emptyRoomLast = e.emptyRoomLast);
null != e.roomInvite && e.hasOwnProperty("roomInvite") && (o.roomInvite = e.roomInvite);
null != e.closed && e.hasOwnProperty("closed") && (o.closed = e.closed);
null != e.playerNodismissRoom && e.hasOwnProperty("playerNodismissRoom") && (o.playerNodismissRoom = e.playerNodismissRoom);
null != e.quitApply && e.hasOwnProperty("quitApply") && (o.quitApply = e.quitApply);
null != e.antiAddiction && e.hasOwnProperty("antiAddiction") && (o.antiAddiction = e.antiAddiction);
null != e.member_Record && e.hasOwnProperty("member_Record") && (o.member_Record = e.member_Record);
null != e.clubMerge && e.hasOwnProperty("clubMerge") && (o.clubMerge = e.clubMerge);
null != e.clubLevel && e.hasOwnProperty("clubLevel") && (o.clubLevel = e.clubLevel);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubOwnerInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubOwnerInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubOwnerInfo) return e;
var t = new l.pb.CSClubOwnerInfo();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubOwnerInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(26).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(34).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubOwnerInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.nickname = e.string();
break;

case 4:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubOwnerInfo) return e;
var t = new l.pb.SCClubOwnerInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubOwnerInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.avatarUrl = "";
o.nickname = "";
o.code = "";
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubQuit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubQuit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubQuit) return e;
var t = new l.pb.CSClubQuit();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubQuit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubQuit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubQuit) return e;
var t = new l.pb.SCClubQuit();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubQuit.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubLeave = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubLeave(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubLeave) return e;
var t = new l.pb.SCClubLeave();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubLeave.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubApply = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(10).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApply(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApply) return e;
var t = new l.pb.CSClubApply();
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.code = "");
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApply = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApply(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApply) return e;
var t = new l.pb.SCClubApply();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApply.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubInviteList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(8).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(16).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(24).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(32).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubInviteList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.limit = e.uint32();
break;

case 2:
n.offset = e.uint32();
break;

case 3:
n.page = e.uint32();
break;

case 4:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubInviteList) return e;
var t = new l.pb.CSClubInviteList();
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubInviteList = function() {
function e(e) {
this.invites = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.invites = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.invites && e.invites.length) for (var o = 0; o < e.invites.length; ++o) l.pb.SCClubInviteList.Invite.encode(e.invites[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubInviteList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.invites && n.invites.length || (n.invites = []);
n.invites.push(l.pb.SCClubInviteList.Invite.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.invites && e.hasOwnProperty("invites")) {
if (!Array.isArray(e.invites)) return "invites: array expected";
for (var t = 0; t < e.invites.length; ++t) {
var o;
if (o = l.pb.SCClubInviteList.Invite.verify(e.invites[t])) return "invites." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubInviteList) return e;
var t = new l.pb.SCClubInviteList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubInviteList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.invites) {
if (!Array.isArray(e.invites)) throw TypeError(".pb.SCClubInviteList.invites: array expected");
t.invites = [];
for (var o = 0; o < e.invites.length; ++o) {
if ("object" !== n(e.invites[o])) throw TypeError(".pb.SCClubInviteList.invites: object expected");
t.invites[o] = l.pb.SCClubInviteList.Invite.fromObject(e.invites[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.invites = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.invites && e.invites.length) {
o.invites = [];
for (var n = 0; n < e.invites.length; ++n) o.invites[n] = l.pb.SCClubInviteList.Invite.toObject(e.invites[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Invite = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.avatarUrl = "";
e.prototype.inviter = "";
e.prototype.name = "";
e.prototype.policy = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.inviter && Object.hasOwnProperty.call(e, "inviter") && t.uint32(26).string(e.inviter);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(34).string(e.name);
null != e.policy && Object.hasOwnProperty.call(e, "policy") && t.uint32(40).uint32(e.policy);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubInviteList.Invite(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.inviter = e.string();
break;

case 4:
n.name = e.string();
break;

case 5:
n.policy = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.inviter && e.hasOwnProperty("inviter") && !s.isString(e.inviter) ? "inviter: string expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.policy && e.hasOwnProperty("policy") && !s.isInteger(e.policy) ? "policy: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubInviteList.Invite) return e;
var t = new l.pb.SCClubInviteList.Invite();
null != e.id && (t.id = e.id >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.inviter && (t.inviter = String(e.inviter));
null != e.name && (t.name = String(e.name));
null != e.policy && (t.policy = e.policy >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.avatarUrl = "";
o.inviter = "";
o.name = "";
o.policy = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.inviter && e.hasOwnProperty("inviter") && (o.inviter = e.inviter);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.policy && e.hasOwnProperty("policy") && (o.policy = e.policy);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubInviteAgree = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubInviteAgree(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubInviteAgree) return e;
var t = new l.pb.CSClubInviteAgree();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubInviteAgree = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubInviteAgree(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubInviteAgree) return e;
var t = new l.pb.SCClubInviteAgree();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubInviteAgree.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubInviteIgnore = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubInviteIgnore(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubInviteIgnore) return e;
var t = new l.pb.CSClubInviteIgnore();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubInviteIgnore = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubInviteIgnore(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubInviteIgnore) return e;
var t = new l.pb.SCClubInviteIgnore();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubInviteIgnore.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubMemberList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.prototype.mergeClubId = 0;
e.prototype.culClubLevel = 0;
e.prototype.polling = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
null != e.mergeClubId && Object.hasOwnProperty.call(e, "mergeClubId") && t.uint32(48).uint32(e.mergeClubId);
null != e.culClubLevel && Object.hasOwnProperty.call(e, "culClubLevel") && t.uint32(56).uint32(e.culClubLevel);
null != e.polling && Object.hasOwnProperty.call(e, "polling") && t.uint32(64).bool(e.polling);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

case 6:
n.mergeClubId = e.uint32();
break;

case 7:
n.culClubLevel = e.uint32();
break;

case 8:
n.polling = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null != e.mergeClubId && e.hasOwnProperty("mergeClubId") && !s.isInteger(e.mergeClubId) ? "mergeClubId: integer expected" : null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && !s.isInteger(e.culClubLevel) ? "culClubLevel: integer expected" : null != e.polling && e.hasOwnProperty("polling") && "boolean" != typeof e.polling ? "polling: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberList) return e;
var t = new l.pb.CSClubMemberList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
null != e.mergeClubId && (t.mergeClubId = e.mergeClubId >>> 0);
null != e.culClubLevel && (t.culClubLevel = e.culClubLevel >>> 0);
null != e.polling && (t.polling = Boolean(e.polling));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
o.mergeClubId = 0;
o.culClubLevel = 0;
o.polling = !1;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
null != e.mergeClubId && e.hasOwnProperty("mergeClubId") && (o.mergeClubId = e.mergeClubId);
null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && (o.culClubLevel = e.culClubLevel);
null != e.polling && e.hasOwnProperty("polling") && (o.polling = e.polling);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubMemberList = function() {
function e(e) {
this.members = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.members = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.prototype.culMemberType = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.members && e.members.length) for (var o = 0; o < e.members.length; ++o) l.pb.SCClubMemberList.Member.encode(e.members[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
null != e.culMemberType && Object.hasOwnProperty.call(e, "culMemberType") && t.uint32(40).uint32(e.culMemberType);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.members && n.members.length || (n.members = []);
n.members.push(l.pb.SCClubMemberList.Member.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

case 5:
n.culMemberType = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.members && e.hasOwnProperty("members")) {
if (!Array.isArray(e.members)) return "members: array expected";
for (var t = 0; t < e.members.length; ++t) {
var o;
if (o = l.pb.SCClubMemberList.Member.verify(e.members[t])) return "members." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null != e.culMemberType && e.hasOwnProperty("culMemberType") && !s.isInteger(e.culMemberType) ? "culMemberType: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberList) return e;
var t = new l.pb.SCClubMemberList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.members) {
if (!Array.isArray(e.members)) throw TypeError(".pb.SCClubMemberList.members: array expected");
t.members = [];
for (var o = 0; o < e.members.length; ++o) {
if ("object" !== n(e.members[o])) throw TypeError(".pb.SCClubMemberList.members: object expected");
t.members[o] = l.pb.SCClubMemberList.Member.fromObject(e.members[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
null != e.culMemberType && (t.culMemberType = e.culMemberType >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.members = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
o.culMemberType = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.members && e.members.length) {
o.members = [];
for (var n = 0; n < e.members.length; ++n) o.members[n] = l.pb.SCClubMemberList.Member.toObject(e.members[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
null != e.culMemberType && e.hasOwnProperty("culMemberType") && (o.culMemberType = e.culMemberType);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Member = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.sex = 0;
e.prototype.memberType = 0;
e.prototype.status = 0;
e.prototype.userId = 0;
e.prototype.freeze = 0;
e.prototype.lastGame = 0;
e.prototype.remark = "";
e.prototype.joinTime = 0;
e.prototype.belongToClub = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(32).uint32(e.sex);
null != e.memberType && Object.hasOwnProperty.call(e, "memberType") && t.uint32(40).uint32(e.memberType);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(48).uint32(e.status);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(56).uint32(e.userId);
null != e.freeze && Object.hasOwnProperty.call(e, "freeze") && t.uint32(64).uint32(e.freeze);
null != e.lastGame && Object.hasOwnProperty.call(e, "lastGame") && t.uint32(72).uint32(e.lastGame);
null != e.remark && Object.hasOwnProperty.call(e, "remark") && t.uint32(82).string(e.remark);
null != e.joinTime && Object.hasOwnProperty.call(e, "joinTime") && t.uint32(88).uint32(e.joinTime);
null != e.belongToClub && Object.hasOwnProperty.call(e, "belongToClub") && t.uint32(96).uint32(e.belongToClub);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberList.Member(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.sex = e.uint32();
break;

case 5:
n.memberType = e.uint32();
break;

case 6:
n.status = e.uint32();
break;

case 7:
n.userId = e.uint32();
break;

case 8:
n.freeze = e.uint32();
break;

case 9:
n.lastGame = e.uint32();
break;

case 10:
n.remark = e.string();
break;

case 11:
n.joinTime = e.uint32();
break;

case 12:
n.belongToClub = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.sex && e.hasOwnProperty("sex") && !s.isInteger(e.sex) ? "sex: integer expected" : null != e.memberType && e.hasOwnProperty("memberType") && !s.isInteger(e.memberType) ? "memberType: integer expected" : null != e.status && e.hasOwnProperty("status") && !s.isInteger(e.status) ? "status: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.freeze && e.hasOwnProperty("freeze") && !s.isInteger(e.freeze) ? "freeze: integer expected" : null != e.lastGame && e.hasOwnProperty("lastGame") && !s.isInteger(e.lastGame) ? "lastGame: integer expected" : null != e.remark && e.hasOwnProperty("remark") && !s.isString(e.remark) ? "remark: string expected" : null != e.joinTime && e.hasOwnProperty("joinTime") && !s.isInteger(e.joinTime) ? "joinTime: integer expected" : null != e.belongToClub && e.hasOwnProperty("belongToClub") && !s.isInteger(e.belongToClub) ? "belongToClub: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberList.Member) return e;
var t = new l.pb.SCClubMemberList.Member();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
null != e.sex && (t.sex = e.sex >>> 0);
null != e.memberType && (t.memberType = e.memberType >>> 0);
null != e.status && (t.status = e.status >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.freeze && (t.freeze = e.freeze >>> 0);
null != e.lastGame && (t.lastGame = e.lastGame >>> 0);
null != e.remark && (t.remark = String(e.remark));
null != e.joinTime && (t.joinTime = e.joinTime >>> 0);
null != e.belongToClub && (t.belongToClub = e.belongToClub >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.sex = 0;
o.memberType = 0;
o.status = 0;
o.userId = 0;
o.freeze = 0;
o.lastGame = 0;
o.remark = "";
o.joinTime = 0;
o.belongToClub = 0;
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.sex && e.hasOwnProperty("sex") && (o.sex = e.sex);
null != e.memberType && e.hasOwnProperty("memberType") && (o.memberType = e.memberType);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.freeze && e.hasOwnProperty("freeze") && (o.freeze = e.freeze);
null != e.lastGame && e.hasOwnProperty("lastGame") && (o.lastGame = e.lastGame);
null != e.remark && e.hasOwnProperty("remark") && (o.remark = e.remark);
null != e.joinTime && e.hasOwnProperty("joinTime") && (o.joinTime = e.joinTime);
null != e.belongToClub && e.hasOwnProperty("belongToClub") && (o.belongToClub = e.belongToClub);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubMemberAntiAddictionList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberAntiAddictionList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberAntiAddictionList) return e;
var t = new l.pb.CSClubMemberAntiAddictionList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubMemberAntiAddictionList = function() {
function e(e) {
this.members = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.members = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.prototype.fatigueNum = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.members && e.members.length) for (var o = 0; o < e.members.length; ++o) l.pb.SCClubMemberAntiAddictionList.AntiAddictMember.encode(e.members[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
null != e.fatigueNum && Object.hasOwnProperty.call(e, "fatigueNum") && t.uint32(40).int32(e.fatigueNum);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberAntiAddictionList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.members && n.members.length || (n.members = []);
n.members.push(l.pb.SCClubMemberAntiAddictionList.AntiAddictMember.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

case 5:
n.fatigueNum = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.members && e.hasOwnProperty("members")) {
if (!Array.isArray(e.members)) return "members: array expected";
for (var t = 0; t < e.members.length; ++t) {
var o;
if (o = l.pb.SCClubMemberAntiAddictionList.AntiAddictMember.verify(e.members[t])) return "members." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && !s.isInteger(e.fatigueNum) ? "fatigueNum: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberAntiAddictionList) return e;
var t = new l.pb.SCClubMemberAntiAddictionList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberAntiAddictionList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.members) {
if (!Array.isArray(e.members)) throw TypeError(".pb.SCClubMemberAntiAddictionList.members: array expected");
t.members = [];
for (var o = 0; o < e.members.length; ++o) {
if ("object" !== n(e.members[o])) throw TypeError(".pb.SCClubMemberAntiAddictionList.members: object expected");
t.members[o] = l.pb.SCClubMemberAntiAddictionList.AntiAddictMember.fromObject(e.members[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
null != e.fatigueNum && (t.fatigueNum = 0 | e.fatigueNum);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.members = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
o.fatigueNum = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.members && e.members.length) {
o.members = [];
for (var n = 0; n < e.members.length; ++n) o.members[n] = l.pb.SCClubMemberAntiAddictionList.AntiAddictMember.toObject(e.members[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && (o.fatigueNum = e.fatigueNum);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.AntiAddictMember = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.sex = 0;
e.prototype.memberType = 0;
e.prototype.status = 0;
e.prototype.userId = 0;
e.prototype.freeze = 0;
e.prototype.lastGame = 0;
e.prototype.remark = "";
e.prototype.joinTime = 0;
e.prototype.fatigueNum = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(32).uint32(e.sex);
null != e.memberType && Object.hasOwnProperty.call(e, "memberType") && t.uint32(40).uint32(e.memberType);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(48).uint32(e.status);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(56).uint32(e.userId);
null != e.freeze && Object.hasOwnProperty.call(e, "freeze") && t.uint32(64).uint32(e.freeze);
null != e.lastGame && Object.hasOwnProperty.call(e, "lastGame") && t.uint32(72).uint32(e.lastGame);
null != e.remark && Object.hasOwnProperty.call(e, "remark") && t.uint32(82).string(e.remark);
null != e.joinTime && Object.hasOwnProperty.call(e, "joinTime") && t.uint32(88).uint32(e.joinTime);
null != e.fatigueNum && Object.hasOwnProperty.call(e, "fatigueNum") && t.uint32(96).int32(e.fatigueNum);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberAntiAddictionList.AntiAddictMember(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.sex = e.uint32();
break;

case 5:
n.memberType = e.uint32();
break;

case 6:
n.status = e.uint32();
break;

case 7:
n.userId = e.uint32();
break;

case 8:
n.freeze = e.uint32();
break;

case 9:
n.lastGame = e.uint32();
break;

case 10:
n.remark = e.string();
break;

case 11:
n.joinTime = e.uint32();
break;

case 12:
n.fatigueNum = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.sex && e.hasOwnProperty("sex") && !s.isInteger(e.sex) ? "sex: integer expected" : null != e.memberType && e.hasOwnProperty("memberType") && !s.isInteger(e.memberType) ? "memberType: integer expected" : null != e.status && e.hasOwnProperty("status") && !s.isInteger(e.status) ? "status: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.freeze && e.hasOwnProperty("freeze") && !s.isInteger(e.freeze) ? "freeze: integer expected" : null != e.lastGame && e.hasOwnProperty("lastGame") && !s.isInteger(e.lastGame) ? "lastGame: integer expected" : null != e.remark && e.hasOwnProperty("remark") && !s.isString(e.remark) ? "remark: string expected" : null != e.joinTime && e.hasOwnProperty("joinTime") && !s.isInteger(e.joinTime) ? "joinTime: integer expected" : null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && !s.isInteger(e.fatigueNum) ? "fatigueNum: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberAntiAddictionList.AntiAddictMember) return e;
var t = new l.pb.SCClubMemberAntiAddictionList.AntiAddictMember();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
null != e.sex && (t.sex = e.sex >>> 0);
null != e.memberType && (t.memberType = e.memberType >>> 0);
null != e.status && (t.status = e.status >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.freeze && (t.freeze = e.freeze >>> 0);
null != e.lastGame && (t.lastGame = e.lastGame >>> 0);
null != e.remark && (t.remark = String(e.remark));
null != e.joinTime && (t.joinTime = e.joinTime >>> 0);
null != e.fatigueNum && (t.fatigueNum = 0 | e.fatigueNum);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.sex = 0;
o.memberType = 0;
o.status = 0;
o.userId = 0;
o.freeze = 0;
o.lastGame = 0;
o.remark = "";
o.joinTime = 0;
o.fatigueNum = 0;
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.sex && e.hasOwnProperty("sex") && (o.sex = e.sex);
null != e.memberType && e.hasOwnProperty("memberType") && (o.memberType = e.memberType);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.freeze && e.hasOwnProperty("freeze") && (o.freeze = e.freeze);
null != e.lastGame && e.hasOwnProperty("lastGame") && (o.lastGame = e.lastGame);
null != e.remark && e.hasOwnProperty("remark") && (o.remark = e.remark);
null != e.joinTime && e.hasOwnProperty("joinTime") && (o.joinTime = e.joinTime);
null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && (o.fatigueNum = e.fatigueNum);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSAccumulatedRecordList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSAccumulatedRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSAccumulatedRecordList) return e;
var t = new l.pb.CSAccumulatedRecordList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCAccumulatedRecordList = function() {
function e(e) {
this.members = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.members = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.prototype.fatigueNum = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.members && e.members.length) for (var o = 0; o < e.members.length; ++o) l.pb.SCAccumulatedRecordList.AccumulatedMember.encode(e.members[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
null != e.fatigueNum && Object.hasOwnProperty.call(e, "fatigueNum") && t.uint32(40).int32(e.fatigueNum);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCAccumulatedRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.members && n.members.length || (n.members = []);
n.members.push(l.pb.SCAccumulatedRecordList.AccumulatedMember.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

case 5:
n.fatigueNum = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.members && e.hasOwnProperty("members")) {
if (!Array.isArray(e.members)) return "members: array expected";
for (var t = 0; t < e.members.length; ++t) {
var o;
if (o = l.pb.SCAccumulatedRecordList.AccumulatedMember.verify(e.members[t])) return "members." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && !s.isInteger(e.fatigueNum) ? "fatigueNum: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCAccumulatedRecordList) return e;
var t = new l.pb.SCAccumulatedRecordList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCAccumulatedRecordList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.members) {
if (!Array.isArray(e.members)) throw TypeError(".pb.SCAccumulatedRecordList.members: array expected");
t.members = [];
for (var o = 0; o < e.members.length; ++o) {
if ("object" !== n(e.members[o])) throw TypeError(".pb.SCAccumulatedRecordList.members: object expected");
t.members[o] = l.pb.SCAccumulatedRecordList.AccumulatedMember.fromObject(e.members[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
null != e.fatigueNum && (t.fatigueNum = 0 | e.fatigueNum);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.members = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
o.fatigueNum = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.members && e.members.length) {
o.members = [];
for (var n = 0; n < e.members.length; ++n) o.members[n] = l.pb.SCAccumulatedRecordList.AccumulatedMember.toObject(e.members[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && (o.fatigueNum = e.fatigueNum);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.AccumulatedMember = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.sex = 0;
e.prototype.memberType = 0;
e.prototype.status = 0;
e.prototype.userId = 0;
e.prototype.freeze = 0;
e.prototype.lastGame = 0;
e.prototype.remark = "";
e.prototype.joinTime = 0;
e.prototype.fatigueNum = 0;
e.prototype.number = 0;
e.prototype.winner = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(32).uint32(e.sex);
null != e.memberType && Object.hasOwnProperty.call(e, "memberType") && t.uint32(40).uint32(e.memberType);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(48).uint32(e.status);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(56).uint32(e.userId);
null != e.freeze && Object.hasOwnProperty.call(e, "freeze") && t.uint32(64).uint32(e.freeze);
null != e.lastGame && Object.hasOwnProperty.call(e, "lastGame") && t.uint32(72).uint32(e.lastGame);
null != e.remark && Object.hasOwnProperty.call(e, "remark") && t.uint32(82).string(e.remark);
null != e.joinTime && Object.hasOwnProperty.call(e, "joinTime") && t.uint32(88).uint32(e.joinTime);
null != e.fatigueNum && Object.hasOwnProperty.call(e, "fatigueNum") && t.uint32(96).int32(e.fatigueNum);
null != e.number && Object.hasOwnProperty.call(e, "number") && t.uint32(104).uint32(e.number);
null != e.winner && Object.hasOwnProperty.call(e, "winner") && t.uint32(112).uint32(e.winner);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCAccumulatedRecordList.AccumulatedMember(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.sex = e.uint32();
break;

case 5:
n.memberType = e.uint32();
break;

case 6:
n.status = e.uint32();
break;

case 7:
n.userId = e.uint32();
break;

case 8:
n.freeze = e.uint32();
break;

case 9:
n.lastGame = e.uint32();
break;

case 10:
n.remark = e.string();
break;

case 11:
n.joinTime = e.uint32();
break;

case 12:
n.fatigueNum = e.int32();
break;

case 13:
n.number = e.uint32();
break;

case 14:
n.winner = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.sex && e.hasOwnProperty("sex") && !s.isInteger(e.sex) ? "sex: integer expected" : null != e.memberType && e.hasOwnProperty("memberType") && !s.isInteger(e.memberType) ? "memberType: integer expected" : null != e.status && e.hasOwnProperty("status") && !s.isInteger(e.status) ? "status: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.freeze && e.hasOwnProperty("freeze") && !s.isInteger(e.freeze) ? "freeze: integer expected" : null != e.lastGame && e.hasOwnProperty("lastGame") && !s.isInteger(e.lastGame) ? "lastGame: integer expected" : null != e.remark && e.hasOwnProperty("remark") && !s.isString(e.remark) ? "remark: string expected" : null != e.joinTime && e.hasOwnProperty("joinTime") && !s.isInteger(e.joinTime) ? "joinTime: integer expected" : null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && !s.isInteger(e.fatigueNum) ? "fatigueNum: integer expected" : null != e.number && e.hasOwnProperty("number") && !s.isInteger(e.number) ? "number: integer expected" : null != e.winner && e.hasOwnProperty("winner") && !s.isInteger(e.winner) ? "winner: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCAccumulatedRecordList.AccumulatedMember) return e;
var t = new l.pb.SCAccumulatedRecordList.AccumulatedMember();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
null != e.sex && (t.sex = e.sex >>> 0);
null != e.memberType && (t.memberType = e.memberType >>> 0);
null != e.status && (t.status = e.status >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.freeze && (t.freeze = e.freeze >>> 0);
null != e.lastGame && (t.lastGame = e.lastGame >>> 0);
null != e.remark && (t.remark = String(e.remark));
null != e.joinTime && (t.joinTime = e.joinTime >>> 0);
null != e.fatigueNum && (t.fatigueNum = 0 | e.fatigueNum);
null != e.number && (t.number = e.number >>> 0);
null != e.winner && (t.winner = e.winner >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.sex = 0;
o.memberType = 0;
o.status = 0;
o.userId = 0;
o.freeze = 0;
o.lastGame = 0;
o.remark = "";
o.joinTime = 0;
o.fatigueNum = 0;
o.number = 0;
o.winner = 0;
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.sex && e.hasOwnProperty("sex") && (o.sex = e.sex);
null != e.memberType && e.hasOwnProperty("memberType") && (o.memberType = e.memberType);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.freeze && e.hasOwnProperty("freeze") && (o.freeze = e.freeze);
null != e.lastGame && e.hasOwnProperty("lastGame") && (o.lastGame = e.lastGame);
null != e.remark && e.hasOwnProperty("remark") && (o.remark = e.remark);
null != e.joinTime && e.hasOwnProperty("joinTime") && (o.joinTime = e.joinTime);
null != e.fatigueNum && e.hasOwnProperty("fatigueNum") && (o.fatigueNum = e.fatigueNum);
null != e.number && e.hasOwnProperty("number") && (o.number = e.number);
null != e.winner && e.hasOwnProperty("winner") && (o.winner = e.winner);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubRoomList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRoomList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRoomList) return e;
var t = new l.pb.CSClubRoomList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomList = function() {
function e(e) {
this.rooms = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.rooms = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.rooms && e.rooms.length) for (var o = 0; o < e.rooms.length; ++o) l.pb.PbClubRoom.encode(e.rooms[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.rooms && n.rooms.length || (n.rooms = []);
n.rooms.push(l.pb.PbClubRoom.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.rooms && e.hasOwnProperty("rooms")) {
if (!Array.isArray(e.rooms)) return "rooms: array expected";
for (var t = 0; t < e.rooms.length; ++t) {
var o;
if (o = l.pb.PbClubRoom.verify(e.rooms[t])) return "rooms." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomList) return e;
var t = new l.pb.SCClubRoomList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRoomList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.rooms) {
if (!Array.isArray(e.rooms)) throw TypeError(".pb.SCClubRoomList.rooms: array expected");
t.rooms = [];
for (var o = 0; o < e.rooms.length; ++o) {
if ("object" !== n(e.rooms[o])) throw TypeError(".pb.SCClubRoomList.rooms: object expected");
t.rooms[o] = l.pb.PbClubRoom.fromObject(e.rooms[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.rooms = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.rooms && e.rooms.length) {
o.rooms = [];
for (var n = 0; n < e.rooms.length; ++n) o.rooms[n] = l.pb.PbClubRoom.toObject(e.rooms[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubRoomClose = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRoomClose(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRoomClose) return e;
var t = new l.pb.CSClubRoomClose();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomClose = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomClose(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomClose) return e;
var t = new l.pb.SCClubRoomClose();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRoomClose.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubGameSchemeList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameSchemeList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameSchemeList) return e;
var t = new l.pb.CSClubGameSchemeList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubGameSchemeList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubGameSchemeList.Scheme.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameSchemeList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubGameSchemeList.Scheme.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubGameSchemeList.Scheme.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameSchemeList) return e;
var t = new l.pb.SCClubGameSchemeList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubGameSchemeList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubGameSchemeList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubGameSchemeList.data: object expected");
t.data[o] = l.pb.SCClubGameSchemeList.Scheme.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubGameSchemeList.Scheme.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Scheme = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.name = "";
e.prototype.gameType = 0;
e.prototype.num = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.auto = !1;
e.prototype.color = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(24).uint32(e.gameType);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(32).uint32(e.num);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(40).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(48).uint64(e.param2);
null != e.auto && Object.hasOwnProperty.call(e, "auto") && t.uint32(56).bool(e.auto);
null != e.color && Object.hasOwnProperty.call(e, "color") && t.uint32(66).string(e.color);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameSchemeList.Scheme(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.name = e.string();
break;

case 3:
n.gameType = e.uint32();
break;

case 4:
n.num = e.uint32();
break;

case 5:
n.param1 = e.uint64();
break;

case 6:
n.param2 = e.uint64();
break;

case 7:
n.auto = e.bool();
break;

case 8:
n.color = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num) ? "num: integer expected" : null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high)) ? "param1: integer|Long expected" : null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high)) ? "param2: integer|Long expected" : null != e.auto && e.hasOwnProperty("auto") && "boolean" != typeof e.auto ? "auto: boolean expected" : null != e.color && e.hasOwnProperty("color") && !s.isString(e.color) ? "color: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameSchemeList.Scheme) return e;
var t = new l.pb.SCClubGameSchemeList.Scheme();
null != e.id && (t.id = e.id >>> 0);
null != e.name && (t.name = String(e.name));
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
null != e.auto && (t.auto = Boolean(e.auto));
null != e.color && (t.color = String(e.color));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.name = "";
o.gameType = 0;
o.num = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
o.auto = !1;
o.color = "";
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
null != e.auto && e.hasOwnProperty("auto") && (o.auto = e.auto);
null != e.color && e.hasOwnProperty("color") && (o.color = e.color);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubIsolateList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubIsolateList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubIsolateList) return e;
var t = new l.pb.CSClubIsolateList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.clubId = 0);
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubIsolateList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubIsolateList.IsolateGroup.encode(e.data[o], t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubIsolateList.IsolateGroup.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubIsolateList.IsolateGroup.verify(e.data[t])) return "data." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateList) return e;
var t = new l.pb.SCClubIsolateList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubIsolateList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubIsolateList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubIsolateList.data: object expected");
t.data[o] = l.pb.SCClubIsolateList.IsolateGroup.fromObject(e.data[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubIsolateList.IsolateGroup.toObject(e.data[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.IsolateGroup = function() {
function e(e) {
this.isolates = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.isolates = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
if (null != e.isolates && e.isolates.length) for (var o = 0; o < e.isolates.length; ++o) l.pb.SCClubIsolateList.IsolateGroup.Isolate.encode(e.isolates[o], t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateList.IsolateGroup(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.isolates && n.isolates.length || (n.isolates = []);
n.isolates.push(l.pb.SCClubIsolateList.IsolateGroup.Isolate.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id)) return "id: integer expected";
if (null != e.isolates && e.hasOwnProperty("isolates")) {
if (!Array.isArray(e.isolates)) return "isolates: array expected";
for (var t = 0; t < e.isolates.length; ++t) {
var o = l.pb.SCClubIsolateList.IsolateGroup.Isolate.verify(e.isolates[t]);
if (o) return "isolates." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateList.IsolateGroup) return e;
var t = new l.pb.SCClubIsolateList.IsolateGroup();
null != e.id && (t.id = e.id >>> 0);
if (e.isolates) {
if (!Array.isArray(e.isolates)) throw TypeError(".pb.SCClubIsolateList.IsolateGroup.isolates: array expected");
t.isolates = [];
for (var o = 0; o < e.isolates.length; ++o) {
if ("object" !== n(e.isolates[o])) throw TypeError(".pb.SCClubIsolateList.IsolateGroup.isolates: object expected");
t.isolates[o] = l.pb.SCClubIsolateList.IsolateGroup.Isolate.fromObject(e.isolates[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.isolates = []);
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
if (e.isolates && e.isolates.length) {
o.isolates = [];
for (var n = 0; n < e.isolates.length; ++n) o.isolates[n] = l.pb.SCClubIsolateList.IsolateGroup.Isolate.toObject(e.isolates[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Isolate = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.userId = 0;
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(8).uint32(e.userId);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(26).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(34).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateList.IsolateGroup.Isolate(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.userId = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.nickname = e.string();
break;

case 4:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateList.IsolateGroup.Isolate) return e;
var t = new l.pb.SCClubIsolateList.IsolateGroup.Isolate();
null != e.userId && (t.userId = e.userId >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.userId = 0;
o.avatarUrl = "";
o.nickname = "";
o.code = "";
}
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
return e;
}();
e.CSClubIsolateGroupAdd = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubIsolateGroupAdd(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubIsolateGroupAdd) return e;
var t = new l.pb.CSClubIsolateGroupAdd();
null != e.clubId && (t.clubId = e.clubId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.clubId = 0);
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubIsolateGroupAdd = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateGroupAdd(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateGroupAdd) return e;
var t = new l.pb.SCClubIsolateGroupAdd();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubIsolateGroupAdd.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubIsolateGroupDel = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubIsolateGroupDel(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubIsolateGroupDel) return e;
var t = new l.pb.CSClubIsolateGroupDel();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubIsolateGroupDel = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateGroupDel(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateGroupDel) return e;
var t = new l.pb.SCClubIsolateGroupDel();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubIsolateGroupDel.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubIsolateAdd = function() {
function e(e) {
this.userId = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.groupId = 0;
e.prototype.userId = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.groupId && Object.hasOwnProperty.call(e, "groupId") && t.uint32(8).uint32(e.groupId);
if (null != e.userId && e.userId.length) {
t.uint32(18).fork();
for (var o = 0; o < e.userId.length; ++o) t.uint32(e.userId[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubIsolateAdd(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.groupId = e.uint32();
break;

case 2:
n.userId && n.userId.length || (n.userId = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.userId.push(e.uint32()); else n.userId.push(e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.groupId && e.hasOwnProperty("groupId") && !s.isInteger(e.groupId)) return "groupId: integer expected";
if (null != e.userId && e.hasOwnProperty("userId")) {
if (!Array.isArray(e.userId)) return "userId: array expected";
for (var t = 0; t < e.userId.length; ++t) if (!s.isInteger(e.userId[t])) return "userId: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubIsolateAdd) return e;
var t = new l.pb.CSClubIsolateAdd();
null != e.groupId && (t.groupId = e.groupId >>> 0);
if (e.userId) {
if (!Array.isArray(e.userId)) throw TypeError(".pb.CSClubIsolateAdd.userId: array expected");
t.userId = [];
for (var o = 0; o < e.userId.length; ++o) t.userId[o] = e.userId[o] >>> 0;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.userId = []);
t.defaults && (o.groupId = 0);
null != e.groupId && e.hasOwnProperty("groupId") && (o.groupId = e.groupId);
if (e.userId && e.userId.length) {
o.userId = [];
for (var n = 0; n < e.userId.length; ++n) o.userId[n] = e.userId[n];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubIsolateAdd = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateAdd(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateAdd) return e;
var t = new l.pb.SCClubIsolateAdd();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubIsolateAdd.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubIsolateDel = function() {
function e(e) {
this.userId = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.groupId = 0;
e.prototype.userId = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.groupId && Object.hasOwnProperty.call(e, "groupId") && t.uint32(8).uint32(e.groupId);
if (null != e.userId && e.userId.length) {
t.uint32(18).fork();
for (var o = 0; o < e.userId.length; ++o) t.uint32(e.userId[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubIsolateDel(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.groupId = e.uint32();
break;

case 2:
n.userId && n.userId.length || (n.userId = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.userId.push(e.uint32()); else n.userId.push(e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.groupId && e.hasOwnProperty("groupId") && !s.isInteger(e.groupId)) return "groupId: integer expected";
if (null != e.userId && e.hasOwnProperty("userId")) {
if (!Array.isArray(e.userId)) return "userId: array expected";
for (var t = 0; t < e.userId.length; ++t) if (!s.isInteger(e.userId[t])) return "userId: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubIsolateDel) return e;
var t = new l.pb.CSClubIsolateDel();
null != e.groupId && (t.groupId = e.groupId >>> 0);
if (e.userId) {
if (!Array.isArray(e.userId)) throw TypeError(".pb.CSClubIsolateDel.userId: array expected");
t.userId = [];
for (var o = 0; o < e.userId.length; ++o) t.userId[o] = e.userId[o] >>> 0;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.userId = []);
t.defaults && (o.groupId = 0);
null != e.groupId && e.hasOwnProperty("groupId") && (o.groupId = e.groupId);
if (e.userId && e.userId.length) {
o.userId = [];
for (var n = 0; n < e.userId.length; ++n) o.userId[n] = e.userId[n];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubIsolateDel = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubIsolateDel(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubIsolateDel) return e;
var t = new l.pb.SCClubIsolateDel();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubIsolateDel.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubMemberFreeze = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.prototype.status = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(24).uint32(e.status);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberFreeze(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

case 3:
n.status = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.status && e.hasOwnProperty("status") && !s.isInteger(e.status) ? "status: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberFreeze) return e;
var t = new l.pb.CSClubMemberFreeze();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.status && (t.status = e.status >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
o.status = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubMemberFreeze = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberFreeze(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberFreeze) return e;
var t = new l.pb.SCClubMemberFreeze();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberFreeze.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubMemberRemark = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.prototype.remark = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
null != e.remark && Object.hasOwnProperty.call(e, "remark") && t.uint32(26).string(e.remark);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberRemark(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

case 3:
n.remark = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.remark && e.hasOwnProperty("remark") && !s.isString(e.remark) ? "remark: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberRemark) return e;
var t = new l.pb.CSClubMemberRemark();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.remark && (t.remark = String(e.remark));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
o.remark = "";
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.remark && e.hasOwnProperty("remark") && (o.remark = e.remark);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubMemberRemark = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberRemark(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberRemark) return e;
var t = new l.pb.SCClubMemberRemark();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberRemark.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubMemberSetRole = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.prototype.role = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
null != e.role && Object.hasOwnProperty.call(e, "role") && t.uint32(24).int32(e.role);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberSetRole(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

case 3:
n.role = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId)) return "clubId: integer expected";
if (null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId)) return "userId: integer expected";
if (null != e.role && e.hasOwnProperty("role")) switch (e.role) {
default:
return "role: enum value expected";

case 0:
case 1:
case 2:
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberSetRole) return e;
var t = new l.pb.CSClubMemberSetRole();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
switch (e.role) {
case "UNKNOWN":
case 0:
t.role = 0;
break;

case "Member":
case 1:
t.role = 1;
break;

case "Admin":
case 2:
t.role = 2;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
o.role = t.enums === String ? "UNKNOWN" : 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.role && e.hasOwnProperty("role") && (o.role = t.enums === String ? l.pb.CSClubMemberSetRole.Role[e.role] : e.role);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Role = function() {
var e = {}, t = Object.create(e);
t[e[0] = "UNKNOWN"] = 0;
t[e[1] = "Member"] = 1;
t[e[2] = "Admin"] = 2;
return t;
}();
return e;
}();
e.SCClubMemberSetRole = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberSetRole(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberSetRole) return e;
var t = new l.pb.SCClubMemberSetRole();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberSetRole.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubMemberKickOut = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberKickOut(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberKickOut) return e;
var t = new l.pb.CSClubMemberKickOut();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubMemberKickOut = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberKickOut(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberKickOut) return e;
var t = new l.pb.SCClubMemberKickOut();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberKickOut.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubMemberReleaseProhibited = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.prototype.status = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(24).uint32(e.status);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubMemberReleaseProhibited(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

case 3:
n.status = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.status && e.hasOwnProperty("status") && !s.isInteger(e.status) ? "status: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubMemberReleaseProhibited) return e;
var t = new l.pb.CSClubMemberReleaseProhibited();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.status && (t.status = e.status >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
o.status = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubMemberReleaseProhibited = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubMemberReleaseProhibited(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubMemberReleaseProhibited) return e;
var t = new l.pb.SCClubMemberReleaseProhibited();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubMemberReleaseProhibited.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubApplyList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyList) return e;
var t = new l.pb.CSClubApplyList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubApplyList.Info.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubApplyList.Info.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubApplyList.Info.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyList) return e;
var t = new l.pb.SCClubApplyList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubApplyList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubApplyList.data: object expected");
t.data[o] = l.pb.SCClubApplyList.Info.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubApplyList.Info.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.sex = 0;
e.prototype.policy = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(26).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(34).string(e.code);
null != e.sex && Object.hasOwnProperty.call(e, "sex") && t.uint32(40).uint32(e.sex);
null != e.policy && Object.hasOwnProperty.call(e, "policy") && t.uint32(48).int32(e.policy);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyList.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.nickname = e.string();
break;

case 4:
n.code = e.string();
break;

case 5:
n.sex = e.uint32();
break;

case 6:
n.policy = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id)) return "id: integer expected";
if (null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl)) return "avatarUrl: string expected";
if (null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname)) return "nickname: string expected";
if (null != e.code && e.hasOwnProperty("code") && !s.isString(e.code)) return "code: string expected";
if (null != e.sex && e.hasOwnProperty("sex") && !s.isInteger(e.sex)) return "sex: integer expected";
if (null != e.policy && e.hasOwnProperty("policy")) switch (e.policy) {
default:
return "policy: enum value expected";

case 0:
case 1:
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyList.Info) return e;
var t = new l.pb.SCClubApplyList.Info();
null != e.id && (t.id = e.id >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
null != e.sex && (t.sex = e.sex >>> 0);
switch (e.policy) {
case "Join":
case 0:
t.policy = 0;
break;

case "Quit":
case 1:
t.policy = 1;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.sex = 0;
o.policy = t.enums === String ? "Join" : 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.sex && e.hasOwnProperty("sex") && (o.sex = e.sex);
null != e.policy && e.hasOwnProperty("policy") && (o.policy = t.enums === String ? l.pb.SCClubApplyList.Info.Policy[e.policy] : e.policy);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Policy = function() {
var e = {}, t = Object.create(e);
t[e[0] = "Join"] = 0;
t[e[1] = "Quit"] = 1;
return t;
}();
return e;
}();
return e;
}();
e.CSClubApplyAgree = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyAgree(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyAgree) return e;
var t = new l.pb.CSClubApplyAgree();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyAgree = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyAgree(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyAgree) return e;
var t = new l.pb.SCClubApplyAgree();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyAgree.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubApplyReject = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyReject(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyReject) return e;
var t = new l.pb.CSClubApplyReject();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyReject = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyReject(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyReject) return e;
var t = new l.pb.SCClubApplyReject();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyReject.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubApplyInviteUserSearch = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userCode = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userCode && Object.hasOwnProperty.call(e, "userCode") && t.uint32(18).string(e.userCode);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyInviteUserSearch(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userCode = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userCode && e.hasOwnProperty("userCode") && !s.isString(e.userCode) ? "userCode: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyInviteUserSearch) return e;
var t = new l.pb.CSClubApplyInviteUserSearch();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userCode && (t.userCode = String(e.userCode));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userCode = "";
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userCode && e.hasOwnProperty("userCode") && (o.userCode = e.userCode);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyInviteUserSearch = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.info = null;
e.prototype.member = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.info && Object.hasOwnProperty.call(e, "info") && l.pb.SCClubApplyInviteUserSearch.Info.encode(e.info, t.uint32(18).fork()).ldelim();
null != e.member && Object.hasOwnProperty.call(e, "member") && t.uint32(24).bool(e.member);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyInviteUserSearch(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.info = l.pb.SCClubApplyInviteUserSearch.Info.decode(e, e.uint32());
break;

case 3:
n.member = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (t = l.pb.SCResult.verify(e.res)) return "res." + t;
}
if (null != e.info && e.hasOwnProperty("info")) {
var t;
if (t = l.pb.SCClubApplyInviteUserSearch.Info.verify(e.info)) return "info." + t;
}
return null != e.member && e.hasOwnProperty("member") && "boolean" != typeof e.member ? "member: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyInviteUserSearch) return e;
var t = new l.pb.SCClubApplyInviteUserSearch();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyInviteUserSearch.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (null != e.info) {
if ("object" !== n(e.info)) throw TypeError(".pb.SCClubApplyInviteUserSearch.info: object expected");
t.info = l.pb.SCClubApplyInviteUserSearch.Info.fromObject(e.info);
}
null != e.member && (t.member = Boolean(e.member));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.info = null;
o.member = !1;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.info && e.hasOwnProperty("info") && (o.info = l.pb.SCClubApplyInviteUserSearch.Info.toObject(e.info, t));
null != e.member && e.hasOwnProperty("member") && (o.member = e.member);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.avatarUrl = "";
e.prototype.code = "";
e.prototype.nickname = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(34).string(e.nickname);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyInviteUserSearch.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.nickname = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyInviteUserSearch.Info) return e;
var t = new l.pb.SCClubApplyInviteUserSearch.Info();
null != e.id && (t.id = e.id >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.code && (t.code = String(e.code));
null != e.nickname && (t.nickname = String(e.nickname));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.avatarUrl = "";
o.code = "";
o.nickname = "";
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubApplyInvite = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyInvite(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyInvite) return e;
var t = new l.pb.CSClubApplyInvite();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyInvite = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyInvite(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyInvite) return e;
var t = new l.pb.SCClubApplyInvite();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyInvite.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubQuitRecordList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubQuitRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubQuitRecordList) return e;
var t = new l.pb.CSClubQuitRecordList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubQuitRecordList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubQuitRecordList.Info.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubQuitRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubQuitRecordList.Info.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubQuitRecordList.Info.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubQuitRecordList) return e;
var t = new l.pb.SCClubQuitRecordList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubQuitRecordList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubQuitRecordList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubQuitRecordList.data: object expected");
t.data[o] = l.pb.SCClubQuitRecordList.Info.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubQuitRecordList.Info.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.source = 0;
e.prototype.ts = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.source && Object.hasOwnProperty.call(e, "source") && t.uint32(32).int32(e.source);
null != e.ts && Object.hasOwnProperty.call(e, "ts") && t.uint32(40).uint32(e.ts);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubQuitRecordList.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.source = e.int32();
break;

case 5:
n.ts = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl)) return "avatarUrl: string expected";
if (null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname)) return "nickname: string expected";
if (null != e.code && e.hasOwnProperty("code") && !s.isString(e.code)) return "code: string expected";
if (null != e.source && e.hasOwnProperty("source")) switch (e.source) {
default:
return "source: enum value expected";

case 0:
case 1:
}
return null != e.ts && e.hasOwnProperty("ts") && !s.isInteger(e.ts) ? "ts: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubQuitRecordList.Info) return e;
var t = new l.pb.SCClubQuitRecordList.Info();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
switch (e.source) {
case "SELF":
case 0:
t.source = 0;
break;

case "ADMIN":
case 1:
t.source = 1;
}
null != e.ts && (t.ts = e.ts >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.source = t.enums === String ? "SELF" : 0;
o.ts = 0;
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.source && e.hasOwnProperty("source") && (o.source = t.enums === String ? l.pb.SCClubQuitRecordList.Info.Source[e.source] : e.source);
null != e.ts && e.hasOwnProperty("ts") && (o.ts = e.ts);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Source = function() {
var e = {}, t = Object.create(e);
t[e[0] = "SELF"] = 0;
t[e[1] = "ADMIN"] = 1;
return t;
}();
return e;
}();
return e;
}();
e.CSOpRecordList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSOpRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSOpRecordList) return e;
var t = new l.pb.CSOpRecordList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCOpRecordList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCOpRecordList.Info.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCOpRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCOpRecordList.Info.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCOpRecordList.Info.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCOpRecordList) return e;
var t = new l.pb.SCOpRecordList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCOpRecordList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCOpRecordList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCOpRecordList.data: object expected");
t.data[o] = l.pb.SCOpRecordList.Info.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCOpRecordList.Info.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
this.user = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.opAvatarUrl = "";
e.prototype.opNickname = "";
e.prototype.opCode = "";
e.prototype.source = 0;
e.prototype.opObjects = 0;
e.prototype.user = s.emptyArray;
e.prototype.roomCode = "";
e.prototype.ts = 0;
e.prototype.gameName = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.opAvatarUrl && Object.hasOwnProperty.call(e, "opAvatarUrl") && t.uint32(10).string(e.opAvatarUrl);
null != e.opNickname && Object.hasOwnProperty.call(e, "opNickname") && t.uint32(18).string(e.opNickname);
null != e.opCode && Object.hasOwnProperty.call(e, "opCode") && t.uint32(26).string(e.opCode);
null != e.source && Object.hasOwnProperty.call(e, "source") && t.uint32(32).int32(e.source);
null != e.opObjects && Object.hasOwnProperty.call(e, "opObjects") && t.uint32(40).uint32(e.opObjects);
if (null != e.user && e.user.length) for (var o = 0; o < e.user.length; ++o) l.pb.SCOpRecordList.Info.UserInfo.encode(e.user[o], t.uint32(50).fork()).ldelim();
null != e.roomCode && Object.hasOwnProperty.call(e, "roomCode") && t.uint32(58).string(e.roomCode);
null != e.ts && Object.hasOwnProperty.call(e, "ts") && t.uint32(64).uint32(e.ts);
null != e.gameName && Object.hasOwnProperty.call(e, "gameName") && t.uint32(74).string(e.gameName);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCOpRecordList.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.opAvatarUrl = e.string();
break;

case 2:
n.opNickname = e.string();
break;

case 3:
n.opCode = e.string();
break;

case 4:
n.source = e.int32();
break;

case 5:
n.opObjects = e.uint32();
break;

case 6:
n.user && n.user.length || (n.user = []);
n.user.push(l.pb.SCOpRecordList.Info.UserInfo.decode(e, e.uint32()));
break;

case 7:
n.roomCode = e.string();
break;

case 8:
n.ts = e.uint32();
break;

case 9:
n.gameName = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.opAvatarUrl && e.hasOwnProperty("opAvatarUrl") && !s.isString(e.opAvatarUrl)) return "opAvatarUrl: string expected";
if (null != e.opNickname && e.hasOwnProperty("opNickname") && !s.isString(e.opNickname)) return "opNickname: string expected";
if (null != e.opCode && e.hasOwnProperty("opCode") && !s.isString(e.opCode)) return "opCode: string expected";
if (null != e.source && e.hasOwnProperty("source")) switch (e.source) {
default:
return "source: enum value expected";

case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
case 8:
case 9:
case 10:
case 11:
case 12:
case 13:
case 14:
case 15:
case 16:
case 17:
case 18:
case 19:
case 20:
}
if (null != e.opObjects && e.hasOwnProperty("opObjects") && !s.isInteger(e.opObjects)) return "opObjects: integer expected";
if (null != e.user && e.hasOwnProperty("user")) {
if (!Array.isArray(e.user)) return "user: array expected";
for (var t = 0; t < e.user.length; ++t) {
var o = l.pb.SCOpRecordList.Info.UserInfo.verify(e.user[t]);
if (o) return "user." + o;
}
}
return null != e.roomCode && e.hasOwnProperty("roomCode") && !s.isString(e.roomCode) ? "roomCode: string expected" : null != e.ts && e.hasOwnProperty("ts") && !s.isInteger(e.ts) ? "ts: integer expected" : null != e.gameName && e.hasOwnProperty("gameName") && !s.isString(e.gameName) ? "gameName: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCOpRecordList.Info) return e;
var t = new l.pb.SCOpRecordList.Info();
null != e.opAvatarUrl && (t.opAvatarUrl = String(e.opAvatarUrl));
null != e.opNickname && (t.opNickname = String(e.opNickname));
null != e.opCode && (t.opCode = String(e.opCode));
switch (e.source) {
case "Null":
case 0:
t.source = 0;
break;

case "Allow":
case 1:
t.source = 1;
break;

case "Refuse":
case 2:
t.source = 2;
break;

case "Invitation":
case 3:
t.source = 3;
break;

case "UpAdmin":
case 4:
t.source = 4;
break;

case "DownAdmin":
case 5:
t.source = 5;
break;

case "Frozen":
case 6:
t.source = 6;
break;

case "Thaw":
case 7:
t.source = 7;
break;

case "ReleaseProhibited":
case 8:
t.source = 8;
break;

case "Reset":
case 9:
t.source = 9;
break;

case "DissolveRoom":
case 10:
t.source = 10;
break;

case "FixClub":
case 11:
t.source = 11;
break;

case "FixClubGame":
case 12:
t.source = 12;
break;

case "AddClubGame":
case 13:
t.source = 13;
break;

case "DelClubGame":
case 14:
t.source = 14;
break;

case "DissolveClub":
case 15:
t.source = 15;
break;

case "KickOut":
case 16:
t.source = 16;
break;

case "AddClub":
case 17:
t.source = 17;
break;

case "DelClub":
case 18:
t.source = 18;
break;

case "FixClubName":
case 19:
t.source = 19;
break;

case "FixClubAnnouncement":
case 20:
t.source = 20;
}
null != e.opObjects && (t.opObjects = e.opObjects >>> 0);
if (e.user) {
if (!Array.isArray(e.user)) throw TypeError(".pb.SCOpRecordList.Info.user: array expected");
t.user = [];
for (var o = 0; o < e.user.length; ++o) {
if ("object" !== n(e.user[o])) throw TypeError(".pb.SCOpRecordList.Info.user: object expected");
t.user[o] = l.pb.SCOpRecordList.Info.UserInfo.fromObject(e.user[o]);
}
}
null != e.roomCode && (t.roomCode = String(e.roomCode));
null != e.ts && (t.ts = e.ts >>> 0);
null != e.gameName && (t.gameName = String(e.gameName));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.user = []);
if (t.defaults) {
o.opAvatarUrl = "";
o.opNickname = "";
o.opCode = "";
o.source = t.enums === String ? "Null" : 0;
o.opObjects = 0;
o.roomCode = "";
o.ts = 0;
o.gameName = "";
}
null != e.opAvatarUrl && e.hasOwnProperty("opAvatarUrl") && (o.opAvatarUrl = e.opAvatarUrl);
null != e.opNickname && e.hasOwnProperty("opNickname") && (o.opNickname = e.opNickname);
null != e.opCode && e.hasOwnProperty("opCode") && (o.opCode = e.opCode);
null != e.source && e.hasOwnProperty("source") && (o.source = t.enums === String ? l.pb.SCOpRecordList.Info.Source[e.source] : e.source);
null != e.opObjects && e.hasOwnProperty("opObjects") && (o.opObjects = e.opObjects);
if (e.user && e.user.length) {
o.user = [];
for (var n = 0; n < e.user.length; ++n) o.user[n] = l.pb.SCOpRecordList.Info.UserInfo.toObject(e.user[n], t);
}
null != e.roomCode && e.hasOwnProperty("roomCode") && (o.roomCode = e.roomCode);
null != e.ts && e.hasOwnProperty("ts") && (o.ts = e.ts);
null != e.gameName && e.hasOwnProperty("gameName") && (o.gameName = e.gameName);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Source = function() {
var e = {}, t = Object.create(e);
t[e[0] = "Null"] = 0;
t[e[1] = "Allow"] = 1;
t[e[2] = "Refuse"] = 2;
t[e[3] = "Invitation"] = 3;
t[e[4] = "UpAdmin"] = 4;
t[e[5] = "DownAdmin"] = 5;
t[e[6] = "Frozen"] = 6;
t[e[7] = "Thaw"] = 7;
t[e[8] = "ReleaseProhibited"] = 8;
t[e[9] = "Reset"] = 9;
t[e[10] = "DissolveRoom"] = 10;
t[e[11] = "FixClub"] = 11;
t[e[12] = "FixClubGame"] = 12;
t[e[13] = "AddClubGame"] = 13;
t[e[14] = "DelClubGame"] = 14;
t[e[15] = "DissolveClub"] = 15;
t[e[16] = "KickOut"] = 16;
t[e[17] = "AddClub"] = 17;
t[e[18] = "DelClub"] = 18;
t[e[19] = "FixClubName"] = 19;
t[e[20] = "FixClubAnnouncement"] = 20;
return t;
}();
e.UserInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCOpRecordList.Info.UserInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCOpRecordList.Info.UserInfo) return e;
var t = new l.pb.SCOpRecordList.Info.UserInfo();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
return e;
}();
e.CSClubApplyInviteSubUserList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(24).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(32).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(40).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyInviteSubUserList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.limit = e.uint32();
break;

case 3:
n.offset = e.uint32();
break;

case 4:
n.page = e.uint32();
break;

case 5:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyInviteSubUserList) return e;
var t = new l.pb.CSClubApplyInviteSubUserList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyInviteSubUserList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubApplyInviteSubUserList.Info.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyInviteSubUserList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubApplyInviteSubUserList.Info.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubApplyInviteSubUserList.Info.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyInviteSubUserList) return e;
var t = new l.pb.SCClubApplyInviteSubUserList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyInviteSubUserList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubApplyInviteSubUserList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubApplyInviteSubUserList.data: object expected");
t.data[o] = l.pb.SCClubApplyInviteSubUserList.Info.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubApplyInviteSubUserList.Info.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.userId = 0;
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(8).uint32(e.userId);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(26).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(34).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyInviteSubUserList.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.userId = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.nickname = e.string();
break;

case 4:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyInviteSubUserList.Info) return e;
var t = new l.pb.SCClubApplyInviteSubUserList.Info();
null != e.userId && (t.userId = e.userId >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.userId = 0;
o.avatarUrl = "";
o.nickname = "";
o.code = "";
}
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubApplyInviteSubUser = function() {
function e(e) {
this.userId = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
if (null != e.userId && e.userId.length) {
t.uint32(18).fork();
for (var o = 0; o < e.userId.length; ++o) t.uint32(e.userId[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubApplyInviteSubUser(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId && n.userId.length || (n.userId = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.userId.push(e.uint32()); else n.userId.push(e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId)) return "clubId: integer expected";
if (null != e.userId && e.hasOwnProperty("userId")) {
if (!Array.isArray(e.userId)) return "userId: array expected";
for (var t = 0; t < e.userId.length; ++t) if (!s.isInteger(e.userId[t])) return "userId: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubApplyInviteSubUser) return e;
var t = new l.pb.CSClubApplyInviteSubUser();
null != e.clubId && (t.clubId = e.clubId >>> 0);
if (e.userId) {
if (!Array.isArray(e.userId)) throw TypeError(".pb.CSClubApplyInviteSubUser.userId: array expected");
t.userId = [];
for (var o = 0; o < e.userId.length; ++o) t.userId[o] = e.userId[o] >>> 0;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.userId = []);
t.defaults && (o.clubId = 0);
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
if (e.userId && e.userId.length) {
o.userId = [];
for (var n = 0; n < e.userId.length; ++n) o.userId[n] = e.userId[n];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubApplyInviteSubUser = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubApplyInviteSubUser(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubApplyInviteSubUser) return e;
var t = new l.pb.SCClubApplyInviteSubUser();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubApplyInviteSubUser.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.name = "";
e.prototype.announcement = "";
e.prototype.emptyRoomLast = !1;
e.prototype.roomInvite = !1;
e.prototype.closed = !1;
e.prototype.playerNodismissRoom = !1;
e.prototype.quitApply = !1;
e.prototype.antiAddiction = !1;
e.prototype.member_Record = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.announcement && Object.hasOwnProperty.call(e, "announcement") && t.uint32(26).string(e.announcement);
null != e.emptyRoomLast && Object.hasOwnProperty.call(e, "emptyRoomLast") && t.uint32(32).bool(e.emptyRoomLast);
null != e.roomInvite && Object.hasOwnProperty.call(e, "roomInvite") && t.uint32(40).bool(e.roomInvite);
null != e.closed && Object.hasOwnProperty.call(e, "closed") && t.uint32(48).bool(e.closed);
null != e.playerNodismissRoom && Object.hasOwnProperty.call(e, "playerNodismissRoom") && t.uint32(56).bool(e.playerNodismissRoom);
null != e.quitApply && Object.hasOwnProperty.call(e, "quitApply") && t.uint32(64).bool(e.quitApply);
null != e.antiAddiction && Object.hasOwnProperty.call(e, "antiAddiction") && t.uint32(72).bool(e.antiAddiction);
null != e.member_Record && Object.hasOwnProperty.call(e, "member_Record") && t.uint32(80).bool(e.member_Record);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.name = e.string();
break;

case 3:
n.announcement = e.string();
break;

case 4:
n.emptyRoomLast = e.bool();
break;

case 5:
n.roomInvite = e.bool();
break;

case 6:
n.closed = e.bool();
break;

case 7:
n.playerNodismissRoom = e.bool();
break;

case 8:
n.quitApply = e.bool();
break;

case 9:
n.antiAddiction = e.bool();
break;

case 10:
n.member_Record = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.announcement && e.hasOwnProperty("announcement") && !s.isString(e.announcement) ? "announcement: string expected" : null != e.emptyRoomLast && e.hasOwnProperty("emptyRoomLast") && "boolean" != typeof e.emptyRoomLast ? "emptyRoomLast: boolean expected" : null != e.roomInvite && e.hasOwnProperty("roomInvite") && "boolean" != typeof e.roomInvite ? "roomInvite: boolean expected" : null != e.closed && e.hasOwnProperty("closed") && "boolean" != typeof e.closed ? "closed: boolean expected" : null != e.playerNodismissRoom && e.hasOwnProperty("playerNodismissRoom") && "boolean" != typeof e.playerNodismissRoom ? "playerNodismissRoom: boolean expected" : null != e.quitApply && e.hasOwnProperty("quitApply") && "boolean" != typeof e.quitApply ? "quitApply: boolean expected" : null != e.antiAddiction && e.hasOwnProperty("antiAddiction") && "boolean" != typeof e.antiAddiction ? "antiAddiction: boolean expected" : null != e.member_Record && e.hasOwnProperty("member_Record") && "boolean" != typeof e.member_Record ? "member_Record: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubEdit) return e;
var t = new l.pb.CSClubEdit();
null != e.id && (t.id = e.id >>> 0);
null != e.name && (t.name = String(e.name));
null != e.announcement && (t.announcement = String(e.announcement));
null != e.emptyRoomLast && (t.emptyRoomLast = Boolean(e.emptyRoomLast));
null != e.roomInvite && (t.roomInvite = Boolean(e.roomInvite));
null != e.closed && (t.closed = Boolean(e.closed));
null != e.playerNodismissRoom && (t.playerNodismissRoom = Boolean(e.playerNodismissRoom));
null != e.quitApply && (t.quitApply = Boolean(e.quitApply));
null != e.antiAddiction && (t.antiAddiction = Boolean(e.antiAddiction));
null != e.member_Record && (t.member_Record = Boolean(e.member_Record));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.name = "";
o.announcement = "";
o.emptyRoomLast = !1;
o.roomInvite = !1;
o.closed = !1;
o.playerNodismissRoom = !1;
o.quitApply = !1;
o.antiAddiction = !1;
o.member_Record = !1;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.announcement && e.hasOwnProperty("announcement") && (o.announcement = e.announcement);
null != e.emptyRoomLast && e.hasOwnProperty("emptyRoomLast") && (o.emptyRoomLast = e.emptyRoomLast);
null != e.roomInvite && e.hasOwnProperty("roomInvite") && (o.roomInvite = e.roomInvite);
null != e.closed && e.hasOwnProperty("closed") && (o.closed = e.closed);
null != e.playerNodismissRoom && e.hasOwnProperty("playerNodismissRoom") && (o.playerNodismissRoom = e.playerNodismissRoom);
null != e.quitApply && e.hasOwnProperty("quitApply") && (o.quitApply = e.quitApply);
null != e.antiAddiction && e.hasOwnProperty("antiAddiction") && (o.antiAddiction = e.antiAddiction);
null != e.member_Record && e.hasOwnProperty("member_Record") && (o.member_Record = e.member_Record);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubEdit) return e;
var t = new l.pb.SCClubEdit();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubEdit.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubEditFatigueVal = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.FatigueVal = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.FatigueVal && Object.hasOwnProperty.call(e, "FatigueVal") && t.uint32(16).int32(e.FatigueVal);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubEditFatigueVal(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.FatigueVal = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.FatigueVal && e.hasOwnProperty("FatigueVal") && !s.isInteger(e.FatigueVal) ? "FatigueVal: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubEditFatigueVal) return e;
var t = new l.pb.CSClubEditFatigueVal();
null != e.id && (t.id = e.id >>> 0);
null != e.FatigueVal && (t.FatigueVal = 0 | e.FatigueVal);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.FatigueVal = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.FatigueVal && e.hasOwnProperty("FatigueVal") && (o.FatigueVal = e.FatigueVal);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubEditFatigueVal = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubEditFatigueVal(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubEditFatigueVal) return e;
var t = new l.pb.SCClubEditFatigueVal();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubEditFatigueVal.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubRecordStatisticsDayList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userCode = "";
e.prototype.date = 0;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.prototype.startDate = 0;
e.prototype.endDate = 0;
e.prototype.mergeClubId = 0;
e.prototype.culClubLevel = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userCode && Object.hasOwnProperty.call(e, "userCode") && t.uint32(18).string(e.userCode);
null != e.date && Object.hasOwnProperty.call(e, "date") && t.uint32(24).uint32(e.date);
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(32).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(40).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(48).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(56).uint32(e.perPage);
null != e.startDate && Object.hasOwnProperty.call(e, "startDate") && t.uint32(64).uint32(e.startDate);
null != e.endDate && Object.hasOwnProperty.call(e, "endDate") && t.uint32(72).uint32(e.endDate);
null != e.mergeClubId && Object.hasOwnProperty.call(e, "mergeClubId") && t.uint32(80).uint32(e.mergeClubId);
null != e.culClubLevel && Object.hasOwnProperty.call(e, "culClubLevel") && t.uint32(88).uint32(e.culClubLevel);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRecordStatisticsDayList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userCode = e.string();
break;

case 3:
n.date = e.uint32();
break;

case 4:
n.limit = e.uint32();
break;

case 5:
n.offset = e.uint32();
break;

case 6:
n.page = e.uint32();
break;

case 7:
n.perPage = e.uint32();
break;

case 8:
n.startDate = e.uint32();
break;

case 9:
n.endDate = e.uint32();
break;

case 10:
n.mergeClubId = e.uint32();
break;

case 11:
n.culClubLevel = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userCode && e.hasOwnProperty("userCode") && !s.isString(e.userCode) ? "userCode: string expected" : null != e.date && e.hasOwnProperty("date") && !s.isInteger(e.date) ? "date: integer expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null != e.startDate && e.hasOwnProperty("startDate") && !s.isInteger(e.startDate) ? "startDate: integer expected" : null != e.endDate && e.hasOwnProperty("endDate") && !s.isInteger(e.endDate) ? "endDate: integer expected" : null != e.mergeClubId && e.hasOwnProperty("mergeClubId") && !s.isInteger(e.mergeClubId) ? "mergeClubId: integer expected" : null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && !s.isInteger(e.culClubLevel) ? "culClubLevel: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRecordStatisticsDayList) return e;
var t = new l.pb.CSClubRecordStatisticsDayList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userCode && (t.userCode = String(e.userCode));
null != e.date && (t.date = e.date >>> 0);
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
null != e.startDate && (t.startDate = e.startDate >>> 0);
null != e.endDate && (t.endDate = e.endDate >>> 0);
null != e.mergeClubId && (t.mergeClubId = e.mergeClubId >>> 0);
null != e.culClubLevel && (t.culClubLevel = e.culClubLevel >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userCode = "";
o.date = 0;
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
o.startDate = 0;
o.endDate = 0;
o.mergeClubId = 0;
o.culClubLevel = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userCode && e.hasOwnProperty("userCode") && (o.userCode = e.userCode);
null != e.date && e.hasOwnProperty("date") && (o.date = e.date);
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
null != e.startDate && e.hasOwnProperty("startDate") && (o.startDate = e.startDate);
null != e.endDate && e.hasOwnProperty("endDate") && (o.endDate = e.endDate);
null != e.mergeClubId && e.hasOwnProperty("mergeClubId") && (o.mergeClubId = e.mergeClubId);
null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && (o.culClubLevel = e.culClubLevel);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRecordStatisticsDayList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubRecordStatisticsDayList.Info.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRecordStatisticsDayList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubRecordStatisticsDayList.Info.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubRecordStatisticsDayList.Info.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRecordStatisticsDayList) return e;
var t = new l.pb.SCClubRecordStatisticsDayList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRecordStatisticsDayList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubRecordStatisticsDayList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubRecordStatisticsDayList.data: object expected");
t.data[o] = l.pb.SCClubRecordStatisticsDayList.Info.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubRecordStatisticsDayList.Info.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.winner = 0;
e.prototype.score = 0;
e.prototype.number = 0;
e.prototype.scoreRatio = 0;
e.prototype.remark = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.winner && Object.hasOwnProperty.call(e, "winner") && t.uint32(32).uint32(e.winner);
null != e.score && Object.hasOwnProperty.call(e, "score") && t.uint32(40).int32(e.score);
null != e.number && Object.hasOwnProperty.call(e, "number") && t.uint32(48).uint32(e.number);
null != e.scoreRatio && Object.hasOwnProperty.call(e, "scoreRatio") && t.uint32(56).int32(e.scoreRatio);
null != e.remark && Object.hasOwnProperty.call(e, "remark") && t.uint32(66).string(e.remark);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRecordStatisticsDayList.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.winner = e.uint32();
break;

case 5:
n.score = e.int32();
break;

case 6:
n.number = e.uint32();
break;

case 7:
n.scoreRatio = e.int32();
break;

case 8:
n.remark = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.winner && e.hasOwnProperty("winner") && !s.isInteger(e.winner) ? "winner: integer expected" : null != e.score && e.hasOwnProperty("score") && !s.isInteger(e.score) ? "score: integer expected" : null != e.number && e.hasOwnProperty("number") && !s.isInteger(e.number) ? "number: integer expected" : null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && !s.isInteger(e.scoreRatio) ? "scoreRatio: integer expected" : null != e.remark && e.hasOwnProperty("remark") && !s.isString(e.remark) ? "remark: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRecordStatisticsDayList.Info) return e;
var t = new l.pb.SCClubRecordStatisticsDayList.Info();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
null != e.winner && (t.winner = e.winner >>> 0);
null != e.score && (t.score = 0 | e.score);
null != e.number && (t.number = e.number >>> 0);
null != e.scoreRatio && (t.scoreRatio = 0 | e.scoreRatio);
null != e.remark && (t.remark = String(e.remark));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.winner = 0;
o.score = 0;
o.number = 0;
o.scoreRatio = 0;
o.remark = "";
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.winner && e.hasOwnProperty("winner") && (o.winner = e.winner);
null != e.score && e.hasOwnProperty("score") && (o.score = e.score);
null != e.number && e.hasOwnProperty("number") && (o.number = e.number);
null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && (o.scoreRatio = e.scoreRatio);
null != e.remark && e.hasOwnProperty("remark") && (o.remark = e.remark);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubGameUserDayRecordList = function() {
function e(e) {
this.time = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userCode = "";
e.prototype.time = s.emptyArray;
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userCode && Object.hasOwnProperty.call(e, "userCode") && t.uint32(18).string(e.userCode);
if (null != e.time && e.time.length) for (var o = 0; o < e.time.length; ++o) l.pb.CSClubGameUserDayRecordList.time_data.encode(e.time[o], t.uint32(26).fork()).ldelim();
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(32).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(40).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(48).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(56).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameUserDayRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userCode = e.string();
break;

case 3:
n.time && n.time.length || (n.time = []);
n.time.push(l.pb.CSClubGameUserDayRecordList.time_data.decode(e, e.uint32()));
break;

case 4:
n.limit = e.uint32();
break;

case 5:
n.offset = e.uint32();
break;

case 6:
n.page = e.uint32();
break;

case 7:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId)) return "clubId: integer expected";
if (null != e.userCode && e.hasOwnProperty("userCode") && !s.isString(e.userCode)) return "userCode: string expected";
if (null != e.time && e.hasOwnProperty("time")) {
if (!Array.isArray(e.time)) return "time: array expected";
for (var t = 0; t < e.time.length; ++t) {
var o = l.pb.CSClubGameUserDayRecordList.time_data.verify(e.time[t]);
if (o) return "time." + o;
}
}
return null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameUserDayRecordList) return e;
var t = new l.pb.CSClubGameUserDayRecordList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userCode && (t.userCode = String(e.userCode));
if (e.time) {
if (!Array.isArray(e.time)) throw TypeError(".pb.CSClubGameUserDayRecordList.time: array expected");
t.time = [];
for (var o = 0; o < e.time.length; ++o) {
if ("object" !== n(e.time[o])) throw TypeError(".pb.CSClubGameUserDayRecordList.time: object expected");
t.time[o] = l.pb.CSClubGameUserDayRecordList.time_data.fromObject(e.time[o]);
}
}
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.time = []);
if (t.defaults) {
o.clubId = 0;
o.userCode = "";
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userCode && e.hasOwnProperty("userCode") && (o.userCode = e.userCode);
if (e.time && e.time.length) {
o.time = [];
for (var n = 0; n < e.time.length; ++n) o.time[n] = l.pb.CSClubGameUserDayRecordList.time_data.toObject(e.time[n], t);
}
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.time_data = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.keyS = "";
e.prototype.date = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.keyS && Object.hasOwnProperty.call(e, "keyS") && t.uint32(10).string(e.keyS);
null != e.date && Object.hasOwnProperty.call(e, "date") && t.uint32(16).uint32(e.date);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameUserDayRecordList.time_data(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.keyS = e.string();
break;

case 2:
n.date = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.keyS && e.hasOwnProperty("keyS") && !s.isString(e.keyS) ? "keyS: string expected" : null != e.date && e.hasOwnProperty("date") && !s.isInteger(e.date) ? "date: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameUserDayRecordList.time_data) return e;
var t = new l.pb.CSClubGameUserDayRecordList.time_data();
null != e.keyS && (t.keyS = String(e.keyS));
null != e.date && (t.date = e.date >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.keyS = "";
o.date = 0;
}
null != e.keyS && e.hasOwnProperty("keyS") && (o.keyS = e.keyS);
null != e.date && e.hasOwnProperty("date") && (o.date = e.date);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.SCClubGameUserDayRecordList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubGameUserDayRecordList.Info.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameUserDayRecordList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubGameUserDayRecordList.Info.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubGameUserDayRecordList.Info.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameUserDayRecordList) return e;
var t = new l.pb.SCClubGameUserDayRecordList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubGameUserDayRecordList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubGameUserDayRecordList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubGameUserDayRecordList.data: object expected");
t.data[o] = l.pb.SCClubGameUserDayRecordList.Info.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubGameUserDayRecordList.Info.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Info = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.avatarUrl = "";
e.prototype.nickname = "";
e.prototype.code = "";
e.prototype.winner = 0;
e.prototype.score = 0;
e.prototype.number = 0;
e.prototype.scoreRatio = 0;
e.prototype.keyS = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(10).string(e.avatarUrl);
null != e.nickname && Object.hasOwnProperty.call(e, "nickname") && t.uint32(18).string(e.nickname);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.winner && Object.hasOwnProperty.call(e, "winner") && t.uint32(32).uint32(e.winner);
null != e.score && Object.hasOwnProperty.call(e, "score") && t.uint32(40).int32(e.score);
null != e.number && Object.hasOwnProperty.call(e, "number") && t.uint32(48).uint32(e.number);
null != e.scoreRatio && Object.hasOwnProperty.call(e, "scoreRatio") && t.uint32(56).int32(e.scoreRatio);
null != e.keyS && Object.hasOwnProperty.call(e, "keyS") && t.uint32(66).string(e.keyS);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameUserDayRecordList.Info(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.avatarUrl = e.string();
break;

case 2:
n.nickname = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.winner = e.uint32();
break;

case 5:
n.score = e.int32();
break;

case 6:
n.number = e.uint32();
break;

case 7:
n.scoreRatio = e.int32();
break;

case 8:
n.keyS = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.nickname && e.hasOwnProperty("nickname") && !s.isString(e.nickname) ? "nickname: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.winner && e.hasOwnProperty("winner") && !s.isInteger(e.winner) ? "winner: integer expected" : null != e.score && e.hasOwnProperty("score") && !s.isInteger(e.score) ? "score: integer expected" : null != e.number && e.hasOwnProperty("number") && !s.isInteger(e.number) ? "number: integer expected" : null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && !s.isInteger(e.scoreRatio) ? "scoreRatio: integer expected" : null != e.keyS && e.hasOwnProperty("keyS") && !s.isString(e.keyS) ? "keyS: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameUserDayRecordList.Info) return e;
var t = new l.pb.SCClubGameUserDayRecordList.Info();
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.nickname && (t.nickname = String(e.nickname));
null != e.code && (t.code = String(e.code));
null != e.winner && (t.winner = e.winner >>> 0);
null != e.score && (t.score = 0 | e.score);
null != e.number && (t.number = e.number >>> 0);
null != e.scoreRatio && (t.scoreRatio = 0 | e.scoreRatio);
null != e.keyS && (t.keyS = String(e.keyS));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.avatarUrl = "";
o.nickname = "";
o.code = "";
o.winner = 0;
o.score = 0;
o.number = 0;
o.scoreRatio = 0;
o.keyS = "";
}
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.nickname && e.hasOwnProperty("nickname") && (o.nickname = e.nickname);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.winner && e.hasOwnProperty("winner") && (o.winner = e.winner);
null != e.score && e.hasOwnProperty("score") && (o.score = e.score);
null != e.number && e.hasOwnProperty("number") && (o.number = e.number);
null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && (o.scoreRatio = e.scoreRatio);
null != e.keyS && e.hasOwnProperty("keyS") && (o.keyS = e.keyS);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubCreate = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.name = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(10).string(e.name);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubCreate(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.name = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubCreate) return e;
var t = new l.pb.CSClubCreate();
null != e.name && (t.name = String(e.name));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.name = "");
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubCreate = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(16).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubCreate(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubCreate) return e;
var t = new l.pb.SCClubCreate();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubCreate.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.id = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubDepositCard = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.number = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.number && Object.hasOwnProperty.call(e, "number") && t.uint32(16).uint32(e.number);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubDepositCard(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.number = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.number && e.hasOwnProperty("number") && !s.isInteger(e.number) ? "number: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubDepositCard) return e;
var t = new l.pb.CSClubDepositCard();
null != e.id && (t.id = e.id >>> 0);
null != e.number && (t.number = e.number >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.number = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.number && e.hasOwnProperty("number") && (o.number = e.number);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubDepositCard = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubDepositCard(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubDepositCard) return e;
var t = new l.pb.SCClubDepositCard();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubDepositCard.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubGameSchemeAdd = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.name = "";
e.prototype.gameType = 0;
e.prototype.num = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(24).uint32(e.gameType);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(32).uint32(e.num);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(40).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(48).uint64(e.param2);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameSchemeAdd(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.name = e.string();
break;

case 3:
n.gameType = e.uint32();
break;

case 4:
n.num = e.uint32();
break;

case 5:
n.param1 = e.uint64();
break;

case 6:
n.param2 = e.uint64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num) ? "num: integer expected" : null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high)) ? "param1: integer|Long expected" : null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high)) ? "param2: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameSchemeAdd) return e;
var t = new l.pb.CSClubGameSchemeAdd();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.name && (t.name = String(e.name));
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.name = "";
o.gameType = 0;
o.num = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubGameSchemeAdd = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameSchemeAdd(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameSchemeAdd) return e;
var t = new l.pb.SCClubGameSchemeAdd();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubGameSchemeAdd.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubGameSchemeEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.name = "";
e.prototype.gameType = 0;
e.prototype.num = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.color = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(24).uint32(e.gameType);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(32).uint32(e.num);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(40).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(48).uint64(e.param2);
null != e.color && Object.hasOwnProperty.call(e, "color") && t.uint32(58).string(e.color);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameSchemeEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.name = e.string();
break;

case 3:
n.gameType = e.uint32();
break;

case 4:
n.num = e.uint32();
break;

case 5:
n.param1 = e.uint64();
break;

case 6:
n.param2 = e.uint64();
break;

case 7:
n.color = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num) ? "num: integer expected" : null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high)) ? "param1: integer|Long expected" : null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high)) ? "param2: integer|Long expected" : null != e.color && e.hasOwnProperty("color") && !s.isString(e.color) ? "color: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameSchemeEdit) return e;
var t = new l.pb.CSClubGameSchemeEdit();
null != e.id && (t.id = e.id >>> 0);
null != e.name && (t.name = String(e.name));
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
null != e.color && (t.color = String(e.color));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.name = "";
o.gameType = 0;
o.num = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
o.color = "";
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
null != e.color && e.hasOwnProperty("color") && (o.color = e.color);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubGameSchemeEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameSchemeEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameSchemeEdit) return e;
var t = new l.pb.SCClubGameSchemeEdit();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubGameSchemeEdit.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubGameSchemeAuto = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.status = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.status && Object.hasOwnProperty.call(e, "status") && t.uint32(16).bool(e.status);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameSchemeAuto(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.status = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.status && e.hasOwnProperty("status") && "boolean" != typeof e.status ? "status: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameSchemeAuto) return e;
var t = new l.pb.CSClubGameSchemeAuto();
null != e.id && (t.id = e.id >>> 0);
null != e.status && (t.status = Boolean(e.status));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.status = !1;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.status && e.hasOwnProperty("status") && (o.status = e.status);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubGameSchemeAuto = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameSchemeAuto(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameSchemeAuto) return e;
var t = new l.pb.SCClubGameSchemeAuto();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubGameSchemeAuto.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubGameSchemeDelete = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubGameSchemeDelete(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubGameSchemeDelete) return e;
var t = new l.pb.CSClubGameSchemeDelete();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubGameSchemeDelete = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubGameSchemeDelete(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubGameSchemeDelete) return e;
var t = new l.pb.SCClubGameSchemeDelete();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubGameSchemeDelete.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCWithAgentInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.username = "";
e.prototype.code = "";
e.prototype.balanceCard = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.username && Object.hasOwnProperty.call(e, "username") && t.uint32(18).string(e.username);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(26).string(e.code);
null != e.balanceCard && Object.hasOwnProperty.call(e, "balanceCard") && t.uint32(32).int32(e.balanceCard);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCWithAgentInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.username = e.string();
break;

case 3:
n.code = e.string();
break;

case 4:
n.balanceCard = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.username && e.hasOwnProperty("username") && !s.isString(e.username) ? "username: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null != e.balanceCard && e.hasOwnProperty("balanceCard") && !s.isInteger(e.balanceCard) ? "balanceCard: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCWithAgentInfo) return e;
var t = new l.pb.SCWithAgentInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCWithAgentInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.username && (t.username = String(e.username));
null != e.code && (t.code = String(e.code));
null != e.balanceCard && (t.balanceCard = 0 | e.balanceCard);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.username = "";
o.code = "";
o.balanceCard = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.username && e.hasOwnProperty("username") && (o.username = e.username);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
null != e.balanceCard && e.hasOwnProperty("balanceCard") && (o.balanceCard = e.balanceCard);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubRoomInviteList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(8).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(16).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(24).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(32).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRoomInviteList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.limit = e.uint32();
break;

case 2:
n.offset = e.uint32();
break;

case 3:
n.page = e.uint32();
break;

case 4:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRoomInviteList) return e;
var t = new l.pb.CSClubRoomInviteList();
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomInviteList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCClubRoomInviteList.User.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomInviteList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCClubRoomInviteList.User.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCClubRoomInviteList.User.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomInviteList) return e;
var t = new l.pb.SCClubRoomInviteList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRoomInviteList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCClubRoomInviteList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCClubRoomInviteList.data: object expected");
t.data[o] = l.pb.SCClubRoomInviteList.User.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCClubRoomInviteList.User.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.User = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.avatarUrl = "";
e.prototype.name = "";
e.prototype.invited = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(18).string(e.avatarUrl);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(26).string(e.name);
null != e.invited && Object.hasOwnProperty.call(e, "invited") && t.uint32(32).bool(e.invited);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomInviteList.User(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.avatarUrl = e.string();
break;

case 3:
n.name = e.string();
break;

case 4:
n.invited = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.invited && e.hasOwnProperty("invited") && "boolean" != typeof e.invited ? "invited: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomInviteList.User) return e;
var t = new l.pb.SCClubRoomInviteList.User();
null != e.id && (t.id = e.id >>> 0);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.name && (t.name = String(e.name));
null != e.invited && (t.invited = Boolean(e.invited));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.avatarUrl = "";
o.name = "";
o.invited = !1;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.invited && e.hasOwnProperty("invited") && (o.invited = e.invited);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSClubRoomInvite = function() {
function e(e) {
this.userId = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.userId = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
if (null != e.userId && e.userId.length) {
t.uint32(10).fork();
for (var o = 0; o < e.userId.length; ++o) t.uint32(e.userId[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRoomInvite(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.userId && n.userId.length || (n.userId = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.userId.push(e.uint32()); else n.userId.push(e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.userId && e.hasOwnProperty("userId")) {
if (!Array.isArray(e.userId)) return "userId: array expected";
for (var t = 0; t < e.userId.length; ++t) if (!s.isInteger(e.userId[t])) return "userId: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRoomInvite) return e;
var t = new l.pb.CSClubRoomInvite();
if (e.userId) {
if (!Array.isArray(e.userId)) throw TypeError(".pb.CSClubRoomInvite.userId: array expected");
t.userId = [];
for (var o = 0; o < e.userId.length; ++o) t.userId[o] = e.userId[o] >>> 0;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.userId = []);
if (e.userId && e.userId.length) {
o.userId = [];
for (var n = 0; n < e.userId.length; ++n) o.userId[n] = e.userId[n];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomInvite = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomInvite(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomInvite) return e;
var t = new l.pb.SCClubRoomInvite();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRoomInvite.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubRoomInviteReject = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.blockClub = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint64(e.id);
null != e.blockClub && Object.hasOwnProperty.call(e, "blockClub") && t.uint32(16).bool(e.blockClub);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRoomInviteReject(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint64();
break;

case 2:
n.blockClub = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !(s.isInteger(e.id) || e.id && s.isInteger(e.id.low) && s.isInteger(e.id.high)) ? "id: integer|Long expected" : null != e.blockClub && e.hasOwnProperty("blockClub") && "boolean" != typeof e.blockClub ? "blockClub: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRoomInviteReject) return e;
var t = new l.pb.CSClubRoomInviteReject();
null != e.id && (s.Long ? (t.id = s.Long.fromValue(e.id)).unsigned = !0 : "string" == typeof e.id ? t.id = parseInt(e.id, 10) : "number" == typeof e.id ? t.id = e.id : "object" === n(e.id) && (t.id = new s.LongBits(e.id.low >>> 0, e.id.high >>> 0).toNumber(!0)));
null != e.blockClub && (t.blockClub = Boolean(e.blockClub));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.id = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.id = t.longs === String ? "0" : 0;
o.blockClub = !1;
}
null != e.id && e.hasOwnProperty("id") && ("number" == typeof e.id ? o.id = t.longs === String ? String(e.id) : e.id : o.id = t.longs === String ? s.Long.prototype.toString.call(e.id) : t.longs === Number ? new s.LongBits(e.id.low >>> 0, e.id.high >>> 0).toNumber(!0) : e.id);
null != e.blockClub && e.hasOwnProperty("blockClub") && (o.blockClub = e.blockClub);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomInviteReject = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomInviteReject(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomInviteReject) return e;
var t = new l.pb.SCClubRoomInviteReject();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRoomInviteReject.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubRoomKickout = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.userCode = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.userCode && Object.hasOwnProperty.call(e, "userCode") && t.uint32(18).string(e.userCode);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubRoomKickout(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.userCode = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.userCode && e.hasOwnProperty("userCode") && !s.isString(e.userCode) ? "userCode: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubRoomKickout) return e;
var t = new l.pb.CSClubRoomKickout();
null != e.id && (t.id = e.id >>> 0);
null != e.userCode && (t.userCode = String(e.userCode));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.userCode = "";
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.userCode && e.hasOwnProperty("userCode") && (o.userCode = e.userCode);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomKickout = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomKickout(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomKickout) return e;
var t = new l.pb.SCClubRoomKickout();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubRoomKickout.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSClubDismiss = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSClubDismiss(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSClubDismiss) return e;
var t = new l.pb.CSClubDismiss();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubDismiss = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubDismiss(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubDismiss) return e;
var t = new l.pb.SCClubDismiss();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCClubDismiss.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSMergeList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.culClubLevel = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.culClubLevel && Object.hasOwnProperty.call(e, "culClubLevel") && t.uint32(16).uint32(e.culClubLevel);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSMergeList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.culClubLevel = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && !s.isInteger(e.culClubLevel) ? "culClubLevel: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSMergeList) return e;
var t = new l.pb.CSMergeList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.culClubLevel && (t.culClubLevel = e.culClubLevel >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.culClubLevel = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && (o.culClubLevel = e.culClubLevel);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCMergeList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCMergeList.Merge.encode(e.data[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCMergeList.Merge.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCMergeList.Merge.verify(e.data[t])) return "data." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeList) return e;
var t = new l.pb.SCMergeList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCMergeList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCMergeList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCMergeList.data: object expected");
t.data[o] = l.pb.SCMergeList.Merge.fromObject(e.data[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCMergeList.Merge.toObject(e.data[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Merge = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.mergeId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.hostClubCode = "";
e.prototype.hostClubName = "";
e.prototype.hostOwnerCode = "";
e.prototype.hostOwnerName = "";
e.prototype.mgClubCode = "";
e.prototype.mgClubName = "";
e.prototype.mgOwnerCode = "";
e.prototype.mgOwnerName = "";
e.prototype.applicantCode = "";
e.prototype.applicantName = "";
e.prototype.mergeWay = 0;
e.prototype.mgTime = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.mergeId && Object.hasOwnProperty.call(e, "mergeId") && t.uint32(8).int64(e.mergeId);
null != e.hostClubCode && Object.hasOwnProperty.call(e, "hostClubCode") && t.uint32(18).string(e.hostClubCode);
null != e.hostClubName && Object.hasOwnProperty.call(e, "hostClubName") && t.uint32(26).string(e.hostClubName);
null != e.hostOwnerCode && Object.hasOwnProperty.call(e, "hostOwnerCode") && t.uint32(34).string(e.hostOwnerCode);
null != e.hostOwnerName && Object.hasOwnProperty.call(e, "hostOwnerName") && t.uint32(42).string(e.hostOwnerName);
null != e.mgClubCode && Object.hasOwnProperty.call(e, "mgClubCode") && t.uint32(50).string(e.mgClubCode);
null != e.mgClubName && Object.hasOwnProperty.call(e, "mgClubName") && t.uint32(58).string(e.mgClubName);
null != e.mgOwnerCode && Object.hasOwnProperty.call(e, "mgOwnerCode") && t.uint32(66).string(e.mgOwnerCode);
null != e.mgOwnerName && Object.hasOwnProperty.call(e, "mgOwnerName") && t.uint32(74).string(e.mgOwnerName);
null != e.applicantCode && Object.hasOwnProperty.call(e, "applicantCode") && t.uint32(82).string(e.applicantCode);
null != e.applicantName && Object.hasOwnProperty.call(e, "applicantName") && t.uint32(90).string(e.applicantName);
null != e.mergeWay && Object.hasOwnProperty.call(e, "mergeWay") && t.uint32(96).uint32(e.mergeWay);
null != e.mgTime && Object.hasOwnProperty.call(e, "mgTime") && t.uint32(104).uint32(e.mgTime);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeList.Merge(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.mergeId = e.int64();
break;

case 2:
n.hostClubCode = e.string();
break;

case 3:
n.hostClubName = e.string();
break;

case 4:
n.hostOwnerCode = e.string();
break;

case 5:
n.hostOwnerName = e.string();
break;

case 6:
n.mgClubCode = e.string();
break;

case 7:
n.mgClubName = e.string();
break;

case 8:
n.mgOwnerCode = e.string();
break;

case 9:
n.mgOwnerName = e.string();
break;

case 10:
n.applicantCode = e.string();
break;

case 11:
n.applicantName = e.string();
break;

case 12:
n.mergeWay = e.uint32();
break;

case 13:
n.mgTime = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.mergeId && e.hasOwnProperty("mergeId") && !(s.isInteger(e.mergeId) || e.mergeId && s.isInteger(e.mergeId.low) && s.isInteger(e.mergeId.high)) ? "mergeId: integer|Long expected" : null != e.hostClubCode && e.hasOwnProperty("hostClubCode") && !s.isString(e.hostClubCode) ? "hostClubCode: string expected" : null != e.hostClubName && e.hasOwnProperty("hostClubName") && !s.isString(e.hostClubName) ? "hostClubName: string expected" : null != e.hostOwnerCode && e.hasOwnProperty("hostOwnerCode") && !s.isString(e.hostOwnerCode) ? "hostOwnerCode: string expected" : null != e.hostOwnerName && e.hasOwnProperty("hostOwnerName") && !s.isString(e.hostOwnerName) ? "hostOwnerName: string expected" : null != e.mgClubCode && e.hasOwnProperty("mgClubCode") && !s.isString(e.mgClubCode) ? "mgClubCode: string expected" : null != e.mgClubName && e.hasOwnProperty("mgClubName") && !s.isString(e.mgClubName) ? "mgClubName: string expected" : null != e.mgOwnerCode && e.hasOwnProperty("mgOwnerCode") && !s.isString(e.mgOwnerCode) ? "mgOwnerCode: string expected" : null != e.mgOwnerName && e.hasOwnProperty("mgOwnerName") && !s.isString(e.mgOwnerName) ? "mgOwnerName: string expected" : null != e.applicantCode && e.hasOwnProperty("applicantCode") && !s.isString(e.applicantCode) ? "applicantCode: string expected" : null != e.applicantName && e.hasOwnProperty("applicantName") && !s.isString(e.applicantName) ? "applicantName: string expected" : null != e.mergeWay && e.hasOwnProperty("mergeWay") && !s.isInteger(e.mergeWay) ? "mergeWay: integer expected" : null != e.mgTime && e.hasOwnProperty("mgTime") && !s.isInteger(e.mgTime) ? "mgTime: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeList.Merge) return e;
var t = new l.pb.SCMergeList.Merge();
null != e.mergeId && (s.Long ? (t.mergeId = s.Long.fromValue(e.mergeId)).unsigned = !1 : "string" == typeof e.mergeId ? t.mergeId = parseInt(e.mergeId, 10) : "number" == typeof e.mergeId ? t.mergeId = e.mergeId : "object" === n(e.mergeId) && (t.mergeId = new s.LongBits(e.mergeId.low >>> 0, e.mergeId.high >>> 0).toNumber()));
null != e.hostClubCode && (t.hostClubCode = String(e.hostClubCode));
null != e.hostClubName && (t.hostClubName = String(e.hostClubName));
null != e.hostOwnerCode && (t.hostOwnerCode = String(e.hostOwnerCode));
null != e.hostOwnerName && (t.hostOwnerName = String(e.hostOwnerName));
null != e.mgClubCode && (t.mgClubCode = String(e.mgClubCode));
null != e.mgClubName && (t.mgClubName = String(e.mgClubName));
null != e.mgOwnerCode && (t.mgOwnerCode = String(e.mgOwnerCode));
null != e.mgOwnerName && (t.mgOwnerName = String(e.mgOwnerName));
null != e.applicantCode && (t.applicantCode = String(e.applicantCode));
null != e.applicantName && (t.applicantName = String(e.applicantName));
null != e.mergeWay && (t.mergeWay = e.mergeWay >>> 0);
null != e.mgTime && (t.mgTime = e.mgTime >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.mergeId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.mergeId = t.longs === String ? "0" : 0;
o.hostClubCode = "";
o.hostClubName = "";
o.hostOwnerCode = "";
o.hostOwnerName = "";
o.mgClubCode = "";
o.mgClubName = "";
o.mgOwnerCode = "";
o.mgOwnerName = "";
o.applicantCode = "";
o.applicantName = "";
o.mergeWay = 0;
o.mgTime = 0;
}
null != e.mergeId && e.hasOwnProperty("mergeId") && ("number" == typeof e.mergeId ? o.mergeId = t.longs === String ? String(e.mergeId) : e.mergeId : o.mergeId = t.longs === String ? s.Long.prototype.toString.call(e.mergeId) : t.longs === Number ? new s.LongBits(e.mergeId.low >>> 0, e.mergeId.high >>> 0).toNumber() : e.mergeId);
null != e.hostClubCode && e.hasOwnProperty("hostClubCode") && (o.hostClubCode = e.hostClubCode);
null != e.hostClubName && e.hasOwnProperty("hostClubName") && (o.hostClubName = e.hostClubName);
null != e.hostOwnerCode && e.hasOwnProperty("hostOwnerCode") && (o.hostOwnerCode = e.hostOwnerCode);
null != e.hostOwnerName && e.hasOwnProperty("hostOwnerName") && (o.hostOwnerName = e.hostOwnerName);
null != e.mgClubCode && e.hasOwnProperty("mgClubCode") && (o.mgClubCode = e.mgClubCode);
null != e.mgClubName && e.hasOwnProperty("mgClubName") && (o.mgClubName = e.mgClubName);
null != e.mgOwnerCode && e.hasOwnProperty("mgOwnerCode") && (o.mgOwnerCode = e.mgOwnerCode);
null != e.mgOwnerName && e.hasOwnProperty("mgOwnerName") && (o.mgOwnerName = e.mgOwnerName);
null != e.applicantCode && e.hasOwnProperty("applicantCode") && (o.applicantCode = e.applicantCode);
null != e.applicantName && e.hasOwnProperty("applicantName") && (o.applicantName = e.applicantName);
null != e.mergeWay && e.hasOwnProperty("mergeWay") && (o.mergeWay = e.mergeWay);
null != e.mgTime && e.hasOwnProperty("mgTime") && (o.mgTime = e.mgTime);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSApplicationMergeClub = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.culClubCode = "";
e.prototype.mgClubCode = "";
e.prototype.mgOwnerCode = "";
e.prototype.mgType = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.culClubCode && Object.hasOwnProperty.call(e, "culClubCode") && t.uint32(10).string(e.culClubCode);
null != e.mgClubCode && Object.hasOwnProperty.call(e, "mgClubCode") && t.uint32(18).string(e.mgClubCode);
null != e.mgOwnerCode && Object.hasOwnProperty.call(e, "mgOwnerCode") && t.uint32(26).string(e.mgOwnerCode);
null != e.mgType && Object.hasOwnProperty.call(e, "mgType") && t.uint32(32).uint32(e.mgType);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSApplicationMergeClub(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.culClubCode = e.string();
break;

case 2:
n.mgClubCode = e.string();
break;

case 3:
n.mgOwnerCode = e.string();
break;

case 4:
n.mgType = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.culClubCode && e.hasOwnProperty("culClubCode") && !s.isString(e.culClubCode) ? "culClubCode: string expected" : null != e.mgClubCode && e.hasOwnProperty("mgClubCode") && !s.isString(e.mgClubCode) ? "mgClubCode: string expected" : null != e.mgOwnerCode && e.hasOwnProperty("mgOwnerCode") && !s.isString(e.mgOwnerCode) ? "mgOwnerCode: string expected" : null != e.mgType && e.hasOwnProperty("mgType") && !s.isInteger(e.mgType) ? "mgType: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSApplicationMergeClub) return e;
var t = new l.pb.CSApplicationMergeClub();
null != e.culClubCode && (t.culClubCode = String(e.culClubCode));
null != e.mgClubCode && (t.mgClubCode = String(e.mgClubCode));
null != e.mgOwnerCode && (t.mgOwnerCode = String(e.mgOwnerCode));
null != e.mgType && (t.mgType = e.mgType >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.culClubCode = "";
o.mgClubCode = "";
o.mgOwnerCode = "";
o.mgType = 0;
}
null != e.culClubCode && e.hasOwnProperty("culClubCode") && (o.culClubCode = e.culClubCode);
null != e.mgClubCode && e.hasOwnProperty("mgClubCode") && (o.mgClubCode = e.mgClubCode);
null != e.mgOwnerCode && e.hasOwnProperty("mgOwnerCode") && (o.mgOwnerCode = e.mgOwnerCode);
null != e.mgType && e.hasOwnProperty("mgType") && (o.mgType = e.mgType);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCApplicationMergeClub = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCApplicationMergeClub(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCApplicationMergeClub) return e;
var t = new l.pb.SCApplicationMergeClub();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCApplicationMergeClub.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSMergeDelClub = function() {
function e(e) {
this.mergeId = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.culClubId = 0;
e.prototype.mergeId = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.culClubId && Object.hasOwnProperty.call(e, "culClubId") && t.uint32(8).uint32(e.culClubId);
if (null != e.mergeId && e.mergeId.length) {
t.uint32(18).fork();
for (var o = 0; o < e.mergeId.length; ++o) t.uint32(e.mergeId[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSMergeDelClub(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.culClubId = e.uint32();
break;

case 2:
n.mergeId && n.mergeId.length || (n.mergeId = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.mergeId.push(e.uint32()); else n.mergeId.push(e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.culClubId && e.hasOwnProperty("culClubId") && !s.isInteger(e.culClubId)) return "culClubId: integer expected";
if (null != e.mergeId && e.hasOwnProperty("mergeId")) {
if (!Array.isArray(e.mergeId)) return "mergeId: array expected";
for (var t = 0; t < e.mergeId.length; ++t) if (!s.isInteger(e.mergeId[t])) return "mergeId: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSMergeDelClub) return e;
var t = new l.pb.CSMergeDelClub();
null != e.culClubId && (t.culClubId = e.culClubId >>> 0);
if (e.mergeId) {
if (!Array.isArray(e.mergeId)) throw TypeError(".pb.CSMergeDelClub.mergeId: array expected");
t.mergeId = [];
for (var o = 0; o < e.mergeId.length; ++o) t.mergeId[o] = e.mergeId[o] >>> 0;
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.mergeId = []);
t.defaults && (o.culClubId = 0);
null != e.culClubId && e.hasOwnProperty("culClubId") && (o.culClubId = e.culClubId);
if (e.mergeId && e.mergeId.length) {
o.mergeId = [];
for (var n = 0; n < e.mergeId.length; ++n) o.mergeId[n] = e.mergeId[n];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCMergeDelClub = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeDelClub(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeDelClub) return e;
var t = new l.pb.SCMergeDelClub();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCMergeDelClub.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSMergeClubInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubCode = "";
e.prototype.ownerCode = "";
e.prototype.clubId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubCode && Object.hasOwnProperty.call(e, "clubCode") && t.uint32(10).string(e.clubCode);
null != e.ownerCode && Object.hasOwnProperty.call(e, "ownerCode") && t.uint32(18).string(e.ownerCode);
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(24).uint32(e.clubId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSMergeClubInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubCode = e.string();
break;

case 2:
n.ownerCode = e.string();
break;

case 3:
n.clubId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubCode && e.hasOwnProperty("clubCode") && !s.isString(e.clubCode) ? "clubCode: string expected" : null != e.ownerCode && e.hasOwnProperty("ownerCode") && !s.isString(e.ownerCode) ? "ownerCode: string expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSMergeClubInfo) return e;
var t = new l.pb.CSMergeClubInfo();
null != e.clubCode && (t.clubCode = String(e.clubCode));
null != e.ownerCode && (t.ownerCode = String(e.ownerCode));
null != e.clubId && (t.clubId = e.clubId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubCode = "";
o.ownerCode = "";
o.clubId = 0;
}
null != e.clubCode && e.hasOwnProperty("clubCode") && (o.clubCode = e.clubCode);
null != e.ownerCode && e.hasOwnProperty("ownerCode") && (o.ownerCode = e.ownerCode);
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCMergeClubInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.data && Object.hasOwnProperty.call(e, "data") && l.pb.SCMergeClubInfo.MergeClub.encode(e.data, t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeClubInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data = l.pb.SCMergeClubInfo.MergeClub.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (t = l.pb.SCResult.verify(e.res)) return "res." + t;
}
if (null != e.data && e.hasOwnProperty("data")) {
var t;
if (t = l.pb.SCMergeClubInfo.MergeClub.verify(e.data)) return "data." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeClubInfo) return e;
var t = new l.pb.SCMergeClubInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCMergeClubInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (null != e.data) {
if ("object" !== n(e.data)) throw TypeError(".pb.SCMergeClubInfo.data: object expected");
t.data = l.pb.SCMergeClubInfo.MergeClub.fromObject(e.data);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.data = null;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.data && e.hasOwnProperty("data") && (o.data = l.pb.SCMergeClubInfo.MergeClub.toObject(e.data, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.MergeClub = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.clubCode = "";
e.prototype.clubName = "";
e.prototype.ownerCode = "";
e.prototype.ownerName = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.clubCode && Object.hasOwnProperty.call(e, "clubCode") && t.uint32(18).string(e.clubCode);
null != e.clubName && Object.hasOwnProperty.call(e, "clubName") && t.uint32(26).string(e.clubName);
null != e.ownerCode && Object.hasOwnProperty.call(e, "ownerCode") && t.uint32(34).string(e.ownerCode);
null != e.ownerName && Object.hasOwnProperty.call(e, "ownerName") && t.uint32(42).string(e.ownerName);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeClubInfo.MergeClub(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.clubCode = e.string();
break;

case 3:
n.clubName = e.string();
break;

case 4:
n.ownerCode = e.string();
break;

case 5:
n.ownerName = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.clubCode && e.hasOwnProperty("clubCode") && !s.isString(e.clubCode) ? "clubCode: string expected" : null != e.clubName && e.hasOwnProperty("clubName") && !s.isString(e.clubName) ? "clubName: string expected" : null != e.ownerCode && e.hasOwnProperty("ownerCode") && !s.isString(e.ownerCode) ? "ownerCode: string expected" : null != e.ownerName && e.hasOwnProperty("ownerName") && !s.isString(e.ownerName) ? "ownerName: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeClubInfo.MergeClub) return e;
var t = new l.pb.SCMergeClubInfo.MergeClub();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.clubCode && (t.clubCode = String(e.clubCode));
null != e.clubName && (t.clubName = String(e.clubName));
null != e.ownerCode && (t.ownerCode = String(e.ownerCode));
null != e.ownerName && (t.ownerName = String(e.ownerName));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.clubCode = "";
o.clubName = "";
o.ownerCode = "";
o.ownerName = "";
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.clubCode && e.hasOwnProperty("clubCode") && (o.clubCode = e.clubCode);
null != e.clubName && e.hasOwnProperty("clubName") && (o.clubName = e.clubName);
null != e.ownerCode && e.hasOwnProperty("ownerCode") && (o.ownerCode = e.ownerCode);
null != e.ownerName && e.hasOwnProperty("ownerName") && (o.ownerName = e.ownerName);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSMergeBelongToClubList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSMergeBelongToClubList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSMergeBelongToClubList) return e;
var t = new l.pb.CSMergeBelongToClubList();
null != e.clubId && (t.clubId = e.clubId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.clubId = 0);
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCMergeBelongToClubList = function() {
function e(e) {
this.data = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.data = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.data && e.data.length) for (var o = 0; o < e.data.length; ++o) l.pb.SCMergeBelongToClubList.MergeBelongToClub.encode(e.data[o], t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeBelongToClubList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.data && n.data.length || (n.data = []);
n.data.push(l.pb.SCMergeBelongToClubList.MergeBelongToClub.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.data && e.hasOwnProperty("data")) {
if (!Array.isArray(e.data)) return "data: array expected";
for (var t = 0; t < e.data.length; ++t) {
var o;
if (o = l.pb.SCMergeBelongToClubList.MergeBelongToClub.verify(e.data[t])) return "data." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeBelongToClubList) return e;
var t = new l.pb.SCMergeBelongToClubList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCMergeBelongToClubList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.data) {
if (!Array.isArray(e.data)) throw TypeError(".pb.SCMergeBelongToClubList.data: array expected");
t.data = [];
for (var o = 0; o < e.data.length; ++o) {
if ("object" !== n(e.data[o])) throw TypeError(".pb.SCMergeBelongToClubList.data: object expected");
t.data[o] = l.pb.SCMergeBelongToClubList.MergeBelongToClub.fromObject(e.data[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.data = []);
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.data && e.data.length) {
o.data = [];
for (var n = 0; n < e.data.length; ++n) o.data[n] = l.pb.SCMergeBelongToClubList.MergeBelongToClub.toObject(e.data[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.MergeBelongToClub = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.clubCode = "";
e.prototype.clubName = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.clubCode && Object.hasOwnProperty.call(e, "clubCode") && t.uint32(18).string(e.clubCode);
null != e.clubName && Object.hasOwnProperty.call(e, "clubName") && t.uint32(26).string(e.clubName);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeBelongToClubList.MergeBelongToClub(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.clubCode = e.string();
break;

case 3:
n.clubName = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.clubCode && e.hasOwnProperty("clubCode") && !s.isString(e.clubCode) ? "clubCode: string expected" : null != e.clubName && e.hasOwnProperty("clubName") && !s.isString(e.clubName) ? "clubName: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeBelongToClubList.MergeBelongToClub) return e;
var t = new l.pb.SCMergeBelongToClubList.MergeBelongToClub();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.clubCode && (t.clubCode = String(e.clubCode));
null != e.clubName && (t.clubName = String(e.clubName));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.clubCode = "";
o.clubName = "";
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.clubCode && e.hasOwnProperty("clubCode") && (o.clubCode = e.clubCode);
null != e.clubName && e.hasOwnProperty("clubName") && (o.clubName = e.clubName);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSMergeBelongToClubEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.userId = 0;
e.prototype.belong_ToClubId = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.userId && Object.hasOwnProperty.call(e, "userId") && t.uint32(16).uint32(e.userId);
null != e.belong_ToClubId && Object.hasOwnProperty.call(e, "belong_ToClubId") && t.uint32(24).uint32(e.belong_ToClubId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSMergeBelongToClubEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.userId = e.uint32();
break;

case 3:
n.belong_ToClubId = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.userId && e.hasOwnProperty("userId") && !s.isInteger(e.userId) ? "userId: integer expected" : null != e.belong_ToClubId && e.hasOwnProperty("belong_ToClubId") && !s.isInteger(e.belong_ToClubId) ? "belong_ToClubId: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSMergeBelongToClubEdit) return e;
var t = new l.pb.CSMergeBelongToClubEdit();
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.userId && (t.userId = e.userId >>> 0);
null != e.belong_ToClubId && (t.belong_ToClubId = e.belong_ToClubId >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.userId = 0;
o.belong_ToClubId = 0;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.userId && e.hasOwnProperty("userId") && (o.userId = e.userId);
null != e.belong_ToClubId && e.hasOwnProperty("belong_ToClubId") && (o.belong_ToClubId = e.belong_ToClubId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCMergeBelongToClubEdit = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMergeBelongToClubEdit(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMergeBelongToClubEdit) return e;
var t = new l.pb.SCMergeBelongToClubEdit();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCMergeBelongToClubEdit.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCUserAccountUpdate = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.card = 0;
e.prototype.gold = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.card && Object.hasOwnProperty.call(e, "card") && t.uint32(8).int32(e.card);
null != e.gold && Object.hasOwnProperty.call(e, "gold") && t.uint32(16).int32(e.gold);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCUserAccountUpdate(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.card = e.int32();
break;

case 2:
n.gold = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.card && e.hasOwnProperty("card") && !s.isInteger(e.card) ? "card: integer expected" : null != e.gold && e.hasOwnProperty("gold") && !s.isInteger(e.gold) ? "gold: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCUserAccountUpdate) return e;
var t = new l.pb.SCUserAccountUpdate();
null != e.card && (t.card = 0 | e.card);
null != e.gold && (t.gold = 0 | e.gold);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.card = 0;
o.gold = 0;
}
null != e.card && e.hasOwnProperty("card") && (o.card = e.card);
null != e.gold && e.hasOwnProperty("gold") && (o.gold = e.gold);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCClubRoomState = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.clubId = 0;
e.prototype.action = 0;
e.prototype.room = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(8).uint32(e.clubId);
null != e.action && Object.hasOwnProperty.call(e, "action") && t.uint32(16).int32(e.action);
null != e.room && Object.hasOwnProperty.call(e, "room") && l.pb.PbClubRoom.encode(e.room, t.uint32(26).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCClubRoomState(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.clubId = e.uint32();
break;

case 2:
n.action = e.int32();
break;

case 3:
n.room = l.pb.PbClubRoom.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId)) return "clubId: integer expected";
if (null != e.action && e.hasOwnProperty("action")) switch (e.action) {
default:
return "action: enum value expected";

case 0:
case 1:
case 2:
}
if (null != e.room && e.hasOwnProperty("room")) {
var t = l.pb.PbClubRoom.verify(e.room);
if (t) return "room." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCClubRoomState) return e;
var t = new l.pb.SCClubRoomState();
null != e.clubId && (t.clubId = e.clubId >>> 0);
switch (e.action) {
case "ADD":
case 0:
t.action = 0;
break;

case "DELETE":
case 1:
t.action = 1;
break;

case "UPDATE":
case 2:
t.action = 2;
}
if (null != e.room) {
if ("object" !== n(e.room)) throw TypeError(".pb.SCClubRoomState.room: object expected");
t.room = l.pb.PbClubRoom.fromObject(e.room);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.clubId = 0;
o.action = t.enums === String ? "ADD" : 0;
o.room = null;
}
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.action && e.hasOwnProperty("action") && (o.action = t.enums === String ? l.pb.SCClubRoomState.Action[e.action] : e.action);
null != e.room && e.hasOwnProperty("room") && (o.room = l.pb.PbClubRoom.toObject(e.room, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Action = function() {
var e = {}, t = Object.create(e);
t[e[0] = "ADD"] = 0;
t[e[1] = "DELETE"] = 1;
t[e[2] = "UPDATE"] = 2;
return t;
}();
return e;
}();
e.SCRoomClubInvite = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.clubInfo = null;
e.prototype.inviterInfo = null;
e.prototype.roomInfo = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint64(e.id);
null != e.clubInfo && Object.hasOwnProperty.call(e, "clubInfo") && l.pb.SCRoomClubInvite.ClubInfo.encode(e.clubInfo, t.uint32(18).fork()).ldelim();
null != e.inviterInfo && Object.hasOwnProperty.call(e, "inviterInfo") && l.pb.SCRoomClubInvite.InviterInfo.encode(e.inviterInfo, t.uint32(26).fork()).ldelim();
null != e.roomInfo && Object.hasOwnProperty.call(e, "roomInfo") && l.pb.SCRoomClubInvite.RoomInfo.encode(e.roomInfo, t.uint32(34).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCRoomClubInvite(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint64();
break;

case 2:
n.clubInfo = l.pb.SCRoomClubInvite.ClubInfo.decode(e, e.uint32());
break;

case 3:
n.inviterInfo = l.pb.SCRoomClubInvite.InviterInfo.decode(e, e.uint32());
break;

case 4:
n.roomInfo = l.pb.SCRoomClubInvite.RoomInfo.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !(s.isInteger(e.id) || e.id && s.isInteger(e.id.low) && s.isInteger(e.id.high))) return "id: integer|Long expected";
if (null != e.clubInfo && e.hasOwnProperty("clubInfo")) {
if (t = l.pb.SCRoomClubInvite.ClubInfo.verify(e.clubInfo)) return "clubInfo." + t;
}
if (null != e.inviterInfo && e.hasOwnProperty("inviterInfo")) {
if (t = l.pb.SCRoomClubInvite.InviterInfo.verify(e.inviterInfo)) return "inviterInfo." + t;
}
if (null != e.roomInfo && e.hasOwnProperty("roomInfo")) {
var t;
if (t = l.pb.SCRoomClubInvite.RoomInfo.verify(e.roomInfo)) return "roomInfo." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCRoomClubInvite) return e;
var t = new l.pb.SCRoomClubInvite();
null != e.id && (s.Long ? (t.id = s.Long.fromValue(e.id)).unsigned = !0 : "string" == typeof e.id ? t.id = parseInt(e.id, 10) : "number" == typeof e.id ? t.id = e.id : "object" === n(e.id) && (t.id = new s.LongBits(e.id.low >>> 0, e.id.high >>> 0).toNumber(!0)));
if (null != e.clubInfo) {
if ("object" !== n(e.clubInfo)) throw TypeError(".pb.SCRoomClubInvite.clubInfo: object expected");
t.clubInfo = l.pb.SCRoomClubInvite.ClubInfo.fromObject(e.clubInfo);
}
if (null != e.inviterInfo) {
if ("object" !== n(e.inviterInfo)) throw TypeError(".pb.SCRoomClubInvite.inviterInfo: object expected");
t.inviterInfo = l.pb.SCRoomClubInvite.InviterInfo.fromObject(e.inviterInfo);
}
if (null != e.roomInfo) {
if ("object" !== n(e.roomInfo)) throw TypeError(".pb.SCRoomClubInvite.roomInfo: object expected");
t.roomInfo = l.pb.SCRoomClubInvite.RoomInfo.fromObject(e.roomInfo);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.id = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.id = t.longs === String ? "0" : 0;
o.clubInfo = null;
o.inviterInfo = null;
o.roomInfo = null;
}
null != e.id && e.hasOwnProperty("id") && ("number" == typeof e.id ? o.id = t.longs === String ? String(e.id) : e.id : o.id = t.longs === String ? s.Long.prototype.toString.call(e.id) : t.longs === Number ? new s.LongBits(e.id.low >>> 0, e.id.high >>> 0).toNumber(!0) : e.id);
null != e.clubInfo && e.hasOwnProperty("clubInfo") && (o.clubInfo = l.pb.SCRoomClubInvite.ClubInfo.toObject(e.clubInfo, t));
null != e.inviterInfo && e.hasOwnProperty("inviterInfo") && (o.inviterInfo = l.pb.SCRoomClubInvite.InviterInfo.toObject(e.inviterInfo, t));
null != e.roomInfo && e.hasOwnProperty("roomInfo") && (o.roomInfo = l.pb.SCRoomClubInvite.RoomInfo.toObject(e.roomInfo, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.ClubInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.name = "";
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(10).string(e.name);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(18).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCRoomClubInvite.ClubInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.name = e.string();
break;

case 2:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCRoomClubInvite.ClubInfo) return e;
var t = new l.pb.SCRoomClubInvite.ClubInfo();
null != e.name && (t.name = String(e.name));
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.name = "";
o.code = "";
}
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.InviterInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.name = "";
e.prototype.code = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(10).string(e.name);
null != e.code && Object.hasOwnProperty.call(e, "code") && t.uint32(18).string(e.code);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCRoomClubInvite.InviterInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.name = e.string();
break;

case 2:
n.code = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.code && e.hasOwnProperty("code") && !s.isString(e.code) ? "code: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCRoomClubInvite.InviterInfo) return e;
var t = new l.pb.SCRoomClubInvite.InviterInfo();
null != e.name && (t.name = String(e.name));
null != e.code && (t.code = String(e.code));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.name = "";
o.code = "";
}
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.code && e.hasOwnProperty("code") && (o.code = e.code);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.RoomInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.gameType = 0;
e.prototype.num = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(16).uint32(e.gameType);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(24).uint32(e.num);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(32).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(40).uint64(e.param2);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCRoomClubInvite.RoomInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.gameType = e.uint32();
break;

case 3:
n.num = e.uint32();
break;

case 4:
n.param1 = e.uint64();
break;

case 5:
n.param2 = e.uint64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num) ? "num: integer expected" : null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high)) ? "param1: integer|Long expected" : null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high)) ? "param2: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCRoomClubInvite.RoomInfo) return e;
var t = new l.pb.SCRoomClubInvite.RoomInfo();
null != e.id && (t.id = e.id >>> 0);
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.gameType = 0;
o.num = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.SCMarquee = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.content = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.content && Object.hasOwnProperty.call(e, "content") && t.uint32(10).string(e.content);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMarquee(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.content = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.content && e.hasOwnProperty("content") && !s.isString(e.content) ? "content: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMarquee) return e;
var t = new l.pb.SCMarquee();
null != e.content && (t.content = String(e.content));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.content = "");
null != e.content && e.hasOwnProperty("content") && (o.content = e.content);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCArea = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.content = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.content && Object.hasOwnProperty.call(e, "content") && t.uint32(10).string(e.content);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCArea(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.content = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.content && e.hasOwnProperty("content") && !s.isString(e.content) ? "content: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCArea) return e;
var t = new l.pb.SCArea();
null != e.content && (t.content = String(e.content));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.content = "");
null != e.content && e.hasOwnProperty("content") && (o.content = e.content);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCUserNotice = function() {
function e(e) {
this.noticeInfo = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.noticeInfo = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
if (null != e.noticeInfo && e.noticeInfo.length) for (var o = 0; o < e.noticeInfo.length; ++o) l.pb.SCUserNotice.Notice.encode(e.noticeInfo[o], t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCUserNotice(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.noticeInfo && n.noticeInfo.length || (n.noticeInfo = []);
n.noticeInfo.push(l.pb.SCUserNotice.Notice.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.noticeInfo && e.hasOwnProperty("noticeInfo")) {
if (!Array.isArray(e.noticeInfo)) return "noticeInfo: array expected";
for (var t = 0; t < e.noticeInfo.length; ++t) {
var o = l.pb.SCUserNotice.Notice.verify(e.noticeInfo[t]);
if (o) return "noticeInfo." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCUserNotice) return e;
var t = new l.pb.SCUserNotice();
if (e.noticeInfo) {
if (!Array.isArray(e.noticeInfo)) throw TypeError(".pb.SCUserNotice.noticeInfo: array expected");
t.noticeInfo = [];
for (var o = 0; o < e.noticeInfo.length; ++o) {
if ("object" !== n(e.noticeInfo[o])) throw TypeError(".pb.SCUserNotice.noticeInfo: object expected");
t.noticeInfo[o] = l.pb.SCUserNotice.Notice.fromObject(e.noticeInfo[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.noticeInfo = []);
if (e.noticeInfo && e.noticeInfo.length) {
o.noticeInfo = [];
for (var n = 0; n < e.noticeInfo.length; ++n) o.noticeInfo[n] = l.pb.SCUserNotice.Notice.toObject(e.noticeInfo[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Notice = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.content = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.content && Object.hasOwnProperty.call(e, "content") && t.uint32(18).string(e.content);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCUserNotice.Notice(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.content = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.content && e.hasOwnProperty("content") && !s.isString(e.content) ? "content: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCUserNotice.Notice) return e;
var t = new l.pb.SCUserNotice.Notice();
null != e.id && (t.id = e.id >>> 0);
null != e.content && (t.content = String(e.content));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.content = "";
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.content && e.hasOwnProperty("content") && (o.content = e.content);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.SCGoods = function() {
function e(e) {
this.goodsInfo = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.goodsInfo = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.goodsInfo && e.goodsInfo.length) for (var o = 0; o < e.goodsInfo.length; ++o) l.pb.GoodsInfo.encode(e.goodsInfo[o], t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoods(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.goodsInfo && n.goodsInfo.length || (n.goodsInfo = []);
n.goodsInfo.push(l.pb.GoodsInfo.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.goodsInfo && e.hasOwnProperty("goodsInfo")) {
if (!Array.isArray(e.goodsInfo)) return "goodsInfo: array expected";
for (var t = 0; t < e.goodsInfo.length; ++t) {
var o;
if (o = l.pb.GoodsInfo.verify(e.goodsInfo[t])) return "goodsInfo." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoods) return e;
var t = new l.pb.SCGoods();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGoods.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.goodsInfo) {
if (!Array.isArray(e.goodsInfo)) throw TypeError(".pb.SCGoods.goodsInfo: array expected");
t.goodsInfo = [];
for (var o = 0; o < e.goodsInfo.length; ++o) {
if ("object" !== n(e.goodsInfo[o])) throw TypeError(".pb.SCGoods.goodsInfo: object expected");
t.goodsInfo[o] = l.pb.GoodsInfo.fromObject(e.goodsInfo[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.goodsInfo = []);
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.goodsInfo && e.goodsInfo.length) {
o.goodsInfo = [];
for (var n = 0; n < e.goodsInfo.length; ++n) o.goodsInfo[n] = l.pb.GoodsInfo.toObject(e.goodsInfo[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSGameRecord = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.type = 0;
e.prototype.clubId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.time = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.userCode = "";
e.prototype.startTime = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.endTime = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.culClubLevel = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.type && Object.hasOwnProperty.call(e, "type") && t.uint32(8).int32(e.type);
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(16).int64(e.clubId);
null != e.time && Object.hasOwnProperty.call(e, "time") && t.uint32(24).int64(e.time);
null != e.userCode && Object.hasOwnProperty.call(e, "userCode") && t.uint32(34).string(e.userCode);
null != e.startTime && Object.hasOwnProperty.call(e, "startTime") && t.uint32(40).int64(e.startTime);
null != e.endTime && Object.hasOwnProperty.call(e, "endTime") && t.uint32(48).int64(e.endTime);
null != e.culClubLevel && Object.hasOwnProperty.call(e, "culClubLevel") && t.uint32(56).uint32(e.culClubLevel);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGameRecord(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.type = e.int32();
break;

case 2:
n.clubId = e.int64();
break;

case 3:
n.time = e.int64();
break;

case 4:
n.userCode = e.string();
break;

case 5:
n.startTime = e.int64();
break;

case 6:
n.endTime = e.int64();
break;

case 7:
n.culClubLevel = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.type && e.hasOwnProperty("type") && !s.isInteger(e.type) ? "type: integer expected" : null != e.clubId && e.hasOwnProperty("clubId") && !(s.isInteger(e.clubId) || e.clubId && s.isInteger(e.clubId.low) && s.isInteger(e.clubId.high)) ? "clubId: integer|Long expected" : null != e.time && e.hasOwnProperty("time") && !(s.isInteger(e.time) || e.time && s.isInteger(e.time.low) && s.isInteger(e.time.high)) ? "time: integer|Long expected" : null != e.userCode && e.hasOwnProperty("userCode") && !s.isString(e.userCode) ? "userCode: string expected" : null != e.startTime && e.hasOwnProperty("startTime") && !(s.isInteger(e.startTime) || e.startTime && s.isInteger(e.startTime.low) && s.isInteger(e.startTime.high)) ? "startTime: integer|Long expected" : null != e.endTime && e.hasOwnProperty("endTime") && !(s.isInteger(e.endTime) || e.endTime && s.isInteger(e.endTime.low) && s.isInteger(e.endTime.high)) ? "endTime: integer|Long expected" : null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && !s.isInteger(e.culClubLevel) ? "culClubLevel: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGameRecord) return e;
var t = new l.pb.CSGameRecord();
null != e.type && (t.type = 0 | e.type);
null != e.clubId && (s.Long ? (t.clubId = s.Long.fromValue(e.clubId)).unsigned = !1 : "string" == typeof e.clubId ? t.clubId = parseInt(e.clubId, 10) : "number" == typeof e.clubId ? t.clubId = e.clubId : "object" === n(e.clubId) && (t.clubId = new s.LongBits(e.clubId.low >>> 0, e.clubId.high >>> 0).toNumber()));
null != e.time && (s.Long ? (t.time = s.Long.fromValue(e.time)).unsigned = !1 : "string" == typeof e.time ? t.time = parseInt(e.time, 10) : "number" == typeof e.time ? t.time = e.time : "object" === n(e.time) && (t.time = new s.LongBits(e.time.low >>> 0, e.time.high >>> 0).toNumber()));
null != e.userCode && (t.userCode = String(e.userCode));
null != e.startTime && (s.Long ? (t.startTime = s.Long.fromValue(e.startTime)).unsigned = !1 : "string" == typeof e.startTime ? t.startTime = parseInt(e.startTime, 10) : "number" == typeof e.startTime ? t.startTime = e.startTime : "object" === n(e.startTime) && (t.startTime = new s.LongBits(e.startTime.low >>> 0, e.startTime.high >>> 0).toNumber()));
null != e.endTime && (s.Long ? (t.endTime = s.Long.fromValue(e.endTime)).unsigned = !1 : "string" == typeof e.endTime ? t.endTime = parseInt(e.endTime, 10) : "number" == typeof e.endTime ? t.endTime = e.endTime : "object" === n(e.endTime) && (t.endTime = new s.LongBits(e.endTime.low >>> 0, e.endTime.high >>> 0).toNumber()));
null != e.culClubLevel && (t.culClubLevel = e.culClubLevel >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.type = 0;
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.clubId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.clubId = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.time = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.time = t.longs === String ? "0" : 0;
o.userCode = "";
if (s.Long) {
n = new s.Long(0, 0, !1);
o.startTime = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.startTime = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.endTime = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.endTime = t.longs === String ? "0" : 0;
o.culClubLevel = 0;
}
null != e.type && e.hasOwnProperty("type") && (o.type = e.type);
null != e.clubId && e.hasOwnProperty("clubId") && ("number" == typeof e.clubId ? o.clubId = t.longs === String ? String(e.clubId) : e.clubId : o.clubId = t.longs === String ? s.Long.prototype.toString.call(e.clubId) : t.longs === Number ? new s.LongBits(e.clubId.low >>> 0, e.clubId.high >>> 0).toNumber() : e.clubId);
null != e.time && e.hasOwnProperty("time") && ("number" == typeof e.time ? o.time = t.longs === String ? String(e.time) : e.time : o.time = t.longs === String ? s.Long.prototype.toString.call(e.time) : t.longs === Number ? new s.LongBits(e.time.low >>> 0, e.time.high >>> 0).toNumber() : e.time);
null != e.userCode && e.hasOwnProperty("userCode") && (o.userCode = e.userCode);
null != e.startTime && e.hasOwnProperty("startTime") && ("number" == typeof e.startTime ? o.startTime = t.longs === String ? String(e.startTime) : e.startTime : o.startTime = t.longs === String ? s.Long.prototype.toString.call(e.startTime) : t.longs === Number ? new s.LongBits(e.startTime.low >>> 0, e.startTime.high >>> 0).toNumber() : e.startTime);
null != e.endTime && e.hasOwnProperty("endTime") && ("number" == typeof e.endTime ? o.endTime = t.longs === String ? String(e.endTime) : e.endTime : o.endTime = t.longs === String ? s.Long.prototype.toString.call(e.endTime) : t.longs === Number ? new s.LongBits(e.endTime.low >>> 0, e.endTime.high >>> 0).toNumber() : e.endTime);
null != e.culClubLevel && e.hasOwnProperty("culClubLevel") && (o.culClubLevel = e.culClubLevel);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGameRecord = function() {
function e(e) {
this.records = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.records = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.records && e.records.length) for (var o = 0; o < e.records.length; ++o) l.pb.SCGameRecord.Record_.encode(e.records[o], t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecord(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.records && n.records.length || (n.records = []);
n.records.push(l.pb.SCGameRecord.Record_.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.records && e.hasOwnProperty("records")) {
if (!Array.isArray(e.records)) return "records: array expected";
for (var t = 0; t < e.records.length; ++t) {
var o;
if (o = l.pb.SCGameRecord.Record_.verify(e.records[t])) return "records." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecord) return e;
var t = new l.pb.SCGameRecord();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGameRecord.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.records) {
if (!Array.isArray(e.records)) throw TypeError(".pb.SCGameRecord.records: array expected");
t.records = [];
for (var o = 0; o < e.records.length; ++o) {
if ("object" !== n(e.records[o])) throw TypeError(".pb.SCGameRecord.records: object expected");
t.records[o] = l.pb.SCGameRecord.Record_.fromObject(e.records[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.records = []);
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.records && e.records.length) {
o.records = [];
for (var n = 0; n < e.records.length; ++n) o.records[n] = l.pb.SCGameRecord.Record_.toObject(e.records[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Player_ = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.uid = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.name = "";
e.prototype.score = 0;
e.prototype.avatarUrl = "";
e.prototype.winner = !1;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.uid && Object.hasOwnProperty.call(e, "uid") && t.uint32(8).int64(e.uid);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.score && Object.hasOwnProperty.call(e, "score") && t.uint32(24).int32(e.score);
null != e.avatarUrl && Object.hasOwnProperty.call(e, "avatarUrl") && t.uint32(34).string(e.avatarUrl);
null != e.winner && Object.hasOwnProperty.call(e, "winner") && t.uint32(40).bool(e.winner);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecord.Player_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.uid = e.int64();
break;

case 2:
n.name = e.string();
break;

case 3:
n.score = e.int32();
break;

case 4:
n.avatarUrl = e.string();
break;

case 5:
n.winner = e.bool();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.uid && e.hasOwnProperty("uid") && !(s.isInteger(e.uid) || e.uid && s.isInteger(e.uid.low) && s.isInteger(e.uid.high)) ? "uid: integer|Long expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.score && e.hasOwnProperty("score") && !s.isInteger(e.score) ? "score: integer expected" : null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && !s.isString(e.avatarUrl) ? "avatarUrl: string expected" : null != e.winner && e.hasOwnProperty("winner") && "boolean" != typeof e.winner ? "winner: boolean expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecord.Player_) return e;
var t = new l.pb.SCGameRecord.Player_();
null != e.uid && (s.Long ? (t.uid = s.Long.fromValue(e.uid)).unsigned = !1 : "string" == typeof e.uid ? t.uid = parseInt(e.uid, 10) : "number" == typeof e.uid ? t.uid = e.uid : "object" === n(e.uid) && (t.uid = new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber()));
null != e.name && (t.name = String(e.name));
null != e.score && (t.score = 0 | e.score);
null != e.avatarUrl && (t.avatarUrl = String(e.avatarUrl));
null != e.winner && (t.winner = Boolean(e.winner));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.uid = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.uid = t.longs === String ? "0" : 0;
o.name = "";
o.score = 0;
o.avatarUrl = "";
o.winner = !1;
}
null != e.uid && e.hasOwnProperty("uid") && ("number" == typeof e.uid ? o.uid = t.longs === String ? String(e.uid) : e.uid : o.uid = t.longs === String ? s.Long.prototype.toString.call(e.uid) : t.longs === Number ? new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber() : e.uid);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.score && e.hasOwnProperty("score") && (o.score = e.score);
null != e.avatarUrl && e.hasOwnProperty("avatarUrl") && (o.avatarUrl = e.avatarUrl);
null != e.winner && e.hasOwnProperty("winner") && (o.winner = e.winner);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.Record_ = function() {
function e(e) {
this.players = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = "";
e.prototype.gameId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.roomId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.gameCount = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.totalCount = 0;
e.prototype.time = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.players = s.emptyArray;
e.prototype.scoreRatio = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(10).string(e.id);
null != e.gameId && Object.hasOwnProperty.call(e, "gameId") && t.uint32(16).int64(e.gameId);
null != e.roomId && Object.hasOwnProperty.call(e, "roomId") && t.uint32(24).int64(e.roomId);
null != e.gameCount && Object.hasOwnProperty.call(e, "gameCount") && t.uint32(32).uint32(e.gameCount);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(40).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(48).uint64(e.param2);
null != e.totalCount && Object.hasOwnProperty.call(e, "totalCount") && t.uint32(56).uint32(e.totalCount);
null != e.time && Object.hasOwnProperty.call(e, "time") && t.uint32(64).int64(e.time);
if (null != e.players && e.players.length) for (var o = 0; o < e.players.length; ++o) l.pb.SCGameRecord.Player_.encode(e.players[o], t.uint32(74).fork()).ldelim();
null != e.scoreRatio && Object.hasOwnProperty.call(e, "scoreRatio") && t.uint32(80).int32(e.scoreRatio);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecord.Record_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.string();
break;

case 2:
n.gameId = e.int64();
break;

case 3:
n.roomId = e.int64();
break;

case 4:
n.gameCount = e.uint32();
break;

case 5:
n.param1 = e.uint64();
break;

case 6:
n.param2 = e.uint64();
break;

case 7:
n.totalCount = e.uint32();
break;

case 8:
n.time = e.int64();
break;

case 9:
n.players && n.players.length || (n.players = []);
n.players.push(l.pb.SCGameRecord.Player_.decode(e, e.uint32()));
break;

case 10:
n.scoreRatio = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !s.isString(e.id)) return "id: string expected";
if (null != e.gameId && e.hasOwnProperty("gameId") && !(s.isInteger(e.gameId) || e.gameId && s.isInteger(e.gameId.low) && s.isInteger(e.gameId.high))) return "gameId: integer|Long expected";
if (null != e.roomId && e.hasOwnProperty("roomId") && !(s.isInteger(e.roomId) || e.roomId && s.isInteger(e.roomId.low) && s.isInteger(e.roomId.high))) return "roomId: integer|Long expected";
if (null != e.gameCount && e.hasOwnProperty("gameCount") && !s.isInteger(e.gameCount)) return "gameCount: integer expected";
if (null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high))) return "param1: integer|Long expected";
if (null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high))) return "param2: integer|Long expected";
if (null != e.totalCount && e.hasOwnProperty("totalCount") && !s.isInteger(e.totalCount)) return "totalCount: integer expected";
if (null != e.time && e.hasOwnProperty("time") && !(s.isInteger(e.time) || e.time && s.isInteger(e.time.low) && s.isInteger(e.time.high))) return "time: integer|Long expected";
if (null != e.players && e.hasOwnProperty("players")) {
if (!Array.isArray(e.players)) return "players: array expected";
for (var t = 0; t < e.players.length; ++t) {
var o = l.pb.SCGameRecord.Player_.verify(e.players[t]);
if (o) return "players." + o;
}
}
return null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && !s.isInteger(e.scoreRatio) ? "scoreRatio: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecord.Record_) return e;
var t = new l.pb.SCGameRecord.Record_();
null != e.id && (t.id = String(e.id));
null != e.gameId && (s.Long ? (t.gameId = s.Long.fromValue(e.gameId)).unsigned = !1 : "string" == typeof e.gameId ? t.gameId = parseInt(e.gameId, 10) : "number" == typeof e.gameId ? t.gameId = e.gameId : "object" === n(e.gameId) && (t.gameId = new s.LongBits(e.gameId.low >>> 0, e.gameId.high >>> 0).toNumber()));
null != e.roomId && (s.Long ? (t.roomId = s.Long.fromValue(e.roomId)).unsigned = !1 : "string" == typeof e.roomId ? t.roomId = parseInt(e.roomId, 10) : "number" == typeof e.roomId ? t.roomId = e.roomId : "object" === n(e.roomId) && (t.roomId = new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber()));
null != e.gameCount && (t.gameCount = e.gameCount >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
null != e.totalCount && (t.totalCount = e.totalCount >>> 0);
null != e.time && (s.Long ? (t.time = s.Long.fromValue(e.time)).unsigned = !1 : "string" == typeof e.time ? t.time = parseInt(e.time, 10) : "number" == typeof e.time ? t.time = e.time : "object" === n(e.time) && (t.time = new s.LongBits(e.time.low >>> 0, e.time.high >>> 0).toNumber()));
if (e.players) {
if (!Array.isArray(e.players)) throw TypeError(".pb.SCGameRecord.Record_.players: array expected");
t.players = [];
for (var o = 0; o < e.players.length; ++o) {
if ("object" !== n(e.players[o])) throw TypeError(".pb.SCGameRecord.Record_.players: object expected");
t.players[o] = l.pb.SCGameRecord.Player_.fromObject(e.players[o]);
}
}
null != e.scoreRatio && (t.scoreRatio = 0 | e.scoreRatio);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.players = []);
if (t.defaults) {
o.id = "";
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.gameId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.gameId = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.roomId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.roomId = t.longs === String ? "0" : 0;
o.gameCount = 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
o.totalCount = 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.time = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.time = t.longs === String ? "0" : 0;
o.scoreRatio = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.gameId && e.hasOwnProperty("gameId") && ("number" == typeof e.gameId ? o.gameId = t.longs === String ? String(e.gameId) : e.gameId : o.gameId = t.longs === String ? s.Long.prototype.toString.call(e.gameId) : t.longs === Number ? new s.LongBits(e.gameId.low >>> 0, e.gameId.high >>> 0).toNumber() : e.gameId);
null != e.roomId && e.hasOwnProperty("roomId") && ("number" == typeof e.roomId ? o.roomId = t.longs === String ? String(e.roomId) : e.roomId : o.roomId = t.longs === String ? s.Long.prototype.toString.call(e.roomId) : t.longs === Number ? new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber() : e.roomId);
null != e.gameCount && e.hasOwnProperty("gameCount") && (o.gameCount = e.gameCount);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
null != e.totalCount && e.hasOwnProperty("totalCount") && (o.totalCount = e.totalCount);
null != e.time && e.hasOwnProperty("time") && ("number" == typeof e.time ? o.time = t.longs === String ? String(e.time) : e.time : o.time = t.longs === String ? s.Long.prototype.toString.call(e.time) : t.longs === Number ? new s.LongBits(e.time.low >>> 0, e.time.high >>> 0).toNumber() : e.time);
if (e.players && e.players.length) {
o.players = [];
for (var r = 0; r < e.players.length; ++r) o.players[r] = l.pb.SCGameRecord.Player_.toObject(e.players[r], t);
}
null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && (o.scoreRatio = e.scoreRatio);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSGameRecordDetail = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(10).string(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGameRecordDetail(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isString(e.id) ? "id: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGameRecordDetail) return e;
var t = new l.pb.CSGameRecordDetail();
null != e.id && (t.id = String(e.id));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = "");
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGameRecordDetail = function() {
function e(e) {
this.details = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.details = s.emptyArray;
e.prototype.scoreRatio = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.details && e.details.length) for (var o = 0; o < e.details.length; ++o) l.pb.SCGameRecordDetail.RecordDetail_.encode(e.details[o], t.uint32(18).fork()).ldelim();
null != e.scoreRatio && Object.hasOwnProperty.call(e, "scoreRatio") && t.uint32(24).int32(e.scoreRatio);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordDetail(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.details && n.details.length || (n.details = []);
n.details.push(l.pb.SCGameRecordDetail.RecordDetail_.decode(e, e.uint32()));
break;

case 3:
n.scoreRatio = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.details && e.hasOwnProperty("details")) {
if (!Array.isArray(e.details)) return "details: array expected";
for (var t = 0; t < e.details.length; ++t) {
var o;
if (o = l.pb.SCGameRecordDetail.RecordDetail_.verify(e.details[t])) return "details." + o;
}
}
return null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && !s.isInteger(e.scoreRatio) ? "scoreRatio: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordDetail) return e;
var t = new l.pb.SCGameRecordDetail();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGameRecordDetail.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.details) {
if (!Array.isArray(e.details)) throw TypeError(".pb.SCGameRecordDetail.details: array expected");
t.details = [];
for (var o = 0; o < e.details.length; ++o) {
if ("object" !== n(e.details[o])) throw TypeError(".pb.SCGameRecordDetail.details: object expected");
t.details[o] = l.pb.SCGameRecordDetail.RecordDetail_.fromObject(e.details[o]);
}
}
null != e.scoreRatio && (t.scoreRatio = 0 | e.scoreRatio);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.details = []);
if (t.defaults) {
o.res = null;
o.scoreRatio = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.details && e.details.length) {
o.details = [];
for (var n = 0; n < e.details.length; ++n) o.details[n] = l.pb.SCGameRecordDetail.RecordDetail_.toObject(e.details[n], t);
}
null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && (o.scoreRatio = e.scoreRatio);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.PlayerScore_ = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.uid = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.score = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.uid && Object.hasOwnProperty.call(e, "uid") && t.uint32(8).int64(e.uid);
null != e.score && Object.hasOwnProperty.call(e, "score") && t.uint32(16).int64(e.score);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordDetail.PlayerScore_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.uid = e.int64();
break;

case 2:
n.score = e.int64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.uid && e.hasOwnProperty("uid") && !(s.isInteger(e.uid) || e.uid && s.isInteger(e.uid.low) && s.isInteger(e.uid.high)) ? "uid: integer|Long expected" : null != e.score && e.hasOwnProperty("score") && !(s.isInteger(e.score) || e.score && s.isInteger(e.score.low) && s.isInteger(e.score.high)) ? "score: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordDetail.PlayerScore_) return e;
var t = new l.pb.SCGameRecordDetail.PlayerScore_();
null != e.uid && (s.Long ? (t.uid = s.Long.fromValue(e.uid)).unsigned = !1 : "string" == typeof e.uid ? t.uid = parseInt(e.uid, 10) : "number" == typeof e.uid ? t.uid = e.uid : "object" === n(e.uid) && (t.uid = new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber()));
null != e.score && (s.Long ? (t.score = s.Long.fromValue(e.score)).unsigned = !1 : "string" == typeof e.score ? t.score = parseInt(e.score, 10) : "number" == typeof e.score ? t.score = e.score : "object" === n(e.score) && (t.score = new s.LongBits(e.score.low >>> 0, e.score.high >>> 0).toNumber()));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.uid = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.uid = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.score = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.score = t.longs === String ? "0" : 0;
}
null != e.uid && e.hasOwnProperty("uid") && ("number" == typeof e.uid ? o.uid = t.longs === String ? String(e.uid) : e.uid : o.uid = t.longs === String ? s.Long.prototype.toString.call(e.uid) : t.longs === Number ? new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber() : e.uid);
null != e.score && e.hasOwnProperty("score") && ("number" == typeof e.score ? o.score = t.longs === String ? String(e.score) : e.score : o.score = t.longs === String ? s.Long.prototype.toString.call(e.score) : t.longs === Number ? new s.LongBits(e.score.low >>> 0, e.score.high >>> 0).toNumber() : e.score);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.RecordDetail_ = function() {
function e(e) {
this.scores = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = "";
e.prototype.scores = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(10).string(e.id);
if (null != e.scores && e.scores.length) for (var o = 0; o < e.scores.length; ++o) l.pb.SCGameRecordDetail.PlayerScore_.encode(e.scores[o], t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordDetail.RecordDetail_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.string();
break;

case 2:
n.scores && n.scores.length || (n.scores = []);
n.scores.push(l.pb.SCGameRecordDetail.PlayerScore_.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !s.isString(e.id)) return "id: string expected";
if (null != e.scores && e.hasOwnProperty("scores")) {
if (!Array.isArray(e.scores)) return "scores: array expected";
for (var t = 0; t < e.scores.length; ++t) {
var o = l.pb.SCGameRecordDetail.PlayerScore_.verify(e.scores[t]);
if (o) return "scores." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordDetail.RecordDetail_) return e;
var t = new l.pb.SCGameRecordDetail.RecordDetail_();
null != e.id && (t.id = String(e.id));
if (e.scores) {
if (!Array.isArray(e.scores)) throw TypeError(".pb.SCGameRecordDetail.RecordDetail_.scores: array expected");
t.scores = [];
for (var o = 0; o < e.scores.length; ++o) {
if ("object" !== n(e.scores[o])) throw TypeError(".pb.SCGameRecordDetail.RecordDetail_.scores: object expected");
t.scores[o] = l.pb.SCGameRecordDetail.PlayerScore_.fromObject(e.scores[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.scores = []);
t.defaults && (o.id = "");
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
if (e.scores && e.scores.length) {
o.scores = [];
for (var n = 0; n < e.scores.length; ++n) o.scores[n] = l.pb.SCGameRecordDetail.PlayerScore_.toObject(e.scores[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSGameRecordPlayback = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(10).string(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGameRecordPlayback(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isString(e.id) ? "id: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGameRecordPlayback) return e;
var t = new l.pb.CSGameRecordPlayback();
null != e.id && (t.id = String(e.id));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = "");
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGameRecordPlayback = function() {
function e(e) {
this.players = [];
this.steps = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.players = s.emptyArray;
e.prototype.roomInfo = null;
e.prototype.gameInfo = null;
e.prototype.steps = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.players && e.players.length) for (var o = 0; o < e.players.length; ++o) l.pb.PlayerInfo.encode(e.players[o], t.uint32(18).fork()).ldelim();
null != e.roomInfo && Object.hasOwnProperty.call(e, "roomInfo") && l.pb.SCGameRecordPlayback.PlaybackRoom_.encode(e.roomInfo, t.uint32(26).fork()).ldelim();
null != e.gameInfo && Object.hasOwnProperty.call(e, "gameInfo") && l.pb.SCGameRecordPlayback.PlaybackGame_.encode(e.gameInfo, t.uint32(34).fork()).ldelim();
if (null != e.steps && e.steps.length) for (o = 0; o < e.steps.length; ++o) l.pb.SCGameRecordPlayback.PlaybackStep_.encode(e.steps[o], t.uint32(42).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordPlayback(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.players && n.players.length || (n.players = []);
n.players.push(l.pb.PlayerInfo.decode(e, e.uint32()));
break;

case 3:
n.roomInfo = l.pb.SCGameRecordPlayback.PlaybackRoom_.decode(e, e.uint32());
break;

case 4:
n.gameInfo = l.pb.SCGameRecordPlayback.PlaybackGame_.decode(e, e.uint32());
break;

case 5:
n.steps && n.steps.length || (n.steps = []);
n.steps.push(l.pb.SCGameRecordPlayback.PlaybackStep_.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.players && e.hasOwnProperty("players")) {
if (!Array.isArray(e.players)) return "players: array expected";
for (var t = 0; t < e.players.length; ++t) {
if (o = l.pb.PlayerInfo.verify(e.players[t])) return "players." + o;
}
}
if (null != e.roomInfo && e.hasOwnProperty("roomInfo")) {
if (o = l.pb.SCGameRecordPlayback.PlaybackRoom_.verify(e.roomInfo)) return "roomInfo." + o;
}
if (null != e.gameInfo && e.hasOwnProperty("gameInfo")) {
if (o = l.pb.SCGameRecordPlayback.PlaybackGame_.verify(e.gameInfo)) return "gameInfo." + o;
}
if (null != e.steps && e.hasOwnProperty("steps")) {
if (!Array.isArray(e.steps)) return "steps: array expected";
for (t = 0; t < e.steps.length; ++t) {
var o;
if (o = l.pb.SCGameRecordPlayback.PlaybackStep_.verify(e.steps[t])) return "steps." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordPlayback) return e;
var t = new l.pb.SCGameRecordPlayback();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGameRecordPlayback.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.players) {
if (!Array.isArray(e.players)) throw TypeError(".pb.SCGameRecordPlayback.players: array expected");
t.players = [];
for (var o = 0; o < e.players.length; ++o) {
if ("object" !== n(e.players[o])) throw TypeError(".pb.SCGameRecordPlayback.players: object expected");
t.players[o] = l.pb.PlayerInfo.fromObject(e.players[o]);
}
}
if (null != e.roomInfo) {
if ("object" !== n(e.roomInfo)) throw TypeError(".pb.SCGameRecordPlayback.roomInfo: object expected");
t.roomInfo = l.pb.SCGameRecordPlayback.PlaybackRoom_.fromObject(e.roomInfo);
}
if (null != e.gameInfo) {
if ("object" !== n(e.gameInfo)) throw TypeError(".pb.SCGameRecordPlayback.gameInfo: object expected");
t.gameInfo = l.pb.SCGameRecordPlayback.PlaybackGame_.fromObject(e.gameInfo);
}
if (e.steps) {
if (!Array.isArray(e.steps)) throw TypeError(".pb.SCGameRecordPlayback.steps: array expected");
t.steps = [];
for (o = 0; o < e.steps.length; ++o) {
if ("object" !== n(e.steps[o])) throw TypeError(".pb.SCGameRecordPlayback.steps: object expected");
t.steps[o] = l.pb.SCGameRecordPlayback.PlaybackStep_.fromObject(e.steps[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.arrays || t.defaults) {
o.players = [];
o.steps = [];
}
if (t.defaults) {
o.res = null;
o.roomInfo = null;
o.gameInfo = null;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.players && e.players.length) {
o.players = [];
for (var n = 0; n < e.players.length; ++n) o.players[n] = l.pb.PlayerInfo.toObject(e.players[n], t);
}
null != e.roomInfo && e.hasOwnProperty("roomInfo") && (o.roomInfo = l.pb.SCGameRecordPlayback.PlaybackRoom_.toObject(e.roomInfo, t));
null != e.gameInfo && e.hasOwnProperty("gameInfo") && (o.gameInfo = l.pb.SCGameRecordPlayback.PlaybackGame_.toObject(e.gameInfo, t));
if (e.steps && e.steps.length) {
o.steps = [];
for (n = 0; n < e.steps.length; ++n) o.steps[n] = l.pb.SCGameRecordPlayback.PlaybackStep_.toObject(e.steps[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.PlaybackRoom_ = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.type = 0;
e.prototype.roomId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.house = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.maxStep = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.scoreRatio = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.type && Object.hasOwnProperty.call(e, "type") && t.uint32(8).uint32(e.type);
null != e.roomId && Object.hasOwnProperty.call(e, "roomId") && t.uint32(16).int64(e.roomId);
null != e.house && Object.hasOwnProperty.call(e, "house") && t.uint32(24).int64(e.house);
null != e.maxStep && Object.hasOwnProperty.call(e, "maxStep") && t.uint32(32).uint32(e.maxStep);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(40).int64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(48).int64(e.param2);
null != e.scoreRatio && Object.hasOwnProperty.call(e, "scoreRatio") && t.uint32(56).int32(e.scoreRatio);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordPlayback.PlaybackRoom_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.type = e.uint32();
break;

case 2:
n.roomId = e.int64();
break;

case 3:
n.house = e.int64();
break;

case 4:
n.maxStep = e.uint32();
break;

case 5:
n.param1 = e.int64();
break;

case 6:
n.param2 = e.int64();
break;

case 7:
n.scoreRatio = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.type && e.hasOwnProperty("type") && !s.isInteger(e.type) ? "type: integer expected" : null != e.roomId && e.hasOwnProperty("roomId") && !(s.isInteger(e.roomId) || e.roomId && s.isInteger(e.roomId.low) && s.isInteger(e.roomId.high)) ? "roomId: integer|Long expected" : null != e.house && e.hasOwnProperty("house") && !(s.isInteger(e.house) || e.house && s.isInteger(e.house.low) && s.isInteger(e.house.high)) ? "house: integer|Long expected" : null != e.maxStep && e.hasOwnProperty("maxStep") && !s.isInteger(e.maxStep) ? "maxStep: integer expected" : null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high)) ? "param1: integer|Long expected" : null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high)) ? "param2: integer|Long expected" : null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && !s.isInteger(e.scoreRatio) ? "scoreRatio: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordPlayback.PlaybackRoom_) return e;
var t = new l.pb.SCGameRecordPlayback.PlaybackRoom_();
null != e.type && (t.type = e.type >>> 0);
null != e.roomId && (s.Long ? (t.roomId = s.Long.fromValue(e.roomId)).unsigned = !1 : "string" == typeof e.roomId ? t.roomId = parseInt(e.roomId, 10) : "number" == typeof e.roomId ? t.roomId = e.roomId : "object" === n(e.roomId) && (t.roomId = new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber()));
null != e.house && (s.Long ? (t.house = s.Long.fromValue(e.house)).unsigned = !1 : "string" == typeof e.house ? t.house = parseInt(e.house, 10) : "number" == typeof e.house ? t.house = e.house : "object" === n(e.house) && (t.house = new s.LongBits(e.house.low >>> 0, e.house.high >>> 0).toNumber()));
null != e.maxStep && (t.maxStep = e.maxStep >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !1 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber()));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !1 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber()));
null != e.scoreRatio && (t.scoreRatio = 0 | e.scoreRatio);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.type = 0;
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.roomId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.roomId = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.house = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.house = t.longs === String ? "0" : 0;
o.maxStep = 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !1);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
o.scoreRatio = 0;
}
null != e.type && e.hasOwnProperty("type") && (o.type = e.type);
null != e.roomId && e.hasOwnProperty("roomId") && ("number" == typeof e.roomId ? o.roomId = t.longs === String ? String(e.roomId) : e.roomId : o.roomId = t.longs === String ? s.Long.prototype.toString.call(e.roomId) : t.longs === Number ? new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber() : e.roomId);
null != e.house && e.hasOwnProperty("house") && ("number" == typeof e.house ? o.house = t.longs === String ? String(e.house) : e.house : o.house = t.longs === String ? s.Long.prototype.toString.call(e.house) : t.longs === Number ? new s.LongBits(e.house.low >>> 0, e.house.high >>> 0).toNumber() : e.house);
null != e.maxStep && e.hasOwnProperty("maxStep") && (o.maxStep = e.maxStep);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber() : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber() : e.param2);
null != e.scoreRatio && e.hasOwnProperty("scoreRatio") && (o.scoreRatio = e.scoreRatio);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PlaybackSite_ = function() {
function e(e) {
this.handCards = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.pos = 0;
e.prototype.wall = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.handCards = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.pos && Object.hasOwnProperty.call(e, "pos") && t.uint32(8).int32(e.pos);
null != e.wall && Object.hasOwnProperty.call(e, "wall") && t.uint32(16).int64(e.wall);
if (null != e.handCards && e.handCards.length) {
t.uint32(26).fork();
for (var o = 0; o < e.handCards.length; ++o) t.int32(e.handCards[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordPlayback.PlaybackSite_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.pos = e.int32();
break;

case 2:
n.wall = e.int64();
break;

case 3:
n.handCards && n.handCards.length || (n.handCards = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.handCards.push(e.int32()); else n.handCards.push(e.int32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.pos && e.hasOwnProperty("pos") && !s.isInteger(e.pos)) return "pos: integer expected";
if (null != e.wall && e.hasOwnProperty("wall") && !(s.isInteger(e.wall) || e.wall && s.isInteger(e.wall.low) && s.isInteger(e.wall.high))) return "wall: integer|Long expected";
if (null != e.handCards && e.hasOwnProperty("handCards")) {
if (!Array.isArray(e.handCards)) return "handCards: array expected";
for (var t = 0; t < e.handCards.length; ++t) if (!s.isInteger(e.handCards[t])) return "handCards: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordPlayback.PlaybackSite_) return e;
var t = new l.pb.SCGameRecordPlayback.PlaybackSite_();
null != e.pos && (t.pos = 0 | e.pos);
null != e.wall && (s.Long ? (t.wall = s.Long.fromValue(e.wall)).unsigned = !1 : "string" == typeof e.wall ? t.wall = parseInt(e.wall, 10) : "number" == typeof e.wall ? t.wall = e.wall : "object" === n(e.wall) && (t.wall = new s.LongBits(e.wall.low >>> 0, e.wall.high >>> 0).toNumber()));
if (e.handCards) {
if (!Array.isArray(e.handCards)) throw TypeError(".pb.SCGameRecordPlayback.PlaybackSite_.handCards: array expected");
t.handCards = [];
for (var o = 0; o < e.handCards.length; ++o) t.handCards[o] = 0 | e.handCards[o];
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.handCards = []);
if (t.defaults) {
o.pos = 0;
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.wall = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.wall = t.longs === String ? "0" : 0;
}
null != e.pos && e.hasOwnProperty("pos") && (o.pos = e.pos);
null != e.wall && e.hasOwnProperty("wall") && ("number" == typeof e.wall ? o.wall = t.longs === String ? String(e.wall) : e.wall : o.wall = t.longs === String ? s.Long.prototype.toString.call(e.wall) : t.longs === Number ? new s.LongBits(e.wall.low >>> 0, e.wall.high >>> 0).toNumber() : e.wall);
if (e.handCards && e.handCards.length) {
o.handCards = [];
for (var r = 0; r < e.handCards.length; ++r) o.handCards[r] = e.handCards[r];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PlaybackOperate_ = function() {
function e(e) {
this.cards = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.uid = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.index = 0;
e.prototype.cards = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.uid && Object.hasOwnProperty.call(e, "uid") && t.uint32(8).int64(e.uid);
null != e.index && Object.hasOwnProperty.call(e, "index") && t.uint32(16).int32(e.index);
if (null != e.cards && e.cards.length) {
t.uint32(26).fork();
for (var o = 0; o < e.cards.length; ++o) t.int32(e.cards[o]);
t.ldelim();
}
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordPlayback.PlaybackOperate_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.uid = e.int64();
break;

case 2:
n.index = e.int32();
break;

case 3:
n.cards && n.cards.length || (n.cards = []);
if (2 == (7 & r)) for (var a = e.uint32() + e.pos; e.pos < a; ) n.cards.push(e.int32()); else n.cards.push(e.int32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.uid && e.hasOwnProperty("uid") && !(s.isInteger(e.uid) || e.uid && s.isInteger(e.uid.low) && s.isInteger(e.uid.high))) return "uid: integer|Long expected";
if (null != e.index && e.hasOwnProperty("index") && !s.isInteger(e.index)) return "index: integer expected";
if (null != e.cards && e.hasOwnProperty("cards")) {
if (!Array.isArray(e.cards)) return "cards: array expected";
for (var t = 0; t < e.cards.length; ++t) if (!s.isInteger(e.cards[t])) return "cards: integer[] expected";
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordPlayback.PlaybackOperate_) return e;
var t = new l.pb.SCGameRecordPlayback.PlaybackOperate_();
null != e.uid && (s.Long ? (t.uid = s.Long.fromValue(e.uid)).unsigned = !1 : "string" == typeof e.uid ? t.uid = parseInt(e.uid, 10) : "number" == typeof e.uid ? t.uid = e.uid : "object" === n(e.uid) && (t.uid = new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber()));
null != e.index && (t.index = 0 | e.index);
if (e.cards) {
if (!Array.isArray(e.cards)) throw TypeError(".pb.SCGameRecordPlayback.PlaybackOperate_.cards: array expected");
t.cards = [];
for (var o = 0; o < e.cards.length; ++o) t.cards[o] = 0 | e.cards[o];
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.cards = []);
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.uid = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.uid = t.longs === String ? "0" : 0;
o.index = 0;
}
null != e.uid && e.hasOwnProperty("uid") && ("number" == typeof e.uid ? o.uid = t.longs === String ? String(e.uid) : e.uid : o.uid = t.longs === String ? s.Long.prototype.toString.call(e.uid) : t.longs === Number ? new s.LongBits(e.uid.low >>> 0, e.uid.high >>> 0).toNumber() : e.uid);
null != e.index && e.hasOwnProperty("index") && (o.index = e.index);
if (e.cards && e.cards.length) {
o.cards = [];
for (var r = 0; r < e.cards.length; ++r) o.cards[r] = e.cards[r];
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PlaybackStep_ = function() {
function e(e) {
this.operates = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.operates = s.emptyArray;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
if (null != e.operates && e.operates.length) for (var o = 0; o < e.operates.length; ++o) l.pb.SCGameRecordPlayback.PlaybackOperate_.encode(e.operates[o], t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordPlayback.PlaybackStep_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.operates && n.operates.length || (n.operates = []);
n.operates.push(l.pb.SCGameRecordPlayback.PlaybackOperate_.decode(e, e.uint32()));
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.operates && e.hasOwnProperty("operates")) {
if (!Array.isArray(e.operates)) return "operates: array expected";
for (var t = 0; t < e.operates.length; ++t) {
var o = l.pb.SCGameRecordPlayback.PlaybackOperate_.verify(e.operates[t]);
if (o) return "operates." + o;
}
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordPlayback.PlaybackStep_) return e;
var t = new l.pb.SCGameRecordPlayback.PlaybackStep_();
if (e.operates) {
if (!Array.isArray(e.operates)) throw TypeError(".pb.SCGameRecordPlayback.PlaybackStep_.operates: array expected");
t.operates = [];
for (var o = 0; o < e.operates.length; ++o) {
if ("object" !== n(e.operates[o])) throw TypeError(".pb.SCGameRecordPlayback.PlaybackStep_.operates: object expected");
t.operates[o] = l.pb.SCGameRecordPlayback.PlaybackOperate_.fromObject(e.operates[o]);
}
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.operates = []);
if (e.operates && e.operates.length) {
o.operates = [];
for (var n = 0; n < e.operates.length; ++n) o.operates[n] = l.pb.SCGameRecordPlayback.PlaybackOperate_.toObject(e.operates[n], t);
}
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.PlaybackGame_ = function() {
function e(e) {
this.sites = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.count = 0;
e.prototype.pz = 0;
e.prototype.lz = 0;
e.prototype.zhuang = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.pzPos = null;
e.prototype.sites = s.emptyArray;
e.prototype.extend = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(8).int32(e.count);
null != e.pz && Object.hasOwnProperty.call(e, "pz") && t.uint32(16).int32(e.pz);
null != e.lz && Object.hasOwnProperty.call(e, "lz") && t.uint32(24).int32(e.lz);
null != e.zhuang && Object.hasOwnProperty.call(e, "zhuang") && t.uint32(32).int64(e.zhuang);
null != e.pzPos && Object.hasOwnProperty.call(e, "pzPos") && l.pb.PaiDunPointer.encode(e.pzPos, t.uint32(42).fork()).ldelim();
if (null != e.sites && e.sites.length) for (var o = 0; o < e.sites.length; ++o) l.pb.SCGameRecordPlayback.PlaybackSite_.encode(e.sites[o], t.uint32(50).fork()).ldelim();
null != e.extend && Object.hasOwnProperty.call(e, "extend") && t.uint32(58).string(e.extend);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameRecordPlayback.PlaybackGame_(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.count = e.int32();
break;

case 2:
n.pz = e.int32();
break;

case 3:
n.lz = e.int32();
break;

case 4:
n.zhuang = e.int64();
break;

case 5:
n.pzPos = l.pb.PaiDunPointer.decode(e, e.uint32());
break;

case 6:
n.sites && n.sites.length || (n.sites = []);
n.sites.push(l.pb.SCGameRecordPlayback.PlaybackSite_.decode(e, e.uint32()));
break;

case 7:
n.extend = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count)) return "count: integer expected";
if (null != e.pz && e.hasOwnProperty("pz") && !s.isInteger(e.pz)) return "pz: integer expected";
if (null != e.lz && e.hasOwnProperty("lz") && !s.isInteger(e.lz)) return "lz: integer expected";
if (null != e.zhuang && e.hasOwnProperty("zhuang") && !(s.isInteger(e.zhuang) || e.zhuang && s.isInteger(e.zhuang.low) && s.isInteger(e.zhuang.high))) return "zhuang: integer|Long expected";
if (null != e.pzPos && e.hasOwnProperty("pzPos")) {
if (o = l.pb.PaiDunPointer.verify(e.pzPos)) return "pzPos." + o;
}
if (null != e.sites && e.hasOwnProperty("sites")) {
if (!Array.isArray(e.sites)) return "sites: array expected";
for (var t = 0; t < e.sites.length; ++t) {
var o;
if (o = l.pb.SCGameRecordPlayback.PlaybackSite_.verify(e.sites[t])) return "sites." + o;
}
}
return null != e.extend && e.hasOwnProperty("extend") && !s.isString(e.extend) ? "extend: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameRecordPlayback.PlaybackGame_) return e;
var t = new l.pb.SCGameRecordPlayback.PlaybackGame_();
null != e.count && (t.count = 0 | e.count);
null != e.pz && (t.pz = 0 | e.pz);
null != e.lz && (t.lz = 0 | e.lz);
null != e.zhuang && (s.Long ? (t.zhuang = s.Long.fromValue(e.zhuang)).unsigned = !1 : "string" == typeof e.zhuang ? t.zhuang = parseInt(e.zhuang, 10) : "number" == typeof e.zhuang ? t.zhuang = e.zhuang : "object" === n(e.zhuang) && (t.zhuang = new s.LongBits(e.zhuang.low >>> 0, e.zhuang.high >>> 0).toNumber()));
if (null != e.pzPos) {
if ("object" !== n(e.pzPos)) throw TypeError(".pb.SCGameRecordPlayback.PlaybackGame_.pzPos: object expected");
t.pzPos = l.pb.PaiDunPointer.fromObject(e.pzPos);
}
if (e.sites) {
if (!Array.isArray(e.sites)) throw TypeError(".pb.SCGameRecordPlayback.PlaybackGame_.sites: array expected");
t.sites = [];
for (var o = 0; o < e.sites.length; ++o) {
if ("object" !== n(e.sites[o])) throw TypeError(".pb.SCGameRecordPlayback.PlaybackGame_.sites: object expected");
t.sites[o] = l.pb.SCGameRecordPlayback.PlaybackSite_.fromObject(e.sites[o]);
}
}
null != e.extend && (t.extend = String(e.extend));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.sites = []);
if (t.defaults) {
o.count = 0;
o.pz = 0;
o.lz = 0;
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.zhuang = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.zhuang = t.longs === String ? "0" : 0;
o.pzPos = null;
o.extend = "";
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.pz && e.hasOwnProperty("pz") && (o.pz = e.pz);
null != e.lz && e.hasOwnProperty("lz") && (o.lz = e.lz);
null != e.zhuang && e.hasOwnProperty("zhuang") && ("number" == typeof e.zhuang ? o.zhuang = t.longs === String ? String(e.zhuang) : e.zhuang : o.zhuang = t.longs === String ? s.Long.prototype.toString.call(e.zhuang) : t.longs === Number ? new s.LongBits(e.zhuang.low >>> 0, e.zhuang.high >>> 0).toNumber() : e.zhuang);
null != e.pzPos && e.hasOwnProperty("pzPos") && (o.pzPos = l.pb.PaiDunPointer.toObject(e.pzPos, t));
if (e.sites && e.sites.length) {
o.sites = [];
for (var r = 0; r < e.sites.length; ++r) o.sites[r] = l.pb.SCGameRecordPlayback.PlaybackSite_.toObject(e.sites[r], t);
}
null != e.extend && e.hasOwnProperty("extend") && (o.extend = e.extend);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSCreateRoom = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.gameType = 0;
e.prototype.clubId = 0;
e.prototype.num = 0;
e.prototype.param1 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.prototype.param2 = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(8).uint32(e.gameType);
null != e.clubId && Object.hasOwnProperty.call(e, "clubId") && t.uint32(16).uint32(e.clubId);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(24).uint32(e.num);
null != e.param1 && Object.hasOwnProperty.call(e, "param1") && t.uint32(32).uint64(e.param1);
null != e.param2 && Object.hasOwnProperty.call(e, "param2") && t.uint32(40).uint64(e.param2);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSCreateRoom(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.gameType = e.uint32();
break;

case 2:
n.clubId = e.uint32();
break;

case 3:
n.num = e.uint32();
break;

case 4:
n.param1 = e.uint64();
break;

case 5:
n.param2 = e.uint64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.clubId && e.hasOwnProperty("clubId") && !s.isInteger(e.clubId) ? "clubId: integer expected" : null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num) ? "num: integer expected" : null != e.param1 && e.hasOwnProperty("param1") && !(s.isInteger(e.param1) || e.param1 && s.isInteger(e.param1.low) && s.isInteger(e.param1.high)) ? "param1: integer|Long expected" : null != e.param2 && e.hasOwnProperty("param2") && !(s.isInteger(e.param2) || e.param2 && s.isInteger(e.param2.low) && s.isInteger(e.param2.high)) ? "param2: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSCreateRoom) return e;
var t = new l.pb.CSCreateRoom();
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.clubId && (t.clubId = e.clubId >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.param1 && (s.Long ? (t.param1 = s.Long.fromValue(e.param1)).unsigned = !0 : "string" == typeof e.param1 ? t.param1 = parseInt(e.param1, 10) : "number" == typeof e.param1 ? t.param1 = e.param1 : "object" === n(e.param1) && (t.param1 = new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0)));
null != e.param2 && (s.Long ? (t.param2 = s.Long.fromValue(e.param2)).unsigned = !0 : "string" == typeof e.param2 ? t.param2 = parseInt(e.param2, 10) : "number" == typeof e.param2 ? t.param2 = e.param2 : "object" === n(e.param2) && (t.param2 = new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0)));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.gameType = 0;
o.clubId = 0;
o.num = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.param1 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param1 = t.longs === String ? "0" : 0;
if (s.Long) {
n = new s.Long(0, 0, !0);
o.param2 = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.param2 = t.longs === String ? "0" : 0;
}
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.clubId && e.hasOwnProperty("clubId") && (o.clubId = e.clubId);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.param1 && e.hasOwnProperty("param1") && ("number" == typeof e.param1 ? o.param1 = t.longs === String ? String(e.param1) : e.param1 : o.param1 = t.longs === String ? s.Long.prototype.toString.call(e.param1) : t.longs === Number ? new s.LongBits(e.param1.low >>> 0, e.param1.high >>> 0).toNumber(!0) : e.param1);
null != e.param2 && e.hasOwnProperty("param2") && ("number" == typeof e.param2 ? o.param2 = t.longs === String ? String(e.param2) : e.param2 : o.param2 = t.longs === String ? s.Long.prototype.toString.call(e.param2) : t.longs === Number ? new s.LongBits(e.param2.low >>> 0, e.param2.high >>> 0).toNumber(!0) : e.param2);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCCreateRoom = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.roomId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.roomId && Object.hasOwnProperty.call(e, "roomId") && t.uint32(16).int64(e.roomId);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCCreateRoom(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.roomId = e.int64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.roomId && e.hasOwnProperty("roomId") && !(s.isInteger(e.roomId) || e.roomId && s.isInteger(e.roomId.low) && s.isInteger(e.roomId.high)) ? "roomId: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCCreateRoom) return e;
var t = new l.pb.SCCreateRoom();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCCreateRoom.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.roomId && (s.Long ? (t.roomId = s.Long.fromValue(e.roomId)).unsigned = !1 : "string" == typeof e.roomId ? t.roomId = parseInt(e.roomId, 10) : "number" == typeof e.roomId ? t.roomId = e.roomId : "object" === n(e.roomId) && (t.roomId = new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber()));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.roomId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.roomId = t.longs === String ? "0" : 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.roomId && e.hasOwnProperty("roomId") && ("number" == typeof e.roomId ? o.roomId = t.longs === String ? String(e.roomId) : e.roomId : o.roomId = t.longs === String ? s.Long.prototype.toString.call(e.roomId) : t.longs === Number ? new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber() : e.roomId);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSJoinRoom = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.roomId = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.location = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.roomId && Object.hasOwnProperty.call(e, "roomId") && t.uint32(8).int64(e.roomId);
null != e.location && Object.hasOwnProperty.call(e, "location") && l.pb.Location.encode(e.location, t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSJoinRoom(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.roomId = e.int64();
break;

case 2:
n.location = l.pb.Location.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.roomId && e.hasOwnProperty("roomId") && !(s.isInteger(e.roomId) || e.roomId && s.isInteger(e.roomId.low) && s.isInteger(e.roomId.high))) return "roomId: integer|Long expected";
if (null != e.location && e.hasOwnProperty("location")) {
var t = l.pb.Location.verify(e.location);
if (t) return "location." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSJoinRoom) return e;
var t = new l.pb.CSJoinRoom();
null != e.roomId && (s.Long ? (t.roomId = s.Long.fromValue(e.roomId)).unsigned = !1 : "string" == typeof e.roomId ? t.roomId = parseInt(e.roomId, 10) : "number" == typeof e.roomId ? t.roomId = e.roomId : "object" === n(e.roomId) && (t.roomId = new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber()));
if (null != e.location) {
if ("object" !== n(e.location)) throw TypeError(".pb.CSJoinRoom.location: object expected");
t.location = l.pb.Location.fromObject(e.location);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.roomId = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.roomId = t.longs === String ? "0" : 0;
o.location = null;
}
null != e.roomId && e.hasOwnProperty("roomId") && ("number" == typeof e.roomId ? o.roomId = t.longs === String ? String(e.roomId) : e.roomId : o.roomId = t.longs === String ? s.Long.prototype.toString.call(e.roomId) : t.longs === Number ? new s.LongBits(e.roomId.low >>> 0, e.roomId.high >>> 0).toNumber() : e.roomId);
null != e.location && e.hasOwnProperty("location") && (o.location = l.pb.Location.toObject(e.location, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCJoinRoom = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.json = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.json && Object.hasOwnProperty.call(e, "json") && t.uint32(18).string(e.json);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCJoinRoom(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.json = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.json && e.hasOwnProperty("json") && !s.isString(e.json) ? "json: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCJoinRoom) return e;
var t = new l.pb.SCJoinRoom();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCJoinRoom.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.json && (t.json = String(e.json));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.json = "";
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.json && e.hasOwnProperty("json") && (o.json = e.json);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSGameJson = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.json = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.json && Object.hasOwnProperty.call(e, "json") && t.uint32(10).string(e.json);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGameJson(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.json = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.json && e.hasOwnProperty("json") && !s.isString(e.json) ? "json: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGameJson) return e;
var t = new l.pb.CSGameJson();
null != e.json && (t.json = String(e.json));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.json = "");
null != e.json && e.hasOwnProperty("json") && (o.json = e.json);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGameJson = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.json = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.json && Object.hasOwnProperty.call(e, "json") && t.uint32(18).string(e.json);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGameJson(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.json = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.json && e.hasOwnProperty("json") && !s.isString(e.json) ? "json: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGameJson) return e;
var t = new l.pb.SCGameJson();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGameJson.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.json && (t.json = String(e.json));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.json = "";
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.json && e.hasOwnProperty("json") && (o.json = e.json);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.ADGameJson = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.json = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.json && Object.hasOwnProperty.call(e, "json") && t.uint32(10).string(e.json);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.ADGameJson(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.json = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.json && e.hasOwnProperty("json") && !s.isString(e.json) ? "json: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.ADGameJson) return e;
var t = new l.pb.ADGameJson();
null != e.json && (t.json = String(e.json));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.json = "");
null != e.json && e.hasOwnProperty("json") && (o.json = e.json);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCMatchRoomCode = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.json = "";
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.json && Object.hasOwnProperty.call(e, "json") && t.uint32(18).string(e.json);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCMatchRoomCode(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.json = e.string();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null != e.json && e.hasOwnProperty("json") && !s.isString(e.json) ? "json: string expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCMatchRoomCode) return e;
var t = new l.pb.SCMatchRoomCode();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCMatchRoomCode.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
null != e.json && (t.json = String(e.json));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.json = "";
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.json && e.hasOwnProperty("json") && (o.json = e.json);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSGoldGroupList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.gameType = 0;
e.prototype.housing = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(8).uint32(e.gameType);
null != e.housing && Object.hasOwnProperty.call(e, "housing") && t.uint32(16).uint32(e.housing);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGoldGroupList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.gameType = e.uint32();
break;

case 2:
n.housing = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.housing && e.hasOwnProperty("housing") && !s.isInteger(e.housing) ? "housing: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGoldGroupList) return e;
var t = new l.pb.CSGoldGroupList();
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.housing && (t.housing = e.housing >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.gameType = 0;
o.housing = 0;
}
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.housing && e.hasOwnProperty("housing") && (o.housing = e.housing);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGoldGroupList = function() {
function e(e) {
this.info = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.info = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.info && e.info.length) for (var o = 0; o < e.info.length; ++o) l.pb.SCGoldGroupList.GoldGroup.encode(e.info[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGroupList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.info && n.info.length || (n.info = []);
n.info.push(l.pb.SCGoldGroupList.GoldGroup.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.info && e.hasOwnProperty("info")) {
if (!Array.isArray(e.info)) return "info: array expected";
for (var t = 0; t < e.info.length; ++t) {
var o;
if (o = l.pb.SCGoldGroupList.GoldGroup.verify(e.info[t])) return "info." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGroupList) return e;
var t = new l.pb.SCGoldGroupList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGoldGroupList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.info) {
if (!Array.isArray(e.info)) throw TypeError(".pb.SCGoldGroupList.info: array expected");
t.info = [];
for (var o = 0; o < e.info.length; ++o) {
if ("object" !== n(e.info[o])) throw TypeError(".pb.SCGoldGroupList.info: object expected");
t.info[o] = l.pb.SCGoldGroupList.GoldGroup.fromObject(e.info[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.info = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.info && e.info.length) {
o.info = [];
for (var n = 0; n < e.info.length; ++n) o.info[n] = l.pb.SCGoldGroupList.GoldGroup.toObject(e.info[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.GoldGroup = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.gameGroupName = "";
e.prototype.housing = 0;
e.prototype.gameType = 0;
e.prototype.sort = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.gameGroupName && Object.hasOwnProperty.call(e, "gameGroupName") && t.uint32(18).string(e.gameGroupName);
null != e.housing && Object.hasOwnProperty.call(e, "housing") && t.uint32(24).uint32(e.housing);
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(32).uint32(e.gameType);
null != e.sort && Object.hasOwnProperty.call(e, "sort") && t.uint32(40).uint32(e.sort);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGroupList.GoldGroup(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.gameGroupName = e.string();
break;

case 3:
n.housing = e.uint32();
break;

case 4:
n.gameType = e.uint32();
break;

case 5:
n.sort = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.gameGroupName && e.hasOwnProperty("gameGroupName") && !s.isString(e.gameGroupName) ? "gameGroupName: string expected" : null != e.housing && e.hasOwnProperty("housing") && !s.isInteger(e.housing) ? "housing: integer expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null != e.sort && e.hasOwnProperty("sort") && !s.isInteger(e.sort) ? "sort: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGroupList.GoldGroup) return e;
var t = new l.pb.SCGoldGroupList.GoldGroup();
null != e.id && (t.id = e.id >>> 0);
null != e.gameGroupName && (t.gameGroupName = String(e.gameGroupName));
null != e.housing && (t.housing = e.housing >>> 0);
null != e.gameType && (t.gameType = e.gameType >>> 0);
null != e.sort && (t.sort = e.sort >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.gameGroupName = "";
o.housing = 0;
o.gameType = 0;
o.sort = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.gameGroupName && e.hasOwnProperty("gameGroupName") && (o.gameGroupName = e.gameGroupName);
null != e.housing && e.hasOwnProperty("housing") && (o.housing = e.housing);
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
null != e.sort && e.hasOwnProperty("sort") && (o.sort = e.sort);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSGoldList = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGoldList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGoldList) return e;
var t = new l.pb.CSGoldList();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGoldList = function() {
function e(e) {
this.info = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.info = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.info && e.info.length) for (var o = 0; o < e.info.length; ++o) l.pb.SCGoldList.GoldList.encode(e.info[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.info && n.info.length || (n.info = []);
n.info.push(l.pb.SCGoldList.GoldList.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.info && e.hasOwnProperty("info")) {
if (!Array.isArray(e.info)) return "info: array expected";
for (var t = 0; t < e.info.length; ++t) {
var o;
if (o = l.pb.SCGoldList.GoldList.verify(e.info[t])) return "info." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldList) return e;
var t = new l.pb.SCGoldList();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGoldList.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.info) {
if (!Array.isArray(e.info)) throw TypeError(".pb.SCGoldList.info: array expected");
t.info = [];
for (var o = 0; o < e.info.length; ++o) {
if ("object" !== n(e.info[o])) throw TypeError(".pb.SCGoldList.info: object expected");
t.info[o] = l.pb.SCGoldList.GoldList.fromObject(e.info[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.info = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.info && e.info.length) {
o.info = [];
for (var n = 0; n < e.info.length; ++n) o.info[n] = l.pb.SCGoldList.GoldList.toObject(e.info[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.GoldList = function() {
function e(e) {
this.levels = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.gameName = "";
e.prototype.sort = 0;
e.prototype.levels = s.emptyArray;
e.prototype.num = s.Long ? s.Long.fromBits(0, 0, !0) : 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.gameName && Object.hasOwnProperty.call(e, "gameName") && t.uint32(18).string(e.gameName);
null != e.sort && Object.hasOwnProperty.call(e, "sort") && t.uint32(24).uint32(e.sort);
if (null != e.levels && e.levels.length) for (var o = 0; o < e.levels.length; ++o) l.pb.GoldLevel.encode(e.levels[o], t.uint32(34).fork()).ldelim();
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(40).uint64(e.num);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldList.GoldList(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.gameName = e.string();
break;

case 3:
n.sort = e.uint32();
break;

case 4:
n.levels && n.levels.length || (n.levels = []);
n.levels.push(l.pb.GoldLevel.decode(e, e.uint32()));
break;

case 5:
n.num = e.uint64();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id)) return "id: integer expected";
if (null != e.gameName && e.hasOwnProperty("gameName") && !s.isString(e.gameName)) return "gameName: string expected";
if (null != e.sort && e.hasOwnProperty("sort") && !s.isInteger(e.sort)) return "sort: integer expected";
if (null != e.levels && e.hasOwnProperty("levels")) {
if (!Array.isArray(e.levels)) return "levels: array expected";
for (var t = 0; t < e.levels.length; ++t) {
var o = l.pb.GoldLevel.verify(e.levels[t]);
if (o) return "levels." + o;
}
}
return null != e.num && e.hasOwnProperty("num") && !(s.isInteger(e.num) || e.num && s.isInteger(e.num.low) && s.isInteger(e.num.high)) ? "num: integer|Long expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldList.GoldList) return e;
var t = new l.pb.SCGoldList.GoldList();
null != e.id && (t.id = e.id >>> 0);
null != e.gameName && (t.gameName = String(e.gameName));
null != e.sort && (t.sort = e.sort >>> 0);
if (e.levels) {
if (!Array.isArray(e.levels)) throw TypeError(".pb.SCGoldList.GoldList.levels: array expected");
t.levels = [];
for (var o = 0; o < e.levels.length; ++o) {
if ("object" !== n(e.levels[o])) throw TypeError(".pb.SCGoldList.GoldList.levels: object expected");
t.levels[o] = l.pb.GoldLevel.fromObject(e.levels[o]);
}
}
null != e.num && (s.Long ? (t.num = s.Long.fromValue(e.num)).unsigned = !0 : "string" == typeof e.num ? t.num = parseInt(e.num, 10) : "number" == typeof e.num ? t.num = e.num : "object" === n(e.num) && (t.num = new s.LongBits(e.num.low >>> 0, e.num.high >>> 0).toNumber(!0)));
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.levels = []);
if (t.defaults) {
o.id = 0;
o.gameName = "";
o.sort = 0;
if (s.Long) {
var n = new s.Long(0, 0, !0);
o.num = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.num = t.longs === String ? "0" : 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.gameName && e.hasOwnProperty("gameName") && (o.gameName = e.gameName);
null != e.sort && e.hasOwnProperty("sort") && (o.sort = e.sort);
if (e.levels && e.levels.length) {
o.levels = [];
for (var r = 0; r < e.levels.length; ++r) o.levels[r] = l.pb.GoldLevel.toObject(e.levels[r], t);
}
null != e.num && e.hasOwnProperty("num") && ("number" == typeof e.num ? o.num = t.longs === String ? String(e.num) : e.num : o.num = t.longs === String ? s.Long.prototype.toString.call(e.num) : t.longs === Number ? new s.LongBits(e.num.low >>> 0, e.num.high >>> 0).toNumber(!0) : e.num);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.GoldLevel = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.level = 0;
e.prototype.levelName = "";
e.prototype.maxGold = 0;
e.prototype.minGold = 0;
e.prototype.baseScore = 0;
e.prototype.num = 0;
e.prototype.gameType = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.level && Object.hasOwnProperty.call(e, "level") && t.uint32(16).uint32(e.level);
null != e.levelName && Object.hasOwnProperty.call(e, "levelName") && t.uint32(26).string(e.levelName);
null != e.maxGold && Object.hasOwnProperty.call(e, "maxGold") && t.uint32(32).uint32(e.maxGold);
null != e.minGold && Object.hasOwnProperty.call(e, "minGold") && t.uint32(40).uint32(e.minGold);
null != e.baseScore && Object.hasOwnProperty.call(e, "baseScore") && t.uint32(48).uint32(e.baseScore);
null != e.num && Object.hasOwnProperty.call(e, "num") && t.uint32(56).uint32(e.num);
null != e.gameType && Object.hasOwnProperty.call(e, "gameType") && t.uint32(64).uint32(e.gameType);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.GoldLevel(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.level = e.uint32();
break;

case 3:
n.levelName = e.string();
break;

case 4:
n.maxGold = e.uint32();
break;

case 5:
n.minGold = e.uint32();
break;

case 6:
n.baseScore = e.uint32();
break;

case 7:
n.num = e.uint32();
break;

case 8:
n.gameType = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.level && e.hasOwnProperty("level") && !s.isInteger(e.level) ? "level: integer expected" : null != e.levelName && e.hasOwnProperty("levelName") && !s.isString(e.levelName) ? "levelName: string expected" : null != e.maxGold && e.hasOwnProperty("maxGold") && !s.isInteger(e.maxGold) ? "maxGold: integer expected" : null != e.minGold && e.hasOwnProperty("minGold") && !s.isInteger(e.minGold) ? "minGold: integer expected" : null != e.baseScore && e.hasOwnProperty("baseScore") && !s.isInteger(e.baseScore) ? "baseScore: integer expected" : null != e.num && e.hasOwnProperty("num") && !s.isInteger(e.num) ? "num: integer expected" : null != e.gameType && e.hasOwnProperty("gameType") && !s.isInteger(e.gameType) ? "gameType: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.GoldLevel) return e;
var t = new l.pb.GoldLevel();
null != e.id && (t.id = e.id >>> 0);
null != e.level && (t.level = e.level >>> 0);
null != e.levelName && (t.levelName = String(e.levelName));
null != e.maxGold && (t.maxGold = e.maxGold >>> 0);
null != e.minGold && (t.minGold = e.minGold >>> 0);
null != e.baseScore && (t.baseScore = e.baseScore >>> 0);
null != e.num && (t.num = e.num >>> 0);
null != e.gameType && (t.gameType = e.gameType >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.level = 0;
o.levelName = "";
o.maxGold = 0;
o.minGold = 0;
o.baseScore = 0;
o.num = 0;
o.gameType = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.level && e.hasOwnProperty("level") && (o.level = e.level);
null != e.levelName && e.hasOwnProperty("levelName") && (o.levelName = e.levelName);
null != e.maxGold && e.hasOwnProperty("maxGold") && (o.maxGold = e.maxGold);
null != e.minGold && e.hasOwnProperty("minGold") && (o.minGold = e.minGold);
null != e.baseScore && e.hasOwnProperty("baseScore") && (o.baseScore = e.baseScore);
null != e.num && e.hasOwnProperty("num") && (o.num = e.num);
null != e.gameType && e.hasOwnProperty("gameType") && (o.gameType = e.gameType);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSUserGoldInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSUserGoldInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSUserGoldInfo) return e;
var t = new l.pb.CSUserGoldInfo();
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.id = 0);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCUserGoldInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.info = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.info && Object.hasOwnProperty.call(e, "info") && l.pb.SCUserGoldInfo.GoldUserInfo.encode(e.info, t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCUserGoldInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.info = l.pb.SCUserGoldInfo.GoldUserInfo.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (t = l.pb.SCResult.verify(e.res)) return "res." + t;
}
if (null != e.info && e.hasOwnProperty("info")) {
var t;
if (t = l.pb.SCUserGoldInfo.GoldUserInfo.verify(e.info)) return "info." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCUserGoldInfo) return e;
var t = new l.pb.SCUserGoldInfo();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCUserGoldInfo.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (null != e.info) {
if ("object" !== n(e.info)) throw TypeError(".pb.SCUserGoldInfo.info: object expected");
t.info = l.pb.SCUserGoldInfo.GoldUserInfo.fromObject(e.info);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.info = null;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.info && e.hasOwnProperty("info") && (o.info = l.pb.SCUserGoldInfo.GoldUserInfo.toObject(e.info, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.GoldUserInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.userStatus = 0;
e.prototype.balanceGiveNum = 0;
e.prototype.balanceGold = 0;
e.prototype.balanceCard = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.userStatus && Object.hasOwnProperty.call(e, "userStatus") && t.uint32(8).uint32(e.userStatus);
null != e.balanceGiveNum && Object.hasOwnProperty.call(e, "balanceGiveNum") && t.uint32(16).uint32(e.balanceGiveNum);
null != e.balanceGold && Object.hasOwnProperty.call(e, "balanceGold") && t.uint32(24).int32(e.balanceGold);
null != e.balanceCard && Object.hasOwnProperty.call(e, "balanceCard") && t.uint32(32).int32(e.balanceCard);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCUserGoldInfo.GoldUserInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.userStatus = e.uint32();
break;

case 2:
n.balanceGiveNum = e.uint32();
break;

case 3:
n.balanceGold = e.int32();
break;

case 4:
n.balanceCard = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.userStatus && e.hasOwnProperty("userStatus") && !s.isInteger(e.userStatus) ? "userStatus: integer expected" : null != e.balanceGiveNum && e.hasOwnProperty("balanceGiveNum") && !s.isInteger(e.balanceGiveNum) ? "balanceGiveNum: integer expected" : null != e.balanceGold && e.hasOwnProperty("balanceGold") && !s.isInteger(e.balanceGold) ? "balanceGold: integer expected" : null != e.balanceCard && e.hasOwnProperty("balanceCard") && !s.isInteger(e.balanceCard) ? "balanceCard: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCUserGoldInfo.GoldUserInfo) return e;
var t = new l.pb.SCUserGoldInfo.GoldUserInfo();
null != e.userStatus && (t.userStatus = e.userStatus >>> 0);
null != e.balanceGiveNum && (t.balanceGiveNum = e.balanceGiveNum >>> 0);
null != e.balanceGold && (t.balanceGold = 0 | e.balanceGold);
null != e.balanceCard && (t.balanceCard = 0 | e.balanceCard);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.userStatus = 0;
o.balanceGiveNum = 0;
o.balanceGold = 0;
o.balanceCard = 0;
}
null != e.userStatus && e.hasOwnProperty("userStatus") && (o.userStatus = e.userStatus);
null != e.balanceGiveNum && e.hasOwnProperty("balanceGiveNum") && (o.balanceGiveNum = e.balanceGiveNum);
null != e.balanceGold && e.hasOwnProperty("balanceGold") && (o.balanceGold = e.balanceGold);
null != e.balanceCard && e.hasOwnProperty("balanceCard") && (o.balanceCard = e.balanceCard);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSGoldGameStart = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.matchMode = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.matchMode && Object.hasOwnProperty.call(e, "matchMode") && t.uint32(16).uint32(e.matchMode);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGoldGameStart(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.matchMode = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.matchMode && e.hasOwnProperty("matchMode") && !s.isInteger(e.matchMode) ? "matchMode: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGoldGameStart) return e;
var t = new l.pb.CSGoldGameStart();
null != e.id && (t.id = e.id >>> 0);
null != e.matchMode && (t.matchMode = e.matchMode >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.matchMode = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.matchMode && e.hasOwnProperty("matchMode") && (o.matchMode = e.matchMode);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGoldGameStart = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.info = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.info && Object.hasOwnProperty.call(e, "info") && l.pb.SCGoldGameStart.GameMate.encode(e.info, t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGameStart(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.info = l.pb.SCGoldGameStart.GameMate.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (t = l.pb.SCResult.verify(e.res)) return "res." + t;
}
if (null != e.info && e.hasOwnProperty("info")) {
var t;
if (t = l.pb.SCGoldGameStart.GameMate.verify(e.info)) return "info." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGameStart) return e;
var t = new l.pb.SCGoldGameStart();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGoldGameStart.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (null != e.info) {
if ("object" !== n(e.info)) throw TypeError(".pb.SCGoldGameStart.info: object expected");
t.info = l.pb.SCGoldGameStart.GameMate.fromObject(e.info);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.info = null;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.info && e.hasOwnProperty("info") && (o.info = l.pb.SCGoldGameStart.GameMate.toObject(e.info, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.GameMate = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.startTime = s.Long ? s.Long.fromBits(0, 0, !1) : 0;
e.prototype.waitingTime = 0;
e.prototype.timeout = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.startTime && Object.hasOwnProperty.call(e, "startTime") && t.uint32(8).int64(e.startTime);
null != e.waitingTime && Object.hasOwnProperty.call(e, "waitingTime") && t.uint32(16).uint32(e.waitingTime);
null != e.timeout && Object.hasOwnProperty.call(e, "timeout") && t.uint32(24).uint32(e.timeout);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGameStart.GameMate(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.startTime = e.int64();
break;

case 2:
n.waitingTime = e.uint32();
break;

case 3:
n.timeout = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.startTime && e.hasOwnProperty("startTime") && !(s.isInteger(e.startTime) || e.startTime && s.isInteger(e.startTime.low) && s.isInteger(e.startTime.high)) ? "startTime: integer|Long expected" : null != e.waitingTime && e.hasOwnProperty("waitingTime") && !s.isInteger(e.waitingTime) ? "waitingTime: integer expected" : null != e.timeout && e.hasOwnProperty("timeout") && !s.isInteger(e.timeout) ? "timeout: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGameStart.GameMate) return e;
var t = new l.pb.SCGoldGameStart.GameMate();
null != e.startTime && (s.Long ? (t.startTime = s.Long.fromValue(e.startTime)).unsigned = !1 : "string" == typeof e.startTime ? t.startTime = parseInt(e.startTime, 10) : "number" == typeof e.startTime ? t.startTime = e.startTime : "object" === n(e.startTime) && (t.startTime = new s.LongBits(e.startTime.low >>> 0, e.startTime.high >>> 0).toNumber()));
null != e.waitingTime && (t.waitingTime = e.waitingTime >>> 0);
null != e.timeout && (t.timeout = e.timeout >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
if (s.Long) {
var n = new s.Long(0, 0, !1);
o.startTime = t.longs === String ? n.toString() : t.longs === Number ? n.toNumber() : n;
} else o.startTime = t.longs === String ? "0" : 0;
o.waitingTime = 0;
o.timeout = 0;
}
null != e.startTime && e.hasOwnProperty("startTime") && ("number" == typeof e.startTime ? o.startTime = t.longs === String ? String(e.startTime) : e.startTime : o.startTime = t.longs === String ? s.Long.prototype.toString.call(e.startTime) : t.longs === Number ? new s.LongBits(e.startTime.low >>> 0, e.startTime.high >>> 0).toNumber() : e.startTime);
null != e.waitingTime && e.hasOwnProperty("waitingTime") && (o.waitingTime = e.waitingTime);
null != e.timeout && e.hasOwnProperty("timeout") && (o.timeout = e.timeout);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSObtainGoldCoins = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.card = 0;
e.prototype.id = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.card && Object.hasOwnProperty.call(e, "card") && t.uint32(8).uint32(e.card);
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(16).uint32(e.id);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSObtainGoldCoins(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.card = e.uint32();
break;

case 2:
n.id = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.card && e.hasOwnProperty("card") && !s.isInteger(e.card) ? "card: integer expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSObtainGoldCoins) return e;
var t = new l.pb.CSObtainGoldCoins();
null != e.card && (t.card = e.card >>> 0);
null != e.id && (t.id = e.id >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.card = 0;
o.id = 0;
}
null != e.card && e.hasOwnProperty("card") && (o.card = e.card);
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCObtainGoldCoins = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.info = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
null != e.info && Object.hasOwnProperty.call(e, "info") && l.pb.SCObtainGoldCoins.GoldGiveAwayInfo.encode(e.info, t.uint32(18).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCObtainGoldCoins(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.info = l.pb.SCObtainGoldCoins.GoldGiveAwayInfo.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (t = l.pb.SCResult.verify(e.res)) return "res." + t;
}
if (null != e.info && e.hasOwnProperty("info")) {
var t;
if (t = l.pb.SCObtainGoldCoins.GoldGiveAwayInfo.verify(e.info)) return "info." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCObtainGoldCoins) return e;
var t = new l.pb.SCObtainGoldCoins();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCObtainGoldCoins.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (null != e.info) {
if ("object" !== n(e.info)) throw TypeError(".pb.SCObtainGoldCoins.info: object expected");
t.info = l.pb.SCObtainGoldCoins.GoldGiveAwayInfo.fromObject(e.info);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.res = null;
o.info = null;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
null != e.info && e.hasOwnProperty("info") && (o.info = l.pb.SCObtainGoldCoins.GoldGiveAwayInfo.toObject(e.info, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.GoldGiveAwayInfo = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.balanceCard = 0;
e.prototype.balanceGold = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.balanceCard && Object.hasOwnProperty.call(e, "balanceCard") && t.uint32(24).int32(e.balanceCard);
null != e.balanceGold && Object.hasOwnProperty.call(e, "balanceGold") && t.uint32(32).int32(e.balanceGold);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCObtainGoldCoins.GoldGiveAwayInfo(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 3:
n.balanceCard = e.int32();
break;

case 4:
n.balanceGold = e.int32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.balanceCard && e.hasOwnProperty("balanceCard") && !s.isInteger(e.balanceCard) ? "balanceCard: integer expected" : null != e.balanceGold && e.hasOwnProperty("balanceGold") && !s.isInteger(e.balanceGold) ? "balanceGold: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCObtainGoldCoins.GoldGiveAwayInfo) return e;
var t = new l.pb.SCObtainGoldCoins.GoldGiveAwayInfo();
null != e.balanceCard && (t.balanceCard = 0 | e.balanceCard);
null != e.balanceGold && (t.balanceGold = 0 | e.balanceGold);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.balanceCard = 0;
o.balanceGold = 0;
}
null != e.balanceCard && e.hasOwnProperty("balanceCard") && (o.balanceCard = e.balanceCard);
null != e.balanceGold && e.hasOwnProperty("balanceGold") && (o.balanceGold = e.balanceGold);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
e.CSGoldGameStopMatch = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.matchMode = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.matchMode && Object.hasOwnProperty.call(e, "matchMode") && t.uint32(16).uint32(e.matchMode);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGoldGameStopMatch(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.matchMode = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.matchMode && e.hasOwnProperty("matchMode") && !s.isInteger(e.matchMode) ? "matchMode: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGoldGameStopMatch) return e;
var t = new l.pb.CSGoldGameStopMatch();
null != e.id && (t.id = e.id >>> 0);
null != e.matchMode && (t.matchMode = e.matchMode >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.matchMode = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.matchMode && e.hasOwnProperty("matchMode") && (o.matchMode = e.matchMode);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGoldGameStopMatch = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGameStopMatch(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
var t = l.pb.SCResult.verify(e.res);
if (t) return "res." + t;
}
return null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGameStopMatch) return e;
var t = new l.pb.SCGoldGameStopMatch();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGoldGameStopMatch.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
t.defaults && (o.res = null);
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.CSGoldGoods = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.limit = 0;
e.prototype.offset = 0;
e.prototype.page = 0;
e.prototype.perPage = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(8).uint32(e.limit);
null != e.offset && Object.hasOwnProperty.call(e, "offset") && t.uint32(16).uint32(e.offset);
null != e.page && Object.hasOwnProperty.call(e, "page") && t.uint32(24).uint32(e.page);
null != e.perPage && Object.hasOwnProperty.call(e, "perPage") && t.uint32(32).uint32(e.perPage);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.CSGoldGoods(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.limit = e.uint32();
break;

case 2:
n.offset = e.uint32();
break;

case 3:
n.page = e.uint32();
break;

case 4:
n.perPage = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.limit && e.hasOwnProperty("limit") && !s.isInteger(e.limit) ? "limit: integer expected" : null != e.offset && e.hasOwnProperty("offset") && !s.isInteger(e.offset) ? "offset: integer expected" : null != e.page && e.hasOwnProperty("page") && !s.isInteger(e.page) ? "page: integer expected" : null != e.perPage && e.hasOwnProperty("perPage") && !s.isInteger(e.perPage) ? "perPage: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.CSGoldGoods) return e;
var t = new l.pb.CSGoldGoods();
null != e.limit && (t.limit = e.limit >>> 0);
null != e.offset && (t.offset = e.offset >>> 0);
null != e.page && (t.page = e.page >>> 0);
null != e.perPage && (t.perPage = e.perPage >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.limit = 0;
o.offset = 0;
o.page = 0;
o.perPage = 0;
}
null != e.limit && e.hasOwnProperty("limit") && (o.limit = e.limit);
null != e.offset && e.hasOwnProperty("offset") && (o.offset = e.offset);
null != e.page && e.hasOwnProperty("page") && (o.page = e.page);
null != e.perPage && e.hasOwnProperty("perPage") && (o.perPage = e.perPage);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
e.SCGoldGoods = function() {
function e(e) {
this.goods = [];
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.res = null;
e.prototype.goods = s.emptyArray;
e.prototype.count = 0;
e.prototype.total = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.res && Object.hasOwnProperty.call(e, "res") && l.pb.SCResult.encode(e.res, t.uint32(10).fork()).ldelim();
if (null != e.goods && e.goods.length) for (var o = 0; o < e.goods.length; ++o) l.pb.SCGoldGoods.Good.encode(e.goods[o], t.uint32(18).fork()).ldelim();
null != e.count && Object.hasOwnProperty.call(e, "count") && t.uint32(24).uint32(e.count);
null != e.total && Object.hasOwnProperty.call(e, "total") && t.uint32(32).uint32(e.total);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGoods(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.res = l.pb.SCResult.decode(e, e.uint32());
break;

case 2:
n.goods && n.goods.length || (n.goods = []);
n.goods.push(l.pb.SCGoldGoods.Good.decode(e, e.uint32()));
break;

case 3:
n.count = e.uint32();
break;

case 4:
n.total = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
if ("object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e) return "object expected";
if (null != e.res && e.hasOwnProperty("res")) {
if (o = l.pb.SCResult.verify(e.res)) return "res." + o;
}
if (null != e.goods && e.hasOwnProperty("goods")) {
if (!Array.isArray(e.goods)) return "goods: array expected";
for (var t = 0; t < e.goods.length; ++t) {
var o;
if (o = l.pb.SCGoldGoods.Good.verify(e.goods[t])) return "goods." + o;
}
}
return null != e.count && e.hasOwnProperty("count") && !s.isInteger(e.count) ? "count: integer expected" : null != e.total && e.hasOwnProperty("total") && !s.isInteger(e.total) ? "total: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGoods) return e;
var t = new l.pb.SCGoldGoods();
if (null != e.res) {
if ("object" !== n(e.res)) throw TypeError(".pb.SCGoldGoods.res: object expected");
t.res = l.pb.SCResult.fromObject(e.res);
}
if (e.goods) {
if (!Array.isArray(e.goods)) throw TypeError(".pb.SCGoldGoods.goods: array expected");
t.goods = [];
for (var o = 0; o < e.goods.length; ++o) {
if ("object" !== n(e.goods[o])) throw TypeError(".pb.SCGoldGoods.goods: object expected");
t.goods[o] = l.pb.SCGoldGoods.Good.fromObject(e.goods[o]);
}
}
null != e.count && (t.count = e.count >>> 0);
null != e.total && (t.total = e.total >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
(t.arrays || t.defaults) && (o.goods = []);
if (t.defaults) {
o.res = null;
o.count = 0;
o.total = 0;
}
null != e.res && e.hasOwnProperty("res") && (o.res = l.pb.SCResult.toObject(e.res, t));
if (e.goods && e.goods.length) {
o.goods = [];
for (var n = 0; n < e.goods.length; ++n) o.goods[n] = l.pb.SCGoldGoods.Good.toObject(e.goods[n], t);
}
null != e.count && e.hasOwnProperty("count") && (o.count = e.count);
null != e.total && e.hasOwnProperty("total") && (o.total = e.total);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
e.Good = function() {
function e(e) {
if (e) for (var t = Object.keys(e), o = 0; o < t.length; ++o) null != e[t[o]] && (this[t[o]] = e[t[o]]);
}
e.prototype.id = 0;
e.prototype.name = "";
e.prototype.number = 0;
e.prototype.largess = 0;
e.prototype.description = "";
e.prototype.price = 0;
e.create = function(t) {
return new e(t);
};
e.encode = function(e, t) {
t || (t = a.create());
null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).uint32(e.id);
null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name);
null != e.number && Object.hasOwnProperty.call(e, "number") && t.uint32(24).uint32(e.number);
null != e.largess && Object.hasOwnProperty.call(e, "largess") && t.uint32(32).uint32(e.largess);
null != e.description && Object.hasOwnProperty.call(e, "description") && t.uint32(42).string(e.description);
null != e.price && Object.hasOwnProperty.call(e, "price") && t.uint32(48).uint32(e.price);
return t;
};
e.encodeDelimited = function(e, t) {
return this.encode(e, t).ldelim();
};
e.decode = function(e, t) {
e instanceof i || (e = i.create(e));
for (var o = void 0 === t ? e.len : e.pos + t, n = new l.pb.SCGoldGoods.Good(); e.pos < o; ) {
var r = e.uint32();
switch (r >>> 3) {
case 1:
n.id = e.uint32();
break;

case 2:
n.name = e.string();
break;

case 3:
n.number = e.uint32();
break;

case 4:
n.largess = e.uint32();
break;

case 5:
n.description = e.string();
break;

case 6:
n.price = e.uint32();
break;

default:
e.skipType(7 & r);
}
}
return n;
};
e.decodeDelimited = function(e) {
e instanceof i || (e = new i(e));
return this.decode(e, e.uint32());
};
e.verify = function(e) {
return "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || null === e ? "object expected" : null != e.id && e.hasOwnProperty("id") && !s.isInteger(e.id) ? "id: integer expected" : null != e.name && e.hasOwnProperty("name") && !s.isString(e.name) ? "name: string expected" : null != e.number && e.hasOwnProperty("number") && !s.isInteger(e.number) ? "number: integer expected" : null != e.largess && e.hasOwnProperty("largess") && !s.isInteger(e.largess) ? "largess: integer expected" : null != e.description && e.hasOwnProperty("description") && !s.isString(e.description) ? "description: string expected" : null != e.price && e.hasOwnProperty("price") && !s.isInteger(e.price) ? "price: integer expected" : null;
};
e.fromObject = function(e) {
if (e instanceof l.pb.SCGoldGoods.Good) return e;
var t = new l.pb.SCGoldGoods.Good();
null != e.id && (t.id = e.id >>> 0);
null != e.name && (t.name = String(e.name));
null != e.number && (t.number = e.number >>> 0);
null != e.largess && (t.largess = e.largess >>> 0);
null != e.description && (t.description = String(e.description));
null != e.price && (t.price = e.price >>> 0);
return t;
};
e.toObject = function(e, t) {
t || (t = {});
var o = {};
if (t.defaults) {
o.id = 0;
o.name = "";
o.number = 0;
o.largess = 0;
o.description = "";
o.price = 0;
}
null != e.id && e.hasOwnProperty("id") && (o.id = e.id);
null != e.name && e.hasOwnProperty("name") && (o.name = e.name);
null != e.number && e.hasOwnProperty("number") && (o.number = e.number);
null != e.largess && e.hasOwnProperty("largess") && (o.largess = e.largess);
null != e.description && e.hasOwnProperty("description") && (o.description = e.description);
null != e.price && e.hasOwnProperty("price") && (o.price = e.price);
return o;
};
e.prototype.toJSON = function() {
return this.constructor.toObject(this, r.util.toJSONOptions);
};
return e;
}();
return e;
}();
return e;
}();
t.exports = l;
cc._RF.pop();
