/**
 * 潜江晃晃的玩法配置与算分。
 *
 * 建房时客户端把一堆勾选项压进 param1/param2 两个整数里，进房又自己解回来。
 * 这里按客户端 `Framework/GameLogic/GameLogicMJ_QJHH.js` 的 `roomParam2Config`
 * 原样拆一遍，服务端才知道这局开了哪些规则。
 *
 * 番数是服务端自己的事，客户端代码里没有，所以下面这套是按常见打法定的，
 * 全集中在 FAN 一张表里，规则不一样改这里就行。
 */

/** 底分。param1 的千位是档次编号，对应客户端那张 1/2/2.5/5/10/20/25 的表 */
const BASE_SCORE = { 1: 1, 2: 2, 3: 2.5, 4: 5, 5: 10, 6: 20, 7: 25 };

/** 喜钱档次，单位是底分的倍数。0 是关闭 */
const XI_QIAN = { 0: 0, 1: 10, 2: 20, 3: 32 };

/**
 * 分数都按「十分之一底分」的整数算，回包里再带上 score_ratio=10 让客户端除回去。
 * 不这么做的话底分 2.5 会出现半分，协议里是整数装不下。
 */
const RATIO = 10;

/** 取 param 的第 n 位十进制数字 */
const digit = (value, n) => Math.floor(value / 10 ** n) % 10;

/** param2 千位：房主 / AA / 群主 / 大赢家。客户端默认勾 AA。 */
const 房费名 = [ '房主', 'AA', '群主', '大赢家' ];
const 房费位 = { 房主: 0, AA: 1, 群主: 2, 大赢家: 3 };

/**
 * 把 param1/param2 拆成玩法配置。
 * 括号里是客户端 RoomConfig 里对应的选项号，便于回查。
 */
const WANFA = { 潜江癞晃: 0, 土豪必杠: 1, 堆癞子: 2 };

/**
 * 按勾选项拼回 param1/param2。自对局和单测用，避免每次手算那串十进制位。
 * 没提到的项用潜江癞晃的常见默认：暗杠 4 倍、喜钱 10 倍、热铳、双大胡。
 */
function buildParam(opts = {}) {
  const 人数 = opts.人数 || 2;
  const 底分档 = Object.keys(BASE_SCORE).find((k) => BASE_SCORE[k] === (opts.底分 || 1)) || 1;
  const 喜钱档 = Object.keys(XI_QIAN).find((k) => Number(XI_QIAN[k]) === (opts.喜钱 ?? 10)) || 1;
  const param1 = Number(底分档) * 1000;
  const param2 = 0
    + (WANFA[opts.玩法] || 0)
    + (人数 - 2) * 10
    + (opts.暗杠倍数 === 2 ? 100 : 0)
    + (房费位[opts.房费] != null ? 房费位[opts.房费] : 1) * 1000 // 默认 AA，跟大厅 defCheck 一样
    + Number(喜钱档) * 10000
    + (opts.清一色 ? 1 : 0) * 1e5
    + (opts.少三张 ? 1 : 0) * 1e6
    + (opts.只许自摸 ? 1 : 0) * 1e7
    + (opts.热铳 === false ? 0 : 1) * 1e8
    + (opts.双大胡 === false ? 0 : 1) * 1e11
    + (opts.观战 ? 1 : 0) * 1e12;
  return { param1, param2 };
}

function parseConfig(param1, param2) {
  const 玩法 = [ '潜江癞晃', '土豪必杠', '堆癞子' ][digit(param2, 0)] || '潜江癞晃';
  return {
    玩法,
    人数: 2 + digit(param2, 1),
    // 0 是「暗杠4倍」(7)，1 是「暗杠2倍」(8)
    暗杠倍数: digit(param2, 2) === 1 ? 2 : 4,
    // 0 房主 / 1 AA / 2 群主 / 3 大赢家。群主、大赢家先按房主扣
    房费: 房费名[digit(param2, 3)] || '房主',
    // 堆癞子客户端把喜钱选项藏掉了（rejectVisible: [26]），有残留位也不算
    喜钱: 玩法 === '堆癞子' ? 0 : (XI_QIAN[digit(param2, 4)] || 0),
    清一色: digit(param2, 5) === 1, // (18)
    少三张: digit(param2, 6) === 1, // (19)
    只许自摸: digit(param2, 7) === 1, // (20)
    热铳: digit(param2, 8) === 1, // (21)
    双大胡: digit(param2, 11) === 1, // (23)
    观战: digit(param2, 12) === 1, // (24)
    底分: BASE_SCORE[digit(param1, 3)] || 1,
    // 0 是不托管 / 不踢人。超时秒数抄自客户端选项 29-32、41-43
    托管: [0, 15, 30, 60, 120][digit(param2, 14)] || 0,
    踢人: [0, 30, 60, 120][digit(param1, 0)] || 0,
  };
}

