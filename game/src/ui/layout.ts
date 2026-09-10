/**
 * 界面布局常量。设计分辨率 1280x720（横屏）。
 * 牌桌分区对标 APK CardLayer3D + 布局.PNG，由内到外互不重叠：
 *   中央指示 → 出牌河 → 甩赖子角落 → 手牌墙（左右 zlp/ylp，对家牌背，自家手牌）
 *   碰杠离开暗牌墙；头像在边角。
 */

import { RIVER_TILES, type ImageName } from './assets';

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
 * 方位照 APK GameScene/3dLayer/PlayerLayer（Canvas 中心为原点，已换成屏幕坐标）：
 * Up (1141.5, 72.5)、Right (1230.5, 276)、Left (40.5, 216.5)、Down (40.5, 553.5)。
 * 对家在**右上角**，正好让开它自己摸牌的那一格（在满手最左槽再往左一格）。
 * y 比 APK 低一些：我们的面板比 APK 的 65x65 头像高得多，上面还挂着倍数角标，
 * 顶在 72 会被右上角的功能按钮条（y <= 48）压住。
 */
export const HEAD_POS: Record<Anchor, { x: number; y: number }> = {
  bottom: { x: 78, y: 538 },
  left: { x: 56, y: 292 },
  right: { x: 1224, y: 292 },
  top: { x: 1141, y: 132 },
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

function cocosCenter(x: number, y: number): { x: number; y: number } {
  return { x, y: DESIGN_H - y };
}

/** 左右暗牌的一个槽位；`tile` 是该槽专属的预渲染长方体编号（zlp / ylp，1 最近最大、14 最远最小） */
function handSlot(x: number, y: number, tile: number): { x: number; y: number; tile: number } {
  return { ...cocosCenter(x, y), tile };
}

/**
 * 左右暗牌槽位，直接取自 APK CardLayer3D 的 left_hand_hide / right_hand_hide（各 14 槽）。
 * Cocos 原点在画布左下、Y 向上；这里已换成屏幕坐标（中心点，Y 向下）。
 * `packed` 一律从远端（对家方向）排到近端，`drawn` 是摸牌的独立空隙槽。
 *
 * 摸牌槽在**那一家自己的右手边**，而两家面朝的方向相反，所以在屏幕上分处两端：
 * 左家面朝右，右手边是屏幕**下方**；右家面朝左，右手边是屏幕**上方**。
 * 预制体里这个位置是靠步距认出来的——14 个槽的步距随透视单调变化，唯一破规律的那一处
 * 就是留给摸牌的缝：左家在最后（33.35 → 50.70），右家在**最前**（本该 ~23 却是 31.41）。
 * 预制体的槽名也跟着各自的手别走：两家都是 `card_14` 当摸牌槽，但左家 card_1 在远端、
 * 右家 card_1 在近端。所以**别**按名字或数组下标推贴图编号，编号记在槽位里。
 */
export const SIDE_HAND = {
  left: {
    packed: [
      handSlot(254.3922, 610.6987, 14),
      handSlot(248.8036, 588.1175, 13),
      handSlot(242.8333, 564.5009, 12),
      handSlot(236.4665, 541.0208, 11),
      handSlot(230.0234, 516.8203, 10),
      handSlot(223.7081, 490.6755, 9),
      handSlot(216.7253, 464.3221, 8),
      handSlot(209.9832, 435.9215, 7),
      handSlot(203.0022, 407.7044, 6),
      handSlot(195.5844, 377.4639, 5),
      handSlot(187.3102, 345.6964, 4),
      handSlot(179.0687, 314.4915, 3),
      handSlot(171.4452, 281.1396, 2),
    ],
    drawn: handSlot(158.0248, 230.4422, 1),
  },
  right: {
    packed: [
      handSlot(1039.7072, 557.0616, 13),
      handSlot(1045.369, 533.339, 12),
      handSlot(1051.9065, 506.8266, 11),
      handSlot(1058.8059, 480.5877, 10),
      handSlot(1065.9592, 453.5947, 9),
      handSlot(1073.3523, 425.3692, 8),
      handSlot(1080.432, 397.4307, 7),
      handSlot(1088.0693, 367.2261, 6),
      handSlot(1096.0636, 336.0368, 5),
      handSlot(1104.2064, 304.122, 4),
      handSlot(1112.5077, 270.4631, 3),
      handSlot(1121.0497, 235.9869, 2),
      handSlot(1129.9746, 199.2666, 1),
    ],
    drawn: handSlot(1030.573, 588.4651, 14),
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
 * 子节点 card 只放牌面字：左右 euler.z ∓90°，对家用负缩放转 180°，各家再按牌面剪切
 * （见 `SideMeldSlot.shear`）。canvas 正旋转为顺时针，故 glyphRot = -euler.z。
 * 每组前 3 张成一排，第 4 张是杠的叠牌，恒在预制体子节点末位。
 */
/** 画牌面字所需的最小信息，碰杠、甩出的赖子、牌河共用一套变换 */
export type FaceSlot = {
  /** 该槽位专属的预渲染长方体贴图，按原始尺寸 1:1 绘制 */
  sprite: ImageName;
  x: number;
  y: number;
  cardX: number;
  cardY: number;
  /** 对家为负值：APK 用负缩放把牌面字转 180° */
  cardSx: number;
  cardSy: number;
  /**
   * 牌面字的屏幕剪切量 `dx/dy`：把字剪成和这张贴图画好的牌面同一个平行四边形。
   * 直接取贴图自身象牙面侧缘的斜率，而不是搬预制体 card 的 `skewX`/`skewY` 角度
   * ——见 `FACE_SHEAR` 注释。暗杠没有牌面字，恒为 0。
   */
  shear: number;
};

/** 碰杠槽位：牌身按 `w`x`h` 的原始尺寸摆（贴图没加载出来时用作兜底） */
export type SideMeldSlot = FaceSlot & { w: number; h: number };

/**
 * 为什么不搬预制体的 skew 角度：预制体 card 的 skew 是在**缩放之后**参与复合的
 * （cocos `_updateLocalMatrix` 把 skew 乘在旋转缩放矩阵右侧），所以屏幕上看到的斜率
 * 会被 `|sy/sx|` 放大。自家 card 缩放是等比的（0.47/0.47），放大系数为 1，量出来的
 * 贴图牌面斜率和 `tan(skewX)` 几乎完全重合（−0.230 对 −0.231），说明美术当年就是照着
 * 牌面调的。但左右两家和对家的 card 是非等比缩放，同一个角度经放大后就偏了：
 * 右家赖子 `sy/sx = 1.54`，13° 放大成 0.356，而贴图牌面只有 0.159——字比牌面歪一倍多，
 * 这就是左右两家「字看着没对齐」的来源。
 *
 * 所以剪切量一律**从贴图自身量**：扫象牙面（`r > 150` 且 `|r − g| < 40`）每行的左右缘，
 * 去掉上下各 28% 的圆角，最小二乘拟合 `dx/dy`，左右缘取平均。四家贴图的上下缘量出来
 * 都是 0.000，即牌面是「上下边水平、侧边倾斜」的平行四边形，所以剪切放在屏幕空间
 * （旋转之前）就够，不必再区分 skewX / skewY。
 *
 * 量出来的值本身也自洽：自家从屏幕左 −0.230 平滑升到中线 0.000，对家 +0.209 降到 0.000
 * ——剪切量就是牌离镜头轴的横向距离，越靠边越斜。左右两家的牌都挤在同一侧，斜率基本恒定，
 * 逐张量出来的 ±0.05 抖动是小图圆角带来的噪声，所以整边取中位数，别逐槽取。
 */
const LEFT_MELD_SHEAR = -0.2;
const RIGHT_MELD_SHEAR = 0.252;

/**
 * 剪切量其实只取决于这张牌离镜头轴（屏幕 x = 640）的横向距离，四家、各个区域是同一条
 * 直线：拿牌河那 120 张贴图逐张量出来拟合，`shear = 0.000545 × (x − 640)`，残差中位 0.009。
 * 这条线也复现了上面几个手量的值——x=270 → −0.201（对 `LEFT_MELD_SHEAR` −0.2）、
 * x=1100 → +0.250（对 `RIGHT_MELD_SHEAR` +0.252）、自家碰杠最左端 x=200 → −0.240（对 −0.230）。
 * 牌河槽位多达 200 个，逐槽列表没有意义，直接按这条线算。
 */
function faceShear(x: number): number {
  return Math.round(0.000545 * (x - DESIGN_W / 2) * 1000) / 1000;
}

function gangSlot(
  sprite: ImageName,
  x: number,
  y: number,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardSx: number,
  cardSy: number,
  /** 牌面剪切量 `dx/dy`，见 `SideMeldSlot.shear`。暗杠不传 */
  shear = 0
): SideMeldSlot {
  const c = cocosCenter(x, y);
  return {
    sprite,
    x: c.x,
    y: c.y,
    w,
    h,
    cardX,
    cardY: -cardY,
    cardSx,
    cardSy,
    shear,
  };
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
  cardSy: number,
  shear = 0
): SideMeldSlot {
  return gangSlot(sprite, x + TOP_MELD_DX, y, w, h, cardX, cardY, cardSx, cardSy, shear);
}

type SideMeldSide = {
  glyphRot: number;
  /** 明牌 `*_gang_show`，槽位按预制体子节点顺序，杠的第 4 张恒在末位 */
  groups: ReadonlyArray<ReadonlyArray<SideMeldSlot>>;
  /** 暗杠 `*_gang_hide`：另一套贴图和槽位，没有牌面字 */
  hidden: ReadonlyArray<ReadonlyArray<SideMeldSlot>>;
};

/**
 * 暗杠 `*_gang_hide`：另有一套绿背朝上的贴图，但槽位和明牌 `*_gang_show` 是**同一批**。
 * 预制体里 `left_gang_hide` / `right_gang_hide` 这两个节点自身带偏移
 * （(6.94, -29.96) / (10, -10)），加上之后逐槽和明牌重合到 1.2px 以内，贴图编号也一一
 * 对应（`zag4_3` <-> `zpg4_3`）；上下两家偏移是 0，坐标本来就一样。所以暗杠槽位一律从
 * 明牌槽**换贴图**得来。**禁止**照抄 hide 子节点的局部坐标——那样左右两家的暗杠会和碰
 * 错开 30px / 14px，看着就是「碰牌和杠牌不在一条线上」。
 *
 * 顺带纠正 APK 自己的一处错配：`down_gang_hide` 第 4 组把 `xag4_1`（50px 宽）摆在了要
 * 54px 的那一格上，组内三张的编号是反的。按 show 的编号换贴图就对了。
 */
function hiddenOf(
  groups: ReadonlyArray<ReadonlyArray<SideMeldSlot>>,
  show: string,
  hide: string
): ReadonlyArray<ReadonlyArray<SideMeldSlot>> {
  // 扣着的那几张没有牌面字，牌面那套变换参数一律清零
  return groups.map((g) =>
    g.map((s) => ({ ...s, sprite: s.sprite.replace(show, hide) as ImageName, cardSx: 0, cardSy: 0, shear: 0 }))
  );
}

function meldSide(
  glyphRot: number,
  show: string,
  hide: string,
  groups: ReadonlyArray<ReadonlyArray<SideMeldSlot>>
): SideMeldSide {
  return { glyphRot, groups, hidden: hiddenOf(groups, show, hide) };
}

export const SIDE_MELD: Record<Anchor, SideMeldSide> = {
  left: meldSide(Math.PI / 2, 'zpg', 'zag', [
      [
        gangSlot('zpg4_3', 267.51, 634.74, 56, 39, 1.53, 9.81, 0.21, 0.35, LEFT_MELD_SHEAR),
        gangSlot('zpg4_2', 262.3, 614.82, 57, 39, 2.15, 8.99, 0.23, 0.36, LEFT_MELD_SHEAR),
        gangSlot('zpg4_1', 256.54, 594.21, 58, 40, 1.8, 8.81, 0.23, 0.36, LEFT_MELD_SHEAR),
        gangSlot('zpg4_4', 257.96, 632.18, 57, 39, 2.67, 9.39, 0.23, 0.36, LEFT_MELD_SHEAR),
      ],
      [
        gangSlot('zpg3_3', 250.57, 562.13, 59, 40, 1.59, 9.2, 0.23, 0.38, LEFT_MELD_SHEAR),
        gangSlot('zpg3_2', 243.81, 539.83, 60, 41, 3.05, 8.72, 0.25, 0.39, LEFT_MELD_SHEAR),
        gangSlot('zpg3_1', 238.54, 515.12, 61, 42, 1.44, 9.56, 0.25, 0.39, LEFT_MELD_SHEAR),
        gangSlot('zpg3_4', 240.15, 557.59, 60, 42, 1.9, 8.16, 0.25, 0.39, LEFT_MELD_SHEAR),
      ],
      [
        gangSlot('zpg2_3', 229.13, 480.5, 63, 44, 2.33, 8.86, 0.27, 0.4, LEFT_MELD_SHEAR),
        gangSlot('zpg2_2', 222.86, 456.03, 64, 44, 1.93, 7.41, 0.29, 0.41, LEFT_MELD_SHEAR),
        gangSlot('zpg2_1', 216.52, 427.5, 65, 45, 2.33, 9.19, 0.29, 0.41, LEFT_MELD_SHEAR),
        gangSlot('zpg2_4', 216.84, 472.51, 64, 44, 3.08, 9.13, 0.27, 0.41, LEFT_MELD_SHEAR),
      ],
      [
        gangSlot('zpg1_3', 206.39, 389.32, 66, 46, 2.72, 7.56, 0.3, 0.42, LEFT_MELD_SHEAR),
        gangSlot('zpg1_2', 198.96, 359.92, 67, 47, 0.57, 7.95, 0.31, 0.43, LEFT_MELD_SHEAR),
        gangSlot('zpg1_1', 191.11, 328.88, 69, 47, 0.22, 9.11, 0.32, 0.43, LEFT_MELD_SHEAR),
        gangSlot('zpg1_4', 192.98, 377.88, 68, 48, -1.09, 8.78, 0.31, 0.43, LEFT_MELD_SHEAR),
      ],
    ]),
  right: meldSide(-Math.PI / 2, 'ygp', 'yag', [
      [
        gangSlot('ygp1_3', 1129.34, 192.57, 77, 53, 0.52, 9.12, 0.38, 0.46, RIGHT_MELD_SHEAR),
        gangSlot('ygp1_2', 1138.46, 155.95, 79, 55, 0.73, 7.88, 0.42, 0.47, RIGHT_MELD_SHEAR),
        gangSlot('ygp1_1', 1148.6, 117.18, 81, 56, 0.34, 7.68, 0.42, 0.48, RIGHT_MELD_SHEAR),
        gangSlot('ygp1_4', 1145.36, 173.48, 81, 55, 0.42, 9.02, 0.41, 0.49, RIGHT_MELD_SHEAR),
      ],
      [
        gangSlot('ygp2_3', 1098.56, 310.49, 73, 50, 0.28, 8.13, 0.33, 0.44, RIGHT_MELD_SHEAR),
        gangSlot('ygp2_2', 1106.78, 277.47, 74, 51, 0.46, 8.36, 0.35, 0.45, RIGHT_MELD_SHEAR),
        gangSlot('ygp2_1', 1115.71, 243.49, 75, 52, 0.79, 9.39, 0.35, 0.45, RIGHT_MELD_SHEAR),
        gangSlot('ygp2_4', 1113.3, 296.65, 74, 51, 0.63, 9.62, 0.35, 0.45, RIGHT_MELD_SHEAR),
      ],
      [
        gangSlot('ygp3_3', 1072.4, 414.55, 68, 47, 1.44, 8.8, 0.3, 0.42, RIGHT_MELD_SHEAR),
        gangSlot('ygp3_2', 1079.79, 385.42, 69, 48, 0.84, 8.39, 0.31, 0.43, RIGHT_MELD_SHEAR),
        gangSlot('ygp3_1', 1087.34, 354.88, 71, 48, 0.57, 9.04, 0.31, 0.43, RIGHT_MELD_SHEAR),
        gangSlot('ygp3_4', 1085.28, 404.96, 70, 48, 1.35, 9.23, 0.31, 0.43, RIGHT_MELD_SHEAR),
      ],
      [
        gangSlot('ygp4_3', 1049.09, 508.74, 63, 43, -0.35, 8.66, 0.26, 0.4, RIGHT_MELD_SHEAR),
        gangSlot('ygp4_2', 1055.89, 481.84, 64, 45, -0.1, 8.44, 0.27, 0.41, RIGHT_MELD_SHEAR),
        gangSlot('ygp4_1', 1063.0, 453.71, 65, 46, 0.45, 9.35, 0.28, 0.41, RIGHT_MELD_SHEAR),
        gangSlot('ygp4_4', 1060.46, 500.83, 65, 45, 0.67, 8.48, 0.28, 0.41, RIGHT_MELD_SHEAR),
      ],
    ]),
  top: meldSide(0, 'spg', 'sag', [
      [
        topSlot('spg4_3', 967.15, 677, 43, 46, 1.76, 7.17, -0.32, -0.21, 0.209),
        topSlot('spg4_2', 933.74, 677, 42, 46, 1.27, 7.17, -0.32, -0.21, 0.189),
        topSlot('spg4_1', 900.61, 677, 42, 46, 1.37, 7.22, -0.32, -0.21, 0.156),
        topSlot('spg4_4', 935.85, 696.31, 42, 46, 2.22, 8.61, -0.32, -0.21, 0.181),
      ],
      [
        topSlot('spg3_3', 854.02, 677, 40, 46, 1.12, 7.58, -0.32, -0.21, 0.147),
        topSlot('spg3_2', 825.46, 678, 39, 46, -3.89, 6.54, -0.32, -0.21, 0.099),
        topSlot('spg3_1', 788.33, 677, 39, 46, 0.44, 7.66, -0.32, -0.21, 0.083),
        topSlot('spg3_4', 824.03, 696.07, 40, 46, 0.88, 8.39, -0.32, -0.21, 0.102),
      ],
      [
        topSlot('spg2_3', 740.98, 677, 37, 46, 0.29, 7.26, -0.32, -0.21, 0.048),
        topSlot('spg2_2', 708.35, 677, 37, 46, 0.23, 7.28, -0.32, -0.21, 0.063),
        topSlot('spg2_1', 675.49, 677, 36, 46, -0.75, 7.06, -0.32, -0.21, 0),
        topSlot('spg2_4', 708.85, 695.77, 37, 46, 0.46, 8.36, -0.32, -0.21, 0.039),
      ],
      [
        topSlot('spg1_3', 563.07, 677, 37, 46, -0.95, 7.53, -0.32, -0.21, -0.039),
        topSlot('spg1_2', 595.92, 677, 35, 46, -0.48, 7.57, -0.32, -0.21, -0.023),
        topSlot('spg1_1', 629.35, 677, 36, 46, -0.09, 7.57, -0.32, -0.21, 0),
        topSlot('spg1_4', 595.92, 696.55, 36, 46, 0.07, 8.11, -0.32, -0.21, -0.023),
      ],
    ]),
  bottom: meldSide(0, 'xpg', 'xag', [
      [
        gangSlot('xpg1_3', 167.73, 41.76, 66, 73, -2.39, 9.82, 0.47, 0.47, -0.23),
        gangSlot('xpg1_2', 216.2, 41.76, 65, 73, -2.35, 10.33, 0.47, 0.47, -0.2),
        gangSlot('xpg1_1', 264.17, 41.76, 63, 73, -1.84, 11.29, 0.47, 0.47, -0.188),
        gangSlot('xpg1_4', 211.24, 58.66, 66, 74, -2.26, 10.03, 0.47, 0.47, -0.211),
      ],
      [
        gangSlot('xpg2_3', 330.81, 41.1, 61, 73, -1.18, 10.52, 0.47, 0.47, -0.151),
        gangSlot('xpg2_2', 377.58, 41.1, 58, 73, -0.75, 10.52, 0.47, 0.47, -0.126),
        gangSlot('xpg2_1', 426.03, 41.35, 57, 73, -0.96, 10.41, 0.47, 0.47, -0.099),
        gangSlot('xpg2_4', 374.0, 59.43, 60, 74, -1.38, 10.01, 0.47, 0.47, -0.133),
      ],
      [
        gangSlot('xpg3_3', 491.82, 41.89, 54, 73, -0.07, 10.28, 0.47, 0.47, -0.067),
        gangSlot('xpg3_2', 540.52, 42.08, 53, 73, -0.21, 10.15, 0.47, 0.47, -0.035),
        gangSlot('xpg3_1', 587.92, 42.08, 51, 73, -0.59, 10.15, 0.47, 0.47, -0.041),
        gangSlot('xpg3_4', 539.59, 59.91, 54, 74, -0.16, 10.66, 0.47, 0.47, -0.051),
      ],
      [
        gangSlot('xpg4_3', 750.41, 41.66, 54, 73, 0.36, 11.03, 0.47, 0.47, 0.063),
        gangSlot('xpg4_2', 702.8, 41.66, 52, 73, -0.08, 11.06, 0.47, 0.47, 0.024),
        gangSlot('xpg4_1', 655.16, 41.66, 50, 73, -0.23, 11.07, 0.47, 0.47, 0),
        gangSlot('xpg4_4', 704.17, 60, 52, 74, 0.26, 10.55, 0.47, 0.47, 0.024),
      ],
    ]),
};

/** 操作按钮：右下角，避开右侧牌墙近端与自家手牌 */
export const BUTTONS = { x: 1216, y: 618, step: -110, size: 126, scale: 0.78 } as const;

/**
 * 甩出的赖子：按 APK CardLayer3D `qj_*_lz_show`（**不是** `*_lz_show`——后者摆在牌河外侧的
 * 空地上，和实机差 50~80px）。每槽一张预渲染长方体（`xqjlz*` / `sqjlz*` / `zqjlz*` / `yqjlz*`），
 * Sprite sizeMode=RAW，透视和厚度已经画进贴图，按槽位中心 1:1 摆放，禁止拉伸或错切。
 *
 * 预制体那 6 个槽其实是 3 摞 × 2 层：`card_1/2/5` 是三摞的底，`card_3/4/6` 分别摞在它们
 * 头上。我们不摞，一律平铺成一排——赖子每种 4 张，一排放得下，起点和格距都取近排的。
 *
 * **一排牌必须沿着自己牌面那条边的方向走**，否则接缝上会露出上面那张的角：
 *
 * - **自家/对家**并排横排，一排看的是整排的**上缘**——四家贴图的上下缘量出来都是水平的
 *   （斜率 0.000），所以横着走、y 不动（预制体的 dy 也确实只有 0.11 / 0.14px）。
 * - **左右两家**沿视线方向排，看的是整叠**左右两侧**的轮廓线，步进斜率见 `LZ_LEAD`。
 *   预制体那几个 x 是手摆的：右家第 1→2 张的步进斜率只有 0.119、左家第 2→3 张只有 0.158，
 *   各差出 1~1.7px，就是从自己视角看「上面那张比较靠右」。**别照搬预制体的 x**。
 *
 * 方向对了之后，整排统一用**一张**贴图 + 匀距最平；交替用预制体的两个变体反而差
 * （`yqjlz1_1` 58×42 比 `yqjlz1_2` 57×40 大一圈，一大一小地排，边缘就成锯齿）。
 * 格距取预制体近排三张的平均，第 4 张按同一步长外推。
 */
export type LaiziSlot = SideMeldSlot;

/** 赖子上限 4 张（每种牌 4 张），一排放得下 */
const LAIZI_MAX = 4;

/**
 * 左右两家一排牌的步进斜率：取牌面**前进那一侧**边的斜率（右家往右下走，取右缘 +0.196；
 * 左家往左下走，取左缘 −0.216），而不是两侧的平均 `shear`。
 *
 * 牌面其实是**梯形**不是平行四边形——近端更宽，右家左缘 +0.121 而右缘 +0.196。整排只用
 * 一张贴图，两侧就不可能同时接上。但两侧不对等：前进那一侧要靠后甩的那张盖住前一张，
 * 露出来就是一个探头的角；另一侧本来就该看见前面那些张。所以要接的是前进侧。
 * 取平均值时右侧每条缝还探出 0.4~1.3px，取前进侧后只剩圆角带来的 0.36px。
 */
const LZ_LEAD = { left: -0.216, right: 0.196 } as const;

/**
 * 左右两家：沿方格长边排，横向位移由 `LZ_LEAD` 定死。
 * `step` 是**屏幕**纵向格距：正数往近端（屏幕下方）排，负数往远端（上方）排。
 */
function lzDepthRow(
  sprite: ImageName,
  x: number,
  y: number,
  step: number,
  lead: number,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardSx: number,
  cardSy: number,
  shear: number
): ReadonlyArray<LaiziSlot> {
  return lzRow(sprite, x, y, lead * step, -step, w, h, cardX, cardY, cardSx, cardSy, shear);
}

/** 单张贴图沿等距直线平铺；`dx`/`dy` 是 cocos 号的步长，方向见上面的注释 */
function lzRow(
  sprite: ImageName,
  x: number,
  y: number,
  dx: number,
  dy: number,
  w: number,
  h: number,
  cardX: number,
  cardY: number,
  cardSx: number,
  cardSy: number,
  shear: number
): ReadonlyArray<LaiziSlot> {
  return Array.from({ length: LAIZI_MAX }, (_, i) =>
    gangSlot(sprite, x + dx * i, y + dy * i, w, h, cardX, cardY, cardSx, cardSy, shear)
  );
}

export const LAIZI_OUT: Record<
  Anchor,
  {
    glyphRot: number;
    /** 「癞」角标：card 的 `pz` 子节点，坐标在 card 局部空间里 */
    badge: { x: number; y: number; w: number; h: number };
    slots: ReadonlyArray<LaiziSlot>;
  }
> = {
  bottom: {
    glyphRot: 0,
    badge: { x: 24.1, y: -30.7, w: 42, h: 48 },
    slots: lzRow('xqjlz1_2', 972.51, 135.31, -44.81, -0.11, 60, 70, 1.4, 10.32, 0.46, 0.42, 0.17),
  },
  top: {
    glyphRot: 0,
    badge: { x: 26.2, y: -26.3, w: 42, h: 48 },
    slots: lzRow('sqjlz2_2', 391.51, 631.95, 34.29, -0.14, 43, 47, -1.46, 6.92, -0.32, -0.2409, -0.158),
  },
  /**
   * 左右两家：格距取近排平均（左 (222.95−152.22)/2、右 (601.66−554.77)/2），横向位移
   * = `LZ_LEAD` × 格距。card 偏移取近排三张的平均，缩放取整边一个值（左家 card_5 自带的
   * 0.3884/0.48 是孤例）。
   *
   * 一排**往那一家自己的左手边**排（四家都是：自家往屏幕左、对家往屏幕右、右家往屏幕下）。
   * 左家面朝右，他的左手边是屏幕**上方**，所以要往上排——屏幕上看就是从左往右，因为
   * 方格是斜的，往上走 x 就变大。
   *
   * 预制体的三个底槽（card_1 / card_2 / card_5）就是方格靠近端那三格，但**左家的槽号是
   * 反的**：card_1 在他左手边（屏幕上方 497）、card_5 在右手边（屏幕下方 568）。照 card_1
   * 往下排，第 3、4 张会冲出方格下端（那儿到 y≈593 就到底了）撞进自家甩牌区。左家起点取
   * **右手边数过来第二格** card_2（屏幕 530.6），往上排 4 张正好落在 y 398~557，全在格内。
   */
  left: {
    glyphRot: Math.PI / 2,
    badge: { x: 18.9, y: -35.4, w: 42, h: 48 },
    slots: lzDepthRow('zqjlz1_2', 256.17, 189.41, -35.365, LZ_LEAD.left, 73, 52, -0.14, 8.02, 0.35, 0.4581, -0.203),
  },
  right: {
    glyphRot: -Math.PI / 2,
    badge: { x: 20.0, y: -29.4, w: 42, h: 48 },
    slots: lzDepthRow('yqjlz1_2', 944.97, 601.66, 23.445, LZ_LEAD.right, 57, 40, -0.67, 8.37, 0.24, 0.37, 0.159),
  },
};

/**
 * 出牌河：按 APK CardLayer3D `*_out_show`。每槽一张预渲染长方体，Sprite sizeMode=RAW
 * ——透视和厚度都已经画进贴图，1:1 摆在槽位中心即可，**禁止**用一张平牌贴图旋转顶替。
 *
 * 四家一个套路：桌面上 3 排，**第 1 排贴桌心**、往自己这边一排排长；满了以后第 4、5 排
 * 原样**摞在第 1、2 排头上**（整排一个固定偏移，约一个牌厚）。一排从那一家自己的
 * **左手边**排到右手边（自家往屏幕右、对家往屏幕左、左家往屏幕下、右家往屏幕上）。
 *
 * **一排一律 7 张**，上限 5 排 35 张。自家/对家的槽位虽有 13 个，平时只用居中的
 * `card_5..card_11`——APK 的 `_outIndex` 就是这么算的：
 *   `13 * floor(i / 7) + (i % 7 + 4)`，二人局（`isErRen`）才退化成 `i`、铺满 13 个。
 * 从 `card_1` 起铺满 13 个会让整排偏向那一家的左手边，还会长到和左右两家的牌河打架。
 *
 * 贴图编号跟的是离镜头轴的横向距离（`_0` 在正中），四家的方向还不一样，所以整排列在
 * `RIVER_TILES.order` 里，**不要**按下标推算。
 */
export type RiverSlot = FaceSlot;

/** 一槽。坐标一律是**屏幕**坐标（`tools/dumpscene.js` 的输出即是），`cardY` 负值表示字在牌身上方 */
function riverSlot(
  sprite: ImageName,
  x: number,
  y: number,
  cardY: number,
  cardSx: number,
  cardSy: number,
  cardX = 0
): RiverSlot {
  return { sprite, x, y, cardX, cardY, cardSx, cardSy, shear: faceShear(x) };
}

/** 自家/对家：一排横着走、同排等距。预制体那 ±0.9px 是手摆的抖动，抹平了反而齐 */
function riverRowH(
  prefix: string,
  sprRow: number,
  order: ReadonlyArray<number>,
  y: number,
  x0: number,
  pitch: number,
  cardY: number,
  cardSx: number,
  cardSy: number
): RiverSlot[] {
  return order.map((t, i) =>
    riverSlot(`${prefix}${sprRow}_${t}` as ImageName, x0 + pitch * i, y, cardY, cardSx, cardSy)
  );
}

/**
 * 左右两家：一排沿视线方向走。纵向格距是真透视（近端 30px、远端 25px），照搬预制体的
 * y 阶梯；横向则严格随 y 线性（拟合残差 ≤0.85px），别照搬手摆的 x。牌面缩放也逐槽变。
 */
function riverRowV(
  prefix: string,
  sprRow: number,
  order: ReadonlyArray<number>,
  ys: ReadonlyArray<number>,
  x0: number,
  xSlope: number,
  cardX: number,
  cardY: number,
  cardSx: ReadonlyArray<number>,
  cardSy: ReadonlyArray<number>
): RiverSlot[] {
  return order.map((t, i) =>
    riverSlot(
      `${prefix}${sprRow}_${t}` as ImageName,
      x0 + xSlope * (ys[i] - ys[0]),
      ys[i],
      cardY,
      cardSx[i],
      cardSy[i],
      cardX
    )
  );
}

/** 第 4、5 排：整排照搬第 1、2 排再抬一个牌厚 */
function riverStack(row: ReadonlyArray<RiverSlot>, dx: number, dy: number): RiverSlot[] {
  return row.map((s) => ({ ...s, x: s.x + dx, y: s.y + dy }));
}

/**
 * 画序不等于落牌序：相邻两张重叠 9~18px，必须远的先画。规则照预制体的子节点顺序：
 * 排与排一律**从远画到近**（自家的落牌序正好是远→近，其余三家都得反过来）；横排排内
 * 还要**从两端往中间**画（预制体就是 card_1..7 再 card_13..8），中间那两张压在最上面；
 * 纵排排内就是远→近。摞在第 1、2 排头上的那两排最后画。
 *
 * 这些方向全部从槽位坐标推，不额外传参：横排看屏幕 y（小的远），纵排看离画面中线的
 * 横向距离（越靠外越远）。
 */
function riverSide(
  glyphRot: number,
  full: ReadonlyArray<ReadonlyArray<RiverSlot>>,
  stacks: ReadonlyArray<readonly [number, number]>,
  /** 实际用到的槽位窗口（自家/对家平时只用居中的 7 个） */
  [from, to]: readonly [number, number] = [0, full[0].length]
): RiverSide {
  const width = full[0].length;
  const horizontal = Math.abs(full[0][0].y - full[0][width - 1].y) < 1;
  const far = (r: ReadonlyArray<RiverSlot>) => (horizontal ? r[0].y : -Math.abs(r[0].x - DESIGN_W / 2));
  const rowOrder = full.map((_, i) => i).sort((a, b) => far(full[a]) - far(full[b]));
  // 画序在**整排**上算（预制体子节点就是 card_1..7 再 card_13..8），再截到窗口内
  const half = Math.ceil(width / 2);
  const fullOrder = horizontal
    ? Array.from({ length: width }, (_, i) => (i < half ? i : width - 1 - (i - half)))
    : full[0].map((_, i) => i).sort((a, b) => full[0][a].y - full[0][b].y);
  const inRow = fullOrder.filter((i) => i >= from && i < to).map((i) => i - from);
  const rows = full.map((r) => r.slice(from, to));
  const perRow = to - from;
  const base = rows.length * perRow;
  return {
    glyphRot,
    perRow,
    slots: [...rows.flat(), ...stacks.flatMap(([dx, dy], i) => riverStack(rows[i], dx, dy))],
    paint: [
      ...rowOrder.flatMap((r) => inRow.map((i) => r * perRow + i)),
      ...rowOrder.filter((r) => r < stacks.length).flatMap((r) => inRow.map((i) => base + r * perRow + i)),
    ],
  };
}

type RiverSide = {
  glyphRot: number;
  /** 一排几张：自家/对家 13、左右两家 7 */
  perRow: number;
  /** 落牌序 */
  slots: ReadonlyArray<RiverSlot>;
  /** 画序，元素是 `slots` 的下标 */
  paint: ReadonlyArray<number>;
};

const LEFT_RIVER_Y = [236.79, 262.31, 289.67, 317.45, 346.53, 376.53, 406.54];
const RIGHT_RIVER_Y = [374.29, 342.66, 315.06, 286.35, 258.82, 232.87, 207.89];
/** 左右两家牌面字的缩放：一排从远到近逐槽变大 */
const LEFT_RIVER_SX = [0.27, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33];
const LEFT_RIVER_SY = [0.39, 0.4, 0.4, 0.41, 0.43, 0.44, 0.45];
const RIGHT_RIVER_SX = [0.3, 0.3, 0.3, 0.29, 0.28, 0.27, 0.25];
const RIGHT_RIVER_SY = [0.45, 0.45, 0.44, 0.42, 0.4, 0.39, 0.37];

// 排号和贴图前缀号是反的：贴桌心那排最远、用 xq3
const BOTTOM_RIVER_ROWS = [
  riverRowH('xq', 3, RIVER_TILES.bottom.order, 413.69, 369.65, 41.8, -10.18, 0.37, 0.37),
  riverRowH('xq', 2, RIVER_TILES.bottom.order, 457.51, 362.93, 42.81, -10.58, 0.38, 0.38),
  riverRowH('xq', 1, RIVER_TILES.bottom.order, 504.61, 356.2, 43.87, -10.27, 0.41, 0.41),
];
const BOTTOM_RIVER_STACKS = [
  [-0.56, -16.14],
  [-0.74, -14.76],
] as const;
// 对家的牌面字靠 card 的负缩放转 180°，和碰杠一样
const TOP_RIVER_ROWS = [
  riverRowH('sq', 1, RIVER_TILES.top.order, 205.52, 880.79, -37.02, -7.77, -0.37, -0.27),
  riverRowH('sq', 2, RIVER_TILES.top.order, 172.06, 875.98, -36.24, -7.1, -0.35, -0.26),
  riverRowH('sq', 3, RIVER_TILES.top.order, 140.09, 871.82, -35.58, -7.51, -0.34, -0.25),
];
const TOP_RIVER_STACKS = [
  [-0.2, -19.05],
  [-0.58, -20.13],
] as const;
/** 自家/对家平时只用 13 个槽里居中的 7 个，见 `_outIndex` */
const MID7 = [4, 11] as const;

export const RIVER: Record<Anchor, RiverSide> = {
  bottom: riverSide(0, BOTTOM_RIVER_ROWS, BOTTOM_RIVER_STACKS, MID7),
  top: riverSide(0, TOP_RIVER_ROWS, TOP_RIVER_STACKS, MID7),
  left: riverSide(
    Math.PI / 2,
    [
      riverRowV('zq', 1, RIVER_TILES.left.order, LEFT_RIVER_Y, 500.26, -0.0771, 1.3, -8.4, LEFT_RIVER_SX, LEFT_RIVER_SY),
      riverRowV('zq', 2, RIVER_TILES.left.order, LEFT_RIVER_Y, 448.59, -0.1119, 1.2, -8.4, LEFT_RIVER_SX, LEFT_RIVER_SY),
      riverRowV('zq', 3, RIVER_TILES.left.order, LEFT_RIVER_Y, 398.16, -0.1505, 0.4, -8.4, LEFT_RIVER_SX, LEFT_RIVER_SY),
    ],
    [
      [-2.28, -17.75],
      [-3.12, -17.58],
    ]
  ),
  right: riverSide(
    -Math.PI / 2,
    [
      riverRowV('yq', 3, RIVER_TILES.right.order, RIGHT_RIVER_Y, 790.0, 0.0728, -2.5, -8.2, RIGHT_RIVER_SX, RIGHT_RIVER_SY),
      riverRowV('yq', 2, RIVER_TILES.right.order, RIGHT_RIVER_Y, 845.76, 0.1069, 0.1, -8.2, RIGHT_RIVER_SX, RIGHT_RIVER_SY),
      riverRowV('yq', 1, RIVER_TILES.right.order, RIGHT_RIVER_Y, 902.29, 0.1455, 0.2, -8.2, RIGHT_RIVER_SX, RIGHT_RIVER_SY),
    ],
    [
      [2.19, -18.72],
      [3.1, -19.5],
    ]
  ),
};

/**
 * 二人局只有自家和对家，一家能打出去的牌多得多，所以整排 13 个槽都用上
 * （APK `_outIndex` 里 `isErRen` 那条分支），上限 65 张。
 */
export const RIVER_ER: Record<'bottom' | 'top', RiverSide> = {
  bottom: riverSide(0, BOTTOM_RIVER_ROWS, BOTTOM_RIVER_STACKS),
  top: riverSide(0, TOP_RIVER_ROWS, TOP_RIVER_STACKS),
};
