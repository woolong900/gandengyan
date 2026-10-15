/**
 * 麻将内置机器人策略。
 *
 * 只使用玩家自己的手牌和公开信息（弃牌、副露、甩癞、皮子），
 * 不读取对手手牌或牌墙顺序。决策顺序是：向听数 -> 有效进张 -> 牌形/特殊番 -> 残局安全度。
 */
const mahjong = require('./mahjong');
const rules = require('./rules');

const unique = (items) => [...new Set(items)];
const removeCopies = (tiles, card, count) => {
  const out = tiles.slice();
  for (let n = 0; n < count; n++) {
    const at = out.indexOf(card);
    if (at < 0) return null;
    out.splice(at, 1);
  }
  return out;
};

const countOf = (tiles, card) => tiles.reduce((count, tile) => count + (tile === card ? 1 : 0), 0);
const suitOf = (card) => Math.floor(card / 10);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const TYPE_CACHE = new Map();
const SHAPE_CACHE = new Map();
const SHAPE_CACHE_LIMIT = 50000;

function tileTypes(round) {
  if (!TYPE_CACHE.has(round.peopleCount)) {
    TYPE_CACHE.set(round.peopleCount,
      unique(mahjong.buildDeck(round.peopleCount)).sort((a, b) => a - b));
  }
  return TYPE_CACHE.get(round.peopleCount);
}

function baseVisibleCounts(round, seat) {
  const counts = new Map();
  const add = (card, count = 1) => {
    if (card == null || card < 0) return;
    counts.set(card, (counts.get(card) || 0) + count);
  };
  for (const card of round.looseTiles(seat)) add(card);
  for (const river of round.discards || []) for (const card of river) add(card);
  for (const melds of round.melds || []) for (const meld of melds) {
    const isThreeCardPizi = meld.card === round.pizi && (meld.type === 'pizi' || meld.type === 'ming');
    add(meld.card, isThreeCardPizi ? 3 : (meld.type === 'peng' ? 3 : 4));
  }
  for (const cards of round.shuai || []) for (const card of cards) add(card);
  // 开局翻出的皮子是牌堆中的一张实体牌。
  add(round.pizi);
  return counts;
}

function visibleCounts(round, seat) {
  const counts = baseVisibleCounts(round, seat);
  const inferred = round.inferredVisible && round.inferredVisible[seat];
  if (inferred) {
    for (const [card, minimum] of inferred) {
      counts.set(Number(card), Math.max(counts.get(Number(card)) || 0, Number(minimum) || 0));
    }
  }
  return counts;
}

/**
 * 上家出牌后，本座本应立即摸牌；若服务端正在等待其他座位碰/杠，
 * 本座从等待本身只能保守推出：弃牌 1 张 + 别家手里至少 2 张。
 * 不记录响应者和具体操作，避免把服务端掌握的隐藏手牌泄露给机器人。
 */
function noteDiscardWaitInference(round, seat, card) {
  if (!round.inferredVisible) {
    round.inferredVisible = Array.from({ length: round.n }, () => new Map());
  }
  const memory = round.inferredVisible[seat] || (round.inferredVisible[seat] = new Map());
  const publiclyKnown = baseVisibleCounts(round, seat).get(card) || 0;
  const minimum = Math.min(4, publiclyKnown + 2);
  memory.set(card, Math.max(memory.get(card) || 0, minimum));
}

function context(round, seat) {
  const visible = visibleCounts(round, seat);
  const types = tileTypes(round);
  const remaining = new Map(types.map((card) => [card, Math.max(0, 4 - (visible.get(card) || 0))]));
  return { round, seat, types, remaining, shapeCache: new Map(), analysisCache: new Map(),
    lookaheadCache: new Map() };
}

/**
 * 仅使用公开信息估计一张未见牌位于牌墙而非对手暗手的概率。
 * 对手打出某一门越多，后续同门剩余牌留在牌墙的可能性略高；
 * 副露集中在该门则略低。这里不读取对手手牌内容。
 */
function estimatedWallCopies(ctx, card) {
  const round = ctx.round;
  const remaining = ctx.remaining.get(card) || 0;
  if (!remaining) return 0;
  const wall = Math.max(0, round.wall.remain());
  let concealed = 0;
  let signal = 1;
  const suit = suitOf(card);
  for (let seat = 0; seat < round.n; seat++) {
    if (seat === ctx.seat) continue;
    // 暗手数量也从公开的副露数和当前出牌权推导，不访问对手 hands/drawn。
    const meldCount = (round.melds[seat] || []).length;
    const normalCount = Math.max(1, (round.fullMelds - meldCount) * 3 + 1);
    const holdingDrawn = round.turn === seat && (!round.pending
      || (round.pending.kind === 'self' && round.pending.seat === seat));
    concealed += normalCount + (holdingDrawn ? 1 : 0);
    const river = round.discards[seat] || [];
    const sameSuitDiscards = river.filter((tile) => suitOf(tile) === suit).length;
    const sameCardDiscards = river.filter((tile) => tile === card).length;
    const exposedSameSuit = (round.melds[seat] || [])
      .filter((meld) => suitOf(meld.card) === suit).length;
    if (river.length) signal += Math.min(0.18, sameSuitDiscards / river.length * 0.12);
    signal += Math.min(0.12, sameCardDiscards * 0.04);
    signal -= Math.min(0.12, exposedSameSuit * 0.04);
  }
  const unknownSlots = wall + concealed;
  if (!unknownSlots || !wall) return 0;
  return clamp(remaining * wall / unknownSlots * clamp(signal, 0.65, 1.35), 0, remaining);
}

