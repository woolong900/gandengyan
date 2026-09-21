const assert = require('node:assert/strict');
const { GameApp } = require('../server/app');
const { Table } = require('../server/table');
const { emptyPlayer } = require('../server/shared');
const { protocol } = require('../server/proto/protocol');
const rules = require('../server/rules');

const pushHeads = (frames) => frames.filter((frame) => frame.readUInt32BE(0) === 999)
  .map((frame) => JSON.parse(protocol[999].sc.decode(frame.subarray(12)).json).msghead);

const fixture = (clubId) => {
  const app = new GameApp({ persist: () => {}, now: () => 1000 });
  const param = rules.buildParam({ 人数: 2, 房费: '房主' });
  const roomId = clubId ? 123456 : 123457;
  const table = new Table({ roomId, gameType: 2, clubId, schemeId: clubId ? 1 : 0,
    num: 1, param1: param.param1, param2: param.param2, host: clubId ? 0 : 285633,
    config: rules.parseConfig(param.param1, param.param2) }, app.tableHost(roomId));
  app.tables.set(roomId, table);
  const players = [285633, 285634].map((uid, i) => {
    const player = emptyPlayer(uid);
    const connId = `player-${i}`;
    const sent = [];
    app.attach(connId, (frame) => sent.push(frame));
    app.conns.get(connId).player = player;
    app.conns.get(connId).roomId = roomId;
    app.playersByUid.set(uid, player);
    table.join(player, connId);
    return { player, sent };
  });
  return { app, table, players };
};

{
  const { app, table, players } = fixture(100001);
  assert.equal(table.hostUid, players[0].player.uid, '自动桌首位玩家临时成为房主');
  table.handle200(players[0].player.uid, 'dissmissroom', {});
  assert.equal(app.tables.has(table.roomId), true, '首位玩家退出后桌子仍在');
  assert.equal(table.seats().length, 1);
  assert.equal(table.hostUid, players[1].player.uid, '房主身份交给仍在座的玩家');
  assert.equal(players[0].player.roomId, 0);
  assert.equal(app.uidRoom.has(players[0].player.uid), false);
  assert.ok(pushHeads(players[0].sent).includes('exitroom'));
  assert.ok(!pushHeads(players[1].sent).includes('exitroom'));

  table.handle200(players[1].player.uid, 'dissmissroom', {});
  assert.equal(app.tables.has(table.roomId), false, '最后一位退出后清理旧桌');
  assert.equal(players[1].player.roomId, 0);
  assert.ok(pushHeads(players[1].sent).includes('exitroom'));
}

{
  const { app, table, players } = fixture(0);
  table.handle200(players[0].player.uid, 'dissmissroom', {});
  assert.equal(app.tables.has(table.roomId), false, '手动房间房主未开局仍可解散');
  assert.ok(pushHeads(players[0].sent).includes('exitroom'));
  assert.ok(pushHeads(players[1].sent).includes('exitroom'));
}

{
  const { app, table, players } = fixture(0);
  table.handle200(players[1].player.uid, 'dissmissroom', {});
  assert.equal(app.tables.has(table.roomId), true, '普通房非房主未开局退出后房间保留');
  assert.equal(table.seats().length, 1);
  assert.equal(table.hostUid, players[0].player.uid, '普通房房主保持不变');
  assert.equal(players[1].player.roomId, 0);
  assert.equal(app.uidRoom.has(players[1].player.uid), false);
  assert.equal(table.dismiss, null, '普通房非房主未开局退出不发起解散投票');
  assert.ok(pushHeads(players[1].sent).includes('exitroom'));
  assert.ok(!pushHeads(players[0].sent).includes('exitroom'));
}

{
  const { app, table, players } = fixture(100001);
  table.step = 1;
  table.handle200(players[0].player.uid, 'dissmissroom', {});
  assert.equal(app.tables.has(table.roomId), true, '俱乐部已经开局后仍走解散投票');
  assert.ok(table.dismiss && table.dismiss.agree.includes(players[0].player.uid));
  assert.ok(!pushHeads(players[0].sent).includes('exitroom'));
  app.cancel(`${table.roomId}:dismiss`);
}

console.log('未开局退出规则 ✓');
