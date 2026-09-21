#!/usr/bin/env node
const assert = require('assert');
const rules = require('../server/qjshz-rules');
const { WskRound } = require('../server/qjshz-round');
const { Table } = require('../server/table');
const { protocol } = require('../server/proto/protocol');

const type = (cards) => rules.classify(cards);
assert.equal(rules.buildDeck(false).length, 108);
assert.equal(rules.buildDeck(true).length, 92);
{
  const wanted = { 3: 5, 15: 4, joker: 2, 13: 6 };
  const targetSeat = 2;
  const deck = rules.buildDeckForSeat(rules.parseConfig(10, 0), wanted, targetSeat, 4);
  const hand = deck.filter((_, index) => index % 4 === targetSeat);
  const rankCount = (rank) => hand.filter((card) => rank === 'joker'
    ? card >= 170 : rules.cardValue(card) === Number(rank)).length;
  assert.equal(hand.length, 27);
  for (const [rank, count] of Object.entries(wanted)) {
    assert.equal(rankCount(rank), count, `指定的 ${rank} 张数应准确`);
  }
  assert.deepEqual(deck.slice().sort((a, b) => a - b), rules.buildDeck(false).sort((a, b) => a - b),
    '指定起手牌不能改变整副牌');
}
assert.equal(type([31]).type, rules.TYPE.SINGLE);
assert.equal(type([31, 32]).type, rules.TYPE.DOUBLE);
assert.equal(type([31, 32, 33]).type, rules.TYPE.THREE);
assert.equal(type([31, 32, 41, 42]).type, rules.TYPE.SEQ2);
assert.equal(type([31, 32, 33, 41, 42, 43]).type, rules.TYPE.SEQ3);
assert.equal(type([51, 102, 133]).type, rules.TYPE.WSK_FALSE);
assert.equal(type([51, 101, 131]).type, rules.TYPE.WSK_TRUE);
assert.equal(type([51, 51, 101, 101, 131, 131]), null, '两套真五十K不能合成六张牌型');
assert.equal(type([170, 170, 180, 180]).type, rules.TYPE.BOMB_KING);
assert.equal(type([31, 32, 33, 34]).type, rules.TYPE.BOMB);
assert(!rules.classify([31, 41]));

const plain = rules.parseConfig(10, 0);
const trueWsk = type([51, 101, 131]);
const bomb4 = type([31, 32, 33, 34]);
assert(rules.canBeat(bomb4, trueWsk, plain));
assert(!rules.canBeat(bomb4, trueWsk, { ...plain, 真五十K大过四炸: true }));
assert(rules.canBeat(trueWsk, bomb4, { ...plain, 真五十K大过四炸: true }));
const bomb8 = type([31, 31, 32, 32, 33, 33, 34, 34]);
const kingBomb = type([170, 170, 180, 180]);
assert(rules.canBeat(kingBomb, bomb8, plain), '默认四大天王大过八炸');
assert(!rules.canBeat(bomb8, kingBomb, plain));
const bomb8First = { ...plain, 八炸大过四大天王: true };
assert(rules.canBeat(bomb8, kingBomb, bomb8First), '勾选后八炸大过四大天王');
assert(!rules.canBeat(kingBomb, bomb8, bomb8First));

const pair55_66 = type([51, 52, 61, 62]);
const pair66_77 = type([61, 62, 71, 72]);
const pair77_88 = type([71, 72, 81, 82]);
const pair55_66_77 = type([51, 52, 61, 62, 71, 72]);
const pair88_99 = type([81, 82, 91, 92]);
const pair88_99_10 = type([81, 82, 91, 92, 101, 102]);
const pair99_10 = type([91, 92, 101, 102]);
assert(rules.canBeat(pair66_77, pair55_66, plain), '5566 只能由紧邻的 6677 压');
assert(!rules.canBeat(pair77_88, pair55_66, plain), '两连对不能跨级压');
assert(!rules.canBeat(pair88_99, pair55_66_77, plain), '三连对不能由两连对压');
assert(rules.canBeat(pair88_99_10, pair55_66_77, plain), '三连对可以由更大的三连对压');
assert(rules.canBeat(trueWsk, pair99_10, plain), '真五十K必须可以压普通两连对');
const plane88_99 = type([81, 82, 83, 91, 92, 93]);
const planeJJ_QQ = type([111, 112, 113, 121, 122, 123]);
const planeJJ_QQ_KK = type([111, 112, 113, 121, 122, 123, 131, 132, 133]);
assert(rules.canBeat(planeJJ_QQ, plane88_99, plain), '飞机可以跨点数压');
assert(!rules.canBeat(planeJJ_QQ_KK, plane88_99, plain), '飞机只能用相同长度的飞机压');

