// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f7004Bc5GZLvLYf0QnRvUil", "ShoppingMallCell");
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
var i = require("./SoundUtils"), a = require("./UserData"), s = require("./Http"), l = require("./GameConfig"), c = require("./gContext"), u = require("./WindowConfig"), d = require("./PayData"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.goodsId = 0;
t.goodsPrice = 0;
t.goodsNum = 0;
t.iconAsset = null;
t.cardNumLabel = null;
t.additionCardNumLabel = null;
t.additionNode = null;
t.priceLabel = null;
t.goodsDescSprite0 = null;
t.goodsDescSprite1 = null;
t.goodsDescSprite2 = null;
return t;
}
t.prototype.setData = function(e) {
this.cardNumLabel.string = e.number + "张房卡";
var t = 0;
if (a.default.isBindInviteCode() && parseInt(e.largess) > 0) {
this.additionNode.active = !0;
this.additionCardNumLabel.string = e.largess + "张";
t = parseInt(e.largess);
}
this.goodsPrice = parseInt(e.price) / 100;
this.priceLabel.string = parseInt(e.price) / 100 + "元";
this.goodsId = e.id;
this.goodsNum = parseInt(e.number) + t;
this.setSprite(e.number);
};
t.prototype.setSprite = function(e) {
for (var t = [ 0, 100, 200 ], o = [ this.goodsDescSprite0, this.goodsDescSprite1, this.goodsDescSprite2 ], n = 0; n < t.length - 1 && !(parseInt(e) < t[n + 1]); ) n++;
o.forEach(function(e) {
e.active = !1;
});
o[n].active = !0;
};
t.prototype.buy = function() {
i.default.clickBtn();
this._getPayConfig();
};
t.prototype.iconPath = function() {
var e = this.iconAsset.nativeUrl;
cc.loader.md5Pipe && (e = cc.loader.md5Pipe.transformURL(e));
cc.log("icon path is:", e);
return e;
};
t.prototype._getPayConfig = function() {
var e = this, t = l.default.payConfigUrl();
c.default.uiHelper.showLoading("加载中", 1);
var o = s.default.formatUrl(t, {
key: "client_pay_key"
});
o = l.default.appDunUrl(o);
s.default.get(o, null, function(t, o) {
c.default.uiHelper.removeLoading();
if (t) c.default.uiHelper.showTip("支付失败~"); else try {
var n = JSON.parse(o);
if (0 == n.err_code) {
d.default.setData(n.data, e.iconPath());
e._pay();
} else c.default.uiHelper.showTip("支付失败~");
} catch (e) {
c.default.uiHelper.showTip("支付失败~");
}
});
};
t.prototype._pay = function() {
var e = d.default.support();
e && e.length > 0 ? e.length >= 1 ? c.default.uiHelper.show(u.eWindowID.PayTypeLayer, this.goodsId, this.goodsPrice, this.goodsNum) : d.default.pay(e[0], this.goodsId, this.goodsPrice, this.goodsNum) : c.default.uiHelper.showTip("支付失败~");
};
r([ h({
type: cc.Asset
}) ], t.prototype, "iconAsset", void 0);
r([ h(cc.Label) ], t.prototype, "cardNumLabel", void 0);
r([ h(cc.Label) ], t.prototype, "additionCardNumLabel", void 0);
r([ h(cc.Node) ], t.prototype, "additionNode", void 0);
r([ h(cc.Label) ], t.prototype, "priceLabel", void 0);
r([ h(cc.Node) ], t.prototype, "goodsDescSprite0", void 0);
r([ h(cc.Node) ], t.prototype, "goodsDescSprite1", void 0);
r([ h(cc.Node) ], t.prototype, "goodsDescSprite2", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
