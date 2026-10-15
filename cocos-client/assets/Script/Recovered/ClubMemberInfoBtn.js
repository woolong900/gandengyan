// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e95791fCetGmoh7sS8Rahqr", "ClubMemberInfoBtn");
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
var i = require("./SoundUtils"), a = require("./gContext"), s = require("./EventKeys"), l = require("./ClubMsg"), c = require("./ClubListData"), u = require("./ClubMemberCellData"), d = require("./WindowConfig"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.label = null;
t._index = 0;
t._memberData = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this.label.string = e.label;
this._index = t;
this._memberData = o;
};
t.prototype.getClubMemberInfo = function() {
var e = c.default.focus;
e > 0 && l.default.getClubMemberInfo(e, function(e, t) {
a.default.eventUtils.emit(s.default.data_club_member_manager_update);
}, !0);
a.default.uiHelper.remove(d.eWindowID.ClubMemberManageLayer);
};
t.prototype.showMsgBox = function() {
var e = this, t = this._memberData.nickname + "(" + this._memberData.uid + ")";
if (0 === this._index) {
var o = u.eClubMemberDegree.Admin;
if (this._memberData.degress === u.eClubMemberDegree.Admin) {
"您正在取消" + t + "为管理员!";
o = u.eClubMemberDegree.Player;
}
a.default.msgBox.show("您正在设置" + t + "为管理员!", function() {
l.default.clubMemberSetRole(c.default.focus, e._memberData.userid, o, function(t, n) {
if (n) a.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
e.getClubMemberInfo();
1 == o ? a.default.uiHelper.showTip("取消成功") : a.default.uiHelper.showTip("设置成功");
} else a.default.uiHelper.showTip(t.res.what);
});
});
} else if (1 === this._index) {
var n = 1 === this._memberData.freeze ? 0 : 1;
a.default.msgBox.show("您正在冻结" + t + "，冻结后该会员不能在加入您的俱乐部桌子哦!", function() {
l.default.clubMemberFreeze(c.default.focus, e._memberData.userid, n, function(t, o) {
if (o) a.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
e.getClubMemberInfo();
1 == n ? a.default.uiHelper.showTip("冻结成功") : a.default.uiHelper.showTip("解除成功");
} else a.default.uiHelper.showTip(t.res.what);
});
});
} else 2 === this._index && a.default.msgBox.show("您正在踢出" + t + "，踢出后该会员不能在加入您的俱乐部桌子哦!", function() {
l.default.clubMemberKickout(c.default.focus, e._memberData.userid, function(t, o) {
o ? a.default.uiHelper.showTip("获取数据失败～") : 0 === t.res.error ? e.getClubMemberInfo() : a.default.uiHelper.showTip(t.res.what);
});
});
};
t.prototype.onClickBtn = function() {
i.default.clickBtn();
this.showMsgBox();
};
r([ h(cc.Label) ], t.prototype, "label", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
