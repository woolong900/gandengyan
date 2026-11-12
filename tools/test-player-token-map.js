#!/usr/bin/env node
const assert = require('node:assert/strict');
const { PlayerTokenMap } = require('../server/app');

const a = { uid: 1 };
const b = { uid: 2 };
const map = new PlayerTokenMap();
map.set('ta', a).set('tb', b);
assert.equal(map.tokenOf(a), 'ta');
assert.equal(map.tokenOf(b), 'tb');
map.set('ta2', a);
assert.equal(map.tokenOf(a), 'ta', '同一玩家多个 token 时返回最早的');
map.delete('ta');
assert.equal(map.tokenOf(a), 'ta2', '删除主 token 后回落到其他 token');
map.set('tb', a);
assert.equal(map.tokenOf(b), '', '被覆盖的玩家不再有 token');
map.clear();
assert.equal(map.tokenOf(a), '');
assert.equal(map.tokenOf(null), '');
const big = new PlayerTokenMap();
const players = Array.from({ length: 50000 }, (_, uid) => ({ uid }));
players.forEach((player) => big.set(`t_${player.uid}`, player));
const started = process.hrtime.bigint();
for (const player of players) assert.equal(big.tokenOf(player), `t_${player.uid}`);
assert.ok(Number(process.hrtime.bigint() - started) / 1e6 < 200, '5 万玩家反查应在 200ms 内');
console.log('PlayerTokenMap：反查、覆盖、删除回落均通过');
