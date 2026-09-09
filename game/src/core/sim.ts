/** 无界面推演：用 AI 驱动全部座位把一局打完，供测试与平衡性验证使用。 */

import { chooseAction, chooseClaim } from './ai';
import { Game } from './game';
import { RuleConfig } from './config';
import { Meld } from './types';

/** 一副面子实际占用的牌张数 */
export function meldTileCount(m: Meld): number {
  switch (m.type) {
    case 'peng':
    case 'chaoTianGang':
    case 'chaoTianPeng':
      return 3;
    default:
      return 4;
  }
}

/** 场上所有牌张数（应恒等于 108） */
export function tilesInPlay(g: Game): number {
  let n = g.wallLeft + 1; // + 翻开的朝天
  for (const p of g.players) {
    n += p.hand.length + p.discards.length;
    for (const m of p.melds) n += meldTileCount(m);
  }
  return n;
}

/** 当前该出牌的玩家，其手牌数应为 3*(4-面子数)+2 */
export function handSizeOk(g: Game): boolean {
  if (g.phase !== 'action') return true;
  const p = g.current;
  return p.hand.length === 3 * (4 - p.melds.length) + 2;
}

export interface SimResult {
  game: Game;
  steps: number;
  winner: number | null;
  reason: 'hu' | 'liuju';
}

export function playOut(
  opts: { seed: number; rules?: Partial<RuleConfig>; onStep?: (g: Game) => void } = { seed: 0 }
): SimResult {
  const g = new Game({ seed: opts.seed, rules: opts.rules });
  let steps = 0;
  const limit = 5000;

  while (g.phase !== 'over' && steps < limit) {
    steps++;
    opts.onStep?.(g);
    if (g.phase === 'action') {
      const seat = g.turn;
      const action = chooseAction(g, seat);
      if (!g.act(seat, action)) throw new Error(`非法操作 seat=${seat} ${JSON.stringify(action)}`);
    } else if (g.phase === 'claim') {
      const pend = g.pending;
      if (!pend) throw new Error('claim 阶段缺少待响应的牌');
      // 按离打牌者的距离依次表态，先到先得
      const order = [...pend.waiting].sort(
        (a, b) =>
          ((a - pend.seat + g.players.length) % g.players.length) -
          ((b - pend.seat + g.players.length) % g.players.length)
      );
      let acted = false;
      for (const seat of order) {
        const action = chooseClaim(g, seat);
        if (action.type !== 'pass') {
          if (!g.claim(seat, action)) throw new Error(`非法响应 seat=${seat}`);
          acted = true;
          break;
        }
      }
      if (!acted) {
        for (const seat of order) {
          if (g.phase !== 'claim') break;
          g.claim(seat, { type: 'pass' });
        }
      }
    }
  }

  if (steps >= limit) throw new Error('牌局未能结束');
  return { game: g, steps, winner: g.over!.winner, reason: g.over!.reason };
}
