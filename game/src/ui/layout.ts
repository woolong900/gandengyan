/**
 * 界面布局常量。设计分辨率 1280x720（横屏）。
 * 牌桌排布对标 布局.PNG：绿毡木桌、四家围坐、牌墙沿桌沿、出牌河围着桌心。
 */

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
 * 各方位玩家面板中心点。对标 布局.PNG：头像贴在绿毡桌四边中段。
 */
export const HEAD_POS: Record<Anchor, { x: number; y: number }> = {
  bottom: { x: 78, y: 538 },
  left: { x: 56, y: 292 },
  right: { x: 1224, y: 292 },
  top: { x: 640, y: 32 },
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
  bottom: { x: 500, y: 430, dx: 38, dy: 0, perRow: 8, rowDx: 0, rowDy: -44, scale: 0.82, rotate: 0 },
  top: { x: 780, y: 192, dx: -38, dy: 0, perRow: 8, rowDx: 0, rowDy: 44, scale: 0.82, rotate: Math.PI },
  left: { x: 348, y: 218, dx: 0, dy: 38, perRow: 6, rowDx: 52, rowDy: 0, scale: 0.82, rotate: Math.PI / 2 },
  right: { x: 932, y: 218, dx: 0, dy: 38, perRow: 6, rowDx: -52, rowDy: 0, scale: 0.82, rotate: -Math.PI / 2 },
};

/**
 * 其他玩家的暗牌。x/y 对 top 是水平中心，对 left/right 是垂直中心。
 * 对家用 bg_up_sp（立着的绿背 + 顶白边）。
 * 左右用 bg_left_rigt_sp（侧视立牌：象牙在外侧、绿背朝桌心；右家水平翻转）。
 * left/right 按满手 13 张顶对齐，不随当前张数重居中。
 */
export const OTHER_HAND: Record<Anchor, { x: number; y: number; dx: number; dy: number; scale: number; drawnGap: number }> =
  {
    bottom: { x: 0, y: 0, dx: 0, dy: 0, scale: 1, drawnGap: 0 },
    top: { x: 640, y: 128, dx: 38, dy: 0, scale: 0.82, drawnGap: 16 },
    /** tile_side 28×64，scale 1.05 → 高约 67，和对家立牌接近；dy 32 露出约一半高度 */
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

/** 碰/杠亮出的面子：自家贴在手牌左侧，对家沿牌墙内侧 */
export const MELD_AREA: Record<
  Anchor,
  { x: number; y: number; dx: number; dy: number; tileDx: number; tileDy: number; scale: number }
> = {
  bottom: { x: 196, y: 586, dx: 86, dy: 0, tileDx: 34, tileDy: 0, scale: 0.5 },
  top: { x: 430, y: 176, dx: 72, dy: 0, tileDx: 28, tileDy: 0, scale: 0.4 },
  right: { x: 1060, y: 168, dx: 0, dy: 78, tileDx: 0, tileDy: 28, scale: 0.4 },
  left: { x: 220, y: 168, dx: 0, dy: 78, tileDx: 0, tileDy: 28, scale: 0.4 },
};

/** 操作按钮区（胡/杠/碰/过），手牌右上方 */
export const BUTTONS = { x: 1120, y: 558, step: -128, size: 126, scale: 0.86 } as const;

/**
 * 甩出的赖子：固定在各家手牌右前方，不随当前手牌张数移动。
 * 自家第一张中心贴在「满手 13 张」右沿内侧，多张往左叠，不超出手牌最右侧。
 */
export const LAIZI_OUT: Record<Anchor, { x: number; y: number; dx: number; dy: number; scale: number }> = {
  bottom: { x: HAND.centerX + (FULL_HAND * HAND.step) / 2 - 18, y: HAND.baseY - 92, dx: -30, dy: 0, scale: 0.7 },
  top: { x: 428, y: 180, dx: 30, dy: 0, scale: 0.62 },
  left: { x: 186, y: 420, dx: 0, dy: -26, scale: 0.62 },
  right: { x: 1094, y: 196, dx: 0, dy: 26, scale: 0.62 },
};
