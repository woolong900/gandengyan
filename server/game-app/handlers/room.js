/**
 * WebSocket 协议处理：建房、加入房间与牌局内消息。
 * 每项从原 GameApp.onMessage 的 if 分支原样迁出；handle 以 GameApp 实例为 this 调用。
 * order 为原分支顺序，同一协议号命中多项时按 order 依次执行；返回 FALLTHROUGH 表示继续下一项。
 */
const {
  Table, num, pack, push, roomInfo, rules,
} = require('../common');

module.exports = [
  {
    order: 46, protos: [201],
    handle(c, msg, proto, connId) {
      const existingRoomId = this.activeRoomForRequest(c);
      if (existingRoomId) {
        const existingTable = this.tables.get(existingRoomId);
        // 建房成功后客户端如果在切牌桌时异常，重试创建应恢复原房间，不能把账号卡死。
        // 只复用本人创建且尚未开局的手动房，避免误入别人的房间或进行中的牌局。
        if (existingTable && Number(existingTable.gameType) === 17
          && !existingTable.closed && !existingTable.clubId
          && !existingTable.round && existingTable.step === 0
          && Number(existingTable.hostUid) === Number(c.player.uid)) {
          return c.send(pack(201, { res: { error: 0, what: '' }, roomId: existingRoomId }));
        }
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
      const gameRules = rules.forGame(gameType);
      const config = gameRules.parseConfig(param1, param2);
      const clubId = num(msg && msg.clubId);
      const clubError = this.clubRoomError(clubId, c.player.uid);
      if (clubError) return c.send(pack(201, { res: { error: 1, what: clubError } }));
      const cost = gameRules.roomCardCost({ num: roomNum, 人数: config.人数, 房费: config.房费 });
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
    },
  },
  {
    order: 47, protos: [202],
    handle(c, msg, proto, connId) {
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
      const cost = table.gameRules.roomCardCost({
        num: table.num,
        人数: table.config.人数,
        房费: table.config.房费,
      });
      // AA 等要自己付钱的，坐下前先看够不够；观战不扣、房主支付也不查入座的人
      const willSit = seated ? !seated.view : table.canSit();
      if (!table.clubId && !seated && willSit && cost.each > 0 && (c.player.cardNum || 0) < cost.each) {
        return c.send(pack(202, { res: { error: 1, what: '房卡不足' } }));
      }
      const joined = table.join(c.player, connId, msg.location);
      if (joined.error) return c.send(pack(202, { res: { error: 1, what: joined.error } }));
      this.maybeFillBots(table);
      if (table.clubId && table.schemeId) {
        const club = this.clubStore.get(table.clubId);
        if (club && this.ensureClubSchemeTables(club)) this.persist();
      }
      c.roomId = roomId;
      // 陪玩是在 join 之后补齐的；等待态快照要在这里重建，保证 room.person 与 game.players 一致。
      const game = table.round || table.lastEnd ? joined.game : table.waitingGameSnapshot();
      const room = roomInfo(table);
      room.record_card_access = this.recordCardAccess(c);
      const payload = JSON.stringify({ room, game: game || {} });
      c.send(pack(202, {
        res: { error: 0, what: '' },
        json: JSON.stringify({ msgdata: payload }),
      }));
      table.afterJoin(c.player.uid);
      return;
    },
  },
  {
    order: 48, protos: [200],
    handle(c, msg, proto, connId) {
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
      if (msghead === 'support_history') {
        const result = this.supportPayload(c.player, true);
        c.send(push('support_history', result));
        return c.send(pack(200, { res: { error: 0, what: '' } }));
      }
      if (msghead === 'support_send') {
        const tableContext = this.tables.get(c.roomId);
        const result = this.sendSupportMessage(c.player, body.content, {
          roomId: tableContext && !tableContext.closed ? tableContext.roomId : 0,
          gameType: tableContext && !tableContext.closed ? tableContext.gameType : 0,
          step: tableContext && !tableContext.closed ? tableContext.step : 0,
          clientVersion: body.clientVersion,
        });
        return c.send(pack(200, { res: { error: result.error ? 1 : 0, what: result.error || '' } }));
      }
      if (msghead === 'support_read') {
        const result = this.supportPayload(c.player, true);
        c.send(push('support_read', result));
        return c.send(pack(200, { res: { error: 0, what: '' } }));
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
      const activeMember = table.members.find((member) => (
        Number(member.player.uid) === Number(c.player.uid)
      ));
      if (!activeMember || activeMember.connId !== connId) {
        console.log(`    ! ${msghead} 被拒：旧连接 uid=${c.player.uid} conn=${connId}`);
        return c.send(pack(200, { res: { error: 1, what: '连接已失效，请重新进入房间' } }));
      }
      const ret = table.handle200(c.player.uid, msghead, body);
      if (ret.error) {
        console.log(`    ! ${msghead} 被拒：${ret.what}`);
        return c.send(pack(200, { res: { error: 1, what: ret.what } }));
      }
      return c.send(pack(200, { res: { error: 0, what: '' } }));
    },
  },
];
