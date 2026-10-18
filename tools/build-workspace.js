const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEFAULT_BUILD_ROOT = path.join(ROOT, 'dist', '.work');

const buildRoot = () => path.resolve(process.env.QJQP_BUILD_ROOT || DEFAULT_BUILD_ROOT);

const freeBytes = (directory) => {
  const stat = fs.statfsSync(directory);
  return Number(stat.bavail) * Number(stat.bsize);
};

const formatGiB = (bytes) => `${(bytes / 1073741824).toFixed(1)} GiB`;

const pruneStaleBuildDirs = (directory, maxAgeMs = 24 * 60 * 60 * 1000) => {
  if (!fs.existsSync(directory)) return [];
  const cutoff = Date.now() - maxAgeMs;
  const removed = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^qjqp-/.test(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (fs.statSync(target).mtimeMs >= cutoff) continue;
    fs.rmSync(target, { recursive: true, force: true });
    removed.push(target);
  }
  return removed;
};

const makeBuildDir = (prefix, { minimumFreeBytes = 0 } = {}) => {
  if (!/^qjqp-[a-z0-9-]+$/i.test(prefix)) throw new Error(`构建目录前缀无效：${prefix}`);
  const directory = buildRoot();
  fs.mkdirSync(directory, { recursive: true });
  pruneStaleBuildDirs(directory);
  const available = freeBytes(directory);
  const requested = Number(process.env.QJQP_MIN_BUILD_FREE_BYTES || minimumFreeBytes || 0);
  if (requested > 0 && available < requested) {
    throw new Error(`构建盘空间不足：剩余 ${formatGiB(available)}，至少需要 ${formatGiB(requested)}。`
      + `可清理 ${directory}，或设置 QJQP_BUILD_ROOT 指向容量更大的磁盘。`);
  }
  return fs.mkdtempSync(path.join(directory, `${prefix}-`));
};

module.exports = {
  DEFAULT_BUILD_ROOT,
  buildRoot,
  freeBytes,
  formatGiB,
  makeBuildDir,
  pruneStaleBuildDirs,
};
