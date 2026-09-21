// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "39eb7Linv5A0LQPmbHDoch6", "DismissRoomLayer");
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
var i = require("./UserData"), a = require("./BaseComponent"), s = require("./DismissRoomInfoData"), l = require("./gContext"), c = require("./EventKeys"), u = require("./EventUtils"), d = require("./CommonEnum"), p = require("./RoomInfoData"), f = require("./DismissRoomCell"), h = require("./SoundUtils"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.timeLabel = null;
t.btnRoot = null;
t.waitRoot = null;
t.cellContainer = null;
return t;
}
t.prototype.start = function() {
var e = this;
this._updateTime();
this.schedule(function() {
e._updateTime();
}, 1, cc.macro.REPEAT_FOREVER, 0);
l.default.eventUtils.on(c.default.data_dismiss_data_change, function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
this.updateUI();
};
t.prototype._updateTime = function() {
var e = s.default.endTime - Math.floor(i.default.millisecond / 1e3);
e <= 0 && (e = 0);
this.timeLabel.string = e + "秒后房间自动解散";
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
if (s.default.useChooseType(i.default.uid) === d.eUseChoose.NotChoose) {
this.btnRoot.active = !0;
this.waitRoot.active = !1;
} else {
this.btnRoot.active = !1;
this.waitRoot.active = !0;
}
for (var e = 0; e < 5; e++) {
var t = p.default.players.getByPos(e), o = this.cellContainer.children[e];
if (!o) break;
if (t) {
o.active = !0;
o.getComponent(f.default).setData(t.uid);
} else o.active = !1;
}
};
t.prototype.onClickAgree = function() {
h.default.clickBtn();
l.default.gameMsgBase().dismissRoom(!0, null);
};
t.prototype.onClickDisagree = function() {
h.default.clickBtn();
l.default.gameMsgBase().dismissRoom(!1, null);
};
r([ g(cc.Label) ], t.prototype, "timeLabel", void 0);
r([ g(cc.Node) ], t.prototype, "btnRoot", void 0);
r([ g(cc.Node) ], t.prototype, "waitRoot", void 0);
r([ g(cc.Node) ], t.prototype, "cellContainer", void 0);
return t = r([ y ], t);
}(a.default);
o.default = _;
cc._RF.pop();
