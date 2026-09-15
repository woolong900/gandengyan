#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { passwordRecord } = require('../server/admin-auth');

const filename = process.argv[2] || process.env.QJQP_ADMIN_AUTH_FILE;
if (!filename) {
  console.error('用法：node tools/admin-set-password.js /绝对路径/admin-password.json < 密码文件');
  process.exit(2);
}
const password = fs.readFileSync(0, 'utf8').replace(/[\r\n]+$/, '');
const record = passwordRecord(password);
fs.mkdirSync(path.dirname(filename), { recursive: true });
fs.writeFileSync(filename, JSON.stringify(record), { mode: 0o600 });
fs.chmodSync(filename, 0o600);
console.log(`管理员密码记录已写入 ${filename}，密码原文未保存`);
