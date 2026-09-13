// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "085b09+tERDVIWODw8l8gQ8", "gContext");
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
var i = require("./UIHelper"), a = require("./EventUtils"), s = require("./GameLogic"), l = require("./RoomInfoData"), c = require("./MsgBox"), u = require("./GameMsgBase"), d = cc._decorator, p = d.ccclass, f = d.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.uiHelper = null;
t.eventUtils = null;
return t;
}
o = t;
t.prototype.onLoad = function() {
cc.game.addPersistRootNode(this.node);
o.uiHelper = this.uiHelper;
o.eventUtils = this.eventUtils;
o.msgBox = new c.default();
};
t.gameLogic = function(e) {
e = e || l.default.config.index;
return s.default.getInstance(e);
};
t.gameMsgBase = function() {
this._gameMsgBase || (this._gameMsgBase = new u.default());
return this._gameMsgBase;
};
t.isUIQJ = function(e) {};
var o;
t.uiHelper = null;
t.eventUtils = null;
t.msgBox = null;
t._gameMsgBase = null;
r([ f(i.default) ], t.prototype, "uiHelper", void 0);
r([ f(a.default) ], t.prototype, "eventUtils", void 0);
return t = o = r([ p ], t);
}(cc.Component);
o.default = h;
cc._RF.pop();
