// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b47afeFMllG3J7qvp0LLOlR", "MsgBox");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./Loader"), r = require("./gContext"), i = require("./RoomInfoData"), a = require("./WindowConfig"), s = function() {
function e() {}
e.prototype._show = function(e, t, o, i, s, l, c, u, d, p) {
n.default.loadPre("Hall/Res/Prefab/MsgBox/MsgBoxCommon", function(n) {
var f = cc.instantiate(n), h = f.getComponent("MsgBoxCommon");
h.setContent(e).setConfirmCB(t).setCancelCB(o).setCloseCB(i).setShowCancel(s).setShowClose(l).setConfirmRemove(c).setCancelRemove(u);
d && h.setConfirmStr(d);
p && h.setCancelStr(p);
r.default.uiHelper.showWithNode(a.eWindowID.MsgBoxCommon, f);
});
};
e.prototype.show = function(e, t, o, n, r, i, a, s) {
void 0 === r && (r = !0);
void 0 === i && (i = !0);
void 0 === a && (a = "确定");
void 0 === s && (s = "取消");
this._show(e, t, o, n, !0, !0, r, i, a, s);
};
e.prototype.showNoCancel = function(e, t, o, n, r, i, a) {
void 0 === n && (n = !0);
void 0 === r && (r = !0);
void 0 === i && (i = "确定");
void 0 === a && (a = "取消");
this._show(e, t, o, null, !1, !0, n, r, i, a);
};
e.prototype.showNoClose = function(e, t, o, n, r, i, a) {
void 0 === n && (n = !0);
void 0 === r && (r = !0);
void 0 === i && (i = "确定");
void 0 === a && (a = "取消");
this._show(e, t, o, null, !0, !1, n, r, i, a);
};
e.prototype.showOnlyOk = function(e, t, o, n, r, i) {
void 0 === o && (o = !0);
void 0 === n && (n = !0);
void 0 === r && (r = "确定");
void 0 === i && (i = "取消");
this._show(e, t, null, null, !1, !1, o, n, r, i);
};
e.prototype.customExitRoom = function() {
var e = "是否离开房间？";
i.default.isFangZhu() && (e = "是否解散房间？");
var t = function() {
r.default.gameMsgBase().dismissRoom(!0, function(e, t) {
t ? r.default.uiHelper.showTip("网络请求失败，请稍后重试～") : 0 === e.error || (e.what ? r.default.uiHelper.showTip(e.what) : r.default.uiHelper.showTip("退出失败~"));
});
};
!i.default.isWatcher() ? this.showNoClose(e, t) : t();
};
e.prototype.customCheckGameRecord = function() {
this.show("您当前正在房间中，无法查看战绩~", function() {
r.default.uiHelper.loadScene(i.default.gameSceneName());
}, function() {}, null, !0, !0, "返回房间");
};
return e;
}();
o.default = s;
cc._RF.pop();
