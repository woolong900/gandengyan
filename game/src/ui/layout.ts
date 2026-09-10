/**
 * 界面布局常量。设计分辨率 1280x720（横屏）。
 * 牌桌分区对标 APK CardLayer3D + 布局.PNG，由内到外互不重叠：
 *   中央指示 → 出牌河 → 甩赖子角落 → 手牌墙（左右 zlp/ylp，对家牌背，自家手牌）
 *   碰杠离开暗牌墙；头像在边角。
 */

import type { ImageName } from './assets';

export const DESIGN_W = 1280;
export const DESIGN_H = 720;

/** 参考游戏中的牌身原始尺寸 */
export const TILE = {
  /** 自己的手牌 bg_down_sp */
  hand: { w: 91, h: 133 },
  /** 出牌河 bg_up_down_qp */
  discard: { w: 46, h: 67 },
  /** 碰/杠亮出的牌 bg_down_g */
  meld: { w: 81, h: 113 },
  /** 对面牌背 bg_up_sp */
  backUp: { w: 49, h: 69 },
  /** 左右两侧牌背 bg_left_rigt_sp */
  side: { w: 28, h: 64 },
  /** 左右出牌 bg_left_right_qp */
  discardSide: { w: 60, h: 51 },
  /** 左右碰杠 bg_left_right_g */
  meldSide: { w: 55, h: 47 },
} as const;

/**
 * 牌面（数字/花色图案）与赖子、朝天角标相对牌身的摆放。
 * 数值直接取自参考游戏的 CardDown / CardUp / CardLeft 预制体：
 * 例如 CardDown 的 Hand 节点下 Card 位于 (0,-11) 且 scale=0.75，
 * 角标 lz/pz 位于 (23,20)。cocos 的 y 轴向上，这里已换算成屏幕方向（y 向下）。
 */
export interface FaceSpec {
  /** 牌面缩放（左右两侧是斜视效果，x/y 不等比） */
  glyph: { x: number; y: number };
  /** 牌面相对牌身中心的偏移（屏幕方向） */
  glyphDy: number;
  /** 角标缩放与偏移 */
  badge: { x: number; y: number };
  badgeDx: number;
  badgeDy: number;
}

export const FACE: Record<string, FaceSpec> = {
  tile_hand: { glyph: { x: 0.75, y: 0.75 }, glyphDy: 11, badge: { x: 1, y: 1 }, badgeDx: 23, badgeDy: -20 },
  tile_discard: { glyph: { x: 0.38, y: 0.38 }, glyphDy: -7, badge: { x: 0.38, y: 0.38 }, badgeDx: 14, badgeDy: -24.5 },
  tile_meld: { glyph: { x: 0.6, y: 0.6 }, glyphDy: -11, badge: { x: 0.6, y: 0.6 }, badgeDx: 23, badgeDy: -40 },
  tile_discard_side: { glyph: { x: 0.36, y: 0.4 }, glyphDy: -9, badge: { x: 0.36, y: 0.4 }, badgeDx: 19.5, badgeDy: 0 },
  tile_meld_side: { glyph: { x: 0.3, y: 0.36 }, glyphDy: -9, badge: { x: 0.3, y: 0.36 }, badgeDx: 18, badgeDy: -0.5 },
};

/**
 * 赖子金色罩：贴图原始像素，原点在牌身左上角。
 * 正好罩住象牙正面，不吃进立牌顶绿边 / 出牌底绿边。
 */
export const FACE_TINT: Record<string, { x: number; y: number; w: number; h: number; r: number }> = {
  tile_hand: { x: 2, y: 10, w: 87, h: 124, r: 4 },
  tile_discard: { x: 1, y: 1, w: 44, h: 56, r: 4 },
  tile_meld: { x: 4, y: 3, w: 73, h: 100, r: 4 },
  tile_meld_side: { x: 2, y: 2, w: 51, h: 36, r: 4 },
};

/** 开局满手张数：碰/杠、甩赖子都按这个宽度锚定，不随当前手牌缩短而移动 */
export const FULL_HAND = 13;

/** 屏幕四个方位 */
export type Anchor = 'bottom' | 'right' | 'top' | 'left';

/**
 * 座位号 -> 屏幕方位。人类玩家永远在下方，其余按逆时针（下家在右）排列。
 */
export function anchorFor(seat: number, humanSeat: number, playerCount: number): Anchor {
  const offset = (seat - humanSeat + playerCount) % playerCount;
  if (playerCount === 2) return (['bottom', 'top'] as const)[offset];
  if (playerCount === 3) return (['bottom', 'right', 'left'] as const)[offset];
  return (['bottom', 'right', 'top', 'left'] as const)[offset];
}

/**
 * 各方位玩家面板中心点。头像落在牌区以外的边角，避免压住牌墙/出牌河。
 * 对家头像在 HUD 与对家手牌之间，不占屏幕正中（正中是对家牌背）。
 */
export const HEAD_POS: Record<Anchor, { x: number; y: number }> = {
  bottom: { x: 78, y: 538 },
  left: { x: 56, y: 292 },
  right: { x: 1224, y: 292 },
  top: { x: 380, y: 26 },
};

