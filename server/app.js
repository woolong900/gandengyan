/**
 * 单进程大厅：玩家、房间号、桌子。
 */
const { pack, unpack, hasRes, protocol } = require('./net');
const crypto = require('crypto');
const { Table } = require('./table');
const rules = require('./rules');
const { ClubStore, MASTER, ADMIN, PLAYER } = require('./clubs');
const {
  num, maxStep, roomInfo, versionBody, configBody, emptyPlayer, INVITE_GIVE, INVITE_AMBIGUOUS, mintInviteCode,
} = require('./shared');
const { buildRecord, listFor, keepLatest } = require('./records');
const { findPlayback, mintPlaybackId } = require('./playback');

class GameApp {
  constructor({ persist, now, allowUnregisteredTokens = false } = {}) {
    this.persistFn = persist || (() => {});
    this.nowFn = now || Date.now;
    this.allowUnregisteredTokens = !!allowUnregisteredTokens;
    this.players = new Map();
    this.playersByUid = new Map();
    this.playersByInviteCode = new Map();
    this.tables = new Map();
    this.clubStore = new ClubStore({ now: () => this.now() });
    this.nextUid = 100001;
    this.nextRoomId = 100000;
    this.conns = new Map();
    this.timeouts = new Map();
    this.uidRoom = new Map();
    this.records = [];
    this.playbackSeq = 0;
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

  notifyCard(player) {
    if (!player || player.bot) return;
    const buf = pack(1001, { card: player.cardNum || 0, gold: 0 });
    for (const c of this.conns.values()) {
      if (c.player && c.player.uid === player.uid && c.send) c.send(buf);
    }
  }

  changeCards(uid, delta, reason) {
    const player = this.playerByUid(uid);
    if (!player || player.bot || !delta) return player ? player.cardNum : 0;
    player.cardNum = Math.max(0, (player.cardNum || 0) + delta);
    this.notifyCard(player);
    console.log(`  房卡 uid=${player.uid} ${delta > 0 ? '+' : ''}${delta} -> ${player.cardNum}${reason ? ` ${reason}` : ''}`);
    return player.cardNum;
  }

  mintPlaybackId(roomId, step) {
    this.playbackSeq = (this.playbackSeq || 0) + 1;
    return mintPlaybackId(roomId, step, this.playbackSeq);
  }

  saveRecord(table) {
    if (!table || table.recordSaved) return null;
    if ((table.step || 0) < 1 && !(table.hands && table.hands.length)) return null;
    table.recordSaved = true;
    const rec = buildRecord(table, this.now());
    this.records = keepLatest(this.records.concat(rec));
    console.log(`  战绩 ${rec.id} 房${rec.roomId} ${rec.gameCount}/${rec.totalCount}局`);
    return rec;
  }

  usedInviteCodes() {
    return new Set(this.playersByInviteCode.keys());
  }

  inviteCodeInUse(code) {
    if (!code) return false;
    for (const p of this.players.values()) {
      if (p.invitedBy === code) return true;
    }
    return false;
  }

  ensureInviteCode(player) {
    if (!player || player.bot) return '';
    if (player.inviteCode && !INVITE_AMBIGUOUS.test(player.inviteCode)) {
      this.playersByInviteCode.set(player.inviteCode, player);
      return player.inviteCode;
    }
    if (player.inviteCode && this.inviteCodeInUse(player.inviteCode)) {
      this.playersByInviteCode.set(player.inviteCode, player);
      return player.inviteCode;
    }
    const used = this.usedInviteCodes();
    const old = player.inviteCode;
    if (old) {
      used.delete(old);
      this.playersByInviteCode.delete(old);
    }
    player.inviteCode = mintInviteCode(used);
    this.playersByInviteCode.set(player.inviteCode, player);
    this.persist();
    return player.inviteCode;
  }

  playerByInviteCode(code) {
    const key = String(code || '').trim().toUpperCase();
    if (!key) return null;
    return this.playersByInviteCode.get(key) || null;
  }

  bindInvite(player, code) {
    if (player.invitedBy) return { error: 1, what: '已经绑定过邀请码' };
    this.ensureInviteCode(player);
    const raw = String(code || '').trim().toUpperCase();
    if (!raw) return { error: 1, what: '请输入邀请码' };
    if (!/^[A-Z]{5}$/.test(raw)) return { error: 1, what: '邀请码无效' };
    if (raw === player.inviteCode) return { error: 1, what: '不能绑定自己的邀请码' };
    const inviter = this.playerByInviteCode(raw);
    if (!inviter || inviter.bot) return { error: 1, what: '邀请码不存在' };
    player.invitedBy = raw;
    this.changeCards(inviter.uid, INVITE_GIVE, '邀请新用户');
    this.changeCards(player.uid, INVITE_GIVE, '绑定邀请码');
    this.persist();
    return { error: 0, what: '' };
  }

  fillBotsOn() {
    return process.env.QJQP_FILLBOTS !== '0';
  }

  mintBot(site, roomId) {
    const uid = this.nextUid++;
    const token = `t_bot_${uid}`;
    const player = emptyPlayer(uid, { nickname: `陪玩${site}`, roomId, bot: true, cardNum: 0 });
    this.players.set(token, player);
    this.playersByUid.set(player.uid, player);
    return player;
  }

  maybeFillBots(table) {
    if (!this.fillBotsOn() || !table.needsBots()) return;
    const bots = [];
    for (let site = 2; site <= table.config.人数; site++) {
      bots.push({ player: this.mintBot(site, table.roomId), site });
    }
    table.addBots(bots);
  }

  dump() {
    return {
      nextUid: this.nextUid,
      nextRoomId: this.nextRoomId,
      players: [...this.players.entries()].map(([token, p]) => ({
        token,
        uid: p.uid,
        nickname: p.nickname,
        sex: p.sex,
        cardNum: p.cardNum,
        roomId: p.roomId || 0,
        inviteCode: p.inviteCode || '',
        invitedBy: p.invitedBy || '',
        bot: !!p.bot,
      })),
      rooms: [...this.tables.values()].filter((t) => !t.closed).map((t) => t.dump()),
      records: this.records,
      playbackSeq: this.playbackSeq || 0,
      clubs: this.clubStore.dump(),
    };
  }

  restore(data) {
    if (!data) return;
    this.players.clear();
    this.playersByUid.clear();
    this.playersByInviteCode.clear();
    this.nextUid = data.nextUid || 100001;
    this.nextRoomId = data.nextRoomId || 100000;
    this.records = Array.isArray(data.records) ? data.records : [];
    this.playbackSeq = data.playbackSeq || 0;
    this.clubStore.restore(data.clubs);
    const byUid = new Map();
    for (const p of data.players || []) {
      const player = emptyPlayer(p.uid, p);
      this.players.set(p.token, player);
      this.playersByUid.set(player.uid, player);
      if (player.inviteCode && !player.bot) this.playersByInviteCode.set(player.inviteCode, player);
      byUid.set(player.uid, player);
    }
    for (const raw of data.rooms || []) {
      if (!raw.members || !raw.members.length) continue;
      const table = Table.fromDump(raw, this.tableHost(raw.roomId), byUid);
      if (!table.members.length || table.closed) continue;
      this.tables.set(table.roomId, table);
      for (const m of table.members) this.uidRoom.set(m.player.uid, table.roomId);
      table.rearmTimers();
    }
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
      schedule: (name, dueAt) => app.schedule(`${roomId}:${name}`, dueAt),
      cancel: (name) => app.cancel(`${roomId}:${name}`),
      now: () => app.now(),
      log: (line) => console.log(line),
      onDissolved: () => {
        app.tables.delete(roomId);
        app.persist();
      },
      onUidRoom: (uid, rid) => {
        if (rid) app.uidRoom.set(uid, rid);
        else {
          app.uidRoom.delete(uid);
          for (const c of app.conns.values()) {
            if (c.player && c.player.uid === uid) c.roomId = 0;
          }
        }
      },
    };
  }

