// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6575fT5U3tPg4jUbYAyxKmx", "WSKPosPlayerInfoCtr");
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
var i = e("./RoomInfoData"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./WindowConfig"), c = e("./StringUtils"), u = e("./gContext"), d = e("./Image"), p = e("./WSKPosCtr"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.posCtr = null;
t.rootNode = null;
t.offline = null;
t.headImage = null;
t.nameLabel = null;
t.readyNode = null;
t.scoreLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
u.default.eventUtils.on([ a.default.data_player_add, a.default.data_player_update, a.default.data_player_remove, a.default.data_game_score_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
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
this.rootNode.active = !0;
this.headImage.url = e.headImg;
this.offline.active = !e.isOnLine();
this.nameLabel.string = c.default.clip(e.name);
this.readyNode.active = e.isReady();
this.scoreLabel.string = e.scoreDesc();
} else this.rootNode.active = !1;
};
t.prototype.onClick = function() {
if (i.default.isPlayback() || i.default.isWatcher()) ; else {
var e = this._getPlayer();
e && u.default.uiHelper.show(l.eWindowID.GiftLayer, e.uid);
}
};
t.prototype._getPlayer = function() {
var e = this.posCtr.deskPos();
return i.default.players.getByPos(e);
};
r([ m(p.default) ], t.prototype, "posCtr", void 0);
r([ m(cc.Node) ], t.prototype, "rootNode", void 0);
r([ m(cc.Node) ], t.prototype, "offline", void 0);
r([ m(d.default) ], t.prototype, "headImage", void 0);
r([ m(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ m(cc.Node) ], t.prototype, "readyNode", void 0);
r([ m(cc.Label) ], t.prototype, "scoreLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
