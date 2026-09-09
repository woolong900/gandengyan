/**
 * 牌型定义 —— 干瞪眼麻将共 108 张：条/筒/万 各 1-9，每种 4 张。
 *
 * 花色索引与参考游戏的美术资源命名一致（mj_{suit}_{rank}.png）：
 *   0 = 条 (bamboo)   1 = 筒 (dots)   2 = 万 (characters)
 */

export const SUIT_COUNT = 3;
export const RANK_COUNT = 9;
/** 不同牌面的数量 = 27 */
export const KIND_COUNT = SUIT_COUNT * RANK_COUNT;
/** 每种牌面的张数 */
export const COPIES_PER_KIND = 4;
/** 整副牌张数 = 108 */
export const TOTAL_TILES = KIND_COUNT * COPIES_PER_KIND;

/** 牌面编号 0..26 */
export type Kind = number;

export const SUIT_NAMES = ['条', '筒', '万'] as const;
export const RANK_NAMES = ['一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;

export function makeKind(suit: number, rank: number): Kind {
  return suit * RANK_COUNT + (rank - 1);
}

export function suitOf(kind: Kind): number {
  return Math.floor(kind / RANK_COUNT);
}

/** 返回 1..9 */
export function rankOf(kind: Kind): number {
  return (kind % RANK_COUNT) + 1;
}

export function kindName(kind: Kind): string {
  return `${RANK_NAMES[rankOf(kind) - 1]}${SUIT_NAMES[suitOf(kind)]}`;
}

/** 美术资源名，例如 mj_2_5 = 五万 */
export function kindSpriteName(kind: Kind): string {
  return `mj_${suitOf(kind)}_${rankOf(kind)}`;
}

export const ALL_KINDS: readonly Kind[] = Array.from({ length: KIND_COUNT }, (_, i) => i);

/**
 * 朝天牌决定赖子：翻开的那张牌的「下一张」即为本局赖子。
 * 同花色内循环，例如 5筒 -> 6筒，9筒 -> 1筒。
 */
export function laiziOf(chaoTian: Kind): Kind {
  const suit = suitOf(chaoTian);
  const rank = rankOf(chaoTian);
  return makeKind(suit, rank === RANK_COUNT ? 1 : rank + 1);
}

/** 手牌计数表：长度 27，counts[kind] = 张数 */
export type Counts = number[];

export function emptyCounts(): Counts {
  return new Array(KIND_COUNT).fill(0);
}

export function countsOf(tiles: readonly Kind[]): Counts {
  const c = emptyCounts();
  for (const t of tiles) c[t]++;
  return c;
}

export function totalOf(counts: Counts): number {
  let n = 0;
  for (const v of counts) n += v;
  return n;
}

/** 排序：赖子永远在最左，其余按花色、点数升序 */
export function sortTiles(tiles: Kind[], laizi?: Kind): Kind[] {
  return tiles.sort((a, b) => {
    if (laizi !== undefined) {
      const al = a === laizi ? 0 : 1;
      const bl = b === laizi ? 0 : 1;
      if (al !== bl) return al - bl;
    }
    return a - b;
  });
}

/** 生成一副完整的 108 张牌 */
export function buildDeck(): Kind[] {
  const deck: Kind[] = [];
  for (const k of ALL_KINDS) {
    for (let i = 0; i < COPIES_PER_KIND; i++) deck.push(k);
  }
  return deck;
}
