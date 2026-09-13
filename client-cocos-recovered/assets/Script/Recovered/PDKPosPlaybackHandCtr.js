// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "c166eaC9sFIFL7t1tHG6InX", "PDKPosPlaybackHandCtr");
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
var i = e("./gContext"), a = e("./PDKEventKeys"), s = e("./RoomInfoData"), l = e("./EventUtils"), c = e("./PDKPosCtr"), u = e("./Loader"), d = e("./PDKCardUtils"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.cardsRoot = null;
t.disCardRoot = null;
t.disCardNum = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on([ a.default.data_hand_card_remove, a.default.data_hand_card_reset ], function(t, o) {
o.pos === e.posCtr.deskPos() && (e._uiDirty = !0);
}, this, l.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_step_change, function() {
e._uiDirty = !0;
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
var e = this.posCtr.deskPos();
if (e < 0) {
for (var t = d.default.sortDesc(s.default.gameInfoPDK.discards || [], !0), o = 0, n = t.length; o < n; o++) {
var r = t[o];
(l = this.cardsRoot.getChildByName("card_" + o)).active = !0;
l.color = cc.color(128, 128, 128);
var i = d.default.imgPath(r);
u.default.setImg(i, l);
}
if (t.length > 0) {
this.disCardRoot.active = !0;
this.disCardNum.string = "" + t.length;
}
} else {
this._cleanShow();
var a = s.default.gameInfoPDK.siteInfos.get(e).handCards;
for (o = 0, n = a.length; o < n; o++) {
var l;
r = a[o];
(l = this.cardsRoot.getChildByName("card_" + o)).active = !0;
i = d.default.imgPath(r);
u.default.setImg(i, l);
}
}
};
t.prototype._cleanShow = function() {
for (var e = 0, t = this.cardsRoot.childrenCount; e < t; e++) this.cardsRoot.children[e].active = !1;
};
r([ h(c.default) ], t.prototype, "posCtr", void 0);
r([ h(cc.Node) ], t.prototype, "cardsRoot", void 0);
r([ h(cc.Node) ], t.prototype, "disCardRoot", void 0);
r([ h(cc.Label) ], t.prototype, "disCardNum", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
