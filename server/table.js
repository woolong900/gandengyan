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
const { randomBytes } = require('crypto');
const rules = require('./rules');
const {
  maxStep, roomInfo, push, playerAction, emptyMember,
} = require('./shared');

const DISMISS_SEC = 60;
/** 旁观位上限。客户端 LookOnLayer 按 person.view 列人，没有再限一次。 */
const MAX_WATCH = 20;
const MAX_CHAT_BYTES = 4096;
const CHAT_WINDOW_MS = 5000;
const CHAT_MAX_IN_WINDOW = 10;

class Table {
  constructor(meta, host) {
    this.host = host;
    this.roomId = meta.roomId;
    this.shareCode = meta.shareCode || randomBytes(12).toString('hex');
    this.gameType = meta.gameType;
    this.clubId = meta.clubId;
    this.schemeId = meta.schemeId || 0;
    this.num = meta.num;
    this.param1 = meta.param1;
    this.param2 = meta.param2;
    this.hostUid = meta.host;
    this.step = meta.step || 0;
    this.drawCount = meta.drawCount || 0;
    this.dealerUid = meta.dealerUid || 0;
    this.lastEnd = meta.lastEnd || null;
    this.dismiss = meta.dismiss || null;
    this.members = [];
    this.config = meta.config || rules.parseConfig(meta.param1, meta.param2);
    this.round = null;
    this.closed = !!meta.closed;
    this.cardCharges = meta.cardCharges ? meta.cardCharges.map((c) => ({ ...c })) : [];
    this.hands = meta.hands ? meta.hands.map((h) => ({
      id: h.id,
      scores: (h.scores || []).map((s) => ({ uid: s.uid, score: s.score })),
      playback: h.playback || null,
    })) : [];
    this.recordSaved = !!meta.recordSaved;
  }

  get host() { return this._host; }
  set host(v) { this._host = v; }

  seats() {
    return this.members.filter((m) => !m.view).sort((a, b) => a.site - b.site);
  }

  watchers() {
    return this.members.filter((m) => m.view);
  }

