// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "25a31d+vX9Kwa9fCj3Ccc9N", "AllianceManageLayer");
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
var i = e("./BaseComponent"), a = e("./gContext"), s = e("./Loader"), l = e("./WindowConfig"), c = e("./SoundUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.clubList = [];
t.listContainer = null;
return t;
}
t.prototype.start = function() {
this.loadClubList();
};
t.prototype.loadClubList = function() {
for (var e = this, t = 0; t < 5; t++) s.default.loadPre("Hall/Res/Prefab/Club/Alliance/AllianceManageTr", function(t) {
var o = cc.instantiate(t);
e.listContainer.addChild(o);
});
};
t.prototype.inviteClub = function() {
c.default.clickBtn();
a.default.uiHelper.show(l.eWindowID.AllianceClubInviteLayer);
};
t.prototype.demotion = function() {
c.default.clickBtn();
0 === this.clubList.length ? a.default.msgBox.show("确定将您的大联盟降级成俱乐部吗？该操作生效后，不可取消，24小时内只可操作一次。") : a.default.msgBox.show("您的联盟内还有俱乐部，暂无法降级。如果确认降级，请先提出联盟内俱乐部。");
};
r([ p(cc.Node) ], t.prototype, "listContainer", void 0);
return t = r([ d ], t);
}(i.default);
o.default = f;
cc._RF.pop();
