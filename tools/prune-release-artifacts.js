#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const has = (name) => args.includes(`--${name}`);
const arg = (name, fallback = '') => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? fallback : args[index + 1];
};
const ROOT = path.join(__dirname, '..');

const inside = (root, target) => {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};

const removeTargets = (root, targets, apply, label) => {
  for (const target of targets) {
    if (!inside(root, target)) throw new Error(`${label}清理目标越界：${target}`);
    console.log(`${apply ? '删除' : '计划删除'} ${target}`);
    if (apply) fs.rmSync(target, { recursive: true, force: false });
  }
};

const numericVersions = (entries, matcher) => [...new Set(entries.map((entry) => {
  const match = matcher.exec(entry.name);
  return match ? Number(match[1]) : null;
}).filter(Number.isSafeInteger))].sort((a, b) => a - b);

const pruneVersionEntries = ({ root, matcher, keepCount, protectedVersions, apply, label }) => {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && matcher.test(entry.name));
  const versions = numericVersions(entries, matcher);
  const keep = new Set([...versions.slice(-keepCount), ...protectedVersions]);
  const targets = entries.filter((entry) => {
    const match = matcher.exec(entry.name);
    return match && !keep.has(Number(match[1]));
  }).map((entry) => path.join(root, entry.name));
  removeTargets(root, targets, apply, label);
  return targets;
};

const pruneOldChildren = ({ root, prefix, maxAgeMs, apply, label }) => {
  if (!fs.existsSync(root)) return [];
  const cutoff = Date.now() - maxAgeMs;
  const targets = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.name.startsWith(prefix))
    .map((entry) => path.join(root, entry.name))
    .filter((target) => fs.lstatSync(target).mtimeMs < cutoff);
  removeTargets(root, targets, apply, label);
  return targets;
};

const pruneLocal = ({
  distRoot = path.join(ROOT, 'dist'),
  apply = false,
  keepHot = 10,
  keepPwa = 5,
  protectedHot = [326, 328],
  protectedPwa = [319],
} = {}) => {
  const hot = pruneVersionEntries({
    root: distRoot,
    matcher: /^hot-update-(\d+)(?:-.+)?$/,
    keepCount: keepHot,
    protectedVersions: protectedHot,
    apply,
    label: '本地热更新',
  });
  const pwa = pruneVersionEntries({
    root: distRoot,
    matcher: /^pwa-r(\d+)(?:-.+)?$/,
    keepCount: keepPwa,
    protectedVersions: protectedPwa,
    apply,
    label: '本地 PWA',
  });
  const work = pruneOldChildren({
    root: path.join(distRoot, '.work'),
    prefix: 'qjqp-',
    maxAgeMs: 24 * 60 * 60 * 1000,
    apply,
    label: '本地构建暂存',
  });
  return { hot, pwa, work };
};

const pruneProduction = ({
  hotRoot = '/var/lib/qjqp/hot-update',
  configFile = '/var/lib/qjqp/hot-update.json',
  pwaRoot = '/opt/qjqp/releases',
  pwaLink = '/opt/qjqp/pwa',
  buildRoot = '/var/tmp/qjqp-build',
  legacyTmp = '',
  apply = false,
  keepHot = 10,
  keepPwa = 5,
} = {}) => {
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  const protectedHot = new Set();
  for (const platform of ['android', 'ios']) {
    const item = config.platforms[platform];
    if (!item) continue;
    protectedHot.add(Number(item.latestAssetVersion));
    protectedHot.add(Number(item.stableAssetVersion));
  }
  const hot = [];
  for (const platform of ['android', 'ios']) {
    hot.push(...pruneVersionEntries({
      root: path.join(hotRoot, platform),
      matcher: /^(\d+)$/,
      keepCount: keepHot,
      protectedVersions: [...protectedHot],
      apply,
      label: `生产 ${platform}`,
    }));
  }
  let pwa = [];
  if (fs.existsSync(pwaRoot)) {
    const active = fs.existsSync(pwaLink) ? path.basename(fs.realpathSync(pwaLink)) : '';
    const entries = fs.readdirSync(pwaRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^pwa-.*-r\d+$/.test(entry.name));
    const versions = numericVersions(entries, /-r(\d+)$/);
    const keep = new Set(versions.slice(-keepPwa));
    pwa = entries.filter((entry) => {
      const match = /-r(\d+)$/.exec(entry.name);
      return entry.name !== active && match && !keep.has(Number(match[1]));
    }).map((entry) => path.join(pwaRoot, entry.name));
    removeTargets(pwaRoot, pwa, apply, '生产 PWA');
  }
  const work = pruneOldChildren({
    root: buildRoot,
    prefix: 'qjqp-',
    maxAgeMs: 24 * 60 * 60 * 1000,
    apply,
    label: '生产构建暂存',
  });
  const legacy = legacyTmp ? pruneOldChildren({
    root: legacyTmp,
    prefix: 'qjqp-',
    maxAgeMs: 24 * 60 * 60 * 1000,
    apply,
    label: '旧临时目录',
  }) : [];
  return { hot, pwa, work, legacy };
};

if (require.main === module) {
  const apply = has('apply');
  const common = {
    apply,
    keepHot: Number(arg('keep-hot', '10')),
    keepPwa: Number(arg('keep-pwa', '5')),
  };
  const result = has('production') ? pruneProduction({
    ...common,
    hotRoot: path.resolve(arg('hot-root', '/var/lib/qjqp/hot-update')),
    configFile: path.resolve(arg('config', '/var/lib/qjqp/hot-update.json')),
    pwaRoot: path.resolve(arg('pwa-root', '/opt/qjqp/releases')),
    pwaLink: path.resolve(arg('pwa-link', '/opt/qjqp/pwa')),
    buildRoot: path.resolve(arg('build-root', '/var/tmp/qjqp-build')),
    legacyTmp: arg('legacy-tmp') ? path.resolve(arg('legacy-tmp')) : '',
  }) : pruneLocal({
    ...common,
    distRoot: path.resolve(arg('dist', path.join(ROOT, 'dist'))),
    protectedHot: arg('protect-hot', '326,328').split(',').map(Number).filter(Number.isSafeInteger),
    protectedPwa: arg('protect-pwa', '319').split(',').map(Number).filter(Number.isSafeInteger),
  });
  const count = Object.values(result).reduce((sum, values) => sum + values.length, 0);
  console.log(`${apply ? '清理完成' : '只读预览'}：${count} 项`);
}

module.exports = { pruneLocal, pruneProduction };
