#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');

global.cc = {
  _RF: { push() {}, pop() {} },
  error() {},
};

const root = path.join(__dirname, '..', 'client-release-source', 'assets', 'Script', 'Recovered');
const { eWSKRoundType } = require(path.join(root, 'WSKEnum.js'));
const SiteList = require(path.join(root, 'WSKSiteListData.js')).default;

const sites = new SiteList();
for (let pos = 0; pos < 4; pos++) sites.add({ pos, roundType: eWSKRoundType.Null });

// 同一墩里可以同时保留多名玩家的出牌展示。旧逻辑只能按座位推测，
// 会在特定座位顺序下拿到更早的单张，而不是刚打出的炸弹。
sites.get(1).roundType = eWSKRoundType.Put;
sites.get(3).roundType = eWSKRoundType.Put;
assert.equal(sites.getLastPut(0).pos, 3, '未记录时间顺序时仍保留旧版座位回退');

sites.setLastPut(1);
assert.equal(sites.getLastPut(0).pos, 1, '必须优先返回消息流中真实的最新出牌人');

sites.clearLastPut(3);
assert.equal(sites.getLastPut(0).pos, 1, '清理其他座位不能误清最新出牌记录');
sites.clearLastPut(1);
assert.equal(sites.getLastPut(0).pos, 3, '清理最新出牌后应回退到兼容逻辑');

console.log('说胡子客户端最新出牌定位测试通过');