/** 面板内部尺寸：底板 84x108，头像 79x79，名条 74x26 */
export const PANEL = {
  plateScale: 0.92,
  avatarScale: 0.78,
  avatarDy: -16,
  nameDy: 28,
  scoreDy: 56,
  dealerDx: -36,
  dealerDy: -40,
  mulDy: -64,
} as const;

/** 绿毡桌面（牌河、牌墙、朝天都落在这张桌上） */
export const FELT = { x: 92, y: 40, w: 1096, h: 552, r: 18 } as const;

/** 自己的手牌基线 */
export const HAND = {
  scale: 0.78,
  centerX: DESIGN_W / 2 + 40,
  baseY: 658,
  /** 相邻牌的间距 */
  step: 68,
  /** 摸到的那张与其余手牌之间额外留出的空隙 */
  drawnGap: 28,
  /** 选中时抬起的高度 */
  liftY: 20,
} as const;

/** 中央指示器（轮次高亮 + 剩余张数） */
export const CENTER = { x: DESIGN_W / 2, y: 312, w: 104, h: 104 } as const;

/**
 * 出牌河：四家围着桌心排成一圈。rotate 让牌面朝向出牌的那一家。
 * 使用同一张立着的出牌贴图旋转，避免左右两侧被侧视贴图压扁。
 */
export const RIVER: Record<
  Anchor,
  { x: number; y: number; dx: number; dy: number; perRow: number; rowDx: number; rowDy: number; scale: number; rotate: number }
> = {
  bottom: { x: 500, y: 418, dx: 38, dy: 0, perRow: 8, rowDx: 0, rowDy: -44, scale: 0.82, rotate: 0 },
  top: { x: 780, y: 168, dx: -38, dy: 0, perRow: 8, rowDx: 0, rowDy: 44, scale: 0.82, rotate: Math.PI },
  left: { x: 368, y: 230, dx: 0, dy: 36, perRow: 6, rowDx: 48, rowDy: 0, scale: 0.78, rotate: Math.PI / 2 },
  right: { x: 908, y: 230, dx: 0, dy: 36, perRow: 6, rowDx: -48, rowDy: 0, scale: 0.78, rotate: -Math.PI / 2 },
};

/**
 * 左右暗牌槽位，直接取自 APK CardLayer3D：
 * left_hand_hide（zlp_14→zlp_1）、right_hand_hide（ylp_14→ylp_1）。
 * Cocos 原点在画布左下、Y 向上；这里已换成屏幕坐标（中心点，Y 向下）。
 * packed 从远端（对家方向）排到近端，drawn 是摸牌的独立空隙槽。
 */
function cocosCenter(x: number, y: number): { x: number; y: number } {
  return { x, y: DESIGN_H - y };
}

export const SIDE_HAND = {
  left: {
    packed: [
      cocosCenter(254.3922, 610.6987),
      cocosCenter(248.8036, 588.1175),
      cocosCenter(242.8333, 564.5009),
      cocosCenter(236.4665, 541.0208),
      cocosCenter(230.0234, 516.8203),
      cocosCenter(223.7081, 490.6755),
      cocosCenter(216.7253, 464.3221),
      cocosCenter(209.9832, 435.9215),
      cocosCenter(203.0022, 407.7044),
      cocosCenter(195.5844, 377.4639),
      cocosCenter(187.3102, 345.6964),
      cocosCenter(179.0687, 314.4915),
      cocosCenter(171.4452, 281.1396),
    ],
    drawn: cocosCenter(158.0248, 230.4422),
  },
  right: {
    packed: [
      cocosCenter(1030.573, 588.4651),
      cocosCenter(1039.7072, 557.0616),
      cocosCenter(1045.369, 533.339),
      cocosCenter(1051.9065, 506.8266),
      cocosCenter(1058.8059, 480.5877),
      cocosCenter(1065.9592, 453.5947),
      cocosCenter(1073.3523, 425.3692),
      cocosCenter(1080.432, 397.4307),
      cocosCenter(1088.0693, 367.2261),
      cocosCenter(1096.0636, 336.0368),
      cocosCenter(1104.2064, 304.122),
      cocosCenter(1112.5077, 270.4631),
      cocosCenter(1121.0497, 235.9869),
    ],
    drawn: cocosCenter(1129.9746, 199.2666),
  },
} as const;

/**
 * 其他玩家的暗牌。x/y 对 top 是水平中心，对 left/right 是垂直中心。
 * 对家用 bg_up_sp（立着的绿背 + 顶白边）。
 * 左右暗牌用 CardLayer3D 的 zlp/ylp 预渲染长方体，见 SIDE_HAND。
 * left/right 按满手 13 张锚定：右家从远端排（左侧近端留给碰杠），左家从近端排（左侧远端留给碰杠）。
 */
