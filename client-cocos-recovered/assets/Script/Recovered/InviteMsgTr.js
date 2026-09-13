// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8c647455dxJv5CEZaj7hUp7", "InviteMsgTr");
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
var i = e("./Image"), a = e("./ClubInviteMsgListData"), s = e("./ClubMsg"), l = e("./gContext"), c = e("./SoundUtils"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t.clubHead = null;
t.clubName = null;
t.inviteUserName = null;
t.msgLabel = null;
return t;
}
t.prototype.setData = function(e) {
this._index = e;
var t = a.default.get(e);
this.clubHead.url = t.clubAvatarUrl;
this.clubName.string = t.clubName;
this.inviteUserName.string = t.inviterName;
this.msgLabel.string = "邀请加入俱乐部";
};
t.prototype.start = function() {};
t.prototype.onClickAgree = function() {
c.default.clickBtn();
s.default.agreeInvite(this._index, function(e, t) {
t ? l.default.uiHelper.showTipNetError() : 0 !== e.error && l.default.uiHelper.showTip(e.what);
});
};
t.prototype.onClickDisagree = function() {
c.default.clickBtn();
s.default.disagreeInvite(this._index, function(e, t) {
t ? l.default.uiHelper.showTipNetError() : 0 !== e.error && l.default.uiHelper.showTip(e.what);
});
};
r([ p(i.default) ], t.prototype, "clubHead", void 0);
r([ p(cc.Label) ], t.prototype, "clubName", void 0);
r([ p(cc.Label) ], t.prototype, "inviteUserName", void 0);
r([ p(cc.Label) ], t.prototype, "msgLabel", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
