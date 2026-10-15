/**
 * 一局牌的流程。
 *
 * 客户端房内的消息都走 proto 200（上行）和 999（下行），载荷是 { msghead, msgdata }。
 * 这里只管牌桌逻辑，收发交给外面传进来的 io。
 *
 * 上行（客户端 `Message/GameMsgMJ.js`）：
 *   gamestep {card}  出牌            gameguo {}   过
 *   gamepeng {}      碰              gamegang {card}  杠      gamehu {}  胡
 *   gamenotice {type:0}  报清一色
 *
 * 下行（客户端 `Message/AnalysisMsgMJ.js` 的 parse 分发表）：
 *   game_begin / game_draw / game_step / game_operator / game_touch / game_gang /
 *   game_pass / game_noticeqys / game_scorechange / game_end
 */
const mahjong = require('./mahjong');
const mahjongBot = require('./mahjong-bot');
const rules = require('./rules');
const { Tape, IDX, GANG, canCardsFromSelf, canCardsFromDiscard } = require('./playback');

/** 客户端 `AnalysisMsgMJ._operate` 用 view 区分杠型 */
const GANG_VIEW = { ming: 1, an: 2, bu: 3 };

const HU = rules.HU;

class Round {
  /**
   * @param seats   按座位号排好的成员，每个有 .player 和 .ws
   * @param opts    { config, dealerSeat }，config 是 rules.parseConfig 的结果
   * @param io      { each(msghead, build), all(msghead, data), one(seat, msghead, data) }
   */
  constructor(seats, opts, io) {
    this.seats = seats;
    this.io = io;
    this.config = opts.config;
    this.peopleCount = opts.config.人数;
    this.dealerSeat = opts.dealerSeat || 0;
    this.randomInt = opts.randomInt;
    this.over = false;
    this.gangs = [];
    this.hotSeat = -1;
    this.passPeng = [];
    this.passHu = [];
    this.inferredVisible = Array.from({ length: this.n }, () => new Map());
    this.drawPlan = null;
  }

  get n() {
    return this.seats.length;
  }

  uid(seat) {
    return this.seats[seat].player.uid;
  }

  seatOf(uid) {
    return this.seats.findIndex((m) => m.player.uid === uid);
  }

  next(seat) {
    return (seat + 1) % this.n;
  }

  /**
   * 这家手上还散着的牌：手牌 + 刚摸的那张（+ 别人刚打的那张，如果在问能不能吃碰胡）。
   * 碰杠过的不算在里面，胡牌判定那边按副数单算。
   */
  looseTiles(seat, extra) {
    const tiles = [...this.hands[seat]];
    if (this.drawn[seat] != null) tiles.push(this.drawn[seat]);
    if (extra != null) tiles.push(extra);
    return tiles;
  }

  /**
   * 这家算胡/碰杠时癞子还当不当万能。
   *
   * 土豪必杠：癞子不当万能，就当它自己那张牌（客户端 `_tingCards` 里 isChecked(2)）。
   * 传一个牌堆里不存在的号过去，等于这手牌没有癞子。
   */
  jokerFor(_seat) {
    if (this.config.玩法 === '土豪必杠') return -1;
    return this.laizi;
  }

  /**
   * 按当前房间规则判定一组散牌能否胡。机器人枚举假设进张时也走这里，
   * 避免服务端禁胡、机器人却仍把它当成听牌。
   */
  canHuTiles(seat, tiles, { hard = false } = {}) {
    // 潜江癞晃 / 土豪必杠：手里超过一张癞子不能听，多的得先甩。
    // 堆癞子（isChecked(26)）才允许多张癞子当万能。
    if (this.config.玩法 !== '堆癞子') {
      const n = tiles.filter((t) => t === this.laizi).length;
      if (n > 1) return false;
    }
    const joker = hard ? -1 : this.jokerFor(seat);
    const args = [tiles, joker, this.melds[seat].length, this.fullMelds];
    // 潜江癞晃和干瞪眼都没有七小对，只能按标准面子+将来胡。
    if (this.config.玩法 === '潜江癞晃' || this.config.玩法 === '土豪必杠') {
      return mahjong.canHuNormal(...args);
    }
    return mahjong.canHu(...args);
  }

  canHu(seat, extra) {
    return this.canHuTiles(seat, this.looseTiles(seat, extra));
  }

  /**
   * 硬胡：癞子只能按它本身的牌值组牌，不能代替其他牌。
   * 潜江晃晃的普通点炮、热铳和抢杠都必须硬胡；只有自摸可以用癞子代牌算软摸。
   */
  canHardHu(seat, extra) {
    const tiles = this.looseTiles(seat, extra);
    return this.canHuTiles(seat, tiles, { hard: true });
  }

  /** 全部的牌，碰杠的按实际张数摊开，只用来看清一色这类整手牌的牌型 */
  allTiles(seat) {
    const out = [...this.looseTiles(seat)];
    for (const m of this.melds[seat]) {
      const count = m.type === 'peng' || m.type === 'pizi' ? 3 : m.type === 'lzg' ? 1 : 4;
      for (let i = 0; i < count; i++) out.push(m.card);
    }
    out.push(...this.shuai[seat]);
    return out;
  }

  isQingYiSe(seat) {
    const tiles = this.allTiles(seat);
    const suit = Math.floor(tiles[0] / 10);
    return tiles.every((t) => Math.floor(t / 10) === suit);
  }

  /**
   * 胡的是什么型，见 rules.HU。
   * @param qiangGang 抢杠胡时传被抢的那张牌
   * @param from 点炮 / 抢杠那家的座位，自摸不传
   */
  huType(seat, zimo, qiangGang, from) {
    // 软摸是靠癞子万能凑成的自摸，黑摸是硬自摸。
    // 土豪必杠的癞子不当万能，算黑摸
    const joker = this.jokerFor(seat);
    let type = zimo
      ? (joker >= 0 && this.looseTiles(seat).includes(joker) ? HU.软摸 : HU.黑摸)
      : HU.屁胡;
    if (qiangGang) {
      // 抢杠只转被抢的补杠分；普通屁胡位会抢先命中原版客户端的语音。
      // 清一色、双大胡等复合胡型仍由下方独立叠加。
      type = HU.抢杠胡;
    }
    // 清一色要先报过才算，没开这个玩法就没得报
    if (this.config.清一色 && this.baoQys[seat] && this.isQingYiSe(seat)) type |= HU.清一色;
    // 热铳：笑完紧接着打出的牌被捉炮。只转本轮杠分，不另加番。
    if (this.config.热铳 && !zimo && !qiangGang && from != null && this.hotSeat === from) {
      // 胡分仍按普通点炮计，协议里的普通屁胡位会抢先匹配客户端语音。
      // 只保留热铳胡型位，复合胡型（清一色、双大胡）继续叠加。
      type = (type & ~HU.屁胡) | HU.热铳;
    }
    if (this.config.双大胡 && this.isShuangDaHu(seat)) type |= HU.双大胡;
    return type;
  }

  /** 桌上已经有朝天副露（朝天笑） */
  hasPiziKe(seat) {
    return this.melds[seat].some((m) => m.card === this.pizi && (m.type === 'pizi' || m.type === 'an' || m.type === 'ming' || m.type === 'bu'));
  }

  /**
   * 胡牌时三个朝天必须仍在手中并单独成刻，其余牌也能胡。
   * 之前已经朝天杠并放入副露区的不算双大胡。
   * 3455 + 5 这种朝天拆进顺子/将的不算。
   */
  isShuangDaHu(seat) {
    return mahjong.isShuangDaHu(
      this.looseTiles(seat),
      this.pizi,
      this.jokerFor(seat),
      this.melds[seat].length,
      this.fullMelds
    );
  }