assert.equal(rules.validateRoomConfig({ gameType: 17, num: 1, param1: 10, param2: 0 }), null);
assert.equal(rules.validateRoomConfig({ gameType: 17, num: 5, param1: 10, param2: 0 }), '局数参数无效');
assert.equal(rules.validateRoomConfig({ gameType: 17, num: 1, param1: 3, param2: 0 }), '底分参数无效');
assert.equal(rules.parseConfig(1, 10 ** 13).八炸大过四大天王, true);

const seats = Array.from({ length: 4 }, (_, index) => ({
  player: { uid: 700001 + index, nickname: `机器人${index + 1}`, sex: 1 },
  score: 0,
}));
const events = [];
let final = null;
const table = { gameType: 17, roomId: 123456, hostUid: seats[0].player.uid, num: 1, param1: 10, param2: 0, step: 1 };
const io = {
  table,
  log: () => {},
  all: (msghead, data) => events.push({ msghead, data }),
  each: (msghead, build) => {
    for (let seat = 0; seat < 4; seat++) events.push({ msghead, data: build(seat), seat });
  },
  one: (seat, msghead, data) => events.push({ msghead, data, seat }),
  over: (result) => { final = result; },
};

// 翻牌的玩家为庄，另一张同牌的玩家换到庄家对面。
{
  const arrangedSeats = Array.from({ length: 4 }, (_, index) => ({
    player: { uid: 710001 + index, nickname: `换座${index + 1}`, sex: 1 },
    score: 0,
    site: index + 1,
  }));
  const arrangedEvents = [];
  const arrangedTable = { ...table, dealerUid: 0 };
  const arrangedIo = {
    ...io,
    table: arrangedTable,
    all: (msghead, data) => arrangedEvents.push({ msghead, data }),
    each: (msghead, build) => {
      for (let seat = 0; seat < 4; seat++) arrangedEvents.push({ msghead, data: build(seat), seat });
    },
  };
  const arranged = new WskRound(arrangedSeats, { config: plain, dealerSeat: 3, flipIndex: 0 }, arrangedIo);
  arranged.start(rules.buildDeck(false));
  assert.equal(arranged.dealerSeat, 0);
  assert.equal(arranged.friendCard, 170);
  assert.equal(arranged.turn, 0);
  assert.equal(arranged.uid(2), 710002, '拿到另一张翻牌的玩家应换到庄家对面');
  assert.deepEqual(arranged.exchangePosition, [710002, 2, 710003, 1]);
  assert.equal(arrangedTable.dealerUid, 710001);
  const begin = arrangedEvents.find((event) => event.msghead === 'game_begin');
  assert.deepEqual(begin.data.exchange_position, arranged.exchangePosition);
  const friend = arrangedEvents.find((event) => event.msghead === 'game_friendcard');
  assert.deepEqual(friend.data, { deal_uid: 710001, friend_card: 170 });
}

const round = new WskRound(seats, { config: plain, dealerSeat: 0 }, io);
round.start();
assert.deepEqual(round.hands.map((hand) => hand.length), [27, 27, 27, 27]);
const mine = round.snapshot(0);
assert.equal(mine.players[0].card.hand_card.length, 27);
assert(mine.players[1].card.hand_card.every((card) => card === 0));

let turns = 0;
while (!round.over && turns++ < 3000) round.autoPlay(round.turn);
assert(round.over, '自动对局应能完整结束');
assert(final, '应调用牌桌结算');
assert.equal(final.scores.reduce((sum, score) => sum + score, 0), 0);
assert([0, 1].some((team) => round.teamFinished(team)), '任意一队两人出完后应结束');
assert(round.finishOrder.length >= 2 && round.finishOrder.length <= 3, '结束时另一队可以仍有手牌');
assert(events.some((event) => event.msghead === 'game_step'));
assert(events.some((event) => event.msghead === 'game_score'));
assert.equal(events.filter((event) => event.msghead === 'game_end').length, 4);
assert(round.tape.finish().steps.length > 0);

const restored = WskRound.restore(round.dump(), seats, io, plain);
assert.equal(restored.over, true);
assert.deepEqual(restored.ranks, round.ranks);
assert.deepEqual(restored.pickScores, round.pickScores);

