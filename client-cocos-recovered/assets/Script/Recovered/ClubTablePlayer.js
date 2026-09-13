// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "9be34CSRThH5IkWENNAj/oc", "ClubTablePlayer");
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
var i = e("./Image"), a = e("./ClubControl"), s = e("./gContext"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./StringUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uid = 0;
t._uiDirty = !1;
t.nameLabel = null;
t.avatar = null;
t.headframe = null;
t.offlineNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on([ l.default.data_club_member_add, l.default.data_club_member_remove ], function(t, o) {
o.o.uid == e._uid && (e._uiDirty = !0);
}, this, c.eOffType.OnDestroy);
s.default.eventUtils.on([ l.default.data_club_focus_change ], function() {
e._uiDirty = !0;
}, this, c.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.setData = function(e) {
this._uid = e;
this._updateUI();
};
t.prototype._updateUI = function() {
var e = a.default.getCurClubData();
if (e) {
var t = e.memberList().get(this._uid);
if (t) {
this.nameLabel.string = u.default.clip(t.nickname, 6);
this.avatar.node.active = !0;
this.avatar.url = t.avatarUrl;
this.headframe.active = !0;
this.offlineNode.active = !t.onLine;
} else {
this.nameLabel.string = "";
this.avatar.node.active = !1;
this.headframe.active = !1;
this.offlineNode.active = !1;
cc.warn("没有此玩家信息~");
}
}
};
r([ f(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ f(i.default) ], t.prototype, "avatar", void 0);
r([ f(cc.Node) ], t.prototype, "headframe", void 0);
r([ f(cc.Node) ], t.prototype, "offlineNode", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
