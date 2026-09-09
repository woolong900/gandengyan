/**
 * 手牌分析：胡牌判定、听牌计算、以及给 AI 用的向听数估算。
 *
 * 胡牌牌型为标准型：4 副面子（刻子或顺子）+ 1 对将。
 * 已经碰/杠出去的面子各算 1 副（杠占 4 张牌但仍算 1 副面子）。
 */

import { Counts, KIND_COUNT, Kind, RANK_COUNT, emptyCounts, rankOf, totalOf } from './tiles';

/** 面子能否用完全部牌拼成 needMelds 副 */
function decompose(counts: Counts, needMelds: number): boolean {
  if (needMelds === 0) return totalOf(counts) === 0;

  let k = -1;
  for (let i = 0; i < KIND_COUNT; i++) {
    if (counts[i] > 0) {
      k = i;
      break;
    }
  }
  if (k < 0) return false;

  // 刻子
  if (counts[k] >= 3) {
    counts[k] -= 3;
    const ok = decompose(counts, needMelds - 1);
    counts[k] += 3;
    if (ok) return true;
  }

  // 顺子（同花色内，点数不跨花色边界）
  if (rankOf(k) <= RANK_COUNT - 2 && counts[k + 1] > 0 && counts[k + 2] > 0) {
    counts[k]--;
    counts[k + 1]--;
    counts[k + 2]--;
    const ok = decompose(counts, needMelds - 1);
    counts[k]++;
    counts[k + 1]++;
    counts[k + 2]++;
    if (ok) return true;
  }

  return false;
}

/**
 * 判断暗牌（含刚摸到的那张）能否与已成面子组成胡牌。
 * @param counts       暗牌计数表
 * @param exposedMelds 已碰/杠的面子数
 */
export function isWinningHand(counts: Counts, exposedMelds: number): boolean {
  const needMelds = 4 - exposedMelds;
  if (needMelds < 0) return false;
  if (totalOf(counts) !== needMelds * 3 + 2) return false;

  const work = counts.slice();
  for (let p = 0; p < KIND_COUNT; p++) {
    if (work[p] < 2) continue;
    work[p] -= 2;
    const ok = decompose(work, needMelds);
    work[p] += 2;
    if (ok) return true;
  }
  return false;
}

/** 列出所有能让当前 (3n+1) 张暗牌胡的牌面，即听的牌 */
export function winningTiles(counts: Counts, exposedMelds: number): Kind[] {
  const out: Kind[] = [];
  const work = counts.slice();
  for (let k = 0; k < KIND_COUNT; k++) {
    work[k]++;
    if (isWinningHand(work, exposedMelds)) out.push(k);
    work[k]--;
  }
  return out;
}

/**
 * 单个花色的拆解结果：(面子数, 搭子数, 是否含一对可作将)。
 * 顺子不跨花色，所以三个花色可以各自独立枚举后再组合，
 * 状态数很少且可以跨调用缓存，避免整手牌的指数级搜索。
 */
type SuitOption = readonly [melds: number, partials: number, jiang: number];

const suitCache = new Map<string, SuitOption[]>();

function suitOptions(c: number[]): SuitOption[] {
  const key = c.join('');
  const cached = suitCache.get(key);
  if (cached) return cached;

  const found = new Set<number>();
  const encode = (m: number, p: number, j: number) => (m * 16 + p) * 2 + j;

  const rec = (start: number, m: number, p: number, j: number): void => {
    let i = start;
    while (i < RANK_COUNT && c[i] === 0) i++;
    if (i >= RANK_COUNT) {
      found.add(encode(m, p, j));
      return;
    }
    // 记录当前进度（后面的牌全部当孤张打掉）
    found.add(encode(m, p, j));

    // 刻子
    if (c[i] >= 3) {
      c[i] -= 3;
      rec(i, m + 1, p, j);
      c[i] += 3;
    }
    // 顺子
    if (i + 2 < RANK_COUNT && c[i + 1] > 0 && c[i + 2] > 0) {
      c[i]--;
      c[i + 1]--;
      c[i + 2]--;
      rec(i, m + 1, p, j);
      c[i]++;
      c[i + 1]++;
      c[i + 2]++;
    }
    // 对子：当将 或 当搭子
    if (c[i] >= 2) {
      if (!j) {
        c[i] -= 2;
        rec(i, m, p, 1);
        c[i] += 2;
      }
      c[i] -= 2;
      rec(i, m, p + 1, j);
      c[i] += 2;
    }
    // 两面 / 嵌张搭子
    if (i + 1 < RANK_COUNT && c[i + 1] > 0) {
      c[i]--;
      c[i + 1]--;
      rec(i, m, p + 1, j);
      c[i]++;
      c[i + 1]++;
    }
    if (i + 2 < RANK_COUNT && c[i + 2] > 0) {
      c[i]--;
      c[i + 2]--;
      rec(i, m, p + 1, j);
      c[i]++;
      c[i + 2]++;
    }
    // 打掉这一张
    c[i]--;
    rec(i, m, p, j);
    c[i]++;
  };

  rec(0, 0, 0, 0);

  // 只保留帕累托最优解，压缩组合时的搜索量
  const all: SuitOption[] = [...found].map((v) => {
    const j = v % 2;
    const rest = (v - j) / 2;
    return [Math.floor(rest / 16), rest % 16, j] as SuitOption;
  });
  const pareto = all.filter(
    (a) => !all.some((b) => b !== a && b[0] >= a[0] && b[1] >= a[1] && b[2] >= a[2] && (b[0] > a[0] || b[1] > a[1] || b[2] > a[2]))
  );
  suitCache.set(key, pareto);
  return pareto;
}

/**
 * 向听数估算（还差几步到听牌），供 AI 打牌决策使用。
 * shanten = 8 - 2*面子 - 搭子 - 将，其中 面子 + 搭子 不超过 4 副。
 * 已胡返回 -1，听牌返回 0，数值越小越接近胡牌。
 */
export function shanten(counts: Counts, exposedMelds: number): number {
  const perSuit: SuitOption[][] = [];
  for (let s = 0; s < KIND_COUNT / RANK_COUNT; s++) {
    perSuit.push(suitOptions(counts.slice(s * RANK_COUNT, (s + 1) * RANK_COUNT)));
  }

  let best = 8;
  for (const a of perSuit[0]) {
    for (const b of perSuit[1]) {
      for (const d of perSuit[2]) {
        const melds = Math.min(a[0] + b[0] + d[0] + exposedMelds, 4);
        const capacity = 4 - melds;
        const partials = Math.min(a[1] + b[1] + d[1], capacity);
        const jiang = a[2] || b[2] || d[2] ? 1 : 0;
        const value = 8 - 2 * melds - partials - jiang;
        if (value < best) best = value;
      }
    }
  }
  return best;
}

/** 便捷函数：从牌数组构造计数表 */
export function countsFrom(tiles: readonly Kind[]): Counts {
  const c = emptyCounts();
  for (const t of tiles) c[t]++;
  return c;
}
