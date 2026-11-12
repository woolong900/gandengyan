/**
 * WebSocket 协议处理：俱乐部。
 * 每项从原 GameApp.onMessage 的 if 分支原样迁出；handle 以 GameApp 实例为 this 调用。
 * order 为原分支顺序，同一协议号命中多项时按 order 依次执行；返回 FALLTHROUGH 表示继续下一项。
 */
const {
  CLUB_APPLICATION_MESSAGE_ID_BASE, DAY_SEC, num, pack, rules,
} = require('../common');

module.exports = [
  {
    order: 6, protos: [113],
    handle(c, msg, proto, connId) {
      const clubs = this.clubStore.listFor(c.player.uid).map((club) => this.clubInfo(club, c.player.uid));
      return c.send(pack(113, { res: { error: 0, what: '' }, clubs, count: clubs.length, total: clubs.length }));
    },
  },
  {
    order: 7, protos: [114],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.id));
      const owner = club && this.playerByUid(club.ownerUid);
      if (!club || !owner || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(114, { res: { error: 1, what: '俱乐部不存在' } }));
      }
      return c.send(pack(114, {
        res: { error: 0, what: '' },
        avatarUrl: owner.avatarUrl || '', nickname: owner.nickname || `玩家${owner.uid}`, code: String(owner.uid),
      }));
    },
  },
  {
    order: 8, protos: [115],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.quit(c.player.uid, num(msg && msg.id));
      if (ret.error) return c.send(pack(115, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(115, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 9, protos: [116],
    handle(c, msg, proto, connId) {
      return c.send(pack(116, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 10, protos: [117],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.apply(c.player.uid, msg && msg.code);
      if (ret.error) return c.send(pack(117, { res: { error: 1, what: ret.error } }));
      this.persist();
      this.notifyClubAdmins(ret.club);
      return c.send(pack(117, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 11, protos: [118],
    handle(c, msg, proto, connId) {
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
      const inbox = [...invites, ...this.clubApplicationMessages(c.player), ...messages];
      return c.send(pack(118, { res: { error: 0, what: '' }, invites: inbox, count: inbox.length, total: inbox.length }));
    },
  },
  {
    order: 12, protos: [119, 120],
    handle(c, msg, proto, connId) {
      if (proto === 120 && num(msg && msg.id) >= CLUB_APPLICATION_MESSAGE_ID_BASE) {
        const marked = this.markClubApplicationMessageRead(c.player, num(msg && msg.id));
        return c.send(pack(120, { res: { error: marked.error ? 1 : 0, what: marked.error || '' } }));
      }
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
    },
  },
  {
    order: 13, protos: [143],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(143, { res: { error: 1, what: '没有邀请权限' }, data: [] }));
      }
      // 邀请页不允许枚举平台玩家，只能通过协议 140 按完整用户 ID 查找。
      return c.send(pack(143, { res: { error: 0, what: '' }, data: [], count: 0, total: 0 }));
    },
  },
  {
    order: 14, protos: [144],
    handle(c, msg, proto, connId) {
      const ids = Array.isArray(msg && msg.userId) ? msg.userId.map(num) : [];
      if (ids.some((uid) => !this.playerByUid(uid) || this.playerByUid(uid).bot)) {
        return c.send(pack(144, { res: { error: 1, what: '所选玩家不存在' } }));
      }
      const result = this.clubStore.addInvites(c.player.uid, num(msg && msg.clubId), ids);
      if (result.error) return c.send(pack(144, { res: { error: 1, what: result.error } }));
      this.persist();
      for (const uid of ids) this.notifyInbox(uid);
      return c.send(pack(144, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 15, protos: [121],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(121, { res: { error: 1, what: '无权查看俱乐部成员' }, members: [] }));
      }
      const members = club.members.map((member) => this.clubMemberInfo(club, member));
      return c.send(pack(121, { res: { error: 0, what: '' }, members, count: members.length, total: members.length }));
    },
  },
  {
    order: 16, protos: [122],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(122, { res: { error: 1, what: '无权查看俱乐部房间' }, rooms: [] }));
      }
      if (this.ensureClubSchemeTables(club)) this.persist();
      const rooms = [...this.tables.values()]
        .filter((table) => table.clubId === club.id && !table.closed)
        .map((table) => this.clubRoomInfo(table));
      return c.send(pack(122, { res: { error: 0, what: '' }, rooms, count: rooms.length, total: rooms.length }));
    },
  },
  {
    order: 17, protos: [123],
    handle(c, msg, proto, connId) {
      const roomId = num(msg && msg.id);
      const table = this.tables.get(roomId);
      const club = table && this.clubStore.get(table.clubId);
      if (!table || !club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(123, { res: { error: 1, what: '没有关闭房间的权限' } }));
      }
      table.dissolve();
      return c.send(pack(123, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 18, protos: [157],
    handle(c, msg, proto, connId) {
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
    },
  },
  {
    order: 19, protos: [124],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(124, { res: { error: 1, what: '无权查看玩法方案' }, data: [] }));
      }
      const schemeData = club.schemes || [];
      return c.send(pack(124, { res: { error: 0, what: '' }, data: schemeData, count: schemeData.length, total: schemeData.length }));
    },
  },
  {
    order: 20, protos: [133, 162],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.freeze(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId), num(msg && msg.status));
      if (ret.error) return c.send(pack(proto, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 21, protos: [134],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.remark(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId), msg && msg.remark);
      if (ret.error) return c.send(pack(134, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(134, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 22, protos: [135],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.setRole(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId), num(msg && msg.role));
      if (ret.error) return c.send(pack(135, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(135, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 23, protos: [161],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.member(club, c.player.uid)) {
        return c.send(pack(161, { res: { error: 1, what: '无权查看成员信息' }, members: [] }));
      }
      const members = club.members.map((member) => ({ ...this.clubMemberInfo(club, member), fatigueNum: 0 }));
      return c.send(pack(161, { res: { error: 0, what: '' }, members, count: members.length, total: members.length, fatigueNum: 0 }));
    },
  },
  {
    order: 24, protos: [160],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.id));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(160, { res: { error: 1, what: '没有管理权限' } }));
      }
      return c.send(pack(160, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 25, protos: [142, 146, 163, 164, 166],
    handle(c, msg, proto, connId) {
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
        if (!this.clubStore.isAdmin(club, c.player.uid)) {
          return c.send(pack(proto, { res: { error: 1, what: '没有管理权限' }, data: [], count: 0, total: 0 }));
        }
        const day = num(msg && msg.date);
        const start = (num(msg && msg.startDate) || day) * 1000;
        const end = (num(msg && msg.endDate) || (day + DAY_SEC)) * 1000;
        const filtered = records.filter((record) => record.time >= start && record.time < end);
        const query = String((msg && msg.userCode) || '').trim().toLowerCase();
        const data = this.clubRecordStats(club, filtered).filter((item) => !query
          || item.code === query || item.nickname.toLowerCase().includes(query)
          || item.remark.toLowerCase().includes(query));
        console.log(`  146 俱乐部战绩统计 uid=${c.player.uid} clubId=${club.id} date=${day} records=${filtered.length} members=${data.length}`);
        return c.send(pack(proto, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
      }
      if (proto === 166) {
        const data = this.clubRecordStats(club, records).map((item) => ({ ...item, keyS: '1' }));
        return c.send(pack(proto, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
      }
      return c.send(pack(proto, { res: { error: 0, what: '' }, data: [], count: 0, total: 0 }));
    },
  },
  {
    order: 26, protos: [154],
    handle(c, msg, proto, connId) {
      return c.send(pack(154, { res: { error: 0, what: '' }, data: [], count: 0, total: 0 }));
    },
  },
  {
    order: 27, protos: [155],
    handle(c, msg, proto, connId) {
      return c.send(pack(155, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 28, protos: [156, 157],
    handle(c, msg, proto, connId) {
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 36, protos: [128],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(128, { res: { error: 1, what: '没有管理权限' }, data: [] }));
      }
      return c.send(pack(128, { res: { error: 0, what: '' }, data: [] }));
    },
  },
  {
    order: 37, protos: [136],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.kick(c.player.uid, num(msg && msg.clubId), num(msg && msg.userId));
      if (ret.error) return c.send(pack(136, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(136, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 38, protos: [137],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(137, { res: { error: 1, what: '没有管理权限' }, data: [] }));
      }
      const data = club.applications.map((a) => {
        const player = this.playerByUid(a.uid) || {};
        return { id: a.id, avatarUrl: player.avatarUrl || '', nickname: player.nickname || `玩家${a.uid}`, code: String(a.uid), sex: player.sex || 1, policy: 0 };
      });
      return c.send(pack(137, { res: { error: 0, what: '' }, data, count: data.length, total: data.length }));
    },
  },
  {
    order: 39, protos: [138, 139],
    handle(c, msg, proto, connId) {
      const ret = proto === 138
        ? this.clubStore.approve(c.player.uid, num(msg && msg.id))
        : this.clubStore.reject(c.player.uid, num(msg && msg.id));
      if (ret.error) return c.send(pack(proto, { res: { error: 1, what: ret.error } }));
      this.persist();
      this.notifyClubAdmins(ret.club);
      return c.send(pack(proto, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 40, protos: [140],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.clubId));
      const userCode = String((msg && msg.userCode) || '').trim();
      const target = /^\d+$/.test(userCode) ? this.playerByUid(Number(userCode)) : null;
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(140, { res: { error: 1, what: '没有邀请权限' }, member: false }));
      }
      if (!target || target.bot || String(target.uid) !== userCode) {
        return c.send(pack(140, { res: { error: 1, what: '用户不存在' }, member: false }));
      }
      return c.send(pack(140, {
        res: { error: 0, what: '' },
        info: { id: target.uid, avatarUrl: target.avatarUrl || '', code: String(target.uid), nickname: target.nickname },
        member: !!this.clubStore.member(club, target.uid),
      }));
    },
  },
  {
    order: 41, protos: [141],
    handle(c, msg, proto, connId) {
      const targetUid = num(msg && msg.userId);
      const target = this.playerByUid(targetUid);
      if (!target || target.bot) return c.send(pack(141, { res: { error: 1, what: '玩家不存在' } }));
      const ret = this.clubStore.addInvite(c.player.uid, num(msg && msg.clubId), targetUid);
      if (ret.error) return c.send(pack(141, { res: { error: 1, what: ret.error } }));
      this.persist();
      this.notifyInbox(targetUid);
      return c.send(pack(141, { res: { error: 0, what: '' } }));
    },
  },
  {
    order: 42, protos: [145],
    handle(c, msg, proto, connId) {
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
    },
  },
  {
    order: 43, protos: [147],
    handle(c, msg, proto, connId) {
      const ret = this.clubStore.create(c.player.uid, msg && msg.name);
      if (ret.error) return c.send(pack(147, { res: { error: 1, what: ret.error } }));
      this.persist();
      return c.send(pack(147, { res: { error: 0, what: '' }, id: ret.club.id }));
    },
  },
  {
    order: 44, protos: [149, 150, 151, 152],
    handle(c, msg, proto, connId) {
      const found = proto === 149
        ? { club: this.clubStore.get(num(msg && msg.clubId)) }
        : this.clubStore.findScheme(num(msg && msg.id));
      const club = found && found.club;
      if (!club || !this.clubStore.isAdmin(club, c.player.uid)) {
        return c.send(pack(proto, { res: { error: 1, what: '没有管理权限' } }));
      }
      if (proto === 149 || proto === 150) {
        const invalid = rules.validateRoomConfig({
          gameType: num(msg.gameType), num: num(msg.num),
          param1: num(msg.param1), param2: num(msg.param2),
        });
        if (invalid) return c.send(pack(proto, { res: { error: 1, what: invalid } }));
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
            table.gameRules = rules.forGame(scheme.gameType);
            table.num = scheme.num;
            table.param1 = scheme.param1;
            table.param2 = scheme.param2;
            table.config = table.gameRules.parseConfig(scheme.param1, scheme.param2);
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
    },
  },
  {
    order: 45, protos: [158],
    handle(c, msg, proto, connId) {
      const club = this.clubStore.get(num(msg && msg.id));
      if (!club || club.ownerUid !== c.player.uid) {
        return c.send(pack(158, { res: { error: 1, what: '只有部长可以解散俱乐部' } }));
      }
      const hasRoom = [...this.tables.values()].some((table) => table.clubId === club.id && !table.closed);
      if (hasRoom) return c.send(pack(158, { res: { error: 1, what: '俱乐部还有未结束的房间' } }));
      this.clubStore.clubs.delete(club.id);
      this.persist();
      return c.send(pack(158, { res: { error: 0, what: '' } }));
    },
  },
];
