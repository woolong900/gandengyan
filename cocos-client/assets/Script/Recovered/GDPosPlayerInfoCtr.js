// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a27a7KmgydIfby8gJy+M9hj", "GDPosPlayerInfoCtr");
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
var i = require("./Image"), a = require("./gContext"), s = require("./EventKeys"), l = require("./EventUtils"), c = require("./StringUtils"), u = require("./RoomInfoData"), d = require("./WindowConfig"), p = require("./GDPosCtr"), f = require("./GDEventKeys"), h = cc._decorator, m = h.ccclass, g = h.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.playerrootNode = null;
t.rootNode = null;
t.offline = null;
t.headImage = null;
t.nameLabel = null;
t.readyNode = null;
t.dizhu = null;
t.jiabei = null;
t.scoreLabel = null;
t.playerNode = null;
t.duishou = null;
t.headkuang = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on([ s.default.data_player_add, s.default.data_player_update, s.default.data_player_remove, s.default.data_game_score_change ], function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on(f.default.ui_double_update, function() {
e.doubleUpdate();
}, this, l.eOffType.OnDestroy);
this._updateUI();
a.default.gameLogic(u.default.config.index).isErRen(u.default.config) && 0 != this.posCtr.uiPos && (this.headkuang.spriteFrame = this.duishou);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this._getPlayer();
if (e) {
this.doubleUpdate();
u.default.gameInfoGD.b_isPlayDZ_Anim || (this.dizhu.active = e.deal);
this.rootNode.active = !0;
this.headImage.url = e.headImg;
this.offline.active = !e.isOnLine();
this.nameLabel.string = c.default.clip(e.name);
this.readyNode.active = e.isReady();
this.scoreLabel.string = e.scoreDesc();
} else this.rootNode.active = !1;
};
t.prototype.doubleUpdate = function() {
2 == this._getPlayer().isDouble ? this.jiabei.active = !0 : this.jiabei.active = !1;
};
t.prototype.onClick = function() {
if (u.default.isPlayback() || u.default.isWatcher()) ; else {
var e = this._getPlayer();
e && a.default.uiHelper.show(d.eWindowID.GiftLayer, e.uid);
}
};
t.prototype._getPlayer = function() {
var e = this.posCtr.deskPos();
return u.default.players.getByPos(e);
};
r([ g(p.default) ], t.prototype, "posCtr", void 0);
r([ g(cc.Node) ], t.prototype, "playerrootNode", void 0);
r([ g(cc.Node) ], t.prototype, "rootNode", void 0);
r([ g(cc.Node) ], t.prototype, "offline", void 0);
r([ g(i.default) ], t.prototype, "headImage", void 0);
r([ g(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ g(cc.Node) ], t.prototype, "readyNode", void 0);
r([ g(cc.Node) ], t.prototype, "dizhu", void 0);
r([ g(cc.Node) ], t.prototype, "jiabei", void 0);
r([ g(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ g(cc.Node) ], t.prototype, "playerNode", void 0);
r([ g(cc.SpriteFrame) ], t.prototype, "duishou", void 0);
r([ g(cc.Sprite) ], t.prototype, "headkuang", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
