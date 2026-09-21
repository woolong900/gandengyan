// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a14f5rHtANC8olHCdiuhV+4", "InnerCommon");
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
var i = require("./ScrollContens"), a = require("./PageHandle"), s = require("./InnerBase"), l = require("./DateSelector"), c = require("./TrAdjust"), u = require("./EventKeys"), d = require("./gContext"), p = require("./EventUtils"), f = require("./WindowConfig"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.titleRoot = null;
t.titlePre = null;
t.pageRoot = null;
t.pageHandle = null;
t.dateSelectRoot = null;
t.dateSelector = null;
t.scrollContent = null;
t.noDataTipNode = null;
t.applyTr = null;
t.authorityTr = null;
t.clubRangeTr = null;
t.frozenTr = null;
t.inviteOtherTr = null;
t.inviteMsgTr = null;
t.memberAchievementTr = null;
t.memberFcmTr = null;
t.memberTr = null;
t.memberAntiAdicationTr = null;
t.memberOnlineTr = null;
t.partnerAllTr = null;
t.partnerFcmTr = null;
t.partnerTr = null;
t.quitTr = null;
t.recordMemberTr = null;
t.antiAdicationNode = null;
t.antiAdicationNum = null;
t.inputNode = null;
t.antiAdicationEditBtn = null;
t._adjustInnerW = 0;
return t;
}
t.prototype.onLoad = function() {
this.node.width = this.adjustW;
};
t.prototype.start = function() {
var e = this;
d.default.eventUtils.on(u.default.data_club_fill_number, function(t, o) {
"0" === o && (o = "");
e.antiAdicationNum.string = o;
}, this, p.eOffType.OnDestroy);
this.antiAdicationEditBtn.on(cc.Node.EventType.TOUCH_END, function(t) {
e._editScore();
}, this);
};
t.prototype._editScore = function() {
var e = [ "" ];
"" === this.antiAdicationNum.string || (e = this.antiAdicationNum.string.split(""));
d.default.uiHelper.show(f.eWindowID.ClubFillNumber, e);
};
t.prototype.innerW = function() {
return this.adjustW - 16;
};
t.prototype.adjustHead = function(e, t) {
var o = cc.instantiate(e).getComponent(c.default).adjustWidth(this.innerW()), n = o.length;
if (n === t.length) for (var r = 0; r < n; r++) {
var i = t[r], a = cc.instantiate(this.titlePre);
a.width = o[r];
a.getChildByName("Title").getComponent(cc.Label).string = i;
this.titleRoot.addChild(a);
} else cc.error("len error.");
};
t.prototype.setPage = function(e, t, o) {
void 0 === o && (o = 1);
if (e > 0) {
this.pageRoot.active = !0;
var n = Math.ceil(t / e);
n < 1 && (n = 1);
this.pageHandle.setData(n);
} else this.pageRoot.active = !1;
};
t.prototype.showNoDataTipNode = function(e) {
this.noDataTipNode.active = e;
};
t.prototype.showAntiAdicationEdit = function(e, t, o) {
this.antiAdicationNode.active = e;
this.antiAdicationNum.string = 0 !== o ? o + "" : "";
if (t) {
this.inputNode.getChildByName("BACKGROUND_SPRITE").color = new cc.Color(255, 255, 255, 255);
this.antiAdicationEditBtn.active = !0;
} else {
this.inputNode.getChildByName("BACKGROUND_SPRITE").color = new cc.Color(233, 233, 233, 255);
this.antiAdicationEditBtn.active = !1;
}
};
r([ y(cc.Node) ], t.prototype, "titleRoot", void 0);
r([ y(cc.Prefab) ], t.prototype, "titlePre", void 0);
r([ y(cc.Node) ], t.prototype, "pageRoot", void 0);
r([ y(a.default) ], t.prototype, "pageHandle", void 0);
r([ y(cc.Node) ], t.prototype, "dateSelectRoot", void 0);
r([ y(l.default) ], t.prototype, "dateSelector", void 0);
r([ y(i.default) ], t.prototype, "scrollContent", void 0);
r([ y(cc.Node) ], t.prototype, "noDataTipNode", void 0);
r([ y(cc.Prefab) ], t.prototype, "applyTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "authorityTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "clubRangeTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "frozenTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "inviteOtherTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "inviteMsgTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "memberAchievementTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "memberFcmTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "memberTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "memberAntiAdicationTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "memberOnlineTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "partnerAllTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "partnerFcmTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "partnerTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "quitTr", void 0);
r([ y(cc.Prefab) ], t.prototype, "recordMemberTr", void 0);
r([ y(cc.Node) ], t.prototype, "antiAdicationNode", void 0);
r([ y(cc.Label) ], t.prototype, "antiAdicationNum", void 0);
r([ y(cc.Node) ], t.prototype, "inputNode", void 0);
r([ y(cc.Node) ], t.prototype, "antiAdicationEditBtn", void 0);
return t = r([ m ], t);
}(s.default);
o.default = g;
cc._RF.pop();
