/**
 * 干瞪眼麻将牌局逻辑（纯逻辑，不依赖任何渲染 / DOM）。
 *
 * 规则要点：
 *  - 108 张牌（条/筒/万 1-9 各 4 张），不能吃，只能自摸胡牌。
 *  - 开局翻开牌堆第一张作「朝天」，该张牌不参与摸牌；其下一张牌面为本局「赖子」。
 *  - 出牌阶段可以甩赖子：打出赖子后从牌堆尾部补一张，该玩家底分 x2（可累乘）。
 *  - 摸齐 3 张朝天亮出算暗杠；别人打出朝天被碰掉，放牌者算点杠。
 *  - 手上赖子 >= 2 张不能胡牌；赖子不能替代任意牌。
 */

import { RuleConfig, makeRules } from './config';
import { isWinningHand, winningTiles } from './hand';
import { Rng, createRng } from './rng';
import { Kind, buildDeck, countsOf, laiziOf, sortTiles } from './tiles';
import { Action, GameEvent, Meld, Phase, PlayerState, Settlement } from './types';

export interface PendingDiscard {
  seat: number;
  kind: Kind;
  /** 还未表态的玩家 */
  waiting: number[];
}

export interface GameOverInfo {
  winner: number | null;
  reason: 'hu' | 'liuju';
}

export class Game {
  readonly rules: RuleConfig;
  readonly players: PlayerState[];
  readonly events: GameEvent[] = [];

  /** 牌墙，front 从头摸，补牌从尾部摸 */
  private wall: Kind[] = [];
  private front = 0;
  private back = 0;

  chaoTian: Kind = 0;
  laizi: Kind = 0;
  dealer = 0;
  turn = 0;
  phase: Phase = 'action';
  /** 当前玩家刚摸到的牌（用于自摸判定与高亮） */
  drawn: Kind | null = null;
  pending: PendingDiscard | null = null;
  over: GameOverInfo | null = null;
  readonly settlements: Settlement[] = [];

  private rng: Rng;

  constructor(opts: { rules?: Partial<RuleConfig>; seed?: number; humanSeat?: number } = {}) {
    this.rules = makeRules(opts.rules);
    this.rng = createRng(opts.seed ?? (Math.random() * 0x7fffffff) | 0);
    const human = opts.humanSeat ?? 0;
    this.players = Array.from({ length: this.rules.playerCount }, (_, seat) => ({
      seat,
      hand: [],
      melds: [],
      discards: [],
      laiziOut: 0,
      mul: 1,
      score: 0,
      isBot: seat !== human,
      voice: seat % 2 === 0 ? 'man' : 'woman',
    }));
    this.deal();
  }

  // ---------------------------------------------------------------- 牌墙

  /** 牌墙剩余可摸张数 */
  get wallLeft(): number {
    return this.back - this.front + 1;
  }

  private drawFront(): Kind | null {
    if (this.wallLeft <= 0) return null;
    return this.wall[this.front++];
  }

  private drawBack(): Kind | null {
    if (this.wallLeft <= 0) return null;
    return this.wall[this.back--];
  }

  // ---------------------------------------------------------------- 发牌

  private deal(): void {
    this.wall = this.rng.shuffle(buildDeck());
    this.front = 0;
    this.back = this.wall.length - 1;

    // 翻开第一张作朝天，该张牌离场
    this.chaoTian = this.drawFront()!;
    this.laizi = laiziOf(this.chaoTian);

    for (let i = 0; i < this.rules.handSize; i++) {
      for (const p of this.players) p.hand.push(this.drawFront()!);
    }
    for (const p of this.players) sortTiles(p.hand, this.laizi);

    this.dealer = 0;
    this.turn = this.dealer;
    this.events.push({ t: 'start', chaoTian: this.chaoTian, laizi: this.laizi, dealer: this.dealer });

    // 庄家先摸一张
    this.drawFor(this.turn, false);
  }

