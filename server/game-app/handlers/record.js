/**
 * WebSocket 协议处理：战绩与回放。
 * 每项从原 GameApp.onMessage 的 if 分支原样迁出；handle 以 GameApp 实例为 this 调用。
 * order 为原分支顺序，同一协议号命中多项时按 order 依次执行；返回 FALLTHROUGH 表示继续下一项。
 */
const {
  findPlayback, listFor, num, pack,
} = require('../common');

module.exports = [
  {
    order: 33, protos: [125],
    handle(c, msg, proto, connId) {
      const type = num(msg && msg.type);
      if (type === 1) {
        const club = this.clubStore.get(num(msg && msg.clubId));
        if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
          console.log(`  125 俱乐部战绩拒绝 uid=${c.player.uid} clubId=${num(msg && msg.clubId)}`);
          return c.send(pack(125, { res: { error: 1, what: '没有管理权限' }, records: [] }));
        }
        const records = this.clubRecordList(club.id, msg).map((record) => ({
          ...record,
          players: (record.players || []).map((entry) => ({
            ...entry,
            avatarUrl: (this.playerByUid(entry.uid) || {}).avatarUrl || entry.avatarUrl || '',
          })),
        }));
        console.log(`  125 俱乐部战绩 uid=${c.player.uid} clubId=${club.id} date=${num(msg && msg.time)} count=${records.length}`);
        return c.send(pack(125, { res: { error: 0, what: '' }, records }));
      }
      const records = listFor(this.records, c.player.uid, num(msg && msg.time)).map((record) => ({
        ...record,
        players: (record.players || []).map((entry) => ({
          ...entry,
          avatarUrl: (this.playerByUid(entry.uid) || {}).avatarUrl || entry.avatarUrl || '',
        })),
      }));
      return c.send(pack(125, { res: { error: 0, what: '' }, records }));
    },
  },
  {
    order: 34, protos: [126],
    handle(c, msg, proto, connId) {
      const id = String((msg && msg.id) || '');
      const rec = this.records.find((r) => r.id === id);
      if (!this.canViewRecord(c.player.uid, rec)) {
        return c.send(pack(126, { res: { error: 1, what: '战绩不存在' }, details: [] }));
      }
      return c.send(pack(126, {
        res: { error: 0, what: '' },
        details: rec.details || [],
        scoreRatio: rec.scoreRatio || 0,
      }));
    },
  },
  {
    order: 35, protos: [127],
    handle(c, msg, proto, connId) {
      const id = String((msg && msg.id) || '');
      const record = this.records.find((item) => (
        (item.playbacks && item.playbacks[id])
        || (item.details || []).some((detail) => detail.id === id && detail.playback)
      ));
      const pb = this.canViewRecord(c.player.uid, record) ? findPlayback([record], id) : null;
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
    },
  },
];
