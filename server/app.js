/**
 * 单进程大厅：玩家、房间号、桌子。
 */
const { pack, unpack, hasRes, protocol } = require('./net');
const crypto = require('crypto');
const { Table } = require('./table');
const rules = require('./rules');
const { ClubStore, MASTER, ADMIN, PLAYER, MAX_CLUB_CARDS } = require('./clubs');
const {
  num, maxStep, roomInfo, versionBody, configBody, emptyPlayer, INVITE_GIVE, INVITE_AMBIGUOUS, mintInviteCode,
} = require('./shared');
const { buildRecord, listFor, keepLatest } = require('./records');
const { findPlayback, mintPlaybackId } = require('./playback');
const { identityDigest, maskIdCard, validateIdentity } = require('./identity');
const { assignAvatarIfMissing } = require('./avatars');

const FIRST_PLAYER_UID = 285633;
const ROOM_ID_MIN = 100000;
const ROOM_ID_MAX = 1000000;
const BOT_UID_MIN = 800000000;
const BOT_UID_MAX = 900000000;

class GameApp {
  constructor({ persist, now, onRecord, allowUnregisteredTokens = false, identityHashKey } = {}) {
    this.persistFn = persist || (() => {});
    this.onRecord = onRecord || (() => {});
    this.nowFn = now || Date.now;
    this.allowUnregisteredTokens = !!allowUnregisteredTokens;
    this.identityHashKey = String(identityHashKey || process.env.QJQP_ID_HASH_KEY || '');
    this.players = new Map();
    this.playersByUid = new Map();
    this.playersByInviteCode = new Map();
    this.playersByIdentityHash = new Map();
    this.playersByGuestDeviceHash = new Map();
    this.tables = new Map();
    this.economySettings = { clubJoinBonus: 200, inviteBindBonus: INVITE_GIVE };
    this.botSettings = { enabled: process.env.QJQP_FILLBOTS !== '0' };
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

  notifyInbox(uid) {
    for (const conn of this.conns.values()) {
      if (conn.player && Number(conn.player.uid) === Number(uid)) {
        conn.send(pack(1003, { clubInfo: { name: '', code: '' }, inviterInfo: { name: '', code: '' } }));
      }
    }
  }

  noticeBody() {
    return { noticeInfo: [
      { id: 1, content: this.publicNotices.hallMarquee || '' },
      { id: 3, content: this.publicNotices.serviceWechat || '' },
      { id: 4, content: this.publicNotices.serviceQQ || '' },
    ] };
  }

  broadcastNotices() {
    const message = pack(1007, this.noticeBody());
    for (const conn of this.conns.values()) if (conn.player && !conn.player.disabled) conn.send(message);
  }

  messageForPlayer(message, player) {
    return message && player && message.expiresAt > this.now()
      && (!message.targetUid || Number(message.targetUid) === Number(player.uid));
  }

  createOperatorMessage({ title, content, targetUid = 0, days = 30 } = {}) {
    const cleanTitle = String(title || '').trim();
    const cleanContent = String(content || '').trim();
    const uid = Number(targetUid || 0);
    const lifetime = Number(days);
    if (!cleanTitle || cleanTitle.length > 32) return { error: '标题须为1至32个字' };
    if (!cleanContent || cleanContent.length > 300) return { error: '正文须为1至300个字' };
    if (!Number.isSafeInteger(uid) || uid < 0 || (uid && (!this.playerByUid(uid) || this.playerByUid(uid).bot))) {
      return { error: '收件玩家不存在' };
    }
    if (!Number.isInteger(lifetime) || lifetime < 1 || lifetime > 365) return { error: '有效天数须为1至365天' };
    if (this.nextOperatorMessageId > 4294967295) return { error: '消息编号已耗尽' };
    const message = {
      id: this.nextOperatorMessageId++, title: cleanTitle, content: cleanContent,
      targetUid: uid, createdAt: this.now(), expiresAt: this.now() + lifetime * 86400000,
    };
    this.operatorMessages.push(message);
    this.operatorMessages = this.operatorMessages.slice(-100);
    this.persist();
    const recipients = new Set([...this.conns.values()].filter((conn) => (
      conn.player && (!uid || Number(conn.player.uid) === uid)
    )).map((conn) => conn.player.uid));
    for (const recipientUid of recipients) this.notifyInbox(recipientUid);
    return { message };
  }

  deleteOperatorMessage(id) {
    const index = this.operatorMessages.findIndex((message) => Number(message.id) === Number(id));
    if (index < 0) return { error: '消息不存在' };
    const [message] = this.operatorMessages.splice(index, 1);
    this.persist();
    const recipients = new Set([...this.conns.values()].filter((conn) => (
      conn.player && (!message.targetUid || Number(conn.player.uid) === Number(message.targetUid))
    )).map((conn) => conn.player.uid));
    for (const recipientUid of recipients) this.notifyInbox(recipientUid);
    return { message };
  }

  markOperatorMessageRead(player, id) {
    const message = this.operatorMessages.find((item) => Number(item.id) === Number(id));
    if (!this.messageForPlayer(message, player)) return { error: '消息不存在或已过期' };
    if (!player.readMessageIds.includes(message.id)) {
      player.readMessageIds.push(message.id);
      player.readMessageIds = player.readMessageIds.slice(-100);
      this.persist();
    }
    return { message };
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

  clubCardBalance(clubId) {
    const club = this.clubStore.get(clubId);
    return club ? Number(club.balanceCard || 0) : null;
  }

  changeClubCards(clubId, delta, reason) {
    const club = this.clubStore.get(clubId);
    if (!club || !Number.isSafeInteger(delta)) return null;
    const before = Number(club.balanceCard || 0);
    if (!Number.isSafeInteger(before + delta) || before + delta < 0 || before + delta > MAX_CLUB_CARDS) return null;
    club.balanceCard = before + delta;
    console.log(`  俱乐部房卡 clubId=${club.id} ${delta > 0 ? '+' : ''}${delta} -> ${club.balanceCard}${reason ? ` ${reason}` : ''}`);
    return club.balanceCard;
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
    try { this.onRecord(rec); } catch (error) { console.error('牌局归档失败', error); }
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
    const bonus = this.economySettings.inviteBindBonus;
    if ((inviter.cardNum || 0) + bonus > 2147483647 || (player.cardNum || 0) + bonus > 2147483647) {
      return { error: 1, what: '房卡余额超出客户端支持范围' };
    }
    player.invitedBy = raw;
    this.changeCards(inviter.uid, bonus, '邀请新用户');
    this.changeCards(player.uid, bonus, '绑定邀请码');
    this.persist();
    return { error: 0, what: '' };
  }

  identityInfo(player) {
    return {
      realName: player && player.identityVerified ? player.identityNameInitial : '',
      idCard: player && player.identityVerified ? player.identityIdMasked : '',
      giveCard: 0,
    };
  }

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
  }

  loginWechat(profile) {
    const openid = String(profile && profile.openid || '');
    const unionid = String(profile && profile.unionid || '');
    if (!openid) throw new Error('微信身份缺少 openid');
    let match = null;
    for (const entry of this.players.entries()) {
      const player = entry[1];
      if ((unionid && player.wechatUnionid === unionid) || player.wechatOpenid === openid) {
        match = entry;
        break;
      }
    }

    let token;
    let player;
    if (match) {
      [token, player] = match;
      if (player.disabled) throw new Error('账号已停用，请联系管理员');
    } else {
      token = `t_${crypto.randomBytes(24).toString('hex')}`;
      player = emptyPlayer(this.mintPlayerUid(), { createdAt: this.now() });
      this.players.set(token, player);
      this.playersByUid.set(player.uid, player);
    }
    player.wechatOpenid = openid;
    player.wechatUnionid = unionid;
    if (profile.nickname) player.nickname = String(profile.nickname).slice(0, 32);
    if (profile.avatarUrl) player.avatarUrl = String(profile.avatarUrl);
    else assignAvatarIfMissing(player);
    if (Number(profile.sex)) player.sex = Number(profile.sex);
    player.lastLoginAt = this.now();
    this.ensureInviteCode(player);
    this.persist();
    return { token, player };
  }

  guestDeviceHash(deviceId) {
    const value = String(deviceId || '').trim();
    if (!/^[a-zA-Z0-9._:-]{8,128}$/.test(value)) return '';
    return crypto.createHash('sha256').update(`qjqp-guest-device\0${value}`).digest('hex');
  }

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
    if (previousToken && this.players.has(previousToken)) {
      const player = this.players.get(previousToken);
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
    const player = emptyPlayer(uid, { guestDeviceHash: deviceHash, createdAt: this.now(), lastLoginAt: this.now() });
    assignAvatarIfMissing(player);
    this.players.set(token, player);
    this.playersByUid.set(player.uid, player);
    if (deviceHash) this.playersByGuestDeviceHash.set(deviceHash, token);
    this.ensureInviteCode(player);
    this.persist();
    return { token, player, created: true };
  }

  fillBotsOn() {
    return this.botSettings.enabled;
  }

  forgetBot(uid) {
    const player = this.playerByUid(uid);
    if (!player || !player.bot) return;
    this.playersByUid.delete(player.uid);
    this.players.delete(`t_bot_${player.uid}`);
    this.uidRoom.delete(player.uid);
  }

  setBotsEnabled(enabled) {
    if (typeof enabled !== 'boolean') return { error: '机器人开关参数无效' };
    this.botSettings.enabled = enabled;
    let removed = 0;
    let filledRooms = 0;
    for (const table of this.tables.values()) {
      if (table.closed) continue;
      if (!enabled) removed += table.removeBots();
      else {
        const before = table.members.filter((member) => member.bot).length;
        this.maybeFillBots(table);
        if (table.members.filter((member) => member.bot).length > before) filledRooms++;
      }
    }
    this.persist();
    const playingBots = [...this.tables.values()].reduce((count, table) => count
      + (table.round ? table.members.filter((member) => member.bot).length : 0), 0);
    return { enabled, removed, filledRooms, playingBots };
  }

  mintBot(site, roomId) {
    let uid;
    do { uid = crypto.randomInt(BOT_UID_MIN, BOT_UID_MAX); }
    while (this.playersByUid.has(uid));
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
        avatarUrl: p.avatarUrl || '',
        readMessageIds: p.readMessageIds || [],
        createdAt: Number(p.createdAt || 0),
        lastLoginAt: Number(p.lastLoginAt || 0),
        disabled: !!p.disabled,
        wechatOpenid: p.wechatOpenid || '',
        wechatUnionid: p.wechatUnionid || '',
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
        invitedBy: p.invitedBy || '',
        bot: !!p.bot,
      })),
      rooms: [...this.tables.values()].filter((t) => !t.closed).map((t) => t.dump()),
      records: this.records,
      operatorMessages: this.operatorMessages,
      nextOperatorMessageId: this.nextOperatorMessageId,
      publicNotices: this.publicNotices,
      economySettings: this.economySettings,
      botSettings: this.botSettings,
      playbackSeq: this.playbackSeq || 0,
      clubs: this.clubStore.dump(),
    };
  }

  restore(data) {
    if (!data) return;
    this.players.clear();
    this.playersByUid.clear();
    this.playersByInviteCode.clear();
    this.playersByIdentityHash.clear();
    this.playersByGuestDeviceHash.clear();
    this.nextUid = Math.max(FIRST_PLAYER_UID, Number(data.nextUid) || 0);
    this.nextRoomId = data.nextRoomId || 100000;
    this.records = Array.isArray(data.records) ? data.records : [];
    this.operatorMessages = Array.isArray(data.operatorMessages) ? data.operatorMessages.filter((message) => (
      message && Number.isSafeInteger(Number(message.id)) && Number(message.id) >= 1000000000
    )).slice(-100) : [];
    this.nextOperatorMessageId = Math.max(
      1000000000,
      Number(data.nextOperatorMessageId) || 0,
      ...this.operatorMessages.map((message) => Number(message.id) + 1),
    );
    const notices = data.publicNotices && typeof data.publicNotices === 'object' ? data.publicNotices : {};
    this.publicNotices = {
      hallMarquee: String(notices.hallMarquee || ''),
      serviceWechat: String(notices.serviceWechat || ''),
      serviceQQ: String(notices.serviceQQ || ''),
    };
    const economy = data.economySettings && typeof data.economySettings === 'object' ? data.economySettings : {};
    this.economySettings = {
      clubJoinBonus: Number.isSafeInteger(economy.clubJoinBonus) && economy.clubJoinBonus >= 0
        ? economy.clubJoinBonus : 200,
      inviteBindBonus: Number.isSafeInteger(economy.inviteBindBonus) && economy.inviteBindBonus >= 0
        ? economy.inviteBindBonus : INVITE_GIVE,
    };
    const botSettings = data.botSettings && typeof data.botSettings === 'object' ? data.botSettings : {};
    this.botSettings = { enabled: typeof botSettings.enabled === 'boolean'
      ? botSettings.enabled : process.env.QJQP_FILLBOTS !== '0' };
    this.playbackSeq = data.playbackSeq || 0;
    this.clubStore.restore(data.clubs);
    const byUid = new Map();
    let missingAvatars = 0;
    for (const p of data.players || []) {
      const player = emptyPlayer(p.uid, p);
      if (assignAvatarIfMissing(player)) missingAvatars++;
      this.players.set(p.token, player);
      this.playersByUid.set(player.uid, player);
      if (!player.bot && player.uid >= this.nextUid) this.nextUid = player.uid + 1;
      if (player.inviteCode && !player.bot) this.playersByInviteCode.set(player.inviteCode, player);
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
    for (const table of [...this.tables.values()]) {
      // 重启后真人均为离线；已完成的牌局无需继续占着房号。
      if (!table.round && table.step >= maxStep(table)) table.dissolve();
      else table.rearmTimers();
    }
    let staleLinks = 0;
    for (const player of this.playersByUid.values()) {
      if (player.roomId && !this.uidRoom.has(player.uid)) {
        player.roomId = 0;
        staleLinks += 1;
      }
    }
    if (staleLinks || missingAvatars) this.persist();
    if (missingAvatars) console.log(`已为 ${missingAvatars} 位无头像玩家分配默认头像`);
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
      botsEnabled: () => app.fillBotsOn(),
      forgetBot: (uid) => app.forgetBot(uid),
    };
  }

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
  }

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
  }

  clubRoomInfo(table) {
    const seats = table.seats();
    const host = this.playerByUid(table.hostUid) || {};
    return {
      id: table.roomId,
      status: table.round ? 1 : 0,
      owner: { avatarUrl: host.avatarUrl || '', code: String(table.hostUid), nickname: host.nickname || `玩家${table.hostUid}` },
      gameType: table.gameType,
      num: table.num,
      param1: table.param1,
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
  }

  clubRoomError(clubId, uid) {
    if (!clubId) return null;
    const club = this.clubStore.get(clubId);
    const member = club && this.clubStore.member(club, uid);
    if (!club || !member) return '不是俱乐部成员';
    if (member.freeze) return '你已被俱乐部冻结';
    if (club.settings.closed) return '俱乐部已关闭';
    return null;
  }

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
        config: rules.parseConfig(scheme.param1, scheme.param2),
      }, this.tableHost(roomId));
      this.tables.set(roomId, table);
      changed = true;
    }
    return changed;
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
        avatarUrl: player.avatarUrl || '', nickname: player.nickname || `玩家${member.uid}`, code: String(member.uid),
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
      if (accountType === 'wx') {
        return { status: 503, body: { err_code: 3, err_msg: '微信登录需要通过服务器授权接口' } };
      }
      if (accountType === 'token') {
        if (old && this.players.has(old)) {
          const player = this.players.get(old);
          if (player.disabled) return { status: 200, body: { err_code: 66, err_msg: '账号已停用，请联系管理员' } };
          player.lastLoginAt = this.now();
          this.persist();
          return { status: 200, body: { err_code: 0, data: { token: old } } };
        }
        return { status: 200, body: { err_code: 65, err_msg: '登录时效已过期,请重新登录' } };
      }
      const login = this.loginGuest(query.get('deviceId'), old);
      if (login.error) return { status: 200, body: { err_code: 66, err_msg: login.error } };
      return { status: 200, body: { err_code: 0, data: { token: login.token } } };
    }
    return { status: 404, body: null };
  }

  attach(connId, send, close) {
    this.conns.set(connId, { send, close, player: null, roomId: 0 });
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
        const uid = this.mintPlayerUid();
        const newbie = emptyPlayer(uid);
        assignAvatarIfMissing(newbie);
        this.players.set(msg.token, newbie);
        this.playersByUid.set(newbie.uid, newbie);
        this.ensureInviteCode(newbie);
      }
      c.player = this.players.get(msg.token);
      if (c.player.disabled) {
        c.player = null;
        return c.send(pack(100, { res: { error: 66, what: '账号已停用，请联系管理员' } }));
      }
      c.player.lastLoginAt = this.now();
      this.persist();
      if (assignAvatarIfMissing(c.player)) this.persist();
      this.ensureInviteCode(c.player);
      const roomId = this.uidRoom.get(c.player.uid) || 0;
      c.roomId = roomId;
      console.log(`  100 登录 uid=${c.player.uid}`);
      c.send(pack(100, {
        res: { error: 0, what: '' },
        uid: c.player.uid,
        nickname: c.player.nickname,
        avatarUrl: c.player.avatarUrl || '',
        sex: c.player.sex,
        roomId,
        cardNum: c.player.cardNum,
        ip: '127.0.0.1',
      }));
      if (Object.values(this.publicNotices).some(Boolean)) c.send(pack(1007, this.noticeBody()));
      return;
    }

    if (proto === 99) return c.send(pack(99, { time: this.now() }));

    if (proto === 105) {
      return c.send(pack(105, { res: { error: 0, what: '' }, mobile: '13800000000', giveCard: 0 }));
    }

    if (!c.player) return;
    if (c.player.disabled) return;

    if (proto === 101) {
      return c.send(pack(101, { res: { error: 0, what: '' }, ...this.identityInfo(c.player) }));
    }

    if (proto === 102) {
      return c.send(pack(102, { res: this.bindIdentity(c.player, msg) }));
    }

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
        avatarUrl: owner.avatarUrl || '', nickname: owner.nickname || `玩家${owner.uid}`, code: String(owner.uid),
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
        avatarUrl: (this.playerByUid(invite.fromUid) || {}).avatarUrl || '',
        inviter: (this.playerByUid(invite.fromUid) || {}).nickname || `玩家${invite.fromUid}`,
        name: club.name,
        policy: 0,
      }));
      const messages = this.operatorMessages.filter((message) => this.messageForPlayer(message, c.player)).map((message) => ({
        id: message.id,
        avatarUrl: '',
        inviter: message.title,
        name: message.content,
        policy: c.player.readMessageIds.includes(message.id) ? 2 : 1,
      }));
      const inbox = [...invites, ...messages];
      return c.send(pack(118, { res: { error: 0, what: '' }, invites: inbox, count: inbox.length, total: inbox.length }));
    }

    if (proto === 119 || proto === 120) {
      if (proto === 120 && num(msg && msg.id) >= 1000000000) {
        const marked = this.markOperatorMessageRead(c.player, num(msg && msg.id));
        return c.send(pack(120, { res: { error: marked.error ? 1 : 0, what: marked.error || '' } }));
      }
      const ret = proto === 119
        ? this.clubStore.acceptInvite(c.player.uid, num(msg && msg.id))
        : this.clubStore.ignoreInvite(c.player.uid, num(msg && msg.id));
      if (ret.error) return c.send(pack(proto, { res: { error: 1, what: ret.error } }));
      this.persist();
      if (proto === 119) this.notifyInbox(c.player.uid);
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    }

    if (proto === 143) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(143, { res: { error: 1, what: '没有邀请权限' }, data: [] }));
      }
      const pending = new Set(club.invites.map((invite) => Number(invite.toUid)));
      const data = [...this.playersByUid.values()].filter((player) => (
        !player.bot && player.uid !== c.player.uid && !this.clubStore.member(club, player.uid) && !pending.has(player.uid)
      )).slice(0, 500).map((player) => ({
        userId: player.uid, avatarUrl: player.avatarUrl || '', nickname: player.nickname,
        code: String(player.uid),
      }));
      return c.send(pack(143, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
    }

    if (proto === 144) {
      const ids = Array.isArray(msg && msg.userId) ? msg.userId.map(num) : [];
      if (ids.some((uid) => !this.playerByUid(uid) || this.playerByUid(uid).bot)) {
        return c.send(pack(144, { res: { error: 1, what: '所选玩家不存在' } }));
      }
      const result = this.clubStore.addInvites(c.player.uid, num(msg && msg.clubId), ids);
      if (result.error) return c.send(pack(144, { res: { error: 1, what: result.error } }));
      this.persist();
      for (const uid of ids) this.notifyInbox(uid);
      return c.send(pack(144, { res: { error: 0, what: '' } }));
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
      if (this.ensureClubSchemeTables(club)) this.persist();
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

    if (proto === 157) {
      const table = this.tables.get(num(msg && msg.id));
      const club = table && this.clubStore.get(table.clubId);
      if (!table || table.closed || !club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(157, { res: { error: 1, what: '没有踢人权限' } }));
      }
      const targetUid = Number(String(msg && msg.userCode || '').trim());
      if (!Number.isSafeInteger(targetUid) || targetUid <= 0) {
        return c.send(pack(157, { res: { error: 1, what: '玩家编号无效' } }));
      }
      if (targetUid === c.player.uid) {
        return c.send(pack(157, { res: { error: 1, what: '不能踢出自己' } }));
      }
      const result = table.kickMember(targetUid);
      return c.send(pack(157, { res: { error: result.error ? 1 : 0, what: result.error || '' } }));
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

    if ([142, 146, 163, 164, 166].includes(proto)) {
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
        giveCard: this.economySettings.inviteBindBonus,
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
      const records = listFor(this.records, c.player.uid, num(msg && msg.time)).map((record) => ({
        ...record,
        players: (record.players || []).map((entry) => ({
          ...entry,
          avatarUrl: (this.playerByUid(entry.uid) || {}).avatarUrl || entry.avatarUrl || '',
        })),
      }));
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
        return { id: a.id, avatarUrl: player.avatarUrl || '', nickname: player.nickname || `玩家${a.uid}`, code: String(a.uid), sex: player.sex || 1, policy: 0 };
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
        info: { id: target.uid, avatarUrl: target.avatarUrl || '', code: String(target.uid), nickname: target.nickname },
        member: !!this.clubStore.member(club, target.uid),
      }));
    }

    if (proto === 141) {
      const targetUid = num(msg && msg.userId);
      const target = this.playerByUid(targetUid);
      if (!target || target.bot) return c.send(pack(141, { res: { error: 1, what: '玩家不存在' } }));
      const ret = this.clubStore.addInvite(c.player.uid, num(msg && msg.clubId), targetUid);
      if (ret.error) return c.send(pack(141, { res: { error: 1, what: ret.error } }));
      this.persist();
      this.notifyInbox(targetUid);
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
        if (scheme) {
          Object.assign(scheme, { name: String(msg.name || ''), gameType: num(msg.gameType), num: num(msg.num), param1: num(msg.param1), param2: num(msg.param2), color: String(msg.color || '') });
          for (const table of this.tables.values()) {
            if (table.closed || table.clubId !== club.id || Number(table.schemeId) !== Number(scheme.id)
              || table.members.length || table.round || table.step) continue;
            table.gameType = scheme.gameType;
            table.num = scheme.num;
            table.param1 = scheme.param1;
            table.param2 = scheme.param2;
            table.config = rules.parseConfig(scheme.param1, scheme.param2);
          }
          if (scheme.auto) this.ensureClubSchemeTables(club);
        }
      } else if (proto === 151) {
        const scheme = club.schemes.find((item) => item.id === num(msg.id));
        if (scheme) {
          const enabled = !!msg.status;
          const active = [...this.tables.values()].find((table) => (
            !table.closed && table.clubId === club.id && Number(table.schemeId) === Number(scheme.id)
          ));
          if (!enabled && active && (active.round || active.members.length)) {
            return c.send(pack(proto, { res: { error: 1, what: '该玩法已有进行中的桌子' } }));
          }
          scheme.auto = enabled;
          if (enabled) this.ensureClubSchemeTables(club);
          else if (active) active.dissolve();
        }
      } else {
        const active = [...this.tables.values()].find((table) => (
          !table.closed && table.clubId === club.id && Number(table.schemeId) === num(msg.id)
        ));
        if (active && (active.round || active.members.length)) {
          return c.send(pack(proto, { res: { error: 1, what: '该玩法已有进行中的桌子' } }));
        }
        if (active) active.dissolve();
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
      const existingRoomId = this.activeRoomForRequest(c);
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
      const clubError = this.clubRoomError(clubId, c.player.uid);
      if (clubError) return c.send(pack(201, { res: { error: 1, what: clubError } }));
      const cost = rules.roomCardCost({ num: roomNum, 人数: config.人数, 房费: config.房费 });
      if (clubId && this.clubCardBalance(clubId) < (cost.host || cost.each * config.人数)) {
        return c.send(pack(201, { res: { error: 1, what: '俱乐部房卡不足' } }));
      }
      if (!clubId && cost.host > 0 && (c.player.cardNum || 0) < cost.host) {
        return c.send(pack(201, { res: { error: 1, what: '房卡不足' } }));
      }
      if (!clubId && cost.each > 0 && (c.player.cardNum || 0) < cost.each) {
        return c.send(pack(201, { res: { error: 1, what: '房卡不足' } }));
      }
      const roomId = this.mintRoomId();
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
      const existingRoomId = this.activeRoomForRequest(c, roomId);
      if (existingRoomId && existingRoomId !== roomId) {
        return c.send(pack(202, { res: { error: 1, what: '已经在其他房间里' } }));
      }
      const table = this.tables.get(roomId);
      if (!table || table.closed) {
        console.log(`  202 进房 ${roomId} 不存在`);
        return c.send(pack(202, { res: { error: 1, what: '房间不存在' } }));
      }
      // 入座、观战和重连都按当前权限检查，已有座位不能绕过冻结或移除。
      const clubError = this.clubRoomError(table.clubId, c.player.uid);
      if (clubError) return c.send(pack(202, { res: { error: 1, what: clubError } }));
      const seated = table.members.find((m) => m.player.uid === c.player.uid);
      const cost = rules.roomCardCost({
        num: table.num,
        人数: table.config.人数,
        房费: table.config.房费,
      });
      // AA 等要自己付钱的，坐下前先看够不够；观战不扣、房主支付也不查入座的人
      const willSit = seated ? !seated.view : table.canSit();
      if (!table.clubId && !seated && willSit && cost.each > 0 && (c.player.cardNum || 0) < cost.each) {
        return c.send(pack(202, { res: { error: 1, what: '房卡不足' } }));
      }
      const joined = table.join(c.player, connId);
      if (joined.error) return c.send(pack(202, { res: { error: 1, what: joined.error } }));
      this.maybeFillBots(table);
      if (table.clubId && table.schemeId) {
        const club = this.clubStore.get(table.clubId);
        if (club && this.ensureClubSchemeTables(club)) this.persist();
      }
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
      if (msghead === 'chatroom') {
        let kind = 'chat';
        try {
          const raw = typeof body.chat === 'string' ? JSON.parse(body.chat) : body.chat;
          kind = `type=${raw && raw.type} len=${raw && raw.content != null ? String(raw.content).length : 0}`;
        } catch { /* */ }
        console.log(`  200 房内消息 chatroom [${kind}]`);
      } else {
        console.log(`  200 房内消息 ${msghead} ${msgdata || ''}`);
      }
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
