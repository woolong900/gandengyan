#!/usr/bin/env node
/**
 * 读模拟器画面。
 *
 * `adb exec-out screencap` 不加 -p 就是原始帧缓冲，不用任何图像库就能解：
 *   [0,4)   uint32 LE  宽
 *   [4,8)   uint32 LE  高
 *   [8,12)  uint32 LE  像素格式（1 = RGBA_8888）
 *   [12,16) uint32 LE  色彩空间
 *   [16,)              RGBA，每像素 4 字节
 *
 * usage: node tools/screen.js <x> <y> [<x> <y> ...]   打印这些点的颜色
 */
const { execFileSync } = require('child_process');

const HEAD = 16;

function capture() {
  const buf = execFileSync('adb', ['exec-out', 'screencap'], {
    maxBuffer: 64 * 1024 * 1024,
    encoding: 'buffer',
  });
  const width = buf.readUInt32LE(0);
  const height = buf.readUInt32LE(4);
  if (buf.length - HEAD !== width * height * 4) {
    throw new Error(`帧大小对不上：${buf.length - HEAD} != ${width * height * 4}`);
  }
  return { width, height, data: buf };
}

const pixel = (shot, x, y) => {
  const i = HEAD + (y * shot.width + x) * 4;
  return [shot.data[i], shot.data[i + 1], shot.data[i + 2]];
};

/** 采样点周围取个小方块的均值，躲开抗锯齿和一两像素的抖动 */
const sample = (shot, x, y, r = 4) => {
  let sum = [0, 0, 0];
  let n = 0;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const px = x + dx;
      const py = y + dy;
      if (px < 0 || py < 0 || px >= shot.width || py >= shot.height) continue;
      const c = pixel(shot, px, py);
      sum = [sum[0] + c[0], sum[1] + c[1], sum[2] + c[2]];
      n++;
    }
  }
  return sum.map((v) => Math.round(v / n));
};

/** 曼哈顿距离，够用来判断「是不是那个颜色」 */
const near = (a, b, tol = 40) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) <= tol * 3;

module.exports = { capture, pixel, sample, near };

if (require.main === module) {
  const shot = capture();
  console.log(`画面 ${shot.width}x${shot.height}`);
  const args = process.argv.slice(2).map(Number);
  for (let i = 0; i + 1 < args.length; i += 2) {
    const [x, y] = [args[i], args[i + 1]];
    console.log(`  (${x},${y}) = ${JSON.stringify(sample(shot, x, y))}`);
  }
}
