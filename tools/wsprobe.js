#!/usr/bin/env node
/**
 * 假客户端：按原版客户端的帧格式和 proto id 打一遍登录流程，
 * 用来在不开模拟器的情况下验证服务端的编解码。
 *
 * 走的是和客户端同一份 `server/proto/pb.js`，所以这只能验证帧格式和
 * 业务字段——**验证不了**两边用了不同 protobuf 实现的情况（但我们本来就同一份）。
 *
 * usage: node tools/wsprobe.js [ws://主机:端口/ws]
 */
const WebSocket = require('ws');
const { protocol } = require('../server/proto/protocol');
const { pb } = require('../server/proto/pb');

const URL = process.argv[2] || 'ws://127.0.0.1:8899/ws';
const nameOf = (t) => Object.keys(pb).find((k) => pb[k] === t) || '?';

const frame = (proto, obj) => {
  const cs = protocol[proto].cs;
  const payload = cs ? Buffer.from(cs.encode(cs.create(obj)).finish()) : Buffer.alloc(0);
  const buf = Buffer.alloc(12 + payload.length);
  buf.writeUInt32BE(proto, 0);
  buf.writeUInt32BE(0, 4);
  buf.writeUInt32BE(buf.length, 8);
  payload.copy(buf, 12);
  return buf;
};

const ws = new WebSocket(URL);
const 待发 = [
  [100, { token: process.env.TOKEN || 't_2_100001' }],
  [113, {}],
];
let i = 0;

ws.on('open', () => {
  console.log(`连上 ${URL}`);
  ws.send(frame(...待发[i]));
  console.log(`-> ${待发[i][0]} ${nameOf(protocol[待发[i][0]].cs)}`, 待发[i][1]);
});

ws.on('message', (data) => {
  const buf = Buffer.from(data);
  const proto = buf.readUInt32BE(0);
  const len = buf.readUInt32BE(8);
  if (len !== buf.length) console.error(`  !! 长度字段 ${len} 与实际 ${buf.length} 不符`);
  const sc = protocol[proto] && protocol[proto].sc;
  const msg = sc ? sc.toObject(sc.decode(buf.subarray(12, len)), { longs: Number, defaults: true }) : null;
  console.log(`<- ${proto} ${nameOf(sc)}`, JSON.stringify(msg));

  if (++i < 待发.length) {
    ws.send(frame(...待发[i]));
    console.log(`-> ${待发[i][0]} ${nameOf(protocol[待发[i][0]].cs)}`, 待发[i][1]);
  } else {
    ws.close();
  }
});

ws.on('close', () => console.log('断开'));
ws.on('error', (e) => {
  console.error('连接失败:', e.message);
  process.exit(1);
});
