#!/usr/bin/env node
const assert = require('node:assert/strict');
const { GameApp } = require('../server/app');
const { Table } = require('../server/table');
const rules = require('../server/rules');

const app = new GameApp({ persist: () => {} });
app.loginGuest('bot-settings-device-285633');
app.loginGuest('bot-settings-device-285634');
app.loginGuest('bot-settings-device-285635');
const { player } = app.loginGuest('bot-settings-device-285636');
assert.equal(player.uid, 285636);
const table = new Table({ roomId: 345678, gameType: 2, clubId: 0, num: 1, param1: 0,
  param2: 0, host: player.uid, config: rules.parseConfig(0, 0) }, app.tableHost(345678));
app.tables.set(table.roomId, table);
assert.equal(table.join(player, 'conn').error, null);

app.maybeFillBots(table);
assert.equal(table.members.filter((member) => member.bot).length, 1);
assert.equal(table.creatorUid, 285636);

// 创建者资格不能随当前房主变化。
table.hostUid = 285633;
assert.equal(app.botRoomEligible(table), true);
table.hostUid = 285636;

// 俱乐部自动桌是服务端创建的；285636 即使第一个入桌并成为房主也不得补机器人。
const autoTable = new Table({ roomId: 345677, gameType: 2, clubId: 1, schemeId: 7, num: 1,
  param1: 0, param2: 0, host: 0, config: rules.parseConfig(0, 0) }, app.tableHost(345677));
app.tables.set(autoTable.roomId, autoTable);
assert.equal(autoTable.join(player, 'auto-conn').error, null);
assert.equal(autoTable.hostUid, 285636);
assert.equal(autoTable.creatorUid, 0);
app.maybeFillBots(autoTable);
assert.equal(autoTable.members.filter((member) => member.bot).length, 0,
  '服务端创建的俱乐部自动桌不应因 285636 首个入桌而补机器人');

const otherOwner = app.playerByUid(285633);
const otherTable = new Table({ roomId: 345679, gameType: 2, clubId: 0, num: 1, param1: 0,
  param2: 0, host: otherOwner.uid, config: rules.parseConfig(0, 0) }, app.tableHost(345679));
app.tables.set(otherTable.roomId, otherTable);
assert.equal(otherTable.join(otherOwner, 'other-conn').error, null);
app.maybeFillBots(otherTable);
assert.equal(otherTable.members.filter((member) => member.bot).length, 0,
  '非 285636 房主的房间不应安排机器人');

const firstBotUid = table.members.find((member) => member.bot).player.uid;
const disabled = app.setBotsEnabled(false);
assert.deepEqual([disabled.enabled, disabled.removed, table.members.length], [false, 1, 1]);
assert.equal(app.playerByUid(firstBotUid), null);
assert.equal(app.dump().botSettings.enabled, false);

app.maybeFillBots(table);
assert.equal(table.members.filter((member) => member.bot).length, 0);

// 模拟旧版本已给非准入房间留下机器人，重新开启时也必须清理。
otherTable.addBots([{ player: app.mintBot(2, otherTable.roomId), site: 2 }]);
const enabled = app.setBotsEnabled(true);
assert.deepEqual([enabled.enabled, enabled.removed, enabled.filledRooms], [true, 1, 1]);
assert.equal(table.members.filter((member) => member.bot).length, 1);
assert.equal(otherTable.members.filter((member) => member.bot).length, 0);

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

// 旧版本可能已给其他房主的等待房添加过机器人；重启恢复时必须清理。
const legacyApp = new GameApp({ persist: () => {} });
const { player: legacyOwner } = legacyApp.loginGuest('legacy-bot-owner-285633');
const legacyTable = new Table({ roomId: 345680, gameType: 2, clubId: 0, num: 1, param1: 0,
  param2: 0, host: legacyOwner.uid, config: rules.parseConfig(0, 0) }, legacyApp.tableHost(345680));
legacyApp.tables.set(legacyTable.roomId, legacyTable);
assert.equal(legacyTable.join(legacyOwner, 'legacy-conn').error, null);
legacyTable.addBots([{ player: legacyApp.mintBot(2, legacyTable.roomId), site: 2 }]);
const legacyRestored = new GameApp({ persist: () => {} });
legacyRestored.restore(legacyApp.dump());
assert.equal(legacyRestored.tables.get(legacyTable.roomId).members.some((member) => member.bot), false,
  '恢复旧存档时应清理非 285636 房间中的等待机器人');

const restoredEligible = new GameApp({ persist: () => {} });
restoredEligible.restore({ ...legacyApp.dump(), botSettings: { enabled: true },
  rooms: [table.dump()], players: app.dump().players });
assert.equal(restoredEligible.tables.get(table.roomId).creatorUid, 285636,
  '房间存档必须保留原始创建者');

for (const id of app.timeouts.values()) clearTimeout(id);
for (const id of restored.timeouts.values()) clearTimeout(id);
for (const id of legacyApp.timeouts.values()) clearTimeout(id);
for (const id of legacyRestored.timeouts.values()) clearTimeout(id);
for (const id of restoredEligible.timeouts.values()) clearTimeout(id);
console.log('机器人后台开关：仅 285636 创建房准入、开启补位、关闭清理、牌局中延迟退出和持久化均通过');
