import { DurableObject } from 'cloudflare:workers';
import { pack, unpack, hasRes, protocol } from '../server/net.js';
import { num, push } from '../server/shared.js';
import { named } from './ns.js';

const lobbyOf = (env) => named(env.LOBBY, 'main');
const roomOf = (env, roomId) => named(env.ROOM, roomId);

export class Session extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.uid = 0;
    this.roomId = 0;
    this.token = '';
  }

  get name() {
    return this.ctx.id.name || this.ctx.id.toString();
  }

  async fetch() {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async push(bytes) {
    const buf = bytes instanceof ArrayBuffer
      ? bytes
      : bytes.buffer
        ? bytes
        : new Uint8Array(bytes);
    for (const ws of this.ctx.getWebSockets()) ws.send(buf);
  }

  send(ws, bytes) {
    ws.send(bytes);
  }

  asBytes(raw) {
    if (raw instanceof Uint8Array) return raw;
    if (raw instanceof ArrayBuffer) return new Uint8Array(raw);
    if (Array.isArray(raw)) return new Uint8Array(raw);
    if (raw && raw.buffer instanceof ArrayBuffer) {
      return new Uint8Array(raw.buffer, raw.byteOffset || 0, raw.byteLength || raw.length);
    }
    return new Uint8Array(0);
  }

  async deliver(ws, frames) {
    for (const f of frames || []) {
      const bytes = this.asBytes(f.bytes);
      if (!bytes.length) continue;
      if (!f.connId || f.connId === this.name) this.send(ws, bytes);
      else {
        try {
          await named(this.env.SESSION, f.connId).push(bytes);
        } catch (err) {
          console.error('转推失败', f.connId, err);
        }
      }
    }
  }

  leaveNow(ws) {
    this.roomId = 0;
    ws.serializeAttachment({ uid: this.uid, token: this.token, roomId: 0 });
    this.send(ws, push('exitroom', { reason: 0 }));
  }

  async webSocketMessage(ws, message) {
    try {
      await this.onBytes(ws, message);
    } catch (err) {
      console.error('处理 WS 消息出错', err);
    }
  }

  async onBytes(ws, message) {
    const bytes = typeof message === 'string' ? Buffer.from(message) : Buffer.from(message);
    const { proto, msg } = unpack(bytes);

    if (proto === 100) {
      const got = await lobbyOf(this.env).getByToken(msg.token);
      this.uid = got.player.uid;
      this.token = msg.token;
      this.roomId = got.roomId || 0;
      ws.serializeAttachment({ uid: this.uid, token: this.token, roomId: this.roomId });
      console.log(`  100 登录 token=${msg.token} -> uid=${this.uid}`);
      return this.send(ws, pack(100, {
        res: { error: 0, what: '' },
        uid: got.player.uid,
        nickname: got.player.nickname,
        avatarUrl: '',
        sex: got.player.sex,
        roomId: this.roomId,
        cardNum: got.player.cardNum,
        ip: '127.0.0.1',
      }));
    }

    if (proto === 99) return this.send(ws, pack(99, { time: Date.now() }));
    if (proto === 113) {
      return this.send(ws, pack(113, { res: { error: 0, what: '' }, clubs: [], count: 0, total: 0 }));
    }
    if (proto === 101) {
      return this.send(ws, pack(101, { res: { error: 0, what: '' }, realName: '测试', idCard: '', giveCard: 0 }));
    }
    if (proto === 105) {
      return this.send(ws, pack(105, { res: { error: 0, what: '' }, mobile: '13800000000', giveCard: 0 }));
    }

    if (!this.uid) {
      const att = ws.deserializeAttachment() || {};
      this.uid = att.uid || 0;
      this.token = att.token || '';
      this.roomId = num(att.roomId) || 0;
    }
    if (!this.uid) return;
    if (!this.roomId) {
      const att = ws.deserializeAttachment() || {};
      this.roomId = num(att.roomId) || num(await lobbyOf(this.env).roomOfUid(this.uid));
    }

    if (proto === 201) {
      const roomId = await lobbyOf(this.env).allocRoomId();
      await roomOf(this.env, roomId).init({
        roomId,
        gameType: msg.gameType,
        clubId: msg.clubId,
        num: msg.num,
        param1: num(msg.param1),
        param2: num(msg.param2),
        host: this.uid,
      });
      this.roomId = roomId;
      await lobbyOf(this.env).setUidRoom(this.uid, roomId);
      ws.serializeAttachment({ uid: this.uid, token: this.token, roomId });
      console.log(`  201 建房 -> roomId=${roomId}`);
      return this.send(ws, pack(201, { res: { error: 0, what: '' }, roomId }));
    }

    if (proto === 202) {
      const roomId = num(msg.roomId);
      const got = await lobbyOf(this.env).getByToken(this.token);
      const ret = await roomOf(this.env, roomId).join(got.player, this.name);
      if (ret.error) {
        console.log(`  202 进房 ${roomId} ${ret.error}`);
        return this.send(ws, pack(202, { res: { error: 1, what: ret.error } }));
      }
      this.roomId = roomId;
      ws.serializeAttachment({ uid: this.uid, token: this.token, roomId });
      this.send(ws, pack(202, {
        res: { error: 0, what: '' },
        json: JSON.stringify({ msgdata: ret.payload }),
      }));
      await this.deliver(ws, ret.frames);
      const after = await roomOf(this.env, roomId).afterJoin(this.uid);
      await this.deliver(ws, after && after.frames);
      return;
    }

    if (proto === 200) {
      const { msghead, msgdata } = JSON.parse(msg.json);
      const body = msgdata ? JSON.parse(msgdata) : {};
      console.log(`  200 房内消息 ${msghead} ${msgdata || ''}`);
      const leaving = msghead === 'dissmissroom' || msghead === 'nodissmissroom';
      if (!this.roomId) {
        if (leaving) {
          this.send(ws, pack(200, { res: { error: 0, what: '' } }));
          this.leaveNow(ws);
          return;
        }
        return this.send(ws, pack(200, { res: { error: 1, what: '不在房间里' } }));
      }
      const ret = await roomOf(this.env, this.roomId).handle200(this.uid, msghead, body);
      if (ret.error) {
        console.log(`    ! ${msghead} 被拒：${ret.what}`);
        if (leaving) {
          this.send(ws, pack(200, { res: { error: 0, what: '' } }));
          this.leaveNow(ws);
          return;
        }
        return this.send(ws, pack(200, { res: { error: 1, what: ret.what } }));
      }
      this.send(ws, pack(200, { res: { error: 0, what: '' } }));
      await this.deliver(ws, ret.frames);
      if (ret.closed || leaving) this.leaveNow(ws);
      return;
    }

    if (protocol[proto]) {
      console.log(`  ${proto} 未实现${hasRes(proto) ? '，兜一个成功' : '，无 res 字段，忽略'}`);
      if (hasRes(proto)) this.send(ws, pack(proto, { res: { error: 0, what: '' } }));
    }
  }

  async webSocketClose(ws, code) {
    try { ws.close(code, 'bye'); } catch { /* already closed */ }
    const att = ws.deserializeAttachment() || {};
    const uid = this.uid || att.uid;
    const roomId = this.roomId || att.roomId;
    if (uid && roomId) await roomOf(this.env, roomId).disconnect(uid, this.name);
  }

  async webSocketError(ws, err) {
    console.error('WS 错误', err);
  }
}