  hasOnlineHuman() {
    return this.members.some((m) => !m.bot && m.online);
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
        const frame = push(msghead, data);
        for (const m of watchers) table.sendTo(m, frame);
      },
      one: (seat, msghead, data) => {
        const m = table.seats()[seat];
        if (!m) return;
        table.host.log(`  [房${table.roomId}] -> ${m.player.uid} ${msghead} ${JSON.stringify(data)}`);
        table.sendTo(m, push(msghead, data));
      },
      over: (result) => {
        const seats = table.seats();
        const tape = table.round && table.round.tape;
        table.round = null;
        const winners = result.winners || (result.winner >= 0 ? [result.winner] : []);
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
          for (const k of Object.keys(result.stat[s])) m.stat[k] += result.stat[s][k];
        });
        for (const m of table.members) {
          m.ready = !!m.bot;
          if (m.bot) table.broadcast('game_ready', { uid: m.player.uid, site: m.site });
        }
        table.host.log(`  [房${table.roomId}] 第 ${table.step}/${maxStep(table)} 局结束`);
        if (table.step >= maxStep(table)) {
          table.sendTotalEnd();
          // 房间立即释放；客户端保留已收到的结算画面，玩家手动返回大厅。
          table.dissolve(0, { totalAlreadySent: true, notifyExit: false });
        } else {
          if (table.host.botsEnabled && !table.host.botsEnabled()) table.removeBots();
          else table.host.persist();
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
      info: seated.map((m) => ({
        uid: m.player.uid,
        score: m.score || 0,
        winner: (m.score || 0) === top && top > 0,
        ...m.stat,
        hz_count: this.drawCount,
      })),
    });
    this.host.log(`  房 ${this.roomId} 总结算${normal ? '' : '（中途散了）'}：`
      + seated.map((m) => `${m.player.uid}=${(m.score || 0) / rules.RATIO}`).join(' '));
    if (this.host.saveRecord) this.host.saveRecord(this);
  }

  clearAllTimers() {
    for (const m of this.members) this.cancelTurn(m);
    this.host.cancel('dismiss');
    this.host.cancel('empty');
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
      const sec = m.bot ? 0.8 : (m.trustee ? 1 : (this.config.托管 || 0));
      if (sec <= 0) {
        this.cancelTurn(m);
        continue;
      }
      m.turnDueAt = this.host.now() + sec * 1000;
      m.turnDeadline = Math.floor(m.turnDueAt / 1000);
      this.host.schedule(key, m.turnDueAt);
    }
  }

  takeRoomCards() {
    if (this.cardCharges.length) return null;
    const cost = rules.roomCardCost({
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
    this.step += 1;
    this.round = new Round(seats, { config: this.config, dealerSeat }, this.makeIo());
    this.round.start();
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
    if (agree && this.clubId && !this.round && this.step < 1) {
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
      if (this.members.every((m) => m.bot || m.view)) this.dissolve();
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
    if (!this.round && this.step < 1 && uid === this.hostUid) {
      this.dissolve();
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
    for (const { player, site } of players) {
      player.roomId = this.roomId;
      this.members.push(emptyMember(player, {
        site,
        ready: true,
        trustee: true,
        online: true,
        bot: true,
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

  join(player, connId) {
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
    if (!this.hostUid && mine && !mine.view) this.hostUid = player.uid;
    player.roomId = this.roomId;
    this.host.onUidRoom(player.uid, this.roomId);
    if (!mine.bot) this.host.cancel('empty');
    const how = rejoining ? '重连' : mine.view ? '观战' : '进房';
    this.host.log(`  202 ${how} ${this.roomId}，在座 ${this.seats().length} 观战 ${this.watchers().length}`);

    let game = {};
    if (this.round && !this.round.over) {
      const seat = this.round.seatOf(player.uid);
      game = this.round.snapshot(seat >= 0 ? seat : -1, { begin: true });
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
    if (this.members.every((m) => m.bot || m.view)) this.dissolve();
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
    if (this.members.every((m) => m.bot)) this.dissolve();
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

  leave(uid, connId) {
    const mine = this.members.find((m) => m.player.uid === uid);
    if (!mine || mine.connId !== connId) return;
    if (mine.view) {
      this.dropWatcher(uid, { notify: false });
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
    } else if (!this.hasOnlineHuman() && !this.round) {
      this.host.schedule('empty', this.host.now() + 60000);
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
    if (name === 'empty') {
      if (!this.hasOnlineHuman() && !this.round) this.dissolve();
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
      if (this.seats().length === 0) this.dissolve();
      else {
        this.broadcast('roominfo', roomInfo(this));
        if (!this.hasOnlineHuman() && !this.round) {
          this.host.schedule('empty', this.host.now() + 60000);
        }
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
        || (!m.bot && !m.trustee && !(this.config.托管 > 0))) {
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
      this.cancelTurn(m);
      if (!m.trustee) {
        m.trustee = true;
        this.broadcast('trustee', { uid, status: true });
        this.host.log(`  [房${this.roomId}] ${uid} 超时，自动托管`);
      }
      this.round.autoPlay(seat);
      this.armTurns();
      this.host.persist();
    }
  }

  handle200(uid, msghead, body) {
    const mine = this.members.find((m) => m.player.uid === uid);
    if (mine && mine.view) {
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
        mine.trustee = !mine.trustee;
        this.broadcast('trustee', { uid, status: mine.trustee });
        this.host.log(`  [房${this.roomId}] ${uid} ${mine.trustee ? '托管' : '取消托管'}`);
        this.armTurns(uid);
      }
      this.host.persist();
      return { error: 0 };
    }
    if (msghead !== 'gameready' && this.round) {
      const err = playerAction(this, uid, msghead, body);
      if (err) return { error: 1, what: err };
      this.armTurns();
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
      this.round = Round.restore(rawRound, this.seats(), this.makeIo(), this.config);
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
    if (this.round && !this.round.over) this.armTurns();
    else if (this.members.some((m) => !m.bot) && !this.hasOnlineHuman()) {
      this.host.schedule('empty', this.host.now() + 60000);
    }
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
      step: this.step,
      drawCount: this.drawCount,
      dealerUid: this.dealerUid || 0,
      lastEnd: this.lastEnd || null,
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
        turnDeadline: m.turnDeadline || 0,
        stat: m.stat,
        view: !!m.view,
        bot: !!m.bot,
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
      step: raw.step || 0,
      drawCount: raw.drawCount || 0,
      dealerUid: raw.dealerUid || 0,
      lastEnd: raw.lastEnd || null,
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
      };
      player.roomId = raw.roomId;
      table.members.push(emptyMember(player, {
        site: m.site,
        ready: !!m.ready,
        score: m.score || 0,
        online: !!m.bot,
        trustee: !!m.trustee || !!m.bot,
        stat: m.stat,
        view: !!m.view,
        bot: !!m.bot,
      }));
    }
    if (raw.round) table.restoreRound(raw.round);
    return table;
  }
}

module.exports = { Table, DISMISS_SEC, MAX_WATCH };
