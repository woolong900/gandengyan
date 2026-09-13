// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "14229NILCRFH44Q9hnpog+I", "BanDeskmateTr");
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
var i = require("./Image"), a = require("./ClubMsg"), s = require("./ClubListData"), l = require("./gContext"), c = require("./SoundUtils"), u = require("./ClubControl"), d = require("./StringUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.groupId = 0;
t._uid = 0;
t.avatar = null;
t.nameLabel = null;
t.idLabel = null;
t.btnBan = null;
t.btnRelieve = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this.groupId = t;
this._uid = e;
var n = u.default.getCurClubData().memberList().get(e);
this.avatar.url = n.avatarUrl;
this.nameLabel.string = d.default.clip(n.nickname, 8);
this.idLabel.string = n.uid + "";
this.updateBtnState(o);
};
t.prototype.updateBtnState = function(e) {
this.btnBan.node.active = !e;
this.btnRelieve.node.active = e;
};
t.prototype.onBanDesk = function() {
var e = this;
c.default.clickBtn();
var t = u.default.getCurClubData().memberList().get(this._uid);
a.default.addIsolate(this.groupId, [ t.userid ], function(t, o) {
if (o) l.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
l.default.uiHelper.showTip("操作成功!");
e.updateBtnState(!0);
a.default.getIsolateList(s.default.focus, function(e, t) {
t && l.default.uiHelper.showTip("获取数据失败～");
}, !0);
} else l.default.uiHelper.showTip(t.res.what);
});
};
t.prototype.onRelieve = function() {
var e = this;
c.default.clickBtn();
var t = u.default.getCurClubData().memberList().get(this._uid);
a.default.delIsolate(this.groupId, [ t.userid ], function(t, o) {
if (o) l.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
l.default.uiHelper.showTip("操作成功!");
e.updateBtnState(!1);
a.default.getIsolateList(s.default.focus, function(e, t) {
t && l.default.uiHelper.showTip("获取数据失败～");
}, !0);
} else l.default.uiHelper.showTip(t.res.what);
});
};
r([ h(i.default) ], t.prototype, "avatar", void 0);
r([ h(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ h(cc.Label) ], t.prototype, "idLabel", void 0);
r([ h(cc.Button) ], t.prototype, "btnBan", void 0);
r([ h(cc.Button) ], t.prototype, "btnRelieve", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
