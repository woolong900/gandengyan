// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "341bfA8r4lDSKCf1qxa0I5K", "PlaybackLayer");
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
var i = require("./RoomInfoData"), a = require("./UserData"), s = require("./CenterMsg"), l = require("./gContext"), c = require("./SoundUtils"), u = require("./GameInfoData"), d = require("./EventKeys"), p = require("./EventUtils"), f = require("./CommonEnum"), h = require("./OperateConfig"), m = require("./OperateCellData"), y = require("./Loader"), g = require("./RoomUtils"), _ = require("./PlaybackData"), v = cc._decorator, C = v.ccclass, b = v.property, D = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._speedMul = 1;
t._bPlaying = !0;
t._curStep = -1;
t._stepDt = 0;
t.btnRoot = null;
t.huRoots = [];
t.operateRoots = [];
t.codeLabel = null;
t.btnPrev = null;
t.btnNext = null;
t.btnPlay = null;
t.btnStop = null;
t.mulAdd = null;
t.mulSub = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(d.default.data_operated_change, function(t, o) {
var n = o.pos, r = o.index;
if (i.default.gameInfo.siteInfos.get(n).operateList.get(r).category === h.eOperateCategory.Hu) {
var a = g.default.getInstance().deskPos2ViewPos(n);
e.huRoots[a].active = !0;
}
}, this, p.eOffType.OnDestroy);
l.default.eventUtils.on(d.default.data_choose_operate_change, function(t, o) {
var n = o.pos, r = g.default.getInstance().deskPos2ViewPos(n);
if (r !== f.eViewPos.Down) {
e.operateRoots[r].destroyAllChildren();
var a = i.default.gameInfo.siteInfos.get(n);
if (a) {
var s = function(t) {
var o = new cc.Node();
e.operateRoots[r].addChild(o);
y.default.loadImg(t.bigImgPath, function(e) {
if (o && o.isValid) {
o.addComponent(cc.Sprite).spriteFrame = e;
o.width = .6 * o.width;
o.height = .6 * o.height;
}
});
}, l = a.operateOptions();
if (l && l.count() > 0) {
if (g.default.getInstance().isShowGuo(l)) {
s(new m.default({
index: h.eOperateCategory.Guo
}));
}
for (var c = l.collection(null, function(e, t) {
return t.category - e.category;
}), u = 0; u < c.length; u++) {
var d = c[u];
s(l.get(d));
}
}
}
}
}, this, p.eOffType.OnDestroy);
l.default.eventUtils.on(d.default.data_game_status_change, function() {
e._xx();
}, this, p.eOffType.OnDestroy);
this._xx();
};
t.prototype._xx = function() {
var e = this;
i.default.gameInfo.status === u.eGameStatus.Free && this.scheduleOnce(function() {
e._setCurStep(0);
_.default.begin();
}, 1);
this._reset();
};
t.prototype._setCurStep = function(e) {
var t = _.default.count() - 1;
this._curStep = e > t ? -1 : e;
this._stepDt = this._stepTime();
};
t.prototype._reset = function() {
this.codeLabel.string = "战绩回放码：" + _.default.playbackCode();
for (var e = 0, t = this.huRoots.length; e < t; e++) this.huRoots[e].active = !1;
for (e = 0, t = this.operateRoots.length; e < t; e++) this.operateRoots[e].destroyAllChildren();
if (i.default.gameInfo.status === u.eGameStatus.Gameing) {
this.btnRoot.active = !0;
this._updateBtns();
} else this.btnRoot.active = !1;
this._updateSpeed();
};
t.prototype.update = function(e) {
if (this._bPlaying && this._curStep >= 0) {
this._stepDt = this._stepDt - e;
if (this._stepDt < 0) {
_.default.step(this._curStep);
this._setCurStep(this._curStep + 1);
}
}
};
t.prototype.onClickNext = function() {
c.default.clickBtn();
this._change(0);
};
t.prototype.onClickPre = function() {
c.default.clickBtn();
this._change(-2);
};
t.prototype.onClickAddSpeed = function() {
c.default.clickBtn();
this._addSpeed();
};
t.prototype.onClickSubSpeed = function() {
c.default.clickBtn();
this._subSpeed();
};
t.prototype.onClickPause = function() {
c.default.clickBtn();
if (this._bPlaying) this._bPlaying = !1; else {
this._bPlaying = !0;
this._stepDt = this._stepTime();
}
this._updateSpeed();
};
t.prototype._addSpeed = function() {
if (!(this._speedMul >= 5)) {
this._speedMul = this._speedMul + 1;
this._updateSpeed();
}
};
t.prototype._subSpeed = function() {
if (!(this._speedMul <= -3)) {
this._speedMul = this._speedMul - 1;
this._updateSpeed();
}
};
t.prototype._stepTime = function() {
return 1.2 - .2 * this._speedMul;
};
t.prototype._change = function(e) {
var t = this, o = _.default.playbackRoom();
if (o) {
var n = a.default.gameRecordList.get(o).getDetailsData(), r = i.default.gameInfo.curStep + e, c = n.playbackCode(r);
s.default.getRecordPlayback(c, function(e, o) {
if (o) l.default.uiHelper.showTipNetError(); else if (0 === e.error) {
t._speedMul = 1;
t._bPlaying = !0;
t._setCurStep(0);
_.default.begin();
} else l.default.uiHelper.showTip(e.what);
});
}
};
t.prototype._updateSpeed = function() {
if (this._speedMul > 0) {
this.mulAdd.string = this._speedMul + "X";
this.mulSub.string = "1X";
} else {
this.mulAdd.string = "1X";
this.mulSub.string = Math.abs(this._speedMul - 2) + "X";
}
this.btnStop.active = this._bPlaying;
this.btnPlay.active = !this._bPlaying;
};
t.prototype._updateBtns = function() {
var e = _.default.playbackRoom(), t = _.default.playbackCode();
if (e) {
var o = a.default.gameRecordList.get(e).getDetailsData(), n = o.count(), r = o.playbackIndex(t);
this.btnPrev.active = 0 !== r;
this.btnNext.active = r !== n - 1;
} else {
this.btnNext.active = !1;
this.btnPrev.active = !1;
}
};
r([ b(cc.Node) ], t.prototype, "btnRoot", void 0);
r([ b(cc.Node) ], t.prototype, "huRoots", void 0);
r([ b(cc.Node) ], t.prototype, "operateRoots", void 0);
r([ b(cc.Label) ], t.prototype, "codeLabel", void 0);
r([ b(cc.Node) ], t.prototype, "btnPrev", void 0);
r([ b(cc.Node) ], t.prototype, "btnNext", void 0);
r([ b(cc.Node) ], t.prototype, "btnPlay", void 0);
r([ b(cc.Node) ], t.prototype, "btnStop", void 0);
r([ b(cc.Label) ], t.prototype, "mulAdd", void 0);
r([ b(cc.Label) ], t.prototype, "mulSub", void 0);
return t = r([ C ], t);
}(cc.Component);
o.default = D;
cc._RF.pop();