  /** 手里的朝天刻还没杠过，终局补一笔：点炮朝天算点杠，否则算暗杠。 */
  addShuangDaHuGangs(result) {
    if (!this.config.双大胡) return;
    for (const seat of result.winners || []) {
      if (!rules.hasBit(result.huTypes[seat], HU.双大胡)) continue;
      if (this.hasPiziKe(seat)) continue;
      const dian = !result.zimo && !result.qiangGang && result.card === this.pizi;
      this.settleGang(seat, dian ? 'ming' : 'pizi', dian ? result.from : null);
    }
  }

  // ---------------------------------------------------------------- 算分

  /**
   * 把分记在账上。杠分、胡分都等终局再结，一律 silent，只由 game_end 画一次。
   * @param delta 每个座位的增减，单位是内部分值（十分之一底分）
   */
  settle(delta, why, { silent = false } = {}) {
    this.seats.forEach((m, s) => {
      m.score = (m.score || 0) + delta[s];
      this.roundScore[s] += delta[s];
    });
    const moved = delta.map((d, s) => ({ s, d })).filter((x) => x.d !== 0);
    if (moved.length === 0) return;
    this.io.log(`${why}：${moved.map((x) => `${this.uid(x.s)}${x.d > 0 ? '+' : ''}${x.d / rules.RATIO}`).join(' ')}`);
    if (silent) return;
    this.io.all('game_scorechange', {
      players: this.seats.map((m, s) => ({ uid: m.player.uid, score: delta[s], total: m.score })),
    });
  }

  /** 甩一张癞子翻一倍。堆癞子不当甩，不翻。 */
  shuaiFan(seat) {
    if (this.config.玩法 === '堆癞子') return 1;
    return 2 ** this.shuai[seat].length;
  }

  /** 一笔分涉及两家时，两边甩的癞子连乘。四癞喜钱不走这里。 */
  payFan(a, b) {
    return this.shuaiFan(a) * this.shuaiFan(b);
  }

  /** 一名玩家把四张癞子都杠出来，其余人立刻付喜钱（房间勾的倍数 × 底分） */
  paySiLaiXi(seat) {
    if (this.shuai[seat].length !== 4 || this.config.喜钱 <= 0) return;
    const xi = rules.unit(this.config) * this.config.喜钱;
    const delta = new Array(this.n).fill(0);
    for (let s = 0; s < this.n; s++) {
      if (s === seat) continue;
      delta[s] -= xi;
      delta[seat] += xi;
    }
    this.stat[seat].plyj += 1;
    this.settle(delta, `四癞喜钱 ${this.config.喜钱} 倍`);
  }

  /** 点笑 / 暗杠 / 回头笑先记账，终局按各家甩了几张癞子再算。burst 标记本轮还没过圈的杠。 */
  settleGang(seat, type, from) {
    this.clearPassed(seat);
    this.gangs.push({ seat, type, from, burst: true });
  }

  /** 这张打出没人胡，本轮杠就锁进自己账，不再算热铳。 */
  clearHot() {
    if (this.hotSeat >= 0) {
      for (const g of this.gangs) {
        if (g.seat === this.hotSeat) g.burst = false;
      }
    }
    this.hotSeat = -1;
  }

  /** 一笔杠按双方甩癞算出谁付给杠家多少 */
  gangPayments(g) {
    const one = rules.unit(this.config);
    const { each, from: fromPay } = rules.gangScore(g.type, this.config);
    const pays = [];
    if (each > 0) {
      for (let s = 0; s < this.n; s++) {
        if (s === g.seat) continue;
        pays.push({ from: s, amount: each * one * this.payFan(g.seat, s) });
      }
    } else if (g.from != null && g.from !== g.seat) {
      pays.push({ from: g.from, amount: fromPay * one * this.payFan(g.seat, g.from) });
    }
    return pays;
  }

  /** 一局结束时把记过的杠按双方甩了几张癞子再算。热铳只转本轮（burst）的杠，先前过圈的照常进账。 */
  payGangs(result = {}) {
    const huTypes = result.huTypes || {};
    const rechong = (result.winners || []).filter((s) => rules.hasBit(huTypes[s], HU.热铳));
    const qiang = result.qiangGang ? (result.winners || []) : [];
    const takers = rechong.length ? rechong : qiang;
    const hot = rechong.length ? result.from : -1;
    const delta = new Array(this.n).fill(0);
    const bits = [];
    let hotIncome = 0;
    for (const g of this.gangs) {
      const name = { ming: '点笑', an: '暗杠', bu: '回头笑', pizi: '朝天笑' }[g.type] || g.type;
      const pays = this.gangPayments(g);
      const income = pays.reduce((sum, p) => sum + p.amount, 0);
      if (g.robbed || (g.seat === hot && g.burst)) {
        hotIncome += income;
        bits.push(`${this.uid(g.seat)}${name}${g.robbed ? '抢杠转' : '热铳转'}${income / rules.RATIO}`);
      } else {
        const fans = [];
        for (const p of pays) {
          delta[p.from] -= p.amount;
          delta[g.seat] += p.amount;
          fans.push(this.payFan(g.seat, p.from));
        }
        if (pays.length) bits.push(`${this.uid(g.seat)}${name}×${fans.join('/')}`);
      }
      this.stat[g.seat][g.type === 'an' || g.type === 'pizi' ? 'ag' : 'mg'] += 1;
    }
    this.gangs = [];
    if (takers.length && hotIncome > 0) {
      const payer = result.qiangGang ? result.from : hot;
      for (const w of takers) {
        delta[payer] -= hotIncome;
        delta[w] += hotIncome;
      }
    }
    if (bits.length) this.settle(delta, `杠分 ${bits.join('、')}`, { silent: true });
    return delta;
  }

  // ---------------------------------------------------------------- 开局

  start() {
    this.fullMelds = this.config.少三张 ? 3 : 4;
    const d = mahjong.deal(this.peopleCount, this.n, this.dealerSeat, {
      handCount: this.config.少三张 ? 10 : 13,
      randomInt: this.randomInt,
    });
    this.hands = d.hands;
    this.drawn = new Array(this.n).fill(null);
    this.melds = Array.from({ length: this.n }, () => []);
    this.discards = Array.from({ length: this.n }, () => []);
    this.wall = d.wall;
    this.laizi = d.laizi;
    this.pizi = d.pizi;
    this.pzPos = d.pzPos;
    this.turn = this.dealerSeat;
    this.drawn[this.dealerSeat] = d.drawCard;
    this.pending = null;
    this.roundScore = new Array(this.n).fill(0);
    this.baoQys = new Array(this.n).fill(false);
    // 甩出去的癞子，摆在皮子/癞子杠那一溜，不算面子
    this.shuai = Array.from({ length: this.n }, () => []);
    this.gangs = [];
    this.hotSeat = -1;
    this.passPeng = Array.from({ length: this.n }, () => new Set());
    this.passHu = new Array(this.n).fill(false);
    this.inferredVisible = Array.from({ length: this.n }, () => new Map());
    this.drawPlan = null;
    // 总结算要的统计：暗杠、明杠、自摸、点炮、接炮、四癞有奖
    this.stat = Array.from({ length: this.n }, () => ({ ag: 0, mg: 0, zm: 0, dg: 0, jg: 0, plyj: 0 }));

    this.io.log(
      `开局 庄家=${this.uid(this.dealerSeat)} 皮子=${this.pizi} 癞子=${this.laizi} 余牌=${this.wall.remain()}`
    );
    for (let s = 0; s < this.n; s++) {
      const extra = s === this.dealerSeat ? ` +${d.drawCard}` : '';
      this.io.log(`  座位${s + 1} ${this.uid(s)} ${this.hands[s].join(',')}${extra}`);
    }

    this.io.each('game_begin', (seat) => this.snapshot(seat, { begin: true }));
    this.tape = new Tape();
    this.tape.begin({
      table: this.io.table || {
        gameType: 2,
        roomId: 0,
        hostUid: this.uid(this.dealerSeat),
        num: 1,
        param1: 0,
        param2: 0,
        step: 1,
      },
      seats: this.seats,
      hands: this.hands,
      dealerSeat: this.dealerSeat,
      pizi: this.pizi,
      laizi: this.laizi,
    });
    this.tape.get(this.uid(this.dealerSeat), d.drawCard);
    // 庄家开局就有 14 张，先看看能不能自摸或暗杠
    this.offerSelfOps(this.dealerSeat);
  }

