// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "ce6ceayRQ1HFahtpaFyjUly", "InvitePlayerItem");
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
var i = e("./Image"), a = e("./Constants"), s = e("./StringUtils"), l = e("./SoundUtils"), c = e("./ClubMsg"), u = e("./gContext"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._isCheck = !0;
t._data = null;
t.checkNode = null;
t.checkNodeGray = null;
t.checkFlag = null;
t.headImg = null;
t.nameLabel = null;
t.inviteBtn = null;
t.haveInviteBtn = null;
t.offlineInviteBtn = null;
return t;
}
t.prototype.setData = function(e, t) {
this._data = e;
this._isCheck = t;
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.getData = function() {
return this._data;
};
t.prototype.setCheck = function(e) {
if (this.node.active) {
var t = this._data.invited || !1;
this._isCheck = !t && e;
this.checkFlag.active = this._isCheck;
}
};
t.prototype.getCheck = function() {
return !!this.node.active && (!(this._data.invited || !1) && this._isCheck);
};
t.prototype._updateUI = function() {
var e = this._data.invited || !1;
e && (this._isCheck = !1);
this.checkFlag.active = this._isCheck;
if (e) {
this.checkNodeGray.active = !0;
this.checkNode.active = !1;
this.inviteBtn.active = !1;
this.haveInviteBtn.active = !0;
} else {
this.checkNodeGray.active = !1;
this.checkNode.active = !0;
this.inviteBtn.active = !0;
this.haveInviteBtn.active = !1;
}
this.headImg.url = this._data.avatarUrl || a.default.defHeadUrl;
this.nameLabel.string = s.default.clip(this._data.name || "", 6);
this.haveInviteBtn.active = e;
this.offlineInviteBtn.active = !1;
};
t.prototype.onClickInvite = function() {
var e = this;
l.default.clickBtn();
c.default.sendInvite([ this._data.id ], function(t, o) {
if (o) ; else if (0 === t.res.error) {
u.default.uiHelper.showTip("邀请发送成功~");
e.setInvited(!0);
}
});
};
t.prototype.setInvited = function(e) {
this._data.invited = !0;
this._uiDirty = !0;
};
t.prototype.onClickCheck = function() {
l.default.clickBtn();
this.setCheck(!this._isCheck);
};
r([ f(cc.Node) ], t.prototype, "checkNode", void 0);
r([ f(cc.Node) ], t.prototype, "checkNodeGray", void 0);
r([ f(cc.Node) ], t.prototype, "checkFlag", void 0);
r([ f(i.default) ], t.prototype, "headImg", void 0);
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(cc.Node) ], t.prototype, "inviteBtn", void 0);
r([ f(cc.Node) ], t.prototype, "haveInviteBtn", void 0);
r([ f(cc.Node) ], t.prototype, "offlineInviteBtn", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
