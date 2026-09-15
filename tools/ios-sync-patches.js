/**
 * 将 Android 发布包中已经确认过的跨平台修改，按原厂 iOS 代码结构逐项同步。
 *
 * iOS 继续使用自己的 Cocos 工程和场景，不能直接搬 Android 的整套 src/res；
 * 这里的每个必要补丁都校验唯一匹配，避免原厂代码变化后静默漏改。
 */
const u2b = (value) => Buffer.from(value, 'utf8').toString('binary');

const countOf = (source, needle) => source.split(needle).length - 1;

const replaceOnce = (source, label, from, to) => {
  const oldCount = countOf(source, from);
  const newCount = countOf(source, to);
  if (oldCount === 0 && newCount > 0) return source;
  if (oldCount !== 1) throw new Error(`iOS“${label}”补丁匹配到 ${oldCount} 处，预期 1 处`);
  return source.replace(from, to);
};

const replaceAll = (source, label, from, to, minimum = 1) => {
  const oldCount = countOf(source, from);
  const newCount = countOf(source, to);
  if (oldCount === 0 && newCount >= minimum) return source;
  if (oldCount < minimum) throw new Error(`iOS“${label}”补丁匹配到 ${oldCount} 处，至少需要 ${minimum} 处`);
  return source.split(from).join(to);
};

