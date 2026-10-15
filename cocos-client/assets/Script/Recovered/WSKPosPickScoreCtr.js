// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "76e9ejDwcxM9q2h92oixTsb", "WSKPosPickScoreCtr");
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
var i = require("./RoomInfoData"), a = require("./EventUtils"), s = require("./gContext"), l = require("./WSKEnum"), c = require("./WSKEventKeys"), u = require("./WSKPosCtr"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._initPos = null;
t.posCtr = null;
t.rootNode = null;
t.scoreLabel = null;
t.iconNode = null;
t.actionScoreLabel = null;
return t;
}
t.prototype.onLoad = function() {
var e = this.actionScoreLabel.node.position;
this._initPos = cc.v2(e.x, e.y);
};
t.prototype.start = function() {
var e = this;
s.default.eventUtils.on(c.default.data_status_change, function() {
e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
s.default.eventUtils.on(c.default.data_pick_score_change, function(t, o) {
var n = o.pos, r = o.action;
if (n === e.posCtr.deskPos()) if (r) {
e.actionScoreLabel.node.position = e._initPos;
var i = e.iconNode.convertToWorldSpaceAR(cc.v2(0, 0)), a = e.actionScoreLabel.node.parent.convertToNodeSpaceAR(i);
e.actionScoreLabel.string = "" + o.dt;
var s = cc.moveTo(.5, cc.v2(a.x, a.y)).easing(cc.easeOut(2)), l = cc.callFunc(function() {
e.actionScoreLabel.string = "";
e.iconNode.scale = .6;
var t = cc.scaleTo(.4, 1).easing(cc.easeSineIn()).easing(cc.easeBackOut());
e.iconNode.runAction(t);
e._uiDirty = !0;
});
e.actionScoreLabel.node.runAction(cc.sequence(s, l));
} else e._uiDirty = !0;
}, this, a.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
this.rootNode.active = !1;
if (i.default.gameInfoWSK.status !== l.eWSKGameStatus.Free && i.default.gameInfoWSK.status !== l.eWSKGameStatus.Calling && !i.default.gameInfoWSK.is1V3()) {
var e = this.posCtr.deskPos(), t = i.default.gameInfoWSK.siteInfos.get(e);
if (t) {
this.rootNode.active = !0;
this.scoreLabel.string = "" + t.pickScore;
}
}
};
r([ f(u.default) ], t.prototype, "posCtr", void 0);
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ f(cc.Node) ], t.prototype, "iconNode", void 0);
r([ f(cc.Label) ], t.prototype, "actionScoreLabel", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
