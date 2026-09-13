// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a6e8eQfBflJxqFdw1V6yDVm", "ClubMemberInfo");
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
var i = require("./BaseComponent"), a = require("./Image"), s = cc._decorator, l = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.memberData = null;
t.avatar = null;
t.nameLabel = null;
t.idLabel = null;
t.statusLabel = null;
t.remarkNode = null;
t.remarkInputNode = null;
t.remarkLabel = null;
t.remarkInputLabel = null;
t.btnContainer = null;
t.infoBtnPre = null;
t.settingNode = null;
return t;
}
t.prototype.start = function() {
this.node.x = cc.winSize.width / 2 + this.node.width / 2;
var e = cc.moveTo(.2, cc.v2(cc.winSize.width / 2 - this.node.width / 2), 0);
this.node.runAction(e);
};
t.prototype.setData = function(e) {};
t.prototype.loadBtns = function() {};
t.prototype.check = function() {};
t.prototype.modifyRemark = function() {
this.remarkInputNode.active = !0;
this.remarkNode.active = !1;
this.remarkInputNode.getComponent(cc.EditBox).string = this.remarkLabel.string;
this.remarkInputLabel.node.active = !0;
};
t.prototype.saveRemark = function() {};
t.prototype.onDestroy = function() {};
r([ c(a.default) ], t.prototype, "avatar", void 0);
r([ c(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ c(cc.Label) ], t.prototype, "idLabel", void 0);
r([ c(cc.Label) ], t.prototype, "statusLabel", void 0);
r([ c(cc.Node) ], t.prototype, "remarkNode", void 0);
r([ c(cc.Node) ], t.prototype, "remarkInputNode", void 0);
r([ c(cc.Label) ], t.prototype, "remarkLabel", void 0);
r([ c(cc.Label) ], t.prototype, "remarkInputLabel", void 0);
r([ c(cc.Node) ], t.prototype, "btnContainer", void 0);
r([ c(cc.Prefab) ], t.prototype, "infoBtnPre", void 0);
r([ c(cc.Node) ], t.prototype, "settingNode", void 0);
return t = r([ l ], t);
}(i.default);
o.default = u;
cc._RF.pop();
