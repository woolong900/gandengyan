#!/usr/bin/env node
/** 已结算房间不能让机器人占住玩家，阻止玩家进入俱乐部新桌。 */
process.env.QJQP_FILLBOTS = '0';

const assert = require('node:assert/strict');
const { GameApp } = require('../server/app');
const { Table } = require('../server/table');
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

const fixture = ({ finished = true } = {}) => {
  const app = new GameApp({ persist: () => {}, now: () => 1000 });
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
  const old = new Table(meta(100050), app.tableHost(100050));
  old.step = finished ? maxStep(old) : maxStep(old) - 1;
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
  return { app, player, old, next, sent };
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
  const { app, player, old } = fixture({ finished: false });
  old.leave(player.uid, 'phone');
  assert.equal(app.timeouts.has(`${old.roomId}:empty`), true);
  old.onTimer('empty');
  assert.equal(app.tables.has(old.roomId), false);
  assert.equal(player.roomId, 0);
  app.cancel(`${old.roomId}:empty`);
}
{
  const { app, player, old } = fixture();
  const restored = new GameApp({ persist: () => {}, now: () => 1000 });
  restored.restore(app.dump());
  assert.equal(restored.tables.has(old.roomId), false);
  assert.equal(restored.playerByUid(player.uid).roomId, 0);
}
console.log('已结算房间释放、未结算拦截、陪玩空桌清理和重启恢复均通过');