export const OTHER_HAND: Record<Anchor, { x: number; y: number; dx: number; dy: number; scale: number; drawnGap: number }> =
  {
    bottom: { x: 0, y: 0, dx: 0, dy: 0, scale: 1, drawnGap: 0 },
    /** 对家牌背贴远桌沿，低于头像、高于出牌河，左右不碰到侧牌墙 */
    top: { x: 668, y: 52, dx: 34, dy: 0, scale: 0.72, drawnGap: 16 },
    right: { x: 1118, y: 318, dx: 0, dy: 32, scale: 1.05, drawnGap: 18 },
    left: { x: 162, y: 318, dx: 0, dy: 32, scale: 1.05, drawnGap: 18 },
  };

/** 大厅界面 */
export const LOBBY = {
  titleY: 86,
  girlX: 220,
  girlY: 400,
  panelX: 820,
  panelY: 360,
  panelW: 560,
  panelH: 520,
} as const;

/**
 * 碰/杠：各家视角手牌的左侧。
 * 牌面与出牌河相同：同一套立牌贴图按该家 rotate，朝向自己。
 * 左右两家走 SIDE_MELD（沿方格透视斜边），这里只给上下两家用。
 */
/** 自家碰杠区与手牌左端之间留出的空隙 */
export const MELD_HAND_GAP = 46;

export const MELD_AREA: Record<
  Anchor,
  { x: number; y: number; dx: number; dy: number; tileDx: number; tileDy: number; scale: number }
> = {
  bottom: { x: 196, y: 586, dx: 86, dy: 0, tileDx: 34, tileDy: 0, scale: 0.5 },
  top: { x: 920, y: 54, dx: 86, dy: 0, tileDx: 26, tileDy: 0, scale: 0.36 },
  right: { x: 1124, y: 540, dx: 0, dy: 118, tileDx: 0, tileDy: 34, scale: 0.44 },
  left: { x: 270, y: 86, dx: 0, dy: 118, tileDx: 0, tileDy: 34, scale: 0.44 },
};

/**
 * 左/右/对家碰杠：按 APK CardLayer3D `{left,right,up}_gang_show`。
 * 牌身每槽一张预渲染长方体（左 `zpg*` / 右 `ygp*` / 对家 `spg*`），Sprite sizeMode=RAW，
 * 所以透视斜边已经画在贴图里，按原始尺寸摆在节点中心即可——不要拉伸、旋转或错切。
 * 子节点 card 只放牌面字：左右 euler.z ∓90° + skewY，对家用负缩放转 180°。
 * canvas 正旋转为顺时针，故 glyphRot = -euler.z；Y 向下故 skewY 取反。
 * 每组前 3 张成一排，第 4 张是杠的叠牌，恒在预制体子节点末位。
 */
export type SideMeldSlot = {
  /** 该槽位专属的预渲染长方体贴图，按原始尺寸 1:1 绘制 */
  sprite: ImageName;
  x: number;
  y: number;
  w: number;
  h: number;
  cardX: number;
  cardY: number;
  /** 对家为负值：APK 用负缩放把牌面字转 180° */
  cardSx: number;
  cardSy: number;
};

function gangSlot(
  sprite: ImageName,
  x: number,
  y: number,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardSx: number,
  cardSy: number
): SideMeldSlot {
  const c = cocosCenter(x, y);
  return { sprite, x: c.x, y: c.y, w, h, cardX, cardY: -cardY, cardSx, cardSy };
}

/**
 * 对家碰杠整体左移：APK 右上角放的是玩家信息，我们放了功能按钮条（x >= 936），
 * 直接用预制体坐标会被「规则」压住。顶部牌墙是左对齐的、每碰一次少 3 张，
 * 左移后四种张数下都仍与牌墙留有间隙。
 */
const TOP_MELD_DX = -60;

function topSlot(
  sprite: ImageName,
  x: number,
  y: number,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardSx: number,
  cardSy: number
): SideMeldSlot {
  return gangSlot(sprite, x + TOP_MELD_DX, y, w, h, cardX, cardY, cardSx, cardSy);
}

type SideMeldSide = {
  glyphRot: number;
  skewY: number;
  /** 明牌 `*_gang_show`，槽位按预制体子节点顺序，杠的第 4 张恒在末位 */
  groups: ReadonlyArray<ReadonlyArray<SideMeldSlot>>;
  /** 暗杠 `*_gang_hide`：另一套贴图和槽位，没有牌面字 */
  hidden: ReadonlyArray<ReadonlyArray<SideMeldSlot>>;
};

