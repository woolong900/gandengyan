#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-store-'));
process.env.QJQP_DB = path.join(dir, 'state.sqlite');
process.env.QJQP_STATE = path.join(dir, 'missing.json');
const store = require('../server/store');

const player = (uid, extra = {}) => ({ uid, token: `t_${uid}`, nickname: `玩家${uid}`, inviteCode: `I${uid}`, cardNum: 10, ...extra });
const room = (roomId) => ({ roomId, clubId: 0, members: [] });
const record = (id, time) => ({ id, roomId: 1, time, clubId: 0, players: [] });
const club = (id) => ({ id, ownerUid: 1, name: `俱乐部${id}` });
const reset = () => { for (const key of Object.keys(store.writeStats)) store.writeStats[key] = 0; };
const roundtrip = () => { store.close(); return store.load(); };

try {
  const state = store.load();
  state.players = Array.from({ length: 1000 }, (_, i) => player(300000 + i));
  state.rooms = [room(100001), room(100002)];
  state.records = [record('r1', 1), record('r2', 2)];
  state.clubs.clubs = [club(158001)];
  store.save(state);

  reset();
  state.players[500].cardNum = 99;
  store.save(state);
  assert.deepEqual({ ...store.writeStats }, { inserted: 0, updated: 1, deleted: 0, rewrites: 0 }, '只改一个玩家只写一行');

  reset();
  store.save(state);
  assert.equal(store.writeStats.updated + store.writeStats.inserted + store.writeStats.deleted, 0, '无变化不写行');

  reset();
  state.records.shift();
  state.records.push(record('r3', 3));
  state.rooms = state.rooms.filter((item) => item.roomId !== 100001);
  state.rooms.push(room(100003));
  state.players.push(player(400000));
  store.save(state);
  assert.deepEqual({ ...store.writeStats }, { inserted: 3, updated: 0, deleted: 2, rewrites: 0 }, '滑动窗口与追加走增量');

  let loaded = roundtrip();
  assert.deepEqual(loaded.records.map((item) => item.id), ['r2', 'r3'], '重启后顺序保持');
  assert.deepEqual(loaded.rooms.map((item) => item.roomId), [100002, 100003]);
  assert.equal(loaded.players.length, 1001);
  assert.equal(loaded.players[500].cardNum, 99);
  assert.equal(loaded.players.at(-1).uid, 400000);

  reset();
  loaded.rooms.reverse();
  store.save(loaded);
  assert.equal(store.writeStats.rewrites, 1, '顺序变化时整表重写');
  loaded = roundtrip();
  assert.deepEqual(loaded.rooms.map((item) => item.roomId), [100003, 100002], '重写后顺序正确');

  reset();
  const [a, b] = [loaded.players[0], loaded.players[1]];
  [a.uid, b.uid] = [b.uid, a.uid];
  store.save(loaded);
  assert.equal(store.writeStats.rewrites, 1, '唯一约束冲突回退整表重写');
  loaded = roundtrip();
  assert.equal(loaded.players[0].uid, 300001);
  assert.equal(loaded.players[1].uid, 300000);

  // 事务失败后缓存失效，下次仍写入正确。
  const bad = JSON.parse(JSON.stringify(loaded));
  bad.players.push({ uid: 300002, token: 't_conflict' });
  bad.players.push({ uid: 300002, token: 't_conflict2' });
  assert.throws(() => store.save(bad));
  loaded.players[2].cardNum = 7;
  store.save(loaded);
  assert.equal(roundtrip().players[2].cardNum, 7, '失败回滚后可继续保存');

  // 5000 玩家时单行修改远快于整表重写。
  const big = roundtrip();
  big.players = Array.from({ length: 5000 }, (_, i) => player(500000 + i, { stat: { games: i, history: 'x'.repeat(300) } }));
  store.save(big);
  big.players[10].cardNum = 1;
  reset();
  const started = process.hrtime.bigint();
  store.save(big);
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  assert.equal(store.writeStats.updated, 1);
  console.log(`增量存档：单行写入、滑动窗口、顺序回退、约束回退、回滚恢复均通过（5000 玩家改 1 行 ${ms.toFixed(1)}ms）`);
} finally {
  store.close();
  fs.rmSync(dir, { recursive: true, force: true });
}
