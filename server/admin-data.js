const rules = require('./rules');
const { maxStep } = require('./shared');
const { MAX_CLUB_CARDS } = require('./clubs');
const chinaDay = (time) => new Date(Number(time) + 8 * 3600000).toISOString().slice(0, 10);

const fail = (error, status = 400) => ({ error, status });
const page = (items, query = {}) => {
  const pageNumber = Math.max(1, Math.min(100000, Number(query.page) || 1));
  const limit = Math.max(10, Math.min(100, Number(query.limit) || 25));
  return { items: items.slice((pageNumber - 1) * limit, pageNumber * limit), total: items.length, page: pageNumber, limit };
};

class AdminData {
  constructor(app, store) { this.app = app; this.store = store; }

  onlineUids() {
    return new Set([...this.app.conns.values()].filter((conn) => conn.player && !conn.player.bot)
      .map((conn) => conn.player.uid));
  }

  dashboard() {
    const players = [...this.app.playersByUid.values()].filter((player) => !player.bot);
    const rooms = [...this.app.tables.values()].filter((table) => !table.closed);
    const today = chinaDay(this.app.now());
    const history = this.store && this.store.recordHistoryStats
      ? this.store.recordHistoryStats(this.app.now() - 7 * 86400000) : null;
    const recentRecords = history ? [] : this.app.records.filter((record) => record.time >= this.app.now() - 7 * 86400000);
    const chart = Array.from({ length: 7 }, (_, index) => {
      const date = chinaDay(this.app.now() - (6 - index) * 86400000);
      return { date, games: history ? Number(history.days[date] || 0)
        : recentRecords.filter((record) => chinaDay(record.time) === date).length,
        registrations: players.filter((player) => player.createdAt && chinaDay(player.createdAt) === date).length };
    });
    return {
      totals: { players: players.length, online: this.onlineUids().size, rooms: rooms.length,
        playingRooms: rooms.filter((table) => !!table.round).length, clubs: this.app.clubStore.clubs.size,
        recordsArchived: history ? history.total : this.app.records.length,
        messages: this.app.operatorMessages.filter((message) => message.expiresAt > this.app.now()).length,
        roomCards: players.reduce((sum, player) => sum + Number(player.cardNum || 0), 0),
        clubCards: [...this.app.clubStore.clubs.values()].reduce((sum, club) => sum + Number(club.balanceCard || 0), 0),
        newPlayersToday: players.filter((player) => player.createdAt && chinaDay(player.createdAt) === today).length },
      chart,
      recentRooms: rooms.slice(-8).reverse().map((table) => this.roomSummary(table)),
      recentRecords: (this.store && this.store.listRecordHistory
        ? this.store.listRecordHistory({ limit: 8 }).items : this.app.records.slice(-8).reverse())
        .map((record) => this.recordSummary(record)),
      retention: '牌局归档从上线前现存的最多300场回填，之后持续保存新战绩；更早已删除的战绩无法恢复。',
    };
  }

  playerSummary(player, online = this.onlineUids()) {
    return { uid: player.uid, nickname: player.nickname, avatarUrl: player.avatarUrl || '',
      cardNum: Number(player.cardNum || 0), online: online.has(player.uid), roomId: Number(player.roomId || 0),
      identityVerified: !!player.identityVerified, disabled: !!player.disabled,
      createdAt: Number(player.createdAt || 0), lastLoginAt: Number(player.lastLoginAt || 0),
      clubCount: this.app.clubStore.listFor(player.uid).length };
  }

  players(query) {
    const term = String(query.q || '').trim().toLowerCase().slice(0, 64);
    const online = this.onlineUids();
    const items = [...this.app.playersByUid.values()].filter((player) => !player.bot && (
      !term || String(player.uid).includes(term) || String(player.nickname || '').toLowerCase().includes(term)
    )).sort((a, b) => b.uid - a.uid).map((player) => this.playerSummary(player, online));
    return page(items, query);
  }

  player(uid) {
    const player = this.app.playerByUid(uid);
    if (!player || player.bot) return fail('玩家不存在', 404);
    return { ...this.playerSummary(player), sex: player.sex,
      inviteCode: player.inviteCode || '', invitedBy: player.invitedBy || '',
      identityNameInitial: player.identityNameInitial || '', identityIdMasked: player.identityIdMasked || '',
      identityVerificationLevel: player.identityVerificationLevel || '',
      clubs: this.app.clubStore.listFor(player.uid).map((club) => ({ id: club.id, name: club.name,
        role: this.app.clubStore.role(club, player.uid), frozen: !!this.app.clubStore.member(club, player.uid).freeze })),
      recentRecords: (this.store && this.store.listPlayerRecordHistory
        ? this.store.listPlayerRecordHistory(player.uid, 10)
        : this.app.records.filter((record) => (record.uids || []).includes(player.uid)).slice(-10).reverse())
        .map((record) => this.recordSummary(record)) };
  }

