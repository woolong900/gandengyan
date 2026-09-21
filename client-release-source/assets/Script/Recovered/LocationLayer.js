// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "8339dP+RI1Fa4f2YqQ3JwaB", "LocationLayer");
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
var i = require("./Loader"), a = require("./BaseComponent"), s = require("./RoomInfoData"), l = require("./LocationData"), c = require("./CommonEnum"), u = require("./Image"), d = require("./gContext"), p = require("./EventKeys"), f = require("./EventUtils"), h = cc._decorator, m = h.ccclass, y = h.property, g = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.fourNode = null;
t.threeNode = null;
t.twoNode = null;
return t;
}
t.prototype.start = function() {
var e = this, t = s.default.config.peopleCount();
this.fourNode.active = 4 === t;
this.threeNode.active = 3 === t;
this.twoNode.active = 2 === t;
d.default.eventUtils.on([ p.default.data_player_add, p.default.data_player_remove, p.default.data_player_update ], function() {
e._uiDirty = !0;
}, this, f.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
for (var e = s.default.config.peopleCount(), t = s.default.myAbsolutePos(), o = [], n = 0; n < 4; n++) {
var r = (t + n) % 4, i = s.default.players.getByPos(r);
o.push(i);
}
var a = null;
if (4 === e) {
a = this.fourNode;
this._updateHead(a, 0, t, o[0]);
this._updateHead(a, 1, (t + 1) % 4, o[1]);
this._updateHead(a, 2, (t + 2) % 4, o[2]);
this._updateHead(a, 3, (t + 3) % 4, o[3]);
for (n = 0; n < 3; n++) for (var l = n + 1; l < 4; l++) this._updateDistance(a, n, l, o[n], o[l]);
}
if (3 === e) {
a = this.threeNode;
this._updateHead(a, 0, t, o[0]);
if (o[3]) {
var c = o[2] ? 2 : 1;
this._updateHead(a, 1, (t + c) % 4, o[c]);
this._updateHead(a, 2, (t + 3) % 4, o[3]);
this._updateDistance(a, 0, 1, o[0], o[c]);
this._updateDistance(a, 0, 2, o[0], o[3]);
this._updateDistance(a, 1, 2, o[c], o[3]);
} else {
this._updateHead(a, 1, (t + 1) % 4, o[1]);
this._updateHead(a, 2, (t + 2) % 4, o[2]);
this._updateDistance(a, 0, 1, o[0], o[1]);
this._updateDistance(a, 0, 2, o[0], o[2]);
this._updateDistance(a, 1, 2, o[1], o[2]);
}
}
if (2 === e) {
a = this.twoNode;
var u = 1;
for (n = 0; n < o.length; n++) {
var d = o[n];
0 !== n && d && (u = n);
}
this._updateHead(a, 0, t, o[0]);
this._updateHead(a, 2, (t + 2) % 4, o[u]);
this._updateDistance(a, 0, 2, o[0], o[u]);
}
};
t.prototype._updateHead = function(e, t, o, n) {
if (e) {
var r = e.getChildByName("head_border_" + t);
if (r) {
var a = r.getChildByName("head_bg").getChildByName("direction");
if (o >= c.eDeskPos.East) {
var s = "Hall/Res/Texture/Game/Location/direction_" + o;
i.default.setImg(s, a);
}
var l = r.getChildByName("Image").getComponent(u.default);
if (n) {
l.node.active = !0;
l.url = n.headImg;
} else {
l.node.active = !1;
l.url = null;
}
}
}
};
t.prototype._updateDistance = function(e, t, o, n, r) {
var i = e.getChildByName("distance_" + t + "_" + o);
if (i) {
var a = i.getComponent(cc.Label);
if (n && r) if (n.location && r.location && n.location.latitude && n.location.longitude && r.location.latitude && r.location.longitude) {
var s = l.default.distance(n.location, r.location);
if (s > 1e3) {
var c = (s / 1e3).toFixed(2);
a.string = c + "千米";
} else a.string = s + "米";
} else a.string = "未知"; else a.string = "";
}
};
r([ y(cc.Node) ], t.prototype, "fourNode", void 0);
r([ y(cc.Node) ], t.prototype, "threeNode", void 0);
r([ y(cc.Node) ], t.prototype, "twoNode", void 0);
return t = r([ m ], t);
}(a.default);
o.default = g;
cc._RF.pop();
