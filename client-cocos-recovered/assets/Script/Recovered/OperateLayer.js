// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5ffb4fXmm1OfJpdMpHe99J/", "OperateLayer");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./RoomInfoData"), c = e("./CardHuTip"), u = e("./OperateOption"), d = e("./OperateCellData"), p = e("./Loader"), f = e("./GameControl"), h = e("./OperateConfig"), m = e("./GameLogicMJ"), y = e("./RoomUtils"), g = e("./GameConfig"), _ = e("./CommonEnum"), v = e("./GameMsgMJ"), C = cc._decorator, b = C.ccclass, D = C.property, S = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.optionNode = null;
t.tingNode = null;
t.huNormalMulLine = null;
t.huNormalOneLine = null;
t.huSpecial = null;
t.cardPre = null;
t.operatePre = null;
t.baseNode = null;
t.ldNode = null;
t.lbNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_hand_select_change, function(t, o) {
e.tingCard(o.card);
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_hand_select_clean, function(t, o) {
e.tingNode.active = !1;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_choose_operate_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_game_step_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
};
t.prototype._updateShowLDNode = function(e) {
var t = this;
this.scheduleOnce(function() {
t.ldNode.active = e;
t.lbNode.active = !e;
}, 0);
};
t.prototype._descAnimate = function() {
var e = this, t = cc.delayTime(.3), o = cc.callFunc(function() {
e.lbNode.getComponent(cc.Label).string = "请等待其他玩家亮倒";
}), n = cc.delayTime(.3), r = cc.callFunc(function() {
e.lbNode.getComponent(cc.Label).string = "请等待其他玩家亮倒.";
}), i = cc.delayTime(.3), a = cc.callFunc(function() {
e.lbNode.getComponent(cc.Label).string = "请等待其他玩家亮倒..";
}), s = cc.delayTime(.3), l = cc.callFunc(function() {
e.lbNode.getComponent(cc.Label).string = "请等待其他玩家亮倒...";
}), c = cc.repeatForever(cc.sequence(t, o, n, r, i, a, s, l));
this.lbNode.runAction(c);
};
t.prototype.update = function() {
if (this._uiDirty) {
if (f.default.getInstance().isPlayingBeginAnimation) return;
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
var e = this;
this._hideLiangDaoOperate();
this.optionNode.destroyAllChildren();
var t = l.default.myAbsolutePos(), o = l.default.gameInfo.siteInfos.get(t);
if (o) {
var n = function(t) {
var o = cc.instantiate(e.operatePre), n = o.getComponent(u.default);
n.setData(t, e);
e.optionNode.addChild(o);
return n;
}, r = o.operateOptions();
if (r && r.count() > 0) {
if (y.default.getInstance().isShowGuo(r)) {
n(new d.default({
index: h.eOperateCategory.Guo
}));
}
for (var i = r.collection(null, function(e, t) {
return e.weight - t.weight;
}), a = null, s = null, c = 0; c < i.length; c++) {
var p = i[c], f = r.get(p);
if (f.category == h.eOperateCategory.WarnLL && l.default.config.index == _.eGameIds.HZHH) {
var m = l.default.myAbsolutePos();
l.default.gameInfo.siteInfos.get(m).setIsSelectCard(!1);
}
f.category === h.eOperateCategory.LiangDao ? this._updateShowLiangDao(f) : f.category === h.eOperateCategory.Chi ? a ? a.pushData(f) : a = n(f) : f.category === h.eOperateCategory.Gang ? s ? s.pushData(f) : s = n(f) : n(f);
}
g.default.area() === _.eArea.QJ && s && s.updateImg();
}
}
};
t.prototype._updateShowLiangDao = function(e) {
var t = !0;
this.lbNode.stopAllActions();
var o = e.subType;
if (1 === o) this._updateShowLDNode(!0); else if (2 === o) {
this._updateShowLDNode(!1);
this._descAnimate();
} else t = !1;
this.baseNode.active = t;
var n = l.default.myAbsolutePos();
l.default.gameInfo.siteInfos.get(n).setIsSelectCard(!t);
this.optionNode.active = !t;
};
t.prototype._hideLiangDaoOperate = function() {
var e = l.default.myAbsolutePos(), t = l.default.gameInfo.siteInfos.get(e);
t && t.setIsSelectCard(!0);
this.baseNode.active = !1;
this.optionNode.active = !0;
};
t.prototype.liangDao = function() {
v.GameMsgMJ.getInstance().operate(h.eOperateCategory.LiangDao, null, [ 31, 32, 33 ], function(e, t) {
if (t) i.default.uiHelper.showTip("网络异常~"); else {
e.error < 0 && i.default.uiHelper.showTip("网络异常~");
e.error > 0 && i.default.uiHelper.showTip("" + e.what);
}
});
};
t.prototype.notLiangDao = function() {
v.GameMsgMJ.getInstance().operate(h.eOperateCategory.NotLiangDao, null, [], function(e, t) {
if (t) i.default.uiHelper.showTip("网络异常~"); else {
e.error < 0 && i.default.uiHelper.showTip("网络异常~");
e.error > 0 && i.default.uiHelper.showTip("" + e.what);
}
});
};
t.prototype.tingCard = function(e) {
var t = l.default.myAbsolutePos(), o = l.default.gameInfo.siteInfos.get(t), n = [], r = i.default.gameLogic(), a = (n = r.tingCards(o, e)).length;
if (a > 0) {
this.tingNode.active = !0;
var s = r.tingTipType(n);
this.tingNode.height = 152;
if (s === m.eTingTipType.NORMAL) {
this.huNormalMulLine.active = !0;
this.huNormalOneLine.active = !0;
this.huSpecial.active = !1;
this.huNormalMulLine.destroyAllChildren();
this.huNormalOneLine.destroyAllChildren();
n.sort(function(e, t) {
var o = l.default.gameInfo.isLaiZi(e), n = l.default.gameInfo.isLaiZi(t);
return o !== n ? n ? 1 : -1 : e - t;
});
var u = Math.ceil(n.length / 10), d = null;
d = u > 1 ? this.huNormalMulLine : this.huNormalOneLine;
for (var f = 0; f < a; f++) {
var h = cc.instantiate(this.cardPre);
h.getComponent(c.default).setData(n[f]);
d.addChild(h);
}
this.tingNode.height = 152 * u;
} else {
this.huNormalMulLine.active = !1;
this.huNormalOneLine.active = !1;
this.huSpecial.active = !0;
var y = this._tingTipImg(s);
p.default.setImg(y, this.huSpecial);
}
} else this.tingNode.active = !1;
};
t.prototype._tingTipImg = function(e) {
var t = "Hall/Res/Texture/Game/";
return 1 === e ? t + "jjh" : e === m.eTingTipType.JZH ? t + "jzh" : void 0;
};
r([ D(cc.Node) ], t.prototype, "optionNode", void 0);
r([ D(cc.Node) ], t.prototype, "tingNode", void 0);
r([ D(cc.Node) ], t.prototype, "huNormalMulLine", void 0);
r([ D(cc.Node) ], t.prototype, "huNormalOneLine", void 0);
r([ D(cc.Node) ], t.prototype, "huSpecial", void 0);
r([ D(cc.Prefab) ], t.prototype, "cardPre", void 0);
r([ D(cc.Prefab) ], t.prototype, "operatePre", void 0);
r([ D(cc.Node) ], t.prototype, "baseNode", void 0);
r([ D(cc.Node) ], t.prototype, "ldNode", void 0);
r([ D(cc.Node) ], t.prototype, "lbNode", void 0);
return t = r([ b ], t);
}(cc.Component);
o.default = S;
cc._RF.pop();
