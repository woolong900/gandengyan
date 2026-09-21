#!/usr/bin/env node
/**
 * 麻将机器人 A/B 基准。
 *
 * 只测试「土豪必杠＋只许自摸」；每个种子、目标座位都用完全相同的
 * 开局牌墙分别跑 baseline 和 smart，其余座位始终使用 legacy。
 *
 * 用法：
 *   node tools/benchmark-mahjong-bot.js
 *   node tools/benchmark-mahjong-bot.js --baseline=smart-eager --seeds=100 --players=2,3,4
 */
const { performance } = require('perf_hooks');
const { Round } = require('../server/round');
const rules = require('../server/rules');

const DEFAULT_SEEDS = 40;
const DEFAULT_MAX_ACTIONS = 2000;

function parseArgs(argv) {
  const values = {};
  for (const item of argv) {
    const match = /^--([a-z-]+)=(.+)$/.exec(item);
    if (!match) throw new Error(`不认识的参数：${item}`);
    values[match[1]] = match[2];
  }
  const seeds = Number(values.seeds || DEFAULT_SEEDS);
  const startSeed = Number(values['start-seed'] || 1);
  const maxActions = Number(values['max-actions'] || DEFAULT_MAX_ACTIONS);
  const players = String(values.players || '2,3,4').split(',').map(Number);
  const baseline = String(values.baseline || 'legacy');
  if (!Number.isInteger(seeds) || seeds < 1) throw new Error('--seeds 必须是正整数');
  if (!Number.isInteger(startSeed) || startSeed < 0) throw new Error('--start-seed 必须是非负整数');
  if (!Number.isInteger(maxActions) || maxActions < 1) throw new Error('--max-actions 必须是正整数');
  if (!players.length || players.some((n) => !Number.isInteger(n) || n < 2 || n > 4)) {
    throw new Error('--players 只支持逗号分隔的 2、3、4');
  }
  if (!['legacy', 'smart-eager'].includes(baseline)) {
    throw new Error('--baseline 只支持 legacy 或 smart-eager');
  }
  return { seeds, startSeed, maxActions, players: [...new Set(players)], baseline };
}

/** Mulberry32：不用于安全场景，只用来保证基准可重复。 */
function seededRandomInt(seed) {
  let state = seed >>> 0;
  return (max) => {
    if (!Number.isInteger(max) || max < 1) throw new Error(`无效随机上限 ${max}`);
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const unit = ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
    return Math.floor(unit * max);
  };
}

function makeConfig(peopleCount) {
  const params = rules.buildParam({
    玩法: '土豪必杠',
    只许自摸: true,
    人数: peopleCount,
  });
  const config = rules.parseConfig(params.param1, params.param2);
  if (config.玩法 !== '土豪必杠' || !config.只许自摸) {
    throw new Error('基准配置构造失败');
  }
  return config;
}

function stateSignature(round) {
  const pending = round.pending && {
    kind: round.pending.kind,
    seat: round.pending.seat,
    from: round.pending.from,
    card: round.pending.card,
    replies: round.pending.replies ? [...round.pending.replies.entries()] : [],
  };
  return JSON.stringify({
    over: round.over,
    turn: round.turn,
    wall: round.wall && round.wall.remain(),
    hands: round.hands,
    drawn: round.drawn,
    melds: round.melds,
    discards: round.discards,
    shuai: round.shuai,
    baoQys: round.baoQys,
    pending,
  });
}

/** A/B 必须从同一手牌和同一后续牌墙开始。 */
function initialDealSignature(round) {
  return JSON.stringify({
    dealerSeat: round.dealerSeat,
    pizi: round.pizi,
    laizi: round.laizi,
    hands: round.hands,
    drawn: round.drawn,
    wall: round.wall.remainCards(),
  });
}

