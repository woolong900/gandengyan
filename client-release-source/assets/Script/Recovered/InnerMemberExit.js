// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b589355IK1OyqUp/6vjGhnH", "InnerMemberExit");
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
var i = require("./InnerCommon"), a = require("./gContext"), s = require("./EventKeys"), l = require("./EventUtils"), c = require("./TrAdjust"), u = require("./QuitTr"), d = require("./ClubMsg"), p = require("./ClubListData"), f = require("./ClubQuitRecordListData"), h = cc._decorator, m = h.ccclass, y = (h.property,
function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curPage = 1;
t._totalCount = 0;
t._ids = [];
return t;
}
t.prototype.start = function() {
var e = this, t = this.node.getComponent(i.default);
t.adjustHead(t.quitTr, [ "成员信息", "所属", "退出原因", "退出时间" ]);
a.default.eventUtils.on(s.default.ui_page_change, function(t, o) {
e._curPage !== o && (e._curPage = o);
e._updateList();
}, this, l.eOffType.OnDestroy);
a.default.eventUtils.on(s.default.todo_club_list_search, function(t, o) {
e._setData(o);
e._updateList();
}, this, l.eOffType.OnDestroy);
t.setPage(-1, 0);
this._getQuitList();
this._setData(null);
this._updateList();
};
t.prototype._getQuitList = function() {
var e = this;
d.default.clubQuitList(p.default.focus, function(t, o) {
if (o) a.default.uiHelper.showTip("获取数据失败～"); else if (0 === t.res.error) {
if (e && e.node && e.node.isValid) {
e._setData(null);
e._updateList();
}
} else a.default.uiHelper.showTip(t.res.what);
});
};
t.prototype._setData = function(e) {
var t = null;
if (e) {
var o = e.trim();
o.length > 0 && (t = function(e) {
return "" + e.uid == o || e.nickname == o;
});
}
var n = f.default.collection(t, function(e, t) {
return t.time - e.time;
});
this._totalCount = n.length;
this._ids = n;
this.node.getComponent(i.default).showNoDataTipNode(0 === n.length);
};
t.prototype._updateList = function() {
var e = this, t = 0, o = this._totalCount, n = this.node.getComponent(i.default);
n.scrollContent.load({
count: o,
cellSize: new cc.Size(n.innerW(), 87),
viewSize: new cc.Size(n.innerW(), 500),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(o, r) {
r || (r = cc.instantiate(n.quitTr));
r.getComponent(c.default).adjustWidth(n.innerW());
var i = parseInt(e._ids[t + o]);
r.getComponent(u.default).setData(i);
return r;
}
});
};
return t = r([ m ], t);
}(cc.Component));
o.default = y;
cc._RF.pop();
