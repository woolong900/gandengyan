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

function visibleCounts(round, seat) {
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

function context(round, seat) {
  const visible = visibleCounts(round, seat);
  const types = tileTypes(round);
  const remaining = new Map(types.map((card) => [card, Math.max(0, 4 - (visible.get(card) || 0))]));
  return { round, seat, types, remaining, shapeCache: new Map(), analysisCache: new Map() };
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

function sevenPairsShanten(tiles, joker, melded, fullMelds) {
  if (melded || fullMelds !== 4) return 99;
  const counts = new Map();
  let jokers = 0;
  for (const tile of tiles) {
    if (joker >= 0 && tile === joker) jokers++;
    else counts.set(tile, (counts.get(tile) || 0) + 1);
  }
  const pairs = [...counts.values()].reduce((sum, count) => sum + Math.floor(count / 2), 0);
  const distinct = counts.size;
  return Math.max(-1, 6 - pairs + Math.max(0, 7 - distinct) - jokers);
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
  let value = Math.min(
    standardShanten(sorted, joker, melded, round.fullMelds),
    sevenPairsShanten(sorted, joker, melded, round.fullMelds)
  );
  const postDiscardSize = Math.max(0, round.fullMelds - melded) * 3 + 1;
  if (sorted.length === postDiscardSize) value = Math.max(0, value);
  ctx.shapeCache.set(key, value);
  if (SHAPE_CACHE.size >= SHAPE_CACHE_LIMIT) SHAPE_CACHE.clear();
  SHAPE_CACHE.set(key, value);
  return value;
}

function canSelfHu(ctx, tiles, melded) {
  const round = ctx.round;
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

function routeBonus(ctx, tiles) {
  const round = ctx.round;
  let bonus = 0;
  if (round.config.清一色) {
    const meldSuits = unique(round.melds[ctx.seat].map((meld) => suitOf(meld.card)));
    // 已有副露后清一色花色就被锁定；两种副露花色则已经不可能完成。
    if (meldSuits.length <= 1) {
      const suitCounts = new Map();
      for (const tile of tiles) suitCounts.set(suitOf(tile), (suitCounts.get(suitOf(tile)) || 0) + 1);
      const targetSuit = meldSuits.length
        ? meldSuits[0]
        : [...suitCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      const meldTileCount = round.melds[ctx.seat].length * 3;
      const matching = (suitCounts.get(targetSuit) || 0) + meldTileCount;
      const total = tiles.length + meldTileCount;
      bonus += matching * 0.7 - (total - matching) * 0.5;
    }
  }
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

function analyze(ctx, tiles, melded) {
  const sorted = tiles.slice().sort((a, b) => a - b);
  const key = `${melded}|${sorted.join(',')}`;
  if (ctx.analysisCache.has(key)) return ctx.analysisCache.get(key);
  const rawShanten = shapeShanten(ctx, sorted, melded);
  let shanten = rawShanten;
  let winningOuts = 0;
  const waits = [];
  for (const card of ctx.types) {
    const left = ctx.remaining.get(card) || 0;
    if (left && canSelfHu(ctx, sorted.concat(card), melded)) {
      winningOuts += left;
      waits.push({ card, count: left });
    }
  }
  if (winningOuts > 0) shanten = 0;
  // 土豪必杠手里多于一张癞子时不能胡。纯牌形向听可能仍给出 0，
  // 但没有任何合法胡口，决策时必须把它视作至少一向听。
  const deadWait = rawShanten === 0 && winningOuts === 0;
  if (deadWait) shanten = 1;
  let effectiveOuts = winningOuts;
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
      if (shapeShanten(ctx, sorted.concat(card), melded) < shanten) effectiveOuts += left;
    }
  }
  const quality = shapeQuality(sorted, ctx.round.jokerFor(ctx.seat));
  const route = routeBonus(ctx, sorted);
  const result = {
    shanten,
    rawShanten,
    deadWait,
    sevenPairs: sevenPairsShanten(sorted, ctx.round.jokerFor(ctx.seat), melded, ctx.round.fullMelds),
    outs: effectiveOuts,
    winningOuts,
    waits,
    redrawOuts,
    quality,
    route,
    score: -shanten * 100000 + effectiveOuts * 1000 + route * 10 + quality,
  };
  ctx.analysisCache.set(key, result);
  return result;
}

function rankDiscardCandidates(ctx, tiles, melded, candidates) {
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
  let best = null;
  for (const { card, analysis } of evaluated) {
    if (analysis.shanten !== bestShanten) continue;
    const score = analysis.score - danger(ctx, card);
    if (!best || score > best.score
      || (score === best.score && card === ctx.round.drawn[ctx.seat])) {
      best = { card, analysis, score };
    }
  }
  return best;
}

/** 已经发生的公开杠账。再甩一张癞子时，这些涉及本座的收支会恰好再翻一倍。 */
function gangLedger(ctx) {
  const round = ctx.round;
  let credit = 0;
  let liability = 0;
  let ownGangs = 0;
  let unrelatedOpponentGangs = 0;
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
  };
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
    return { should: nonLaizi.length === 0, reason: '牌墙已空' };
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
  const keep = rankDiscardCandidates(ctx, tiles, melded, nonLaizi);
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
  if (severeDebt && wall >= round.n
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

function bestDiscardFrom(ctx, tiles, melded, options = {}) {
  const round = ctx.round;
  const hasLaizi = tiles.includes(round.laizi);
  if (hasLaizi && round.config.玩法 === '土豪必杠') {
    const decision = options.shuaiMode === 'eager'
      ? { should: round.wall.remain() > 0, reason: '基线立即甩癞' }
      : shuaiDecision(ctx, tiles, melded);
    if (decision.should) {
      const rest = removeCopies(tiles, round.laizi, 1);
      return {
        card: round.laizi,
        analysis: analyze(ctx, rest, melded),
        score: Infinity,
        shuai: decision,
      };
    }
  }

  let candidates = unique(tiles).sort((a, b) => a - b);
  // 癞子一旦打出就是“甩癞”而非普通弃牌；动态决策选择保留时，
  // 必须从普通弃牌候选里排除它。牌墙空时也可避免非法重试导致卡局。
  if (hasLaizi && tiles.some((card) => card !== round.laizi)) {
    candidates = candidates.filter((card) => card !== round.laizi);
  }
  return rankDiscardCandidates(ctx, tiles, melded, candidates);
}

function chooseDiscard(round, seat, options = {}) {
  const ctx = context(round, seat);
  const best = bestDiscardFrom(ctx, round.looseTiles(seat), round.melds[seat].length, options);
  return best ? best.card : null;
}

function shouldPeng(ctx, card, options = {}) {
  const round = ctx.round;
  const tiles = round.hands[ctx.seat].slice();
  const melded = round.melds[ctx.seat].length;
  const before = analyze(ctx, tiles, melded);
  // 七对已经一向听时，碰会直接毁掉七对路线。
  if (!melded && before.sevenPairs <= 1) return false;
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
  return !!after && after.shanten <= before.shanten;
}

function chooseSelfGang(ctx, cards, options = {}) {
  const round = ctx.round;
  const tiles = round.looseTiles(ctx.seat);
  const melded = round.melds[ctx.seat].length;
  const baseline = bestDiscardFrom(ctx, tiles, melded, options)?.analysis || analyze(ctx, tiles, melded);
  let best = null;
  for (const card of cards) {
    const isBu = round.melds[ctx.seat].some((meld) => meld.type === 'peng' && meld.card === card);
    const isPizi = !isBu && card === round.pizi;
    if (isPizi && round.config.双大胡 && countOf(tiles, card) >= 3 && baseline.shanten <= 1) continue;
    const take = isBu ? 1 : isPizi ? 3 : 4;
    const rest = removeCopies(tiles, card, take);
    if (!rest) continue;
    const nextMelded = melded + (isBu ? 0 : 1);
    const after = isPizi
      ? bestDiscardFrom(ctx, rest, nextMelded, options)?.analysis
      : analyze(ctx, rest, nextMelded);
    if (!after || after.shanten > baseline.shanten) continue;
    const score = after.score + (isBu ? 30 : 50);
    if (!best || score > best.score) best = { card, score };
  }
  return best && best.card;
}

function chooseSelfAction(round, seat, pending, options = {}) {
  if (pending.hu) return { op: 'hu' };
  // 先报再杠，避免补进异色牌后丧失清一色申报资格。
  if (pending.qys) return { op: 'qys' };
  if (pending.gang && pending.gang.length) {
    const card = chooseSelfGang(context(round, seat), pending.gang, options);
    if (card != null) return { op: 'gang', data: { card } };
  }
  return { op: 'pass' };
}

function chooseDiscardResponse(round, seat, pending, candidate, options = {}) {
  if (candidate.ops.hu) return { op: 'hu' };
  const ctx = context(round, seat);
  if (candidate.ops.gang && shouldMingGang(ctx, pending.card, options)) {
    return { op: 'gang', data: { card: pending.card } };
  }
  if (candidate.ops.peng && shouldPeng(ctx, pending.card, options)) return { op: 'peng' };
  return { op: 'pass' };
}

module.exports = {
  chooseDiscard,
  chooseSelfAction,
  chooseDiscardResponse,
  // 单测和离线对局基准使用的纯分析入口。
  _test: {
    context, analyze, shapeShanten, bestDiscardFrom, rankDiscardCandidates,
    shouldPeng, shouldMingGang, shuaiDecision, gangLedger,
  },
};