function playOne({ peopleCount, seed, dealerSeat, targetSeat, targetPolicy, maxActions }) {
  const config = makeConfig(peopleCount);
  const policies = new Array(peopleCount).fill('legacy');
  policies[targetSeat] = targetPolicy;
  const seats = Array.from({ length: peopleCount }, (_, seat) => ({
    player: { uid: 100000 + seat, nickname: `基准${seat + 1}` },
    site: seat + 1,
    score: 0,
    bot: true,
  }));
  let result = null;
  let round = null;
  let laiziSeen = 0;
  let shuaiEvents = 0;
  const emitted = [];
  const targetUid = seats[targetSeat].player.uid;
  const io = {
    log() {},
    all(msghead, data) { emitted.push({ msghead, data }); },
    one() {},
    each(msghead, build) {
      for (let seat = 0; seat < peopleCount; seat++) {
        const data = build(seat);
        // 目标视角能看到自己的真实摸牌，每张物理癞子只计一次。
        if (round && msghead === 'game_draw' && seat === targetSeat
          && data.uid === targetUid && data.card === round.laizi) laiziSeen++;
      }
    },
    over(value) { result = value; },
  };
  round = new Round(seats, {
    config,
    dealerSeat,
    randomInt: seededRandomInt(seed),
  }, io);

  // Round 内部在协调多家碰/杠应答时也会查询策略。基准必须使这些查询
  // 和本局的 A/B 座位分配一致，不能让其他 legacy 座位被默认当成 smart。
  round.smartBot = (seat, explicitPolicy) => {
    if (explicitPolicy != null) return explicitPolicy === 'smart' || explicitPolicy === 'smart-eager';
    return policies[seat] === 'smart' || policies[seat] === 'smart-eager';
  };

  const startedAt = performance.now();
  round.start();
  const initialSignature = initialDealSignature(round);
  // 庄家开局的第 14 张已在 looseTiles 中，和起手牌一起计入持癞机会。
  laiziSeen = round.looseTiles(targetSeat).filter((card) => card === round.laizi).length;
  emitted.length = 0;
  let actions = 0;
  while (!round.over) {
    if (actions >= maxActions) throw new Error(`超过 ${maxActions} 步未结束`);
    const waiting = round.waitingSeats();
    if (!waiting.length) throw new Error('牌局未结束但没有待操作座位');
    const seat = waiting[0];
    const before = stateSignature(round);
    const beforeShuai = round.shuai[targetSeat].length;
    const beforeWall = round.wall.remain();
    const beforeLoose = round.looseTiles(targetSeat);
    emitted.length = 0;
    const error = round.autoPlay(seat, policies[seat]);
    if (typeof error === 'string' && error) throw new Error(`第 ${actions + 1} 步非法操作：${error}`);
    actions++;
    const afterShuai = round.shuai[targetSeat].length;
    const shuaiDelta = afterShuai - beforeShuai;
    if (shuaiDelta) {
      const lzg = emitted.filter((event) => event.msghead === 'game_lzg'
        && event.data && event.data.uid === targetUid);
      if (seat !== targetSeat) throw new Error('非目标座位的操作改变了目标甩癞计数');
      if (shuaiDelta !== 1 || lzg.length !== 1) throw new Error(`单步甩癞数量异常：${shuaiDelta}`);
      if (!beforeLoose.includes(round.laizi) || lzg[0].data.card !== round.laizi) {
        throw new Error('甩出的不是目标手中癞子');
      }
      if (beforeWall <= 0 && beforeLoose.some((card) => card !== round.laizi)) {
        throw new Error('牌墙已空时非全癞手牌仍尝试甩癞');
      }
      if (beforeWall > 0 && round.wall.remain() !== beforeWall - 1) {
        throw new Error(`甩癞补摸未正确消耗牌墙：${beforeWall}→${round.wall.remain()}`);
      }
      if (round.shuai[targetSeat][afterShuai - 1] !== round.laizi) {
        throw new Error('甩癞区末张不是癞子');
      }
      shuaiEvents++;
    }
    if (before === stateSignature(round)) {
      throw new Error(`第 ${actions} 步无进展，座位=${seat}，策略=${policies[seat]}`);
    }
  }
  if (!result || !Array.isArray(result.scores)) throw new Error('牌局结束但没有结算结果');
  const zeroSum = result.scores.reduce((sum, score) => sum + score, 0);
  if (zeroSum !== 0) throw new Error(`结算不守恒：${zeroSum}`);
  const shuaiCount = round.shuai[targetSeat].length;
  if (shuaiCount !== shuaiEvents) throw new Error(`甩癞事件与终局计数不符：${shuaiEvents}/${shuaiCount}`);
  if (shuaiCount < 0 || shuaiCount > 4 || shuaiCount > laiziSeen) {
    throw new Error(`甩癞/持癞计数异常：${shuaiCount}/${laiziSeen}`);
  }
  return {
    score: result.scores[targetSeat] / rules.unit(config),
    win: (result.winners || []).includes(targetSeat),
    draw: !(result.winners || []).length,
    shuaiCount,
    laiziSeen,
    shuaiRate: laiziSeen ? shuaiCount / laiziSeen : 0,
    shuaiGame: shuaiCount > 0,
    initialSignature,
    actions,
    elapsedMs: performance.now() - startedAt,
  };
}

