#!/usr/bin/env node
const assert = require('assert');
const { Table } = require('../server/table');
const { protocol } = require('../server/proto/protocol');

const sent = new Map();
const players = Array.from({ length: 5 }, (_, index) => ({
  uid: 910001 + index,
  nickname: index === 4 ? '观战测试' : `玩家${index + 1}`,
  sex: 1,
  cardNum: 100,
  roomId: 0,
  lastIp: `203.0.113.${index + 1}`,
}));
const host = {
  now: () => Date.now(),
  log: () => {},
  send: (connId, bytes) => {
    if (!sent.has(connId)) sent.set(connId, []);
    sent.get(connId).push(Buffer.from(bytes));
  },
  persist: () => {}, schedule: () => {}, cancel: () => {},
  onDissolved: () => {}, onUidRoom: () => {}, botsEnabled: () => true,
  changeCards: (uid, delta) => { players.find((player) => player.uid === uid).cardNum += delta; },
};

const pushes = (connId, head) => (sent.get(connId) || []).map((bytes) => {
  if (bytes.readUInt32BE(0) !== 999) return null;
  const envelope = JSON.parse(protocol[999].sc.decode(bytes.subarray(12)).json);
  return envelope.msghead === head ? JSON.parse(envelope.msgdata) : null;
}).filter(Boolean);
const lastPush = (connId, head) => pushes(connId, head).at(-1);
const clear = (...ids) => ids.forEach((id) => sent.set(id, []));

const table = new Table({
  roomId: 765432, gameType: 17, clubId: 0, num: 1,
  param1: 10, param2: 100000000000, host: players[0].uid,
}, host);
for (let index = 0; index < 4; index++) table.join(players[index], `p${index}`, {
  latitude: 30,
  longitude: 114 + index * 0.01,
});
for (let index = 0; index < 4; index++) {
  table.handle200(players[index].uid, 'gameready', { site: index + 1 });
}
assert(table.round, '四人准备后应开局');
const watcher = players[4];
assert.equal(table.join(watcher, 'watch', { latitude: 30.01, longitude: 114 }).error, null);
const watcherMember = table.members.find((member) => member.view && member.player.uid === watcher.uid);
assert(watcherMember, '第五人应进入观战位');

const target = players[1];
const targetSeat = table.round.seatOf(target.uid);
const targetMember = table.members.find((member) => member.player.uid === target.uid);
clear('watch', 'p1');
assert.equal(table.handle200(watcher.uid, 'wsk_watch_view', { uid: target.uid }).error, 0);
let snapshot = lastPush('watch', 'game_info');
assert.equal(snapshot.begin, true,
  '切换视角仍在当前牌局中，不能被客户端解释成单局结束');
assert(snapshot.players.every((player) => player.card.hand_card.every((card) => card === 0)),
  '未授权时切换视角仍只能看到牌背');

watcherMember.location = {
  latitude: targetMember.location.latitude + 0.0001,
  longitude: targetMember.location.longitude,
};
clear('p1');
let denied = table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: target.uid });
assert.equal(denied.error, 1);
assert.equal(denied.what, '双方距离过近，不能查看手牌');
assert.equal(lastPush('p1', 'wsk_watch_hand_request'), undefined,
  '双方距离过近时不能向目标玩家发送看牌申请');
watcherMember.location = { latitude: 30.01, longitude: 114 };
assert.equal(table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: target.uid }).error, 0);
const request = lastPush('p1', 'wsk_watch_hand_request');
assert(request && request.request_id && request.watcher_uid === watcher.uid,
  '申请只能推送给当前视角的目标玩家');
clear('watch');
assert.equal(table.handle200(target.uid, 'wsk_watch_hand_reply', {
  request_id: request.request_id, watcher_uid: watcher.uid, agree: false,
}).error, 0);
assert.equal(lastPush('watch', 'wsk_watch_hand_granted'), undefined,
  '拒绝后不应提示观战者');

table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: target.uid });
const accepted = lastPush('p1', 'wsk_watch_hand_request');
clear('watch');
assert.equal(table.handle200(target.uid, 'wsk_watch_hand_reply', {
  request_id: accepted.request_id, watcher_uid: watcher.uid, agree: true,
}).error, 0);
snapshot = lastPush('watch', 'game_info');
assert.deepEqual(snapshot.players[targetSeat].card.hand_card, table.round.hands[targetSeat],
  '同意后应显示目标玩家真实手牌');
clear('watch');
assert.equal(table.handle200(target.uid, 'wsk_hand_sort', { sort_type: 2 }).error, 0);
const sortPush = lastPush('watch', 'wsk_hand_sort');
assert.deepEqual(sortPush, { uid: target.uid, sort_type: 2 },
  '玩家整理手牌后应把当前牌序同步给正在观看其视角的观战者');
table.handle200(watcher.uid, 'wsk_watch_view', { uid: target.uid });
snapshot = lastPush('watch', 'game_info');
assert.equal(snapshot.players[targetSeat].hand_sort_type, 2,
  '观战快照应携带目标玩家当前牌序');
assert(snapshot.players.filter((_, seat) => seat !== targetSeat)
  .every((player) => player.card.hand_card.every((card) => card === 0)),
  '同意一名玩家不能泄露其他玩家手牌');

const other = players[2];
const otherSeat = table.round.seatOf(other.uid);
clear('watch');
table.handle200(watcher.uid, 'wsk_watch_view', { uid: other.uid });
snapshot = lastPush('watch', 'game_info');
assert(snapshot.players.every((player) => player.card.hand_card.every((card) => card === 0)),
  '切换到未授权玩家时应继续显示牌背');
