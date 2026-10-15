// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e610fhhTtxGAqloJXx5REPs", "CheckType");
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
var i = require("./CheckCell"), a = require("./gContext"), s = require("./EventKeys"), l = require("./EventUtils"), c = require("./CheckCellStyle1"), u = require("./CreateRoomAssist"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._gameId = 0;
t._ids = [];
t._pos = [];
t.titleLabel = null;
t.layer = null;
t.cellPre = null;
t.cellStyle1Pre = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(s.default.ui_create_room_item_clicked, function() {
e._updatePos();
}, this, l.eOffType.OnDestroy);
};
t.prototype._makeXiAmountCell = function(t, o) {
var config = u.default.get(this._gameId), row = new cc.Node("XiAmount");
row.setContentSize(o - 12, 38);
row.anchorX = 0;
var captionSource = cc.instantiate(this.cellPre), caption = captionSource.getChildByName("CloseNode").getChildByName("CloseDesc");
caption.removeFromParent(!1);
captionSource.destroy();
caption.parent = row;
caption.anchorX = 0;
caption.setContentSize(126, 38);
caption.setPosition(0, 0);
var captionLabel = caption.getComponent(cc.Label);
captionLabel.string = config.desc(t);
captionLabel.fontSize = 30;
captionLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
captionLabel.verticalAlign = cc.Label.VerticalAlign.CENTER;
var control = cc.instantiate(this.cellStyle1Pre);
control.parent = row;
control.setPosition(128, 0);
control.getComponent(c.default).setData(this._gameId, 9, t);
var sync = function() {
var enabled = config.isChecked(23);
control.opacity = enabled ? 255 : 130;
for (var buttons = [ "add_sub_add", "add_sub_sub" ], index = 0; index < buttons.length; index++) {
var button = control.getChildByName(buttons[index]).getComponent(cc.Button);
button && (button.interactable = enabled);
}
};
a.default.eventUtils.on(s.default.ui_create_room_item_clicked, sync, this, l.eOffType.OnDestroy);
sync();
return row;
};
t.prototype.setData = function(e, t, o) {
var n = this;
this._gameId = e;
var r = 990 * (cc.winSize.width / 1280);
this.node.width = r;
this.titleLabel.node.x = -r / 2 + 70;
var a = u.default.get(e), s = a.sortIds(t);
if (o) for (var l = s.length - 1; l >= 0; l--) {
a.isOnlyHall(s[l]) && s.splice(l, 1);
} else for (l = s.length - 1; l >= 0; l--) {
a.isOnlyClub(s[l]) && s.splice(l, 1);
}
for (l = s.length - 1; l >= 0; l--) {
a.isHide(s[l]) && s.splice(l, 1);
}
var d = s.length, p = a.lineCount(t), f = Math.ceil(d / p), h = 24 * (f - 1) + 38 * f;
this.titleLabel.string = a.typeName(t);
this.layer.height = h;
this.node.height = h + 12;
this._ids = s;
this.scheduleOnce(function() {
for (var o = n.layer.width, r = -o / 2, l = o / p, u = 0, d = s.length; u < d; u++) {
var f = s[u], h = r + u % p * l, m = 62 * Math.floor(u / p) + 19, y = a.cellStyle(f);
if (0 === y) {
var g = cc.instantiate(n.cellPre);
n.layer.addChild(g);
g.x = h;
g.y = -m;
g.getComponent(i.default).setData(e, t, f);
} else if (1 === y) {
g = cc.instantiate(n.cellStyle1Pre);
n.layer.addChild(g);
g.x = h;
g.y = -m;
g.getComponent(c.default).setData(e, t, f);
} else if (2 === y) {
g = n._makeXiAmountCell(f, l);
n.layer.addChild(g);
g.x = h;
g.y = -m;
}
n._pos.push(cc.v2(h, -m));
}
n._updatePos();
});
};
t.prototype._updatePos = function() {
for (var e = u.default.get(this._gameId), t = 0, o = 0, n = this._ids.length; o < n; o++) {
var r = this._ids[o];
if (e.isVisible(r)) {
var i = this._pos[t];
this.layer.children[o].position = i;
t++;
}
}
};
r([ f(cc.Label) ], t.prototype, "titleLabel", void 0);
r([ f(cc.Node) ], t.prototype, "layer", void 0);
r([ f(cc.Prefab) ], t.prototype, "cellPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "cellStyle1Pre", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