  /**
   * 全量状态。game_begin 和 game_end 都用这一份，客户端 `_gameInfo` 认的就是它。
   * 手牌只对本人可见，别人那份填 0，客户端会画成牌背。
   */
  snapshot(viewer, { reveal = false, ...extra } = {}) {
    const { wall, wallSize } = this.wall.masks();
    return {
      begin: false,
      lz: this.laizi,
      lzp: this.pizi,
      pz_pos: this.pzPos,
      wall,
      wall_size: wallSize,
      cur_step: this.uid(this.turn),
      bef_step: 0,
      surplus_card: [],
      ...extra,
      info: this.seats.map((m, s) => {
        const mine = s === viewer || reveal;
        const drawn = this.drawn[s];
        return {
          uid: m.player.uid,
          // 开局后再带 ready，头像旁会一直比「OK」
          ready: false,
          total: m.score || 0,
          deal: s === this.dealerSeat,
          // num 是这家该有几张牌；比 hand_card 多的那张客户端会补成刚摸的牌
          num: this.hands[s].length + (drawn == null ? 0 : 1),
          hu_type: 0,
          razz_times: 0,
          // 牌号 → 打出这张的人。客户端拿来给点笑/碰画箭头
          operator_record: this.operatorRecord(s),
          bright_razz: false,
          bright_qys: this.baoQys[s],
          bright_jys: 0,
          bright_fys: 0,
          bright_qqr: 0,
          bright_card: false,
          card: {
            hand_card: mine ? this.hands[s] : this.hands[s].map(() => 0),
            draw_card: drawn == null ? 0 : mine ? drawn : 0,
            dis_card: this.discards[s],
            chow_card: [],
            touch_card: this.melds[s].filter((x) => x.type === 'peng').map((x) => x.card),
            mg_card: this.melds[s].filter((x) => x.type === 'ming').map((x) => x.card),
            // 朝天笑是三张皮子暗杠，客户端 is3CardGang 会在碰杠区画出三张
            ag_card: this.melds[s].filter((x) => x.type === 'an' || x.type === 'pizi').map((x) => x.card),
            bg_card: this.melds[s].filter((x) => x.type === 'bu').map((x) => x.card),
            // 甩癞子走 hzg_card，客户端按是不是癞子拆成 PiZi / LaiZi
            hzg_card: this.shuai[s],
            show_down_card: [],
          },
        };
      }),
    };
  }

  /** 碰、点笑、回头笑（补杠从碰来）都记下是谁打的，结算和重连才能画出箭头 */
  operatorRecord(seat) {
    const rec = {};
    for (const m of this.melds[seat]) {
      if (m.from == null || m.from === seat) continue;
      if (m.type === 'peng' || m.type === 'ming' || m.type === 'bu') {
        rec[m.card] = this.uid(m.from);
      }
    }
    return rec;
  }

  // ---------------------------------------------------------------- 摸牌

  /** 牌序只作用于本局，按玩家 UID 绑定，避免座位变动影响目标。 */
  setDrawPlan(uid, cards) {
    if (this.over || !this.wall) return { error: '牌局未在进行中' };
    const seat = this.seatOf(Number(uid));
    if (seat < 0) return { error: '目标玩家不在本局座位中' };
    if (!Array.isArray(cards) || cards.length < 1 || cards.length > this.wall.remain()
      || !cards.every((card) => Number.isInteger(card))) return { error: '所选牌数量或牌号无效' };
    const available = new Map();
    for (const card of this.wall.remainCards()) available.set(card, (available.get(card) || 0) + 1);
    for (const card of cards) {
      const count = available.get(card) || 0;
      if (!count) return { error: `剩余牌堆中没有足够的 ${card}` };
      available.set(card, count - 1);
    }
    this.drawPlan = { uid: Number(uid), cards: cards.slice(), total: cards.length,
      delivered: 0, createdAt: Date.now() };
    this.io.log(`后台设置摸牌顺序 uid=${uid} 牌=${cards.join(',')}`);
    return { ...this.drawPlan, cards: this.drawPlan.cards.slice() };
  }

  appendDrawCard(uid, card) {
    if (this.over || !this.wall) return { error: '牌局未在进行中' };
    const targetUid = Number(uid);
    if (this.seatOf(targetUid) < 0) return { error: '目标玩家不在本局座位中' };
    if (!Number.isInteger(card)) return { error: '牌号无效' };
    const plan = this.drawPlan;
    if (!plan || plan.uid !== targetUid) return this.setDrawPlan(targetUid, [card]);
    const remaining = this.wall.remainCards().filter((tile) => tile === card).length;
    const reserved = plan.cards.filter((tile) => tile === card).length;
    if (remaining <= reserved) return { error: `剩余牌堆中没有足够的 ${card}` };
    plan.cards.push(card);
    plan.total++;
    this.io.log(`后台追加指定摸牌 uid=${uid} 牌=${card} 待摸=${plan.cards.join(',')}`);
    return { ...plan, cards: plan.cards.slice() };
  }