export const SIDE_MELD: Record<Anchor, SideMeldSide> = {
  left: {
    glyphRot: Math.PI / 2,
    skewY: (10 * Math.PI) / 180,
    groups: [
      [
        gangSlot('zpg4_3', 267.51, 634.74, 56, 39, 1.53, 9.81, 0.21, 0.35),
        gangSlot('zpg4_2', 262.3, 614.82, 57, 39, 2.15, 8.99, 0.23, 0.36),
        gangSlot('zpg4_1', 256.54, 594.21, 58, 40, 1.8, 8.81, 0.23, 0.36),
        gangSlot('zpg4_4', 257.96, 632.18, 57, 39, 2.67, 9.39, 0.23, 0.36),
      ],
      [
        gangSlot('zpg3_3', 250.57, 562.13, 59, 40, 1.59, 9.2, 0.23, 0.38),
        gangSlot('zpg3_2', 243.81, 539.83, 60, 41, 3.05, 8.72, 0.25, 0.39),
        gangSlot('zpg3_1', 238.54, 515.12, 61, 42, 1.44, 9.56, 0.25, 0.39),
        gangSlot('zpg3_4', 240.15, 557.59, 60, 42, 1.9, 8.16, 0.25, 0.39),
      ],
      [
        gangSlot('zpg2_3', 229.13, 480.5, 63, 44, 2.33, 8.86, 0.27, 0.4),
        gangSlot('zpg2_2', 222.86, 456.03, 64, 44, 1.93, 7.41, 0.29, 0.41),
        gangSlot('zpg2_1', 216.52, 427.5, 65, 45, 2.33, 9.19, 0.29, 0.41),
        gangSlot('zpg2_4', 216.84, 472.51, 64, 44, 3.08, 9.13, 0.27, 0.41),
      ],
      [
        gangSlot('zpg1_3', 206.39, 389.32, 66, 46, 2.72, 7.56, 0.3, 0.42),
        gangSlot('zpg1_2', 198.96, 359.92, 67, 47, 0.57, 7.95, 0.31, 0.43),
        gangSlot('zpg1_1', 191.11, 328.88, 69, 47, 0.22, 9.11, 0.32, 0.43),
        gangSlot('zpg1_4', 192.98, 377.88, 68, 48, -1.09, 8.78, 0.31, 0.43),
      ],
    ],
    hidden: [
      [
        gangSlot('zag4_3', 261.76, 664.66, 56, 39, 0, 0, 0, 0),
        gangSlot('zag4_2', 255.55, 644.74, 57, 39, 0, 0, 0, 0),
        gangSlot('zag4_1', 250.12, 624.13, 58, 39, 0, 0, 0, 0),
        gangSlot('zag4_4', 251.2, 662.1, 57, 39, 0, 0, 0, 0),
      ],
      [
        gangSlot('zag3_3', 243.81, 592.05, 59, 41, 0, 0, 0, 0),
        gangSlot('zag3_2', 237.05, 569.75, 60, 41, 0, 0, 0, 0),
        gangSlot('zag3_1', 231.79, 545.04, 61, 42, 0, 0, 0, 0),
        gangSlot('zag3_4', 233.39, 587.15, 60, 42, 0, 0, 0, 0),
      ],
      [
        gangSlot('zag2_3', 222.38, 510.42, 63, 43, 0, 0, 0, 0),
        gangSlot('zag2_2', 216.11, 485.95, 63, 44, 0, 0, 0, 0),
        gangSlot('zag2_1', 209.76, 457.42, 65, 45, 0, 0, 0, 0),
        gangSlot('zag2_4', 210.08, 502.43, 65, 44, 0, 0, 0, 0),
      ],
      [
        gangSlot('zag1_3', 199.63, 419.24, 66, 46, 0, 0, 0, 0),
        gangSlot('zag1_2', 192.21, 389.85, 67, 47, 0, 0, 0, 0),
        gangSlot('zag1_1', 184.35, 358.8, 69, 47, 0, 0, 0, 0),
        gangSlot('zag1_4', 186.22, 407.8, 68, 47, 0, 0, 0, 0),
      ],
    ],
  },
  right: {
    glyphRot: -Math.PI / 2,
    skewY: (-15 * Math.PI) / 180,
    groups: [
      [
        gangSlot('ygp1_3', 1129.34, 192.57, 77, 53, 0.52, 9.12, 0.38, 0.46),
        gangSlot('ygp1_2', 1138.46, 155.95, 79, 55, 0.73, 7.88, 0.42, 0.47),
        gangSlot('ygp1_1', 1148.6, 117.18, 81, 56, 0.34, 7.68, 0.42, 0.48),
        gangSlot('ygp1_4', 1145.36, 173.48, 81, 55, 0.42, 9.02, 0.41, 0.49),
      ],
      [
        gangSlot('ygp2_3', 1098.56, 310.49, 73, 50, 0.28, 8.13, 0.33, 0.44),
        gangSlot('ygp2_2', 1106.78, 277.47, 74, 51, 0.46, 8.36, 0.35, 0.45),
        gangSlot('ygp2_1', 1115.71, 243.49, 75, 52, 0.79, 9.39, 0.35, 0.45),
        gangSlot('ygp2_4', 1113.3, 296.65, 74, 51, 0.63, 9.62, 0.35, 0.45),
      ],
      [
        gangSlot('ygp3_3', 1072.4, 414.55, 68, 47, 1.44, 8.8, 0.3, 0.42),
        gangSlot('ygp3_2', 1079.79, 385.42, 69, 48, 0.84, 8.39, 0.31, 0.43),
        gangSlot('ygp3_1', 1087.34, 354.88, 71, 48, 0.57, 9.04, 0.31, 0.43),
        gangSlot('ygp3_4', 1085.28, 404.96, 70, 48, 1.35, 9.23, 0.31, 0.43),
      ],
      [
        gangSlot('ygp4_3', 1049.09, 508.74, 63, 43, -0.35, 8.66, 0.26, 0.4),
        gangSlot('ygp4_2', 1055.89, 481.84, 64, 45, -0.1, 8.44, 0.27, 0.41),
        gangSlot('ygp4_1', 1063.0, 453.71, 65, 46, 0.45, 9.35, 0.28, 0.41),
        gangSlot('ygp4_4', 1060.46, 500.83, 65, 45, 0.67, 8.48, 0.28, 0.41),
      ],
    ],
    hidden: [
      [
        gangSlot('yag1_3', 1119.49, 202.41, 77, 53, 0, 0, 0, 0),
        gangSlot('yag1_2', 1128.62, 165.79, 79, 55, 0, 0, 0, 0),
        gangSlot('yag1_1', 1138.76, 127.47, 81, 56, 0, 0, 0, 0),
        gangSlot('yag1_4', 1135.52, 183.32, 81, 55, 0, 0, 0, 0),
      ],
      [
        gangSlot('yag2_3', 1088.72, 320.33, 73, 50, 0, 0, 0, 0),
        gangSlot('yag2_2', 1096.94, 287.3, 74, 50, 0, 0, 0, 0),
        gangSlot('yag2_1', 1105.87, 253.33, 75, 52, 0, 0, 0, 0),
        gangSlot('yag2_4', 1103.46, 306.49, 74, 51, 0, 0, 0, 0),
      ],
      [
        gangSlot('yag3_3', 1062.56, 424.93, 68, 47, 0, 0, 0, 0),
        gangSlot('yag3_2', 1069.95, 395.26, 69, 48, 0, 0, 0, 0),
        gangSlot('yag3_1', 1077.5, 364.72, 71, 48, 0, 0, 0, 0),
        gangSlot('yag3_4', 1075.44, 414.79, 70, 48, 0, 0, 0, 0),
      ],
      [
        gangSlot('yag4_3', 1039.25, 518.57, 63, 43, 0, 0, 0, 0),
        gangSlot('yag4_2', 1046.05, 491.68, 64, 45, 0, 0, 0, 0),
        gangSlot('yag4_1', 1053.16, 463.91, 66, 46, 0, 0, 0, 0),
        gangSlot('yag4_4', 1050.62, 510.67, 66, 44, 0, 0, 0, 0),
      ],
    ],
  },
  top: {
    glyphRot: 0,
    skewY: 0,
    groups: [
      [
        topSlot('spg4_3', 967.15, 677, 43, 46, 1.76, 7.17, -0.32, -0.21),
        topSlot('spg4_2', 933.74, 677, 42, 46, 1.27, 7.17, -0.32, -0.21),
        topSlot('spg4_1', 900.61, 677, 42, 46, 1.37, 7.22, -0.32, -0.21),
        topSlot('spg4_4', 935.85, 696.31, 42, 46, 2.22, 8.61, -0.32, -0.21),
      ],
      [
        topSlot('spg3_3', 854.02, 677, 40, 46, 1.12, 7.58, -0.32, -0.21),
        topSlot('spg3_2', 825.46, 678, 39, 46, -3.89, 6.54, -0.32, -0.21),
        topSlot('spg3_1', 788.33, 677, 39, 46, 0.44, 7.66, -0.32, -0.21),
        topSlot('spg3_4', 824.03, 696.07, 40, 46, 0.88, 8.39, -0.32, -0.21),
      ],
      [
        topSlot('spg2_3', 740.98, 677, 37, 46, 0.29, 7.26, -0.32, -0.21),
        topSlot('spg2_2', 708.35, 677, 37, 46, 0.23, 7.28, -0.32, -0.21),
        topSlot('spg2_1', 675.49, 677, 36, 46, -0.75, 7.06, -0.32, -0.21),
        topSlot('spg2_4', 708.85, 695.77, 37, 46, 0.46, 8.36, -0.32, -0.21),
      ],
      [
        topSlot('spg1_3', 563.07, 677, 37, 46, -0.95, 7.53, -0.32, -0.21),
        topSlot('spg1_2', 595.92, 677, 35, 46, -0.48, 7.57, -0.32, -0.21),
        topSlot('spg1_1', 629.35, 677, 36, 46, -0.09, 7.57, -0.32, -0.21),
        topSlot('spg1_4', 595.92, 696.55, 36, 46, 0.07, 8.11, -0.32, -0.21),
      ],
    ],
    hidden: [
      [
        topSlot('sag4_3', 967.15, 677, 43, 46, 0, 0, 0, 0),
        topSlot('sag4_2', 933.74, 677, 42, 46, 0, 0, 0, 0),
        topSlot('sag4_1', 900.61, 677, 42, 46, 0, 0, 0, 0),
        topSlot('sag4_4', 935.85, 696.31, 42, 46, 0, 0, 0, 0),
      ],
      [
        topSlot('sag3_3', 854.02, 677, 40, 46, 0, 0, 0, 0),
        topSlot('sag3_2', 825.46, 678, 39, 46, 0, 0, 0, 0),
        topSlot('sag3_1', 788.33, 677, 39, 46, 0, 0, 0, 0),
        topSlot('sag3_4', 824.03, 696.07, 41, 46, 0, 0, 0, 0),
      ],
      [
        topSlot('sag2_3', 740.98, 677, 37, 46, 0, 0, 0, 0),
        topSlot('sag2_2', 708.35, 677, 37, 46, 0, 0, 0, 0),
        topSlot('sag2_1', 675.49, 677, 36, 46, 0, 0, 0, 0),
        topSlot('sag2_4', 708.85, 695.77, 37, 46, 0, 0, 0, 0),
      ],
      [
        topSlot('sag1_3', 563.07, 677, 37, 46, 0, 0, 0, 0),
        topSlot('sag1_2', 595.92, 677, 35, 46, 0, 0, 0, 0),
        topSlot('sag1_1', 629.35, 677, 36, 46, 0, 0, 0, 0),
        topSlot('sag1_4', 595.92, 696.55, 36, 46, 0, 0, 0, 0),
      ],
    ],
  },
  bottom: {
    glyphRot: 0,
    skewY: 0,
    groups: [
      [
        gangSlot('xpg1_3', 167.73, 41.76, 66, 73, -2.39, 9.82, 0.47, 0.47),
        gangSlot('xpg1_2', 216.2, 41.76, 65, 73, -2.35, 10.33, 0.47, 0.47),
        gangSlot('xpg1_1', 264.17, 41.76, 63, 73, -1.84, 11.29, 0.47, 0.47),
        gangSlot('xpg1_4', 211.24, 58.66, 66, 74, -2.26, 10.03, 0.47, 0.47),
      ],
      [
        gangSlot('xpg2_3', 330.81, 41.1, 61, 73, -1.18, 10.52, 0.47, 0.47),
        gangSlot('xpg2_2', 377.58, 41.1, 58, 73, -0.75, 10.52, 0.47, 0.47),
        gangSlot('xpg2_1', 426.03, 41.35, 57, 73, -0.96, 10.41, 0.47, 0.47),
        gangSlot('xpg2_4', 374.0, 59.43, 60, 74, -1.38, 10.01, 0.47, 0.47),
      ],
      [
        gangSlot('xpg3_3', 491.82, 41.89, 54, 73, -0.07, 10.28, 0.47, 0.47),
        gangSlot('xpg3_2', 540.52, 42.08, 53, 73, -0.21, 10.15, 0.47, 0.47),
        gangSlot('xpg3_1', 587.92, 42.08, 51, 73, -0.59, 10.15, 0.47, 0.47),
        gangSlot('xpg3_4', 539.59, 59.91, 54, 74, -0.16, 10.66, 0.47, 0.47),
      ],
      [
        gangSlot('xpg4_3', 750.41, 41.66, 54, 73, 0.36, 11.03, 0.47, 0.47),
        gangSlot('xpg4_2', 702.8, 41.66, 52, 73, -0.08, 11.06, 0.47, 0.47),
        gangSlot('xpg4_1', 655.16, 41.66, 50, 73, -0.23, 11.07, 0.47, 0.47),
        gangSlot('xpg4_4', 704.17, 60, 52, 74, 0.26, 10.55, 0.47, 0.47),
      ],
    ],
    hidden: [
      [
        gangSlot('xag1_3', 167.73, 41.76, 66, 73, 0, 0, 0, 0),
        gangSlot('xag1_2', 216.2, 41.76, 65, 73, 0, 0, 0, 0),
        gangSlot('xag1_1', 264.17, 41.76, 63, 73, 0, 0, 0, 0),
        gangSlot('xag1_4', 211.24, 58.66, 66, 75, 0, 0, 0, 0),
      ],
      [
        gangSlot('xag2_3', 330.81, 41.1, 61, 73, 0, 0, 0, 0),
        gangSlot('xag2_2', 377.58, 41.1, 59, 73, 0, 0, 0, 0),
        gangSlot('xag2_1', 426.03, 41.35, 57, 73, 0, 0, 0, 0),
        gangSlot('xag2_4', 374.0, 59.43, 60, 75, 0, 0, 0, 0),
      ],
      [
        gangSlot('xag3_3', 491.82, 41.89, 54, 73, 0, 0, 0, 0),
        gangSlot('xag3_2', 540.52, 42.08, 53, 73, 0, 0, 0, 0),
        gangSlot('xag3_1', 587.92, 42.08, 51, 73, 0, 0, 0, 0),
        gangSlot('xag3_4', 539.59, 59.91, 54, 75, 0, 0, 0, 0),
      ],
      [
        gangSlot('xag4_1', 750.41, 41.66, 50, 73, 0, 0, 0, 0),
        gangSlot('xag4_2', 702.8, 41.66, 52, 73, 0, 0, 0, 0),
        gangSlot('xag4_3', 655.16, 41.66, 54, 73, 0, 0, 0, 0),
        gangSlot('xag4_4', 704.17, 60, 52, 75, 0, 0, 0, 0),
      ],
    ],
  },
};

