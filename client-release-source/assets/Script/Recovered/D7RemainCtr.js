// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "90ed6MKkOFPTbpbVTYiAAOj", "D7RemainCtr");
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
var i = require("./RoomInfoData"), a = require("./D7Enum"), s = require("./gContext"), l = require("./Loader"), c = require("./D7CardUtils"), u = require("./D7GameInfoData"), d = require("./D7EventKeys"), p = require("./EventUtils"), f = require("./D7RoomUtils"), h = require("./D7SingleEndData"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.descKouDi = null;
t.descWaitingFan = null;
t.descWaitingMai = null;
t.cardRoot = null;
t.baseRootBg = null;
t.dzcd = null;
t.gzcd = null;
t.ldcd = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on([ d.default.data_status_change, d.default.data_get_remain, d.default.data_step_change, d.default.data_fan_turn, d.default.data_fan_ok, d.default.data_fan_guo, d.default.data_step_change ], function() {
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
this.descKouDi.node.active = !1;
this.descWaitingFan.active = !1;
this.descWaitingMai.active = !1;
this.cardRoot.active = !1;
this.baseRootBg.node.active = !1;
var e = i.default.gameInfoD7.status;
if (e === a.eD7GameStatus.Calling) {
var t = i.default.gameInfoD7.getRemainInfo.uid;
if (t > 0) {
if (i.default.isPlayback()) this._showCards(i.default.gameInfoD7.getRemainInfo.cards); else if (!f.default.getInstance().isViewDown(t)) {
this.descWaitingMai.active = !0;
this._showHideCards();
}
} else {
var o = i.default.gameInfoD7.roundData();
if (i.default.isPlayback()) o.type === u.eRoundTypeD7.Fan && this._showCards(i.default.gameInfoD7.putRemainCards); else if (o.type === u.eRoundTypeD7.Fan && o.lastData().pos !== i.default.myAbsolutePos()) {
this.descWaitingFan.active = !0;
this._showHideCards();
}
}
} else if (e === a.eD7GameStatus.SingleEnd) {
if (i.default.gameInfoD7.giveUpUid > 0) return;
if (0 == h.default.getInstance().baseType()) this.baseRootBg.node.active = !1; else if (1 == h.default.getInstance().baseType()) {
this.baseRootBg.node.active = !0;
this.baseRootBg.spriteFrame = this.gzcd;
this.descKouDi.node.active = !0;
var n = c.default.getRemainNum(h.default.getInstance().baseCards());
this.descKouDi.string = n + " x 2 = " + 2 * n;
} else if (2 == h.default.getInstance().baseType()) {
this.baseRootBg.node.active = !0;
this.baseRootBg.spriteFrame = this.dzcd;
this.descKouDi.node.active = !0;
n = c.default.getRemainNum(h.default.getInstance().baseCards());
this.descKouDi.string = n + " x 4 = " + 4 * n;
} else if (7 == h.default.getInstance().baseType()) {
this.baseRootBg.node.active = !0;
this.baseRootBg.spriteFrame = this.ldcd;
this.descKouDi.node.active = !0;
n = c.default.getRemainNum(h.default.getInstance().baseCards());
var r = h.default.getInstance().gameEndPai(), s = (0 == r.length ? h.default.getInstance().lastPaiNUM() : r[0].length) / 2;
this.descKouDi.string = n + " x 4 x " + s + " = " + 4 * n * s;
} else this.baseRootBg.node.active = !1;
var d = h.default.getInstance().baseCards();
if (d && d.length > 0) {
this.cardRoot.active = !0;
for (var p = 0, m = d.length; p < m; p++) {
var y = this.cardRoot.getChildByName("card_" + p);
y.active = !0;
l.default.setImg(c.default.imgPath(d[p]), y);
}
}
h.default.getInstance().restgGameEndPai();
}
};
t.prototype._showHideCards = function() {
this.cardRoot.active = !0;
for (var e = s.default.gameLogic(i.default.config.index).remainNum(i.default.config), t = 0; t < e; t++) {
var o = this.cardRoot.getChildByName("card_" + t);
o.active = !0;
l.default.setImg(c.default.imgPath(0), o);
}
};
t.prototype._showCards = function(e) {
this.cardRoot.active = !0;
for (var t = 0; t < e.length; t++) {
var o = this.cardRoot.getChildByName("card_" + t);
o.active = !0;
l.default.setImg(c.default.imgPath(e[t]), o);
}
};
r([ g(cc.Label) ], t.prototype, "descKouDi", void 0);
r([ g(cc.Node) ], t.prototype, "descWaitingFan", void 0);
r([ g(cc.Node) ], t.prototype, "descWaitingMai", void 0);
r([ g(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ g(cc.Sprite) ], t.prototype, "baseRootBg", void 0);
r([ g(cc.SpriteFrame) ], t.prototype, "dzcd", void 0);
r([ g(cc.SpriteFrame) ], t.prototype, "gzcd", void 0);
r([ g(cc.SpriteFrame) ], t.prototype, "ldcd", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
