// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "96d0696T/lBWLVsFkjIdoYX", "WSKGroupScoreCtr");
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
var i = e("./CommonEnum"), a = e("./RoomInfoData"), s = e("./EventUtils"), l = e("./gContext"), c = e("./WSKEnum"), u = e("./WSKEventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.rootNode = null;
t.scoreLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (a.default.config.index === i.eGameIds.QJSHZ) {
l.default.eventUtils.on(u.default.data_status_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on(u.default.data_pick_score_change, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
} else {
this.rootNode.active = !1;
this.enabled = !1;
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
if (a.default.gameInfoWSK.status !== c.eWSKGameStatus.Free) {
this.rootNode.active = !0;
for (var e = a.default.players.collection(function(e) {
return !e.isWatcher();
}), t = 0, o = 0, n = 0, r = e.length; n < r; n++) {
var i = parseInt(e[n]), s = a.default.players.getByUid(i).pos, l = a.default.gameInfoWSK.siteInfos.get(s).pickScore;
i == a.default.gameInfoWSK.friendUid || i == a.default.gameInfoWSK.zhuangUid ? t += l : o += l;
}
var u = a.default.myAbsolutePos(), d = a.default.players.getByPos(u).uid;
d == a.default.gameInfoWSK.friendUid || d == a.default.gameInfoWSK.zhuangUid ? this.scoreLabel.string = t + " : " + o : this.scoreLabel.string = o + " : " + t;
} else this.rootNode.active = !1;
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(cc.Label) ], t.prototype, "scoreLabel", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