const otherTeammate = table.seats()[table.round.teammate(otherSeat)];
const otherTeammateLocation = { ...otherTeammate.location };
otherTeammate.location = { latitude: 30.0101, longitude: 114 };
clear('p2');
denied = table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: other.uid });
assert.equal(denied.error, 1);
assert.equal(denied.what, '您与该玩家的队友距离过近，不能查看手牌');
assert.equal(lastPush('p2', 'wsk_watch_hand_request'), undefined,
  '观战者接近目标玩家队友时也不能发送看牌申请');
otherTeammate.location = otherTeammateLocation;
const otherMember = table.members.find((member) => member.player.uid === other.uid);
const otherLocation = { ...otherMember.location };
otherMember.location = null;
otherMember.player.lastIp = watcher.lastIp;
clear('p2');
denied = table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: other.uid });
assert.equal(denied.error, 1);
assert.equal(denied.what, '检测到双方使用同一网络，不能查看手牌');
assert.equal(lastPush('p2', 'wsk_watch_hand_request'), undefined,
  '定位缺失且双方使用同一公网 IP 时不能向目标玩家发送看牌申请');
otherMember.player.lastIp = '203.0.113.20';
table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: other.uid });
const otherRequest = lastPush('p2', 'wsk_watch_hand_request');
assert(otherRequest && otherRequest.request_id,
  '定位缺失但公网 IP 不同时应允许正常发送看牌申请');
otherMember.location = otherLocation;
table.handle200(other.uid, 'wsk_watch_hand_reply', {
  request_id: otherRequest.request_id, watcher_uid: watcher.uid, agree: true,
});
snapshot = lastPush('watch', 'game_info');
assert.deepEqual(snapshot.players[otherSeat].card.hand_card, table.round.hands[otherSeat],
  '同一观战者可以取得第二名玩家的授权');
assert(snapshot.players[targetSeat].card.hand_card.every((card) => card === 0),
  '当前视角不能同时显示此前已授权玩家的手牌');
table.handle200(watcher.uid, 'wsk_watch_view', { uid: target.uid });
snapshot = lastPush('watch', 'game_info');
assert.deepEqual(snapshot.players[targetSeat].card.hand_card, table.round.hands[targetSeat],
  '切回已授权玩家时授权应继续有效');
assert(snapshot.players[otherSeat].card.hand_card.every((card) => card === 0),
  '切回后只能显示当前视角玩家的手牌');

const nearRejoined = table.join(watcher, 'watch-near', {
  latitude: targetMember.location.latitude + 0.0001,
  longitude: targetMember.location.longitude,
});
assert(nearRejoined.game.players[targetSeat].card.hand_card.every((card) => card === 0),
  '已授权观战者重连到目标玩家附近后也必须隐藏手牌');
denied = table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: target.uid });
assert.equal(denied.what, '双方距离过近，不能查看手牌',
  '已有授权不能绕过重新进房后的距离校验');
table.join(watcher, 'watch', { latitude: 30.01, longitude: 114 });

const botTarget = players[3];
const botSeat = table.round.seatOf(botTarget.uid);
table.members.find((member) => member.player.uid === botTarget.uid).bot = true;
clear('watch', 'p3');
table.handle200(watcher.uid, 'wsk_watch_view', { uid: botTarget.uid });
assert.equal(table.handle200(watcher.uid, 'wsk_watch_hand_request', { uid: botTarget.uid }).error, 0);
snapshot = lastPush('watch', 'game_info');
assert.deepEqual(snapshot.players[botSeat].card.hand_card, table.round.hands[botSeat],
  '机器人没有客户端确认弹窗，申请后应由服务端直接授权');
assert(lastPush('watch', 'wsk_watch_hand_granted'),
  '机器人自动同意后应通知观战者更新按钮状态');
assert.equal(lastPush('p3', 'wsk_watch_hand_request'), undefined,
  '机器人没有客户端连接，不应继续等待确认弹窗');
table.handle200(watcher.uid, 'wsk_watch_view', { uid: target.uid });

const persisted = table.dump();
const restored = Table.fromDump(persisted, host,
  new Map(players.map((player) => [player.uid, player])));
const restoredSession = restored.wskWatchSessions.get(watcher.uid);
assert(restoredSession && restoredSession.grants.has(target.uid)
  && restoredSession.grants.has(other.uid),
'服务重启恢复房间后，整场大局的已同意看牌授权必须保留');
assert.equal(restoredSession.pending.size, 0, '未处理的看牌申请不能跨服务重启恢复');

table.dropWatcher(watcher.uid, { notify: true });
const rejoined = table.join(watcher, 'watch2', { latitude: 30.01, longitude: 114 });
assert.equal(rejoined.error, null);
assert.deepEqual(rejoined.game.players[targetSeat].card.hand_card, table.round.hands[targetSeat],
  '离房重进后本局授权仍应有效');

table.round = null;
clear('watch2');
table.startGame();
assert.equal(table.wskWatchSessions.size, 1, '新一小局不能清除整场大局的看牌授权');
snapshot = lastPush('watch2', 'game_begin');
const nextTargetSeat = table.round.seatOf(target.uid);
assert.deepEqual(snapshot.players[nextTargetSeat].card.hand_card, table.round.hands[nextTargetSeat],
  '玩家同意一次后，新小局开局快照应直接继续显示其手牌');
const nextViewState = lastPush('watch2', 'wsk_watch_view');
assert(nextViewState && nextViewState.uid === target.uid && nextViewState.hand_granted,
  '新小局必须同步恢复观战客户端的已授权按钮状态');

console.log('说胡子观战切换与整场看牌授权测试通过');
