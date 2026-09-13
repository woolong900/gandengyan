const crypto = require('crypto');

const CHECKSUM_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECKSUM_CODES = '10X98765432';
const PROVINCE_CODES = new Set([
  '11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37',
  '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64',
  '65', '71', '81', '82', '91',
]);

const normalizeName = (value) => String(value || '')
  .normalize('NFKC')
  .trim()
  .replace(/[\s\u00a0]+/g, '')
  .replace(/[•・]/g, '·');

const normalizeIdCard = (value) => String(value || '')
  .normalize('NFKC')
  .replace(/\s+/g, '')
  .toUpperCase();

const validName = (name) => (
  /^[\u3400-\u9fff]{2,30}$/u.test(name)
  || /^[\u3400-\u9fff]{1,15}·[\u3400-\u9fff]{1,15}$/u.test(name)
);

const validBirthday = (value, today = new Date()) => {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  if (year < 1900 || year > today.getFullYear()) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;
  const todayValue = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return Number(value) <= todayValue;
};

const validIdCard = (idCard, today) => {
  if (!/^\d{17}[\dX]$/.test(idCard)) return false;
  if (!PROVINCE_CODES.has(idCard.slice(0, 2))) return false;
  if (!validBirthday(idCard.slice(6, 14), today)) return false;
  if (idCard.slice(14, 17) === '000') return false;
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += Number(idCard[i]) * CHECKSUM_WEIGHTS[i];
  return CHECKSUM_CODES[sum % 11] === idCard[17];
};

const validateIdentity = (input, options = {}) => {
  const realName = normalizeName(input && input.realName);
  const idCard = normalizeIdCard(input && input.idCard);
  if (!validName(realName)) return { error: '请输入2至30位中文真实姓名' };
  if (!validIdCard(idCard, options.today)) return { error: '身份证号码格式或校验位不正确' };
  return { realName, idCard };
};

const identityDigest = (secret, kind, value) => crypto
  .createHmac('sha256', secret)
  .update(`qjqp-identity-v1\0${kind}\0${value}`, 'utf8')
  .digest('hex');

const maskIdCard = (idCard) => `${idCard.slice(0, 6)}********${idCard.slice(-4)}`;

module.exports = {
  identityDigest,
  maskIdCard,
  normalizeIdCard,
  normalizeName,
  validIdCard,
  validName,
  validateIdentity,
};
