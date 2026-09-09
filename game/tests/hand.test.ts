import { describe, expect, it } from 'vitest';
import { countsFrom, isWinningHand, shanten, winningTiles } from '../src/core/hand';
import { buildDeck, kindName, laiziOf, makeKind, TOTAL_TILES } from '../src/core/tiles';

/** 便捷构造：'1条 2条 3条' 这样的写法 */
const T = {
  tiao: (r: number) => makeKind(0, r),
  tong: (r: number) => makeKind(1, r),
  wan: (r: number) => makeKind(2, r),
};

describe('牌堆', () => {
  it('共 108 张，每种牌面 4 张', () => {
    const deck = buildDeck();
    expect(deck.length).toBe(108);
    expect(TOTAL_TILES).toBe(108);
    const counts = countsFrom(deck);
    expect(counts.length).toBe(27);
    expect(counts.every((c) => c === 4)).toBe(true);
  });

  it('牌面名称与花色索引对应美术资源', () => {
    expect(kindName(T.tong(5))).toBe('五筒');
    expect(kindName(T.wan(9))).toBe('九万');
    expect(kindName(T.tiao(1))).toBe('一条');
  });
});

describe('赖子推算', () => {
  it('翻开 5 筒则 6 筒为赖子', () => {
    expect(laiziOf(T.tong(5))).toBe(T.tong(6));
  });

  it('同花色内循环：9 条的赖子是 1 条', () => {
    expect(laiziOf(T.tiao(9))).toBe(T.tiao(1));
  });

  it('不会跨花色', () => {
    expect(laiziOf(T.wan(9))).toBe(T.wan(1));
    expect(laiziOf(T.tong(9))).toBe(T.tong(1));
  });
});

describe('胡牌判定（4 面子 + 1 将）', () => {
  it('四副顺子加一对将', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2), T.wan(2),
    ];
    expect(isWinningHand(countsFrom(hand), 0)).toBe(true);
  });

  it('刻子与顺子混合', () => {
    const hand = [
      T.tiao(9), T.tiao(9), T.tiao(9),
      T.tong(4), T.tong(5), T.tong(6),
      T.wan(1), T.wan(1), T.wan(1),
      T.wan(3), T.wan(4), T.wan(5),
      T.tong(8), T.tong(8),
    ];
    expect(isWinningHand(countsFrom(hand), 0)).toBe(true);
  });

  it('顺子不能跨花色（9条+1筒+2筒 无效）', () => {
    const hand = [
      T.tiao(8), T.tiao(9), T.tong(1),
      T.tong(2), T.tong(3), T.tong(4),
      T.wan(1), T.wan(2), T.wan(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.tong(9), T.tong(9),
    ];
    expect(isWinningHand(countsFrom(hand), 0)).toBe(false);
  });

  it('差一张不算胡', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2), T.wan(5),
    ];
    expect(isWinningHand(countsFrom(hand), 0)).toBe(false);
  });

  it('已碰出的面子计入面子数', () => {
    // 2 副已碰出，暗牌只需 2 副面子 + 1 将 = 8 张
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tong(5), T.tong(6), T.tong(7),
      T.wan(4), T.wan(4),
    ];
    expect(isWinningHand(countsFrom(hand), 2)).toBe(true);
  });

  it('张数不符时直接不成立', () => {
    const hand = [T.tiao(1), T.tiao(1)];
    expect(isWinningHand(countsFrom(hand), 0)).toBe(false);
  });
});

describe('听牌计算', () => {
  it('单钓将', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2),
    ];
    expect(winningTiles(countsFrom(hand), 0)).toEqual([T.wan(2)]);
  });

  it('两面听', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(2), T.wan(2),
      T.wan(7), T.wan(8),
    ];
    const ting = winningTiles(countsFrom(hand), 0);
    expect(ting.sort((a, b) => a - b)).toEqual([T.wan(6), T.wan(9)].sort((a, b) => a - b));
  });
});

describe('向听数', () => {
  it('已胡的牌向听为 -1', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2), T.wan(2),
    ];
    expect(shanten(countsFrom(hand), 0)).toBe(-1);
  });

  it('听牌状态向听为 0', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2),
    ];
    expect(shanten(countsFrom(hand), 0)).toBe(0);
  });

  it('散牌向听数较大', () => {
    const hand = [
      T.tiao(1), T.tiao(4), T.tiao(7),
      T.tong(2), T.tong(5), T.tong(8),
      T.wan(1), T.wan(4), T.wan(7),
      T.tiao(9), T.tong(9), T.wan(9),
      T.tiao(2),
    ];
    expect(shanten(countsFrom(hand), 0)).toBeGreaterThan(2);
  });
});
