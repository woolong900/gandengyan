/**
 * 潜江晃晃的发牌。
 *
 * 牌的编号是「花色 * 10 + 点数」，和客户端 `Framework/Utils/CardUtils.js` 一致：
 *   条 1-9、筒 11-19、万 21-29、字牌 31 起（中发白东南西北）
 *
 * 2/3 人局缺一门万，只用筒条 72 张；4 人局才带上万，108 张。字牌不用。
 *
 * 癞子是开局翻一张「皮子」定的，皮子的下一张就是癞子（9 回到 1，不跨花色）。
 * 皮子从牌墙里抽出，只在左上角用 lzp / lz 显示，不再占牌墙格子，避免余牌数对不上。
 */
const TIAO = 0;
const TONG = 1;
const WAN = 2;
const crypto = require('crypto');

/** 客户端 `_parseWallData` 写死了 wall 数组要 4 个元素，两人局也一样 */
const DUN_COUNT = 4;

/**
 * 牌墙第 d 个元素画在哪个方位，由客户端 `AnalysisMsgMJ.index2Pos` 定死：0=东 1=北 2=西 3=南。
 * 不管几个人都摊成四摞，和真桌子上一样。
 *
 * 每摞最多能放多少是客户端的预制件定死的：`CardsManage3D.paiDun` 按
 * `槽位 + 1 + (34 - 墩长 - paiDunOffset())` 去找名为 card_N 的子节点，
 * 也就是「墩长 + 偏移」不能超过 34，超了算出来的下标是负的，取到 null 直接崩。
 * 潜江晃晃的 paiDunOffset 在非四人局是 8，四人局是 0：
 *   2/3 人：每摞 ≤ 26（72 张 / 4 = 18，够用）
 *   4 人：  每摞 ≤ 34（108 张 / 4 = 27，够用）
 */
/**
 * 取牌要按哪一摞的顺序走。
 *
 * 客户端把牌墙当成一个环，顺序是方位序 东→南→西→北（`_findPaiDunPointer` 和
 * `_animationPD` 都按 eDeskPos 加一走），而 wall 数组的下标经 `index2Pos` 换算是
 * 0=东 1=北 2=西 3=南。两边对上就是下面这个顺序。
 *
 * 顺序错了不会报错，但客户端会以为另一摞先被摸空，发牌动画和剩余牌墙全画歪。
 */
const DRAW_ORDER = [0, 3, 2, 1];

const buildDeck = (peopleCount) => {
  const suits = peopleCount >= 4 ? [TIAO, TONG, WAN] : [TIAO, TONG];
  const deck = [];
  for (const suit of suits) {
    for (let value = 1; value <= 9; value++) {
      for (let i = 0; i < 4; i++) deck.push(suit * 10 + value);
    }
  }
  return deck;
};