/** 建房只接受当前服务端真正实现的玩法和人数范围。 */
function validateRoomConfig({ gameType, num, param1, param2 } = {}) {
  if (Number(gameType) !== 2) return '暂不支持该玩法';
  if (!Number.isInteger(Number(num)) || Number(num) < 1 || Number(num) > 2) {
    return '局数参数无效';
  }
  if (!Number.isInteger(Number(param1)) || !Number.isInteger(Number(param2))) {
    return '玩法参数无效';
  }
  const config = parseConfig(Number(param1), Number(param2));
  if (config.人数 < 2 || config.人数 > 4) return '人数只支持 2 至 4 人';
  return null;
}

/**
 * 番数表。对照客户端规则图 `Hall/Res/Texture/Rules/desc_2_1`
 * （结算分数 = 杠牌×癞杠 + 胡牌×癞杠）。
 *
 * 胡牌：屁胡 / 软摸 底分 2 倍，黑摸 4 倍。屁胡 1 家赔，自摸 3 家赔。
 * 杠牌随「暗杠 2 倍 / 4 倍」成套：2 倍档点笑·自笑 1、黑笑 2；4 倍档点笑·自笑 2、黑笑 4。
 * 每甩一张癞子，这一笔再 ×2。四癞喜钱按房间倍数当场结，不乘癞子。
 * 热铳 / 杠上炮不另加番：只把本轮刚杠的分转给胡家，再加一笔点炮；过圈的旧杠照常进账。
 * 抢杠胡只转被抢的那笔补杠进账，不加炮。
 * 双大胡：三个朝天单独成刻且其余能胡，结算是胡分再加一笔杠（自摸暗杠，点炮朝天则点杠），胡和杠都乘癞子。
 */
const FAN = {
  黑摸: 4, // 自摸，硬胡，三家赔
  软摸: 2, // 自摸，癞子当了别的牌，三家赔
  屁胡: 2, // 点炮，一家赔
  清一色: 2,
};

/** 胡型位，和客户端 `Config/HuTypeConfig.js` 里 QJHH 那一段对上 */
const HU = {
  黑摸: 1,
  软摸: 2,
  屁胡: 4,
  双大胡: 8,
  抢杠胡: 16,
  热铳: 32,
  清一色: 64,
};

const hasBit = (mask, bit) => (mask & bit) > 0;

/** 胡这一手值几份底分。黑摸/软摸/屁胡是互斥底倍，清一色连乘。抢杠胡不加炮，双大胡走加杠。 */
function huMultiplier(huType, config) {
  if (hasBit(huType, HU.抢杠胡)) return 0;
  let mul = FAN.屁胡;
  if (hasBit(huType, HU.黑摸)) mul = FAN.黑摸;
  else if (hasBit(huType, HU.软摸)) mul = FAN.软摸;
  if (hasBit(huType, HU.清一色)) mul *= FAN.清一色;
  return mul;
}

/** 一份底分是多少个内部分值 */
const unit = (config) => Math.round(config.底分 * RATIO);

/**
 * 杠分。立刻结算，不等这局打完。
 * @returns { each, from } each 是每家要付的份数，from 只有放杠那家付
 */
function gangScore(type, config) {
  const an = config.暗杠倍数; // 2 或 4
  const half = an / 2; // 点笑、回头笑是暗杠的一半
  if (type === 'ming') return { each: 0, from: half };
  if (type === 'bu') return { each: half, from: 0 };
  return { each: an, from: 0 };
}

/**
 * 房卡：官方 QJHH `gameCountMul=8`，8 局每人 1 张、16 局每人 2 张。
 * `num` 就是档位（1=8局，2=16局）。房主支付 = 人数 × 档位；AA 每人付档位。
 * 只在第一局开打时扣，建房/进房不扣。
 */
function roomCardCost({ num, 人数, 房费 }) {
  const per = Math.max(1, Number(num) || 1);
  const people = Math.max(2, Number(人数) || 2);
  if (房费 === 'AA') return { host: 0, each: per };
  return { host: people * per, each: 0 };
}

module.exports = {
  parseConfig, validateRoomConfig, buildParam, roomCardCost,
  huMultiplier, gangScore, unit, HU, FAN, RATIO, hasBit,
};
