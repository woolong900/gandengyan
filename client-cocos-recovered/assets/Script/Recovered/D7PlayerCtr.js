// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ef076JYSWNFqKqAxwOq8vS4", "D7PlayerCtr");
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
var i = e("./Image"), a = e("./D7RoomUtils"), s = e("./RoomInfoData"), l = e("./gContext"), c = e("./EventKeys"), u = e("./EventUtils"), d = e("./WindowConfig"), p = e("./StringUtils"), f = e("./D7Enum"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._viewPos = -1;
t._uiDirty = !1;
t.uiPos = 0;
t.rootNode = null;
t.offline = null;
t.headImage = null;
t.nameLabel = null;
t.readyNode = null;
return t;
}
t.prototype.onLoad = function() {
this._viewPos = a.default.getInstance().uiPos2ViewPos(this.uiPos);
};
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on([ c.default.data_player_add, c.default.data_player_update, c.default.data_player_remove ], function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = this.getPlayer();
if (e) {
this.rootNode.active = !0;
this.headImage.url = e.headImg;
this.offline.active = !e.isOnLine();
this.nameLabel.string = p.default.clip(e.name);
this.readyNode.active = e.isReady();
s.default.isWatcher() && f.eD7GameStatus.Free != s.default.gameInfoD7.status && (this.readyNode.active = !1);
} else this.rootNode.active = !1;
};
t.prototype.onClick = function() {
if (s.default.isPlayback() || s.default.isWatcher()) ; else {
var e = this.getPlayer();
e && l.default.uiHelper.show(d.eWindowID.GiftLayer, e.uid);
}
};
t.prototype.getPlayer = function() {
if (this._viewPos < 0) return null;
var e = a.default.getInstance().viewPos2DeskPos(this._viewPos);
return s.default.players.getByPos(e);
};
r([ y(Number) ], t.prototype, "uiPos", void 0);
r([ y(cc.Node) ], t.prototype, "rootNode", void 0);
r([ y(cc.Node) ], t.prototype, "offline", void 0);
r([ y(i.default) ], t.prototype, "headImage", void 0);
r([ y(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ y(cc.Node) ], t.prototype, "readyNode", void 0);
return t = r([ m ], t);
}(cc.Component);
o.default = g;
cc._RF.pop();
