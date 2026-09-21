// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "a93f9UItZlLD5xDUkHgLcmk", "WSKRoundScoreCardsCtr");
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
var i = require("./RoomInfoData"), a = require("./Loader"), s = require("./EventUtils"), l = require("./gContext"), c = require("./WSKEnum"), u = require("./WSKEventKeys"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.rootNode = null;
t.scoreLabel = null;
t.cardsRoot = null;
return t;
}
t.prototype.start = function() {
var e = this;
l.default.eventUtils.on(u.default.data_status_change, function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
l.default.eventUtils.on([ u.default.data_table_score_add, u.default.data_table_score_change ], function() {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
if (i.default.gameInfoWSK.status !== c.eWSKGameStatus.Free) {
this.rootNode.active = !0;
this.scoreLabel.string = "" + i.default.gameInfoWSK.tableScore;
for (var e = i.default.gameInfoWSK.tableScoreCards, t = 0, o = this.cardsRoot.childrenCount; t < o; t++) this.cardsRoot.children[t].active = !1;
for (t = 0, o = e.length; t < o; t++) {
var n = e[t], r = l.default.gameLogic().cardImgPath(n), s = this.cardsRoot.getChildByName("card_" + t);
s.active = !0;
a.default.setImg(r, s);
}
} else this.rootNode.active = !1;
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(cc.Label) ], t.prototype, "scoreLabel", void 0);
r([ f(cc.Node) ], t.prototype, "cardsRoot", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
