// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "49071Ulij9Af4xskWFaIyD9", "ClubItem");
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
var i = require("./EventKeys"), a = require("./gContext"), s = require("./EventUtils"), l = require("./ClubListData"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t.uncheckedRoot = null;
t.checkedRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(i.default.data_club_focus_change, function() {
e.updateActivie();
}, this, s.eOffType.OnDestroy);
};
t.prototype.setData = function(e) {
this._index = e;
var t = l.default.get(this._index), o = t.clubName, n = t.clubID;
this.uncheckedRoot.getChildByName("name").getComponent(cc.Label).string = o;
this.uncheckedRoot.getChildByName("id").getComponent(cc.Label).string = n;
this.checkedRoot.getChildByName("name").getComponent(cc.Label).string = o;
this.checkedRoot.getChildByName("id").getComponent(cc.Label).string = n;
this.updateActivie();
};
t.prototype.updateActivie = function() {
if (this._index === l.default.focus) {
this.checkedRoot.active = !0;
this.uncheckedRoot.active = !1;
} else {
this.checkedRoot.active = !1;
this.uncheckedRoot.active = !0;
}
};
r([ d(cc.Node) ], t.prototype, "uncheckedRoot", void 0);
r([ d(cc.Node) ], t.prototype, "checkedRoot", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
