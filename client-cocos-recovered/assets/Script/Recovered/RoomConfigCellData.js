// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "648c27AZCxH1LzvQn4fOq2t", "RoomConfigCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = e("./RoomConfig"), i = e("./CommonUtils"), a = e("./gContext"), s = e("./EventKeys"), l = e("./CommonEnum");
(function(e) {
e[e.peopleCount = 1] = "peopleCount";
e[e.gameCount = 2] = "gameCount";
e[e.payType = 3] = "payType";
})(n = o.eRoomConfigTypes || (o.eRoomConfigTypes = {}));
var c = function() {
function e(e) {
this.index = 0;
this._storageData = null;
this.index = e.index;
this._storageData = i.default.clone(e);
}
e.prototype.replaceDYJPay = function() {
var e = this._storageData.ids;
if (2 === this.index && e) {
for (var q = e.length - 1; q >= 0; q--) (1 === e[q] || 26 === e[q]) && (e[q] = 2);
this._storageData.ids = this._unique(e);
e = this._storageData.ids;
}
if (e.length > 0) {
var t = 14, o = 12;
if (this.index === l.eGameIds.MCHZ || this.index === l.eGameIds.QJHH || this.index === l.eGameIds.QJHZ || this.index === l.eGameIds.HMMJ) {
t = 14;
o = 12;
} else if (this.index === l.eGameIds.PDKAA) {
t = 7;
o = 5;
} else if (this.index === l.eGameIds.TMHH) {
t = 12;
o = 10;
} else if (this.index === l.eGameIds.QJSHZ || this.index === l.eGameIds.QJWSKBD || this.index === l.eGameIds.QCDG || this.index === l.eGameIds.XSWSK) {
t = 8;
o = 6;
} else if (this.index === l.eGameIds.HZHH) {
t = 17;
o = 12;
} else if (this.index === l.eGameIds.HZHZ) {
t = 16;
o = 11;
} else if (this.index === l.eGameIds.LTMJ) {
t = 21;
o = 10;
} else if (this.index === l.eGameIds.XSMJ || this.index === l.eGameIds.QCHZ) {
t = 16;
o = 10;
} else if (this.index === l.eGameIds.D7XS) {
t = 13;
o = 11;
} else if (this.index === l.eGameIds.QCHH || this.index === l.eGameIds.QCGD) {
t = 15;
o = 13;
}
var n = e.indexOf(t);
if (n > -1) {
this._storageData.ids[n] = o;
var r = this._storageData.ids;
this._storageData.ids = this._unique(r);
}
}
};
e.prototype._unique = function(e) {
for (var t = [], o = {}, n = 0; n < e.length; n++) if (!o[e[n]]) {
o[e[n]] = 1;
t.push(e[n]);
}
return t;
};
e.defData = function(e) {
var t = {
index: e,
ipLimit: 0,
ids: []
}, o = r.default[e].attr;
for (var n in o) for (var i = o[parseInt(n)].defCheck, a = 0, s = i.length; a < s; a++) t.ids.push(i[a]);
return t;
};
e.prototype.sortIds = function(e) {
var t = r.default[this.index], o = t.attr;
return i.default.clone(o[e].detailIds).sort(function(e, o) {
var n = t.options[e], r = t.options[o];
return (n.weight || 0) - (r.weight || 0);
});
};
e.prototype.negationIP = function() {
1 === this._storageData.ipLimit ? this._storageData.ipLimit = 0 : this._storageData.ipLimit = 1;
};
e.prototype.IPStatus = function() {
return 1 === this._storageData.ipLimit;
};
e.prototype.sortTypes = function() {
for (var e = r.default[this.index].attr, t = Object.keys(e), o = [], n = 0, i = t.length; n < i; n++) {
var a = t[n];
e[a].hide || o.push(a);
}
return o.sort(function(t, o) {
var n = e[t], r = e[o];
return n.weight - r.weight;
});
};
e.prototype.gameName = function() {
return r.default[this.index].name;
};
e.prototype.category = function() {
return r.default[this.index].category;
};
e.prototype.lineCount = function(e) {
return r.default[this.index].attr[e].lineCount;
};
e.prototype.typeName = function(e) {
return r.default[this.index].attr[e].desc;
};
e.prototype.desc = function(e, t, o) {
void 0 === t && (t = !0);
var i = r.default[this.index], a = i.attr[n.gameCount].detailIds;
if (1 === this.cellStyle(e)) return this.getValue(e) + i.options[e].desc;
if (-1 !== a.indexOf(e)) {
var s = this.getValue(e);
if (t) {
var c = s / i.gameCountMul;
12 === s && i.index === l.eGameIds.XSMJ ? c = Math.ceil(c) : 12 === s && i.index === l.eGameIds.DYKKF ? c = Math.ceil(c) : 12 === s && i.index === l.eGameIds.DYHH ? c = Math.ceil(c) : 12 === s && i.index === l.eGameIds.DBDAA ? c = Math.ceil(c) : 12 === s && i.index === l.eGameIds.DDZ && (c = Math.ceil(c));
return this.payType() === l.eGamePayType.AA ? s + "局(" + c + "张房卡)" : s + "局(" + this.peopleCount() * c + "张房卡)";
}
return s + "局";
}
return o ? i.options[e].clubTableDetail : i.options[e].desc;
};
e.prototype.descDetails = function(e, t) {
void 0 === t && (t = !0);
var o = r.default[this.index].options[e].descDetail;
return void 0 === o || null === o ? this.desc(e, t) : o.replace("%s", this.getValue(e) + "");
};
e.prototype._listDesc = function(e, t, o) {
for (var n = "", r = 0, i = e.length; r < i; r++) {
var a = e[r], s = !1;
1 === this.cellStyle(a) ? s = !0 : this.isChecked(a) && (s = !0);
if (s) {
var l = o(a);
l && (n ? n = n + t + l : n += l);
}
}
return n;
};
e.prototype.listDescDetails = function(e, t) {
var o = this;
return this._listDesc(e, t, function(e) {
return o.descDetails(e);
});
};
e.prototype.listDesc = function(e, t, o) {
var n = this;
return this._listDesc(e, t, function(e) {
return n.desc(e, !0, o);
});
};
e.prototype.getValue = function(e) {
var t = r.default[this.index];
if (1 === this.cellStyle(e)) {
var o;
void 0 !== (o = (this._storageData.other || {})[e]) && null !== o || (o = t.options[e].reject[0]);
return o;
}
return o = t.options[e].value;
};
e.prototype.note = function(e) {
return r.default[this.index].options[e].note;
};
e.prototype._getSingleValue = function(e) {
var t = this._getCheckedIds(e);
if (1 !== t.length && e === n.payType) {
var o = 1;
this.index === l.eGameIds.MCHZ || this.index === l.eGameIds.QJHH || this.index === l.eGameIds.QJHZ || this.index === l.eGameIds.HMMJ || this.index === l.eGameIds.HZHH ? o = this.getValue(12) : this.index === l.eGameIds.PDKAA ? o = this.getValue(5) : this.index === l.eGameIds.TMHH || this.index === l.eGameIds.LTMJ || this.index === l.eGameIds.XSMJ || this.index === l.eGameIds.QCHZ ? o = this.getValue(10) : this.index === l.eGameIds.QJSHZ || this.index === l.eGameIds.QJWSKBD || this.index === l.eGameIds.QCDG ? o = this.getValue(6) : this.index === l.eGameIds.HZHZ || this.index === l.eGameIds.D7XS || this.index === l.eGameIds.DYKKF || this.index === l.eGameIds.DBDAA ? o = this.getValue(11) : this.index !== l.eGameIds.QCHH && this.index !== l.eGameIds.QCGD || (o = this.getValue(13));
return o;
}
var r = t[0];
return this.getValue(r);
};
e.prototype.gameCount = function() {
return this._getSingleValue(n.gameCount);
};
e.prototype.peopleCount = function() {
return this._getSingleValue(n.peopleCount);
};
e.prototype.payType = function() {
return this._getSingleValue(n.payType);
};
e.prototype.findCheckedIds = function(e) {
for (var t = [], o = 0, n = e.length; o < n; o++) {
var r = e[o];
1 === this.cellStyle(r) ? cc.error("加减类型的不要调用findCheckedIds") : this.isChecked(r) && t.push(r);
}
return t;
};
e.prototype._getCheckedIds = function(e) {
var t = r.default[this.index].attr[e];
if (!t) return [];
for (var o = t.allIds || t.detailIds, n = [], i = 0, a = o.length; i < a; i++) {
var s = o[i];
this.isChecked(s) && n.push(s);
}
return n;
};
e.prototype._saveStyle1 = function(e, t) {
this._storageData.other = this._storageData.other || {};
this._storageData.other[e] = t;
a.default.eventUtils.emit(s.default.ui_create_room_item_clicked, e);
};
e.prototype.onClickAdd = function(e) {
var t = r.default[this.index];
if (1 === this.cellStyle(e)) {
for (var o = this.getValue(e), n = t.options[e].reject || [], i = 0; i < n.length; i++) if (n[i] === o) {
void 0 === (a = n[i + 1]) || null === a || this._saveStyle1(e, a);
return;
}
for (i = 0; i < n.length; i++) if (n[i] > o) {
var a = n[i];
this._saveStyle1(e, a);
return;
}
this._saveStyle1(e, n[0]);
} else cc.error("错误的类型");
};
e.prototype.onClickSub = function(e) {
var t = r.default[this.index];
if (1 === this.cellStyle(e)) {
for (var o = this.getValue(e), n = t.options[e].reject || [], i = n.length - 1; i >= 0; i--) if (n[i] === o) {
void 0 === (a = n[i - 1]) || null === a || this._saveStyle1(e, a);
return;
}
for (i = n.length - 1; i >= 0; i--) if (n[i] < o) {
var a = n[i];
this._saveStyle1(e, a);
return;
}
this._saveStyle1(e, n[0]);
} else cc.error("错误的类型");
};
e.prototype.onClicked = function(e) {
var t = function(e, t) {
for (var o = [], n = 0, r = t.length; n < r; n++) {
var i = t[n];
i !== e && o.push(i);
}
return o;
}(e, r.default[this.index].options[e].reject || []);
if (t.length > 0) {
if (this.isChecked(e)) ; else {
for (var o = 0, n = t.length; o < n; o++) {
var i = t[o];
this.isChecked(i) && this._checkbox(i);
}
this._checkbox(e);
}
} else this._checkbox(e);
};
e.prototype._checkbox = function(e) {
for (var t = this._storageData.ids, o = 0, n = t.length; o < n; o++) if (t[o] === e) {
t.splice(o, 1);
a.default.eventUtils.emit(s.default.ui_create_room_item_clicked, e);
return;
}
t.push(e);
a.default.eventUtils.emit(s.default.ui_create_room_item_clicked, e);
};
e.prototype.isChecked = function(e) {
if (this.isForceUncheck(e)) return !1;
if (this.isForceCheck(e)) return !0;
for (var t = this._storageData.ids, o = 0, n = t.length; o < n; o++) if (t[o] === e) return !!this.isVisible(e);
return !1;
};
e.prototype.isOnlyClub = function(e) {
return r.default[this.index].options[e].onlyClub || !1;
};
e.prototype.isOnlyHall = function(e) {
return r.default[this.index].options[e].onlyHall || !1;
};
e.prototype.isHide = function(e) {
return r.default[this.index].options[e].isHide || !1;
};
e.prototype.cellStyle = function(e) {
return r.default[this.index].options[e].style || 0;
};
e.prototype.isVisible = function(e) {
return this._reject(e) && this._limit(e);
};
e.prototype.isForceCheck = function(e) {
for (var t = r.default[this.index].options[e].forceCheck || [], o = 0, n = t.length; o < n; o++) {
var i = t[o];
if (this.isChecked(i)) return !0;
}
return !1;
};
e.prototype.isForceUncheck = function(e) {
for (var t = r.default[this.index].options[e].forceUncheck || [], o = 0, n = t.length; o < n; o++) {
var i = t[o];
if (this.isChecked(i)) return !0;
}
return !1;
};
e.prototype.isRadio = function(e) {
return (r.default[this.index].options[e].reject || []).length > 1;
};
e.prototype._reject = function(e) {
for (var t = r.default[this.index], o = t.options[e].rejectVisible || [], n = 0, i = o.length; n < i; n++) {
var a = o[n];
if (1 == t.index && 40 == e) return !!this.isChecked(a);
if (this.isChecked(a)) return !1;
}
return !0;
};
e.prototype._limit = function(e) {
var t = this, o = r.default[this.index].options[e].limitVisible || [], n = function(e) {
for (var o = 0, n = e.length; o < n; o++) {
var r = e[o];
if (!t.isChecked(r)) return !1;
}
return !0;
};
if (o.length < 1) return !0;
for (var i = 0, a = o.length; i < a; i++) {
if (n(o[i])) return !0;
}
return !1;
};
e.prototype.rulesImgPaths = function() {
for (var e = [], t = r.default[this.index].ruleDescImgs, o = 0, n = t.length; o < n; o++) {
var i = t[o];
e.push("Hall/Res/Texture/Rules/" + i);
}
return e;
};
e.prototype.storageData = function() {
return this._storageData;
};
return e;
}();
o.default = c;
cc._RF.pop();
