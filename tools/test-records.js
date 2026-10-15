#!/usr/bin/env node
/**
 * 大厅战绩 125 / 126，回放 127 先关。
 */
process.env.QJQP_FILLBOTS = '0';

const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const { listFor } = require('../server/records');
const { Table } = require('../server/table');
const { roomInfo } = require('../server/shared');
const rules = require('../server/rules');

let pass = 0;
let fail = 0;
const t = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++;
  else {
    fail++;
    console.log(`  ✗ ${name}: 得到 ${JSON.stringify(got)} 期望 ${JSON.stringify(want)}`);
  }
};

const packCs = (proto, msg) => {
  const def = protocol[proto];
  const payload = def && def.cs && msg
    ? Buffer.from(def.cs.encode(def.cs.create(msg)).finish())
    : Buffer.alloc(0);
  const out = Buffer.alloc(12 + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(0, 4);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, 12);
  return out;
};

const unpackSc = (buf) => {
  const proto = buf.readUInt32BE(0);
  const len = buf.readUInt32BE(8);
  const payload = buf.subarray(12, len || buf.length);
  const def = protocol[proto];
  const msg = def && def.sc ? def.sc.decode(payload) : null;
  return { proto, msg };
};

const last = (box, proto) => {
  for (let i = box.sent.length - 1; i >= 0; i--) {
    const frame = unpackSc(box.sent[i]);
    if (frame.proto === proto) return frame.msg;
  }
  return null;
};

const DAY = Math.floor(Date.parse('2026-09-12T00:00:00+08:00') / 1000);
const NOON = DAY * 1000 + 12 * 3600 * 1000;

const fakeTable = (extra = {}) => ({
  roomId: 100000,
  shareCode: 'abcdef0123456789abcdef01',
  gameType: 2,
  num: 1,
  param1: 2000,
  param2: 11100100011011,
  step: 2,
  recordSaved: false,
  members: [
    { view: false, player: { uid: 100001, nickname: '甲' }, score: 80 },
    { view: false, player: { uid: 100002, nickname: '乙' }, score: -40 },
    { view: false, player: { uid: 100003, nickname: '丙' }, score: -40 },
  ],
  hands: [
    { id: '100000010001', scores: [{ uid: 100001, score: 50 }, { uid: 100002, score: -25 }, { uid: 100003, score: -25 }] },
    { id: '100000020002', scores: [{ uid: 100001, score: 30 }, { uid: 100002, score: -15 }, { uid: 100003, score: -15 }] },
  ],
  ...extra,
});

{
  const app = new GameApp({ persist: () => {}, now: () => NOON, allowUnregisteredTokens: true });
  const rec = app.saveRecord(fakeTable());
  t('记下战绩', !!rec.id, true);
  t('战绩保留分享码', rec.shareCode, 'abcdef0123456789abcdef01');
  t('玩法是潜江晃晃', rec.gameId, 2);
  t('打了 2 局', rec.gameCount, 2);
  t('满局 8', rec.totalCount, 8);
  t('分数倍率', rec.scoreRatio, rules.RATIO);
  t('大赢家', rec.players.find((p) => p.uid === 100001).winner, true);
  t('只存一次', app.saveRecord(fakeTable({ recordSaved: true })), null);
}

{
  const table = new Table({ roomId: 100100, gameType: 2, num: 1, param1: 2000, param2: 2, host: 100001 }, {});
  t('新房间分配不可枚举分享码', /^[0-9a-f]{24}$/.test(table.shareCode), true);
  t('房间快照给客户端分享码', roomInfo(table).room_code, table.shareCode);
  t('重启后分享码稳定', Table.fromDump(table.dump(), {}, new Map()).shareCode, table.shareCode);
}

