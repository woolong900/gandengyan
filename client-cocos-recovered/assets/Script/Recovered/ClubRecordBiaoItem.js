// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "602eapL9BlMMZJBi8Gf/Mqv", "ClubRecordBiaoItem");
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
var i = e("./Image"), a = e("./gContext"), s = e("./SoundUtils"), l = e("./StringUtils"), c = e("./WindowConfig"), u = e("./ClubControl"), d = e("./ClubMsg"), p = e("./EventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._timeStr = 0;
t._userId = 0;
t._data = null;
t.headIm = null;
t.nameLabel = null;
t.idLabel = null;
t.winLabel = null;
t.scoreLabel = null;
t.jushuLabel = null;
return t;
}
t.prototype.setData = function(e) {
this._data = e;
this._userId = e.userId;
this.nameLabel.string = l.default.clip(e.nickname);
this.idLabel.string = e.code + "";
this.winLabel.string = e.winner + "";
this.scoreLabel.string = e.fatigueNum / 100 + "";
this.jushuLabel.string = e.number + "";
this.headIm.url = e.avatarUrl;
};
t.prototype.start = function() {};
t.prototype.onClickClear = function() {
var e = this;
s.default.clickBtn();
a.default.uiHelper.show(c.eWindowID.MsgBoxLayer, "<color=#5D461A>是否要清零，该玩家战绩将被清零？</c>", "战绩清零", function() {
var t = {
clubId: u.default.getCurClubData().id,
userId: e._userId,
status: 2
};
d.default.memberReleaseProhibited(t, function(e, t) {
0 === e.error ? a.default.eventUtils.emit(p.default.todo_club_list_search) : a.default.uiHelper.showTip(e.what);
});
});
};
r([ m(i.default) ], t.prototype, "headIm", void 0);
r([ m(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ m(cc.Label) ], t.prototype, "idLabel", void 0);
r([ m(cc.Label) ], t.prototype, "winLabel", void 0);
r([ m(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ m(cc.Label) ], t.prototype, "jushuLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
