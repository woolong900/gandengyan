// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "f26880lThxJRYRlYLH8L7th", "ApplyBeginLayer");
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
var i = e("./BaseComponent"), a = e("./ApplyBeginGameData"), s = e("./RoomInfoData"), l = e("./UserData"), c = e("./EventKeys"), u = e("./EventUtils"), d = e("./SoundUtils"), p = e("./gContext"), f = e("./Image"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t.playerNodes = [];
t.descLabel = null;
t.btnAgree = null;
t.btnDisagree = null;
return t;
}
t.prototype.start = function() {
var e = this;
p.default.eventUtils.on([ c.default.data_apply_begin_game_state_change, c.default.data_apply_begin_game_data_change, c.default.data_game_status_change ], function() {
e._uiDirty = !0;
}, this, u.eOffType.OnDestroy);
this._updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype.onClickReject = function() {
d.default.clickBtn();
p.default.gameMsgBase().quickBegin(!1, null);
};
t.prototype.onClickOk = function() {
d.default.clickBtn();
p.default.gameMsgBase().quickBegin(!0, null);
};
t.prototype._updateUI = function() {
if (!a.default.applying) return p.default.uiHelper.remove(this);
var e = s.default.players.collection(), t = e.length;
this.descLabel.string = "当前可开启【" + t + "人玩法】，是否同意开局？";
this.btnAgree.active = !0;
this.btnDisagree.active = !0;
this.playerNodes[0].active = !1;
this.playerNodes[1].active = !1;
this.playerNodes[2].active = !1;
for (var o = 0; o < t; o++) {
var n = parseInt(e[o]), r = l.default.uid === n, i = s.default.players.getByUid(n);
this.playerNodes[o].active = !0;
this.playerNodes[o].getChildByName("head").getComponent(f.default).url = i.headImg;
this.playerNodes[o].getChildByName("name").getComponent(cc.Label).string = i.name;
var c = this.playerNodes[o].getChildByName("desc").getComponent(cc.Label);
if (a.default.isAgree(n)) {
c.node.color = cc.color(31, 148, 0);
c.string = "同意";
if (r) {
this.btnAgree.active = !1;
this.btnDisagree.active = !1;
}
} else {
if (a.default.isDisagree(n)) {
p.default.uiHelper.remove(this);
return;
}
c.node.color = cc.color(230, 45, 20);
c.string = "等待选择";
}
}
};
r([ y(cc.Node) ], t.prototype, "playerNodes", void 0);
r([ y(cc.Label) ], t.prototype, "descLabel", void 0);
r([ y(cc.Node) ], t.prototype, "btnAgree", void 0);
r([ y(cc.Node) ], t.prototype, "btnDisagree", void 0);
return t = r([ m ], t);
}(i.default);
o.default = g;
cc._RF.pop();