const scenario = ({ hands, turn = 0, ranks = [0, 0, 0, 0], finishOrder = [], firstOutSeat = -1,
  pickScores = [0, 0, 0, 0], config = plain } = {}) => {
  const scenarioEvents = [];
  let scenarioFinal = null;
  const scenarioIo = {
    table,
    log: () => {},
    all: (msghead, data) => scenarioEvents.push({ msghead, data }),
    each: (msghead, build) => {
      for (let seat = 0; seat < 4; seat++) scenarioEvents.push({ msghead, data: build(seat), seat });
    },
    one: (seat, msghead, data) => scenarioEvents.push({ msghead, data, seat }),
    over: (result) => { scenarioFinal = result; },
  };
  const tested = new WskRound(seats, { config, dealerSeat: 0 }, scenarioIo);
  tested.start();
  scenarioEvents.length = 0;
  tested.hands = hands.map((hand) => hand.slice());
  tested.turn = turn;
  tested.lastPlay = null;
  tested.lastPlaySeat = -1;
  tested.roundState = new Array(4).fill('none');
  tested.roundState[turn] = 'turn';
  tested.lastCards = Array.from({ length: 4 }, () => []);
  tested.passed = new Set();
  tested.ranks = ranks.slice();
  tested.finishOrder = finishOrder.slice();
  tested.firstOutSeat = firstOutSeat;
  tested.pickScores = pickScores.slice();
  tested.roundScore = [0, 0, 0, 0];
  tested.tableScore = 0;
  tested.tableScoreCards = [];
  tested.allPutCards = [];
  tested.curRound = [];
  tested.over = false;
  return { round: tested, events: scenarioEvents, final: () => scenarioFinal };
};

// 普通一墩结束只应让赢家继续领牌，不能播放“接风”。
{
  const test = scenario({ hands: [[31, 41], [51], [61], [71]] });
  assert.equal(test.round.play(0, [31, 31]), null);
  assert.equal(test.round.pass(1), null);
  assert.equal(test.round.pass(2), null);
  assert.equal(test.round.pass(3), null);
  assert.equal(test.round.turn, 0);
  assert(!test.events.some((event) => event.msghead === 'game_successor'));
  assert(test.events.some((event) => event.msghead === 'game_operator' && event.data.uid === seats[0].player.uid && event.data.round));
}

// 玩家出完以后，必须等另外三家全部过牌，才由他的对家接风。
{
  const test = scenario({ hands: [[31], [41], [51], [61]] });
  assert.equal(test.round.play(0, [31, 31]), null);
  assert.equal(test.round.pass(1), null);
  assert.equal(test.round.pass(2), null);
  assert(!test.events.some((event) => event.msghead === 'game_successor'));
  assert.equal(test.round.pass(3), null);
  const successors = test.events.filter((event) => event.msghead === 'game_successor');
  assert.equal(successors.length, 1);
  assert.equal(successors[0].data.uid, seats[2].player.uid);
  assert.equal(test.round.turn, 2);
}

// 一队两人全部出完立即结束；一、三游奖励 30 分，再按 100 分标准线结算。
{
  const scoreConfig = { ...plain, 底分: 0.1, 底子: 10, 彩倍: 1, 尾游捡分: false };
  const test = scenario({
    hands: [[], [], [31], [51, 52]],
    turn: 2,
    ranks: [1, 2, 0, 0],
    finishOrder: [0, 1],
    firstOutSeat: 0,
    pickScores: [80, 50, 40, 20],
    config: scoreConfig,
  });
  assert.equal(test.round.play(2, [31, 31]), null);
  assert.equal(test.round.over, true);
  assert(test.round.hands[3].length > 0, '另一队仍有手牌也应结束');
  assert.deepEqual(test.final().scores, [1600, -1600, 1600, -1600]);
  assert.deepEqual(test.final().stat, [
    { wsk_winner_count: 1, wsk_lose_count: 0, wsk_first_count: 1, wsk_last_count: 0 },
    { wsk_winner_count: 0, wsk_lose_count: 1, wsk_first_count: 0, wsk_last_count: 0 },
    { wsk_winner_count: 1, wsk_lose_count: 0, wsk_first_count: 0, wsk_last_count: 0 },
    { wsk_winner_count: 0, wsk_lose_count: 1, wsk_first_count: 0, wsk_last_count: 1 },
  ]);
}

// 155 分按 150 分结算：(150 - 100) * 0.1 + 10 = 15。
{
  const scoreConfig = { ...plain, 底分: 0.1, 底子: 10, 彩倍: 2, 尾游捡分: true };
  const test = scenario({
    hands: [[], [], [], []],
    turn: 0,
    ranks: [1, 2, 3, 0],
    finishOrder: [0, 1, 2],
    firstOutSeat: 0,
    pickScores: [65, 40, 60, 35],
    config: scoreConfig,
  });
  test.round.finishGame();
  const result = test.round.outcome();
  assert.equal(result.rankBonus, 30);
  assert.deepEqual(result.judged, [155, 45]);
  assert.equal(result.settlementScore, 150);
  assert.equal(result.grandSlam, false);
  assert.deepEqual(test.final().scores, [1500, -1500, 1500, -1500]);
}

