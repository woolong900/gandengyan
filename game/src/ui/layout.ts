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
 * 甩出的赖子：按 APK CardLayer3D `qj_*_lz_show`（**不是** `*_lz_show`——后者是另一套
 * 状态，摆在牌河外侧的空地上，和实机对不上）。每槽一张预渲染长方体
 * （`xqjlz*` / `sqjlz*` / `zqjlz*` / `yqjlz*`），Sprite sizeMode=RAW，
 * 透视和厚度已经画进贴图，按槽位中心 1:1 摆放，禁止拉伸或错切。
 * 槽位坐标直接照搬预制体：实机截图里赖子就落在这几个点上，正是各家长条方格的最右端。
 * 数组按 `card_N` 排，即甩牌的填充顺序；叠压另按预制体子节点次序 `z`。
 */
export type LaiziSlot = SideMeldSlot & {
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
  z: number
): LaiziSlot {
  return { ...gangSlot(sprite, x, y, w, h, cardX, cardY, cardSx, cardSy), z };
}

export const LAIZI_OUT: Record<
  Anchor,
  {
    glyphRot: number;
    skewY: number;
    /** 「癞」角标：card 的 `pz` 子节点，坐标在 card 局部空间里 */
    badge: { x: number; y: number; w: number; h: number };
    slots: ReadonlyArray<LaiziSlot>;
  }
> = {
  bottom: {
    glyphRot: 0,
    skewY: 0,
    badge: { x: 24.1, y: -30.7, w: 42, h: 48 },
    slots: [
      lzSlot('xqjlz1_2', 972.51, 135.31, 60, 70, 1.4, 10.32, 0.46, 0.42, 0),
      lzSlot('xqjlz2_1', 927.77, 134.89, 57, 69, 1.48, 10.25, 0.46, 0.42, 1),
      lzSlot('xqjlz1_2', 980.17, 152.36, 60, 70, -2.7, 9.69, 0.46, 0.42, 2),
      lzSlot('xqjlz1_1', 930.74, 151.94, 58, 70, 2.31, 10.37, 0.46, 0.42, 3),
      lzSlot('xqjlz1_1', 882.9, 135.09, 58, 70, 2.31, 10.37, 0.46, 0.42, 4),
      lzSlot('xqjlz1_1', 885.69, 151.94, 58, 70, 2.31, 10.37, 0.46, 0.42, 5),
    ],
  },
  top: {
    glyphRot: 0,
    skewY: 0,
    badge: { x: 26.2, y: -26.3, w: 42, h: 48 },
    slots: [
      lzSlot('sqjlz2_2', 391.51, 631.95, 43, 47, -1.46, 6.92, -0.32, -0.2409, 0),
      lzSlot('sqjlz2_1', 425.96, 631.86, 42, 47, -3.45, 5.73, -0.32, -0.2409, 1),
      lzSlot('sqjlz1_2', 389.63, 649.81, 42, 47, -1.57, 8.14, -0.32, -0.2409, 2),
      lzSlot('sqjlz2_2', 423.43, 649.73, 43, 47, -1.41, 7.73, -0.32, -0.2409, 3),
      lzSlot('sqjlz1_2', 460.09, 631.67, 42, 47, -1.57, 8.14, -0.32, -0.2409, 4),
      lzSlot('sqjlz2_2', 457.22, 649.73, 43, 47, -1.41, 7.73, -0.32, -0.2409, 5),
    ],
  },
  left: {
    glyphRot: Math.PI / 2,
    skewY: (10 * Math.PI) / 180,
    badge: { x: 18.9, y: -35.4, w: 42, h: 48 },
    slots: [
      lzSlot('zqjlz2_2', 262.95, 222.95, 72, 52, 0.1, 8.04, 0.35, 0.4581, 0),
      lzSlot('zqjlz_2_1', 256.17, 189.41, 73, 53, -0.12, 8.11, 0.35, 0.4581, 1),
      lzSlot('zqjlz1_2', 257.05, 240.06, 73, 52, -0.39, 7.91, 0.3884, 0.48, 2),
      lzSlot('zqjlz1_1', 250.54, 204.91, 75, 53, -1.07, 7.98, 0.3884, 0.48, 3),
      lzSlot('zqjlz1_2', 250.31, 152.22, 73, 52, -0.39, 7.91, 0.3884, 0.48, 4),
      lzSlot('zqjlz1_1', 244.01, 168.88, 75, 53, -1.07, 7.98, 0.3884, 0.48, 5),
    ],
  },
  right: {
    glyphRot: -Math.PI / 2,
    skewY: (-13 * Math.PI) / 180,
    badge: { x: 20.0, y: -29.4, w: 42, h: 48 },
    slots: [
      lzSlot('yqjlz1_2', 944.97, 601.66, 57, 40, -1.64, 7.3, 0.24, 0.37, 0),
      lzSlot('yqjlz1_1', 947.98, 576.43, 58, 42, 0.35, 8.79, 0.24, 0.37, 1),
      lzSlot('yqjlz1_2', 947.2, 618.84, 57, 40, -0.73, 9.03, 0.24, 0.37, 2),
      lzSlot('yqjlz1_1', 951.6, 595.84, 58, 42, -0.37, 8.52, 0.24, 0.37, 3),
      lzSlot('yqjlz1_2', 951.71, 554.77, 57, 40, -0.73, 9.03, 0.24, 0.37, 4),
      lzSlot('yqjlz1_1', 955.84, 571.58, 58, 42, -0.37, 8.52, 0.24, 0.37, 5),
    ],
  },
};
