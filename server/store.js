/**
 * SQLite 存档。每次保存都在一个事务内更新完整快照，避免玩家、房间、战绩和
 * 俱乐部只写入一部分。首次启动会自动导入旧的 data/state.json。
 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { CLUB_ID_START } = require('./clubs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = process.env.QJQP_DB || path.join(DATA_DIR, 'state.sqlite');
const LEGACY_FILE = process.env.QJQP_STATE || path.join(DATA_DIR, 'state.json');

const empty = () => ({
  nextUid: 285633,
  nextRoomId: 100000,
  nextOperatorMessageId: 1000000000,
  players: [],
  operatorMessages: [],
  publicNotices: { hallMarquee: '', serviceWechat: '', serviceQQ: '' },
  economySettings: {
    newPlayerCards: 200,
    clubJoinBonus: 200,
    inviteBindBonus: 1000,
    invitePageText: '绑定推荐人邀请码，可获得1000张房卡！',
  },
  botSettings: { enabled: process.env.QJQP_FILLBOTS !== '0' },
  rooms: [],
  records: [],
  playbackSeq: 0,
  clubs: { nextId: CLUB_ID_START, nextOpId: 1, clubs: [] },
});

const normalize = (data) => {
  const base = empty();
  const raw = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  const clubs = raw.clubs && typeof raw.clubs === 'object' && !Array.isArray(raw.clubs)
    ? raw.clubs : base.clubs;
  return {
    nextUid: Number(raw.nextUid) || base.nextUid,
    nextRoomId: Number(raw.nextRoomId) || base.nextRoomId,
    nextOperatorMessageId: Number(raw.nextOperatorMessageId) || base.nextOperatorMessageId,
    players: Array.isArray(raw.players) ? raw.players : [],
    operatorMessages: Array.isArray(raw.operatorMessages) ? raw.operatorMessages : [],
    publicNotices: raw.publicNotices && typeof raw.publicNotices === 'object' ? raw.publicNotices : base.publicNotices,
    economySettings: raw.economySettings && typeof raw.economySettings === 'object'
      ? raw.economySettings : base.economySettings,
    botSettings: raw.botSettings && typeof raw.botSettings === 'object'
      ? { enabled: raw.botSettings.enabled !== false } : base.botSettings,
    rooms: Array.isArray(raw.rooms) ? raw.rooms : [],
    records: Array.isArray(raw.records) ? raw.records : [],
    playbackSeq: Number(raw.playbackSeq) || 0,
    clubs: {
      nextId: Math.max(CLUB_ID_START, Number(clubs.nextId) || 0),
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
      next_operator_message_id INTEGER NOT NULL DEFAULT 1000000000,
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
    CREATE TABLE IF NOT EXISTS operator_messages (
      position INTEGER PRIMARY KEY,
      id INTEGER NOT NULL UNIQUE,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS public_notices (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS economy_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bot_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      at INTEGER NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS admin_audit_at ON admin_audit(at);
    CREATE TABLE IF NOT EXISTS admin_sessions (
      sid_hash TEXT PRIMARY KEY,
      csrf TEXT NOT NULL,
      actor TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS admin_sessions_expires_at ON admin_sessions(expires_at);
    CREATE TABLE IF NOT EXISTS agent_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid INTEGER NOT NULL,
      nickname TEXT NOT NULL DEFAULT '',
      contact TEXT NOT NULL,
      contact_type TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS agent_applications_created_at ON agent_applications(created_at DESC);
    CREATE INDEX IF NOT EXISTS agent_applications_uid ON agent_applications(uid);
    CREATE TABLE IF NOT EXISTS record_history (
      id TEXT PRIMARY KEY,
      room_id INTEGER NOT NULL,
      club_id INTEGER NOT NULL DEFAULT 0,
      time INTEGER NOT NULL,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS record_history_time ON record_history(time);
    CREATE INDEX IF NOT EXISTS record_history_room ON record_history(room_id);
    CREATE TABLE IF NOT EXISTS record_history_player (
      record_id TEXT NOT NULL REFERENCES record_history(id) ON DELETE CASCADE,
      uid INTEGER NOT NULL,
      PRIMARY KEY(record_id, uid)
    );
    CREATE INDEX IF NOT EXISTS record_history_player_uid ON record_history_player(uid);
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
  if (!db.pragma('table_info(meta)').some((column) => column.name === 'next_operator_message_id')) {
    db.exec('ALTER TABLE meta ADD COLUMN next_operator_message_id INTEGER NOT NULL DEFAULT 1000000000');
  }
  statements = {
    meta: db.prepare(`INSERT INTO meta
      (id, schema_version, next_uid, next_room_id, playback_seq, club_next_id, club_next_op_id, next_operator_message_id, updated_at)
      VALUES (1, 1, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        schema_version=excluded.schema_version,
        next_uid=excluded.next_uid,
        next_room_id=excluded.next_room_id,
        playback_seq=excluded.playback_seq,
        club_next_id=excluded.club_next_id,
        club_next_op_id=excluded.club_next_op_id,
        next_operator_message_id=excluded.next_operator_message_id,
        updated_at=excluded.updated_at`),
    player: db.prepare('INSERT INTO players (position, token, uid, invite_code, data) VALUES (?, ?, ?, ?, ?)'),
    operatorMessage: db.prepare('INSERT INTO operator_messages (position, id, data) VALUES (?, ?, ?)'),
    publicNotices: db.prepare('INSERT INTO public_notices (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data'),
    economySettings: db.prepare('INSERT INTO economy_settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data'),
    botSettings: db.prepare('INSERT INTO bot_settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data'),
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
    const operatorMessages = state.operatorMessages.map((item) => encode(item));
    const publicNotices = encode(state.publicNotices);
    const economySettings = encode(state.economySettings);
    const botSettings = encode(state.botSettings);
    const rooms = state.rooms.map((item) => encode(item));
    const records = state.records.map((item) => encode(item));
    const clubs = state.clubs.clubs.map((item) => encode(item));
    db.exec('DELETE FROM players; DELETE FROM operator_messages; DELETE FROM rooms; DELETE FROM records; DELETE FROM clubs;');
    statements.meta.run(
      state.nextUid, state.nextRoomId, state.playbackSeq,
      state.clubs.nextId, state.clubs.nextOpId, state.nextOperatorMessageId, Date.now(),
    );
    state.players.forEach((item, i) => statements.player.run(
      i, String(item.token || ''), Number(item.uid), String(item.inviteCode || ''), players[i],
    ));
    state.operatorMessages.forEach((item, i) => statements.operatorMessage.run(i, Number(item.id), operatorMessages[i]));
    statements.publicNotices.run(publicNotices);
    statements.economySettings.run(economySettings);
    statements.botSettings.run(botSettings);
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
    nextOperatorMessageId: Number(meta.next_operator_message_id),
    players: db.prepare('SELECT data FROM players ORDER BY position').all().map((row) => JSON.parse(row.data)),
    operatorMessages: db.prepare('SELECT data FROM operator_messages ORDER BY position').all().map((row) => JSON.parse(row.data)),
    publicNotices: JSON.parse((db.prepare('SELECT data FROM public_notices WHERE id=1').get() || { data: '{}' }).data),
    economySettings: JSON.parse((db.prepare('SELECT data FROM economy_settings WHERE id=1').get() || { data: '{}' }).data),
    botSettings: JSON.parse((db.prepare('SELECT data FROM bot_settings WHERE id=1').get() || { data: '{}' }).data),
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

const appendAudit = (entry) => {
  open();
  const info = db.prepare('INSERT INTO admin_audit (at, actor, action, target, details) VALUES (?, ?, ?, ?, ?)')
    .run(Number(entry.at || Date.now()), String(entry.actor || '管理员'), String(entry.action),
      String(entry.target || ''), encode(entry.details || {}));
  return Number(info.lastInsertRowid);
};

const listAudit = (limit = 100) => {
  open();
  return db.prepare('SELECT id, at, actor, action, target, details FROM admin_audit ORDER BY id DESC LIMIT ?')
    .all(Math.max(1, Math.min(500, Number(limit) || 100))).map((row) => ({ ...row, details: JSON.parse(row.details) }));
};

const saveAdminSession = (session) => {
  open();
  const sidHash = String(session.sidHash || '');
  const csrf = String(session.csrf || '');
  const actor = String(session.actor || '管理员');
  const createdAt = Number(session.createdAt || Date.now());
  const expiresAt = Number(session.expiresAt || 0);
  if (!/^[0-9a-f]{64}$/.test(sidHash) || !/^[0-9a-f]{64}$/.test(csrf)
      || !Number.isSafeInteger(expiresAt) || expiresAt <= createdAt) {
    throw new Error('后台会话数据无效');
  }
  db.prepare(`INSERT INTO admin_sessions (sid_hash, csrf, actor, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(sid_hash) DO UPDATE SET csrf=excluded.csrf, actor=excluded.actor,
      created_at=excluded.created_at, expires_at=excluded.expires_at`)
    .run(sidHash, csrf, actor.slice(0, 64), createdAt, expiresAt);
};

const getAdminSession = (sidHash, now = Date.now()) => {
  open();
  const hash = String(sidHash || '');
  if (!/^[0-9a-f]{64}$/.test(hash)) return null;
  const row = db.prepare(`SELECT sid_hash sidHash, csrf, actor, created_at createdAt, expires_at expiresAt
    FROM admin_sessions WHERE sid_hash=?`).get(hash);
  if (!row) return null;
  if (Number(row.expiresAt) <= Number(now)) {
    db.prepare('DELETE FROM admin_sessions WHERE sid_hash=?').run(hash);
    return null;
  }
  return { ...row, createdAt: Number(row.createdAt), expiresAt: Number(row.expiresAt) };
};

const deleteAdminSession = (sidHash) => {
  open();
  return db.prepare('DELETE FROM admin_sessions WHERE sid_hash=?').run(String(sidHash || '')).changes > 0;
};

const clearAdminSessions = () => {
  open();
  return db.prepare('DELETE FROM admin_sessions').run().changes;
};

const pruneAdminSessions = (now = Date.now()) => {
  open();
  return db.prepare('DELETE FROM admin_sessions WHERE expires_at<=?').run(Number(now)).changes;
};

const appendAgentApplication = (entry) => {
  open();
  const application = {
    uid: Number(entry.uid),
    nickname: String(entry.nickname || ''),
    contact: String(entry.contact || ''),
    contactType: String(entry.contactType || ''),
    createdAt: Number(entry.createdAt || Date.now()),
  };
  const recent = db.prepare(`SELECT id, uid, nickname, contact, contact_type contactType, created_at createdAt
    FROM agent_applications WHERE uid=? AND contact=? AND created_at>=?
    ORDER BY id DESC LIMIT 1`).get(application.uid, application.contact, application.createdAt - 60000);
  if (recent) return { ...recent, duplicate: true };
  const result = db.prepare(`INSERT INTO agent_applications
    (uid, nickname, contact, contact_type, created_at) VALUES (?, ?, ?, ?, ?)`)
    .run(application.uid, application.nickname, application.contact, application.contactType, application.createdAt);
  return { id: Number(result.lastInsertRowid), ...application, duplicate: false };
};

const listAgentApplications = ({ q = '', page = 1, limit = 25 } = {}) => {
  open();
  const term = String(q).trim().slice(0, 64);
  const pattern = `%${term.replace(/[\\%_]/g, '\\$&')}%`;
  const pageNumber = Math.max(1, Math.min(100000, Number(page) || 1));
  const size = Math.max(10, Math.min(100, Number(limit) || 25));
  const where = `(? = '' OR CAST(uid AS TEXT) LIKE ? ESCAPE '\\' OR nickname LIKE ? ESCAPE '\\'
    OR contact LIKE ? ESCAPE '\\' OR contact_type LIKE ? ESCAPE '\\')`;
  const args = [term, pattern, pattern, pattern, pattern];
  const total = Number(db.prepare(`SELECT COUNT(*) n FROM agent_applications WHERE ${where}`).get(...args).n);
  const rows = db.prepare(`SELECT id, uid, nickname, contact, contact_type contactType, created_at createdAt
    FROM agent_applications WHERE ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...args, size, (pageNumber - 1) * size);
  return { items: rows, total, page: pageNumber, limit: size };
};

const archiveRecord = (record) => {
  open();
  const compact = { ...record, playbackIds: Object.keys(record.playbacks || {}) };
  delete compact.playbacks;
  const write = db.transaction(() => {
    const inserted = db.prepare('INSERT OR IGNORE INTO record_history (id, room_id, club_id, time, data) VALUES (?, ?, ?, ?, ?)')
      .run(String(record.id), Number(record.roomId), Number(record.clubId || 0), Number(record.time), encode(compact));
    if (inserted.changes) for (const uid of new Set(record.uids || [])) {
      db.prepare('INSERT OR IGNORE INTO record_history_player (record_id, uid) VALUES (?, ?)')
        .run(String(record.id), Number(uid));
    }
    return !!inserted.changes;
  });
  return write();
};

const backfillRecords = (records) => {
  let added = 0;
  for (const record of records || []) if (archiveRecord(record)) added++;
  return added;
};

const listRecordHistory = ({ q = '', page = 1, limit = 25 } = {}) => {
  open();
  const term = String(q).trim().slice(0, 64);
  const pattern = `%${term.replace(/[\\%_]/g, '\\$&')}%`;
  const pageNumber = Math.max(1, Math.min(100000, Number(page) || 1));
  const size = Math.max(1, Math.min(100, Number(limit) || 25));
  const where = `(? = '' OR CAST(room_id AS TEXT) LIKE ? ESCAPE '\\' OR id LIKE ? ESCAPE '\\'
    OR EXISTS (SELECT 1 FROM record_history_player p WHERE p.record_id = record_history.id
      AND CAST(p.uid AS TEXT) LIKE ? ESCAPE '\\'))`;
  const args = [term, pattern, pattern, pattern];
  const total = db.prepare(`SELECT COUNT(*) n FROM record_history WHERE ${where}`).get(...args).n;
  const rows = db.prepare(`SELECT data FROM record_history WHERE ${where} ORDER BY time DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...args, size, (pageNumber - 1) * size);
  return { items: rows.map((row) => JSON.parse(row.data)), total, page: pageNumber, limit: size };
};

const getRecordHistory = (id) => {
  open();
  const row = db.prepare('SELECT data FROM record_history WHERE id = ?').get(String(id));
  return row ? JSON.parse(row.data) : null;
};

const listPlayerRecordHistory = (uid, limit = 10) => {
  open();
  return db.prepare(`SELECT h.data FROM record_history h JOIN record_history_player p ON p.record_id=h.id
    WHERE p.uid=? ORDER BY h.time DESC, h.id DESC LIMIT ?`)
    .all(Number(uid), Math.max(1, Math.min(100, Number(limit) || 10)))
    .map((row) => JSON.parse(row.data));
};

const recordHistoryStats = (since) => {
  open();
  const total = db.prepare('SELECT COUNT(*) n FROM record_history').get().n;
  const days = db.prepare(`SELECT date(time / 1000 + 8 * 3600, 'unixepoch') day, COUNT(*) n
    FROM record_history WHERE time >= ? GROUP BY day`).all(Number(since));
  return { total, days: Object.fromEntries(days.map((item) => [item.day, item.n])) };
};

const close = () => {
  if (!db) return;
  db.close();
  db = null;
  statements = null;
};

module.exports = { FILE, LEGACY_FILE, load, save, saveAsync, backup, appendAudit, listAudit,
  saveAdminSession, getAdminSession, deleteAdminSession, clearAdminSessions, pruneAdminSessions,
  appendAgentApplication, listAgentApplications,
  archiveRecord, backfillRecords, listRecordHistory, listPlayerRecordHistory,
  getRecordHistory, recordHistoryStats, close };
