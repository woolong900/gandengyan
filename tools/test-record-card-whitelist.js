#!/usr/bin/env node
'use strict';

process.env.QJQP_FILLBOTS = '0';

const assert = require('node:assert/strict');
const { GameApp } = require('../server/app');
const { protocol } = require('../server/proto/protocol');

const packCs = (proto, msg) => {
  const def = protocol[proto];
  const payload = def && def.cs && msg
    ? Buffer.from(def.cs.encode(def.cs.create(msg)).finish()) : Buffer.alloc(0);
  const out = Buffer.alloc(12 + payload.length);
  out.writeUInt32BE(proto, 0);
  out.writeUInt32BE(0, 4);
  out.writeUInt32BE(out.length, 8);
  payload.copy(out, 12);
  return out;
};

const unpackSc = (buf) => {
  const proto = buf.readUInt32BE(0);
  const payload = buf.subarray(12, buf.readUInt32BE(8) || buf.length);
  const def = protocol[proto];
  return { proto, msg: def && def.sc ? def.sc.decode(payload) : null };
};

const last = (sent, proto) => {
  for (let index = sent.length - 1; index >= 0; index--) {
    const frame = unpackSc(sent[index]);
    if (frame.proto === proto) return frame.msg;
  }
  return null;
};

const lastPush = (sent, msghead) => {
  for (let index = sent.length - 1; index >= 0; index--) {
    const frame = unpackSc(sent[index]);
    if (frame.proto !== 999) continue;
    const envelope = JSON.parse(frame.msg.json);
    if (envelope.msghead === msghead) return JSON.parse(envelope.msgdata);
  }
  return null;
};

const app = new GameApp({ persist: () => {}, allowUnregisteredTokens: true });
const sent = [];
app.attach('player', (bytes) => sent.push(Buffer.from(bytes)), null, { platform: 'android' });
app.onMessage('player', packCs(100, { token: 'record-card-whitelist-player' }));
const player = app.conns.get('player').player;

assert.deepEqual(app.setRecordCardWhitelist(player.uid, true), {
  uid: player.uid, enabled: true, notified: 0,
});
app.onMessage('player', packCs(201, {
  gameType: 17, clubId: 0, num: 1, param1: 10, param2: 0,
}));
const roomId = Number(last(sent, 201).roomId);
app.onMessage('player', packCs(202, { roomId }));
const joined = JSON.parse(JSON.parse(last(sent, 202).json).msgdata);
assert.equal(joined.room.record_card_access, true,
  '进入未勾选记牌器的房间时，应向白名单玩家下发权限');
assert.equal(joined.room.param2, 0, '白名单不能修改房间原有玩法配置');

sent.length = 0;
assert.deepEqual(app.setRecordCardWhitelist(player.uid, false), {
  uid: player.uid, enabled: false, notified: 1,
});
assert.deepEqual(lastPush(sent, 'record_card_access'), { enabled: false },
  '移出白名单应实时通知牌桌内玩家');

sent.length = 0;
assert.deepEqual(app.setRecordCardWhitelist(player.uid, true), {
  uid: player.uid, enabled: true, notified: 1,
});
assert.deepEqual(lastPush(sent, 'record_card_access'), { enabled: true },
  '加入白名单应实时通知牌桌内玩家');

const iosSent = [];
app.attach('ios-player', (bytes) => iosSent.push(Buffer.from(bytes)), null, {
  platformForUid: () => 'ios',
});
app.onMessage('ios-player', packCs(100, { token: 'record-card-whitelist-ios-player' }));
const iosPlayer = app.conns.get('ios-player').player;
assert.equal(app.conns.get('ios-player').platform, 'ios', '登录时应记录连接所属平台');
assert.deepEqual(app.setRecordCardWhitelist(iosPlayer.uid, true), {
  uid: iosPlayer.uid, enabled: true, notified: 0,
});
app.onMessage('ios-player', packCs(202, { roomId }));
const iosJoined = JSON.parse(JSON.parse(last(iosSent, 202).json).msgdata);
assert.equal(iosJoined.room.record_card_access, false,
  'iOS 玩家即使在白名单中也不能获得白名单记牌器权限');

iosSent.length = 0;
assert.deepEqual(app.setRecordCardWhitelist(iosPlayer.uid, false), {
  uid: iosPlayer.uid, enabled: false, notified: 1,
});
assert.deepEqual(lastPush(iosSent, 'record_card_access'), { enabled: false },
  'iOS 牌桌连接始终只能收到关闭白名单权限');

for (const timer of app.timeouts.values()) clearTimeout(timer);
console.log('记牌器白名单：仅 Android 生效，iOS 隔离、进房下发和实时同步均通过');