const mean = (values) => values.length
  ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

function confidence95(values) {
  if (values.length < 2) return 0;
  const average = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1);
  return 1.96 * Math.sqrt(variance / values.length);
}

const percent = (value) => `${(value * 100).toFixed(2)}%`;
const signed = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(3)}`;

function summarize(rows, seedCount, baseline = 'legacy') {
  const completed = rows.filter((row) => row[baseline] && row.smart && row.pairValid !== false);
  const baselineScores = completed.map((row) => row[baseline].score);
  const smartScores = completed.map((row) => row.smart.score);
  const deltas = completed.map((row) => row.smart.score - row[baseline].score);
  // 同种子的各座位实验相关；先按种子聚合，再计算置信区间。
  const seedDeltas = new Map();
  for (const row of completed) {
    if (!seedDeltas.has(row.seed)) seedDeltas.set(row.seed, []);
    seedDeltas.get(row.seed).push(row.smart.score - row[baseline].score);
  }
  const clusteredDeltas = [...seedDeltas.values()].map(mean);
  const baselineMs = completed.reduce((sum, row) => sum + row[baseline].elapsedMs, 0);
  const smartMs = completed.reduce((sum, row) => sum + row.smart.elapsedMs, 0);
  const baselineShuai = completed.reduce((sum, row) => sum + row[baseline].shuaiCount, 0);
  const smartShuai = completed.reduce((sum, row) => sum + row.smart.shuaiCount, 0);
  const baselineLaizi = completed.reduce((sum, row) => sum + row[baseline].laiziSeen, 0);
  const smartLaizi = completed.reduce((sum, row) => sum + row.smart.laiziSeen, 0);
  return {
    seeds: seedCount,
    pairs: completed.length,
    baselineScore: mean(baselineScores),
    smartScore: mean(smartScores),
    delta: mean(deltas),
    deltaCi95: confidence95(clusteredDeltas),
    baselineWinRate: completed.length ? completed.filter((row) => row[baseline].win).length / completed.length : 0,
    smartWinRate: completed.length ? completed.filter((row) => row.smart.win).length / completed.length : 0,
    baselineDrawRate: completed.length ? completed.filter((row) => row[baseline].draw).length / completed.length : 0,
    smartDrawRate: completed.length ? completed.filter((row) => row.smart.draw).length / completed.length : 0,
    baselineShuaiAverage: completed.length ? baselineShuai / completed.length : 0,
    smartShuaiAverage: completed.length ? smartShuai / completed.length : 0,
    shuaiDelta: completed.length ? (smartShuai - baselineShuai) / completed.length : 0,
    baselineShuaiRate: baselineLaizi ? baselineShuai / baselineLaizi : 0,
    smartShuaiRate: smartLaizi ? smartShuai / smartLaizi : 0,
    baselineShuaiGameRate: completed.length
      ? completed.filter((row) => row[baseline].shuaiGame).length / completed.length : 0,
    smartShuaiGameRate: completed.length
      ? completed.filter((row) => row.smart.shuaiGame).length / completed.length : 0,
    baselineActions: mean(completed.map((row) => row[baseline].actions)),
    smartActions: mean(completed.map((row) => row.smart.actions)),
    baselineMs,
    smartMs,
  };
}

function run(options) {
  const baseline = options.baseline || 'legacy';
  const allRows = [];
  const failures = [];
  const totalStartedAt = performance.now();

  for (const peopleCount of options.players) {
    for (let offset = 0; offset < options.seeds; offset++) {
      const seed = options.startSeed + offset;
      const dealerSeat = offset % peopleCount;
      for (let targetSeat = 0; targetSeat < peopleCount; targetSeat++) {
        const row = { peopleCount, seed, dealerSeat, targetSeat, pairValid: true };
        row[baseline] = null;
        row.smart = null;
        for (const targetPolicy of [baseline, 'smart']) {
          try {
            row[targetPolicy] = playOne({
              peopleCount, seed, dealerSeat, targetSeat, targetPolicy,
              maxActions: options.maxActions,
            });
          } catch (error) {
            failures.push({ peopleCount, seed, dealerSeat, targetSeat, targetPolicy, error: error.message });
          }
        }
        if (row[baseline] && row.smart
          && row[baseline].initialSignature !== row.smart.initialSignature) {
          row.pairValid = false;
          failures.push({
            peopleCount, seed, dealerSeat, targetSeat, targetPolicy: 'pair',
            error: '成对 A/B 开局手牌或后续牌序不一致',
          });
        }
        allRows.push(row);
      }
    }
  }

  console.log('麻将机器人 A/B 基准：土豪必杠＋只许自摸');
  console.log(`基线 ${baseline}，对照 smart（动态甩癞）`);
  console.log(`种子 ${options.startSeed}..${options.startSeed + options.seeds - 1}，人数 ${options.players.join('/')}，每局最多 ${options.maxActions} 步`);
  console.log('得分已除以当局底分单位；± 为按种子聚合后的 95% 置信半径。');
  console.log('甩癞率=甩出张数/目标玩家实际持有过的癞子张数；甩癞局率=至少甩过一张的对局占比。\n');
  console.log('人数 | 配对 | 均分(B/D) | 配对差 | 胜率(B/D) | 流局(B/D) | 甩癞均数(B/D/差) | 甩癞率(B/D) | 甩癞局率(B/D) | 耗时(B/D)');
  console.log('---- | ---- | ----------- | ------ | --------- | --------- | ---------------- | ----------- | ------------- | ---------');
  for (const peopleCount of options.players) {
    const rows = allRows.filter((row) => row.peopleCount === peopleCount);
    const summary = summarize(rows, options.seeds, baseline);
    console.log([
      peopleCount,
      summary.pairs,
      `${signed(summary.baselineScore)}/${signed(summary.smartScore)}`,
      `${signed(summary.delta)} ± ${summary.deltaCi95.toFixed(3)}`,
      `${percent(summary.baselineWinRate)}/${percent(summary.smartWinRate)}`,
      `${percent(summary.baselineDrawRate)}/${percent(summary.smartDrawRate)}`,
      `${summary.baselineShuaiAverage.toFixed(3)}/${summary.smartShuaiAverage.toFixed(3)}/${signed(summary.shuaiDelta)}`,
      `${percent(summary.baselineShuaiRate)}/${percent(summary.smartShuaiRate)}`,
      `${percent(summary.baselineShuaiGameRate)}/${percent(summary.smartShuaiGameRate)}`,
      `${summary.baselineMs.toFixed(0)}ms/${summary.smartMs.toFixed(0)}ms`,
    ].join(' | '));
  }

  const overall = summarize(allRows, options.seeds * options.players.length, baseline);
  console.log(`\n合计：${overall.pairs} 组有效配对，${failures.length} 局异常，总耗时 ${(performance.now() - totalStartedAt).toFixed(0)}ms。`);
  console.log(`总体标准化均分 ${baseline}=${signed(overall.baselineScore)}，smart=${signed(overall.smartScore)}，配对差=${signed(overall.delta)}。`);
  console.log(`总体胜率 ${baseline}=${percent(overall.baselineWinRate)}，smart=${percent(overall.smartWinRate)}；流局率 ${percent(overall.baselineDrawRate)}→${percent(overall.smartDrawRate)}。`);
  console.log(`总体平均甩癞 ${overall.baselineShuaiAverage.toFixed(3)}→${overall.smartShuaiAverage.toFixed(3)}（差 ${signed(overall.shuaiDelta)}）；甩癞率 ${percent(overall.baselineShuaiRate)}→${percent(overall.smartShuaiRate)}。`);
  if (failures.length) {
    console.log('\n异常样本（最多显示 10 条）：');
    for (const failure of failures.slice(0, 10)) console.log(JSON.stringify(failure));
    process.exitCode = 1;
  }
  return { rows: allRows, failures };
}

if (require.main === module) {
  try {
    run(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(`基准启动失败：${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, seededRandomInt, playOne, summarize, run };
