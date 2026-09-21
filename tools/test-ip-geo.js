#!/usr/bin/env node
const assert = require('assert/strict');
const { normalizeIp, isPrivateIp, clientIp, locationFromResponse, IpGeoService } = require('../server/ip-geo');

let passed = 0;
const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); passed++; };

const run = async () => {
  check('清理 IPv4 映射地址', normalizeIp('::ffff:114.117.178.215'), '114.117.178.215');
  check('识别内网 IPv4', isPrivateIp('192.168.1.8'), true);
  check('公网直连不信任伪造代理头', clientIp({
    socket: { remoteAddress: '114.117.178.215' }, headers: { 'x-real-ip': '8.8.8.8' },
  }), '114.117.178.215');
  check('本机反代读取真实 IP', clientIp({
    socket: { remoteAddress: '127.0.0.1' }, headers: { 'x-real-ip': '43.132.230.5' },
  }), '43.132.230.5');
  check('省市格式去重', locationFromResponse({
    success: true, country: '中国', region: '湖北省', city: '武汉市',
  }), '湖北省 武汉市');

  let requests = 0;
  const geo = new IpGeoService({
    searcher: { search() { requests++; return {
      country: '中国', province: '湖北省', city: '潜江市',
    }; } },
  });
  const [first, second] = await Promise.all([geo.lookup('114.117.178.215'), geo.lookup('114.117.178.215')]);
  check('归属地查询返回省市', [first, second], ['湖北省 潜江市', '湖北省 潜江市']);
  check('相同 IP 只查一次离线库', requests, 1);
  check('内网地址不查询离线库', await geo.lookup('10.0.0.2'), '内网');
  check('查询结果命中缓存', await geo.lookup('114.117.178.215'), '湖北省 潜江市');
  check('缓存后请求次数不增加', requests, 1);
  console.log(`\n${passed} 过 / 0 挂`);
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
