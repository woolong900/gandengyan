/**
 * 单进程大厅：玩家、房间号、桌子。
 */
const {
  CLUB_APPLICATION_MESSAGE_ID_BASE, ClubStore, DAY_SEC, FIRST_PLAYER_UID, INVITE_GIVE, JevBot,
  NEW_PLAYER_CARDS, ROOM_ID_MAX, ROOM_ID_MIN, Table, assignAvatarIfMissing, crypto,
  defaultInvitePageText, emptyPlayer, findPlayback, hasRes, listFor, normalizeBotSettings, num, pack,
  protocol, push, roomInfo, rules, unpack,
} = require('./game-app/common');
const { mixin } = require('./game-app/mixin');
const { dispatch } = require('./game-app/handlers/dispatch');

/** token → player 的 Map，同时维护 player → token 反查，tokenForPlayer 为 O(1)。 */
class PlayerTokenMap extends Map {
  constructor(entries) {
    super();
    this.tokens = new Map();
    if (entries) for (const [token, player] of entries) this.set(token, player);
  }

  set(token, player) {
    const previous = super.get(token);
    super.set(token, player);
    if (previous && previous !== player && this.tokens.get(previous) === token) {
      this.tokens.delete(previous);
      for (const [other, item] of this) if (item === previous) { this.tokens.set(previous, other); break; }
    }
    // 与原先遍历查找一致：同一 player 若有多个 token，返回最早写入的那个。
    if (player && typeof player === 'object' && !this.tokens.has(player)) this.tokens.set(player, token);
    return this;
  }

  delete(token) {
    const player = super.get(token);
    const removed = super.delete(token);
    if (player && this.tokens.get(player) === token) {
      this.tokens.delete(player);
      for (const [other, item] of this) if (item === player) { this.tokens.set(player, other); break; }
    }
    return removed;
  }

  clear() {
    this.tokens.clear();
    super.clear();
  }

  tokenOf(player) {
    return (player && this.tokens.get(player)) || '';
  }
}

class GameApp {
  constructor({ persist, now, onRecord, onAgentApplication, onAccountMigration,
    allowUnregisteredTokens = false, identityHashKey } = {}) {
    this.persistFn = persist || (() => {});
    this.onRecord = onRecord || (() => {});
    this.onAgentApplication = onAgentApplication || (() => { throw new Error('合伙人申请存储未配置'); });
    this.onAccountMigration = onAccountMigration || (() => {});
    this.nowFn = now || Date.now;
    this.allowUnregisteredTokens = !!allowUnregisteredTokens;
    this.identityHashKey = String(identityHashKey || process.env.QJQP_ID_HASH_KEY || '');
    this.players = new PlayerTokenMap();
    this.playersByUid = new Map();
    this.playersByTokenAlias = new Map();
    this.playersByInviteCode = new Map();
    this.playersByIdentityHash = new Map();
    this.playersByGuestDeviceHash = new Map();
    this.wechatMigrationTickets = new Map();
    this.tables = new Map();
    this.economySettings = {
      newPlayerCards: NEW_PLAYER_CARDS,
      clubJoinBonus: 200,
      inviteBindBonus: INVITE_GIVE,
      invitePageText: defaultInvitePageText(INVITE_GIVE),
    };
    this.botSettings = normalizeBotSettings();
    this.jevBot = new JevBot();
    this.clubStore = new ClubStore({ now: () => this.now(), memberBonus: () => this.economySettings.clubJoinBonus });
    this.nextUid = FIRST_PLAYER_UID;
    this.nextRoomId = 100000;
    this.conns = new Map();
    this.timeouts = new Map();
    this.uidRoom = new Map();
    this.records = [];
    this.playbackSeq = 0;
    this.operatorMessages = [];
    this.nextOperatorMessageId = 1000000000;
    this.publicNotices = { hallMarquee: '', serviceWechat: '', serviceQQ: '' };
    this.supportConversations = new Map();
    this.nextSupportMessageId = 1;
    this.supportRate = new Map();
  }

  now() {
    return this.nowFn();
  }

  persist() {
    this.persistFn(this.dump());
  }

  playerByUid(uid) {
    return this.playersByUid.get(Number(uid)) || null;
  }

  playerForToken(token) {
    return this.players.get(String(token || '')) || this.playersByTokenAlias.get(String(token || '')) || null;
  }

  tokenForPlayer(player) {
    return this.players.tokenOf(player);
  }

  mintPlayerUid() {
    while (this.playersByUid.has(this.nextUid)) this.nextUid += 1;
    return this.nextUid++;
  }

  mintRoomId() {
    const capacity = ROOM_ID_MAX - ROOM_ID_MIN;
    if (this.tables.size >= capacity) throw new Error('房号已用尽');
    const start = crypto.randomInt(ROOM_ID_MIN, ROOM_ID_MAX);
    if (!this.tables.has(start)) return start;
    for (let i = 0; i < 32; i++) {
      const candidate = crypto.randomInt(ROOM_ID_MIN, ROOM_ID_MAX);
      if (!this.tables.has(candidate)) return candidate;
    }
    // 随机抽样连续碰撞时，从随机起点扫描剩余号码，保证有空号就能分配。
    for (let offset = 1; offset < capacity; offset++) {
      const candidate = ROOM_ID_MIN + (start - ROOM_ID_MIN + offset) % capacity;
      if (!this.tables.has(candidate)) return candidate;
    }
    throw new Error('房号已用尽');
  }

  clearRoomLink(uid) {
    this.uidRoom.delete(uid);
    const player = this.playerByUid(uid);
    if (player) player.roomId = 0;
    for (const c of this.conns.values()) {
      if (c.player && c.player.uid === uid) c.roomId = 0;
    }
  }