  private drawFor(seat: number, fromBack: boolean): boolean {
    const kind = fromBack ? this.drawBack() : this.drawFront();
    if (kind === null) {
      this.liuju();
      return false;
    }
    const p = this.players[seat];
    p.hand.push(kind);
    sortTiles(p.hand, this.laizi);
    this.drawn = kind;
    this.phase = 'action';
    this.events.push({ t: 'draw', seat, kind, fromBack });
    return true;
  }

  private liuju(): void {
    this.phase = 'over';
    this.over = { winner: null, reason: 'liuju' };
    this.drawn = null;
    this.events.push({ t: 'liuju' });
  }

  // ---------------------------------------------------------------- 查询

  get current(): PlayerState {
    return this.players[this.turn];
  }

  private nextSeat(seat: number): number {
    return (seat + 1) % this.rules.playerCount;
  }

  /** 已亮出的面子数（每个碰/杠都算 1 副） */
  meldCount(seat: number): number {
    return this.players[seat].melds.length;
  }

  /** 手上赖子张数 */
  laiziInHand(seat: number): number {
    return this.players[seat].hand.filter((k) => k === this.laizi).length;
  }

  /** 是否满足胡牌牌型（且赖子数量不超限） */
  canHu(seat: number): boolean {
    if (this.laiziInHand(seat) >= this.rules.laiziBlockHuCount) return false;
    const p = this.players[seat];
    return isWinningHand(countsOf(p.hand), p.melds.length);
  }

  /** 听牌（仅在 3n+1 张时有意义），用于提示 */
  tingTiles(seat: number): Kind[] {
    const p = this.players[seat];
    if (this.laiziInHand(seat) >= this.rules.laiziBlockHuCount) return [];
    return winningTiles(countsOf(p.hand), p.melds.length);
  }

  /** 打出某张牌之后的听牌列表（用于选牌提示） */
  tingIfDiscard(seat: number, kind: Kind): Kind[] {
    const p = this.players[seat];
    const i = p.hand.indexOf(kind);
    if (i < 0) return [];
    const hand = p.hand.slice();
    hand.splice(i, 1);
    const laiziLeft = hand.filter((k) => k === this.laizi).length;
    if (laiziLeft >= this.rules.laiziBlockHuCount) return [];
    return winningTiles(countsOf(hand), p.melds.length);
  }

  /** 当前玩家在 action 阶段可执行的操作 */
  actionOptions(seat: number): Action[] {
    if (this.phase !== 'action' || this.turn !== seat) return [];
    const p = this.players[seat];
    const counts = countsOf(p.hand);
    const out: Action[] = [];

    // 只能自摸：刚摸牌后才能胡。碰/朝天碰之后即使牌型已成，也必须先出牌。
    if (this.drawn !== null && this.canHu(seat)) out.push({ type: 'hu' });

    // 暗杠：手上 4 张
    for (let k = 0; k < counts.length; k++) {
      if (counts[k] === 4) out.push({ type: 'anGang', kind: k });
    }
    // 朝天杠：手上 3 张朝天（朝天那一张已翻开离场，凑齐 3 张即成杠）
    if (counts[this.chaoTian] === 3) out.push({ type: 'chaoTianGang', kind: this.chaoTian });
    // 回头杠：碰过的牌自己补到第四张
    for (const m of p.melds) {
      if (m.type === 'peng' && counts[m.kind] >= 1) out.push({ type: 'buGang', kind: m.kind });
    }

    for (const k of new Set(p.hand)) out.push({ type: 'discard', kind: k });
    return out;
  }

  /** 某玩家对当前打出的牌可执行的操作 */
  claimOptions(seat: number): Action[] {
    const pend = this.pending;
    if (this.phase !== 'claim' || !pend || !pend.waiting.includes(seat)) return [];
    const p = this.players[seat];
    const n = p.hand.filter((k) => k === pend.kind).length;
    const out: Action[] = [];

    if (n >= 3) out.push({ type: 'mingGang', kind: pend.kind });
    if (n >= 2 && this.rules.allowPeng) {
      // 朝天被碰掉按点杠计分
      out.push({ type: pend.kind === this.chaoTian ? 'chaoTianPeng' : 'peng', kind: pend.kind });
    }
    if (out.length) out.push({ type: 'pass' });
    return out;
  }

