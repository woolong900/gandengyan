/**
 * GameApp：运行快照的导出与恢复。
 * 方法从 app.js 原样迁出，通过 mixin 挂到 GameApp.prototype，this 即 GameApp 实例。
 */
const {
  CLUB_APPLICATION_MESSAGE_ID_BASE, FIRST_PLAYER_UID, INVITE_GIVE, NEW_PLAYER_CARDS,
  SUPPORT_MAX_MESSAGES, Table, assignAvatarIfMissing, avatarUrls, cleanSupportText, crypto,
  defaultInvitePageText, emptyPlayer, maxStep, mintGuestNickname, normalizeBotSettings,
} = require('./common');

module.exports = {
  dump() {
    return {
      nextUid: this.nextUid,
      nextRoomId: this.nextRoomId,
      players: [...this.players.entries()].map(([token, p]) => ({
        token,
        uid: p.uid,
        nickname: p.nickname,
        sex: p.sex,
        avatarUrl: p.avatarUrl || '',
        readMessageIds: p.readMessageIds || [],
        createdAt: Number(p.createdAt || 0),
        lastLoginAt: Number(p.lastLoginAt || 0),
        lastIp: p.lastIp || '',
        lastIpCity: p.lastIpCity || '',
        lastIpAt: Number(p.lastIpAt || 0),
        lastIpLocatedAt: Number(p.lastIpLocatedAt || 0),
        lastClientPlatform: ['android', 'ios'].includes(p.lastClientPlatform)
          ? p.lastClientPlatform : '',
        lastClientPlatformIp: p.lastClientPlatformIp || '',
        lastClientPlatformAt: Number(p.lastClientPlatformAt || 0),
        disabled: !!p.disabled,
        wechatOpenid: p.wechatOpenid || '',
        wechatUnionid: p.wechatUnionid || '',
        wechatOpenids: p.wechatOpenids || [],
        wechatUnionids: p.wechatUnionids || [],
        wechatIdentities: p.wechatIdentities || [],
        tokenAliases: p.tokenAliases || [],
        identityVerified: !!p.identityVerified,
        identityNameInitial: p.identityNameInitial || '',
        identityNameHash: p.identityNameHash || '',
        identityIdHash: p.identityIdHash || '',
        identityIdMasked: p.identityIdMasked || '',
        identityVerifiedAt: Number(p.identityVerifiedAt || 0),
        identityVerificationLevel: p.identityVerificationLevel || '',
        guestDeviceHash: p.guestDeviceHash || '',
        cardNum: p.cardNum,
        roomId: p.roomId || 0,
        inviteCode: p.inviteCode || '',
        inviteCodeAliases: p.inviteCodeAliases || [],
        invitedBy: p.invitedBy || '',
        bot: !!p.bot,
        botStrategy: p.botStrategy === 'jev' ? 'jev' : 'local',
      })),
      rooms: [...this.tables.values()].filter((t) => !t.closed).map((t) => t.dump()),
      records: this.records,
      operatorMessages: this.operatorMessages,
      nextOperatorMessageId: this.nextOperatorMessageId,
      supportConversations: [...this.supportConversations.values()],
      nextSupportMessageId: this.nextSupportMessageId,
      publicNotices: this.publicNotices,
      economySettings: this.economySettings,
      botSettings: this.botSettings,
      playbackSeq: this.playbackSeq || 0,
      clubs: this.clubStore.dump(),
    };
  },

  restore(data) {
    if (!data) return;
    this.players.clear();
    this.playersByUid.clear();
    this.playersByTokenAlias.clear();
    this.playersByInviteCode.clear();
    this.playersByIdentityHash.clear();
    this.playersByGuestDeviceHash.clear();
    this.wechatMigrationTickets.clear();
    this.nextUid = Math.max(FIRST_PLAYER_UID, Number(data.nextUid) || 0);
    this.nextRoomId = data.nextRoomId || 100000;
    this.records = Array.isArray(data.records) ? data.records : [];
    this.operatorMessages = Array.isArray(data.operatorMessages) ? data.operatorMessages.filter((message) => (
      message && Number.isSafeInteger(Number(message.id)) && Number(message.id) >= 1000000000
        && Number(message.id) < CLUB_APPLICATION_MESSAGE_ID_BASE
    )).slice(-100) : [];
    this.nextOperatorMessageId = Math.max(
      1000000000,
      Math.min(CLUB_APPLICATION_MESSAGE_ID_BASE, Number(data.nextOperatorMessageId) || 0),
      ...this.operatorMessages.map((message) => Number(message.id) + 1),
    );
    this.supportConversations.clear();
    let maxSupportMessageId = 0;
    for (const raw of Array.isArray(data.supportConversations) ? data.supportConversations : []) {
      const uid = Number(raw && raw.uid);
      if (!Number.isSafeInteger(uid) || uid <= 0 || !Array.isArray(raw.messages)) continue;
      const messages = raw.messages.filter((message) => message && Number.isSafeInteger(Number(message.id))
        && ['player', 'admin'].includes(message.from) && cleanSupportText(message.content))
        .slice(-SUPPORT_MAX_MESSAGES).map((message) => {
          maxSupportMessageId = Math.max(maxSupportMessageId, Number(message.id));
          return {
            id: Number(message.id), from: message.from,
            content: cleanSupportText(message.content).slice(0, message.from === 'admin' ? 500 : 200),
            createdAt: Number(message.createdAt) || 0,
            ...(message.actor ? { actor: String(message.actor).slice(0, 64) } : {}),
            ...(message.context && typeof message.context === 'object' ? { context: message.context } : {}),
          };
        });
      this.supportConversations.set(uid, {
        uid, nickname: String(raw.nickname || `玩家${uid}`).slice(0, 32),
        updatedAt: Number(raw.updatedAt) || (messages.length ? messages[messages.length - 1].createdAt : 0),
        adminUnread: Math.max(0, Math.min(999, Number(raw.adminUnread) || 0)),
        playerUnread: Math.max(0, Math.min(999, Number(raw.playerUnread) || 0)),
        closed: !!raw.closed, messages,
      });
    }
    this.trimSupportConversations();
    this.nextSupportMessageId = Math.max(1, Number(data.nextSupportMessageId) || 0, maxSupportMessageId + 1);
    const notices = data.publicNotices && typeof data.publicNotices === 'object' ? data.publicNotices : {};
    this.publicNotices = {
      hallMarquee: String(notices.hallMarquee || ''),
      serviceWechat: String(notices.serviceWechat || ''),
      serviceQQ: String(notices.serviceQQ || ''),
    };
    const economy = data.economySettings && typeof data.economySettings === 'object' ? data.economySettings : {};
    const inviteBindBonus = Number.isSafeInteger(economy.inviteBindBonus) && economy.inviteBindBonus >= 0
      ? economy.inviteBindBonus : INVITE_GIVE;
    const configuredInvitePageText = typeof economy.invitePageText === 'string'
      ? economy.invitePageText.trim().slice(0, 100) : '';
    this.economySettings = {
      newPlayerCards: Number.isSafeInteger(economy.newPlayerCards) && economy.newPlayerCards >= 0
        ? economy.newPlayerCards : NEW_PLAYER_CARDS,
      clubJoinBonus: Number.isSafeInteger(economy.clubJoinBonus) && economy.clubJoinBonus >= 0
        ? economy.clubJoinBonus : 200,
      inviteBindBonus,
      invitePageText: configuredInvitePageText || defaultInvitePageText(inviteBindBonus),
    };
    const botSettings = data.botSettings && typeof data.botSettings === 'object' ? data.botSettings : {};
    this.botSettings = normalizeBotSettings(botSettings);
    this.playbackSeq = data.playbackSeq || 0;
    this.clubStore.restore(data.clubs);
    const byUid = new Map();
    let missingAvatars = 0;
    let migratedBotIdentities = 0;
    const usedNicknames = new Set((data.players || [])
      .filter((player) => !player.bot && player.nickname).map((player) => String(player.nickname)));
    for (const p of data.players || []) {
      const player = emptyPlayer(p.uid, p);
      if (player.bot) {
        let changed = false;
        if (!String(player.nickname || '').trim() || /^(陪玩|机器人|玩家)\d+$/.test(player.nickname)) {
          player.nickname = mintGuestNickname(usedNicknames);
          changed = true;
        }
        usedNicknames.add(player.nickname);
        if (!avatarUrls.includes(String(player.avatarUrl || ''))) {
          player.avatarUrl = avatarUrls[crypto.randomInt(avatarUrls.length)];
          changed = true;
        }
        if (changed) migratedBotIdentities++;
      } else {
        if (assignAvatarIfMissing(player)) missingAvatars++;
        usedNicknames.add(player.nickname);
      }
      this.players.set(p.token, player);
      this.playersByUid.set(player.uid, player);
      for (const alias of player.tokenAliases || []) {
        if (alias !== p.token && !this.players.has(alias)) this.playersByTokenAlias.set(alias, player);
      }
      if (!player.bot && player.uid >= this.nextUid) this.nextUid = player.uid + 1;
      if (player.inviteCode && !player.bot) this.playersByInviteCode.set(player.inviteCode, player);
      if (!player.bot) {
        for (const alias of player.inviteCodeAliases || []) this.playersByInviteCode.set(alias, player);
      }
      if (player.identityIdHash && !player.bot) this.playersByIdentityHash.set(player.identityIdHash, player);
      if (player.guestDeviceHash && !player.bot && !this.playersByGuestDeviceHash.has(player.guestDeviceHash)) {
        this.playersByGuestDeviceHash.set(player.guestDeviceHash, p.token);
      }
      byUid.set(player.uid, player);
    }
    for (const raw of data.rooms || []) {
      if (!raw.members || !raw.members.length) continue;
      const table = Table.fromDump(raw, this.tableHost(raw.roomId), byUid);
      if (!table.members.length || table.closed) continue;
      this.tables.set(table.roomId, table);
      for (const m of table.members) this.uidRoom.set(m.player.uid, table.roomId);
    }
    let removedBotsByPolicy = 0;
    for (const table of [...this.tables.values()]) {
      // 重启后真人均为离线；已完成的牌局无需继续占着房号。
      if (!table.round && table.step >= maxStep(table)) table.dissolve();
      else {
        // 兼容旧存档：旧版本可能已经向其他房主的等待房补了机器人。
        // 等待房在恢复时立即清理；正在打牌的房间由小局结束回调再清理。
        if (!this.botsAllowed(table)) removedBotsByPolicy += table.removeBots();
        if (typeof table.syncManagedTrustees === 'function') table.syncManagedTrustees({ arm: false });
        table.rearmTimers();
      }
    }
    let staleLinks = 0;
    for (const player of this.playersByUid.values()) {
      if (player.roomId && !this.uidRoom.has(player.uid)) {
        player.roomId = 0;
        staleLinks += 1;
      }
    }
    if (staleLinks || missingAvatars || migratedBotIdentities || removedBotsByPolicy) this.persist();
    if (missingAvatars) console.log(`已为 ${missingAvatars} 位无头像玩家分配默认头像`);
    if (migratedBotIdentities) console.log(`已为 ${migratedBotIdentities} 位机器人随机分配昵称与头像`);
  },
};