  adjustCards(uid, body) {
    const player = this.app.playerByUid(uid);
    if (!player || player.bot) return fail('玩家不存在', 404);
    const delta = Number(body.delta);
    const reason = String(body.reason || '').trim();
    if (!Number.isSafeInteger(delta) || !delta || Math.abs(delta) > 1000000) return fail('调整数量须为1至100万的整数');
    if (reason.length < 3 || reason.length > 100) return fail('请填写3至100字的调整原因');
    const before = Number(player.cardNum || 0);
    if (before + delta < 0) return fail('房卡余额不足');
    if (!Number.isSafeInteger(before + delta)) return fail('房卡余额超出安全范围');
    const after = this.app.changeCards(player.uid, delta, `后台：${reason}`);
    this.app.persist();
    return { uid: player.uid, delta, before, after, reason };
  }

  setStatus(uid, body) {
    const player = this.app.playerByUid(uid);
    if (!player || player.bot) return fail('玩家不存在', 404);
    if (typeof body.disabled !== 'boolean') return fail('状态参数无效');
    const reason = String(body.reason || '').trim();
    if (reason.length < 3 || reason.length > 100) return fail('请填写3至100字的操作原因');
    if (body.disabled && [...this.app.tables.values()].some((table) => !table.closed && table.members.some((member) => member.player.uid === player.uid))) {
      return fail('玩家仍在房间中，请先处理房间');
    }
    player.disabled = body.disabled;
    this.app.persist();
    if (player.disabled) for (const conn of this.app.conns.values()) {
      if (conn.player && conn.player.uid === player.uid && conn.close) conn.close();
    }
    return { uid: player.uid, disabled: player.disabled, reason };
  }

  roomSummary(table) {
    return { roomId: table.roomId, clubId: table.clubId || 0, schemeId: table.schemeId || 0,
      gameType: table.gameType, hostUid: table.hostUid, step: table.step || 0,
      totalStep: maxStep(table), status: table.round ? '进行中' : table.step ? '局间' : '等待中',
      occupied: table.members.filter((member) => !member.view).length,
      maxPlayers: table.config.人数, botCount: table.members.filter((member) => member.bot).length };
  }

  rooms(query) {
    const room = String(query.q || '').trim();
    const items = [...this.app.tables.values()].filter((table) => !table.closed && (
      !room || String(table.roomId).includes(room) || String(table.clubId || '').includes(room)
    )).sort((a, b) => b.roomId - a.roomId).map((table) => this.roomSummary(table));
    return page(items, query);
  }

  room(id) {
    const table = this.app.tables.get(Number(id));
    if (!table || table.closed) return fail('房间不存在或已结束', 404);
    return { ...this.roomSummary(table), config: table.config,
      members: table.members.map((member) => ({ uid: member.player.uid, nickname: member.player.nickname,
        site: member.site, score: Number(member.score || 0) / rules.RATIO,
        bot: !!member.bot, spectator: !!member.view, online: !!member.online, trustee: !!member.trustee })) };
  }

  dissolveRoom(id, body) {
    const table = this.app.tables.get(Number(id));
    if (!table || table.closed) return fail('房间不存在或已结束', 404);
    const reason = String(body.reason || '').trim();
    if (reason.length < 3 || reason.length > 100) return fail('请填写3至100字的解散原因');
    const before = this.roomSummary(table);
    table.dissolve(1);
    if (before.clubId && before.schemeId) {
      const club = this.app.clubStore.get(before.clubId);
      if (club && !club.settings.closed && this.app.ensureClubSchemeTables(club)) this.app.persist();
    }
    return { room: before, reason };
  }

  recordSummary(record) {
    return { id: record.id, roomId: record.roomId, clubId: record.clubId || 0,
      gameId: record.gameId, gameCount: record.gameCount, totalCount: record.totalCount,
      time: record.time, players: (record.players || []).map((player) => ({ uid: player.uid,
        name: player.name, score: Number(player.score || 0) / (record.scoreRatio || rules.RATIO) })) };
  }

  records(query) {
    if (this.store && this.store.listRecordHistory) {
      const result = this.store.listRecordHistory(query);
      return { ...result, items: result.items.map((record) => this.recordSummary(record)),
        retention: '上线后持续归档；上线前仅回填当时保留的最多300场' };
    }
    const q = String(query.q || '').trim();
    const items = this.app.records.filter((record) => !q || String(record.roomId).includes(q)
      || String(record.id).includes(q) || (record.uids || []).some((uid) => String(uid).includes(q)))
      .slice().sort((a, b) => b.time - a.time).map((record) => this.recordSummary(record));
    return { ...page(items, query), retention: '仅保留最近300场战绩' };
  }

