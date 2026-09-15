#!/usr/bin/env node
// 仅供 SSH 管理员在服务器本机使用；密钥不会输出或发往公网。
const fs = require('fs');
const http = require('http');

const keyFile = process.env.QJQP_OPERATOR_KEY_FILE || '/var/lib/qjqp/operator.key';
const key = fs.readFileSync(keyFile, 'utf8').trim();
const action = process.argv[2];
const id = process.argv[3];
const method = action === 'send' ? 'POST' : action === 'delete' ? 'DELETE' : 'GET';
const route = action === 'delete' ? `/operator/messages/${id}` : '/operator/messages';

if (!['send', 'list', 'delete'].includes(action) || (action === 'delete' && !/^\d+$/.test(String(id)))) {
  console.error('用法：operator-client.js send|list|delete [消息编号]');
  process.exit(2);
}

const payload = action === 'send' ? fs.readFileSync(0) : Buffer.alloc(0);
const request = http.request({
  hostname: '127.0.0.1', port: Number(process.env.PORT) || 8899,
  path: route, method,
  headers: {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Content-Length': payload.length,
  },
}, (response) => {
  const chunks = [];
  response.on('data', (chunk) => chunks.push(chunk));
  response.on('end', () => {
    const body = Buffer.concat(chunks).toString('utf8');
    process.stdout.write(`${body}\n`);
    if (response.statusCode >= 400) process.exitCode = 1;
  });
});
request.on('error', (error) => {
  console.error(`本地运营接口请求失败：${error.message}`);
  process.exitCode = 1;
});
request.end(payload);
