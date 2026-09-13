// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "50653ECGChJwK9WKo4vzUzp", "BtnGame");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./EventUtils"), l = require("./RoomConfigListData"), c = require("./SoundUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._gameId = -1;
t._isChoose = !1;
t.choose = null;
t.notChoose = null;
t.chooseName = null;
t.notChooseName = null;
return t;
}
t.prototype.setData = function(e, t) {
this._gameId = e;
this._isChoose = t;
var o = l.default.get(this._gameId);
this.chooseName.string = o.gameName();
this.notChooseName.string = o.gameName();
this.updateUI();
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.ui_create_room_game_clicked, function(t, o) {
o === e._gameId ? e._isChoose = !0 : e._isChoose = !1;
e.updateUI();
}, this, s.eOffType.OnDestroy);
};
t.prototype.updateUI = function() {
if (this._isChoose) {
this.choose.active = !0;
this.notChoose.active = !1;
} else {
this.choose.active = !1;
this.notChoose.active = !0;
}
};
t.prototype.onClick = function() {
c.default.clickBtn();
this._isChoose || i.default.eventUtils.emit(a.default.ui_create_room_game_clicked, this._gameId);
};
r([ p(cc.Node) ], t.prototype, "choose", void 0);
r([ p(cc.Node) ], t.prototype, "notChoose", void 0);
r([ p(cc.Label) ], t.prototype, "chooseName", void 0);
r([ p(cc.Label) ], t.prototype, "notChooseName", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
