/** 潜江说胡子单局状态机。 */
const rules = require('./qjshz-rules');
const { maxStep } = require('./shared');
const { randomInt } = require('crypto');

const PLAYBACK = {
  PASS: 1,
  PUT: 101,
  SCORE: 1007,
  FRIEND_CARD: 2012,
  NEW_ROUND: 2013,
  NEW_TRICK: 2014,
};

class PokerWall {
  constructor(cards = []) { this.cards = cards.slice(); }
  remain() { return this.cards.length; }
  remainCards() { return this.cards.slice(); }
  dump() { return { cards: this.cards.slice() }; }
  static restore(raw) { return new PokerWall((raw && raw.cards) || []); }
}

class WskTape {
  constructor(raw) {
    this.head = raw && raw.head ? raw.head : null;
    this.steps = raw && raw.steps ? raw.steps.map((step) => ({
      operates: (step.operates || []).map((op) => ({ ...op, cards: [...(op.cards || [])] })),
    })) : [];
    this.flushed = !!(raw && raw.flushed);
  }

  begin(round) {
    const table = round.io.table;
    this.head = {
      players: round.seats.map((member, seat) => ({
        uid: member.player.uid,
        name: member.player.nickname || `玩家${member.player.uid}`,
        headImg: member.player.avatarUrl || '',
        ip: '127.0.0.1',
        onLine: true,
        ready: true,
        pos: seat,
        score: member.score || 0,
        gender: member.player.sex === 2 ? 2 : 1,
        deal: seat === round.dealerSeat,
      })),
      roomInfo: {
        type: table.gameType,
        roomId: table.roomId,
        house: table.hostUid,
        maxStep: maxStep(table),
        param1: table.param1,
        param2: table.param2,
        scoreRatio: rules.RATIO,
      },
      gameInfo: {
        count: table.step,
        sites: round.hands.map((hand, pos) => ({ pos, handCards: hand.slice() })),
      },
    };
  }

  push(uid, index, cards = []) {
    this.steps.push({ operates: [{ uid, index, cards: cards.slice() }] });
  }

  finish() {
    if (!this.head) return null;
    this.flushed = true;
    return { ...this.head, steps: this.steps };
  }

  dump() { return { head: this.head, steps: this.steps, flushed: this.flushed }; }
}

class WskRound {
  constructor(seats, opts, io) {
    this.seats = seats;
    this.config = opts.config;
    this.dealerSeat = opts.dealerSeat || 0;
    this.forcedFlipIndex = Number.isInteger(opts.flipIndex) ? opts.flipIndex : null;
    this.io = io;
    this.peopleCount = 4;
    this.over = false;
  }

  get n() { return this.seats.length; }
  uid(seat) { return this.seats[seat].player.uid; }
  seatOf(uid) { return this.seats.findIndex((member) => Number(member.player.uid) === Number(uid)); }
  teamOf(seat) { return seat % 2; }
  teammate(seat) { return (seat + 2) % 4; }
  isActive(seat) { return seat >= 0 && this.ranks[seat] === 0 && this.hands[seat].length > 0; }

  nextActive(seat) {
    for (let offset = 1; offset <= this.n; offset++) {
      const next = (seat + offset) % this.n;
      if (this.isActive(next)) return next;
    }
    return -1;
  }