/** 不带癞子的标准向听 DFS；癞子在外层按可补一张缺口处理。 */
function standardShanten(tiles, joker, melded, fullMelds) {
  const jokerCount = joker >= 0 ? countOf(tiles, joker) : 0;
  const counts = new Array(40).fill(0);
  for (const tile of tiles) if (tile !== joker) counts[tile]++;
  const need = Math.max(0, fullMelds - melded);
  let best = 2 * need;
  const seen = new Set();

  const visit = (start, melds, taatsu, pair) => {
    while (start < counts.length && !counts[start]) start++;
    if (start >= counts.length) {
      const usedMelds = Math.min(need, melds);
      const usefulTaatsu = Math.min(taatsu, Math.max(0, need - usedMelds));
      best = Math.min(best, 2 * need - 2 * usedMelds - usefulTaatsu - pair);
      return;
    }
    const key = `${start}|${melds}|${taatsu}|${pair}|${counts.join('')}`;
    if (seen.has(key)) return;
    seen.add(key);

    if (counts[start] >= 3) {
      counts[start] -= 3;
      visit(start, melds + 1, taatsu, pair);
      counts[start] += 3;
    }
    const point = start % 10;
    if (point >= 1 && point <= 7 && counts[start + 1] && counts[start + 2]
      && suitOf(start) === suitOf(start + 2)) {
      counts[start]--; counts[start + 1]--; counts[start + 2]--;
      visit(start, melds + 1, taatsu, pair);
      counts[start]++; counts[start + 1]++; counts[start + 2]++;
    }
    if (!pair && counts[start] >= 2) {
      counts[start] -= 2;
      visit(start, melds, taatsu, 1);
      counts[start] += 2;
    }
    if (counts[start] >= 2) {
      counts[start] -= 2;
      visit(start, melds, taatsu + 1, pair);
      counts[start] += 2;
    }
    if (point >= 1 && point <= 8 && counts[start + 1] && suitOf(start) === suitOf(start + 1)) {
      counts[start]--; counts[start + 1]--;
      visit(start, melds, taatsu + 1, pair);
      counts[start]++; counts[start + 1]++;
    }
    if (point >= 1 && point <= 7 && counts[start + 2] && suitOf(start) === suitOf(start + 2)) {
      counts[start]--; counts[start + 2]--;
      visit(start, melds, taatsu + 1, pair);
      counts[start]++; counts[start + 2]++;
    }
    counts[start]--;
    visit(start, melds, taatsu, pair);
    counts[start]++;
  };
  visit(0, 0, 0, 0);
  return Math.max(-1, best - jokerCount);
}

function shapeShanten(ctx, tiles, melded) {
  const round = ctx.round;
  const sorted = tiles.slice().sort((a, b) => a - b);
  const joker = round.jokerFor(ctx.seat);
  const key = `${round.fullMelds}|${melded}|${joker}|${sorted.join(',')}`;
  if (ctx.shapeCache.has(key)) return ctx.shapeCache.get(key);
  if (SHAPE_CACHE.has(key)) {
    const cached = SHAPE_CACHE.get(key);
    ctx.shapeCache.set(key, cached);
    return cached;
  }
  // 潜江麻将不走七小对路线，机器人只评估标准面子+将。
  let value = standardShanten(sorted, joker, melded, round.fullMelds);
  const postDiscardSize = Math.max(0, round.fullMelds - melded) * 3 + 1;
  if (sorted.length === postDiscardSize) value = Math.max(0, value);
  ctx.shapeCache.set(key, value);
  if (SHAPE_CACHE.size >= SHAPE_CACHE_LIMIT) SHAPE_CACHE.clear();
  SHAPE_CACHE.set(key, value);
  return value;
}

function canSelfHu(ctx, tiles, melded) {
  const round = ctx.round;
  if (typeof round.canHuTiles === 'function') return round.canHuTiles(ctx.seat, tiles);
  if (round.config.玩法 !== '堆癞子' && countOf(tiles, round.laizi) > 1) return false;
  return mahjong.canHu(tiles, round.jokerFor(ctx.seat), melded, round.fullMelds);
}

function shapeQuality(tiles, joker) {
  const counts = new Map();
  for (const tile of tiles) if (tile !== joker) counts.set(tile, (counts.get(tile) || 0) + 1);
  let score = 0;
  for (const [tile, count] of counts) {
    if (count >= 3) score += 9;
    else if (count === 2) score += 4;
    const point = tile % 10;
    if (point <= 8 && counts.has(tile + 1) && suitOf(tile) === suitOf(tile + 1)) score += 3;
    if (point <= 7 && counts.has(tile + 2) && suitOf(tile) === suitOf(tile + 2)) score += 1.5;
    if (count === 1 && !counts.has(tile - 1) && !counts.has(tile + 1)
      && !counts.has(tile - 2) && !counts.has(tile + 2)) score -= point === 1 || point === 9 ? 1.5 : 1;
  }
  return score;
}

