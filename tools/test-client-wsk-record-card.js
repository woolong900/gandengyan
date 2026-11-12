#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Component() {}
class Sprite {
  constructor() { this.enabled = true; }
}
class Graphics {
  clear() {}
  fillRect() {}
  fill() {}
}
class Label {
  constructor() { this.node = null; this.string = ''; }
}
Label.HorizontalAlign = { LEFT: 0, CENTER: 1 };
Label.VerticalAlign = { CENTER: 1 };
Label.Overflow = { SHRINK: 2 };

class Node {
  constructor(name = '') {
    this.name = name;
    this.children = [];
    this.components = [];
    this.active = true;
    this.anchorX = 0.5;
    this.x = 0;
    this.y = 0;
  }
  set parent(value) {
    this._parent = value;
    if (value) value.children.push(this);
  }
  get parent() { return this._parent; }
  addComponent(Type) {
    const component = new Type();
    component.node = this;
    this.components.push(component);
    return component;
  }
  getComponent(Type) { return this.components.find((item) => item instanceof Type) || null; }
  setContentSize(width, height) { this.width = width; this.height = height; }
  setPosition(x, y) { this.x = x; this.y = y; }
  removeAllChildren() { this.children = []; }
  on() {}
}
Node.EventType = { TOUCH_END: 'touch-end' };

const color = (r, g, b, a = 255) => ({ r, g, b, a });
global.cc = {
  _RF: { push() {}, pop() {} },
  _decorator: {
    ccclass(value) { return value; },
    property() { return () => {}; },
  },
  Component,
  Node,
  Sprite,
  Graphics,
  Label,
  color,
};

const fullDeck = [180, 180, 170, 170];
for (let value = 1; value <= 13; value++) {
  for (let suit = 1; suit <= 4; suit++) fullDeck.push(value * 10 + suit, value * 10 + suit);
}

const sites = [0, 1, 2, 3].map((pos) => ({
  pos,
  handCards: [],
  roundType: 0,
  putRealCards: [],
}));
sites[0].handCards = [180, 14];

const roomInfo = {
  isWatcher: () => false,
  config: {},
  recordCardWhitelisted: false,
  myAbsolutePos: () => 0,
  gameInfoWSK: {
    status: 2,
    allPutCards: [23],
    siteInfos: { get: (pos) => sites[pos] },
  },
};
let recordCardEnabled = true;
const eventHandlers = {};
const logic = {
  isRecordCard: () => recordCardEnabled,
  allCards: () => fullDeck.slice(),
  cardValue(card) {
    if (card === 170) return 16;
    if (card === 180) return 17;
    const value = Math.floor(card / 10);
    return value === 1 ? 14 : value === 2 ? 15 : value;
  },
  cardColor: (card) => (card >= 170 ? 5 : card % 10),
};
const removeArrayList = (source, removed) => {
  for (const card of removed) {
    const index = source.indexOf(card);
    if (index >= 0) source.splice(index, 1);
  }
  return source;
};
const stubs = {
  './RoomInfoData': { default: roomInfo },
  './EventUtils': { eOffType: { OnDestroy: 1 } },
  './GameLogicWSK': {
    WSK_Card_Value_DW: 17,
    WSK_Card_Value_XW: 16,
    WSK_Card_Value_2: 15,
    WSK_Card_Value_A: 14,
    WSK_Card_Value_K: 13,
    WSK_Card_Value_10: 10,
    WSK_Card_Value_5: 5,
    eWSKCardColor: { Hei: 4, Hong: 3, Mei: 2, Fang: 1 },
  },
  './CommonUtils': { default: { removeArrayList } },
  './SoundUtils': { default: { clickBtn() {} } },
  './gContext': { default: { gameLogic: () => logic, eventUtils: {
    on(key, handler) { eventHandlers[key] = handler; },
  } } },
  './WSKEnum': { eWSKGameStatus: { Free: 0, Calling: 1, Gameing: 2 }, eWSKRoundType: { Put: 2 } },
  './WSKEventKeys': { default: { data_round_change: 'round', data_status_change: 'status' } },
};

const file = path.join(__dirname, '..', 'client-release-source', 'assets', 'Script', 'Recovered', 'WSKRecordCardCtr.js');
const moduleBox = { exports: {} };
vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
  cc: global.cc,
  module: moduleBox,
  exports: moduleBox.exports,
  require: (name) => {
    if (!stubs[name]) throw new Error(`缺少测试依赖：${name}`);
    return stubs[name];
  },
  console,
}, { filename: file });

const Counter = moduleBox.exports.default;
const counter = new Counter();
counter.node = new Node('Counter');
counter.btnNode = new Node('Button');
counter.btnNode.addComponent(Sprite);
counter.detailsNode = new Node('Details');
counter.detailsNode.active = false;
counter.detailsNode.addComponent(Sprite);
counter.start();

assert.equal(counter._countLabels.length, 15, '应展示大王到 3 的 15 个点数');
assert.equal(counter._suitCountLabels.length, 4, '应展示四个花色明细');
assert.equal(counter._topNode.children.length, 15, '顶部不应保留三角形展开按钮');
assert.equal(counter._contentNode.children.find((node) => node.name === 'Suit0').width, 494,
  '中间花色记牌区应与顶部点数栏同宽');
assert.equal(counter._contentNode.children.length, 4, '应只保留四行花色余牌数量');
assert.equal(counter._contentNode.children.some((node) => node.name.startsWith('History')), false,
  '不应再显示玩家出牌记录');
assert.equal(counter._topNode.y, 56, '顶部应留出与左右一致的边框');
assert.equal(counter.detailsNode.height, 180, '删除出牌记录后应收紧面板高度');
assert.equal(counter._countLabels[0].fontSize, 22, '顶部余牌数字号应放大');
assert.equal(counter._suitCountLabels[0][3].fontSize, 18, '花色余牌数字号应放大');
assert.equal(counter.btnNode.width, 57, '记牌按钮应恢复潜江千分原生尺寸');
assert.equal(counter.btnNode.getComponent(Sprite).enabled, true, '记牌按钮应使用潜江千分原生图标');
assert.equal(counter.detailsNode.y, 126, '展开面板应在收紧后保持避开记牌按钮');
assert.ok(counter.detailsNode.y - counter.detailsNode.height / 2 > counter.btnNode.height / 2,
  '展开面板与记牌按钮之间应保留可点击间距');
assert.ok(counter.btnNode.zIndex > counter.detailsNode.zIndex, '记牌按钮应始终显示在展开面板上层');
recordCardEnabled = false;
counter._syncAccess();
assert.equal(counter.btnNode.active, false, '房间未勾选且不在白名单时应隐藏记牌器');
roomInfo.recordCardWhitelisted = true;
eventHandlers.record_card_access_change();
assert.equal(counter.btnNode.active, true, '房间未勾选时白名单玩家仍应显示记牌器');
assert.deepEqual(Array.from(counter._rankNames), ['大', '小', '2', 'A', 'K', 'Q', 'J', '十', '9', '8', '7', '6', '5', '4', '3']);

counter.onClick();
counter.update();
assert.equal(counter._countLabels[0].string, '1', '自己手里的大王应从剩余数扣除');
assert.equal(counter._countLabels[2].string, '7', '已出的 2 应从剩余数扣除');
assert.equal(counter._countLabels[3].string, '7', '自己手里的 A 应从剩余数扣除');
assert.equal(counter._suitCountLabels[0][3].string, '1', '黑桃 A 花色余量应独立统计');

assert.equal(counter.detailsNode.width, 515, '面板应保留统一的左右边框');

console.log('说胡子新版记牌器界面测试通过');
