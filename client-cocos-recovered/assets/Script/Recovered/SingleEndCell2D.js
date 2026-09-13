// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "22eb7FSvtRO+pXmFQPOhQ8e", "SingleEndCell2D");
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
var i = e("./RoomInfoData"), a = e("./Image"), s = e("./StringUtils"), l = e("./UserData"), c = e("./OperateListData"), u = e("./GangShowCtr2D"), d = e("./CardShowCtr2D"), p = e("./CardUtils"), f = e("./CommonEnum"), h = e("./SingleEndCell2D_GameBase"), m = cc._decorator, y = m.ccclass, g = m.property, _ = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._index = 0;
t.myBgNode = null;
t.nameLabel = null;
t.idLabel = null;
t.headImg = null;
t.zhuangNode = null;
t.descLabel = null;
t.scoreLabel = null;
t.cardRoot = null;
t.huFlag = null;
t.ruleFlag = null;
t.cun = null;
t.ruleFlag_lbf = null;
t.ruleFlag_bf = null;
t.gangCard = null;
t.downCard = null;
return t;
}
t.prototype.setData = function(e) {
this._index = e;
this.cardRoot.destroyAllChildren();
this.node.getComponent(h.default) && this.node.removeComponent(h.default);
this.node.addComponent("SingleEndCell2D_Game" + i.default.config.index);
this.updateUI();
};
t.prototype.updateUI = function() {
this.ruleFlag_lbf.active = !1;
this.ruleFlag_bf.active = !1;
this.cun.active = !1;
var e = i.default.gameInfo.singleEndInfo.players[this._index], t = e.uid, o = i.default.players.getByUid(t);
this.nameLabel.string = s.default.clip(o.name);
this.idLabel.string = "" + o.uid;
this.headImg.url = o.headImg;
this.zhuangNode.active = o.deal;
this.scoreLabel.string = s.default.strScore(e.score);
e.score >= 0 ? this.scoreLabel.node.color = new cc.Color(223, 51, 28) : this.scoreLabel.node.color = new cc.Color(32, 150, 16);
l.default.uid === t && (this.myBgNode.active = !0);
for (var n = i.default.gameInfo.siteInfos.get(o.pos), r = n.operateList.collection(c.default.filterGangShows), a = 0; a < r.length; a++) {
var m = r[a], y = n.operateList.get(m), g = cc.instantiate(this.gangCard);
g.getComponent(u.default).setData(y, f.eDeskPos.Stand, !0, !1);
g.scale = .52;
g.width = 112.5;
g.y = -5;
this.cardRoot.addChild(g);
this.cardRoot.addChild(this.createSpace(20));
}
var _ = n.getSortedHandCards(), v = _.length;
for (a = 0; a < v; a++) {
var C = _[a];
(D = cc.instantiate(this.downCard)).getComponent(d.default).setData(p.eCardShowType.Hand, C);
D.scale = .52;
D.width = 46;
this.cardRoot.addChild(D);
}
var b = n.huCard();
if (b > 0) {
this.cardRoot.addChild(this.createSpace(40));
var D;
(D = cc.instantiate(this.downCard)).getComponent(d.default).setData(p.eCardShowType.Gang, b);
D.scale = .62;
this.cardRoot.addChild(D);
}
this.node.getComponent(h.default).updateUI(this._index);
};
t.prototype.createSpace = function(e) {
var t = new cc.Node();
t.width = e;
return t;
};
r([ g(cc.Node) ], t.prototype, "myBgNode", void 0);
r([ g(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ g(cc.Label) ], t.prototype, "idLabel", void 0);
r([ g(a.default) ], t.prototype, "headImg", void 0);
r([ g(cc.Node) ], t.prototype, "zhuangNode", void 0);
r([ g(cc.Label) ], t.prototype, "descLabel", void 0);
r([ g(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ g(cc.Node) ], t.prototype, "cardRoot", void 0);
r([ g(cc.Node) ], t.prototype, "huFlag", void 0);
r([ g(cc.Node) ], t.prototype, "ruleFlag", void 0);
r([ g(cc.Node) ], t.prototype, "cun", void 0);
r([ g(cc.Node) ], t.prototype, "ruleFlag_lbf", void 0);
r([ g(cc.Node) ], t.prototype, "ruleFlag_bf", void 0);
r([ g(cc.Prefab) ], t.prototype, "gangCard", void 0);
r([ g(cc.Prefab) ], t.prototype, "downCard", void 0);
return t = r([ y ], t);
}(cc.Component);
o.default = _;
cc._RF.pop();