  // ---------------------------------------------------------------- 计分

  /** 结算：base 分从 payers 支付给 payee，双方底分乘数都参与放大 */
  private settle(payee: number, payers: number[], points: number, reason: string): void {
    const list: Settlement[] = [];
    for (const from of payers) {
      if (from === payee) continue;
      const amount = points * this.rules.baseScore * this.players[from].mul * this.players[payee].mul;
      this.players[from].score -= amount;
      this.players[payee].score += amount;
      const s: Settlement = { from, to: payee, points: amount, reason };
      list.push(s);
      this.settlements.push(s);
    }
    if (list.length) this.events.push({ t: 'score', settlements: list, reason });
  }

  private othersOf(seat: number): number[] {
    return this.players.map((p) => p.seat).filter((s) => s !== seat);
  }

  // ---------------------------------------------------------------- 操作

  /** 执行 action 阶段的操作 */
  act(seat: number, action: Action): boolean {
    if (this.phase !== 'action' || this.turn !== seat) return false;
    const legal = this.actionOptions(seat).some((a) => a.type === action.type && a.kind === action.kind);
    if (!legal) return false;

    switch (action.type) {
      case 'hu':
        return this.doHu(seat);
      case 'discard':
        return this.doDiscard(seat, action.kind!);
      case 'anGang':
        return this.doAnGang(seat, action.kind!);
      case 'chaoTianGang':
        return this.doChaoTianGang(seat);
      case 'buGang':
        return this.doBuGang(seat, action.kind!);
      default:
        return false;
    }
  }

  /** 执行对打出牌的响应 */
  claim(seat: number, action: Action): boolean {
    const pend = this.pending;
    if (this.phase !== 'claim' || !pend) return false;
    const legal = this.claimOptions(seat).some((a) => a.type === action.type && a.kind === action.kind);
    if (!legal) return false;

    if (action.type === 'pass') {
      pend.waiting = pend.waiting.filter((s) => s !== seat);
      if (pend.waiting.length === 0) this.resolveDiscard();
      return true;
    }

    // 有人要牌：把这张牌从牌河取回
    const discarder = pend.seat;
    const kind = pend.kind;
    const dp = this.players[discarder];
    const idx = dp.discards.lastIndexOf(kind);
    if (idx >= 0) dp.discards.splice(idx, 1);
    this.pending = null;

    const p = this.players[seat];
    const take = (n: number) => {
      for (let i = 0; i < n; i++) {
        const j = p.hand.indexOf(kind);
        if (j >= 0) p.hand.splice(j, 1);
      }
    };

    if (action.type === 'mingGang') {
      take(3);
      const meld: Meld = { type: 'mingGang', kind, from: discarder };
      p.melds.push(meld);
      this.events.push({ t: 'meld', seat, meld });
      // 点杠：放杠的人单独支付
      this.settle(seat, [discarder], this.rules.scoreDianGang, '点杠');
      this.turn = seat;
      if (!this.drawFor(seat, true)) return true;
      return true;
    }

    if (action.type === 'chaoTianPeng') {
      // 3 张朝天成杠（第 4 张为翻开的那张），不补牌
      take(2);
      const meld: Meld = { type: 'chaoTianPeng', kind, from: discarder };
      p.melds.push(meld);
      this.events.push({ t: 'meld', seat, meld });
      this.settle(seat, [discarder], this.rules.scoreDianGang, '点杠(朝天)');
      this.turn = seat;
      this.drawn = null;
      this.phase = 'action';
      this.events.push({ t: 'turn', seat });
      return true;
    }

    // 普通碰
    take(2);
    const meld: Meld = { type: 'peng', kind, from: discarder };
    p.melds.push(meld);
    this.events.push({ t: 'meld', seat, meld });
    this.turn = seat;
    this.drawn = null;
    this.phase = 'action';
    this.events.push({ t: 'turn', seat });
    return true;
  }

