/**
 * WebSocket 协议处理：连接登录与心跳（无需已登录）。
 * 每项从原 GameApp.onMessage 的 if 分支原样迁出；handle 以 GameApp 实例为 this 调用。
 * order 为原分支顺序，同一协议号命中多项时按 order 依次执行；返回 FALLTHROUGH 表示继续下一项。
 */
const {
  assignAvatarIfMissing, emptyPlayer, pack,
} = require('../common');

module.exports = [
  {
    order: 0, protos: [100], auth: false,
    handle(c, msg, proto, connId) {
      if (!msg || !msg.token) {
        return c.send(pack(100, { res: { error: 1, what: '登录参数无效' } }));
      }
      let loginPlayer = this.playerForToken(msg.token);
      if (!loginPlayer) {
        if (!this.allowUnregisteredTokens) {
          return c.send(pack(100, {
            res: { error: 65, what: '登录凭证无效，请重新登录' },
          }));
        }
        const uid = this.mintPlayerUid();
        const newbie = emptyPlayer(uid, { cardNum: this.economySettings.newPlayerCards });
        assignAvatarIfMissing(newbie);
        this.players.set(msg.token, newbie);
        this.playersByUid.set(newbie.uid, newbie);
        this.ensureInviteCode(newbie);
        loginPlayer = newbie;
      }
      c.player = loginPlayer;
      if (c.platformForUid) {
        const resolved = c.platformForUid(c.player.uid);
        c.platform = ['android', 'ios'].includes(resolved) ? resolved : 'unknown';
      }
      if (c.player.disabled) {
        c.player = null;
        return c.send(pack(100, { res: { error: 66, what: '账号已停用，请联系管理员' } }));
      }
      // 只保留最后一条已登录连接。先标记失效，再关闭 socket，
      // 即使底层 close 回调延迟，旧连接也无法再操作房间。
      for (const [otherId, other] of this.conns) {
        if (otherId === connId || !other.player
            || Number(other.player.uid) !== Number(c.player.uid)) continue;
        other.superseded = true;
        if (typeof other.close === 'function') other.close(4003, '账号已在其他设备登录');
      }
      c.superseded = false;
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
    },
  },
  {
    order: 1, protos: [99], auth: false,
    handle(c, msg, proto, connId) {
      return c.send(pack(99, { time: this.now() }));
    },
  },
  {
    order: 2, protos: [105], auth: false,
    handle(c, msg, proto, connId) {
      return c.send(pack(105, { res: { error: 0, what: '' }, mobile: '13800000000', giveCard: 0 }));
    },
  },
];
