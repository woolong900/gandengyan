// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a1665JSqIFPq4sEQ2bAX1Yf", "ApplyBeginGameBtnCtr");
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
var i = e("./RoomConfigCellData"), a = e("./RoomInfoData"), s = e("./UserData"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./SoundUtils"), d = e("./gContext"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._supportList = [];
t._uiDirty = !1;
t.peopleNodes = [];
t.btnGray = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (d.default.gameLogic().isQuickBegin(a.default.config)) {
var t = a.default.config.peopleCount(), o = a.default.config.sortIds(i.eRoomConfigTypes.peopleCount);
if (a.default.belongClub > 0) for (var n = o.length - 1; n >= 0; n--) {
a.default.config.isOnlyHall(o[n]) && o.splice(n, 1);
} else for (n = o.length - 1; n >= 0; n--) {
a.default.config.isOnlyClub(o[n]) && o.splice(n, 1);
}
n = 0;
for (var r = o.length; n < r; n++) {
var s = o[n];
if (a.default.config.isVisible(s)) {
var u = a.default.config.getValue(s);
u < t && this._supportList.push(u);
}
}
}
this._updateUI();
d.default.eventUtils.on([ l.default.pulic_game_free2begin, l.default.data_player_add, l.default.data_player_remove, l.default.data_player_update ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.btnGray.active = !1;
for (var e = 0, t = this.peopleNodes.length; e < t; e++) {
var o = this.peopleNodes[e];
o && (o.active = !1);
}
if (d.default.gameLogic().isQuickBegin(a.default.config) && a.default.isGameFree() && a.default.players.getByUid(s.default.uid).isReady()) {
var n = a.default.players.collection(function(e) {
return !e.isWatcher();
}).length, r = this.peopleNodes[n - 1];
r && -1 !== this._supportList.indexOf(n) ? r.active = !0 : this.btnGray.active = !0;
}
};
t.prototype.onClick = function() {
u.default.clickBtn();
d.default.gameMsgBase().quickBegin(!0, null);
};
r([ h(cc.Node) ], t.prototype, "peopleNodes", void 0);
r([ h(cc.Node) ], t.prototype, "btnGray", void 0);
return t = r([ f ], t);
}(cc.Component);
o.default = m;
cc._RF.pop();
