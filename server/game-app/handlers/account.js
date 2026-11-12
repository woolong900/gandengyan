/**
 * WebSocket 协议处理：个人信息：实名、邀请码、代理、商城。
 * 每项从原 GameApp.onMessage 的 if 分支原样迁出；handle 以 GameApp 实例为 this 调用。
 * order 为原分支顺序，同一协议号命中多项时按 order 依次执行；返回 FALLTHROUGH 表示继续下一项。
 */
const {
  defaultInvitePageText, pack,
} = require('../common');

module.exports = [
  {
    order: 3, protos: [101],
    handle(c, msg, proto, connId) {
      return c.send(pack(101, { res: { error: 0, what: '' }, ...this.identityInfo(c.player) }));
    },
  },
  {
    order: 4, protos: [102],
    handle(c, msg, proto, connId) {
      return c.send(pack(102, { res: this.bindIdentity(c.player, msg) }));
    },
  },
  {
    order: 5, protos: [108],
    handle(c, msg, proto, connId) {
      const result = this.submitAgentApplication(c.player, msg && msg.content);
      return c.send(pack(108, { res: { error: result.error ? 1 : 0, what: result.error || '' } }));
    },
  },
  {
    order: 29, protos: [103],
    handle(c, msg, proto, connId) {
      const mine = this.ensureInviteCode(c.player);
      return c.send(pack(103, {
        res: { error: 0, what: '' },
        username: mine,
        inviteCode: c.player.invitedBy || '',
        mobile: this.economySettings.invitePageText || defaultInvitePageText(this.economySettings.inviteBindBonus),
        giveCard: this.economySettings.inviteBindBonus,
      }));
    },
  },
  {
    order: 30, protos: [104],
    handle(c, msg, proto, connId) {
      return c.send(pack(104, { res: this.bindInvite(c.player, msg && msg.inviteCode) }));
    },
  },
  {
    order: 31, protos: [112],
    handle(c, msg, proto, connId) {
      return c.send(pack(112, { res: { error: 1, what: '暂未开放充值' }, goods: [] }));
    },
  },
  {
    order: 32, protos: [153],
    handle(c, msg, proto, connId) {
      return c.send(pack(153, {
        res: { error: 0, what: '' },
        username: '测试代理',
        code: 'QJQP',
        balanceCard: 999999,
      }));
    },
  },
];
