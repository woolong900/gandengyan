// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "2303cJitwhDpa+pUm/jcGjK", "InnerInviteMsg");
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
var i = e("./InnerCommon"), a = e("./gContext"), s = e("./EventKeys"), l = e("./ClubInviteMsgListData"), c = e("./TrAdjust"), u = e("./InviteMsgTr"), d = e("./EventUtils"), p = cc._decorator, f = p.ccclass, h = (p.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
return t;
}
t.prototype.start = function() {
var e = this, t = this.node.getComponent(i.default);
t.adjustHead(t.inviteMsgTr, [ "头像", "俱乐部", "邀请人", "消息", "操作" ]);
a.default.eventUtils.on([ s.default.data_club_invite_msg_add, s.default.data_club_invite_msg_remove, s.default.data_club_invite_msg_update ], function() {
e._uiDirty = !0;
}, this, d.eOffType.OnDestroy);
this._updateList();
t.setPage(-1, 0);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateList();
}
};
t.prototype._updateList = function() {
var e = l.default.collection(), t = this.node.getComponent(i.default);
t.scrollContent.load({
count: e.length,
cellSize: new cc.Size(t.innerW(), 87),
viewSize: new cc.Size(t.innerW(), 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(o, n) {
n || (n = cc.instantiate(t.inviteMsgTr));
n.getComponent(c.default).adjustWidth(t.innerW());
var r = parseInt(e[o]);
n.getComponent(u.default).setData(r);
return n;
}
});
};
return t = r([ f ], t);
}(cc.Component));
o.default = h;
cc._RF.pop();
