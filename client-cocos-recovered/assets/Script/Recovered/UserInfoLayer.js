// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "dc6f7qqkZ5KIraLKEAj+afo", "UserInfoLayer");
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
var i = e("./ExUtils"), a = e("./Image"), s = e("./GameConfig"), l = e("./gContext"), c = e("./UserData"), u = e("./BaseComponent"), d = e("./SoundUtils"), p = e("./CenterMsg"), f = e("./StringUtils"), h = e("./WindowConfig"), m = e("./EventKeys"), y = e("./EventUtils"), g = cc._decorator, _ = g.ccclass, v = g.property, C = new cc.Color(93, 70, 26), b = new cc.Color(187, 104, 37), D = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nameLabel = null;
t.idLabel = null;
t.ipLabel = null;
t.locationLabel = null;
t.headImg = null;
t.dividerNode = null;
t.bindMobileNode = null;
t.mobileLabel = null;
t.mobilePre = null;
t.agentEnterNode = null;
t.man = null;
t.woman = null;
return t;
}
t.prototype.onLoad = function() {
var e = this, t = 1 === c.default.sex;
this.updateShowGenderBtnState(t);
l.default.eventUtils.on(m.default.player_gender_change, function(t, o) {
var n = 1 === c.default.sex;
e.updateShowGenderBtnState(n);
l.default.uiHelper.showTip("设置成功!");
}, this, y.eOffType.OnDestroy);
};
t.prototype.start = function() {
this._initUI();
};
t.prototype._initUI = function() {
this.nameLabel.string = f.default.clip(c.default.nickname, 10);
this.idLabel.string = c.default.uid ? c.default.uid.toString() : "";
this.headImg.url = c.default.headUrl;
this.ipLabel.string = c.default.ip;
var e = i.default.getLocation(!1);
this.locationLabel.string = e ? e.desc() : "未知";
this.mobileLabel.string = "(" + c.default.mobile.replace(/^(\d{3})\d*(\d{4})$/g, "$1****$2") + ")";
this.bindMobileNode.active = !!c.default.mobile;
this.dividerNode.active = !!c.default.mobile;
this.agentEnterNode.active = !1;
};
t.prototype.updateShowGenderBtnState = function(e) {
this.man.getChildByName("checkmark").active = e;
this.man.getComponent(cc.Button).interactable = !e;
this.man.getChildByName("label").color = e ? C : b;
this.man.getChildByName("label").opacity = e ? 255 : 195;
this.woman.getChildByName("checkmark").active = !e;
this.woman.getComponent(cc.Button).interactable = e;
this.woman.getChildByName("label").color = e ? b : C;
this.woman.getChildByName("label").opacity = e ? 195 : 255;
};
t.prototype.updateMobile = function() {
d.default.clickBtn();
l.default.uiHelper.showWithNode(h.eWindowID.BindMobile, this.mobilePre, !0);
};
t.prototype.toAgent = function() {
var e = s.default.agentPlatformUrl(c.default.token);
cc.sys.isNative ? i.default.openWebpage(e) : window.open(e, "_blank");
};
t.prototype.update = function() {
this.mobileLabel.string = "(" + c.default.mobile.replace(/^(\d{3})\d*(\d{4})$/g, "$1****$2") + ")";
};
t.prototype.selectGender = function(e) {
var t = this;
d.default.clickBtn();
var o = "man" === e.target.name;
p.default.setUserSex(o ? "1" : "2", function(e, o) {
t.node.isValid;
});
};
r([ v(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ v(cc.Label) ], t.prototype, "idLabel", void 0);
r([ v(cc.Label) ], t.prototype, "ipLabel", void 0);
r([ v(cc.Label) ], t.prototype, "locationLabel", void 0);
r([ v(a.default) ], t.prototype, "headImg", void 0);
r([ v(cc.Node) ], t.prototype, "dividerNode", void 0);
r([ v(cc.Node) ], t.prototype, "bindMobileNode", void 0);
r([ v(cc.Label) ], t.prototype, "mobileLabel", void 0);
r([ v(cc.Prefab) ], t.prototype, "mobilePre", void 0);
r([ v(cc.Node) ], t.prototype, "agentEnterNode", void 0);
r([ v(cc.Node) ], t.prototype, "man", void 0);
r([ v(cc.Node) ], t.prototype, "woman", void 0);
return t = r([ _ ], t);
}(u.default);
o.default = D;
cc._RF.pop();
