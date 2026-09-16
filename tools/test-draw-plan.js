#!/usr/bin/env node
const assert = require('node:assert/strict');
const { Round } = require('../server/round');
const { AdminData } = require('../server/admin-data');
const rules = require('../server/rules');

const seats = [101, 102].map((uid, index) => ({ player: { uid, nickname: `玩家${uid}` },
  site: index + 1, score: 0 }));
const io = { log() {}, each() {}, all() {}, one() {} };
const round = new Round(seats, { config: rules.parseConfig(0, 0), dealerSeat: 0 }, io);
round.start();
round.offerSelfOps = () => {};

const before = round.wall.remainCards();
const selected = [before.at(-1), before.at(-2)];
assert.match(round.setDrawPlan(101, [999]).error, /没有足够/);
assert.match(round.setDrawPlan(999, selected).error, /不在本局/);
assert.equal(round.setDrawPlan(101, selected).cards.length, 2);
const otherDraws = [];
for (let i = 0; i < 5; i++) { round.draw(1); otherDraws.push(round.drawn[1]); }
round.draw(0);
assert.equal(round.drawn[0], selected[0]);
assert.deepEqual(round.drawPlan.cards, [selected[1]]);

const restored = Round.restore(JSON.parse(JSON.stringify(round.dump())), seats, io, round.config);
restored.offerSelfOps = () => {};
assert.deepEqual(restored.drawPlan.cards, [selected[1]]);
for (let i = 0; i < 4; i++) { restored.draw(1); otherDraws.push(restored.drawn[1]); }
restored.draw(0);
assert.equal(restored.drawn[0], selected[1]);
assert.equal(restored.drawPlan, null);
const after = restored.wall.remainCards();
const used = [...otherDraws, selected[0], selected[1]];
assert.equal(after.length, before.length - used.length);
for (const card of new Set(selected)) {
  assert.equal(otherDraws.filter((tile) => tile === card).length <=
    before.filter((tile) => tile === card).length - selected.filter((tile) => tile === card).length, true);
}
for (const card of new Set(before)) {
  assert.equal(after.filter((tile) => tile === card).length +
    used.filter((tile) => tile === card).length,
  before.filter((tile) => tile === card).length);
}

const app = { tables: new Map([[100001, { roomId: 100001, closed: false, round: restored,
  members: seats.map((seat) => ({ player: seat.player, site: seat.site })), config: restored.config,
  step: 1, num: 1, gameType: 2, clubId: 0, schemeId: 0, hostUid: 101 }]]), persist() {} };
const admin = new AdminData(app, null);
assert.equal(admin.room(100001).wall.remaining, restored.wall.remain());
assert.equal(admin.setRoomDrawPlan(100001, { uid: 101, cards: [after[0]] }).drawPlan.cards[0], after[0]);
assert.equal(admin.room(100001).wall.drawPlan.uid, 101);
assert.equal(admin.clearRoomDrawPlan(100001).cleared.uid, 101);
assert.equal(admin.room(100001).wall.drawPlan, null);
const nearlyEmpty = require('../server/mahjong').makeWall({
  dun: [[1], [2], [], []], taken: 0, starts: [0, 1, 2, 2], sizes: [1, 1, 0, 0], total: 2,
});
assert.equal(nearlyEmpty.drawAvoid([1, 2]).preserved, false);
console.log('指定摸牌顺序：校验、预留、重启恢复、后台读写均通过');
