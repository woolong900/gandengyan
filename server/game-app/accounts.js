/**
 * GameApp：登录（游客 / 微信 / token）、微信迁移、邀请码、实名、房卡余额。
 * 方法从 app.js 原样迁出，通过 mixin 挂到 GameApp.prototype，this 即 GameApp 实例。
 */
const {
  INVITE_AMBIGUOUS, MAX_CLUB_CARDS, assignAvatarIfMissing, configBody, crypto, emptyPlayer,
  identityDigest, maskIdCard, mintGuestNickname, mintInviteCode, pack, validateIdentity, versionBody,
} = require('./common');

module.exports = {
  loginError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  },

  pruneWechatMigrationTickets() {
    const now = this.now();
    for (const [ticket, entry] of this.wechatMigrationTickets.entries()) {
      if (!entry || entry.expiresAt <= now) this.wechatMigrationTickets.delete(ticket);
    }
    while (this.wechatMigrationTickets.size > 1000) {
      this.wechatMigrationTickets.delete(this.wechatMigrationTickets.keys().next().value);
    }
  },

  issueWechatMigrationTicket(token, appId) {
    const targetAppId = String(appId || '').trim();
    const player = this.playerForToken(token);
    if (!player || player.bot) throw this.loginError('原账号登录凭证已失效', 65);
    if (player.disabled) throw this.loginError('账号已停用，请联系管理员', 66);
    const knownWechat = player.wechatOpenid || (player.wechatOpenids || []).length
      || (player.wechatIdentities || []).length;
    if (!knownWechat) throw this.loginError('原账号不是微信账号，不能自动迁移', 67);
    if (!/^wx[0-9A-Za-z]{16}$/.test(targetAppId)) throw this.loginError('新微信 AppID 无效', 4);
    this.pruneWechatMigrationTickets();
    const ticket = `wm_${crypto.randomBytes(32).toString('base64url')}`;
    this.wechatMigrationTickets.set(ticket, {
      uid: player.uid, appId: targetAppId, expiresAt: this.now() + 10 * 60 * 1000,
    });
    return { ticket, expiresIn: 600 };
  },

  consumeWechatMigrationTicket(ticket, appId) {
    this.pruneWechatMigrationTickets();
    const key = String(ticket || '');
    const entry = this.wechatMigrationTickets.get(key);
    // 迁移凭证是一次性的：校验失败也立即销毁，防止重放。
    if (entry) this.wechatMigrationTickets.delete(key);
    if (!entry || entry.expiresAt <= this.now() || entry.appId !== String(appId || '')) {
      throw this.loginError('账号迁移凭证已失效，请重试', 68);
    }
    const player = this.playerByUid(entry.uid);
    if (!player || player.bot || player.disabled) throw this.loginError('原账号已无法迁移', 68);
    return player;
  },

  notifyCard(player) {
    if (!player || player.bot) return;
    const buf = pack(1001, { card: player.cardNum || 0, gold: 0 });
    for (const c of this.conns.values()) {
      if (c.player && c.player.uid === player.uid && c.send) c.send(buf);
    }
  },

  changeCards(uid, delta, reason) {
    const player = this.playerByUid(uid);
    if (!player || player.bot || !delta) return player ? player.cardNum : 0;
    player.cardNum = Math.max(0, (player.cardNum || 0) + delta);
    this.notifyCard(player);
    console.log(`  房卡 uid=${player.uid} ${delta > 0 ? '+' : ''}${delta} -> ${player.cardNum}${reason ? ` ${reason}` : ''}`);
    return player.cardNum;
  },

  clubCardBalance(clubId) {
    const club = this.clubStore.get(clubId);
    return club ? Number(club.balanceCard || 0) : null;
  },

  changeClubCards(clubId, delta, reason) {
    const club = this.clubStore.get(clubId);
    if (!club || !Number.isSafeInteger(delta)) return null;
    const before = Number(club.balanceCard || 0);
    if (!Number.isSafeInteger(before + delta) || before + delta < 0 || before + delta > MAX_CLUB_CARDS) return null;
    club.balanceCard = before + delta;
    console.log(`  俱乐部房卡 clubId=${club.id} ${delta > 0 ? '+' : ''}${delta} -> ${club.balanceCard}${reason ? ` ${reason}` : ''}`);
    return club.balanceCard;
  },

  usedInviteCodes() {
    return new Set(this.playersByInviteCode.keys());
  },

  inviteCodeInUse(code) {
    if (!code) return false;
    for (const p of this.players.values()) {
      if (p.invitedBy === code) return true;
    }
    return false;
  },

  ensureInviteCode(player) {
    if (!player || player.bot) return '';
    for (const alias of player.inviteCodeAliases || []) this.playersByInviteCode.set(alias, player);
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
  },

  playerByInviteCode(code) {
    const key = String(code || '').trim().toUpperCase();
    if (!key) return null;
    return this.playersByInviteCode.get(key) || null;
  },

  bindInvite(player, code) {
    if (player.invitedBy) return { error: 1, what: '已经绑定过邀请码' };
    this.ensureInviteCode(player);
    const raw = String(code || '').trim().toUpperCase();
    if (!raw) return { error: 1, what: '请输入邀请码' };
    if (!/^[A-Z]{5}$/.test(raw)) return { error: 1, what: '邀请码无效' };
    if (raw === player.inviteCode || (player.inviteCodeAliases || []).includes(raw)) {
      return { error: 1, what: '不能绑定自己的邀请码' };
    }
    const inviter = this.playerByInviteCode(raw);
    if (!inviter || inviter.bot) return { error: 1, what: '邀请码不存在' };
    const bonus = this.economySettings.inviteBindBonus;
    if ((inviter.cardNum || 0) + bonus > 2147483647 || (player.cardNum || 0) + bonus > 2147483647) {
      return { error: 1, what: '房卡余额超出客户端支持范围' };
    }
    player.invitedBy = raw;
    this.changeCards(inviter.uid, bonus, '邀请新用户');
    this.changeCards(player.uid, bonus, '绑定邀请码');
    this.persist();
    return { error: 0, what: '' };
  },

  identityInfo(player) {
    return {
      realName: player && player.identityVerified ? player.identityNameInitial : '',
      idCard: player && player.identityVerified ? player.identityIdMasked : '',
      giveCard: 0,
    };
  },

  bindIdentity(player, input) {
    if (!player || player.bot) return { error: 1, what: '登录状态无效，请重新登录' };
    if (player.identityVerified) return { error: 1, what: '该账号已经完成实名认证' };
    if (!this.identityHashKey) return { error: 1, what: '实名认证服务尚未配置，请联系管理员' };
    const checked = validateIdentity(input, { today: new Date(this.now()) });
    if (checked.error) return { error: 1, what: checked.error };

    const idHash = identityDigest(this.identityHashKey, 'id-card', checked.idCard);
    const other = this.playersByIdentityHash.get(idHash);
    if (other && other.uid !== player.uid) return { error: 1, what: '该身份证已绑定其他账号' };

    player.identityVerified = true;
    player.identityNameInitial = checked.realName.slice(0, 1);
    player.identityNameHash = identityDigest(this.identityHashKey, 'real-name', checked.realName);
    player.identityIdHash = idHash;
    player.identityIdMasked = maskIdCard(checked.idCard);
    player.identityVerifiedAt = this.now();
    player.identityVerificationLevel = 'format';
    this.playersByIdentityHash.set(idHash, player);
    this.persist();
    console.log(`  实名认证 uid=${player.uid} 成功`);
    return { error: 0, what: '' };
  },

  loginWechat(profile, { appId = '', migrationTicket = '' } = {}) {
    const openid = String(profile && profile.openid || '');
    const unionid = String(profile && profile.unionid || '');
    const sourceAppId = String(appId || '').trim();
    if (!openid) throw new Error('微信身份缺少 openid');
    let match = null;
    for (const entry of this.players.entries()) {
      const player = entry[1];
      const unionids = new Set([player.wechatUnionid, ...(player.wechatUnionids || [])].filter(Boolean));
      const openids = new Set([player.wechatOpenid, ...(player.wechatOpenids || [])].filter(Boolean));
      const exactIdentity = (player.wechatIdentities || [])
        .some((identity) => identity.appId === sourceAppId && identity.openid === openid);
      if (exactIdentity || (unionid && unionids.has(unionid)) || openids.has(openid)) {
        match = entry;
        break;
      }
    }

    let token;
    let player;
    let migrated = false;
    const migrationPlayer = migrationTicket
      ? this.consumeWechatMigrationTicket(migrationTicket, sourceAppId) : null;
    if (migrationPlayer && match && match[1] !== migrationPlayer) {
      throw this.loginError('该微信身份已绑定其他账号，请联系管理员处理', 69);
    }
    if (migrationPlayer) {
      player = migrationPlayer;
      token = this.tokenForPlayer(player);
      if (!token) throw this.loginError('原账号已无法迁移', 68);
      migrated = !match;
    } else if (match) {
      [token, player] = match;
      if (player.disabled) throw new Error('账号已停用，请联系管理员');
    } else {
      token = `t_${crypto.randomBytes(24).toString('hex')}`;
      player = emptyPlayer(this.mintPlayerUid(), {
        createdAt: this.now(), cardNum: this.economySettings.newPlayerCards,
      });
      this.players.set(token, player);
      this.playersByUid.set(player.uid, player);
    }
    player.wechatOpenid = openid;
    player.wechatUnionid = unionid;
    player.wechatOpenids = [...new Set([...(player.wechatOpenids || []), openid].filter(Boolean))];
    player.wechatUnionids = [...new Set([...(player.wechatUnionids || []), unionid].filter(Boolean))];
    if (sourceAppId) {
      const identities = Array.isArray(player.wechatIdentities) ? player.wechatIdentities : [];
      const previous = identities.find((identity) => identity.appId === sourceAppId && identity.openid === openid);
      if (previous) previous.unionid = unionid || previous.unionid || '';
      else identities.push({ appId: sourceAppId, openid, unionid, linkedAt: this.now() });
      player.wechatIdentities = identities;
    }
    if (profile.nickname) player.nickname = String(profile.nickname).slice(0, 32);
    if (profile.avatarUrl) player.avatarUrl = String(profile.avatarUrl);
    else assignAvatarIfMissing(player);
    if (Number(profile.sex)) player.sex = Number(profile.sex);
    player.lastLoginAt = this.now();
    this.ensureInviteCode(player);
    this.persist();
    if (migrated) {
      try {
        this.onAccountMigration({
          uid: player.uid, appId: sourceAppId, linkedAt: this.now(),
          openidAliasCount: player.wechatOpenids.length,
          unionidAliasCount: player.wechatUnionids.length,
        });
      } catch (error) { console.error(`微信账号迁移审计失败 uid=${player.uid}`, error); }
    }
    return { token, player, migrated };
  },

  guestDeviceHash(deviceId) {
    const value = String(deviceId || '').trim();
    if (!/^[a-zA-Z0-9._:-]{8,128}$/.test(value)) return '';
    return crypto.createHash('sha256').update(`qjqp-guest-device\0${value}`).digest('hex');
  },

  loginGuest(deviceId, oldToken) {
    const deviceHash = this.guestDeviceHash(deviceId);
    const knownToken = deviceHash && this.playersByGuestDeviceHash.get(deviceHash);
    if (knownToken && this.players.has(knownToken)) {
      const player = this.players.get(knownToken);
      if (player.disabled) return { error: '账号已停用，请联系管理员' };
      player.lastLoginAt = this.now();
      assignAvatarIfMissing(player);
      this.persist();
      return { token: knownToken, player, created: false };
    }

    const previousToken = String(oldToken || '');
    const previousPlayer = this.playerForToken(previousToken);
    if (previousToken && previousPlayer) {
      const player = previousPlayer;
      if (player.disabled) return { error: '账号已停用，请联系管理员' };
      if (!deviceHash || !player.guestDeviceHash || player.guestDeviceHash === deviceHash) {
        player.lastLoginAt = this.now();
        assignAvatarIfMissing(player);
        if (deviceHash && !player.guestDeviceHash) {
          player.guestDeviceHash = deviceHash;
          this.playersByGuestDeviceHash.set(deviceHash, previousToken);
        }
        this.persist();
        return { token: previousToken, player, created: false };
      }
    }

    const uid = this.mintPlayerUid();
    const token = `t_${crypto.randomBytes(24).toString('hex')}`;
    const usedNames = new Set([...this.playersByUid.values()].map((item) => item.nickname).filter(Boolean));
    const player = emptyPlayer(uid, {
      nickname: mintGuestNickname(usedNames),
      guestDeviceHash: deviceHash,
      createdAt: this.now(),
      lastLoginAt: this.now(),
      cardNum: this.economySettings.newPlayerCards,
    });
    assignAvatarIfMissing(player);
    this.players.set(token, player);
    this.playersByUid.set(player.uid, player);
    if (deviceHash) this.playersByGuestDeviceHash.set(deviceHash, token);
    this.ensureInviteCode(player);
    this.persist();
    return { token, player, created: true };
  },

  http(pathname, query) {
    if (pathname === '/version') return { status: 200, body: versionBody() };
    if (pathname === '/v1/config' || pathname === '/n') return { status: 200, body: configBody() };
    if (pathname === '/login') {
      const accountType = String(query.get('accountType') || 'guest');
      const old = String(query.get('token') || '');
      if (accountType === 'wx') {
        return { status: 503, body: { err_code: 3, err_msg: '微信登录需要通过服务器授权接口' } };
      }
      if (accountType === 'token') {
        const player = old ? this.playerForToken(old) : null;
        if (player) {
          if (player.disabled) return { status: 200, body: { err_code: 66, err_msg: '账号已停用，请联系管理员' } };
          player.lastLoginAt = this.now();
          this.persist();
          return { status: 200, body: { err_code: 0, data: { token: this.tokenForPlayer(player) || old } } };
        }
        return { status: 200, body: { err_code: 65, err_msg: '登录时效已过期,请重新登录' } };
      }
      const login = this.loginGuest(query.get('deviceId'), old);
      if (login.error) return { status: 200, body: { err_code: 66, err_msg: login.error } };
      return { status: 200, body: { err_code: 0, data: { token: login.token } } };
    }
    return { status: 404, body: null };
  },
};
