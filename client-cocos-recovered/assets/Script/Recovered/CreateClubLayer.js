// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "71d4fODZNlNBIKtDScOqpGC", "CreateClubLayer");
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
var i = e("./BaseComponent"), a = e("./SoundUtils"), s = e("./gContext"), l = e("./ClubMsg"), c = e("./ClubListData"), u = e("./Constants"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.serviceLabel = null;
t.clubNamEditBox = null;
return t;
}
t.prototype.start = function() {};
t.prototype.onClickConfirm = function() {
var e = this;
a.default.clickBtn();
var t = this.clubNamEditBox.string;
if (0 !== (t = t.trim()).length) {
s.default.uiHelper.remove(this);
l.default.clubCreate(t, function(t, o) {
if (o) s.default.uiHelper.showTip("创建俱乐部失败"); else if (0 === t.res.error) {
s.default.uiHelper.showTip("创建俱乐部成功");
e._loadClubList(t.id);
} else s.default.msgBox.showOnlyOk(t.res.what);
});
} else s.default.uiHelper.showTip("请输入俱乐部名称!");
};
t.prototype._loadClubList = function(e) {
l.default.getClubList(function(t, o) {
o ? s.default.uiHelper.showTip("俱乐部列表数据异常") : 0 === t.res.error ? l.default.getClubData(e, function(t, o) {
if (o) s.default.uiHelper.showTip("俱乐部数据异常～"); else if (0 === t.error) {
c.default.focus = e;
cc.director.getScene().name !== u.default.ClubSceneName && s.default.uiHelper.loadScene(u.default.ClubSceneName);
} else s.default.msgBox.showOnlyOk("俱乐部数据异常～", function() {
s.default.uiHelper.loadScene(u.default.HallSceneName);
});
}) : s.default.uiHelper.showTip("俱乐部列表数据异常");
});
};
r([ f(cc.Label) ], t.prototype, "serviceLabel", void 0);
r([ f(cc.EditBox) ], t.prototype, "clubNamEditBox", void 0);
return t = r([ p ], t);
}(i.default);
o.default = h;
cc._RF.pop();
