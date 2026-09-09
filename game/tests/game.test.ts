import { describe, expect, it } from 'vitest';
import { RuleConfig } from '../src/core/config';
import { Game } from '../src/core/game';
import { Kind, laiziOf, makeKind, sortTiles } from '../src/core/tiles';
import { Meld } from '../src/core/types';

const T = {
  tiao: (r: number) => makeKind(0, r),
  tong: (r: number) => makeKind(1, r),
  wan: (r: number) => makeKind(2, r),
};

/** 访问牌墙内部字段以构造确定性场景 */
interface GameInternals {
  wall: Kind[];
  front: number;
  back: number;
}
const inner = (g: Game) => g as unknown as GameInternals;

function scenario(opts: {
  hands: Kind[][];
  wall?: Kind[];
  chaoTian?: Kind;
  turn?: number;
  melds?: Meld[][];
  rules?: Partial<RuleConfig>;
}): Game {
  const g = new Game({ seed: 7, rules: { playerCount: opts.hands.length, ...opts.rules } });
  const gi = inner(g);
  g.chaoTian = opts.chaoTian ?? T.tong(5);
  g.laizi = laiziOf(g.chaoTian);
  opts.hands.forEach((h, i) => {
    const p = g.players[i];
    p.hand = sortTiles([...h], g.laizi);
    p.melds = opts.melds?.[i] ?? [];
    p.discards = [];
    p.mul = 1;
    p.laiziOut = 0;
    p.score = 0;
  });
  const wall = opts.wall ?? [T.wan(1), T.wan(2), T.wan(3), T.wan(4)];
  gi.wall = [...wall];
  gi.front = 0;
  gi.back = wall.length - 1;
  g.turn = opts.turn ?? 0;
  g.phase = 'action';
  g.drawn = null;
  g.pending = null;
  g.over = null;
  g.events.length = 0;
  g.settlements.length = 0;
  return g;
}

/** 一副 4 面子 + 1 将的 14 张胡牌手牌 */
const WINNING_14 = [
  T.tiao(1), T.tiao(2), T.tiao(3),
  T.tiao(4), T.tiao(5), T.tiao(6),
  T.tong(1), T.tong(2), T.tong(3),
  T.wan(7), T.wan(8), T.wan(9),
  T.wan(2), T.wan(2),
];
/** 去掉最后一张将牌的 13 张 */
const WINNING_13 = WINNING_14.slice(0, 13);

describe('开局', () => {
  it('翻开第一张作朝天，朝天不参与摸牌，赖子为其下一张', () => {
    const g = new Game({ seed: 42 });
    expect(g.laizi).toBe(laiziOf(g.chaoTian));
    // 108 张 - 1 张朝天 - 4 家各 13 张 - 庄家摸 1 张
    expect(g.wallLeft).toBe(108 - 1 - 52 - 1);
    for (let s = 0; s < 4; s++) {
      expect(g.players[s].hand.length).toBe(s === g.dealer ? 14 : 13);
    }
  });

  it('2-4 人均可开局', () => {
    for (const n of [2, 3, 4]) {
      const g = new Game({ seed: 5, rules: { playerCount: n } });
      expect(g.players.length).toBe(n);
      expect(g.wallLeft).toBe(108 - 1 - 13 * n - 1);
    }
  });

  it('整局牌张守恒：手牌 + 牌墙 + 朝天 = 108', () => {
    const g = new Game({ seed: 99 });
    const inHands = g.players.reduce((n, p) => n + p.hand.length, 0);
    expect(inHands + g.wallLeft + 1).toBe(108);
  });
});

