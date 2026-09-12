/**
 * 单进程大厅：玩家、房间号、桌子。
 */
const { pack, unpack, hasRes, protocol } = require('./net');
const { Table } = require('./table');
const rules = require('./rules');
const {
  num, roomInfo, versionBody, configBody, emptyPlayer, INVITE_GIVE,
} = require('./shared');

class GameApp {
  constructor({ persist, now } = {}) {
    this.persistFn = persist || (() => {});
    this.nowFn = now || Date.now;
    this.players = new Map();
    this.tables = new Map();
    this.nextUid = 100001;
    this.nextRoomId = 100000;
    this.conns = new Map();
    this.timeouts = new Map();
    this.uidRoom = new Map();
  }

  now() {
    return this.nowFn();
  }

  persist() {
    this.persistFn(this.dump());
  }

  playerByUid(uid) {
    const id = Number(uid);
    for (const p of this.players.values()) {
      if (p.uid === id) return p;
    }
    return null;
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

  bindInvite(player, code) {
    if (player.invitedBy) return { error: 1, what: '已经绑定过邀请码' };
    const raw = String(code || '').trim();
    if (!raw) return { error: 1, what: '请输入邀请码' };
    const uid = Number(raw);
    if (!uid || uid === player.uid) return { error: 1, what: '邀请码无效' };
    const inviter = this.playerByUid(uid);
    if (!inviter || inviter.bot) return { error: 1, what: '邀请码不存在' };
    player.invitedBy = String(uid);
    this.changeCards(inviter.uid, INVITE_GIVE, '邀请新用户');
    this.changeCards(player.uid, INVITE_GIVE, '绑定邀请码');
    this.persist();
    return { error: 0, what: '' };
  }

  fillBotsOn() {
    return process.env.QJQP_FILLBOTS !== '0';
  }

  mintBot(site, roomId) {
    const uid = this.nextUid++;
    const token = `t_bot_${uid}`;
    const player = emptyPlayer(uid, { nickname: `陪玩${site}`, roomId, bot: true, cardNum: 0 });
    this.players.set(token, player);
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
        cardNum: p.cardNum,
        roomId: p.roomId || 0,
        invitedBy: p.invitedBy || '',
        bot: !!p.bot,
      })),
      rooms: [...this.tables.values()].filter((t) => !t.closed).map((t) => t.dump()),
    };
  }

  restore(data) {
    if (!data) return;
    this.nextUid = data.nextUid || 100001;
    this.nextRoomId = data.nextRoomId || 100000;
    const byUid = new Map();
    for (const p of data.players || []) {
      const player = emptyPlayer(p.uid, p);
      this.players.set(p.token, player);
      byUid.set(player.uid, player);
    }
    for (const raw of data.rooms || []) {
      if (!raw.members || !raw.members.length) continue;
      const table = Table.fromDump(raw, this.tableHost(raw.roomId), byUid);
      if (!table.members.length || table.closed) continue;
      this.tables.set(table.roomId, table);
      for (const m of table.members) this.uidRoom.set(m.player.uid, table.roomId);
      table.rearmTimers();
    }
  }

  tableHost(roomId) {
    const app = this;
    return {
      send: (connId, bytes) => {
        const c = app.conns.get(connId);
        if (c && c.send) c.send(bytes);
      },
      persist: () => app.persist(),
      changeCards: (uid, delta, reason) => app.changeCards(uid, delta, reason),
      schedule: (name, dueAt) => app.schedule(`${roomId}:${name}`, dueAt),
      cancel: (name) => app.cancel(`${roomId}:${name}`),
      now: () => app.now(),
      log: (line) => console.log(line),
      onDissolved: () => {
        app.tables.delete(roomId);
        app.persist();
      },
      onUidRoom: (uid, rid) => {
        if (rid) app.uidRoom.set(uid, rid);
        else app.uidRoom.delete(uid);
      },
    };
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
      const uid = this.nextUid++;
      const token = `t_${query.get('accountType') || 'guest'}_${uid}`;
      this.players.set(token, emptyPlayer(uid));
      this.persist();
      return { status: 200, body: { err_code: 0, data: { token } } };
    }
    return { status: 404, body: null };
  }

  attach(connId, send) {
    this.conns.set(connId, { send, player: null, roomId: 0 });
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
      if (!this.players.has(msg.token)) {
        const uid = this.nextUid++;
        this.players.set(msg.token, emptyPlayer(uid));
        this.persist();
      }
      c.player = this.players.get(msg.token);
      const roomId = this.uidRoom.get(c.player.uid) || 0;
      c.roomId = roomId;
      console.log(`  100 登录 token=${msg.token} -> uid=${c.player.uid}`);
      return c.send(pack(100, {
        res: { error: 0, what: '' },
        uid: c.player.uid,
        nickname: c.player.nickname,
        avatarUrl: '',
        sex: c.player.sex,
        roomId,
        cardNum: c.player.cardNum,
        ip: '127.0.0.1',
      }));
    }

    if (proto === 99) return c.send(pack(99, { time: this.now() }));

    if (proto === 113) {
      return c.send(pack(113, { res: { error: 0, what: '' }, clubs: [], count: 0, total: 0 }));
    }
    if (proto === 101) {
      return c.send(pack(101, { res: { error: 0, what: '' }, realName: '测试', idCard: '', giveCard: 0 }));
    }
    if (proto === 105) {
      return c.send(pack(105, { res: { error: 0, what: '' }, mobile: '13800000000', giveCard: 0 }));
    }

    if (!c.player) return;

    if (proto === 103) {
      const inviter = c.player.invitedBy ? this.playerByUid(c.player.invitedBy) : null;
      return c.send(pack(103, {
        res: { error: 0, what: '' },
        username: inviter ? inviter.nickname : '',
        inviteCode: c.player.invitedBy || '',
        mobile: '',
        giveCard: INVITE_GIVE,
      }));
    }

    if (proto === 104) {
      return c.send(pack(104, { res: this.bindInvite(c.player, msg && msg.inviteCode) }));
    }

    if (proto === 112) {
      return c.send(pack(112, { res: { error: 1, what: '暂未开放充值' }, goods: [] }));
    }

    if (proto === 201) {
      const param1 = num(msg.param1);
      const param2 = num(msg.param2);
      const config = rules.parseConfig(param1, param2);
      const cost = rules.roomCardCost({ num: msg.num, 人数: config.人数, 房费: config.房费 });
      if (cost.host > 0 && (c.player.cardNum || 0) < cost.host) {
        return c.send(pack(201, { res: { error: 1, what: '房卡不足' } }));
      }
      const roomId = this.nextRoomId++;
      const meta = {
        roomId,
        gameType: msg.gameType,
        clubId: msg.clubId,
        num: msg.num,
        param1,
        param2,
        host: c.player.uid,
        config,
      };
      const table = new Table(meta, this.tableHost(roomId));
      if (cost.host > 0) table.charge(c.player.uid, cost.host, '房主支付');
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
      const table = this.tables.get(roomId);
      if (!table || table.closed) {
        console.log(`  202 进房 ${roomId} 不存在`);
        return c.send(pack(202, { res: { error: 1, what: '房间不存在' } }));
      }
      const seated = table.members.find((m) => m.player.uid === c.player.uid);
      const cost = rules.roomCardCost({
        num: table.num,
        人数: table.config.人数,
        房费: table.config.房费,
      });
      if (!seated && cost.each > 0 && (c.player.cardNum || 0) < cost.each) {
        return c.send(pack(202, { res: { error: 1, what: '房卡不足' } }));
      }
      const joined = table.join(c.player, connId);
      if (joined.error) return c.send(pack(202, { res: { error: 1, what: joined.error } }));
      if (!joined.rejoining && cost.each > 0 && !c.player.bot) {
        table.charge(c.player.uid, cost.each, 'AA支付');
      }
      this.maybeFillBots(table);
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
      const table = this.tables.get(c.roomId);
      const { msghead, msgdata } = JSON.parse(msg.json);
      const body = msgdata ? JSON.parse(msgdata) : {};
      console.log(`  200 房内消息 ${msghead} ${msgdata || ''}`);
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
