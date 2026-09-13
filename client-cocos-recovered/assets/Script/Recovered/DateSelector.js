// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "43fe2Z8gElGeoI9CnyBO54r", "DateSelector");
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
}(), r = this && this.__decorate || function(e, t, o, n) {
var r, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, o, a) : r(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("./StringUtils"), a = e("./DateSelectorItem"), s = e("./UserData"), l = e("./gContext"), c = e("./EventKeys"), u = e("./SoundUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curMillisecond = 0;
t._detailsYear = "";
t._detailsMonth = "";
t.bg = null;
t.nowLabel = null;
t.nextDayBtn = null;
t.nextDay = null;
t.prevDayBtn = null;
t.prevDay = null;
t.nextMonthBtn = null;
t.nextMonth = null;
t.prevMonthBtn = null;
t.prevMonth = null;
t.topDate = null;
t.daysContainer = null;
return t;
}
t.prototype.start = function() {
var e = i.default.dateFormat(s.default.millisecond, "yyyy/MM/dd"), t = new Date(e + " GMT+8");
this._curMillisecond = t.getTime();
this.bg.active = !1;
this._updateUI();
};
t.prototype.onClickDaySelector = function() {
u.default.clickBtn();
if (this.bg.active) this.bg.active = !1; else {
this._initCurMonthDateStr();
this.bg.active = !0;
this._updateUI();
}
};
t.prototype.onClickNextDay = function() {
u.default.clickBtn();
this._curMillisecond = this._curMillisecond + 864e5;
l.default.eventUtils.emit(c.default.ui_date_selector_change, this._curMillisecond);
this._initCurMonthDateStr();
this._updateUI();
this.resetSFM();
};
t.prototype.onClickPrevDay = function() {
u.default.clickBtn();
this._curMillisecond = this._curMillisecond - 864e5;
l.default.eventUtils.emit(c.default.ui_date_selector_change, this._curMillisecond);
this._initCurMonthDateStr();
this._updateUI();
this.resetSFM();
};
t.prototype.resetSFM = function() {
l.default.eventUtils.emit(c.default.ui_date_selector_time_reset);
setTimeout(function() {
l.default.eventUtils.emit(c.default.ui_date_selector_time_change, [ 0, 0, 0, 0, 0, 0 ]);
}, 0);
};
t.prototype.onClickNextMonth = function() {
u.default.clickBtn();
if ("12" === this._detailsMonth) {
this._detailsMonth = "01";
this._detailsYear = "" + (parseInt(this._detailsYear) + 1);
} else {
this._detailsMonth = "" + (parseInt(this._detailsMonth) + 1);
1 === this._detailsMonth.length && (this._detailsMonth = "0" + this._detailsMonth);
}
this._updateUI();
};
t.prototype.onClickPrevMonth = function() {
u.default.clickBtn();
if ("01" === this._detailsMonth) {
this._detailsMonth = "12";
this._detailsYear = "" + (parseInt(this._detailsYear) - 1);
} else {
this._detailsMonth = "" + (parseInt(this._detailsMonth) - 1);
1 === this._detailsMonth.length && (this._detailsMonth = "0" + this._detailsMonth);
}
this._updateUI();
};
t.prototype.onClickHide = function() {
u.default.clickBtn();
this.bg.active = !1;
};
t.prototype._initCurMonthDateStr = function() {
this._detailsYear = i.default.dateFormat(this._curMillisecond, "yyyy");
this._detailsMonth = i.default.dateFormat(this._curMillisecond, "MM");
};
t.prototype._dayOffset = function(e, t) {
e += 288e5;
t += 288e5;
return Math.floor(e / 864e5) - Math.floor(t / 864e5);
};
t.prototype._monthOffset = function(e, t) {
var o = i.default.dateFormat(e, "yyyy"), n = i.default.dateFormat(t, "yyyy"), r = i.default.dateFormat(e, "MM"), a = i.default.dateFormat(t, "MM"), s = parseInt(o), l = parseInt(n), c = parseInt(r);
return 12 * (l - s) + (parseInt(a) - c);
};
t.prototype._updateUI = function() {
var e = i.default.dateFormat(this._curMillisecond, "yyyy-MM-dd");
this.nowLabel.string = e;
var t = this._dayOffset(s.default.millisecond, this._curMillisecond);
if (t > 0) {
this.nextDayBtn.enabled = !0;
this.nextDay.opacity = 255;
} else {
this.nextDayBtn.enabled = !1;
this.nextDay.opacity = 102;
}
if (t < 14) {
this.prevDayBtn.enabled = !0;
this.prevDay.opacity = 255;
} else {
this.prevDayBtn.enabled = !1;
this.prevDay.opacity = 102;
}
this.bg.active && this._updateDetails();
};
t.prototype._updateDetails = function() {
var e = this, t = new Date(this._detailsYear + "/" + this._detailsMonth + "/01 GMT+8").getTime();
this.topDate.string = i.default.dateFormat(t, "yyyy年MM月");
if (this._monthOffset(t, s.default.millisecond) > 0) {
this.nextMonthBtn.enabled = !0;
this.nextMonth.opacity = 255;
} else {
this.nextMonthBtn.enabled = !1;
this.nextMonth.opacity = 102;
}
if (this._monthOffset(s.default.millisecond - 12096e5, t) > 0) {
this.prevMonthBtn.enabled = !0;
this.prevMonth.opacity = 255;
} else {
this.prevMonthBtn.enabled = !1;
this.prevMonth.opacity = 102;
}
for (var o = i.default.dateFormat(s.default.millisecond, "yyyy-MM-dd"), n = i.default.dateFormat(s.default.millisecond - 12096e5, "yyyy-MM-dd"), r = i.default.dateFormat(this._curMillisecond, "yyyy-MM-dd"), u = this._monthDays(t), d = this.daysContainer.childrenCount, p = 0; p < d; p++) if (p < u) {
var f = this._detailsYear + "-" + this._detailsMonth + "-" + (p + 1);
p + 1 < 10 && (f = this._detailsYear + "-" + this._detailsMonth + "-0" + (p + 1));
var h = this.daysContainer.children[p].getComponent(a.default);
h.node.active = !0;
h.setData(p, function(t) {
var o = new Date(e._detailsYear + "/" + e._detailsMonth + "/" + (t + 1) + " GMT+8");
e._curMillisecond = o.getTime();
e._updateUI();
e.bg.active = !1;
l.default.eventUtils.emit(c.default.ui_date_selector_change, e._curMillisecond);
});
f === r ? h.setSelect(!0) : h.setSelect(!1);
f > o || f < n ? h.setEnable(!1) : h.setEnable(!0);
} else this.daysContainer.children[p].active = !1;
};
t.prototype._monthDays = function(e) {
var t = new Date(e + 288e5), o = t.getUTCMonth();
t.setMonth(o + 1);
t.setDate(0);
return t.getUTCDate();
};
r([ f(cc.Node) ], t.prototype, "bg", void 0);
r([ f(cc.Label) ], t.prototype, "nowLabel", void 0);
r([ f(cc.Button) ], t.prototype, "nextDayBtn", void 0);
r([ f(cc.Node) ], t.prototype, "nextDay", void 0);
r([ f(cc.Button) ], t.prototype, "prevDayBtn", void 0);
r([ f(cc.Node) ], t.prototype, "prevDay", void 0);
r([ f(cc.Button) ], t.prototype, "nextMonthBtn", void 0);
r([ f(cc.Node) ], t.prototype, "nextMonth", void 0);
r([ f(cc.Button) ], t.prototype, "prevMonthBtn", void 0);
r([ f(cc.Node) ], t.prototype, "prevMonth", void 0);
r([ f(cc.Label) ], t.prototype, "topDate", void 0);
r([ f(cc.Node) ], t.prototype, "daysContainer", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