  start(deckOverride = null) {
    const deck = Array.isArray(deckOverride)
      ? deckOverride.slice() : rules.shuffle(rules.buildDeck(this.config.去掉34));
    this.hands = Array.from({ length: this.n }, () => []);
    for (let i = 0; i < deck.length; i++) this.hands[i % this.n].push(deck[i]);

    // 每局随机翻开一张实体牌，拿到它的玩家为庄。另一张完全相同的
    // 牌决定对家；如果两张都在庄家手中，则直接以庄家对面的玩家为对家。
    const flipIndex = this.forcedFlipIndex == null
      ? randomInt(deck.length) : Math.max(0, Math.min(deck.length - 1, this.forcedFlipIndex));
    this.friendCard = deck[flipIndex];
    this.dealerSeat = flipIndex % this.n;
    const sameCardIndexes = [];
    for (let i = 0; i < deck.length; i++) if (deck[i] === this.friendCard) sameCardIndexes.push(i);
    const mateIndex = sameCardIndexes.find((index) => index !== flipIndex);
    let friendSeat = mateIndex == null ? this.teammate(this.dealerSeat) : mateIndex % this.n;
    const oppositeSeat = this.teammate(this.dealerSeat);
    this.exchangePosition = [];
    if (friendSeat !== this.dealerSeat && friendSeat !== oppositeSeat) {
      const friendUid = this.uid(friendSeat);
      const oppositeUid = this.uid(oppositeSeat);
      [this.seats[friendSeat], this.seats[oppositeSeat]] = [this.seats[oppositeSeat], this.seats[friendSeat]];
      [this.hands[friendSeat], this.hands[oppositeSeat]] = [this.hands[oppositeSeat], this.hands[friendSeat]];
      for (let seat = 0; seat < this.n; seat++) this.seats[seat].site = seat + 1;
      this.exchangePosition = [friendUid, oppositeSeat, oppositeUid, friendSeat];
      friendSeat = oppositeSeat;
    } else if (friendSeat === this.dealerSeat) {
      friendSeat = oppositeSeat;
    }
    for (const hand of this.hands) hand.sort((a, b) => rules.compareCard(b, a, true));
    this.wall = new PokerWall();
    this.turn = this.dealerSeat;
    this.lastPlay = null;
    this.lastPlaySeat = -1;
    this.roundState = new Array(this.n).fill('none');
    this.lastCards = Array.from({ length: this.n }, () => []);
    this.passed = new Set();
    this.ranks = new Array(this.n).fill(0);
    this.finishOrder = [];
    this.firstOutSeat = -1;
    this.pickScores = new Array(this.n).fill(0);
    this.roundScore = new Array(this.n).fill(0);
    this.tableScore = 0;
    this.tableScoreCards = [];
    this.allPutCards = [];
    this.curRound = [];
    this.stat = Array.from({ length: this.n }, () => ({
      wsk_winner_count: 0,
      wsk_lose_count: 0,
      wsk_first_count: 0,
      wsk_last_count: 0,
    }));
    this.tape = new WskTape();
    this.tape.begin(this);

    if (this.io.table) this.io.table.dealerUid = this.uid(this.dealerSeat);
    this.io.log(`说胡子开局 庄家=${this.uid(this.dealerSeat)} 翻牌=${this.friendCard} 对家=${this.uid(friendSeat)} 每家=${this.hands[0].length} 张`);
    this.io.each('game_begin', (viewer) => this.snapshot(viewer, {
      begin: true,
      exchangePosition: this.exchangePosition,
    }));
    this.io.all('game_friendcard', { deal_uid: this.uid(this.dealerSeat), friend_card: this.friendCard });
    this.tape.push(this.uid(this.dealerSeat), PLAYBACK.FRIEND_CARD, [this.friendCard]);
    this.io.all('game_operator', { uid: this.uid(this.turn), ot: 2, round: true });
  }

  visibleHand(seat, viewer, reveal) {
    const canSeeTeam = this.config.观看队友手牌 && viewer >= 0 && this.teamOf(seat) === this.teamOf(viewer);
    if (reveal || viewer === seat || canSeeTeam) return this.hands[seat].slice();
    return this.hands[seat].map(() => 0);
  }

  playerSnapshot(seat, viewer, reveal = false) {
    const state = this.roundState[seat];
    return {
      uid: this.uid(seat),
      ready: false,
      total: this.seats[seat].score || 0,
      score: this.roundScore[seat] || 0,
      card_step_out: this.ranks[seat] || 0,
      grasp_score: this.pickScores[seat] || 0,
      bomb_score: 0,
      show_xi_card: [],
      pass: state === 'pass',
      card: {
        hand_card: this.visibleHand(seat, viewer, reveal),
        hand_card_num: this.hands[seat].length,
        last_dis_card: state === 'put' ? this.lastCards[seat].slice() : [],
      },
    };
  }

