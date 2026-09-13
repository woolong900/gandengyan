// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5962542RHJBBK/c6KCm6VjV", "SettingLayer");
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
var i = e("./Storage"), a = e("./gContext"), s = e("./SoundUtils"), l = e("./BaseComponent"), c = e("./UpdateUtils"), u = e("./GameConn"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._type = 0;
t.updateNode = null;
t.exitNode = null;
t.okNode = null;
t.onceBtn = null;
t.quickBtn = null;
t.effectSlider = null;
t.musicSlider = null;
t.effectNode = null;
t.musicNode = null;
return t;
}
t.prototype.setData = function(e) {
this._type = e;
};
t.prototype.start = function() {
var e = this, t = 1 === this._type;
this.updateNode.active = t;
this.exitNode.active = t;
this.okNode.active = !t;
this.setCheck(this.onceBtn, i.default.outCardClickOnce.getValue());
this.setCheck(this.quickBtn, i.default.outCardQuick.getValue());
this.updateSlide(s.default.getEffectVolume(), this.effectSlider, this.effectNode);
this.updateSlide(s.default.getMusiceVolume(), this.musicSlider, this.musicNode);
this.scheduleOnce(function() {
e.effectSlider.progress = s.default.getEffectVolume();
e.musicSlider.progress = s.default.getMusiceVolume();
});
};
t.prototype.updateSlide = function(e, t, o) {
e < .05 && (e = 0);
e > .95 && (e = 1);
0 == e ? this.setCheck(o, !0) : this.setCheck(o, !1);
var n = t.node.width;
t.getComponentInChildren(cc.Mask).node.width = n * e;
return e;
};
t.prototype.onEffectSlide = function(e) {
var t = e.progress, o = this.updateSlide(t, e, this.effectNode);
s.default.setEffectVolume(o);
};
t.prototype.onMusicSlide = function(e) {
var t = e.progress, o = this.updateSlide(t, e, this.musicNode);
s.default.setMusicVolume(o);
};
t.prototype.onBtnEffect = function() {
var e = 0;
e = s.default.getEffectVolume() > 0 ? 0 : .5;
var t = this.updateSlide(e, this.effectSlider, this.effectNode);
s.default.setEffectVolume(t);
this.effectSlider.progress = t;
s.default.clickBtn();
};
t.prototype.onBtnMusic = function() {
var e = 0;
e = s.default.getMusiceVolume() > 0 ? 0 : .5;
var t = this.updateSlide(e, this.musicSlider, this.musicNode);
s.default.setMusicVolume(t);
this.musicSlider.progress = t;
e > 0 && s.default.replayMusic();
s.default.clickBtn();
};
t.prototype.onBtnOutOnce = function(e) {
s.default.clickBtn();
var t = !i.default.outCardClickOnce.getValue();
i.default.outCardClickOnce.setValue(t);
this.setCheck(e.target, t);
};
t.prototype.onBtnQuick = function(e) {
s.default.clickBtn();
var t = !i.default.outCardQuick.getValue();
i.default.outCardQuick.setValue(t);
this.setCheck(e.target, t);
};
t.prototype.setCheck = function(e, t) {
e.getChildByName("checkmark").active = !!t;
};
t.prototype.onBtnExit = function() {
i.default.wxToken.clean();
i.default.guestToken.clean();
i.default.mobileToken.clean();
u.default.close();
cc.game.restart();
};
t.prototype.onBtnCheckUpdate = function() {
c.default.check(function(e, t) {
e ? e === c.eCheckUpdateCode.FullUpdate || e === c.eCheckUpdateCode.AssertUpdate ? a.default.msgBox.showOnlyOk("检查到新版本，请立即更新~", function() {
cc.game.restart();
}, !0, !0, "立即重启") : (c.eCheckUpdateCode.DataError, a.default.uiHelper.showTip("获取版本信息异常，请检查网络~")) : t && c.default.haveNewPackage(t.package_versions) ? a.default.msgBox.showOnlyOk("检查到新版本，请立即更新~", function() {
i.default.forceUpdatgePackage.setValue(!0);
cc.game.restart();
}, !0, !0, "立即重启") : a.default.uiHelper.showTip("已是最新版~");
});
s.default.clickBtn();
};
t.prototype.onBtnClose = function() {
a.default.uiHelper.remove(this);
s.default.clickBtn();
};
t.prototype.onDestroy = function() {
s.default.save();
};
r([ f(cc.Node) ], t.prototype, "updateNode", void 0);
r([ f(cc.Node) ], t.prototype, "exitNode", void 0);
r([ f(cc.Node) ], t.prototype, "okNode", void 0);
r([ f(cc.Node) ], t.prototype, "onceBtn", void 0);
r([ f(cc.Node) ], t.prototype, "quickBtn", void 0);
r([ f(cc.Slider) ], t.prototype, "effectSlider", void 0);
r([ f(cc.Slider) ], t.prototype, "musicSlider", void 0);
r([ f(cc.Node) ], t.prototype, "effectNode", void 0);
r([ f(cc.Node) ], t.prototype, "musicNode", void 0);
return t = r([ p ], t);
}(l.default);
o.default = h;
cc._RF.pop();
