#!/usr/bin/env node
/**
 * 番数和特殊胡型的定向测试。
 *
 * 自对局是随机发牌，抢杠胡、清一色、热铳这些分支几百局也未必碰上一次，
 * 所以这里直接摆好牌面，把每条规则单独走一遍。
 *
 * usage: node tools/rulestest.js
 */
const { Round } = require('../server/round');
const rules = require('../server/rules');
const mahjong = require('../server/mahjong');

let pass = 0;
let fail = 0;

const check = (name, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) {
    pass += 1;
    console.log(`  ✓ ${name}`);
  } else {
    fail += 1;
    console.log(`  ✗ ${name}\n      得到 ${JSON.stringify(got)}\n      期望 ${JSON.stringify(want)}`);
  }
};

/** 收下所有下行消息的假 io，牌桌逻辑不关心谁在听 */
const fakeIo = (log) => ({
  log: (line) => log.push(line),
  all: (head, data) => log.push({ head, data }),
  each: (head, build) => log.push({ head, data: build(0) }),
  one: (seat, head, data) => log.push({ head, seat, data }),
  over: (result) => log.push({ head: 'over', data: result }),
});

/**
 * 起一局并把牌面换成指定的。
 * 用真的 start() 走一遍是为了让内部状态（牌墙、统计、分数）都初始化到位。
 */
function table(config, setup) {
  const log = [];
  const seats = Array.from({ length: config.人数 }, (_, i) => ({
    player: { uid: 100 + i, nickname: `p${i}` },
    ws: { readyState: 3 }, // 假的，io 被换掉了根本不会用
    score: 0,
  }));
  const round = new Round(seats, { config, dealerSeat: 0 }, fakeIo(log));
  round.start();
  setup(round);
  return { round, log, seats };
}

const cfg = (over = {}) => ({
  玩法: '潜江癞晃',
  人数: 2,
  暗杠倍数: 4,
  喜钱: 0,
  清一色: false,
  少三张: false,
  只许自摸: false,
  热铳: false,
  双大胡: false,
  底分: 1,
  ...over,
});

/** 一手能胡 5 的 13 张牌：123 条 / 678 条 / 123 筒 / 55 筒 / 4_6 条等 5 */
const HAND_WAIT_5 = [1, 2, 3, 4, 6, 6, 7, 8, 11, 12, 13, 15, 15];
/** 既碰不了 5 / 8 也胡不了，用来填其他座位 */
const HAND_IGNORE_5 = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 16];

/** 杠完补牌后改成打 5，让下家热铳 */
function gangThenHu(round, ganger, winner, tile = 5) {
  round.pending = null;
  round.hands[ganger] = [2, 3, 4, 6, 7, 8, 11, 12, 13, 14];
  round.drawn[ganger] = tile;
  round.turn = ganger;
  round.discard(ganger, tile);
  return round.respond(winner, 'hu');
}

const lastOver = (log) => log.filter((x) => x.head === 'over').pop().data;
const scoreOf = (seats) => seats.map((m) => m.score / rules.RATIO);

// ---------------------------------------------------------------- 抢杠胡

console.log('抢杠胡');
{
  const { round, log, seats } = table(cfg({ 热铳: true }), (r) => {
    r.laizi = 9;
    // 0 号碰过 5，又摸到第四张想补杠；1 号正好等 5
    r.melds = [[{ type: 'peng', card: 5, from: 1 }], []];
    r.hands = [[1, 1, 1, 2, 2, 2, 3, 3, 3, 4], HAND_WAIT_5.slice()];
    r.drawn = [5, null];
    r.turn = 0;
    r.pending = null;
  });

  round.selfGang(0, 5);
  check('回头笑先上桌再问抢', round.melds[0][0].type, 'bu');
  check('补杠先问有没有人抢', round.pending && round.pending.kind, 'qianggang');
  round.respond(1, 'hu');
  check('被抢后回头笑仍在杠堆', round.melds[0][0].type, 'bu');
  const over = lastOver(log);
  check('抢杠胡的位被置上', rules.hasBit(over.huType, rules.HU.抢杠胡), true);
  check('抢杠胡不算热铳', rules.hasBit(over.huType, rules.HU.热铳), false);
  // 两人、暗杠 4 倍：回头笑本该收 2，转给胡家，不加炮
  check('抢杠只转补杠进账，不加炮', scoreOf(seats), [-2, 2]);

  // 结算面板靠 cur_step 认「被抢杠」那家
  const end = log.filter((x) => x.head === 'game_end').pop();
  check('cur_step 指向被抢杠的人', end.data.cur_step, 100);
}

