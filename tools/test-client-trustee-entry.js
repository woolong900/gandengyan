const assert = require('assert/strict');
const fs = require('fs');
const { roomInfo } = require('../server/shared');

const menuSource = fs.readFileSync('client-release-source/assets/Script/Recovered/MenuLayer.js', 'utf8');
const autoSource = fs.readFileSync('client-release-source/assets/Script/Recovered/AutoGameLayer.js', 'utf8');
assert.ok(!menuSource.includes('BtnTrustee'), '牌桌菜单内不应再显示托管入口');
assert.ok(autoSource.includes('new cc.Node("BtnTrusteeQuick")'), '应创建独立的图标托管按钮');
assert.ok(autoSource.includes('TRUSTEE_BUTTON_WIDTH = 57, TRUSTEE_BUTTON_HEIGHT = 57'), '托管按钮素材应与原表情、话筒保持 57×57');
assert.ok(autoSource.includes('e.setContentSize(57, 57);'), '托管按钮显示尺寸应与原表情、话筒一致');
const pixelBlock = autoSource.split('TRUSTEE_BUTTON_PIXELS =')[1].split('var trusteeButtonFrame')[0];
const pixelBase64 = [...pixelBlock.matchAll(/"([A-Za-z0-9+/=]+)"/g)].map((item) => item[1]).join('');
assert.equal(Buffer.from(pixelBase64, 'base64').length, 57 * 57 * 4, '托管按钮嵌入的 RGBA 像素长度应完整');
assert.ok(autoSource.includes('getTrusteeButtonFrame()'), '托管按钮应使用确认后的机器人圆形图标');
assert.ok(autoSource.includes('cc.winSize.width / 2 - e - 36'), '托管按钮应贴近安全区右边缘');
assert.ok(autoSource.includes('-cc.winSize.height / 2 + 69'), '托管按钮应与自己的手牌处于同一纵向区域');
assert.ok(autoSource.includes('c.default.gameMsgBase().autoGame();'), '点击托管按钮后应发送托管请求');

const method = autoSource.split('t.prototype._updateTrusteeEntry = function() {')[1].split('\n};')[0];
let automated = false;
const player = { isAutoGameing: () => automated, manualTrusteeAllowed: false };
const room = {
  _manualTrusteeAllowed: false,
  players: { getByUid: () => player },
  isWatcher: () => false,
  isPlayback: () => false,
  config: { category: () => 1 },
  gameInfo: { status: 1 },
};
const entry = {
  active: false,
};
const ctx = { _trusteeEntry: entry, _layoutTrusteeEntry: () => {} };
const update = new Function('u', 'i', 'd', 'p', method);
const run = () => update.call(ctx, { default: room }, { default: { uid: 1 } },
  { eGameCategort: { MJ: 1 } }, { eGameStatus: { Gameing: 1 } });

run();
assert.equal(entry.active, false, '普通玩家不显示托管按钮');
room._manualTrusteeAllowed = true;
run();
assert.equal(entry.active, true, '白名单玩家显示托管按钮');
automated = true;
run();
assert.equal(entry.active, false, '进入托管后隐藏开启入口');
automated = false;
run();
assert.equal(entry.active, true, '取消托管后菜单入口重新出现');
room._manualTrusteeAllowed = false;
player.manualTrusteeAllowed = true;
run();
assert.equal(entry.active, true, '取消托管后即使房间临时标记丢失，玩家权限仍能恢复入口');
player.manualTrusteeAllowed = false;
room._manualTrusteeAllowed = false;
run();
assert.equal(entry.active, false, '撤销白名单后隐藏入口');
room._manualTrusteeAllowed = true;
room.gameInfo.status = 0;
run();
assert.equal(entry.active, false, '牌局未开始时不显示托管入口');

const table = { gameType: 2, config: {}, members: [{ player: { uid: 1 } }], host: { trusteeWhitelisted: () => false } };
assert.equal(roomInfo(table).person[0].trustee.manual_enabled, false);
table.host.trusteeWhitelisted = () => true;
assert.equal(roomInfo(table).person[0].trustee.manual_enabled, true);
table.gameType = 17;
assert.equal(roomInfo(table).person[0].trustee.manual_enabled, false);
console.log('独立托管按钮：手牌右侧定位、普通玩家隐藏、白名单开启/取消/再次开启及非麻将隐藏均通过');
