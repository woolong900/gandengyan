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
  nextSupportMessageId: 1,
  players: [],
  operatorMessages: [],
  supportConversations: [],
  publicNotices: { hallMarquee: '', serviceWechat: '', serviceQQ: '' },
  economySettings: {
    newPlayerCards: 200,
    clubJoinBonus: 200,
    inviteBindBonus: 1000,
    invitePageText: '绑定推荐人邀请码，可获得1000张房卡！',
  },
  botSettings: {
    enabled: process.env.QJQP_FILLBOTS !== '0',
    mode: process.env.QJQP_BOT_MODE || 'local',
    trusteeWhitelist: [],
    recordCardWhitelist: [],
    stats: {
      local: { rounds: 0, wins: 0, draws: 0, score: 0 },
      jev: { rounds: 0, wins: 0, draws: 0, score: 0 },
    },
  },
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
    nextSupportMessageId: Number(raw.nextSupportMessageId) || base.nextSupportMessageId,
    players: Array.isArray(raw.players) ? raw.players : [],
    operatorMessages: Array.isArray(raw.operatorMessages) ? raw.operatorMessages : [],
    supportConversations: Array.isArray(raw.supportConversations) ? raw.supportConversations : [],
    publicNotices: raw.publicNotices && typeof raw.publicNotices === 'object' ? raw.publicNotices : base.publicNotices,
    economySettings: raw.economySettings && typeof raw.economySettings === 'object'
      ? raw.economySettings : base.economySettings,
    botSettings: raw.botSettings && typeof raw.botSettings === 'object'
      ? raw.botSettings : base.botSettings,
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
  // WAL + NORMAL：断电最多丢失最后几次提交，不会损坏数据库；省去每次提交的 fsync。
  db.pragma('synchronous = NORMAL');
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
      next_support_message_id INTEGER NOT NULL DEFAULT 1,
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
    CREATE TABLE IF NOT EXISTS support_conversations (
      position INTEGER NOT NULL,
      uid INTEGER PRIMARY KEY,
      updated_at INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS support_conversations_updated_at ON support_conversations(updated_at DESC);
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
  if (!db.pragma('table_info(meta)').some((column) => column.name === 'next_support_message_id')) {
    db.exec('ALTER TABLE meta ADD COLUMN next_support_message_id INTEGER NOT NULL DEFAULT 1');
  }
  statements = {
    meta: db.prepare(`INSERT INTO meta
      (id, schema_version, next_uid, next_room_id, playback_seq, club_next_id, club_next_op_id,
        next_operator_message_id, next_support_message_id, updated_at)
      VALUES (1, 1, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        schema_version=excluded.schema_version,
        next_uid=excluded.next_uid,
        next_room_id=excluded.next_room_id,
        playback_seq=excluded.playback_seq,
        club_next_id=excluded.club_next_id,
        club_next_op_id=excluded.club_next_op_id,
        next_operator_message_id=excluded.next_operator_message_id,
        next_support_message_id=excluded.next_support_message_id,
        updated_at=excluded.updated_at`),
    publicNotices: db.prepare('INSERT INTO public_notices (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data'),
    economySettings: db.prepare('INSERT INTO economy_settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data'),
    botSettings: db.prepare('INSERT INTO bot_settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data'),
  };
  tableCache = new Map();
  return db;
};

/**
 * 增量保存：每张快照表按主键比对上次写入的 JSON，只 INSERT/UPDATE/DELETE 有变化的行。
 * position 只在新增时分配（追加到末尾），已有行保持原 position，load 时 ORDER BY position 顺序不变。
 * 无法保持顺序（中间插入、重排）或出现重复键、约束冲突时，该表回退为整表重写。
 */
