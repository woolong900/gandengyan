// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "78841eOqU1NRr2hxA68lgll", "ClubMsgItems");
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
var i = e("./StringUtils"), a = cc._decorator, s = a.ccclass, l = a.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.msgText = null;
t.msgTime = null;
t.botLine = null;
return t;
}
t.prototype.start = function() {};
t.prototype.setData = function(e, t) {
if (e.hasOwnProperty("source") && e.source > 0) {
var o = [ "", "<color=#037dd2>批准</color>加入俱乐部", "<color=#037dd2>拒绝</color>加入俱乐部", "<color=#037dd2>邀请</color>加入俱乐部", "<color=#037dd2>升级</color>为管理员", "<color=#037dd2>取消</color>管理员", "<color=#037dd2>冻结</color>", "<color=#037dd2>解冻</color>", "<color=#037dd2>解禁</color>", "<color=#037dd2>清零</color>", "<color=#037dd2>解散房间</color>", "<color=#037dd2>修改</color>俱乐部设置功能", "<color=#037dd2>修改</color>", "<color=#037dd2>新增</color>", "<color=#037dd2>删除</color>", "<color=#037dd2>解散</color>俱乐部", "<color=#037dd2>踢出</color>俱乐部", "<color=#037dd2>创建</color>俱乐部", "<color=#037dd2>删除</color>俱乐部", "<color=#037dd2>修改</color>俱乐部名称", "<color=#037dd2>修改</color>俱乐部公告" ], n = [ "玩家<color=#c54d24>" + i.default.clip(e.opNickName, 7) + "</color>(ID:" + e.opCode + ")" + o[e.source] + "</color>", "玩家<color=#c54d24>" + i.default.clip(e.userNickName, 7) + "</color>(ID:" + e.userCode + ")被玩家<color=#c48a00>" + i.default.clip(e.opNickName, 7) + "</color>(ID:" + e.opCode + ")" + o[e.source] + "</color>", "(<color=#c54d24>房间号:" + e.roomCode + "</color>)被玩家<color=#c48a00>" + i.default.clip(e.opNickName, 7) + "</color>(ID:" + e.opCode + ")" + o[e.source] + "</color>", "玩家<color=#c54d24>" + i.default.clip(e.opNickName, 7) + "</color>(ID:" + e.opCode + ")" + o[e.source] + "</color>" + e.gameName + "玩法" ];
if (e.hasOwnProperty("opObjects") && e.opObjects > -1) {
this.node.active = !0;
e.source > 0 && (13 === e.source ? this.msgText.string = n[3] : 19 === e.source || 20 === e.source ? this.msgText.string = n[0] : this.msgText.string = n[e.opObjects]);
this.msgTime.string = i.default.dateFormat(1e3 * e.time, "yyyy-MM-dd hh:mm");
this.botLine.active = !t;
} else this.node.active = !1;
} else this.node.active = !1;
};
r([ l(cc.RichText) ], t.prototype, "msgText", void 0);
r([ l(cc.Label) ], t.prototype, "msgTime", void 0);
r([ l(cc.Node) ], t.prototype, "botLine", void 0);
return t = r([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
