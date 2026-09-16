#!/usr/bin/env node
const assert = require('node:assert/strict');
const { GameApp } = require('../server/app');
const { Table } = require('../server/table');
const rules = require('../server/rules');

const app = new GameApp({ persist: () => {} });
const { player } = app.loginGuest('bot-settings-device');
const table = new Table({ roomId: 345678, gameType: 2, clubId: 0, num: 1, param1: 0,
  param2: 0, host: player.uid, config: rules.parseConfig(0, 0) }, app.tableHost(345678));
app.tables.set(table.roomId, table);
assert.equal(table.join(player, 'conn').error, null);

app.maybeFillBots(table);
assert.equal(table.members.filter((member) => member.bot).length, 1);
const firstBotUid = table.members.find((member) => member.bot).player.uid;
const disabled = app.setBotsEnabled(false);
assert.deepEqual([disabled.enabled, disabled.removed, table.members.length], [false, 1, 1]);
assert.equal(app.playerByUid(firstBotUid), null);
assert.equal(app.dump().botSettings.enabled, false);

app.maybeFillBots(table);
assert.equal(table.members.filter((member) => member.bot).length, 0);
const enabled = app.setBotsEnabled(true);
assert.deepEqual([enabled.enabled, enabled.filledRooms], [true, 1]);
assert.equal(table.members.filter((member) => member.bot).length, 1);

table.round = { over: false, dump: () => ({}) };
const activeBotUid = table.members.find((member) => member.bot).player.uid;
const disabledDuringGame = app.setBotsEnabled(false);
assert.deepEqual([disabledDuringGame.removed, disabledDuringGame.playingBots], [0, 1]);
assert.equal(table.members.some((member) => member.player.uid === activeBotUid), true);
table.round = null;
assert.equal(table.removeBots(), 1);
assert.equal(app.playerByUid(activeBotUid), null);

const restored = new GameApp({ persist: () => {} });
restored.restore(app.dump());
assert.equal(restored.fillBotsOn(), false);
for (const id of app.timeouts.values()) clearTimeout(id);
for (const id of restored.timeouts.values()) clearTimeout(id);
console.log('机器人后台开关：开启补位、关闭清理、牌局中延迟退出和持久化均通过');