/**
 * 潜江麻将里暗杠的收益和一次自摸同档，朝天对再摸一张也能直接朝天笑。
 * 在向听数相同的弃牌中，先保留这些已经成形的高价值结构，再比较活张。
 */
function protectedShapeCount(ctx, tiles) {
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  let protectedSets = 0;
  for (const count of counts.values()) if (count >= 3) protectedSets++;
  if ((counts.get(ctx.round.pizi) || 0) >= 2) protectedSets++;
  return protectedSets;
}

/** 先拿走坎子和朝天对，再统计剩余牌里已经完整的顺子。 */
function protectedSequenceCount(ctx, tiles) {
  const counts = new Array(40).fill(0);
  for (const tile of tiles) counts[tile]++;
  for (let tile = 0; tile < counts.length; tile++) {
    if (counts[tile] >= 3) counts[tile] -= 3;
  }
  if (counts[ctx.round.pizi] === 2) counts[ctx.round.pizi] -= 2;
  let sequences = 0;
  for (const suit of [0, 1, 2, 3]) {
    const base = suit * 10;
    for (let point = 1; point <= 7; point++) {
      const card = base + point;
      while (counts[card] > 0 && counts[card + 1] > 0 && counts[card + 2] > 0) {
        counts[card]--; counts[card + 1]--; counts[card + 2]--;
        sequences++;
      }
    }
  }
  return sequences;
}

/**
 * 按“坎子/朝天对优先、再从小到大固定完整顺子”的顺序拆出当前牌形，
 * 返回各牌剩余的游离张数。弃牌时优先使用游离张，避免把 123 拆成 23
 * 再拿旁边的 4 临时拼成 234。
 */
function looseStructureCounts(ctx, tiles) {
  const counts = new Array(40).fill(0);
  for (const tile of tiles) counts[tile]++;
  for (let tile = 0; tile < counts.length; tile++) {
    if (counts[tile] >= 3) counts[tile] -= 3;
  }
  if (counts[ctx.round.pizi] === 2) counts[ctx.round.pizi] -= 2;
  for (const suit of [0, 1, 2, 3]) {
    const base = suit * 10;
    for (let point = 1; point <= 7; point++) {
      const card = base + point;
      while (counts[card] > 0 && counts[card + 1] > 0 && counts[card + 2] > 0) {
        counts[card]--; counts[card + 1]--; counts[card + 2]--;
      }
    }
  }
  return counts;
}

function routeBonus(ctx, tiles) {
  const round = ctx.round;
  let bonus = 0;
  if (round.config.双大胡) {
    const piziCount = countOf(tiles, round.pizi);
    if (piziCount >= 2) bonus += piziCount === 3 ? 7 : 2;
  }
  // 堆癞子中癞子是最高价值的万能牌，绝不应当孤张处理。
  if (round.config.玩法 === '堆癞子') bonus += countOf(tiles, round.laizi) * 6;
  return bonus;
}

function danger(ctx, card) {
  const round = ctx.round;
  // 本策略只在“只许自摸”中启用，弃牌不可能被点胡，不应虚构放铳风险。
  if (round.config.只许自摸) return 0;
  if (round.wall.remain() > Math.max(12, round.n * 5)) return 0;
  let risk = 0;
  for (let seat = 0; seat < round.n; seat++) {
    if (seat === ctx.seat || !round.baoQys[seat]) continue;
    const shown = round.melds[seat].map((meld) => meld.card).concat(round.shuai[seat] || []);
    const knownSuit = shown.length ? suitOf(shown[0]) : null;
    risk += knownSuit == null ? 1 : (knownSuit === suitOf(card) ? 6 : 0);
  }
  const visible = 4 - (ctx.remaining.get(card) || 0);
  if (visible >= 3) risk -= 1.5;
  return risk;
}

/** 估算当前牌型自摸时的实际收益，不包含清一色或七小对。 */
function estimatedWinValue(ctx, tiles) {
  const round = ctx.round;
  const one = rules.unit(round.config);
  const joker = round.jokerFor(ctx.seat);
  const base = joker >= 0 && tiles.includes(joker) ? rules.FAN.软摸 : rules.FAN.黑摸;
  let value = 0;
  for (let seat = 0; seat < round.n; seat++) {
    if (seat === ctx.seat) continue;
    value += one * base * (typeof round.payFan === 'function' ? round.payFan(ctx.seat, seat) : 1);
  }
  return Math.max(one, value);
}

function expectedStateValue(ctx, tiles, analysis) {
  const wall = Math.max(1, ctx.round.wall.remain());
  const winValue = estimatedWinValue(ctx, tiles);
  const winChance = clamp(analysis.expectedWinningOuts / wall, 0, 1);
  const improveChance = clamp((analysis.expectedOuts - analysis.expectedWinningOuts) / wall, 0, 1);
  const ledger = typeof ctx.round.gangPayments === 'function' ? gangLedger(ctx) : { net: 0 };
  const piziPotential = ctx.round.config.双大胡
    ? Math.max(0, countOf(tiles, ctx.round.pizi) - 1) * rules.unit(ctx.round.config) * 0.35 : 0;
  const xiQianPotential = ctx.round.config.喜钱 > 0 && (ctx.round.shuai[ctx.seat] || []).length === 3
    ? estimatedWallCopies(ctx, ctx.round.laizi) / wall
      * ctx.round.config.喜钱 * rules.unit(ctx.round.config) * (ctx.round.n - 1)
    : 0;
  return winChance * winValue
    + improveChance * winValue * 0.2
    + Number(ledger.net || 0) * 0.12
    + piziPotential
    + xiQianPotential;
}