  // ---------------------------------------------------------------- 具体动作

  private doDiscard(seat: number, kind: Kind): boolean {
    const p = this.players[seat];
    const j = p.hand.indexOf(kind);
    if (j < 0) return false;
    p.hand.splice(j, 1);
    p.discards.push(kind);
    this.drawn = null;

    // 甩赖子：底分 x2 并从牌尾补一张，回合继续
    if (kind === this.laizi) {
      p.laiziOut++;
      p.mul *= this.rules.laiziMultiplier;
      this.events.push({ t: 'shuaiLaizi', seat, kind, mul: p.mul });
      if (!this.rules.laiziDiscardClaimable) {
        this.drawFor(seat, true);
        return true;
      }
    } else {
      this.events.push({ t: 'discard', seat, kind });
    }

    this.openClaims(seat, kind);
    return true;
  }

  /** 打出一张牌后，询问其他玩家是否碰/杠 */
  private openClaims(seat: number, kind: Kind): void {
    const waiting = this.othersOf(seat).filter((s) => {
      const n = this.players[s].hand.filter((k) => k === kind).length;
      return n >= 3 || (n >= 2 && this.rules.allowPeng);
    });
    if (waiting.length === 0) {
      this.pending = { seat, kind, waiting: [] };
      this.resolveDiscard();
      return;
    }
    this.pending = { seat, kind, waiting };
    this.phase = 'claim';
  }

  /** 无人要牌，轮到下一家摸牌 */
  private resolveDiscard(): void {
    const pend = this.pending;
    this.pending = null;
    if (this.phase === 'over') return;
    const from = pend ? pend.seat : this.turn;
    const next = this.nextSeat(from);
    this.turn = next;
    this.events.push({ t: 'turn', seat: next });
    this.drawFor(next, false);
  }

  private doAnGang(seat: number, kind: Kind): boolean {
    const p = this.players[seat];
    for (let i = 0; i < 4; i++) {
      const j = p.hand.indexOf(kind);
      if (j < 0) return false;
      p.hand.splice(j, 1);
    }
    const meld: Meld = { type: 'anGang', kind };
    p.melds.push(meld);
    this.events.push({ t: 'meld', seat, meld });
    this.settle(seat, this.othersOf(seat), this.rules.scoreAnGang, '暗杠');
    this.drawFor(seat, true);
    return true;
  }

  private doChaoTianGang(seat: number): boolean {
    const p = this.players[seat];
    for (let i = 0; i < 3; i++) {
      const j = p.hand.indexOf(this.chaoTian);
      if (j < 0) return false;
      p.hand.splice(j, 1);
    }
    const meld: Meld = { type: 'chaoTianGang', kind: this.chaoTian };
    p.melds.push(meld);
    this.events.push({ t: 'meld', seat, meld });
    // 3 张朝天亮出，按暗杠计分；不补牌（只消耗 3 张，牌数已满足出牌条件）
    this.settle(seat, this.othersOf(seat), this.rules.scoreAnGang, '朝天杠');
    this.drawn = null;
    this.phase = 'action';
    return true;
  }

  private doBuGang(seat: number, kind: Kind): boolean {
    const p = this.players[seat];
    const meld = p.melds.find((m) => m.type === 'peng' && m.kind === kind);
    if (!meld) return false;
    const j = p.hand.indexOf(kind);
    if (j < 0) return false;
    p.hand.splice(j, 1);
    meld.type = 'buGang';
    this.events.push({ t: 'meld', seat, meld });
    this.settle(seat, this.othersOf(seat), this.rules.scoreHuiTouGang, '回头杠');
    this.drawFor(seat, true);
    return true;
  }

  private doHu(seat: number): boolean {
    this.phase = 'over';
    this.over = { winner: seat, reason: 'hu' };
    this.events.push({ t: 'hu', seat, kind: this.drawn ?? -1 });
    this.settle(seat, this.othersOf(seat), this.rules.scoreZimo, '自摸');
    this.drawn = null;
    return true;
  }
}
