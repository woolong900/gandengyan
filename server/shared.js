/**
 * 协议层共用：房间快照、番桌操作、和 Node / Cloudflare 无关。
 */
const { pack } = require('./net');
const rules = require('./rules');

const GAME_COUNT_MUL = {
  1: 8, 2: 8, 3: 8, 4: 8, 5: 8, 6: 8, 7: 8, 8: 8, 9: 8, 10: 8, 11: 8, 12: 8,
  13: 4, 14: 5, 15: 8, 16: 3, 18: 3, 19: 8, 20: 8, 21: 8, 22: 3, 23: 5,
};

const num = (v) => (v && typeof v === 'object' && 'low' in v ? v.toNumber() : Number(v || 0));

const maxStep = (room) => room.num * (GAME_COUNT_MUL[room.gameType] || 8);

const roomInfo = (room) => ({
  type: room.gameType,
  roomid: room.roomId,
  host: room.hostUid,
  maxstep: maxStep(room),
  step: room.round && room.step < 1 ? 1 : room.step,
  score_ratio: rules.RATIO,
  param1: room.param1,
  param2: room.param2,
  person: room.members.map((m) => ({
    uid: m.player.uid,
    name: m.player.nickname,
    imgurl: '',
    ip: '127.0.0.1',
    latitude: 0,
    longitude: 0,
    address: '',
    index: m.site,
    sex: m.player.sex,
    line: m.online !== false,
    view: !!m.view,
    force_close: false,
    trustee: { status: !!m.trustee, last_ts: m.turnDeadline || 0 },
  })),
  agree: (room.dismiss && room.dismiss.agree) || [],
  time: (room.dismiss && room.dismiss.time) || 0,
});

const push = (msghead, data) => pack(999, {
  json: JSON.stringify({ msghead, msgdata: JSON.stringify(data) }),
});

const playerAction = (room, uid, msghead, body) => {
  const round = room && room.round;
  if (!round) return '现在不在牌局里';
  const seat = round.seatOf(uid);
  if (seat < 0) return '你不在这局里';

  switch (msghead) {
    case 'gamestep':
      return round.discard(seat, body.card);
    case 'gameguo':
      return round.respond(seat, 'pass');
    case 'gamepeng':
      return round.respond(seat, 'peng');
    case 'gamegang':
      return round.respond(seat, 'gang', { card: body.card });
    case 'gamehu':
      return round.respond(seat, 'hu');
    case 'gameshowlz':
      return round.respond(seat, 'razz');
    case 'gamenotice':
      if (body.type === 0) return round.respond(seat, 'qys');
      return null;
    default:
      return null;
  }
};

/** 绑定邀请码：邀请人、被邀请人都加这么多。充值先关。 */
const INVITE_GIVE = 1000;
/** 去掉 I/O/Z/L，免得和 1/0/2 看混。 */
const INVITE_LETTERS = 'ABCDEFGHJKMNPQRSTUVWXY';
const INVITE_AMBIGUOUS = /[IOZL]/;

const mintInviteCode = (used = new Set()) => {
  for (let n = 0; n < 64; n++) {
    let code = '';
    for (let i = 0; i < 5; i++) code += INVITE_LETTERS[Math.floor(Math.random() * INVITE_LETTERS.length)];
    if (!used.has(code)) return code;
  }
  throw new Error('邀请码发完了');
};

const emptyPlayer = (uid, extra = {}) => ({
  uid,
  nickname: extra.nickname || `玩家${uid}`,
  sex: extra.sex || 1,
  cardNum: extra.cardNum == null ? 0 : extra.cardNum,
  roomId: extra.roomId || 0,
  inviteCode: extra.inviteCode || '',
  invitedBy: extra.invitedBy || '',
  bot: !!extra.bot,
});

const emptyMember = (player, extra = {}) => ({
  player,
  connId: extra.connId || null,
  site: extra.site || 1,
  ready: !!extra.ready,
  score: extra.score || 0,
  online: extra.online !== false,
  trustee: !!extra.trustee,
  turnDeadline: extra.turnDeadline || 0,
  stat: extra.stat || { ag: 0, mg: 0, zm: 0, dg: 0, jg: 0, plyj: 0 },
  view: !!extra.view,
  bot: !!extra.bot,
});

const versionBody = () => ({ err_code: '0', data: {} });
const configBody = () => ({ err_code: '0', data: null });

module.exports = {
  GAME_COUNT_MUL,
  INVITE_GIVE,
  INVITE_LETTERS,
  INVITE_AMBIGUOUS,
  mintInviteCode,
  num,
  maxStep,
  roomInfo,
  push,
  playerAction,
  emptyPlayer,
  emptyMember,
  versionBody,
  configBody,
};
