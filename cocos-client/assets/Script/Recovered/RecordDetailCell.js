// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8e42aJ+RnVFQ5WY6uyIY16N", "RecordDetailCell");
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
var i = require("./SoundUtils"), a = require("./UserData"), s = require("./ColorUtils"), l = require("./ExUtils"), c = require("./gContext"), u = require("./CenterMsg"), d = require("./PlaybackData"), p = require("./RoomInfoData"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._recordId = "";
t._index = 0;
t.scroeRoot = null;
t.count = null;
t.idLabel = null;
return t;
}
t.prototype.setData = function(e, t) {
this._recordId = e;
this._index = t;
var o = a.default.gameRecordList.get(e);
this.count.string = "第 " + (this._index + 1) + " 局";
this.idLabel.string = "(" + o.getDetailsData().playbackCode(this._index) + ")";
for (var n = 0, r = o.players.length; n < 5; n++) {
var i = o.players[n], l = this.scroeRoot.getChildByName("score_" + n).getComponent(cc.Label);
r > 4 && (this.scroeRoot.getChildByName("score_" + n).x -= 32 + 26 * n);
if (i) {
var c = o.getDetailsData().score(this._index, i.uid);
l.string = "" + c;
l.node.color = c > 0 ? s.default.C_Score_Win : s.default.C_Score_Lose;
} else l.string = "";
}
};
t.prototype.onClickPlayback = function() {
var e = this;
i.default.clickBtn();
if (p.default.isInRoom()) c.default.msgBox.customCheckGameRecord(); else {
var t = a.default.gameRecordList.get(this._recordId).getDetailsData().playbackCode(this._index);
u.default.getRecordPlayback(t, function(t, o) {
o ? c.default.uiHelper.showTipNetError() : 0 === t.error ? d.default.init(a.default.gameRecordList.belongClub, e._recordId) : c.default.uiHelper.showTip(t.what);
});
}
};
t.prototype.onClickCopy = function() {
i.default.clickBtn();
var e = a.default.gameRecordList.get(this._recordId).getDetailsData().playbackCode(this._index);
l.default.copyText("" + e);
c.default.uiHelper.showTip("复制成功～");
};
r([ m(cc.Node) ], t.prototype, "scroeRoot", void 0);
r([ m(cc.Label) ], t.prototype, "count", void 0);
r([ m(cc.Label) ], t.prototype, "idLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
