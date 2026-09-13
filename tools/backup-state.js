#!/usr/bin/env node
/** 对运行中的 SQLite 做一致性在线备份。 */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const store = require('../server/store');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const destination = path.resolve(process.argv[2]
  || path.join(path.dirname(store.FILE), 'backups', `state-${stamp}.sqlite`));

const main = async () => {
  if (fs.existsSync(destination)) throw new Error(`备份文件已存在：${destination}`);
  await store.backup(destination);
  const backup = new Database(destination, { readonly: true });
  try {
    const integrity = backup.pragma('integrity_check', { simple: true });
    if (integrity !== 'ok') throw new Error(`备份完整性检查失败：${integrity}`);
  } finally {
    backup.close();
  }
  console.log(`SQLite 备份完成：${destination}`);
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
}).finally(() => store.close());