  moveDrawCard(uid, from, to) {
    const plan = this.drawPlan;
    if (!plan || plan.uid !== Number(uid)) return { error: '指定摸牌顺序已变化，请刷新房间' };
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0
      || from >= plan.cards.length || to >= plan.cards.length) return { error: '牌序位置已变化，请刷新房间' };
    const [card] = plan.cards.splice(from, 1);
    plan.cards.splice(to, 0, card);
    this.io.log(`后台调整指定摸牌 uid=${uid} ${from + 1}→${to + 1} 待摸=${plan.cards.join(',')}`);
    return { ...plan, cards: plan.cards.slice() };
  }

  removeDrawCard(uid, index) {
    const plan = this.drawPlan;
    if (!plan || plan.uid !== Number(uid)) return { error: '指定摸牌顺序已变化，请刷新房间' };
    if (!Number.isInteger(index) || index < 0 || index >= plan.cards.length) {
      return { error: '牌序位置已变化，请刷新房间' };
    }
    const [card] = plan.cards.splice(index, 1);
    plan.total--;
    this.io.log(`后台删除指定摸牌 uid=${uid} 牌=${card} 待摸=${plan.cards.join(',')}`);
    if (!plan.cards.length) this.drawPlan = null;
    return this.drawPlan ? { ...plan, cards: plan.cards.slice() } : null;
  }

  clearDrawPlan() {
    const previous = this.drawPlan;
    this.drawPlan = null;
    if (previous) this.io.log(`后台取消摸牌顺序 uid=${previous.uid} 剩余=${previous.cards.join(',')}`);
    return previous;
  }

  draw(seat) {
    let card;
    const plan = this.drawPlan;
    if (plan && plan.cards.length) {
      if (this.uid(seat) === plan.uid) {
        const selected = plan.cards[0];
        card = this.wall.drawSelected(selected);
        if (card == null) {
          this.io.log(`后台摸牌顺序失效 uid=${plan.uid} 牌=${selected}`);
          this.drawPlan = null;
          card = this.wall.draw();
        } else {
          plan.cards.shift();
          plan.delivered++;
          this.io.log(`后台指定摸牌 uid=${plan.uid} 牌=${card} 进度=${plan.delivered}/${plan.total}`);
          if (!plan.cards.length) this.drawPlan = null;
        }
      } else {
        const result = this.wall.drawAvoid(plan.cards);
        card = result.card;
        if (!result.preserved) {
          this.io.log(`后台摸牌顺序提前失效 uid=${plan.uid}：剩余牌全被预留，其他玩家仍需摸牌`);
          this.drawPlan = null;
        }
      }
    } else card = this.wall.draw();
    if (card == null) return this.drawOut();

    this.clearPassed(seat);
    this.drawn[seat] = card;
    this.turn = seat;
    const { wall } = this.wall.masks();
    // 摸到的牌只有本人看得见，别人收到 0 就画一张牌背
    this.io.each('game_draw', (viewer) => ({
      uid: this.uid(seat),
      card: viewer === seat ? card : 0,
      wall,
      pz_pos: this.pzPos,
    }));
    if (this.tape) this.tape.get(this.uid(seat), card);
    this.offerSelfOps(seat);
  }

  /** 现在在等哪些座位做决定（出牌或碰杠胡）。重连和托管都靠这个 */
  waitingSeats() {
    if (this.over) return [];
    const p = this.pending;
    if (p) {
      if (p.kind === 'self') return [p.seat];
      return p.candidates.filter((c) => !p.replies.has(c.seat)).map((c) => c.seat);
    }
    return [this.turn];
  }

  /** 把刚才给这家的操作按钮再推一遍。重连进房后客户端本地是空的 */
  replayOps(seat) {
    const p = this.pending;
    if (!p || this.over) return;
    if (p.kind === 'self' && p.seat === seat) {
      this.io.one(seat, 'game_operator', {
        hu: p.hu ? this.drawn[seat] : 0,
        gang: p.gang,
        touch: 0,
        chow: [],
        bright_qys: p.qys,
      });
      return;
    }
    const cand = (p.candidates || []).find((c) => c.seat === seat);
    if (!cand || p.replies.has(seat)) return;
    if (p.kind === 'qianggang') {
      this.io.one(seat, 'game_operator', { hu: cand.hu, gang: [], touch: 0, chow: [] });
      return;
    }
    this.io.one(seat, 'game_operator', {
      hu: cand.ops.hu,
      gang: cand.ops.gang ? [p.card] : [],
      touch: cand.ops.peng ? p.card : 0,
      chow: [],
    });
  }

  automatedSeat(seat) {
    const member = this.seats[seat];
    return !!(member && (member.bot || member.managedTrustee));
  }

  /** 只为“干瞪眼（内部名：土豪必杠）＋只许自摸”的机器人或后台托管启用智能策略。 */
  smartBot(seat, policy) {
    const member = this.seats[seat];
    const eligible = !!(member && this.automatedSeat(seat)
      && this.config.玩法 === '土豪必杠'
      && this.config.只许自摸);
    if (!eligible || policy === 'legacy') return false;
    return policy === 'smart' || policy === 'smart-eager' || policy === 'jev' || policy == null;
  }

  /**
   * 托管代打。普通真人托管和其他玩法保持旧逻辑；目标干瞪眼机器人及后台白名单使用牌效策略。
   * policy 只供离线 A/B 基准显式指定 smart / legacy。
   */
  autoPlay(seat, policy) {
    if (this.over) return;
    const smart = this.smartBot(seat, policy);
    const botOptions = { shuaiMode: policy === 'smart-eager' ? 'eager' : 'dynamic' };
    const p = this.pending;
    if (p && p.kind === 'self' && p.seat === seat) {
      if (smart) {
        const action = mahjongBot.chooseSelfAction(this, seat, p, botOptions);
        return this.respond(seat, action.op, action.data || {});
      }
      if (p.hu) return this.respond(seat, 'hu');
      if (p.gang && p.gang.length > 0) return this.respond(seat, 'gang', { card: p.gang[0] });
      this.respond(seat, 'pass');
    } else if (p && p.kind === 'discard') {
      const cand = p.candidates.find((c) => c.seat === seat);
      if (cand && !p.replies.has(seat)) {
        if (smart) {
          const action = mahjongBot.chooseDiscardResponse(this, seat, p, cand, botOptions);
          return this.respond(seat, action.op, action.data || {});
        }
        if (this.humanStillDeciding(p) && this.automatedSeat(seat)) {
          return this.respond(seat, 'pass');
        }
        if (cand.ops.hu) return this.respond(seat, 'hu');
        if (cand.ops.gang) return this.respond(seat, 'gang', { card: p.card });
        if (cand.ops.peng) return this.respond(seat, 'peng');
        return this.respond(seat, 'pass');
      }
    } else if (p && p.kind === 'qianggang') {
      const cand = p.candidates.find((c) => c.seat === seat);
      if (cand && !p.replies.has(seat)) {
        if (this.humanStillDeciding(p) && this.automatedSeat(seat) && !smart) {
          return this.respond(seat, 'pass');
        }
        return this.respond(seat, cand.hu ? 'hu' : 'pass');
      }
    }
    if (this.over || this.turn !== seat) return;
    if (this.pending && !(this.pending.kind === 'self' && this.pending.seat === seat)) return;
    if (smart) {
      const card = mahjongBot.chooseDiscard(this, seat, botOptions);
      if (card != null) this.discard(seat, card);
      return;
    }
    const drawn = this.drawn[seat];
    const loose = this.looseTiles(seat);
    const dumpJoker = this.automatedSeat(seat)
      && loose.includes(this.laizi)
      // 牌墙空时只放行终局的“手里刚好两张癞子”；否则先打普通牌。
      && (this.wall.remain() > 0
        || (loose.length === 2 && loose.every((tile) => tile === this.laizi)));
    const card = dumpJoker
      ? this.laizi
      : (drawn != null && drawn !== this.laizi)
        ? drawn
        : (this.hands[seat].find((c) => c !== this.laizi) || this.hands[seat][0] || drawn);
    if (card != null) this.discard(seat, card);
  }

  /**
   * 立即发起 Jev 决策，但不在 Promise 返回时直接落子。Table 会在随机表现时间
   * 到期后调用 applyPreparedAutoPlayJev；若届时请求未完成，则改用本地策略。
   */
  prepareAutoPlayJev(seat, jevBot) {
    if (this.over || !this.smartBot(seat, 'jev') || !jevBot) return null;
    const pending = this.pending;
    const turn = this.turn;
    const handSignature = this.looseTiles(seat).slice().sort((a, b) => a - b).join(',');
    const prepared = { seat, pending, turn, handSignature, kind: '', promise: null };

    if (pending && pending.kind === 'self' && pending.seat === seat) {
      prepared.kind = 'response';
      if (pending.hu) prepared.promise = Promise.resolve({ op: 'hu', data: {} });
      else if ((pending.gang || []).includes(this.pizi)) {
        prepared.promise = Promise.resolve({ op: 'gang', data: { card: this.pizi } });
      }
      else {
      const fallback = mahjongBot.chooseSelfAction(this, seat, pending);
        prepared.promise = jevBot.chooseSelfAction(this, seat, pending, fallback);
      }
      return prepared;
    }

    if (pending && pending.kind === 'discard') {
      const candidate = pending.candidates.find((item) => item.seat === seat);
      if (!candidate || pending.replies.has(seat)) return null;
      prepared.kind = 'response';
      if (candidate.ops.hu) prepared.promise = Promise.resolve({ op: 'hu', data: {} });
      else if (candidate.ops.gang) {
        prepared.promise = Promise.resolve({ op: 'gang', data: { card: pending.card } });
      }
      else {
        const fallback = mahjongBot.chooseDiscardResponse(this, seat, pending, candidate);
        prepared.promise = jevBot.chooseDiscardResponse(this, seat, pending, candidate, fallback);
      }
      return prepared;
    }

    if (pending && pending.kind === 'qianggang') {
      const candidate = pending.candidates.find((item) => item.seat === seat);
      if (candidate && !pending.replies.has(seat)) {
        prepared.kind = 'response';
        prepared.promise = Promise.resolve({ op: candidate.hu ? 'hu' : 'pass', data: {} });
        return prepared;
      }
      return null;
    }

    if (this.turn !== seat || (pending && !(pending.kind === 'self' && pending.seat === seat))) return null;
    const rankedOptions = mahjongBot.rankDiscardOptions(this, seat, { limit: 4 });
    const fallbackCard = rankedOptions[0] && rankedOptions[0].card;
    if (fallbackCard == null) return null;
    prepared.kind = 'discard';
    prepared.promise = jevBot.chooseDiscard(this, seat, fallbackCard, rankedOptions);
    return prepared;
  }

  applyPreparedAutoPlayJev(prepared, decision) {
    if (!prepared || prepared.seat == null || this.over) return false;
    const seat = prepared.seat;
    const stillCurrent = this.automatedSeat(seat)
      && this.pending === prepared.pending
      && this.turn === prepared.turn
      && this.looseTiles(seat).slice().sort((a, b) => a - b).join(',') === prepared.handSignature;
    if (!stillCurrent) return false;
    if (prepared.kind === 'response') {
      if (prepared.pending && prepared.pending.replies && prepared.pending.replies.has(seat)) return false;
      this.respond(seat, decision.op, decision.data || {});
      return true;
    }
    if (prepared.kind === 'discard' && this.looseTiles(seat).includes(decision)) {
      this.discard(seat, decision);
      return true;
    }
    return false;
  }

  /** 保留直接调用入口，供测试和其他服务端调用者使用。 */
  async autoPlayJev(seat, jevBot) {
    const prepared = this.prepareAutoPlayJev(seat, jevBot);
    if (!prepared) return this.autoPlay(seat);
    const decision = await prepared.promise;
    return this.applyPreparedAutoPlayJev(prepared, decision);
  }

  /**
   * 摸牌之后自己能做的：自摸、暗杠、补杠、皮子杠，外加报清一色。
   * 碰完也会走到这里，但那时张数刚好能骗过胡牌判定，所以 allowHu 得关。
   */
  offerSelfOps(seat, { allowHu = true } = {}) {
    const tiles = this.looseTiles(seat);
    const hu = allowHu && this.canHu(seat);
    const lz = this.jokerFor(seat);
    // 普通暗杠和补杠必须有牌可以补；朝天笑不补牌，牌墙摸完后仍可以杠。
    const gang = [];
    if (this.wall.remain() > 0) {
      gang.push(
        ...mahjong.anGangCards(tiles, lz).filter((c) => c !== this.pizi && c !== this.laizi),
        ...mahjong.buGangCards(tiles, this.melds[seat], lz).filter((c) => c !== this.laizi),
      );
    }
    // 皮子三张就能杠，别跟普通暗杠抢同一张
    if (mahjong.canPiziGang(tiles, this.pizi)) gang.push(this.pizi);
    // 报清一色：开了这个玩法、还没报过，而且手上确实只有一门
    const qys = this.config.清一色 && !this.baoQys[seat] && this.isQingYiSe(seat);

    if (!hu && gang.length === 0 && !qys) return; // 没得选，直接等他出牌

    // allowHu 需跟着 pending 保留：碰完后可以报清一色，但报完仍然不能
    // 把刚才的弃牌当成“自摸”。
    this.pending = { kind: 'self', seat, hu, gang, qys, allowHu };
    const payload = {
      hu: hu ? this.drawn[seat] : 0,
      gang,
      touch: 0,
      chow: [],
      bright_qys: qys,
    };
    this.io.one(seat, 'game_operator', payload);
    if (this.tape) this.tape.can([{ uid: this.uid(seat), cards: canCardsFromSelf(payload) }]);
  }

  // ---------------------------------------------------------------- 出牌

  discard(seat, card) {
    if (this.over) return '这局已经结束了';
    if (this.turn !== seat) return '还没轮到你';
    // 正在等别人碰杠胡的时候，出牌的那家不能抢着再打一张。
    // 轮到自己摸完牌的那种等待是可以直接出牌的，等于选了「过」。
    if (this.pending && !(this.pending.kind === 'self' && this.pending.seat === seat)) {
      return '还在等别人决定要不要碰杠胡';
    }

    // 癞子平时能打，打出去客户端按「甩癞子」播动画。
    // 拦的是牌墙空了还甩：`canPut` 只在 `paiDunRemain()<=0` 时进来，
    // 手里还有别的牌就不让打，免得最后一张把癞子扔了。
    if (card === this.laizi && this.wall.remain() <= 0) {
      const loose = this.looseTiles(seat);
      const lastTwoLaizi = loose.length === 2 && loose.every((t) => t === this.laizi);
      if (!lastTwoLaizi) return '牌墙空了，癞子不能打';
    }

    // 打的可能是刚摸的那张，也可能是手里原有的（那就把摸的那张并进手牌）。
    if (this.drawn[seat] === card) {
      this.drawn[seat] = null;
    } else {
      const i = this.hands[seat].indexOf(card);
      if (i < 0) return `手里没有这张牌 ${card}`;
      this.hands[seat].splice(i, 1);
      if (this.drawn[seat] != null) {
        this.hands[seat].push(this.drawn[seat]);
        this.drawn[seat] = null;
      }
    }
    this.hands[seat].sort((a, b) => a - b);
    this.pending = null;

    // 潜江癞晃 / 土豪必杠：打出癞子是「甩癞子」。
    // 必须先推 game_step：客户端出牌时会记下 putCardVirtual，只收 game_lzg
    // 清不掉它，下一手别人出牌就会判数据对不上，整桌「正在重连」。
    // game_step 里癞子是 isGangCard，不会进弃牌河；再推 game_lzg 摆到癞子杠那一溜。
    // 堆癞子不当甩，按普通出牌走。
    if (this.config.玩法 !== '堆癞子' && card === this.laizi) {
      this.shuai[seat].push(card);
      this.io.all('game_step', { uid: this.uid(seat), card });
      this.io.all('game_lzg', { uid: this.uid(seat), card });
      if (this.tape) {
        this.tape.put(this.uid(seat), card);
        this.tape.append([{ uid: this.uid(seat), index: IDX.LAIZI, cards: [card] }]);
      }
      // 四张癞子都杠出来，开了喜钱就当场结
      this.paySiLaiXi(seat);
      // 杠癞子是杠，自己补牌，不是出牌让下家摸
      this.draw(seat);
      return null;
    }

    this.discards[seat].push(card);
    this.io.all('game_step', { uid: this.uid(seat), card });
    if (this.tape) this.tape.put(this.uid(seat), card);
    this.afterDiscard(seat, card);
    return null;
  }

  /** 别人打出一张牌之后，问一圈谁要碰杠胡 */
  afterDiscard(from, card) {
    const candidates = [];
    for (let s = 0; s < this.n; s++) {
      if (s === from) continue;
      const gang = (this.wall.remain() > 0 || card === this.pizi)
        && mahjong.canMingGang(this.hands[s], card, this.jokerFor(s), this.pizi);
      const ops = {
        hu: this.discardHu(s, card, from),
        // 土豪必杠癞子当普通牌，可以碰杠；另外两种癞子不参与碰杠。
        // 过手碰：能碰却过了，摸 / 碰 / 杠之前不能再碰同一张
        // 两张皮子接别人打出的皮子时是朝天，不能再让玩家退回普通碰。
        peng: mahjong.canPeng(this.hands[s], card, this.jokerFor(s))
          && !this.passPeng[s].has(card)
          && !(card === this.pizi && gang),
        gang,
      };
      if (ops.hu || ops.peng || ops.gang) candidates.push({ seat: s, ops });
    }

    if (candidates.length === 0) {
      this.clearHot();
      return this.draw(this.next(from));
    }

    // 只许自摸时，出牌后下家没有立即摸牌，整桌都能无歧义地
    // 解读为“有人能碰/杠”。因此所有机器人都应记住这个公开信号，
    // 但被询问碰/杠的机器人已能从自己手牌得到更准确的数量，不再重复推断。
    // 允许点炮的玩法中还可能是别家在考虑胡，不能借服务端暗手误推。
    const timingInferenceEnabled = this.config.玩法 === '土豪必杠' && this.config.只许自摸;
    if (timingInferenceEnabled) {
      const decidingSeats = new Set(candidates
        .filter((candidate) => candidate.ops.peng || candidate.ops.gang)
        .map((candidate) => candidate.seat));
      for (let observer = 0; observer < this.n; observer++) {
        const member = this.seats[observer];
        if (member && this.automatedSeat(observer) && !decidingSeats.has(observer)) {
          mahjongBot.noteDiscardWaitInference(this, observer, card);
        }
      }
    }

    this.pending = { kind: 'discard', from, card, candidates, replies: new Map() };
    const cans = [];
    for (const c of candidates) {
      this.io.one(c.seat, 'game_operator', {
        hu: c.ops.hu,
        gang: c.ops.gang ? [card] : [],
        touch: c.ops.peng ? card : 0,
        chow: [],
      });
      const cards = canCardsFromDiscard(c.ops);
      if (cards.length) cans.push({ uid: this.uid(c.seat), cards });
    }
    if (this.tape) this.tape.can(cans);
  }

  // ---------------------------------------------------------------- 应答

  /** 客户端回的 gameguo / gamepeng / gamegang / gamehu 都走这里 */
  respond(seat, op, data = {}) {
    const p = this.pending;
    if (!p) return '现在没有等你的操作';

    if (p.kind === 'self') {
      if (p.seat !== seat) return '不是在等你';
      // 客户端发什么都得对着刚才给它的选项核一遍，不能它说胡就胡
      if (op === 'hu') {
        if (!p.hu) return '你这牌胡不了';
        if (this.drawn[seat] == null) return '没有摸牌，不能自摸';
        return this.win(seat, this.drawn[seat], null);
      }
      if (op === 'gang') {
        if (this.wall.remain() <= 0 && data.card !== this.pizi) return '牌墙空了，不能杠';
        if (!p.gang.includes(data.card)) return `${data.card} 杠不了`;
        return this.selfGang(seat, data.card);
      }
      if (op === 'qys') {
        if (!p.qys) return '这手牌报不了清一色';
        return this.baoQingYiSe(seat);
      }
      // 过：清掉选项，等他自己出牌
      this.pending = null;
      this.io.all('game_pass', { uid: this.uid(seat) });
      return null;
    }

    if (p.kind === 'qianggang') {
      const c = p.candidates.find((x) => x.seat === seat);
      if (!c) return '不是在等你';
      if (op === 'hu' && !c.hu) return '你这牌胡不了';
      p.replies.set(seat, op);
      if (p.candidates) {
        for (const c of p.candidates) {
          if (p.replies.has(c.seat)) continue;
          const m = this.seats[c.seat];
          if (m && this.automatedSeat(c.seat) && !this.smartBot(c.seat)) p.replies.set(c.seat, 'pass');
        }
      }
      if (!this.allHuAnswered(p)) return null;
      return this.resolveQiangGang();
    }

    const cand = p.candidates.find((c) => c.seat === seat);
    if (!cand) return '不是在等你';
    if (op === 'hu' && !cand.ops.hu) return '你这牌胡不了';
    if (op === 'peng' && !cand.ops.peng) return '碰不了';
    if (op === 'gang' && this.wall.remain() <= 0 && p.card !== this.pizi) {
      return '牌墙空了，不能杠';
    }
    if (op === 'gang' && !cand.ops.gang) return '杠不了';
    p.replies.set(seat, { op, data });
    this.passBotsOnDiscard(p);

    // 胡最大，但一炮多响要等所有能胡的人表态，不能第一个喊胡就结算
    if (this.allHuAnswered(p)) return this.resolveDiscard();
    return null;
  }

  humanStillDeciding(p) {
    return !!(p && p.candidates && p.candidates.some((c) => {
      const m = this.seats[c.seat];
      return m && !this.automatedSeat(c.seat) && !m.view && !p.replies.has(c.seat);
    }));
  }

  /**
   * 真人已经表态时，旧策略陪玩没回的当过。
   * 目标干瞪眼的智能机器人必须保留自己的碰/杠决策，不能被真人的回复代替。
   */
  passBotsOnDiscard(p) {
    if (!p || !p.candidates) return;
    for (const c of p.candidates) {
      if (p.replies.has(c.seat)) continue;
      const m = this.seats[c.seat];
      if (m && this.automatedSeat(c.seat) && !this.smartBot(c.seat)) {
        p.replies.set(c.seat, { op: 'pass', data: {} });
      }
    }
  }

  /**
   * 一炮多响：能胡的人都表态了才能结算。
   * 有人胡就不用再等碰杠；能胡的都过了，还得等剩下要碰杠的人。
   */
  allHuAnswered(p) {
    const huCands = p.kind === 'qianggang'
      ? p.candidates.filter((c) => c.hu)
      : p.candidates.filter((c) => c.ops.hu);
    if (huCands.some((c) => !p.replies.has(c.seat))) return false;
    const anyoneHu = huCands.some((c) => {
      const r = p.replies.get(c.seat);
      return p.kind === 'qianggang' ? r === 'hu' : r && r.op === 'hu';
    });
    if (anyoneHu) return true;
    return p.replies.size >= p.candidates.length;
  }

  /** 按 胡 > 杠 > 碰 的优先级结算这一轮抢牌。胡的人可以有多个（一炮多响）。 */
  resolveDiscard() {
    const p = this.pending;
    const pick = (want) => {
      for (const c of p.candidates) {
        const r = p.replies.get(c.seat);
        if (r && r.op === want) return c.seat;
      }
      return -1;
    };

    const winners = p.candidates
      .filter((c) => {
        const r = p.replies.get(c.seat);
        return r && r.op === 'hu';
      })
      .map((c) => c.seat);
    if (winners.length > 0) {
      this.noteMissedHu(p);
      this.noteMissedPeng(p, -1);
      this.pending = null;
      return this.winMany(winners, p.card, p.from);
    }

    this.clearHot();
    const ganger = pick('gang');
    if (ganger >= 0) {
      this.noteMissedHu(p);
      this.noteMissedPeng(p, -1);
      this.pending = null;
      return this.takeGang(ganger, p.card, p.from);
    }

    const penger = pick('peng');
    if (penger >= 0) {
      this.noteMissedHu(p);
      this.noteMissedPeng(p, penger);
      this.pending = null;
      return this.takePeng(penger, p.card, p.from);
    }

    this.noteMissedHu(p);
    this.noteMissedPeng(p, -1);

    // 全都过了，下家摸牌
    this.pending = null;
    for (const c of p.candidates) this.io.all('game_pass', { uid: this.uid(c.seat) });
    this.draw(this.next(p.from));
    return null;
  }

  // ---------------------------------------------------------------- 碰杠

  remove(seat, card, count) {
    for (let i = 0; i < count; i++) {
      const at = this.hands[seat].indexOf(card);
      if (at < 0) return false;
      this.hands[seat].splice(at, 1);
    }
    return true;
  }

  /** 碰、点笑把河牌里那张拿走，不然快照会把它画回去 */
  popRiver(from, card) {
    const river = this.discards[from];
    const i = river.lastIndexOf(card);
    if (i >= 0) river.splice(i, 1);
  }

  /** 摸 / 碰 / 杠都算过手，碰和胡的过手锁一起解开 */
  clearPassed(seat) {
    this.passPeng[seat].clear();
    this.passHu[seat] = false;
  }

  isHotDiscard(from) {
    return this.config.热铳 && this.hotSeat === from;
  }

  /**
   * 别人打出的牌能不能问点炮。
   * 勾选只许自摸后，普通点炮和热铳都不问；未勾选时两个玩法都能接炮。
   * 过胡锁的是整门听口：过了 5 筒，8 筒没过手也不能胡。热铳能破这道锁。
   */
  discardHu(seat, card, from) {
    const hot = this.isHotDiscard(from);
    if (this.config.只许自摸) return 0;
    if (!this.canHardHu(seat, card)) return 0;
    if (this.passHu[seat] && !hot) return 0;
    return card;
  }

  /** 能碰却没碰的那张，过手（摸 / 碰 / 杠）之前不能再碰 */
  noteMissedPeng(p, penger) {
    for (const c of p.candidates) {
      if (c.ops.peng && c.seat !== penger) this.passPeng[c.seat].add(p.card);
    }
  }

  /** 能胡却没胡，整门听口锁到过手。热铳仍可破锁，所以过热铳也记 */
  noteMissedHu(p) {
    for (const c of p.candidates) {
      const offered = p.kind === 'qianggang' ? c.hu : c.ops.hu;
      if (!offered) continue;
      const r = p.replies.get(c.seat);
      const didHu = p.kind === 'qianggang' ? r === 'hu' : r && r.op === 'hu';
      if (!didHu) this.passHu[c.seat] = true;
    }
  }

  takePeng(seat, card, from) {
    this.clearPassed(seat);
    if (!this.remove(seat, card, 2)) return '手里凑不够两张';
    this.popRiver(from, card);
    this.melds[seat].push({ type: 'peng', card, from });
    this.turn = seat;
    this.io.all('game_touch', { uid: this.uid(seat), card, view: 0, from: this.uid(from) });
    if (this.tape) this.tape.op(this.uid(seat), IDX.PENG, [card]);
    // 碰完张数刚好能骗过胡牌判定，只问报清一色，不能让他直接胡
    this.offerSelfOps(seat, { allowHu: false });
    return null;
  }

  takeGang(seat, card, from) {
    const isPizi = card === this.pizi;
    if (this.wall.remain() <= 0 && !isPizi) return '牌墙空了，不能杠';
    const take = isPizi ? 2 : 3;
    if (!this.remove(seat, card, take)) return '手里凑不够杠';
    this.clearPassed(seat);
    this.popRiver(from, card);
    this.melds[seat].push({ type: 'ming', card, from });
    this.turn = seat;
    this.io.all('game_gang', { uid: this.uid(seat), card, view: GANG_VIEW.ming, from: this.uid(from) });
    if (this.tape) this.tape.op(this.uid(seat), IDX.GANG, [card, GANG.ming]);
    this.io.each('game_info', (viewer) => this.snapshot(viewer, { begin: true }));
    this.settleGang(seat, 'ming', from);
    // 别人打出一张皮子、手里拿两张组成的朝天本身已经补齐了出牌张数，
    // 再从牌墙补一张会多牌。保持本人出牌权，直接等他出牌。
    if (isPizi) {
      this.drawn[seat] = null;
      this.hotSeat = seat;
      return null;
    }
    this.afterGang(seat);
    return null;
  }

  selfGang(seat, card) {
    const isBu = this.melds[seat].some((m) => m.type === 'peng' && m.card === card);
    if (!isBu) return this.doSelfGang(seat, card, false);

    // 回头笑：先把第四张放到杠堆。只有未勾“只许自摸”且勾了“热铳”时才可抢杠。
    const err = this.applySelfGang(seat, card, true);
    if (err) return err;
    if (this.config.只许自摸 || !this.config.热铳) {
      this.pending = null;
      this.afterGang(seat);
      return null;
    }
    const candidates = [];
    for (let s = 0; s < this.n; s++) {
      if (s !== seat && this.canHardHu(s, card) && !this.passHu[s]) {
        candidates.push({ seat: s, hu: card });
      }
    }
    if (candidates.length > 0) {
      this.pending = { kind: 'qianggang', seat, card, candidates, replies: new Map() };
      const cans = [];
      for (const c of candidates) {
        this.io.one(c.seat, 'game_operator', { hu: card, gang: [], touch: 0, chow: [] });
        cans.push({ uid: this.uid(c.seat), cards: [IDX.HU] });
      }
      if (this.tape) this.tape.can(cans);
      return null;
    }
    this.pending = null;
    this.afterGang(seat);
    return null;
  }

  /** 把杠落到面子上并通知客户端，先不补牌 */
  applySelfGang(seat, card, isBu) {
    const isPizi = !isBu && card === this.pizi;
    if (this.wall.remain() <= 0 && !isPizi) return '牌墙空了，不能杠';
    this.hands[seat] = this.looseTiles(seat);
    this.drawn[seat] = null;

    if (!isBu && card === this.laizi) return '癞子不能暗杠';
    const take = isBu ? 1 : isPizi ? 3 : 4;
    if (!this.remove(seat, card, take)) return '凑不够杠';

    if (isBu) {
      const meld = this.melds[seat].find((m) => m.type === 'peng' && m.card === card);
      meld.type = 'bu';
    } else if (isPizi) {
      this.melds[seat].push({ type: 'pizi', card, from: seat });
    } else {
      this.melds[seat].push({ type: 'an', card, from: seat });
    }
    // 朝天笑也走 game_gang，客户端按皮子画三张到碰杠区；game_pzg 会把单张丢进癞子区
    this.io.all('game_gang', {
      uid: this.uid(seat),
      card,
      view: isBu ? GANG_VIEW.bu : GANG_VIEW.an,
    });
    if (this.tape) {
      if (isPizi) this.tape.op(this.uid(seat), IDX.PIZI, [card]);
      else this.tape.op(this.uid(seat), IDX.GANG, [card, isBu ? GANG.bu : GANG.an]);
    }
    this.settleGang(seat, isBu ? 'bu' : isPizi ? 'pizi' : 'an', null);
    return null;
  }

  doSelfGang(seat, card, isBu) {
    const err = this.applySelfGang(seat, card, isBu);
    if (err) return err;
    this.pending = null;
    // 朝天笑是三张皮子直接成副露，不从牌墙补牌；玩家仍保持当前出牌权。
    // 它仍属于一笔杠，所以紧接着打出的牌可以触发热铳。
    if (!isBu && card === this.pizi) {
      this.hotSeat = seat;
      return null;
    }
    this.afterGang(seat);
    return null;
  }

  /** 回头笑已经上桌。有人胡就按抢杠胡算（杠牌留在桌上，补杠进账转给胡家，不加炮）；没人抢再补牌 */
  resolveQiangGang() {
    const p = this.pending;
    const winners = p.candidates
      .filter((c) => p.replies.get(c.seat) === 'hu')
      .map((c) => c.seat);
    this.noteMissedHu(p);
    this.pending = null;
    if (winners.length > 0) {
      const gi = this.gangs.findLastIndex((g) => g.seat === p.seat && g.type === 'bu');
      if (gi >= 0) this.gangs[gi].robbed = true;
      return this.winMany(winners, p.card, p.seat, { qiangGang: true });
    }
    this.io.all('game_pass', { uid: this.uid(p.seat) });
    return this.afterGang(p.seat);
  }

  // ---------------------------------------------------------------- 亮牌与报警

  /** 报清一色。不报的话结算时不算这个胡型 */
  baoQingYiSe(seat) {
    const allowHu = !!(this.pending && this.pending.kind === 'self' && this.pending.allowHu);
    this.baoQys[seat] = true;
    this.pending = null;
    this.io.log(`${this.uid(seat)} 报清一色`);
    this.io.all('game_noticeqys', { uid: this.uid(seat), card: [] });
    if (this.tape) this.tape.op(this.uid(seat), IDX.WARN_QYS, []);
    this.offerSelfOps(seat, { allowHu });
    return null;
  }

  /** 杠完要补一张。下一张打出被捉炮就是热铳。 */
  afterGang(seat) {
    this.hotSeat = seat;
    this.draw(seat);
  }

  // ---------------------------------------------------------------- 收局

  win(seat, card, from, opts = {}) {
    return this.winMany([seat], card, from, opts);
  }

  /** 一炮多响：同一张点炮/抢杠，多家同时胡 */
  winMany(seats, card, from, opts = {}) {
    const zimo = from == null;
    const huTypes = {};
    for (const seat of seats) {
      if (this.drawn[seat] != null) {
        this.hands[seat].push(this.drawn[seat]);
        this.drawn[seat] = null;
      } else if (from != null) {
        this.hands[seat].push(card);
      }
      this.hands[seat].sort((a, b) => a - b);
      huTypes[seat] = this.huType(seat, zimo, opts.qiangGang, from);
    }
    this.over = true;

    const how = zimo ? '自摸' : opts.qiangGang ? `抢 ${this.uid(from)} 的杠` : `胡 ${this.uid(from)} 打的`;
    for (const seat of seats) {
      this.io.log(`${this.uid(seat)} ${how} ${card}（胡型 ${huTypes[seat]}）`);
      // 回放客户端把 cards[1] 当作胡型位集，用它选黑摸、软摸、
      // 抢杠胡、热铳等专用语音。写 0 会全部退化成默认“胡”。
      if (this.tape) this.tape.op(this.uid(seat), IDX.HU, [card, huTypes[seat]]);
    }
    this.end({
      winners: seats,
      winner: seats[0],
      card,
      from,
      zimo,
      huTypes,
      huType: huTypes[seats[0]],
      qiangGang: !!opts.qiangGang,
    });
    return null;
  }

  /** 一炮多响坐庄：放炮者下家起，第一个胡的人坐庄。自摸就赢家坐庄。 */
  nextDealerSeat(winners, from, zimo) {
    if (!winners.length) return this.dealerSeat;
    if (zimo || from == null) return winners[0];
    for (let i = 1; i <= this.n; i++) {
      const s = (from + i) % this.n;
      if (winners.includes(s)) return s;
    }
    return winners[0];
  }

  drawOut() {
    this.over = true;
    this.io.log('牌摸完了，流局');
    this.end({ winner: -1 });
  }

  /**
   * 单局结算。客户端 `_gameInfo(e, true, false)` 会拿 info[] 里的 score 摆结算面板，
   * 所以这里要把每家的分算好，并且把所有人的手牌都亮出来。
   */
  end(result) {
    const winners = result.winners || (result.winner >= 0 ? [result.winner] : []);
    if (!result.huTypes && result.huType != null && result.winner >= 0) {
      result.huTypes = { [result.winner]: result.huType };
    }
    result.winners = winners;
    result.nextDealer = this.nextDealerSeat(winners, result.from, result.zimo);
    this.addShuangDaHuGangs(result);
    this.payGangs(result);
    if (winners.length) this.payHu(result);

    // 点炮那家是谁客户端看 bef_step，被抢杠的那家看 cur_step，
    // 结算面板上的「点炮」「被抢杠」两个标就是这么认人的
    const extra = {
      reveal: true,
      hz: winners.length === 0,
      cur_step: winners.length === 0 ? 0 : this.uid(result.qiangGang ? result.from : winners[0]),
      bef_step: winners.length > 0 && !result.zimo && !result.qiangGang ? this.uid(result.from) : 0,
      // 客户端 `_parseSurplusCard`：从 cur_step 下家起轮流摊到弃牌河，带灰色遮罩
      surplus_card: winners.length ? this.wall.remainCards() : [],
    };

    this.io.each('game_end', (viewer) => {
      const snap = this.snapshot(viewer, extra);
      snap.info.forEach((it, s) => {
        // 杠分胡分都在终局才入账，结算条画这一局的合计
        it.score = this.roundScore[s];
        it.total = this.seats[s].score || 0;
        const huType = winners.includes(s) ? (result.huTypes[s] || 0) : 0;
        it.hu_type = huType;
        // winMany 为了算胡型会把自摸/点炮的胡牌并入手牌并排序，
        // 但客户端终局界面依赖 draw_card 识别和单独摆放真正的胡牌。
        // hand_card 必须继续保留完整的终局手牌；draw_card 只是胡牌标记，
        // 不能从 hand_card 删牌，否则部分 3D 布局不会把它补回。
        if (huType && result.card > 0) it.card.draw_card = result.card;
        // bet_score 会显示成结算面板上的倍数
        it.bet_score = huType ? rules.huMultiplier(huType, this.config) * this.shuaiFan(s) : 0;
        // 结算后必须是没准备。客户端 3D 的「下一局」只在 !isReady() 时出现，
        // 开局快照里的 ready:true 如果带到 game_end，按钮就不会出来。
        it.ready = false;
      });
      return snap;
    });
    this.io.over({ ...result, stat: this.stat, scores: this.roundScore });
  }

  /**
   * 胡牌：底分 × 胡型 × 双方甩出的癞子倍数。
   * 四癞喜钱在杠出第四张时已经结过，不走这里。
   */
  payHu(result) {
    const one = rules.unit(this.config);
    const winners = result.winners;
    const huTypes = result.huTypes || { [result.winner]: result.huType };
    const delta = new Array(this.n).fill(0);
    const bits = [];

    for (const seat of winners) {
      const base = rules.huMultiplier(huTypes[seat], this.config);
      const huPayers = result.zimo
        ? [...Array(this.n).keys()].filter((s) => s !== seat)
        : [result.from];
      const fans = [];
      for (const s of huPayers) {
        const fan = this.payFan(seat, s);
        const pay = one * base * fan;
        delta[s] -= pay;
        delta[seat] += pay;
        fans.push(fan);
      }
      if (result.zimo) this.stat[seat].zm += 1;
      else this.stat[seat].jg += 1;

      const fanTxt = fans.some((f) => f > 1) ? `（含甩癞×${fans.join('/')}）` : '';
      bits.push(`${this.uid(seat)} ${base} 倍${fanTxt}`);
    }
    if (!result.zimo && winners.length) this.stat[result.from].dg += 1;

    this.settle(delta, `胡牌 ${bits.join('、')}`, { silent: true });
    return delta;
  }

  dump() {
    return {
      dealerSeat: this.dealerSeat,
      over: this.over,
      fullMelds: this.fullMelds,
      hands: this.hands,
      drawn: this.drawn,
      melds: this.melds,
      discards: this.discards,
      wall: this.wall.dump(),
      drawPlan: this.drawPlan,
      laizi: this.laizi,
      pizi: this.pizi,
      pzPos: this.pzPos,
      turn: this.turn,
      pending: this.pending && {
        ...this.pending,
        replies: this.pending.replies
          ? [...this.pending.replies.entries()]
          : undefined,
      },
      roundScore: this.roundScore,
      baoQys: this.baoQys,
      shuai: this.shuai,
      gangs: this.gangs,
      hotSeat: this.hotSeat,
      passPeng: (this.passPeng || []).map((s) => [...(s || [])]),
      passHu: this.passHu,
      inferredVisible: (this.inferredVisible || []).map((memory) => [...(memory || new Map()).entries()]),
      stat: this.stat,
      tape: this.tape ? this.tape.dump() : null,
    };
  }

  static restore(data, seats, io, config) {
    const r = new Round(seats, { config, dealerSeat: data.dealerSeat }, io);
    r.over = !!data.over;
    r.fullMelds = data.fullMelds;
    r.hands = data.hands;
    r.drawn = data.drawn;
    r.melds = data.melds;
    r.discards = data.discards;
    r.wall = mahjong.makeWall(data.wall);
    r.drawPlan = data.drawPlan || null;
    r.laizi = data.laizi;
    r.pizi = data.pizi;
    r.pzPos = data.pzPos || [];
    r.turn = data.turn;
    r.pending = data.pending
      ? {
        ...data.pending,
        replies: data.pending.replies ? new Map(data.pending.replies) : new Map(),
      }
      : null;
    // 老版本可能正停在“亮癞”按钮上。升级后丢弃这个无效选项，避免重连再次显示。
    if (r.pending && r.pending.kind === 'self') {
      delete r.pending.razz;
      if (typeof r.pending.allowHu !== 'boolean') r.pending.allowHu = r.drawn[r.pending.seat] != null;
      if (!r.pending.hu && !(r.pending.gang || []).length && !r.pending.qys) r.pending = null;
    }
    r.roundScore = data.roundScore;
    r.baoQys = data.baoQys;
    r.shuai = data.shuai;
    r.gangs = data.gangs || [];
    r.hotSeat = data.hotSeat == null ? -1 : data.hotSeat;
    r.passPeng = (data.passPeng || []).map((arr) => new Set(arr));
    r.passHu = data.passHu || new Array(r.n).fill(false);
    r.inferredVisible = (data.inferredVisible || Array.from({ length: r.n }, () => []))
      .map((entries) => new Map(entries));
    r.stat = data.stat;
    r.tape = data.tape ? new Tape(data.tape) : null;
    return r;
  }
}

module.exports = { Round };
