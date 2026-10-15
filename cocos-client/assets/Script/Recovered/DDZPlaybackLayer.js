// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "74a9dlWZwBGB6FI/pzKdcdm", "DDZPlaybackLayer");
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
var i = require("./RoomInfoData"), a = require("./PlaybackData"), s = require("./UserData"), l = require("./SoundUtils"), c = require("./CenterMsg"), u = require("./gContext"), d = require("./DDZEventKeys"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._speedMul = -3;
t._bPlaying = !0;
t._curStep = -1;
t._stepDt = 0;
t._changeBackReady = !0;
t.btnRoot = null;
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
this._xx();
};
t.prototype.update = function(e) {
if (this._bPlaying && this._curStep >= 0) {
this._stepDt = this._stepDt - e;
if (this._stepDt < 0) {
a.default.step(this._curStep);
this._setCurStep(this._curStep + 1);
}
}
};
t.prototype._xx = function() {
var e = this;
i.default.isGameFree() && this.scheduleOnce(function() {
e._setCurStep(0);
a.default.begin();
e._xx();
}, 1);
this._reset();
};
t.prototype._reset = function() {
this.codeLabel.string = "战绩回放码：" + a.default.playbackCode();
if (i.default.isGameFree()) this.btnRoot.active = !1; else {
this.btnRoot.active = !0;
this._updateBtns();
}
this._updateSpeed();
};
t.prototype.onClickNext = function() {
l.default.clickBtn();
this._change(0);
};
t.prototype.onClickPre = function() {
l.default.clickBtn();
this._change(-2);
};
t.prototype.onClickAddSpeed = function() {
l.default.clickBtn();
this._addSpeed();
};
t.prototype.onClickSubSpeed = function() {
l.default.clickBtn();
this._subSpeed();
};
t.prototype.onClickPause = function() {
l.default.clickBtn();
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
t.prototype._setCurStep = function(e) {
var t = a.default.count() - 1;
this._curStep = e > t ? -1 : e;
this._stepDt = this._stepTime();
};
t.prototype._stepTime = function() {
return 1.2 - .2 * this._speedMul;
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
var e = a.default.playbackRoom(), t = a.default.playbackCode();
if (e) {
var o = s.default.gameRecordList.get(e).getDetailsData(), n = o.count(), r = o.playbackIndex(t);
this.btnPrev.active = 0 !== r;
this.btnNext.active = r !== n - 1;
} else {
this.btnNext.active = !1;
this.btnPrev.active = !1;
}
};
t.prototype._change = function(e) {
var t = this;
if (this._changeBackReady) {
this._changeBackReady = !1;
var o = a.default.playbackRoom();
if (o) {
var n = s.default.gameRecordList.get(o).getDetailsData(), r = i.default.curStep() + e, l = n.playbackCode(r);
c.default.getRecordPlayback(l, function(e, o) {
var n = 0;
if (o) u.default.uiHelper.showTipNetError(); else if (0 === e.error) {
t._speedMul = -3;
t._bPlaying = !0;
t._setCurStep(0);
u.default.eventUtils.emit(d.default.playback_data_remain);
i.default.gameInfoDDZ.m_iLaiziValue = 0;
a.default.begin();
t._xx();
n = 1;
} else u.default.uiHelper.showTip(e.what);
t.scheduleOnce(function() {
t._changeBackReady = !0;
}, n);
});
}
}
};
r([ h(cc.Node) ], t.prototype, "btnRoot", void 0);
r([ h(cc.Label) ], t.prototype, "codeLabel", void 0);
r([ h(cc.Node) ], t.prototype, "btnPrev", void 0);
r([ h(cc.Node) ], t.prototype, "btnNext", void 0);
r([ h(cc.Node) ], t.prototype, "btnPlay", void 0);
r([ h(cc.Node) ], t.prototype, "btnStop", void 0);
r([ h(cc.Label) ], t.prototype, "mulAdd", void 0);
r([ h(cc.Label) ], t.prototype, "mulSub", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