/** 操作按钮：右下角，避开右侧牌墙近端与自家手牌 */
export const BUTTONS = { x: 1216, y: 618, step: -110, size: 126, scale: 0.78 } as const;

/**
 * 甩出的赖子：按 APK CardLayer3D `*_lz_show`。
 * 和碰杠同一套路——每槽一张预渲染长方体（`xlz*` / `slz*` / `zlz*` / `ylz*`），
 * Sprite sizeMode=RAW，透视已经画进贴图，按槽位中心 1:1 摆放，不要拉伸或错切。
 * 槽位按预制体里的 `card_N` 排序，即甩牌的填充顺序：card_1 就是该家自己视角
 * 前方格的最右侧，往左依次排开。左家的 skewY 逐槽不同，所以存在槽位上。
 */
export type LaiziSlot = SideMeldSlot & {
  /** canvas 号的 skewY（= -预制体值），左家逐槽不同 */
  skewY: number;
  /** 预制体子节点次序，决定叠压先后 */
  z: number;
};

function lzSlot(
  sprite: ImageName,
  x: number,
  y: number,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardSx: number,
  cardSy: number,
  skewYDeg: number,
  z: number
): LaiziSlot {
  return {
    ...gangSlot(sprite, x, y, w, h, cardX, cardY, cardSx, cardSy),
    skewY: (skewYDeg * Math.PI) / 180,
    z,
  };
}

