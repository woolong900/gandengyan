#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const targetDir = path.join(root, 'assets', 'branding', 'qjshz-target');
const atlas = path.join(root, 'client-release-source', 'assets', 'resources',
  '_RecoveredDependencies', 'Textures', '19c83aa89.png');
const cocosAtlas = path.join(root, 'cocos-client', 'assets', 'resources',
  '_RecoveredDependencies', 'Textures', '19c83aa89.png');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'qjshz-action-atlas-'));
const output = path.join(work, '19c83aa89.png');

const overlays = [
  ['action-play-normal.png', '+0+300'],
  ['action-tip-disabled.png', '+354+300'],
  ['action-pass-normal.png', '+0+430'],
  ['action-play-disabled.png', '+354+430'],
  ['action-tip-normal.png', '+0+560'],
];

try {
  for (const file of [atlas, ...overlays.map(([name]) => path.join(targetDir, name))]) {
    if (!fs.existsSync(file)) throw new Error(`缺少说胡子操作按钮素材：${file}`);
  }
  const args = [atlas, '-background', 'none', '-gravity', 'northwest', '-extent', '696x690'];
  for (const [name, geometry] of overlays) {
    args.push(path.join(targetDir, name), '-geometry', geometry, '-composite');
  }
  args.push(output);
  execFileSync('magick', args, { stdio: 'inherit' });
  const dimensions = execFileSync('identify', ['-format', '%wx%h', output], { encoding: 'utf8' });
  if (dimensions !== '696x690') throw new Error(`说胡子操作按钮图集尺寸异常：${dimensions}`);
  fs.copyFileSync(output, atlas);
  fs.copyFileSync(output, cocosAtlas);
  console.log(`已生成高清说胡子操作按钮图集：${dimensions}`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
