#!/usr/bin/env node
/** SQLite 存档、旧 JSON 自动迁移、事务回滚和备份。 */
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Database = require('better-sqlite3');
const { GameApp } = require('../server/app');
const { ADMIN } = require('../server/clubs');
const rules = require('../server/rules');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepStrictEqual(actual, expected, name);
  pass++;
};

const makeFixture = () => {
  const app = new GameApp({ now: () => 1720000000000 });
  const players = Array.from({ length: 4 }, () => {
    const login = app.http('/login', new URLSearchParams({ accountType: 'guest' }));
    return app.players.get(login.body.data.token);
  });
  const [owner, member, applicant, invited] = players;
  const { club } = app.clubStore.create(owner.uid, '存档测试俱乐部');
  app.clubStore.create(owner.uid, '第二个俱乐部');
  const approved = app.clubStore.apply(member.uid, club.code);
  app.clubStore.approve(owner.uid, approved.application.id);
  app.clubStore.setRole(owner.uid, club.id, member.uid, ADMIN);
  app.clubStore.freeze(owner.uid, club.id, member.uid, 1);
  app.clubStore.remark(owner.uid, club.id, member.uid, '恢复后保留备注');
  app.clubStore.edit(owner.uid, { id: club.id, announcement: '欢迎加入', quitApply: true });
  app.clubStore.apply(applicant.uid, club.code);
  app.clubStore.addInvite(owner.uid, club.id, invited.uid);
  const notice = app.createOperatorMessage({ title: '运营通知', content: '欢迎体验消息功能' }).message;
  member.readMessageIds.push(notice.id);
  club.schemes.push({
    id: app.clubStore.nextOpId++, name: '三人桌', gameType: 2, num: 2,
    ...rules.buildParam({ 人数: 3, 房费: 'AA' }), auto: true, color: 'blue',
  });
  return { app, club, owner, member, invited };
};

const main = async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-store-test-'));
  const dbFile = path.join(dir, 'nested', 'state.sqlite');
  const legacyFile = path.join(dir, 'legacy', 'state.json');
  const backupFile = path.join(dir, 'backup', 'state.sqlite');
  process.env.QJQP_DB = dbFile;
  process.env.QJQP_STATE = legacyFile;
  let store;
  try {
    const { app, club, owner, member, invited } = makeFixture();
    const snapshot = JSON.parse(JSON.stringify(app.dump()));
    fs.mkdirSync(path.dirname(legacyFile), { recursive: true });
    fs.writeFileSync(legacyFile, JSON.stringify(snapshot));

    // 环境变量必须在加载存储模块前设置。
    store = require('../server/store');
    t('SQLite 文件路径来自 QJQP_DB', store.FILE, dbFile);
    t('旧 JSON 路径保持兼容', store.LEGACY_FILE, legacyFile);
    t('首次读取自动导入旧 JSON', store.load(), snapshot);
    t('生成 SQLite 文件', fs.existsSync(dbFile), true);
    t('文件是 SQLite 数据库', fs.readFileSync(dbFile).subarray(0, 15).toString(), 'SQLite format 3');

    const inspect = new Database(dbFile, { readonly: true });
    try {
      t('启用 WAL', inspect.pragma('journal_mode', { simple: true }), 'wal');
      t('玩家分表保存', inspect.prepare('SELECT count(*) n FROM players').get().n, snapshot.players.length);
      t('运营通知分表保存', inspect.prepare('SELECT count(*) n FROM operator_messages').get().n, 1);
      t('俱乐部分表保存', inspect.prepare('SELECT count(*) n FROM clubs').get().n, snapshot.clubs.clubs.length);
      t('元数据只保存一行', inspect.prepare('SELECT count(*) n FROM meta').get().n, 1);
      t('消息编号序列写入元数据', inspect.prepare('SELECT next_operator_message_id id FROM meta').get().id, snapshot.nextOperatorMessageId);
    } finally {
      inspect.close();
    }

    // 导入只执行一次，旧文件后续变化不能覆盖 SQLite。
    fs.writeFileSync(legacyFile, JSON.stringify({ nextUid: 999999, players: [] }));
    t('旧 JSON 后续变化不覆盖数据库', store.load(), snapshot);

    const changed = JSON.parse(JSON.stringify(snapshot));
    changed.nextUid += 10;
    changed.players.pop();
    changed.records.push({ id: 'duplicate-ok', time: 1, clubId: club.id });
    changed.records.push({ id: 'duplicate-ok', time: 2, clubId: club.id });
    store.save(changed);
    t('同步事务保存完整快照', store.load(), changed);
    t('删除的数据不会残留', store.load().players.length, changed.players.length);
    t('战绩 ID 可重复并保持顺序', store.load().records.slice(-2).map((r) => r.time), [1, 2]);

    const beforeBadSave = store.load();
    const invalid = JSON.parse(JSON.stringify(beforeBadSave));
    invalid.players[1].cannotSerialize = 1n;
    assert.throws(() => store.save(invalid), /BigInt/);
    pass++;
    t('序列化失败后事务保留原快照', store.load(), beforeBadSave);

    const asyncState = JSON.parse(JSON.stringify(snapshot));
    asyncState.playbackSeq += 7;
    await store.saveAsync(asyncState);
    t('异步接口保存完整快照', store.load(), asyncState);
    const restored = new GameApp();
    restored.restore(store.load());
    t('恢复全部俱乐部、成员和方案', restored.dump(), asyncState);
    t('重启后保留通知及已读标记', [restored.operatorMessages.length, restored.playerByUid(member.uid).readMessageIds], [1, [snapshot.operatorMessages[0].id]]);
    t('恢复后成员仍能找到俱乐部', restored.clubStore.listFor(member.uid).map((c) => c.id), [club.id]);
    t('恢复后新俱乐部 ID 不重复', restored.clubStore.create(owner.uid, '恢复后新建').club.id, snapshot.clubs.nextId);
    t('恢复后新申请 ID 不重复', restored.clubStore.apply(invited.uid, club.code).application.id, snapshot.clubs.nextOpId);

    await store.backup(backupFile);
    const backupDb = new Database(backupFile, { readonly: true });
    try {
      t('在线备份包含全部玩家', backupDb.prepare('SELECT count(*) n FROM players').get().n, asyncState.players.length);
      t('在线备份通过完整性检查', backupDb.pragma('integrity_check', { simple: true }), 'ok');
    } finally {
      backupDb.close();
    }

    const finalDb = new Database(dbFile, { readonly: true });
    try {
      t('主数据库通过完整性检查', finalDb.pragma('integrity_check', { simple: true }), 'ok');
    } finally {
      finalDb.close();
    }
    console.log(`\n${pass} 过 / 0 挂`);
  } finally {
    if (store) store.close();
    delete process.env.QJQP_DB;
    delete process.env.QJQP_STATE;
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
