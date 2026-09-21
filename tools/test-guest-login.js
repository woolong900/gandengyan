#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { GameApp } = require('../server/app');
const { avatarUrls } = require('../server/avatars');
const {
  GUEST_NICKNAME_STYLES, GUEST_BASE_NICKNAMES, GUEST_NICKNAME_SYMBOLS,
  decorateGuestNickname, baseNicknameOf,
} = require('../server/nicknames');

let pass = 0;
let fail = 0;
const t = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++;
  else {
    fail++;
    console.log(`  ✗ ${name}: 得到 ${JSON.stringify(got)} 期望 ${JSON.stringify(want)}`);
  }
};

const query = (values) => new URLSearchParams(values);

const app = new GameApp({ persist: () => {} });
const first = app.http('/login', query({ accountType: 'guest', deviceId: '6728693033b78689' }));
const firstPlayer = app.players.get(first.body.data.token);
t('新游客获得十张头像之一', avatarUrls.includes(firstPlayer.avatarUrl), true);
t('新游客获得中文昵称库中的昵称', GUEST_BASE_NICKNAMES.includes(baseNicknameOf(firstPlayer.nickname)), true);
t('游客基础昵称为2至6个中文', /^[\u3400-\u9fff]{2,6}$/.test(baseNicknameOf(firstPlayer.nickname)), true);
const sameDevice = app.http('/login', query({ accountType: 'guest', deviceId: '6728693033b78689' }));
t('同一设备复用游客 token', sameDevice.body.data.token, first.body.data.token);
t('同一游客再次登录保留头像', app.players.get(sameDevice.body.data.token).avatarUrl, firstPlayer.avatarUrl);
t('同一游客再次登录保留昵称', app.players.get(sameDevice.body.data.token).nickname, firstPlayer.nickname);
t('同一设备只创建一个玩家', app.players.size, 1);

const otherDevice = app.http('/login', query({ accountType: 'guest', deviceId: '1234567890abcdef' }));
t('不同设备创建不同游客', otherDevice.body.data.token === first.body.data.token, false);
t('新游客优先避开已使用昵称', app.players.get(otherDevice.body.data.token).nickname === firstPlayer.nickname, false);
t('昵称库包含五种风格', Object.keys(GUEST_NICKNAME_STYLES),
  ['literary', 'funny', 'dominant', 'cute', 'lucky']);
t('每种风格都有足够昵称', Object.values(GUEST_NICKNAME_STYLES).every((items) => items.length >= 40), true);
t('基础昵称全部是2至6个中文', GUEST_BASE_NICKNAMES.every((name) => /^[\u3400-\u9fff]{2,6}$/.test(name)), true);
t('昵称库完整覆盖2至6字长度', [...new Set(GUEST_BASE_NICKNAMES.map((name) => Array.from(name).length))].sort(),
  [2, 3, 4, 5, 6]);
const rng = (values) => {
  let index = 0;
  return (max) => values[index++ % values.length] % max;
};
t('昵称可以不加符号', decorateGuestNickname('听雨', rng([10])), '听雨');
t('昵称可以随机加一个前缀符号', decorateGuestNickname('摸鱼', rng([60, 1, 0])), '★摸鱼');
t('昵称可以随机加一个后缀符号', decorateGuestNickname('战神', rng([60, 2, 1])), '战神☆');
t('昵称可以随机加两个符号', decorateGuestNickname('团子', rng([90, 3, 4])), '丶团子°');
t('装饰符号限定在兼容字符表', GUEST_NICKNAME_SYMBOLS.length, 8);

const legacy = app.http('/login', query({ accountType: 'guest' }));
const migrated = app.http('/login', query({
  accountType: 'guest', token: legacy.body.data.token, deviceId: 'fedcba0987654321',
}));
t('旧游客 token 绑定当前设备时不换号', migrated.body.data.token, legacy.body.data.token);
const recovered = app.http('/login', query({ accountType: 'guest', deviceId: 'fedcba0987654321' }));
t('清除客户端数据后可按设备找回旧游客', recovered.body.data.token, legacy.body.data.token);

