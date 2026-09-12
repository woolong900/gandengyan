import { DurableObject } from 'cloudflare:workers';
import { emptyPlayer } from '../server/shared.js';

export class Lobby extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ready = ctx.blockConcurrencyWhile(() => this.load());
  }

  async load() {
    const raw = await this.ctx.storage.get('state');
    this.nextUid = (raw && raw.nextUid) || 100001;
    this.nextRoomId = (raw && raw.nextRoomId) || 100000;
    this.players = new Map((raw && raw.players) || []);
    this.uidRoom = new Map((raw && raw.uidRoom) || []);
  }

  async save() {
    await this.ctx.storage.put('state', {
      nextUid: this.nextUid,
      nextRoomId: this.nextRoomId,
      players: [...this.players.entries()],
      uidRoom: [...this.uidRoom.entries()],
    });
  }

  async mint(accountType = 'guest') {
    await this.ready;
    const uid = this.nextUid++;
    const token = `t_${accountType}_${uid}`;
    const player = emptyPlayer(uid);
    this.players.set(token, player);
    await this.save();
    return { token, player };
  }

  async getByToken(token) {
    await this.ready;
    let player = this.players.get(token);
    if (!player) {
      const uid = this.nextUid++;
      player = emptyPlayer(uid);
      this.players.set(token, player);
      await this.save();
    }
    return { token, player, roomId: this.uidRoom.get(player.uid) || 0 };
  }

  async allocRoomId() {
    await this.ready;
    const roomId = this.nextRoomId++;
    await this.save();
    return roomId;
  }

  async setUidRoom(uid, roomId) {
    await this.ready;
    if (roomId) this.uidRoom.set(uid, roomId);
    else this.uidRoom.delete(uid);
    const p = [...this.players.values()].find((x) => x.uid === uid);
    if (p) p.roomId = roomId || 0;
    await this.save();
  }

  async roomOfUid(uid) {
    await this.ready;
    return this.uidRoom.get(uid) || 0;
  }

  async mintBot(site) {
    await this.ready;
    const uid = this.nextUid++;
    const token = `t_bot_${uid}`;
    const player = emptyPlayer(uid, { nickname: `陪玩${site}` });
    this.players.set(token, player);
    await this.save();
    return player;
  }
}
