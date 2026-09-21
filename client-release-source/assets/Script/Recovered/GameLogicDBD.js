// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5dd84atxKZGl74o6icCbQm1", "GameLogicDBD");
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
t.prototype.autoGameCountDown = function(e) {
return 15;
};
t.prototype.isAutoGameRoom = function(e) {
return !1;
};
t.prototype.hideHuDongBiaoqing = function(e) {
return !1;
};
t.prototype.isShowRemain = function(e) {
return !1;
};
t.prototype.allCards = function(e) {
cc.error("必须实现");
return [];
};
return t;
}(require("./GameLogicBase").default);
o.default = r;
cc._RF.pop();
