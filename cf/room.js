import { DurableObject } from 'cloudflare:workers';
import { Table } from '../server/table.js';
import { roomInfo } from '../server/shared.js';
import { named } from './ns.js';

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.due = {};
    this.outbox = [];
    this.table = null;
    this.ready = ctx.blockConcurrencyWhile(() => this.load());
  }

  takeFrames() {
    const frames = this.outbox;
    this.outbox = [];
    return frames;
  }

  async flushFrames(frames) {
    for (const { connId, bytes } of frames || []) {
      try {
        await named(this.env.SESSION, connId).push(bytes);
      } catch (err) {
        console.error('推送失败', connId, err);
      }
    }
  }

  async load() {
    const raw = await this.ctx.storage.get('table');
    this.due = (await this.ctx.storage.get('due')) || {};
    if (!raw) return;
    this.table = Table.fromDump(raw, this.host(), null);
    this.table.rearmTimers();
  }

  async save() {
    if (!this.table || this.table.closed) return;
    await this.ctx.storage.put('table', this.table.dump());
    await this.ctx.storage.put('due', this.due);
  }

  host() {
    const room = this;
    return {
      send: (connId, bytes) => {
        const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        room.outbox.push({ connId: String(connId), bytes: u8 });
      },
      persist: () => { void room.save(); },
      schedule: (name, dueAt) => {
        room.due[name] = dueAt;
        void room.armAlarm();
      },
      cancel: (name) => {
        delete room.due[name];
        void room.armAlarm();
      },
      now: () => Date.now(),
      log: (line) => console.log(line),
      onDissolved: () => {
        void room.afterDissolve();
      },
      onUidRoom: (uid, rid) => {
        void named(room.env.LOBBY, 'main').setUidRoom(uid, rid);
      },
    };
  }

  async armAlarm() {
    const times = Object.values(this.due);
    if (!times.length) {
      await this.ctx.storage.deleteAlarm();
      await this.ctx.storage.put('due', this.due);
      return;
    }
    await this.ctx.storage.put('due', this.due);
    await this.ctx.storage.setAlarm(Math.min(...times));
  }

  async alarm() {
    await this.ready;
    const now = Date.now();
    const fired = Object.entries(this.due).filter(([, t]) => t <= now);
    for (const [name] of fired) delete this.due[name];
    if (this.table) {
      for (const [name] of fired) this.table.onTimer(name);
    }
    const frames = this.takeFrames();
    await this.save();
    await this.armAlarm();
    await this.flushFrames(frames);
  }

  async afterDissolve() {
    if (this.table) {
      for (const m of this.table.members) {
        await named(this.env.LOBBY, 'main').setUidRoom(m.player.uid, 0);
      }
    }
    this.table = null;
    this.due = {};
    await this.ctx.storage.deleteAll();
  }

  async init(meta) {
    await this.ready;
    if (this.table) return { roomId: this.table.roomId };
    this.table = new Table(meta, this.host());
    await this.save();
    return { roomId: this.table.roomId };
  }

  async join(player, connId) {
    await this.ready;
    if (!this.table) return { error: '房间不存在' };
    const joined = this.table.join(player, connId);
    if (joined.error) return { error: joined.error };
    await this.maybeFillBots();
    const payload = JSON.stringify({ room: roomInfo(this.table), game: joined.game || {} });
    await this.save();
    return { error: null, payload, frames: this.takeFrames() };
  }

  async maybeFillBots() {
    if (this.env.QJQP_FILLBOTS === '0') return;
    if (!this.table || !this.table.needsBots()) return;
    const bots = [];
    for (let site = 2; site <= this.table.config.人数; site++) {
      const player = await named(this.env.LOBBY, 'main').mintBot(site);
      bots.push({ player, site });
    }
    this.table.addBots(bots);
  }

  async afterJoin(uid) {
    await this.ready;
    if (!this.table) return { frames: [] };
    this.table.afterJoin(uid);
    await this.save();
    await this.armAlarm();
    return { frames: this.takeFrames() };
  }

  async handle200(uid, msghead, body) {
    await this.ready;
    if (!this.table) return { error: 1, what: '房间不存在', frames: [] };
    const ret = this.table.handle200(uid, msghead, body);
    const frames = this.takeFrames();
    await this.save();
    await this.armAlarm();
    return { ...ret, frames, closed: !!(this.table && this.table.closed) };
  }

  async disconnect(uid, connId) {
    await this.ready;
    if (!this.table) return { frames: [] };
    this.table.leave(uid, connId);
    const frames = this.takeFrames();
    await this.save();
    await this.armAlarm();
    await this.flushFrames(frames.filter((f) => f.connId !== String(connId)));
    return { frames: [] };
  }
}
