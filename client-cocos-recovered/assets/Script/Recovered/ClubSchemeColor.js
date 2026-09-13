// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "40bb6E+MOJOzJwXBQv2AA04", "ClubSchemeColor");
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
var i = e("./ClubListData"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./SoundUtils"), c = e("./gContext"), u = e("./ClubMsg"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._choosedColor = "";
t._clubId = 0;
t._schemeId = 0;
t.colors = null;
t.colorShow = null;
t.colorPre = null;
t.colorContainer = null;
return t;
}
t.prototype.start = function() {
var e = this;
c.default.eventUtils.on([ a.default.ui_club_scheme_color_hide ], function() {
e.colorContainer.active = !1;
}, this, s.eOffType.OnDestroy);
};
t.prototype.setData = function(e) {
this._choosedColor = e.color;
this._clubId = e.clubId;
this._schemeId = e.schemeId;
var t = i.default.get(this._clubId).schemeList().get(this._schemeId);
this.colors = t.getAllColor();
this.generateColor();
};
t.prototype.showChoosePanal = function() {
l.default.clickBtn();
this.colorContainer.active = !this.colorContainer.active;
c.default.eventUtils.emit(a.default.ui_club_scheme_color_show);
};
t.prototype.generateColor = function() {
this.colorContainer.removeAllChildren(!0);
for (var e in this.colors) {
var t = cc.instantiate(this.colorPre);
t.active = !0;
if (e === this._choosedColor) {
this.colorShow.color = this.colors[e].color;
t.children[0].getChildByName("ChooseBg").active = !0;
t.children[0].getChildByName("ChooseTag").active = !0;
} else {
t.children[0].getChildByName("ChooseBg").active = !1;
t.children[0].getChildByName("ChooseTag").active = !1;
}
t.children[0].getChildByName("Color").color = this.colors[e].color;
this.createEvent(t.getComponent(cc.Button), e);
this.colorContainer.addChild(t);
}
};
t.prototype.createEvent = function(e, t) {
var o = new cc.Component.EventHandler();
o.target = this.node;
o.component = "ClubSchemeColor";
o.handler = "choose";
o.customEventData = t;
e.clickEvents.push(o);
};
t.prototype.choose = function(e, t) {
var o = this;
l.default.clickBtn();
c.default.eventUtils.emit(a.default.ui_club_scheme_color_hide);
var n = parseInt(t);
if (!this.colorContainer.children[n].children[0].getChildByName("ChooseBg").active) {
var r = i.default.get(this._clubId).schemeList().get(this._schemeId), s = r.roomConfig;
u.default.clubGameSchemeEdit(this._schemeId, "", this._clubId, t, s, function(e, i) {
if (i) c.default.uiHelper.showTip("修改颜色失败"); else if (0 === e.res.error) {
c.default.uiHelper.showTip("修改颜色成功");
r.color = t;
o.colorShow.color = o.colors[n].color;
o.colorContainer.children.forEach(function(e, t) {
if (t === n) {
e.children[0].getChildByName("ChooseBg").active = !0;
e.children[0].getChildByName("ChooseTag").active = !0;
} else {
e.children[0].getChildByName("ChooseBg").active = !1;
e.children[0].getChildByName("ChooseTag").active = !1;
}
});
c.default.eventUtils.emit(a.default.data_club_table_scheme_update);
} else c.default.uiHelper.showTip(e.res.what);
});
}
};
r([ f(cc.Node) ], t.prototype, "colorShow", void 0);
r([ f(cc.Node) ], t.prototype, "colorPre", void 0);
r([ f(cc.Node) ], t.prototype, "colorContainer", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
