// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "5818fyZiuBPjoIYONlVxkW+", "InnerIsolateGroup");
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
var i = require("./gContext"), a = require("./EventUtils"), s = require("./EventKeys"), l = require("./SoundUtils"), c = require("./ClubMsg"), u = require("./ClubListData"), d = require("./InnerBase"), p = require("./ClubIsolateListData"), f = require("./GroupHeadTr"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.groupScorllView = null;
t.contentNode = null;
t.addGroupMember = null;
t.delGroupMember = null;
t.grouphead = null;
t.noDataTipNode = null;
t._contentWidth = 0;
t._ids = [];
return t;
}
t.prototype.onLoad = function() {
this.node.width = this.adjustW;
this._contentWidth = this.adjustW - 16;
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on([ s.default.data_club_isolategroup_update ], function() {
e._setData(null);
e.updateUi();
}, this, a.eOffType.OnDestroy);
i.default.eventUtils.on(s.default.todo_club_list_search, function(t, o) {
e._setData(o);
e.updateUi();
}, this, a.eOffType.OnDestroy);
c.default.getIsolateList(u.default.focus, function(e, t) {
t ? i.default.uiHelper.showTip("获取数据失败～") : 0 === e.res.error || i.default.uiHelper.showTip(e.res.what);
}, !0);
};
t.prototype._setData = function(e) {
this._ids = [];
var t = p.default.collection();
if (e) {
var o = e.trim();
if (o.length > 0) for (var n = 0; n < t.length; n++) {
var r = p.default.get(t[n]);
for (var i in r.isolateMembers) if (r.isolateMembers.hasOwnProperty(i)) {
var a = r.isolateMembers[i];
if ("" + a.code == o || a.nickname == o) {
this._ids.push(t[n]);
break;
}
}
}
} else this._ids = t;
this.noDataTipNode.active = 0 === this._ids.length;
};
t.prototype.updateUi = function() {
var e = this._ids;
this.contentNode.destroyAllChildren();
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t], r = cc.instantiate(this.grouphead);
this.contentNode.addChild(r);
r.getComponent(f.default).setData(parseInt(n), this._contentWidth, t + 1);
}
};
t.prototype.onCreateGroupClick = function() {
l.default.clickBtn();
c.default.addIsolateGroup(u.default.focus, function(e, t) {
if (t) i.default.uiHelper.showTip("获取数据失败～"); else if (0 === e.res.error) {
i.default.uiHelper.showTip("创建隔离组成功!");
c.default.getIsolateList(u.default.focus, function(e, t) {
t && i.default.uiHelper.showTip("获取数据失败～");
}, !0);
} else i.default.uiHelper.showTip(e.res.what);
});
};
r([ y(cc.ScrollView) ], t.prototype, "groupScorllView", void 0);
r([ y(cc.Node) ], t.prototype, "contentNode", void 0);
r([ y(cc.Prefab) ], t.prototype, "addGroupMember", void 0);
r([ y(cc.Prefab) ], t.prototype, "delGroupMember", void 0);
r([ y(cc.Prefab) ], t.prototype, "grouphead", void 0);
r([ y(cc.Node) ], t.prototype, "noDataTipNode", void 0);
return t = r([ m ], t);
}(d.default);
o.default = g;
cc._RF.pop();
