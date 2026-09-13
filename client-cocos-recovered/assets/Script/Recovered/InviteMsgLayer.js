// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e93c52pZX9PTa3RkF7iqKqh", "InviteMsgLayer");
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
var i = e("./BaseComponent"), a = e("./ClubInviteMsgListData"), s = e("./InviteMsgItem"), l = e("./gContext"), c = e("./EventKeys"), u = e("./EventUtils"), d = e("./ScrollContens"), p = e("./SoundUtils"), f = e("./WindowConfig"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.item = null;
t.scrollContent = null;
t.noDataRoot = null;
t.reportEnter = null;
return t;
}
t.prototype.onLoad = function() {
this.reportEnter.active = !1;
};
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on([ c.default.data_club_invite_msg_add, c.default.data_club_invite_msg_remove, c.default.data_club_invite_msg_update ], function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
this.initMsgData();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.initMsgData();
}
};
t.prototype.initMsgData = function() {
var e = this, t = a.default.collection();
t.length < 1 ? this.noDataRoot.active = !0 : this.noDataRoot.active = !1;
this.scrollContent.load({
count: t.length,
cellSize: new cc.Size(1055, 72),
viewSize: new cc.Size(1055, 477),
spacing: cc.v2(0, 2),
column: 1,
data_cb: function(o, n) {
n || (n = cc.instantiate(e.item));
n.getComponent(s.default).setData(parseInt(t[o]));
return n;
}
});
};
t.prototype.onClickReport = function() {
p.default.clickBtn();
cc.log("onClickReport ~");
l.default.uiHelper.showWithNode(f.eWindowID.ReportLayer, "Hall/Res/Prefab/Center/ReportLayer");
};
r([ y(cc.Prefab) ], t.prototype, "item", void 0);
r([ y(d.default) ], t.prototype, "scrollContent", void 0);
r([ y(cc.Node) ], t.prototype, "noDataRoot", void 0);
r([ y(cc.Node) ], t.prototype, "reportEnter", void 0);
return t = r([ m ], t);
}(i.default);
o.default = g;
cc._RF.pop();
