// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "268cdRpUfBE0ZqEvBzG03Tr", "DateTimeSelector");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./SoundUtils"), l = require("./EventUtils"), c = cc._decorator, u = c.ccclass, d = c.property, p = [ 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 0 ], f = [ 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 0, 0 ], h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curStartS = 0;
t._curStartF = 0;
t._curStartM = 0;
t._curEndS = 0;
t._curEndF = 0;
t._curEndM = 0;
t.startNodeS = null;
t.startNodeF = null;
t.startNodeM = null;
t.endNodeS = null;
t.endNodeF = null;
t.endNodeM = null;
t.bg = null;
t.botLab = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.bg.active = !1;
i.default.eventUtils.on(a.default.ui_date_selector_time_reset, function(t) {
e.onClickCancel();
}, this, l.eOffType.OnDestroy);
};
t.prototype.setData = function() {
var e = this.startNodeS.getComponent("SliderSelect_s").selectIndex(), t = this.startNodeF.getComponent("SliderSelect_s").selectIndex(), o = this.startNodeM.getComponent("SliderSelect_s").selectIndex();
this._curStartS = p[e];
this._curStartF = f[t];
this._curStartM = f[o];
var n = this.endNodeS.getComponent("SliderSelect_s").selectIndex(), r = this.endNodeF.getComponent("SliderSelect_s").selectIndex(), i = this.endNodeM.getComponent("SliderSelect_s").selectIndex();
this._curEndS = p[n];
this._curEndF = f[r];
this._curEndM = f[i];
this.setLabelColor(e, t, o, n, r, i);
};
t.prototype.setLabelColor = function(e, t, o, n, r, i) {
this.startNodeS.getChildByName("view").getChildByName("content").children[e].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
this.startNodeF.getChildByName("view").getChildByName("content").children[t].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
this.startNodeM.getChildByName("view").getChildByName("content").children[o].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
this.endNodeS.getChildByName("view").getChildByName("content").children[n].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
this.endNodeF.getChildByName("view").getChildByName("content").children[r].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
this.endNodeM.getChildByName("view").getChildByName("content").children[i].getChildByName("num").color = new cc.Color(178, 35, 7, 255);
};
t.prototype.onClickDaySelector = function() {
s.default.clickBtn();
this.bg.active ? this.bg.active = !1 : this.bg.active = !0;
};
t.prototype.onClickCancel = function() {
this._curStartS = 0;
this._curStartF = 0;
this._curStartM = 0;
this._curEndS = 0;
this._curEndF = 0;
this._curEndM = 0;
this.bg.active = !0;
var e = [ this._curStartS, this._curStartF, this._curStartM, this._curEndS, this._curEndF, this._curEndM ];
i.default.eventUtils.emit(a.default.ui_date_selector_time_change, e);
this.botLab.string = "全天时段";
this._updateUI();
for (var t = this.startNodeS.getChildByName("view").getChildByName("content"), o = 0; o < t.children.length - 1; o++) t.children[o].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
var n = this.startNodeF.getChildByName("view").getChildByName("content");
for (o = 0; o < n.children.length - 1; o++) n.children[o].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
var r = this.startNodeM.getChildByName("view").getChildByName("content");
for (o = 0; o < r.children.length - 1; o++) r.children[o].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
var s = this.endNodeS.getChildByName("view").getChildByName("content");
for (o = 0; o < s.children.length - 1; o++) s.children[o].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
var l = this.endNodeF.getChildByName("view").getChildByName("content");
for (o = 0; o < l.children.length - 1; o++) l.children[o].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
var c = this.endNodeM.getChildByName("view").getChildByName("content");
for (o = 0; o < c.children.length - 1; o++) c.children[o].getChildByName("num").color = new cc.Color(93, 70, 26, 255);
this.setLabelColor(2, 2, 2, 2, 2, 2);
};
t.prototype._updateUI = function() {
this.startNodeS.getComponent("SliderSelect_s").jump_to_0();
this.startNodeF.getComponent("SliderSelect_s").jump_to_0();
this.startNodeM.getComponent("SliderSelect_s").jump_to_0();
this.endNodeS.getComponent("SliderSelect_s").jump_to_0();
this.endNodeF.getComponent("SliderSelect_s").jump_to_0();
this.endNodeM.getComponent("SliderSelect_s").jump_to_0();
this.onClickHide();
};
t.prototype.onClickOk = function() {
this.setData();
if (60 * this._curStartS * 60 + 60 * this._curStartF + this._curStartM > 60 * this._curEndS * 60 + 60 * this._curEndF + this._curEndM) i.default.uiHelper.showTip("开始时间不能大于结束时间！"); else {
var e = [ this._curStartS, this._curStartF, this._curStartM, this._curEndS, this._curEndF, this._curEndM ];
i.default.eventUtils.emit(a.default.ui_date_selector_time_change, e);
if (0 == this._curStartS && 0 == this._curStartF && 0 == this._curStartM && 0 == this._curEndS && 0 == this._curEndF && 0 == this._curEndM) this.botLab.string = "全天时段"; else {
var t = "", o = "", n = "", r = "", s = "", l = "";
t = this._curStartS > 9 ? "" + this._curStartS : "0" + this._curStartS;
o = this._curStartF > 9 ? "" + this._curStartF : "0" + this._curStartF;
n = this._curStartM > 9 ? "" + this._curStartM : "0" + this._curStartM;
r = this._curEndS > 9 ? "" + this._curEndS : "0" + this._curEndS;
s = this._curEndF > 9 ? "" + this._curEndF : "0" + this._curEndF;
l = this._curEndM > 9 ? "" + this._curEndM : "0" + this._curEndM;
this.botLab.string = t + ":" + o + ":" + n + "-" + r + ":" + s + ":" + l;
}
this.onClickHide();
}
};
t.prototype.onClickHide = function() {
s.default.clickBtn();
this.bg.active = !1;
};
r([ d(cc.Node) ], t.prototype, "startNodeS", void 0);
r([ d(cc.Node) ], t.prototype, "startNodeF", void 0);
r([ d(cc.Node) ], t.prototype, "startNodeM", void 0);
r([ d(cc.Node) ], t.prototype, "endNodeS", void 0);
r([ d(cc.Node) ], t.prototype, "endNodeF", void 0);
r([ d(cc.Node) ], t.prototype, "endNodeM", void 0);
r([ d(cc.Node) ], t.prototype, "bg", void 0);
r([ d(cc.Label) ], t.prototype, "botLab", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
