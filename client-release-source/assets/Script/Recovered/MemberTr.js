// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ec0205A//pA0ob+LeKTPhsA", "MemberTr");
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
var i = require("./gContext"), a = require("./Image"), s = require("./WindowConfig"), l = require("./SoundUtils"), c = require("./UserData"), u = require("./StringUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uid = 0;
t._memberData = null;
t.avatar = null;
t.nameLabel = null;
t.idLabel = null;
t.degreeLabel = null;
t.stateLabel = null;
t.timeLabel = null;
t.btnNode = null;
t.memberInfoPre = null;
return t;
}
t.prototype.setData = function(e, t, o) {
this._uid = e;
this._memberData = t;
this.idLabel.string = t.uid + "";
this.degreeLabel.string = t.degressStr();
this.stateLabel.string = t.statusStr();
this.timeLabel.string = t.timeStr();
this.avatar.url = t.avatarUrl;
-1 != this.stateLabel.string.indexOf("冻结") ? this.stateLabel.node.color = cc.color(15, 101, 207, 255) : this.stateLabel.node.color = cc.color(31, 155, 11, 255);
o.permissionMaster() && t.uid !== c.default.uid ? this.btnNode.active = !0 : this.btnNode.active = !t.permissionAdmin();
this.nameLabel.string = u.default.clip(t.showAlias(o.degress), 6);
};
t.prototype.onClick = function() {
l.default.clickBtn();
i.default.uiHelper.show(s.eWindowID.ClubMemberManageLayer, this._memberData);
};
r([ f(a.default) ], t.prototype, "avatar", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Label) ], t.prototype, "idLabel", void 0);
r([ f(cc.Label) ], t.prototype, "degreeLabel", void 0);
r([ f(cc.Label) ], t.prototype, "stateLabel", void 0);
r([ f(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ f(cc.Node) ], t.prototype, "btnNode", void 0);
r([ f(cc.Prefab) ], t.prototype, "memberInfoPre", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
