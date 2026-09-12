/**
 * 一张桌子。Node 和 Cloudflare Room DO 共用。
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
const rules = require('./rules');
const {
  maxStep, roomInfo, push, playerAction, emptyMember,
} = require('./shared');

const DISMISS_SEC = 60;

class Table {
  constructor(meta, host) {
    this.host = host;
    this.roomId = meta.roomId;
    this.gameType = meta.gameType;
    this.clubId = meta.clubId;
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
  }

  get host() { return this._host; }
  set host(v) { this._host = v; }

  seats() {
    return [...this.members].sort((a, b) => a.site - b.site);
  }

  sendTo(m, buf) {
    if (m && m.online && m.connId) this.host.send(m.connId, buf);
  }

  broadcast(msghead, data) {
    const frame = push(msghead, data);
    for (const m of this.members) this.sendTo(m, frame);
  }

  makeIo() {
    const table = this;
    return {
      log: (line) => table.host.log(`  [房${table.roomId}] ${line}`),
      all: (msghead, data) => {
        const frame = push(msghead, data);
        for (const m of table.seats()) table.sendTo(m, frame);
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
      },
      one: (seat, msghead, data) => {
        const m = table.seats()[seat];
        if (!m) return;
        table.host.log(`  [房${table.roomId}] -> ${m.player.uid} ${msghead} ${JSON.stringify(data)}`);
        table.sendTo(m, push(msghead, data));
      },
      over: (result) => {
        const seats = table.seats();
        table.round = null;
        const winners = result.winners || (result.winner >= 0 ? [result.winner] : []);
        if (winners.length) {
          const dealer = result.nextDealer != null ? result.nextDealer : winners[0];
          table.dealerUid = seats[dealer].player.uid;
        } else {
          table.drawCount += 1;
        }
        seats.forEach((m, s) => {
          for (const k of Object.keys(result.stat[s])) m.stat[k] += result.stat[s][k];
        });
        for (const m of table.members) {
          m.ready = !!m.bot;
          if (m.bot) table.broadcast('game_ready', { uid: m.player.uid, site: m.site });
        }
        table.host.log(`  [房${table.roomId}] 第 ${table.step}/${maxStep(table)} 局结束`);
        if (table.step >= maxStep(table)) table.sendTotalEnd();
        table.host.persist();
      },
    };
  }

  sendTotalEnd(normal = true) {
    const top = Math.max(0, ...this.members.map((m) => m.score || 0));
    this.broadcast('game_bye', {
      time: Math.floor(this.host.now() / 1000),
      normal_end: normal,
      info: this.members.map((m) => ({
        uid: m.player.uid,
        score: m.score || 0,
        winner: (m.score || 0) === top && top > 0,
        ...m.stat,
        hz_count: this.drawCount,
      })),
    });
    this.host.log(`  房 ${this.roomId} 总结算${normal ? '' : '（中途散了）'}：`
      + this.members.map((m) => `${m.player.uid}=${(m.score || 0) / rules.RATIO}`).join(' '));
  }

  clearAllTimers() {
    for (const m of this.members) this.host.cancel(`turn-${m.player.uid}`);
    this.host.cancel('dismiss');
    this.host.cancel('empty');
    for (const m of this.members) this.host.cancel(`kick-${m.player.uid}`);
  }

  dissolve(reason = 0) {
    if (this.closed) return;
    this.closed = true;
    this.clearAllTimers();
    if (this.step > 0 || this.round) this.sendTotalEnd(false);
    else this.refundCards('未开局退还');
    this.broadcast('exitroom', { reason });
    for (const m of this.members) {
      m.player.roomId = 0;
      this.host.onUidRoom(m.player.uid, 0);
    }
    this.round = null;
    this.host.log(`  房 ${this.roomId} 已解散`);
    this.host.onDissolved(reason);
    this.host.persist();
  }

  refundCards(reason) {
    if (!this.cardCharges.length || !this.host.changeCards) return;
    for (const { uid, amount } of this.cardCharges) {
      this.host.changeCards(uid, amount, reason);
    }
    this.cardCharges = [];
  }

  refundUid(uid, reason) {
    if (!this.host.changeCards) return;
    const kept = [];
    for (const charge of this.cardCharges) {
      if (charge.uid === uid) this.host.changeCards(uid, charge.amount, reason);
      else kept.push(charge);
    }
    this.cardCharges = kept;
  }

  charge(uid, amount, reason) {
    if (!amount || !this.host.changeCards) return;
    this.host.changeCards(uid, -amount, reason);
    this.cardCharges.push({ uid, amount });
  }

  armTurns() {
    const round = this.round;
    if (!round || round.over) {
      for (const m of this.members) this.host.cancel(`turn-${m.player.uid}`);
      return;
    }
    const waiting = new Set(round.waitingSeats());
    for (const m of this.members) {
      const seat = this.round.seatOf(m.player.uid);
      const key = `turn-${m.player.uid}`;
      if (!waiting.has(seat)) {
        this.host.cancel(key);
        m.turnDeadline = 0;
        continue;
      }
      const sec = m.bot ? 0.8 : (m.trustee ? 1 : (this.config.托管 || 0));
      if (sec <= 0) {
        this.host.cancel(key);
        continue;
      }
      m.turnDeadline = Math.floor(this.host.now() / 1000 + sec);
      this.host.schedule(key, this.host.now() + sec * 1000);
    }
  }

  startGame() {
    const seats = this.seats();
    const dealerSeat = this.dealerUid
      ? Math.max(0, seats.findIndex((m) => m.player.uid === this.dealerUid))
      : Math.max(0, seats.findIndex((m) => m.player.uid === this.hostUid));
    this.step += 1;
    this.round = new Round(seats, { config: this.config, dealerSeat }, this.makeIo());
    this.round.start();
    this.armTurns();
    this.host.persist();
  }

  tryStartNext() {
    if (this.round) return;
    if (this.step >= maxStep(this)) return;
    const seated = this.members.filter((m) => !m.view);
    if (seated.length !== this.config.人数) return;
    if (!seated.every((m) => m.ready)) return;
    this.startGame();
  }

  handleDismiss(uid, agree) {
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
    return humans.length === 1 && this.members.length < this.config.人数;
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

  join(player, connId) {
    let mine = this.members.find((m) => m.player.uid === player.uid);
    const rejoining = !!mine;
    if (mine) {
      mine.player = player;
      mine.connId = connId;
      mine.online = true;
      this.host.cancel(`kick-${player.uid}`);
    } else {
      if (this.round || this.members.length >= this.config.人数) {
        return { error: '房间已满' };
      }
      mine = emptyMember(player, {
        connId,
        site: this.members.length + 1,
        online: true,
      });
      this.members.push(mine);
    }
    player.roomId = this.roomId;
    this.host.onUidRoom(player.uid, this.roomId);
    this.host.log(`  202 ${rejoining ? '重连' : '进房'} ${this.roomId}，${this.members.length} 人在座`);

    let game = {};
    if (this.round && !this.round.over) {
      const seat = this.round.seatOf(player.uid);
      if (seat >= 0) game = this.round.snapshot(seat, { begin: true });
    } else if (this.lastEnd) {
      const seat = this.seats().findIndex((m) => m.player.uid === player.uid);
      if (seat >= 0 && this.lastEnd[seat]) game = this.lastEnd[seat];
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

  leave(uid, connId) {
    const mine = this.members.find((m) => m.player.uid === uid);
    if (!mine || mine.connId !== connId) return;
    mine.connId = null;
    mine.online = false;
    this.host.log(`  [房${this.roomId}] ${uid} 离线`);
    this.broadcast('lineperson', { uid, line: false });
    this.broadcast('roominfo', roomInfo(this));

    if (this.round && !this.round.over && !mine.trustee) {
      mine.trustee = true;
      this.broadcast('trustee', { uid, status: true });
      this.armTurns();
    }

    const kickSec = this.round ? 0 : (this.config.踢人 || 0);
    if (kickSec > 0) {
      this.host.schedule(`kick-${uid}`, this.host.now() + kickSec * 1000);
    } else if (this.members.every((m) => !m.online) && !this.round && this.step === 0) {
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
      if (this.members.every((m) => !m.online)) this.dissolve();
      return;
    }
    if (name.startsWith('kick-')) {
      const uid = Number(name.slice(5));
      const still = this.members.find((m) => m.player.uid === uid);
      if (!still || still.online) return;
      this.members = this.members.filter((m) => m.player.uid !== uid);
      still.player.roomId = 0;
      this.host.onUidRoom(uid, 0);
      if (this.step < 1) this.refundUid(uid, '未开局退还');
      this.host.log(`  [房${this.roomId}] ${uid} 离线超时，请出`);
      if (this.members.length === 0) this.dissolve();
      else {
        this.broadcast('roominfo', roomInfo(this));
        this.host.persist();
      }
      return;
    }
    if (name.startsWith('turn-')) {
      const uid = Number(name.slice(5));
      const m = this.members.find((x) => x.player.uid === uid);
      if (!m || !this.round) return;
      const seat = this.round.seatOf(uid);
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
    if (msghead === 'dissmissroom' || msghead === 'nodissmissroom') {
      this.handleDismiss(uid, msghead === 'dissmissroom');
      this.host.persist();
      return { error: 0 };
    }
    if (msghead === 'chatroom') {
      let chat = {};
      try {
        chat = typeof body.chat === 'string' ? JSON.parse(body.chat) : (body.chat || {});
      } catch {
        chat = {};
      }
      if (!chat || typeof chat !== 'object') chat = {};
      chat.fromUid = uid;
      this.broadcast('chatroom', { chat: JSON.stringify(chat) });
      return { error: 0 };
    }
    if (msghead === 'trustee') {
      const mine = this.members.find((m) => m.player.uid === uid);
      if (mine) {
        mine.trustee = !mine.trustee;
        this.broadcast('trustee', { uid, status: mine.trustee });
        this.host.log(`  [房${this.roomId}] ${uid} ${mine.trustee ? '托管' : '取消托管'}`);
        if (mine.trustee) this.armTurns();
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
        this.tryStartNext();
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
    if (this.round && !this.round.over) this.armTurns();
  }

  dump() {
    return {
      roomId: this.roomId,
      gameType: this.gameType,
      clubId: this.clubId,
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
      gameType: raw.gameType,
      clubId: raw.clubId,
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

module.exports = { Table, DISMISS_SEC };
