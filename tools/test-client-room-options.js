#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const config = fs.readFileSync(
  path.join(root, 'client-release-source/assets/Script/Recovered/RoomConfig.js'),
  'utf8',
);
const cells = fs.readFileSync(
  path.join(root, 'client-release-source/assets/Script/Recovered/RoomConfigCellData.js'),
  'utf8',
);
const gameConstant = fs.readFileSync(
  path.join(root, 'client-release-source/assets/Script/Recovered/GameConstant.js'),
  'utf8',
);
const qjshzLogic = fs.readFileSync(
  path.join(root, 'client-release-source/assets/Script/Recovered/GameLogicWSK_QJSHZ.js'),
  'utf8',
);

const qjhhStart = config.indexOf('2: {\nindex: 2,');
const qjhhEnd = config.indexOf('\n3: {\nindex: 3,', qjhhStart);
const qjhh = config.slice(qjhhStart, qjhhEnd);
const zimo = qjhh.match(/20:\s*\{[\s\S]*?\n\}/)?.[0] || '';
assert(zimo.includes('desc: "只许自摸"'), '潜江癞晃/干瞪眼缺少“只许自摸”选项');
assert(!zimo.includes('isHide'), '“只许自摸”仍被隐藏');
assert(qjhh.includes('desc: "干瞪眼"'), '第二种玩法没有显示为“干瞪眼”');
assert(qjhh.includes('defCheck: [ 2 ],\n' +
  'detailIds: [ 2, 1 ]'), '玩法顺序不是“干瞪眼、潜江癞晃”');
assert(qjhh.includes('defCheck: [ 20, 21, 23, 24 ]'),
  '干瞪眼默认设置没有勾选只许自摸、热铳和双大胡');
assert(
  cells.includes('this.index === l.eGameIds.QJHH && 20 === e && !this.isChecked(20) && !this.isChecked(21)'),
  '取消“只许自摸”后没有自动勾选热铳',
);
assert(
  cells.includes('for (var q = [ 20, 21, 23 ], p = 0; p < q.length; p++)'),
  '切换到干瞪眼时没有恢复三个默认规则',
);
assert(
  gameConstant.includes('gameList: [ c.eGameIds.QJHH, c.eGameIds.QJSHZ ]'),
  '大厅没有同时显示干瞪眼和说胡子',
);
const qjshzStart = config.indexOf('17: {\nindex: 16,');
const qjshzEnd = config.indexOf('\n18: {\nindex: 18,', qjshzStart);
const qjshz = config.slice(qjshzStart, qjshzEnd);
assert(qjshz.includes('desc: "8张炸大过四大天王"'),
  '说胡子缺少“8张炸大过四大天王”选项');
assert(qjshz.includes('detailIds: [ 15, 16, 22, 17, 20 ]'),
  '说胡子八炸选项没有显示在创建房间页');
assert(qjshz.includes('desc: ""')
  && qjshz.includes('detailIds: [ 24, 25, 26, 27 ]'),
  '说胡子建房页没有四项独立喜钱设置');
assert(qjshzLogic.includes('m += 100 + z[0] * 1e3 + z[1] * 1e6')
  && qjshzLogic.includes('r[27] = Math.floor(o / 1e12) % 1e3;'),
  '说胡子喜钱金额没有准确写入和读出房间配置');
assert(qjshzLogic.includes('return "喜钱：6炸"'),
  '房间设置详情里的喜钱标签应和其他项目一样使用冒号');
const tableRuleDesc = qjshzLogic.slice(
  qjshzLogic.indexOf('t.prototype.tableRuleDesc = function(e) {'),
  qjshzLogic.indexOf('t.prototype.init = function(e) {'),
);
assert(!tableRuleDesc.includes('isChecked(23)')
  && !tableRuleDesc.includes('xiRuleText'),
  '牌桌顶部不应显示喜钱或炸弹计分文字');
assert(qjshzLogic.includes('this._isBomb8BiggerKing = e.isChecked(22)'),
  '说胡子客户端没有应用八炸大过四大天王选项');
assert(qjshzLogic.includes('if (e.cards.length !== o.length) return !1;'),
  '说胡子客户端没有限制连对/飞机必须等长');
assert(qjshzLogic.includes('if (e.type !== n) return !0;'),
  '说胡子客户端错误地用连对/飞机长度限制过滤炸弹');
assert(!qjshzLogic.includes('WSK_Double_Fang'), '说胡子仍然保留了规则中没有的六张真五十K');

// Exercise the actual recovered room-config model rather than duplicating its
// increment formula in the test.
const cellModule = { exports: {} };
vm.runInNewContext(cells, {
  module: cellModule,
  exports: cellModule.exports,
  cc: { _RF: { push() {}, pop() {} } },
  require(name) {
    if (name === './RoomConfig') return { default: { 17: { options: {
      24: { style: 2 }, 25: { style: 2 }, 26: { style: 2 }, 27: { style: 2 },
    } } } };
    if (name === './CommonUtils') return { default: { clone: (value) => JSON.parse(JSON.stringify(value)) } };
    if (name === './gContext') return { default: { eventUtils: { emit() {} } } };
    if (name === './EventKeys') return { default: { ui_create_room_item_clicked: 'click' } };
    if (name === './CommonEnum') return { eGameIds: { QJSHZ: 17 } };
    throw new Error(`未知房间配置依赖：${name}`);
  },
});
const xiCell = new cellModule.exports.default({ index: 17, ids: [], other: {} });
for (const amount of [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150]) {
  xiCell.onClickAdd(24);
  assert.equal(xiCell.getValue(24), amount, '喜钱加号步长错误');
}
for (const amount of [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0]) {
  xiCell.onClickSub(24);
  assert.equal(xiCell.getValue(24), amount, '喜钱减号反向步长错误');
}

console.log('干瞪眼/潜江癞晃选项与说胡子规则选项检查通过');