function analyze(ctx, tiles, melded) {
  const sorted = tiles.slice().sort((a, b) => a - b);
  const key = `${melded}|${sorted.join(',')}`;
  if (ctx.analysisCache.has(key)) return ctx.analysisCache.get(key);
  const rawShanten = shapeShanten(ctx, sorted, melded);
  let shanten = rawShanten;
  let winningOuts = 0;
  let expectedWinningOuts = 0;
  const waits = [];
  for (const card of ctx.types) {
    const left = ctx.remaining.get(card) || 0;
    if (left && canSelfHu(ctx, sorted.concat(card), melded)) {
      winningOuts += left;
      const expected = estimatedWallCopies(ctx, card);
      expectedWinningOuts += expected;
      waits.push({ card, count: left, expected: Number(expected.toFixed(3)) });
    }
  }
  if (winningOuts > 0) shanten = 0;
  // 土豪必杠手里多于一张癞子时不能胡。纯牌形向听可能仍给出 0，
  // 但没有任何合法胡口，决策时必须把它视作至少一向听。
  const deadWait = rawShanten === 0 && winningOuts === 0;
  if (deadWait) shanten = 1;
  let effectiveOuts = winningOuts;
  let expectedOuts = expectedWinningOuts;
  const effectiveTiles = waits.map((item) => ({ ...item }));
  let redrawOuts = 0;
  if (shanten > 0) {
    for (const card of ctx.types) {
      const left = ctx.remaining.get(card) || 0;
      if (!left) continue;
      if (ctx.round.config.玩法 !== '堆癞子'
        && card === ctx.round.laizi
        && countOf(sorted, card) >= 1) {
        // 再摸一张癞子会变成可甩后重抽的机会，不是合法胡牌进张。
        redrawOuts += left;
        continue;
      }
      // “纯牌形已成、但规则上没有合法胡口”的死听，摸一张后还要再弃一张。
      // 直接对 14 张牌调 shapeShanten 会把几乎所有牌误算成进张，因此不计。
      if (deadWait) continue;
      if (shapeShanten(ctx, sorted.concat(card), melded) < shanten) {
        effectiveOuts += left;
        const expected = estimatedWallCopies(ctx, card);
        expectedOuts += expected;
        effectiveTiles.push({ card, count: left, expected: Number(expected.toFixed(3)) });
      }
    }
  }
  const quality = shapeQuality(sorted, ctx.round.jokerFor(ctx.seat));
  const route = routeBonus(ctx, sorted);
  const result = {
    shanten,
    rawShanten,
    deadWait,
    sevenPairs: 99,
    outs: effectiveOuts,
    expectedOuts,
    winningOuts,
    expectedWinningOuts,
    waits,
    effectiveTiles,
    redrawOuts,
    quality,
    route,
    score: -shanten * 100000 + expectedOuts * 1000 + route * 10 + quality,
  };
  result.expectedScore = expectedStateValue(ctx, sorted, result);
  ctx.analysisCache.set(key, result);
  return result;
}

function childContext(ctx, drawnCard) {
  const remaining = new Map(ctx.remaining);
  remaining.set(drawnCard, Math.max(0, (remaining.get(drawnCard) || 0) - 1));
  return { ...ctx, remaining, analysisCache: new Map(), lookaheadCache: new Map() };
}

/** 第二层只用轻量向听/牌形筛选弃牌，再对唯一最优结果精算进张。 */
function fastBestAfterDraw(ctx, tiles, melded) {
  let candidates = unique(tiles).sort((a, b) => a - b);
  if (tiles.includes(ctx.round.laizi) && tiles.some((card) => card !== ctx.round.laizi)) {
    candidates = candidates.filter((card) => card !== ctx.round.laizi);
  }
  let best = null;
  for (const card of candidates) {
    const remaining = removeCopies(tiles, card, 1);
    if (!remaining) continue;
    const shanten = shapeShanten(ctx, remaining, melded);
    const quality = shapeQuality(remaining, ctx.round.jokerFor(ctx.seat));
    if (!best || shanten < best.shanten || (shanten === best.shanten && quality > best.quality)) {
      best = { card, remaining, shanten, quality };
    }
  }
  if (!best) return null;
  return { ...best, analysis: analyze(ctx, best.remaining, melded) };
}

/**
 * 两步摸打搜索：对每种可能摸牌按“估计在牌墙中的张数”加权，
 * 然后模拟这次摸牌后的最佳弃牌。搜索层内关闭继续展开，避免递归爆炸。
 */
