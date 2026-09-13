// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ee56c3CJGREcbQYd9PO3AUN", "ClubMenuItem");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./SoundUtils"), c = cc._decorator, u = c.ccclass, d = c.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t.activeNode = null;
t.inactiveNode = null;
t.activeLabel = null;
t.inactiveLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_club_common_menu_clicked, function(t, o) {
e._index === o ? e._updateUI(!0) : e._updateUI(!1);
}, this, s.eOffType.OnDestroy);
};
t.prototype.setData = function(e, t, o) {
this._index = e;
this.activeLabel.string = t;
this.inactiveLabel.string = t;
this._updateUI(o);
};
t.prototype._updateUI = function(e) {
this.activeNode.active = e;
this.inactiveNode.active = !e;
};
t.prototype.onClick = function() {
l.default.clickBtn();
i.default.eventUtils.emit(a.default.ui_club_common_menu_clicked, this._index);
};
r([ d(cc.Node) ], t.prototype, "activeNode", void 0);
r([ d(cc.Node) ], t.prototype, "inactiveNode", void 0);
r([ d(cc.Label) ], t.prototype, "activeLabel", void 0);
r([ d(cc.Label) ], t.prototype, "inactiveLabel", void 0);
return t = r([ u ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