{
  const { round, log, seats } = table(cfg({ 人数: 4, 暗杠倍数: 2, 热铳: true }), (r) => {
    r.laizi = 31;
    r.melds = [[{ type: 'peng', card: 5, from: 1 }], [], [], []];
    r.hands = [[1, 1, 1, 2, 2, 2, 3, 3, 3, 4], HAND_WAIT_5.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [5, null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0, 0];
  });
  round.selfGang(0, 5);
  round.respond(1, 'hu');
  check('四人抢杠只转回头笑', rules.hasBit(lastOver(log).huType, rules.HU.抢杠胡), true);
  // 回头笑本该收 1×3=3，转给胡家，不加炮
  check('抢杠转 3 分不加炮', scoreOf(seats), [-3, 3, 0, 0]);
}

{
  const { round, seats } = table(cfg({ 人数: 4, 暗杠倍数: 2, 热铳: true }), (r) => {
    r.laizi = 31;
    r.melds = [[{ type: 'peng', card: 5, from: 1 }], [], [], []];
    r.hands = [[1, 1, 1, 1, 2, 3, 4, 6, 7, 8], HAND_WAIT_5.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [9, null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0, 0];
  });
  round.doSelfGang(0, 1, false);
  round.pending = null;
  round.hands[0] = [2, 3, 4, 6, 7, 8];
  round.drawn[0] = 8;
  round.turn = 0;
  round.discard(0, 8);
  round.pending = null;
  round.drawn = [5, null, null, null];
  round.turn = 0;
  round.selfGang(0, 5);
  round.respond(1, 'hu');
  // 旧暗杠自己收 6；补杠 3 转给胡家，不加炮
  check('抢杠不转过圈的旧杠', scoreOf(seats), [3, 1, -2, -2]);
}

{
  const { round, log } = table(cfg(), (r) => {
    r.laizi = 9;
    r.melds = [[{ type: 'peng', card: 5, from: 1 }], []];
    // 1 号这手胡不了 5
    r.hands = [[1, 1, 1, 2, 2, 2, 3, 3, 3, 4], [1, 3, 5, 7, 11, 13, 15, 17, 19, 2, 4, 6, 8]];
    r.drawn = [5, null];
    r.turn = 0;
    r.pending = null;
  });
  round.selfGang(0, 5);
  const gang = log.filter((x) => x.head === 'game_gang').pop();
  check('没人抢就正常补杠', gang.data.view, 3);
}

// ---------------------------------------------------------------- 热铳

console.log('热铳');
{
  const { round, log } = table(cfg({ 热铳: true }), (r) => {
    r.laizi = 9;
    r.melds = [[], []];
    r.hands = [[1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 7], HAND_WAIT_5.slice()];
    r.drawn = [5, null];
    r.turn = 0;
    r.pending = null;
  });
  round.discard(0, 5);
  round.respond(1, 'hu');
  check('没笑过的点炮不是热铳', rules.hasBit(lastOver(log).huType, rules.HU.热铳), false);
}

{
  const { round, log, seats } = table(cfg({ 人数: 4, 暗杠倍数: 2, 热铳: true }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], [], []];
    r.hands = [[1, 1, 1, 1, 2, 3, 4, 6, 7, 8, 11, 12, 13], HAND_WAIT_5.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [14, null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0, 0];
  });
  round.doSelfGang(0, 1, false);
  gangThenHu(round, 0, 1);
  check('笑后打出被捉才是热铳', rules.hasBit(lastOver(log).huType, rules.HU.热铳), true);
  // 暗杠本该收 2×3=6，不算进自己账，整笔给胡家，再加屁胡 2
  check('暗杠热铳把 6 分杠款加屁胡给胡家', scoreOf(seats), [-8, 8, 0, 0]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 4, 暗杠倍数: 2, 热铳: true }), (r) => {
    r.laizi = 31;
    r.melds = [[{ type: 'peng', card: 2, from: 1 }], [], [], []];
    r.hands = [[1, 1, 1, 1, 3, 4, 6, 7, 8, 11], HAND_WAIT_5.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [12, null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0, 0];
  });
  round.doSelfGang(0, 1, false);
  round.pending = null;
  round.hands[0] = [3, 4, 6, 7, 8, 11];
  round.drawn[0] = 2;
  round.turn = 0;
  round.selfGang(0, 2);
  gangThenHu(round, 0, 1);
  check('回头笑加暗杠也算热铳', rules.hasBit(lastOver(log).huType, rules.HU.热铳), true);
  // 回头笑 1×3 + 暗杠 2×3 = 9，再加屁胡 2
  check('本轮连杠一起转给胡家', scoreOf(seats), [-11, 11, 0, 0]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 4, 暗杠倍数: 2, 热铳: true }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], [], []];
    r.hands = [[1, 1, 1, 1, 2, 3, 4, 6, 7, 11, 12, 13, 14], HAND_WAIT_5.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [16, null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0, 0];
  });
  round.doSelfGang(0, 1, false);
  round.pending = null;
  round.hands[0] = [2, 3, 4, 6, 7, 11, 12, 13, 14, 16];
  round.drawn[0] = 8;
  round.turn = 0;
  round.discard(0, 8);
  check('第一杠过圈后不再是本轮', round.gangs.filter((g) => g.burst).length, 0);
  round.pending = null;
  round.drawn = [13, null, null, null];
  round.hands[0] = [9, 9, 9, 9, 2, 3, 4, 6, 7, 11, 12];
  round.turn = 0;
  round.doSelfGang(0, 9, false);
  gangThenHu(round, 0, 1);
  check('隔圈再杠才热铳', rules.hasBit(lastOver(log).huType, rules.HU.热铳), true);
  // 旧暗杠自己收 2×3=6；新暗杠 6 转给胡家，再加屁胡 2
  check('旧杠进自己账，只转本轮暗杠', scoreOf(seats), [-2, 6, -2, -2]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 3, 热铳: true }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], []];
    r.hands = [[1, 1, 1, 1, 2, 3, 4, 6, 7, 8, 11, 12, 13], HAND_WAIT_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [14, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.doSelfGang(0, 1, false);
  round.pending = null;
  round.hands[0] = [2, 3, 4, 6, 7, 8, 11, 12, 13, 14];
  round.drawn[0] = 8;
  round.turn = 0;
  round.discard(0, 8);
  check('笑后打出没人胡就关热铳窗口', round.hotSeat, -1);
  round.pending = null;
  round.drawn = [5, null, null];
  round.turn = 0;
  round.discard(0, 5);
  round.respond(1, 'hu');
  check('隔一张再点炮不是热铳', rules.hasBit(lastOver(log).huType, rules.HU.热铳), false);
  // 暗杠 4×2 家 = 8 进 0 号账，屁胡 2 给 1 号
  check('冷铳杠分仍进自己账', scoreOf(seats), [6, -2, -4]);
}

{
  const { round, log } = table(cfg({ 只许自摸: true, 热铳: true }), (r) => {
    r.laizi = 9;
    r.melds = [[], []];
    r.hands = [[1, 1, 1, 1, 2, 3, 4, 6, 7, 8, 11, 12, 13], HAND_WAIT_5.slice()];
    r.drawn = [14, null];
    r.turn = 0;
    r.pending = null;
  });
  round.doSelfGang(0, 1, false);
  round.pending = null;
  round.hands[0] = [2, 3, 4, 6, 7, 8, 11, 12, 13, 14];
  round.drawn[0] = 5;
  round.turn = 0;
  round.discard(0, 5);
  check('只许自摸仍能热铳', round.pending && round.pending.candidates.some((c) => c.ops.hu), true);
  round.respond(1, 'hu');
  check('只许自摸热铳胡型在', rules.hasBit(lastOver(log).huType, rules.HU.热铳), true);
}

// ---------------------------------------------------------------- 清一色

console.log('清一色');
for (const [name, bao, want] of [['报过才算', true, true], ['没报不算', false, false]]) {
  const { round, log } = table(cfg({ 清一色: true }), (r) => {
    r.laizi = 31; // 牌堆里没有的牌，等于这局没癞子
    r.melds = [[], []];
    // 全是筒
    r.hands = [[11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15], [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15]];
    r.drawn = [15, null];
    r.baoQys = [bao, false];
    r.turn = 0;
    r.pending = null;
  });
  round.respond(0, 'pass'); // 清掉 start() 留下的待办
  round.win(0, 15, null);
  check(name, rules.hasBit(lastOver(log).huType, rules.HU.清一色), want);
}

// ---------------------------------------------------------------- 双大胡

console.log('双大胡');
{
  const { round, log } = table(cfg({ 清一色: true, 双大胡: true }), (r) => {
    r.laizi = 31;
    r.melds = [[{ type: 'peng', card: 15, from: 1 }], []];
    r.hands = [[11, 11, 11, 12, 12, 12, 13, 13, 13, 14], [11, 12, 13, 14, 16, 16, 17, 18, 11, 12, 13, 15, 15]];
    r.drawn = [15, null];
    r.baoQys = [false, true];
    r.turn = 0;
    r.pending = null;
  });
  round.selfGang(0, 15);
  round.respond(1, 'hu');
  const t = lastOver(log).huType;
  check('抢杠 + 清一色', [rules.hasBit(t, rules.HU.抢杠胡), rules.hasBit(t, rules.HU.清一色)], [true, true]);
  check('抢杠不是双大胡', rules.hasBit(t, rules.HU.双大胡), false);
  check('抢杠胡型不加炮', rules.huMultiplier(t, cfg({ 双大胡: true })), 0);
}

{
  const duidao = [1, 2, 3, 2, 2, 6, 7, 8, 11, 12, 13, 15, 15];
  const seq55 = [1, 2, 3, 6, 7, 8, 11, 12, 13, 13, 14, 15, 15];
  check('对倒朝天可双大胡', mahjong.isShuangDaHu(duidao.concat([15]), 15, 31), true);
  check('3455朝天不能双大胡', mahjong.isShuangDaHu(seq55.concat([15]), 15, 31), false);
}

{
  const { round, log, seats } = table(cfg({ 人数: 3, 双大胡: true }), (r) => {
    r.laizi = 31;
    r.pizi = 15;
    r.melds = [[], [], []];
    r.hands = [[1, 2, 3, 2, 2, 6, 7, 8, 11, 12, 13, 15, 15], HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.win(0, 15, 1);
  check('点炮朝天对倒是双大胡', rules.hasBit(lastOver(log).huType, rules.HU.双大胡), true);
  // 屁胡 2 + 点杠 2，只放炮那家付
  check('点炮双大胡是炮加一个点杠', scoreOf(seats), [4, -4, 0]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 3, 双大胡: true }), (r) => {
    r.laizi = 31;
    r.pizi = 15;
    r.melds = [[], [], []];
    r.hands = [[1, 2, 3, 2, 2, 6, 7, 8, 11, 12, 13, 15, 15], HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [15, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.win(0, 15, null);
  check('自摸朝天刻是双大胡', rules.hasBit(lastOver(log).huType, rules.HU.双大胡), true);
  // 黑摸 4 + 暗杠 4，其余每家付 8
  check('自摸双大胡是胡分加一笔暗杠', scoreOf(seats), [16, -8, -8]);
}

{
  const { round, seats } = table(cfg({ 人数: 3, 双大胡: true }), (r) => {
    r.laizi = 19;
    r.pizi = 15;
    r.shuai = [[19, 19], [], []];
    r.melds = [[], [], []];
    r.hands = [[1, 2, 3, 2, 2, 6, 7, 8, 11, 12, 13, 15, 15], HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [15, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.win(0, 15, null);
  // (黑摸 4 + 暗杠 4) × 2 × 2 = 32
  check('双大胡胡分和暗杠都乘癞子', scoreOf(seats), [64, -32, -32]);
}

{
  const { round, seats } = table(cfg({ 人数: 3, 双大胡: true, 暗杠倍数: 2 }), (r) => {
    r.laizi = 31;
    r.pizi = 15;
    r.melds = [[], [], []];
    r.hands = [[1, 2, 3, 2, 2, 6, 7, 8, 11, 12, 13, 15, 15], HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [15, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.win(0, 15, null);
  // 黑摸 4 + 暗杠 2，其余每家付 6
  check('暗杠 2 倍档自摸双大胡是 4+2', scoreOf(seats), [12, -6, -6]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 3, 双大胡: true }), (r) => {
    r.laizi = 31;
    r.pizi = 15;
    r.melds = [[], [], []];
    r.hands = [[1, 2, 3, 6, 7, 8, 11, 12, 13, 13, 14, 15, 15], HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.win(0, 15, 1);
  check('3455点炮朝天不是双大胡', rules.hasBit(lastOver(log).huType, rules.HU.双大胡), false);
  check('3455只算普通屁胡', scoreOf(seats), [2, -2, 0]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 3, 双大胡: false }), (r) => {
    r.laizi = 31;
    r.pizi = 15;
    r.melds = [[], [], []];
    r.hands = [[1, 2, 3, 2, 2, 6, 7, 8, 11, 12, 13, 15, 15], HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  round.win(0, 15, 1);
  check('没开双大胡就不加杠', rules.hasBit(lastOver(log).huType, rules.HU.双大胡), false);
  check('没开双大胡只算屁胡', scoreOf(seats), [2, -2, 0]);
}

// ---------------------------------------------------------------- 杠分

console.log('杠分');
{
  const { round, seats } = table(cfg({ 人数: 3, 底分: 2 }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], []];
    r.hands = [[1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12], [], []];
    r.drawn = [13, null, null];
    r.turn = 0;
    r.pending = null;
  });
  round.doSelfGang(0, 1, false);
  round.payGangs();
  check('暗杠 4 倍，底分 2，每家付 8', scoreOf(seats), [16, -8, -8]);
}

{
  const { round, seats } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], []];
    r.hands = [[1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13], [], []];
    r.drawn = [null, null, null];
    r.turn = 0;
    r.pending = null;
  });
  round.takeGang(0, 1, 2); // 杠 2 号打的
  round.payGangs();
  check('明杠只有放杠那家付', scoreOf(seats), [2, 0, -2]);
}

{
  const { round, seats } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 19;
    r.shuai = [[], [], [19, 19, 19]];
    r.melds = [[], [], []];
    r.hands = [[1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13], [], []];
    r.drawn = [null, null, null];
    r.turn = 2;
    r.pending = null;
  });
  // 2 号甩了三张癞子，点给 0 号笑
  round.takeGang(0, 1, 2);
  round.payGangs();
  check('点笑乘放杠者癞子翻倍', scoreOf(seats), [16, 0, -16]);
}

{
  const { round, seats } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 19;
    r.shuai = [[], [19, 19], []];
    r.melds = [[], [], []];
    r.hands = [[11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15], [], []];
    r.drawn = [15, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  // 黑摸 2，1 号甩了两张癞子应付 8，2 号没甩付 2
  round.win(0, 15, null);
  check('自摸输家癞子也翻倍', scoreOf(seats), [20, -16, -4]);
}

{
  const { round, seats } = table(cfg(), (r) => {
    r.laizi = 19;
    r.shuai = [[], [19, 19, 19]];
    r.melds = [[], []];
    r.hands = [[1, 2, 3, 4, 5, 6, 11, 11, 11, 12, 12, 13], [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5]];
    r.drawn = [null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0];
  });
  // 屁胡 1 × 放炮者三癞 8
  round.win(0, 13, 1);
  check('点炮乘放炮者癞子翻倍', scoreOf(seats), [16, -16]);
}

{
  const { round, seats } = table(cfg({ 热铳: true }), (r) => {
    r.laizi = 9;
    r.shuai = [[19], []];
    r.melds = [[{ type: 'peng', card: 5, from: 1 }], []];
    r.hands = [[1, 1, 1, 2, 2, 2, 3, 3, 3, 4], HAND_WAIT_5.slice()];
    r.drawn = [5, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0];
  });
  round.selfGang(0, 5);
  round.respond(1, 'hu');
  // 回头笑 2 × 被抢者一张癞子 2 = 4，不加炮
  check('抢杠转补杠也乘癞子', scoreOf(seats), [-4, 4]);
}

// ---------------------------------------------------------------- 喜钱

console.log('喜钱');
{
  const { round, seats } = table(cfg({ 人数: 3, 喜钱: 10 }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], []];
    r.hands = [[11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15], [], []];
    r.drawn = [15, null, null];
    r.razz = [2, 0, 0]; // 亮过两张
    r.turn = 0;
    r.pending = null;
  });
  round.win(0, 15, null);
  // 黑摸 4 份 + 喜钱 10 份 = 每家 14
  check('喜钱按固定倍数算，不看亮了几张', scoreOf(seats), [28, -14, -14]);
}

{
  const { round, seats } = table(cfg({ 人数: 3, 喜钱: 10 }), (r) => {
    r.laizi = 31;
    r.melds = [[], [], []];
    r.hands = [[11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15], [], []];
    r.drawn = [15, null, null];
    r.razz = [0, 0, 0]; // 没亮
    r.turn = 0;
    r.pending = null;
  });
  round.win(0, 15, null);
  check('没亮癞子就没有喜钱', scoreOf(seats), [8, -4, -4]);
}

{
  const { round, log, seats } = table(cfg({ 人数: 3, 玩法: '土豪必杠', 喜钱: 10 }), (r) => {
    r.laizi = 19;
    r.hands = [[19, 19, 19, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12], [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5], [6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 11]];
    r.drawn = [19, null, null];
    r.turn = 0;
    r.pending = null;
    r.seats.forEach((m) => { m.score = 0; });
    r.roundScore = [0, 0, 0];
  });
  for (let i = 0; i < 3; i++) {
    round.discard(0, 19);
    round.pending = null;
  }
  check('三张癞子还不结喜钱', scoreOf(seats), [0, 0, 0]);
  round.discard(0, 19);
  check('四癞当场结喜钱', scoreOf(seats), [20, -10, -10]);
  check('四癞当场推了跳分', log.some((x) => x.head === 'game_scorechange'), true);
}

// ---------------------------------------------------------------- 过手碰

/** 能碰 1 条，胡不了 1 条 */
const HAND_PENG_1 = [1, 1, 3, 4, 6, 7, 8, 11, 12, 13, 14, 16, 17];
const pengAsked = (round, seat) =>
  !!(round.pending && round.pending.kind === 'discard'
    && round.pending.candidates.some((c) => c.seat === seat && c.ops.peng));

console.log('过手碰');
{
  const { round } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.hands = [HAND_PENG_1.slice(), HAND_PENG_1.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, 1, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 1);
  check('第一次打1条问碰', pengAsked(round, 0), true);
  round.respond(0, 'pass');
  check('过了锁住这张', round.passPeng[0].has(1), true);
  round.pending = null;
  round.drawn[2] = 1;
  round.turn = 2;
  round.discard(2, 1);
  check('没过手不能再碰同一张', pengAsked(round, 0), false);
  check('别人还能碰这张', pengAsked(round, 1), true);
}

{
  const { round } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.hands = [
      [1, 1, 3, 3, 6, 7, 8, 11, 12, 13, 14, 16, 17],
      HAND_IGNORE_5.slice(),
      HAND_IGNORE_5.slice(),
    ];
    r.drawn = [null, 1, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 1);
  round.respond(0, 'pass');
  check('过1条不影响碰别的', (() => {
    round.pending = null;
    round.drawn[2] = 3;
    round.turn = 2;
    round.discard(2, 3);
    return pengAsked(round, 0);
  })(), true);
}

{
  const { round } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.hands = [HAND_PENG_1.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, 1, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 1);
  round.respond(0, 'pass');
  round.pending = null;
  round.draw(0);
  round.pending = null;
  round.drawn[1] = 1;
  round.turn = 1;
  round.discard(1, 1);
  check('摸牌过手后能再碰', pengAsked(round, 0), true);
}

{
  const { round } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.hands = [
      [1, 1, 3, 3, 6, 7, 8, 11, 12, 13, 14, 16, 17],
      HAND_IGNORE_5.slice(),
      HAND_IGNORE_5.slice(),
    ];
    r.drawn = [null, 1, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 1);
  round.respond(0, 'pass');
  round.pending = null;
  round.drawn[2] = 3;
  round.turn = 2;
  round.discard(2, 3);
  round.respond(0, 'peng');
  check('碰别的牌也算过手', round.passPeng[0].has(1), false);
  round.pending = null;
  round.drawn[1] = 1;
  round.turn = 1;
  round.discard(1, 1);
  check('碰过手后能再碰刚才过的张', pengAsked(round, 0), true);
}

// ---------------------------------------------------------------- 过手胡

/** 听 5、8 条：123 条 / 67 条 / 123 筒 / 三筒刻 / 55 筒 */
const HAND_WAIT_58 = [1, 2, 3, 6, 7, 11, 12, 13, 14, 14, 14, 15, 15];
const HAND_PENG_8 = [8, 8, 2, 3, 4, 9, 11, 12, 13, 14, 16, 17, 19];
const huAsked = (round, seat) =>
  !!(round.pending && round.pending.kind === 'discard'
    && round.pending.candidates.some((c) => c.seat === seat && c.ops.hu));

console.log('过手胡');
{
  const { round } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.hands = [HAND_WAIT_58.slice(), HAND_PENG_8.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, 5, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 5);
  check('第一次打5条问胡', huAsked(round, 0), true);
  round.respond(0, 'pass');
  check('过了锁住听口', round.passHu[0], true);
  round.pending = null;
  round.drawn[2] = 8;
  round.turn = 2;
  round.discard(2, 8);
  check('没过手同一路8条也不能胡', huAsked(round, 0), false);
  check('别人还能碰这张', pengAsked(round, 1), true);
}

{
  const { round } = table(cfg({ 人数: 3 }), (r) => {
    r.laizi = 31;
    r.hands = [HAND_WAIT_58.slice(), HAND_IGNORE_5.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, 5, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 5);
  round.respond(0, 'pass');
  round.pending = null;
  round.draw(0);
  check('摸牌解开过胡', round.passHu[0], false);
  round.pending = null;
  round.drawn[0] = null;
  round.hands[0] = HAND_WAIT_58.slice();
  round.drawn[1] = 8;
  round.turn = 1;
  round.discard(1, 8);
  check('过手后能胡同一路', huAsked(round, 0), true);
}

{
  const { round, log } = table(cfg({ 人数: 3, 热铳: true }), (r) => {
    r.laizi = 31;
    r.hands = [HAND_WAIT_58.slice(), HAND_IGNORE_5.slice(), [2, 2, 2, 2, 3, 4, 6, 7, 9, 11, 12, 13, 14]];
    r.drawn = [null, 5, 16];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 5);
  round.respond(0, 'pass');
  check('普通炮过了先锁上', round.passHu[0], true);
  round.pending = null;
  round.drawn[2] = 16;
  round.turn = 2;
  round.doSelfGang(2, 2, false);
  round.pending = null;
  round.hands[2] = [3, 4, 6, 7, 9, 11, 12, 13, 14, 16];
  round.drawn[2] = 8;
  round.turn = 2;
  round.discard(2, 8);
  check('热铳同一路能破过胡', huAsked(round, 0), true);
  round.respond(0, 'hu');
  check('热铳破锁后胡型在', rules.hasBit(lastOver(log).huType, rules.HU.热铳), true);
}

{
  const { round } = table(cfg({ 人数: 3, 玩法: '土豪必杠', 热铳: true }), (r) => {
    r.laizi = 31;
    r.hands = [HAND_WAIT_58.slice(), HAND_PENG_8.slice(), HAND_IGNORE_5.slice()];
    r.drawn = [null, 5, null];
    r.turn = 1;
    r.pending = null;
  });
  round.discard(1, 5);
  check('土豪必杠普通炮不问胡', huAsked(round, 0), false);
  check('土豪必杠普通炮不记过胡', round.passHu[0], false);
}

{
  const { round, log } = table(cfg({ 人数: 3, 玩法: '土豪必杠', 热铳: true }), (r) => {
    r.laizi = 31;
    r.hands = [
      HAND_WAIT_58.slice(),
      [9, 9, 9, 9, 3, 4, 6, 7, 11, 12, 13, 14, 16],
      [2, 2, 2, 2, 3, 4, 6, 7, 11, 12, 13, 14, 16],
    ];
    r.drawn = [null, 16, null];
    r.turn = 1;
    r.pending = null;
  });
  round.doSelfGang(1, 9, false);
  round.pending = null;
  round.hands[1] = [3, 4, 6, 7, 11, 12, 13, 14, 16];
  round.drawn[1] = 5;
  round.turn = 1;
  round.discard(1, 5);
  check('土豪必杠热铳能胡', huAsked(round, 0), true);
  round.respond(0, 'pass');
  check('过热铳也锁听口', round.passHu[0], true);
  round.pending = null;
  round.drawn[2] = 16;
  round.turn = 2;
  round.doSelfGang(2, 2, false);
  round.pending = null;
  round.hands[2] = [3, 4, 6, 7, 11, 12, 13, 14, 16];
  round.drawn[2] = 8;
  round.turn = 2;
  round.discard(2, 8);
  check('土豪必杠再热铳同一路仍能胡', huAsked(round, 0), true);
  round.respond(0, 'hu');
  check('第二次热铳胡型在', rules.hasBit(lastOver(log).huType, rules.HU.热铳), true);
}

// ---------------------------------------------------------------- 玩法配置

console.log('玩法配置');
check('两人局参数', rules.parseConfig(1000, 1100100011000), {
  玩法: '潜江癞晃', 人数: 2, 暗杠倍数: 4, 房费: 'AA', 喜钱: 10, 清一色: false,
  少三张: false, 只许自摸: false, 热铳: true, 双大胡: true, 观战: true,
  底分: 1, 托管: 0, 踢人: 0,
});
check('暗杠 2 倍那一位', rules.parseConfig(1000, 100).暗杠倍数, 2);
check('底分档次', [4, 5, 6, 7].map((d) => rules.parseConfig(d * 1000, 0).底分), [5, 10, 20, 25]);

console.log(`\n${pass} 过 / ${fail} 挂`);
process.exit(fail ? 1 : 0);
