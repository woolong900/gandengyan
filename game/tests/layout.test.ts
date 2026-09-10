import { describe, expect, it } from 'vitest';
import { LAIZI_OUT, SIDE_HAND, SIDE_MELD } from '../src/ui/layout';

/**
 * 暗杠和明牌共用同一批槽位，只换贴图。照抄预制体 `*_gang_hide` 子节点的局部坐标会让
 * 左右两家的暗杠和碰错开（左 30px / 右 14px），看着「碰牌和杠牌不在一条线上」。
 */
describe('碰杠槽位', () => {
  const anchors = ['bottom', 'top', 'left', 'right'] as const;

  it('暗杠逐槽和明牌同位，只有贴图不同', () => {
    for (const anchor of anchors) {
      const { groups, hidden } = SIDE_MELD[anchor];
      expect(hidden.length).toBe(groups.length);
      groups.forEach((g, gi) =>
        g.forEach((s, i) => {
          expect(hidden[gi][i].x).toBe(s.x);
          expect(hidden[gi][i].y).toBe(s.y);
          expect(hidden[gi][i].sprite).not.toBe(s.sprite);
        })
      );
    }
  });

  it('暗杠没有牌面字', () => {
    for (const anchor of anchors) {
      for (const g of SIDE_MELD[anchor].hidden) {
        for (const s of g) expect([s.cardSx, s.cardSy, s.shear]).toEqual([0, 0, 0]);
      }
    }
  });

  it('杠的第 4 张摞在中间那张上面：抬起约一个牌厚', () => {
    for (const anchor of anchors) {
      for (const g of SIDE_MELD[anchor].groups) {
        // 数组是预制体子节点顺序：[远, 中, 近, 摞在最上面的那张]
        const lift = g[1].y - g[3].y;
        expect(lift).toBeGreaterThan(14);
        expect(lift).toBeLessThan(21);
        expect(Math.abs(g[3].x - g[1].x)).toBeLessThan(8);
      }
    }
  });
});

/**
 * 摸的那张要摆在**那一家自己的右手边**。左右两家面朝的方向相反，所以右手边在屏幕上
 * 分处两端：左家面朝右，右手边是屏幕下方；右家面朝左，右手边是屏幕上方。
 */
describe('左右两家的摸牌槽', () => {
  it('左家在近端（屏幕下方）、右家在远端（屏幕上方）', () => {
    const l = SIDE_HAND.left;
    expect(l.drawn.y).toBeGreaterThan(l.packed[l.packed.length - 1].y);
    const r = SIDE_HAND.right;
    expect(r.drawn.y).toBeLessThan(r.packed[0].y);
  });

  it('摸的那张紧挨着余牌对齐的那一端，缝比相邻步距略大', () => {
    // 余牌左家从近端对齐、右家从远端对齐，所以两边都是和摸牌槽相邻的那一端不动。
    // 步距随透视一路变大（近端更宽），所以只能跟摸牌槽**相邻**的那一步比。
    const cases = [
      { wall: SIDE_HAND.left, end: 12, next: 11 },
      { wall: SIDE_HAND.right, end: 0, next: 1 },
    ];
    for (const { wall, end, next } of cases) {
      const step = Math.abs(wall.packed[end].y - wall.packed[next].y);
      const gap = Math.abs(wall.drawn.y - wall.packed[end].y);
      expect(gap).toBeGreaterThan(step);
      expect(gap).toBeLessThan(step * 2);
    }
  });

  it('14 个槽用满 14 张预渲染贴图，不重号', () => {
    for (const wall of [SIDE_HAND.left, SIDE_HAND.right]) {
      const tiles = [...wall.packed.map((s) => s.tile), wall.drawn.tile];
      expect([...tiles].sort((a, b) => a - b)).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
    }
  });

  it('贴图编号 1 最近、14 最远：编号随槽位离屏幕近端由近到远递增', () => {
    // 近端在屏幕下方，y 越大越近，所以贴图编号应随 y 减小而增大
    for (const wall of [SIDE_HAND.left, SIDE_HAND.right]) {
      const all = [...wall.packed, wall.drawn].sort((a, b) => b.y - a.y);
      expect(all.map((s) => s.tile)).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
    }
  });
});

/**
 * 甩出的赖子排成一排时，步进方向必须和牌面那条挨着的边平行，否则接缝上会露出
 * 上面那张的角（预制体手摆的 x 就差了 1~1.7px，看着「上面那张比较靠右」）。
 */
describe('甩出的赖子排布', () => {
  const step = (anchor: 'bottom' | 'top' | 'left' | 'right') => {
    const { slots } = LAIZI_OUT[anchor];
    return { dx: slots[1].x - slots[0].x, dy: slots[1].y - slots[0].y, shear: slots[0].shear };
  };

  it('自家/对家横排：贴图上下缘水平，所以 y 不动', () => {
    for (const anchor of ['bottom', 'top'] as const) {
      expect(Math.abs(step(anchor).dy)).toBeLessThan(0.5);
    }
  });

  it('左右两家纵排：步进走前进侧那条边，比两侧平均的 shear 更陡', () => {
    for (const anchor of ['left', 'right'] as const) {
      const { dx, dy, shear } = step(anchor);
      // 同向：排头往哪边走，牌面就往哪边斜
      expect(Math.sign(dx / dy)).toBe(Math.sign(shear));
      // 更陡：牌面是近端更宽的梯形，接前进侧才盖得住前一张，取平均会让角探出来
      expect(Math.abs(dx / dy)).toBeGreaterThan(Math.abs(shear));
    }
  });

  /**
   * 桌布上那条长方形方格量出来是：外缘 `x = 317 − 0.215(y−120)`、内缘 `x = 344 − 0.1793(y−250)`，
   * 两端由 y=70/109（远）和 y=566/622（近）封口。左家的预制体槽号是反的（card_1 在他左手边），
   * 照 card_1 往近端排，第 3、4 张就会冲出方格下端撞进自家甩牌区。
   */
  it('左家从方格第二格起往他左手边排，4 张都不出格', () => {
    const { slots } = LAIZI_OUT.left;
    const mid = (y: number) => ((317 - 0.215 * (y - 120)) + (344 - 0.1793 * (y - 250))) / 2;
    for (let i = 1; i < slots.length; i++) {
      // 往远端走，方格是斜的，所以屏幕上看就是从左往右
      expect(slots[i].y).toBeLessThan(slots[i - 1].y);
      expect(slots[i].x).toBeGreaterThan(slots[i - 1].x);
    }
    for (const s of slots) {
      expect(s.y - s.h / 2).toBeGreaterThan(109);
      expect(s.y + s.h / 2).toBeLessThan(566);
      expect(Math.abs(s.x - mid(s.y))).toBeLessThan(12);
    }
  });

  it('四家都是等距，且够甩 4 张', () => {
    for (const anchor of ['bottom', 'top', 'left', 'right'] as const) {
      const { slots } = LAIZI_OUT[anchor];
      expect(slots.length).toBe(4);
      for (let i = 1; i < slots.length - 1; i++) {
        expect(slots[i + 1].x - slots[i].x).toBeCloseTo(slots[i].x - slots[i - 1].x, 6);
        expect(slots[i + 1].y - slots[i].y).toBeCloseTo(slots[i].y - slots[i - 1].y, 6);
      }
    }
  });
});