  clubInfo(club, uid) {
    const role = this.clubStore.role(club, uid);
    const rooms = [...this.tables.values()].filter((table) => table.clubId === club.id && !table.closed);
    return {
      id: club.id,
      avatarUrl: '',
      name: club.name,
      code: club.code,
      announcement: club.announcement || '',
      maxUsers: club.maxUsers,
      roomNum: rooms.length,
      affiliationsCount: club.members.length,
      memberType: role,
      balanceCard: club.balanceCard || 0,
      emptyRoomLast: !!club.settings.emptyRoomLast,
      roomInvite: !!club.settings.roomInvite,
      closed: !!club.settings.closed,
      playerNodismissRoom: !!club.settings.playerNodismissRoom,
      quitApply: !!club.settings.quitApply,
      antiAddiction: club.settings.antiAddiction ? 7 : 0,
      member_Record: !!club.settings.member_Record,
      clubMerge: 0,
      clubLevel: 0,
    };
  }

  clubMemberInfo(club, member) {
    const player = this.playerByUid(member.uid) || {};
    const online = [...this.conns.values()].some((c) => c.player && c.player.uid === Number(member.uid));
    return {
      avatarUrl: '',
      nickname: player.nickname || `玩家${member.uid}`,
      code: String(member.uid),
      sex: player.sex || 1,
      memberType: member.role || PLAYER,
      status: online ? 1 : 0,
      userId: Number(member.uid),
      freeze: member.freeze || 0,
      lastGame: 0,
      remark: member.remark || '',
      joinTime: member.joinTime || 0,
      belongToClub: club.id,
    };
  }

