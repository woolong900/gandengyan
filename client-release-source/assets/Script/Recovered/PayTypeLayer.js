// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "89b84QMZtdCHJwnPP02ZyyV", "PayTypeLayer");
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
var i = require("./SoundUtils"), a = require("./PayData"), s = require("./BaseComponent"), l = require("./gContext"), c = require("./WindowConfig"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._goodsId = 0;
t._goodsPrice = 0;
t._goodsNum = 0;
t.zfbRoot = null;
t.wxRoot = null;
t.wxLinkRoot = null;
t.zfbRecommend = null;
t.wxRecommend = null;
t.wxLinkRecommend = null;
return t;
}
t.prototype.start = function() {
var e = a.default.support();
this.zfbRecommend.active = !1;
this.wxRecommend.active = !1;
this.wxLinkRecommend.active = !1;
this.zfbRoot.zIndex = e.indexOf(a.ePayCategory.ZFB) >= 0 ? e.indexOf(a.ePayCategory.ZFB) + 1 : 0;
this.wxRoot.zIndex = e.indexOf(a.ePayCategory.WX) >= 0 ? e.indexOf(a.ePayCategory.WX) + 1 : 0;
this.wxLinkRoot.zIndex = e.indexOf(a.ePayCategory.WXLINK) >= 0 ? e.indexOf(a.ePayCategory.WXLINK) + 1 : 0;
this.zfbRoot.active = e.includes(a.ePayCategory.ZFB);
this.wxRoot.active = e.includes(a.ePayCategory.WX);
this.wxLinkRoot.active = e.includes(a.ePayCategory.WXLINK);
if (a.default.isRecommend(a.ePayCategory.WX)) {
this.wxRecommend.active = !0;
this.wxRoot.zIndex = 4;
} else if (a.default.isRecommend(a.ePayCategory.ZFB)) {
this.zfbRecommend.active = !0;
this.zfbRoot.zIndex = 4;
} else if (a.default.isRecommend(a.ePayCategory.WXLINK)) {
this.wxLinkRecommend.active = !0;
this.wxLinkRoot.zIndex = 4;
}
};
t.prototype.setData = function(e, t, o) {
this._goodsId = e;
this._goodsPrice = t;
this._goodsNum = o;
};
t.prototype.onClickWX = function() {
i.default.clickBtn();
a.default.pay(a.ePayCategory.WX, this._goodsId, this._goodsPrice);
};
t.prototype.onClickZFB = function() {
i.default.clickBtn();
a.default.pay(a.ePayCategory.ZFB, this._goodsId, this._goodsPrice);
};
t.prototype.onClickWXLink = function() {
i.default.clickBtn();
a.default.pay(a.ePayCategory.WXLINK, this._goodsId, this._goodsPrice, this._goodsNum);
};
t.prototype.showWXLinkTip = function() {
i.default.clickBtn();
l.default.uiHelper.show(c.eWindowID.InstructionLayer);
};
r([ p(cc.Node) ], t.prototype, "zfbRoot", void 0);
r([ p(cc.Node) ], t.prototype, "wxRoot", void 0);
r([ p(cc.Node) ], t.prototype, "wxLinkRoot", void 0);
r([ p(cc.Node) ], t.prototype, "zfbRecommend", void 0);
r([ p(cc.Node) ], t.prototype, "wxRecommend", void 0);
r([ p(cc.Node) ], t.prototype, "wxLinkRecommend", void 0);
return t = r([ d ], t);
}(s.default);
o.default = f;
cc._RF.pop();
