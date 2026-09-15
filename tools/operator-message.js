#!/usr/bin/env node
const fs = require('fs');
const { execFileSync } = require('child_process');

const action = process.argv[2];
const option = (name, fallback = '') => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || '' : fallback;
};

let input = '';
const args = ['-o', 'BatchMode=yes', 'qj-server', 'node', '/opt/qjqp/server/operator-client.js'];
if (action === 'send') {
  const contentFile = option('content-file');
  const content = contentFile ? fs.readFileSync(contentFile, 'utf8') : option('content');
  input = JSON.stringify({
    title: option('title'), content,
    targetUid: Number(option('uid', '0')),
    days: Number(option('days', '30')),
  });
  args.push('send');
} else if (action === 'list') {
  args.push('list');
} else if (action === 'delete' && /^\d+$/.test(option('id'))) {
  args.push('delete', option('id'));
} else {
  console.error('用法：node tools/operator-message.js send --title 标题 --content 正文 [--uid 玩家ID] [--days 有效天数]\n' +
    '      node tools/operator-message.js send --title 标题 --content-file 正文文件\n' +
    '      node tools/operator-message.js list\n' +
    '      node tools/operator-message.js delete --id 消息编号');
  process.exit(2);
}

try {
  const output = execFileSync('ssh', args, { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
  process.stdout.write(output);
} catch (error) {
  if (error.stdout) process.stdout.write(error.stdout);
  process.exitCode = error.status || 1;
}
