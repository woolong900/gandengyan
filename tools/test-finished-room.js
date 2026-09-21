#!/usr/bin/env node
/** 已结算房间不能让机器人占住玩家，阻止玩家进入俱乐部新桌。 */
process.env.QJQP_FILLBOTS = '0';

const assert = require('node:assert/strict');
const { GameApp } = require('../server/app');
const {
  Table, UNSTARTED_ROOM_TTL_MS, STARTED_ROOM_TTL_MS, ROOM_EXPIRE_TIMER,
} = require('../server/table');
const { emptyMember, emptyPlayer, maxStep } = require('../server/shared');
const { protocol } = require('../server/proto/protocol');
const rules = require('../server/rules');

const request = (proto, msg) => {
  const def = protocol[proto];
  const body = Buffer.from(def.cs.encode(def.cs.create(msg)).finish());
  const frame = Buffer.alloc(12 + body.length);
  frame.writeUInt32BE(proto, 0);
  frame.writeUInt32BE(frame.length, 8);
  body.copy(frame, 12);
  return frame;
};
const response = (frame) => protocol[frame.readUInt32BE(0)].sc.decode(frame.subarray(12));
const lastResponse = (sent, proto) => response(sent.findLast((frame) => frame.readUInt32BE(0) === proto));
const pushes = (sent) => sent.filter((frame) => frame.readUInt32BE(0) === 999)
  .map((frame) => {
    const envelope = JSON.parse(response(frame).json);
    return { head: envelope.msghead, data: JSON.parse(envelope.msgdata) };
  });

const fixture = ({ finished = true, step } = {}) => {
  const clock = { now: 1000 };
  const app = new GameApp({ persist: () => {}, now: () => clock.now });
  const player = emptyPlayer(100049, { cardNum: 10000, roomId: 100050 });
  const bot = emptyPlayer(100053, { bot: true, roomId: 100050 });
  app.players.set('test-token', player);
  app.playersByUid.set(player.uid, player);
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  const meta = (roomId) => ({
    roomId, gameType: 2, clubId: 0, num: 1,
    param1: param.param1, param2: param.param2,
    host: player.uid, config: rules.parseConfig(param.param1, param.param2),
  });
  const oldStep = step == null
    ? (finished ? maxStep({ gameType: 2, num: 1 }) : maxStep({ gameType: 2, num: 1 }) - 1)
    : step;
  const old = new Table({ ...meta(100050), step: oldStep }, app.tableHost(100050));
  old.recordSaved = true;
  old.members = [
    emptyMember(player, { site: 1, connId: 'phone', online: true }),
    emptyMember(bot, { site: 2, online: true, bot: true }),
  ];
  const next = new Table(meta(100051), app.tableHost(100051));
  app.tables.set(old.roomId, old);
  app.tables.set(next.roomId, next);
  app.uidRoom.set(player.uid, old.roomId);
  const sent = [];
  app.attach('phone', (frame) => sent.push(frame));
  app.conns.get('phone').player = player;
  app.conns.get('phone').roomId = old.roomId;
  return { app, player, old, next, sent, clock };
};