function twoStepProjection(ctx, tiles, melded) {
  const key = `${melded}|${tiles.slice().sort((a, b) => a - b).join(',')}`;
  if (ctx.lookaheadCache.has(key)) return ctx.lookaheadCache.get(key);
  let totalWeight = 0;
  let immediateWinWeight = 0;
  let expectedValue = 0;
  let expectedNextShanten = 0;
  for (const card of ctx.types) {
    const physical = ctx.remaining.get(card) || 0;
    if (!physical) continue;
    const weight = estimatedWallCopies(ctx, card);
    if (weight <= 0) continue;
    totalWeight += weight;
    const nextCtx = childContext(ctx, card);
    const afterDraw = tiles.concat(card);
    if (canSelfHu(nextCtx, afterDraw, melded)) {
      immediateWinWeight += weight;
      expectedValue += weight * estimatedWinValue(nextCtx, afterDraw);
      expectedNextShanten -= weight;
      continue;
    }
    const next = fastBestAfterDraw(nextCtx, afterDraw, melded);
    if (!next) continue;
    expectedValue += weight * next.analysis.expectedScore;
    expectedNextShanten += weight * next.analysis.shanten;
  }
  const projection = totalWeight > 0 ? {
    immediateWinProbability: immediateWinWeight / totalWeight,
    expectedValue: expectedValue / totalWeight,
    expectedNextShanten: expectedNextShanten / totalWeight,
  } : { immediateWinProbability: 0, expectedValue: 0, expectedNextShanten: 99 };
  ctx.lookaheadCache.set(key, projection);
  return projection;
}

function evaluateDiscardCandidates(ctx, tiles, melded, candidates, options = {}) {
  // 向听数是第一优先级。先用轻量牌形计算筛掉会多一向听的弃牌，
  // 只对最佳向听的候选枚举所有进张，避免单个机器人阻塞服务端事件循环。
  let minShanten = Infinity;
  const prepared = [];
  for (const card of candidates) {
    const remaining = removeCopies(tiles, card, 1);
    if (!remaining) continue;
    const shanten = shapeShanten(ctx, remaining, melded);
    minShanten = Math.min(minShanten, shanten);
    prepared.push({ card, remaining, shanten });
  }
  let evaluated = prepared
    .filter(({ shanten }) => shanten === minShanten)
    .map((item) => ({ ...item, analysis: analyze(ctx, item.remaining, melded) }));
  // 纯牌形的 0 向听可能是“多癞子不许胡”的假听。若最小候选全是假听，
  // 把原始 1 向听也纳入精算，避免它们被预筛选错过。
  if (minShanten === 0 && evaluated.every(({ analysis }) => analysis.shanten > 0)) {
    evaluated = evaluated.concat(prepared
      .filter(({ shanten }) => shanten === 1)
      .map((item) => ({ ...item, analysis: analyze(ctx, item.remaining, melded) })));
  }
  const bestShanten = evaluated.reduce(
    (best, item) => Math.min(best, item.analysis.shanten), Infinity
  );
  const looseCounts = looseStructureCounts(ctx, tiles);
  const sameShanten = evaluated.filter(({ analysis }) => analysis.shanten === bestShanten)
    .map((item) => ({
      ...item,
      preservedSets: protectedShapeCount(ctx, item.remaining),
      preservedSequences: protectedSequenceCount(ctx, item.remaining),
      breaksLockedStructure: !(looseCounts[item.card] > 0),
    }));
  const bestPreservedSets = sameShanten.reduce(
    (best, item) => Math.max(best, item.preservedSets), 0
  );
  const sameProtectedSets = sameShanten.filter((item) => item.preservedSets === bestPreservedSets);
  const hasLooseDiscard = sameProtectedSets.some((item) => !item.breaksLockedStructure);
  const sameLockedStructure = hasLooseDiscard
    ? sameProtectedSets.filter((item) => !item.breaksLockedStructure) : sameProtectedSets;
  const bestPreservedSequences = sameLockedStructure.reduce(
    (best, item) => Math.max(best, item.preservedSequences), 0
  );
  const shortlisted = sameLockedStructure
    .filter((item) => item.preservedSequences === bestPreservedSequences)
    .map((item) => ({ ...item,
      baseScore: item.analysis.score + item.analysis.expectedScore * 20 - danger(ctx, item.card) }))
    .sort((a, b) => b.baseScore - a.baseScore);
  // 只对一步牌效最好的前四张展开第二层，确保服务端决策不阻塞行牌。
  const ranked = shortlisted.map((item, index) => {
    const projection = options.lookahead === false || index >= 4
      ? { immediateWinProbability: 0, expectedValue: 0, expectedNextShanten: item.analysis.shanten }
      : twoStepProjection(ctx, item.remaining, melded);
    const score = item.baseScore
      + projection.expectedValue * 25
      + projection.immediateWinProbability * 10000;
    return { ...item, projection, score };
  }).sort((a, b) => b.score - a.score
    || Number(b.card === ctx.round.drawn[ctx.seat]) - Number(a.card === ctx.round.drawn[ctx.seat])
    || a.card - b.card);

  // Jev 只负责在确有取舍的方案间选择。若某张弃牌在向听、进张、牌形质量、
  // 预期分及两步搜索上均不优于另一张，它没有策略价值，不应再交给模型翻案。
  // 例如 12455 中打 4 会拆掉 45，而打 1 在各项指标上都不差，应直接淘汰打 4。
  const value = (number) => Number.isFinite(number) ? number : 0;
  const dominates = (left, right) => {
    const comparisons = [
      [left.analysis.shanten, right.analysis.shanten, -1],
      [value(left.analysis.expectedOuts), value(right.analysis.expectedOuts), 1],
      [value(left.analysis.expectedWinningOuts), value(right.analysis.expectedWinningOuts), 1],
      [value(left.analysis.quality), value(right.analysis.quality), 1],
      [value(left.analysis.expectedScore), value(right.analysis.expectedScore), 1],
      [value(left.projection.immediateWinProbability),
        value(right.projection.immediateWinProbability), 1],
      [value(left.projection.expectedValue), value(right.projection.expectedValue), 1],
    ];
    const noWorse = comparisons.every(([a, b, direction]) => direction * (a - b) >= -1e-9);
    const strictlyBetter = comparisons.some(([a, b, direction]) => direction * (a - b) > 1e-9);
    return noWorse && strictlyBetter;
  };
  return ranked.filter((candidate) => !ranked.some((other) => (
    other !== candidate && dominates(other, candidate)
  )));
}

