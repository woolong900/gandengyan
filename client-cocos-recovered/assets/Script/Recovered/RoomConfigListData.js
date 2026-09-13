// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3550bjQMvhF/a5KhqMI2jVq", "RoomConfigListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./RoomConfig"), r = e("./Storage"), i = e("./RoomConfigCellData"), a = e("./GameConstant"), s = e("./CommonEnum"), l = Object.create(null), c = new (function() {
function e() {}
e.prototype.save = function() {
for (var e in l) r.default.saveRoomConfig(e, l[e].storageData());
};
e.prototype.get = function(e) {
var t = l[e];
if (t) return t;
var o = null, n = r.default.getRoomConfig(e);
if (n) {
this._newAdd(n);
o = n;
} else o = i.default.defData(e);
var a = new i.default(o);
l[e] = a;
return a;
};
e.prototype.collectionShow = function() {
return [].concat(a.default.gameList);
};
e.prototype.clean = function() {};
e.prototype._newAdd = function(e) {
var t = e.ids, o = function(e) {
for (var o = 0, n = t.length; o < n; o++) {
var r = t[o];
if (-1 !== e.indexOf(r)) return !1;
}
return !0;
}, r = function(e) {
for (var o = 0, n = e.length; o < n; o++) t.push(e[o]);
}, i = e.index;
if (i === s.eGameIds.D7XS) {
var a = n.default[i].attr[7];
o(a.detailIds) && r(a.defCheck);
}
if (i === s.eGameIds.TMHH) {
var l = n.default[i].attr[4];
o([ 18, 19 ]) && r(l.defCheck);
}
if (i === s.eGameIds.MCHZ) {
var c = n.default[i].attr[100];
o([ 16, 27 ]) && r(c.defCheck);
}
var u = n.default[i].attr, d = u[101];
if (d) {
o(d.detailIds) && r(d.defCheck);
}
var p = u[12];
if (p) {
o(p.detailIds) && r(p.defCheck);
}
};
return e;
}())();
o.default = c;
cc._RF.pop();
