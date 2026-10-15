// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6c245jMC2JGR7X4Nx/wIS+5", "DDZPosWaringCtr");
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
var i = require("./DDZPosCtr"), a = require("./gContext"), s = require("./DDZEventKeys"), l = require("./EventUtils"), c = require("./RoomInfoData"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.posCtr = null;
t.waringNode = null;
t.waringLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (0 !== this.posCtr.uiPos) if (a.default.gameLogic(c.default.config.index).isShowRemain(c.default.config)) {
this.waringNode.node.y = 37;
this.waringNode.node.scale = .6;
} else {
this.waringNode.node.y = -60;
this.waringNode.node.scale = 1;
}
a.default.eventUtils.on([ s.default.data_hand_card_remove, s.default.data_hand_card_reset ], function(t, o) {
o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.waringNode.node.active = !1;
var e = this.posCtr.deskPos(), t = c.default.gameInfoDDZ.siteInfos.get(e);
if (t) {
var o = t.handCards.length;
if (1 == o || 2 == o) {
this.waringNode.node.active = !0;
this.waringLabel.string = o + "";
this.waringNode.playAnimation("Sprite", 0);
}
}
};
r([ p(i.default) ], t.prototype, "posCtr", void 0);
r([ p(dragonBones.ArmatureDisplay) ], t.prototype, "waringNode", void 0);
r([ p(cc.Label) ], t.prototype, "waringLabel", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
