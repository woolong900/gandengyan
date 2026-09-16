// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6ae5cMiGRhOqoFeuyoQ++M/", "ClubPopupBase");
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
var i = require("./BaseComponent"), a = require("./ClubPopupConfig"), s = require("./ClubMenuItem"), l = require("./gContext"), c = require("./EventKeys"), u = require("./EventUtils"), d = require("./InnerBase"), p = require("./SoundUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._chooseIndex = 0;
t._popupType = 0;
t._contentW = 0;
t._searchStr = "";
t.popupConfig = null;
t.bgNode = null;
t.searchRoot = null;
t.searchEditBox = null;
t.titleLabel = null;
t.contentRoot = null;
t.menuContent = null;
t.menuItemPre = null;
t._antiSwitch = null;
return t;
}
t.prototype.onLoad = function() {
this.bgNode.width = cc.winSize.width;
this.bgNode.height = cc.winSize.height;
this._contentW = cc.winSize.width - 6 - 274;
};
t.prototype.setData = function(e, t) {
this._popupType = e;
this._antiSwitch = t;
var o = this.popupConfig.getData(e, t);
this.titleLabel.string = o.title;
this.searchRoot.active = o.search;
for (var n = o.list, r = 0, i = n.length; r < i; r++) {
var a = n[r], l = cc.instantiate(this.menuItemPre);
l.getComponent(s.default).setData(r, a.menu, r === this._chooseIndex);
this.menuContent.addChild(l);
}
};
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(c.default.ui_club_common_menu_clicked, function(t, o) {
if (e._chooseIndex !== o) {
e._chooseIndex = o;
e._uiDirty = !0;
e._cleanSearch();
}
}, this, u.eOffType.OnDestroy);
this._cleanSearch();
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.contentRoot.destroyAllChildren();
var e = this.popupConfig.getData(this._popupType, this._antiSwitch).list[this._chooseIndex];
if (e.pre) {
var t = cc.instantiate(e.pre);
t.getComponent(d.default).setWidth(this._contentW);
this.contentRoot.addChild(t);
e.addComponent && (t.getComponent(e.addComponent) ? cc.error("component have added:" + e.addComponent) : t.addComponent(e.addComponent));
}
};
t.prototype._cleanSearch = function() {
if (this.searchRoot.active) {
this.searchEditBox.string = "";
this._searchStr = "";
2 === this._chooseIndex ? this.searchEditBox.node.getChildByName("PLACEHOLDER_LABEL").getComponent(cc.Label).string = "用户ID（精确搜索）" : this._popupType === a.eClubPopupType.Record ? this.searchEditBox.node.getChildByName("PLACEHOLDER_LABEL").getComponent(cc.Label).string = "用户ID/备注" : this.searchEditBox.node.getChildByName("PLACEHOLDER_LABEL").getComponent(cc.Label).string = "昵称/ID/备注";
}
};
t.prototype.onClickSearch = function() {
p.default.clickBtn();
var e = this.searchEditBox.string || "";
e = e.trim();
this._searchStr = e;
l.default.eventUtils.emit(c.default.todo_club_list_search, e);
};
r([ m(a.default) ], t.prototype, "popupConfig", void 0);
r([ m(cc.Node) ], t.prototype, "bgNode", void 0);
r([ m(cc.Node) ], t.prototype, "searchRoot", void 0);
r([ m(cc.EditBox) ], t.prototype, "searchEditBox", void 0);
r([ m(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ m(cc.Node) ], t.prototype, "contentRoot", void 0);
r([ m(cc.Node) ], t.prototype, "menuContent", void 0);
r([ m(cc.Prefab) ], t.prototype, "menuItemPre", void 0);
return t = r([ h ], t);
}(i.default);
o.default = y;
cc._RF.pop();
