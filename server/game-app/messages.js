/**
 * GameApp：公告、客服会话、运营消息、代理申请与俱乐部申请消息。
 * 方法从 app.js 原样迁出，通过 mixin 挂到 GameApp.prototype，this 即 GameApp 实例。
 */
const {
  ADMIN, CLUB_APPLICATION_MESSAGE_ID_BASE, SUPPORT_MAX_CONVERSATIONS, SUPPORT_MAX_MESSAGES, UINT32_MAX,
  cleanSupportText, pack, push,
} = require('./common');

module.exports = {
  notifyInbox(uid) {
    for (const conn of this.conns.values()) {
      if (conn.player && Number(conn.player.uid) === Number(uid)) {
        conn.send(pack(1003, { clubInfo: { name: '', code: '' }, inviterInfo: { name: '', code: '' } }));
      }
    }
  },

  noticeBody() {
    return { noticeInfo: [
      { id: 1, content: this.publicNotices.hallMarquee || '' },
      { id: 3, content: this.publicNotices.serviceWechat || '' },
      { id: 4, content: this.publicNotices.serviceQQ || '' },
    ] };
  },

  broadcastNotices() {
    const message = pack(1007, this.noticeBody());
    for (const conn of this.conns.values()) if (conn.player && !conn.player.disabled) conn.send(message);
  },

  supportOnline() {
    const hour = (new Date(this.now()).getUTCHours() + 8) % 24;
    return hour >= 9 && hour < 22;
  },

  supportSnapshot(conversation) {
    return {
      uid: conversation.uid,
      nickname: conversation.nickname || `玩家${conversation.uid}`,
      updatedAt: conversation.updatedAt || 0,
      adminUnread: conversation.adminUnread || 0,
      playerUnread: conversation.playerUnread || 0,
      closed: !!conversation.closed,
      online: [...this.conns.values()].some((conn) => conn.player
        && Number(conn.player.uid) === Number(conversation.uid) && !conn.superseded),
      messages: (conversation.messages || []).slice(-SUPPORT_MAX_MESSAGES),
    };
  },

  supportPayload(player, markRead = false) {
    const uid = Number(player.uid);
    let conversation = this.supportConversations.get(uid);
    if (!conversation) {
      conversation = {
        uid, nickname: player.nickname || `玩家${uid}`, updatedAt: this.now(),
        adminUnread: 0, playerUnread: 0, closed: false, messages: [],
      };
      this.supportConversations.set(uid, conversation);
    }
    conversation.nickname = player.nickname || conversation.nickname;
    if (markRead && conversation.playerUnread) {
      conversation.playerUnread = 0;
      this.persist();
    }
    return {
      conversation: this.supportSnapshot(conversation),
      serviceOnline: this.supportOnline(),
      serviceHours: '09:00–22:00',
      serviceWechat: this.publicNotices.serviceWechat || '',
      serviceQQ: this.publicNotices.serviceQQ || '',
    };
  },

  pushSupport(uid, msghead, data) {
    const message = push(msghead, data);
    for (const conn of this.conns.values()) {
      if (conn.player && Number(conn.player.uid) === Number(uid) && !conn.superseded) conn.send(message);
    }
  },

  checkSupportRate(uid) {
    const now = this.now();
    const recent = (this.supportRate.get(uid) || []).filter((at) => now - at < 10 * 60 * 1000);
    if (recent.length && now - recent[recent.length - 1] < 800) return '发送太快，请稍后再试';
    if (recent.length >= 20) return '消息过于频繁，请10分钟后再试';
    recent.push(now);
    this.supportRate.set(uid, recent);
    return '';
  },

  sendSupportMessage(player, content, context = {}) {
    const text = cleanSupportText(content);
    if (!text || text.length > 200) return { error: '请输入1至200个字的反馈内容' };
    const rateError = this.checkSupportRate(player.uid);
    if (rateError) return { error: rateError };
    const payload = this.supportPayload(player, false);
    const conversation = this.supportConversations.get(Number(player.uid));
    const message = {
      id: this.nextSupportMessageId++, from: 'player', content: text, createdAt: this.now(),
      context: {
        roomId: Number(context.roomId) || 0,
        gameType: Number(context.gameType) || 0,
        step: Number(context.step) || 0,
        clientVersion: String(context.clientVersion || '').slice(0, 32),
      },
    };
    conversation.messages.push(message);
    conversation.messages = conversation.messages.slice(-SUPPORT_MAX_MESSAGES);
    conversation.updatedAt = message.createdAt;
    conversation.adminUnread = Math.min(999, Number(conversation.adminUnread || 0) + 1);
    conversation.closed = false;
    this.trimSupportConversations();
    this.persist();
    const result = { ...payload, conversation: this.supportSnapshot(conversation), message };
    this.pushSupport(player.uid, 'support_message', result);
    return result;
  },

  trimSupportConversations() {
    if (this.supportConversations.size <= SUPPORT_MAX_CONVERSATIONS) return;
    const old = [...this.supportConversations.values()]
      .sort((a, b) => Number(a.updatedAt || 0) - Number(b.updatedAt || 0));
    for (let i = 0; i < old.length - SUPPORT_MAX_CONVERSATIONS; i++) {
      this.supportConversations.delete(Number(old[i].uid));
    }
  },

  listSupportConversations({ q = '' } = {}) {
    const term = String(q || '').trim().toLowerCase().slice(0, 64);
    const items = [...this.supportConversations.values()]
      .filter((conversation) => !term || String(conversation.uid).includes(term)
        || String(conversation.nickname || '').toLowerCase().includes(term)
        || (conversation.messages || []).some((message) => String(message.content || '').toLowerCase().includes(term)))
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
      .map((conversation) => {
        const snapshot = this.supportSnapshot(conversation);
        const lastMessage = snapshot.messages[snapshot.messages.length - 1] || null;
        return { ...snapshot, messages: undefined, lastMessage, messageCount: snapshot.messages.length };
      });
    return { items, total: items.length, unread: items.reduce((sum, item) => sum + item.adminUnread, 0) };
  },

  supportConversation(uid, markRead = false) {
    const conversation = this.supportConversations.get(Number(uid));
    if (!conversation) return { error: '客服会话不存在', status: 404 };
    if (markRead && conversation.adminUnread) {
      conversation.adminUnread = 0;
      this.persist();
    }
    return { conversation: this.supportSnapshot(conversation), serviceOnline: this.supportOnline() };
  },

  replySupportMessage(uid, content, actor = '管理员') {
    const conversation = this.supportConversations.get(Number(uid));
    if (!conversation) return { error: '客服会话不存在', status: 404 };
    const text = cleanSupportText(content);
    if (!text || text.length > 500) return { error: '请输入1至500个字的回复内容' };
    const message = {
      id: this.nextSupportMessageId++, from: 'admin', content: text,
      createdAt: this.now(), actor: String(actor || '管理员').slice(0, 64),
    };
    conversation.messages.push(message);
    conversation.messages = conversation.messages.slice(-SUPPORT_MAX_MESSAGES);
    conversation.updatedAt = message.createdAt;
    conversation.adminUnread = 0;
    conversation.playerUnread = Math.min(999, Number(conversation.playerUnread || 0) + 1);
    conversation.closed = false;
    this.persist();
    const result = { conversation: this.supportSnapshot(conversation), message,
      serviceOnline: this.supportOnline() };
    this.pushSupport(uid, 'support_message', result);
    return result;
  },

  closeSupportConversation(uid, closed = true) {
    const conversation = this.supportConversations.get(Number(uid));
    if (!conversation) return { error: '客服会话不存在', status: 404 };
    conversation.closed = !!closed;
    conversation.adminUnread = 0;
    conversation.updatedAt = this.now();
    this.persist();
    return { conversation: this.supportSnapshot(conversation) };
  },

  messageForPlayer(message, player) {
    return message && player && message.expiresAt > this.now()
      && (!message.targetUid || Number(message.targetUid) === Number(player.uid));
  },

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
    if (this.nextOperatorMessageId >= CLUB_APPLICATION_MESSAGE_ID_BASE) return { error: '消息编号已耗尽' };
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
  },

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
  },

  submitAgentApplication(player, input) {
    const raw = String(input || '').trim();
    if (!raw || raw.length > 32 || /[\r\n\u0000-\u001f\u007f]/.test(raw)) {
      return { error: '请输入正确的手机号或微信号' };
    }
    let contact = raw;
    let contactType = '微信号';
    let phone = raw.replace(/[\s-]/g, '');
    if (phone.startsWith('+86')) phone = phone.slice(3);
    else if (phone.startsWith('86') && phone.length === 13) phone = phone.slice(2);
    if (/^1[3-9]\d{9}$/.test(phone)) {
      contact = phone;
      contactType = '手机号';
    } else if (/^[+\d\s-]+$/.test(raw) || raw.length < 2
      || !/^[\p{L}\p{N}_.-]+$/u.test(raw)) {
      return { error: '请输入正确的手机号或微信号' };
    }
    try {
      const application = this.onAgentApplication({
        uid: player.uid,
        nickname: player.nickname || `玩家${player.uid}`,
        contact,
        contactType,
        createdAt: this.now(),
      });
      console.log(`  108 合伙人申请 uid=${player.uid} 类型=${contactType} id=${application.id}`);
      return { application };
    } catch (error) {
      console.error(`保存合伙人申请失败 uid=${player.uid}`, error);
      return { error: '提交失败，请稍后重试' };
    }
  },

  markOperatorMessageRead(player, id) {
    const message = this.operatorMessages.find((item) => Number(item.id) === Number(id));
    if (!this.messageForPlayer(message, player)) return { error: '消息不存在或已过期' };
    if (!player.readMessageIds.includes(message.id)) {
      player.readMessageIds.push(message.id);
      player.readMessageIds = player.readMessageIds.slice(-100);
      this.persist();
    }
    return { message };
  },

  clubApplicationMessages(player) {
    const result = [];
    for (const club of this.clubStore.listFor(player.uid)) {
      if (!this.clubStore.isAdmin(club, player.uid)) continue;
      for (const application of club.applications) {
        const id = CLUB_APPLICATION_MESSAGE_ID_BASE + Number(application.id);
        if (!Number.isSafeInteger(id) || id > UINT32_MAX) continue;
        const applicant = this.playerByUid(application.uid) || {};
        const nickname = applicant.nickname || `玩家${application.uid}`;
        result.push({
          id,
          avatarUrl: applicant.avatarUrl || '',
          inviter: '俱乐部申请',
          name: `${nickname}（ID：${application.uid}）申请加入【${club.name}】，请到成员管理的申请列表处理。`,
          policy: player.readMessageIds.includes(id) ? 2 : 1,
        });
      }
    }
    return result;
  },

  markClubApplicationMessageRead(player, id) {
    const applicationId = Number(id) - CLUB_APPLICATION_MESSAGE_ID_BASE;
    const found = this.clubStore.findApplication(applicationId);
    if (!found || !this.clubStore.isAdmin(found.club, player.uid)) return { error: '申请不存在或已处理' };
    if (!player.readMessageIds.includes(id)) {
      player.readMessageIds.push(id);
      player.readMessageIds = player.readMessageIds.slice(-100);
      this.persist();
    }
    return { application: found.application };
  },

  notifyClubAdmins(club) {
    for (const member of club.members) {
      if (Number(member.role) >= ADMIN) this.notifyInbox(member.uid);
    }
  },
};
