// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "cb695FyS8dJKJryOST7Jr4O", "ExUser");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./Bridge"), r = require("./GameConfig"), i = require("./CommonEnum"), a = new (function() {
function e() {}
e.prototype.init = function(e, t) {
var o = r.default.platform;
i.ePlatformType.android === o || i.ePlatformType.iOS === o ? e === i.eAccountType.wechat ? n.default.wxUser.invoke("init", t, void 0) : e === i.eAccountType.xianLiao ? n.default.xlUser.invoke("init", t, void 0) : e === i.eAccountType.deXun ? n.default.dxUser.invoke("init", t, void 0) : cc.error("login type error.") : cc.log("init ok.");
};
e.prototype.login = function(e, t) {
var o = r.default.platform;
i.ePlatformType.android === o || i.ePlatformType.iOS === o ? e === i.eAccountType.wechat ? n.default.wxUser.invoke("login", void 0, t) : e === i.eAccountType.xianLiao ? n.default.xlUser.invoke("login", void 0, t) : t(i.eExCallBackMsg.fail) : t(i.eExCallBackMsg.fail);
};
return e;
}())();
o.default = a;
cc._RF.pop();
