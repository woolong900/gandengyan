// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d0d8f900RBOe6UQ/msBUlmY", "CardLayerBase");
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
var i = e("./CommonEnum"), a = e("./gContext"), s = e("./EventKeys"), l = e("./EventUtils"), c = e("./RoomInfoData"), u = e("./GameControl"), d = e("./RoomUtils"), p = e("./GameInfoData"), f = cc._decorator, h = f.ccclass, m = (f.property,
function(e) {
n(t, e);
function t() {
var t, o = null !== e && e.apply(this, arguments) || this;
o._lastPutIndex = -1;
o._uiDirty = !1;
o._cardPointerDirty = !1;
o._handDirtyInfos = ((t = {})[i.eDeskPos.West] = !1, t[i.eDeskPos.North] = !1, t[i.eDeskPos.East] = !1,
t[i.eDeskPos.South] = !1, t);
o._operateDirty = !1;
o._operateDirtyPos = i.eDeskPos.Stand;
o._outDirty = !1;
o._outDirtyPos = i.eDeskPos.Stand;
o._paidunDirty = !1;
o._paidunDirtyPos = i.eDeskPos.Stand;
return o;
}
t.prototype.getLastPutIndex = function() {
return this._lastPutIndex;
};
t.prototype.setLastPutIndex = function(e) {
this._lastPutIndex = e;
};
t.prototype.onEnable = function() {
var e = this;
a.default.eventUtils.on(s.default.data_card_pointer_change, function(t, o) {
e._cardPointerDirty = !0;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_game_status_change, function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_game_watch_pos_change, function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on([ s.default.data_hand_card_add, s.default.data_hand_card_remove ], function(t, o) {
e._handDirtyInfos[o.pos] = !0;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_out_card_change, function(t, o) {
e._outDirty = !0;
e._outDirtyPos = o.pos;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_pai_dun_change, function(t, o) {
e._paidunDirty = !0;
e._paidunDirtyPos = o.pos;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_operated_change, function(t, o) {
e._operateDirty = !0;
e._operateDirtyPos = o.pos;
}, this, l.eOffType.OnDisable);
a.default.eventUtils.on(s.default.data_operated_change, function(t, o) {
if (c.default.isPlayback()) e._handDirtyInfos[o.pos] = !0; else {
var n = o.pos, r = o.index;
if (c.default.myAbsolutePos() == n) {
var i = c.default.gameInfo.siteInfos.get(n).operateList.get(r);
null != i && i.isWarn() && (e._handDirtyInfos[o.pos] = !0);
}
}
}, this, l.eOffType.OnDisable);
this._uiDirty = !0;
};
t.prototype.update = function() {
if (!u.default.getInstance().isPlayingBeginAnimation) if (this._uiDirty) {
this._uiDirty = !1;
this.initUI();
} else {
this._handDirty(i.eDeskPos.West);
this._handDirty(i.eDeskPos.North);
this._handDirty(i.eDeskPos.East);
this._handDirty(i.eDeskPos.South);
if (this._operateDirty) {
this._operateDirty = !1;
var e = this._operateDirtyPos, t = c.default.gameInfo.siteInfos.get(e), o = d.default.getInstance().deskPos2ViewPos(e);
this._updatePiZi(t, o);
this._updateGang(t, o);
}
if (this._outDirty) {
this._outDirty = !1;
e = this._outDirtyPos, t = c.default.gameInfo.siteInfos.get(e), o = d.default.getInstance().deskPos2ViewPos(e);
this._updateOut(t, o);
}
if (this._paidunDirty) {
this._paidunDirty = !1;
e = this._paidunDirtyPos, t = c.default.gameInfo.siteInfos.get(e), o = d.default.getInstance().deskPos2ViewPos(e);
this._updatePaiDun(t, o);
}
if (this._cardPointerDirty) {
this._cardPointerDirty = !1;
this._updateCardPointer();
}
}
};
t.prototype._handDirty = function(e) {
if (this._handDirtyInfos[e]) {
this._handDirtyInfos[e] = !1;
var t = c.default.gameInfo.siteInfos.get(e), o = d.default.getInstance().deskPos2ViewPos(e);
this._updateHand(t, o);
}
};
t.prototype.getShowCardPointerPos = function() {
var e = c.default.gameInfo.status;
if (e === p.eGameStatus.Gameing) {
if ((t = c.default.gameInfo.cardPointer) >= 0) return t;
}
if (e === p.eGameStatus.SingleEnd) {
if (c.default.gameInfo.singleEndInfo.isZiMoEnd()) return i.eDeskPos.Stand;
var t;
if ((t = c.default.gameInfo.playerPointer) >= 0) return t;
}
return i.eDeskPos.Stand;
};
t.prototype.initUI = function() {
for (var e = c.default.myAbsolutePos(), t = i.eViewPos.Down; t <= i.eViewPos.Right; t++) {
var o = d.default.getInstance().viewPos2DeskPos(t, e);
this._updatePos(o, t);
}
this._updateCardPointer();
};
t.prototype._updatePos = function(e, t) {
var o = c.default.gameInfo.siteInfos.get(e);
if (o) {
this._updateHand(o, t);
this._updateGang(o, t);
this._updatePiZi(o, t);
this._updateOut(o, t);
this._updatePaiDun(o, t);
} else cc.log("此位置无玩家 view pos:", t);
};
t.prototype._updateCardPointer = function() {};
t.prototype._updateHand = function(e, t) {};
t.prototype._updateGang = function(e, t) {};
t.prototype._updatePiZi = function(e, t) {};
t.prototype._updateOut = function(e, t) {};
t.prototype._updatePaiDun = function(e, t) {};
return t = r([ h ], t);
}(cc.Component));
o.default = m;
cc._RF.pop();