{
  const app = new GameApp({ persist: () => {}, now: () => NOON, allowUnregisteredTokens: true });
  app.saveRecord(fakeTable());
  const box = { sent: [] };
  app.attach('a', (bytes) => box.sent.push(Buffer.from(bytes)));
  app.onMessage('a', packCs(100, { token: 't_rec_a' }));
  const me = app.conns.get('a').player;
  me.uid = 100001;
  box.sent.length = 0;
  app.onMessage('a', packCs(125, { type: 0, time: DAY }));
  const list = last(box, 125);
  t('125 成功', Number(list.res.error), 0);
  t('当天有一条', list.records.length, 1);
  t('房号对', Number(list.records[0].roomId), 100000);
  t('列表带玩家', list.records[0].players.length, 3);

  box.sent.length = 0;
  app.onMessage('a', packCs(125, { type: 0, time: DAY + 86400 }));
  t('隔天没有', last(box, 125).records.length, 0);

  box.sent.length = 0;
  app.onMessage('a', packCs(126, { id: list.records[0].id }));
  const det = last(box, 126);
  t('126 成功', Number(det.res.error), 0);
  t('两局明细', det.details.length, 2);
  t('第一局回放码', det.details[0].id, '100000010001');
  t('第一局甲的分', Number(det.details[0].scores.find((s) => Number(s.uid) === 100001).score), 50);

  box.sent.length = 0;
  app.onMessage('a', packCs(126, { id: 'nope' }));
  t('没有的战绩', Number(last(box, 126).res.error), 1);

  box.sent.length = 0;
  app.onMessage('a', packCs(127, { id: '100000010001' }));
  t('没有回放数据', last(box, 127).res.what, '回放不存在');
}

{
  const app = new GameApp({ persist: () => {}, now: () => NOON, allowUnregisteredTokens: true });
  app.saveRecord(fakeTable());
  const box = { sent: [] };
  app.attach('b', (bytes) => box.sent.push(Buffer.from(bytes)));
  app.onMessage('b', packCs(100, { token: 't_rec_b' }));
  app.conns.get('b').player.uid = 100099;
  box.sent.length = 0;
  app.onMessage('b', packCs(125, { type: 0, time: DAY }));
  t('别人看不见', last(box, 125).records.length, 0);
}

