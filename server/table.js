/**
 * 一张桌子。
 *
 * host:
 *   send(connId, bytes)
 *   persist()
 *   schedule(name, dueAt)
 *   cancel(name)
 *   now()
 *   log(line)
 *   onDissolved(reason)
 *   onUidRoom(uid, roomId)
 */
const { Round } = require('./round');
const { WskRound } = require('./qjshz-round');
const { ClubPokerRound } = require('./club-poker-round');
const isClubPoker = type => [23,24,25].includes(Number(type));
const { randomBytes } = require('crypto');
const { normalizeIp } = require('./ip-geo');
const rules = require('./rules');
const qjshzRules = require('./qjshz-rules');
const {
  maxStep, roomInfo, push, playerAction, emptyMember,
} = require('./shared');

const DISMISS_SEC = 60;
const UNSTARTED_ROOM_TTL_MS = 60 * 60 * 1000;
const STARTED_ROOM_TTL_MS = 12 * 60 * 60 * 1000;
const ROOM_EXPIRE_TIMER = 'room-expire';
// 手机息屏后 WebSocket 会被系统暂停或断开。观战者不参与出牌，
// 保留一段足够覆盖锁屏的重连窗口，同时避免无限占用旁观位。
const WATCH_RECONNECT_GRACE_MS = 30 * 60 * 1000;
const BOT_MIN_DELAY_MS = 800;
const BOT_MAX_DELAY_MS = 1500;
// Cocos 开局还要播放翻皮子、发牌和理牌动画。首个自动操作从动画缓冲
// 结束后再计算正常的 0.8–1.5 秒表现时间，避免庄家在牌尚未排好时杠/甩癞子。
const BOT_OPENING_PRESENTATION_MS = 3500;
/** 旁观位上限。客户端 LookOnLayer 按 person.view 列人，没有再限一次。 */
const MAX_WATCH = 20;
/** 观战者与真人玩家小于该距离时，禁止申请查看手牌。 */
const WSK_WATCH_HAND_MIN_DISTANCE_METERS = 100;
const MAX_CHAT_BYTES = 4096;
const CHAT_WINDOW_MS = 5000;
const CHAT_MAX_IN_WINDOW = 10;
const GANDENGYAN_GAME_TYPE = 2;
const EMPTY_MAHJONG_OPERATOR = Object.freeze({
  hu: 0,
  gang: [],
  touch: 0,
  chow: [],
  bright_qys: false,
});

const sameRoundProgress = (a, b) => !!a && !!b
  && a.round === b.round && a.pending === b.pending && a.key === b.key;

const normalizeLocation = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const latitude = Number(raw.latitude);
  const longitude = Number(raw.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
    || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
    || (latitude === 0 && longitude === 0)) return null;
  return { latitude, longitude };
};