function rankDiscardCandidates(ctx, tiles, melded, candidates, options = {}) {
  return evaluateDiscardCandidates(ctx, tiles, melded, candidates, options)[0] || null;
}

/** 已经发生的公开杠账。再甩一张癞子时，这些涉及本座的收支会恰好再翻一倍。 */
function gangLedger(ctx) {
  const round = ctx.round;
  let credit = 0;
  let liability = 0;
  let ownGangs = 0;
  let unrelatedOpponentGangs = 0;
  let pointGangLiability = 0;
  for (const gang of round.gangs || []) {
    const payments = round.gangPayments(gang);
    if (gang.seat === ctx.seat) {
      ownGangs++;
      credit += payments.reduce((sum, payment) => sum + payment.amount, 0);
      continue;
    }
    const mine = payments
      .filter((payment) => payment.from === ctx.seat)
      .reduce((sum, payment) => sum + payment.amount, 0);
    liability += mine;
    if (mine && gang.type === 'ming' && gang.from === ctx.seat) pointGangLiability += mine;
    if (!mine) unrelatedOpponentGangs++;
  }
  const one = rules.unit(round.config);
  let blackGross = 0;
  for (let seat = 0; seat < round.n; seat++) {
    if (seat === ctx.seat) continue;
    blackGross += 4 * one * round.payFan(ctx.seat, seat);
  }
  return {
    credit,
    liability,
    net: credit - liability,
    blackGross: Math.max(1, blackGross),
    ownGangs,
    unrelatedOpponentGangs,
    pointGangLiability,
  };
}

function immediateGangValue(ctx, type, from = null) {
  const round = ctx.round;
  const one = rules.unit(round.config);
  const score = rules.gangScore(type, round.config);
  if (score.each > 0) {
    let value = 0;
    for (let seat = 0; seat < round.n; seat++) {
      if (seat !== ctx.seat) value += score.each * one * round.payFan(ctx.seat, seat);
    }
    return value;
  }
  return from == null ? 0 : score.from * one * round.payFan(ctx.seat, from);
}

/**
 * 土豪必杠的癞子是一张普通牌，甩出后会立即补摸并把所有本座收支翻倍。
 * 因此要同时比较“保留癞子后普通出牌”与“甩癞后立即重抽”的牌效，
 * 再用已有杠账修正风险。全部数据都是己方手牌或公开信息。
 */
