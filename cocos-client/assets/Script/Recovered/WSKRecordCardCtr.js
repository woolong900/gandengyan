// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "78922wwGlJIaIzNGX/caqEk", "WSKRecordCardCtr");
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
var i = require("./RoomInfoData"), a = require("./EventUtils"), s = require("./GameLogicWSK"), l = require("./CommonUtils"), c = require("./SoundUtils"), u = require("./gContext"), d = require("./WSKEnum"), p = require("./WSKEventKeys"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._rankValues = [ 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3 ];
t._rankNames = [ "大", "小", "2", "A", "K", "Q", "J", "十", "9", "8", "7", "6", "5", "4", "3" ];
t._suitValues = [ 4, 3, 2, 1 ];
t._countLabels = [];
t._suitCountLabels = [];
t._topNode = null;
t._contentNode = null;
t._panelGraphics = null;
t.btnNode = null;
t.detailsNode = null;
t.scoreLabel = null;
t.countDW = null;
t.countXW = null;
t.count2 = null;
t.countA = null;
t.count5_Hei = null;
t.count10_Hei = null;
t.countK_Hei = null;
t.count5_Hong = null;
t.count10_Hong = null;
t.countK_Hong = null;
t.count5_Mei = null;
t.count10_Mei = null;
t.countK_Mei = null;
t.count5_Fang = null;
t.count10_Fang = null;
t.countK_Fang = null;
return t;
}
t.prototype.start = function() {
var e = this;
if (!i.default.isWatcher()) {
this._buildCounterUI();
this._syncAccess();
u.default.eventUtils.on(p.default.data_round_change, function(t, o) {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
u.default.eventUtils.on(p.default.data_status_change, function(t, o) {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
u.default.eventUtils.on("record_card_access_change", function() {
e._syncAccess();
}, this, a.eOffType.OnDestroy);
this._updateUI();
}
};
t.prototype._syncAccess = function() {
var e = u.default.gameLogic().isRecordCard(i.default.config) || !!i.default.recordCardWhitelisted;
this.btnNode.active = e;
e || (this.detailsNode.active = !1);
this._uiDirty = e;
};
t.prototype._panel = function(e, t, o, n, r, i, a) {
var s = new cc.Node(t);
s.parent = e;
s.setContentSize(o, n);
s.setPosition(r || 0, i || 0);
var l = s.addComponent(cc.Graphics);
l.fillColor = a;
l.fillRect(-o / 2, -n / 2, o, n);
l.fill();
return s;
};
t.prototype._label = function(e, t, o, n, r, i, a, s, l) {
var c = new cc.Node(t), u = c.addComponent(cc.Label);
c.parent = e;
c.setPosition(i || 0, a || 0);
c.setContentSize(s || 32, l || n + 4);
c.color = r;
u.string = o || "";
u.fontSize = n;
u.lineHeight = n + 2;
u.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
u.verticalAlign = cc.Label.VerticalAlign.CENTER;
u.overflow = cc.Label.Overflow.SHRINK;
return u;
};
t.prototype._drawPanelBackground = function(e, t) {
this.detailsNode.setContentSize(e, t);
this._panelGraphics.clear();
this._panelGraphics.fillColor = cc.color(34, 34, 34, 222);
this._panelGraphics.fillRect(-e / 2, -t / 2, e, t);
this._panelGraphics.fill();
};
t.prototype._buildCounterUI = function() {
var e = this.detailsNode.getComponent(cc.Sprite);
e && (e.enabled = !1);
this.detailsNode.removeAllChildren();
this.detailsNode.setPosition(-230, 126);
this.detailsNode.zIndex = 1;
this._panelGraphics = this.detailsNode.getComponent(cc.Graphics) || this.detailsNode.addComponent(cc.Graphics);
this._topNode = new cc.Node("TopCounts");
this._topNode.parent = this.detailsNode;
for (var t = 0; t < this._rankNames.length; t++) {
var o = this._panel(this._topNode, "Rank" + t, 32, 48, -231 + 33 * t, 0, cc.color(68, 68, 68, 190));
var n = this._label(o, "Name", this._rankNames[t], 16, cc.color(187, 187, 187), 0, 12, 28, 20);
n.node.color = cc.color(187, 187, 187);
var r = this._label(o, "Count", "0", 22, cc.color(255, 255, 255), 0, -11, 28, 24);
this._countLabels.push(r);
}
this._contentNode = new cc.Node("Details");
this._contentNode.parent = this.detailsNode;
var a = [ "♠", "♥", "♣", "♦" ], s = [ cc.color(204, 204, 204), cc.color(255, 102, 102), cc.color(102, 187, 102), cc.color(102, 153, 255) ];
for (var l = 0; l < 4; l++) {
var c = this._panel(this._contentNode, "Suit" + l, 494, 27, 0, 18 - 28 * l, cc.color(51, 51, 51, 110));
this._label(c, "Symbol", a[l], 20, s[l], -231, 0, 30, 25);
this._suitCountLabels[l] = [];
for (var u = 2; u < this._rankValues.length; u++) this._suitCountLabels[l][u] = this._label(c, "Count" + u, "0", 18, s[l], -231 + 33 * u, 0, 30, 25);
}
this._topNode.y = 56;
this._drawPanelBackground(515, 180);
this._styleButton();
};
t.prototype._styleButton = function() {
var e = this.btnNode.getComponent(cc.Sprite);
e && (e.enabled = !0);
this.btnNode.removeAllChildren();
this.btnNode.setContentSize(57, 57);
this.btnNode.zIndex = 2;
var t = this.btnNode.getComponent(cc.Graphics);
t && t.clear();
};
t.prototype._countColor = function(e) {
return 0 === e ? cc.color(85, 85, 85) : e <= 3 ? cc.color(255, 68, 68) : 4 === e ? cc.color(68, 255, 68) : cc.color(46, 125, 50);
};
t.prototype._updateUI = function() {
if (!this.detailsNode.active || !this._countLabels.length) return;
var e = i.default.gameInfoWSK.status === d.eWSKGameStatus.Gameing;
if (!e) {
for (var t = 0; t < this._countLabels.length; t++) {
this._countLabels[t].string = "?";
this._countLabels[t].node.color = cc.color(170, 170, 170);
}
for (var o = 0; o < 4; o++) for (var n = 2; n < this._rankValues.length; n++) {
this._suitCountLabels[o][n].string = "?";
this._suitCountLabels[o][n].node.color = cc.color(85, 85, 85);
}
return;
}
var r = i.default.gameInfoWSK.allPutCards, a = i.default.gameInfoWSK.siteInfos.get(i.default.myAbsolutePos()).handCards, c = u.default.gameLogic().allCards(i.default.config), p = l.default.removeArrayList(c, [].concat(a).concat(r)), f = [], h = [];
for (t = 0; t < this._rankValues.length; t++) {
f[t] = 0;
h[t] = [ 0, 0, 0, 0, 0 ];
}
for (t = 0; t < p.length; t++) {
var m = u.default.gameLogic().cardValue(p[t]), y = this._rankValues.indexOf(m), g = u.default.gameLogic().cardColor(p[t]);
if (y >= 0) {
f[y]++;
g >= 1 && g <= 4 && h[y][g]++;
}
}
var _ = [ cc.color(204, 204, 204), cc.color(255, 102, 102), cc.color(102, 187, 102), cc.color(102, 153, 255) ];
for (t = 0; t < this._rankValues.length; t++) {
this._countLabels[t].string = "" + f[t];
this._countLabels[t].node.color = this._countColor(f[t]);
}
for (o = 0; o < 4; o++) for (n = 2; n < this._rankValues.length; n++) {
var v = h[n][this._suitValues[o]], C = this._suitCountLabels[o][n];
C.string = "" + v;
C.node.color = v > 0 ? _[o] : cc.color(85, 85, 85);
}
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.onClick = function() {
c.default.clickBtn();
this.detailsNode.active = !this.detailsNode.active;
this._uiDirty = !0;
};
r([ m(cc.Node) ], t.prototype, "btnNode", void 0);
r([ m(cc.Node) ], t.prototype, "detailsNode", void 0);
r([ m(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ m(cc.Label) ], t.prototype, "countDW", void 0);
r([ m(cc.Label) ], t.prototype, "countXW", void 0);
r([ m(cc.Label) ], t.prototype, "count2", void 0);
r([ m(cc.Label) ], t.prototype, "countA", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Hei", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Hei", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Hei", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Hong", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Hong", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Hong", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Mei", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Mei", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Mei", void 0);
r([ m(cc.Label) ], t.prototype, "count5_Fang", void 0);
r([ m(cc.Label) ], t.prototype, "count10_Fang", void 0);
r([ m(cc.Label) ], t.prototype, "countK_Fang", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
