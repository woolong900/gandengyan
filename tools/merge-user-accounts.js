#!/usr/bin/env node
/**
 * 合并两个已人工确认属于同一人的玩家账号。
 *
 * 默认只预览；必须显式传 --apply 才会写库。执行写入时应先停服务并备份
 * SQLite 数据库，避免并发保存覆盖迁移结果。
 */

const args = process.argv.slice(2);
const valueAfter = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
};

const dbFile = valueAfter('--db');
if (dbFile) process.env.QJQP_DB = dbFile;

const Database = require('better-sqlite3');
const store = require('../server/store');

const uniqueStrings = (...values) => [...new Set(values.flat()
  .map((value) => String(value || '').trim()).filter(Boolean))];

const uniqueWechatIdentities = (...values) => {
  const out = [];
  const seen = new Set();
  for (const identity of values.flat()) {
    if (!identity || typeof identity !== 'object') continue;
    const appId = String(identity.appId || '').trim();
    const openid = String(identity.openid || '').trim();
    if (!appId || !openid) continue;
    const key = `${appId}\n${openid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      appId, openid, unionid: String(identity.unionid || '').trim(),
      linkedAt: Number(identity.linkedAt || 0),
    });
  }
  return out;
};

const replaceUidDeep = (value, duplicateUid, primaryUid) => {
  if (typeof value === 'number') return value === duplicateUid ? primaryUid : value;
  if (Array.isArray(value)) return value.map((item) => replaceUidDeep(item, duplicateUid, primaryUid));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .map(([key, item]) => [key, replaceUidDeep(item, duplicateUid, primaryUid)]));
};

const recordHasUid = (record, uid) => (record.uids || []).some((item) => Number(item) === uid)
  || (record.players || []).some((item) => Number(item.uid) === uid);

const activeRoomHasUid = (room, uid) => Number(room.host) === uid
  || Number(room.creatorUid) === uid
  || Number(room.dealerUid) === uid
  || (room.members || []).some((member) => Number(member.uid) === uid);

const clubHasUid = (club, uid) => Number(club.ownerUid) === uid
  || (club.members || []).some((member) => Number(member.uid) === uid)
  || (club.applications || []).some((item) => Number(item.uid) === uid)
  || (club.invites || []).some((item) => Number(item.uid) === uid || Number(item.toUid) === uid);

const positiveMinimum = (...values) => {
  const positive = values.map(Number).filter((value) => Number.isFinite(value) && value > 0);
  return positive.length ? Math.min(...positive) : 0;
};

const mergeState = (state, primaryUid, duplicateUid) => {
  if (!Number.isSafeInteger(primaryUid) || !Number.isSafeInteger(duplicateUid)
    || primaryUid <= 0 || duplicateUid <= 0 || primaryUid === duplicateUid) {
    throw new Error('主 UID 和待合并 UID 必须是不同的正整数');
  }
  const primary = state.players.find((player) => Number(player.uid) === primaryUid);
  const duplicate = state.players.find((player) => Number(player.uid) === duplicateUid);
  if (!primary || !duplicate) throw new Error('主账号或待合并账号不存在');
  if (primary.bot || duplicate.bot) throw new Error('不能合并机器人账号');
  // 保留账号可以继续在房间/俱乐部中，因为它的 UID 不会变。
  // 只有即将被删除的旧账号存在活动引用时才必须拒绝。
  if (Number(duplicate.roomId || 0)) {
    throw new Error('待合并账号仍关联房间，请先解散或退出房间');
  }
  if ((state.rooms || []).some((room) => activeRoomHasUid(room, duplicateUid))) {
    throw new Error('待合并账号仍在活动房间中，拒绝合并');
  }
  if (((state.clubs && state.clubs.clubs) || [])
    .some((club) => clubHasUid(club, duplicateUid))) {
    throw new Error('待合并账号仍关联俱乐部，需先人工确定俱乐部身份合并方式');
  }

  primary.cardNum = Math.max(Number(primary.cardNum || 0), Number(duplicate.cardNum || 0));
  primary.createdAt = positiveMinimum(primary.createdAt, duplicate.createdAt);
  primary.lastLoginAt = Math.max(Number(primary.lastLoginAt || 0), Number(duplicate.lastLoginAt || 0));
  primary.readMessageIds = [...new Set([...(primary.readMessageIds || []), ...(duplicate.readMessageIds || [])]
    .map(Number).filter(Number.isSafeInteger))];
  primary.wechatOpenids = uniqueStrings(
    primary.wechatOpenids || [], primary.wechatOpenid,
    duplicate.wechatOpenids || [], duplicate.wechatOpenid,
  );
  primary.wechatUnionids = uniqueStrings(
    primary.wechatUnionids || [], primary.wechatUnionid,
    duplicate.wechatUnionids || [], duplicate.wechatUnionid,
  );
  primary.wechatIdentities = uniqueWechatIdentities(
    primary.wechatIdentities || [], duplicate.wechatIdentities || [],
  );
  primary.tokenAliases = uniqueStrings(primary.tokenAliases || [], duplicate.tokenAliases || [], duplicate.token)
    .filter((token) => token !== primary.token);
  primary.inviteCodeAliases = uniqueStrings(
    primary.inviteCodeAliases || [], duplicate.inviteCodeAliases || [], duplicate.inviteCode,
  ).map((code) => code.toUpperCase()).filter((code) => /^[A-Z]{5}$/.test(code) && code !== primary.inviteCode);
  if (!primary.invitedBy && duplicate.invitedBy) primary.invitedBy = duplicate.invitedBy;
  if (!primary.identityVerified && duplicate.identityVerified) {
    for (const key of ['identityVerified', 'identityNameInitial', 'identityNameHash', 'identityIdHash']) {
      primary[key] = duplicate[key];
    }
  }

  state.players = state.players.filter((player) => Number(player.uid) !== duplicateUid);
  let changedRecords = 0;
  state.records = (state.records || []).map((record) => {
    if (!recordHasUid(record, duplicateUid)) return record;
    changedRecords += 1;
    return replaceUidDeep(record, duplicateUid, primaryUid);
  });
  let changedMessages = 0;
  state.operatorMessages = (state.operatorMessages || []).map((message) => {
    if (Number(message.targetUid || 0) !== duplicateUid) return message;
    changedMessages += 1;
    return { ...message, targetUid: primaryUid };
  });
  return { state, primary, changedRecords, changedMessages };
};

const migrateHistory = (database, primaryUid, duplicateUid) => database.transaction(() => {
  const rows = database.prepare(`SELECT h.id, h.data FROM record_history h
    JOIN record_history_player p ON p.record_id=h.id WHERE p.uid=?`).all(duplicateUid);
  const update = database.prepare('UPDATE record_history SET data=? WHERE id=?');
  for (const row of rows) {
    const record = JSON.parse(row.data);
    update.run(JSON.stringify(replaceUidDeep(record, duplicateUid, primaryUid)), row.id);
  }
  database.prepare(`INSERT OR IGNORE INTO record_history_player(record_id, uid)
    SELECT record_id, ? FROM record_history_player WHERE uid=?`).run(primaryUid, duplicateUid);
  database.prepare('DELETE FROM record_history_player WHERE uid=?').run(duplicateUid);
  const applications = database.prepare('UPDATE agent_applications SET uid=? WHERE uid=?')
    .run(primaryUid, duplicateUid).changes;
  database.prepare(`INSERT INTO admin_audit(at, actor, action, target, details)
    VALUES (?, ?, ?, ?, ?)`).run(
    Date.now(), '系统', 'merge_player_accounts', String(primaryUid),
    JSON.stringify({ primaryUid, duplicateUid, archivedRecords: rows.length, applications }),
  );
  return { archivedRecords: rows.length, applications };
})();

const run = () => {
  const primaryUid = Number(valueAfter('--primary'));
  const duplicateUid = Number(valueAfter('--duplicate'));
  const apply = args.includes('--apply');
  const state = store.load();
  const result = mergeState(state, primaryUid, duplicateUid);
  const preview = {
    mode: apply ? 'apply' : 'dry-run',
    database: store.FILE,
    primaryUid,
    duplicateUid,
    mergedBalance: result.primary.cardNum,
    wechatOpenidCount: result.primary.wechatOpenids.length,
    wechatUnionidCount: result.primary.wechatUnionids.length,
    tokenAliasCount: result.primary.tokenAliases.length,
    inviteCodeAliases: result.primary.inviteCodeAliases,
    currentRecords: result.changedRecords,
    targetedMessages: result.changedMessages,
  };
  if (!apply) {
    console.log(JSON.stringify(preview, null, 2));
    console.log('预览完成，未写入数据库。');
    store.close();
    return;
  }
  store.save(result.state);
  store.close();
  const database = new Database(store.FILE);
  database.pragma('foreign_keys = ON');
  const history = migrateHistory(database, primaryUid, duplicateUid);
  database.close();
  console.log(JSON.stringify({ ...preview, ...history }, null, 2));
  console.log('账号合并完成。');
};

if (require.main === module) {
  try { run(); } catch (error) {
    try { store.close(); } catch (_) { /* ignore close failure */ }
    console.error(`账号合并失败：${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { mergeState, replaceUidDeep, recordHasUid, activeRoomHasUid, clubHasUid };
