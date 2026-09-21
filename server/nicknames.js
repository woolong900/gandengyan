const crypto = require('crypto');

// 直接维护自然的成品昵称，避免机械地把两个词拼成清一色四字名。
// 每个基础昵称为 2–6 个汉字，分为文艺、搞笑、霸气、可爱和好运五种风格。
const GUEST_NICKNAME_STYLES = Object.freeze({
  literary: Object.freeze([
    '清欢', '听雨', '望舒', '知秋', '长安', '云归', '星野', '山岚',
    '月白', '青禾', '晚舟', '微光', '南风', '北辰', '云深', '归晚',
    '一念', '无忧', '拾光', '寻梦', '风眠', '初晴', '墨染', '青衫',
    '山有木兮', '清风徐来', '月落长安', '云间一梦', '半盏流年', '烟雨江南',
    '风月不眠', '松间明月', '一蓑烟雨', '雾隐青山', '白茶清欢', '青衫故人',
    '星河入梦', '山水有期', '人间值得', '岁月静好', '春风十里', '浮生若梦',
    '且听风吟', '一川烟草', '落日归山', '小楼听雨', '花开半夏', '远山如黛',
    '清风吹过长安', '星河落满人间', '山水不问归期', '月色温柔如水',
  ]),
  funny: Object.freeze([
    '摸鱼', '饭桶', '迷糊蛋', '小菜鸡', '显眼包', '气氛组', '划水王', '不加班',
    '我牌呢', '先吃饭', '再来一局', '胡了就跑', '摸啥来啥', '手气一般', '专治不服',
    '今天不点炮', '胡了再睡', '输了怪网卡', '不服来一局', '牌桌显眼包', '杠上不开花',
    '等等我先摸', '这牌能胡吗', '让我想一会', '牌好人更好', '路过打两把', '差点就胡了',
    '别催正在算', '我真没放水', '再输就睡觉', '摸牌全靠缘', '赢了请喝茶', '今天手气旺',
    '小熊不服输', '一碰就上头', '认真摸个鱼', '脑袋有点懵', '牌从天上来', '主打一个稳',
    '坐等好牌来', '快乐就完事', '先让我缓缓', '我还能再打', '差一张起飞', '运气加载中',
    '我与好牌无缘', '这局真的能胡', '先别催我出牌', '再输一把就睡',
  ]),
  dominant: Object.freeze([
    '无双', '战神', '天命', '龙吟', '凌云', '破晓', '惊雷', '狂澜',
    '苍穹', '逐鹿', '王者', '锋芒', '无畏', '纵横', '问鼎', '傲雪',
    '一手遮天', '横扫牌桌', '胜者为王', '傲视群雄', '牌桌霸王', '气吞山河',
    '谁与争锋', '雷霆万钧', '王者归来', '战无不胜', '逆风翻盘', '唯我独尊',
    '势不可挡', '所向披靡', '巅峰对决', '一骑绝尘', '乘风破浪', '笑傲全场',
    '落子无悔', '稳坐钓台', '乾坤在手', '风云再起', '决胜千里', '霸气登场',
    '全场都听我的', '王者从不低头', '出手就是巅峰', '今日横扫全场',
  ]),
  cute: Object.freeze([
    '团子', '桃子', '豆包', '布丁', '奶糖', '果冻', '糯米', '汤圆',
    '小鹿', '小熊', '小兔', '小猫', '小狐', '星星', '月亮', '泡泡',
    '软糖', '橘子', '栗子', '柚子', '可乐', '雪球', '小满', '朵朵',
    '奶呼呼', '甜豆豆', '小可爱', '云朵朵', '圆滚滚', '慢吞吞', '萌萌哒',
    '草莓团子', '蜜桃气泡', '奶油泡芙', '糯米团团', '小熊软糖', '元气满满',
    '甜度超标', '可爱暴击', '猫咪打盹', '兔兔出击', '抱走月亮', '揣颗星星',
    '可爱是我本体', '小熊今天很忙', '奶糖不怕输牌', '兔兔只想赢牌',
  ]),
  lucky: Object.freeze([
    '有福', '好运', '如意', '吉祥', '长乐', '顺心', '旺财', '添喜',
    '福星', '锦鲤', '鸿运', '大吉', '常胜', '开胡', '上上签', '好运来',
    '福气满满', '好运连连', '锦鲤附体', '心想事成', '万事顺意', '喜从天降',
    '开门见喜', '一路长红', '手气爆棚', '把把开胡', '好运常在', '福星高照',
    '吉星高照', '喜乐安康', '逢局必赢', '顺风顺水', '今天必胡', '好牌快来',
    '一摸就胡', '自摸小能手', '杠开好运来', '快乐常相伴', '赢个好彩头', '福气接回家',
    '好运正在路上', '今天一定会胡', '福气追着我跑', '好牌排队来找',
  ]),
});

const GUEST_BASE_NICKNAMES = Object.freeze(Object.values(GUEST_NICKNAME_STYLES).flat());
const GUEST_NICKNAME_SYMBOLS = Object.freeze(['·', '★', '☆', '丶', '°', '～', '丨', '々']);
const SYMBOL_SET = new Set(GUEST_NICKNAME_SYMBOLS);

const decorateGuestNickname = (base, randomInt = crypto.randomInt) => {
  const roll = randomInt(100);
  if (roll < 55) return base;
  const first = GUEST_NICKNAME_SYMBOLS[randomInt(GUEST_NICKNAME_SYMBOLS.length)];
  if (roll < 85) return randomInt(2) ? `${base}${first}` : `${first}${base}`;
  const second = GUEST_NICKNAME_SYMBOLS[randomInt(GUEST_NICKNAME_SYMBOLS.length)];
  return `${first}${base}${second}`;
};

const baseNicknameOf = (nickname) => Array.from(String(nickname || ''))
  .filter((character) => !SYMBOL_SET.has(character)).join('');

const mintGuestNickname = (usedNames = [], randomInt = crypto.randomInt) => {
  const used = usedNames instanceof Set ? usedNames : new Set(usedNames);
  for (let attempt = 0; attempt < 128; attempt++) {
    const base = GUEST_BASE_NICKNAMES[randomInt(GUEST_BASE_NICKNAMES.length)];
    const nickname = decorateGuestNickname(base, randomInt);
    if (!used.has(nickname)) return nickname;
  }
  // 极端碰撞时优先寻找未使用的无符号昵称；全部用完后允许重复。
  const available = GUEST_BASE_NICKNAMES.find((nickname) => !used.has(nickname));
  return available || GUEST_BASE_NICKNAMES[randomInt(GUEST_BASE_NICKNAMES.length)];
};

module.exports = {
  GUEST_NICKNAME_STYLES,
  GUEST_BASE_NICKNAMES,
  GUEST_NICKNAME_SYMBOLS,
  decorateGuestNickname,
  baseNicknameOf,
  mintGuestNickname,
};