  clubRoomInfo(table) {
    const seats = table.seats();
    const host = this.playerByUid(table.hostUid) || {};
    return {
      id: table.roomId,
      status: table.round ? 1 : 0,
      owner: { avatarUrl: '', code: String(table.hostUid), nickname: host.nickname || `玩家${table.hostUid}` },
      gameType: table.gameType,
      num: table.num,
      param1: table.param1,
      param2: table.param2,
      players: seats.map((m) => ({
        avatarUrl: '', code: String(m.player.uid), nickname: m.player.nickname || `玩家${m.player.uid}`,
      })),
      curPlayers: seats.length,
      maxPlayers: table.config.人数,
      curStep: table.step || 0,
      maxStep: maxStep(table),
      schemeId: 0,
    };
  }

  clubRecords(clubId) {
    return this.records.filter((record) => Number(record.clubId) === Number(clubId));
  }

  clubRecordStats(club, records) {
    return club.members.map((member) => {
      const player = this.playerByUid(member.uid) || {};
      let score = 0;
      let number = 0;
      let winner = 0;
      for (const record of records) {
        const item = (record.players || []).find((p) => Number(p.uid) === Number(member.uid));
        if (!item) continue;
        number++;
        score += Number(item.score || 0);
        if (item.winner) winner++;
      }
      return {
        avatarUrl: '', nickname: player.nickname || `玩家${member.uid}`, code: String(member.uid),
        winner, score, number, scoreRatio: 10, remark: member.remark || '',
      };
    }).filter((item) => item.number > 0);
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
      if (table) table.onTimer(name);
    }, wait);
    this.timeouts.set(key, id);
  }

  cancel(key) {
    const id = this.timeouts.get(key);
    if (id) {
      clearTimeout(id);
      this.timeouts.delete(key);
    }
  }

  http(pathname, query) {
    if (pathname === '/version') return { status: 200, body: versionBody() };
    if (pathname === '/v1/config' || pathname === '/n') return { status: 200, body: configBody() };
    if (pathname === '/login') {
      const accountType = String(query.get('accountType') || 'guest');
      const old = String(query.get('token') || '');
      if (accountType === 'token') {
        if (old && this.players.has(old)) {
          return { status: 200, body: { err_code: 0, data: { token: old } } };
        }
        return { status: 200, body: { err_code: 65, err_msg: '登录时效已过期,请重新登录' } };
      }
      const uid = this.nextUid++;
      const token = `t_${crypto.randomBytes(24).toString('hex')}`;
      const player = emptyPlayer(uid);
      this.players.set(token, player);
      this.playersByUid.set(player.uid, player);
      this.ensureInviteCode(player);
      this.persist();
      return { status: 200, body: { err_code: 0, data: { token } } };
    }
    return { status: 404, body: null };
  }

  attach(connId, send) {
    this.conns.set(connId, { send, player: null, roomId: 0 });
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

    if (proto === 100) {
      if (!msg || !msg.token) {
        return c.send(pack(100, { res: { error: 1, what: '登录参数无效' } }));
      }
      if (!this.players.has(msg.token)) {
        if (!this.allowUnregisteredTokens) {
          return c.send(pack(100, {
            res: { error: 65, what: '登录凭证无效，请重新登录' },
          }));
        }
        const uid = this.nextUid++;
        const newbie = emptyPlayer(uid);
        this.players.set(msg.token, newbie);
        this.playersByUid.set(newbie.uid, newbie);
        this.ensureInviteCode(newbie);
      }
      c.player = this.players.get(msg.token);
      this.ensureInviteCode(c.player);
      const roomId = this.uidRoom.get(c.player.uid) || 0;
      c.roomId = roomId;
      console.log(`  100 登录 uid=${c.player.uid}`);
      return c.send(pack(100, {
        res: { error: 0, what: '' },
        uid: c.player.uid,
        nickname: c.player.nickname,
        avatarUrl: '',
        sex: c.player.sex,
        roomId,
        cardNum: c.player.cardNum,
        ip: '127.0.0.1',
      }));
    }

    if (proto === 99) return c.send(pack(99, { time: this.now() }));

    if (proto === 101) {
      return c.send(pack(101, { res: { error: 0, what: '' }, realName: '测试', idCard: '', giveCard: 0 }));
    }
    if (proto === 105) {
      return c.send(pack(105, { res: { error: 0, what: '' }, mobile: '13800000000', giveCard: 0 }));
    }

    if (!c.player) return;

    if (proto === 113) {
      const clubs = this.clubStore.listFor(c.player.uid).map((club) => this.clubInfo(club, c.player.uid));
      return c.send(pack(113, { res: { error: 0, what: '' }, clubs, count: clubs.length, total: clubs.length }));
    }

    if (proto === 114) {
      const club = this.clubStore.get(num(msg && msg.id));
      const owner = club && this.playerByUid(club.ownerUid);
      if (!club || !owner || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(114, { res: { error: 1, what: '俱乐部不存在' } }));
      }
      return c.send(pack(114, {
        res: { error: 0, what: '' },
        avatarUrl: '', nickname: owner.nickname || `玩家${owner.uid}`, code: String(owner.uid),
      }));
    }

    if (proto === 115) {
      const ret = this.clubStore.quit(c.player.uid, num(msg && msg.id));
      if (ret.error) return c.send(pack(115, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(115, { res: { error: 0, what: '' } }));
    }

    if (proto === 116) return c.send(pack(116, { res: { error: 0, what: '' } }));

    if (proto === 117) {
      const ret = this.clubStore.apply(c.player.uid, msg && msg.code);
      if (ret.error) return c.send(pack(117, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(117, { res: { error: 0, what: '' } }));
    }

    if (proto === 118) {
      const invites = this.clubStore.inviteList(c.player.uid).map(({ club, invite }) => ({
        id: invite.id,
        avatarUrl: '',
        inviter: String(invite.fromUid),
        name: club.name,
        policy: 0,
      }));
      return c.send(pack(118, { res: { error: 0, what: '' }, invites, count: invites.length, total: invites.length }));
    }

    if (proto === 119 || proto === 120) {
      const ret = proto === 119
        ? this.clubStore.acceptInvite(c.player.uid, num(msg && msg.id))
        : this.clubStore.ignoreInvite(c.player.uid, num(msg && msg.id));
      if (ret.error) return c.send(pack(proto, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    }

    if (proto === 121) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(121, { res: { error: 1, what: '无权查看俱乐部成员' }, members: [] }));
      }
      const members = club.members.map((member) => this.clubMemberInfo(club, member));
      return c.send(pack(121, { res: { error: 0, what: '' }, members, count: members.length, total: members.length }));
    }

    if (proto === 122) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(122, { res: { error: 1, what: '无权查看俱乐部房间' }, rooms: [] }));
      }
      const rooms = [...this.tables.values()]
        .filter((table) => table.clubId === club.id && !table.closed)
        .map((table) => this.clubRoomInfo(table));
      return c.send(pack(122, { res: { error: 0, what: '' }, rooms, count: rooms.length, total: rooms.length }));
    }

    if (proto === 123) {
      const roomId = num(msg && msg.id);
      const table = this.tables.get(roomId);
      const club = table && this.clubStore.get(table.clubId);
      if (!table || !club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(123, { res: { error: 1, what: '没有关闭房间的权限' } }));
      }
      table.dissolve();
      return c.send(pack(123, { res: { error: 0, what: '' } }));
    }

    if (proto === 124) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(124, { res: { error: 1, what: '无权查看玩法方案' }, data: [] }));
      }
      return c.send(pack(124, { res: { error: 0, what: '' }, data: club.schemes || [], count: (club.schemes || []).length, total: (club.schemes || []).length }));
    }

    if (proto === 133 || proto === 162) {
      const ret = this.clubStore.freeze(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId), num(msg && msg.status));
      if (ret.error) return c.send(pack(proto, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    }

    if (proto === 134) {
      const ret = this.clubStore.remark(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId), msg && msg.remark);
      if (ret.error) return c.send(pack(134, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(134, { res: { error: 0, what: '' } }));
    }

    if (proto === 135) {
      const ret = this.clubStore.setRole(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId), num(msg && msg.role));
      if (ret.error) return c.send(pack(135, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(135, { res: { error: 0, what: '' } }));
    }

    if (proto === 161) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(161, { res: { error: 1, what: '无权查看成员信息' }, members: [] }));
      }
      const members = club.members.map((member) => ({ ...this.clubMemberInfo(club, member), fatigueNum: 0 }));
      return c.send(pack(161, { res: { error: 0, what: '' }, members, count: members.length, total: members.length, fatigueNum: 0 }));
    }

    if (proto === 160) {
      const club = this.clubStore.get(num(msg && msg.id));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(160, { res: { error: 1, what: '没有管理权限' } }));
      }
      return c.send(pack(160, { res: { error: 0, what: '' } }));
    }

    if ([142, 143, 146, 163, 164, 166].includes(proto)) {
      const clubId = num(msg && msg.clubId);
      const club = this.clubStore.get(clubId);
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        const body = proto === 163 ? { members: [] } : { data: [] };
        return c.send(pack(proto, { res: { error: 1, what: '无权查看俱乐部数据' }, ...body }));
      }
      const records = this.clubRecords(club.id);
      if (proto === 163) {
        const stats = this.clubRecordStats(club, records).map((item) => ({
          ...this.clubMemberInfo(club, club.members.find((m) => String(m.uid) === item.code)),
          fatigueNum: 0, number: item.number, winner: item.winner,
        }));
        return c.send(pack(proto, { res: { error: 0, what: '' }, members: stats, count: stats.length, total: stats.length, fatigueNum: 0 }));
      }
      if (proto === 146) {
        const start = num(msg && msg.startDate) * 1000;
        const end = num(msg && msg.endDate) * 1000 || (start + 86400000);
        const filtered = records.filter((record) => record.time >= start && record.time < end);
        const data = this.clubRecordStats(club, filtered);
        return c.send(pack(proto, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
      }
      if (proto === 166) {
        const data = this.clubRecordStats(club, records).map((item) => ({ ...item, keyS: '1' }));
        return c.send(pack(proto, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
      }
      return c.send(pack(proto, { res: { error: 0, what: '' }, data: [], count: 0, total: 0 }));
    }

    if (proto === 154) {
      return c.send(pack(154, { res: { error: 0, what: '' }, data: [], count: 0, total: 0 }));
    }

    if (proto === 155) {
      return c.send(pack(155, { res: { error: 0, what: '' } }));
    }

    if (proto === 156 || proto === 157) {
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    }

    if (proto === 103) {
      const mine = this.ensureInviteCode(c.player);
      return c.send(pack(103, {
        res: { error: 0, what: '' },
        username: mine,
        inviteCode: c.player.invitedBy || '',
        mobile: '',
        giveCard: INVITE_GIVE,
      }));
    }

    if (proto === 104) {
      return c.send(pack(104, { res: this.bindInvite(c.player, msg && msg.inviteCode) }));
    }

    if (proto === 112) {
      return c.send(pack(112, { res: { error: 1, what: '暂未开放充值' }, goods: [] }));
    }

    if (proto === 153) {
      return c.send(pack(153, {
        res: { error: 0, what: '' },
        username: '测试代理',
        code: 'QJQP',
        balanceCard: 999999,
      }));
    }

    if (proto === 125) {
      const type = num(msg && msg.type);
      if (type === 1) {
        return c.send(pack(125, { res: { error: 0, what: '' }, records: [] }));
      }
      const records = listFor(this.records, c.player.uid, num(msg && msg.time));
      return c.send(pack(125, { res: { error: 0, what: '' }, records }));
    }

    if (proto === 126) {
      const id = String((msg && msg.id) || '');
      const rec = this.records.find((r) => r.id === id);
      if (!rec || !(rec.uids || []).some((id) => Number(id) === Number(c.player.uid))) {
        return c.send(pack(126, { res: { error: 1, what: '战绩不存在' }, details: [] }));
      }
      return c.send(pack(126, {
        res: { error: 0, what: '' },
        details: rec.details || [],
        scoreRatio: rec.scoreRatio || 0,
      }));
    }

    if (proto === 127) {
      const id = String((msg && msg.id) || '');
      const pb = findPlayback(this.records, id, c.player.uid);
      if (!pb) {
        return c.send(pack(127, { res: { error: 1, what: '回放不存在' } }));
      }
      return c.send(pack(127, {
        res: { error: 0, what: '' },
        players: pb.players || [],
        roomInfo: pb.roomInfo || {},
        gameInfo: pb.gameInfo || {},
        steps: pb.steps || [],
      }));
    }

    if (proto === 128) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(128, { res: { error: 1, what: '没有管理权限' }, data: [] }));
      }
      return c.send(pack(128, { res: { error: 0, what: '' }, data: [] }));
    }

    if (proto === 136) {
      const ret = this.clubStore.kick(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId));
      if (ret.error) return c.send(pack(136, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(136, { res: { error: 0, what: '' } }));
    }

    if (proto === 137) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(137, { res: { error: 1, what: '没有管理权限' }, data: [] }));
      }
      const data = club.applications.map((a) => {
        const player = this.playerByUid(a.uid) || {};
        return { id: a.id, avatarUrl: '', nickname: player.nickname || `玩家${a.uid}`, code: String(a.uid), sex: player.sex || 1, policy: 0 };
      });
      return c.send(pack(137, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
    }

    if (proto === 138 || proto === 139) {
      const ret = proto === 138
        ? this.clubStore.approve(c.player.uid, num(msg && msg.id))
        : this.clubStore.reject(c.player.uid, num(msg && msg.id));
      if (ret.error) return c.send(pack(proto, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    }

    if (proto === 140) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      const target = this.playerByUid(num(msg && msg.userCode))
        || [...this.players.values()].find((player) => player.nickname === String(msg && msg.userCode));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid) || !target) {
        return c.send(pack(140, { res: { error: 1, what: '用户不存在' }, member: false }));
      }
      return c.send(pack(140, {
        res: { error: 0, what: '' },
        info: { id: target.uid, avatarUrl: '', code: String(target.uid), nickname: target.nickname },
        member: !!this.clubStore.member(club, target.uid),
      }));
    }

    if (proto === 141) {
      const ret = this.clubStore.addInvite(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId));
      if (ret.error) return c.send(pack(141, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(141, { res: { error: 0, what: '' } }));
    }

    if (proto === 145) {
      const ret = this.clubStore.edit(c.player.uid, {
        id: num(msg && msg.id),
        name: msg && msg.name,
        announcement: msg && msg.announcement,
        emptyRoomLast: msg && msg.emptyRoomLast,
        roomInvite: msg && msg.roomInvite,
        closed: msg && msg.closed,
        playerNodismissRoom: msg && msg.playerNodismissRoom,
        quitApply: msg && msg.quitApply,
        antiAddiction: msg && msg.antiAddiction,
        member_Record: msg && msg.member_Record,
      });
      if (ret.error) return c.send(pack(145, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(145, { res: { error: 0, what: '' } }));
    }

    if (proto === 147) {
      const ret = this.clubStore.create(c.player.uid, msg && msg.name);
      if (ret.error) return c.send(pack(147, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(147, { res: { error: 0, what: '' }, id: ret.club.id }));
    }

    if (proto === 149 || proto === 150 || proto === 151 || proto === 152) {
      const found = proto === 149
        ? { club: this.clubStore.get(num(msg && msg.clubId)) }
        : this.clubStore.findScheme(num(msg && msg.id));
      const club = found && found.club;
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(proto, { res: { error: 1, what: '没有管理权限' } }));
      }
      if (proto === 149) {
        club.schemes.push({
          id: this.clubStore.nextOpId++, name: String(msg.name || ''), gameType: num(msg.gameType), num: num(msg.num),
          param1: num(msg.param1), param2: num(msg.param2), auto: false, color: '',
        });
      } else if (proto === 150) {
        const scheme = club.schemes.find((item) => item.id === num(msg.id));
        if (scheme) Object.assign(scheme, { name: String(msg.name || ''), gameType: num(msg.gameType), num: num(msg.num), param1: num(msg.param1), param2: num(msg.param2), color: String(msg.color || '') });
      } else if (proto === 151) {
        const scheme = club.schemes.find((item) => item.id === num(msg.id));
        if (scheme) scheme.auto = !!msg.status;
      } else {
        club.schemes = club.schemes.filter((item) => item.id !== num(msg.id));
      }
      this.persist();
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    }

    if (proto === 158) {
      const club = this.clubStore.get(num(msg && msg.id));
      if (!club || club.ownerUid !== c.player.uid) {
        return c.send(pack(158, { res: { error: 1, what: '只有部长可以解散俱乐部' } }));
      }
      const hasRoom = [...this.tables.values()].some((table) => table.clubId === club.id && !table.closed);
      if (hasRoom) return c.send(pack(158, { res: { error: 1, what: '俱乐部还有未结束的房间' } }));
      this.clubStore.clubs.delete(club.id);
      this.persist();
      return c.send(pack(158, { res: { error: 0, what: '' } }));
    }

    if (proto === 201) {
      const existingRoomId = this.uidRoom.get(c.player.uid) || c.player.roomId || 0;
      if (existingRoomId) {
        return c.send(pack(201, { res: { error: 1, what: '已经在房间里' } }));
      }
      const gameType = num(msg && msg.gameType);
      const roomNum = num(msg && msg.num);
      const param1 = num(msg && msg.param1);
      const param2 = num(msg && msg.param2);
      const invalid = rules.validateRoomConfig({
        gameType, num: roomNum, param1, param2,
      });
      if (invalid) return c.send(pack(201, { res: { error: 1, what: invalid } }));
      const config = rules.parseConfig(param1, param2);
      const clubId = num(msg && msg.clubId);
      if (clubId) {
        const club = this.clubStore.get(clubId);
        const member = club && this.clubStore.member(club, c.player.uid);
        if (!club || !member) return c.send(pack(201, { res: { error: 1, what: '不是俱乐部成员' } }));
        if (member.freeze) return c.send(pack(201, { res: { error: 1, what: '你已被俱乐部冻结' } }));
        if (club.settings.closed) return c.send(pack(201, { res: { error: 1, what: '俱乐部已关闭' } }));
      }
      const cost = rules.roomCardCost({ num: roomNum, 人数: config.人数, 房费: config.房费 });
      if (cost.host > 0 && (c.player.cardNum || 0) < cost.host) {
        return c.send(pack(201, { res: { error: 1, what: '房卡不足' } }));
      }
      if (cost.each > 0 && (c.player.cardNum || 0) < cost.each) {
        return c.send(pack(201, { res: { error: 1, what: '房卡不足' } }));
      }
      const roomId = this.nextRoomId++;
      const meta = {
        roomId,
        gameType,
        clubId,
        num: roomNum,
        param1,
        param2,
        host: c.player.uid,
        config,
      };
      const table = new Table(meta, this.tableHost(roomId));
      this.tables.set(roomId, table);
      c.roomId = roomId;
      this.uidRoom.set(c.player.uid, roomId);
      this.persist();
      console.log(`  201 建房 玩法=${table.gameType} 局数档=${table.num} 房费=${config.房费} -> roomId=${roomId}`);
      console.log(`      ${Object.entries(table.config).map(([k, v]) => `${k}=${v}`).join(' ')}`);
      return c.send(pack(201, { res: { error: 0, what: '' }, roomId }));
    }

    if (proto === 202) {
      const roomId = num(msg.roomId);
      const existingRoomId = this.uidRoom.get(c.player.uid) || c.player.roomId || 0;
      if (existingRoomId && existingRoomId !== roomId) {
        return c.send(pack(202, { res: { error: 1, what: '已经在其他房间里' } }));
      }
      const table = this.tables.get(roomId);
      if (!table || table.closed) {
        console.log(`  202 进房 ${roomId} 不存在`);
        return c.send(pack(202, { res: { error: 1, what: '房间不存在' } }));
      }
      const seated = table.members.find((m) => m.player.uid === c.player.uid);
      const cost = rules.roomCardCost({
        num: table.num,
        人数: table.config.人数,
        房费: table.config.房费,
      });
      // AA 等要自己付钱的，坐下前先看够不够；观战不扣、房主支付也不查入座的人
      const willSit = seated ? !seated.view : table.canSit();
      if (!seated && willSit && cost.each > 0 && (c.player.cardNum || 0) < cost.each) {
        return c.send(pack(202, { res: { error: 1, what: '房卡不足' } }));
      }
      const joined = table.join(c.player, connId);
      if (joined.error) return c.send(pack(202, { res: { error: 1, what: joined.error } }));
      this.maybeFillBots(table);
      c.roomId = roomId;
      const payload = JSON.stringify({ room: roomInfo(table), game: joined.game || {} });
      c.send(pack(202, {
        res: { error: 0, what: '' },
        json: JSON.stringify({ msgdata: payload }),
      }));
      table.afterJoin(c.player.uid);
      return;
    }

    if (proto === 200) {
      let envelope;
      let body;
      try {
        envelope = JSON.parse(msg && msg.json);
        body = envelope.msgdata ? JSON.parse(envelope.msgdata) : {};
      } catch {
        return c.send(pack(200, { res: { error: 1, what: '房内消息格式无效' } }));
      }
      const table = this.tables.get(c.roomId);
      const { msghead, msgdata } = envelope;
      if (typeof msghead !== 'string'
        || (msgdata != null && typeof msgdata !== 'string')
        || !body || typeof body !== 'object' || Array.isArray(body)) {
        return c.send(pack(200, { res: { error: 1, what: '房内消息格式无效' } }));
      }
      console.log(`  200 房内消息 ${msghead}${msghead === 'chatroom' ? ' [chat]' : ` ${msgdata || ''}`}`);
      if (!table || table.closed) {
        return c.send(pack(200, { res: { error: 1, what: '不在房间里' } }));
      }
      const ret = table.handle200(c.player.uid, msghead, body);
      if (ret.error) {
        console.log(`    ! ${msghead} 被拒：${ret.what}`);
        return c.send(pack(200, { res: { error: 1, what: ret.what } }));
      }
      return c.send(pack(200, { res: { error: 0, what: '' } }));
    }

    if (protocol[proto]) {
      console.log(`  ${proto} 未实现${hasRes(proto) ? '，兜一个成功' : '，无 res 字段，忽略'}`);
      if (hasRes(proto)) c.send(pack(proto, { res: { error: 0, what: '' } }));
      return;
    }
    console.log(`  ${proto} 未知 proto id`);
  }
}

module.exports = { GameApp };
