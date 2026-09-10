import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LAIZI_OUT, RIVER, RIVER_ER, SIDE_HAND, SIDE_MELD } from '../src/ui/layout';

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
 * 碰杠区压在余牌槽靠远端的那几格上，所以有 m 组碰杠时余牌只剩 `13 − 3m` 格能用。
 * 牌墙是 20px 步距上摆 80~100px 高的长方体，压没压到只能按**边缘**算。
 */
describe('侧手牌墙和碰杠区', () => {
  /** 牌墙用 `packed` 张余牌时，沿碰杠那一端的边界 */
  function wallEdge(anchor: 'left' | 'right', packed: number): number {
    const pk = SIDE_HAND[anchor].packed;
    const s = anchor === 'left' ? pk[pk.length - packed] : pk[packed - 1];
    const h = tileHeight(anchor, s.tile);
    return anchor === 'left' ? s.y - h / 2 : s.y + h / 2;
  }

  function tileHeight(anchor: 'left' | 'right', tile: number): number {
    const name = `${anchor === 'left' ? 'zlp' : 'ylp'}_${tile}.png`;
    const png = readFileSync(new URL(`../public/assets/img/${name}`, import.meta.url));
    return png.readUInt32BE(20); // IHDR 的 height
  }

  it('有 m 组碰杠时，13 - 3m 张余牌正好和碰杠区挨上而不重叠', () => {
    for (const anchor of ['left', 'right'] as const) {
      for (let m = 1; m <= 4; m++) {
        const g = SIDE_MELD[anchor].groups[m - 1];
        const meldEdge =
          anchor === 'left'
            ? Math.max(...g.map((s) => s.y + s.h / 2))
            : Math.min(...g.map((s) => s.y - s.h / 2));
        const clear = wallEdge(anchor, 13 - 3 * m);
        const overlap = anchor === 'left' ? meldEdge - clear : clear - meldEdge;
        expect(overlap).toBeLessThan(12);
        // 再多一张就压进碰杠区，所以多握的那张只能进摸牌槽（见 render 的 handWaiting）
        const packedOneMore = wallEdge(anchor, 14 - 3 * m);
        expect(anchor === 'left' ? meldEdge - packedOneMore : packedOneMore - meldEdge).toBeGreaterThan(overlap + 10);
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

/**
 * 出牌河：桌面 3 排 + 摞在第 1、2 排头上的 2 排。牌与牌重叠 9~18px，画序必须远的先画，
 * 落牌序则是从那一家自己的左手边排起。
 */
describe('出牌河', () => {
  const anchors = ['bottom', 'top', 'left', 'right'] as const;

  it('每家 3 排铺桌面、2 排摞在头上', () => {
    for (const anchor of anchors) {
      const { perRow, slots } = RIVER[anchor];
      expect(perRow).toBe(7);
      expect(slots.length).toBe(perRow * 5);
      // 第 4、5 排是第 1、2 排抬起一个牌厚，贴图一一对应
      for (let i = 0; i < perRow * 2; i++) {
        const base = slots[i];
        const up = slots[perRow * 3 + i];
        expect(up.sprite).toBe(base.sprite);
        expect(up.y).toBeLessThan(base.y);
        expect(base.y - up.y).toBeGreaterThan(13);
        expect(base.y - up.y).toBeLessThan(22);
      }
    }
  });

  it('落牌从那一家自己的左手边排起', () => {
    // 自家面朝上→往屏幕右；对家面朝下→往左；左家面朝右→往下；右家面朝左→往上
    const dir = { bottom: [1, 0], top: [-1, 0], left: [0, 1], right: [0, -1] } as const;
    for (const anchor of anchors) {
      const { perRow, slots } = RIVER[anchor];
      const [sx, sy] = dir[anchor];
      for (let i = 1; i < perRow; i++) {
        if (sx) expect(Math.sign(slots[i].x - slots[i - 1].x)).toBe(sx);
        if (sy) expect(Math.sign(slots[i].y - slots[i - 1].y)).toBe(sy);
      }
    }
  });

  it('画序是完整排列，且摞上去那两排最后画', () => {
    for (const anchor of anchors) {
      const { perRow, slots, paint } = RIVER[anchor];
      expect([...paint].sort((a, b) => a - b)).toEqual(slots.map((_, i) => i));
      const firstStacked = paint.findIndex((i) => i >= perRow * 3);
      expect(firstStacked).toBe(perRow * 3);
    }
  });

  it('同一排里远的先画', () => {
    for (const anchor of anchors) {
      const { perRow, slots, paint } = RIVER[anchor];
      const horizontal = anchor === 'bottom' || anchor === 'top';
      for (let r = 0; r < 5; r++) {
        const row = paint.slice(r * perRow, (r + 1) * perRow).map((i) => slots[i]);
        if (horizontal) {
          // 横排从两端往中间画，中间那两张压在最上面
          const mid = 640;
          expect(Math.abs(row[0].x - mid)).toBeGreaterThan(Math.abs(row[row.length - 1].x - mid));
        } else {
          for (let i = 1; i < row.length; i++) expect(row[i].y).toBeGreaterThan(row[i - 1].y);
        }
      }
    }
  });

  it('牌面剪切量随离画面中线的距离线性变化，中线处为 0', () => {
    for (const anchor of anchors) {
      for (const s of RIVER[anchor].slots) {
        expect(Math.sign(s.shear)).toBe(Math.sign(Math.round(s.x - 640)));
        expect(Math.abs(s.shear)).toBeCloseTo(0.000545 * Math.abs(s.x - 640), 2);
      }
    }
  });

  /**
   * 自家/对家那 13 个槽平时只用居中的 7 个。APK `_outIndex`：
   * `13 * floor(i / 7) + (i % 7 + 4)`，二人局才退化成 `i`。
   */
  it('自家/对家取 13 槽里居中的 7 个，二人局才铺满', () => {
    for (const anchor of ['bottom', 'top'] as const) {
      const { perRow, slots } = RIVER[anchor];
      const er = RIVER_ER[anchor];
      expect(er.perRow).toBe(13);
      expect(er.slots.length).toBe(65);
      for (let i = 0; i < slots.length; i++) {
        expect(slots[i]).toEqual(er.slots[13 * Math.floor(i / perRow) + (i % perRow) + 4]);
      }
      // 收到居中 7 个，横排才不会长进左右两家的牌河：只在拐角处和邻家挨着
      const xs = slots.map((s) => s.x);
      const near = anchor === 'bottom' ? RIVER.right : RIVER.left;
      const overshoot = anchor === 'bottom'
        ? Math.max(...xs) - Math.min(...near.slots.map((s) => s.x))
        : Math.max(...near.slots.map((s) => s.x)) - Math.min(...xs);
      expect(overshoot).toBeLessThan(20);
    }
  });
});
