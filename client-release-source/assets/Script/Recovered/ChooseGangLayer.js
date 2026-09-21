// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3f808R4erhMz6S8DphN3xKK", "ChooseGangLayer");
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
var i = require("./UserData"), a = require("./CommonEnum"), s = require("./CardShowCtr2D"), l = require("./CardUtils"), c = require("./CardHandShowCtr3D"), u = require("./GameMsgMJ"), d = require("./gContext"), p = require("./OperateConfig"), f = require("./BaseComponent"), h = require("./GameSoundMJ"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._cardList = [];
t.chooseList = [];
t.card2d = null;
t.card3d = null;
return t;
}
t.prototype.setData = function(e) {
this._cardList = [];
for (var t = 0; t < e.length; t++) this._cardList.push(e[t].cards[0]);
for (t = 0; t < this._cardList.length; t++) {
var o = this._cardList[t], n = null;
i.default.gameView === a.eGameView.View2D ? (n = cc.instantiate(this.card2d)).getComponent(s.default).setData(l.eCardShowType.Hand, o, !1) : (n = cc.instantiate(this.card3d)).getComponent(c.default).setData(o);
this.chooseList[t].active = !0;
this.chooseList[t].addChild(n);
}
};
t.prototype.onClick = function(e, t) {
h.default.getInstance().clickCard();
var o = this._cardList[t];
d.default.uiHelper.remove(this);
u.GameMsgMJ.getInstance().operate(p.eOperateCategory.Gang, null, [ o ], function(e, t) {});
};
r([ g(cc.Node) ], t.prototype, "chooseList", void 0);
r([ g(cc.Prefab) ], t.prototype, "card2d", void 0);
r([ g(cc.Prefab) ], t.prototype, "card3d", void 0);
return t = r([ y ], t);
}(f.default);
o.default = _;
cc._RF.pop();