function shuaiDecision(ctx, tiles, melded) {
  const round = ctx.round;
  const laiziCount = countOf(tiles, round.laizi);
  const wall = round.wall.remain();
  const nonLaizi = unique(tiles.filter((card) => card !== round.laizi)).sort((a, b) => a - b);
  if (round.config.玩法 !== '土豪必杠' || !round.config.只许自摸 || !laiziCount) {
    return { should: false, reason: '不在动态甩癞范围' };
  }
  if (wall <= 0) {
    return { should: tiles.length === 2 && nonLaizi.length === 0, reason: '牌墙已空' };
  }
  if (nonLaizi.length === 0) return { should: true, reason: '手上只剩癞子' };

  // 第四癞会立即获得确定性喜钱，默认档远高于一次普通黑摸。
  if ((round.shuai[ctx.seat] || []).length === 3 && round.config.喜钱 > 0) {
    return { should: true, reason: '第四癞喜钱' };
  }
  // 当前规则下手里多于一张癞子时绝对不能胡，也就不可能真正进入听牌。
  // 牌墙还有牌时必须先甩到只剩一张，动态风险判断再用在最后这张上。
  if (laiziCount > 1) return { should: true, reason: '多癞子必须先甩' };

  const throwTiles = removeCopies(tiles, round.laizi, 1);
  const throwAnalysis = analyze(ctx, throwTiles, melded);
  const keep = rankDiscardCandidates(ctx, tiles, melded, nonLaizi, { lookahead: false });
  if (!keep) return { should: true, reason: '没有普通弃牌', throwAnalysis };

  const ledger = gangLedger(ctx);
  const gangCredit = clamp(6 * ledger.net / ledger.blackGross, -6, 6);
  // 别人点给别人的明杠不会立即让本家付分，但它代表对手已经
  // 锁定了收益且牌形加快。只做轻微的风险扣分，不把间接杠当成本家负债。
  const opponentGangPressure = Math.min(2, ledger.unrelatedOpponentGangs);
  const tempo = wall < round.n ? 4
    : wall <= 2 * round.n ? 3
      : wall <= 4 * round.n ? 2 : 1;
  const winNow = throwAnalysis.winningOuts > 0 ? 2 : 0;
  const adjustedOuts = throwAnalysis.outs + tempo + winNow + gangCredit
    - opponentGangPressure;
  // 保留单癞时，再摸一张癞子虽不是合法胡口，但可以甩掉后免费重抽，
  // 因此按四分之一张有效进张作为平局修正，避免系统性高估早甩。
  const keepAdjustedOuts = keep.analysis.outs + keep.analysis.redrawOuts * 0.25;
  const severeDebt = ledger.net <= -ledger.blackGross / 2;
  const strongCredit = ledger.net >= ledger.blackGross / 2;
  const liveThrow = throwAnalysis.shanten === 0 && throwAnalysis.winningOuts > 0;
  const goodHand = liveThrow
    || (throwAnalysis.shanten === 1 && throwAnalysis.outs > 0 && !throwAnalysis.deadWait);

  const requiredOuts = keepAdjustedOuts;
  let should;
  let reason;
  if (throwAnalysis.shanten < keep.analysis.shanten) {
    // 少一向听优先于裸进张数；但只剩一张胡口时，保留更宽的一向听通常更好。
    should = goodHand || strongCredit || wall < round.n;
    reason = should ? '甩癞后少一向听' : '甩癞后听口太少';
    if (liveThrow && throwAnalysis.winningOuts < 3 && !strongCredit && wall >= round.n) {
      should = false;
      reason = '甩癞后听口太少';
    }
  } else if (throwAnalysis.shanten > keep.analysis.shanten) {
    // 有己方杠账时，再甩一张会把已锁定的正收益翻倍。旧阈值把
    // strongCredit 也限制在牌墙仅剩 0~n-1 张才生效，等于永远用不上。
    // 仅在“只退一向听且甩后有效进张不少”时放宽，避免为了倍数拆坏成牌。
    const creditBackstep = strongCredit
      && throwAnalysis.shanten === keep.analysis.shanten + 1
      && throwAnalysis.outs >= keepAdjustedOuts + opponentGangPressure;
    const lastChance = wall < round.n
      && (liveThrow || strongCredit)
      && adjustedOuts >= requiredOuts;
    should = creditBackstep || lastChance;
    reason = creditBackstep ? '自己的杠账占优'
      : (lastChance ? '末圈立即补摸' : '甩癞会退向听');
  } else {
    should = adjustedOuts >= requiredOuts;
    reason = '同向听比较进张';
    if (!goodHand && !strongCredit && wall >= round.n) {
      should = false;
      reason = '牌形未到一向听';
    }
  }
  // 已经点杠给对方后，听牌状态摸到癞子仍优先甩掉：这样原来的听口
  // 完整保留并立即补摸，不能为了避免杠账翻倍反而拆掉听牌搭子。
  const preserveReadyAfterPointGang = round.drawn[ctx.seat] === round.laizi
    && liveThrow && ledger.pointGangLiability > 0;
  if (preserveReadyAfterPointGang) {
    should = true;
    reason = '点杠后摸癞保持听牌';
  } else if (severeDebt && wall >= round.n
    && !(liveThrow && throwAnalysis.winningOuts >= 6 && adjustedOuts >= requiredOuts)) {
    should = false;
    reason = '别家已有杠账';
  } else if (should && ledger.net > 0) reason = '自己的杠账占优';
  else if (should && liveThrow) reason = '听口仍充足';
  else if (should && throwAnalysis.shanten === 1) reason = '一向听且进张充足';

  return {
    should,
    reason,
    laiziCount,
    wall,
    throwAnalysis,
    keep: keep.analysis,
    keepAdjustedOuts,
    adjustedOuts,
    requiredOuts,
    gangCredit,
    opponentGangPressure,
    ledger,
  };
}

function rankedDiscardsFrom(ctx, tiles, melded, options = {}) {
  const round = ctx.round;
  const hasLaizi = tiles.includes(round.laizi);
  if (hasLaizi && round.config.玩法 === '土豪必杠') {
    const decision = options.shuaiMode === 'eager'
      ? { should: round.wall.remain() > 0, reason: '基线立即甩癞' }
      : shuaiDecision(ctx, tiles, melded);
    if (decision.should) {
      const rest = removeCopies(tiles, round.laizi, 1);
      return [{
        card: round.laizi,
        analysis: analyze(ctx, rest, melded),
        score: Infinity,
        shuai: decision,
        projection: options.lookahead === false
          ? { immediateWinProbability: 0, expectedValue: 0, expectedNextShanten: 0 }
          : twoStepProjection(ctx, rest, melded),
      }];
    }
  }

  let candidates = unique(tiles).sort((a, b) => a - b);
  // 癞子一旦打出就是“甩癞”而非普通弃牌；动态决策选择保留时，
  // 必须从普通弃牌候选里排除它。牌墙空时也可避免非法重试导致卡局。
  if (hasLaizi && tiles.some((card) => card !== round.laizi)) {
    candidates = candidates.filter((card) => card !== round.laizi);
  }
  return evaluateDiscardCandidates(ctx, tiles, melded, candidates, options);
}

