#!/usr/bin/env node
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { GameApp } = require('../server/app');
const { Table } = require('../server/table');
const { Round } = require('../server/round');
const rules = require('../server/rules');
const qjshzRules = require('../server/qjshz-rules');
const { emptyMember } = require('../server/shared');
const { AdminAuth, passwordRecord, hashSessionId } = require('../server/admin-auth');
const { HotUpdateService } = require('../server/hot-update');

let passed = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); passed++; };

const run = async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-admin-test-'));
  process.env.QJQP_DB = path.join(dir, 'state.sqlite');
  process.env.QJQP_STATE = path.join(dir, 'absent.json');
  const store = require('../server/store');
  const authFile = path.join(dir, 'admin-password.json');
  fs.writeFileSync(authFile, JSON.stringify(passwordRecord('VeryStrongAdminPassword123!')));
  const app = new GameApp({ now: () => Date.now(), persist: () => {} });
  const guest = app.loginGuest('device-admin-123456');
  const player = guest.player;
  player.lastIp = '114.117.178.215';
  player.lastIpCity = '广东省 深圳市';
  player.lastIpAt = Date.now();
  const { club } = app.clubStore.create(player.uid, '后台测试俱乐部');
  const config = rules.parseConfig(0, 0);
  const table = new Table({ roomId: 100000, gameType: 2, clubId: 0, num: 1, param1: 0,
    param2: 0, host: player.uid, config }, app.tableHost(100000));
  app.tables.set(table.roomId, table);
  app.records.push({ id: 'R100000123', roomId: 100000, time: Date.now(),
    gameCount: 1, totalCount: 8, players: [{ uid: player.uid, name: player.nickname, score: 10 }],
    details: [{ id: 'R1', scores: [{ uid: player.uid, score: 10 }] }], uids: [player.uid] });
  store.save(app.dump());
  store.appendAgentApplication({ uid: player.uid, nickname: player.nickname,
    contact: 'weixin_admin_test', contactType: '微信号', createdAt: Date.now() });
  check('现有战绩回填归档', store.backfillRecords(app.records), 1);
  check('重复回填不会生成重复战绩', store.backfillRecords(app.records), 0);
  const hotUpdateRoot = path.join(dir, 'hot-update');
  const hotUpdateConfig = path.join(dir, 'hot-update.json');
  fs.mkdirSync(path.join(hotUpdateRoot, 'android/268'), { recursive: true });
  fs.mkdirSync(path.join(hotUpdateRoot, 'android/269'), { recursive: true });
  fs.writeFileSync(hotUpdateConfig, JSON.stringify({ schemaVersion: 1, platforms: { android: {
    enabled: true, stableAssetVersion: 268, latestAssetVersion: 269,
    rollout: { enabled: true, percentage: 0, includeUids: [], includeDeviceIds: [] },
  } } }));
  const hotUpdate = new HotUpdateService({ root: hotUpdateRoot, configFile: hotUpdateConfig });
  hotUpdate.versionBody(new URLSearchParams({ os_type: 'qjqp_android_yuanlai', package_version: '1.0.6',
    assert_version: '268', rollout_key: 'admin-test-phone', uid: String(player.uid),
    device_name: 'Android 15' }), 'https://game.example');
  const { createAdminHttp } = require('../server/admin-http');
  const admin = createAdminHttp({ app, store, hotUpdate, authFile,
    flush: async () => store.save(app.dump()) });
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    void admin.handler(req, res, url).catch((error) => { console.error(error); res.writeHead(500).end(); });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  let csrf = '';
  const request = async (route, method = 'GET', body, withAuth = true, withCsrf = true) => {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (withAuth && cookie) headers.Cookie = cookie;
    if (withCsrf && csrf) headers['X-CSRF-Token'] = csrf;
    const response = await fetch(`${base}/admin/api${route}`, { method, headers,
      body: body === undefined ? undefined : JSON.stringify(body) });
    const payload = await response.json();
    return { status: response.status, body: payload, cookie: response.headers.get('set-cookie') };
  };
  try {
    check('后台页面可打开', (await fetch(`${base}/admin`)).status, 200);
    const adminScript = await (await fetch(`${base}/admin/app.js`)).text();
    const adminStyle = await (await fetch(`${base}/admin/style.css`)).text();
    check('侧边栏菜单可独立滚动且底部系统菜单不溢出深色背景',
      adminStyle.includes('#nav{display:flex;flex:1;min-height:0;') &&
      adminStyle.includes('overflow-x:hidden;overflow-y:auto') &&
      adminStyle.includes('.sidebar-footer{flex:none;') &&
      adminStyle.includes('height:100vh;padding:28px 15px 20px;display:flex;flex-direction:column;overflow:hidden'), true);
    check('后台页面包含说胡子指定起手牌功能',
      adminScript.includes('下一局指定起手牌') && adminScript.includes('/next-wsk-hand') &&
      adminScript.includes('room-wsk-player') && adminScript.includes('room-wsk-count') &&
      !adminScript.includes('name="rank_'), true);
    check('麻将房间使用头像玩家卡选择指定摸牌玩家',
      adminScript.includes('room-draw-player') && !adminScript.includes('room-target-select'), true);
    check('麻将与说胡子的后台指定牌操作按钮样式统一',
      adminScript.includes('room-plan-actions') && adminStyle.includes('.room-plan-button.primary') &&
      adminStyle.includes('.room-plan-button.secondary'), true);
    check('后台房间玩家卡显示麻将和说胡子手牌',
      adminScript.includes('room-player-hand') && adminScript.includes('pokerHandCard') &&
      adminStyle.includes('.room-player-card') && adminStyle.includes('.poker-hand-card'), true);
    check('房间玩家卡可直接选为配牌目标且不重复显示玩家选择器',
      adminScript.includes("var selectableAction = isWsk ? 'room-wsk-player' : (room.wall ? 'room-draw-player' : '')") &&
      adminScript.includes('room-player-card\' + (selectable ? \' selectable') &&
      !adminScript.includes('<label>选择目标玩家</label>'), true);
    check('玩家手牌与配牌操作区使用左右布局',
      adminScript.includes('room-workbench') && adminScript.includes('room-player-pane') &&
      adminScript.includes('room-plan-pane') && adminStyle.includes('.room-workbench{display:grid') &&
      adminStyle.includes('.modal-card.room-modal-card'), true);
    check('房间状态、俱乐部、局数和入座信息合并到房间号标题',
      adminScript.includes("var roomTitle = '房间 #' + room.roomId + ' · 状态：'") &&
      adminScript.includes("' · 俱乐部：'") && adminScript.includes("' · 局数：'") &&
      adminScript.includes("' · 入座：'"), true);
    check('麻将使用不显示实际顺序的按牌面归类牌堆选牌',
      adminScript.includes('class="wall-choices"') && adminScript.includes('class="wall-tile"') &&
      adminScript.includes('data-action="room-card-add"') &&
      adminScript.includes('未指定摸牌顺序的可选牌堆（按牌面归类）') &&
      !adminScript.includes('class="wall-position') && !adminScript.includes('实际剩余摸牌顺序'), true);
    check('麻将已指定牌序标题只渲染一次',
      (adminScript.match(/已指定的后续牌序/g) || []).length, 1);
    check('玩家、房间、牌局和俱乐部管理页均提供刷新数据按钮',
      (adminScript.match(/button\('refresh', '刷新数据'/g) || []).length >= 4, true);
    check('后台提供热更新灰度配置与全量提升入口',
      adminScript.includes('热更新灰度发布') && adminScript.includes('hot-update-promote') &&
      adminScript.includes('includeDeviceIds'), true);
    const tileResponse = await fetch(`${base}/admin/tiles/mj_0_1.png`);
    check('后台麻将牌图片可打开', [tileResponse.status, tileResponse.headers.get('content-type')],
      [200, 'image/png']);
    check('非牌图路径不能读取文件', (await fetch(`${base}/admin/tiles/../admin-password.json`)).status, 404);
    check('未登录不可读取玩家', (await request('/players')).status, 401);
    check('密码错误不可登录', (await request('/login', 'POST', { password: 'wrong' }, false)).status, 401);
    const login = await request('/login', 'POST', { password: 'VeryStrongAdminPassword123!' }, false);
    check('正确密码登录', login.status, 200);
    cookie = login.cookie.split(';')[0]; csrf = login.body.csrf;
    check('会话 Cookie 不可被脚本读取', login.cookie.includes('HttpOnly; SameSite=Strict'), true);
    check('后台数据面板显示真人玩家', (await request('/dashboard')).body.totals.players, 1);
    const hotStatus = await request('/hot-update');
    check('后台可读取热更新稳定版与候选版', [hotStatus.body.platforms.android.stableAssetVersion,
      hotStatus.body.platforms.android.latestAssetVersion], [268, 269]);
    check('后台显示设备上报的玩家和版本', [hotStatus.body.devices[0].id,
      hotStatus.body.devices[0].uid, hotStatus.body.devices[0].assetVersion,
      hotStatus.body.devices[0].system], ['admin-test-phone', String(player.uid), 268, 'Android 15']);
    check('缺少 CSRF 不能修改灰度配置', (await request('/hot-update/android', 'PUT',
      { stableAssetVersion: 268, latestAssetVersion: 269, rolloutEnabled: true,
        percentage: 10, includeUids: [player.uid] }, true, false)).status, 403);
    const includedDevice = await request('/hot-update/android', 'PUT',
      { action: 'include-device', deviceId: 'admin-test-phone' });
    check('后台可将已上报设备直接加入灰度', includedDevice.body.rollout.includeDeviceIds,
      ['admin-test-phone']);
    const removedDevice = await request('/hot-update/android', 'PUT',
      { action: 'remove-device', deviceId: 'admin-test-phone' });
    check('后台可将设备移出灰度', removedDevice.body.rollout.includeDeviceIds, []);
    const hotSaved = await request('/hot-update/android', 'PUT', {
      stableAssetVersion: 268, latestAssetVersion: 269, rolloutEnabled: true,
      percentage: 10, includeUids: [player.uid], includeDeviceIds: ['qa-phone'],
      excludeUids: [], excludeDeviceIds: [],
    });
    check('后台可保存灰度比例和指定玩家设备', [hotSaved.status, hotSaved.body.rollout.percentage,
      hotSaved.body.rollout.includeUids, hotSaved.body.rollout.includeDeviceIds],
    [200, 10, [String(player.uid)], ['qa-phone']]);
    const promoted = await request('/hot-update/android', 'PUT', { action: 'promote' });
    check('后台可将候选版提升为全量稳定版', [promoted.body.stableAssetVersion,
      promoted.body.rollout.enabled], [269, false]);
    check('玩家查询不泄露登录 token', JSON.stringify((await request('/players')).body).includes(guest.token), false);
    const playersByIp = await request('/players?q=114.117.178.215');
    check('玩家管理显示并可查询 IP 与城市', [playersByIp.body.total,
      playersByIp.body.items[0].lastIp, playersByIp.body.items[0].lastIpCity],
    [1, '114.117.178.215', '广东省 深圳市']);
    const playerDetail = await request(`/players/${player.uid}`);
    check('玩家详情显示 IP 与城市', [playerDetail.body.lastIp, playerDetail.body.lastIpCity],
      ['114.117.178.215', '广东省 深圳市']);
    const applications = await request('/agent-applications?q=weixin_admin');
    check('后台可查询合伙人申请', [applications.status, applications.body.total,
      applications.body.items[0].uid, applications.body.items[0].contact],
    [200, 1, player.uid, 'weixin_admin_test']);
    check('缺少 CSRF 不能调整房卡', (await request(`/players/${player.uid}/cards`, 'POST',
      { delta: 20, reason: '测试充值记录' }, true, false)).status, 403);
    check('不允许扣成负余额', (await request(`/players/${player.uid}/cards`, 'POST',
      { delta: -20000, reason: '测试扣费记录' })).status, 400);
    const cards = await request(`/players/${player.uid}/cards`, 'POST', { delta: 20, reason: '测试充值记录' });
    check('调整房卡', [cards.status, cards.body.after], [200, 220]);
    check('账号详情只显示脱敏字段', 'identityIdHash' in (await request(`/players/${player.uid}`)).body, false);
    check('房间列表有当前房间', (await request('/rooms')).body.total, 1);
    check('房间详情可读', (await request('/rooms/100000')).body.roomId, 100000);
    const debugMembers = [emptyMember(player, { site: 1, online: true }),
      emptyMember({ uid: 999999, nickname: '调试陪玩' }, { site: 2, online: false, bot: true })];
    table.members = debugMembers;
    const debugRound = new Round(debugMembers,
      { config, dealerSeat: 0 }, { log() {}, each() {}, all() {}, one() {} });
    debugRound.start();
    table.round = debugRound;
    const chosen = debugRound.wall.remainCards().at(-1);
    const mahjongRoomDetail = (await request('/rooms/100000')).body;
    check('开局房间可读剩余牌堆', mahjongRoomDetail.wall.cards.length, debugRound.wall.remain());
    check('麻将房返回每位玩家完整手牌',
      mahjongRoomDetail.members.map((member) => member.hand),
      debugMembers.map((member) => debugRound.looseTiles(debugRound.seatOf(member.player.uid))));
    check('麻将房单独标识刚摸牌', mahjongRoomDetail.members[0].drawnCard, debugRound.drawn[0]);
    check('缺少 CSRF 不允许修改摸牌顺序', (await request('/rooms/100000/draw-plan', 'POST',
      { uid: player.uid, cards: [chosen] }, true, false)).status, 403);
    check('牌堆中不存在的牌不可指定', (await request('/rooms/100000/draw-plan', 'POST',
      { uid: player.uid, cards: [999] })).status, 400);
    check('后台可指定摸牌顺序', (await request('/rooms/100000/draw-plan', 'POST',
      { uid: player.uid, cards: [chosen] })).body.drawPlan.cards, [chosen]);
    const extra = debugRound.wall.remainCards().find((card) => card !== chosen);
    check('点击牌可立即追加指定牌', (await request('/rooms/100000/draw-plan/card', 'POST',
      { uid: player.uid, card: extra })).body.drawPlan.cards, [chosen, extra]);
    check('调整顺序立即生效', (await request('/rooms/100000/draw-plan/move', 'POST',
      { uid: player.uid, from: 1, to: 0 })).body.drawPlan.cards, [extra, chosen]);
    check('删除指定牌立即生效', (await request('/rooms/100000/draw-plan/remove', 'POST',
      { uid: player.uid, index: 1 })).body.drawPlan.cards, [extra]);
    check('房间详情显示指定摸牌顺序', (await request('/rooms/100000')).body.wall.drawPlan.uid, player.uid);
    check('后台可取消摸牌顺序', (await request('/rooms/100000/draw-plan', 'DELETE')).body.cleared.uid, player.uid);
    table.round = null;
    const wskTable = new Table({ roomId: 100001, gameType: 17, clubId: 0, num: 1, param1: 10,
      param2: 0, host: player.uid, step: 1, config: qjshzRules.parseConfig(10, 0) }, app.tableHost(100001));
    const wskPlayers = [player].concat(Array.from({ length: 3 }, (_, index) => ({
      uid: 990001 + index, nickname: `说胡子陪玩${index + 1}`, sex: 1, cardNum: 0, bot: true,
    })));
    wskTable.members = wskPlayers.map((wskPlayer, index) => emptyMember(wskPlayer, {
      site: index + 1, ready: true, online: false, trustee: index > 0, bot: index > 0,
      stat: { wsk_winner_count: 0, wsk_lose_count: 0, wsk_first_count: 0, wsk_last_count: 0 },
    }));
    app.tables.set(wskTable.roomId, wskTable);
    const requestedHand = { 3: 5, 15: 4, joker: 2, 13: 6 };
    check('超出牌堆数量的起手牌被拒绝', (await request('/rooms/100001/next-wsk-hand', 'POST',
      { uid: player.uid, counts: { 13: 9 } })).status, 400);
    const handPlan = await request('/rooms/100001/next-wsk-hand', 'POST',
      { uid: player.uid, counts: requestedHand });
    check('后台可为说胡子玩家指定下一局起手牌',
      [handPlan.status, handPlan.body.nextWskHandPlan.total], [200, 17]);
    const wskRoomDetail = (await request('/rooms/100001')).body;
    check('房间详情显示指定起手牌', wskRoomDetail.nextWskHandPlan.counts, requestedHand);
    check('说胡子玩家选择器包含头像数据', 'avatarUrl' in wskRoomDetail.members[0], true);
    check('指定起手牌写入房间存档', wskTable.dump().nextWskHandPlan.counts, requestedHand);
    check('指定起手牌开局成功', wskTable.startGame(), null);
    const targetSeat = wskTable.round.seatOf(player.uid);
    const targetHand = wskTable.round.hands[targetSeat];
    const targetCount = (rank) => targetHand.filter((card) => rank === 'joker'
      ? card >= 170 : qjshzRules.cardValue(card) === Number(rank)).length;
    check('换座后指定的牌仍准确发给所选玩家',
      Object.fromEntries(Object.keys(requestedHand).map((rank) => [rank, targetCount(rank)])), requestedHand);
    const playingWskDetail = (await request('/rooms/100001')).body;
    check('说胡子房返回每位玩家完整手牌',
      playingWskDetail.members.map((member) => member.hand), wskTable.members.map((member) => (
        wskTable.round.hands[wskTable.round.seatOf(member.player.uid)]
      )));
    check('说胡子手牌不误标刚摸牌',
      playingWskDetail.members.map((member) => member.drawnCard), [null, null, null, null]);
    check('指定起手牌只消费一次', wskTable.nextWskHandPlan, null);
    app.tables.delete(wskTable.roomId);
    check('牌局明细可读', (await request('/records/R100000123')).body.details.length, 1);
    check('牌局列表使用历史归档', (await request('/records')).body.total, 1);
    check('历史归档按玩家 ID 查询', (await request(`/records?q=${player.uid}`)).body.total, 1);
    check('俱乐部列表可读', (await request('/clubs')).body.items[0].id, club.id);
    check('俱乐部余额可读', (await request(`/clubs/${club.id}`)).body.balanceCard, 0);
    check('奖励默认设置可读', (await request('/economy')).body, {
      newPlayerCards: 200,
      clubJoinBonus: 200,
      inviteBindBonus: 1000,
      invitePageText: '绑定推荐人邀请码，可获得1000张房卡！',
    });
    check('非法奖励设置被拒绝', (await request('/economy', 'PUT', { clubJoinBonus: -1 })).status, 400);
    check('非法新用户初始房卡被拒绝',
      (await request('/economy', 'PUT', { newPlayerCards: -1 })).status, 400);
    check('过长邀请码页面文案被拒绝', (await request('/economy', 'PUT',
      { invitePageText: 'x'.repeat(101) })).status, 400);
    check('奖励设置可更新', (await request('/economy', 'PUT',
      { newPlayerCards: 260, clubJoinBonus: 300, inviteBindBonus: 75,
        invitePageText: '后台自定义邀请文案' })).body,
    { newPlayerCards: 260, clubJoinBonus: 300, inviteBindBonus: 75,
      invitePageText: '后台自定义邀请文案' });
    check('机器人设置默认开启', (await request('/bots')).body.enabled, true);
    check('非法机器人设置被拒绝', (await request('/bots', 'PUT', { enabled: 'false' })).status, 400);
    check('后台可关闭机器人', (await request('/bots', 'PUT', { enabled: false })).body.enabled, false);
    check('机器人设置写入 SQLite', store.load().botSettings.enabled, false);
    check('后台可重新开启机器人', (await request('/bots', 'PUT', { enabled: true })).body.enabled, true);
    check('俱乐部房卡不可扣成负数', (await request(`/clubs/${club.id}/cards`, 'POST',
      { delta: -1, reason: '测试扣费记录' })).status, 400);
    check('俱乐部房卡可调整', (await request(`/clubs/${club.id}/cards`, 'POST',
      { delta: 500, reason: '测试充值记录' })).body.after, 500);
    check('数据面板显示俱乐部房卡', (await request('/dashboard')).body.totals.clubCards, 500);
    check('奖励设置写入 SQLite', store.load().economySettings.inviteBindBonus, 75);
    check('新用户初始房卡写入 SQLite', store.load().economySettings.newPlayerCards, 260);
    check('邀请码页面文案写入 SQLite', store.load().economySettings.invitePageText, '后台自定义邀请文案');
    check('通知可发布', (await request('/messages', 'POST', { title: '测试', content: '后台测试通知' })).status, 201);
    check('大厅公告可更新', (await request('/notices', 'PUT', { hallMarquee: '新公告' })).body.hallMarquee, '新公告');
    check('房间解散接口清理房间', (await request('/rooms/100000/dissolve', 'POST', { reason: '测试异常房间' })).status, 200);
    check('房间解散后列表清空', (await request('/rooms')).body.total, 0);
    check('账号停用', (await request(`/players/${player.uid}/status`, 'POST',
      { disabled: true, reason: '测试异常账号' })).body.disabled, true);
    check('停用后游客登录被拒绝', app.http('/login', new URLSearchParams({ deviceId: 'device-admin-123456' })).body.err_code, 66);
    check('恢复账号', (await request(`/players/${player.uid}/status`, 'POST',
      { disabled: false, reason: '测试恢复账号' })).body.disabled, false);
    check('审计日志保存后台操作', (await request('/audit')).body.entries.some((entry) => entry.action === 'player.cards'), true);
    check('审计日志在 SQLite 中保留', store.listAudit().length > 5, true);
    const backup = await request('/backup', 'POST', {});
    check('可在线生成备份', [backup.status, fs.existsSync(backup.body.filename)], [200, true]);
    const sessionBeforePasswordChange = cookie.slice('qj_admin_sid='.length);
    check('修改管理员密码', (await request('/password', 'POST', {
      currentPassword: 'VeryStrongAdminPassword123!', newPassword: 'NewAdminPassword456!'
    })).status, 200);
    check('修改密码后旧会话失效', (await request('/players')).status, 401);
    check('修改密码后清空 SQLite 会话',
      store.getAdminSession(hashSessionId(sessionBeforePasswordChange), Date.now()), null);
    const relogin = await request('/login', 'POST', { password: 'NewAdminPassword456!' }, false);
    check('新密码可登录', relogin.status, 200);
    cookie = relogin.cookie.split(';')[0]; csrf = relogin.body.csrf;
    check('退出登录', (await request('/logout', 'POST', {})).status, 200);
    check('退出后旧 Cookie 失效', (await request('/players')).status, 401);

    const restartClock = { value: Date.now() };
    const beforeRestart = new AdminAuth({ file: authFile, now: () => restartClock.value, sessionStore: store });
    const persistentLogin = beforeRestart.login('NewAdminPassword456!', 'restart-test').session;
    const rawSid = persistentLogin.sid;
    const storedSession = store.getAdminSession(hashSessionId(rawSid), restartClock.value);
    check('SQLite 只保存会话 ID 哈希', [storedSession.sidHash, JSON.stringify(storedSession).includes(rawSid)],
      [hashSessionId(rawSid), false]);
    const afterRestartAuth = new AdminAuth({ file: authFile, now: () => restartClock.value, sessionStore: store });
    const restoredSession = afterRestartAuth.session({ headers: { cookie: `qj_admin_sid=${rawSid}` } });
    check('服务重启后从 SQLite 恢复登录', [restoredSession.actor, restoredSession.csrf, restoredSession.expiresAt],
      ['管理员', persistentLogin.csrf, persistentLogin.expiresAt]);
    afterRestartAuth.logout(restoredSession);
    check('退出登录同步删除 SQLite 会话', store.getAdminSession(hashSessionId(rawSid), restartClock.value), null);

    const expiryLogin = beforeRestart.login('NewAdminPassword456!', 'expiry-test').session;
    restartClock.value = expiryLogin.expiresAt + 1;
    const expiryAuth = new AdminAuth({ file: authFile, now: () => restartClock.value, sessionStore: store });
    check('过期会话不能在重启后恢复', expiryAuth.session({
      headers: { cookie: `qj_admin_sid=${expiryLogin.sid}` },
    }), null);
    check('过期会话从 SQLite 清理', store.getAdminSession(hashSessionId(expiryLogin.sid), restartClock.value), null);

    const clock = { value: 1000 };
    const auth = new AdminAuth({ file: authFile, now: () => clock.value });
    for (let i = 0; i < 8; i++) auth.login('bad', 'one-ip');
    check('错误密码限速', auth.login('bad', 'one-ip').status, 429);
    clock.value += 16 * 60 * 1000;
    check('限速窗口结束后可重新登录', !!auth.login('NewAdminPassword456!', 'one-ip').session, true);
    console.log(`\n${passed} 过 / 0 挂`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    store.close();
    delete process.env.QJQP_DB;
    delete process.env.QJQP_STATE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
