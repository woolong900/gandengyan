/**
 * 左右手牌：APK CardLayer3D 的 left_hand_hide / right_hand_hide。
 * 每张是预渲染长方体（zlp / ylp），按预制体中心点摆，绿背朝桌心。
 */

import { SIDE_HAND } from './layout';
import type { ImageName } from './assets';

export function drawSideWall3d(
  ctx: CanvasRenderingContext2D,
  img: (name: ImageName) => HTMLImageElement | undefined,
  anchor: 'left' | 'right',
  n: number,
  packed: number,
  /** far：从远端排；near：从近端排，把远端留给碰杠（玩家视角左侧） */
  align: 'far' | 'near' = 'far'
): void {
  if (n <= 0) return;
  const wall = SIDE_HAND[anchor];
  const prefix = anchor === 'left' ? 'zlp' : 'ylp';
  const packedCount = Math.min(packed, wall.packed.length);
  const start = align === 'near' ? wall.packed.length - packedCount : 0;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const drawSlot = (cx: number, cy: number, sprite: number) => {
    const im = img(`${prefix}_${sprite}` as ImageName);
    if (!im) return;
    ctx.drawImage(im, cx - im.width / 2, cy - im.height / 2, im.width, im.height);
  };

  const slots = wall.packed.slice(start, start + packedCount).map((s) => s);
  if (n > packed) slots.push(wall.drawn);
  // 一律远的先画、近的后画（贴图编号大的远）。摸牌槽左家在近端、右家在远端，
  // 照数组顺序画会让右家那张小的盖住它前面那张大的，看着像重叠在一起。
  slots.sort((a, b) => b.tile - a.tile);
  for (const s of slots) drawSlot(s.x, s.y, s.tile);
}
