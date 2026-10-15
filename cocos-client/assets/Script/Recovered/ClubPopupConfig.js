// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3ba8d42h6dMXqSxuOX3kMlX", "ClubPopupConfig");
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
var i, a = require("./ClubListData"), s = require("./UserData"), l = require("./ClubMemberCellData"), c = require("./GameConfig"), u = require("./CommonEnum");
(function(e) {
e[e.Member = 0] = "Member";
e[e.InviteMsg = 1] = "InviteMsg";
e[e.Record = 2] = "Record";
})(i = o.eClubPopupType || (o.eClubPopupType = {}));
var d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.commonPre = null;
t.isolategroupPre = null;
t.unusualPre = null;
t.invitePre = null;
t.recordPre = null;
return t;
}
t.prototype.getData = function(e, t) {
if (e === i.Member) {
var o = a.default.focus, n = a.default.get(o).memberList().get(s.default.uid).degress;
if (n === l.eClubMemberDegree.Admin || n === l.eClubMemberDegree.Master) {
var r = [ {
menu: "所有成员",
pre: this.commonPre,
addComponent: "InnerMemberAll"
}, {
menu: "申请列表",
pre: this.commonPre,
addComponent: "InnerMemberApply"
}, {
menu: "邀请成员",
pre: this.invitePre,
addComponent: null
}, {
menu: "在线成员",
pre: this.commonPre,
addComponent: "InnerMemberOnline"
}, {
menu: "异常成员",
pre: this.unusualPre,
addComponent: null
}, {
menu: "隔离列表",
pre: this.isolategroupPre,
addComponent: null
}, {
menu: "退出列表",
pre: this.commonPre,
addComponent: "InnerMemberExit"
} ];
if (null !== t) {
var d;
d = 1 == (1 & t) && 2 == (2 & t) && 4 == (4 & t);
c.default.area() === u.eArea.QJ && d && r.push({
menu: "防沉迷",
pre: this.commonPre,
addComponent: "InnerMemberAntiAddiction"
});
}
return {
title: "成员管理",
search: !0,
list: r
};
}
return {
title: "成员管理",
search: !0,
list: [ {
menu: "在线成员",
pre: this.commonPre,
addComponent: "InnerMemberOnline"
} ]
};
}
return e === i.InviteMsg ? {
title: "邀请列表",
search: !1,
list: [ {
menu: "邀请列表",
pre: this.commonPre,
addComponent: "InnerInviteMsg"
} ]
} : e === i.Record ? {
title: "战绩管理",
search: !0,
list: [ {
menu: "所有成员",
pre: this.recordPre,
addComponent: null
} ]
} : void 0;
};
r([ f(cc.Prefab) ], t.prototype, "commonPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "isolategroupPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "unusualPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "invitePre", void 0);
r([ f(cc.Prefab) ], t.prototype, "recordPre", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
