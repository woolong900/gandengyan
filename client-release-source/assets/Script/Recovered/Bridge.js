// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "1a2a441svJMnqOfxZ/wO6u9", "Bridge");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function(e, t) {
var o = {}, n = {
register: function(e, t) {
o[e] = t;
},
unregister: function(e) {
o[e] = null;
},
__onAction: function(e, t, n) {
cc.log("action:" + e);
cc.log("msg:" + t);
var r = o[e];
r && r(t, n);
},
invoke: function(t, o, n, r) {
void 0 === r && (r = !0);
if (!t) throw Error("method name must be not null");
var i = this, a = null;
if (n && "function" == typeof n) {
i.register(t, function(e, o) {
!1 === r ? cc.log("You must manual to unregister.") : i.unregister(t);
n(e, o);
});
}
if (cc.sys.OS_ANDROID === cc.sys.os) {
var s = "com/yuanlai/external/";
if ("number" == typeof o) if (o % 1 == 0) a = jsb.reflection.callStaticMethod(s + e, t, "(I)Ljava/lang/String;", o); else {
cc.warn("参数为浮点数");
a = jsb.reflection.callStaticMethod(s + e, t, "(F)Ljava/lang/String;", o);
} else if ("boolean" == typeof o) a = jsb.reflection.callStaticMethod(s + e, t, "(Z)Ljava/lang/String;", o); else if ("string" == typeof o) a = jsb.reflection.callStaticMethod(s + e, t, "(Ljava/lang/String;)Ljava/lang/String;", o); else if (void 0 === o || null === o) a = jsb.reflection.callStaticMethod(s + e, t, "()Ljava/lang/String;"); else {
if ("object" != typeof o) throw Error("Bridge invoke param type is not support.");
a = jsb.reflection.callStaticMethod(s + e, t, "(Ljava/lang/String;)Ljava/lang/String;", JSON.stringify(o));
}
}
if (cc.sys.OS_IOS === cc.sys.os) {
var l = t + ":", c = o;
if ("number" == typeof o) a = jsb.reflection.callStaticMethod(e, l, c); else if ("boolean" == typeof o) a = jsb.reflection.callStaticMethod(e, l, c); else if ("string" == typeof o) a = jsb.reflection.callStaticMethod(e, l, c); else if (void 0 === o || null === o) a = jsb.reflection.callStaticMethod(e, t); else {
if ("object" != typeof o) throw Error("Bridge invoke param type is not support.");
c = JSON.stringify(o);
a = jsb.reflection.callStaticMethod(e, l, c);
}
}
return a;
}
};
Object.preventExtensions(n);
Object.seal(n);
Object.freeze(n);
t[e] = n;
return n;
}, r = {}, i = {
utils: n("Utils", r),
wxUser: n("WXUser", r),
xlUser: n("XianLiaoUser", r),
mwUser: n("MoWangUser", r),
dxUser: n("DeXunUser", r),
iap: n("IAP", r),
voice: n("Voice", r),
gameAnalytics: n("GameAnalytics", r)
};
window._bridge_action_ = function(e, t, o, n) {
setTimeout(function() {
var i = r[e];
i && i.__onAction(t, o, n);
}, 100);
};
o.default = i;
cc._RF.pop();
