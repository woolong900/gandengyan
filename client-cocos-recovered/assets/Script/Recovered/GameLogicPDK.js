// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2600auRk91HvIS3GJG9CIFV", "GameLogicPDK");
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
}();
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.roomDetails = function(e) {
return "";
};
t.prototype.isAutoPass = function(e) {
return !1;
};
t.prototype.isBiggerMustPut = function(e) {
return !1;
};
t.prototype.isHei3MustPut = function(e) {
return !1;
};
t.prototype.isShowRemain = function(e) {
return !0;
};
t.prototype.allCards = function(e) {
cc.error("必须实现");
return [];
};
t.prototype.isZhaNiao = function(e) {
return !1;
};
t.prototype.descZhaNiao = function(e) {
return "";
};
t.prototype.ruleIsAAABomb = function(e) {
return !1;
};
t.prototype.ruleSupportFour2 = function(e) {
return !1;
};
t.prototype.ruleSupportFour3 = function(e) {
return !1;
};
t.prototype.ruleSupportFollowLackPut = function(e) {
return !1;
};
t.prototype.ruleSupportCanNotSplitBomb = function(e) {
return !1;
};
t.prototype.hideHuDongBiaoqing = function(e) {
return !1;
};
t.prototype.autoGameCountDown = function(e) {
return 15;
};
t.prototype.isAutoGameRoom = function(e) {
return !1;
};
return t;
}(e("./GameLogicBase").default);
o.default = r;
cc._RF.pop();
