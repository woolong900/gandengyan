/**
 * GameApp：陪玩机器人、托管与记牌器白名单。
 * 方法从 app.js 原样迁出，通过 mixin 挂到 GameApp.prototype，this 即 GameApp 实例。
 */
const {
  BOT_MODES, BOT_ROOM_OWNER_UIDS, BOT_UID_MAX, BOT_UID_MIN, avatarUrls, crypto, emptyBotStat,
  emptyPlayer, mintGuestNickname, normalizeTrusteeWhitelist, push,
} = require('./common');

module.exports = {
  fillBotsOn() {
    return this.botSettings.enabled;
  },

  botRoomEligible(table) {
    return !!table && BOT_ROOM_OWNER_UIDS.has(Number(table.creatorUid));
  },

  botsAllowed(table) {
    return this.fillBotsOn() && this.botRoomEligible(table);
  },

  trusteeWhitelisted(uid) {
    return this.botSettings.trusteeWhitelist.includes(Number(uid));
  },

  recordCardWhitelisted(uid) {
    return this.botSettings.recordCardWhitelist.includes(Number(uid));
  },

  recordCardAccess(conn) {
    return !!(conn && conn.platform === 'android' && conn.player
      && this.recordCardWhitelisted(conn.player.uid));
  },

  setRecordCardWhitelist(uid, enabled) {
    const target = Number(uid);
    if (!Number.isSafeInteger(target) || target <= 0 || target >= BOT_UID_MIN) {
      return { error: '玩家 ID 无效' };
    }
    if (typeof enabled !== 'boolean') return { error: '记牌器白名单参数无效' };
    const next = new Set(this.botSettings.recordCardWhitelist);
    if (enabled) next.add(target);
    else next.delete(target);
    this.botSettings.recordCardWhitelist = normalizeTrusteeWhitelist([...next]);
    let notified = 0;
    for (const conn of this.conns.values()) {
      if (!conn.player || Number(conn.player.uid) !== target || !conn.roomId || !conn.send) continue;
      conn.send(push('record_card_access', { enabled: enabled && conn.platform === 'android' }));
      notified += 1;
    }
    this.persist();
    return { uid: target, enabled, notified };
  },

  setTrusteeWhitelist(uid, enabled) {
    const target = Number(uid);
    if (!Number.isSafeInteger(target) || target <= 0 || target >= BOT_UID_MIN) {
      return { error: '玩家 ID 无效' };
    }
    if (typeof enabled !== 'boolean') return { error: '托管白名单参数无效' };
    const next = new Set(this.botSettings.trusteeWhitelist);
    if (enabled) next.add(target);
    else next.delete(target);
    this.botSettings.trusteeWhitelist = normalizeTrusteeWhitelist([...next]);
    let active = 0;
    for (const table of this.tables.values()) {
      if (table.closed || typeof table.syncManagedTrustees !== 'function') continue;
      if (typeof table.resetManagedTrusteeOptOut === 'function') {
        table.resetManagedTrusteeOptOut(target);
      }
      active += table.syncManagedTrustees();
    }
    this.persist();
    return { uid: target, enabled, active };
  },

  forgetBot(uid) {
    const player = this.playerByUid(uid);
    if (!player || !player.bot) return;
    this.playersByUid.delete(player.uid);
    this.players.delete(`t_bot_${player.uid}`);
    this.uidRoom.delete(player.uid);
  },

  setBotsEnabled(enabled) {
    return this.setBotSettings({ enabled, mode: this.botSettings.mode });
  },

  setBotSettings({ enabled, mode }) {
    if (typeof enabled !== 'boolean') return { error: '机器人开关参数无效' };
    if (!BOT_MODES.has(mode)) return { error: '机器人策略参数无效' };
    const modeChanged = this.botSettings.mode !== mode;
    this.botSettings.enabled = enabled;
    this.botSettings.mode = mode;
    let removed = 0;
    let filledRooms = 0;
    for (const table of this.tables.values()) {
      if (table.closed) continue;
      if (!enabled || !this.botRoomEligible(table) || (modeChanged && !table.round)) removed += table.removeBots();
      else {
        const before = table.members.filter((member) => member.bot).length;
        this.maybeFillBots(table);
        if (table.members.filter((member) => member.bot).length > before) filledRooms++;
      }
      if (enabled && modeChanged && !table.round && this.botRoomEligible(table)) {
        const before = table.members.filter((member) => member.bot).length;
        this.maybeFillBots(table);
        if (table.members.filter((member) => member.bot).length > before) filledRooms++;
      }
    }
    this.persist();
    const playingBots = [...this.tables.values()].reduce((count, table) => count
      + (table.round ? table.members.filter((member) => member.bot).length : 0), 0);
    return { enabled, mode, removed, filledRooms, playingBots };
  },

  botStrategy(site, roomId) {
    if (this.botSettings.mode !== 'ab') return this.botSettings.mode;
    return (Number(roomId) + Number(site)) % 2 ? 'local' : 'jev';
  },

  mintBot(site, roomId, strategy = this.botStrategy(site, roomId)) {
    let uid;
    do { uid = crypto.randomInt(BOT_UID_MIN, BOT_UID_MAX); }
    while (this.playersByUid.has(uid));
    const token = `t_bot_${uid}`;
    const usedNames = new Set([...this.playersByUid.values()].map((player) => player.nickname));
    const player = emptyPlayer(uid, {
      nickname: mintGuestNickname(usedNames),
      avatarUrl: avatarUrls[crypto.randomInt(avatarUrls.length)],
      roomId,
      bot: true,
      botStrategy: strategy,
      cardNum: 0,
    });
    this.players.set(token, player);
    this.playersByUid.set(player.uid, player);
    return player;
  },

  maybeFillBots(table) {
    if (!this.botsAllowed(table) || !table.needsBots()) return;
    const bots = [];
    for (let site = 2; site <= table.config.人数; site++) {
      const strategy = this.botStrategy(site, table.roomId);
      bots.push({ player: this.mintBot(site, table.roomId, strategy), site, botStrategy: strategy });
    }
    table.addBots(bots);
  },

  recordBotResult(entries) {
    for (const entry of entries || []) {
      const strategy = entry.strategy === 'jev' ? 'jev' : 'local';
      const stat = this.botSettings.stats[strategy] || (this.botSettings.stats[strategy] = emptyBotStat());
      stat.rounds += 1;
      if (entry.won) stat.wins += 1;
      if (entry.draw) stat.draws += 1;
      stat.score += Number(entry.score) || 0;
    }
  },
};
