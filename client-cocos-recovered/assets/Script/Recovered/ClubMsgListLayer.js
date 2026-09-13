// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d6001bzpStE55JnBNhadUMd", "ClubMsgListLayer");
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
var i = e("./BaseComponent"), a = e("./ClubOpRecordListData"), s = e("./Loader"), l = e("./EventKeys"), c = e("./EventUtils"), u = e("./gContext"), d = e("./ClubMsg"), p = e("./ScrollContens"), f = e("./PageHandle"), h = e("./ClubControl"), m = e("./ClubMsgItems"), y = cc._decorator, g = y.ccclass, _ = y.property, v = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._contentWidth = 0;
t._curPage = 1;
t._totalCount = 0;
t._uiList = !1;
t._uiPageDirty = !1;
t._ids = [];
t.pageHandle = null;
t.pageNode = null;
t.listScrollContent = null;
t.innerBg = null;
t.msgItemPre = null;
t.noDataTips = null;
return t;
}
t.prototype.onLoad = function() {
this._contentWidth = this.innerBg.width;
};
t.prototype.start = function() {
var e = this;
u.default.eventUtils.on(l.default.ui_page_change, function(t, o) {
if (e._curPage !== o) {
e._curPage = o;
e._uiPageDirty = !0;
}
}, this, c.eOffType.OnDestroy);
this.scheduleOnce(function() {
e.getOpMsgList();
}, .1);
};
t.prototype.createPage = function() {
var e = this;
s.default.loadPre("Hall/Res/Prefab/Club/ClubCommon/PageHandle", function(t) {
var o = cc.instantiate(t);
e.pageHandle = o.getComponent(f.default);
e.pageNode.addChild(o);
});
};
t.prototype.getOpMsgList = function() {
var e = this;
d.default.clubOpRecordList(h.default.getCurClubData().id, function(t, o) {
o ? u.default.uiHelper.showTip("获取消息列表失败~") : 0 === t.res.error ? e._uiList = !0 : u.default.uiHelper.showTip(t.res.what || "获取消息列表失败~");
});
};
t.prototype._updatePageList = function() {
var e = this, t = 0, o = this._ids, n = o.length, r = this._curPage - 1;
n = 7;
(t = 7 * r) + 7 > this._totalCount && (n = this._totalCount - t);
this.listScrollContent.node.active = !0;
this.listScrollContent.load({
count: n,
cellSize: new cc.Size(this._contentWidth, 72),
viewSize: new cc.Size(this._contentWidth, 504),
column: 1,
spacing: cc.v2(0, -1),
data_cb: function(n, r) {
var i = (r = cc.instantiate(e.msgItemPre)).getComponent(m.default), s = n > 0 && n % 6 == 0, l = parseInt(o[t + n]), c = a.default.get(l);
i.setData(c, s);
return r;
}
});
};
t.prototype._updateMsgList = function() {
var e = a.default.collection(null, function(e, t) {
return e.weight - t.weight;
});
this._ids = e;
this._totalCount = e.length;
var t = Math.ceil(this._totalCount / 7);
t < 1 && (t = 1);
this.pageHandle.setData(t);
this.noDataTips.active = 0 === this._totalCount;
};
t.prototype.update = function() {
var e = this;
if (this._uiPageDirty) {
this._uiPageDirty = !1;
this._updatePageList();
} else if (this._uiList) {
this._uiList = !1;
this._updateMsgList();
this.scheduleOnce(function() {
e._updatePageList();
}, .1);
}
};
r([ _(f.default) ], t.prototype, "pageHandle", void 0);
r([ _(cc.Node) ], t.prototype, "pageNode", void 0);
r([ _(p.default) ], t.prototype, "listScrollContent", void 0);
r([ _(cc.Node) ], t.prototype, "innerBg", void 0);
r([ _(cc.Prefab) ], t.prototype, "msgItemPre", void 0);
r([ _(cc.Node) ], t.prototype, "noDataTips", void 0);
return t = r([ g ], t);
}(i.default);
o.default = v;
cc._RF.pop();
