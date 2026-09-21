/**
 * 潜江说胡子（两副牌、四人对家）的房间配置和牌型规则。
 *
 * 客户端会把实际选中的牌和用于展示/比较的牌各传一份：
 *   gamesteps.card = realCards.concat(virtualCards)
 * 说胡子没有癞子替换，因此两份牌必须是同一组牌，只是顺序可以不同。
 */
const { randomInt } = require('crypto');

const GAME_TYPE = 17;
// 最小底分 0.1，满贯彩还有 1.5 倍；用百分之一分保存才能保持整数。
const RATIO = 100;

const TYPE = {
  ERROR: 0,
  SINGLE: 1,
  DOUBLE: 2,
  THREE: 3,
  SEQ2: 5,
  SEQ3: 6,
  WSK_TRUE: 7,
  WSK_FALSE: 8,
  BOMB: 9,
  BOMB_KING: 10,
};

const WEIGHT = {
  SINGLE: 1,
  DOUBLE: 2,
  THREE: 3,
  SEQ2: 4,
  SEQ3: 5,
  WSK_FALSE: 6,
  BOMB4_SMALL: 7,
  WSK_FANG: 8,
  WSK_MEI: 9,
  WSK_HONG: 10,
  WSK_HEI: 11,
  BOMB4_BIG: 12,
  BOMB5: 13,
  BOMB6: 14,
  BOMB7: 15,
  BOMB8: 16,
  BOMB_KING4: 17,
  BOMB8_OVER_KING: 18,
};

const digit = (value, n) => Math.floor(Number(value || 0) / 10 ** n) % 10;
const cardValue = (card) => {
  if (card === 170) return 16;
  if (card === 180) return 17;
  const value = Math.floor(card / 10);
  if (value === 1) return 14;
  if (value === 2) return 15;
  return value;
};
const cardColor = (card) => (card >= 140 ? 5 : card % 10);
const cardScore = (card) => {
  const value = cardValue(card);
  return value === 5 ? 5 : value === 10 || value === 13 ? 10 : 0;
};

const compareCard = (a, b, compareColor = false) => {
  const value = cardValue(a) - cardValue(b);
  if (value) return value;
  return compareColor ? cardColor(a) - cardColor(b) : 0;
};

const sortPut = (cards) => cards.slice().sort((a, b) => {
  const value = cardValue(a) - cardValue(b);
  return value || cardColor(b) - cardColor(a);
});

