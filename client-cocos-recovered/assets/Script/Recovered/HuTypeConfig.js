// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "21452cbkVdGposMkEEfElI8", "HuTypeConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r, i, a, s, l, c, u, d, p, f, h, m, y, g, _, v, C = e("./CommonEnum"), b = e("./CommonUtils");
o.HuTypeBitConfig = ((n = {})[C.eGameIds.QJHH] = ((r = {})[1] = {
desc: "黑摸",
weight: 80,
animation: "heimo",
sound: "qj_heimo"
}, r[2] = {
desc: "软摸",
weight: 60,
animation: "ruanmo",
sound: "qj_ruanmo"
}, r[4] = {
desc: "屁胡",
weight: 50,
animation: "hu",
sound: "hu"
}, r[8] = {
desc: "双大胡",
weight: 90,
animation: "shuangdahu",
sound: "hu"
}, r[16] = {
desc: "抢杠胡",
weight: 90,
animation: "qiangganghu",
sound: "qj_qgh",
bHideGuo: !0
}, r[32] = {
desc: "热铳",
weight: 90,
animation: "rechong",
sound: "qj_gsp",
bHideGuo: !0
}, r[64] = {
desc: "清一色",
weight: 90,
animation: "qingyise",
sound: "hu"
}, r), n[C.eGameIds.HZHH] = ((i = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, i[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, i[4] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, i[8] = {
desc: "清一色",
weight: 40,
animation: "qingyise",
sound: null
}, i[16] = {
desc: "七对",
weight: 30,
animation: "qidui",
sound: null
}, i[32] = {
desc: "点炮",
weight: 90,
animation: "hu",
sound: null
}, i[64] = {
desc: "杠上开花",
weight: 20,
animation: "gskh",
sound: null
}, i[128] = {
desc: "抢杠胡",
weight: 10,
animation: "qiangganghu",
sound: null
}, i[256] = {
desc: "硬胡",
weight: 70,
animation: "yinghu",
sound: null
}, i[512] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, i), n[C.eGameIds.HZHZ] = ((a = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, a[2] = {
desc: "碰碰胡",
weight: 60,
animation: "pengpenghu",
sound: null
}, a[4] = {
desc: "风一色",
weight: 50,
animation: "hu",
sound: null
}, a[8] = {
desc: "将一色",
weight: 40,
animation: "hu",
sound: null
}, a[16] = {
desc: "清一色",
weight: 30,
animation: "qingyise",
sound: null
}, a[32] = {
desc: "全求人",
weight: 90,
animation: "hu",
sound: null
}, a[64] = {
desc: "抢杠胡",
weight: 20,
animation: "qiangganghu",
sound: null
}, a[128] = {
desc: "海底捞",
weight: 10,
animation: "haidilao",
sound: null
}, a[256] = {
desc: "杠开花",
weight: 70,
animation: "gskh",
sound: null
}, a[512] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, a[1024] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, a[2048] = {
desc: "硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, a), n[C.eGameIds.LTMJ] = ((s = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, s[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, s[4] = {
desc: "七对",
weight: 50,
animation: "qidui",
sound: null
}, s[8] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, s[16] = {
desc: "风一色",
weight: 40,
animation: "hu",
sound: null
}, s[32] = {
desc: "将一色",
weight: 30,
animation: "hu",
sound: null
}, s[64] = {
desc: "清一色",
weight: 90,
animation: "qingyise",
sound: null
}, s[128] = {
desc: "全求人",
weight: 20,
animation: "hu",
sound: null
}, s[256] = {
desc: "抢杠胡",
weight: 10,
animation: "qiangganghu",
sound: null
}, s[512] = {
desc: "海底捞",
weight: 70,
animation: "haidilao",
sound: null
}, s[1024] = {
desc: "杠开花",
weight: 1e3,
animation: "gskh",
sound: null
}, s[2048] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, s[4096] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, s[8192] = {
desc: "硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, s[16384] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, s), n[C.eGameIds.XSMJ] = ((l = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, l[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, l[4] = {
desc: "七对",
weight: 50,
animation: "qidui",
sound: null
}, l[8] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, l[16] = {
desc: "风一色",
weight: 40,
animation: "hu",
sound: null
}, l[32] = {
desc: "将一色",
weight: 30,
animation: "hu",
sound: null
}, l[64] = {
desc: "清一色",
weight: 90,
animation: "qingyise",
sound: null
}, l[128] = {
desc: "全求人",
weight: 20,
animation: "hu",
sound: null
}, l[256] = {
desc: "抢杠胡",
weight: 10,
animation: "qiangganghu",
sound: null
}, l[512] = {
desc: "海底捞",
weight: 70,
animation: "haidilao",
sound: null
}, l[1024] = {
desc: "杠开花",
weight: 1e3,
animation: "gskh",
sound: null
}, l[2048] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, l[4096] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, l[8192] = {
desc: "硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, l[16384] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, l), n[C.eGameIds.QCHZ] = ((c = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, c[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, c[4] = {
desc: "七对",
weight: 50,
animation: "qidui",
sound: null
}, c[8] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, c[16] = {
desc: "风一色",
weight: 40,
animation: "hu",
sound: null
}, c[32] = {
desc: "将一色",
weight: 30,
animation: "hu",
sound: null
}, c[64] = {
desc: "清一色",
weight: 90,
animation: "qingyise",
sound: null
}, c[128] = {
desc: "全求人",
weight: 20,
animation: "hu",
sound: null
}, c[256] = {
desc: "海底捞",
weight: 70,
animation: "haidilao",
sound: null
}, c[512] = {
desc: "杠开花",
weight: 1e3,
animation: "gskh",
sound: null
}, c[1024] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, c[2048] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, c[4096] = {
desc: "硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, c[8192] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, c), n[C.eGameIds.QCHH] = ((u = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, u[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, u[4] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, u[8] = {
desc: "清一色",
weight: 50,
animation: "qingyise",
sound: null
}, u[16] = {
desc: "风一色",
weight: 40,
animation: "hu",
sound: null
}, u[32] = {
desc: "将一色",
weight: 30,
animation: "hu",
sound: null
}, u[64] = {
desc: "七对",
weight: 90,
animation: "qidui",
sound: null
}, u[128] = {
desc: "点炮",
weight: 20,
animation: "hu",
sound: null
}, u[256] = {
desc: "杠开花",
weight: 70,
animation: "gskh",
sound: null
}, u[512] = {
desc: "抢杠胡",
weight: 1e3,
animation: "qiangganghu",
sound: null
}, u[1024] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, u[2048] = {
desc: "海底捞",
weight: 1e3,
animation: "haidilao",
sound: null
}, u[4096] = {
desc: "黑硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, u[8192] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, u[16384] = {
desc: "双豪华",
weight: 1e3,
animation: "hu",
sound: null
}, u[32768] = {
desc: "三豪华",
weight: 1e3,
animation: "hu",
sound: null
}, u), n[C.eGameIds.MCHZ] = ((d = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, d[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, d[4] = {
desc: "七对",
weight: 50,
animation: "qidui",
sound: null
}, d[8] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, d[16] = {
desc: "风一色",
weight: 40,
animation: "hu",
sound: null
}, d[32] = {
desc: "将一色",
weight: 30,
animation: "hu",
sound: null
}, d[64] = {
desc: "清一色",
weight: 90,
animation: "qingyise",
sound: null
}, d[128] = {
desc: "全求人",
weight: 20,
animation: "hu",
sound: null
}, d[256] = {
desc: "海底捞",
weight: 70,
animation: "haidilao",
sound: null
}, d[512] = {
desc: "杠开花",
weight: 1e3,
animation: "gskh",
sound: null
}, d[1024] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, d[2048] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, d[4096] = {
desc: "硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, d[8192] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, d), n[C.eGameIds.QCGD] = ((p = {})[1] = {
desc: "硬自摸",
weight: 80,
animation: "hu",
sound: null
}, p[2] = {
desc: "软自摸",
weight: 60,
animation: "hu",
sound: null
}, p[4] = {
desc: "点炮胡",
weight: 50,
animation: "pihu",
sound: null
}, p[8] = {
desc: "抢杠胡",
weight: 50,
animation: "qiangganghu",
sound: null
}, p[16] = {
desc: "杠上炮",
weight: 40,
animation: "hu",
sound: null
}, p[32] = {
desc: "海底捞",
weight: 30,
animation: "haidilao",
sound: null
}, p[64] = {
desc: "杠开花",
weight: 90,
animation: "gangkaihua",
sound: null
}, p), n[C.eGameIds.HMMJ] = ((f = {})[1] = {
desc: "平胡",
weight: 80,
animation: "hu",
sound: null
}, f[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, f[4] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, f[8] = {
desc: "清一色",
weight: 50,
animation: "qingyise",
sound: null
}, f[16] = {
desc: "胡边",
weight: 90,
animation: "hu",
sound: null
}, f[32] = {
desc: "胡卡",
weight: 50,
animation: "hu",
sound: null
}, f[64] = {
desc: "七对",
weight: 1e3,
animation: "qidui",
sound: null
}, f[128] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, f[256] = {
desc: "杠开",
weight: 1e3,
animation: "gskh",
sound: null
}, f[512] = {
desc: "抢杠",
weight: 1e3,
animation: "qiangganghu",
sound: null
}, f[1024] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, f[2048] = {
desc: "清水",
weight: 1e3,
animation: "hu",
sound: null
}, f[4096] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, f), n[C.eGameIds.YJLY] = ((h = {})[1] = {
desc: "硬自摸",
weight: 80,
animation: "hu",
sound: null
}, h[2] = {
desc: "软自摸",
weight: 60,
animation: "hu",
sound: null
}, h[4] = {
desc: "癞油",
weight: 50,
animation: "hu",
sound: null
}, h[8] = {
desc: "油中油",
weight: 50,
animation: "hu",
sound: null
}, h), n[C.eGameIds.TMHH] = ((m = {})[1] = {
desc: "黑摸",
weight: 80,
animation: "heimo",
sound: "tm_zimo"
}, m[2] = {
desc: "软摸",
weight: 60,
animation: "ruanmo",
sound: "tm_zimo"
}, m[4] = {
desc: "屁胡",
weight: 50,
animation: "hu",
sound: "tm_hu"
}, m[8] = {
desc: "抢杠胡",
weight: 90,
animation: "qiangganghu",
sound: "tm_qianghuang",
bHideGuo: !0
}, m[16] = {
desc: "杠上炮",
weight: 90,
animation: "rechong",
sound: "tm_rechong",
bHideGuo: !0
}, m[32] = {
desc: "清一色",
weight: 90,
animation: "qingyise",
sound: "tm_hu"
}, m), n[C.eGameIds.QJHZ] = ((y = {})[1] = {
desc: "硬自摸",
weight: 80,
animation: "hu",
sound: "qj_heimo"
}, y[2] = {
desc: "软摸",
weight: 60,
animation: "ruanmo",
sound: "qj_ruanmo"
}, y[4] = {
desc: "屁胡",
weight: 50,
animation: "hu",
sound: "hu"
}, y[8] = {
desc: "双大胡",
weight: 90,
animation: "shuangdahu",
sound: "hu"
}, y[16] = {
desc: "抢杠胡",
weight: 90,
animation: "qiangganghu",
sound: "qj_qgh"
}, y[32] = {
desc: "杠上炮",
weight: 90,
animation: "rechong",
sound: "qj_gsp",
bHideGuo: !0
}, y), n[C.eGameIds.DYKKF] = ((g = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, g[2] = {
desc: "碰碰胡",
weight: 60,
animation: "pengpenghu",
sound: null
}, g[4] = {
desc: "风一色",
weight: 50,
animation: "hu",
sound: null
}, g[8] = {
desc: "将一色",
weight: 40,
animation: "hu",
sound: null
}, g[16] = {
desc: "清一色",
weight: 30,
animation: "qingyise",
sound: null
}, g[32] = {
desc: "全求人",
weight: 90,
animation: "hu",
sound: null
}, g[64] = {
desc: "抢杠胡",
weight: 20,
animation: "qiangganghu",
sound: null
}, g[128] = {
desc: "海底捞",
weight: 10,
animation: "haidilao",
sound: null
}, g[256] = {
desc: "杠开花",
weight: 70,
animation: "gskh",
sound: null
}, g[512] = {
desc: "点炮",
weight: 1e3,
animation: "hu",
sound: null
}, g[1024] = {
desc: "自摸",
weight: 1e3,
animation: "hu",
sound: null
}, g[2048] = {
desc: "硬胡",
weight: 1e3,
animation: "hu",
sound: null
}, g), n[C.eGameIds.DYHH] = ((_ = {})[1] = {
desc: "屁胡",
weight: 80,
animation: "pihu",
sound: null
}, _[2] = {
desc: "门清",
weight: 60,
animation: "menqing",
sound: null
}, _[4] = {
desc: "碰碰胡",
weight: 50,
animation: "pengpenghu",
sound: null
}, _[8] = {
desc: "清一色",
weight: 40,
animation: "qingyise",
sound: null
}, _[16] = {
desc: "将一色",
weight: 30,
animation: "hu",
sound: null
}, _[32] = {
desc: "七对",
weight: 90,
animation: "qidui",
sound: null
}, _[64] = {
desc: "点炮",
weight: 20,
animation: "hu",
sound: null
}, _[128] = {
desc: "自摸",
weight: 20,
animation: "hu",
sound: null
}, _[256] = {
desc: "硬胡",
weight: 70,
animation: "hu",
sound: null
}, _[512] = {
desc: "豪华",
weight: 1e3,
animation: "hu",
sound: null
}, _), n);
o.HuTypeDescConfig = ((v = {})[C.eGameIds.HZHH] = [ {
value: 784,
desc: [ "黑豪华七对" ]
}, {
value: 528,
desc: [ "豪华七对" ]
}, {
value: 258,
desc: [ "黑门清" ]
}, {
value: 260,
desc: [ "黑碰碰胡" ]
}, {
value: 264,
desc: [ "黑清一色" ]
}, {
value: 272,
desc: [ "黑七对" ]
}, {
value: 68,
desc: [ "碰碰胡杠开" ]
}, {
value: 72,
desc: [ "清一色杠开" ]
}, {
value: 320,
desc: [ "硬胡杠开" ]
}, {
value: 65,
desc: [ "软杠开" ]
}, {
value: 64,
desc: [ "杠上开花" ]
}, {
value: 384,
desc: [ "硬胡抢杠" ]
}, {
value: 129,
desc: [ "屁胡抢杠" ]
}, {
value: 128,
desc: [ "抢杠胡" ]
}, {
value: 4,
desc: [ "碰碰胡" ]
}, {
value: 2,
desc: [ "门清" ]
}, {
value: 8,
desc: [ "清一色" ]
}, {
value: 16,
desc: [ "七对" ]
}, {
value: 256,
desc: [ "硬胡" ]
}, {
value: 1,
desc: [ "屁胡" ]
} ], v);
var D = function() {
function e() {}
e.customDesc = function(e, t) {
for (var n = [], r = o.HuTypeDescConfig[e] || [], i = 0, a = r.length; i < a; i++) {
var s = r[i];
if ((t & s.value) === s.value) {
n.push(s.desc);
return n;
}
}
return n;
};
e.configDesc = function(e, t) {
for (var n = [], r = o.HuTypeBitConfig[e], i = Object.keys(r), a = 0, s = i.length; a < s; a++) {
var l = parseInt(i[a]);
(l & t) > 0 && n.push(r[l].desc);
}
return n;
};
e.isHideGuo = function(e, t) {
for (var n = o.HuTypeBitConfig[e], r = Object.keys(n), i = 0, a = r.length; i < a; i++) {
var s = parseInt(r[i]);
if ((s & t) > 0 && n[s].bHideGuo) return !0;
}
return !1;
};
e.getHuWayInfo = function(e, t, n) {
for (var r = 0, i = n.length; r < i; r++) {
var a = n[r];
if (b.default.checkBit(t, a)) return {
id: a,
desc: o.HuTypeBitConfig[e][a].desc
};
}
return null;
};
return e;
}();
o.default = D;
cc._RF.pop();
