// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "38f50HqBRtGg7JeuqmNMS9F", "ApplyTr");
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
var i = e("./Image"), a = e("./ClubMsg"), s = e("./ClubApplyListData"), l = e("./gContext"), c = e("./EventKeys"), u = e("./StringUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.info = null;
t.avatar = null;
t.nameLabel = null;
t.idLabel = null;
t.reasonLabel = null;
return t;
}
t.prototype.setData = function(e) {
this.info = s.default.get(e);
this.avatar.url = this.info.avatarUrl;
this.nameLabel.string = u.default.clip(this.info.nickname, 8);
this.idLabel.string = this.info.uid;
this.reasonLabel.string = this.info.policyIsJoin() ? "申请加入" : "申请退出";
};
t.prototype.agree = function() {
var e = this;
a.default.clubApplyAgree(this.info.id, function(t, o) {
if (o) l.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
l.default.uiHelper.showTip(e.info.policyIsQuit() ? "已同意" + e.info.uid + "的退出申请!" : "加入俱乐部成功!");
l.default.eventUtils.emit(c.default.data_club_apply_list_update);
} else l.default.uiHelper.showTip(t.res.what);
});
};
t.prototype.disagree = function() {
a.default.clubApplyReject(this.info.id, function(e, t) {
if (t) l.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
l.default.uiHelper.showTip("拒绝成功!");
l.default.eventUtils.emit(c.default.data_club_apply_list_update);
} else l.default.uiHelper.showTip(e.res.what);
});
};
r([ f(i.default) ], t.prototype, "avatar", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Label) ], t.prototype, "idLabel", void 0);
r([ f(cc.Label) ], t.prototype, "reasonLabel", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