  activeRoomForRequest(c, targetRoomId = 0) {
    const uid = c.player.uid;
    const roomId = this.uidRoom.get(uid) || c.player.roomId || 0;
    if (!roomId) return 0;
    const table = this.tables.get(roomId);
    if (!table || table.closed) {
      this.clearRoomLink(uid);
      this.persist();
      return 0;
    }
    if (roomId === targetRoomId) return roomId;
    if (!table.members.some((m) => m.player.uid === uid)) {
      this.clearRoomLink(uid);
      if (!table.members.length) table.dissolve();
      else this.persist();
      return 0;
    }
    if (table.releaseFinishedPlayer(uid)) return 0;
    return roomId;
  }

  tableHost(roomId) {
    const app = this;
    return {
      send: (connId, bytes) => {
        const c = app.conns.get(connId);
        if (c && c.send) c.send(bytes);
      },
      persist: () => app.persist(),
      saveRecord: (table) => app.saveRecord(table),
      mintPlaybackId: (roomId, step) => app.mintPlaybackId(roomId, step),
      changeCards: (uid, delta, reason) => app.changeCards(uid, delta, reason),
      clubCardBalance: (clubId) => app.clubCardBalance(clubId),
      changeClubCards: (clubId, delta, reason) => app.changeClubCards(clubId, delta, reason),
      schedule: (name, dueAt) => app.schedule(`${roomId}:${name}`, dueAt),
      cancel: (name) => app.cancel(`${roomId}:${name}`),
      now: () => app.now(),
      log: (line) => console.log(line),
      onDissolved: () => {
        const table = app.tables.get(roomId);
        if (table) for (const member of table.members) if (member.bot) app.forgetBot(member.player.uid);
        for (const [uid, rid] of app.uidRoom) {
          if (rid === roomId) app.clearRoomLink(uid);
        }
        app.tables.delete(roomId);
        app.persist();
      },
      onUidRoom: (uid, rid) => {
        if (rid) app.uidRoom.set(uid, rid);
        else app.clearRoomLink(uid);
      },
      // Table 在小局结束时会再查一次：全局开关关闭，或创建者
      // 不符合准入条件时，机器人都只在局间退出，不破坏正在进行的牌局。
      botsEnabled: () => app.botsAllowed(app.tables.get(roomId)),
      trusteeWhitelisted: (uid) => app.trusteeWhitelisted(uid),
      trusteeStrategy: (site) => app.botStrategy(site, roomId),
      forgetBot: (uid) => app.forgetBot(uid),
      jevBot: app.jevBot,
      recordBotResult: (entries) => app.recordBotResult(entries),
    };
  }

  schedule(key, dueAt) {
    this.cancel(key);
    const wait = Math.max(0, dueAt - this.now());
    const id = setTimeout(() => {
      this.timeouts.delete(key);
      const i = key.indexOf(':');
      const roomId = Number(key.slice(0, i));
      const name = key.slice(i + 1);
      const table = this.tables.get(roomId);
      if (!table) return;
      // 定时器回调不在 WS 的 try/catch 里。单个房间的牌局逻辑出错只记日志，
      // 不能冒泡成 uncaughtException 让整个进程退出、全服断线。
      try {
        table.onTimer(name);
      } catch (err) {
        console.error(`[房${roomId}] 定时器 ${name} 执行出错`, err);
      }
    }, wait);
    if (typeof id.unref === 'function') id.unref();
    this.timeouts.set(key, id);
  }

  cancel(key) {
    const id = this.timeouts.get(key);
    if (id) {
      clearTimeout(id);
      this.timeouts.delete(key);
    }
  }

  attach(connId, send, close, meta = {}) {
    const platform = ['android', 'ios'].includes(meta.platform) ? meta.platform : 'unknown';
    this.conns.set(connId, {
      send, close, player: null, roomId: 0, superseded: false, platform,
      platformForUid: typeof meta.platformForUid === 'function' ? meta.platformForUid : null,
    });
  }

  detach(connId) {
    const c = this.conns.get(connId);
    if (c && c.player && c.roomId) {
      const table = this.tables.get(c.roomId);
      if (table) table.leave(c.player.uid, connId);
    }
    this.conns.delete(connId);
  }

  onMessage(connId, bytes) {
    const c = this.conns.get(connId);
    if (!c) return;
    const { proto, msg } = unpack(Buffer.from(bytes));

    // 同一账号在新连接登录后，旧 WebSocket 可能还有数秒才真正断开。
    // 旧连接绝不能再发送退出房间、出牌等修改状态的请求。
    if (c.superseded && proto !== 100) {
      if (hasRes(proto)) {
        c.send(pack(proto, { res: { error: 1, what: '账号已在其他设备登录' } }));
      }
      return;
    }

    // 各协议的处理在 game-app/handlers/*.js，按协议号查表分发。
    const handled = dispatch(this, c, msg, proto, connId);
    if (handled.done) return handled.value;

    if (protocol[proto]) {
      console.log(`  ${proto} 未实现${hasRes(proto) ? '，兜一个成功' : '，无 res 字段，忽略'}`);
      if (hasRes(proto)) c.send(pack(proto, { res: { error: 0, what: '' } }));
      return;
    }
    console.log(`  ${proto} 未知 proto id`);
  }
}

mixin(GameApp,
  require('./game-app/messages'),
  require('./game-app/accounts'),
  require('./game-app/bots'),
  require('./game-app/persistence'),
  require('./game-app/clubs'));

module.exports = { GameApp, PlayerTokenMap };