const SNAPSHOT_TABLES = {
  players: { key: 'token', keyOf: (item) => String(item.token || ''),
    extraCols: ['uid', 'invite_code'], extras: (item) => [Number(item.uid), String(item.inviteCode || '')] },
  operator_messages: { key: 'id', keyOf: (item) => Number(item.id), extraCols: [], extras: () => [] },
  support_conversations: { key: 'uid', keyOf: (item) => Number(item.uid),
    extraCols: ['updated_at'], extras: (item) => [Number(item.updatedAt || 0)] },
  rooms: { key: 'room_id', keyOf: (item) => Number(item.roomId),
    extraCols: ['club_id'], extras: (item) => [Number(item.clubId || 0)] },
  records: { key: 'record_id', keyOf: (item) => String(item.id || ''),
    extraCols: ['time', 'club_id'], extras: (item) => [Number(item.time || 0), Number(item.clubId || 0)] },
  clubs: { key: 'club_id', keyOf: (item) => Number(item.id),
    extraCols: ['owner_uid'], extras: (item) => [Number(item.ownerUid || 0)] },
};

// 表名 → Map(key → { position, json, extras })，代表数据库当前内容；open() 时清空，首次写入时从库里读回。
let tableCache = new Map();
const tableStatements = new Map();
const writeStats = { inserted: 0, updated: 0, deleted: 0, rewrites: 0 };

const statementsFor = (table) => {
  if (tableStatements.has(table) && tableStatements.get(table).db === db) return tableStatements.get(table);
  const spec = SNAPSHOT_TABLES[table];
  const cols = [spec.key, ...spec.extraCols, 'data'];
  const set = [...spec.extraCols, 'data'].map((col) => `${col}=?`).join(', ');
  const prepared = {
    db,
    insert: db.prepare(`INSERT INTO ${table} (position, ${cols.join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})`),
    update: db.prepare(`UPDATE ${table} SET ${set} WHERE ${spec.key}=?`),
    remove: db.prepare(`DELETE FROM ${table} WHERE ${spec.key}=?`),
    clear: db.prepare(`DELETE FROM ${table}`),
    all: db.prepare(`SELECT position, ${cols.join(', ')} FROM ${table}`),
  };
  tableStatements.set(table, prepared);
  return prepared;
};

const cacheFor = (table) => {
  if (tableCache.has(table)) return tableCache.get(table);
  const spec = SNAPSHOT_TABLES[table];
  const cache = new Map();
  for (const row of statementsFor(table).all.all()) {
    const key = row[spec.key];
    if (cache.has(key)) { cache.clear(); cache.duplicate = true; break; }
    cache.set(key, { position: Number(row.position), json: row.data,
      extras: JSON.stringify(spec.extraCols.map((col) => row[col])) });
  }
  tableCache.set(table, cache);
  return cache;
};

const rewriteTable = (table, rows) => {
  const stmt = statementsFor(table);
  stmt.clear.run();
  const next = new Map();
  rows.forEach((row, position) => {
    stmt.insert.run(position, row.key, ...row.extras, row.json);
    next.set(row.key, { position, json: row.json, extras: JSON.stringify(row.extras) });
  });
  writeStats.rewrites++;
  writeStats.inserted += rows.length;
  return next;
};

