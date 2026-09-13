// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "234290iqUdCoqWIODX8/B9J", "ClubTableSchemeCellData");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonEnum"), r = e("./RoomConfigCellData"), i = e("./gContext"), a = e("./CommonUtils"), s = e("./GameConfig"), l = {
0: {
color: cc.color(46, 120, 165),
path: "Hall/Res/Texture/Club/New/color_0"
},
1: {
color: cc.color(178, 74, 75),
path: "Hall/Res/Texture/Club/New/color_1"
},
2: {
color: cc.color(183, 123, 1),
path: "Hall/Res/Texture/Club/New/color_2"
},
3: {
color: cc.color(66, 139, 96),
path: "Hall/Res/Texture/Club/New/color_3"
},
4: {
color: cc.color(155, 53, 136),
path: "Hall/Res/Texture/Club/New/color_4"
}
}, c = function() {
function e(e) {
this.id = 0;
this.name = "";
this.gameType = n.eGameIds.HZHH;
this._num = 0;
this._param1 = 0;
this._param2 = 0;
this.roomConfig = null;
this._auto = !1;
this.color = "0";
this.id = e.id;
this.name = e.name;
this.gameType = e.gameType;
this._num = e.num;
this._param1 = e.param1;
this._param2 = e.param2;
this._auto = e.auto || !1;
var t = a.default.gameNum2Count(this.gameType, this._num), o = i.default.gameLogic(this.gameType).roomParam2Config(t, this._param2, this._param1);
this.roomConfig = new r.default({
index: this.gameType,
ipLimit: o.ipLimit,
ids: o.ids,
other: o.other
});
var l = [ 3, 4, 5, 6, 7 ].includes(e.gameType) ? e.gameType - 3 + "" : "0";
s.default.area() === n.eArea.HS ? this.color = e.color || "0" : this.color = e.color || l;
}
e.prototype.getAllColor = function() {
return l;
};
e.prototype.getColorData = function() {
return l[this.color];
};
return e;
}();
o.default = c;
cc._RF.pop();
