/**
 * 麻将回放：一局一条 tape。127 按回放码取整份 { players, roomInfo, gameInfo, steps }。
 *
 * 客户端 PlaybackDataMJ._dealSteps：
 *   100 摸牌  101 出牌  200 可操作（cards 是操作种类）
 *   2 胡 / 3 杠（cards[0] 牌，cards[1] 杠型） / 4 碰 / 6 皮 / 7 癞 / 8 亮癞 / 9 报清
 */
const rules = require('./rules');
const { maxStep } = require('./shared');

const IDX = {
  GET: 100,
  PUT: 101,
  CAN: 200,
  HU: 2,
  GANG: 3,
  PENG: 4,
  PIZI: 6,
  LAIZI: 7,
  WARN_LL: 8,
  WARN_QYS: 9,
};

const GANG = { ming: 1, an: 2, bu: 3, pizi: 0 };

const canCardsFromSelf = (op) => {
  const cards = [];
  if (op.hu) cards.push(IDX.HU);
  if (op.gang && op.gang.length) cards.push(IDX.GANG);
  if (op.show_razz) cards.push(IDX.WARN_LL);
  if (op.bright_qys) cards.push(IDX.WARN_QYS);
  return cards;
};

const canCardsFromDiscard = (ops) => {
  const cards = [];
  if (ops.hu) cards.push(IDX.HU);
  if (ops.gang) cards.push(IDX.GANG);
  if (ops.peng) cards.push(IDX.PENG);
  return cards;
};

class Tape {
  constructor(raw) {
    this.head = raw && raw.head ? raw.head : null;
    this.steps = raw && raw.steps ? raw.steps.map((s) => ({
      operates: (s.operates || []).map((o) => ({
        uid: o.uid,
        index: o.index,
        cards: [...(o.cards || [])],
      })),
    })) : [];
    this.flushed = !!(raw && raw.flushed);
  }

  begin({ table, seats, hands, dealerSeat, pizi, laizi }) {
    this.head = {
      players: seats.map((m, i) => ({
        uid: m.player.uid,
        name: m.player.nickname || `玩家${m.player.uid}`,
        headImg: m.player.avatarUrl || '',
        ip: '127.0.0.1',
        onLine: true,
        ready: true,
        pos: i,
        score: m.score || 0,
        gender: m.player.sex === 2 ? 2 : 1,
        deal: i === dealerSeat,
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
        pz: pizi,
        lz: laizi,
        zhuang: seats[dealerSeat].player.uid,
        pzPos: { pos: 0, index: 0 },
        sites: hands.map((cards, i) => ({
          pos: i,
          wall: 0,
          handCards: [...cards],
        })),
        extend: '',
      },
    };
  }

  push(operates) {
    if (!operates || !operates.length) return;
    this.steps.push({
      operates: operates.map((o) => ({
        uid: o.uid,
        index: o.index,
        cards: [...(o.cards || [])],
      })),
    });
  }

  append(operates) {
    if (!operates || !operates.length) return;
    const last = this.steps[this.steps.length - 1];
    if (!last) return this.push(operates);
    for (const o of operates) {
      last.operates.push({
        uid: o.uid,
        index: o.index,
        cards: [...(o.cards || [])],
      });
    }
  }

  get(uid, card) {
    this.push([{ uid, index: IDX.GET, cards: [card] }]);
  }

  put(uid, card) {
    this.push([{ uid, index: IDX.PUT, cards: [card] }]);
  }

  op(uid, index, cards) {
    this.push([{ uid, index, cards: cards || [] }]);
  }

  can(list) {
    const ops = (list || [])
      .filter((x) => x.cards && x.cards.length)
      .map((x) => ({ uid: x.uid, index: IDX.CAN, cards: x.cards }));
    this.append(ops);
  }

  finish() {
    if (!this.head) return null;
    this.flushed = true;
    return {
      players: this.head.players,
      roomInfo: this.head.roomInfo,
      gameInfo: this.head.gameInfo,
      steps: this.steps,
    };
  }

  dump() {
    return { head: this.head, steps: this.steps, flushed: this.flushed };
  }
}

const findPlaybackRecord = (records, id, uid = null) => {
  const key = String(id || '');
  if (!key) return null;
  for (const rec of records || []) {
    if (uid != null && !(rec.uids || []).some((id) => Number(id) === Number(uid))) continue;
    if (rec.playbacks && rec.playbacks[key]) return rec.playbacks[key];
    for (const d of rec.details || []) {
      if (d.id === key && d.playback) return d.playback;
    }
  }
  return null;
};

const findPlayback = (records, id, uid = null) => findPlaybackRecord(records, id, uid);

const mintPlaybackId = (roomId, step, seq) => (
  `${roomId}${String(step).padStart(2, '0')}${String(100 + (seq % 900)).padStart(3, '0')}`
);

module.exports = {
  Tape, IDX, GANG, findPlayback, findPlaybackRecord, mintPlaybackId,
  canCardsFromSelf, canCardsFromDiscard,
};
