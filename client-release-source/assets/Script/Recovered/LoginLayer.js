// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "16883pnDltD7IEs65jahwgu", "LoginLayer");
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
var i, a = require("./GameConfig"), s = require("./CommonEnum"), l = require("./gContext"), c = require("./ExUser"), u = require("./Http"), d = require("./Storage"), p = require("./UserData"), f = require("./LoginMsg"), h = require("./ExGameAnalytics"), m = require("./WindowConfig"), y = require("./Constants"), g = require("./ExVoice"), _ = require("./SoundUtils"), v = require("./ExUtils"), C = require("./StringUtils"), b = cc._decorator, D = b.ccclass, S = b.property;
(function(e) {
e[e.tokenError = 1] = "tokenError";
e[e.netError = 2] = "netError";
e[e.dataError = 3] = "dataError";
})(i || (i = {}));
var w = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isCheck = !1;
t.startCount = !1;
t.time = 60;
t.inputMobile = "";
t.wxNode = null;
t.xlNode = null;
t.guestNode = null;
t.mobileNode = null;
t.maskNode = null;
t.checkedNode = null;
t.agreementPre = null;
t.ebTestAccount = null;
t.btnTestLogin = null;
return t;
}
t.prototype.start = function() {
this._negationCheck();
this.xlNode.active = !1;
this.mobileNode.active = !1;
a.default.platform === s.ePlatformType.iOS || a.default.platform === s.ePlatformType.android ? this.wxNode.active = !0 : this.wxNode.active = !1;
this.guestNode.active = true;
this.ebTestAccount.node.active = false;
this.btnTestLogin.node.active = false;
};
t.prototype.tryLogin = function() {
this.maskNode.active = !1;
if (cc.sys.isNative && !v.default.isDebug()) {
var e = d.default.lastLoginType.getValue();
e === s.eAccountType.wechat && d.default.wxToken.getValue() && this._wxLogin();
e === s.eAccountType.guest && d.default.guestToken.getValue() && this._guestLogin();

}
};
t.prototype.onBtnWxLogin = function() {
_.default.clickBtn();
if (!this._isCheck) return l.default.uiHelper.showTip("需要先同意用户协议和隐私条款~");
if (v.default.isInstallWX()) {
d.default.lastLoginType.setValue(s.eAccountType.wechat);
this._wxLogin();
} else l.default.uiHelper.showTip("您未安装微信APP，无法登陆~");
};
t.prototype.onBtnXianLiaoLogin = function() {
_.default.clickBtn();
if (!this._isCheck) return l.default.uiHelper.showTip("需要先同意用户协议和隐私条款~");
d.default.lastLoginType.setValue(s.eAccountType.xianLiao);
};
t.prototype.onBtnGuestLogin = function() {
_.default.clickBtn();
if (!this._isCheck) return l.default.uiHelper.showTip("需要先同意用户协议和隐私条款~");
d.default.lastLoginType.setValue(s.eAccountType.guest);
this._guestLogin();
};
t.prototype.onBtnMobileLogin = function() {
_.default.clickBtn();
if (!this._isCheck) return l.default.uiHelper.showTip("需要先同意用户协议和隐私条款~");
d.default.mobileToken.getValue() ? this._mobileLogin(null) : l.default.uiHelper.show(m.eWindowID.MobileLoginLayer, this);
};
t.prototype.onBtnAgreement = function() {
_.default.clickBtn();
l.default.uiHelper.show(m.eWindowID.AgreementLayer);
};
t.prototype.onBtnAgreementSec = function() {
_.default.clickBtn();
l.default.uiHelper.show(m.eWindowID.AgreementSecLayer);
};
t.prototype.onBtnCheck = function() {
_.default.clickBtn();
this._negationCheck();
};
t.prototype._negationCheck = function() {
this._isCheck = !this._isCheck;
this.checkedNode.active = this._isCheck;
};
t.prototype.countDown = function() {
var e = this;
this.schedule(function() {
if (0 == e.time) {
e.startCount = !1;
e.time = 60;
e.unscheduleAllCallbacks();
}
e.time--;
}, 1);
};
t.prototype._mobileLogin = function(e) {
var t = this;
l.default.uiHelper.showLoading();
var o = d.default.mobileToken.getValue();
o ? this._tokenLogin(o) : this._accountSend(e, function(e) {
t._loginSuccess(e.token, s.eAccountType.mobile, function(e) {
e && l.default.uiHelper.removeLoading();
});
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t);
});
};
t.prototype._wxLogin = function() {
var h = v.default.sdkInfo("SDK_WX_APPID");
if (!h) return l.default.uiHelper.showTip("微信登录尚未配置 AppID");
if (cc.sys.os === cc.sys.OS_IOS && !v.default.sdkInfo("SDK_WX_APPLINK")) return l.default.uiHelper.showTip("iOS 微信登录需先配置 Universal Link");
var e = this, t = {
appName: a.default.appName,
accountType: "wx",
code: void 0,
token: void 0,
appId: h,
migrationTicket: void 0
}, o = d.default.wxToken.getValue(), n = d.default.wxAppId.getValue(), r = function(o) {
o && (t.migrationTicket = o);
c.default.login(s.eAccountType.wechat, function(o, n) {
if (o === s.eExCallBackMsg.cancel) l.default.uiHelper.showTip("已取消微信登录"); else if (o === s.eExCallBackMsg.fail) l.default.uiHelper.showTip("微信登录失败，请检查微信配置"); else {
t.code = n;
l.default.uiHelper.showLoading();
e._accountSend(t, function(t) {
d.default.wxAppId.setValue(h);
e._loginSuccess(t.token, s.eAccountType.wechat, function(e) {
e && l.default.uiHelper.removeLoading();
});
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t);
});
}
});
};
if (o && (!n || n === h)) {
if (!n) d.default.wxAppId.setValue(h);
l.default.uiHelper.showLoading();
this._tokenLogin(o);
} else if (o && n && n !== h) {
l.default.uiHelper.showLoading();
this._accountSend({
appName: a.default.appName,
accountType: "wxMigration",
token: o,
appId: h
}, function(e) {
l.default.uiHelper.removeLoading();
if (!e.migrationTicket) return l.default.uiHelper.showTip("账号迁移准备失败");
r(e.migrationTicket);
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t || "账号迁移失败，请联系客服");
});
} else r();
};
t.prototype.OnTestLogin = function() {
var e = this, t = {
appName: a.default.appName,
accountType: s.eAccountType.guest,
code: this.ebTestAccount.string,
token: void 0
};
l.default.uiHelper.showLoading();
cc.log(t);
this._accountSend(t, function(t) {
e._loginSuccess(t.token, s.eAccountType.guest, function(e) {
e && l.default.uiHelper.removeLoading();
});
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t);
});
};
t.prototype._guestLogin = function() {
var e = this, t = {
appName: a.default.appName,
accountType: s.eAccountType.guest,
code: void 0,
token: d.default.guestToken.getValue(),
deviceId: void 0
};
if (cc.sys.os === cc.sys.OS_ANDROID) try {
t.deviceId = jsb.reflection.callStaticMethod("com/yuanlai/external/Utils", "getGuestDeviceId", "()Ljava/lang/String;");
} catch (o) {
cc.error("get guest device id failed:", o);
} else if (cc.sys.os === cc.sys.OS_IOS) try {
t.deviceId = jsb.reflection.callStaticMethod("TalkingDataGA", "getDeviceId");
} catch (o) {
cc.error("get guest device id failed:", o);
}
l.default.uiHelper.showLoading();
this._accountSend(t, function(t) {
e._loginSuccess(t.token, s.eAccountType.guest, function(e) {
e && l.default.uiHelper.removeLoading();
});
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t);
});
};
t.prototype._tokenLogin = function(e) {
var t = this, o = {
appName: a.default.appName,
accountType: s.eAccountType.token,
code: void 0,
token: e
};
this._accountSend(o, function(e) {
var o = e.token;
t._loginSuccess(o, d.default.lastLoginType.getValue(), function(e) {
e && l.default.uiHelper.removeLoading();
});
}, function(e, t) {
l.default.uiHelper.removeLoading();
l.default.uiHelper.showTip(t);
e === i.tokenError && p.default.cleanAll();
});
};
t.prototype._accountSend = function(e, t, o) {
var n = u.default.formatUrl(a.default.accountServerAddr, e);
n = a.default.appDunUrl(n);
u.default.get(n, null, function(n, r) {
if (n) o && o(i.netError, "网络请求失败，请稍后重试～"); else try {
var a = JSON.parse(r);
if (0 == a.err_code) t && t(a.data); else if (e.accountType === s.eAccountType.token && 65 == a.err_code) {
cc.error("http login token error:", r);
o && o(i.tokenError, a.err_msg || "登录时效已过期,请重新登录");
} else {
cc.error("http login error:", r);
o && o(i.netError, a.err_msg || "网络请求失败，请稍后重试～");
}
} catch (e) {
cc.error("http login data error:", e);
o && o(i.dataError, "登录数据异常～");
}
});
};
t.prototype._loginSuccess = function(e, t, o) {
var n = this;
p.default.saveLoginData(e, t);
f.default.initGameServer(function(e) {
if (e) {
l.default.uiHelper.showTipNetError();
o(!0);
} else f.default.login(function(e, r) {
if (r) {
l.default.uiHelper.showTipNetError();
o(!0);
} else if (0 === e.res.error) {
n._analyticsAccountInfo(t);
g.default.init({
identify: "" + p.default.uid,
mode: 1
});
f.default.syncData(function(t) {
if (t) {
o(!0);
cc.log("res err is:", t);
l.default.uiHelper.showTipNetError();
} else if (e.roomId > 0) l.default.gameMsgBase().joinRoom(e.roomId, !1, !0, o); else {
l.default.uiHelper.loadScene(y.default.HallSceneName);
o(!1);
}
});
} else {
o(!0);
l.default.uiHelper.showTip(e.res.what);
}
}, !0);
});
};
t.prototype._analyticsAccountInfo = function(e) {
var t = 0;
e === s.eAccountType.wechat && (t = 6);
var o = C.default.replaceSpecialChar(p.default.nickname);
h.default.submitAccountInfo({
accountId: p.default.uid + "",
accountType: t,
accountName: o,
level: 1,
gender: 0,
age: 1,
gameServer: "未知"
});
};
r([ S(cc.Node) ], t.prototype, "wxNode", void 0);
r([ S(cc.Node) ], t.prototype, "xlNode", void 0);
r([ S(cc.Node) ], t.prototype, "guestNode", void 0);
r([ S(cc.Node) ], t.prototype, "mobileNode", void 0);
r([ S(cc.Node) ], t.prototype, "maskNode", void 0);
r([ S(cc.Node) ], t.prototype, "checkedNode", void 0);
r([ S(cc.Prefab) ], t.prototype, "agreementPre", void 0);
r([ S(cc.EditBox) ], t.prototype, "ebTestAccount", void 0);
r([ S(cc.Button) ], t.prototype, "btnTestLogin", void 0);
return t = r([ D ], t);
}(cc.Component);
o.default = w;
cc._RF.pop();
