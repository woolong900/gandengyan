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
  const actualMelded = (round.melds[ctx.seat] || []).length;
  // 当前副露数未变化时直接复用规则层；模拟“碰后/杠后”的牌形时，melded
  // 已经比真实桌面多一副，不能再让 canHuTiles 使用碰前副露数，否则会把
  // 碰后 34567 听 2/5/8 之类的合法听牌误判成死听。
  if (typeof round.canHuTiles === 'function' && melded === actualMelded) {
    return round.canHuTiles(ctx.seat, tiles);
  }
  if (round.config.玩法 !== '堆癞子' && countOf(tiles, round.laizi) > 1) return false;
  const args = [tiles, round.jokerFor(ctx.seat), melded, round.fullMelds];
  if (round.config.玩法 === '潜江癞晃' || round.config.玩法 === '土豪必杠') {
    return mahjong.canHuNormal(...args);
  }
  return mahjong.canHu(...args);
}

function shapeQuality(tiles, joker) {
  const counts = new Map();
  for (const tile of tiles) if (tile !== joker) counts.set(tile, (counts.get(tile) || 0) + 1);
  let score = 0;
  for (const [tile, count] of counts) {
    if (count >= 3) score += 9;
    else if (count === 2) score += 4;
  }
  // 先把已成的刻子留出来，再评估剩余牌的连接性。刻子里的牌不能同时
  // 重复当作顺子搭子；否则 677788 打 8 后的 67778 会被误算成
  // “777 刻子 + 678 连张”，反而压过打 6 后真正同时保留的 777 + 88。
  const shapeCounts = new Map(counts);
  for (const [tile, count] of shapeCounts) {
    if (count >= 3) shapeCounts.set(tile, count - 3);
  }
  for (const [tile, count] of shapeCounts) {
    if (count <= 0) continue;
    const point = tile % 10;
    if (point <= 8 && (shapeCounts.get(tile + 1) || 0) > 0
      && suitOf(tile) === suitOf(tile + 1)) {
      // 12/89 只有一个直接成顺入口，后续改良面也窄；例如 689 中，
      // 保留 68 后再摸 5 可以转成 56 的 4/7 双进张，保留 89 则没有
      // 对等的双进张改良。不能把边张相邻搭子的质量评得高于中张嵌张。
      score += point === 1 || point === 8 ? 1.25 : 3;
    }
    if (point <= 7 && (shapeCounts.get(tile + 2) || 0) > 0
      && suitOf(tile) === suitOf(tile + 2)) score += 1.5;
    if (count === 1 && !(shapeCounts.get(tile - 1) > 0) && !(shapeCounts.get(tile + 1) > 0)
      && !(shapeCounts.get(tile - 2) > 0) && !(shapeCounts.get(tile + 2) > 0)) {
      score -= point === 1 || point === 9 ? 1.5 : 1;
    }
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

/** 一张牌在本家暗手之外已经公开出现的数量。 */
function publicOutsideCount(ctx, tiles, card) {
  return Math.max(0, (baseVisibleCounts(ctx.round, ctx.seat).get(card) || 0)
    - countOf(tiles, card));
}

/** 癞子是否与同花色的两张邻牌组成了自然顺子。 */
function laiziFormsNaturalSequence(round, tiles) {
  const laizi = round.laizi;
  if (!tiles.includes(laizi)) return false;
  const point = laizi % 10;
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  const has = (card) => suitOf(card) === suitOf(laizi) && (counts.get(card) || 0) > 0;
  return (point >= 3 && has(laizi - 2) && has(laizi - 1))
    || (point >= 2 && point <= 8 && has(laizi - 1) && has(laizi + 1))
    || (point <= 7 && has(laizi + 1) && has(laizi + 2));
}

/**
 * 别家已经暗杠，而本家至少要连续甩两张癞子才可能恢复胡牌时，改走
 * “追杠”路线。双癞尚未成顺时也暂时弃胡：先不甩癞子，等后续摸牌
 * 让癞子成顺后再重新评估。弃胡期间不为向听数拆掉仍可能成杠的对子和坎子。
 */
function gangHuntMode(ctx, tiles) {
  const round = ctx.round;
  const laiziCount = countOf(tiles, round.laizi);
  return round.config.玩法 === '土豪必杠'
    && round.config.只许自摸
    && (laiziCount >= 3
      || (laiziCount === 2 && !laiziFormsNaturalSequence(round, tiles)))
    && (round.gangs || []).some((gang) => gang.seat !== ctx.seat && gang.type !== 'ming');
}

/** 尚未在本家以外公开出现、仍可能补成暗杠或碰后回头杠的对子/坎子。 */
function liveGangFoundationCards(ctx, tiles) {
  if (!gangHuntMode(ctx, tiles)) return new Set();
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  return new Set([...counts]
    .filter(([card, count]) => card !== ctx.round.laizi
      && count >= 2
      && publicOutsideCount(ctx, tiles, card) === 0)
    .map(([card]) => card));
}

/**
 * 追杠路线遇到第一张同牌时直接碰，保留最后一张回头杠机会；如果此前
 * 已经公开出现过同牌，四张已不可能凑齐，不为追杠强制碰牌。
 */
function shouldChaseGangPeng(ctx, card) {
  const round = ctx.round;
  const tiles = round.hands[ctx.seat].slice();
  if (!gangHuntMode(ctx, tiles) || card === round.laizi || countOf(tiles, card) < 2) return false;
  const pending = round.pending;
  if (!pending || pending.kind !== 'discard' || pending.card !== card) return false;
  const river = round.discards[pending.from] || [];
  const currentIsPublic = river.lastIndexOf(card) >= 0 ? 1 : 0;
  return publicOutsideCount(ctx, tiles, card) - currentIsPublic === 0;
}

function mustChaseGangPeng(round, seat, card) {
  return shouldChaseGangPeng(context(round, seat), card);
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
 * 对子与一副顺子共用同一张牌的复合牌形数。例如 6678 同时
 * 保留了 66 对子和 678 顺子，后续既能碰/杠 6，也能继续改良。
 * 这种重叠价值不能在固定拆出 678 后把另一张 6 当成普通游离张。
 */
function pairSequenceOverlapCards(tiles) {
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  const overlaps = new Set();
  for (const [card, count] of counts) {
    if (count < 2) continue;
    const point = card % 10;
    const forward = point <= 7
      && (counts.get(card + 1) || 0) > 0
      && (counts.get(card + 2) || 0) > 0
      && suitOf(card) === suitOf(card + 2);
    const backward = point >= 3
      && (counts.get(card - 1) || 0) > 0
      && (counts.get(card - 2) || 0) > 0
      && suitOf(card) === suitOf(card - 2);
    const centered = point >= 2 && point <= 8
      && (counts.get(card - 1) || 0) > 0
      && (counts.get(card + 1) || 0) > 0
      && suitOf(card - 1) === suitOf(card + 1);
    if (forward || backward || centered) overlaps.add(card);
  }
  return overlaps;
}

function centeredPairSequenceOverlapCards(tiles) {
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  return new Set([...counts]
    .filter(([card, count]) => {
      const point = card % 10;
      return count >= 2 && point >= 2 && point <= 8
        && (counts.get(card - 1) || 0) > 0
        && (counts.get(card + 1) || 0) > 0
        && suitOf(card - 1) === suitOf(card + 1);
    })
    .map(([card]) => card));
}

function pairSequenceOverlapCount(tiles) {
  return pairSequenceOverlapCards(tiles).size;
}

/**
 * 与朝天、癞子共同组成顺子的对子。例如朝天 6、癞子 7 时，88 同时
 * 是对子和 678 的端点；普通向听会把其中一张 8 当成可以拆的重复张。
 */
function piziLaiziSequencePairCards(ctx, tiles) {
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  const out = new Set();
  for (const [card, count] of counts) {
    if (count < 2 || card === ctx.round.pizi || card === ctx.round.laizi) continue;
    const sequence = [card, ctx.round.pizi, ctx.round.laizi].sort((a, b) => a - b);
    if (suitOf(sequence[0]) === suitOf(sequence[2])
      && sequence[1] === sequence[0] + 1
      && sequence[2] === sequence[1] + 1) out.add(card);
  }
  return out;
}

/** 相邻的“真实刻子+真实对子”组合数，例如 777+88。 */
function adjacentTripletPairCount(tiles) {
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  let bundles = 0;
  for (const [triplet, count] of counts) {
    if (count < 3) continue;
    for (const pair of [triplet - 1, triplet + 1]) {
      if (suitOf(pair) === suitOf(triplet) && counts.get(pair) === 2) bundles++;
    }
  }
  return bundles;
}

/**
 * 135/246/357/468/579 这类“双嵌张链”的中间牌。中间牌同时
 * 连着两组嵌张；例如 579 打 5 还有 79，打 9 还有 57，打 7 则
 * 直接变成 5、9 两张散牌。
 */
function doubleGapMiddleCards(tiles, candidates = null) {
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  const allowed = candidates ? new Set(candidates) : null;
  const middles = new Set();
  for (const low of counts.keys()) {
    const point = low % 10;
    if (point < 1 || point > 5) continue;
    const middle = low + 2;
    const high = low + 4;
    if (suitOf(low) !== suitOf(high)
      || !(counts.get(middle) > 0) || !(counts.get(high) > 0)) continue;
    // 只有端点至少有一张可以改打时才保护中间牌，避免和癞子、
    // 朝天等已被其他硬规则排除的候选产生冲突。
    if (!allowed || allowed.has(low) || allowed.has(high)) middles.add(middle);
  }
  return middles;
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

/**
 * 找出已经接近死张的嵌张两端。例如手里 79 筒，公开信息已能
 * 推出 8 筒至少出现三张，那么这组“名义搭子”实际只剩一张可进。
 * 只使用本家手牌、弃牌、副露和等待碰杠的公开推断，不读取对手暗手。
 */
function staleGapBreakCards(ctx, tiles, candidates) {
  const allowed = new Set(candidates);
  const counts = new Map();
  for (const tile of tiles) counts.set(tile, (counts.get(tile) || 0) + 1);
  const out = new Set();
  for (const low of counts.keys()) {
    const point = low % 10;
    const high = low + 2;
    if (point < 1 || point > 7 || suitOf(low) !== suitOf(high)) continue;
    if (counts.get(low) !== 1 || counts.get(high) !== 1) continue;
    if ((ctx.remaining.get(low + 1) || 0) > 1) continue;
    for (const card of [low, high]) {
      if (allowed.has(card) && card !== ctx.round.laizi && card !== ctx.round.pizi) out.add(card);
    }
  }
  return [...out];
}

function isIsolatedTile(ctx, tiles, card) {
  if (countOf(tiles, card) !== 1 || card === ctx.round.laizi || card === ctx.round.pizi) return false;
  const point = card % 10;
  return point >= 1 && point <= 9
    && !tiles.some((tile) => tile !== card && suitOf(tile) === suitOf(card)
      && Math.abs(tile - card) <= 2);
}

/**
 * 二向听以上的前中盘，真正孤立的幺九应早于孤立的二八清理。
 * 这项只作为多轮模拟的结构修正，不越过向听数，也不拆任何现成搭子。
 */
function isolatedDiscardBonus(ctx, tiles, card, shanten) {
  if (shanten < 2 || ctx.round.wall.remain() <= ctx.round.n * 3) return 0;
  if (!isIsolatedTile(ctx, tiles, card)) return 0;
  const point = card % 10;
  if (point === 1 || point === 9) return 1800;
  if (point === 2 || point === 8) return 400;
  return 0;
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
  const shuaiMultiplier = 2 ** Math.min(4, (round.shuai[ctx.seat] || []).length);
  return Math.max(one, value) * shuaiMultiplier;
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

/**
 * 本座在牌墙摸完前大约还能摸几次。不假设自己每次都是下一张，
 * 否则会系统性高估宽听口；这里只用公开的剩余牌数和人数。
 */
function remainingDrawsForSeat(ctx) {
  return Math.max(0, Math.ceil(Math.max(0, ctx.round.wall.remain()) / ctx.round.n));
}

/** 用不放回抽样估算未来 draws 次至少摸到一张目标牌的概率。 */
function horizonProbability(population, expectedCopies, draws) {
  const total = Math.max(0, Number(population) || 0);
  const copies = clamp(Number(expectedCopies) || 0, 0, total);
  let left = total;
  let misses = total - copies;
  let missProbability = 1;
  for (let n = 0; n < Math.min(draws, total); n++) {
    if (left <= 0 || misses <= 0) return 1;
    missProbability *= misses / left;
    left--;
    misses--;
  }
  return clamp(1 - missProbability, 0, 1);
}

function combination(n, k) {
  if (k < 0 || k > n) return 0;
  const count = Math.min(k, n - k);
  let value = 1;
  for (let i = 1; i <= count; i++) value = value * (n - count + i) / i;
  return value;
}

/**
 * 在不读取对手暗手的前提下，用超几何分布估算对手手里至少有
 * minimum 张某牌的概率。
 */
function holdingProbability(population, copies, handSize, minimum) {
  const total = Math.max(0, Math.floor(population));
  const success = clamp(Math.floor(copies), 0, total);
  const draws = clamp(Math.floor(handSize), 0, total);
  if (minimum <= 0) return 1;
  if (success < minimum || draws < minimum || !total) return 0;
  const denominator = combination(total, draws);
  if (!denominator) return 0;
  let below = 0;
  for (let found = 0; found < minimum; found++) {
    below += combination(success, found) * combination(total - success, draws - found)
      / denominator;
  }
  return clamp(1 - below, 0, 1);
}

/**
 * 只许自摸不等于弃牌没有代价：对手碰牌会加速，点杠还会立即付分。
 * 该风险仅由己方手牌、河牌、副露和剩余未见张数推导。
 */
function publicClaimRisk(ctx, card) {
  const round = ctx.round;
  const copies = ctx.remaining.get(card) || 0;
  if (copies < 2) return { anyClaimProbability: 0, gangProbability: 0, expectedGangLoss: 0 };
  const wall = Math.max(0, round.wall.remain());
  const opponents = [];
  let concealedTotal = 0;
  for (let seat = 0; seat < round.n; seat++) {
    if (seat === ctx.seat) continue;
    const meldCount = (round.melds[seat] || []).length;
    const handSize = Math.max(1, (round.fullMelds - meldCount) * 3 + 1);
    opponents.push({ seat, handSize });
    concealedTotal += handSize;
  }
  const population = wall + concealedTotal;
  if (!population) return { anyClaimProbability: 0, gangProbability: 0, expectedGangLoss: 0 };
  let noClaim = 1;
  let noGang = 1;
  let expectedGangLoss = 0;
  const gangNeed = card === round.pizi ? 2 : 3;
  const gangFrom = rules.gangScore('ming', round.config).from * rules.unit(round.config);
  for (const opponent of opponents) {
    const claim = holdingProbability(population, copies, opponent.handSize, 2);
    const gang = holdingProbability(population, copies, opponent.handSize, gangNeed);
    noClaim *= 1 - claim;
    noGang *= 1 - gang;
    expectedGangLoss += gang * gangFrom
      * (typeof round.payFan === 'function' ? round.payFan(opponent.seat, ctx.seat) : 1);
  }
  return {
    anyClaimProbability: clamp(1 - noClaim, 0, 1),
    gangProbability: clamp(1 - noGang, 0, 1),
    expectedGangLoss,
  };
}

/**
 * 整场累计分决定当前更适合守成还是追分。分差至少达到两次普通黑摸的
 * 总收支才切换，避免几十小分的波动让策略来回抖动。
 */
function matchStrategy(ctx) {
  const scores = ctx.round.seats.map((member) => Number(member.score) || 0);
  const mine = scores[ctx.seat] || 0;
  const opponents = scores.filter((_score, seat) => seat !== ctx.seat);
  const bestOpponent = opponents.length ? Math.max(...opponents) : mine;
  const secondBest = scores.slice().sort((a, b) => b - a)[1] ?? mine;
  const normalSwing = Math.max(1,
    rules.unit(ctx.round.config) * 8 * Math.max(1, ctx.round.n - 1));
  let mode = 'balanced';
  let gap = bestOpponent - mine;
  if (mine === Math.max(...scores) && mine - secondBest >= normalSwing) {
    mode = 'defense';
    gap = mine - secondBest;
  } else if (bestOpponent - mine >= normalSwing) {
    mode = 'attack';
  }
  return { mode, gap, normalSwing, mine, bestOpponent };
}

/** 对手甩到三癞以上后，碰牌加速和点杠都会带着高倍收支。 */
function opponentLaiziPressure(ctx) {
  let maximum = 0;
  let threats = 0;
  for (let seat = 0; seat < ctx.round.n; seat++) {
    if (seat === ctx.seat) continue;
    const count = (ctx.round.shuai[seat] || []).length;
    maximum = Math.max(maximum, count);
    if (count >= 3) threats++;
  }
  const multiplier = maximum >= 4 ? 4 : maximum === 3 ? 2.5 : 1;
  return { maximum, threats, multiplier };
}

function strategyProfile(ctx) {
  const match = matchStrategy(ctx);
  const laiziPressure = opponentLaiziPressure(ctx);
  const profiles = {
    balanced: {
      outsWeight: 720, qualityWeight: 22, stateValueWeight: 28,
      projectionValueWeight: 120, projectionShantenWeight: 1400,
      projectionWinWeight: 15000, projectionImproveWeight: 1200,
      horizonWinWeight: 7000, horizonImproveWeight: 800,
      claimWeight: 500, gangLossWeight: 35,
    },
    defense: {
      outsWeight: 650, qualityWeight: 28, stateValueWeight: 24,
      projectionValueWeight: 110, projectionShantenWeight: 1650,
      projectionWinWeight: 12000, projectionImproveWeight: 900,
      horizonWinWeight: 6000, horizonImproveWeight: 650,
      claimWeight: 1200, gangLossWeight: 80,
    },
    attack: {
      outsWeight: 800, qualityWeight: 18, stateValueWeight: 32,
      projectionValueWeight: 155, projectionShantenWeight: 1500,
      projectionWinWeight: 21000, projectionImproveWeight: 1500,
      horizonWinWeight: 9500, horizonImproveWeight: 1050,
      claimWeight: 300, gangLossWeight: 20,
    },
  };
  const profile = profiles[match.mode];
  return {
    ...profile,
    mode: match.mode,
    scoreGap: match.gap,
    scoreSwitch: match.normalSwing,
    laiziPressure,
    riskMultiplier: laiziPressure.multiplier,
  };
}

function strategicHandValue(ctx, tiles, analysis, options = {}) {
  const wall = Math.max(1, ctx.round.wall.remain());
  const draws = remainingDrawsForSeat(ctx) + Math.max(0, Number(options.extraDraws) || 0);
  const winProbability = horizonProbability(wall, analysis.expectedWinningOuts, draws);
  const improveCopies = Math.max(0, analysis.expectedOuts - analysis.expectedWinningOuts);
  const improveProbability = horizonProbability(wall, improveCopies, draws);
  const winValue = estimatedWinValue(ctx, tiles) * Math.max(0, Number(options.scoreMultiplier) || 1);
  return {
    draws,
    winProbability,
    improveProbability,
    value: winProbability * winValue + improveProbability * winValue * 0.18,
  };
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
function fastBestAfterDraw(ctx, tiles, melded, options = {}) {
  let candidates = unique(tiles).sort((a, b) => a - b);
  if (tiles.includes(ctx.round.laizi) && tiles.some((card) => card !== ctx.round.laizi)) {
    candidates = candidates.filter((card) => card !== ctx.round.laizi);
  }
  const prepared = [];
  let minShanten = Infinity;
  for (const card of candidates) {
    const remaining = removeCopies(tiles, card, 1);
    if (!remaining) continue;
    const shanten = shapeShanten(ctx, remaining, melded);
    const quality = shapeQuality(remaining, ctx.round.jokerFor(ctx.seat));
    minShanten = Math.min(minShanten, shanten);
    prepared.push({ card, remaining, shanten, quality });
  }
  const sameShanten = prepared.filter((item) => item.shanten === minShanten)
    .sort((a, b) => b.quality - a.quality || a.card - b.card);
  if (!sameShanten.length) return null;
  // v1 保留旧算法：牌形评分最高的唯一弃牌再精算。
  if (Number(options.strategyVersion) === 1) {
    const best = sameShanten[0];
    return { ...best, analysis: analyze(ctx, best.remaining, melded) };
  }
  // v2 对牌形最好的三个同向听候选继续枚举活张，避免“看着整齐”
  // 但实际已经没有进张的牌形污染两步搜索。
  return sameShanten.slice(0, 3)
    .map((item) => ({ ...item, analysis: analyze(ctx, item.remaining, melded) }))
    .sort((a, b) => (
      b.analysis.score + b.analysis.expectedScore * 20
      - (a.analysis.score + a.analysis.expectedScore * 20)
    ) || b.quality - a.quality || a.card - b.card)[0];
}

/**
 * 两步摸打搜索：对每种可能摸牌按“估计在牌墙中的张数”加权，
 * 然后模拟这次摸牌后的最佳弃牌。搜索层内关闭继续展开，避免递归爆炸。
 */
function twoStepProjection(ctx, tiles, melded, options = {}) {
  const version = Number(options.strategyVersion) === 1 ? 1 : 2;
  const key = `${version}|${melded}|${tiles.slice().sort((a, b) => a - b).join(',')}`;
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
    const next = fastBestAfterDraw(nextCtx, afterDraw, melded, options);
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

/**
 * 前中盘的轻量多轮模拟。用分层分位点抽取未来 2~3 次本家摸牌，
 * 每条路径都走一次实际的摸后最佳弃牌；样本数固定，计算量不会随
 * 牌墙指数增长，也不会读取牌墙顺序或对手暗手。
 */
function multiRoundProjection(ctx, tiles, melded, options = {}) {
  const wall = Math.max(0, ctx.round.wall.remain());
  const requested = Number(options.simulationDepth);
  const rounds = clamp(Number.isFinite(requested) ? Math.floor(requested)
    : wall > ctx.round.n * 6 ? 3 : wall > ctx.round.n * 3 ? 2 : 1, 1, 3);
  if (rounds === 1) {
    const projection = twoStepProjection(ctx, tiles, melded, options);
    return { ...projection, rounds: 1, improveProbability: 0,
      expectedQuality: analyze(ctx, tiles, melded).quality };
  }
  const version = Number(options.strategyVersion) === 1 ? 1 : 2;
  const samples = rounds === 3 ? 8 : 10;
  const key = `multi|${version}|${rounds}|${melded}|${tiles.slice().sort((a, b) => a - b).join(',')}`;
  if (ctx.lookaheadCache.has(key)) return ctx.lookaheadCache.get(key);
  const initial = analyze(ctx, tiles, melded);
  let wins = 0;
  let improvements = 0;
  let expectedValue = 0;
  let expectedNextShanten = 0;
  let expectedQuality = 0;

  for (let sample = 0; sample < samples; sample++) {
    let branchCtx = ctx;
    let branchTiles = tiles.slice();
    let finalAnalysis = initial;
    let won = false;
    for (let depth = 0; depth < rounds; depth++) {
      const weighted = [];
      let totalWeight = 0;
      for (const card of branchCtx.types) {
        if ((branchCtx.remaining.get(card) || 0) <= 0) continue;
        const weight = estimatedWallCopies(branchCtx, card);
        if (weight <= 0) continue;
        totalWeight += weight;
        weighted.push({ card, weight });
      }
      if (!weighted.length || totalWeight <= 0) break;
      // 每层错开黄金分割步长，避免每条模拟路径总落在同一段牌值上。
      const quantile = (((sample + 0.5) / samples) + depth * 0.61803398875) % 1;
      let cursor = quantile * totalWeight;
      let drawn = weighted[weighted.length - 1].card;
      for (const item of weighted) {
        cursor -= item.weight;
        if (cursor <= 0) { drawn = item.card; break; }
      }
      const nextCtx = childContext(branchCtx, drawn);
      const afterDraw = branchTiles.concat(drawn);
      if (canSelfHu(nextCtx, afterDraw, melded)) {
        wins++;
        improvements++;
        expectedValue += estimatedWinValue(nextCtx, afterDraw);
        expectedNextShanten -= 1;
        expectedQuality += shapeQuality(afterDraw, nextCtx.round.jokerFor(nextCtx.seat));
        won = true;
        break;
      }
      const next = fastBestAfterDraw(nextCtx, afterDraw, melded, options);
      if (!next) break;
      branchCtx = nextCtx;
      branchTiles = next.remaining;
      finalAnalysis = next.analysis;
    }
    if (won) continue;
    if (finalAnalysis.shanten < initial.shanten) improvements++;
    expectedValue += finalAnalysis.expectedScore;
    expectedNextShanten += finalAnalysis.shanten;
    expectedQuality += finalAnalysis.quality;
  }
  const projection = {
    immediateWinProbability: wins / samples,
    winProbability: wins / samples,
    improveProbability: improvements / samples,
    expectedValue: expectedValue / samples,
    expectedNextShanten: expectedNextShanten / samples,
    expectedQuality: expectedQuality / samples,
    rounds,
    samples,
  };
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
  // 2334 里的两张 3 同时是对子和 234 的中张，还连着 23/34 两组搭子。
  // 如果打真正孤张与拆这种复合牌形的向听数相同，先排除拆复合牌形的方案。
  const overlapCards = centeredPairSequenceOverlapCards(tiles);
  const hasSameShantenIsolated = prepared.some(({ card, shanten }) => (
    shanten === minShanten && !overlapCards.has(card) && isIsolatedTile(ctx, tiles, card)
  ));
  const shapePrepared = hasSameShantenIsolated
    ? prepared.filter(({ card, shanten }) => shanten !== minShanten || !overlapCards.has(card))
    : prepared;
  let evaluated = shapePrepared
    .filter(({ shanten }) => shanten === minShanten)
    .map((item) => ({ ...item, analysis: analyze(ctx, item.remaining, melded) }));
  // 纯牌形的 0 向听可能是“多癞子不许胡”的假听。若最小候选全是假听，
  // 把原始 1 向听也纳入精算，避免它们被预筛选错过。
  if (minShanten === 0 && evaluated.every(({ analysis }) => analysis.shanten > 0)) {
    evaluated = evaluated.concat(shapePrepared
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
      preservedTripletPairs: adjacentTripletPairCount(item.remaining),
      pairSequenceOverlaps: pairSequenceOverlapCount(item.remaining),
      exhaustedSingle: countOf(tiles, item.card) === 1
        && publicOutsideCount(ctx, tiles, item.card) >= 3,
      breaksLockedStructure: !(looseCounts[item.card] > 0),
    }));
  const bestPreservedSets = sameShanten.reduce(
    (best, item) => Math.max(best, item.preservedSets), 0
  );
  const sameProtectedSets = sameShanten.filter((item) => item.preservedSets === bestPreservedSets);
  const hasLooseDiscard = sameProtectedSets.some((item) => !item.breaksLockedStructure);
  const bestLooseSequences = sameProtectedSets.reduce((best, item) => (
    item.breaksLockedStructure ? best : Math.max(best, item.preservedSequences)
  ), 0);
  const safestLooseClaimRisk = sameProtectedSets.reduce((best, item) => (
    item.breaksLockedStructure ? best
      : Math.min(best, publicClaimRisk(ctx, item.card).anyClaimProbability)
  ), Infinity);
  const bestLooseWinningOuts = sameProtectedSets.reduce((best, item) => (
    item.breaksLockedStructure ? best : Math.max(best, item.analysis.winningOuts)
  ), 0);
  const bestLooseExpectedWinningOuts = sameProtectedSets.reduce((best, item) => (
    item.breaksLockedStructure ? best : Math.max(best, item.analysis.expectedWinningOuts)
  ), 0);
  const sameLockedStructure = hasLooseDiscard
    ? sameProtectedSets.filter((item) => (
      !item.breaksLockedStructure
        || (item.preservedSequences >= bestLooseSequences
          && (publicClaimRisk(ctx, item.card).anyClaimProbability
              <= safestLooseClaimRisk - 0.05
            || (item.analysis.shanten === 0
              && (item.analysis.winningOuts > bestLooseWinningOuts
                || item.analysis.expectedWinningOuts
                  > bestLooseExpectedWinningOuts + 0.05))))
    )) : sameProtectedSets;
  // 5678 可以拆成 567+8，也可以拆成 5+678。固定从小到大拆顺子时，
  // 8 会被标成“游离张”，但打 5 同样保留一副完整顺子。只有非游离端点
  // 明显更不容易被碰/杠时才放回候选，避免干扰 1234 这类没有安全度差异的常规拆法。
  // 已经听牌时还有一个硬例外：12345 打 1 可胡 2/5，打 4 只胡 5。
  // 两者保留的完整面子相同，更宽的直接胡口不能被“锁定顺子”预筛选删掉。
  // 重复张拆开后若能多保留完整顺子，可以作为候选；但不能在
  // 牌效相同时拆掉现成刻子。例如 12233344 打 3 虽可留两副顺子，
  // 但打 1 同样听牌，且保留 333 的暗杠机会，应优先打 1。只有进张
  // 明显增加时，才允许这类顺子救援方案牺牲刻子。幺九刻子保留原有
  // 例外：像 45678999 只减一张边张 9 便可保留两副完整顺子。
  const baseExpectedOuts = sameLockedStructure.reduce(
    (best, item) => Math.max(best, item.analysis.expectedOuts), 0
  );
  const baseCompletedGroups = sameLockedStructure.reduce(
    (best, item) => Math.max(best, item.preservedSets + item.preservedSequences), 0
  );
  const baseSequences = sameLockedStructure.reduce(
    (best, item) => Math.max(best, item.preservedSequences), 0
  );
  const sequenceRescues = sameShanten.filter((item) => (
    !sameLockedStructure.includes(item)
      && countOf(tiles, item.card) >= 2
      && item.preservedSequences > baseSequences
      && item.preservedSets + item.preservedSequences >= baseCompletedGroups
      && item.analysis.expectedOuts >= baseExpectedOuts - 0.35
      && (item.preservedSets >= bestPreservedSets
        || (countOf(tiles, item.card) === 3
          && [1, 9].includes(item.card % 10))
        || item.analysis.expectedOuts >= baseExpectedOuts + 1.5)
  ));
  // 已经听牌时，完整顺子也不是绝对不能拆。典型牌形是碰掉 11 条后，
  // 剩 44 条 + 345678 筒：继续保留两副筒子顺子只能单听 4 条；打掉
  // 8 筒则把 34567 筒改成 2/5/8 三面听。只在少保留至多一副顺子、
  // 物理胡张至少翻倍且多 4 张时放开，避免一般牌形为小幅牌效拆成牌。
  const bestLockedWinningOuts = sameLockedStructure.reduce(
    (best, item) => Math.max(best, item.analysis.winningOuts), 0
  );
  const bestLockedExpectedWinningOuts = sameLockedStructure.reduce(
    (best, item) => Math.max(best, item.analysis.expectedWinningOuts), 0
  );
  const readyWaitRescues = sameProtectedSets
    .filter((item) => (
      !sameLockedStructure.includes(item)
        && item.analysis.shanten === 0
        && item.preservedSequences >= Math.max(0, baseSequences - 1)
        && item.analysis.winningOuts >= Math.max(
          bestLockedWinningOuts * 2, bestLockedWinningOuts + 4
        )
        && item.analysis.expectedWinningOuts
          >= bestLockedExpectedWinningOuts + 1.5
    ))
    .map((item) => ({ ...item, readyWaitRescue: true }));
  const structureCandidates = sameLockedStructure.concat(sequenceRescues)
    .concat(readyWaitRescues.filter((item) => (
      !sequenceRescues.some((other) => other.card === item.card)
    )));
  const bestPreservedSequences = structureCandidates.reduce(
    (best, item) => Math.max(best, item.preservedSequences), 0
  );
  const strategyVersion = Number(options.strategyVersion) === 1 ? 1 : 2;
  const profile = strategyProfile(ctx);
  const shortlisted = structureCandidates
    .filter((item) => item.preservedSequences === bestPreservedSequences
      || item.readyWaitRescue)
    .map((item) => ({ ...item,
      baseScore: strategyVersion === 1
        ? item.analysis.score + item.analysis.expectedScore * 20 - danger(ctx, item.card)
        : -item.analysis.shanten * 100000
          + item.analysis.expectedOuts * profile.outsWeight
          + item.analysis.route * 10
          + item.analysis.quality * profile.qualityWeight
          + item.analysis.expectedScore * profile.stateValueWeight
          + isolatedDiscardBonus(ctx, tiles, item.card, item.analysis.shanten)
          - danger(ctx, item.card) }))
    .sort((a, b) => b.baseScore - a.baseScore);
  // 前中盘给四张最优候选做固定样本的多轮模拟；残局回到精确的一轮
  // 展开。固定上限保证真人托管时不会因搜索深度阻塞服务端事件循环。
  const wall = Math.max(0, ctx.round.wall.remain());
  const lookaheadLimit = strategyVersion === 1 ? 4
    : wall <= ctx.round.n * 3 ? 3 : 4;
  const ranked = shortlisted.map((item, index) => {
    const projection = options.lookahead === false || index >= lookaheadLimit
      ? { immediateWinProbability: 0, expectedValue: 0, expectedNextShanten: item.analysis.shanten }
      : strategyVersion === 1
        ? twoStepProjection(ctx, item.remaining, melded, options)
        : multiRoundProjection(ctx, item.remaining, melded, options);
    const horizon = strategyVersion === 1
      ? { draws: 1, winProbability: 0, improveProbability: 0, value: 0 }
      : strategicHandValue(ctx, item.remaining, item.analysis);
    const claimRisk = strategyVersion === 1
      ? { anyClaimProbability: 0, gangProbability: 0, expectedGangLoss: 0 }
      : publicClaimRisk(ctx, item.card);
    const urgency = wall <= ctx.round.n * 4 ? 1.45 : wall <= ctx.round.n * 8 ? 1.2 : 1;
    const strategicScore = strategyVersion === 1 ? 0
      : horizon.winProbability * profile.horizonWinWeight * urgency
        + horizon.improveProbability * profile.horizonImproveWeight
        + (projection.winProbability || projection.immediateWinProbability || 0)
          * profile.projectionWinWeight
        + (projection.improveProbability || 0) * profile.projectionImproveWeight
        - claimRisk.anyClaimProbability * profile.claimWeight
          * profile.riskMultiplier * urgency
        - claimRisk.expectedGangLoss * profile.gangLossWeight
          * profile.riskMultiplier;
    const score = item.baseScore + (strategyVersion === 1
      ? projection.expectedValue * 25 + projection.immediateWinProbability * 10000
      : projection.expectedValue * profile.projectionValueWeight
        - projection.expectedNextShanten * profile.projectionShantenWeight
        + projection.immediateWinProbability * profile.projectionWinWeight
        + strategicScore);
    return { ...item, projection, horizon, claimRisk, strategy: profile,
      strategicScore, score };
  }).sort((a, b) => {
    // 当前向听、进张和已成结构完全一样时，优先保留 6678 这类
    // “对子+顺子”复合牌形。多轮投影只抽 8 个固定样本，其小幅
    // 采样波动不应该把复合牌形拆掉。
    const sameCurrentPlan = a.analysis.shanten === b.analysis.shanten
      && Math.abs(a.analysis.expectedOuts - b.analysis.expectedOuts) <= 0.05
      && Math.abs(a.analysis.expectedWinningOuts - b.analysis.expectedWinningOuts) <= 0.05
      && a.preservedSets === b.preservedSets
      && a.preservedSequences === b.preservedSequences;
    // 677788 打 6 后是 777+88，打 8 后的 67778 只能在
    // 777 刻子和 678 顺子之间二选一。向听、胡口及已成面子相同时，
    // 真实留下的对子优先于公开牌风险和多轮采样的小幅波动。
    if (sameCurrentPlan && a.preservedTripletPairs !== b.preservedTripletPairs) {
      return b.preservedTripletPairs - a.preservedTripletPairs;
    }
    // 本家只剩一张、另外三张已经全部公开的牌，不可能再成对、碰或杠。
    // 2345 两端都能保留一副顺子时，若 2 已被别人碰出三张，就应先打
    // 最后一张 2，不能为了短期采样分数去打仍可能被碰的 5。
    if (sameCurrentPlan && a.exhaustedSingle !== b.exhaustedSingle) {
      return Number(b.exhaustedSingle) - Number(a.exhaustedSingle);
    }
    if (sameCurrentPlan && a.pairSequenceOverlaps !== b.pairSequenceOverlaps) {
      const aPreservesByDiscardingIsolated = a.pairSequenceOverlaps > b.pairSequenceOverlaps
        && isIsolatedTile(ctx, tiles, a.card);
      const bPreservesByDiscardingIsolated = b.pairSequenceOverlaps > a.pairSequenceOverlaps
        && isIsolatedTile(ctx, tiles, b.card);
      if (aPreservesByDiscardingIsolated !== bPreservesByDiscardingIsolated) {
        return Number(bPreservesByDiscardingIsolated) - Number(aPreservesByDiscardingIsolated);
      }
    }
    // 即时向听、进张、风险和下一向听都基本相同时，两步估值的
    // 小幅波动不应压过当前牌形。例如 6779 打 9 留 677，比打 6
    // 留 779 更连贯；两者全手即时进张相同时仍应优先前者。
    const projectionScale = Math.max(1,
      Math.abs(a.projection.expectedValue), Math.abs(b.projection.expectedValue));
    const equivalentPlan = a.analysis.shanten === b.analysis.shanten
      && Math.abs(a.analysis.expectedOuts - b.analysis.expectedOuts) <= 0.05
      && Math.abs(a.analysis.expectedWinningOuts - b.analysis.expectedWinningOuts) <= 0.05
      && a.preservedSets === b.preservedSets
      && a.preservedSequences === b.preservedSequences
      && Math.abs(a.claimRisk.anyClaimProbability - b.claimRisk.anyClaimProbability) <= 0.02
      && Math.abs(a.claimRisk.expectedGangLoss - b.claimRisk.expectedGangLoss) <= 0.5
      && Math.abs(a.projection.immediateWinProbability
        - b.projection.immediateWinProbability) <= 0.005
      && Math.abs(a.projection.expectedNextShanten
        - b.projection.expectedNextShanten) <= 0.02
      && Math.abs(a.projection.expectedValue - b.projection.expectedValue)
        / projectionScale <= 0.05;
    if (equivalentPlan && Math.abs(a.analysis.quality - b.analysis.quality) > 1e-9) {
      return b.analysis.quality - a.analysis.quality;
    }
    return b.score - a.score
      || Number(b.card === ctx.round.drawn[ctx.seat]) - Number(a.card === ctx.round.drawn[ctx.seat])
      || a.card - b.card;
  });

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
      [value(left.claimRisk.anyClaimProbability), value(right.claimRisk.anyClaimProbability), -1],
      [value(left.claimRisk.expectedGangLoss), value(right.claimRisk.expectedGangLoss), -1],
    ];
    const noWorse = comparisons.every(([a, b, direction]) => direction * (a - b) >= -1e-9);
    const strictlyBetter = comparisons.some(([a, b, direction]) => direction * (a - b) > 1e-9);
    return noWorse && strictlyBetter;
  };
  const structureDominates = (left, right) => (
    left.analysis.shanten === right.analysis.shanten
      && Math.abs(left.analysis.expectedOuts - right.analysis.expectedOuts) <= 0.05
      && Math.abs(left.analysis.expectedWinningOuts
        - right.analysis.expectedWinningOuts) <= 0.05
      && left.preservedSets === right.preservedSets
      && left.preservedSequences === right.preservedSequences
      && left.preservedTripletPairs > right.preservedTripletPairs
  );
  const exhaustedSingleDominates = (left, right) => (
    left.exhaustedSingle && !right.exhaustedSingle
      && left.analysis.shanten === right.analysis.shanten
      && Math.abs(left.analysis.expectedOuts - right.analysis.expectedOuts) <= 0.05
      && Math.abs(left.analysis.expectedWinningOuts
        - right.analysis.expectedWinningOuts) <= 0.05
      && left.preservedSets === right.preservedSets
      && left.preservedSequences === right.preservedSequences
  );
  return ranked.filter((candidate) => !ranked.some((other) => (
    other !== candidate && (structureDominates(other, candidate)
      || exhaustedSingleDominates(other, candidate)
      || dominates(other, candidate))
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
  let opponentPointGangs = 0;
  let opponentConcealedGangs = 0;
  for (const gang of round.gangs || []) {
    const payments = round.gangPayments(gang);
    if (gang.seat === ctx.seat) {
      ownGangs++;
      credit += payments.reduce((sum, payment) => sum + payment.amount, 0);
      continue;
    }
    if (gang.type === 'ming') opponentPointGangs++;
    else opponentConcealedGangs++;
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
    opponentPointGangs,
    opponentConcealedGangs,
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
function shuaiDecision(ctx, tiles, melded, options = {}) {
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
  // 土豪必杠最多只能带一张癞子胡。每甩一张都必须从牌墙补一张，
  // 因此剩余牌数少于“当前癞子数 - 1”时，已经不可能在流局前把
  // 多余癞子全部甩完。此时继续甩只会翻倍已有杠债，不能创造胡牌机会。
  const minimumThrowsToWin = Math.max(0, laiziCount - 1);
  const ledger = gangLedger(ctx);
  // 只有一笔点杠时按原牌效继续甩癞；本家后续取得暗杠/回头笑
  // 使净杠账转正后，每甩一张都会同比放大已锁定的正收益，应立即
  // 退回可胡所需的一张癞子，不再被旧的“多癞弃胡”状态锁住。
  const ignoreSinglePointGangRisk = ledger.opponentPointGangs === 1
    && ledger.opponentConcealedGangs === 0;
  const positiveOwnGangLedger = ledger.ownGangs > 0 && ledger.net > 0;
  const shouldChainThrow = minimumThrowsToWin > 0
    && (ignoreSinglePointGangRisk || positiveOwnGangLedger);
  // 最多只能带一张癞子胡。手里三张及以上时至少要连续甩两张，期间
  // 每张都会把已有杠账再翻倍；这种路线直接弃掉，连第一张也不甩。
  if (minimumThrowsToWin >= 2 && !shouldChainThrow) {
    return { should: false, reason: '至少要甩两张才能听牌', laiziCount, wall,
      minimumThrowsToWin, ledger };
  }
  if (wall < minimumThrowsToWin) {
    return { should: false, reason: '牌堆不足以甩完多余癞子', laiziCount, wall,
      minimumThrowsToWin, ledger };
  }
  if (shouldChainThrow) {
    return {
      should: true,
      reason: positiveOwnGangLedger ? '自己的杠账转正' : '单次点杠不限制甩癞',
      laiziCount,
      wall,
      minimumThrowsToWin,
      ledger,
    };
  }
  if (laiziCount === 2 && gangHuntMode(ctx, tiles)) {
    return { should: false, reason: '对手暗杠后双癞未成顺暂时弃胡', laiziCount, wall,
      minimumThrowsToWin };
  }
  if (nonLaizi.length === 0) return { should: true, reason: '手上只剩癞子' };

  const throwTiles = removeCopies(tiles, round.laizi, 1);
  const throwAnalysis = analyze(ctx, throwTiles, melded);
  const keep = rankDiscardCandidates(ctx, tiles, melded, nonLaizi,
    { ...options, lookahead: false });
  if (!keep) return { should: true, reason: '没有普通弃牌', throwAnalysis };

  // 听牌是硬约束：确定的杠账翻倍、第四癞喜钱和补摸期望都不能拆掉现有听口。
  // 只比较合法胡口，避免将多癞不能胡的假听误认为需要保护的听牌。
  if (keep.analysis.shanten === 0 && keep.analysis.winningOuts > 0
    && !(throwAnalysis.shanten === 0 && throwAnalysis.winningOuts > 0)) {
    return { should: false, reason: '保留听牌不甩癞', throwAnalysis, keep: keep.analysis };
  }
  // 第四癞会立即获得确定性喜钱，默认档远高于一次普通黑摸。
  if ((round.shuai[ctx.seat] || []).length === 3 && round.config.喜钱 > 0) {
    return { should: true, reason: '第四癞喜钱' };
  }
  const strategyVersion = Number(options.strategyVersion) === 1 ? 1 : 2;
  // 甩癞后立即多摸一张，且之后的胡/杠收支再翻倍。旧策略只比较
  // 向听和活张，v2 把这两条真实结算规则一起纳入预期收益。
  const throwHorizon = strategicHandValue(ctx, throwTiles, throwAnalysis,
    { extraDraws: 1, scoreMultiplier: 2 });
  const keepHorizon = strategicHandValue(ctx, keep.remaining, keep.analysis);

  // 牌桌上只有一次点杠时，不因为这一笔已经发生的明杠压低甩赖意愿。
  // 如果是本家点出的，也只忽略该笔负债；本家自己的正杠账仍可计入。
  const effectiveGangNet = ignoreSinglePointGangRisk ? ledger.credit : ledger.net;
  const gangCredit = clamp(6 * effectiveGangNet / ledger.blackGross, -6, 6);
  // 别人点给别人的明杠不会立即让本家付分，但它代表对手已经
  // 锁定了收益且牌形加快。只做轻微的风险扣分，不把间接杠当成本家负债。
  const opponentGangPressure = ignoreSinglePointGangRisk
    ? 0 : Math.min(2, ledger.unrelatedOpponentGangs);
  const tempo = wall < round.n ? 4
    : wall <= 2 * round.n ? 3
      : wall <= 4 * round.n ? 2 : 1;
  const winNow = throwAnalysis.winningOuts > 0 ? 2 : 0;
  const adjustedOuts = throwAnalysis.outs + tempo + winNow + gangCredit
    - opponentGangPressure;
  // 保留单癞时，再摸一张癞子虽不是合法胡口，但可以甩掉后免费重抽，
  // 因此按四分之一张有效进张作为平局修正，避免系统性高估早甩。
  const keepAdjustedOuts = keep.analysis.outs + keep.analysis.redrawOuts * 0.25;
  const throwSequences = protectedSequenceCount(ctx, throwTiles);
  const keepSequences = protectedSequenceCount(ctx, keep.remaining);
  const severeDebt = !ignoreSinglePointGangRisk
    && ledger.net <= -ledger.blackGross / 2;
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
    // 翻倍收益不能越过向听数硬甩癞；否则会把 456/789
    // 这种已成的顺子拆掉。退向听只允许己方已有确定杠账或末圈。
    should = creditBackstep || lastChance;
    reason = creditBackstep ? '自己的杠账占优'
      : lastChance ? '末圈立即补摸' : '甩癞会退向听';
  } else {
    const valueAdvantage = strategyVersion >= 2 && opponentGangPressure === 0
      && throwAnalysis.outs >= Math.max(1, keepAdjustedOuts - 2)
      && throwHorizon.value >= keepHorizon.value * 1.08;
    should = adjustedOuts >= requiredOuts || valueAdvantage;
    reason = valueAdvantage ? '即时补摸与翻倍收益' : '同向听比较进张';
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
  } else if (ledger.opponentConcealedGangs > 0) {
    // 对方已有暗杠/回头笑时，只有甩掉当前癞子后仍然立即听牌才继续。
    // 未听牌先保留，等牌形进入听牌再甩，避免徒增杠账翻倍风险。
    should = liveThrow;
    reason = liveThrow ? '对手暗杠后听牌甩癞' : '对手暗杠后未听牌先保癞';
  } else if (keepSequences > throwSequences
    && throwAnalysis.shanten >= keep.analysis.shanten
    && !strongCredit && wall >= round.n) {
    should = false;
    reason = '保留癞子组成的完整顺子';
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
    ignoreSinglePointGangRisk,
    throwSequences,
    keepSequences,
    throwHorizon,
    keepHorizon,
    ledger,
  };
}

function rankedDiscardsFrom(ctx, tiles, melded, options = {}) {
  const round = ctx.round;
  const hasLaizi = tiles.includes(round.laizi);
  if (hasLaizi && round.config.玩法 === '土豪必杠') {
    const decision = options.shuaiMode === 'eager'
      ? { should: round.wall.remain() > 0, reason: '基线立即甩癞' }
      : shuaiDecision(ctx, tiles, melded, options);
    if (decision.should) {
      const rest = removeCopies(tiles, round.laizi, 1);
      return [{
        card: round.laizi,
        analysis: analyze(ctx, rest, melded),
        score: Infinity,
        shuai: decision,
        projection: options.lookahead === false
          ? { immediateWinProbability: 0, expectedValue: 0, expectedNextShanten: 0 }
          : twoStepProjection(ctx, rest, melded, options),
      }];
    }
  }

  let candidates = unique(tiles).sort((a, b) => a - b);
  // 癞子一旦打出就是“甩癞”而非普通弃牌；动态决策选择保留时，
  // 必须从普通弃牌候选里排除它。牌墙空时也可避免非法重试导致卡局。
  if (hasLaizi && tiles.some((card) => card !== round.laizi)) {
    candidates = candidates.filter((card) => card !== round.laizi);
  }
  // 两张朝天既能接别人弃牌直接碰/朝天，也能再摸一张形成等同自摸收益的
  // 朝天暗杠。它同时嵌在 1223 里的 123 顺子时，普通向听模型容易把其中
  // 一张 2 当作可拆重复张。只要还有别的合法弃牌，就不把朝天对子交给
  // 本地评分或 Jev 选择；这样孤张 9 必定先于朝天对子清理。
  if (countOf(tiles, round.pizi) === 2
    && candidates.some((card) => card !== round.pizi)) {
    candidates = candidates.filter((card) => card !== round.pizi);
  }
  // 朝天、癞子和对子组成的复合顺子需要单独保护。66788 中 6 是朝天、
  // 7 是癞子时，普通向听会把 88 错当成冗余对子；只要还有真正孤张，
  // 就不允许本地评分或 Jev 为追求虚假的即时进张拆掉这副结构。
  const specialSequencePairs = piziLaiziSequencePairCards(ctx, tiles);
  if (specialSequencePairs.size) {
    const isolatedCandidates = candidates.filter((card) => !specialSequencePairs.has(card)
      && isIsolatedTile(ctx, tiles, card));
    if (isolatedCandidates.length) candidates = isolatedCandidates;
  }
  // 手上保留两张及以上癞子时，普通向听模型会因“多癞不能胡”
  // 出现假听，并严重低估 579 这类双嵌张链。只要 5/9 端点还能打，
  // 就不把同时连着 57 和 79 的中间 7 交给本地评分或 Jev 拆掉。
  if (countOf(tiles, round.laizi) >= 2) {
    const doubleGapMiddles = doubleGapMiddleCards(tiles, candidates);
    if (doubleGapMiddles.size) {
      const otherCandidates = candidates.filter((card) => !doubleGapMiddles.has(card));
      if (otherCandidates.length) candidates = otherCandidates;
    }
  }
  // 多癞且对手已有暗杠时，胡牌路线已经放弃。优先保留没有在外面
  // 露过的对子/坎子，争取摸暗杠或先碰再摸回头杠；已露过的同牌
  // 不再享受这项保护。只有没有其他牌可打时才允许拆这些基础组合。
  const gangFoundations = liveGangFoundationCards(ctx, tiles);
  if (gangFoundations.size) {
    const otherCandidates = candidates.filter((card) => !gangFoundations.has(card));
    if (otherCandidates.length) candidates = otherCandidates;
  }
  const ranked = evaluateDiscardCandidates(ctx, tiles, melded, candidates, options);
  const best = ranked[0];

  // 向听数默认仍是第一优先级，但前中盘不能为了保住一组只剩
  // 0~1 张的死嵌张，反而拆掉已成的对子。只在当前至少二向听、
  // 拆嵌张虽退一档但立即改良面超过两倍时放行，避免影响听牌和残局。
  if (best && best.analysis.shanten >= 2
    && countOf(tiles, best.card) === 2
    && round.wall.remain() >= round.n * 6) {
    const gapCards = staleGapBreakCards(ctx, tiles, candidates);
    const gapRanked = gapCards.length
      ? evaluateDiscardCandidates(ctx, tiles, melded, gapCards, options) : [];
    const escape = gapRanked[0];
    if (escape
      && escape.analysis.shanten === best.analysis.shanten + 1
      && escape.preservedSets >= best.preservedSets
      && escape.preservedSequences >= best.preservedSequences
      && escape.analysis.expectedOuts >= Math.max(
        best.analysis.expectedOuts * 2, best.analysis.expectedOuts + 8
      )) {
      return [{ ...escape, staleGapEscape: true },
        ...ranked.filter((item) => item.card !== escape.card)];
    }
  }
  return ranked;
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
  // 1223 遇到别人打 2 时，规则上虽然允许碰，但两张 2 里有一张已经
  // 属于 123 这副成牌。碰掉后只剩 13，会把完整顺子拆坏。成牌保护是
  // 硬约束，不能再让后面的向听/收益估值用短期副露收益覆盖掉。
  if (protectedSequenceCount(ctx, afterTake) < protectedSequenceCount(ctx, tiles)) return false;
  const best = bestDiscardFrom(ctx, afterTake, melded + 1, options);
  if (!best) return false;
  if (best.analysis.shanten < before.shanten) return true;
  if (best.analysis.shanten > before.shanten) return false;
  if (Number(options.strategyVersion) === 1) {
    return best.analysis.outs >= before.outs + 2 && best.analysis.score > before.score;
  }
  // 同向听时不再只看物理进张数：比较牌墙摸完前的成牌概率，
  // 同时要求碰后活张不明显变窄，避免为了一组副露把宽搭碰死。
  const beforeHorizon = strategicHandValue(ctx, tiles, before);
  const afterHorizon = strategicHandValue(ctx, best.remaining, best.analysis);
  const expectedOutFloor = before.expectedOuts - (ctx.round.wall.remain() <= ctx.round.n * 3 ? 0.25 : 0.75);
  const probabilityGain = afterHorizon.winProbability - beforeHorizon.winProbability;
  const valueGain = afterHorizon.value - beforeHorizon.value;
  return best.analysis.expectedOuts >= expectedOutFloor
    && best.analysis.score >= before.score
    && (probabilityGain >= -0.01 && valueGain >= -0.05);
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

/**
 * 暗杠（含三张皮子的朝天笑）已经成型且有确定杠分，不交给牌效模型放弃。
 * 补杠可能被抢杠，仍由后面的策略判断决定。
 */
function forcedSelfGang(round, seat, cards = []) {
  const tiles = round.looseTiles(seat);
  return cards.find((card) => {
    const isBu = round.melds[seat].some((meld) => meld.type === 'peng' && meld.card === card);
    if (isBu) return false;
    return countOf(tiles, card) >= (card === round.pizi ? 3 : 4);
  });
}

function chooseSelfGang(ctx, cards, options = {}) {
  const round = ctx.round;
  const tiles = round.looseTiles(ctx.seat);
  const melded = round.melds[ctx.seat].length;
  const forcedGang = forcedSelfGang(round, ctx.seat, cards);
  if (forcedGang != null) return forcedGang;
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
  if (candidate.ops.peng && shouldChaseGangPeng(ctx, pending.card)) return { op: 'peng' };
  if (candidate.ops.peng && shouldPeng(ctx, pending.card, options)) return { op: 'peng' };
  return { op: 'pass' };
}

/** 给 Jev 决策入口复用同一条“碰牌不能拆完整顺子”的硬约束。 */
function pengBreaksCompletedSequence(round, seat, card) {
  const ctx = context(round, seat);
  const tiles = round.hands[seat].slice();
  const afterTake = removeCopies(tiles, card, 2);
  return !!afterTake
    && protectedSequenceCount(ctx, afterTake) < protectedSequenceCount(ctx, tiles);
}

module.exports = {
  chooseDiscard,
  rankDiscardOptions,
  chooseSelfAction,
  chooseDiscardResponse,
  forcedSelfGang,
  noteDiscardWaitInference,
  pengBreaksCompletedSequence,
  mustChaseGangPeng,
  // 单测和离线对局基准使用的纯分析入口。
  _test: {
    context, analyze, shapeShanten, bestDiscardFrom, rankDiscardCandidates, visibleCounts,
    evaluateDiscardCandidates, twoStepProjection, multiRoundProjection,
    estimatedWallCopies, expectedStateValue,
    gangHuntMode, laiziFormsNaturalSequence, liveGangFoundationCards,
    publicOutsideCount, shouldChaseGangPeng,
    remainingDrawsForSeat, horizonProbability, holdingProbability, publicClaimRisk,
    strategicHandValue, shouldPeng, shouldMingGang, shuaiDecision, gangLedger,
    protectedShapeCount, protectedSequenceCount, pairSequenceOverlapCount,
    doubleGapMiddleCards, looseStructureCounts,
    matchStrategy, opponentLaiziPressure, strategyProfile,
  },
};