describe('不能吃，只能自摸', () => {
  it('响应打牌时只有碰/杠/过，绝无吃', () => {
    const g = scenario({
      hands: [
        [...WINNING_13, T.tong(9)],
        [T.tong(9), T.tong(9), T.tiao(4), T.tiao(5), T.tiao(6), T.tiao(7), T.tiao(8),
         T.tong(1), T.tong(2), T.tong(3), T.wan(1), T.wan(1), T.wan(1)],
        [T.tiao(1), T.tiao(1), T.tiao(2), T.tiao(2), T.tiao(3), T.tiao(3), T.tiao(7),
         T.tong(4), T.tong(4), T.tong(6), T.wan(3), T.wan(4), T.wan(5)],
        [T.wan(6), T.wan(6), T.wan(7), T.wan(7), T.wan(8), T.wan(8), T.tong(7),
         T.tong(8), T.tiao(9), T.tiao(9), T.tong(2), T.tong(3), T.tong(4)],
      ],
    });
    g.act(0, { type: 'discard', kind: T.tong(9) });
    expect(g.phase).toBe('claim');
    const types = g.claimOptions(1).map((a) => a.type);
    expect(types).toContain('peng');
    expect(types).not.toContain('chi');
    expect(types).not.toContain('hu');
  });

  it('别人打出的牌即使能成胡牌牌型也不能胡', () => {
    const g = scenario({
      hands: [
        [...WINNING_13.slice(0, 12), T.wan(2), T.tong(9)],
        // 玩家 1 差一张 2万 即可胡，但只能自摸
        [...WINNING_13.slice(0, 12), T.wan(2)],
        [T.tiao(7), T.tiao(8), T.tiao(9), T.tong(4), T.tong(5), T.tong(6), T.wan(3),
         T.wan(4), T.wan(5), T.tong(7), T.tong(7), T.tiao(1), T.tiao(1)],
        [T.wan(6), T.wan(6), T.wan(6), T.tong(8), T.tong(8), T.tong(8), T.tiao(3),
         T.tiao(4), T.tiao(5), T.tong(2), T.tong(2), T.tiao(9), T.tiao(9)],
      ],
    });
    g.act(0, { type: 'discard', kind: T.wan(2) });
    expect(g.claimOptions(1).map((a) => a.type)).not.toContain('hu');
    expect(g.over).toBeNull();
  });

  it('自摸胡牌：每家付 2 分', () => {
    const g = scenario({ hands: [WINNING_14, WINNING_13, WINNING_13, WINNING_13] });
    g.drawn = T.wan(2);
    expect(g.canHu(0)).toBe(true);
    g.act(0, { type: 'hu' });
    expect(g.over).toEqual({ winner: 0, reason: 'hu' });
    expect(g.players[0].score).toBe(6);
    expect(g.players[1].score).toBe(-2);
    expect(g.players[2].score).toBe(-2);
    expect(g.players[3].score).toBe(-2);
  });
});

