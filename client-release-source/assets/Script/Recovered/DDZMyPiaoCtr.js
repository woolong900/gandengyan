// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7b743ZhagtOPpHeLpbUsanO", "DDZMyPiaoCtr");
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
var i = require("./RoomInfoData"), a = require("./gContext"), s = require("./DDZEnum"), l = require("./SoundUtils"), c = require("./GameMsgDDZ"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._values = [];
t.rootNode = null;
t.piaoBtns = [];
t.piaoDesc = [];
return t;
}
t.prototype.start = function() {
for (var e = i.default.isWatcher(), t = 0, o = this.piaoBtns.length; t < o; t++) {
this.piaoBtns[t].active = !1;
this.piaoBtns[t].getComponent(cc.Button).interactable = !e;
}
var n = a.default.gameLogic(i.default.config.index).piaoValues(i.default.config);
if (n.length > 0) {
this._values = n;
this.piaoBtns[0].active = !0;
for (t = 0, o = n.length; t < o; t++) {
this.piaoBtns[t + 1].active = !0;
this.piaoDesc[t].string = "飘 " + n[t];
}
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.rootNode.active = !1;
if (i.default.gameInfoDDZ.status === s.eDDZGameStatus.JiaoDiZhu) {
var e = i.default.myAbsolutePos(), t = i.default.gameInfoDDZ.siteInfos.get(e);
this.rootNode.active = !0;
if (t.roundType > 0) {
this.rootNode.active = !0;
for (var o = i.default.gameInfoDDZ.m_iJiaofen, n = 1; n <= o; n++) {
var r = "btn_bg_" + n;
this.rootNode.getChildByName(r).getComponent(cc.Button).interactable = !1;
}
} else this.rootNode.active = !1;
} else this.rootNode.active = !1;
};
t.prototype.onClickNotJiao = function(e) {
l.default.clickBtn();
c.default.getInstance().jiaodizhu(0);
};
t.prototype.onClickJiao = function(e, t) {
l.default.clickBtn();
c.default.getInstance().jiaodizhu(t);
};
r([ p(cc.Node) ], t.prototype, "rootNode", void 0);
r([ p(cc.Node) ], t.prototype, "piaoBtns", void 0);
r([ p(cc.Label) ], t.prototype, "piaoDesc", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