function bestDiscardFrom(ctx, tiles, melded, options = {}) {
  return rankedDiscardsFrom(ctx, tiles, melded, options)[0] || null;
}

function rankDiscardOptions(round, seat, options = {}) {
  const ctx = context(round, seat);
  const limit = Math.max(1, Math.min(6, Number(options.limit) || 4));
  return rankedDiscardsFrom(ctx, round.looseTiles(seat), round.melds[seat].length,
    { ...options, lookahead: options.lookahead !== false }).slice(0, limit);
}

function chooseDiscard(round, seat, options = {}) {
  const best = rankDiscardOptions(round, seat, { ...options, limit: 1 })[0];
  return best ? best.card : null;
}

function shouldPeng(ctx, card, options = {}) {
  const round = ctx.round;
  const tiles = round.hands[ctx.seat].slice();
  const melded = round.melds[ctx.seat].length;
  const before = analyze(ctx, tiles, melded);
  const afterTake = removeCopies(tiles, card, 2);
  if (!afterTake) return false;
  const best = bestDiscardFrom(ctx, afterTake, melded + 1, options);
  if (!best) return false;
  if (best.analysis.shanten < before.shanten) return true;
  if (best.analysis.shanten > before.shanten) return false;
  return best.analysis.outs >= before.outs + 2 && best.analysis.score > before.score;
}

function shouldMingGang(ctx, card, options = {}) {
  const round = ctx.round;
  const tiles = round.hands[ctx.seat].slice();
  const melded = round.melds[ctx.seat].length;
  const before = analyze(ctx, tiles, melded);
  const isPizi = card === round.pizi;
  const afterTake = removeCopies(tiles, card, isPizi ? 2 : 3);
  if (!afterTake) return false;
  const after = isPizi
    ? bestDiscardFrom(ctx, afterTake, melded + 1, options)?.analysis
    : analyze(ctx, afterTake, melded + 1);
  if (!after || after.shanten > before.shanten) return false;
  const pending = round.pending;
  const from = pending && pending.kind === 'discard' ? pending.from : null;
  return after.shanten < before.shanten
    || after.expectedScore + immediateGangValue(ctx, 'ming', from) >= before.expectedScore;
}

function chooseSelfGang(ctx, cards, options = {}) {
  const round = ctx.round;
  const tiles = round.looseTiles(ctx.seat);
  const melded = round.melds[ctx.seat].length;
  // 三张朝天已经是确定的一笔朝天笑，且无需补牌；一旦摸齐应立即杠下去。
  const piziGang = cards.find((card) => card === round.pizi
    && !round.melds[ctx.seat].some((meld) => meld.type === 'peng' && meld.card === card)
    && countOf(tiles, card) >= 3);
  if (piziGang != null) return piziGang;
  const baseline = bestDiscardFrom(ctx, tiles, melded, options)?.analysis || analyze(ctx, tiles, melded);
  let best = null;
  for (const card of cards) {
    const isBu = round.melds[ctx.seat].some((meld) => meld.type === 'peng' && meld.card === card);
    const isPizi = !isBu && card === round.pizi;
    const take = isBu ? 1 : isPizi ? 3 : 4;
    const rest = removeCopies(tiles, card, take);
    if (!rest) continue;
    const nextMelded = melded + (isBu ? 0 : 1);
    const after = isPizi
      ? bestDiscardFrom(ctx, rest, nextMelded, options)?.analysis
      : analyze(ctx, rest, nextMelded);
    if (!after || after.shanten > baseline.shanten) continue;
    const gangType = isBu ? 'bu' : (isPizi ? 'pizi' : 'an');
    const score = after.score + after.expectedScore * 20 + immediateGangValue(ctx, gangType) * 25;
    if (!best || score > best.score) best = { card, score };
  }
  return best && best.card;
}

function chooseSelfAction(round, seat, pending, options = {}) {
  if (pending.hu) return { op: 'hu' };
  if (pending.gang && pending.gang.length) {
    const card = chooseSelfGang(context(round, seat), pending.gang, options);
    if (card != null) return { op: 'gang', data: { card } };
  }
  return { op: 'pass' };
}

function chooseDiscardResponse(round, seat, pending, candidate, options = {}) {
  if (candidate.ops.hu) return { op: 'hu' };
  // 点杠把手里的刻子原样转成副露，不会拆牌，并且立即获得杠分；
  // 这是确定性规则，不允许后续智能模型改成“过”。
  if (candidate.ops.gang) return { op: 'gang', data: { card: pending.card } };
  const ctx = context(round, seat);
  if (candidate.ops.peng && shouldPeng(ctx, pending.card, options)) return { op: 'peng' };
  return { op: 'pass' };
}

module.exports = {
  chooseDiscard,
  rankDiscardOptions,
  chooseSelfAction,
  chooseDiscardResponse,
  noteDiscardWaitInference,
  // 单测和离线对局基准使用的纯分析入口。
  _test: {
    context, analyze, shapeShanten, bestDiscardFrom, rankDiscardCandidates, visibleCounts,
    evaluateDiscardCandidates, twoStepProjection, estimatedWallCopies, expectedStateValue,
    shouldPeng, shouldMingGang, shuaiDecision, gangLedger,
    protectedShapeCount, protectedSequenceCount, looseStructureCounts,
  },
};
