// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "d6484OslHhEF5RmE0HIDXYZ", "ReportLayer");
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
var i = e("./BaseComponent"), a = e("./gContext"), s = e("./SoundUtils"), l = e("./CenterMsg"), c = e("./ExUtils"), u = e("./CommonEnum"), d = e("./Image"), p = cc._decorator, f = p.ccclass, h = p.property, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._upLoadFile1 = null;
t._upLoadFile2 = null;
t._upLoadFile3 = null;
t.nameLabel = null;
t.idCardLabel = null;
t.mailLabel = null;
t.telLabel = null;
t.reportLable = null;
t.card_1 = null;
t.card_2 = null;
t.card_3 = null;
return t;
}
t.prototype.start = function() {
this._initData();
};
t.prototype.update = function() {};
t.prototype._initData = function() {
this._upLoadFile1 = null;
this._upLoadFile2 = null;
this._upLoadFile3 = null;
};
t.prototype.register = function() {
var e = this;
s.default.clickBtn();
var t = this.nameLabel.string, o = this.idCardLabel.string, n = this.mailLabel.string, r = this.telLabel.string, i = this.reportLable.string;
if (t) if (n) if (r) if (o) if (this._upLoadFile1) if (this._upLoadFile2) if (i) {
a.default.uiHelper.showUploadFile();
this._uploadFileImg(function() {
var s = {
realName: t,
idCard: o,
tel: r,
mail: n,
reportLable: i
};
l.default.reporting(s, function(t, o) {
a.default.uiHelper.removeLoading();
if (o) a.default.uiHelper.showTipNetError(); else if (0 === t.res.error) {
a.default.uiHelper.showTip("提交成功！");
a.default.uiHelper.remove(e);
} else a.default.uiHelper.showTip(t.res.what);
});
});
} else a.default.uiHelper.showTip("违法描述还没填哦~"); else a.default.uiHelper.showTip("身份证还未上传哦~"); else a.default.uiHelper.showTip("身份证还未上传哦~"); else a.default.uiHelper.showTip("身份证号还没填哦~"); else a.default.uiHelper.showTip("联系电话还没填哦~"); else a.default.uiHelper.showTip("邮箱还没填哦~"); else a.default.uiHelper.showTip("姓名还没填哦~");
};
t.prototype.uploadImageIdCard1 = function() {
var e = this;
s.default.clickBtn();
c.default.localPhoto(function(t, o) {
e.card_1.node.active = t === u.eExCallBackMsg.success;
if (t === u.eExCallBackMsg.success) {
e.card_1.url = o;
e._upLoadFile1 = o;
} else {
e._upLoadFile1 = null;
a.default.uiHelper.showTip("身份证上传失败~");
}
});
};
t.prototype.uploadImageIdCard2 = function() {
var e = this;
s.default.clickBtn();
c.default.localPhoto(function(t, o) {
e.card_2.node.active = t === u.eExCallBackMsg.success;
if (t === u.eExCallBackMsg.success) {
e.card_2.url = o;
e._upLoadFile2 = o;
} else {
e._upLoadFile2 = null;
a.default.uiHelper.showTip("身份证上传失败~");
}
});
};
t.prototype.uploadImageIdCard3 = function() {
var e = this;
s.default.clickBtn();
c.default.localPhoto(function(t, o) {
e.card_3.node.active = t === u.eExCallBackMsg.success;
if (t === u.eExCallBackMsg.success) {
e.card_3.url = o;
e._upLoadFile3 = o;
} else {
e._upLoadFile3 = null;
a.default.uiHelper.showTip("游戏截屏上传失败~");
}
});
};
t.prototype._uploadFileImg = function(e) {
var t = [];
null !== this._upLoadFile1 && t.push(this._upLoadFile1);
null !== this._upLoadFile2 && t.push(this._upLoadFile2);
null !== this._upLoadFile3 && t.push(this._upLoadFile3);
if (t.length <= 0) e && "function" == typeof e && e(); else for (var o = 0, n = 0; n < t.length; n++) {
var r = t[n];
c.default.uploadFile(r, r, function(n, r) {
n === u.eExCallBackMsg.success ? (o += 1) >= t.length && e && "function" == typeof e && e() : cc.error("图片上传失败~", n);
});
}
};
r([ h(cc.Label) ], t.prototype, "nameLabel", void 0);
r([ h(cc.Label) ], t.prototype, "idCardLabel", void 0);
r([ h(cc.Label) ], t.prototype, "mailLabel", void 0);
r([ h(cc.Label) ], t.prototype, "telLabel", void 0);
r([ h(cc.Label) ], t.prototype, "reportLable", void 0);
r([ h(d.default) ], t.prototype, "card_1", void 0);
r([ h(d.default) ], t.prototype, "card_2", void 0);
r([ h(d.default) ], t.prototype, "card_3", void 0);
return t = r([ f ], t);
}(i.default);
o.default = m;
cc._RF.pop();
