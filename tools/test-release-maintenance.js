const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { makeBuildDir } = require('./build-workspace');
const { pruneLocal } = require('./prune-release-artifacts');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-release-maintenance-test-'));
try {
  const dist = path.join(root, 'dist');
  fs.mkdirSync(dist);
  for (const version of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 326, 328]) {
    fs.mkdirSync(path.join(dist, `hot-update-${version}`));
  }
  for (const version of [1, 2, 3, 4, 5, 6, 7, 319]) {
    fs.mkdirSync(path.join(dist, `pwa-r${version}`));
  }
  let result = pruneLocal({
    distRoot: dist, apply: false, keepHot: 3, keepPwa: 2,
    protectedHot: [326], protectedPwa: [319],
  });
  assert.equal(result.hot.length, 11, '只读预览的热更新清理数量错误');
  assert.equal(result.pwa.length, 6, '只读预览的 PWA 清理数量错误');
  assert(fs.existsSync(path.join(dist, 'hot-update-1')), '只读预览不应删除文件');

  result = pruneLocal({
    distRoot: dist, apply: true, keepHot: 3, keepPwa: 2,
    protectedHot: [326], protectedPwa: [319],
  });
  assert.deepEqual(fs.readdirSync(dist).filter((name) => name.startsWith('hot-update-')).sort(),
    ['hot-update-12', 'hot-update-326', 'hot-update-328']);
  assert.deepEqual(fs.readdirSync(dist).filter((name) => name.startsWith('pwa-r')).sort(),
    ['pwa-r319', 'pwa-r7']);
  assert.equal(result.hot.length, 11);

  const previous = process.env.QJQP_BUILD_ROOT;
  process.env.QJQP_BUILD_ROOT = path.join(root, 'large-disk-work');
  const work = makeBuildDir('qjqp-test');
  assert.equal(path.dirname(work), process.env.QJQP_BUILD_ROOT);
  fs.rmSync(work, { recursive: true, force: true });
  if (previous === undefined) delete process.env.QJQP_BUILD_ROOT;
  else process.env.QJQP_BUILD_ROOT = previous;
  console.log('发布空间与自动清理校验通过');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
