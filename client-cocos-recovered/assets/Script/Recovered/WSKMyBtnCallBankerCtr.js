// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4895dQeJexDLaDpPsWUuzCx", "WSKMyBtnCallBankerCtr");
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
var i = require("./CommonEnum"), a = require("./RoomInfoData"), s = require("./EventUtils"), l = require("./SoundUtils"), c = require("./gContext"), u = require("./GameMsgWSK"), d = require("./WSKEnum"), p = require("./WSKEventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.baoNode = null;
t.passNode = null;
t.xiNode = null;
t.xiPassNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!a.default.isWatcher()) {
c.default.eventUtils.on([ p.default.data_round_change, p.default.data_status_change ], function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateBtnLableInfo();
this._updateUI();
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateBtnLableInfo = function() {
var e = "不包", t = "包庄";
if (a.default.config.index === i.eGameIds.XSWSK) {
e = "不吼";
t = "吼牌";
}
var o = this.passNode.getChildByName("label"), n = this.baoNode.getChildByName("label");
o && (o.getComponent(cc.Label).string = e);
n && (n.getComponent(cc.Label).string = t);
};
t.prototype._updateUI = function() {
this.baoNode.active = !1;
this.passNode.active = !1;
if (a.default.gameInfoWSK.status === d.eWSKGameStatus.Calling) {
var e = a.default.myAbsolutePos();
if (a.default.gameInfoWSK.siteInfos.get(e).roundType === d.eWSKRoundType.Turn) {
this.baoNode.active = !0;
this.passNode.active = !0;
}
}
this.xiNode.active = !1;
this.xiPassNode.active = !1;
if (a.default.gameInfoWSK.status === d.eWSKGameStatus.ShowXiPai) {
e = a.default.myAbsolutePos();
if (a.default.gameInfoWSK.siteInfos.get(e).roundType === d.eWSKRoundType.Turn) {
this.xiNode.active = !0;
this.xiPassNode.active = !0;
}
}
};
t.prototype.onClickPass = function() {
l.default.clickBtn();
u.default.getInstance().pass();
};
t.prototype.onClickCallBanker = function() {
l.default.clickBtn();
var e = "确定选择包庄？";
a.default.config.index === i.eGameIds.XSWSK && (e = "确定选择吼牌？");
c.default.msgBox.show(e, function() {
u.default.getInstance().bao();
});
};
t.prototype.onClickXi = function() {
l.default.clickBtn();
var e = a.default.myAbsolutePos(), t = a.default.gameInfoWSK.siteInfos.get(e).xiCards;
u.default.getInstance().showXi(t);
cc.log("onClickXi...", t);
};
t.prototype.onClickXiPass = function() {
l.default.clickBtn();
cc.log("onClickXiPass...");
u.default.getInstance().showXi([]);
};
r([ m(cc.Node) ], t.prototype, "baoNode", void 0);
r([ m(cc.Node) ], t.prototype, "passNode", void 0);
r([ m(cc.Node) ], t.prototype, "xiNode", void 0);
r([ m(cc.Node) ], t.prototype, "xiPassNode", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