  record(id) {
    const record = (this.store && this.store.getRecordHistory && this.store.getRecordHistory(id))
      || this.app.records.find((item) => String(item.id) === String(id));
    if (!record) return fail('牌局不存在或已超过保留期限', 404);
    return { ...this.recordSummary(record), details: (record.details || []).map((hand) => ({ id: hand.id,
      scores: (hand.scores || []).map((score) => ({ uid: score.uid,
        score: Number(score.score || 0) / (record.scoreRatio || rules.RATIO) })) })),
      shareCode: record.shareCode || '', playbackIds: record.playbackIds || Object.keys(record.playbacks || {}) };
  }

  clubs(query) {
    const q = String(query.q || '').trim().toLowerCase();
    const items = [...this.app.clubStore.clubs.values()].filter((club) => !q || String(club.id).includes(q)
      || club.name.toLowerCase().includes(q)).sort((a, b) => b.id - a.id).map((club) => ({
        id: club.id, name: club.name, ownerUid: club.ownerUid, closed: !!club.settings.closed,
        balanceCard: Number(club.balanceCard || 0),
        members: club.members.length, schemes: club.schemes.length, rooms: [...this.app.tables.values()]
          .filter((table) => !table.closed && table.clubId === club.id).length,
      }));
    return page(items, query);
  }

  club(id) {
    const club = this.app.clubStore.get(id);
    if (!club) return fail('俱乐部不存在', 404);
    return { id: club.id, name: club.name, code: club.code, ownerUid: club.ownerUid,
      announcement: club.announcement, settings: club.settings, balanceCard: Number(club.balanceCard || 0),
      members: club.members.map((member) => ({ uid: member.uid, role: member.role, frozen: !!member.freeze,
        nickname: (this.app.playerByUid(member.uid) || {}).nickname || `玩家${member.uid}` })),
      schemes: club.schemes.map((scheme) => ({ id: scheme.id, name: scheme.name, auto: !!scheme.auto,
        gameType: scheme.gameType, num: scheme.num })),
      applications: club.applications.length, invites: club.invites.length };
  }

  updateClub(id, body) {
    const club = this.app.clubStore.get(id);
    if (!club) return fail('俱乐部不存在', 404);
    if (body.announcement != null) {
      if (typeof body.announcement !== 'string' || body.announcement.length > 200) return fail('俱乐部公告不能超过200字');
    }
    if (body.closed != null) {
      if (typeof body.closed !== 'boolean') return fail('俱乐部状态参数无效');
      if (body.closed && [...this.app.tables.values()].some((table) => !table.closed && table.clubId === club.id && table.members.length)) {
        return fail('俱乐部仍有玩家在房间中，请先处理房间');
      }
    }
    if (body.announcement != null) club.announcement = body.announcement.trim();
    if (body.closed != null) club.settings.closed = body.closed;
    this.app.persist();
    return { id: club.id, announcement: club.announcement, closed: club.settings.closed };
  }

  adjustClubCards(id, body) {
    const club = this.app.clubStore.get(id);
    if (!club) return fail('俱乐部不存在', 404);
    const delta = Number(body.delta);
    const reason = String(body.reason || '').trim();
    if (!Number.isSafeInteger(delta) || !delta || Math.abs(delta) > 1000000) return fail('调整数量须为1至100万的整数');
    if (reason.length < 3 || reason.length > 100) return fail('请填写3至100字的调整原因');
    const before = Number(club.balanceCard || 0);
    if (before + delta < 0) return fail('俱乐部房卡余额不足');
    if (!Number.isSafeInteger(before + delta) || before + delta > MAX_CLUB_CARDS) {
      return fail('俱乐部房卡余额超出客户端支持范围');
    }
    const after = this.app.changeClubCards(club.id, delta, `后台：${reason}`);
    this.app.persist();
    return { clubId: club.id, delta, before, after, reason };
  }

  updateEconomy(body) {
    const keys = { clubJoinBonus: '俱乐部新成员奖励', inviteBindBonus: '邀请码绑定奖励' };
    const next = { ...this.app.economySettings };
    for (const [key, label] of Object.entries(keys)) {
      if (body[key] == null) continue;
      if (!Number.isSafeInteger(body[key]) || body[key] < 0 || body[key] > 1000000) {
        return fail(`${label}须为0至100万的整数`);
      }
      next[key] = body[key];
    }
    this.app.economySettings = next;
    this.app.persist();
    return next;
  }

  updateNotices(body) {
    const max = { hallMarquee: 200, serviceWechat: 64, serviceQQ: 64 };
    for (const [key, limit] of Object.entries(max)) {
      if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > limit)) return fail(`${key} 长度超限`);
    }
    const next = { ...this.app.publicNotices };
    for (const key of Object.keys(max)) if (body[key] != null) next[key] = body[key].trim();
    this.app.publicNotices = next;
    this.app.persist();
    this.app.broadcastNotices();
    return next;
  }
}

module.exports = { AdminData, fail };