const locationDistanceMeters = (left, right) => {
  if (!left || !right) return null;
  const radians = (degree) => degree * Math.PI / 180;
  const latitudeDelta = radians(right.latitude - left.latitude);
  const longitudeDelta = radians(right.longitude - left.longitude);
  const latitude1 = radians(left.latitude);
  const latitude2 = radians(right.latitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

class Table {
  constructor(meta, host) {
    this.host = host;
    this.roomId = meta.roomId;
    this.shareCode = meta.shareCode || randomBytes(12).toString('hex');
    this.gameType = meta.gameType;
    this.gameRules = rules.forGame(this.gameType);
    this.clubId = meta.clubId;
    this.schemeId = meta.schemeId || 0;
    this.num = meta.num;
    this.param1 = meta.param1;
    this.param2 = meta.param2;
    this.hostUid = meta.host;
    // 创建者与当前房主分开保存。俱乐部自动桌由服务端创建，
    // 后续首位入桌者可能成为房主，但不能因此获得陪玩机器人资格。
    this.creatorUid = Number(meta.creatorUid != null
      ? meta.creatorUid
      : (meta.schemeId ? 0 : meta.host)) || 0;
    this.step = meta.step || 0;
    const now = typeof this.host.now === 'function' ? this.host.now() : Date.now();
    this.createdAt = Number(meta.createdAt) || now;
    this.lastRoundStartedAt = Number(meta.lastRoundStartedAt) || 0;
    // 旧存档没有生命周期时间。已经开过局的旧房间首次恢复时从恢复时刻
    // 重新给 12 小时，避免按未知的历史创建时间误释放。
    this.roomExpireAt = Number(meta.roomExpireAt) || (this.step > 0
      ? (this.lastRoundStartedAt
        ? this.lastRoundStartedAt + STARTED_ROOM_TTL_MS
        : now + STARTED_ROOM_TTL_MS)
      : this.createdAt + UNSTARTED_ROOM_TTL_MS);
    this.drawCount = meta.drawCount || 0;
    this.dealerUid = meta.dealerUid || 0;
    this.lastEnd = meta.lastEnd || null;
    // 本场说胡子大局的观战看牌授权。按观战者保存多个已获准玩家，切换
    // 视角、临时离线、离房重进或进入下一小局都不撤销；房间销毁时失效。
    this.wskWatchSessions = new Map();
    this.pokerMatch = meta.pokerMatch || null;
    this.nextWskHandPlan = meta.nextWskHandPlan ? {
      uid: Number(meta.nextWskHandPlan.uid),
      counts: { ...(meta.nextWskHandPlan.counts || {}) },
      total: Number(meta.nextWskHandPlan.total || 0),
    } : null;
    this.nextWskPartnerPlan = meta.nextWskPartnerPlan ? {
      uid: Number(meta.nextWskPartnerPlan.uid),
      partnerUid: Number(meta.nextWskPartnerPlan.partnerUid),
    } : null;
    this.dismiss = meta.dismiss || null;
    this.members = [];
    this.config = meta.config || this.gameRules.parseConfig(meta.param1, meta.param2);
    this.round = null;
    this.closed = !!meta.closed;
    this.cardCharges = meta.cardCharges ? meta.cardCharges.map((c) => ({ ...c })) : [];
    this.hands = meta.hands ? meta.hands.map((h) => ({
      id: h.id,
      scores: (h.scores || []).map((s) => ({ uid: s.uid, score: s.score })),
      playback: h.playback || null,
    })) : [];
    this.recordSaved = !!meta.recordSaved;
    this.armRoomExpiry();
  }

  get host() { return this._host; }
  set host(v) { this._host = v; }

  seats() {
    return this.members.filter((m) => !m.view).sort((a, b) => a.site - b.site);
  }

  watchers() {
    return this.members.filter((m) => m.view);
  }

  managedTrusteeEligible(member) {
    return !!(member && !member.bot && !member.view
      && !member.managedTrusteeOptOut
      && Number(this.gameType) === GANDENGYAN_GAME_TYPE
      && this.round && !this.round.over
      && this.host.trusteeWhitelisted
      && this.host.trusteeWhitelisted(member.player.uid));
  }

  /** 后台白名单托管只在干瞪眼小局进行时生效，并保留玩家原先的手动托管状态。 */
  syncManagedTrustees({ arm = true } = {}) {
    let active = 0;
    for (const member of this.members) {
      const enabled = this.managedTrusteeEligible(member);
      const before = !!member.trustee;
      if (enabled) {
        if (!member.managedTrustee) member.trusteeBeforeManaged = before;
        member.managedTrustee = true;
        member.trustee = true;
        active += 1;
      } else if (member.managedTrustee) {
        member.managedTrustee = false;
        member.trustee = !!member.trusteeBeforeManaged;
        member.trusteeBeforeManaged = false;
      }
      if (before !== !!member.trustee || !member.bot) {
        this.broadcast('trustee', { uid: member.player.uid, status: !!member.trustee,
          manual_enabled: Number(this.gameType) === GANDENGYAN_GAME_TYPE && !!(this.host.trusteeWhitelisted && this.host.trusteeWhitelisted(member.player.uid)) });
      }
    }
    if (arm) this.armTurns();
    return active;
  }

  /** 后台再次明确启用/停用白名单时，清除玩家此前在牌桌上的主动退出。 */
  resetManagedTrusteeOptOut(uid) {
    const member = this.members.find((item) => Number(item.player.uid) === Number(uid));
    if (member) member.managedTrusteeOptOut = false;
  }

  setNextWskHandPlan(uid, rawCounts) {
    if (Number(this.gameType) !== 17) return { error: '只有说胡子房间可设置下一局起手牌' };
    if (this.step >= maxStep(this)) return { error: '房间已没有下一局' };
    const target = this.members.find((member) => !member.view && Number(member.player.uid) === Number(uid));
    if (!target) return { error: '指定玩家不在座位上' };
    if (!rawCounts || typeof rawCounts !== 'object' || Array.isArray(rawCounts)) return { error: '指定牌数据无效' };
    const allowed = new Set([ '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'joker' ]);
    const counts = {};
    let total = 0;
    for (const [rank, rawCount] of Object.entries(rawCounts)) {
      if (!allowed.has(rank)) return { error: `不支持的牌面：${rank}` };
      const count = Number(rawCount);
      if (!Number.isInteger(count) || count < 0) return { error: '指定数量必须是非负整数' };
      if (!count) continue;
      const available = rank === 'joker' ? 4 : ((this.config.去掉34 && (rank === '3' || rank === '4')) ? 0 : 8);
      const label = rank === 'joker' ? '鬼牌' : `${rank}点`;
      if (count > available) return { error: `${label}最多可指定${available}张` };
      counts[rank] = count;
      total += count;
    }
    const fullDeck = qjshzRules.buildDeck(!!this.config.去掉34);
    const handSize = fullDeck.length / this.config.人数;
    if (!total) return { error: '请至少指定一张牌' };
    if (total > handSize) return { error: `指定牌不能超过${handSize}张` };
    const otherCards = fullDeck.filter((card) => !Object.hasOwn(counts,
      card >= 170 ? 'joker' : String(qjshzRules.cardValue(card)))).length;
    if (otherCards < handSize - total) {
      return { error: '指定牌面过多，剩余牌无法在保持指定数量的情况下补齐手牌' };
    }
    this.nextWskHandPlan = { uid: Number(uid), counts, total };
    this.host.log(`  [房${this.roomId}] 后台设置下一局起手牌 uid=${uid} ${JSON.stringify(counts)}`);
    return { ...this.nextWskHandPlan, counts: { ...counts } };
  }

  clearNextWskHandPlan() {
    const previous = this.nextWskHandPlan;
    this.nextWskHandPlan = null;
    if (previous) this.host.log(`  [房${this.roomId}] 后台取消下一局起手牌 uid=${previous.uid}`);
    return previous ? { ...previous, counts: { ...previous.counts } } : null;
  }

  setNextWskPartnerPlan(uid, partnerUid) {
    if (Number(this.gameType) !== 17) return { error: '只有说胡子房间可指定对家' };
    if (this.step >= maxStep(this)) return { error: '房间已没有下一局' };
    uid = Number(uid); partnerUid = Number(partnerUid);
    if (!Number.isSafeInteger(uid) || !Number.isSafeInteger(partnerUid) || uid <= 0 || partnerUid <= 0) {
      return { error: '玩家 ID 无效' };
    }
    if (uid === partnerUid) return { error: '不能把玩家自己设为对家' };
    const seated = this.members.filter((member) => !member.view);
    if (!seated.some((member) => Number(member.player.uid) === uid)
      || !seated.some((member) => Number(member.player.uid) === partnerUid)) {
      return { error: '指定玩家不在座位上' };
    }
    this.nextWskPartnerPlan = { uid, partnerUid };
    this.host.log(`  [房${this.roomId}] 后台设置下一局对家 uid=${uid} partnerUid=${partnerUid}`);
    return { ...this.nextWskPartnerPlan };
  }

  clearNextWskPartnerPlan() {
    const previous = this.nextWskPartnerPlan;
    this.nextWskPartnerPlan = null;
    if (previous) this.host.log(`  [房${this.roomId}] 后台取消下一局对家 uid=${previous.uid} partnerUid=${previous.partnerUid}`);
    return previous ? { ...previous } : null;
  }

  hasOnlineHuman() {
    return this.members.some((m) => !m.bot && m.online);
  }

  hasHumanMember() {
    return this.members.some((m) => !m.bot);
  }

  armRoomExpiry() {
    if (typeof this.host.cancel === 'function') this.host.cancel(ROOM_EXPIRE_TIMER);
    if (this.closed || !Number.isFinite(this.roomExpireAt) || this.roomExpireAt <= 0) return;
    if (typeof this.host.schedule === 'function') this.host.schedule(ROOM_EXPIRE_TIMER, this.roomExpireAt);
  }

  releaseIfNoHumans() {
    if (this.hasHumanMember()) return false;
    this.dissolve();
    return true;
  }

  canSit() {
    return !this.round && this.seats().length < this.config.人数;
  }

  canWatch() {
    return !!this.config.观战 && this.watchers().length < MAX_WATCH;
  }

  nextSite() {
    const used = new Set(this.seats().map((m) => m.site));
    let site = 1;
    while (used.has(site)) site += 1;
    return site;
  }

  sendTo(m, buf) {
    if (m && m.online && m.connId) this.host.send(m.connId, buf);
  }

  broadcast(msghead, data) {
    const frame = push(msghead, data);
    for (const m of this.members) this.sendTo(m, frame);
  }

  broadcastExcept(uid, msghead, data) {
    const frame = push(msghead, data);
    const skip = Number(uid);
    for (const m of this.members) {
      if (Number(m.player.uid) === skip) continue;
      this.sendTo(m, frame);
    }
  }

  pushChat(uid, encoded) {
    const data = { chat: encoded };
    let type = 0;
    try {
      type = Number(JSON.parse(encoded).type) || 0;
    } catch { /* */ }
    if (type === 3) this.broadcastExcept(uid, 'chatroom', data);
    else this.broadcast('chatroom', data);
  }

  makeIo() {
    const table = this;
    return {
      log: (line) => table.host.log(`  [房${table.roomId}] ${line}`),
      table,
      all: (msghead, data) => {
        const frame = push(msghead, data);
        for (const m of table.members) table.sendTo(m, frame);
      },
      each: (msghead, build) => {
        table.seats().forEach((m, s) => {
          const data = build(s);
          if (msghead === 'game_end') {
            table.lastEnd = table.lastEnd || [];
            table.lastEnd[s] = data;
          }
          table.sendTo(m, push(msghead, data));
        });
        const watchers = table.watchers();
        if (!watchers.length) return;
        const data = build(-1);
        if (msghead === 'game_begin' && Number(table.gameType) === 17) {
          for (const watcher of watchers) {
            const session = table.wskWatchSessions.get(Number(watcher.player.uid));
            const target = session && table.wskWatchTarget({ uid: session.targetUid });
            if (!target) {
              table.sendTo(watcher, push(msghead, data));
              continue;
            }
            const reveal = session.grants.has(Number(target.uid))
              && !table.wskWatchHandDistanceError(watcher, target);
            const outgoing = { ...data, players: data.players.slice(), watch_pos: target.seat };
            if (reveal) {
              outgoing.players[target.seat] = table.round.playerSnapshot(target.seat,
                target.seat, false);
            }
            table.sendTo(watcher, push(msghead, outgoing));
            // 新局会重建观战按钮状态；同步告诉客户端当前视角仍已授权，
            // 避免必须重启走重连快照后才重新显示明牌。
            table.sendTo(watcher, push('wsk_watch_view', {
              uid: target.uid,
              pos: target.seat,
              hand_granted: reveal,
            }));
          }
          return;
        }
        const frame = push(msghead, data);
        for (const m of watchers) table.sendTo(m, frame);
      },
      one: (seat, msghead, data) => {
        const m = table.seats()[seat];
        if (!m) return;
        // 托管时服务端会替玩家完成碰、杠、过。若仍把真实候选项下发给
        // 客户端，代打结束后旧版客户端可能把按钮留在桌面上。发空候选项
        // 既能主动清掉已有按钮，也不影响服务端保存和执行真实操作。
        const hideOperator = msghead === 'game_operator'
          && Number(table.gameType) === GANDENGYAN_GAME_TYPE
          && !!m.trustee;
        const outgoing = hideOperator ? EMPTY_MAHJONG_OPERATOR : data;
        table.host.log(`  [房${table.roomId}] -> ${m.player.uid} ${msghead}${hideOperator ? ' [托管隐藏]' : ''} ${JSON.stringify(outgoing)}`);
        table.sendTo(m, push(msghead, outgoing));
      },
      over: (result) => {
        const seats = table.seats();
        const tape = table.round && table.round.tape;
        // 托管中的真人和陪玩一样自动准备下一局。后台白名单托管
        // 会在 round 清空后暂时解除，所以必须先记住结算瞬间的托管状态。
        const autoReadyUids = new Set(seats
          .filter((member) => member.bot || member.trustee || member.managedTrustee)
          .map((member) => Number(member.player.uid)));
        const winners = result.winners || (result.winner >= 0 ? [result.winner] : []);
        if (table.host.recordBotResult) {
          table.host.recordBotResult(seats.map((member, seat) => ({ member, seat }))
            .filter(({ member }) => member.bot)
            .map(({ member, seat }) => ({
              strategy: member.botStrategy === 'jev' ? 'jev' : 'local',
              won: winners.includes(seat),
              draw: winners.length === 0,
              score: (result.scores && result.scores[seat]) || 0,
            })));
        }
        table.round = null;
        table.syncManagedTrustees({ arm: false });
        if (winners.length) {
          const dealer = result.nextDealer != null ? result.nextDealer : winners[0];
          table.dealerUid = seats[dealer].player.uid;
        } else {
          table.drawCount += 1;
        }
        table.hands.push({
          id: table.host.mintPlaybackId
            ? table.host.mintPlaybackId(table.roomId, table.step)
            : `${table.roomId}${String(table.step).padStart(2, '0')}${String(table.host.now() % 1000).padStart(3, '0')}`,
          scores: seats.map((m, s) => ({
            uid: m.player.uid,
            score: (result.scores && result.scores[s]) || 0,
          })),
          playback: tape ? tape.finish() : null,
        });
        seats.forEach((m, s) => {
          for (const k of Object.keys(result.stat[s])) {
            m.stat[k] = (Number(m.stat[k]) || 0) + (Number(result.stat[s][k]) || 0);
          }
        });
        for (const m of table.members) {
          m.ready = !m.view && autoReadyUids.has(Number(m.player.uid));
          if (m.ready) table.broadcast('game_ready', { uid: m.player.uid, site: m.site });
        }
        table.host.log(`  [房${table.roomId}] 第 ${table.step}/${maxStep(table)} 局结束`);
        if (table.step >= maxStep(table)) {
          table.sendTotalEnd();
          // 房间立即释放；客户端保留已收到的结算画面，玩家手动返回大厅。
          table.dissolve(0, { totalAlreadySent: true, notifyExit: false });
        } else {
          if (table.host.botsEnabled && !table.host.botsEnabled()) table.removeBots();
          const fail = table.tryStartNext();
          if (fail) table.host.log(`  [房${table.roomId}] 托管自动开始下一局失败：${fail}`);
          if (!table.round) table.host.persist();
        }
      },
    };
  }

  sendTotalEnd(normal = true) {
    if (this.round && this.round.tape && !this.round.tape.flushed) {
      const seats = this.seats();
      this.hands.push({
        id: this.host.mintPlaybackId
          ? this.host.mintPlaybackId(this.roomId, this.step)
          : `${this.roomId}${String(this.step).padStart(2, '0')}000`,
        scores: seats.map((m, s) => ({
          uid: m.player.uid,
          score: (this.round.roundScore && this.round.roundScore[s]) || 0,
        })),
        playback: this.round.tape.finish(),
      });
    }
    const seated = this.seats();
    const top = Math.max(0, ...seated.map((m) => m.score || 0));
    this.broadcast('game_bye', {
      time: Math.floor(this.host.now() / 1000),
      normal_end: normal,
      info: seated.map((m) => {
        // 客户端按字段名决定总战绩里画哪些统计项。说胡子只显示这四项，
        // 不能把 emptyMember 的麻将统计字段一并发下去。
        const stat = Number(this.gameType) === 17 ? {
          wsk_winner_count: Number(m.stat.wsk_winner_count) || 0,
          wsk_lose_count: Number(m.stat.wsk_lose_count) || 0,
          wsk_first_count: Number(m.stat.wsk_first_count) || 0,
          wsk_last_count: Number(m.stat.wsk_last_count) || 0,
        } : { ...m.stat, hz_count: this.drawCount };
        return {
          uid: m.player.uid,
          score: m.score || 0,
          winner: (m.score || 0) === top && top > 0,
          ...stat,
        };
      }),
    });
    this.host.log(`  房 ${this.roomId} 总结算${normal ? '' : '（中途散了）'}：`
      + seated.map((m) => `${m.player.uid}=${(m.score || 0) / this.gameRules.RATIO}`).join(' '));
    if (this.host.saveRecord) this.host.saveRecord(this);
  }

  clearAllTimers() {
    for (const m of this.members) this.cancelTurn(m);
    this.host.cancel('dismiss');
    this.host.cancel('empty');
    this.host.cancel(ROOM_EXPIRE_TIMER);
    for (const m of this.members) this.host.cancel(`kick-${m.player.uid}`);
  }

  dissolve(reason = 0, { totalAlreadySent = false, notifyExit = null } = {}) {
    if (this.closed) return;
    this.closed = true;
    this.clearAllTimers();
    const hasSettlement = totalAlreadySent || this.step > 0 || !!this.round;
    if (!totalAlreadySent && hasSettlement) this.sendTotalEnd(false);
    // 已开局的房间保留总结算画面，由玩家自己返回；未开局仍直接退出。
    if (notifyExit === true || (notifyExit === null && !hasSettlement)) {
      this.broadcast('exitroom', { reason });
    }
    for (const m of this.members) {
      m.player.roomId = 0;
      this.host.onUidRoom(m.player.uid, 0);
    }
    this.round = null;
    this.host.log(`  房 ${this.roomId} 已解散`);
    this.host.onDissolved(reason);
    this.host.persist();
  }

  charge(uid, amount, reason) {
    if (!amount || !this.host.changeCards) return;
    this.host.changeCards(uid, -amount, reason);
    this.cardCharges.push({ uid, amount });
  }

  cancelTurn(member) {
    this.host.cancel(`turn-${member.player.uid}`);
    member.turnDeadline = 0;
    member.turnDueAt = 0;
    member.automationTurn = null;
  }

  automationStrategy(member) {
    return member.managedTrustee && this.host.trusteeStrategy
      ? this.host.trusteeStrategy(member.site)
      : (member.botStrategy || member.player.botStrategy || 'local');
  }

  automationDelayMs() {
    const random = this.host.random ? this.host.random() : Math.random();
    const ratio = Math.max(0, Math.min(1, Number.isFinite(random) ? random : 0));
    return BOT_MIN_DELAY_MS + Math.round(ratio * (BOT_MAX_DELAY_MS - BOT_MIN_DELAY_MS));
  }

  /** 牌局进度的廉价标记：轮次、待响应操作、各家手牌数量任一变化即视为有进展。 */
  roundProgressMark() {
    const round = this.round;
    if (!round) return null;
    const seatCount = this.seats().length;
    const hands = [];
    for (let seat = 0; seat < seatCount; seat++) {
      let size = '';
      try {
        if (typeof round.looseTiles === 'function') size = round.looseTiles(seat).length;
        else if (Array.isArray(round.hands) && Array.isArray(round.hands[seat])) size = round.hands[seat].length;
      } catch {
        size = '?';
      }
      hands.push(size);
    }
    const pending = round.pending || null;
    return {
      round,
      pending,
      key: [
        round.over ? 1 : 0,
        round.waitingSeats().join(','),
        round.turn,
        pending && pending.replies ? pending.replies.size : '',
        hands.join(','),
      ].join('|'),
    };
  }

  armTurns(onlyUid) {
    const round = this.round;
    const members = onlyUid == null
      ? this.members : this.members.filter((m) => m.player.uid === onlyUid);
    if (!round || round.over) {
      for (const m of members) this.cancelTurn(m);
      return;
    }
    const waiting = new Set(round.waitingSeats());
    for (const m of members) {
      const seat = round.seatOf(m.player.uid);
      const key = `turn-${m.player.uid}`;
      if (m.view || seat < 0 || !waiting.has(seat)) {
        this.cancelTurn(m);
        continue;
      }
      const automated = !!(m.bot || m.managedTrustee);
      const delayMs = automated ? this.automationDelayMs()
        : (m.trustee ? 1000 : (this.config.托管 || 0) * 1000);
      if (delayMs <= 0) {
        this.cancelTurn(m);
        continue;
      }
      const now = this.host.now();
      const handSignature = typeof round.looseTiles === 'function'
        ? round.looseTiles(seat).slice().sort((a, b) => a - b).join(',') : '';
      const existing = m.automationTurn;
      if (automated && existing && existing.round === round && existing.pending === round.pending
        && existing.turn === round.turn && existing.seat === seat
        && existing.handSignature === handSignature && m.turnDueAt) {
        this.host.schedule(key, m.turnDueAt);
        continue;
      }
      this.cancelTurn(m);
      const openingPresentationUntil = automated && Number(this.gameType) === GANDENGYAN_GAME_TYPE
        ? this.lastRoundStartedAt + BOT_OPENING_PRESENTATION_MS : 0;
      m.turnDueAt = Math.max(now, openingPresentationUntil) + delayMs;
      m.turnDeadline = Math.floor(m.turnDueAt / 1000);
      if (automated) {
        const ticket = { round, pending: round.pending, turn: round.turn, seat, handSignature,
          prepared: null, ready: false, decision: null };
        m.automationTurn = ticket;
        if (this.automationStrategy(m) === 'jev' && this.host.jevBot
          && typeof round.prepareAutoPlayJev === 'function') {
          ticket.prepared = round.prepareAutoPlayJev(seat, this.host.jevBot);
          if (ticket.prepared) {
            Promise.resolve(ticket.prepared.promise).then((decision) => {
              if (m.automationTurn !== ticket) return;
              ticket.ready = true;
              ticket.decision = decision;
            }).catch((error) => {
              if (m.automationTurn === ticket) ticket.failed = true;
              this.host.log(`  [房${this.roomId}] Jev 决策失败，将使用本地策略：${error.message}`);
            });
          }
        }
      }
      this.host.schedule(key, m.turnDueAt);
    }
  }

  takeRoomCards() {
    if (this.cardCharges.length) return null;
    const cost = this.gameRules.roomCardCost({
      num: this.num,
      人数: this.config.人数,
      房费: this.config.房费,
    });
    if (this.clubId) {
      const amount = cost.host || cost.each * this.config.人数;
      const balance = this.host.clubCardBalance(this.clubId);
      if (balance == null || balance < amount) return '俱乐部房卡不足';
      if (this.host.changeClubCards(this.clubId, -amount, `房间 ${this.roomId} 首局扣费`) == null) {
        return '俱乐部房卡不足';
      }
      this.cardCharges.push({ clubId: this.clubId, amount });
      return null;
    }
    if (cost.host > 0) {
      const host = this.members.find((m) => m.player.uid === this.hostUid);
      if (!host || (host.player.cardNum || 0) < cost.host) return '房卡不足';
      this.charge(host.player.uid, cost.host, '房主支付');
      return null;
    }
    if (cost.each > 0) {
      const humans = this.members.filter((m) => !m.view && !m.bot);
      if (humans.some((m) => (m.player.cardNum || 0) < cost.each)) return '房卡不足';
      for (const m of humans) this.charge(m.player.uid, cost.each, 'AA支付');
    }
    return null;
  }

  startGame() {
    if (this.step < 1) {
      const fail = this.takeRoomCards();
      if (fail) {
        this.host.log(`  [房${this.roomId}] 开局失败：${fail}`);
        return fail;
      }
    }
    const seats = this.seats();
    const dealerSeat = this.dealerUid
      ? Math.max(0, seats.findIndex((m) => m.player.uid === this.dealerUid))
      : Math.max(0, seats.findIndex((m) => m.player.uid === this.hostUid));
    this.lastRoundStartedAt = this.host.now();
    this.roomExpireAt = this.lastRoundStartedAt + STARTED_ROOM_TTL_MS;
    this.armRoomExpiry();
    this.step += 1;
    // 已同意的看牌授权覆盖整场大局。新小局只取消尚未处理的旧申请，
    // 已授权玩家继续有效；每次生成明牌快照仍会重新执行距离校验。
    for (const session of this.wskWatchSessions.values()) {
      if (session.pending instanceof Map) session.pending.clear();
    }
    const RoundClass = isClubPoker(this.gameType) ? ClubPokerRound : Number(this.gameType) === 17 ? WskRound : Round;
    let appliedPartnerPlan = Number(this.gameType) === 17 && this.nextWskPartnerPlan
      ? { ...this.nextWskPartnerPlan } : null;
    if (appliedPartnerPlan) {
      const seatedUids = new Set(seats.map((member) => Number(member.player.uid)));
      if (!seatedUids.has(appliedPartnerPlan.uid) || !seatedUids.has(appliedPartnerPlan.partnerUid)) {
        this.host.log(`  [房${this.roomId}] 下一局指定对家已失效：玩家已不在座位`);
        this.nextWskPartnerPlan = null;
        appliedPartnerPlan = null;
      }
    }
    this.round = new RoundClass(seats, {
      config: this.config,
      dealerSeat,
      forcedPartner: appliedPartnerPlan,
      protectedHandUid: this.nextWskHandPlan ? this.nextWskHandPlan.uid : 0,
    }, this.makeIo());
    // 开局后准备态即已消费，不能带到行牌中的重连快照。
    for (const member of seats) member.ready = false;
    let deckOverride = null;
    let appliedHandPlan = null;
    if (Number(this.gameType) === 17 && this.nextWskHandPlan) {
      const targetSeat = seats.findIndex((member) => Number(member.player.uid) === Number(this.nextWskHandPlan.uid));
      if (targetSeat < 0) {
        this.host.log(`  [房${this.roomId}] 下一局起手牌已失效：玩家 ${this.nextWskHandPlan.uid} 已不在座位`);
        this.nextWskHandPlan = null;
      } else {
        try {
          deckOverride = qjshzRules.buildDeckForSeat(this.config, this.nextWskHandPlan.counts, targetSeat, seats.length);
          appliedHandPlan = this.nextWskHandPlan;
        } catch (error) {
          this.host.log(`  [房${this.roomId}] 下一局起手牌已取消：${error.message}`);
          this.nextWskHandPlan = null;
        }
      }
    }
    this.syncManagedTrustees({ arm: false });
    this.round.start(deckOverride);
    if (appliedPartnerPlan) {
      this.host.log(`  [房${this.roomId}] 已应用后台指定对家 uid=${appliedPartnerPlan.uid} partnerUid=${appliedPartnerPlan.partnerUid}`);
      this.nextWskPartnerPlan = null;
    }
    if (appliedHandPlan) {
      this.host.log(`  [房${this.roomId}] 已发放后台指定起手牌 uid=${appliedHandPlan.uid} ${JSON.stringify(appliedHandPlan.counts)}`);
      this.nextWskHandPlan = null;
    }
    this.armTurns();
    this.host.persist();
    return null;
  }

  tryStartNext() {
    if (this.round) return null;
    if (this.step >= maxStep(this)) return null;
    const seated = this.members.filter((m) => !m.view);
    if (seated.length !== this.config.人数) return null;
    if (!seated.every((m) => m.ready)) return null;
    return this.startGame();
  }

  handleDismiss(uid, agree) {
    if (agree && !this.round && this.step < 1) {
      // 客户端的“退出房间”和“申请解散”共用 dissmissroom 消息，
      // 未开局时要由服务端按身份区分：普通房房主解散整房，
      // 其他玩家只退出自己。俱乐部房没有固定房主，首位玩家
      // 退出后继续沿用原有的桌主移交逻辑。
      if (!this.clubId && uid === this.hostUid) {
        this.dissolve();
        return;
      }
      const member = this.members.find((m) => m.player.uid === uid && !m.view);
      if (!member) return;
      this.members = this.members.filter((m) => m !== member);
      member.player.roomId = 0;
      this.host.onUidRoom(uid, 0);
      this.host.cancel(`kick-${uid}`);
      this.cancelTurn(member);
      this.sendTo(member, push('exitroom', { reason: 0 }));
      if (this.hostUid === uid) {
        const nextHost = this.seats().find((m) => !m.bot);
        this.hostUid = nextHost ? nextHost.player.uid : 0;
      }
      if (this.releaseIfNoHumans()) return;
      else {
        this.broadcast('roominfo', roomInfo(this));
        this.host.persist();
      }
      return;
    }
    if (!agree) {
      this.dismiss = null;
      this.host.cancel('dismiss');
      this.broadcast('nodissmissroom', { uid });
      this.host.log(`  [房${this.roomId}] ${uid} 拒绝解散`);
      return;
    }
    if (!this.dismiss) {
      this.dismiss = {
        agree: [uid],
        time: Math.floor(this.host.now() / 1000) + DISMISS_SEC,
      };
      this.host.schedule('dismiss', this.host.now() + DISMISS_SEC * 1000);
    } else if (!this.dismiss.agree.includes(uid)) {
      this.dismiss.agree.push(uid);
    }
    for (const m of this.members) {
      if (m.bot && !this.dismiss.agree.includes(m.player.uid)) {
        this.dismiss.agree.push(m.player.uid);
      }
    }
    this.broadcast('dissmissroom', { agree: this.dismiss.agree, time: this.dismiss.time });
    const voters = this.members.filter((m) => !m.view).length;
    if (this.dismiss.agree.length >= voters) this.dissolve();
  }

  needsBots() {
    if (this.round) return false;
    if (this.members.some((m) => m.bot)) return false;
    const humans = this.members.filter((m) => !m.view && !m.bot);
    return humans.length === 1 && this.seats().length < this.config.人数;
  }

  addBots(players) {
    for (const { player, site, botStrategy } of players) {
      player.roomId = this.roomId;
      this.members.push(emptyMember(player, {
        site,
        ready: true,
        trustee: true,
        online: true,
        bot: true,
        botStrategy: botStrategy || player.botStrategy,
      }));
      this.host.onUidRoom(player.uid, this.roomId);
      this.broadcast('game_ready', { uid: player.uid, site });
    }
    this.host.log(`  房 ${this.roomId} 补了 ${players.length} 个陪玩`);
    this.host.persist();
  }

  /** 关闭陪玩时只在局间移除；进行中的牌局等待本小局结束。 */
  removeBots() {
    if (this.round) return 0;
    const bots = this.members.filter((member) => member.bot);
    if (!bots.length) return 0;
    const ids = new Set(bots.map((member) => member.player.uid));
    this.members = this.members.filter((member) => !ids.has(member.player.uid));
    for (const member of bots) {
      member.player.roomId = 0;
      this.host.onUidRoom(member.player.uid, 0);
      if (this.host.forgetBot) this.host.forgetBot(member.player.uid);
    }
    this.host.log(`  房 ${this.roomId} 移除 ${bots.length} 个陪玩`);
    this.broadcast('roominfo', roomInfo(this));
    this.host.persist();
    return bots.length;
  }

  /**
   * WSK 客户端即使在开局前也会按完整 game_info 解析进房数据，不能像麻将一样回空对象。
   * 这里给说胡子构造一份“等待中”的快照，避免读取 players.length 时直接中断切场。
   */
  waitingGameSnapshot() {
    if (isClubPoker(this.gameType)) return {begin:false,step:this.step,game_stage:0,drift_stage:false,landlord:0,bottom_card:[],level_card:20,bomb_bet_score:1,
      players:this.seats().map(m=>({uid:m.player.uid,total:m.score||0,ready:!!m.ready,bet_num:1,op_redouble:1,bomb_num:0,card_step_out:0,self_level_card:20,
        card:{hand_card:[],hand_card_num:0,last_dis_card:[],last_pass:false}}))};
    if (Number(this.gameType) !== 17) return {};
    return {
      begin: false,
      players: this.seats().map((member) => ({
        uid: member.player.uid,
        ready: !!member.ready,
        total: member.score || 0,
        score: 0,
        card_step_out: 0,
        grasp_score: 0,
        bomb_score: 0,
        show_xi_card: [],
        pass: false,
        card: {
          hand_card: [],
          hand_card_num: 0,
          last_dis_card: [],
        },
      })),
      step: this.step || 0,
      game_stage: 0,
      friend_card: 0,
      hard_card_uid: 0,
      banker_uid: this.dealerUid || 0,
      friend_uid: 0,
      desktop_score: 0,
      desk_card_scores: [],
      step_card_info: [],
    };
  }

  join(player, connId, location) {
    let mine = this.members.find((m) => m.player.uid === player.uid);
    const rejoining = !!mine;
    if (mine) {
      mine.player = player;
      mine.connId = connId;
      mine.online = true;
      this.host.cancel(`kick-${player.uid}`);
    } else if (this.canSit()) {
      mine = emptyMember(player, {
        connId,
        site: this.nextSite(),
        online: true,
      });
      this.members.push(mine);
    } else if (this.canWatch()) {
      mine = emptyMember(player, {
        connId,
        site: 0,
        online: true,
        view: true,
      });
      this.members.push(mine);
    } else if (!this.config.观战) {
      return { error: '该房间不允许观战' };
    } else {
      return { error: this.watchers().length >= MAX_WATCH ? '观战人数已满' : '房间已满' };
    }
    // 每次进房或重连都重新取本次上报的位置。缺失时清空旧值，防止用历史
    // 坐标绕过近距离校验；位置只保留到本桌服务进程内存中。
    mine.location = normalizeLocation(location);
    if (!this.hostUid && mine && !mine.view) this.hostUid = player.uid;
    player.roomId = this.roomId;
    this.host.onUidRoom(player.uid, this.roomId);
    const how = rejoining ? '重连' : mine.view ? '观战' : '进房';
    this.host.log(`  202 ${how} ${this.roomId}，在座 ${this.seats().length} 观战 ${this.watchers().length}`);

    let game = this.waitingGameSnapshot();
    if (this.round && !this.round.over) {
      const seat = this.round.seatOf(player.uid);
      if (seat >= 0 || Number(this.gameType) !== 17 || !mine.view) {
        game = this.round.snapshot(seat >= 0 ? seat : -1, { begin: true });
      } else {
        const session = this.wskWatchSession(player.uid);
        const targetSeat = this.round.seatOf(session.targetUid);
        const target = targetSeat >= 0 ? {
          uid: Number(session.targetUid),
          seat: targetSeat,
          member: this.seats()[targetSeat],
        } : null;
        const reveal = !!target && session.grants.has(Number(session.targetUid))
          && !this.wskWatchHandDistanceError(mine, target);
        game = this.round.watcherSnapshot(targetSeat, reveal, { begin: true });
        if (targetSeat >= 0) game.watch_pos = targetSeat;
      }
    } else if (this.lastEnd) {
      const seat = this.seats().findIndex((m) => m.player.uid === player.uid);
      if (seat >= 0 && this.lastEnd[seat]) game = this.lastEnd[seat];
      else if (mine.view && this.lastEnd[0]) game = this.lastEnd[0];
    }
    return { error: null, game, rejoining };
  }

  afterJoin(uid) {
    this.broadcast('lineperson', { uid, line: true });
    this.broadcast('roominfo', roomInfo(this));
    // 旧版客户端的 roominfo 解析器不读 ready 字段。对刚进房/重连的
    // 连接重放已准备座位，避免服务端认为已入座，界面却显示未准备。
    const mine = this.members.find((member) => Number(member.player.uid) === Number(uid));
    if (mine && (!this.round || this.round.over)) {
      for (const member of this.seats()) {
        if (member.ready) {
          this.sendTo(mine, push('game_ready', {
            uid: member.player.uid,
            site: member.site,
          }));
        }
      }
    }
    if (this.round && !this.round.over) {
      const seat = this.round.seatOf(uid);
      if (seat >= 0) this.round.replayOps(seat);
    }
    this.host.persist();
  }

  dropWatcher(uid, { notify } = {}) {
    const mine = this.members.find((m) => m.player.uid === uid);
    if (!mine || !mine.view) return;
    this.members = this.members.filter((m) => m.player.uid !== uid);
    mine.player.roomId = 0;
    this.host.onUidRoom(uid, 0);
    this.host.cancel(`kick-${uid}`);
    this.host.log(`  [房${this.roomId}] ${uid} ${notify ? '离开观战' : '观战掉线'}`);
    if (notify) this.sendTo(mine, push('exitroom', { reason: 0 }));
    if (this.releaseIfNoHumans()) return;
    this.broadcast('roominfo', roomInfo(this));
    this.host.persist();
  }

  kickMember(uid) {
    if (this.round || this.step > 0) return { error: '牌局进行中不能踢人' };
    const member = this.members.find((m) => m.player.uid === uid);
    if (!member || member.bot) return { error: '玩家不在房间里' };
    this.members = this.members.filter((m) => m !== member);
    member.player.roomId = 0;
    this.host.onUidRoom(uid, 0);
    this.host.cancel(`kick-${uid}`);
    this.cancelTurn(member);
    this.sendTo(member, push('exitroom', { reason: 2 }));
    this.host.log(`  [房${this.roomId}] 管理员踢出 ${uid}`);
    if (this.releaseIfNoHumans()) return { error: null };
    else {
      this.broadcast('roominfo', roomInfo(this));
      this.host.persist();
    }
    return { error: null };
  }

  releaseFinishedPlayer(uid) {
    if (this.round || this.step < maxStep(this)) return false;
    const member = this.members.find((m) => m.player.uid === uid);
    if (!member) return false;
    this.members = this.members.filter((m) => m !== member);
    member.player.roomId = 0;
    this.host.onUidRoom(uid, 0);
    this.host.cancel(`kick-${uid}`);
    this.cancelTurn(member);
    if (this.releaseIfNoHumans()) return true;
    else {
      this.broadcast('roominfo', roomInfo(this));
      this.host.persist();
    }
    return true;
  }

  chatFor(member, uid, body) {
    let chat = {};
    try {
      chat = typeof body.chat === 'string' ? JSON.parse(body.chat) : (body.chat || {});
    } catch {
      return { error: 1, what: '聊天内容格式无效' };
    }
    if (!chat || typeof chat !== 'object' || Array.isArray(chat)) {
      return { error: 1, what: '聊天内容格式无效' };
    }
    chat.fromUid = uid;
    const encoded = JSON.stringify(chat);
    if (Buffer.byteLength(encoded, 'utf8') > MAX_CHAT_BYTES) {
      return { error: 1, what: '聊天内容过长' };
    }
    const now = this.host.now();
    const times = (member.chatTimes || []).filter((at) => now - at < CHAT_WINDOW_MS);
    if (times.length >= CHAT_MAX_IN_WINDOW) {
      member.chatTimes = times;
      return { error: 1, what: '聊天太频繁' };
    }
    times.push(now);
    member.chatTimes = times;
    return { error: 0, chat: encoded };
  }

  wskWatchSession(uid) {
    uid = Number(uid);
    let session = this.wskWatchSessions.get(uid);
    if (!session) {
      session = { targetUid: 0, grants: new Set(), pending: new Map() };
      this.wskWatchSessions.set(uid, session);
    }
    return session;
  }

  wskWatchTarget(body) {
    if (Number(this.gameType) !== 17 || !this.round || this.round.over) return null;
    const targetUid = Number(body && body.uid);
    const seat = this.round.seatOf(targetUid);
    if (seat < 0) return null;
    return { uid: targetUid, seat, member: this.seats()[seat] };
  }

  sendWskWatcherSnapshot(watcher, session, target) {
    const reveal = session.grants.has(Number(target.uid))
      && !this.wskWatchHandDistanceError(watcher, target);
    // 切换观战视角发生在当前牌局中。begin=false 会被原生说胡子客户端
    // 解释成 SingleEnd，继而弹出结算动画并离开房间。
    const snapshot = this.round.watcherSnapshot(target.seat, reveal, { begin: true });
    snapshot.watch_pos = target.seat;
    this.sendTo(watcher, push('game_info', snapshot));
  }

  handleWskWatchView(watcher, body) {
    const target = this.wskWatchTarget(body);
    if (!target) return { error: 1, what: '观战目标不存在' };
    const session = this.wskWatchSession(watcher.player.uid);
    session.targetUid = target.uid;
    // 切换视角不撤销此前已经取得的授权；切回该玩家时直接恢复明牌。
    this.sendWskWatcherSnapshot(watcher, session, target);
    this.sendTo(watcher, push('wsk_watch_view', {
      uid: target.uid,
      pos: target.seat,
      hand_granted: session.grants.has(target.uid)
        && !this.wskWatchHandDistanceError(watcher, target),
    }));
    return { error: 0 };
  }

  wskWatchHandDistanceError(watcher, target) {
    const members = [];
    if (target && target.member && !target.member.bot) {
      members.push({ member: target.member, teammate: false });
    }
    // 说胡子固定为对面座位组队。查看一个人的手牌也会泄露他所在队伍的
    // 信息，因此观战者接近该玩家的真人队友时同样禁止查看。
    if (this.round && target && Number.isInteger(target.seat)) {
      const teammateSeat = typeof this.round.teammate === 'function'
        ? this.round.teammate(target.seat) : (target.seat + 2) % 4;
      const teammate = this.seats()[teammateSeat];
      if (teammate && !teammate.bot && teammate !== target.member) {
        members.push({ member: teammate, teammate: true });
      }
    }
    // 全机器人队没有现实位置，也不存在与观战者串通的风险。
    if (!members.length) return '';
    const watcherIp = normalizeIp(watcher && watcher.player && watcher.player.lastIp);
    for (const item of members) {
      const distance = locationDistanceMeters(
        watcher && watcher.location, item.member && item.member.location,
      );
      if (distance != null && distance < WSK_WATCH_HAND_MIN_DISTANCE_METERS) {
        return item.teammate
          ? '您与该玩家的队友距离过近，不能查看手牌'
          : '双方距离过近，不能查看手牌';
      }
      // 旧原生包的定位桥接可能返回空值。缺少任一方坐标时，以登录时由
      // 服务端记录的公网 IP 降级判断；同一网络仍禁止看牌，不同网络则
      // 允许申请，避免定位桥接失效导致所有正常观战者都无法使用功能。
      if (distance == null && watcherIp) {
        const memberIp = normalizeIp(item.member && item.member.player
          && item.member.player.lastIp);
        if (memberIp && memberIp === watcherIp) {
          return item.teammate
            ? '检测到您与该玩家的队友使用同一网络，不能查看手牌'
            : '检测到双方使用同一网络，不能查看手牌';
        }
      }
    }
    return '';
  }

  handleWskWatchHandRequest(watcher, body) {
    const target = this.wskWatchTarget(body);
    if (!target) return { error: 1, what: '当前无法申请查看手牌' };
    const session = this.wskWatchSession(watcher.player.uid);
    if (session.targetUid && session.targetUid !== target.uid) {
      return { error: 1, what: '请先切换到该玩家视角' };
    }
    session.targetUid = target.uid;
    const distanceError = this.wskWatchHandDistanceError(watcher, target);
    if (distanceError) return { error: 1, what: distanceError };
    if (session.grants.has(target.uid)) {
      this.sendWskWatcherSnapshot(watcher, session, target);
      this.sendTo(watcher, push('wsk_watch_hand_granted', { uid: target.uid }));
      return { error: 0 };
    }
    // 陪玩机器人没有客户端连接，收不到确认弹窗。观战者申请查看机器人
    // 手牌时直接授权，否则请求会永远停留在 pending 状态，看起来像按钮失效。
    if (target.member.bot) {
      session.pending.delete(target.uid);
      session.grants.add(target.uid);
      this.host.persist();
      this.sendWskWatcherSnapshot(watcher, session, target);
      this.sendTo(watcher, push('wsk_watch_hand_granted', { uid: target.uid }));
      return { error: 0 };
    }
    const requestId = randomBytes(12).toString('hex');
    session.pending.set(target.uid, requestId);
    this.sendTo(target.member, push('wsk_watch_hand_request', {
      request_id: requestId,
      watcher_uid: Number(watcher.player.uid),
      watcher_name: watcher.player.nickname || `玩家${watcher.player.uid}`,
    }));
    return { error: 0 };
  }

  handleWskWatchHandReply(uid, body) {
    if (Number(this.gameType) !== 17 || !this.round || this.round.over) {
      return { error: 1, what: '牌局已结束' };
    }
    const requestId = String(body && body.request_id || '');
    const watcherUid = Number(body && body.watcher_uid);
    const session = this.wskWatchSessions.get(watcherUid);
    if (!session || !(session.pending instanceof Map)
      || session.pending.get(Number(uid)) !== requestId) {
      return { error: 1, what: '申请已失效' };
    }
    const target = this.wskWatchTarget({ uid });
    if (!target) return { error: 1, what: '玩家已不在牌局中' };
    session.pending.delete(Number(uid));
    // 拒绝只在服务端结束申请，不给观战者弹提示。
    if (!body || !body.agree) return { error: 0 };
    const watcher = this.members.find((member) => member.view
      && Number(member.player.uid) === watcherUid);
    if (!watcher) return { error: 1, what: '观战者已离开房间' };
    const distanceError = this.wskWatchHandDistanceError(watcher, target);
    if (distanceError) return { error: 1, what: distanceError };
    session.grants.add(Number(uid));
    this.host.persist();
    if (watcher) {
      if (session.targetUid === Number(uid)) this.sendWskWatcherSnapshot(watcher, session, target);
      this.sendTo(watcher, push('wsk_watch_hand_granted', { uid: Number(uid) }));
    }
    return { error: 0 };
  }

  leave(uid, connId) {
    const mine = this.members.find((m) => m.player.uid === uid);
    if (!mine || mine.connId !== connId) return;
    if (mine.view) {
      mine.connId = null;
      mine.online = false;
      this.host.log(`  [房${this.roomId}] ${uid} 观战离线，保留重连`);
      this.broadcast('lineperson', { uid, line: false });
      this.broadcast('roominfo', roomInfo(this));
      this.host.schedule(`kick-${uid}`, this.host.now() + WATCH_RECONNECT_GRACE_MS);
      this.host.persist();
      return;
    }
    mine.connId = null;
    mine.online = false;
    this.host.log(`  [房${this.roomId}] ${uid} 离线`);
    this.broadcast('lineperson', { uid, line: false });
    this.broadcast('roominfo', roomInfo(this));

    if (this.round && !this.round.over && !mine.trustee && this.config.托管 > 0) {
      mine.trustee = true;
      this.broadcast('trustee', { uid, status: true });
      this.armTurns(uid);
    }

    const kickSec = this.round ? 0 : (this.config.踢人 || 0);
    if (kickSec > 0) {
      this.host.schedule(`kick-${uid}`, this.host.now() + kickSec * 1000);
    }
    this.host.persist();
  }

  onTimer(name) {
    if (name === 'dismiss') {
      if (!this.dismiss) return;
      this.host.log(`  [房${this.roomId}] 解散超时，按同意算`);
      this.dissolve();
      return;
    }
    if (name === ROOM_EXPIRE_TIMER) {
      // 生命周期与在线状态无关。旧回调如果早于当前截止时间，只重挂机制，
      // 不能释放被新一局延长过的房间。
      if (this.host.now() < this.roomExpireAt) this.armRoomExpiry();
      else {
        this.host.log(`  [房${this.roomId}] 生命周期到期，自动释放`);
        this.dissolve();
      }
      return;
    }
    if (name.startsWith('kick-')) {
      const uid = Number(name.slice(5));
      const still = this.members.find((m) => m.player.uid === uid);
      if (!still || still.online) return;
      this.members = this.members.filter((m) => m.player.uid !== uid);
      still.player.roomId = 0;
      this.host.onUidRoom(uid, 0);
      this.host.log(`  [房${this.roomId}] ${uid} 离线超时，请出`);
      if (this.releaseIfNoHumans()) return;
      else {
        this.broadcast('roominfo', roomInfo(this));
        this.host.persist();
      }
      return;
    }
    if (name.startsWith('turn-')) {
      const uid = Number(name.slice(5));
      const m = this.members.find((x) => x.player.uid === uid);
      if (!m || !this.round || this.round.over) return;
      const seat = this.round.seatOf(uid);
      // 取消托管或回合已变化后，旧回调不能再代打；重新计时后也要等到新期限。
      if (m.view || seat < 0 || !this.round.waitingSeats().includes(seat)
        || (!m.bot && !m.managedTrustee && !m.trustee && !(this.config.托管 > 0))) {
        this.cancelTurn(m);
        return;
      }
      if (!m.turnDueAt) return;
      // Node 的定时器可能提前不到 1ms 触发。回调已经从调度表移除，
      // 此时直接 return 会让机器人永久停在这一手。
      if (this.host.now() < m.turnDueAt) {
        this.host.schedule(name, m.turnDueAt);
        return;
      }
      const automationTurn = m.automationTurn;
      this.cancelTurn(m);
      if (!m.trustee) {
        m.trustee = true;
        this.broadcast('trustee', { uid, status: true });
        this.host.log(`  [房${this.roomId}] ${uid} 超时，自动托管`);
      }
      const activeRound = this.round;
      const strategy = this.automationStrategy(m);
      let appliedJev = false;
      if ((m.bot || m.managedTrustee) && strategy === 'jev' && automationTurn
        && automationTurn.round === activeRound && automationTurn.ready
        && automationTurn.prepared && typeof activeRound.applyPreparedAutoPlayJev === 'function') {
        appliedJev = activeRound.applyPreparedAutoPlayJev(
          automationTurn.prepared, automationTurn.decision
        );
      }
      // 随机期限内 Jev 没有返回，或返回结果已过期，就在期限点立即用本地策略。
      if (!appliedJev) activeRound.autoPlay(seat);
      this.armTurns();
      this.host.persist();
    }
  }

  handle200(uid, msghead, body) {
    const mine = this.members.find((m) => m.player.uid === uid);
    if (mine && mine.view) {
      if (msghead === 'wsk_watch_view') return this.handleWskWatchView(mine, body);
      if (msghead === 'wsk_watch_hand_request') return this.handleWskWatchHandRequest(mine, body);
      if (msghead === 'dissmissroom') {
        this.dropWatcher(uid, { notify: true });
        return { error: 0 };
      }
      if (msghead === 'chatroom') {
        const chat = this.chatFor(mine, uid, body);
        if (chat.error) return chat;
        this.pushChat(uid, chat.chat);
        return { error: 0 };
      }
      return { error: 0 };
    }
    if (msghead === 'wsk_hand_sort') {
      if (Number(this.gameType) !== 17 || !mine) return { error: 1, what: '当前无法同步牌序' };
      const sortType = Number(body && body.sort_type);
      if (!Number.isInteger(sortType) || sortType < 0 || sortType > 2) {
        return { error: 1, what: '牌序类型无效' };
      }
      mine.wskHandSortType = sortType;
      for (const watcher of this.watchers()) {
        const session = this.wskWatchSessions.get(Number(watcher.player.uid));
        if (session && Number(session.targetUid) === Number(uid)) {
          this.sendTo(watcher, push('wsk_hand_sort', { uid: Number(uid), sort_type: sortType }));
        }
      }
      this.host.persist();
      return { error: 0 };
    }
    if (msghead === 'wsk_watch_hand_reply') return this.handleWskWatchHandReply(uid, body);
    if (msghead === 'dissmissroom' || msghead === 'nodissmissroom') {
      this.handleDismiss(uid, msghead === 'dissmissroom');
      this.host.persist();
      return { error: 0 };
    }
    if (msghead === 'chatroom') {
      const chat = this.chatFor(mine, uid, body);
      if (chat.error) return chat;
      this.pushChat(uid, chat.chat);
      return { error: 0 };
    }
    if (msghead === 'trustee') {
      const mine = this.members.find((m) => m.player.uid === uid);
      if (mine) {
        if (mine.managedTrustee) {
          // 玩家可立即退出后台托管；退出标记跨小局保留，避免下一局又被白名单自动开启。
          mine.managedTrustee = false;
          mine.managedTrusteeOptOut = true;
          mine.trusteeBeforeManaged = false;
          mine.trustee = false;
        } else {
          mine.trustee = !mine.trustee;
          if (mine.trustee) {
            // 主动再次开启允许恢复白名单策略；取消后仍不会自行重新开启。
            mine.managedTrusteeOptOut = false;
            if (this.managedTrusteeEligible(mine)) {
              mine.managedTrustee = true;
              mine.trusteeBeforeManaged = false;
            }
          }
        }
        this.broadcast('trustee', { uid, status: mine.trustee,
          manual_enabled: Number(this.gameType) === GANDENGYAN_GAME_TYPE
            && !!(this.host.trusteeWhitelisted && this.host.trusteeWhitelisted(uid)) });
        this.host.log(`  [房${this.roomId}] ${uid} ${mine.trustee ? '托管' : '取消托管'}`);
        // 结算回调会先把 this.round 清空；此时客户端可能紧接着发送
        // 取消托管。没有牌局时必须用 -1，避免 null >= 0 被 JS 判为 true。
        const activeRound = this.round;
        const seat = activeRound ? activeRound.seatOf(uid) : -1;
        if (seat >= 0) {
          if (mine.trustee) {
            // 操作按钮已经显示后再开启托管，也要立刻清掉当前候选项。
            this.sendTo(mine, push('game_operator', EMPTY_MAHJONG_OPERATOR));
          } else if (typeof activeRound.replayOps === 'function') {
            // 取消托管后仍处于当前操作窗口时，恢复玩家可手动选择的按钮。
            activeRound.replayOps(seat);
          }
        }
        this.armTurns(uid);
      }
      this.host.persist();
      return { error: 0 };
    }
    if (msghead !== 'gameready' && this.round) {
      const before = this.roundProgressMark();
      const err = playerAction(this, uid, msghead, body);
      if (err) return { error: 1, what: err };
      // 未知消息、查询类消息（如 gamecurroundcards）不改变牌局进度。
      // 若照样 armTurns，真人可以靠反复发无效消息无限重置托管倒计时卡住整桌。
      if (!sameRoundProgress(before, this.roundProgressMark())) this.armTurns();
      this.host.persist();
      return { error: 0 };
    }
    if (msghead === 'gameready') {
      if (this.round) return { error: 0 };
      const mine = this.members.find((m) => m.player.uid === uid);
      if (mine) {
        mine.site = body.site || mine.site;
        mine.ready = true;
        this.broadcast('game_ready', { uid, site: mine.site });
        this.host.persist();
        const fail = this.tryStartNext();
        if (fail) return { error: 1, what: fail };
      }
      return { error: 0 };
    }
    return { error: 0 };
  }

  restoreRound(rawRound) {
    if (!rawRound) return;
    try {
      const RoundClass = isClubPoker(this.gameType) ? ClubPokerRound : rawRound.kind === 'qjshz' || Number(this.gameType) === 17 ? WskRound : Round;
      this.round = RoundClass.restore(rawRound, this.seats(), this.makeIo(), this.config);
    } catch (err) {
      this.host.log(`  房 ${this.roomId} 牌局恢复失败，房间留下、当局作废`);
      console.error(err);
      this.round = null;
    }
  }

  rearmTimers() {
    if (this.dismiss && this.dismiss.time) {
      const left = this.dismiss.time * 1000 - this.host.now();
      if (left > 0) this.host.schedule('dismiss', this.host.now() + left);
      else this.dissolve();
    }
    if (this.closed) return;
    this.armRoomExpiry();
    if (this.round && !this.round.over) this.armTurns();
  }

  dump() {
    return {
      roomId: this.roomId,
      shareCode: this.shareCode,
      gameType: this.gameType,
      clubId: this.clubId,
      schemeId: this.schemeId || 0,
      num: this.num,
      param1: this.param1,
      param2: this.param2,
      host: this.hostUid,
      creatorUid: this.creatorUid,
      step: this.step,
      createdAt: this.createdAt,
      lastRoundStartedAt: this.lastRoundStartedAt,
      roomExpireAt: this.roomExpireAt,
      drawCount: this.drawCount,
      dealerUid: this.dealerUid || 0,
      lastEnd: this.lastEnd || null,
      pokerMatch: this.pokerMatch,
      nextWskHandPlan: this.nextWskHandPlan ? {
        ...this.nextWskHandPlan, counts: { ...this.nextWskHandPlan.counts },
      } : null,
      nextWskPartnerPlan: this.nextWskPartnerPlan ? { ...this.nextWskPartnerPlan } : null,
      wskWatchSessions: [...this.wskWatchSessions.entries()].map(([watcherUid, session]) => ({
        watcherUid: Number(watcherUid),
        targetUid: Number(session.targetUid) || 0,
        grants: [...session.grants].map(Number).filter(Number.isSafeInteger),
      })),
      dismiss: this.dismiss ? { agree: this.dismiss.agree, time: this.dismiss.time } : null,
      cardCharges: this.cardCharges,
      hands: this.hands,
      recordSaved: this.recordSaved,
      members: this.members.map((m) => ({
        uid: m.player.uid,
        nickname: m.player.nickname,
        sex: m.player.sex,
        cardNum: m.player.cardNum,
        site: m.site,
        ready: !!m.ready,
        score: m.score || 0,
        trustee: !!m.trustee,
        managedTrustee: !!m.managedTrustee,
        managedTrusteeOptOut: !!m.managedTrusteeOptOut,
        trusteeBeforeManaged: !!m.trusteeBeforeManaged,
        turnDeadline: m.turnDeadline || 0,
        stat: m.stat,
        view: !!m.view,
        bot: !!m.bot,
        botStrategy: m.botStrategy === 'jev' ? 'jev' : 'local',
        wskHandSortType: Number(m.wskHandSortType) || 0,
      })),
      round: this.round && !this.round.over ? this.round.dump() : null,
    };
  }

  static fromDump(raw, host, playersByUid) {
    const table = new Table({
      roomId: raw.roomId,
      shareCode: raw.shareCode,
      gameType: raw.gameType,
      clubId: raw.clubId,
      schemeId: raw.schemeId || 0,
      num: raw.num,
      param1: raw.param1,
      param2: raw.param2,
      host: raw.host,
      creatorUid: raw.creatorUid,
      step: raw.step || 0,
      createdAt: raw.createdAt,
      lastRoundStartedAt: raw.lastRoundStartedAt,
      roomExpireAt: raw.roomExpireAt,
      drawCount: raw.drawCount || 0,
      dealerUid: raw.dealerUid || 0,
      lastEnd: raw.lastEnd || null,
      pokerMatch: raw.pokerMatch || null,
      nextWskHandPlan: raw.nextWskHandPlan || null,
      nextWskPartnerPlan: raw.nextWskPartnerPlan || null,
      dismiss: raw.dismiss || null,
      cardCharges: raw.cardCharges || [],
      hands: raw.hands || [],
      recordSaved: !!raw.recordSaved,
    }, host);
    for (const m of raw.members || []) {
      const player = (playersByUid && playersByUid.get(m.uid)) || {
        uid: m.uid,
        nickname: m.nickname || `玩家${m.uid}`,
        sex: m.sex || 1,
        cardNum: m.cardNum == null ? 0 : m.cardNum,
        roomId: raw.roomId,
        invitedBy: m.invitedBy || '',
        bot: !!m.bot,
        botStrategy: m.botStrategy === 'jev' ? 'jev' : 'local',
      };
      player.roomId = raw.roomId;
      table.members.push(emptyMember(player, {
        site: m.site,
        ready: !!m.ready,
        score: m.score || 0,
        online: !!m.bot,
        trustee: !!m.trustee || !!m.bot,
        managedTrustee: !!m.managedTrustee,
        managedTrusteeOptOut: !!m.managedTrusteeOptOut,
        trusteeBeforeManaged: !!m.trusteeBeforeManaged,
        stat: m.stat,
        view: !!m.view,
        bot: !!m.bot,
        botStrategy: m.botStrategy === 'jev' ? 'jev' : 'local',
        wskHandSortType: Number(m.wskHandSortType) || 0,
      }));
    }
    const seatedUids = new Set(table.seats().map((member) => Number(member.player.uid)));
    const watcherUids = new Set(table.watchers().map((member) => Number(member.player.uid)));
    for (const saved of raw.wskWatchSessions || []) {
      const watcherUid = Number(saved && saved.watcherUid);
      if (!watcherUids.has(watcherUid)) continue;
      table.wskWatchSessions.set(watcherUid, {
        targetUid: seatedUids.has(Number(saved.targetUid)) ? Number(saved.targetUid) : 0,
        grants: new Set((saved.grants || []).map(Number).filter((uid) => seatedUids.has(uid))),
        // 未处理的申请不跨服务重启恢复，避免旧弹窗产生新的授权。
        pending: new Map(),
      });
    }
    if (raw.round) table.restoreRound(raw.round);
    return table;
  }
}

module.exports = {
  Table,
  DISMISS_SEC,
  MAX_WATCH,
  UNSTARTED_ROOM_TTL_MS,
  STARTED_ROOM_TTL_MS,
  ROOM_EXPIRE_TIMER,
  WATCH_RECONNECT_GRACE_MS,
  BOT_MIN_DELAY_MS,
  BOT_MAX_DELAY_MS,
  BOT_OPENING_PRESENTATION_MS,
};
