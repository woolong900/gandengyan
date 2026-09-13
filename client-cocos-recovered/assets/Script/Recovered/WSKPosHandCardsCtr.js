// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "4e575tlPFZHrYOEsP5sj7wA", "WSKPosHandCardsCtr");
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
var i = require("./RoomInfoData"), a = require("./Loader"), s = require("./EventUtils"), l = require("./gContext"), c = require("./WSKEnum"), u = require("./WSKEventKeys"), d = require("./WSKPosCtr"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
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
l.default.eventUtils.on(u.default.data_hand_card_change, function(t, o) {
o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on([ u.default.data_status_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._udpateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._udpateUI();
}
};
t.prototype._udpateUI = function() {
for (var e = 0, t = this.cardsRoot.childrenCount; e < t; e++) this.cardsRoot.children[e].active = !1;
var o = [], n = i.default.gameInfoWSK.status;
if (n === c.eWSKGameStatus.Free || n === c.eWSKGameStatus.SingleEnd) o = []; else {
var r = this.posCtr.deskPos();
o = i.default.gameInfoWSK.siteInfos.get(r).handCards;
}
for (e = 0, t = o.length; e < t; e++) {
var s = o[e];
if (s > 0) {
var u = this.cardsRoot.getChildByName("card_" + e);
u.active = !0;
var d = l.default.gameLogic().cardImgPath(s);
a.default.setImg(d, u);
l.default.gameLogic().score(s) > 0 ? u.getChildByName("zp").active = !0 : u.getChildByName("zp").active = !1;
}
}
};
r([ h(d.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "cardsRoot", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
