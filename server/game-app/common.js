/**
 * GameApp 各模块共用的依赖和常量（从 app.js 顶部原样迁出）。
 */
const { pack, unpack, hasRes, protocol } = require('../net');
const crypto = require('crypto');
const { Table } = require('../table');
const rules = require('../rules');
const qjshzRules = require('../qjshz-rules');
const { ClubStore, MASTER, ADMIN, PLAYER, MAX_CLUB_CARDS } = require('../clubs');
const {
  num, maxStep, roomInfo, versionBody, configBody, emptyPlayer, NEW_PLAYER_CARDS,
  INVITE_GIVE, INVITE_AMBIGUOUS, mintInviteCode, push,
} = require('../shared');
const { buildRecord, listFor, toListItem, keepLatest, DAY_SEC } = require('../records');
const { findPlayback, mintPlaybackId } = require('../playback');
const { identityDigest, maskIdCard, validateIdentity } = require('../identity');
const { avatarUrls, assignAvatarIfMissing } = require('../avatars');
const { mintGuestNickname } = require('../nicknames');
const { JevBot } = require('../jev-bot');
const FIRST_PLAYER_UID = 285633;
const ROOM_ID_MIN = 100000;
const ROOM_ID_MAX = 1000000;
const BOT_UID_MIN = 800000000;
const BOT_UID_MAX = 900000000;
const BOT_ROOM_OWNER_UIDS = new Set([285636, 285861, 100055]);
const BOT_MODES = new Set(['local', 'jev', 'ab']);
const emptyBotStat = () => ({ rounds: 0, wins: 0, draws: 0, score: 0 });
const defaultBotMode = () => {
  const configured = String(process.env.QJQP_BOT_MODE || '').toLowerCase();
  if (BOT_MODES.has(configured)) return configured;
  return process.env.QJQP_JEV_API_KEY || process.env.JEV_API_KEY ? 'ab' : 'local';
};
const normalizeBotStat = (value) => ({
  rounds: Math.max(0, Number(value && value.rounds) || 0),
  wins: Math.max(0, Number(value && value.wins) || 0),
  draws: Math.max(0, Number(value && value.draws) || 0),
  score: Number(value && value.score) || 0,
});
const normalizeTrusteeWhitelist = (value) => [...new Set((Array.isArray(value) ? value : [])
  .map(Number).filter((uid) => Number.isSafeInteger(uid) && uid > 0 && uid < BOT_UID_MIN))]
  .sort((a, b) => a - b);
const normalizeBotSettings = (value = {}) => ({
  enabled: typeof value.enabled === 'boolean' ? value.enabled : process.env.QJQP_FILLBOTS !== '0',
  mode: BOT_MODES.has(value.mode) ? value.mode : defaultBotMode(),
  trusteeWhitelist: normalizeTrusteeWhitelist(value.trusteeWhitelist),
  recordCardWhitelist: normalizeTrusteeWhitelist(value.recordCardWhitelist),
  stats: {
    local: normalizeBotStat(value.stats && value.stats.local),
    jev: normalizeBotStat(value.stats && value.stats.jev),
  },
});
const CLUB_APPLICATION_MESSAGE_ID_BASE = 4000000000;
const UINT32_MAX = 4294967295;
const defaultInvitePageText = (bonus) => `绑定推荐人邀请码，可获得${bonus}张房卡！`;
const SUPPORT_MAX_MESSAGES = 100;
const SUPPORT_MAX_CONVERSATIONS = 1000;
const cleanSupportText = (value) => String(value == null ? '' : value)
  .replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();

module.exports = {
  pack, unpack, hasRes, protocol, crypto, Table, rules, qjshzRules, ClubStore, MASTER, ADMIN, PLAYER,
  MAX_CLUB_CARDS, num, maxStep, roomInfo, versionBody, configBody, emptyPlayer, NEW_PLAYER_CARDS,
  INVITE_GIVE, INVITE_AMBIGUOUS, mintInviteCode, push, buildRecord, listFor, toListItem, keepLatest,
  DAY_SEC, findPlayback, mintPlaybackId, identityDigest, maskIdCard, validateIdentity, avatarUrls,
  assignAvatarIfMissing, mintGuestNickname, JevBot, FIRST_PLAYER_UID, ROOM_ID_MIN, ROOM_ID_MAX,
  BOT_UID_MIN, BOT_UID_MAX, BOT_ROOM_OWNER_UIDS, BOT_MODES, emptyBotStat, defaultBotMode,
  normalizeBotStat, normalizeTrusteeWhitelist, normalizeBotSettings, CLUB_APPLICATION_MESSAGE_ID_BASE,
  UINT32_MAX, defaultInvitePageText, SUPPORT_MAX_MESSAGES, SUPPORT_MAX_CONVERSATIONS, cleanSupportText,
};
