// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "7f64cl+LLBLEpnuETXH+Rvp", "ResultNode3D");
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
var i = require("./gContext"), a = require("./EventKeys"), s = require("./EventUtils"), l = require("./RoomInfoData"), c = require("./GameInfoData"), u = require("./StringUtils"), d = require("./ResultNode3D_GameBase"), p = require("./RoomUtils"), f = cc._decorator, h = f.ccclass, m = f.property, y = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._viewPos = -1;
t.rootNode = null;
t.bgNode = null;
t.addLabel = null;
t.subLabel = null;
t.descLabel = null;
return t;
}
t.prototype.init = function(e) {
this._viewPos = e;
};
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.data_game_status_change, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on(a.default.data_game_watch_pos_change, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
this.updateUI();
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
var e = l.default.gameInfo.status;
if (e === c.eGameStatus.TotalEnd || e === c.eGameStatus.SingleEnd) {
for (var t = null, o = null, n = l.default.gameInfo.singleEndInfo.players, r = 0; r < n.length; r++) {
var i = n[r], a = i.uid, s = l.default.players.getByUid(a);
if (p.default.getInstance().deskPos2ViewPos(s.pos) === this._viewPos) {
t = s;
o = i;
break;
}
}
if (t) {
this.rootNode.active = !0;
var f = u.default.strScore(o.score);
if (o.score >= 0) {
this.addLabel.string = f;
this.subLabel.string = "";
} else {
this.addLabel.string = "";
this.subLabel.string = f;
}
this.node.getComponent(d.default) && this.node.removeComponent(d.default);
this.node.addComponent("ResultNode3D_Game" + l.default.config.index).updateUI(t, o);
} else this._hide();
} else this._hide();
};
t.prototype._hide = function() {
this.rootNode.active = !1;
this.subLabel.string = "";
this.addLabel.string = "";
};
t.prototype.updateDesc = function(e) {
this.bgNode.height = 60 + 38 * e.length;
this.descLabel.string = this._desc(e);
};
t.prototype._desc = function(e) {
var t = e.length;
if (t > 0) {
var o = "";
o = o + "【" + e[0] + "】";
for (var n = 1; n < t; n++) {
o = o + "\n【" + e[n] + "】";
}
return o;
}
return "";
};
r([ m(cc.Node) ], t.prototype, "rootNode", void 0);
r([ m(cc.Node) ], t.prototype, "bgNode", void 0);
r([ m(cc.Label) ], t.prototype, "addLabel", void 0);
r([ m(cc.Label) ], t.prototype, "subLabel", void 0);
r([ m(cc.Label) ], t.prototype, "descLabel", void 0);
return t = r([ h ], t);
}(cc.Component);
o.default = y;
cc._RF.pop();
