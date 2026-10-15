#!/usr/bin/env node
/** 喜钱房全量开放：普通账号可建房、入座并查看俱乐部玩法配置。 */
process.env.QJQP_FILLBOTS = '0';

const assert = require('assert/strict');
const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');
const qjshz = require('../server/qjshz-rules');

const app = new GameApp({ persist: () => {}, allowUnregisteredTokens: true });
const sent = new Map();
const request = (id, proto, data) => {
  const payload = Buffer.from(protocol[proto].cs.encode(protocol[proto].cs.create(data)).finish());
  const frame = Buffer.alloc(12 + payload.length);
  frame.writeUInt32BE(proto, 0);
  frame.writeUInt32BE(frame.length, 8);
  payload.copy(frame, 12);
  sent.get(id).length = 0;
  app.onMessage(id, frame);
  const reply = sent.get(id).findLast((buf) => buf.readUInt32BE(0) === proto);
  assert.ok(reply, `收到 ${proto} 响应`);
  return protocol[proto].sc.decode(reply.subarray(12, reply.readUInt32BE(8)));
};
const login = (id) => {
  sent.set(id, []);
  app.attach(id, (frame) => sent.get(id).push(frame));
  assert.equal(Number(request(id, 100, { token: `xi-open-${id}` }).res.error), 0);
  return app.conns.get(id).player;
};

const host = login('host');
const guest = login('guest');
assert.notEqual(host.uid, 285636);
assert.notEqual(guest.uid, 285636);
host.cardNum = 20;
guest.cardNum = 20;
const param1 = qjshz.encodeXiConfig(10, {
  enabled: true, bomb6: 5, bomb7: 10, bomb8: 20, kings: 50,
});
const config = { gameType: 17, num: 1, param1, param2: 0 };

const created = request('host', 201, config);
assert.equal(Number(created.res.error), 0, '普通账号应能创建喜钱房');
const roomId = Number(created.roomId);
assert.deepEqual(app.tables.get(roomId).config.喜钱, qjshz.xiConfig(param1));
const joined = request('guest', 202, { roomId });
assert.equal(Number(joined.res.error), 0, '普通账号应能加入喜钱房');
assert.deepEqual(JSON.parse(JSON.parse(joined.json).msgdata).room.xi_money,
  qjshz.xiConfig(param1), '进房快照应携带喜钱配置');

const { club } = app.clubStore.create(host.uid, '喜钱开放测试');
const { application } = app.clubStore.apply(guest.uid, club.code);
assert.equal(app.clubStore.approve(host.uid, application.id).error, undefined);
const scheme = request('host', 149, { clubId: club.id, ...config });
assert.equal(Number(scheme.res.error), 0, '普通账号应能创建喜钱俱乐部方案');
const schemes = request('guest', 124, { clubId: club.id });
assert.equal(Number(schemes.res.error), 0);
assert.equal(Number(schemes.data[0].param1), param1,
  '普通会员应看到完整的喜钱方案配置');

app.tables.get(roomId).dissolve();
const clubRoom = request('host', 201, { ...config, clubId: club.id });
assert.equal(Number(clubRoom.res.error), 0, '普通账号应能创建喜钱俱乐部房');
assert.equal(Number(request('guest', 202, { roomId: Number(clubRoom.roomId) }).res.error), 0,
  '普通会员应能加入喜钱俱乐部房');

console.log('喜钱房全量准入测试通过');
