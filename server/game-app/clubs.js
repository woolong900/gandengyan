/**
 * GameApp：俱乐部视图、方案牌桌与俱乐部战绩。
 * 方法从 app.js 原样迁出，通过 mixin 挂到 GameApp.prototype，this 即 GameApp 实例。
 */
const {
  DAY_SEC, PLAYER, Table, buildRecord, keepLatest, maxStep, mintPlaybackId, num, qjshzRules, rules,
  toListItem,
} = require('./common');

module.exports = {
  mintPlaybackId(roomId, step) {
    this.playbackSeq = (this.playbackSeq || 0) + 1;
    return mintPlaybackId(roomId, step, this.playbackSeq);
  },

  saveRecord(table) {
    if (!table || table.recordSaved) return null;
    if ((table.step || 0) < 1 && !(table.hands && table.hands.length)) return null;
    table.recordSaved = true;
    const rec = buildRecord(table, this.now());
    try { this.onRecord(rec); } catch (error) { console.error('牌局归档失败', error); }
    this.records = keepLatest(this.records.concat(rec));
    console.log(`  战绩 ${rec.id} 房${rec.roomId} ${rec.gameCount}/${rec.totalCount}局`);
    return rec;
  },

  clubInfo(club, uid) {
    const schemeTablesChanged = this.ensureClubSchemeTables(club);
    if (schemeTablesChanged) this.persist();
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
  },

  clubMemberInfo(club, member) {
    const player = this.playerByUid(member.uid) || {};
    const online = [...this.conns.values()].some((c) => c.player && c.player.uid === Number(member.uid));
    return {
      avatarUrl: player.avatarUrl || '',
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
  },

  clubRoomInfo(table) {
    const seats = table.seats();
    const host = this.playerByUid(table.hostUid) || {};
    return {
      id: table.roomId,
      status: table.round ? 1 : 0,
      owner: { avatarUrl: host.avatarUrl || '', code: String(table.hostUid), nickname: host.nickname || `玩家${table.hostUid}` },
      gameType: table.gameType,
      num: table.num,
      param1: Number(table.gameType) === 17 ? qjshzRules.baseParam1(table.param1) : table.param1,
      param2: table.param2,
      players: seats.map((m) => ({
        avatarUrl: m.player.avatarUrl || '', code: String(m.player.uid), nickname: m.player.nickname || `玩家${m.player.uid}`,
      })),
      curPlayers: seats.length,
      maxPlayers: table.config.人数,
      curStep: table.step || 0,
      maxStep: maxStep(table),
      schemeId: table.schemeId || 0,
    };
  },

  clubRoomError(clubId, uid) {
    if (!clubId) return null;
    const club = this.clubStore.get(clubId);
    const member = club && this.clubStore.member(club, uid);
    if (!club || !member) return '不是俱乐部成员';
    if (member.freeze) return '你已被俱乐部冻结';
    if (club.settings.closed) return '俱乐部已关闭';
    return null;
  },

  ensureClubSchemeTables(club) {
    if (!club) return false;
    let changed = false;
    for (const scheme of club.schemes || []) {
      if (!scheme.auto) continue;
      const exists = [...this.tables.values()].some((table) => (
        !table.closed && table.clubId === club.id && Number(table.schemeId) === Number(scheme.id)
        && table.members.length === 0
      ));
      if (exists) continue;
      const roomId = this.mintRoomId();
      const table = new Table({
        roomId,
        gameType: scheme.gameType,
        clubId: club.id,
        schemeId: scheme.id,
        num: scheme.num,
        param1: scheme.param1,
        param2: scheme.param2,
        host: 0,
        config: rules.forGame(scheme.gameType).parseConfig(scheme.param1, scheme.param2),
      }, this.tableHost(roomId));
      this.tables.set(roomId, table);
      changed = true;
    }
    return changed;
  },

  clubRecords(clubId) {
    return this.records.filter((record) => Number(record.clubId) === Number(clubId));
  },

  canViewRecord(uid, record) {
    if (!record) return false;
    if ((record.uids || []).some((id) => Number(id) === Number(uid))) return true;
    const club = this.clubStore.get(record.clubId);
    return !!club && this.clubStore.isAdmin(club, uid);
  },

  clubRecordList(clubId, msg) {
    const day = num(msg && msg.time);
    const start = num(msg && msg.startTime) || day;
    const end = num(msg && msg.endTime) || (day + DAY_SEC);
    const fromMs = start * 1000;
    const toMs = end * 1000;
    const query = String((msg && msg.userCode) || '').trim().toLowerCase();
    return this.clubRecords(clubId)
      .filter((record) => record.time >= fromMs && record.time < toMs)
      .filter((record) => !query || (record.players || []).some((player) => (
        String(player.uid) === query || String(player.name || '').toLowerCase().includes(query)
      )))
      .sort((a, b) => b.time - a.time)
      .map(toListItem);
  },

  clubRecordStats(club, records) {
    // 俱乐部统计会同时汇总不同玩法。麻将用十分之一分保存，
    // 说胡子为了保留 1.5 倍与小数底分，使用百分之一分保存；不能把两种
    // 原始整数直接相加后统一按 10 除，否则说胡子会被放大十倍。
    const scoreRatio = 100;
    return club.members.map((member) => {
      const player = this.playerByUid(member.uid) || {};
      let score = 0;
      let number = 0;
      let winner = 0;
      for (const record of records) {
        const item = (record.players || []).find((p) => Number(p.uid) === Number(member.uid));
        if (!item) continue;
        number++;
        const recordRatio = Number(record.scoreRatio)
          || Number(rules.forGame(record.gameId).RATIO)
          || rules.RATIO;
        score += Math.round(Number(item.score || 0) * scoreRatio / recordRatio);
        if (item.winner) winner++;
      }
      return {
        avatarUrl: player.avatarUrl || '', nickname: player.nickname || `玩家${member.uid}`, code: String(member.uid),
        winner, score, number, scoreRatio, remark: member.remark || '',
      };
    }).filter((item) => item.number > 0);
  },
};
