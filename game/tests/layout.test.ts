import { describe, expect, it } from 'vitest';
import { LAIZI_OUT } from '../src/ui/layout';

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
