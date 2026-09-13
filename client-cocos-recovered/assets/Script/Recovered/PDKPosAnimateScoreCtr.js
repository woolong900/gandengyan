// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b6469I7zPFBzoxBGLwZ2vhU", "PDKPosAnimateScoreCtr");
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
var i = e("./PDKPosCtr"), a = e("./gContext"), s = e("./EventKeys"), l = e("./EventUtils"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.posCtr = null;
t.addLabel = null;
t.subLabel = null;
t.animation = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on([ s.default.data_game_score_change ], function(t, o) {
if (o.pos === e.posCtr.deskPos()) {
var n = o.dt;
if (n < 0) {
e.subLabel.string = "" + n;
e.addLabel.string = "";
} else {
e.subLabel.string = "";
e.addLabel.string = "+" + n;
}
e._play();
}
}, this, l.eOffType.OnDisable);
};
t.prototype._play = function() {
0 === this.posCtr.uiPos || 2 === this.posCtr.uiPos ? this.animation.play("score_change_left", 0) : this.animation.play("score_change_right", 0);
};
r([ d(i.default) ], t.prototype, "posCtr", void 0);
r([ d(cc.Label) ], t.prototype, "addLabel", void 0);
r([ d(cc.Label) ], t.prototype, "subLabel", void 0);
r([ d(cc.Animation) ], t.prototype, "animation", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
