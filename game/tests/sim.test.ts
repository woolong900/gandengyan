import { describe, expect, it } from 'vitest';
import { handSizeOk, playOut, tilesInPlay } from '../src/core/sim';
import { Game } from '../src/core/game';

describe('整局推演', () => {
  it('300 局都能正常结束，且牌张与手牌数始终守恒', () => {
    const outcomes = { hu: 0, liuju: 0 };
    for (let seed = 1; seed <= 300; seed++) {
      const violations: string[] = [];
      const res = playOut({
        seed,
        onStep: (g: Game) => {
          if (tilesInPlay(g) !== 108) violations.push(`seed=${seed} 牌张=${tilesInPlay(g)}`);
          if (!handSizeOk(g)) violations.push(`seed=${seed} 手牌数异常=${g.current.hand.length}`);
        },
      });
      expect(violations).toEqual([]);
      outcomes[res.reason]++;
      // 零和：所有人的分数加起来必须为 0
      const total = res.game.players.reduce((n, p) => n + p.score, 0);
      expect(total).toBe(0);
    }
    // 两种结局都应出现，说明胡牌是可达的而不是永远流局
    expect(outcomes.hu).toBeGreaterThan(0);
    expect(outcomes.liuju).toBeGreaterThan(0);
  });

  it('2 人与 3 人局同样可以打完', () => {
    for (const playerCount of [2, 3]) {
      for (let seed = 1; seed <= 40; seed++) {
        const res = playOut({ seed, rules: { playerCount } });
        expect(['hu', 'liuju']).toContain(res.reason);
        expect(res.game.players.reduce((n, p) => n + p.score, 0)).toBe(0);
      }
    }
  });

  it('胡牌者手上赖子不会超过 1 张', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const res = playOut({ seed });
      if (res.winner !== null) {
        expect(res.game.laiziInHand(res.winner)).toBeLessThan(2);
      }
    }
  });

  it('甩赖子确实会把底分翻倍', () => {
    let sawMultiplier = false;
    for (let seed = 1; seed <= 100; seed++) {
      const res = playOut({ seed });
      for (const p of res.game.players) {
        expect(p.mul).toBe(Math.pow(2, p.laiziOut));
        if (p.laiziOut > 0) sawMultiplier = true;
      }
    }
    expect(sawMultiplier).toBe(true);
  });
});
