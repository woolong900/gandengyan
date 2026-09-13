// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "486e9DKUV5BfJh7YYj+lg9B", "GroupHeadTr");
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
var i = require("./ClubMsg"), a = require("./SoundUtils"), s = require("./gContext"), l = require("./ClubListData"), c = require("./ClubIsolateListData"), u = require("./DeleteGroupMemberTr"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.tipLabel = null;
t.addGroupMember = null;
t.delGroupMember = null;
t.itemRootNode = null;
t.rootNode = null;
t._groupId = 0;
t._cellWidth = 0;
t._idx = 0;
return t;
}
t.prototype.setData = function(e, t, o) {
this._cellWidth = t;
this._groupId = e;
this._idx = o;
this.tipLabel.string = "禁止同桌   组" + o;
this.updateUI();
};
t.prototype._getPos = function(e) {
var t = (this._cellWidth - 100) / 3, o = [ -t - 10, 0, t + 10 ], n = e % 3, r = Math.floor(e / 3), i = o[n], a = -(49 + 88 * r);
return cc.v2(i, a);
};
t.prototype.updateUI = function() {
var e = (this._cellWidth - 100) / 3, t = c.default.get(this._groupId), o = [];
for (var n in t.isolateMembers) t.isolateMembers.hasOwnProperty(n) && o.push(n);
var r = t.memberCount() + 1, i = Math.ceil(r / 3);
this.node.height = 57 + 88 * i + 10;
this.rootNode.width = this._cellWidth;
this.itemRootNode.width = this._cellWidth;
for (var a = t.memberCount(), s = 0; s < a; s++) {
var l = cc.instantiate(this.delGroupMember);
this.itemRootNode.addChild(l);
l.position = this._getPos(s);
l.getComponent(u.default).setData(this._groupId, t.isolateMembers[o[s]], e);
}
var d = cc.instantiate(this.addGroupMember);
this.itemRootNode.addChild(d);
d.position = this._getPos(a);
d.getComponent("AddGroupMemberTr").setData(this._groupId, this._idx, e);
};
t.prototype.onDelGroupClick = function() {
var e = this;
a.default.clickBtn();
var t = c.default.get(this._groupId);
s.default.msgBox.show("确认要删除该禁止同桌组，该组包含" + t.memberCount() + "个成员?", function() {
i.default.delIsolateGroup(e._groupId, function(e, t) {
if (t) s.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
s.default.uiHelper.showTip("操作成功!");
i.default.getIsolateList(l.default.focus, function(e, t) {
t && s.default.uiHelper.showTip("获取数据失败～");
}, !0);
} else s.default.uiHelper.showTip(e.res.what);
});
});
};
r([ f(cc.Label) ], t.prototype, "tipLabel", void 0);
r([ f(cc.Prefab) ], t.prototype, "addGroupMember", void 0);
r([ f(cc.Prefab) ], t.prototype, "delGroupMember", void 0);
r([ f(cc.Node) ], t.prototype, "itemRootNode", void 0);
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
