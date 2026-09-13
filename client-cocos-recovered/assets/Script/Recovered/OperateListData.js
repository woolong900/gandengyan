// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6ccf8KrrvdAn7hPcpeIhjul", "OperateListData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./OperateCellData"), r = e("./CommonUtils"), i = e("./OperateConfig"), a = e("./RoomInfoData"), s = e("./CommonEnum"), l = function() {
function e(e) {
this._data = [];
this._count = 0;
this._data = [];
this._count = 0;
for (var t = e || [], o = 0, r = t.length; o < r; o++) {
var i = new n.default(t[o]);
this.push(i);
}
}
e.prototype.push = function(t) {
this._data.push(t);
if (t.category === i.eOperateCategory.Gang && t.subType === i.eGangType.BuGang) for (var o = this.collection(e.filterPeng), n = 0; n < o.length; n++) {
var r = o[n], a = this.get(r);
a.cards[0] === t.cards[0] && a.setPengIsGang();
}
this._count = this._count + 1;
};
e.prototype.count = function() {
return this._count;
};
e.prototype.get = function(e) {
if (!(e >= this._count)) {
return this._data[e];
}
cc.error("index error.");
return null;
};
e.filterLiangShows = function(e) {
return !!e.smallText;
};
e.filterPiZiShows = function(e) {
var t = e.category;
return t === i.eOperateCategory.PiZi || t === i.eOperateCategory.LaiZi || a.default.config.index == s.eGameIds.QJHZ && t === i.eOperateCategory.XXF;
};
e.filterChiPengGang = function(e) {
var t = e.category;
return t === i.eOperateCategory.Peng || t === i.eOperateCategory.Chi || t === i.eOperateCategory.Gang || t === i.eOperateCategory.LiangDao;
};
e.filterGangShows = function(e) {
var t = e.category;
return t === i.eOperateCategory.Peng || t === i.eOperateCategory.Chi || (t === i.eOperateCategory.LiangDao || t === i.eOperateCategory.Gang && e.subType !== i.eGangType.BuGang);
};
e.filterPeng = function(e) {
return e.category === i.eOperateCategory.Peng;
};
e.filterGang = function(e) {
return e.category === i.eOperateCategory.Gang;
};
e.prototype.collection = function(e, t) {
return r.default.collection(this._data, e, t);
};
e.prototype.piZiShows = function() {
for (var e = [], t = 0, o = this._data.length; t < o; t++) {
var n = this._data[t].category;
n !== i.eOperateCategory.PiZi && n !== i.eOperateCategory.LaiZi || e.push(this._data[t]);
}
return e;
};
e.prototype.clean = function() {
this._data = [];
this._count = 0;
};
return e;
}();
o.default = l;
cc._RF.pop();