  snapshot(viewer, extra = {}) {
    const reveal = !!extra.reveal;
    const table = this.io.table;
    const snapshot = {
      begin: !!extra.begin,
      players: this.seats.map((_, seat) => this.playerSnapshot(seat, viewer, reveal)),
      step: table ? table.step : 1,
      game_stage: 0,
      friend_card: this.friendCard || 0,
      hard_card_uid: 0,
      banker_uid: this.uid(this.dealerSeat),
      friend_uid: this.uid(this.teammate(this.dealerSeat)),
      desktop_score: this.tableScore,
      desk_card_scores: this.tableScoreCards.slice(),
      step_card_info: this.allPutCards.slice(),
    };
    if (Array.isArray(extra.exchangePosition) && extra.exchangePosition.length) {
      snapshot.exchange_position = extra.exchangePosition.slice();
    }
    return snapshot;
  }

  waitingSeats() { return this.over || this.turn < 0 ? [] : [this.turn]; }

  replayOps(viewer) {
    if (this.over || viewer < 0 || this.turn < 0) return;
    this.io.one(viewer, 'game_operator', { uid: this.uid(this.turn), ot: 2, round: false });
  }

  autoPlay(seat) {
    if (this.over || seat !== this.turn) return;
    const beat = rules.findBeat(this.hands[seat], this.lastPlay && this.lastPlay.info, this.config);
    if (!beat) return this.pass(seat);
    return this.play(seat, beat.cards.concat(beat.cards));
  }

  hasCards(seat, cards) {
    const available = new Map();
    for (const card of this.hands[seat]) available.set(card, (available.get(card) || 0) + 1);
    for (const card of cards) {
      const left = available.get(card) || 0;
      if (!left) return false;
      available.set(card, left - 1);
    }
    return true;
  }

  removeCards(seat, cards) {
    for (const card of cards) {
      const at = this.hands[seat].indexOf(card);
      if (at < 0) return false;
      this.hands[seat].splice(at, 1);
    }
    return true;
  }

  clearTurnState() {
    for (let seat = 0; seat < this.n; seat++) {
      if (this.roundState[seat] === 'turn') this.roundState[seat] = 'none';
    }
  }

  markTurn(seat, round = false) {
    this.clearTurnState();
    this.turn = seat;
    this.roundState[seat] = 'turn';
    this.io.all('game_operator', { uid: this.uid(seat), ot: 2, round });
  }

  play(seat, payload) {
    if (this.over) return '这局已经结束了';
    if (seat !== this.turn) return '还没轮到你出牌';
    if (!this.isActive(seat)) return '你已经出完牌了';
    const parsed = rules.parsePlay(payload);
    if (parsed.error) return parsed.error;
    if (!this.hasCards(seat, parsed.real)) return '手里没有这些牌';
    if (this.lastPlay && !rules.canBeat(parsed.info, this.lastPlay.info, this.config)) return '这手牌压不过上一手';

    this.removeCards(seat, parsed.real);
    const combined = parsed.real.concat(parsed.virtual);
    this.clearTurnState();
    this.roundState[seat] = 'put';
    this.lastCards[seat] = combined;
    this.lastPlay = { real: parsed.real, virtual: parsed.virtual, info: parsed.info };
    this.lastPlaySeat = seat;
    this.passed.clear();
    this.curRound.push({ ot: 0, uid: this.uid(seat), cards: combined });
    this.allPutCards.push(...parsed.real);
    for (const card of parsed.real) {
      const score = rules.cardScore(card);
      if (score) {
        this.tableScore += score;
        this.tableScoreCards.push(card);
      }
    }
    this.io.all('game_step', { uid: this.uid(seat), card: combined });
    this.tape.push(this.uid(seat), PLAYBACK.PUT, combined);

    if (this.hands[seat].length === 0) {
      const rank = this.finishOrder.length + 1;
      this.ranks[seat] = rank;
      this.finishOrder.push(seat);
      if (this.firstOutSeat < 0) this.firstOutSeat = seat;
      this.io.log(`${this.uid(seat)} 第 ${rank} 个出完`);
    }

    // 对家组成一队；任意一队两人的手牌都出完，牌局立即结束。
    if (this.teamFinished(this.teamOf(seat))) {
      this.finishTrick({ ending: true });
      this.finishGame();
      return null;
    }

    const next = this.nextActive(seat);
    if (next < 0) return '找不到下一位玩家';
    this.markTurn(next);
    return null;
  }

