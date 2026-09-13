// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "fd4a0IyE+BOQJ4iL0hHOmWW", "InvitePlayerLayer");
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
var i = e("./ClubMsg"), a = e("./gContext"), s = e("./InvitePlayerItem"), l = e("./SoundUtils"), c = e("./BaseComponent"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._dataList = [];
t._curPage = 1;
t._totalPage = 1;
t._dataDirty = !1;
t.noData = null;
t.listRoot = null;
t.plageLabel = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.getInviteList(function(t, o) {
if (o) e._dataDirty = !0; else {
if (0 === t.res.error) {
e._dataList = t.data || [];
e._totalPage = Math.ceil(e._dataList.length / 8);
} else t.res.what && a.default.uiHelper.showTip(t.res.what);
e._dataDirty = !0;
}
});
};
t.prototype.update = function() {
if (this._dataDirty) {
this._dataDirty = !1;
this._initData();
}
};
t.prototype._initData = function() {
for (var e = 0; e < 8; e++) this.listRoot.children[e].active = !1;
if (this._dataList.length < 1) this.noData.active = !0; else {
this.noData.active = !1;
var t = 8 * (this._curPage - 1), o = Math.min(this._dataList.length - 1, 8 * this._curPage - 1) - t;
for (e = 0; e <= o; e++) {
var n = t + e, r = this._get(e);
r.node.active = !0;
r.setData(this._dataList[n], !0);
}
}
this._udpatePage();
};
t.prototype._udpatePage = function() {
this._dataList.length < 1 ? this.plageLabel.string = "0/0" : this.plageLabel.string = this._curPage + "/" + this._totalPage;
};
t.prototype.onClickPageLeft = function() {
l.default.clickBtn();
if (this._curPage <= 1) a.default.uiHelper.showTip("已经第一页了"); else {
this._curPage--;
this._dataDirty = !0;
}
};
t.prototype.onClickPageRight = function() {
l.default.clickBtn();
if (this._curPage >= this._totalPage) a.default.uiHelper.showTip("最后一页了"); else {
this._curPage++;
this._dataDirty = !0;
}
};
t.prototype.onClickSelectAll = function() {
l.default.clickBtn();
this._all(!0);
};
t.prototype.onClickUnselectAll = function() {
l.default.clickBtn();
this._all(!1);
};
t.prototype.onClickInvite = function() {
var e = this;
l.default.clickBtn();
var t = this._getCheckList();
if (this._dataList.length < 1) return a.default.uiHelper.showTip("暂无在线玩家~");
var o = t.length;
if (0 === o) return a.default.uiHelper.showTip("请选中您想邀请的玩家~");
for (var n = [], r = 0; r < o; r++) {
var s = t[r];
n.push(this._get(s).getData().id);
}
i.default.sendInvite(n, function(o, n) {
if (n) ; else if (0 === o.res.error) {
a.default.uiHelper.showTip("邀请发送成功~");
e && e.node && e.node.isValid && e._setInviteTrue(t);
} else {
var r = o.res.what || "邀请失败~";
a.default.uiHelper.showTip(r);
}
});
};
t.prototype._setInviteTrue = function(e) {
for (var t = 0, o = e.length; t < o; t++) {
var n = e[t];
this._get(n).setInvited(!0);
}
};
t.prototype._getCheckList = function() {
for (var e = [], t = 0; t < 8; t++) this._get(t).getCheck() && e.push(t);
return e;
};
t.prototype._all = function(e) {
for (var t = 0; t < 8; t++) this._get(t).setCheck(e);
};
t.prototype._get = function(e) {
return this.listRoot.children[e].getComponent(s.default);
};
r([ p(cc.Node) ], t.prototype, "noData", void 0);
r([ p(cc.Node) ], t.prototype, "listRoot", void 0);
r([ p(cc.Label) ], t.prototype, "plageLabel", void 0);
return t = r([ d ], t);
}(c.default);
o.default = f;
cc._RF.pop();
