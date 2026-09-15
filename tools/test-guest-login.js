#!/usr/bin/env node
const { GameApp } = require('../server/app');
const { avatarUrls } = require('../server/avatars');

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
const sameDevice = app.http('/login', query({ accountType: 'guest', deviceId: '6728693033b78689' }));
t('同一设备复用游客 token', sameDevice.body.data.token, first.body.data.token);
t('同一游客再次登录保留头像', app.players.get(sameDevice.body.data.token).avatarUrl, firstPlayer.avatarUrl);
t('同一设备只创建一个玩家', app.players.size, 1);

const otherDevice = app.http('/login', query({ accountType: 'guest', deviceId: '1234567890abcdef' }));
t('不同设备创建不同游客', otherDevice.body.data.token === first.body.data.token, false);

const legacy = app.http('/login', query({ accountType: 'guest' }));
const migrated = app.http('/login', query({
  accountType: 'guest', token: legacy.body.data.token, deviceId: 'fedcba0987654321',
}));
t('旧游客 token 绑定当前设备时不换号', migrated.body.data.token, legacy.body.data.token);
const recovered = app.http('/login', query({ accountType: 'guest', deviceId: 'fedcba0987654321' }));
t('清除客户端数据后可按设备找回旧游客', recovered.body.data.token, legacy.body.data.token);

const dumped = app.dump();
t('存档保留游客头像', dumped.players.find((p) => p.token === first.body.data.token).avatarUrl, firstPlayer.avatarUrl);
t('存档不保存原始设备 ID', JSON.stringify(dumped).includes('fedcba0987654321'), false);
const existingAvatar = 'https://img.test/existing.png';
dumped.players.push({ token: 'legacy-no-avatar', uid: 999001, nickname: '旧游客', avatarUrl: '' });
dumped.players.push({ token: 'legacy-with-avatar', uid: 999002, nickname: '微信玩家', avatarUrl: existingAvatar });
dumped.players.push({ token: 'legacy-bot', uid: 999003, bot: true, avatarUrl: '' });
const restored = new GameApp({ persist: () => {} });
restored.restore(dumped);
t('无头像的存量玩家补头像', avatarUrls.includes(restored.players.get('legacy-no-avatar').avatarUrl), true);
t('已有头像的玩家不被覆盖', restored.players.get('legacy-with-avatar').avatarUrl, existingAvatar);
t('机器人不分配玩家头像', restored.players.get('legacy-bot').avatarUrl, '');
const restoredAvatar = restored.players.get('legacy-no-avatar').avatarUrl;
const restartedAgain = new GameApp({ persist: () => {} });
restartedAgain.restore(restored.dump());
t('补齐的头像在下次重启后保持不变', restartedAgain.players.get('legacy-no-avatar').avatarUrl, restoredAvatar);
const afterRestart = restored.http('/login', query({ accountType: 'guest', deviceId: '6728693033b78689' }));
t('服务重启后仍按设备复用游客', afterRestart.body.data.token, first.body.data.token);

console.log(`\n${pass} 过 / ${fail} 挂`);
if (fail) process.exitCode = 1;
