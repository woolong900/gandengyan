#!/usr/bin/env node
const assert = require('assert/strict');
const { GameApp } = require('../server/app');
const { WechatAuthError, authorizeWechat } = require('../server/wechat');

let pass = 0;
const t = (name, actual, expected) => {
  assert.deepEqual(actual, expected, name);
  pass++;
};

const response = (body) => ({ ok: true, status: 200, json: async () => body });

const main = async () => {
  await assert.rejects(
    () => authorizeWechat('code', { appId: '', appSecret: '' }),
    (err) => err instanceof WechatAuthError && err.code === 3,
  );
  pass++;

  const urls = [];
  const profile = await authorizeWechat('one-time-code', {
    appId: 'wx-test',
    appSecret: 'secret-test',
    fetchImpl: async (url) => {
      urls.push(new URL(url));
      return urls.length === 1
        ? response({ access_token: 'access-test', openid: 'openid-1', unionid: 'unionid-1' })
        : response({ openid: 'openid-1', unionid: 'unionid-1', nickname: '微信玩家', sex: 2, headimgurl: 'https://img.test/a' });
    },
  });
  t('交换授权码使用正确 AppID', urls[0].searchParams.get('appid'), 'wx-test');
  t('交换授权码使用客户端 code', urls[0].searchParams.get('code'), 'one-time-code');
  t('用户信息请求使用 access token', urls[1].searchParams.get('access_token'), 'access-test');
  t('返回微信 openid', profile.openid, 'openid-1');
  t('返回微信昵称', profile.nickname, '微信玩家');

  const app = new GameApp();
  const first = app.loginWechat(profile);
  const again = app.loginWechat({ ...profile, nickname: '新昵称' });
  t('同一微信身份复用 token', again.token, first.token);
  t('同一微信身份复用 uid', again.player.uid, first.player.uid);
  t('再次授权刷新昵称', again.player.nickname, '新昵称');

  const restored = new GameApp();
  restored.restore(app.dump());
  const afterRestart = restored.loginWechat(profile);
  t('服务重启后仍复用微信账号', afterRestart.token, first.token);
  t('服务重启后保留头像', afterRestart.player.avatarUrl, 'https://img.test/a');

  const bad = async () => response({ errcode: 40029, errmsg: 'invalid code' });
  await assert.rejects(
    () => authorizeWechat('bad-code', { appId: 'wx-test', appSecret: 'secret-test', fetchImpl: bad }),
    (err) => err instanceof WechatAuthError && err.code === 40029,
  );
  pass++;

  console.log(`\n${pass} 过 / 0 挂`);
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