const shuffle = (cards, randomInt = crypto.randomInt) => {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

/** 同花色内的下一张，9 回到 1 */
const nextCard = (card) => {
  const suit = Math.floor(card / 10);
  const value = card % 10;
  return suit * 10 + (value === 9 ? 1 : value + 1);
};

/**
 * 发一局牌。
 *
 * 返回牌墙、每家手牌、庄家和癞子；协议层再把它拼成客户端要的 game_begin。
 * 牌摊成 4 摞，按 DRAW_ORDER 首尾相接当成一条队列，从头上依次取。
 */
/** 从存档或发牌结果拼回一面能继续摸的牌墙 */
const makeWall = ({ dun, taken, starts, sizes, total }) => {
  const wall = {
    remain: () => total - wall.taken,
    taken: taken || 0,
    draw() {
      if (wall.taken >= total) return null;
      let i = 0;
      while (i < DUN_COUNT - 1 && wall.taken >= starts[i + 1]) i += 1;
      const card = dun[i][wall.taken - starts[i]];
      wall.taken++;
      return card;
    },
    masks() {
      const masks = new Array(DUN_COUNT).fill(0);
      const wallSize = new Array(DUN_COUNT).fill(0);
      DRAW_ORDER.forEach((d, i) => {
        let mask = 0n;
        for (let n = 0; n < sizes[i]; n++) {
          if (starts[i] + n >= wall.taken) mask |= 1n << BigInt(n);
        }
        masks[d] = Number(mask);
        wallSize[d] = sizes[i];
      });
      return { wall: masks, wallSize };
    },
    dump() {
      return { dun, taken: wall.taken, starts, sizes, total };
    },
    /** 还没摸的牌，按接下来会摸到的顺序。胡牌后摊进各家弃牌河 */
    remainCards() {
      const left = [];
      let taken = wall.taken;
      let i = 0;
      while (taken < total) {
        while (i < DUN_COUNT - 1 && taken >= starts[i + 1]) i += 1;
        left.push(dun[i][taken - starts[i]]);
        taken += 1;
      }
      return left;
    },
  };
  return wall;
};

function deal(peopleCount, seatCount, dealerSeat, opts = {}) {
  // 少三张每家只发 10 张，庄家再摸一张凑 11。客户端 `handMaxLen` 就是这么改的
  const handCount = opts.handCount || 13;
  const deck = shuffle(buildDeck(peopleCount), opts.randomInt || crypto.randomInt);
  const pizi = deck.pop();
  const total = deck.length;
  const base = Math.floor(total / DUN_COUNT);
  const extra = total % DUN_COUNT;
  const sizes = Array.from({ length: DUN_COUNT }, (_, i) => base + (i < extra ? 1 : 0));
  const starts = [];
  for (let i = 0, acc = 0; i < DUN_COUNT; i++) {
    starts[i] = acc;
    acc += sizes[i];
  }

  // dun[i] 是取牌顺序里的第 i 摞，它画在 DRAW_ORDER[i] 这个位置上
  const dun = sizes.map((sz, i) => deck.slice(starts[i], starts[i] + sz));

  /**
   * 牌墙。取牌一路从队列头往后走，位图里对应的格子跟着置 0。
   * 皮子不占格子，整面墙都能摸。客户端每次摸牌都要重新收到位图。
   */
  const wall = makeWall({ dun, taken: 0, starts, sizes, total });
  const draw = () => wall.draw();

  const hands = [];
  for (let s = 0; s < seatCount; s++) hands.push([]);
  for (let round = 0; round < handCount; round++) {
    for (let s = 0; s < seatCount; s++) hands[s].push(draw());
  }
  for (const hand of hands) hand.sort((a, b) => a - b);
  const drawCard = draw();

  return {
    hands,
    drawCard,
    dealerSeat,
    pizi,
    laizi: nextCard(pizi),
    // 空数组：客户端 `_parseWallData` 只有 length===2 才把墙上那格翻成明牌
    pzPos: [],
    wall,
  };
}

/** 牌 -> 张数。下标直接用牌号，最大 29（九万），留到 40 省得越界判断 */
const toCounts = (tiles) => {
  const counts = new Array(40).fill(0);
  for (const t of tiles) counts[t]++;
  return counts;
};

/**
 * 剩下的牌能不能凑出 need 副面子（刻子或顺子），jokers 是可用的癞子数。
 *
 * 每次都从最小的那张牌下手：它必须被用掉，所以只有「和它做刻子」和
 * 「以它打头做顺子」两条路，穷举这两条就不会漏解。
 */
function canMelds(counts, jokers, need) {
  if (need === 0) return true;

  const t = counts.findIndex((v) => v > 0);
  if (t < 0) return jokers >= need * 3; // 手上没牌了，全靠癞子凑刻子

  // 刻子：用 use 张手牌 + (3-use) 张癞子
  for (let use = 3; use >= 1; use--) {
    if (counts[t] < use || jokers < 3 - use) continue;
    counts[t] -= use;
    const ok = canMelds(counts, jokers - (3 - use), need - 1);
    counts[t] += use;
    if (ok) return true;
  }

  // 顺子：t 打头，t+1 和 t+2 各自可以用手牌或癞子顶。花色不能跨，所以点数只能到 7
  const value = t % 10;
  if (value >= 1 && value <= 7) {
    for (const j1 of [0, 1]) {
      for (const j2 of [0, 1]) {
        if (jokers < j1 + j2) continue;
        if (!j1 && counts[t + 1] < 1) continue;
        if (!j2 && counts[t + 2] < 1) continue;
        counts[t] -= 1;
        counts[t + 1] -= 1 - j1;
        counts[t + 2] -= 1 - j2;
        const ok = canMelds(counts, jokers - j1 - j2, need - 1);
        counts[t] += 1;
        counts[t + 1] += 1 - j1;
        counts[t + 2] += 1 - j2;
        if (ok) return true;
      }
    }
  }

  return false;
}

/**
 * 普通胡：若干副面子 + 一对将。
 *
 * tiles 只传手上还散着的牌，碰杠过的用 melded 报个数就行。
 * 不能把碰杠的牌混进 tiles：杠是四张，但只顶一副面子，张数会算错。
 */
function canHuNormal(tiles, laizi, melded = 0, fullMelds = 4) {
  const need = fullMelds - melded;
  if (need < 0 || tiles.length !== need * 3 + 2) return false;
  const jokers = tiles.filter((t) => t === laizi).length;
  const counts = toCounts(tiles.filter((t) => t !== laizi));
  const melds = need;

  for (let t = 0; t < counts.length; t++) {
    if (counts[t] >= 2) {
      counts[t] -= 2;
      const ok = canMelds(counts, jokers, melds);
      counts[t] += 2;
      if (ok) return true;
    }
    if (counts[t] >= 1 && jokers >= 1) {
      counts[t] -= 1;
      const ok = canMelds(counts, jokers - 1, melds);
      counts[t] += 1;
      if (ok) return true;
    }
  }
  // 将牌也用两张癞子
  return jokers >= 2 && canMelds(counts, jokers - 2, melds);
}

/** 七对：14 张凑 7 对，单张用癞子配，多出来的癞子必须成双 */
function canHuQiDui(tiles, laizi) {
  if (tiles.length !== 14) return false;
  const jokers = tiles.filter((t) => t === laizi).length;
  const counts = toCounts(tiles.filter((t) => t !== laizi));
  const singles = counts.reduce((n, c) => n + (c % 2), 0);
  return jokers >= singles && (jokers - singles) % 2 === 0;
}

/** melded 是已经碰杠出去的副数；碰过杠过就不能报七对了。少三张只有三副面子，也凑不出七对 */
const canHu = (tiles, laizi, melded = 0, fullMelds = 4) =>
  canHuNormal(tiles, laizi, melded, fullMelds)
  || (melded === 0 && fullMelds === 4 && canHuQiDui(tiles, laizi));

/**
 * 双大胡：胡牌时三个朝天必须仍在手中并单独成刻，拿掉这刻后其余牌仍能胡。
 * 3455 + 5 这种朝天拆进顺子/将的，不算。
 */
function isShuangDaHu(tiles, pizi, laizi, melded = 0, fullMelds = 4) {
  if (!(pizi > 0)) return false;
  if (tiles.filter((t) => t === pizi).length < 3) return false;
  const rest = [];
  let left = 3;
  for (const t of tiles) {
    if (t === pizi && left > 0) {
      left -= 1;
      continue;
    }
    rest.push(t);
  }
  return canHu(rest, laizi, melded + 1, fullMelds);
}

/** 皮子三张就能杠（客户端 `is3CardGang` / 朝天笑），不用凑齐四张 */
const canPiziGang = (hand, pizi) => pizi > 0 && hand.filter((t) => t === pizi).length >= 3;

/** 别人打出的牌能不能碰。癞子不参与碰，得是实打实的两张 */
const canPeng = (hand, card, laizi) =>
  card !== laizi && hand.filter((t) => t === card).length >= 2;

/** 别人打出的牌能不能明杠。朝天（皮子）只要两张，凑齐墙上那张就是三张杠 */
const canMingGang = (hand, card, laizi, pizi) => {
  if (card === laizi) return false;
  const need = pizi > 0 && card === pizi ? 2 : 3;
  return hand.filter((t) => t === card).length >= need;
};

/** 手里的暗杠：四张一样的（癞子不算） */
function anGangCards(hand, laizi) {
  const counts = toCounts(hand.filter((t) => t !== laizi));
  return counts.map((c, t) => (c >= 4 ? t : -1)).filter((t) => t >= 0);
}

/** 补杠：已经碰过的那张，手里又摸到第四张 */
function buGangCards(hand, melds, laizi) {
  const pengs = melds.filter((m) => m.type === 'peng').map((m) => m.card);
  return pengs.filter((c) => c !== laizi && hand.includes(c));
}

module.exports = {
  deal,
  makeWall,
  buildDeck,
  nextCard,
  canHu,
  canHuNormal,
  canHuQiDui,
  canPeng,
  canMingGang,
  anGangCards,
  buGangCards,
  canPiziGang,
  isShuangDaHu,
};
