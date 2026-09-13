// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "03ae3eLIp5J/6QaFC0uR42A", "CardsManage3D");
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
var i = e("./CommonEnum"), a = e("./CardUtils"), s = e("./Loader"), l = e("./CardShowCtr3D"), c = e("./OperateConfig"), u = e("./gContext"), d = e("./RoomUtils"), p = e("./RoomInfoData"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.handShowList = [];
t.handHideList = [];
t.handCloseList = [];
t.gangShowList = [];
t.gangHideList = [];
t.lzShowList = [];
t.erLZShowList = [];
t.outShowList = [];
t.pdList = [];
t.qjLZShowList = [];
t.QjHZPZShowList = [];
t.erQjHZPZShowList = [];
t.huAnimation = null;
return t;
}
t.prototype.playHu = function() {
this.huAnimation.play();
};
t.prototype.hideHandShow = function(e) {
this._hideCache(e, this.handShowList);
this._hideCache(e, this.handCloseList);
};
t.prototype.handShow = function(e, t, o) {
t += 1;
var n = this.handShowList[e];
o === a.MJ_BACK_ID && (n = this.handCloseList[e]);
this._updateCard(n, t, o, !0);
};
t.prototype.hideHand = function(e) {
this._hideCache(e, this.handHideList);
};
t.prototype.hand = function(e, t, o) {
t += 1;
if (e === i.eViewPos.Down) {
var n = this.handHideList[e].getChildByName("card_" + t);
if (n) {
n.active = !0;
return n;
}
} else this._updateCard(this.handHideList[e], t, -1, !1);
};
t.prototype.updateHandDownPos = function(e) {
var t = Math.floor(e / 3);
4 === t ? this.handHideList[i.eViewPos.Down].x = 640 : 3 === t ? this.handHideList[i.eViewPos.Down].x = 907 : 2 === t ? this.handHideList[i.eViewPos.Down].x = 1110 : 1 === t ? this.handHideList[i.eViewPos.Down].x = 1365 : 0 === t && (this.handHideList[i.eViewPos.Down].x = 1620);
};
t.prototype.hideGang = function(e) {
this._hideCache(e, this.gangShowList);
this._hideCache(e, this.gangHideList);
};
t.prototype.gang = function(e, t, o, n, r) {
t += 1;
var i = o.cards;
if (o.category === c.eOperateCategory.Gang) {
var s = i[0];
if (u.default.gameLogic().is3CardGang(s)) {
var l = this.gangShowList[e];
this._updateCard(l, t + "_1", s, !0);
this._updateCard(l, t + "_2", s, !0);
this._updateCard(l, t + "_3", s, !0);
} else if (o.isAnGang()) {
var f = this.gangHideList[e];
this._updateCard(f, t + "_1", a.MJ_BACK_ID, !1);
this._updateCard(f, t + "_2", a.MJ_BACK_ID, !1);
this._updateCard(f, t + "_3", a.MJ_BACK_ID, !1);
if (n) if (s > 0 && !p.default.isWatcher() || p.default.isWatcher() && 2 == p.default.config.index) {
l = this.gangShowList[e];
this._updateCard(l, t + "_4", s, !0);
} else this._updateCard(f, t + "_4", a.MJ_BACK_ID, !1); else this._updateCard(f, t + "_4", a.MJ_BACK_ID, !1);
} else {
l = this.gangShowList[e];
this._updateCard(l, t + "_1", s, !0);
this._updateCard(l, t + "_2", s, !0);
this._updateCard(l, t + "_3", s, !0);
this._updateCard(l, t + "_4", s, !0);
}
} else if (o.category === c.eOperateCategory.Peng) {
s = i[0], l = this.gangShowList[e];
this._updateCard(l, t + "_1", s, !0);
this._updateCard(l, t + "_2", s, !0);
this._updateCard(l, t + "_3", s, !0);
o.pengIsGang() && this._updateCard(l, t + "_4", s, !0);
} else if (o.category === c.eOperateCategory.Chi) {
l = this.gangShowList[e];
this._updateCard(l, t + "_1", i[0], !0);
this._updateCard(l, t + "_2", i[1], !0);
this._updateCard(l, t + "_3", i[2], !0);
} else if (o.category === c.eOperateCategory.LiangDao) {
l = this.gangShowList[e];
this._updateCard(l, t + "_1", i[0], !0, !1, -1, !0);
this._updateCard(l, t + "_2", i[1], !0, !1, -1, !0);
this._updateCard(l, t + "_3", i[2], !0, !1, -1, !0);
}
if (r && u.default.gameLogic().isShowArrow()) {
var h = !1, m = 0;
if (o.isDingGang()) {
h = !0;
m = u.default.gameLogic().is3CardGang(i[0]) ? 2 : 4;
}
if (o.category === c.eOperateCategory.Peng && !o.pengIsGang()) {
h = !0;
m = 2;
}
if (h) {
l = this.gangShowList[e];
var y = o.pointTo(d.default.getInstance().viewPos2DeskPos(e));
this._updateCard(l, t + "_" + m, i[0], !0, !1, y);
}
}
};
t.prototype.hidePiZi = function(e) {
p.default.config.index == i.eGameIds.QJHZ ? u.default.gameLogic().uiStyle1() && !d.default.getInstance().isErRen() ? this._hideCache(e, this.QjHZPZShowList) : d.default.getInstance().isErRen() ? this._hideCache(e, this.erQjHZPZShowList) : this._hideCache(e, this.lzShowList) : u.default.gameLogic().uiStyle1() ? this._hideCache(e, this.qjLZShowList) : d.default.getInstance().isErRen() ? this._hideCache(e, this.erLZShowList) : this._hideCache(e, this.lzShowList);
};
t.prototype.pizi = function(e, t, o) {
t += 1;
if (p.default.config.index == i.eGameIds.QJHZ) if (u.default.gameLogic().uiStyle1() && !d.default.getInstance().isErRen()) {
var n = this.QjHZPZShowList[e];
this._updateCard(n, t, o, !0);
} else if (d.default.getInstance().isErRen()) {
n = this.erQjHZPZShowList[e];
this._updateCard(n, t, o, !0);
} else {
n = this.lzShowList[e];
this._updateCard(n, t, o, !0);
} else if (u.default.gameLogic().uiStyle1()) {
n = this.qjLZShowList[e];
this._updateCard(n, t, o, !0);
} else if (d.default.getInstance().isErRen()) {
n = this.erLZShowList[e];
this._updateCard(n, t, o, !0);
} else {
n = this.lzShowList[e];
this._updateCard(n, t, o, !0);
}
};
t.prototype.hideOut = function(e) {
this._hideCache(e, this.outShowList);
};
t.prototype.out = function(e, t, o, n) {
void 0 === n && (n = !1);
t += 1;
var r = this.outShowList[e];
this._updateCard(r, t, o, !0, n);
};
t.prototype.hidePaiDun = function(e) {
this._hideCache(e, this.pdList);
};
t.prototype.paiDun = function(e, t, o, n) {
t = t + 1 + (34 - n);
if (o > 0) {
var r = this.pdList[e];
this._updateCard(r, t + "_show", o, !0);
} else {
r = this.pdList[e];
this._updateCard(r, t + "_hide", o, !1);
}
};
t.prototype.outCardPosition = function(e, t) {
t += 1;
var o = this.outShowList[e].getChildByName("card_" + t), n = this.outShowList[e].position, r = o.position;
return n.add(r);
};
t.prototype._hideCache = function(e, t) {
this._hideChild(t[e]);
};
t.prototype._updateCard = function(e, t, o, n, r, l, c) {
void 0 === r && (r = !1);
void 0 === l && (l = -1);
void 0 === c && (c = !1);
var u = "card_" + t, d = e.getChildByName(u);
null != d && (o === a.MJ_HIDE_ID ? d.active = !1 : d.active = !0);
if (o > 0) if (n) {
this._addShowCtrComponent(d).setData(o, l);
} else {
var p = d.children[0], f = a.default.cardImgPath(o, i.eGameView.View3D);
s.default.setImg(f, p);
}
r && null != d && (d.color = a.CARD_COLOR_SELECT);
c && null != d && (d.color = a.CARD_COLOR_LIANGDAO);
};
t.prototype._addShowCtrComponent = function(e) {
var t = e.getComponent(l.default);
t || (t = e.addComponent(l.default));
return t;
};
t.prototype._hideChild = function(e) {
if (e) {
e.active = !0;
for (var t = e.children, o = 0, n = t.length; o < n; o++) t[o].active = !1;
} else cc.warn("get child is null:");
};
r([ m(cc.Node) ], t.prototype, "handShowList", void 0);
r([ m(cc.Node) ], t.prototype, "handHideList", void 0);
r([ m(cc.Node) ], t.prototype, "handCloseList", void 0);
r([ m(cc.Node) ], t.prototype, "gangShowList", void 0);
r([ m(cc.Node) ], t.prototype, "gangHideList", void 0);
r([ m(cc.Node) ], t.prototype, "lzShowList", void 0);
r([ m(cc.Node) ], t.prototype, "erLZShowList", void 0);
r([ m(cc.Node) ], t.prototype, "outShowList", void 0);
r([ m(cc.Node) ], t.prototype, "pdList", void 0);
r([ m(cc.Node) ], t.prototype, "qjLZShowList", void 0);
r([ m(cc.Node) ], t.prototype, "QjHZPZShowList", void 0);
r([ m(cc.Node) ], t.prototype, "erQjHZPZShowList", void 0);
r([ m(cc.Animation) ], t.prototype, "huAnimation", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
