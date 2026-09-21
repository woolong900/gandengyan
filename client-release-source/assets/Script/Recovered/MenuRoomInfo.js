// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "111f1MoGJlKXLd+D33qJQC+", "MenuRoomInfo");
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
var i = require("./CardShowCtr2D"), a = require("./RoomInfoData"), s = require("./GameInfoData"), l = require("./CardUtils"), c = require("./gContext"), u = require("./EventKeys"), d = require("./EventUtils"), p = require("./UserData"), f = require("./CommonEnum"), h = require("./GameControl"), m = require("./FanPiZiAnimateCtr"), y = require("./Loader"), g = cc._decorator, _ = g.ccclass, v = g.property, C = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.roomId = null;
t.gameCount = null;
t.mjCount = null;
t.piziRoot = null;
t.piziNode = null;
t.laiziNode = null;
t.piziCard = null;
t.laiziCard = null;
t.detailBg = null;
t.desc = null;
t.sz1 = null;
t.sz2 = null;
t.cun = null;
t.cun_label = null;
t.fanPiZiAnimationCtr = null;
t.playbackChangeRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.roomId.string = "" + a.default.roomId;
this.sz1.active = !1;
this.sz2.active = !1;
this.updateDetail();
this._showDetail();
this.updateGameCount();
this.updatePiZi();
c.default.eventUtils.on(u.default.data_game_status_change, function(t, o) {
e.updateGameCount();
e.updateMJCount();
e.updatePiZi();
}, this, d.eOffType.OnDestroy);
this.updateMJCount();
c.default.eventUtils.on(u.default.data_get_card, function() {
e.updateMJCount();
}, this, d.eOffType.OnDestroy);
if (a.default.isPlayback()) {
this.playbackChangeRoot.x = this.playbackChangeRoot.x - 80;
for (var t = this.playbackChangeRoot.children, o = t.length, n = 0; n < o; n++) t[n].x = t[n].x + 80;
t[o - 1].active = !1;
}
};
t.prototype.showPiZi = function() {
this.updatePiZi();
var e = a.default.gameInfo.pz > 0;
p.default.gameView === f.eGameView.View3D && e && this.fanPiZiAnimationCtr.play();
};
t.prototype.updateMJCount = function() {
this.mjCount.string = "" + a.default.gameInfo.siteInfos.paiDunRemain();
};
t.prototype.updateGameCount = function() {
var e = a.default.config.gameCount();
this.gameCount.string = a.default.gameInfo.curStep + "/" + e;
};
t.prototype.updatePiZi = function() {
if (a.default.gameInfo.status === s.eGameStatus.Free) this.piziRoot.active = !1; else {
this.piziRoot.active = !0;
if (c.default.gameLogic().isSupportPiZi()) {
var e = a.default.gameInfo.pz;
this.piziNode.active = !0;
if (a.default.config.index === f.eGameIds.TMHH || a.default.config.index === f.eGameIds.QJHH || a.default.config.index === f.eGameIds.QJHZ) {
var t = this.piziNode.getChildByName("pizi"), o = t.getComponent(cc.Label);
t.color = cc.color(56, 239, 255);
o.string = "朝";
}
this.piziCard.setData(l.eCardShowType.Hand, e);
} else this.piziNode.active = !1;
var n = a.default.gameInfo.lz;
if (n > 0) {
this.laiziNode.active = !0;
this.laiziCard.setData(l.eCardShowType.Hand, n);
} else this.laiziNode.active = !1;
if (h.default.getInstance().isPlayingBeginAnimation) {
this.piziCard.node.active = !1;
this.laiziCard.node.active = !1;
} else {
this.piziCard.node.active = !0;
this.laiziCard.node.active = !0;
}
this.sz1.active = !1;
this.sz2.active = !1;
if (a.default.config.index === f.eGameIds.MCHZ) {
if (a.default.config.isChecked(19) && 0 != a.default.gameInfo.dice1 && 0 != a.default.gameInfo.dice2) {
this.sz1.active = !0;
this.sz2.active = !0;
y.default.setImg("Hall/Res/Texture/Common/sz_" + a.default.gameInfo.dice1, this.sz1);
y.default.setImg("Hall/Res/Texture/Common/sz_" + a.default.gameInfo.dice2, this.sz2);
}
if (a.default.isPlayback()) if (a.default.gameInfo.cun_num > 0 && a.default.config.isChecked(21)) {
this.cun.active = !0;
this.cun_label.string = "存" + (a.default.gameInfo.cun_num - 1);
} else this.cun.active = !1;
}
}
};
t.prototype.updateDetail = function() {
var e = this, t = c.default.gameLogic().roomDetails(a.default.config);
this.desc.string = t;
this.scheduleOnce(function() {
var t = e.desc.node.width + 20;
e.detailBg.height = e.desc.node.height + 10;
e.detailBg.width = t;
});
};
t.prototype.onClickDetail = function() {
this.detailBg.active ? this.detailBg.active = !1 : this._showDetail();
};
t.prototype._showDetail = function() {
var e = this;
this.detailBg.active = !0;
this.detailBg.opacity = 255;
var t = cc.delayTime(3), o = cc.fadeOut(.3), n = cc.callFunc(function() {
e.detailBg.active = !1;
});
this.detailBg.stopAllActions();
this.detailBg.runAction(cc.sequence(t, o, n));
};
r([ v(cc.Label) ], t.prototype, "roomId", void 0);
r([ v(cc.Label) ], t.prototype, "gameCount", void 0);
r([ v(cc.Label) ], t.prototype, "mjCount", void 0);
r([ v(cc.Node) ], t.prototype, "piziRoot", void 0);
r([ v(cc.Node) ], t.prototype, "piziNode", void 0);
r([ v(cc.Node) ], t.prototype, "laiziNode", void 0);
r([ v(i.default) ], t.prototype, "piziCard", void 0);
r([ v(i.default) ], t.prototype, "laiziCard", void 0);
r([ v(cc.Node) ], t.prototype, "detailBg", void 0);
r([ v(cc.Label) ], t.prototype, "desc", void 0);
r([ v(cc.Node) ], t.prototype, "sz1", void 0);
r([ v(cc.Node) ], t.prototype, "sz2", void 0);
r([ v(cc.Node) ], t.prototype, "cun", void 0);
r([ v(cc.Label) ], t.prototype, "cun_label", void 0);
r([ v(m.default) ], t.prototype, "fanPiZiAnimationCtr", void 0);
r([ v(cc.Node) ], t.prototype, "playbackChangeRoot", void 0);
return t = r([ _ ], t);
}(cc.Component);
o.default = C;
cc._RF.pop();