// 一、二游并拿满 200 抓分后为 260 分满贯：彩倍只乘抓分收益，底子不加倍。
{
  const scoreConfig = { ...plain, 底分: 0.1, 底子: 10, 彩倍: 1.5, 尾游捡分: true };
  const test = scenario({
    hands: [[], [31], [], [41]],
    turn: 1,
    ranks: [1, 0, 2, 0],
    finishOrder: [0, 2],
    firstOutSeat: 0,
    pickScores: [200, 0, 0, 0],
    config: scoreConfig,
  });
  test.round.finishGame();
  const result = test.round.outcome();
  assert.deepEqual(result.judged, [260, -60]);
  assert.equal(result.grandSlam, true);
  assert.deepEqual(test.final().scores, [3400, -3400, 3400, -3400]);
}

// 两队都是 100 分时，一游所在队只赢底子。
{
  const scoreConfig = { ...plain, 底分: 0.1, 底子: 20, 彩倍: 2, 尾游捡分: true };
  const test = scenario({
    hands: [[], [], [31], []],
    turn: 2,
    ranks: [1, 2, 0, 3],
    finishOrder: [0, 1, 3],
    firstOutSeat: 0,
    pickScores: [60, 50, 40, 50],
    config: scoreConfig,
  });
  test.round.finishGame();
  assert.deepEqual(test.round.outcome().judged, [100, 100]);
  assert.deepEqual(test.final().scores, [2000, -2000, 2000, -2000]);
}

// 走一遍真实 Table 生命周期，覆盖建桌规则分派、房卡、ready、战绩和回放。
const sent = [];
const tablePlayers = Array.from({ length: 4 }, (_, index) => ({
  uid: 800001 + index, nickname: `桌测${index + 1}`, sex: 1, cardNum: 100, roomId: 0,
}));
const host = {
  now: () => 1000,
  log: () => {},
  send: (connId, bytes) => sent.push({ connId, bytes }),
  persist: () => {},
  schedule: () => {},
  cancel: () => {},
  onDissolved: () => {},
  onUidRoom: () => {},
  changeCards: (uid, delta) => {
    const player = tablePlayers.find((item) => item.uid === uid);
    player.cardNum += delta;
  },
  mintPlaybackId: () => 'wsk-test-playback',
  botsEnabled: () => true,
};
const tableRound = new Table({
  roomId: 654321, gameType: 17, clubId: 0, num: 1, param1: 10, param2: 0, host: tablePlayers[0].uid,
}, host);
tablePlayers.forEach((player, index) => {
  const joined = tableRound.join(player, `c${index}`);
  assert(Array.isArray(joined.game.players), '说胡子等待开局时也必须返回完整 game_info');
  assert.equal(joined.game.begin, false);
  assert.equal(joined.game.players.length, index + 1);
});
const waiting = tableRound.waitingGameSnapshot();
assert.equal(waiting.players.length, 4);
assert(waiting.players.every((player) => Array.isArray(player.card.hand_card)));
tablePlayers.forEach((player, index) => tableRound.handle200(player.uid, 'gameready', { site: index + 1 }));
assert(tableRound.round instanceof WskRound);
assert.equal(tablePlayers[0].cardNum, 96);
let tableTurns = 0;
while (tableRound.round && tableTurns++ < 3000) {
  const activeRound = tableRound.round;
  activeRound.autoPlay(activeRound.turn);
}
assert(!tableRound.round, 'Table 应在说胡子单局结束后回到局间');
assert.equal(tableRound.hands.length, 1);
assert.equal(tableRound.hands[0].playback.roomInfo.type, 17);
assert.equal(tableRound.hands[0].playback.roomInfo.scoreRatio, 100);
assert(sent.length > 0);
tableRound.sendTotalEnd();
const totalEnd = sent.map(({ bytes }) => {
  const frame = Buffer.from(bytes);
  if (frame.readUInt32BE(0) !== 999) return null;
  const envelope = JSON.parse(protocol[999].sc.decode(frame.subarray(12)).json);
  return envelope.msghead === 'game_bye' ? JSON.parse(envelope.msgdata) : null;
}).find(Boolean);
assert(totalEnd, '说胡子应能发送总战绩');
assert('wsk_winner_count' in totalEnd.info[0]);
assert('wsk_lose_count' in totalEnd.info[0]);
assert('wsk_first_count' in totalEnd.info[0]);
assert('wsk_last_count' in totalEnd.info[0]);
assert(!('ag' in totalEnd.info[0]), '说胡子总战绩不能带麻将暗杠字段');
assert(!('zm' in totalEnd.info[0]), '说胡子总战绩不能带麻将自摸字段');

console.log(`说胡子服务端测试通过：规则对局 ${turns} 手，牌桌对局 ${tableTurns} 手`);