describe('赖子', () => {
  it('甩一张赖子：底分 x2，并从牌堆尾部补一张，回合继续', () => {
    const laizi = laiziOf(T.tong(5)); // 6 筒
    const hand = [...WINNING_13.slice(0, 13), laizi];
    const wall = [T.wan(1), T.tiao(9)]; // 尾部是 9 条
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], wall, chaoTian: T.tong(5) });

    g.act(0, { type: 'discard', kind: laizi });

    expect(g.players[0].mul).toBe(2);
    expect(g.players[0].laiziOut).toBe(1);
    expect(g.turn).toBe(0); // 仍是自己的回合
    expect(g.phase).toBe('action');
    expect(g.drawn).toBe(T.tiao(9)); // 从尾部补牌
    expect(g.players[0].hand.length).toBe(14);
  });

  it('甩两张赖子：底分再 x2（共 x4）', () => {
    const laizi = laiziOf(T.tong(5));
    const hand = [...WINNING_13.slice(0, 12), laizi, laizi];
    const wall = [T.wan(1), laizi, T.tiao(9)];
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], wall, chaoTian: T.tong(5) });

    g.act(0, { type: 'discard', kind: laizi });
    expect(g.players[0].mul).toBe(2);
    g.act(0, { type: 'discard', kind: laizi });
    expect(g.players[0].mul).toBe(4);
    expect(g.players[0].laiziOut).toBe(2);
  });

  it('底分乘数放大该玩家的所有结算（自摸）', () => {
    const g = scenario({ hands: [WINNING_14, WINNING_13, WINNING_13, WINNING_13] });
    g.players[0].mul = 4; // 已甩两张赖子
    g.drawn = T.wan(2);
    g.act(0, { type: 'hu' });
    // 2 分 x 自己 4 倍 x 对手 1 倍
    expect(g.players[0].score).toBe(24);
    expect(g.players[1].score).toBe(-8);
  });

  it('双方乘数同时参与放大', () => {
    const g = scenario({ hands: [WINNING_14, WINNING_13, WINNING_13, WINNING_13] });
    g.players[0].mul = 2;
    g.players[1].mul = 2;
    g.drawn = T.wan(2);
    g.act(0, { type: 'hu' });
    expect(g.players[1].score).toBe(-8); // 2 x 2 x 2
    expect(g.players[2].score).toBe(-4); // 2 x 2 x 1
    expect(g.players[0].score).toBe(16);
  });

  it('手上有 2 张或以上赖子不能胡牌', () => {
    const laizi = laiziOf(T.tong(5));
    // 构造一手「本身能胡」且含 2 张赖子(6筒)的牌
    const hand = [
      T.tong(6), T.tong(6), // 2 张赖子当对将
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
    ];
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], chaoTian: T.tong(5) });
    expect(g.laizi).toBe(laizi);
    expect(g.laiziInHand(0)).toBe(2);
    expect(g.canHu(0)).toBe(false);
    expect(g.actionOptions(0).map((a) => a.type)).not.toContain('hu');
  });

  it('选牌时能提示打出后听哪些牌', () => {
    const g = scenario({
      hands: [
        [
          T.tiao(1), T.tiao(2), T.tiao(3),
          T.tiao(4), T.tiao(5), T.tiao(6),
          T.tong(1), T.tong(2), T.tong(3),
          T.wan(7), T.wan(8), T.wan(9),
          T.wan(2), T.tong(9),
        ],
        WINNING_13, WINNING_13, WINNING_13,
      ],
    });
    expect(g.tingIfDiscard(0, T.tong(9))).toEqual([T.wan(2)]);
    expect(g.tingIfDiscard(0, T.wan(2))).toEqual([T.tong(9)]);
  });

  it('只有 1 张赖子时可以正常胡牌（赖子按本身的牌面参与面子）', () => {
    // 朝天 5 筒 -> 赖子 6 筒；6 筒作为 4-5-6 筒顺子的一员，手上仅 1 张
    const hand = [
      T.tong(4), T.tong(5), T.tong(6),
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2), T.wan(2),
    ];
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], chaoTian: T.tong(5) });
    g.drawn = T.tong(6);
    expect(g.laiziInHand(0)).toBe(1);
    expect(g.canHu(0)).toBe(true);
    expect(g.actionOptions(0).map((a) => a.type)).toContain('hu');
  });

  it('赖子不能替代任意牌：缺张时不因持有赖子而算胡', () => {
    const hand = [
      T.tiao(1), T.tiao(2), T.tiao(3),
      T.tiao(4), T.tiao(5), T.tiao(6),
      T.tong(1), T.tong(2), T.tong(3),
      T.wan(7), T.wan(8), T.wan(9),
      T.wan(2), T.tong(6), // 缺 2万 做将，手上是赖子 6 筒
    ];
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], chaoTian: T.tong(5) });
    expect(g.laiziInHand(0)).toBe(1); // 未超限
    expect(g.canHu(0)).toBe(false); // 赖子不能当 2 万
  });
});

