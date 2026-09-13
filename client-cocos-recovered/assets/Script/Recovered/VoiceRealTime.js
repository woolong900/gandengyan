// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "85df9TxSnNKzbkYlc5YJ9vB", "VoiceRealTime");
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
var i = e("./SoundUtils"), a = e("./gContext"), s = e("./EventKeys"), l = e("./EventUtils"), c = e("./VoiceControl"), u = cc._decorator, d = u.ccclass, p = u.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._uiDirty = !0;
t.openMicNode = null;
t.closeMicNode = null;
return t;
}
t.prototype.start = function() {
var e = this;
a.default.eventUtils.on(s.default.todo_voice_real_time_change, function() {
e._uiDirty = !0;
}, this, l.eOffType.OnDestroy);
};
t.prototype.update = function() {
if (this._uiDirty) {
this._uiDirty = !1;
this._updateUI();
}
};
t.prototype._updateUI = function() {
if (c.default.getInstance().isOpenSpeaker) {
this.openMicNode.active = !0;
this.closeMicNode.active = !1;
} else {
this.openMicNode.active = !1;
this.closeMicNode.active = !0;
}
};
t.prototype.onClickMic = function() {
i.default.clickBtn();
c.default.getInstance().isOpenSpeaker ? c.default.getInstance().closeSpeaker() : c.default.getInstance().openSpeaker();
};
r([ p(cc.Node) ], t.prototype, "openMicNode", void 0);
r([ p(cc.Node) ], t.prototype, "closeMicNode", void 0);
return t = r([ d ], t);
}(cc.Component);
o.default = f;
cc._RF.pop();
