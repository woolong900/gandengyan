// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "60176yGAsVFgptBoMoYwqD+", "D7PlayerFanCtr");
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
var i = require("./D7EventKeys"), a = require("./RoomInfoData"), s = require("./D7Enum"), l = require("./D7PlayerCtr"), c = require("./D7CardUtils"), u = require("./Loader"), d = require("./gContext"), p = require("./EventUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.playerCtr = null;
t.rootNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
d.default.eventUtils.on(i.default.data_fan_ok, function() {
e._uiDirty = !0;
}, this, p.eOffType.OnDestroy);
d.default.eventUtils.on(i.default.data_status_change, function() {
e._uiDirty = !0;
}, this, p.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.rootNode.active = !1;
if (!a.default.isPlayback() && a.default.gameInfoD7.status === s.eD7GameStatus.Calling) {
var e = this.playerCtr.getPlayer(), t = a.default.gameInfoD7.roundFanData();
if (t && t.pos === e.pos) {
this.rootNode.active = !0;
var o = t.card, n = c.default.imgPath(o);
u.default.setImg(n, this.rootNode.children[0]);
u.default.setImg(n, this.rootNode.children[1]);
}
}
};
r([ m(l.default) ], t.prototype, "playerCtr", void 0);
r([ m(cc.Node) ], t.prototype, "rootNode", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
