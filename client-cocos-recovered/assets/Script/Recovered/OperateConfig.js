// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "b0945nsZxRGxbiXl7m365ny", "OperateConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r;
(function(e) {
e[e.MingGang = 1] = "MingGang";
e[e.AnGang = 2] = "AnGang";
e[e.BuGang = 3] = "BuGang";
e[e.FengGang = 0] = "FengGang";
})(o.eGangType || (o.eGangType = {}));
(function(e) {
e[e.Null = -1] = "Null";
e[e.Guo = 1] = "Guo";
e[e.Hu = 2] = "Hu";
e[e.Gang = 3] = "Gang";
e[e.Peng = 4] = "Peng";
e[e.Chi = 5] = "Chi";
e[e.PiZi = 6] = "PiZi";
e[e.LaiZi = 7] = "LaiZi";
e[e.WarnLL = 8] = "WarnLL";
e[e.WarnQYS = 9] = "WarnQYS";
e[e.WarnJYS = 10] = "WarnJYS";
e[e.WarnQQR = 11] = "WarnQQR";
e[e.WarnFYS = 12] = "WarnFYS";
e[e.ShowCard = 13] = "ShowCard";
e[e.XXF = 14] = "XXF";
e[e.LiangDao = 15] = "LiangDao";
e[e.NotLiangDao = 16] = "NotLiangDao";
})(r = o.eOperateCategory || (o.eOperateCategory = {}));
var i = Object.create(null);
i = ((n = {})[r.Guo] = {
bigImg: "guo",
weight: 1
}, n[r.Hu] = {
bigImg: "hu",
weight: 100
}, n[r.Gang] = {
bigImg: "gang",
weight: 4
}, n[r.Peng] = {
bigImg: "peng",
weight: 3
}, n[r.Chi] = {
bigImg: "chi",
weight: 2
}, n[r.PiZi] = {
bigImg: "gang",
weight: 5
}, n[r.LaiZi] = {
bigImg: "gang",
weight: 5
}, n[r.WarnLL] = {
bigImg: "lianglai",
weight: 6,
smallText: "亮",
tableShowText: null
}, n[r.WarnQYS] = {
bigImg: "baoqing",
weight: 6,
smallText: "清",
tableShowText: "报清一色"
}, n[r.WarnJYS] = {
bigImg: "baojiang",
weight: 6,
smallText: "将",
tableShowText: "报将一色"
}, n[r.WarnQQR] = {
bigImg: "baoquan",
weight: 6,
smallText: null,
tableShowText: "报全求人"
}, n[r.WarnFYS] = {
bigImg: "baofeng",
weight: 6,
smallText: "风",
tableShowText: "报风一色"
}, n[r.ShowCard] = {
smallText: "亮",
bigImg: "liangpai",
weight: 6,
tableShowText: null
}, n[r.XXF] = {
bigImg: "xxf",
weight: 6
}, n);
o.default = i;
cc._RF.pop();