  activeSeats() {
    const out = [];
    for (let seat = 0; seat < this.n; seat++) if (this.isActive(seat)) out.push(seat);
    return out;
  }

  teamFinished(team) {
    return [team, team + 2].every((seat) => this.hands[seat].length === 0);
  }

  pass(seat) {
    if (this.over) return '这局已经结束了';
    if (seat !== this.turn) return '还没轮到你';
    if (!this.lastPlay) return '新一轮不能过牌';
    this.clearTurnState();
    this.roundState[seat] = 'pass';
    this.passed.add(seat);
    this.curRound.push({ ot: 1, uid: this.uid(seat), cards: [] });
    this.io.all('game_pass', { uid: this.uid(seat) });
    this.tape.push(this.uid(seat), PLAYBACK.PASS, []);

    const responders = this.activeSeats().filter((candidate) => candidate !== this.lastPlaySeat);
    if (responders.every((candidate) => this.passed.has(candidate))) {
      this.finishTrick();
      return null;
    }
    const next = this.nextActive(seat);
    if (next < 0) return '找不到下一位玩家';
    this.markTurn(next);
    return null;
  }

  finishTrick({ ending = false } = {}) {
    const taker = this.lastPlaySeat;
    if (taker >= 0 && this.tableScore > 0) {
      this.pickScores[taker] += this.tableScore;
      this.io.all('game_score', { uid: this.uid(taker), score: this.tableScore });
      this.tape.push(this.uid(taker), PLAYBACK.SCORE, [this.tableScore]);
    }
    this.tableScore = 0;
    this.tableScoreCards = [];
    if (ending) return;

    const isJieFeng = !this.isActive(taker);
    let successor = isJieFeng ? this.teammate(taker) : taker;
    if (!this.isActive(successor)) successor = this.nextActive(taker);
    this.lastPlay = null;
    this.lastPlaySeat = -1;
    this.passed.clear();
    this.roundState.fill('none');
    this.lastCards = Array.from({ length: this.n }, () => []);
    this.curRound = [];
    // 普通一墩由压住牌的人继续领牌，只发换轮消息；只有出完牌者的对家在其余
    // 三家都过牌以后接牌，才发送 game_successor（客户端会播放“接风”动画和语音）。
    if (isJieFeng && successor === this.teammate(taker)) {
      this.turn = successor;
      this.roundState[successor] = 'turn';
      this.io.all('game_successor', { uid: this.uid(successor) });
      this.tape.push(this.uid(successor), PLAYBACK.NEW_TRICK, []);
    } else {
      this.markTurn(successor, true);
      this.tape.push(this.uid(successor), PLAYBACK.NEW_ROUND, []);
    }
  }

  settleRemainingCardScores() {
    const unfinished = [];
    let remaining = 0;
    for (let seat = 0; seat < this.n; seat++) {
      if (this.hands[seat].length) unfinished.push(seat);
      for (const card of this.hands[seat]) remaining += rules.cardScore(card);
    }
    if (!remaining || !unfinished.length) return 0;

    // 牌局在名次已经能决定时立即结束，未出掉的分牌仍要归边，
    // 否则两队总分会低于 200，无法按 100 分标准线结算。
    if (this.config.尾游捡分) {
      for (const seat of unfinished) {
        for (const card of this.hands[seat]) this.pickScores[seat] += rules.cardScore(card);
      }
    } else {
      const tailTeam = this.teamOf(unfinished[0]);
      const recipientTeam = 1 - tailTeam;
      const recipient = [0, 1, 2, 3].find((seat) => this.teamOf(seat) === recipientTeam);
      this.pickScores[recipient] += remaining;
    }
    return remaining;
  }