/**
 * 赖子落在牌河长条里、该家自己视角最右侧的那一格，往里依次排开。
 * APK 的 `*_lz_show` 是摆在牌河外侧空地上的，那套绝对坐标配我们更窄的牌河会飘出方格；
 * 槽距也比牌河密（右家 22 对 36），照搬会挤成一摞。所以只借贴图和牌面变换，
 * 位置一律落到 `RIVER` 的格子上。每 3 张一排，排与排照牌河的换行方向往里走。
 */
const LAIZI_GRID: Record<Anchor, { x: number; y: number; dx: number; dy: number }> = {
  bottom: { x: RIVER.bottom.x + RIVER.bottom.dx * RIVER.bottom.perRow, y: RIVER.bottom.y, dx: -RIVER.bottom.dx, dy: 0 },
  top: { x: RIVER.top.x + RIVER.top.dx * RIVER.top.perRow, y: RIVER.top.y, dx: -RIVER.top.dx, dy: 0 },
  left: { x: RIVER.left.x, y: RIVER.left.y + RIVER.left.dy * RIVER.left.perRow, dx: 0, dy: -RIVER.left.dy },
  right: { x: RIVER.right.x, y: RIVER.right.y - RIVER.right.dy, dx: 0, dy: RIVER.right.dy },
};

