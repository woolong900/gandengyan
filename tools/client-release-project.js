/**
 * Build the one canonical client script used by full Android/iOS packages and
 * by Cocos hot updates. Keeping this in one place prevents a freshly installed
 * package from losing fixes that were previously only present after hot update.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { toJsc } = require('./jsc');
const { makeBuildDir } = require('./build-workspace');

const u2b = (value) => Buffer.from(value, 'utf8').toString('binary');

const replaceOptionalOnce = (source, label, from, to) => {
  const count = source.split(from).length - 1;
  if (count > 1) throw new Error(`${label}匹配到 ${count} 处，预期最多 1 处`);
  return count === 1 ? source.replace(from, to) : source;
};

const validateServiceBaseUrl = (value) => {
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error('服务地址必须是完整 HTTP(S) URL'); }
  if (!['http:', 'https:'].includes(parsed.protocol)
      || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('服务地址必须是不含路径、参数或锚点的 HTTP(S) 根地址');
  }
  return parsed;
};

const applyCompatibilityPatches = (input) => {
  let source = input;
  source = replaceOptionalOnce(
    source,
    '恢复说胡子大厅入口',
    'gameList: [ c.eGameIds.QJHH ],',
    'gameList: [ c.eGameIds.QJHH, c.eGameIds.QJSHZ ],',
  );
  source = replaceOptionalOnce(
    source,
    '只许自摸显示补丁',
    u2b('20: {\nvalue: 2,\ndesc: "只许自摸",\nisHide: !0\n}'),
    u2b('20: {\nvalue: 2,\ndesc: "只许自摸"\n}'),
  );
  source = replaceOptionalOnce(
    source,
    '只许自摸与热铳联动补丁',
    '} else this._checkbox(e);\n};\ne.prototype._checkbox = function(e) {',
    '} else {\nthis._checkbox(e);\nif (this.index === l.eGameIds.QJHH && 20 === e && !this.isChecked(20) && !this.isChecked(21)) this._checkbox(21);\n}\nif (this.index === l.eGameIds.QJHH && 2 === e) {\nfor (var q = [ 20, 21, 23 ], p = 0; p < q.length; p++) if (!this.isChecked(q[p])) this._checkbox(q[p]);\n}\n};\ne.prototype._checkbox = function(e) {',
  );
  source = replaceOptionalOnce(
    source,
    '干瞪眼默认规则补丁',
    'defCheck: [ 21, 23, 24 ],\ndetailIds: [ 20, 21, 23 ],',
    'defCheck: [ 20, 21, 23, 24 ],\ndetailIds: [ 20, 21, 23 ],',
  );
  source = replaceOptionalOnce(
    source,
    '干瞪眼玩法排序补丁',
    u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 2 ],\ndetailIds: [ 1, 2 ]'),
    u2b('desc: "玩法",\nweight: 1,\nlineCount: 3,\ndefCheck: [ 2 ],\ndetailIds: [ 2, 1 ]'),
  );
  source = replaceOptionalOnce(
    source,
    '强制隐藏测试账号输入框',
    'this.ebTestAccount.node.active = v.default.isDebug();',
    'this.ebTestAccount.node.active = false;',
  );
  source = replaceOptionalOnce(
    source,
    '强制隐藏测试ID登录按钮',
    'this.btnTestLogin.node.active = v.default.isDebug();',
    'this.btnTestLogin.node.active = false;',
  );

  // R243 coupled the drawn-card spacing flag to the ting indicator. A peng has
  // no drawn card, so the indicator disappeared. Ting calculation and spacing
  // must remain independent in both the 2D and 3D renderers.
  source = replaceOptionalOnce(
    source,
    '2D 碰后听牌提示补丁',
    'c = h.default.b3N2(i.length) && e._handDrawnCard, d = 0',
    'c = h.default.b3N2(i.length), d = 0',
  );
  source = replaceOptionalOnce(
    source,
    '2D 摸牌间距条件补丁',
    'if (c && d === f - 1) {\nvar C = u.default[t].lastHandSpace',
    'if (c && e._handDrawnCard && d === f - 1) {\nvar C = u.default[t].lastHandSpace',
  );
  source = replaceOptionalOnce(
    source,
    '3D 碰后听牌提示补丁',
    'var o = e.handCards.length, n = c.default.b3N2(o) && e._handDrawnCard;\nt === a.eViewPos.Down',
    'var o = e.handCards.length, n = c.default.b3N2(o), C = n && e._handDrawnCard;\nt === a.eViewPos.Down',
  );
  source = replaceOptionalOnce(
    source,
    '3D 摸牌间距条件补丁',
    'if (n && l === o - 1) {\nf.x = this.handX(l, !0);',
    'if (C && l === o - 1) {\nf.x = this.handX(l, !0);',
  );
  return source;
};

const assertCurrentFixes = (source) => {
  const required = [
    ['说胡子入口', 'gameList: [ c.eGameIds.QJHH, c.eGameIds.QJSHZ ],'],
    ['游客登录入口', 'this.guestNode.active = true;'],
    ['测试账号输入框隐藏', 'this.ebTestAccount.node.active = false;'],
    ['测试ID登录按钮隐藏', 'this.btnTestLogin.node.active = false;'],
    ['手机登录隐藏', 'this.mobileNode.active = !1;'],
    ['iOS 游客设备标识', 'jsb.reflection.callStaticMethod("TalkingDataGA", "getDeviceId")'],
    ['微信 AppID 迁移标记', 'this.wxAppId = this._builder("wx_app_id", n.global);'],
    ['微信 AppID 迁移请求', 'accountType: "wxMigration",'],
    ['微信一次性迁移票据', 'migrationTicket: void 0'],
    ['跨端邀请码复制', 'm.default.copyText(l.default.myInviteCode || "");'],
    ['2D 碰后听牌提示', 'c = h.default.b3N2(i.length), d = 0'],
    ['2D 摸牌间距', 'if (c && e._handDrawnCard && d === f - 1)'],
    ['3D 碰后听牌提示', 'var o = e.handCards.length, n = c.default.b3N2(o), C = n && e._handDrawnCard;'],
    ['3D 摸牌间距', 'if (C && l === o - 1)'],
    ['牌面异步加载防串图', 'o.__qjqpImgRequestId === n'],
    ['说胡子最新出牌定位', 'this.siteInfos.setLastPut(e);'],
    ['说胡子无牌可压提示', u2b('"没有牌大过对方"')],
    ['说胡子千分整牌资源', 'return "Games/Poker/card_" + t + o;'],
    ['说胡子千分手牌间距', 'var t = .93 * (this._totalW - 127);'],
    ['说胡子喜钱输入框', 't.prototype._makeXiAmountCell = function(t, o) {'],
    ['说胡子喜钱规则', 't.prototype.xiRuleText = function(e) {'],
    ['说胡子喜钱结算提示', '"game_xi" === t && this._showXiMoney(o);'],
    ['战绩玩法动态名称', 'e.prototype.playName = function() {'],
    ['房间结束分享只显示玩法名', 'u = "' + u2b('玩法：') + '" + o;'],
    ['单局结算算分隐藏喜钱明细', 'n = String(n || "").split("' + u2b(',喜钱：') + '")[0];'],
    ['潜江晃晃玩法名', u2b('desc: "潜江晃晃"')],
    ['应用下载分享地址', 'var t = this.downloadBaseUrl() + "/download";'],
    ['客服会话历史', 'msghead: "support_history"'],
    ['客服消息实时分发', 'eventUtils.emit("support_chat_update"'],
    ['热更新停滞自动恢复', 'Date.now() - this._lastProgressAt >= 3e4'],
    ['热更新失败断点重试', 'this._am.downloadFailedAssets();'],
    ['热更新临时文件自愈', 'this._storagePath + "_temp/"'],
    ['热更新恢复状态持久化', '__QJQP_HOT_UPDATE_RECOVERY__'],
    ['热更新下载量提示', 'this._eventNumber(t, "getDownloadedBytes")'],
    ['热更新阶段明确提示', u2b('正在更新游戏资源，请勿退出')],
    ['热更新界面优先绘制', 't.scheduleOnce(function() {\nt.hotUpdate.hotUpdate(n.version, l);\n}, .05);'],
    ['俱乐部右侧扩展', 'var t = cc.winSize.width - e;\nthis.node.width = t;\nthis.node.height = cc.winSize.height;'],
    ['俱乐部左侧保留安全区', 'this.node.anchorX = (cc.winSize.width / 2 - e) / t;'],
    ['俱乐部顶部遮罩独立右侧补片', 'var topExtension = new cc.Node("TopPanalRightExtension");\ntopExtension.parent = this.contentRoot;'],
    ['俱乐部右侧补片按安全区定位', 'topExtension.x = this.contentRoot.width / 2;'],
    ['俱乐部背景等比例铺满', 'Math.max(cc.winSize.width / o.width, cc.winSize.height / o.height)'],
  ];
  for (const [label, snippet] of required) {
    if (!source.includes(snippet)) throw new Error(`客户端单一源码缺少“${label}”修复`);
  }
};

const buildReleaseProjectSource = ({
  root = path.join(__dirname, '..'),
  workDir,
  assetVersion,
  packageVersion = '1.0.6',
  serviceBaseUrl,
  allowPrivateServiceUrl = false,
} = {}) => {
  if (!Number.isSafeInteger(Number(assetVersion)) || Number(assetVersion) < 1) {
    throw new Error('资源版本必须是正整数');
  }
  const serviceUrl = validateServiceBaseUrl(serviceBaseUrl);
  const ownWork = !workDir;
  const targetWork = workDir || makeBuildDir('qjqp-client-release');
  try {
    fs.mkdirSync(targetWork, { recursive: true });
    const output = path.join(targetWork, 'canonical-project.js');
    execFileSync(process.execPath, [
      path.join(root, 'tools', 'build-recovered-bundle.js'),
      path.join(root, 'client-release-source'),
      output,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let source = fs.readFileSync(output).toString('binary');
    source = applyCompatibilityPatches(source);

    const versionPattern = /assertVer: \d+,\npackageVer: "[^"]+",/g;
    const versions = source.match(versionPattern) || [];
    if (versions.length !== 1) {
      throw new Error(`project.jsc 资源版本字段匹配到 ${versions.length} 处，预期 1 处`);
    }
    source = source.replace(
      versionPattern,
      `assertVer: ${Number(assetVersion)},\npackageVer: "${packageVersion}",`,
    );

    const serviceHttp = serviceBaseUrl.replace(/\/$/, '');
    const serviceWs = `${serviceUrl.protocol === 'https:' ? 'wss:' : 'ws:'}//${serviceUrl.host}`;
    source = source
      .split('https://gmhiu.com').join(serviceHttp)
      .split('wss://gmhiu.com').join(serviceWs)
      .split('https://game.auxvv.com').join(serviceHttp)
      .split('wss://game.auxvv.com').join(serviceWs);

    const forbiddenEndpoints = [
      /https?:\/\/(?:localhost|127\.0\.0\.1)(?=[:/"'])/i,
      /https?:\/\/10\.\d+\.\d+\.\d+(?=[:/"'])/i,
      /https?:\/\/192\.168\.\d+\.\d+(?=[:/"'])/i,
      /https?:\/\/172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+(?=[:/"'])/i,
      /wss?:\/\/(?:localhost|127\.0\.0\.1)(?=[:/"'])/i,
      /wss?:\/\/10\.\d+\.\d+\.\d+(?=[:/"'])/i,
      /wss?:\/\/192\.168\.\d+\.\d+(?=[:/"'])/i,
      /wss?:\/\/172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+(?=[:/"'])/i,
    ];
    if (!allowPrivateServiceUrl && forbiddenEndpoints.some((candidate) => candidate.test(source))) {
      throw new Error('project.jsc 含本机或内网服务地址，拒绝发布');
    }
    for (const endpoint of [`${serviceHttp}/version`, `${serviceHttp}/login`, `${serviceWs}/ws`]) {
      if (!source.includes(endpoint)) throw new Error(`project.jsc 缺少目标服务地址：${endpoint}`);
    }
    assertCurrentFixes(source);
    new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(source, 'binary'));
    return source;
  } finally {
    if (ownWork) fs.rmSync(targetWork, { recursive: true, force: true });
  }
};

const buildReleaseProjectJsc = (options) => toJsc(Buffer.from(buildReleaseProjectSource(options), 'binary'));

module.exports = {
  applyCompatibilityPatches,
  assertCurrentFixes,
  buildReleaseProjectSource,
  buildReleaseProjectJsc,
};
