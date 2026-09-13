/**
 * SQLite 存档。每次保存都在一个事务内更新完整快照，避免玩家、房间、战绩和
 * 俱乐部只写入一部分。首次启动会自动导入旧的 data/state.json。
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = process.env.QJQP_DB || path.join(DATA_DIR, 'state.sqlite');
const LEGACY_FILE = process.env.QJQP_STATE || path.join(DATA_DIR, 'state.json');

const empty = () => ({
  nextUid: 100001,
  nextRoomId: 100000,
  players: [],
  rooms: [],
  records: [],
  playbackSeq: 0,
  clubs: { nextId: 100000, nextOpId: 1, clubs: [] },
});

const normalize = (data) => {
  const base = empty();
  const raw = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  const clubs = raw.clubs && typeof raw.clubs === 'object' && !Array.isArray(raw.clubs)
    ? raw.clubs : base.clubs;
  return {
    nextUid: Number(raw.nextUid) || base.nextUid,
    nextRoomId: Number(raw.nextRoomId) || base.nextRoomId,
    players: Array.isArray(raw.players) ? raw.players : [],
    rooms: Array.isArray(raw.rooms) ? raw.rooms : [],
    records: Array.isArray(raw.records) ? raw.records : [],
    playbackSeq: Number(raw.playbackSeq) || 0,
    clubs: {
      nextId: Number(clubs.nextId) || base.clubs.nextId,
      nextOpId: Number(clubs.nextOpId) || base.clubs.nextOpId,
      clubs: Array.isArray(clubs.clubs) ? clubs.clubs : [],
    },
  };
};

let db = null;
let statements = null;

const encode = (value) => {
  const json = JSON.stringify(value);
  if (json === undefined) throw new TypeError('存档数据无法序列化');
  return json;
};

const open = () => {
  if (db) return db;
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  db = new Database(FILE);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = FULL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      schema_version INTEGER NOT NULL,
      next_uid INTEGER NOT NULL,
      next_room_id INTEGER NOT NULL,
      playback_seq INTEGER NOT NULL,
      club_next_id INTEGER NOT NULL,
      club_next_op_id INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS players (
      position INTEGER NOT NULL,
      token TEXT PRIMARY KEY,
      uid INTEGER NOT NULL,
      invite_code TEXT NOT NULL DEFAULT '',
      data TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS players_uid ON players(uid);
    CREATE INDEX IF NOT EXISTS players_invite_code ON players(invite_code);
    CREATE TABLE IF NOT EXISTS rooms (
      position INTEGER NOT NULL,
      room_id INTEGER PRIMARY KEY,
      club_id INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS rooms_club_id ON rooms(club_id);
    CREATE TABLE IF NOT EXISTS records (
      position INTEGER PRIMARY KEY,
      record_id TEXT NOT NULL,
      time INTEGER NOT NULL DEFAULT 0,
      club_id INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS records_id ON records(record_id);
    CREATE INDEX IF NOT EXISTS records_time ON records(time);
    CREATE INDEX IF NOT EXISTS records_club_id ON records(club_id);
    CREATE TABLE IF NOT EXISTS clubs (
      position INTEGER NOT NULL,
      club_id INTEGER PRIMARY KEY,
      owner_uid INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS clubs_owner_uid ON clubs(owner_uid);
  `);
  statements = {
    meta: db.prepare(`INSERT INTO meta
      (id, schema_version, next_uid, next_room_id, playback_seq, club_next_id, club_next_op_id, updated_at)
      VALUES (1, 1, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        schema_version=excluded.schema_version,
        next_uid=excluded.next_uid,
        next_room_id=excluded.next_room_id,
        playback_seq=excluded.playback_seq,
        club_next_id=excluded.club_next_id,
        club_next_op_id=excluded.club_next_op_id,
        updated_at=excluded.updated_at`),
    player: db.prepare('INSERT INTO players (position, token, uid, invite_code, data) VALUES (?, ?, ?, ?, ?)'),
    room: db.prepare('INSERT INTO rooms (position, room_id, club_id, data) VALUES (?, ?, ?, ?)'),
    record: db.prepare('INSERT INTO records (position, record_id, time, club_id, data) VALUES (?, ?, ?, ?, ?)'),
    club: db.prepare('INSERT INTO clubs (position, club_id, owner_uid, data) VALUES (?, ?, ?, ?)'),
  };
  return db;
};

const writeTransaction = (data) => {
  const state = normalize(data);
  open();
  const write = db.transaction(() => {
    // 先序列化再删除，常见的数据错误不会触碰现有快照；事务还负责兜底回滚。
    const players = state.players.map((item) => encode(item));
    const rooms = state.rooms.map((item) => encode(item));
    const records = state.records.map((item) => encode(item));
    const clubs = state.clubs.clubs.map((item) => encode(item));
    db.exec('DELETE FROM players; DELETE FROM rooms; DELETE FROM records; DELETE FROM clubs;');
    statements.meta.run(
      state.nextUid, state.nextRoomId, state.playbackSeq,
      state.clubs.nextId, state.clubs.nextOpId, Date.now(),
    );
    state.players.forEach((item, i) => statements.player.run(
      i, String(item.token || ''), Number(item.uid), String(item.inviteCode || ''), players[i],
    ));
    state.rooms.forEach((item, i) => statements.room.run(
      i, Number(item.roomId), Number(item.clubId || 0), rooms[i],
    ));
    state.records.forEach((item, i) => statements.record.run(
      i, String(item.id || ''), Number(item.time || 0), Number(item.clubId || 0), records[i],
    ));
    state.clubs.clubs.forEach((item, i) => statements.club.run(
      i, Number(item.id), Number(item.ownerUid || 0), clubs[i],
    ));
  });
  write();
  return state;
};

const readLegacy = () => {
  try {
    return normalize(JSON.parse(fs.readFileSync(LEGACY_FILE, 'utf8')));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw new Error(`旧 JSON 存档无法迁移：${LEGACY_FILE}`, { cause: err });
  }
};

const load = () => {
  open();
  let meta = db.prepare('SELECT * FROM meta WHERE id = 1').get();
  if (!meta) {
    const legacy = readLegacy();
    writeTransaction(legacy || empty());
    if (legacy) console.log(`已迁移旧存档 ${LEGACY_FILE} -> ${FILE}`);
    meta = db.prepare('SELECT * FROM meta WHERE id = 1').get();
  }
  return {
    nextUid: Number(meta.next_uid),
    nextRoomId: Number(meta.next_room_id),
    players: db.prepare('SELECT data FROM players ORDER BY position').all().map((row) => JSON.parse(row.data)),
    rooms: db.prepare('SELECT data FROM rooms ORDER BY position').all().map((row) => JSON.parse(row.data)),
    records: db.prepare('SELECT data FROM records ORDER BY position').all().map((row) => JSON.parse(row.data)),
    playbackSeq: Number(meta.playback_seq),
    clubs: {
      nextId: Number(meta.club_next_id),
      nextOpId: Number(meta.club_next_op_id),
      clubs: db.prepare('SELECT data FROM clubs ORDER BY position').all().map((row) => JSON.parse(row.data)),
    },
  };
};

const save = (data) => {
  writeTransaction(data);
};

const saveAsync = async (data) => {
  writeTransaction(data);
};

const backup = async (destination) => {
  open();
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  return db.backup(destination);
};

const close = () => {
  if (!db) return;
  db.close();
  db = null;
  statements = null;
};

module.exports = { FILE, LEGACY_FILE, load, save, saveAsync, backup, close };