const LAIZI_PER_ROW = 3;

function lzBlock(anchor: Anchor, slots: LaiziSlot[]): ReadonlyArray<LaiziSlot> {
  const g = LAIZI_GRID[anchor];
  const r = RIVER[anchor];
  return slots.map((s, i) => {
    const col = i % LAIZI_PER_ROW;
    const row = Math.floor(i / LAIZI_PER_ROW);
    return { ...s, x: g.x + col * g.dx + row * r.rowDx, y: g.y + col * g.dy + row * r.rowDy };
  });
}

export const LAIZI_OUT: Record<Anchor, { glyphRot: number; slots: ReadonlyArray<LaiziSlot> }> = {
  bottom: {
    glyphRot: 0,
    slots: lzBlock('bottom', [
      lzSlot('xlz2_3', 956.6, 217.37, 56, 64, 1.5, 9.81, 0.45, 0.4, 0, 3),
      lzSlot('xlz2_2', 912.61, 217.04, 54, 64, 1.12, 10.28, 0.45, 0.4, 0, 4),
      lzSlot('xlz2_1', 868.55, 217.04, 52, 64, 0.74, 10.4, 0.45, 0.4, 0, 5),
      lzSlot('xlz2_6', 948.84, 264.55, 54, 62, 1.39, 10.1, 0.43, 0.38, 0, 0),
      lzSlot('xlz2_5', 906.2, 264.76, 52, 62, 1.01, 9.95, 0.43, 0.38, 0, 1),
      lzSlot('xlz2_4', 863.28, 264.55, 52, 62, 0.76, 10.22, 0.43, 0.38, 0, 2),
      lzSlot('xlz1_3', 960.96, 235.09, 57, 66, 0.78, 10.6, 0.45, 0.4, 0, 9),
      lzSlot('xlz1_2', 915.76, 235.25, 55, 66, 1.85, 10.51, 0.45, 0.4, 0, 10),
      lzSlot('xlz1_1', 871.52, 235.63, 54, 66, 1.22, 10.26, 0.45, 0.4, 0, 11),
      lzSlot('xlz1_6', 952.61, 282.28, 55, 64, 1.11, 11.26, 0.43, 0.38, 0, 6),
      lzSlot('xlz1_5', 908.78, 282.95, 53, 64, 0.86, 10.69, 0.43, 0.38, 0, 7),
      lzSlot('xlz1_4', 865.57, 282.86, 52, 64, 0.83, 10.48, 0.43, 0.38, 0, 8),
    ]),
  },
  top: {
    glyphRot: 0,
    slots: lzBlock('top', [
      lzSlot('slz2_6', 385.39, 582.8, 44, 50, -1.71, 6.63, -0.33, -0.26, 0, 0),
      lzSlot('slz2_5', 420.33, 582.8, 43, 50, -1.59, 6.82, -0.33, -0.26, 0, 1),
      lzSlot('slz2_4', 455.66, 582.8, 42, 50, -1.84, 6.85, -0.33, -0.26, 0, 2),
      lzSlot('slz2_3', 379.55, 549.83, 45, 50, -1.6, 7.03, -0.35, -0.27, 0, 3),
      lzSlot('slz2_2', 415.91, 549.83, 44, 50, -1.16, 7.43, -0.35, -0.27, 0, 4),
      lzSlot('slz2_1', 452.21, 549.52, 43, 50, -2.07, 7.49, -0.35, -0.27, 0, 5),
      lzSlot('slz1_6', 382.92, 599.41, 44, 50, -1.33, 7.65, -0.33, -0.26, 0, 6),
      lzSlot('slz1_5', 418.15, 599.41, 44, 50, -1.79, 7.8, -0.33, -0.26, 0, 7),
      lzSlot('slz1_4', 453.48, 599.41, 42, 50, -1.6, 7.8, -0.33, -0.26, 0, 8),
      lzSlot('slz1_3', 377.54, 568.1, 45, 51, -1.44, 6.97, -0.35, -0.27, 0, 9),
      lzSlot('slz1_2', 413.03, 568.1, 44, 51, -1.04, 6.97, -0.35, -0.27, 0, 10),
      lzSlot('slz1_1', 449.52, 568.1, 44, 51, -1.63, 7.55, -0.35, -0.27, 0, 11),
    ]),
  },
  left: {
    glyphRot: Math.PI / 2,
    slots: lzBlock('left', [
      lzSlot('zlz2_4', 354.42, 191.3, 71, 52, 0.99, 7.86, 0.38, 0.48, 9, 2),
      lzSlot('zlz2_5', 360.09, 227.11, 70, 52, 0.84, 7.69, 0.37, 0.47, 7, 1),
      lzSlot('zlz2_6', 365.28, 261.04, 68, 51, 1.0, 7.27, 0.36, 0.46, 9, 0),
      lzSlot('zlz2_1', 415.72, 191.29, 69, 52, 1.65, 7.96, 0.38, 0.48, 7, 5),
      lzSlot('zlz2_2', 419.5, 227.11, 67, 52, 1.33, 7.69, 0.37, 0.47, 7, 4),
      lzSlot('zlz2_3', 423.27, 261.09, 67, 51, 1.21, 7.3, 0.36, 0.46, 7, 3),
      lzSlot('zlz1_4', 351.12, 207.35, 73, 53, 0.44, 8.48, 0.39, 0.48, 9, 8),
      lzSlot('zlz1_5', 356.79, 243.22, 70, 52, 0.26, 8.26, 0.38, 0.48, 9, 7),
      lzSlot('zlz1_6', 361.98, 277.67, 69, 51, 0.91, 7.7, 0.37, 0.46, 9, 6),
      lzSlot('zlz1_1', 411.95, 207.65, 70, 53, 1.58, 8.18, 0.39, 0.48, 9, 11),
      lzSlot('zlz1_2', 416.66, 243.36, 69, 52, 1.72, 8.12, 0.38, 0.48, 9, 10),
      lzSlot('zlz1_3', 421.39, 277.67, 68, 51, 0.6, 7.7, 0.37, 0.46, 9, 9),
    ]),
  },
  right: {
    glyphRot: -Math.PI / 2,
    slots: lzBlock('right', [
      lzSlot('ylz2_3', 866.25, 599.43, 55, 40, 1.61, 8.36, 0.24, 0.35, -7, 0),
      lzSlot('ylz2_2', 868.14, 576.78, 56, 40, 3.38, 9.02, 0.24, 0.36, -7, 1),
      lzSlot('ylz2_1', 872.29, 554.0, 56, 41, 1.96, 10.02, 0.24, 0.36, -7, 2),
      lzSlot('ylz2_6', 818.27, 599.09, 54, 40, 1.28, 8.13, 0.24, 0.35, -7, 3),
      lzSlot('ylz2_5', 820.45, 576.78, 55, 40, 1.74, 8.53, 0.24, 0.36, -7, 4),
      lzSlot('ylz2_4', 822.71, 553.63, 56, 41, 2.52, 8.86, 0.24, 0.36, -7, 5),
      lzSlot('ylz1_3', 868.64, 618.98, 55, 41, 1.91, 8.62, 0.23, 0.35, -7, 6),
      lzSlot('ylz1_2', 871.7, 596.26, 56, 41, 2.36, 8.75, 0.24, 0.36, -7, 7),
      lzSlot('ylz1_1', 875.13, 573.1, 57, 42, 1.88, 9.13, 0.24, 0.36, -7, 8),
      lzSlot('ylz1_6', 820.16, 619.1, 54, 41, 1.39, 9.12, 0.23, 0.35, -7, 9),
      lzSlot('ylz1_5', 822.2, 596.26, 55, 41, 2.1, 8.72, 0.24, 0.36, -7, 10),
      lzSlot('ylz1_4', 825.0, 573.02, 57, 42, 1.06, 9.37, 0.24, 0.36, -7, 11),
    ]),
  },
};
