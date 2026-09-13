// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "6bd026CekhOHbsv63QrVENs", "ClubTableItem");
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
var i = e("./Loader"), a = e("./ClubTablePlayer"), s = e("./ClubControl"), l = e("./gContext"), c = e("./WindowConfig"), u = e("./SoundUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._plays = [];
t._index = 0;
t._uiDirty = !0;
t.bg = null;
t.tableBg = null;
t.player2Node = null;
t.player3Node = null;
t.player4Node = null;
t.player5Node = null;
t.gameNameLabel = null;
t.voiceNode = null;
t.wfLabel = null;
t.battleRoot = null;
t.freeRoot = null;
t.playersRoot = null;
t.playerPre = null;
t.detailPre = null;
t.roundLabel = null;
t.jusLabel = null;
t.chairList = [];
t.commonBg = null;
t.autoGameFlag = null;
return t;
}
t.prototype.start = function() {};
t.prototype.setData = function(e) {
this._index = e;
this._uiDirty = !0;
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
var e = s.default.getCurClubData(), t = e.tableList().get(this._index), o = t.config();
this.gameNameLabel.string = o.gameName();
this.voiceNode.active = l.default.gameLogic(o.index).isRealTime(o);
this.wfLabel.string = l.default.gameLogic(o.index).scoreRuleDesc(o);
this.battleRoot.active = t.isGameing();
this.freeRoot.active = !t.isGameing();
this.roundLabel.string = t.curStep + "/" + o.gameCount();
this.jusLabel.string = o.gameCount() + "局";
var n = o.peopleCount();
i.default.setImg(t.bgImgPath(), this.commonBg);
var r = e.schemeList().get(t.schemeId);
if (r) {
var c = r.getColorData().path;
i.default.setImg(c, this.tableBg);
}
this.player2Node.active = 2 === n;
this.player3Node.active = 3 === n;
this.player4Node.active = 4 === n;
this.player5Node.active = 5 === n;
var u = null;
this._hideAllChair();
var d = [];
if (2 === n) {
u = this.player2Node.children;
d.push(0, 2);
} else if (3 === n) {
u = this.player3Node.children;
d.push(0, 3, 4);
} else if (4 === n) {
u = this.player4Node.children;
d.push(0, 1, 2, 4);
} else {
u = this.player5Node.children;
d.push(0, 1, 3, 2, 4);
}
for (var p = 0, f = d.length; p < f; p++) {
var h = d[p];
this.chairList[h].active = !0;
}
this._initAllPlayer();
for (p = 0; p < n; p++) {
var m = t.playerUids[p], y = this._plays[p];
if (m) {
y.active = !0;
y.position = u[p].position;
y.getComponent(a.default).setData(m);
this.chairList[d[p]].active = !1;
} else y.active = !1;
}
this.autoGameFlag.active = l.default.gameLogic(o.index).isAutoGameRoom(o);
};
t.prototype._initAllPlayer = function() {
if (0 === this._plays.length) for (var e = 0; e < 5; e++) {
var t = cc.instantiate(this.playerPre);
this.playersRoot.addChild(t);
this._plays.push(t);
t.active = !1;
} else for (e = 0; e < 5; e++) this._plays[e] && (this._plays[e].active = !1);
};
t.prototype._hideAllChair = function() {
for (var e = 0; e < this.chairList.length; e++) this.chairList[e].active = !1;
};
t.prototype.onClickDetail = function() {
u.default.clickBtn();
5 === s.default.getCurClubData().tableList().get(this._index).config().peopleCount() ? l.default.uiHelper.show(c.eWindowID.ClubTableDetailsLayer5, this._index) : l.default.uiHelper.show(c.eWindowID.ClubTableDetailsLayer4, this._index);
};
r([ f(cc.Sprite) ], t.prototype, "bg", void 0);
r([ f(cc.Node) ], t.prototype, "tableBg", void 0);
r([ f(cc.Node) ], t.prototype, "player2Node", void 0);
r([ f(cc.Node) ], t.prototype, "player3Node", void 0);
r([ f(cc.Node) ], t.prototype, "player4Node", void 0);
r([ f(cc.Node) ], t.prototype, "player5Node", void 0);
r([ f(cc.Label) ], t.prototype, "gameNameLabel", void 0);
r([ f(cc.Node) ], t.prototype, "voiceNode", void 0);
r([ f(cc.Label) ], t.prototype, "wfLabel", void 0);
r([ f(cc.Node) ], t.prototype, "battleRoot", void 0);
r([ f(cc.Node) ], t.prototype, "freeRoot", void 0);
r([ f(cc.Node) ], t.prototype, "playersRoot", void 0);
r([ f(cc.Prefab) ], t.prototype, "playerPre", void 0);
r([ f(cc.Prefab) ], t.prototype, "detailPre", void 0);
r([ f(cc.Label) ], t.prototype, "roundLabel", void 0);
r([ f(cc.Label) ], t.prototype, "jusLabel", void 0);
r([ f(cc.Node) ], t.prototype, "chairList", void 0);
r([ f(cc.Sprite) ], t.prototype, "commonBg", void 0);
r([ f(cc.Node) ], t.prototype, "autoGameFlag", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
