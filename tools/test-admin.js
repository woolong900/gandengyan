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
const { AdminAuth, passwordRecord } = require('../server/admin-auth');

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
  const { club } = app.clubStore.create(player.uid, '后台测试俱乐部');
  const config = rules.parseConfig(0, 0);
  const table = new Table({ roomId: 100000, gameType: 2, clubId: 0, num: 1, param1: 0,
    param2: 0, host: player.uid, config }, app.tableHost(100000));
  app.tables.set(table.roomId, table);
  app.records.push({ id: 'R100000123', roomId: 100000, time: Date.now(),
    gameCount: 1, totalCount: 8, players: [{ uid: player.uid, name: player.nickname, score: 10 }],
    details: [{ id: 'R1', scores: [{ uid: player.uid, score: 10 }] }], uids: [player.uid] });
  store.save(app.dump());
  check('现有战绩回填归档', store.backfillRecords(app.records), 1);
  check('重复回填不会生成重复战绩', store.backfillRecords(app.records), 0);
  const { createAdminHttp } = require('../server/admin-http');
  const admin = createAdminHttp({ app, store, authFile, flush: async () => store.save(app.dump()) });
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
    check('玩家查询不泄露登录 token', JSON.stringify((await request('/players')).body).includes(guest.token), false);
    check('缺少 CSRF 不能调整房卡', (await request(`/players/${player.uid}/cards`, 'POST',
      { delta: 20, reason: '测试充值记录' }, true, false)).status, 403);
    check('不允许扣成负余额', (await request(`/players/${player.uid}/cards`, 'POST',
      { delta: -20000, reason: '测试扣费记录' })).status, 400);
    const cards = await request(`/players/${player.uid}/cards`, 'POST', { delta: 20, reason: '测试充值记录' });
    check('调整房卡', [cards.status, cards.body.after], [200, 10020]);
    check('账号详情只显示脱敏字段', 'identityIdHash' in (await request(`/players/${player.uid}`)).body, false);
    check('房间列表有当前房间', (await request('/rooms')).body.total, 1);
    check('房间详情可读', (await request('/rooms/100000')).body.roomId, 100000);
    const debugRound = new Round([{ player }, { player: { uid: 999999, nickname: '调试陪玩' } }],
      { config, dealerSeat: 0 }, { log() {}, each() {}, all() {}, one() {} });
    debugRound.start();
    table.round = debugRound;
    const chosen = debugRound.wall.remainCards().at(-1);
    check('开局房间可读剩余牌堆', (await request('/rooms/100000')).body.wall.cards.length,
      debugRound.wall.remain());
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
    check('牌局明细可读', (await request('/records/R100000123')).body.details.length, 1);
    check('牌局列表使用历史归档', (await request('/records')).body.total, 1);
    check('历史归档按玩家 ID 查询', (await request(`/records?q=${player.uid}`)).body.total, 1);
    check('俱乐部列表可读', (await request('/clubs')).body.items[0].id, club.id);
    check('俱乐部余额可读', (await request(`/clubs/${club.id}`)).body.balanceCard, 0);
    check('奖励默认设置可读', (await request('/economy')).body, { clubJoinBonus: 200, inviteBindBonus: 1000 });
    check('非法奖励设置被拒绝', (await request('/economy', 'PUT', { clubJoinBonus: -1 })).status, 400);
    check('奖励设置可更新', (await request('/economy', 'PUT',
      { clubJoinBonus: 300, inviteBindBonus: 75 })).body, { clubJoinBonus: 300, inviteBindBonus: 75 });
    check('俱乐部房卡不可扣成负数', (await request(`/clubs/${club.id}/cards`, 'POST',
      { delta: -1, reason: '测试扣费记录' })).status, 400);
    check('俱乐部房卡可调整', (await request(`/clubs/${club.id}/cards`, 'POST',
      { delta: 500, reason: '测试充值记录' })).body.after, 500);
    check('数据面板显示俱乐部房卡', (await request('/dashboard')).body.totals.clubCards, 500);
    check('奖励设置写入 SQLite', store.load().economySettings.inviteBindBonus, 75);
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
    check('修改管理员密码', (await request('/password', 'POST', {
      currentPassword: 'VeryStrongAdminPassword123!', newPassword: 'NewAdminPassword456!'
    })).status, 200);
    check('修改密码后旧会话失效', (await request('/players')).status, 401);
    const relogin = await request('/login', 'POST', { password: 'NewAdminPassword456!' }, false);
    check('新密码可登录', relogin.status, 200);
    cookie = relogin.cookie.split(';')[0]; csrf = relogin.body.csrf;
    check('退出登录', (await request('/logout', 'POST', {})).status, 200);
    check('退出后旧 Cookie 失效', (await request('/players')).status, 401);

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
