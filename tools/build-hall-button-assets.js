#!/usr/bin/env node
// 将已选定的大厅按钮设计稿裁切为 Cocos 原尺寸透明 Sprite。
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const source = path.join(root, 'assets/branding/hall/lobby-main-buttons-elements-v3-return-matched.png');
const originalRoot = path.join(root, 'cocos-client/assets/resources/Hall/Res/Texture/Center');
const outputRoot = path.join(root, 'assets/branding/hall/selected-v3');

const geometry = [
  { name: 'club_btn', crop: '1072x430+231+78', size: '515x210!', mask: '515x210+0+48', canvas: '515x258' },
  { name: 'createroom_btn', crop: '519x420+31+528', size: '269x210!', mask: '269x210+0+0', polygon: '0,0 435,0 519,420 0,420', cropSize: '519x420' },
  { name: 'joinroom_btn', crop: '545x420+491+528', size: '277x213!', mask: '277x213+0+0', polygon: '2,0 545,0 515,420 80,420', cropSize: '545x420' },
  { name: 'backroom_btn', maskName: 'createroom_btn', crop: '519x420+1005+528', size: '269x210!', mask: '269x210+0+0', polygon: '0,0 435,0 519,420 0,420', cropSize: '519x420' },
];

const dimension = execFileSync('magick', ['identify', '-format', '%wx%h', source], { encoding: 'utf8' });
if (dimension !== '1536x1024') throw new Error(`设计稿尺寸异常：${dimension}`);
fs.mkdirSync(outputRoot, { recursive: true });

for (const entry of geometry) {
  const original = path.join(originalRoot, `${entry.maskName || entry.name}.png`);
  const output = path.join(outputRoot, `${entry.name}.png`);
  const args = [source, '-crop', entry.crop, '+repage', '-resize', entry.size,
    '(', original, '-crop', entry.mask, '+repage', '-alpha', 'extract'];
  if (entry.polygon) {
    args.push('(', '-size', entry.cropSize, 'xc:black', '-fill', 'white',
      '-draw', `polygon ${entry.polygon}`, '-resize', entry.size, ')',
      '-compose', 'Multiply', '-composite');
  }
  args.push(')', '-compose', 'CopyOpacity', '-composite', '-compose', 'Over');
  if (entry.canvas) args.push('-background', 'none', '-gravity', 'south', '-extent', entry.canvas);
  args.push(output);
  execFileSync('magick', args);
  const actual = execFileSync('magick', ['identify', '-format', '%wx%h %[opaque]', output], { encoding: 'utf8' });
  if (actual.startsWith('0x0') || actual.endsWith('True')) throw new Error(`${entry.name} 透明图异常：${actual}`);
  process.stdout.write(`${entry.name}: ${actual}\n`);
}