{
  const { app, player, old, next, sent } = fixture();
  app.onMessage('phone', request(202, { roomId: next.roomId }));
  assert.equal(Number(lastResponse(sent, 202).res.error), 0);
  assert.equal(app.uidRoom.get(player.uid), next.roomId);
  assert.equal(app.tables.has(old.roomId), false);
}
{
  const { app, player, old, next, sent } = fixture({ finished: false });
  app.onMessage('phone', request(202, { roomId: next.roomId }));
  assert.equal(lastResponse(sent, 202).res.what, '已经在其他房间里');
  assert.equal(app.uidRoom.get(player.uid), old.roomId);
}
{
  const { app, player, old, clock } = fixture({ finished: false });
  old.leave(player.uid, 'phone');
  assert.equal(app.timeouts.has(`${old.roomId}:empty`), false);
  assert.equal(app.timeouts.has(`${old.roomId}:${ROOM_EXPIRE_TIMER}`), true);
  old.onTimer(ROOM_EXPIRE_TIMER);
  assert.equal(app.tables.has(old.roomId), true);
  assert.equal(player.roomId, old.roomId);
  clock.now = old.roomExpireAt;
  old.onTimer(ROOM_EXPIRE_TIMER);
  assert.equal(app.tables.has(old.roomId), false);
  assert.equal(player.roomId, 0);
}
{
  const { app, player, old, clock } = fixture({ finished: false, step: 0 });
  old.leave(player.uid, 'phone');
  assert.equal(old.roomExpireAt, old.createdAt + UNSTARTED_ROOM_TTL_MS);
  assert.equal(app.timeouts.has(`${old.roomId}:${ROOM_EXPIRE_TIMER}`), true);
  clock.now = old.roomExpireAt - 1;
  old.onTimer(ROOM_EXPIRE_TIMER);
  assert.equal(app.tables.has(old.roomId), true);
  clock.now = old.roomExpireAt;
  old.onTimer(ROOM_EXPIRE_TIMER);
  assert.equal(app.tables.has(old.roomId), false);
  assert.equal(player.roomId, 0);
}
{
  const { app, player, old } = fixture({ finished: false });
  old.leave(player.uid, 'phone');
  const restored = new GameApp({ persist: () => {}, now: () => 1000 });
  restored.restore(app.dump());
  assert.equal(restored.tables.has(old.roomId), true);
  assert.equal(restored.playerByUid(player.uid).roomId, old.roomId);
  assert.equal(restored.tables.get(old.roomId).roomExpireAt, old.roomExpireAt);
  assert.equal(restored.timeouts.has(`${old.roomId}:${ROOM_EXPIRE_TIMER}`), true);
}
{
  const { app, old, clock } = fixture({ finished: false });
  clock.now = 5000;
  assert.equal(old.startGame(), null);
  assert.equal(old.lastRoundStartedAt, clock.now);
  assert.equal(old.roomExpireAt, clock.now + STARTED_ROOM_TTL_MS);
  assert.equal(app.timeouts.has(`${old.roomId}:${ROOM_EXPIRE_TIMER}`), true);
  old.dissolve();
}
{
  const { app, player, old } = fixture();
  const restored = new GameApp({ persist: () => {}, now: () => 1000 });
  restored.restore(app.dump());
  assert.equal(restored.tables.has(old.roomId), false);
  assert.equal(restored.playerByUid(player.uid).roomId, 0);
}
{
  const { app, player, old, sent } = fixture();
  old.recordSaved = false;
  old.makeIo().over({ winner: 0, stat: [{}, {}], scores: [10, -10] });
  const heads = pushes(sent).map((item) => item.head);
  assert.equal(heads.includes('game_bye'), true);
  assert.equal(heads.includes('exitroom'), false);
  assert.equal(app.tables.has(old.roomId), false);
  assert.equal(app.uidRoom.has(player.uid), false);
  assert.equal(player.roomId, 0);
  assert.equal(app.records.length, 1);
}
{
  const { app, player, old, sent } = fixture({ finished: false });
  old.step = 1;
  old.recordSaved = false;
  const json = JSON.stringify({ msghead: 'dissmissroom', msgdata: '{}' });
  app.onMessage('phone', request(200, { json }));
  const messages = pushes(sent);
  assert.equal(messages.find((item) => item.head === 'game_bye').data.normal_end, false);
  assert.equal(messages.some((item) => item.head === 'exitroom'), false);
  assert.equal(app.tables.has(old.roomId), false);
  assert.equal(player.roomId, 0);
  assert.equal(app.records.length, 1);
}
{
  const { app, old, sent } = fixture({ finished: false });
  old.step = 0;
  const json = JSON.stringify({ msghead: 'dissmissroom', msgdata: '{}' });
  app.onMessage('phone', request(200, { json }));
  const heads = pushes(sent).map((item) => item.head);
  assert.equal(heads.includes('game_bye'), false);
  assert.equal(heads.includes('exitroom'), true);
  assert.equal(app.tables.has(old.roomId), false);
}
console.log('无人房立即释放；未开局 1 小时释放；未完成房按最近开局保留 12 小时；已结算房释放');
