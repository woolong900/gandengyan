// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b1108yyfMxBP7eeo2sUIDUO", "WSKPosPlaybackHandCtr");
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
var i = require("./RoomInfoData"), a = require("./Loader"), s = require("./EventUtils"), l = require("./gContext"), c = require("./WSKEventKeys"), u = require("./WSKPosCtr"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.cardsRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on([ c.default.data_hand_card_change ], function(t, o) {
o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_step_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on(c.default.data_friend_card_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this.posCtr.deskPos();
this._cleanShow();
for (var t = i.default.gameInfoWSK.siteInfos.get(e), o = l.default.gameLogic().sortDesc(t.handCards), n = 0, r = o.length; n < r; n++) {
var s = o[n], c = this.cardsRoot.getChildByName("card_" + n);
c.active = !0;
var u = l.default.gameLogic().cardImgPath(s);
a.default.setImg(u, c);
s === i.default.gameInfoWSK.friendCard ? c.color = cc.color(154, 162, 186) : c.color = cc.color(255, 255, 255);
c.getChildByName("zp").active = l.default.gameLogic().score(s) > 0;
}
};
t.prototype._cleanShow = function() {
for (var e = 0, t = this.cardsRoot.childrenCount; e < t; e++) this.cardsRoot.children[e].active = !1;
};
r([ f(u.default) ], t.prototype, "posCtr", void 0);
r([ f(cc.Node) ], t.prototype, "cardsRoot", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
