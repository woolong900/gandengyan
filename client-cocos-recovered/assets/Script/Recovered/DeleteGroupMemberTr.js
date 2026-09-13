// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ca6bc4UFJJLhLm2YsPgukBA", "DeleteGroupMemberTr");
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
var i = e("./Image"), a = e("./ClubMsg"), s = e("./SoundUtils"), l = e("./gContext"), c = e("./ClubListData"), u = e("./StringUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.head = null;
t.nameLabel = null;
t.codeLabel = null;
t.rootNode = null;
t.groupId = 0;
t.userId = 0;
return t;
}
t.prototype.setData = function(e, t, o) {
this.groupId = e;
this.userId = t.user_id;
this.head.url = t.avatarUrl;
this.nameLabel.string = u.default.clip(t.nickname);
this.codeLabel.string = t.code + "";
this.rootNode.width = o;
};
t.prototype.onDelGroupMemberClick = function() {
var e = this;
s.default.clickBtn();
l.default.msgBox.show("确认从禁止同桌列表删除该成员?", function() {
a.default.delIsolate(e.groupId, [ e.userId ], function(e, t) {
t ? l.default.uiHelper.showTip("获取数据失败～") : 0 === e.res.error ? a.default.getIsolateList(c.default.focus, function(e, t) {
t && l.default.uiHelper.showTip("获取数据失败～");
}, !0) : l.default.uiHelper.showTip(e.res.what);
});
});
};
r([ f(i.default) ], t.prototype, "head", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Label) ], t.prototype, "codeLabel", void 0);
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