  outcome() {
    const first = this.firstOutSeat >= 0 ? this.firstOutSeat : this.finishOrder[0];
    const firstTeam = this.teamOf(first);
    const captured = [0, 0];
    for (let seat = 0; seat < this.n; seat++) captured[this.teamOf(seat)] += this.pickScores[seat];
    const teammateRank = this.ranks[this.teammate(first)] || 4;
    const rankBonus = teammateRank === 2 ? 60 : (teammateRank === 3 ? 30 : 0);
    const judged = captured.slice();
    judged[firstTeam] += rankBonus;
    judged[1 - firstTeam] -= rankBonus;
    const winnerTeam = judged[0] === judged[1] ? firstTeam : (judged[0] > judged[1] ? 0 : 1);
    const loserTeam = 1 - winnerTeam;
    const settlementScore = Math.floor(judged[winnerTeam] / 10) * 10;
    const grandSlam = judged[winnerTeam] >= 260;
    const multiple = grandSlam ? this.config.彩倍 : 1;
    const cardType = grandSlam ? 5 : (teammateRank === 2 ? 2 : (teammateRank === 3 ? 1 : 3));
    return {
      first, firstTeam, teammateRank, rankBonus, captured, judged, winnerTeam, loserTeam,
      settlementScore, grandSlam, cardType, multiple,
    };
  }

  finalizeRanks() {
    let nextRank = Math.max(0, ...this.ranks) + 1;
    const anchor = this.lastPlaySeat >= 0 ? this.lastPlaySeat : 0;
    const unfinished = [0, 1, 2, 3].filter((seat) => !this.ranks[seat]);
    unfinished.sort((a, b) => this.hands[a].length - this.hands[b].length
      || ((a - anchor + this.n) % this.n) - ((b - anchor + this.n) % this.n));
    for (const seat of unfinished) this.ranks[seat] = nextRank++;
  }

  finishGame() {
    if (this.over) return;
    this.over = true;
    this.turn = -1;
    this.settleRemainingCardScores();

    const result = this.outcome();
    // 一、二游同队时牌局会提前结束。未出完的两人按剩余牌数由少到多
    // 补为三游、尾游，确保总结算每局都有且只有一个头游和一个尾游。
    this.finalizeRanks();
    const one = rules.unit(this.config);
    // 说胡子以 10 分为结算单位，尾数 5 分舍弃。彩只放大满贯时
    // “超出 100 分的抓分收益”，底子永远单独加且不加倍。
    const scorePart = Math.round(one * (result.settlementScore - 100) * result.multiple);
    const amount = scorePart + Math.round(this.config.底子 * rules.RATIO);
    for (let seat = 0; seat < this.n; seat++) {
      this.roundScore[seat] = this.teamOf(seat) === result.winnerTeam ? amount : -amount;
      this.seats[seat].score = (this.seats[seat].score || 0) + this.roundScore[seat];
      if (this.teamOf(seat) === result.winnerTeam) this.stat[seat].wsk_winner_count += 1;
      else this.stat[seat].wsk_lose_count += 1;
      if (this.ranks[seat] === 1) this.stat[seat].wsk_first_count += 1;
      if (this.ranks[seat] === 4) this.stat[seat].wsk_last_count += 1;
    }
    this.io.log(`说胡子结算 抓分=${result.captured[0]}:${result.captured[1]} 名次奖励=${result.rankBonus}`
      + ` 计分=${result.judged[0]}:${result.judged[1]} 胜队分=${result.settlementScore}`
      + ` 满贯=${result.grandSlam} 彩倍=${result.multiple} 底子=${this.config.底子}`);

    const endTs = Math.floor(Date.now() / 1000);
    this.io.each('game_end', (viewer) => ({
      ...this.snapshot(viewer, { reveal: true }),
      end_ts: endTs,
      card_type: result.cardType,
      players: this.seats.map((_, seat) => this.playerSnapshot(seat, viewer, true)),
    }));
    this.io.over({
      winner: this.finishOrder[0],
      winners: [0, 1, 2, 3].filter((seat) => this.teamOf(seat) === result.winnerTeam),
      nextDealer: this.dealerSeat,
      scores: this.roundScore,
      stat: this.stat,
    });
  }

