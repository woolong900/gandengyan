const crypto = require('crypto');

const publicBaseUrl = String(process.env.QJQP_PUBLIC_BASE_URL || 'https://game.auxvv.com').replace(/\/+$/, '');
const avatarUrls = Object.freeze(Array.from({ length: 10 }, (_, index) => (
  `${publicBaseUrl}/avatars/${String(index + 1).padStart(2, '0')}.png`
)));

const assignAvatarIfMissing = (player) => {
  if (!player || player.bot || String(player.avatarUrl || '').trim()) return false;
  player.avatarUrl = avatarUrls[crypto.randomInt(avatarUrls.length)];
  return true;
};

module.exports = { avatarUrls, assignAvatarIfMissing };
