// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "e0e80934XFH3LCRD6uPPvaJ", "RoomConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = Object.create(null);
n = {
2: {
index: 2,
category: 1,
name: "干瞪眼",
ruleDescImgs: [ "desc_2_0", "desc_2_1" ],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "潜江晃晃",
reject: [ 1, 2, 26 ]
},
2: {
value: 1,
desc: "干瞪眼",
reject: [ 1, 2, 26 ]
},
26: {
value: 2,
desc: "堆癞子",
reject: [ 1, 2, 26 ],
isHide: !0,
isHide: !0
},
3: {
value: 2,
desc: "2人",
descDetail: "2人房",
reject: [ 3, 4, 5 ]
},
4: {
value: 3,
desc: "3人",
descDetail: "3人房",
reject: [ 3, 4, 5 ]
},
5: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 3, 4, 5 ]
},
6: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ 1, 2, 2.5, 5, 10, 20, 25 ],
style: 1
},
7: {
value: 0,
desc: "暗杠4倍",
reject: [ 7, 8 ]
},
8: {
value: 1,
desc: "暗杠2倍",
reject: [ 7, 8 ]
},
9: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 9, 10 ]
},
10: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 9, 10 ]
},
11: {
value: 0,
desc: "房主支付",
reject: [ 11, 12, 13, 14 ],
onlyHall: !0
},
12: {
value: 1,
desc: "AA支付",
reject: [ 11, 12, 13, 14 ]
},
13: {
value: 2,
desc: "群主支付",
reject: [ 11, 12, 13, 14 ],
onlyClub: !0
},
14: {
value: 3,
desc: "大赢家支付",
reject: [ 11, 12, 13, 14 ],
isHide: !0
},
15: {
value: 1,
desc: "底分10倍",
descDetail: "喜钱(底分10倍)",
reject: [ 15, 16, 17 ],
rejectVisible: [ 26 ]
},
16: {
value: 2,
desc: "底分20倍",
descDetail: "喜钱(底分20倍)",
reject: [ 15, 16, 17 ],
rejectVisible: [ 26 ]
},
17: {
value: 3,
desc: "底分32倍",
descDetail: "喜钱(底分32倍)",
reject: [ 15, 16, 17 ],
rejectVisible: [ 26 ]
},
27: {
value: 0,
desc: "关闭",
descDetail: "关闭",
rejectVisible: [ 1, 2 ],
reject: [ 15, 16, 17 ],
forceCheck: [ 26 ]
},
18: {
value: 0,
desc: "清一色"
},
19: {
value: 1,
desc: "少三张"
},
20: {
value: 2,
desc: "只许自摸"
},
21: {
value: 2,
desc: "热铳"
},
22: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
23: {
value: 3,
desc: "双大胡"
},
24: {
value: 3,
desc: "允许观战"
},
25: {
value: 3,
desc: "少人开局",
rejectVisible: [ 3 ]
},
28: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 28, 29, 30, 31, 32 ]
},
29: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 28, 29, 30, 31, 32 ]
},
30: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 28, 29, 30, 31, 32 ]
},
31: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 28, 29, 30, 31, 32 ]
},
32: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 28, 29, 30, 31, 32 ]
},
40: {
value: 0,
desc: "不踢人",
reject: [ 40, 41, 42, 43 ]
},
41: {
value: 1,
desc: "30秒",
reject: [ 40, 41, 42, 43 ]
},
42: {
value: 2,
desc: "60秒",
reject: [ 40, 41, 42, 43 ]
},
43: {
value: 3,
desc: "120秒",
reject: [ 40, 41, 42, 43 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 2,
lineCount: 3,
defCheck: [ 3 ],
detailIds: [ 3, 4, 5 ]
},
2: {
desc: "局数",
weight: 4,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10 ]
},
3: {
desc: "房费",
weight: 5,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 11, 12, 13, 14 ],
allIds: [ 11, 12, 13, 14 ]
},
4: {
desc: "玩法",
weight: 1,
lineCount: 3,
defCheck: [ 2 ],
detailIds: [ 2, 1 ]
},
5: {
desc: "底分",
weight: 3,
lineCount: 3,
defCheck: [ 7 ],
detailIds: [ 6, 7, 8 ]
},
6: {
desc: "喜钱",
weight: 6,
lineCount: 4,
defCheck: [ 15 ],
detailIds: [ 15, 16, 17, 27 ],
allIds: [ 15, 16, 17, 27 ]
},
7: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 22, 24, 25, 200 ]
},
100: {
desc: "其它",
weight: 7,
lineCount: 3,
defCheck: [ 20, 21, 23, 24 ],
detailIds: [ 20, 21, 23 ],
allIds: [ 18, 19, 20, 21, 23 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 28 ],
detailIds: [ 28, 29, 30, 31, 32 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 40 ],
detailIds: [ 40, 41, 42, 43 ]
}
}
},
3: {
index: 3,
category: 1,
name: "黄州晃晃",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "20分(1倒8分)",
reject: [ 1, 2, 3, 4, 5 ]
},
2: {
value: 1,
desc: "30分(1倒15分)",
reject: [ 1, 2, 3, 4, 5 ]
},
3: {
value: 2,
desc: "50分(1倒20分)",
reject: [ 1, 2, 3, 4, 5 ]
},
4: {
value: 3,
desc: "60分(1倒50分)",
reject: [ 1, 2, 3, 4, 5 ]
},
5: {
value: 4,
desc: "100分(1倒40分)",
reject: [ 1, 2, 3, 4, 5 ]
},
6: {
value: 4,
desc: "4人",
reject: [ 6, 7, 8 ]
},
7: {
value: 3,
desc: "3人",
reject: [ 6, 7, 8 ]
},
8: {
value: 2,
desc: "2人",
reject: [ 6, 7, 8 ]
},
9: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 9, 10 ]
},
10: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 9, 10 ]
},
11: {
value: 0,
desc: "房主支付",
reject: [ 11, 12, 13, 17 ],
onlyHall: !0
},
12: {
value: 1,
desc: "AA支付",
reject: [ 11, 12, 13, 17 ]
},
13: {
value: 2,
desc: "群主支付",
reject: [ 11, 12, 13, 17 ],
onlyClub: !0
},
14: {
value: 1,
desc: "屁胡点炮3家出",
reject: [ 14, 15 ]
},
15: {
value: 2,
desc: "屁胡点炮1家出",
reject: [ 14, 15 ]
},
16: {
value: 3,
desc: "去万字",
rejectVisible: [ 6 ]
},
17: {
value: 3,
desc: "大赢家支付",
reject: [ 11, 12, 13, 17 ],
isHide: !0
},
18: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
19: {
value: 0,
desc: "允许观战"
},
20: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 20, 21, 22, 23, 24, 25 ]
},
21: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 20, 21, 22, 23, 24, 25 ]
},
22: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 20, 21, 22, 23, 24, 25 ]
},
23: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 20, 21, 22, 23, 24, 25 ]
},
24: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 20, 21, 22, 23, 24, 25 ]
},
25: {
value: 600,
desc: "600秒",
descDetail: "600秒托管",
reject: [ 20, 21, 22, 23, 24, 25 ]
},
200: {
value: 1,
desc: "无互动表情"
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 6, 7, 8 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 11, 12, 13, 17 ],
allIds: [ 11, 12, 13, 17 ]
},
4: {
desc: "玩法",
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4, 5 ],
weight: 10
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 18, 19, 200 ]
},
100: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [ 14, 16 ],
detailIds: [ 14, 15, 16 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 20 ],
detailIds: [ 20, 21, 22, 23, 24, 25 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
}
}
},
4: {
index: 4,
category: 1,
name: "黄州红中",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "30分封顶",
reject: [ 1, 2, 3, 4, 18 ]
},
2: {
value: 1,
desc: "50分封顶",
reject: [ 1, 2, 3, 4, 18 ]
},
3: {
value: 2,
desc: "80分封顶",
reject: [ 1, 2, 3, 4, 18 ]
},
4: {
value: 3,
desc: "15分封顶",
reject: [ 1, 2, 3, 4, 18 ]
},
18: {
value: 4,
desc: "8分封顶",
reject: [ 1, 2, 3, 4, 18 ]
},
5: {
value: 4,
desc: "4人",
reject: [ 5, 6, 7 ]
},
6: {
value: 3,
desc: "3人",
reject: [ 5, 6, 7 ]
},
7: {
value: 2,
desc: "2人",
reject: [ 5, 6, 7 ]
},
8: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 8, 9 ]
},
9: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 8, 9 ]
},
10: {
value: 0,
desc: "房主支付",
reject: [ 10, 11, 12, 16 ],
onlyHall: !0
},
11: {
value: 1,
desc: "AA支付",
reject: [ 10, 11, 12, 16 ]
},
12: {
value: 2,
desc: "群主支付",
reject: [ 10, 11, 12, 16 ],
onlyClub: !0
},
16: {
value: 3,
desc: "大赢家支付",
reject: [ 10, 11, 12, 16 ],
isHide: !0
},
13: {
value: 1,
desc: "风豹"
},
14: {
value: 2,
desc: "将豹"
},
15: {
value: 3,
desc: "抢杠包胡"
},
17: {
value: 4,
desc: "去万字",
rejectVisible: [ 5 ]
},
19: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 0,
desc: "允许观战"
},
21: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
22: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
23: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
24: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
25: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
26: {
value: 600,
desc: "600秒",
descDetail: "600秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 5 ],
detailIds: [ 5, 6, 7 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 8, 9 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11, 12, 16 ],
allIds: [ 10, 11, 12, 16 ]
},
4: {
desc: "玩法",
weight: 10,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18, 4, 1, 2, 3 ]
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20, 200 ]
},
100: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [ 13, 14, 15 ],
detailIds: [ 13, 14, 15, 17 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 21 ],
detailIds: [ 21, 22, 23, 24, 25, 26 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
}
}
},
5: {
index: 5,
category: 1,
name: "罗田麻将",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 1,
desc: "开口翻",
reject: [ 1, 2 ]
},
2: {
value: 2,
desc: "门清七对",
reject: [ 1, 2 ]
},
3: {
value: 3,
desc: "去万字",
rejectVisible: [ 4 ]
},
4: {
value: 4,
desc: "4人",
reject: [ 4, 5, 6 ]
},
5: {
value: 3,
desc: "3人",
reject: [ 4, 5, 6 ]
},
6: {
value: 2,
desc: "2人",
reject: [ 4, 5, 6 ]
},
7: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 7, 8 ]
},
8: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 7, 8 ]
},
9: {
value: 0,
desc: "房主支付",
reject: [ 9, 10, 11, 21 ],
onlyHall: !0
},
10: {
value: 1,
desc: "AA支付",
reject: [ 9, 10, 11, 21 ]
},
11: {
value: 2,
desc: "群主支付",
reject: [ 9, 10, 11, 21 ],
onlyClub: !0
},
21: {
value: 3,
desc: "大赢家支付",
reject: [ 9, 10, 11, 21 ],
isHide: !0
},
12: {
value: 0,
desc: "20分/25分",
reject: [ 12, 13, 14, 15, 16 ]
},
13: {
value: 1,
desc: "30分/40分",
reject: [ 12, 13, 14, 15, 16 ]
},
14: {
value: 2,
desc: "50分/70分",
reject: [ 12, 13, 14, 15, 16 ]
},
15: {
value: 3,
desc: "80分/100分",
reject: [ 12, 13, 14, 15, 16 ]
},
16: {
value: 4,
desc: "100分/150分",
reject: [ 12, 13, 14, 15, 16 ]
},
17: {
value: 1,
desc: "抢杠包胡",
weight: 10
},
18: {
value: 2,
desc: "全球人",
weight: 20
},
19: {
value: 3,
desc: "风豹",
weight: 30
},
20: {
value: 4,
desc: "将豹",
weight: 40
},
22: {
value: 5,
desc: "无风"
},
25: {
value: 5,
desc: "三番起胡"
},
23: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
24: {
value: 0,
desc: "允许观战"
},
200: {
value: 1,
desc: "无互动表情"
},
41: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
42: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
43: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
44: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
45: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
46: {
value: 300,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 5, 6 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 8 ],
detailIds: [ 7, 8 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10, 11, 21 ],
allIds: [ 9, 10, 11, 21 ]
},
4: {
desc: "玩法",
weight: 10,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3 ]
},
5: {
desc: "封顶",
weight: 50,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 12, 13, 14, 15, 16 ]
},
6: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 23, 24, 200 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
},
100: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [ 17, 18, 19 ],
detailIds: [ 17, 18, 19, 20, 22, 25 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 41 ],
detailIds: [ 41, 42, 43, 44, 45, 46 ]
}
}
},
6: {
index: 6,
category: 1,
name: "浠水麻将",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "20分/30分",
clubTableDetail: "20分/30分",
reject: [ 1, 2, 3, 27, 28 ]
},
2: {
value: 1,
desc: "30分/40分/50分",
clubTableDetail: "30分/40分/50分",
reject: [ 1, 2, 3, 27, 28 ]
},
3: {
value: 2,
desc: "60分/80分/100分",
clubTableDetail: "60分/80分/100分",
reject: [ 1, 2, 3, 27, 28 ]
},
27: {
value: 3,
desc: "120分/160分/200分",
clubTableDetail: "120/160/200分",
reject: [ 1, 2, 3, 27, 28 ]
},
28: {
value: 4,
desc: "20分/20分",
clubTableDetail: "20分/20分",
reject: [ 1, 2, 3, 27, 28 ]
},
4: {
value: 4,
desc: "4人",
reject: [ 4, 5, 6 ]
},
5: {
value: 3,
desc: "3人",
reject: [ 4, 5, 6 ]
},
6: {
value: 2,
desc: "2人",
reject: [ 4, 5, 6 ]
},
7: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 7, 8, 20 ]
},
20: {
value: 12,
desc: "12局(8张房卡)",
reject: [ 7, 8, 20 ]
},
8: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 7, 8, 20 ]
},
9: {
value: 0,
desc: "房主支付",
reject: [ 9, 10, 11, 16 ],
onlyHall: !0
},
10: {
value: 1,
desc: "AA支付",
reject: [ 9, 10, 11, 16 ]
},
11: {
value: 2,
desc: "群主支付",
reject: [ 9, 10, 11, 16 ],
onlyClub: !0
},
16: {
value: 3,
desc: "大赢家支付",
reject: [ 9, 10, 11, 16 ],
isHide: !0
},
12: {
value: 1,
desc: "风豹"
},
13: {
value: 2,
desc: "单豹"
},
14: {
value: 3,
desc: "双豹"
},
15: {
value: 4,
desc: "缺一门",
rejectVisible: [ 4 ]
},
17: {
value: 5,
desc: "无风"
},
18: {
value: 6,
desc: "开口番"
},
19: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
26: {
value: 0,
desc: "允许观战"
},
21: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 21, 22, 23, 24, 25, 29 ]
},
22: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 21, 22, 23, 24, 25, 29 ]
},
23: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 21, 22, 23, 24, 25, 29 ]
},
24: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 21, 22, 23, 24, 25, 29 ]
},
25: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 21, 22, 23, 24, 25, 29 ]
},
29: {
value: 600,
desc: "600秒",
descDetail: "600秒托管",
reject: [ 21, 22, 23, 24, 25, 29 ]
},
200: {
value: 1,
desc: "无互动表情"
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 5, 6 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 8 ],
detailIds: [ 7, 20, 8 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10, 11, 16 ],
allIds: [ 9, 10, 11, 16 ]
},
4: {
desc: "玩法",
weight: 10,
lineCount: 2,
defCheck: [ 1 ],
detailIds: [ 28, 1, 2, 3, 27 ]
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 26, 200 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
},
100: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [ 12, 13, 14 ],
detailIds: [ 12, 13, 14, 15, 17, 18 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 21 ],
detailIds: [ 21, 22, 23, 24, 25, 29 ]
}
}
},
7: {
index: 7,
category: 1,
name: "蕲春红中杠",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 1,
desc: "开口番",
reject: [ 1, 2 ]
},
2: {
value: 2,
desc: "门清七对",
reject: [ 1, 2 ]
},
3: {
value: 3,
desc: "缺一门",
rejectVisible: [ 4 ]
},
4: {
value: 4,
desc: "4人",
reject: [ 4, 5, 6 ]
},
5: {
value: 3,
desc: "3人",
reject: [ 4, 5, 6 ]
},
6: {
value: 2,
desc: "2人",
reject: [ 4, 5, 6 ]
},
7: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 7, 8 ]
},
8: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 7, 8 ]
},
9: {
value: 0,
desc: "房主支付",
reject: [ 9, 10, 11, 16 ],
onlyHall: !0
},
10: {
value: 1,
desc: "AA支付",
reject: [ 9, 10, 11, 16 ]
},
11: {
value: 2,
desc: "群主支付",
reject: [ 9, 10, 11, 16 ],
onlyClub: !0
},
16: {
value: 3,
desc: "大赢家支付",
reject: [ 9, 10, 11, 16 ],
isHide: !0
},
12: {
value: 0,
desc: "0.5分",
reject: [ 12, 13, 14, 15 ]
},
13: {
value: 1,
desc: "1分",
reject: [ 12, 13, 14, 15 ]
},
14: {
value: 2,
desc: "2分",
reject: [ 12, 13, 14, 15 ]
},
15: {
value: 3,
desc: "4分",
reject: [ 12, 13, 14, 15 ]
},
17: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
18: {
value: 0,
desc: "允许观战"
},
21: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
22: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
23: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
24: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
25: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
26: {
value: 600,
desc: "600秒",
descDetail: "600秒托管",
reject: [ 21, 22, 23, 24, 25, 26 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 30,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 5, 6 ]
},
2: {
desc: "局数",
weight: 10,
lineCount: 3,
defCheck: [ 8 ],
detailIds: [ 7, 8 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10, 11, 16 ],
allIds: [ 9, 10, 11, 16 ]
},
4: {
desc: "玩法",
weight: 50,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3 ]
},
5: {
desc: "底分",
weight: 20,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 12, 13, 14, 15 ]
},
6: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 17, 18, 200 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 21 ],
detailIds: [ 21, 22, 23, 24, 25, 26 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
}
}
},
8: {
index: 8,
category: 1,
name: "蕲春晃晃",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "2分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
2: {
value: 1,
desc: "5分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
3: {
value: 2,
desc: "10分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
4: {
value: 3,
desc: "20分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
5: {
value: 4,
desc: "50分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
6: {
value: 5,
desc: "1分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
7: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 7, 8, 9 ]
},
8: {
value: 3,
desc: "3人",
descDetail: "3人房",
reject: [ 7, 8, 9 ]
},
9: {
value: 2,
desc: "2人",
descDetail: "2人房",
reject: [ 7, 8, 9 ]
},
10: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 10, 11 ]
},
11: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 10, 11 ]
},
12: {
value: 0,
desc: "房主支付",
reject: [ 12, 13, 14, 15 ],
onlyHall: !0
},
13: {
value: 1,
desc: "AA支付",
reject: [ 12, 13, 14, 15 ]
},
14: {
value: 2,
desc: "群主支付",
reject: [ 12, 13, 14, 15 ],
onlyClub: !0
},
15: {
value: 3,
desc: "大赢家支付",
reject: [ 12, 13, 14, 15 ],
isHide: !0
},
16: {
value: 1,
desc: "红中必杠"
},
17: {
value: 1,
desc: "缺一门",
rejectVisible: [ 7 ]
},
18: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
24: {
value: 0,
desc: "允许观战"
},
19: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 19, 20, 21, 22, 23 ]
},
20: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 19, 20, 21, 22, 23 ]
},
21: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 19, 20, 21, 22, 23 ]
},
22: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 19, 20, 21, 22, 23 ]
},
23: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 19, 20, 21, 22, 23 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 7 ],
detailIds: [ 7, 8, 9 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 13 ],
detailIds: [ 12, 13, 14, 15 ],
allIds: [ 12, 13, 14, 15 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 6, 1, 2, 3, 4, 5 ],
weight: 10
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 18, 24, 200 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
},
100: {
desc: "玩法",
weight: 100,
lineCount: 3,
defCheck: [],
detailIds: [ 16, 17 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 19 ],
detailIds: [ 19, 20, 21, 22, 23 ]
}
}
},
9: {
index: 9,
category: 1,
name: "一脚癞油",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "1分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
2: {
value: 1,
desc: "2分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
3: {
value: 2,
desc: "5分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
4: {
value: 3,
desc: "10分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
5: {
value: 4,
desc: "20分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
6: {
value: 5,
desc: "50分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
7: {
value: 4,
desc: "4人",
reject: [ 7, 8, 9 ]
},
8: {
value: 3,
desc: "3人",
reject: [ 7, 8, 9 ]
},
9: {
value: 2,
desc: "2人",
reject: [ 7, 8, 9 ]
},
10: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 10, 11 ]
},
11: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 10, 11 ]
},
12: {
value: 0,
desc: "房主支付",
reject: [ 12, 13, 14, 15 ]
},
13: {
value: 1,
desc: "AA支付",
reject: [ 12, 13, 14, 15 ]
},
14: {
value: 2,
desc: "群主支付",
reject: [ 12, 13, 14, 15 ],
onlyClub: !0
},
15: {
value: 3,
desc: "大赢家支付",
reject: [ 12, 13, 14, 15 ],
isHide: !0
},
16: {
value: 0,
desc: "一脚癞油",
reject: [ 16, 17, 18 ]
},
17: {
value: 1,
desc: "半癞",
reject: [ 16, 17, 18 ]
},
18: {
value: 2,
desc: "无癞",
reject: [ 16, 17, 18 ]
},
19: {
value: 1,
desc: "四癞有奖"
},
20: {
value: 1,
desc: "见字胡"
},
21: {
value: 1,
desc: "油中油"
},
22: {
value: 1,
desc: "缺一门"
},
23: {
value: 1,
desc: "杠牌顺摸"
},
24: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
25: {
value: 0,
desc: "允许观战"
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 7 ],
detailIds: [ 7, 8, 9 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 10, 11 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 13 ],
detailIds: [ 13, 14, 15 ],
allIds: [ 12, 13, 14, 15 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4, 5, 6 ],
weight: 10
},
100: {
desc: "玩法",
weight: 5,
lineCount: 3,
defCheck: [ 16 ],
detailIds: [ 16, 17, 18 ]
},
110: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20, 21, 22, 23 ]
},
120: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 24, 25 ]
}
}
},
10: {
index: 10,
category: 1,
name: "广东麻将",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "1分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
2: {
value: 1,
desc: "2分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
3: {
value: 2,
desc: "5分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
4: {
value: 3,
desc: "10分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
5: {
value: 4,
desc: "20分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
6: {
value: 5,
desc: "50分",
reject: [ 1, 2, 3, 4, 5, 6 ]
},
7: {
value: 4,
desc: "4人",
reject: [ 7, 8, 9 ]
},
8: {
value: 3,
desc: "3人",
reject: [ 7, 8, 9 ]
},
9: {
value: 2,
desc: "2人",
reject: [ 7, 8, 9 ]
},
10: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 10, 11 ]
},
11: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 10, 11 ]
},
12: {
value: 0,
desc: "房主支付",
reject: [ 12, 13, 14, 15 ],
onlyHall: !0
},
13: {
value: 1,
desc: "AA支付",
reject: [ 12, 13, 14, 15 ]
},
14: {
value: 2,
desc: "群主支付",
reject: [ 12, 13, 14, 15 ],
onlyClub: !0
},
15: {
value: 3,
desc: "大赢家支付",
reject: [ 12, 13, 14, 15 ],
isHide: !0
},
16: {
value: 0,
desc: "0马",
reject: [ 16, 17, 18, 19, 20, 24 ]
},
17: {
value: 1,
desc: "2马",
reject: [ 16, 17, 18, 19, 20, 24 ]
},
18: {
value: 2,
desc: "4马",
reject: [ 16, 17, 18, 19, 20, 24 ]
},
19: {
value: 3,
desc: "6马",
reject: [ 16, 17, 18, 19, 20, 24 ]
},
20: {
value: 4,
desc: "8马",
reject: [ 16, 17, 18, 19, 20, 24 ]
},
24: {
value: 5,
desc: "爆炸马",
reject: [ 16, 17, 18, 19, 20, 24 ]
},
21: {
value: 0,
desc: "中发白",
reject: [ 21, 22 ]
},
22: {
value: 1,
desc: "红中当马",
reject: [ 21, 22 ]
},
23: {
value: 1,
desc: "只许自摸"
},
25: {
value: 1,
desc: "缺一门",
rejectVisible: [ 7 ]
},
26: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
27: {
value: 0,
desc: "允许观战"
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
},
41: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
42: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
43: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
44: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
45: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
46: {
value: 300,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 7 ],
detailIds: [ 7, 8, 9 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 10, 11 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 13 ],
detailIds: [ 12, 13, 14, 15 ],
allIds: [ 12, 13, 14, 15 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4, 5, 6 ],
weight: 10
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 26, 27 ]
},
6: {
desc: "买马",
weight: 80,
lineCount: 3,
defCheck: [ 16 ],
detailIds: [ 16, 17, 18, 19, 20, 24 ]
},
7: {
desc: "玩法",
weight: 90,
lineCount: 3,
defCheck: [ 21 ],
detailIds: [ 21, 22 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
},
110: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [],
detailIds: [ 23, 25 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 41 ],
detailIds: [ 41, 42, 43, 44, 45, 46 ]
}
}
},
11: {
index: 11,
category: 1,
name: "麻城红中杠",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "0.5分",
reject: [ 1, 2, 3, 4, 5, 15 ]
},
2: {
value: 1,
desc: "1分",
reject: [ 1, 2, 3, 4, 5, 15 ]
},
3: {
value: 2,
desc: "2分",
reject: [ 1, 2, 3, 4, 5, 15 ]
},
4: {
value: 3,
desc: "2.5分",
reject: [ 1, 2, 3, 4, 5, 15 ]
},
5: {
value: 4,
desc: "5分",
reject: [ 1, 2, 3, 4, 5, 15 ]
},
15: {
value: 5,
desc: "10分",
reject: [ 1, 2, 3, 4, 5, 15 ]
},
6: {
value: 4,
desc: "4人",
reject: [ 6, 7, 8 ]
},
7: {
value: 3,
desc: "3人",
reject: [ 6, 7, 8 ]
},
8: {
value: 2,
desc: "2人",
reject: [ 6, 7, 8 ]
},
9: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 9, 10 ]
},
10: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 9, 10 ]
},
11: {
value: 0,
desc: "房主支付",
reject: [ 11, 12, 13, 14 ],
onlyHall: !0
},
12: {
value: 1,
desc: "AA支付",
reject: [ 11, 12, 13, 14 ]
},
13: {
value: 2,
desc: "群主支付",
reject: [ 11, 12, 13, 14 ],
onlyClub: !0
},
14: {
value: 3,
desc: "大赢家支付",
reject: [ 11, 12, 13, 14 ],
isHide: !0
},
16: {
value: 1,
desc: "满跑",
reject: [ 16, 27 ]
},
27: {
value: 0,
desc: "开口番",
reject: [ 16, 27 ]
},
17: {
value: 1,
desc: "风翻"
},
18: {
value: 1,
desc: "将翻"
},
19: {
value: 1,
desc: "豹翻"
},
20: {
value: 1,
desc: "连宝翻"
},
21: {
value: 1,
desc: "存",
limitVisible: [ [ 17, 19 ], [ 18, 19 ], [ 19, 20 ], [ 17, 20 ], [ 18, 20 ] ]
},
22: {
value: 1,
desc: "缺万字",
rejectVisible: [ 6 ]
},
24: {
value: 1,
desc: "闭"
},
23: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
25: {
value: 0,
desc: "允许观战"
},
40: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 40, 42, 43, 44, 45, 46 ]
},
42: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 40, 42, 43, 44, 45, 46 ]
},
43: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 40, 42, 43, 44, 45, 46 ]
},
44: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 40, 42, 43, 44, 45, 46 ]
},
45: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 40, 42, 43, 44, 45, 46 ]
},
46: {
value: 600,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 40, 42, 43, 44, 45, 46 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 6, 7, 8 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 9, 10 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 11, 12, 13, 14 ],
allIds: [ 11, 12, 13, 14 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4, 5, 15 ],
weight: 10
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 23, 22, 25, 200 ]
},
100: {
desc: "类型",
weight: 100,
lineCount: 3,
defCheck: [ 16 ],
detailIds: [ 16, 27 ]
},
110: {
desc: "玩法",
weight: 100,
lineCount: 3,
defCheck: [],
detailIds: [ 17, 18, 19, 20, 21, 24 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 40 ],
detailIds: [ 40, 42, 43, 44, 45, 46 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
}
}
},
12: {
index: 12,
category: 1,
name: "黄梅麻将",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "1分",
reject: [ 1, 2, 3, 4 ]
},
2: {
value: 1,
desc: "2分",
reject: [ 1, 2, 3, 4 ]
},
3: {
value: 2,
desc: "5分",
reject: [ 1, 2, 3, 4 ]
},
4: {
value: 3,
desc: "10分",
reject: [ 1, 2, 3, 4 ]
},
6: {
value: 4,
desc: "4人",
reject: [ 6, 7, 8 ]
},
7: {
value: 3,
desc: "3人",
reject: [ 6, 7, 8 ]
},
8: {
value: 2,
desc: "2人",
reject: [ 6, 7, 8 ]
},
9: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 9, 10 ]
},
10: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 9, 10 ]
},
11: {
value: 0,
desc: "房主支付",
reject: [ 11, 12, 13, 14 ],
onlyHall: !0
},
12: {
value: 1,
desc: "AA支付",
reject: [ 11, 12, 13, 14 ]
},
13: {
value: 2,
desc: "群主支付",
reject: [ 11, 12, 13, 14 ],
onlyClub: !0
},
14: {
value: 3,
desc: "大赢家支付",
reject: [ 11, 12, 13, 14 ],
isHide: !0
},
16: {
value: 0,
desc: "有宝(宝不可打)",
reject: [ 16, 17, 18 ]
},
17: {
value: 1,
desc: "有宝(宝可打)",
reject: [ 16, 17, 18 ]
},
18: {
value: 2,
desc: "无宝",
reject: [ 16, 17, 18 ]
},
19: {
value: 0,
desc: "不漂分",
reject: [ 19, 20, 21, 22, 23, 24 ]
},
20: {
value: 1,
desc: "漂1分",
reject: [ 19, 20, 21, 22, 23, 24 ]
},
21: {
value: 2,
desc: "漂2分",
reject: [ 19, 20, 21, 22, 23, 24 ]
},
22: {
value: 3,
desc: "漂3分",
reject: [ 19, 20, 21, 22, 23, 24 ]
},
23: {
value: 4,
desc: "漂4分",
reject: [ 19, 20, 21, 22, 23, 24 ]
},
24: {
value: 5,
desc: "漂5分",
reject: [ 19, 20, 21, 22, 23, 24 ]
},
25: {
value: 0,
desc: "小胡有宝可抢杠",
reject: [ 25, 26 ]
},
26: {
value: 1,
desc: "小胡有宝不可抢杠",
reject: [ 25, 26 ]
},
28: {
value: 2,
desc: "缺一门",
rejectVisible: [ 6 ]
},
27: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
29: {
value: 0,
desc: "允许观战"
},
41: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
42: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
43: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
44: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
45: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
46: {
value: 300,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 6, 7, 8 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 9, 10 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 11, 12, 13, 14 ],
allIds: [ 11, 12, 13, 14 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4 ],
weight: 10
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 27, 28, 29 ]
},
100: {
desc: "漂分",
weight: 100,
lineCount: 3,
defCheck: [ 19 ],
detailIds: [ 19, 20, 21, 22, 23, 24 ]
},
110: {
desc: "玩法",
weight: 100,
lineCount: 3,
defCheck: [ 16 ],
detailIds: [ 16, 17, 18 ]
},
120: {
desc: "抢杠设置",
weight: 100,
lineCount: 2,
defCheck: [ 25 ],
detailIds: [ 25, 26 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 41 ],
detailIds: [ 41, 42, 43, 44, 45, 46 ]
}
}
},
13: {
index: 13,
category: 3,
name: "浠水打七",
ruleDescImgs: [],
gameCountMul: 4,
options: {
1: {
value: 4,
desc: "4局(1张房卡)",
reject: [ 1, 2, 3, 22 ]
},
2: {
value: 8,
desc: "8局(2张房卡)",
reject: [ 1, 2, 3, 22 ]
},
3: {
value: 12,
desc: "12局(3张房卡)",
reject: [ 1, 2, 3, 22 ]
},
22: {
value: 16,
desc: "16局(4张房卡)",
reject: [ 1, 2, 3, 22 ]
},
4: {
value: 0,
desc: "1分",
reject: [ 4, 5, 6, 7 ]
},
5: {
value: 1,
desc: "5分",
reject: [ 4, 5, 6, 7 ]
},
6: {
value: 2,
desc: "10分",
reject: [ 4, 5, 6, 7 ]
},
7: {
value: 3,
desc: "2分",
reject: [ 4, 5, 6, 7 ]
},
8: {
value: 4,
desc: "4人",
reject: [ 8, 9 ]
},
9: {
value: 5,
desc: "5人",
reject: [ 8, 9 ]
},
10: {
value: 0,
desc: "房主支付",
reject: [ 10, 11, 12, 13 ],
onlyHall: !0
},
11: {
value: 1,
desc: "AA支付",
reject: [ 10, 11, 12, 13 ]
},
12: {
value: 2,
desc: "群主支付",
reject: [ 10, 11, 12, 13 ],
onlyClub: !0
},
13: {
value: 3,
desc: "大赢家支付",
reject: [ 10, 11, 12, 13 ],
isHide: !0
},
14: {
value: 0,
desc: "边三轮"
},
15: {
value: 0,
desc: "多边三轮"
},
16: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
23: {
value: 0,
desc: "允许观战"
},
17: {
value: 0,
desc: "方块对7可以反大花"
},
18: {
value: 0,
desc: "不踢人",
reject: [ 18, 19, 20, 21 ]
},
19: {
value: 1,
desc: "30秒",
reject: [ 18, 19, 20, 21 ]
},
20: {
value: 2,
desc: "60秒",
reject: [ 18, 19, 20, 21 ]
},
21: {
value: 3,
desc: "120秒",
reject: [ 18, 19, 20, 21 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 3,
lineCount: 3,
defCheck: [ 8 ],
detailIds: [ 8, 9 ]
},
2: {
desc: "局数",
weight: 1,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 22 ]
},
3: {
desc: "支付",
weight: 4,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11, 12, 13 ],
allIds: [ 10, 11, 12, 13 ]
},
4: {
desc: "底分",
weight: 2,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 7, 5, 6 ]
},
5: {
desc: "玩法",
weight: 100,
lineCount: 3,
defCheck: [],
detailIds: [ 17 ]
},
6: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 16, 23, 200 ]
},
7: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18, 19, 20, 21 ]
}
}
},
14: {
index: 14,
category: 2,
name: "跑得快",
ruleDescImgs: [],
gameCountMul: 5,
options: {
1: {
value: 5,
desc: "5局(1张房卡)",
reject: [ 1, 2, 3 ]
},
2: {
value: 10,
desc: "10局(2张房卡)",
reject: [ 1, 2, 3 ]
},
3: {
value: 15,
desc: "15局(3张房卡)",
reject: [ 1, 2, 3 ]
},
4: {
value: 0,
desc: "房主支付",
reject: [ 4, 5, 6, 7 ],
onlyHall: !0
},
5: {
value: 1,
desc: "AA支付",
reject: [ 4, 5, 6, 7 ]
},
6: {
value: 2,
desc: "群主支付",
reject: [ 4, 5, 6, 7 ],
onlyClub: !0
},
7: {
value: 3,
desc: "大赢家支付",
reject: [ 4, 5, 6, 7 ],
isHide: !0
},
8: {
value: 2,
desc: "2人",
descDetail: "2人房",
reject: [ 8, 9 ]
},
9: {
value: 3,
desc: "3人",
descDetail: "3人房",
reject: [ 8, 9 ]
},
10: {
value: 0,
desc: "16张",
reject: [ 10, 11 ]
},
11: {
value: 1,
desc: "15张",
reject: [ 10, 11 ]
},
12: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ .1, .2, .5, 1, 1.5, 2, 2.5, 3, 5, 10 ],
style: 1
},
13: {
value: 0,
desc: "3A当炸弹",
rejectVisible: [ 11 ]
},
14: {
value: 1,
desc: "四带二"
},
15: {
value: 2,
desc: "四带三"
},
16: {
value: 3,
desc: "缺牌可出完",
note: "开启之后，三带和飞机最后\n一手牌，可少带出完或接完。"
},
17: {
value: 4,
desc: "必须出黑桃3",
note: "开启之后，随机出来的庄家\n第一手牌必须出黑桃3"
},
32: {
value: 4,
desc: "随机坐庄",
note: "开启：每局随机庄家\n不开启：赢家坐庄"
},
18: {
value: 0,
desc: "显示余牌"
},
19: {
value: 0,
desc: "必管"
},
33: {
value: 0,
desc: "自动过"
},
34: {
value: 0,
desc: "可以反春天"
},
35: {
value: 0,
desc: "炸弹不可拆"
},
20: {
value: 0,
desc: "不扎",
descDetail: "不扎鸟",
reject: [ 20, 21, 22, 23 ]
},
21: {
value: 0,
desc: "加5张",
descDetail: "扎鸟加5张",
reject: [ 20, 21, 22, 23 ]
},
22: {
value: 0,
desc: "加10张",
descDetail: "扎鸟加5张",
reject: [ 20, 21, 22, 23 ]
},
23: {
value: 0,
desc: "翻倍",
descDetail: "扎鸟翻倍",
reject: [ 20, 21, 22, 23 ]
},
24: {
value: 0,
desc: "不飘",
reject: [ 24, 25, 26, 27 ]
},
25: {
value: 0,
desc: "1分/2分/3分",
reject: [ 24, 25, 26, 27 ]
},
26: {
value: 0,
desc: "2分/3分/5分",
reject: [ 24, 25, 26, 27 ]
},
27: {
value: 0,
desc: "2分/5分/8分",
reject: [ 24, 25, 26, 27 ]
},
28: {
value: 0,
desc: "不踢人",
reject: [ 28, 29, 30, 31 ]
},
29: {
value: 1,
desc: "30秒",
reject: [ 28, 29, 30, 31 ]
},
30: {
value: 2,
desc: "60秒",
reject: [ 28, 29, 30, 31 ]
},
31: {
value: 3,
desc: "120秒",
reject: [ 28, 29, 30, 31 ]
},
40: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
41: {
value: 0,
desc: "允许观战"
},
44: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 44, 45, 46, 47, 48, 49 ]
},
45: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 44, 45, 46, 47, 48, 49 ]
},
46: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 44, 45, 46, 47, 48, 49 ]
},
47: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 44, 45, 46, 47, 48, 49 ]
},
48: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 44, 45, 46, 47, 48, 49 ]
},
49: {
value: 600,
desc: "600秒",
descDetail: "600秒托管",
reject: [ 44, 45, 46, 47, 48, 49 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 3,
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 8, 9 ]
},
2: {
desc: "局数",
weight: 1,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3 ]
},
3: {
desc: "支付",
weight: 2,
lineCount: 3,
defCheck: [ 5 ],
detailIds: [ 4, 5, 6, 7 ],
allIds: [ 4, 5, 6, 7 ]
},
4: {
desc: "张数",
weight: 4,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 10, 11 ]
},
5: {
desc: "底分",
weight: 5,
lineCount: 3,
defCheck: [],
detailIds: [ 12 ]
},
6: {
desc: "玩法",
weight: 6,
lineCount: 3,
defCheck: [ 13, 15, 16, 17 ],
detailIds: [ 13, 14, 15, 16, 32, 17 ]
},
7: {
desc: "功能",
weight: 7,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18, 19, 33, 34, 35, 40, 41, 200 ]
},
8: {
desc: "红10扎鸟",
weight: 8,
lineCount: 3,
defCheck: [ 20 ],
detailIds: [ 20, 21, 22, 23 ]
},
9: {
desc: "飘分",
weight: 9,
lineCount: 3,
defCheck: [ 24 ],
detailIds: [ 24, 25, 26, 27 ]
},
10: {
desc: "离线踢人",
weight: 10,
lineCount: 3,
defCheck: [ 28 ],
detailIds: [ 28, 29, 30, 31 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 44 ],
detailIds: [ 44, 45, 46, 47, 48, 49 ]
}
}
},
15: {
index: 15,
category: 1,
name: "天门晃晃",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "天门癞晃",
reject: [ 1, 2 ]
},
2: {
value: 1,
desc: "天门硬晃",
reject: [ 1, 2 ]
},
3: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ 1, 2, 2.5, 5, 10, 20, 50 ],
style: 1
},
18: {
value: 0,
desc: "暗杠两倍",
reject: [ 18, 19 ]
},
19: {
value: 1,
desc: "暗杠四倍",
reject: [ 18, 19 ]
},
4: {
value: 2,
desc: "2人",
descDetail: "2人房",
reject: [ 4, 5, 6 ]
},
5: {
value: 3,
desc: "3人",
descDetail: "3人房",
reject: [ 4, 5, 6 ]
},
6: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 4, 5, 6 ]
},
7: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 7, 8 ]
},
8: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 7, 8 ]
},
9: {
value: 0,
desc: "房主支付",
reject: [ 9, 10, 11, 12 ],
onlyHall: !0
},
10: {
value: 1,
desc: "AA支付",
reject: [ 9, 10, 11, 12 ]
},
11: {
value: 2,
desc: "群主支付",
reject: [ 9, 10, 11, 12 ],
onlyClub: !0
},
12: {
value: 3,
desc: "大赢家支付",
reject: [ 9, 10, 11, 12 ],
isHide: !0
},
13: {
value: 1,
desc: "杠爆",
note: "癞子杠杠开自摸，得分翻倍",
rejectVisible: [ 2 ]
},
14: {
value: 1,
desc: "晃翻倍",
note: "每杠一个癞子，晃分翻倍",
rejectVisible: [ 2 ]
},
15: {
value: 1,
desc: "清一色"
},
16: {
value: 1,
desc: "只许自摸"
},
17: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 0,
desc: "热铳"
},
21: {
value: 0,
desc: "允许观战"
},
22: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 22, 23, 24, 25, 26 ]
},
23: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 22, 23, 24, 25, 26 ]
},
24: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 22, 23, 24, 25, 26 ]
},
25: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 22, 23, 24, 25, 26 ]
},
26: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 22, 23, 24, 25, 26 ]
},
30: {
value: 0,
desc: "不踢人",
reject: [ 30, 31, 32, 33 ]
},
31: {
value: 1,
desc: "30秒",
reject: [ 30, 31, 32, 33 ]
},
32: {
value: 2,
desc: "60秒",
reject: [ 30, 31, 32, 33 ]
},
33: {
value: 3,
desc: "120秒",
reject: [ 30, 31, 32, 33 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 20,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 5, 6 ]
},
2: {
desc: "局数",
weight: 30,
lineCount: 3,
defCheck: [ 7 ],
detailIds: [ 7, 8 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10, 11, 12 ],
allIds: [ 9, 10, 11, 12 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 3, 18, 19 ],
weight: 35
},
5: {
desc: "玩法",
weight: 10,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 30 ],
detailIds: [ 30, 31, 32, 33 ]
},
100: {
desc: "其它",
weight: 100,
lineCount: 3,
defCheck: [ 20 ],
detailIds: [ 13, 14, 15, 16, 20 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 22 ],
detailIds: [ 22, 23, 24, 25, 26 ]
},
110: {
desc: "功能",
weight: 90,
lineCount: 3,
defCheck: [],
detailIds: [ 17, 21, 200 ]
}
}
},
16: {
index: 16,
category: 4,
name: "蕲春打拱",
ruleDescImgs: [],
gameCountMul: 3,
options: {
1: {
value: 3,
desc: "3局(4张房卡)",
reject: [ 1, 2, 3, 4 ]
},
2: {
value: 6,
desc: "6局(8张房卡)",
reject: [ 1, 2, 3, 4 ]
},
3: {
value: 9,
desc: "9局(12张房卡)",
reject: [ 1, 2, 3, 4 ]
},
4: {
value: 12,
desc: "12局(16张房卡)",
reject: [ 1, 2, 3, 4 ]
},
5: {
value: 0,
desc: "房主支付",
reject: [ 5, 6, 7, 8 ],
onlyHall: !0
},
6: {
value: 1,
desc: "AA支付",
reject: [ 5, 6, 7, 8 ]
},
7: {
value: 2,
desc: "群主支付",
reject: [ 5, 6, 7, 8 ],
onlyClub: !0
},
8: {
value: 3,
desc: "大赢家支付",
reject: [ 5, 6, 7, 8 ],
isHide: !0
},
9: {
value: 0,
desc: "5分",
reject: [ 9, 10, 11, 12, 13 ]
},
10: {
value: 1,
desc: "10分",
reject: [ 9, 10, 11, 12, 13 ]
},
11: {
value: 2,
desc: "20分",
reject: [ 9, 10, 11, 12, 13 ]
},
12: {
value: 3,
desc: "30分",
reject: [ 9, 10, 11, 12, 13 ]
},
13: {
value: 4,
desc: "50分",
reject: [ 9, 10, 11, 12, 13 ]
},
14: {
value: 0,
desc: "无奖",
reject: [ 14, 15, 16 ]
},
15: {
value: 0,
desc: "半奖",
reject: [ 14, 15, 16 ],
note: "7张炸一喜\n8张炸两喜\n四王炸或两对王炸一喜"
},
16: {
value: 0,
desc: "全奖",
reject: [ 14, 15, 16 ],
note: "6张炸一喜\n7张炸两喜\n8张炸四喜\n2套5张炸一喜\n2套纯510K一喜\n4套510K一喜\n四王炸或两对王炸一喜"
},
17: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
19: {
value: 1,
desc: "记牌器"
},
20: {
value: 0,
desc: "允许观战"
},
18: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 18 ]
},
28: {
value: 0,
desc: "不踢人",
reject: [ 28, 29, 30, 31 ]
},
29: {
value: 1,
desc: "30秒",
reject: [ 28, 29, 30, 31 ]
},
30: {
value: 2,
desc: "60秒",
reject: [ 28, 29, 30, 31 ]
},
31: {
value: 3,
desc: "120秒",
reject: [ 28, 29, 30, 31 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 1,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18 ],
hide: !0
},
2: {
desc: "局数",
weight: 2,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4 ]
},
3: {
desc: "支付",
weight: 3,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 5, 6, 7, 8 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 9, 10, 11, 12, 13 ],
weight: 4
},
5: {
desc: "玩法",
weight: 5,
lineCount: 3,
defCheck: [ 14 ],
detailIds: [ 14, 15, 16 ]
},
110: {
desc: "功能",
weight: 9,
lineCount: 3,
defCheck: [],
detailIds: [ 17, 19, 20, 200 ]
},
10: {
desc: "离线踢人",
weight: 10,
lineCount: 3,
defCheck: [ 28 ],
detailIds: [ 28, 29, 30, 31 ]
}
}
},
17: {
index: 16,
category: 4,
name: "说胡子",
ruleDescImgs: [],
gameCountMul: 3,
options: {
1: {
value: 3,
desc: "3局(4张房卡)",
reject: [ 1, 2, 3, 4 ]
},
2: {
value: 6,
desc: "6局(8张房卡)",
reject: [ 1, 2, 3, 4 ]
},
3: {
value: 9,
desc: "9局(12张房卡)",
reject: [ 1, 2, 3, 4 ]
},
4: {
value: 12,
desc: "12局(16张房卡)",
reject: [ 1, 2, 3, 4 ]
},
5: {
value: 0,
desc: "房主支付",
reject: [ 5, 6, 7, 8 ],
onlyHall: !0
},
6: {
value: 1,
desc: "AA支付",
reject: [ 5, 6, 7, 8 ]
},
7: {
value: 2,
desc: "群主支付",
reject: [ 5, 6, 7, 8 ],
onlyClub: !0
},
8: {
value: 3,
desc: "大赢家支付",
reject: [ 5, 6, 7, 8 ],
isHide: !0
},
9: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ .1, .2, .5, 1, 2, 5 ],
style: 1
},
10: {
value: 1,
desc: "分",
descDetail: "底子%s分",
reject: [ 10, 20, 50, 100, 200 ],
style: 1
},
11: {
value: 1,
desc: "不带彩",
reject: [ 11, 12, 13 ]
},
12: {
value: 2,
desc: "1.5倍",
descDetail: "干锅带彩1.5倍",
reject: [ 11, 12, 13 ]
},
13: {
value: 3,
desc: "2倍",
descDetail: "干锅带彩2倍",
reject: [ 11, 12, 13 ]
},
14: {
value: 1,
desc: "尾游可以捡分",
isHide: !0
},
15: {
value: 1,
desc: "去掉34"
},
16: {
value: 1,
desc: "真五十K大过四炸"
},
22: {
value: 1,
desc: "8张炸大过四大天王"
},
23: {
value: 1,
desc: "开启喜钱"
},
24: { value: 0, desc: "6张炸弹", style: 2 },
25: { value: 0, desc: "7张炸弹", style: 2 },
26: { value: 0, desc: "8张炸弹", style: 2 },
27: { value: 0, desc: "四大天王", style: 2 },
17: {
value: 1,
desc: "观看队友手牌"
},
18: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 18 ]
},
19: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，其他玩家可实时听到\n自己说话声音，无法关闭"
},
20: {
value: 0,
desc: "记牌器"
},
21: {
value: 0,
desc: "允许观战"
},
28: {
value: 0,
desc: "不踢人",
reject: [ 28, 29, 30, 31 ]
},
29: {
value: 1,
desc: "30秒",
reject: [ 28, 29, 30, 31 ]
},
30: {
value: 2,
desc: "60秒",
reject: [ 28, 29, 30, 31 ]
},
31: {
value: 3,
desc: "120秒",
reject: [ 28, 29, 30, 31 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 3,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18 ],
hide: !0
},
2: {
desc: "局数",
weight: 4,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4 ]
},
3: {
desc: "支付",
weight: 5,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 5, 6, 7, 8 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [],
detailIds: [ 9 ],
weight: 1
},
5: {
desc: "底子",
lineCount: 3,
defCheck: [],
detailIds: [ 10 ],
weight: 2
},
6: {
desc: "干锅带彩",
weight: 6,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 11, 12, 13 ]
},
8: {
desc: "喜钱",
weight: 7,
lineCount: 3,
defCheck: [],
detailIds: [ 23 ]
},
9: {
desc: "",
weight: 8,
lineCount: 2,
defCheck: [],
detailIds: [ 24, 25, 26, 27 ]
},
110: {
desc: "其它",
weight: 9,
lineCount: 3,
defCheck: [],
detailIds: [ 15, 16, 22, 17, 20 ]
},
7: {
desc: "功能",
weight: 10,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 21, 200 ]
},
10: {
desc: "离线踢人",
weight: 11,
lineCount: 3,
defCheck: [ 28 ],
detailIds: [ 28, 29, 30, 31 ]
}
}
},
18: {
index: 18,
category: 4,
name: "五十K必打",
ruleDescImgs: [],
gameCountMul: 3,
options: {
1: {
value: 3,
desc: "3局(4张房卡)",
reject: [ 1, 2, 3, 4 ]
},
2: {
value: 6,
desc: "6局(8张房卡)",
reject: [ 1, 2, 3, 4 ]
},
3: {
value: 9,
desc: "9局(12张房卡)",
reject: [ 1, 2, 3, 4 ]
},
4: {
value: 12,
desc: "12局(16张房卡)",
reject: [ 1, 2, 3, 4 ]
},
5: {
value: 0,
desc: "房主支付",
reject: [ 5, 6, 7, 8 ],
onlyHall: !0
},
6: {
value: 1,
desc: "AA支付",
reject: [ 5, 6, 7, 8 ]
},
7: {
value: 2,
desc: "群主支付",
reject: [ 5, 6, 7, 8 ],
onlyClub: !0
},
8: {
value: 3,
desc: "大赢家支付",
reject: [ 5, 6, 7, 8 ],
isHide: !0
},
9: {
value: 1,
desc: "分",
descDetail: "底分%s",
reject: [ .1, .2, .5, 1, 2, 5 ],
style: 1
},
10: {
value: 3,
desc: "三人必打",
descDetail: "三人必打",
reject: [ 32, 10, 11 ]
},
11: {
value: 4,
desc: "四人必打",
descDetail: "四人必打",
reject: [ 32, 10, 11 ]
},
12: {
value: 1,
desc: "尾游可以捡分"
},
13: {
value: 1,
desc: "去掉34",
rejectVisible: [ 10, 32 ]
},
14: {
value: 1,
desc: "真五十K大过四炸"
},
15: {
value: 1,
desc: "高级防作弊",
rejectVisible: [ 11 ],
forceCheck: [ 16 ],
note: "勾选高级防作弊：\n二人玩法系统随机去掉8张非分牌\n三人玩法系统随机去掉9张非分牌\n勾选去分牌：\n二人玩法去掉的8张牌中包含30分\n三人玩法去掉的9张牌中包含30分"
},
16: {
value: 1,
desc: "去分牌",
rejectVisible: [ 11 ]
},
17: {
value: 1,
desc: "记牌器",
rejectVisible: [ 15, 32 ]
},
19: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，其他玩家可实时听到\n自己说话声音，无法关闭"
},
20: {
value: 0,
desc: "允许观战"
},
28: {
value: 0,
desc: "不踢人",
reject: [ 28, 29, 30, 31 ]
},
29: {
value: 1,
desc: "30秒",
reject: [ 28, 29, 30, 31 ]
},
30: {
value: 2,
desc: "60秒",
reject: [ 28, 29, 30, 31 ]
},
31: {
value: 3,
desc: "120秒",
reject: [ 28, 29, 30, 31 ]
},
32: {
value: 2,
desc: "二人必打",
descDetail: "二人必打",
reject: [ 32, 10, 11 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 1,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 32, 10, 11 ]
},
2: {
desc: "局数",
weight: 3,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4 ]
},
3: {
desc: "支付",
weight: 4,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 5, 6, 7, 8 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [],
detailIds: [ 9 ],
weight: 2
},
5: {
desc: "其它",
lineCount: 3,
defCheck: [],
detailIds: [ 12, 14, 13, 15, 16, 17 ],
weight: 5
},
10: {
desc: "离线踢人",
weight: 10,
lineCount: 3,
defCheck: [ 28 ],
detailIds: [ 28, 29, 30, 31 ]
},
11: {
desc: "功能",
weight: 11,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20, 200 ]
}
}
},
1: {
index: 1,
category: 1,
name: "潜江红中",
ruleDescImgs: [ "desc_2_0", "desc_2_1" ],
gameCountMul: 8,
options: {
1: {
value: 0,
desc: "八个风",
descDetail: "8风",
reject: [ 1, 2 ]
},
2: {
value: 1,
desc: "十二个风",
descDetail: "12风",
reject: [ 1, 2 ]
},
3: {
value: 2,
desc: "2人",
descDetail: "2人房",
reject: [ 3, 4, 5 ]
},
4: {
value: 3,
desc: "3人",
descDetail: "3人房",
reject: [ 3, 4, 5 ]
},
5: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 3, 4, 5 ]
},
6: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ .1, .2, .25, .5, 1, 2, 2.5, 5, 10, 20, 50, 100 ],
style: 1
},
7: {
value: 0,
desc: "暗杠2倍",
reject: [ 7, 8 ]
},
8: {
value: 1,
desc: "暗杠4倍",
reject: [ 7, 8 ]
},
32: {
value: 1,
desc: "多风加倍"
},
9: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 9, 10 ]
},
10: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 9, 10 ]
},
11: {
value: 0,
desc: "房主支付",
reject: [ 11, 12, 13, 14 ],
onlyHall: !0
},
12: {
value: 1,
desc: "AA支付",
reject: [ 11, 12, 13, 14 ]
},
13: {
value: 2,
desc: "群主支付",
reject: [ 11, 12, 13, 14 ],
onlyClub: !0
},
14: {
value: 3,
desc: "大赢家支付",
reject: [ 11, 12, 13, 14 ],
isHide: !0
},
15: {
value: 1,
desc: "只许自摸"
},
16: {
value: 1,
desc: "热铳"
},
17: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
31: {
value: 1,
desc: "允许观战"
},
29: {
value: 1,
desc: "结算四舍五入"
},
18: {
value: 0,
desc: "5金封顶",
descDetail: "5金",
reject: [ 18, 19 ]
},
19: {
value: 1,
desc: "6金封顶",
descDetail: "6金",
reject: [ 18, 19 ]
},
20: {
value: 0,
desc: "无东风",
reject: [ 20, 21, 22 ],
forceCheck: [ 1 ]
},
21: {
value: 1,
desc: "1张东风",
reject: [ 20, 21, 22 ],
rejectVisible: [ 1 ]
},
22: {
value: 2,
desc: "2张东风",
reject: [ 20, 21, 22 ],
rejectVisible: [ 1 ]
},
23: {
value: 0,
desc: "60分/80分",
descDetail: "60分封顶",
reject: [ 23, 24 ]
},
24: {
value: 1,
desc: "80分/100分",
descDetail: "80分封顶",
reject: [ 23, 24 ]
},
25: {
value: 0,
desc: "无癞子",
reject: [ 25, 26 ]
},
26: {
value: 1,
desc: "有癞子",
reject: [ 25, 26 ]
},
27: {
value: 1,
desc: "喜相逢"
},
28: {
value: 1,
desc: "二风起胡"
},
40: {
value: 1,
desc: "八风金",
rejectVisible: [ 27 ]
},
200: {
value: 1,
desc: "无互动表情"
},
41: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
42: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
43: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
44: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
45: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
46: {
value: 300,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 41, 42, 43, 44, 45, 46 ]
},
50: {
value: 0,
desc: "不踢人",
reject: [ 50, 51, 52, 53 ]
},
51: {
value: 1,
desc: "30秒",
reject: [ 50, 51, 52, 53 ]
},
52: {
value: 2,
desc: "60秒",
reject: [ 50, 51, 52, 53 ]
},
53: {
value: 3,
desc: "120秒",
reject: [ 50, 51, 52, 53 ]
}
},
attr: {
1: {
desc: "人数",
weight: 3,
lineCount: 3,
defCheck: [ 3 ],
detailIds: [ 3, 4, 5 ]
},
2: {
desc: "局数",
weight: 4,
lineCount: 3,
defCheck: [ 10 ],
detailIds: [ 9, 10 ]
},
3: {
desc: "房费",
weight: 5,
lineCount: 3,
defCheck: [ 12 ],
detailIds: [ 11, 12, 13, 14 ],
allIds: [ 11, 12, 13, 14 ]
},
4: {
desc: "玩法",
weight: 1,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2 ],
allIds: [ 1, 2 ]
},
5: {
desc: "底分",
weight: 6,
lineCount: 3,
defCheck: [ 7 ],
detailIds: [ 6, 7, 8, 32 ]
},
6: {
desc: "东风",
weight: 2,
lineCount: 3,
defCheck: [ 20 ],
detailIds: [ 20, 21, 22 ],
allIds: [ 20, 21, 22 ]
},
7: {
desc: "倍数",
weight: 7,
lineCount: 3,
defCheck: [ 23 ],
detailIds: [ 23, 24 ],
allIds: [ 23, 24 ]
},
8: {
desc: "金顶",
weight: 8,
lineCount: 3,
defCheck: [ 19 ],
detailIds: [ 18, 19 ],
allIds: [ 18, 19 ]
},
9: {
desc: "癞子",
weight: 9,
lineCount: 3,
defCheck: [ 25 ],
detailIds: [ 25, 26 ],
allIds: [ 18, 19 ]
},
10: {
desc: "功能",
weight: 10,
lineCount: 3,
defCheck: [ 31 ],
detailIds: [ 17, 31, 200 ],
allIds: [ 17, 31, 200 ]
},
11: {
desc: "其他",
weight: 11,
lineCount: 3,
defCheck: [ 16 ],
detailIds: [ 15, 16, 28, 27, 40 ],
allIds: [ 15, 16, 28, 27, 40 ]
},
12: {
desc: "离线踢人",
weight: 110,
lineCount: 3,
defCheck: [ 50 ],
detailIds: [ 50, 51, 52, 53 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 41 ],
detailIds: [ 41, 42, 43, 44, 45, 46 ]
}
}
},
19: {
index: 19,
category: 1,
name: "大冶开口番",
ruleDescImgs: [ "desc_19_0" ],
gameCountMul: 8,
options: {
18: {
value: 0,
desc: "1分",
reject: [ 18, 31, 32, 33 ]
},
31: {
value: 1,
desc: "2分",
reject: [ 18, 31, 32, 33 ]
},
32: {
value: 2,
desc: "5分",
reject: [ 18, 31, 32, 33 ]
},
33: {
value: 3,
desc: "10分",
reject: [ 18, 31, 32, 33 ]
},
5: {
value: 4,
desc: "4人",
reject: [ 5, 6, 7 ]
},
6: {
value: 3,
desc: "3人",
reject: [ 5, 6, 7 ]
},
7: {
value: 2,
desc: "2人",
reject: [ 5, 6, 7 ]
},
4: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 4, 8, 9 ]
},
8: {
value: 12,
desc: "12局(8张房卡)",
reject: [ 4, 8, 9 ]
},
9: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 4, 8, 9 ]
},
22: {
value: 0,
desc: "开口点炮不包",
weight: 10
},
23: {
value: 1,
desc: "大胡叠加乱将",
weight: 20
},
10: {
value: 0,
desc: "房主支付",
reject: [ 10, 11, 12 ],
onlyHall: !0
},
11: {
value: 1,
desc: "AA支付",
reject: [ 10, 11, 12 ]
},
12: {
value: 2,
desc: "群主支付",
reject: [ 10, 11, 12 ],
onlyClub: !0
},
13: {
value: 1,
desc: "庄家加番"
},
17: {
value: 1,
desc: "大胡杠开加番"
},
15: {
value: 1,
desc: "缺一门",
rejectVisible: [ 5 ]
},
19: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 0,
desc: "允许观战"
},
1: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 1, 2, 3, 41, 42, 43 ]
},
2: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 1, 2, 3, 41, 42, 43 ]
},
3: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 1, 2, 3, 41, 42, 43 ]
},
41: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 1, 2, 3, 41, 42, 43 ]
},
42: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 1, 2, 3, 41, 42, 43 ]
},
43: {
value: 300,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 1, 2, 3, 41, 42, 43 ]
},
24: {
value: 0,
desc: "不踢人",
reject: [ 24, 25, 26, 27, 28, 29 ]
},
25: {
value: 1,
desc: "15秒",
reject: [ 24, 25, 26, 27, 28, 29 ]
},
26: {
value: 2,
desc: "30秒",
reject: [ 24, 25, 26, 27, 28, 29 ]
},
27: {
value: 3,
desc: "60秒",
reject: [ 24, 25, 26, 27, 28, 29 ]
},
28: {
value: 4,
desc: "120秒",
reject: [ 24, 25, 26, 27, 28, 29 ]
},
29: {
value: 5,
desc: "300秒",
reject: [ 24, 25, 26, 27, 28, 29 ]
}
},
attr: {
1: {
desc: "人数",
weight: 30,
lineCount: 3,
defCheck: [ 5 ],
detailIds: [ 5, 6, 7 ]
},
2: {
desc: "局数",
weight: 10,
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 4, 8, 9 ]
},
3: {
desc: "支付",
weight: 20,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11, 12 ],
allIds: [ 10, 11, 12 ]
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20 ]
},
4: {
desc: "底分",
weight: 40,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18, 31, 32, 33 ]
},
99: {
desc: "全球人",
weight: 50,
lineCount: 3,
defCheck: [],
detailIds: [ 22, 23 ]
},
100: {
desc: "其它",
weight: 60,
lineCount: 3,
defCheck: [],
detailIds: [ 13, 17, 15 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 41, 42, 43 ]
},
7: {
desc: "离线",
weight: 70,
lineCount: 3,
defCheck: [ 24 ],
detailIds: [ 24, 25, 26, 27, 28, 29 ]
}
}
},
20: {
index: 20,
category: 1,
name: "大冶晃晃",
ruleDescImgs: [ "desc_20_0" ],
gameCountMul: 8,
options: {
1: {
value: 4,
desc: "红中杠",
reject: [ 1, 2 ]
},
2: {
value: 3,
desc: "红中发财杠",
reject: [ 1, 2 ]
},
3: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ .1, .2, .3, .4, .5, 1, 2 ],
style: 1
},
5: {
value: 4,
desc: "4人",
reject: [ 5, 6, 7 ]
},
6: {
value: 3,
desc: "3人",
reject: [ 5, 6, 7 ]
},
7: {
value: 2,
desc: "2人",
reject: [ 5, 6, 7 ]
},
4: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 4, 8, 9 ]
},
8: {
value: 12,
desc: "12局(8张房卡)",
reject: [ 4, 8, 9 ]
},
9: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 4, 8, 9 ]
},
21: {
value: 0,
desc: "40/50",
reject: [ 21, 22, 23, 24 ]
},
22: {
value: 1,
desc: "50/80",
reject: [ 21, 22, 23, 24 ]
},
23: {
value: 2,
desc: "80/100",
reject: [ 21, 22, 23, 24 ]
},
24: {
value: 3,
desc: "160/200",
reject: [ 21, 22, 23, 24 ]
},
10: {
value: 0,
desc: "房主支付",
reject: [ 10, 11, 12 ],
onlyHall: !0
},
11: {
value: 1,
desc: "AA支付",
reject: [ 10, 11, 12 ]
},
12: {
value: 2,
desc: "群主支付",
reject: [ 10, 11, 12 ],
onlyClub: !0
},
13: {
value: 1,
desc: "屁胡点炮三家出"
},
17: {
value: 1,
desc: "癞子可吃"
},
15: {
value: 1,
desc: "缺一门",
rejectVisible: [ 5 ]
},
37: {
value: 1,
desc: "中发白可吃"
},
19: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 0,
desc: "允许观战"
},
25: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 25, 26, 27, 28, 29, 30 ]
},
26: {
value: 1,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 25, 26, 27, 28, 29, 30 ]
},
27: {
value: 2,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 25, 26, 27, 28, 29, 30 ]
},
28: {
value: 3,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 25, 26, 27, 28, 29, 30 ]
},
29: {
value: 2,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 25, 26, 27, 28, 29, 30 ]
},
30: {
value: 3,
desc: "300秒",
descDetail: "300秒托管",
reject: [ 25, 26, 27, 28, 29, 30 ]
},
31: {
value: 0,
desc: "不踢人",
descDetail: "",
reject: [ 31, 32, 33, 34, 35, 36 ]
},
32: {
value: 1,
desc: "15秒",
descDetail: "15秒踢人",
reject: [ 31, 32, 33, 34, 35, 36 ]
},
33: {
value: 2,
desc: "30秒",
descDetail: "30秒踢人",
reject: [ 31, 32, 33, 34, 35, 36 ]
},
34: {
value: 3,
desc: "60秒",
descDetail: "60秒踢人",
reject: [ 31, 32, 33, 34, 35, 36 ]
},
35: {
value: 2,
desc: "120秒",
descDetail: "120秒踢人",
reject: [ 31, 32, 33, 34, 35, 36 ]
},
36: {
value: 3,
desc: "300秒",
descDetail: "300秒踢人",
reject: [ 31, 32, 33, 34, 35, 36 ]
}
},
attr: {
1: {
desc: "人数",
weight: 70,
lineCount: 3,
defCheck: [ 5 ],
detailIds: [ 5, 6, 7 ]
},
2: {
desc: "局数",
weight: 90,
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 4, 8, 9 ]
},
3: {
desc: "支付",
weight: 100,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11, 12 ],
allIds: [ 10, 11, 12 ]
},
5: {
desc: "功能",
weight: 140,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20 ]
},
4: {
desc: "底分",
weight: 30,
lineCount: 3,
defCheck: [],
detailIds: [ 3 ]
},
8: {
desc: "封顶",
weight: 10,
lineCount: 3,
defCheck: [ 21 ],
detailIds: [ 21, 22, 23, 24 ]
},
6: {
desc: "玩法",
weight: 50,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2 ]
},
100: {
desc: "其它",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 13, 17, 15, 37 ]
},
101: {
desc: "托管",
weight: 130,
lineCount: 3,
defCheck: [ 25 ],
detailIds: [ 25, 26, 27, 28, 29, 30 ]
},
7: {
desc: "离线",
weight: 120,
lineCount: 3,
defCheck: [ 31 ],
detailIds: [ 31, 32, 33, 34, 35, 36 ]
}
}
},
21: {
index: 21,
category: 5,
name: "斗板凳",
ruleDescImgs: [],
gameCountMul: 8,
options: {
1: {
value: 8,
desc: "8局(4张房卡)",
reject: [ 1, 2, 3 ]
},
2: {
value: 12,
desc: "12局(8张房卡)",
reject: [ 1, 2, 3 ]
},
3: {
value: 16,
desc: "16局(8张房卡)",
reject: [ 1, 2, 3 ]
},
15: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ 1, 2, 3, 5, 10 ],
style: 1
},
4: {
value: 1,
desc: "抢庄玩法",
reject: [ 4, 5, 6 ]
},
5: {
value: 1,
desc: "传统地主",
reject: [ 4, 5, 6 ]
},
6: {
value: 1,
desc: "池底玩法",
reject: [ 4, 5, 6 ]
},
7: {
value: 1,
desc: "抢庄翻倍",
forceUncheck: [ 5, 6 ]
},
8: {
value: 1,
desc: "底牌不可见"
},
9: {
value: 1,
desc: "农民插底3包赔"
},
13: {
value: 1,
desc: "春天"
},
17: {
value: 1,
desc: "反春天"
},
16: {
value: 1,
desc: "3癞炸翻5倍"
},
10: {
value: 0,
desc: "房主支付",
reject: [ 10, 11, 12 ],
onlyHall: !0
},
11: {
value: 1,
desc: "AA支付",
reject: [ 10, 11, 12 ]
},
12: {
value: 2,
desc: "群主支付",
reject: [ 10, 11, 12 ],
onlyClub: !0
},
18: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 18 ]
},
19: {
value: 1,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 1,
desc: "允许观战"
},
31: {
value: 0,
desc: "不踢人",
descDetail: "",
reject: [ 31, 32, 33, 34 ]
},
32: {
value: 1,
desc: "30秒",
descDetail: "30秒踢人",
reject: [ 31, 32, 33, 34 ]
},
33: {
value: 2,
desc: "60秒",
descDetail: "60秒踢人",
reject: [ 31, 32, 33, 34 ]
},
34: {
value: 3,
desc: "120秒",
descDetail: "120秒踢人",
reject: [ 31, 32, 33, 34 ]
},
40: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 40, 41, 42, 43, 44, 45 ]
},
41: {
value: 15,
desc: "15秒",
descDetail: "15秒托管",
reject: [ 40, 41, 42, 43, 44, 45 ]
},
42: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 40, 41, 42, 43, 44, 45 ]
},
43: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 40, 41, 42, 43, 44, 45 ]
},
44: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 40, 41, 42, 43, 44, 45 ]
},
45: {
value: 600,
desc: "600秒",
descDetail: "600秒托管",
reject: [ 40, 41, 42, 43, 44, 45 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 1,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18 ],
hide: !0
},
2: {
desc: "局数",
weight: 10,
lineCount: 3,
defCheck: [ 3 ],
detailIds: [ 1, 2, 3 ]
},
3: {
desc: "支付",
weight: 70,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11, 12 ],
allIds: [ 10, 11, 12 ]
},
4: {
desc: "玩法",
weight: 50,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 5, 6, 7, 8, 9, 13, 17, 16 ]
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20, 200 ]
},
7: {
desc: "底分",
weight: 30,
lineCount: 3,
defCheck: [],
detailIds: [ 15 ]
},
6: {
desc: "离线踢人",
weight: 90,
lineCount: 3,
defCheck: [ 31 ],
detailIds: [ 31, 32, 33, 34 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 40 ],
detailIds: [ 40, 41, 42, 43, 44, 45 ]
}
}
},
22: {
index: 22,
category: 4,
name: "浠水五十K",
ruleDescImgs: [],
gameCountMul: 3,
options: {
1: {
value: 3,
desc: "3局(4张房卡)",
reject: [ 1, 2, 3, 4 ]
},
2: {
value: 6,
desc: "6局(8张房卡)",
reject: [ 1, 2, 3, 4 ]
},
3: {
value: 9,
desc: "9局(12张房卡)",
reject: [ 1, 2, 3, 4 ]
},
4: {
value: 12,
desc: "12局(16张房卡)",
reject: [ 1, 2, 3, 4 ]
},
5: {
value: 0,
desc: "房主支付",
reject: [ 5, 6, 7, 8 ],
onlyHall: !0
},
6: {
value: 1,
desc: "AA支付",
reject: [ 5, 6, 7, 8 ]
},
7: {
value: 2,
desc: "群主支付",
reject: [ 5, 6, 7, 8 ],
onlyClub: !0
},
8: {
value: 3,
desc: "大赢家支付",
reject: [ 5, 6, 7, 8 ],
isHide: !0
},
9: {
value: 10,
desc: "1分",
reject: [ 9, 10, 11, 12, 13 ]
},
10: {
value: 20,
desc: "2分",
reject: [ 9, 10, 11, 12, 13 ]
},
11: {
value: 30,
desc: "3分",
reject: [ 9, 10, 11, 12, 13 ]
},
12: {
value: 50,
desc: "5分",
reject: [ 9, 10, 11, 12, 13 ]
},
13: {
value: 100,
desc: "10分",
reject: [ 9, 10, 11, 12, 13 ]
},
17: {
value: 0,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 0,
desc: "允许观战"
},
18: {
value: 4,
desc: "4人",
descDetail: "4人房",
reject: [ 18 ]
},
28: {
value: 0,
desc: "不踢人",
reject: [ 28, 29, 30, 31 ]
},
29: {
value: 1,
desc: "30秒",
reject: [ 28, 29, 30, 31 ]
},
30: {
value: 2,
desc: "60秒",
reject: [ 28, 29, 30, 31 ]
},
31: {
value: 3,
desc: "120秒",
reject: [ 28, 29, 30, 31 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 1,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18 ],
hide: !0
},
2: {
desc: "局数",
weight: 2,
lineCount: 3,
defCheck: [ 1 ],
detailIds: [ 1, 2, 3, 4 ]
},
3: {
desc: "支付",
weight: 3,
lineCount: 3,
defCheck: [ 6 ],
detailIds: [ 5, 6, 7, 8 ]
},
4: {
desc: "底分",
lineCount: 3,
defCheck: [ 9 ],
detailIds: [ 9, 10, 11, 12, 13 ],
weight: 4
},
110: {
desc: "功能",
weight: 9,
lineCount: 3,
defCheck: [],
detailIds: [ 17, 20, 200 ]
},
10: {
desc: "离线踢人",
weight: 10,
lineCount: 3,
defCheck: [ 28 ],
detailIds: [ 28, 29, 30, 31 ]
}
}
},
23: {
index: 23,
category: 6,
name: "斗地主",
ruleDescImgs: [],
gameCountMul: 5,
options: {
1: {
value: 5,
desc: "5局(1张房卡)",
reject: [ 1, 2, 3 ]
},
2: {
value: 10,
desc: "10局(2张房卡)",
reject: [ 1, 2, 3 ]
},
3: {
value: 15,
desc: "15局(3张房卡)",
reject: [ 1, 2, 3 ]
},
15: {
value: 1,
desc: "分",
descDetail: "底分%s分",
reject: [ 1, 1.5, 2, 2.5, 3, 5, 10 ],
style: 1
},
16: {
value: 1,
desc: "三带对",
note: "可以出三带一对，飞机带对，四带两对"
},
21: {
value: 1,
desc: "6炸封顶"
},
22: {
value: 1,
desc: "允许加倍"
},
4: {
value: 0,
desc: "无赖子",
reject: [ 4, 5, 6, 7 ]
},
5: {
value: 1,
desc: "随机赖子",
reject: [ 4, 5, 6, 7 ]
},
6: {
value: 2,
desc: "花牌赖子",
reject: [ 4, 5, 6, 7 ]
},
7: {
value: 3,
desc: "花牌+随机赖子",
reject: [ 4, 5, 6, 7 ]
},
10: {
value: 0,
desc: "房主支付",
reject: [ 10, 11, 12 ],
onlyHall: !0
},
11: {
value: 1,
desc: "AA支付",
reject: [ 10, 11, 12 ]
},
12: {
value: 2,
desc: "群主支付",
reject: [ 10, 11, 12 ],
onlyClub: !0
},
18: {
value: 3,
desc: "3人",
descDetail: "3人房",
reject: [ 18 ]
},
19: {
value: 1,
desc: "语音房",
isHide: !0,
note: "开启之后，玩家将可实时听到语音，无法关闭。"
},
20: {
value: 1,
desc: "允许观战"
},
31: {
value: 0,
desc: "不踢人",
descDetail: "",
reject: [ 31, 32, 33, 34 ]
},
32: {
value: 1,
desc: "30秒",
descDetail: "30秒踢人",
reject: [ 31, 32, 33, 34 ]
},
33: {
value: 2,
desc: "60秒",
descDetail: "60秒踢人",
reject: [ 31, 32, 33, 34 ]
},
34: {
value: 3,
desc: "120秒",
descDetail: "120秒踢人",
reject: [ 31, 32, 33, 34 ]
},
40: {
value: 0,
desc: "不托管",
descDetail: "",
reject: [ 40, 42, 43, 44, 45 ]
},
42: {
value: 30,
desc: "30秒",
descDetail: "30秒托管",
reject: [ 40, 42, 43, 44, 45 ]
},
43: {
value: 60,
desc: "60秒",
descDetail: "60秒托管",
reject: [ 40, 42, 43, 44, 45 ]
},
44: {
value: 120,
desc: "120秒",
descDetail: "120秒托管",
reject: [ 40, 42, 43, 44, 45 ]
},
45: {
value: 180,
desc: "180秒",
descDetail: "180秒托管",
reject: [ 40, 42, 43, 44, 45 ]
},
200: {
value: 1,
desc: "无互动表情"
}
},
attr: {
1: {
desc: "人数",
weight: 1,
lineCount: 3,
defCheck: [ 18 ],
detailIds: [ 18 ],
hide: !0
},
2: {
desc: "局数",
weight: 10,
lineCount: 3,
defCheck: [ 3 ],
detailIds: [ 1, 2, 3 ]
},
3: {
desc: "支付",
weight: 40,
lineCount: 3,
defCheck: [ 11 ],
detailIds: [ 10, 11, 12 ],
allIds: [ 10, 11, 12 ]
},
4: {
desc: "玩法",
weight: 50,
lineCount: 3,
defCheck: [ 4 ],
detailIds: [ 4, 5, 6, 7 ]
},
5: {
desc: "功能",
weight: 110,
lineCount: 3,
defCheck: [],
detailIds: [ 19, 20, 200 ]
},
7: {
desc: "底分",
weight: 30,
lineCount: 3,
defCheck: [],
detailIds: [ 15 ]
},
8: {
desc: "其他",
weight: 60,
lineCount: 3,
defCheck: [ 16, 21 ],
detailIds: [ 16, 21, 22 ]
},
6: {
desc: "离线踢人",
weight: 90,
lineCount: 3,
defCheck: [ 31 ],
detailIds: [ 31, 32, 33, 34 ]
},
101: {
desc: "托管",
weight: 101,
lineCount: 3,
defCheck: [ 40 ],
detailIds: [ 40, 42, 43, 44, 45 ]
}
}
}
};
o.default = n;
cc._RF.pop();