const applyIosSyncPatches = (input) => {
  let source = input;

  source = replaceOnce(
    source,
    '隐藏大厅手机认证按钮',
    'this.node.getChildByName("BtnBuyCard").active = !a.default.isReivew;',
    'var mobileBtn = this.node.getChildByName("BtnMobile");\nmobileBtn && (mobileBtn.active = !1);\nthis.node.getChildByName("BtnBuyCard").active = !a.default.isReivew;',
  );

  source = replaceOnce(
    source,
    '登录标题和许可证文字',
    'u.default.setImg("Hall/Res/Texture/Login/login_logo", this.logo);',
    'var e = this, t = this.node.getChildByName("login_bg"), o = t && t.getChildByName("IBSA");\n' +
      'o && (o.active = !1);\n' +
      'if (cc.sys.isNative) {\n' +
      'var n = jsb.fileUtils.fullPathForFilename("branding/login-logo.png");\n' +
      'cc.loader.load({ url: n, type: "png" }, function(t, o) {\n' +
      't ? u.default.setImg("Hall/Res/Texture/Login/login_logo", e.logo) : e.logo && e.logo.isValid && (e.logo.spriteFrame = new cc.SpriteFrame(o));\n' +
      '});\n' +
      '} else u.default.setImg("Hall/Res/Texture/Login/login_logo", this.logo);',
  );

  source = replaceOnce(
    source,
    '客户端显示版本',
    'assertVer: 108,\npackageVer: "1.0.2",',
    'assertVer: 234,\npackageVer: "1.0.5",',
  );

  source = replaceOnce(
    source,
    '隐藏潜江癞晃玩法',
    u2b('desc: "潜江癞晃",\nreject: [ 1, 2 ]'),
    u2b('desc: "潜江癞晃",\nreject: [ 1, 2 ],\nisHide: !0'),
  );
  source = replaceOnce(
    source,
    '土豪必杠玩法改名干瞪眼',
    u2b('desc: "土豪必杠",\nreject: [ 1, 2 ]'),
    u2b('desc: "干瞪眼",\nreject: [ 1, 2 ]'),
  );
  source = replaceOnce(
    source,
    '玩法只保留干瞪眼',
    u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 1 ],\ndetailIds: [ 1, 2 ]'),
    u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 2 ],\ndetailIds: [ 2 ]'),
  );
  source = replaceOnce(
    source,
    '已保存的旧玩法自动迁移',
    'this.index = e.index;\nthis._storageData = i.default.clone(e);',
    'this.index = e.index;\nthis._storageData = i.default.clone(e);\nif (this.index === l.eGameIds.QJHH && this._storageData.ids) {\nfor (var q = this._storageData.ids.length - 1; q >= 0; q--) if (1 === this._storageData.ids[q]) this._storageData.ids[q] = 2;\nthis._storageData.ids = this._storageData.ids.filter(function(e, t, o) { return o.indexOf(e) === t; });\n}',
  );
  source = replaceOnce(
    source,
    '创建俱乐部后进入俱乐部场景',
    '0 === t.error ? c.default.focus = e :',
    '0 === t.error ? (c.default.focus = e, cc.director.getScene().name !== u.default.ClubSceneName && s.default.uiHelper.loadScene(u.default.ClubSceneName)) :',
  );
  source = replaceAll(
    source,
    '隐藏语音房选项',
    u2b('desc: "语音房",\nnote: "开启之后，玩家将可实时听到语音，无法关闭。"'),
    u2b('desc: "语音房",\nisHide: !0,\nnote: "开启之后，玩家将可实时听到语音，无法关闭。"'),
  );

  source = replaceOnce(
    source,
    '实名输入规范化',
    'var t = this.nameLabel.string, o = this.idCardLabel.string;',
    u2b('var t = this.nameLabel.string.replace(/[\\s\\u00a0]+/g, "").replace(/[•・]/g, "·"), o = this.idCardLabel.string.replace(/\\s+/g, "").toUpperCase();'),
  );
  source = replaceOnce(
    source,
    '实名结果脱敏兼容',
    'this.nameLabel.string = i.default.realName.slice(0, 1) + "**";\nthis.cardLabel.string = i.default.idCard.slice(0, 6) + "*******" + i.default.idCard.slice(-4, i.default.idCard.length);',
    'this.nameLabel.string = i.default.realName.slice(0, 1) + "**";\nthis.cardLabel.string = i.default.idCard.indexOf("*") >= 0 ? i.default.idCard : i.default.idCard.slice(0, 6) + "********" + i.default.idCard.slice(-4, i.default.idCard.length);',
  );

  source = replaceOnce(
    source,
    '朝天暗杠手牌数量',
    'if (m.subType === i.eGangType.AnGang) y ? h.removeHandCards([ _, _, _, _ ], !0) : h.removeHandCards([ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0); else if (m.subType === i.eGangType.MingGang) {',
    'if (m.subType === i.eGangType.AnGang) y ? h.removeHandCards(u.default.gameLogic().is3CardGang(_) ? [ _, _, _ ] : [ _, _, _, _ ], !0) : h.removeHandCards(u.default.gameLogic().is3CardGang(_) ? [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ] : [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0); else if (m.subType === i.eGangType.MingGang) {',
  );
  source = replaceOnce(
    source,
    '朝天明杠手牌数量',
    'y ? h.removeHandCards([ _, _, _ ], !0) : h.removeHandCards([ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);\no();',
    'y ? h.removeHandCards(u.default.gameLogic().is3CardGang(_) ? [ _, _ ] : [ _, _, _ ], !0) : h.removeHandCards(u.default.gameLogic().is3CardGang(_) ? [ a.MJ_BACK_ID, a.MJ_BACK_ID ] : [ a.MJ_BACK_ID, a.MJ_BACK_ID, a.MJ_BACK_ID ], !0);\no();',
  );

  const delayedCheckType = `this._ids = s;
this.scheduleOnce(function() {
for (var o = n.layer.width, r = -o / 2, l = o / p, u = 0, d = s.length; u < d; u++) {
var f = s[u], h = r + u % p * l, y = 78 * Math.floor(u / p) + 19, g = a.cellStyle(f);
if (0 === g) {
var m = cc.instantiate(n.cellPre);
n.layer.addChild(m);
m.x = h;
m.y = -y;
m.getComponent(i.default).setData(e, t, f);
} else if (1 === g) {
m = cc.instantiate(n.cellStyle1Pre);
n.layer.addChild(m);
m.x = h;
m.y = -y;
m.getComponent(c.default).setData(e, t, f);
}
n._pos.push(cc.v2(h, -y));
}
n._updatePos();
});
};
t.prototype._updatePos = function() {`;
  const immediateCheckType = `this._ids = s;
var checkWidget = this.layer.getComponent(cc.Widget);
checkWidget && checkWidget.updateAlignment();
(function() {
for (var o = n.layer.width, r = -o / 2, l = o / p, u = 0, d = s.length; u < d; u++) {
var f = s[u], h = r + u % p * l, y = 78 * Math.floor(u / p) + 19, g = a.cellStyle(f);
if (0 === g) {
var m = cc.instantiate(n.cellPre);
n.layer.addChild(m);
m.x = h;
m.y = -y;
m.getComponent(i.default).setData(e, t, f);
} else if (1 === g) {
m = cc.instantiate(n.cellStyle1Pre);
n.layer.addChild(m);
m.x = h;
m.y = -y;
m.getComponent(c.default).setData(e, t, f);
}
n._pos.push(cc.v2(h, -y));
}
n._updatePos();
})();
};
t.prototype._updatePos = function() {`;
  source = replaceOnce(source, '创建房间设置立即绘制', delayedCheckType, immediateCheckType);

  source = replaceOnce(
    source,
    '列表关闭越界回弹',
    't.prototype.load = function(e) {\nvar t = this, o = this.node.getComponent(cc.ScrollView), n = this.node.getChildByName("scrollBar"), r = cc.find("view/content", this.node);',
    't.prototype.load = function(e) {\nvar t = this, o = this.node.getComponent(cc.ScrollView), n = this.node.getChildByName("scrollBar"), r = cc.find("view/content", this.node);\no.elastic = !1;',
  );

  source = replaceOnce(
    source,
    '抢杠胡语音优先级',
    u2b('e.prototype._huSound = function(e, t) {\nfor (var o = null, r = a.HuTypeBitConfig[e], i = this._sortIds(r), l = 0; l < i.length; l++) {\nvar c = parseInt(i[l]);\nif (n.default.checkBit(t, c)) {\no = r[c].sound;\nbreak;\n}\n}\no || (o = s.default.gameLogic().isZiMo(t) ? "zimo" : "hu");\nreturn o;\n};'),
    u2b('e.prototype._huSound = function(e, t) {\nvar o = null, r = a.HuTypeBitConfig[e];\nif (e === i.eGameIds.QJHH && r[16] && n.default.checkBit(t, 16)) return r[16].sound || "hu";\nfor (var h = this._sortIds(r), l = 0; l < h.length; l++) {\nvar c = parseInt(h[l]);\nif (n.default.checkBit(t, c)) {\no = r[c].sound;\nbreak;\n}\n}\no || (o = s.default.gameLogic().isZiMo(t) ? "zimo" : "hu");\nreturn o;\n};'),
  );

  source = replaceOnce(
    source,
    '俱乐部桌子刷新',
    u2b('e.prototype.getClubTableInfo = function(e, t, o) {\nvoid 0 === o && (o = !1);\nvar r = {\nclubId: e\n};\nn.default.sendMsg(122, r, function(o, n, r) {\nif (r) t(o, r); else {\nif (0 === o.res.error) {\nvar i = a.default.get(e).tableList();\ni.destroy();\nfor (var s = 0, c = o.rooms.length; s < c; s++) {\nvar u = new l.default(o.rooms[s]);\ni.update(u);\n}\n}\nt(o, null);\n}\n}, o);\n};'),
    u2b('e.prototype.getClubTableInfo = function(e, t, o) {\nvoid 0 === o && (o = !1);\nvar request = {\nclubId: e\n};\nn.default.sendMsg(122, request, function(response, unused, networkError) {\nif (networkError) t(response, networkError); else {\nif (0 === response.res.error) {\nvar tableList = a.default.get(e).tableList();\ntableList.destroy();\nfor (var roomIndex = 0, roomCount = response.rooms.length; roomIndex < roomCount; roomIndex++) {\nvar roomData = new l.default(response.rooms[roomIndex]);\ntableList.update(roomData);\n}\nr.default.eventUtils.emit(u.default.data_club_table_scheme_update);\n}\nt(response, null);\n}\n}, o);\n};'),
  );

  source = replaceOnce(
    source,
    '保存自己的邀请码',
    'r.default.inviteCode = t.inviteCode || "";\nr.default.inviteCodeAward = t.giveCard || 0;',
    'r.default.inviteCode = t.inviteCode || "";\nr.default.myInviteCode = t.username || "";\nr.default.inviteCodeAward = t.giveCard || 0;',
  );
  source = replaceOnce(
    source,
    '邀请码入口保持可查看',
    'a.default.isBindInviteCode() ? i.default.uiHelper.showWithNode(l.eWindowID.InviteCodeOK, this.bindInviteCodeOkPre) : i.default.uiHelper.showWithNode(l.eWindowID.InviteCode, this.bindInviteCodePre);',
    'i.default.uiHelper.showWithNode(l.eWindowID.InviteCode, this.bindInviteCodePre);',
  );
  source = replaceOnce(
    source,
    '邀请码页完整信息',
    u2b('t.prototype.start = function() {\nthis.inviteTipLabel.string = "绑定推荐人邀请码，可获得" + l.default.inviteCodeAward + "张房卡哦！";\n};'),
    u2b('t.prototype.start = function() {\nvar e = this, n = function() {\nvar o = l.default.myInviteCode || "", h = e.inactiveNode;\ne.inviteTipLabel.string = "绑定推荐人邀请码，可获得" + l.default.inviteCodeAward + "张房卡哦！";\nif (!h) return;\nvar tip = e.inviteTipLabel.node, name = h.getChildByName("LabelName"), input = h.getChildByName("InputName"), hint = h.getChildByName("LabelTip");\nif (tip) tip.y = 171;\nif (input) input.y = 1;\nif (hint) hint.y = -54;\nif (name) {\nname.setAnchorPoint(1, .5);\nname.setPosition(-128.4, -4);\n}\nvar row = h.getChildByName("MyInviteRow");\nif (!row) {\nrow = new cc.Node("MyInviteRow");\nrow.setPosition(0, 90);\nh.addChild(row);\nif (name) {\nvar title = cc.instantiate(name);\ntitle.name = "MyTitle";\ntitle.setPosition(name.x, 0);\nvar tw = title.getComponent(cc.Widget);\nif (tw) tw.destroy();\ntitle.getComponent(cc.Label).string = "我的邀请码：";\nrow.addChild(title);\n}\nvar bg = input && input.getChildByName("BACKGROUND_SPRITE");\nvar box = bg ? cc.instantiate(bg) : new cc.Node("MyCodeBox");\nbox.name = "MyCodeBox";\nvar ww = box.getComponent(cc.Widget);\nif (ww) { ww.enabled = !1; ww.destroy(); }\nbox.setContentSize(363, 56);\nbox.setPosition(input ? input.x : 63.5, 0);\nrow.addChild(box);\nvar code = new cc.Node("MyCode"), cl = code.addComponent(cc.Label);\ncl.useSystemFont = !0;\ncl.fontFamily = "sans-serif-medium";\ncl.fontSize = 30;\ncl.lineHeight = 36;\ncl.horizontalAlign = 0;\ncl.verticalAlign = 1;\ncl.spacingX = 4;\ncode.color = new cc.Color(151, 56, 26);\ncode.setAnchorPoint(0, .5);\nvar tl = input && input.getChildByName("TEXT_LABEL");\ncode.setPosition(tl ? tl.x : -173, 1);\nbox.addChild(code);\nvar src = h.getChildByName("BtnSign"), copy = src ? cc.instantiate(src) : new cc.Node("CopyInvite");\ncopy.name = "CopyInvite";\nvar bw = copy.getComponent(cc.Widget);\nif (bw) bw.destroy();\nvar bc = copy.getComponent(cc.Button);\nif (bc) bc.clickEvents = [];\nelse copy.addComponent(cc.Button);\ncopy.setScale(src ? .5 : 1, src ? .5 : 1);\ncopy.setPosition((input ? input.x : 63.5) + 254, 0);\nvar lab = copy.getChildByName("Label");\nif (lab && lab.getComponent(cc.Label)) lab.getComponent(cc.Label).string = "复 制";\nrow.addChild(copy);\ncopy.on(cc.Node.EventType.TOUCH_END, function() {\ns.default.clickBtn();\njsb.reflection.callStaticMethod("Utils", "copyText:", l.default.myInviteCode || "");\ni.default.uiHelper.showTip("复制成功！");\n});\n}\nvar show = row.getChildByName("MyCodeBox");\nshow = show && show.getChildByName("MyCode");\nif (show) show.getComponent(cc.Label).string = o;\nif (show && input) { var t2 = input.getChildByName("TEXT_LABEL"); if (t2) show.x = t2.x; }\nvar bound = l.default.inviteCode || "";\nif (bound) {\ne.inviteTipLabel.string = "已绑定推荐人邀请码";\nif (e.inviteCodeLabel) {\ne.inviteCodeLabel.useSystemFont = !0;\ne.inviteCodeLabel.fontFamily = "sans-serif-medium";\ne.inviteCodeLabel.fontSize = 30;\ne.inviteCodeLabel.string = bound;\ne.inviteCodeLabel.node.active = !0;\n}\nif (input) {\nvar eb = input.getComponent(cc.EditBox);\nif (eb) {\neb.string = bound;\neb.enabled = !1;\n}\nvar ph = input.getChildByName("PLACEHOLDER_LABEL");\nif (ph) ph.active = !1;\nvar tl = input.getChildByName("TEXT_LABEL");\nif (tl) tl.active = !0;\n}\nvar sign = h.getChildByName("BtnSign");\nif (sign) {\nvar sb = sign.getComponent(cc.Button);\nif (sb) {\nsb.interactable = !1;\nsb.clickEvents = [];\n}\nvar sl = sign.getChildByName("Label");\nif (sl && sl.getComponent(cc.Label)) sl.getComponent(cc.Label).string = "已绑定";\n}\n}\n};\nc.default.getInviteCode(function() { n(); }, !1);\n};'),
  );
  source = replaceOnce(
    source,
    '邀请码绑定后就地刷新',
    u2b('i.default.uiHelper.showTip("绑定成功！");\ni.default.uiHelper.remove(e);\ni.default.uiHelper.show(u.eWindowID.InviteCodeOK);'),
    u2b('i.default.uiHelper.showTip("绑定成功！");\ne.start();'),
  );
  source = replaceOnce(
    source,
    '邀请码成功页显示自己的码',
    u2b('this.inviteCodeLabel.string = "邀请码：" + a.default.inviteCode;'),
    u2b('this.inviteCodeLabel.string = "我的邀请码：" + (a.default.myInviteCode || "");'),
  );

  source = replaceOnce(
    source,
    '战绩页刷新当日统计',
    'var o = u.default.gameRecordList.collection(t, d.default.timerSort);\no.length < 1 ? this.noDataTipNode.active = !0 : this.noDataTipNode.active = !1;',
    'var o = u.default.gameRecordList.collection(t, d.default.timerSort);\no.length < 1 ? this.noDataTipNode.active = !0 : this.noDataTipNode.active = !1;\nthis._updateDayStat(o);',
  );
  source = replaceOnce(
    source,
    '战绩页当日总场次与总分',
    't.prototype._addItem = function(e, t) {',
    u2b('t.prototype._updateDayStat = function(e) {\nvar t = this.node.getChildByName("bg"), o = t && t.getChildByName("DateSelector");\nif (!o) return;\nvar n = o.getChildByName("DateInput"), r = n && n.getChildByName("input_date");\nr = r && r.getChildByName("DateLabel");\nvar i = 36, a = function(s, l) {\nvar c = t.getChildByName(s);\nif (!c) {\nc = r ? cc.instantiate(r) : new cc.Node(s);\nc.name = s;\nvar b = c.getComponent(cc.Label);\nif (!b) {\nb = c.addComponent(cc.Label);\nb.useSystemFont = !0;\nb.fontFamily = "sans-serif-medium";\nb.fontSize = 26;\nb.lineHeight = 26;\nc.color = new cc.Color(93, 70, 26);\n}\nc.setAnchorPoint(1, .5);\nt.addChild(c);\n}\nvar d = c.getComponent(cc.Label);\nd.overflow = 0;\nd.horizontalAlign = 2;\nd.string = l;\nd._updateRenderData && d._updateRenderData(!0);\nreturn c;\n};\nvar s = 0, l = u.default.uid;\nfor (var c = 0; c < e.length; c++) {\nvar d = u.default.gameRecordList.get(e[c]);\nif (d && d.players) for (var p = 0; p < d.players.length; p++) if (Number(d.players[p].uid) === Number(l)) {\ns += d.players[p].score;\nbreak;\n}\n}\nvar f = a("DayScore", "总分：" + s), h = a("DayGames", "总场次：" + e.length);\nvar m = o.x - ((n && n.width) || 260) / 2;\nf.setPosition(m - i, o.y);\nh.setPosition(m - i - f.width - i, o.y);\n};\nt.prototype._addItem = function(e, t) {'),
  );

  source = replaceOnce(
    source,
    '创建房间左侧列表边界',
    'p.setData(f, f === n);\nthis.listNode.addChild(d);\n}',
    'p.setData(f, f === n);\nthis.listNode.addChild(d);\n}\nthis._lockCreateRoomScroll(this.allGameList, this.listNode);',
  );
  source = replaceOnce(
    source,
    '创建房间右侧列表边界',
    'i.setData(this._chooseGameId, n, s);\n}\nthis._updateIp();\n};',
    'i.setData(this._chooseGameId, n, s);\n}\nthis._lockCreateRoomScroll(this.contentNdoe && this.contentNdoe.parent && this.contentNdoe.parent.parent && this.contentNdoe.parent.parent.getComponent(cc.ScrollView), this.contentNdoe);\nthis._updateIp();\n};',
  );
  source = replaceOnce(
    source,
    '创建房间列表尺寸刷新',
    't.prototype._updateIp = function() {',
    't.prototype._lockCreateRoomScroll = function(e, t) {\nif (!t) return;\nvar o = t.getComponent(cc.Layout);\nif (o) {\no._layoutDirty = !0;\no.updateLayout();\n}\nif (!(t.height > 0)) {\nvar n = o && void 0 !== o.spacingY ? o.spacingY : 0, r = (o && o.paddingTop || 0) + (o && o.paddingBottom || 0), i = t.children, a = 0;\nfor (var s = 0; s < i.length; s++) if (i[s].activeInHierarchy) {\na++;\nr += i[s].height;\n}\nr += Math.max(0, a - 1) * n;\nt.height = Math.max(r, 1);\n}\nif (e) {\ne.elastic = !1;\ne._calculateBoundary && e._calculateBoundary();\n}\n};\nt.prototype._updateIp = function() {',
  );

  source = replaceOnce(
    source,
    '切换俱乐部方案后刷新桌子',
    u2b('a.default.eventUtils.emit(s.default.data_club_get_scheme_list);\n} else a.default.uiHelper.showTip(e.res.what);'),
    u2b('a.default.eventUtils.emit(s.default.data_club_get_scheme_list);\nh.default.getClubTableInfo(e._clubId, function() { a.default.eventUtils.emit(s.default.data_club_table_scheme_update); }, !0);\n} else a.default.uiHelper.showTip(e.res.what);'),
  );

  return source;
};

module.exports = { applyIosSyncPatches };
