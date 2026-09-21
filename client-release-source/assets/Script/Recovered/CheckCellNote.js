// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2a89cZorMRLF5yEf2640y/r", "CheckCellNote");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./EventUtils"), l = cc._decorator, c = l.ccclass, u = l.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.tipLabelLeft = null;
t.bgNodeLeft = null;
t.tipLabelRight = null;
t.bgNodeRight = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_create_room_note_hide, function() {
e.node.destroy();
}, this, s.eOffType.OnDestroy);
};
t.prototype.setData = function(e, t, o) {
this.tipLabelLeft.string = "";
this.tipLabelRight.string = "";
this.bgNodeLeft.active = !1;
this.bgNodeRight.active = !1;
var n = this.tipLabelRight, r = this.bgNodeRight;
if (o) {
n = this.tipLabelLeft;
r = this.bgNodeLeft;
}
r.active = !0;
n.string = e || "";
this.scheduleOnce(function() {
r.width = n.node.width + 12 + 12;
r.height = n.node.height + 16.2 + 8;
});
this.node.x = t.x;
this.node.y = t.y;
};
r([ u(cc.Label) ], t.prototype, "tipLabelLeft", void 0);
r([ u(cc.Node) ], t.prototype, "bgNodeLeft", void 0);
r([ u(cc.Label) ], t.prototype, "tipLabelRight", void 0);
r([ u(cc.Node) ], t.prototype, "bgNodeRight", void 0);
return t = r([ c ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
