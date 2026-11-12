#!/usr/bin/env node
// 将与现大厅风格匹配的生成大图收整为原始按钮尺寸和透明轮廓。
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const assetRoot = path.join(root, 'assets', 'branding', 'hall', 'selected-v5');
const originalRoot = 'cocos-client/assets/resources/Hall/Res/Texture/Center';
const entries = [
  ['club_btn', 515, 258],
  ['createroom_btn', 269, 210],
  ['joinroom_btn', 277, 213],
  ['backroom_btn', 269, 210],
];

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hall-buttons-v5-'));
try {
  for (const [name, width, height] of entries) {
    const source = path.join(assetRoot, 'sources', `${name}-source.png`);
    const output = path.join(assetRoot, `${name}.png`);
    const original = path.join(temporaryRoot, `${name}-original.png`);
    fs.writeFileSync(original, execFileSync('git', [
      '-C', root,
      'show',
      `HEAD:${originalRoot}/${name}.png`,
    ]));

    const crop = execFileSync('magick', [
      source,
      '-alpha', 'extract',
      '-threshold', '10%',
      '-format', '%@',
      'info:',
    ], { encoding: 'utf8' }).trim();
    if (!/^\d+x\d+\+\d+\+\d+$/.test(crop)) {
      throw new Error(`${name} 无法识别主体包围框：${crop}`);
    }

    execFileSync('magick', [
      source,
      '-crop', crop,
      '+repage',
      '-resize', `${width}x${height}!`,
      '(', original, '-alpha', 'extract', ')',
      '-compose', 'CopyOpacity',
      '-composite',
      output,
    ]);

    const result = execFileSync('magick', [
      'identify',
      '-format', '%wx%h %[channels] %[opaque]',
      output,
    ], { encoding: 'utf8' });
    if (!result.startsWith(`${width}x${height} srgba`) || result.endsWith('True')) {
      throw new Error(`${name} 输出校验失败：${result}`);
    }
    process.stdout.write(`${name}: ${result}\n`);
  }
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
