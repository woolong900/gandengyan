// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "24d9eEytOFNxpVikXnSZ9Y7", "PayData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r = require("./ExUtils"), i = require("./UserData"), a = require("./GameConfig"), s = require("./Http"), l = require("./CommonEnum");
(function(e) {
e.WX = "wx";
e.ZFB = "zfb";
e.WXLINK = "link";
})(n = o.ePayCategory || (o.ePayCategory = {}));
var c = function() {
function e() {}
e.setData = function(e, t) {
e = e || [];
this._data = [];
this._iconPath = t;
for (var o = 0, n = e.length; o < n; o++) {
var r = e[o];
this._isSupport(r.identify) && this._data.push({
identify: r.identify,
category: r.category,
recommend: "yes" === r.recommend,
weight: parseInt(r.weight) || 0,
app_id: r.app_id || null,
mini_name: r.mini_name || null,
page_path: r.page_path || null,
url: r.url || null,
type: r.type || null,
mer_id: r.mer_id || null
});
}
this._data.sort(function(e, t) {
return t.weight - e.weight;
});
};
e._isSupport = function(e) {
return !0;
};
e.support = function() {
for (var e = !1, t = !1, o = !1, r = [], i = 0, a = this._data.length; i < a; i++) {
var s = this._data[i];
if (s.category === n.ZFB) {
!e && r.push(n.ZFB);
e = !0;
} else if (s.category === n.WX) {
!t && r.push(n.WX);
t = !0;
} else if (s.category === n.WXLINK) {
!o && r.push(n.WXLINK);
o = !0;
}
}
return r;
};
e.isRecommend = function(e) {
for (var t = 0, o = this._data.length; t < o; t++) {
var n = this._data[t];
if (n.category === e) return n.recommend;
}
return !1;
};
e.pay = function(e, t, o, n) {
for (var r = [], i = 0, a = this._data.length; i < a; i++) {
this._data[i].category === e && r.push(i);
}
var s = r.length, l = r[Math.floor(Math.random() * s)], c = this._data[l];
if ("yuanlai_wx_h5" === c.identify) this._wxH5Pay(t, o, c.app_id); else if ("yuanlai_wx_mini" === c.identify) this._miniPay(t, o, c.page_path, c.mini_name); else if ("yuanlai_zfb_h5" === c.identify) this._zfbH5Pay(t, o, c.app_id); else if ("sand_zfb_h5" === c.identify) this._sandZFBH5Pay(t, o); else if ("new_sand_zfb_h5" === c.identify) this._newsandZFBH5Pay(t, c.mer_id); else if ("juhe_zfb_h5" === c.identify) this._JHZFBH5Pay(t, c.mer_id, c.app_id); else if ("wx_link" === c.identify) {
var u = c.type || "";
this._linkWxPay(t, n, c.url, u);
}
};
e._miniPay = function(e, t, o, n) {
r.default.openWXMiniProgram(e, t, "pages/index/main", "gh_eb9efc16b9cb");
};
e._JHZFBH5Pay = function(e, t, o) {
var n = {
uid: "" + i.default.uid,
commodity_id: e,
mer_id: t
}, l = JSON.stringify(n), c = a.default.gameBaseUrl() + "/v1/game/yfb/applet/pay";
c = a.default.appDunUrl(c);
s.default.post(c, "", l, function(e, t) {
var n = JSON.parse(t), i = "alipays://platformapi/startapp?appId=" + o + "&page=pages/index/index?query=" + n.data.order_no;
cc.sys.isNative ? r.default.openWebpage(i) : window.open(i, "_blank");
});
};
e._wxH5Pay = function(e, t, o) {
var n = {
uid: "" + i.default.uid,
commodity_id: e,
platform_type: "2",
app_id: o
}, l = JSON.stringify(n), c = a.default.gameBaseUrl() + "/v1/game/wechat/h5/pay/";
c = a.default.appDunUrl(c);
s.default.post(c, "", l, function(e, t) {
var o = JSON.parse(t);
cc.sys.isNative ? r.default.openWebpage(o.data.url) : window.open(o.data.url, "_blank");
});
};
e._zfbH5Pay = function(e, t, o) {
var n = {
uid: "" + i.default.uid,
commodity_id: e,
platform_type: "2",
app_id: o
}, l = JSON.stringify(n), c = a.default.gameBaseUrl() + "/v1/game/alipay/official/h5/pay/";
c = a.default.appDunUrl(c);
s.default.post(c, "", l, function(e, t) {
var o = JSON.parse(t);
cc.sys.isNative ? r.default.openWebpage(o.data.url) : window.open(o.data.url, "_blank");
});
};
e._sandZFBH5Pay = function(e, t) {
var o = {
uid: "" + i.default.uid,
commodity_id: e,
platform_type: "2"
}, n = JSON.stringify(o), l = a.default.gameBaseUrl() + "/v1/game/alipay/sandpay/h5/pay/";
l = a.default.appDunUrl(l);
s.default.post(l, "", n, function(e, t) {
var o = JSON.parse(t);
cc.sys.isNative ? r.default.openWebpage(o.data.url) : window.open(o.data.url, "_blank");
});
};
e._newsandZFBH5Pay = function(e, t) {
var o = {
uid: "" + i.default.uid,
commodity_id: e,
mer_id: t,
pay_type: "1"
}, n = JSON.stringify(o), l = a.default.gameBaseUrl() + "/v1/game/sandpay/platform/up/pay/";
l = a.default.appDunUrl(l);
s.default.post(l, "", n, function(e, t) {
var o = JSON.parse(t), n = "&meta_option=" + encodeURIComponent([ {
s: "Android",
n: "潜江干瞪眼",
id: "",
sc: ""
}, {
s: "IOS",
n: "潜江干瞪眼",
id: "",
sc: ""
} ].toString()), i = "https://sandcash.mixienet.com.cn/h5/?" + o.data.pay_info + n + "#/alipayh5";
cc.sys.isNative ? r.default.openWebpage(i) : window.open(i, "_blank");
});
};
e._linkWxPay = function(e, t, o, n) {
var a = {
id: e,
token: i.default.token,
type: n
}, s = o + "/wxbuycard?linkPayData=" + JSON.stringify(a), c = i.default.nickname + "的充值订单", u = "购买" + t + "张房卡, 请点击支付 >>>";
cc.sys.isNative ? r.default.shareWebPage(l.eAccountType.wechat, l.eShareScene.Friend, c, u, this._iconPath, s) : window.open(s, "_blank");
};
e._data = [];
e._iconPath = "";
return e;
}();
o.default = c;
cc._RF.pop();
