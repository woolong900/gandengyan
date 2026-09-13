// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1c643ekwN9AoJ2L7b6Fky8D", "OperateOption");
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
var i = e("./Loader"), a = e("./GameMsgMJ"), s = e("./gContext"), l = e("./WindowConfig"), c = e("./RoomInfoData"), u = e("./CommonUtils"), d = e("./OperateConfig"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._father = null;
t._allData = [];
t.sprite = null;
t.chooseChiLayer = null;
t.chooseGangLayer = null;
return t;
}
t.prototype.setData = function(e, t) {
i.default.setImg(e.bigImgPath, this.sprite);
this._allData.push(e);
this._father = t;
};
t.prototype.pushData = function(e) {
this._allData.push(e);
};
t.prototype.updateImg = function() {
if (2 === c.default.config.index && 1 === this._allData.length && this._allData[0].category === d.eOperateCategory.Gang) {
var e = this._allData[0].cards[0];
c.default.gameInfo.isPiZi(e) && i.default.setImg("Hall/Res/Texture/Game/operates/big/ct", this.sprite);
}
};
t.prototype._doChi = function() {
var e = this, t = this._allData[0], o = function() {
if (e._allData.length > 1) s.default.uiHelper.show(l.eWindowID.ChooseChiLayer, e._allData); else {
var o = [ t.cards[0], t.cards[1], t.cards[2] ];
e._sendMsg(o);
}
}, n = s.default.gameLogic().tipDescOpen();
n ? s.default.msgBox.show(n, function() {
o();
}) : o();
};
t.prototype._doPeng = function() {
var e = this, t = [ this._allData[0].cards[0] ], o = s.default.gameLogic().tipDescOpen();
o ? s.default.msgBox.show(o, function() {
e._sendMsg(t);
}) : this._sendMsg(t);
};
t.prototype._doGang = function() {
var e = this;
if (1 === this._allData.length) {
var t = this._allData[0].cards[0], o = [ t ], n = s.default.gameLogic().tipDescOpen();
if (n) {
var r = c.default.myAbsolutePos(), i = c.default.gameInfo.siteInfos.get(r).handCards;
3 === u.default.valueCount(i, t) ? s.default.msgBox.show(n, function() {
e._sendMsg(o);
}) : this._sendMsg(o);
} else this._sendMsg(o);
} else s.default.uiHelper.show(l.eWindowID.ChooseGangLayer, this._allData);
};
t.prototype._sendMsg = function(e) {
if (!c.default.isPlayback()) {
var t = this._allData[0];
a.GameMsgMJ.getInstance().operate(t.category, t.subType, e, function(e, t) {
if (t) s.default.uiHelper.showTip("网络异常~"); else {
e.error < 0 && s.default.uiHelper.showTip("网络异常~");
e.error > 0 && s.default.uiHelper.showTip("" + e.what);
}
});
this._father.updateUI();
}
};
t.prototype._doGuo = function() {
var e = this, t = s.default.gameLogic().tipDescGuo();
t ? s.default.msgBox.show(t, function() {
e._sendMsg(null);
}) : this._sendMsg(null);
};
t.prototype.onClick = function() {
var e = this._allData[0];
e.category === d.eOperateCategory.Chi ? this._doChi() : e.category === d.eOperateCategory.Peng ? this._doPeng() : e.category === d.eOperateCategory.Gang ? this._doGang() : e.category === d.eOperateCategory.Guo ? this._doGuo() : this._sendMsg(null);
};
r([ h(cc.Sprite) ], t.prototype, "sprite", void 0);
r([ h(cc.Prefab) ], t.prototype, "chooseChiLayer", void 0);
r([ h(cc.Prefab) ], t.prototype, "chooseGangLayer", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