firstPlayer.lastIp = '114.117.178.215';
firstPlayer.lastIpCity = '广东省 深圳市';
firstPlayer.lastIpAt = 123456;
firstPlayer.lastIpLocatedAt = 123455;
const dumped = app.dump();
t('存档保留游客头像', dumped.players.find((p) => p.token === first.body.data.token).avatarUrl, firstPlayer.avatarUrl);
t('存档保留游客中文昵称', dumped.players.find((p) => p.token === first.body.data.token).nickname,
  firstPlayer.nickname);
t('存档保留最近登录 IP', (() => {
  const saved = dumped.players.find((p) => p.token === first.body.data.token);
  return [saved.lastIp, saved.lastIpCity, saved.lastIpAt, saved.lastIpLocatedAt];
})(), ['114.117.178.215', '广东省 深圳市', 123456, 123455]);
t('存档不保存原始设备 ID', JSON.stringify(dumped).includes('fedcba0987654321'), false);
const existingAvatar = 'https://img.test/existing.png';
dumped.players.push({ token: 'legacy-no-avatar', uid: 999001, nickname: '旧游客', avatarUrl: '' });
dumped.players.push({ token: 'legacy-with-avatar', uid: 999002, nickname: '微信玩家', avatarUrl: existingAvatar });
dumped.players.push({ token: 'legacy-bot', uid: 999003, bot: true, avatarUrl: '' });
const restored = new GameApp({ persist: () => {} });
restored.restore(dumped);
t('无头像的存量玩家补头像', avatarUrls.includes(restored.players.get('legacy-no-avatar').avatarUrl), true);
t('已有头像的玩家不被覆盖', restored.players.get('legacy-with-avatar').avatarUrl, existingAvatar);
t('机器人从现有头像库补齐头像',
  avatarUrls.includes(restored.players.get('legacy-bot').avatarUrl), true);
t('机器人从现有昵称库补齐昵称',
  GUEST_BASE_NICKNAMES.includes(baseNicknameOf(restored.players.get('legacy-bot').nickname)), true);
const restoredAvatar = restored.players.get('legacy-no-avatar').avatarUrl;
const restartedAgain = new GameApp({ persist: () => {} });
restartedAgain.restore(restored.dump());
t('补齐的头像在下次重启后保持不变', restartedAgain.players.get('legacy-no-avatar').avatarUrl, restoredAvatar);
t('最近登录 IP 在重启后保持不变', [restartedAgain.players.get(first.body.data.token).lastIp,
  restartedAgain.players.get(first.body.data.token).lastIpCity], ['114.117.178.215', '广东省 深圳市']);
const afterRestart = restored.http('/login', query({ accountType: 'guest', deviceId: '6728693033b78689' }));
t('服务重启后仍按设备复用游客', afterRestart.body.data.token, first.body.data.token);

const root = path.join(__dirname, '..');
const loginLayer = fs.readFileSync(path.join(root, 'client-release-source/assets/Script/Recovered/LoginLayer.js'), 'utf8');
const loginControl = fs.readFileSync(path.join(root, 'client-release-source/assets/Script/Recovered/LoginControl.js'), 'utf8');
const patchApk = fs.readFileSync(path.join(root, 'tools/patchapk.js'), 'utf8');
const loginScene = JSON.parse(fs.readFileSync(path.join(root,
  'client-release-source/assets/resources/Hall/Scene/LoginScene.fire'), 'utf8'));
const descBg = loginScene.find((entry) => entry.__type__ === 'cc.Node' && entry._name === 'DescBg');
t('恢复工程默认显示游客登录', loginLayer.includes('this.guestNode.active = true;'), true);
t('恢复工程强制隐藏测试账号输入框', loginLayer.includes('this.ebTestAccount.node.active = false;'), true);
t('恢复工程强制隐藏测试ID登录按钮', loginLayer.includes('this.btnTestLogin.node.active = false;'), true);
t('恢复工程不再按签名类型显示测试登录', loginLayer.includes('this.btnTestLogin.node.active = v.default.isDebug();'), false);
t('正式 APK 补丁默认显示游客登录', patchApk.includes("RULES.push(['this.guestNode.active = v.default.isDebug();', 'this.guestNode.active = true;', true]);"), true);
t('登录页底部遮罩运行时缩成一行', loginControl.includes('n && (n.height = 50, n.y = -335);'), true);
t('登录场景底部遮罩高度是一行', [descBg._contentSize.height, descBg._position.y], [50, -335]);

console.log(`\n${pass} 过 / ${fail} 挂`);
if (fail) process.exitCode = 1;