/** 在当前事务中把一张表同步到 rows；返回写入后的新缓存（事务提交后才生效）。 */
const syncTable = (table, rows) => {
  const cache = cacheFor(table);
  const keys = new Set(rows.map((row) => row.key));
  if (cache.duplicate || keys.size !== rows.length) return rewriteTable(table, rows);

  // 已有行在新快照里的相对顺序必须不变，新行必须都在已有行之后。
  let lastPosition = -Infinity;
  let sawNew = false;
  for (const row of rows) {
    const old = cache.get(row.key);
    if (!old) { sawNew = true; continue; }
    if (sawNew || old.position <= lastPosition) return rewriteTable(table, rows);
    lastPosition = old.position;
  }

  const stmt = statementsFor(table);
  const next = new Map();
  let nextPosition = 0;
  for (const entry of cache.values()) nextPosition = Math.max(nextPosition, entry.position + 1);
  try {
    for (const key of cache.keys()) {
      if (!keys.has(key)) { stmt.remove.run(key); writeStats.deleted++; }
    }
    for (const row of rows) {
      const old = cache.get(row.key);
      const extras = JSON.stringify(row.extras);
      if (!old) {
        stmt.insert.run(nextPosition, row.key, ...row.extras, row.json);
        next.set(row.key, { position: nextPosition++, json: row.json, extras });
        writeStats.inserted++;
      } else {
        if (old.json !== row.json || old.extras !== extras) {
          stmt.update.run(...row.extras, row.json, row.key);
          writeStats.updated++;
        }
        next.set(row.key, { position: old.position, json: row.json, extras });
      }
    }
  } catch (error) {
    // 例如两个玩家互换 uid 触发唯一约束：同一事务内整表重写即可。
    if (!/constraint/i.test(String(error && error.code || error && error.message))) throw error;
    return rewriteTable(table, rows);
  }
  return next;
};

const snapshotRows = (table, items) => {
  const spec = SNAPSHOT_TABLES[table];
  return items.map((item) => ({ key: spec.keyOf(item), extras: spec.extras(item), json: encode(item) }));
};

const writeTransaction = (data) => {
  const state = normalize(data);
  open();
  // 先序列化，常见的数据错误不会触碰现有快照；事务负责兜底回滚。
  const tables = {
    players: snapshotRows('players', state.players),
    operator_messages: snapshotRows('operator_messages', state.operatorMessages),
    support_conversations: snapshotRows('support_conversations', state.supportConversations),
    rooms: snapshotRows('rooms', state.rooms),
    records: snapshotRows('records', state.records),
    clubs: snapshotRows('clubs', state.clubs.clubs),
  };
  const publicNotices = encode(state.publicNotices);
  const economySettings = encode(state.economySettings);
  const botSettings = encode(state.botSettings);
  const write = db.transaction(() => {
    statements.meta.run(
      state.nextUid, state.nextRoomId, state.playbackSeq,
      state.clubs.nextId, state.clubs.nextOpId, state.nextOperatorMessageId,
      state.nextSupportMessageId, Date.now(),
    );
    statements.publicNotices.run(publicNotices);
    statements.economySettings.run(economySettings);
    statements.botSettings.run(botSettings);
    const caches = new Map();
    for (const [table, rows] of Object.entries(tables)) caches.set(table, syncTable(table, rows));
    return caches;
  });
  let caches;
  try {
    caches = write();
  } catch (error) {
    tableCache = new Map(); // 回滚后缓存可能与库不一致，下次从库里重新读取。
    throw error;
  }
  for (const [table, cache] of caches) tableCache.set(table, cache);
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
    nextSupportMessageId: Number(meta.next_support_message_id),
    players: db.prepare('SELECT data FROM players ORDER BY position').all().map((row) => JSON.parse(row.data)),
    operatorMessages: db.prepare('SELECT data FROM operator_messages ORDER BY position').all().map((row) => JSON.parse(row.data)),
    supportConversations: db.prepare('SELECT data FROM support_conversations ORDER BY position').all()
      .map((row) => JSON.parse(row.data)),
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

const listRecordHistoryRange = (from, to) => {
  open();
  const start = Number(from);
  const end = Number(to);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) return [];
  return db.prepare(`SELECT data FROM record_history
    WHERE time >= ? AND time < ? ORDER BY time ASC, id ASC`)
    .all(start, end)
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
  tableCache = new Map();
  tableStatements.clear();
};

module.exports = { FILE, LEGACY_FILE, load, save, saveAsync, backup, appendAudit, listAudit,
  saveAdminSession, getAdminSession, deleteAdminSession, clearAdminSessions, pruneAdminSessions,
  appendAgentApplication, listAgentApplications,
  archiveRecord, backfillRecords, listRecordHistory, listPlayerRecordHistory, listRecordHistoryRange,
  getRecordHistory, recordHistoryStats, close, writeStats };
