/**
 * 服务端口与 iOS 应用标识（从 index.js 迁出）。
 */
const PORT = Number(process.env.PORT) || 8080;

const LISTEN_HOST = process.env.HOST || '0.0.0.0';

const APP_BUNDLE_ID = 'com.haoke.gandengyan';

const APPLE_TEAM_IDS = (process.env.QJQP_APPLE_TEAM_IDS
  || process.env.QJQP_APPLE_TEAM_ID
  || '4CSMM3394C')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const APPLE_APP_IDS = (process.env.QJQP_APPLE_APP_IDS
  || APPLE_TEAM_IDS.map((teamId) => `${teamId}.${APP_BUNDLE_ID}`).join(','))
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

module.exports = { PORT, LISTEN_HOST, APP_BUNDLE_ID, APPLE_TEAM_IDS, APPLE_APP_IDS };
