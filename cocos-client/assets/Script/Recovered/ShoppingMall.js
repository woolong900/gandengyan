// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7fb3fkCUd5LxoX78V3omuLV", "ShoppingMall");
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
var i = require("./ShoppingMallCell"), a = require("./BaseComponent"), s = require("./SoundUtils"), l = require("./ExUtils"), c = require("./gContext"), u = require("./UserData"), d = require("./GameConstant"), p = require("./WindowConfig"), f = require("./CenterMsg"), h = require("./LoginMsg"), m = require("./EventKeys"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cardNumberLabel = null;
t.percentLabel = null;
t.goodsPre = null;
t.goodsScroll = null;
t.goodsContainer = null;
t.bindTipNode = null;
t.goodsScrollNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
cc.game.on(cc.game.EVENT_SHOW, function() {
h.default.login(function(e, t) {});
}, this);
this.node.getChildByName("bg").width = cc.winSize.width;
this.cardNumberLabel.string = u.default.cardNum + "";
this.percentLabel.string = d.default.freeCardPercent;
u.default.isBindInviteCode() && this.changeHeight();
this.loadGoods();
c.default.eventUtils.on(m.default.data_invite_change, function() {
u.default.isBindInviteCode() && e.changeHeight();
e.loadGoods();
}, this);
c.default.eventUtils.on(m.default.data_card_num_change, function() {
e.cardNumberLabel.string = u.default.cardNum + "";
}, this);
};
t.prototype.changeHeight = function() {
this.bindTipNode.active = !1;
this.goodsScrollNode.height = this.goodsScrollNode.height + 51;
this.goodsScrollNode.children[0].getComponent(cc.Widget).updateAlignment();
this.goodsScrollNode.children[0].children[0].getComponent(cc.Widget).updateAlignment();
};
t.prototype.loadGoods = function() {
var e = this;
f.default.getGoodsInfo({}, function(t, o) {
if (!o) {
e.goodsContainer.node.destroyAllChildren();
t.goods.forEach(function(t, o) {
var n = cc.instantiate(e.goodsPre);
n.getComponent(i.default).setData(t);
e.goodsContainer.node.addChild(n);
});
}
});
};
t.prototype.copyWechat = function() {
s.default.clickBtn();
l.default.copyText(u.default.serviceWechat || d.default.serviceWechat);
c.default.uiHelper.showTip("复制成功！");
};
t.prototype.fresh = function() {
s.default.clickBtn();
h.default.login(function(e, t) {
t || 0 === e.res.error && c.default.uiHelper.showTip("刷新成功！");
});
};
t.prototype.bindInviteCode = function() {
s.default.clickBtn();
c.default.uiHelper.show(p.eWindowID.InviteCode);
};
r([ _(cc.Label) ], t.prototype, "cardNumberLabel", void 0);
r([ _(cc.Label) ], t.prototype, "percentLabel", void 0);
r([ _(cc.Prefab) ], t.prototype, "goodsPre", void 0);
r([ _(cc.ScrollView) ], t.prototype, "goodsScroll", void 0);
r([ _(cc.Layout) ], t.prototype, "goodsContainer", void 0);
r([ _(cc.Node) ], t.prototype, "bindTipNode", void 0);
r([ _(cc.Node) ], t.prototype, "goodsScrollNode", void 0);
return t = r([ g ], t);
}(a.default);
o.default = v;
cc._RF.pop();
