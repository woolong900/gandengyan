// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3c3179TYKVPQ5pjubvCtaxH", "GameLogicBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.prototype.roomParam2Config = function(e, t, o) {
cc.error("玩法扩展，该方法需实现：roomParam2Config");
return null;
};
e.prototype.roomConfig2Param = function(e, t) {
cc.error("玩法扩展，该方法需实现：roomConfig2Param");
return null;
};
e.prototype.isRealTime = function(e) {
cc.error("玩法扩展，该方法需实现：isRealTime");
return !1;
};
e.prototype.isQuickBegin = function(e) {
return !1;
};
e.prototype.hideHuDongBiaoqing = function(e) {
return !1;
};
e.prototype.isAllowWatch = function(e) {
return !1;
};
e.prototype.autoGameCountDown = function(e) {
return 15;
};
e.prototype.isAutoGameRoom = function(e) {
return !1;
};
e.prototype.piaoValues = function(e) {
return [];
};
e.prototype.tableRuleDesc = function(e) {
return "";
};
e.prototype.scoreRuleDesc = function(e, t) {
cc.error("玩法扩展，该方法需实现：descScore");
return "";
};
e.prototype.allRuleDesc = function(e, t, o) {
cc.error("玩法扩展，该方法需实现：allRuleDesc");
return "";
};
e.prototype.fengDingDesc = function(e, t) {
cc.error("玩法扩展，该方法需实现：descScore");
return "";
};
e.prototype.roomTypeDesc = function(e, t, o) {
var n = e.findCheckedIds(o), r = e.listDesc(n, "、");
return r ? t + r : "";
};
e.prototype.configCell2Str = function(e, t, o, n) {
void 0 === n && (n = "0");
for (var r = 0, i = t.length; r < i; r++) {
var a = t[r];
if (e.isChecked(a)) return o[r];
}
return n;
};
e._instance = null;
return e;
}();
o.default = n;
cc._RF.pop();
