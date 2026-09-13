// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9019albccJAZYSU/RkCSAWU", "ClubMemberManageLayer");
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
var i = e("./BaseComponent"), a = e("./Image"), s = e("./ClubMemberInfoBtn"), l = e("./ClubMemberCellData"), c = e("./SoundUtils"), u = e("./gContext"), d = e("./ClubMsg"), p = e("./ClubListData"), f = e("./EventKeys"), h = e("./StringUtils"), m = cc._decorator, y = m.ccclass, g = m.property, _ = [ {
label: "升为管理员"
}, {
label: "冻结"
}, {
label: "踢出俱乐部"
} ], v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.memberData = null;
t.avatar = null;
t.nameLabel = null;
t.idLabel = null;
t.statusLabel = null;
t.remarkLabel = null;
t.btnContainer = null;
t.infoBtnPre = null;
t.leftNode = null;
t.addNoteNode = null;
t.notesEditBox = null;
return t;
}
t.prototype.start = function() {
this.node.x = cc.winSize.width / 2 + this.node.width / 2;
var e = cc.moveTo(.2, cc.v2(cc.winSize.width / 2 - this.node.width / 2), 0);
this.node.runAction(e);
this.leftNode.active = !1;
};
t.prototype.setData = function(e) {
this.memberData = e;
this.nameLabel.string = h.default.clip(e.nickname, 8);
this.idLabel.string = this.memberData.uid + "";
this.statusLabel.string = this.memberData.degressStr();
this.remarkLabel.string = h.default.clip(this.memberData.remark, 10);
this.loadBtns();
};
t.prototype.loadBtns = function() {
var e = this, t = _;
t[0].label = this.memberData.degress === l.eClubMemberDegree.Admin ? "取消管理员" : "升为管理员";
t[1].label = 1 === this.memberData.freeze ? "取消冻结" : "冻结";
t.forEach(function(t, o) {
var n = cc.instantiate(e.infoBtnPre);
n.getComponent(s.default).setData(t, o, e.memberData);
e.btnContainer.addChild(n);
});
};
t.prototype.onClickRemark = function() {
c.default.clickBtn();
this.leftNode.active = !0;
};
t.prototype.onClickConfirm = function() {
var e = this;
c.default.clickBtn();
var t = this.notesEditBox.string || "";
0 !== (t = t.trim()).length ? d.default.clubMemberRemark(p.default.focus, this.memberData.userid, t, function(t, o) {
if (o) u.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
u.default.uiHelper.showTip("操作成功!");
e.leftNode.active = !1;
e.remarkLabel.string = e.notesEditBox.string;
u.default.eventUtils.emit(f.default.data_club_member_manager_update);
} else u.default.uiHelper.showTip(t.res.what);
}) : u.default.uiHelper.showTip("请输入备注内容!");
};
t.prototype.onClickLeftBg = function() {
this.leftNode.active = !1;
};
t.prototype.onDestroy = function() {};
r([ g(a.default) ], t.prototype, "avatar", void 0);
r([ g(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ g(cc.Label) ], t.prototype, "idLabel", void 0);
r([ g(cc.Label) ], t.prototype, "statusLabel", void 0);
r([ g(cc.Label) ], t.prototype, "remarkLabel", void 0);
r([ g(cc.Node) ], t.prototype, "btnContainer", void 0);
r([ g(cc.Prefab) ], t.prototype, "infoBtnPre", void 0);
r([ g(cc.Node) ], t.prototype, "leftNode", void 0);
r([ g(cc.Node) ], t.prototype, "addNoteNode", void 0);
r([ g(cc.EditBox) ], t.prototype, "notesEditBox", void 0);
return t = r([ y ], t);
}(i.default);
o.default = v;
cc._RF.pop();