const countsByValue = (cards) => {
  const counts = new Map();
  for (const card of cards) {
    const value = cardValue(card);
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
};

const sameColor = (cards) => cards.length > 0 && cards.every((card) => cardColor(card) === cardColor(cards[0]));

function classify(cards) {
  if (!Array.isArray(cards) || !cards.length || !cards.every(Number.isInteger)) return null;
  const sorted = sortPut(cards);
  const counts = countsByValue(sorted);
  const values = [...counts.keys()].sort((a, b) => a - b);
  const length = sorted.length;

  if (length === 4 && sorted.every((card) => cardColor(card) === 5)) {
    return { type: TYPE.BOMB_KING, cards: sorted, weight: WEIGHT.BOMB_KING4, key: 17 };
  }

  const is510K = counts.get(5) === length / 3
    && counts.get(10) === length / 3
    && counts.get(13) === length / 3
    && counts.size === 3;
  if (length === 3 && is510K) {
    if (sameColor(sorted)) {
      return { type: TYPE.WSK_TRUE, cards: sorted, weight: WEIGHT.WSK_FANG + cardColor(sorted[0]) - 1, key: 5 };
    }
    return { type: TYPE.WSK_FALSE, cards: sorted, weight: WEIGHT.WSK_FALSE, key: 5 };
  }

  if (values.length === 1) {
    const key = values[0];
    if (length >= 4 && length <= 8) {
      return { type: TYPE.BOMB, cards: sorted, weight: WEIGHT.BOMB4_BIG + length - 4, key };
    }
    if (length === 1) return { type: TYPE.SINGLE, cards: sorted, weight: WEIGHT.SINGLE, key };
    if (length === 2) return { type: TYPE.DOUBLE, cards: sorted, weight: WEIGHT.DOUBLE, key };
    if (length === 3) return { type: TYPE.THREE, cards: sorted, weight: WEIGHT.THREE, key };
  }

  const consecutive = values.length > 1
    && values[0] >= 3 && values[values.length - 1] <= 14
    && values.every((value, index) => index === 0 || value === values[index - 1] + 1);
  if (consecutive && length >= 4 && length % 2 === 0 && values.every((value) => counts.get(value) === 2)) {
    return { type: TYPE.SEQ2, cards: sorted, weight: WEIGHT.SEQ2, key: values[0], span: values.length };
  }
  if (consecutive && length >= 6 && length % 3 === 0 && values.every((value) => counts.get(value) === 3)) {
    return { type: TYPE.SEQ3, cards: sorted, weight: WEIGHT.SEQ3, key: values[0], span: values.length };
  }
  return null;
}

const weightFor = (info, config) => {
  if (!info) return -1;
  if (info.type === TYPE.BOMB && info.cards.length === 4) {
    return config.真五十K大过四炸 ? WEIGHT.BOMB4_SMALL : WEIGHT.BOMB4_BIG;
  }
  if (info.type === TYPE.BOMB && info.cards.length === 8 && config.八炸大过四大天王) {
    return WEIGHT.BOMB8_OVER_KING;
  }
  return info.weight;
};

function canBeat(candidate, previous, config) {
  if (!candidate || !previous) return !!candidate;
  const common = new Set([TYPE.SINGLE, TYPE.DOUBLE, TYPE.THREE, TYPE.SEQ2, TYPE.SEQ3]);
  if (candidate.type !== previous.type && common.has(candidate.type)) return false;
  if (candidate.type === TYPE.SEQ2 && previous.type === TYPE.SEQ2) {
    // 连对只能用相同长度的连对压。两连对是潜江说胡子的特殊规则：
    // 只能逐级相邻地压，例如 5566 只能由 6677 压，7788 不能跨级压。
    if (candidate.span !== previous.span) return false;
    if (previous.span === 2) return candidate.key === previous.key + 1;
  }
  // 飞机只能用相同长度的飞机压，但可以跨点数压：
  // 888999 可以用 JJJQQQ，不要求必须 999101010。
  if (candidate.type === TYPE.SEQ3 && previous.type === TYPE.SEQ3
    && candidate.span !== previous.span) return false;
  const a = weightFor(candidate, config);
  const b = weightFor(previous, config);
  if (a !== b) return a > b;
  return candidate.key > previous.key;
}

const multisetKey = (cards) => cards.slice().sort((a, b) => a - b).join(',');
const sameCards = (a, b) => a.length === b.length && multisetKey(a) === multisetKey(b);

function parsePlay(payload) {
  if (!Array.isArray(payload) || payload.length < 2 || payload.length % 2 !== 0) {
    return { error: '出牌数据无效' };
  }
  const half = payload.length / 2;
  const real = payload.slice(0, half).map(Number);
  const virtual = payload.slice(half).map(Number);
  if (!real.every(Number.isInteger) || !virtual.every(Number.isInteger) || !sameCards(real, virtual)) {
    return { error: '出牌数据不一致' };
  }
  const info = classify(virtual);
  if (!info) return { error: '这组牌不符合说胡子牌型' };
  return { real, virtual: info.cards, info };
}

function buildDeck(remove34 = false) {
  const cards = [170, 170, 180, 180];
  for (let value = 1; value <= 13; value++) {
    if (remove34 && (value === 3 || value === 4)) continue;
    for (let color = 1; color <= 4; color++) cards.push(value * 10 + color, value * 10 + color);
  }
  return cards;
}

function shuffle(cards) {
  const out = cards.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 把指定点数的牌放进某个座位的下一局起手牌。未指定的部分仍随机，
 * 但优先用其他点数补齐，避免像“5 张 3”被随机牌又补成 6 张。
 */
function buildDeckForSeat(config, counts, targetSeat, peopleCount = 4) {
  const deck = shuffle(buildDeck(!!config.去掉34));
  const wanted = [];
  const selectedRanks = new Set();
  const entries = Object.entries(counts || {}).filter(([, count]) => Number(count) > 0);
  for (const [rank, rawCount] of entries) {
    const count = Number(rawCount);
    selectedRanks.add(rank);
    for (let n = 0; n < count; n++) {
      const index = deck.findIndex((card) => (rank === 'joker' ? card >= 170 : cardValue(card) === Number(rank)));
      if (index < 0) throw new Error(`指定的${rank === 'joker' ? '鬼牌' : rank + '点'}数量超过牌堆`);
      wanted.push(deck.splice(index, 1)[0]);
    }
  }
  const handSize = Math.floor((deck.length + wanted.length) / peopleCount);
  if (!Number.isInteger(targetSeat) || targetSeat < 0 || targetSeat >= peopleCount) throw new Error('指定玩家座位无效');
  if (wanted.length > handSize) throw new Error(`指定牌不能超过${handSize}张`);
  const preferred = [];
  const fallback = [];
  for (const card of deck) {
    const rank = card >= 170 ? 'joker' : String(cardValue(card));
    (selectedRanks.has(rank) ? fallback : preferred).push(card);
  }
  const fillerCount = handSize - wanted.length;
  const filler = preferred.splice(0, fillerCount);
  if (filler.length < fillerCount) filler.push(...fallback.splice(0, fillerCount - filler.length));
  const targetCards = shuffle(wanted.concat(filler));
  const rest = shuffle(preferred.concat(fallback));
  const arranged = [];
  let targetAt = 0;
  let restAt = 0;
  for (let index = 0; index < handSize * peopleCount; index++) {
    arranged.push(index % peopleCount === targetSeat ? targetCards[targetAt++] : rest[restAt++]);
  }
  return arranged;
}

function parseConfig(param1, param2) {
  const pay = ['房主', 'AA', '群主', '大赢家'][digit(param2, 0)] || '房主';
  return {
    人数: 4,
    房费: pay,
    底分: Number(param1 || 10) / 10 || 1,
    底子: [10, 20, 50, 100, 200][digit(param2, 8)] || 10,
    彩倍: [1, 1.5, 2][digit(param2, 4)] || 1,
    尾游捡分: digit(param2, 5) === 1,
    去掉34: digit(param2, 6) === 1,
    真五十K大过四炸: digit(param2, 3) === 1,
    八炸大过四大天王: digit(param2, 13) === 1,
    观看队友手牌: digit(param2, 7) === 1,
    语音房: digit(param2, 9) === 1,
    记牌器: digit(param2, 10) === 1,
    观战: digit(param2, 11) === 1,
    禁止互动表情: digit(param2, 12) === 1,
    托管: 0,
    踢人: [0, 30, 60, 120][digit(param2, 1)] || 0,
  };
}

function validateRoomConfig({ gameType, num, param1, param2 } = {}) {
  if (Number(gameType) !== GAME_TYPE) return '暂不支持该玩法';
  if (!Number.isInteger(Number(num)) || Number(num) < 1 || Number(num) > 4) return '局数参数无效';
  if (!Number.isInteger(Number(param1)) || ![1, 2, 5, 10, 20, 50].includes(Number(param1))) {
    return '底分参数无效';
  }
  if (!Number.isSafeInteger(Number(param2)) || Number(param2) < 0) return '玩法参数无效';
  const config = parseConfig(Number(param1), Number(param2));
  if (config.语音房) return '暂不支持语音房';
  return null;
}

function roomCardCost({ num, 人数, 房费 }) {
  const per = Math.max(1, Number(num) || 1);
  const people = Math.max(4, Number(人数) || 4);
  if (房费 === 'AA') return { host: 0, each: per };
  return { host: people * per, each: 0 };
}

const unit = (config) => Math.round(config.底分 * RATIO);

/** 为托管找一手合法牌。优先用相同牌型，找不到再用最小炸弹。 */
function candidates(hand) {
  const groups = new Map();
  for (const card of hand) {
    const value = cardValue(card);
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(card);
  }
  const out = [];
  const seen = new Set();
  const add = (cards) => {
    const info = classify(cards);
    if (!info) return;
    const key = `${info.type}:${multisetKey(cards)}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(info);
    }
  };
  for (const cards of groups.values()) {
    add(cards.slice(0, 1));
    if (cards.length >= 2) add(cards.slice(0, 2));
    if (cards.length >= 3) add(cards.slice(0, 3));
    for (let count = 4; count <= Math.min(8, cards.length); count++) add(cards.slice(0, count));
  }
  const seqValues = [...groups.keys()].filter((v) => v >= 3 && v <= 14).sort((a, b) => a - b);
  for (const width of [2, 3]) {
    for (let start = 0; start < seqValues.length; start++) {
      const cards = [];
      for (let at = start; at < seqValues.length; at++) {
        if (at > start && seqValues[at] !== seqValues[at - 1] + 1) break;
        const group = groups.get(seqValues[at]);
        if (group.length < width) break;
        cards.push(...group.slice(0, width));
        if (cards.length >= width * 2) add(cards);
      }
    }
  }
  const fives = groups.get(5) || [];
  const tens = groups.get(10) || [];
  const kings = groups.get(13) || [];
  for (const five of fives) for (const ten of tens) for (const king of kings) add([five, ten, king]);
  for (let color = 1; color <= 4; color++) {
    const five = fives.filter((c) => cardColor(c) === color).slice(0, 2);
    const ten = tens.filter((c) => cardColor(c) === color).slice(0, 2);
    const king = kings.filter((c) => cardColor(c) === color).slice(0, 2);
    if (five.length === 2 && ten.length === 2 && king.length === 2) add([...five, ...ten, ...king]);
  }
  const jokers = hand.filter((card) => cardColor(card) === 5);
  if (jokers.length >= 4) add(jokers.slice(0, 4));
  return out;
}

function findBeat(hand, previous, config) {
  const all = candidates(hand).filter((info) => !previous || canBeat(info, previous, config));
  all.sort((a, b) => weightFor(a, config) - weightFor(b, config) || a.key - b.key || a.cards.length - b.cards.length);
  return all[0] || null;
}

module.exports = {
  GAME_TYPE, RATIO, TYPE, WEIGHT,
  parseConfig, validateRoomConfig, roomCardCost, unit,
  cardValue, cardColor, cardScore, compareCard, sortPut,
  classify, canBeat, sameCards, parsePlay, buildDeck, shuffle, buildDeckForSeat, findBeat,
};
