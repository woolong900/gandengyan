#!/usr/bin/env node
/**
 * 观战：满员或已开打才能旁观，回包 person.view，退出不拆房。
 */
process.env.QJQP_FILLBOTS = '0';

const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const { buildRecord } = require('../server/records');
const rules = require('../server/rules');
const { num } = require('../server/shared');

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

const lastPush = (box, head) => {
  for (let i = box.sent.length - 1; i >= 0; i--) {
    const frame = unpackSc(box.sent[i]);
    if (frame.proto !== 999) continue;
    const parsed = JSON.parse(frame.msg.json);
    if (parsed.msghead === head) return JSON.parse(parsed.msgdata);
  }
  return null;
};

const joinData = (box) => {
  const msg = last(box, 202);
  return JSON.parse(JSON.parse(msg.json).msgdata);
};

const gameJson = (msghead, data = {}) => packCs(200, {
  json: JSON.stringify({ msghead, msgdata: JSON.stringify(data) }),
});

const boot = () => {
  const app = new GameApp({ persist: () => {}, now: () => 1 });
  const boxes = new Map();
  const attach = (id) => {
    const box = { sent: [] };
    boxes.set(id, box);
    app.attach(id, (bytes) => box.sent.push(Buffer.from(bytes)));
    return box;
  };
  const login = (id, token) => {
    const box = attach(id);
    app.onMessage(id, packCs(100, { token }));
    return { box, player: app.conns.get(id).player, login: last(box, 100) };
  };
  return { app, boxes, attach, login };
};

const openRoom = (app, host, opts = {}) => {
  host.player.cardNum = opts.cardNum == null ? 20 : opts.cardNum;
  const param = rules.buildParam({ 人数: 2, 房费: '房主', ...opts });
  app.onMessage(host.id, packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  return num(last(host.box, 201).roomId);
};

{
  const { app, login } = boot();
  const a = { ...login('a', 't_watch_a'), id: 'a' };
  const b = { ...login('b', 't_watch_b'), id: 'b' };
  const c = { ...login('c', 't_watch_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: true });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  app.onMessage('c', packCs(202, { roomId }));
  t('满员可观战', num(last(c.box, 202).res.error), 0);
  const table = app.tables.get(roomId);
  const watcher = table.members.find((m) => m.player.uid === c.player.uid);
  t('观战标了 view', !!watcher.view, true);
  t('观战不占座位', table.seats().map((m) => m.player.uid), [a.player.uid, b.player.uid]);
  const room = joinData(c.box).room;
  const me = room.person.find((p) => p.uid === c.player.uid);
  t('回包 person.view', !!me.view, true);
  t('回包观战位 0', me.index, 0);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_nowatch_a'), id: 'a' };
  const b = { ...login('b', 't_nowatch_b'), id: 'b' };
  const c = { ...login('c', 't_nowatch_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: false });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  app.onMessage('c', packCs(202, { roomId }));
  t('没勾观战进不去', last(c.box, 202).res.what, '该房间不允许观战');
  t('没勾观战没入座', app.tables.get(roomId).members.some((m) => m.player.uid === c.player.uid), false);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_sit_a'), id: 'a' };
  const c = { ...login('c', 't_sit_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: true });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('c', packCs(202, { roomId }));
  const mine = app.tables.get(roomId).members.find((m) => m.player.uid === c.player.uid);
  t('有空位先坐下', !!mine && !mine.view, true);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_aa_watch_a'), id: 'a' };
  const b = { ...login('b', 't_aa_watch_b'), id: 'b' };
  const c = { ...login('c', 't_aa_watch_c'), id: 'c' };
  a.player.cardNum = 5;
  b.player.cardNum = 5;
  c.player.cardNum = 0;
  const param = rules.buildParam({ 人数: 2, 房费: 'AA', 观战: true });
  app.onMessage('a', packCs(201, {
    gameType: 2, clubId: 0, num: 1, param1: param.param1, param2: param.param2,
  }));
  const roomId = num(last(a.box, 201).roomId);
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  app.onMessage('c', packCs(202, { roomId }));
  t('观战不查 AA 房卡', num(last(c.box, 202).res.error), 0);
  t('观战没扣卡', c.player.cardNum, 0);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_mid_a'), id: 'a' };
  const b = { ...login('b', 't_mid_b'), id: 'b' };
  const c = { ...login('c', 't_mid_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: true });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  const table = app.tables.get(roomId);
  t('开局成功', table.startGame(), null);
  app.onMessage('c', packCs(202, { roomId }));
  const game = joinData(c.box).game;
  t('中途观战拿到牌桌', !!game.begin, true);
  t('观战看不见手牌', game.info.every((s) => (s.card.hand_card || []).every((x) => x === 0)), true);
  const before = table.round.hands[0].length;
  app.onMessage('c', gameJson('gamestep', { card: 11 }));
  t('观战不能出牌', table.round.hands[0].length, before);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_leave_a'), id: 'a' };
  const b = { ...login('b', 't_leave_b'), id: 'b' };
  const c = { ...login('c', 't_leave_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: true });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  app.onMessage('c', packCs(202, { roomId }));
  app.onMessage('c', gameJson('dissmissroom'));
  t('观战退出不拆房', !!app.tables.get(roomId) && !app.tables.get(roomId).closed, true);
  t('观战退出人走了', app.tables.get(roomId).members.some((m) => m.player.uid === c.player.uid), false);
  t('观战收到 exitroom', !!lastPush(c.box, 'exitroom'), true);
  t('观战退出清了房间号', c.player.roomId, 0);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_rec_a'), id: 'a' };
  const b = { ...login('b', 't_rec_b'), id: 'b' };
  const c = { ...login('c', 't_rec_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: true });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  app.onMessage('c', packCs(202, { roomId }));
  const table = app.tables.get(roomId);
  table.step = 1;
  table.hands = [{
    id: '10000001101',
    scores: [{ uid: a.player.uid, score: 10 }, { uid: b.player.uid, score: -10 }],
  }];
  const rec = buildRecord(table, Date.now());
  t('战绩不含观战', rec.uids.includes(c.player.uid), false);
  t('战绩只有在座', rec.players.map((p) => p.uid), [a.player.uid, b.player.uid]);
}

{
  const { app, login } = boot();
  const a = { ...login('a', 't_push_a'), id: 'a' };
  const b = { ...login('b', 't_push_b'), id: 'b' };
  const c = { ...login('c', 't_push_c'), id: 'c' };
  const roomId = openRoom(app, a, { 观战: true });
  app.onMessage('a', packCs(202, { roomId }));
  app.onMessage('b', packCs(202, { roomId }));
  const table = app.tables.get(roomId);
  table.startGame();
  app.onMessage('c', packCs(202, { roomId }));
  c.box.sent.length = 0;
  table.round.io.all('game_step', { uid: a.player.uid, card: 14 });
  t('出牌推到观战', lastPush(c.box, 'game_step').card, 14);
  c.box.sent.length = 0;
  table.round.io.each('game_draw', (viewer) => ({
    uid: a.player.uid,
    card: viewer === 0 ? 21 : 0,
  }));
  t('观战摸牌是牌背', lastPush(c.box, 'game_draw').card, 0);
}

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
