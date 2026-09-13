// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "92426cVLpFCFJkkUiV+CV/2", "OperateTableText3D");
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
var i = e("./gContext"), a = e("./EventKeys"), s = e("./EventUtils"), l = e("./RoomInfoData"), c = e("./GameInfoData"), u = e("./RoomUtils"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !1;
t._viewPos = -1;
t.rootNode = null;
t.label = null;
return t;
}
t.prototype.start = function() {
var e = this;
i.default.eventUtils.on(a.default.data_game_status_change, function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDestroy);
i.default.eventUtils.on([ a.default.data_operated_change ], function(t, o) {
e._uiDirty = !0;
}, this, s.eOffType.OnDisable);
this.updateUI();
};
t.prototype.init = function(e) {
this._viewPos = e;
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this.updateUI();
}
};
t.prototype.updateUI = function() {
if (l.default.gameInfo.status !== c.eGameStatus.Free) {
var e = u.default.getInstance().viewPos2DeskPos(this._viewPos), t = l.default.gameInfo.siteInfos.get(e).operateList, o = t.collection(function(e) {
return e.tableShowText && e.tableShowText.length > 0;
});
if (o.length > 0) {
this.rootNode.active = !0;
this.label.string = t.get(o[0]).tableShowText;
} else this.rootNode.active = !1;
} else this.rootNode.active = !1;
};
r([ f(cc.Node) ], t.prototype, "rootNode", void 0);
r([ f(cc.Label) ], t.prototype, "label", void 0);
return t = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
