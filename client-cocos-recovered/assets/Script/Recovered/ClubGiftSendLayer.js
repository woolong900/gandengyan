// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "245b5b1oBFOdKV2XLp4oRdB", "ClubGiftSendLayer");
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
var i = e("./ListContentBtn"), a = e("./BaseComponent"), s = e("./gContext"), l = e("./SoundUtils"), c = e("./WindowConfig"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.index = 0;
t.leftList = null;
t.content = null;
t.searchLabel = null;
return t;
}
t.prototype.start = function() {
this.leftList.getComponent(i.default).setParent(this);
};
t.prototype.dispatchClick = function(e) {
cc.log(e);
this.content.children.forEach(function(e) {
e.active = !1;
});
this.content.children[e].active = !0;
};
t.prototype.search = function() {
cc.log("搜索", this.searchLabel.string);
};
t.prototype.sendCard = function() {
l.default.clickBtn();
s.default.uiHelper.show(c.eWindowID.CardSendWindowLayer);
};
r([ p(cc.Node) ], t.prototype, "leftList", void 0);
r([ p(cc.Node) ], t.prototype, "content", void 0);
r([ p(cc.Label) ], t.prototype, "searchLabel", void 0);
return t = r([ d ], t);
}(a.default);
o.default = f;
cc._RF.pop();
