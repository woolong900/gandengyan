/**
 * 电脑玩家策略。
 *
 * 决策顺序：能自摸就胡 -> 能杠就杠（杠分是白拿的） -> 手上赖子超限必须甩
 * -> 甩赖子换底分 x2（在不明显拖慢听牌的前提下） -> 打出最没用的一张。
 */

import { Game } from './game';
import { countsFrom, shanten } from './hand';
import { Kind, RANK_COUNT, rankOf, suitOf } from './tiles';
import { Action } from './types';

/** 打出某张牌之后的向听数 */
function shantenAfterDiscard(hand: readonly Kind[], melds: number, discard: Kind): number {
  const rest = hand.slice();
  rest.splice(rest.indexOf(discard), 1);
  return shanten(countsFrom(rest), melds);
}

/** 孤张程度：邻牌越少越该打，用于同向听时的取舍 */
function isolation(hand: readonly Kind[], tile: Kind): number {
  const suit = suitOf(tile);
  const rank = rankOf(tile);
  let neighbours = 0;
  for (const t of hand) {
    if (t === tile) continue;
    if (suitOf(t) !== suit) continue;
    const d = Math.abs(rankOf(t) - rank);
    if (d === 0) neighbours += 3;
    else if (d === 1) neighbours += 2;
    else if (d === 2) neighbours += 1;
  }
  // 边张略微更该打
  const edge = rank === 1 || rank === RANK_COUNT ? 1 : 0;
  return -neighbours + edge;
}

export function chooseAction(game: Game, seat: number): Action {
  const options = game.actionOptions(seat);
  if (options.length === 0) return { type: 'pass' };

  // 1. 自摸
  const hu = options.find((a) => a.type === 'hu');
  if (hu) return hu;

  // 2. 杠：暗杠/朝天杠/回头杠都是净收益
  const gang = options.find((a) => a.type === 'anGang' || a.type === 'chaoTianGang' || a.type === 'buGang');
  if (gang) return gang;

  const p = game.players[seat];
  const melds = p.melds.length;
  const discards = options.filter((a) => a.type === 'discard');
  const laiziCount = game.laiziInHand(seat);

  // 3. 手上赖子达到上限就不能胡了，必须甩
  if (laiziCount >= game.rules.laiziBlockHuCount) {
    const d = discards.find((a) => a.kind === game.laizi);
    if (d) return d;
  }

  // 4. 逐张评估
  let best = discards[0];
  let bestScore = -Infinity;
  for (const a of discards) {
    const tile = a.kind!;
    const st = shantenAfterDiscard(p.hand, melds, tile);
    // 向听数是主要目标，孤张程度次要
    let score = -st * 10 + isolation(p.hand, tile) * 0.5;
    // 甩赖子能让底分 x2，值得为它承担少量牌效损失
    if (tile === game.laizi) score += 6;
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

export function chooseClaim(game: Game, seat: number): Action {
  const options = game.claimOptions(seat);
  if (options.length === 0) return { type: 'pass' };

  // 点杠/朝天碰都直接拿分
  const gang = options.find((a) => a.type === 'mingGang' || a.type === 'chaoTianPeng');
  if (gang) return gang;

  const peng = options.find((a) => a.type === 'peng');
  if (peng) {
    const p = game.players[seat];
    const before = shanten(countsFrom(p.hand), p.melds.length);
    const rest = p.hand.slice();
    for (let i = 0; i < 2; i++) rest.splice(rest.indexOf(peng.kind!), 1);
    const after = shanten(countsFrom(rest), p.melds.length + 1);
    if (after <= before) return peng;
  }
  return { type: 'pass' };
}
