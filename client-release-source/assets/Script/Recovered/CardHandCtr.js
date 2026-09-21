// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "24ce4zCDFZO/bCH9sInrT2m", "CardHandCtr");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./EventUtils"), l = require("./RoomInfoData"), c = require("./Loader"), u = require("./Storage"), d = require("./OperateConfig"), p = require("./GameSoundMJ"), f = require("./GameMsgMJ"), h = cc._decorator, m = h.ccclass, y = (h.property,
cc.v2(0, 20)), g = cc.v2(0, 0), _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isPutCarding = !1;
t._isGanging = !1;
t._card = 0;
t._index = 0;
t._root = null;
t._tingTipNode = null;
t._dataTingActive = !1;
t._touchBegin = cc.v2(0, 0);
t._maxMoveOffset = 0;
t._isSelect = !1;
t._base = null;
return t;
}
t.prototype.init = function(e) {
var t = this;
this._root = e;
c.default.loadPre("Hall/Res/Prefab/Game/Animate/TingTipAnimate", function(e) {
t._tingTipNode && t._tingTipNode.destroy();
t._tingTipNode = cc.instantiate(e);
t._tingTipNode.y = 80;
t.node.addChild(t._tingTipNode);
t.updateTing();
});
};
t.prototype.setData = function(e, t, o) {
this._card = e;
this._index = t;
this._base = o;
this._isSelect = !1;
this.node.position = g;
this._dataTingActive = !1;
};
Object.defineProperty(t.prototype, "tingTipActive", {
set: function(e) {
this._dataTingActive = e;
this.updateTing();
},
enumerable: !0,
configurable: !0
});
t.prototype.updateTing = function() {
if (this._tingTipNode) {
this._tingTipNode.active = this._dataTingActive;
if (this._dataTingActive) {
this._tingTipNode.children[0].getComponent(cc.Animation).play(null, 0);
}
}
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_hand_select_change, function(t, o) {
if (o.index === e._index) {
e._isSelect = !0;
e.node.position = y;
} else {
e._isSelect = !1;
e.node.position = g;
}
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_hand_select_clean, function(t, o) {
e._isSelect = !1;
e.node.position = g;
}, this, s.eOffType.OnDestroy);
var t = 0;
this.node.on(cc.Node.EventType.TOUCH_START, function(o) {
if (!l.default.gameInfo.clickCard) {
var n = l.default.myAbsolutePos(), r = l.default.gameInfo.siteInfos.get(n), i = l.default.gameInfo.isFenggang();
e._isGanging = !!i;
r.bCanPutCard() ? e._isPutCarding = !0 : e._isPutCarding = !1;
if (e._isPutCarding || e._isGanging) {
e._touchBegin = o.getLocation();
e._maxMoveOffset = 0;
t = e._root.zIndex;
e._root.zIndex = 1e3;
}
}
}, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
if (!l.default.gameInfo.clickCard && (e._isPutCarding || e._isGanging)) {
var o = t.getLocation().sub(e._touchBegin), n = e._getBeginPos();
e.node.position = o.add(n);
var r = e._offset(o);
r > e._maxMoveOffset && (e._maxMoveOffset = r);
}
}, this);
this.node.on(cc.Node.EventType.TOUCH_END, function(o) {
if (!l.default.gameInfo.clickCard && (e._isPutCarding || e._isGanging)) {
e._moveEnd(o);
e._root.zIndex = t;
}
}, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, function(o) {
if (!l.default.gameInfo.clickCard && (e._isPutCarding || e._isGanging)) {
e._moveEnd(o);
e._root.zIndex = t;
}
}, this);
};
t.prototype._getBeginPos = function() {
return this._isSelect ? y : g;
};
t.prototype._moveEnd = function(e) {
var t = l.default.myAbsolutePos(), o = l.default.gameInfo.siteInfos.get(t).handCards;
l.default.gameInfo.siteInfos.get(t).operateOptions();
if (this._maxMoveOffset > 10) {
if (e.getLocation().sub(this._touchBegin).y < 100) {
var n = this._getBeginPos(), r = cc.moveTo(.02, n);
this.node.runAction(r);
} else {
if (i.default.gameLogic().canPut(this._card, o)) this._sendPutCard(); else {
n = this._getBeginPos(), r = cc.moveTo(.02, n);
this.node.runAction(r);
}
}
} else if (u.default.outCardClickOnce.getValue()) {
i.default.gameLogic().canPut(this._card, o) && this._sendPutCard();
} else if (this._isSelect) {
i.default.gameLogic().canPut(this._card, o) && this._sendPutCard();
} else {
p.default.getInstance().clickCard();
var a = l.default.myAbsolutePos();
l.default.gameInfo.siteInfos.get(a).selectHandCard(this._index);
}
};
t.prototype._offset = function(e) {
return e.x * e.x + e.y * e.y;
};
t.prototype._sendPutCard = function() {
var e = this, t = l.default.myAbsolutePos(), o = l.default.gameInfo.siteInfos.get(t);
if (o.bCanPutCard()) {
this._root.active = !1;
var n = o.operateOptions();
this._guo(n);
l.default.gameMjPutCard(this._card, function() {
e._base.setLastPutIndex(e._index);
});
}
};
t.prototype._guo = function(e) {
var t = this;
if (null != e && "function" == typeof e.count && e.count() > 0) {
var o = i.default.gameLogic().tipDescGuo();
if (o) {
i.default.msgBox.show(o, function() {
f.GameMsgMJ.getInstance().operate(d.eOperateCategory.Guo, null, null, function(e, t) {});
});
(function() {
t._root.active = !0;
var e = t._getBeginPos(), o = cc.moveTo(.02, e);
t.node.runAction(o);
})();
return;
}
f.GameMsgMJ.getInstance().operate(d.eOperateCategory.Guo, null, null, function(e, t) {});
}
};
return t = r([ m ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