describe('杠与计分', () => {
  const base13 = [
    T.tiao(1), T.tiao(2), T.tiao(3), T.tiao(4), T.tiao(5), T.tiao(6),
    T.tong(1), T.tong(2), T.tong(3), T.wan(7), T.wan(8),
  ];

  it('暗杠：分值 2，每家都付', () => {
    const hand = [T.wan(1), T.wan(1), T.wan(1), T.wan(1), ...base13.slice(0, 10)];
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], wall: [T.tiao(9), T.tiao(8)] });
    expect(g.actionOptions(0).some((a) => a.type === 'anGang' && a.kind === T.wan(1))).toBe(true);
    g.act(0, { type: 'anGang', kind: T.wan(1) });
    expect(g.players[0].score).toBe(6);
    expect(g.players[1].score).toBe(-2);
    expect(g.players[0].melds[0].type).toBe('anGang');
    // 杠后从尾部补一张
    expect(g.drawn).toBe(T.tiao(8));
  });

  it('点杠：分值 1，只由放杠的那个人支付', () => {
    const g = scenario({
      hands: [
        [...base13, T.wan(9), T.tong(9), T.tong(7)],
        [T.tong(9), T.tong(9), T.tong(9), ...base13.slice(0, 10)],
        WINNING_13,
        WINNING_13,
      ],
      wall: [T.tiao(9), T.tiao(8)],
    });
    g.act(0, { type: 'discard', kind: T.tong(9) });
    expect(g.claimOptions(1).some((a) => a.type === 'mingGang')).toBe(true);
    g.claim(1, { type: 'mingGang', kind: T.tong(9) });

    expect(g.players[1].score).toBe(1);
    expect(g.players[0].score).toBe(-1); // 放杠者支付
    expect(g.players[2].score).toBe(0);
    expect(g.players[3].score).toBe(0);
    expect(g.turn).toBe(1);
  });

  it('回头杠：碰过之后补上第四张，分值 1', () => {
    const melds: Meld[][] = [[{ type: 'peng', kind: T.wan(1), from: 1 }], [], [], []];
    const hand = [T.wan(1), ...base13.slice(0, 10)]; // 11 张 = 3*(4-1)+2
    const g = scenario({
      hands: [hand, WINNING_13, WINNING_13, WINNING_13],
      melds,
      wall: [T.tiao(9), T.tiao(8)],
    });
    expect(g.actionOptions(0).some((a) => a.type === 'buGang' && a.kind === T.wan(1))).toBe(true);
    g.act(0, { type: 'buGang', kind: T.wan(1) });
    expect(g.players[0].melds[0].type).toBe('buGang');
    expect(g.players[0].score).toBe(3); // 1 分 x 3 家
    expect(g.players[1].score).toBe(-1);
  });

  it('朝天杠：摸到 3 张朝天亮出，按暗杠算 2 分', () => {
    const ct = T.tong(5);
    const hand = [ct, ct, ct, ...base13.slice(0, 11)]; // 14 张
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], chaoTian: ct });
    expect(g.actionOptions(0).some((a) => a.type === 'chaoTianGang')).toBe(true);
    g.act(0, { type: 'chaoTianGang', kind: ct });
    expect(g.players[0].melds[0].type).toBe('chaoTianGang');
    expect(g.players[0].score).toBe(6); // 2 分 x 3 家
    expect(g.players[1].score).toBe(-2);
    // 只消耗 3 张，不补牌，牌数仍满足出牌条件
    expect(g.players[0].hand.length).toBe(11);
    expect(g.phase).toBe('action');
  });

  it('打给别人的朝天被碰掉，放牌者算点杠', () => {
    const ct = T.tong(5);
    const g = scenario({
      hands: [
        [...base13, T.wan(9), T.tong(7), ct],
        [ct, ct, ...base13.slice(0, 11)],
        WINNING_13,
        WINNING_13,
      ],
      chaoTian: ct,
    });
    g.act(0, { type: 'discard', kind: ct });
    expect(g.claimOptions(1).some((a) => a.type === 'chaoTianPeng')).toBe(true);
    g.claim(1, { type: 'chaoTianPeng', kind: ct });

    expect(g.players[1].melds[0].type).toBe('chaoTianPeng');
    expect(g.players[1].score).toBe(1);
    expect(g.players[0].score).toBe(-1); // 放牌者算点杠
    expect(g.players[2].score).toBe(0);
    expect(g.turn).toBe(1);
    expect(g.phase).toBe('action');
  });

  it('杠分同样受底分乘数影响', () => {
    const hand = [T.wan(1), T.wan(1), T.wan(1), T.wan(1), ...base13.slice(0, 10)];
    const g = scenario({ hands: [hand, WINNING_13, WINNING_13, WINNING_13], wall: [T.tiao(9), T.tiao(8)] });
    g.players[0].mul = 2;
    g.act(0, { type: 'anGang', kind: T.wan(1) });
    expect(g.players[0].score).toBe(12); // 2 x 2 x 3 家
  });
});