{
  const app = new GameApp({ persist: () => {}, now: () => NOON, allowUnregisteredTokens: true });
  const club = app.clubStore.create(100099, '战绩测试俱乐部').club;
  app.clubStore.joinMember(club, 100088);
  app.clubStore.joinMember(club, 100001);
  app.clubStore.joinMember(club, 100002);
  app.clubStore.joinMember(club, 100003);
  const rec = app.saveRecord(fakeTable({ clubId: club.id }));
  rec.playbacks['100000010001'] = { players: [], roomInfo: {}, gameInfo: {}, steps: [] };

  const adminBox = { sent: [] };
  app.attach('club-admin', (bytes) => adminBox.sent.push(Buffer.from(bytes)));
  app.onMessage('club-admin', packCs(100, { token: 't_record_club_admin' }));
  app.conns.get('club-admin').player.uid = 100099;
  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(125, {
    type: 1, clubId: club.id, time: DAY, userCode: '', startTime: 0, endTime: 0,
  }));
  let list = last(adminBox, 125);
  t('俱乐部管理员能看全部战绩', list.records.length, 1);
  t('俱乐部战绩房号正确', Number(list.records[0].roomId), 100000);

  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(146, {
    clubId: club.id, userCode: '', date: DAY, startDate: 0, endDate: 0,
  }));
  const stats = last(adminBox, 146);
  t('俱乐部统计默认按所选日期', Number(stats.data.find((item) => item.code === '100001').number), 1);
  t('俱乐部统计返回当日参与成员', stats.data.length, 3);
  t('俱乐部统计统一使用百分之一分', Number(stats.data.find((item) => item.code === '100001').scoreRatio), 100);
  t('麻将战绩换算后总分不变', Number(stats.data.find((item) => item.code === '100001').score), 800);

  const wskRecord = app.saveRecord(fakeTable({
    roomId: 100017,
    clubId: club.id,
    gameType: 17,
    gameRules: { RATIO: 100 },
    members: [
      { view: false, player: { uid: 100001, nickname: '甲' }, score: 1250 },
      { view: false, player: { uid: 100002, nickname: '乙' }, score: -1250 },
    ],
    hands: [{
      id: '100017010001',
      scores: [{ uid: 100001, score: 1250 }, { uid: 100002, score: -1250 }],
    }],
  }));
  t('说胡子测试战绩已保存', wskRecord.scoreRatio, 100);
  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(146, {
    clubId: club.id, userCode: '', date: DAY, startDate: 0, endDate: 0,
  }));
  const mixedStats = last(adminBox, 146);
  const mixedFirst = mixedStats.data.find((item) => item.code === '100001');
  t('跨玩法总分统一换算后再相加',
    [Number(mixedFirst.score), Number(mixedFirst.scoreRatio), Number(mixedFirst.number)], [2050, 100, 2]);

  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(125, {
    type: 1, clubId: club.id, time: DAY, userCode: '100002', startTime: 0, endTime: 0,
  }));
  t('俱乐部战绩可按用户ID查询', last(adminBox, 125).records.length, 2);

  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(125, {
    type: 1, clubId: club.id, time: DAY, userCode: '乙', startTime: 0, endTime: 0,
  }));
  t('俱乐部战绩可按昵称查询', last(adminBox, 125).records.length, 2);

  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(126, { id: rec.id }));
  t('管理员可查看成员战绩明细', Number(last(adminBox, 126).res.error), 0);

  adminBox.sent.length = 0;
  app.onMessage('club-admin', packCs(127, { id: '100000010001' }));
  t('管理员可查看成员战绩回放', Number(last(adminBox, 127).res.error), 0);

  const memberBox = { sent: [] };
  app.attach('club-member', (bytes) => memberBox.sent.push(Buffer.from(bytes)));
  app.onMessage('club-member', packCs(100, { token: 't_record_club_member' }));
  app.conns.get('club-member').player.uid = 100088;
  memberBox.sent.length = 0;
  app.onMessage('club-member', packCs(125, {
    type: 1, clubId: club.id, time: DAY, userCode: '', startTime: 0, endTime: 0,
  }));
  list = last(memberBox, 125);
  t('普通成员不能看全员战绩', Number(list.res.error), 1);
  t('普通成员无权时不泄露列表', list.records.length, 0);
}

{
  const dumped = {
    nextUid: 100010,
    nextRoomId: 100001,
    players: [],
    rooms: [],
    records: [{
      id: 'R9', gameId: 2, roomId: 9, gameCount: 1, totalCount: 8,
      param1: 2000, param2: 2, time: NOON, scoreRatio: 10,
      players: [{ uid: 7, name: '丁', score: 10, avatarUrl: '', winner: true }],
      details: [{ id: '901', scores: [{ uid: 7, score: 10 }] }],
      uids: [7],
    }],
  };
  const app = new GameApp({ persist: () => {}, now: () => NOON, allowUnregisteredTokens: true });
  app.restore(dumped);
  t('存档战绩还在', listFor(app.records, 7, DAY).length, 1);
}

{
  const app = new GameApp({ persist: () => {}, now: () => NOON, allowUnregisteredTokens: true });
  const first = app.http('/login', new URLSearchParams({ accountType: 'guest' }));
  const token = first.body.data.token;
  const again = app.http('/login', new URLSearchParams({ accountType: 'token', token }));
  t('带 token 登录还用原来的号', again.body.data.token, token);
  const before = app.nextUid;
  app.http('/login', new URLSearchParams({ accountType: 'token', token }));
  t('复用号不占新 uid', app.nextUid, before);
  t('过期 token 要重新登', app.http('/login', new URLSearchParams({
    accountType: 'token',
    token: 't_nope',
  })).body.err_code, 65);
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
