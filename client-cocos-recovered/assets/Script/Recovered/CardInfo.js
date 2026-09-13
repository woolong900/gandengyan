// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "179477izhRFlJUUUEv+dUam", "CardInfo");
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
var i = e("./UserData"), a = e("./SoundUtils"), s = e("./gContext"), l = e("./WindowConfig"), c = e("./EventKeys"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.addNode = null;
t.countLabel = null;
return t;
}
t.prototype.setData = function(e) {
this.addNode.active = e;
};
t.prototype.start = function() {
var e = this;
this.countLabel.string = "" + i.default.cardNum;
s.default.eventUtils.on(c.default.data_card_num_change, function() {
e.countLabel.string = i.default.cardNum + "";
}, this);
};
t.prototype.onClickBuy = function() {
a.default.clickBtn();
s.default.uiHelper.show(l.eWindowID.ShoppingMall);
};
r([ p(cc.Node) ], t.prototype, "addNode", void 0);
r([ p(cc.Label) ], t.prototype, "countLabel", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