describe('碰', () => {
  it('碰后轮到自己出牌，不补牌', () => {
    const g = scenario({
      hands: [
        [T.tiao(1), T.tiao(2), T.tiao(3), T.tiao(4), T.tiao(5), T.tiao(6), T.tong(1),
         T.tong(2), T.tong(3), T.wan(7), T.wan(8), T.wan(9), T.wan(2), T.tong(9)],
        [T.tong(9), T.tong(9), T.tiao(1), T.tiao(2), T.tiao(3), T.tiao(4), T.tiao(5),
         T.tiao(6), T.tong(1), T.tong(2), T.tong(3), T.wan(7), T.wan(8)],
        WINNING_13,
        WINNING_13,
      ],
    });
    g.act(0, { type: 'discard', kind: T.tong(9) });
    g.claim(1, { type: 'peng', kind: T.tong(9) });
    expect(g.players[1].melds[0].type).toBe('peng');
    expect(g.players[1].hand.length).toBe(11); // 3*(4-1)+2
    expect(g.turn).toBe(1);
    expect(g.phase).toBe('action');
    expect(g.drawn).toBeNull();
  });

  it('听两对时碰进后不能立刻胡，必须先出牌', () => {
    // 3 副面子 + 两对：听 9 筒或 2 万。碰掉 9 筒后牌型已成，但只能自摸，必须出牌。
    const g = scenario({
      hands: [
        [...WINNING_13, T.tong(9)],
        [
          T.tiao(1), T.tiao(2), T.tiao(3),
          T.tiao(4), T.tiao(5), T.tiao(6),
          T.wan(7), T.wan(8), T.wan(9),
          T.tong(9), T.tong(9),
          T.wan(2), T.wan(2),
        ],
        WINNING_13,
        WINNING_13,
      ],
    });
    g.act(0, { type: 'discard', kind: T.tong(9) });
    expect(g.claimOptions(1).some((a) => a.type === 'peng')).toBe(true);
    g.claim(1, { type: 'peng', kind: T.tong(9) });

    expect(g.drawn).toBeNull();
    expect(g.turn).toBe(1);
    expect(g.phase).toBe('action');
    expect(g.canHu(1)).toBe(true); // 牌型已成
    expect(g.actionOptions(1).map((a) => a.type)).not.toContain('hu');
    expect(g.act(1, { type: 'hu' })).toBe(false);
    expect(g.over).toBeNull();
    expect(g.actionOptions(1).some((a) => a.type === 'discard')).toBe(true);
  });

  it('全部过牌后轮到下一家摸牌', () => {
    const g = scenario({
      hands: [
        [...WINNING_13, T.tong(9)],
        [T.tong(9), T.tong(9), ...WINNING_13.slice(0, 11)],
        WINNING_13,
        WINNING_13,
      ],
      wall: [T.tiao(7), T.tiao(8)],
    });
    g.act(0, { type: 'discard', kind: T.tong(9) });
    expect(g.phase).toBe('claim');
    g.claim(1, { type: 'pass' });
    expect(g.turn).toBe(1);
    expect(g.phase).toBe('action');
    expect(g.drawn).toBe(T.tiao(7)); // 从牌头摸
  });
});

describe('流局', () => {
  it('牌墙摸完即流局', () => {
    const g = scenario({
      hands: [[...WINNING_13, T.tong(9)], WINNING_13, WINNING_13, WINNING_13],
      wall: [],
    });
    g.act(0, { type: 'discard', kind: T.tong(9) });
    expect(g.over).toEqual({ winner: null, reason: 'liuju' });
    expect(g.phase).toBe('over');
  });
});