  roundDetails(seat) {
    this.io.one(seat, 'game_curroundcards', { cur_round: this.curRound.map((item) => ({ ...item, cards: item.cards.slice() })) });
    return null;
  }

  handleAction(seat, msghead, body = {}) {
    if (msghead === 'gamesteps') return this.play(seat, body.card);
    if (msghead === 'gameguo') return this.pass(seat);
    if (msghead === 'gamecurroundcards') return this.roundDetails(seat);
    if (msghead === 'gamehandcard') return '说胡子不需要包庄';
    if (msghead === 'gameshowxicard') return '说胡子没有亮喜牌操作';
    return null;
  }

  dump() {
    return {
      kind: 'qjshz',
      dealerSeat: this.dealerSeat,
      friendCard: this.friendCard,
      exchangePosition: this.exchangePosition,
      over: this.over,
      hands: this.hands,
      wall: this.wall.dump(),
      turn: this.turn,
      lastPlay: this.lastPlay,
      lastPlaySeat: this.lastPlaySeat,
      roundState: this.roundState,
      lastCards: this.lastCards,
      passed: [...this.passed],
      ranks: this.ranks,
      finishOrder: this.finishOrder,
      firstOutSeat: this.firstOutSeat,
      pickScores: this.pickScores,
      roundScore: this.roundScore,
      tableScore: this.tableScore,
      tableScoreCards: this.tableScoreCards,
      allPutCards: this.allPutCards,
      curRound: this.curRound,
      stat: this.stat,
      tape: this.tape ? this.tape.dump() : null,
    };
  }

  static restore(data, seats, io, config) {
    const round = new WskRound(seats, { config, dealerSeat: data.dealerSeat }, io);
    round.over = !!data.over;
    round.friendCard = data.friendCard || 0;
    round.exchangePosition = data.exchangePosition || [];
    round.hands = (data.hands || []).map((hand) => hand.slice());
    round.wall = PokerWall.restore(data.wall);
    round.turn = data.turn;
    round.lastPlay = data.lastPlay || null;
    round.lastPlaySeat = data.lastPlaySeat == null ? -1 : data.lastPlaySeat;
    round.roundState = data.roundState || new Array(round.n).fill('none');
    round.lastCards = (data.lastCards || Array.from({ length: round.n }, () => [])).map((cards) => cards.slice());
    round.passed = new Set(data.passed || []);
    round.ranks = data.ranks || new Array(round.n).fill(0);
    round.finishOrder = data.finishOrder || [];
    round.firstOutSeat = data.firstOutSeat == null ? -1 : data.firstOutSeat;
    round.pickScores = data.pickScores || new Array(round.n).fill(0);
    round.roundScore = data.roundScore || new Array(round.n).fill(0);
    round.tableScore = data.tableScore || 0;
    round.tableScoreCards = data.tableScoreCards || [];
    round.allPutCards = data.allPutCards || [];
    round.curRound = data.curRound || [];
    round.stat = (data.stat || Array.from({ length: round.n }, () => ({}))).map((item) => ({
      wsk_winner_count: 0,
      wsk_lose_count: 0,
      wsk_first_count: 0,
      wsk_last_count: 0,
      ...item,
    }));
    round.tape = data.tape ? new WskTape(data.tape) : null;
    return round;
  }
}

module.exports = { WskRound, WskTape, PokerWall, PLAYBACK };
