#!/usr/bin/env node
/**
 * Recolour the four blue bases used by the 3D Mahjong wall-rise animation.
 *
 * The animation is stored as 81 Cocos atlas textures (pd9..pd17, img0..img8).
 * We start from a known-good extracted release so the atlas padding, dimensions,
 * transparency and frame alignment remain byte-for-byte compatible; only teal/
 * blue pixels are changed to the table's dark green palette.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { makeBuildDir } = require('./build-workspace');

const ROOT = path.join(__dirname, '..');
const sourceRelease = path.resolve(process.argv[2]
  || path.join(ROOT, 'dist', 'hot-update-326', 'android', '326'));
const outputRoot = path.join(ROOT, 'assets', 'branding', 'table', 'pd-ani-green');
const spriteFrames = require(path.join(ROOT, 'cocos-client', 'recovery-report', 'spriteframe-paths.json'));
const framePattern = /^Hall\/Res\/Animate\/pd_ani\/pd(?:9|1[0-7])\/img[0-8]$/;

const decryptCocosImage = (input) => {
  const header = input.subarray(0, 9).toString('ascii');
  if (header !== 'aaabbbccc') return input;
  const key = input[9];
  const output = Buffer.alloc(input.length - 10);
  for (let index = 10; index < input.length; index += 1) output[index - 10] = input[index] ^ key;
  return output;
};

const frames = spriteFrames
  .filter((entry) => framePattern.test(entry.logical))
  .sort((left, right) => left.logical.localeCompare(right.logical, 'en', { numeric: true }));
if (frames.length !== 81) throw new Error(`牌墙升起动画帧数量异常：${frames.length}，预期 81`);

const work = makeBuildDir('qjqp-pd-green', { minimumFreeBytes: 1073741824 });
const published = [];
try {
  fs.rmSync(outputRoot, { recursive: true, force: true });
  const usedTextures = new Set();
  for (const frame of frames) {
    const importPath = path.join(sourceRelease, 'res', 'import', frame.uuid.slice(0, 2), `${frame.uuid}.json`);
    const imported = JSON.parse(fs.readFileSync(importPath, 'utf8'));
    const texture = imported?.content?.texture;
    if (!/^[0-9a-f]{9}$/i.test(texture || '')) {
      throw new Error(`${frame.logical} 的纹理标识异常：${texture}`);
    }
    if (usedTextures.has(texture)) throw new Error(`动画纹理重复：${texture}`);
    usedTextures.add(texture);

    const relativeAsset = path.join('res', 'raw-assets', texture.slice(0, 2), `${texture}.png`);
    const encryptedSource = path.join(sourceRelease, relativeAsset);
    const inputPath = path.join(work, `${texture}-input.png`);
    const outputPath = path.join(outputRoot, relativeAsset);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(inputPath, decryptCocosImage(fs.readFileSync(encryptedSource)));

    const bluePixel = '((a>0)&&(b>r*1.15)&&(g>r*1.35)&&(b>g*0.70))';
    execFileSync('magick', [
      inputPath,
      '(', '-clone', '0', '-fx', `${bluePixel} ? (0.18*g+0.06*b) : r`, ')',
      '(', '-clone', '0', '-fx', `${bluePixel} ? (0.65*g+0.20*b) : g`, ')',
      '(', '-clone', '0', '-fx', `${bluePixel} ? (0.45*g+0.25*b) : b`, ')',
      '(', '-clone', '0', '-alpha', 'extract', ')',
      '-delete', '0', '-combine', '-colorspace', 'sRGB', outputPath,
    ]);

    const before = execFileSync('identify', ['-format', '%wx%h', inputPath], { encoding: 'utf8' });
    const after = execFileSync('identify', ['-format', '%wx%h', outputPath], { encoding: 'utf8' });
    if (before !== after) throw new Error(`${frame.logical} 的尺寸发生变化：${before} -> ${after}`);
    published.push({ logical: frame.logical, asset: relativeAsset.split(path.sep).join('/'), size: after });
  }
  fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(published, null, 2)}\n`);
  console.log(`已生成 ${published.length} 帧绿色牌墙升起动画：${outputRoot}`);
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
