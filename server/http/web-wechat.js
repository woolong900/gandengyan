/**
 * 微信 AppID 凭据与 PWA 网页微信登录的一次性 state/ticket（从 index.js 迁出）。
 */
const crypto = require('crypto');

const wechatCredentials = (requestedAppId) => {
  const configuredAppId = String(process.env.QJQP_WECHAT_APPID || '').trim();
  const apps = new Map();
  if (configuredAppId && process.env.QJQP_WECHAT_APPSECRET) {
    apps.set(configuredAppId, String(process.env.QJQP_WECHAT_APPSECRET));
  }
  const extra = String(process.env.QJQP_WECHAT_APPS || '').trim();
  if (extra) {
    try {
      const parsed = JSON.parse(extra);
      for (const [appId, secret] of Object.entries(parsed || {})) {
        if (/^wx[0-9A-Za-z]{16}$/.test(appId) && String(secret || '').trim()) {
          apps.set(appId, String(secret).trim());
        }
      }
    } catch (error) { console.error(`QJQP_WECHAT_APPS 配置无效：${error.message}`); }
  }
  const appId = String(requestedAppId || configuredAppId).trim();
  const appSecret = apps.get(appId) || '';
  return appId && appSecret ? { appId, appSecret } : null;
};

const hasWechatCredentials = () => !!(
  String(process.env.QJQP_WECHAT_APPID || '').trim() && String(process.env.QJQP_WECHAT_APPSECRET || '').trim()
) || !!String(process.env.QJQP_WECHAT_APPS || '').trim();

const webWechatCredentials = () => {
  const appId = String(process.env.QJQP_WECHAT_WEB_APPID || '').trim();
  const appSecret = String(process.env.QJQP_WECHAT_WEB_APPSECRET || '').trim();
  if (appId && appSecret) return { appId, appSecret };
  return wechatCredentials();
};

const webWechatStates = new Map();

const webWechatTickets = new Map();

const WEB_WECHAT_STATE_TTL = 10 * 60 * 1000;

const WEB_WECHAT_TICKET_TTL = 2 * 60 * 1000;

const cleanWebWechatTokens = () => {
  const now = Date.now();
  for (const [key, value] of webWechatStates) {
    if (!value || value.expiresAt <= now) webWechatStates.delete(key);
  }
  for (const [key, value] of webWechatTickets) {
    if (!value || value.expiresAt <= now) webWechatTickets.delete(key);
  }
};

const issueWebWechatToken = (map, value, ttl) => {
  cleanWebWechatTokens();
  const key = crypto.randomBytes(32).toString('base64url');
  map.set(key, { ...value, expiresAt: Date.now() + ttl });
  return key;
};

const consumeWebWechatToken = (map, key) => {
  cleanWebWechatTokens();
  const token = map.get(String(key || ''));
  map.delete(String(key || ''));
  return token && token.expiresAt > Date.now() ? token : null;
};

module.exports = {
  wechatCredentials, hasWechatCredentials, webWechatCredentials, webWechatStates, webWechatTickets,
  WEB_WECHAT_STATE_TTL, WEB_WECHAT_TICKET_TTL, cleanWebWechatTokens, issueWebWechatToken, consumeWebWechatToken,
};
