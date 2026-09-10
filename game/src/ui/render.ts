/**
 * 画面渲染。所有绘制都在 1280x720 的设计坐标系里进行，
 * 由 resize() 计算的变换负责等比缩放并居中（信箱模式），以适配各种手机屏幕。
 */

import { Kind, kindName } from '../core/tiles';
import { Game } from '../core/game';
import { Meld, PlayerState } from '../core/types';
import { Assets, ImageName } from './assets';
import {
  Anchor,
  BUTTONS,
  CENTER,
  DESIGN_H,
  DESIGN_W,
  FACE,
  FACE_TINT,
  FELT,
  FULL_HAND,
  HAND,
  HEAD_POS,
  LAIZI_OUT,
  LOBBY,
  MELD_HAND_GAP,
  OTHER_HAND,
  PANEL,
  RIVER,
  SIDE_MELD,
  SideMeldSlot,
  TILE,
  anchorFor,
} from './layout';
import { drawSideWall3d } from './sideWall3d';

export type HitKind = { t: 'tile'; kind: Kind; slot: number } | { t: 'button'; id: string } | { t: 'ui'; id: string };

interface HitBox {
  x: number;
  y: number;
  w: number;
  h: number;
  hit: HitKind;
}

export interface ButtonSpec {
  id: string;
  image: ImageName;
  label?: string;
}

export interface ViewState {
  humanSeat: number;
  selectedSlot: number | null;
  buttons: ButtonSpec[];
  /** 座位 -> 正在展示的横幅 */
  banners: Map<number, { image: ImageName; expires: number }>;
  message: string | null;
  showResult: boolean;
  /** 托管：由电脑代打自己这一家 */
  auto: boolean;
  muted: boolean;
  /** lobby = 大厅选人，play = 对局中 */
  scene: 'lobby' | 'play';
  playerCount: number;
  showRules: boolean;
}

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private scale = 1;
  private offX = 0;
  private offY = 0;
  private hits: HitBox[] = [];

  constructor(private canvas: HTMLCanvasElement, private assets: Assets) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 2D 绘制上下文');
    this.ctx = ctx;
  }

  resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    this.canvas.width = Math.floor(vw * dpr);
    this.canvas.height = Math.floor(vh * dpr);
    this.canvas.style.width = `${vw}px`;
    this.canvas.style.height = `${vh}px`;

    this.scale = Math.min((vw * dpr) / DESIGN_W, (vh * dpr) / DESIGN_H);
    this.offX = ((vw * dpr) - DESIGN_W * this.scale) / 2;
    this.offY = ((vh * dpr) - DESIGN_H * this.scale) / 2;
  }

  /** 把屏幕坐标（CSS 像素）换算到设计坐标 */
  toDesign(clientX: number, clientY: number): { x: number; y: number } {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    return {
      x: (clientX * dpr - this.offX) / this.scale,
      y: (clientY * dpr - this.offY) / this.scale,
    };
  }

  hitTest(clientX: number, clientY: number): HitKind | null {
    const { x, y } = this.toDesign(clientX, clientY);
    // 后画的在上层，所以倒序命中
    for (let i = this.hits.length - 1; i >= 0; i--) {
      const b = this.hits[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.hit;
    }
    return null;
  }

  // ------------------------------------------------------------ 基础绘制

  private img(name: ImageName): HTMLImageElement | undefined {
    return this.assets.get(name);
  }

  private drawCentered(name: ImageName, cx: number, cy: number, scale = 1, alpha = 1): void {
    const im = this.img(name);
    if (!im) return;
    const w = im.width * scale;
    const h = im.height * scale;
    const c = this.ctx;
    if (alpha !== 1) c.globalAlpha = alpha;
    c.drawImage(im, cx - w / 2, cy - h / 2, w, h);
    if (alpha !== 1) c.globalAlpha = 1;
  }

  private text(
    s: string,
    x: number,
    y: number,
    opts: { size?: number; color?: string; align?: CanvasTextAlign; bold?: boolean; stroke?: string } = {}
  ): void {
    const c = this.ctx;
    c.font = `${opts.bold === false ? '' : 'bold '}${opts.size ?? 20}px ${FONT}`;
    c.textAlign = opts.align ?? 'center';
    c.textBaseline = 'middle';
    if (opts.stroke) {
      c.lineWidth = 4;
      c.strokeStyle = opts.stroke;
      c.strokeText(s, x, y);
    }
    c.fillStyle = opts.color ?? '#fff';
    c.fillText(s, x, y);
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string): void {
    const c = this.ctx;
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
    c.fillStyle = fill;
    c.fill();
    if (stroke) {
      c.lineWidth = 2;
      c.strokeStyle = stroke;
      c.stroke();
    }
  }

  /**
   * 画一张牌：牌身 + 牌面，并按需要叠加赖子/朝天角标。
   */
  private drawTile(
    body: ImageName,
    kind: Kind | null,
    cx: number,
    cy: number,
    scale: number,
    game: Game,
    opts: { badge?: boolean; dim?: boolean; flipX?: boolean; rotate?: number } = {}
  ): void {
    const bodyImg = this.img(body);
    if (!bodyImg) return;
    const w = bodyImg.width * scale;
    const h = bodyImg.height * scale;
    const c = this.ctx;
    if (opts.dim) c.globalAlpha = 0.55;
    const rot = opts.rotate ?? 0;
    const transformed = Boolean(opts.flipX || rot);
    const isLaizi = kind !== null && kind === game.laizi;
    if (transformed) {
      c.save();
      c.translate(cx, cy);
      if (rot) c.rotate(rot);
      if (opts.flipX) c.scale(-1, 1);
    }
    const dx = transformed ? -w / 2 : cx - w / 2;
    const dy = transformed ? -h / 2 : cy - h / 2;
    if (isLaizi) {
      c.save();
      c.shadowColor = 'rgba(255, 186, 28, 0.9)';
      c.shadowBlur = Math.max(10, 18 * scale);
      c.drawImage(bodyImg, dx, dy, w, h);
      c.restore();
    } else {
      c.drawImage(bodyImg, dx, dy, w, h);
    }

    const ox = transformed ? 0 : cx;
    const oy = transformed ? 0 : cy;
    const face = FACE[body];
    if (kind !== null && face) {
      const glyph = this.assets.glyph(kind);
      if (glyph) {
        const gw = glyph.width * face.glyph.x * scale;
        const gh = glyph.height * face.glyph.y * scale;
        c.drawImage(glyph, ox - gw / 2, oy + face.glyphDy * scale - gh / 2, gw, gh);
      }
      if (kind === game.laizi) this.drawLaiziTint(body, ox, oy, w, h, scale);
      if (opts.badge !== false) {
        const badge = kind === game.laizi ? 'badge_laizi' : kind === game.chaoTian ? 'badge_chaotian' : null;
        const bi = badge ? this.img(badge) : undefined;
        if (bi) {
          const bw = bi.width * face.badge.x * scale;
          const bh = bi.height * face.badge.y * scale;
          c.drawImage(bi, ox + face.badgeDx * scale - bw / 2, oy + face.badgeDy * scale - bh / 2, bw, bh);
        }
      }
    }
    if (transformed) c.restore();
    if (opts.dim) c.globalAlpha = 1;
  }

  /** 赖子：金色罩铺满象牙正面（顶绿边/底绿边除外），底部要盖实。 */
  private drawLaiziTint(body: ImageName, ox: number, oy: number, tw: number, th: number, scale: number): void {
    const spec = FACE_TINT[body];
    const c = this.ctx;
    const x = spec ? ox - tw / 2 + spec.x * scale : ox - tw * 0.42;
    const y = spec ? oy - th / 2 + spec.y * scale : oy - th * 0.36;
    const fw = spec ? spec.w * scale : tw * 0.84;
    const fh = spec ? spec.h * scale : th * 0.72;
    const r = Math.max(2, Math.min(fw, fh) * 0.04);

    c.save();
    this.pathFaceTint(x, y, fw, fh, r);
    c.clip();
    c.globalCompositeOperation = 'multiply';
    c.fillStyle = '#ffd56a';
    c.fillRect(x - 2, y - 2, fw + 4, fh + 4);
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = 'rgba(255, 196, 40, 0.36)';
    c.fillRect(x - 2, y - 2, fw + 4, fh + 4);
    c.restore();
  }

  /** 正面罩路径：顶角略圆、底边走直，避免圆角把牌面底部空出来 */
  private pathFaceTint(x: number, y: number, w: number, h: number, r: number): void {
    const c = this.ctx;
    const rr = Math.min(r, w / 2, h / 4);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.lineTo(x + w, y + h);
    c.lineTo(x, y + h);
    c.lineTo(x, y + rr);
    c.arcTo(x, y, x + rr, y, rr);
    c.closePath();
  }

  // ------------------------------------------------------------ 主绘制

  draw(game: Game, view: ViewState): void {
    const c = this.ctx;
    this.hits = [];
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#0b1a12';
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    c.setTransform(this.scale, 0, 0, this.scale, this.offX, this.offY);

    if (view.scene === 'lobby') {
      this.drawLobby(view);
      if (view.showRules) this.drawRules();
      return;
    }

    this.drawTable();
    this.drawCenterInfo(game, view);

    for (const p of game.players) {
      const anchor = anchorFor(p.seat, view.humanSeat, game.rules.playerCount);
      this.drawPlayerPanel(game, p, anchor, view);
      this.drawRiver(game, p, anchor);
      this.drawMelds(game, p, anchor, view);
      if (p.seat !== view.humanSeat) this.drawOtherHand(game, p, anchor);
      this.drawLaiziOut(game, p, anchor, view);
    }

    this.drawHand(game, view);
    this.drawButtons(view);
    this.drawBanners(game, view);
    this.drawTopBar(game, view);

    if (view.message) {
      this.roundRect(DESIGN_W / 2 - 220, 300, 440, 56, 12, 'rgba(0,0,0,0.72)');
      this.text(view.message, DESIGN_W / 2, 328, { size: 24 });
    }
    if (view.showResult && game.over) this.drawResult(game, view);
    if (view.showRules) this.drawRules();
  }

  private pathRoundRect(x: number, y: number, w: number, h: number, r: number): void {
    const c = this.ctx;
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  private drawTable(): void {
    const c = this.ctx;
    c.fillStyle = '#071014';
    c.fillRect(0, 0, DESIGN_W, DESIGN_H);

    const img = this.img('table');
    if (img) {
      const s = Math.max(DESIGN_W / img.width, DESIGN_H / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      c.drawImage(img, (DESIGN_W - dw) / 2, (DESIGN_H - dh) / 2, dw, dh);
      return;
    }

    const woodPadX = 40;
    const woodPadY = 18;
    this.pathRoundRect(FELT.x - woodPadX, FELT.y - woodPadY, FELT.w + woodPadX * 2, FELT.h + woodPadY * 2 + 8, 28);
    const wood = c.createLinearGradient(0, FELT.y - 20, 0, FELT.y + FELT.h + 30);
    wood.addColorStop(0, '#5a3d22');
    wood.addColorStop(0.45, '#3d2916');
    wood.addColorStop(1, '#2a1c10');
    c.fillStyle = wood;
    c.fill();
    c.lineWidth = 3;
    c.strokeStyle = '#c4a35a';
    c.stroke();

    const cx = FELT.x + FELT.w / 2;
    const cy = FELT.y + FELT.h * 0.46;
    const grad = c.createRadialGradient(cx, cy, 40, cx, cy, 620);
    grad.addColorStop(0, '#1b6b56');
    grad.addColorStop(0.45, '#145544');
    grad.addColorStop(1, '#0b3328');
    this.pathRoundRect(FELT.x, FELT.y, FELT.w, FELT.h, FELT.r);
    c.fillStyle = grad;
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = 'rgba(196,163,90,0.28)';
    c.stroke();

    c.save();
    c.strokeStyle = 'rgba(210, 190, 120, 0.1)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(cx, cy, 92, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(cx, cy, 138, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(cx, cy, 168, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  /** 中央：轮次指示（朝天只在左上角 HUD 显示） */
  private drawCenterInfo(game: Game, view: ViewState): void {
    const { x, y, w, h } = CENTER;
    const c = this.ctx;
    const active = anchorFor(game.turn, view.humanSeat, game.rules.playerCount);
    const present = new Set(game.players.map((p) => anchorFor(p.seat, view.humanSeat, game.rules.playerCount)));

    this.roundRect(x - w / 2, y - h / 2, w, h, 10, 'rgba(16, 22, 18, 0.94)', '#c4a35a');

    const sides: Array<{ a: Anchor; label: string; tx: number; ty: number; bx: number; by: number; bw: number; bh: number }> = [
      { a: 'top', label: '西', tx: x, ty: y - h / 2 + 14, bx: x - 22, by: y - h / 2 + 2, bw: 44, bh: 18 },
      { a: 'bottom', label: '东', tx: x, ty: y + h / 2 - 14, bx: x - 22, by: y + h / 2 - 20, bw: 44, bh: 18 },
      { a: 'left', label: '北', tx: x - w / 2 + 14, ty: y, bx: x - w / 2 + 2, by: y - 22, bw: 18, bh: 44 },
      { a: 'right', label: '南', tx: x + w / 2 - 14, ty: y, bx: x + w / 2 - 20, by: y - 22, bw: 18, bh: 44 },
    ];
    for (const s of sides) {
      if (!present.has(s.a)) continue;
      if (s.a === active && game.phase !== 'over') {
        this.roundRect(s.bx, s.by, s.bw, s.bh, 4, '#c8891f', '#ffe08a');
      }
      this.text(s.label, s.tx, s.ty, { size: 15, color: s.a === active ? '#fff8e0' : '#d8c9a0' });
    }

    c.beginPath();
    c.arc(x, y, 24, 0, Math.PI * 2);
    c.fillStyle = game.phase !== 'over' ? '#1a3a2a' : 'rgba(0,0,0,0.45)';
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = '#ffe08a';
    c.stroke();
    this.text(String(game.wallLeft), x, y, { size: 20, color: '#fff' });
  }

  private drawPlayerPanel(game: Game, p: PlayerState, anchor: Anchor, view: ViewState): void {
    const pos = HEAD_POS[anchor];
    const active = game.turn === p.seat && game.phase !== 'over';

    this.drawCentered('head_bg', pos.x, pos.y, PANEL.plateScale);
    this.drawCentered('avatar', pos.x, pos.y + PANEL.avatarDy, PANEL.avatarScale);

    // 轮到谁出牌就给面板描一圈金边
    if (active) {
      const c = this.ctx;
      const plate = this.img('head_bg');
      const w = (plate?.width ?? 84) * PANEL.plateScale;
      const h = (plate?.height ?? 108) * PANEL.plateScale;
      c.save();
      c.shadowColor = '#ffd54a';
      c.shadowBlur = 14;
      this.roundRect(pos.x - w / 2, pos.y - h / 2, w, h, 8, 'rgba(0,0,0,0)', '#ffd54a');
      c.restore();
    }

    const name = p.seat === view.humanSeat ? '我' : `电脑${p.seat}`;
    const nameX = pos.x;
    const nameY = anchor === 'top' ? pos.y + 44 : pos.y + PANEL.nameDy;
    const scoreY = anchor === 'top' ? pos.y + 70 : pos.y + PANEL.scoreDy;
    this.drawCentered('name_bg', nameX, nameY);
    this.text(name, nameX, nameY, { size: 16, stroke: 'rgba(0,0,0,0.8)' });
    this.text(`${p.score >= 0 ? '+' : ''}${p.score}`, nameX, scoreY, {
      size: 19,
      color: p.score >= 0 ? '#7dff9b' : '#ff8080',
      stroke: 'rgba(0,0,0,0.85)',
    });

    if (p.seat === game.dealer) {
      this.drawCentered('dealer', pos.x + PANEL.dealerDx, pos.y + PANEL.dealerDy, 0.9);
    }

    // 甩赖子带来的底分倍数
    if (p.mul > 1) {
      this.roundRect(pos.x - 26, pos.y + PANEL.mulDy - 13, 52, 26, 8, 'rgba(180,30,30,0.92)', '#ffd54a');
      this.text(`x${p.mul}`, pos.x, pos.y + PANEL.mulDy, { size: 17, color: '#ffe9a8' });
    }
  }

  /** 出牌河：牌面随出牌人旋转，朝向那一家自己的一侧 */
  private drawRiver(game: Game, p: PlayerState, anchor: Anchor): void {
    const cfg = RIVER[anchor];
    const river = p.discards.filter((k) => k !== game.laizi);
    river.forEach((kind, i) => {
      const row = Math.floor(i / cfg.perRow);
      const col = i % cfg.perRow;
      const x = cfg.x + col * cfg.dx + row * cfg.rowDx;
      const y = cfg.y + col * cfg.dy + row * cfg.rowDy;
      this.drawTile('tile_discard', kind, x, y, cfg.scale, game, { rotate: cfg.rotate });
    });
  }

  private meldTileCount(m: Meld): number {
    return m.type === 'peng' || m.type === 'chaoTianGang' || m.type === 'chaoTianPeng' ? 3 : 4;
  }

  /** 碰/杠：各家视角手牌左侧，牌面朝向该家自己（与出牌河同一套旋转） */
  private drawMelds(game: Game, p: PlayerState, anchor: Anchor, view: ViewState): void {
    if (!p.melds.length) return;
    const hideFaces = (m: Meld) => m.type === 'anGang' && p.isBot;

    // 自家的碰杠区右缘顶着手牌左缘：手牌居中，碰得越多越窄，左边就腾出越多位置。
    const dx = anchor === 'bottom' ? this.bottomMeldShift(game, p, view) : 0;
    this.drawSideMelds(game, p, anchor, hideFaces, dx);
  }

  /** 把 APK 的自家碰杠槽位整体平移，使最后一组的右缘落在手牌左缘之前 */
  private bottomMeldShift(game: Game, p: PlayerState, view: ViewState): number {
    const slots = SIDE_MELD.bottom.groups[p.melds.length - 1];
    if (!slots) return 0;
    const apkRight = Math.max(...slots.map((s) => s.x + s.w / 2));
    const hand = this.handSlots(game, view);
    const handLeft = hand.length ? hand[0].x - (TILE.hand.w * HAND.scale) / 2 : HAND.centerX;
    return handLeft - MELD_HAND_GAP - apkRight;
  }

  /**
   * 左右碰/杠：每槽一张预渲染长方体，按原始尺寸摆在槽位中心。
   * 透视斜边已画在贴图里，禁止拉伸、旋转或错切；牌面字单独按 card 节点变换。
   */
  private drawSideMelds(
    game: Game,
    p: PlayerState,
    anchor: Anchor,
    hideFaces: (m: Meld) => boolean,
    dx = 0
  ): void {
    const { groups, hidden, glyphRot, skewY } = SIDE_MELD[anchor];
    const c = this.ctx;
    for (let gi = 0; gi < p.melds.length; gi++) {
      const m = p.melds[gi];
      const hide = hideFaces(m);
      const slots = (hide ? hidden : groups)[gi];
      if (!slots) break;
      const n = this.meldTileCount(m);
      // 槽位已是预制体子节点顺序：先画被压住的，杠的第 4 张恒在末位叠最上面。
      for (const pos of slots.slice(0, n)) {
        const img = this.img(pos.sprite);
        const w = img?.width ?? pos.w;
        const h = img?.height ?? pos.h;
        if (img) c.drawImage(img, pos.x + dx - w / 2, pos.y - h / 2, w, h);
        if (!hide && m.kind !== undefined) this.drawSideMeldFace(m.kind, pos, dx, glyphRot, skewY, game);
      }
    }
  }

  /** APK card 子节点：T · R(-euler.z) · S · SkewY(-cocos.skewY) */
  private drawSideMeldFace(
    kind: Kind,
    pos: SideMeldSlot,
    dx: number,
    glyphRot: number,
    skewY: number,
    game: Game
  ): void {
    const glyph = this.assets.glyph(kind);
    if (!glyph) return;
    const c = this.ctx;
    c.save();
    c.translate(pos.x + dx + pos.cardX, pos.y + pos.cardY);
    c.rotate(glyphRot);
    c.scale(pos.cardSx, pos.cardSy);
    c.transform(1, Math.tan(skewY), 0, 1, 0, 0);
    c.drawImage(glyph, -glyph.width / 2, -glyph.height / 2, glyph.width, glyph.height);
    if (kind === game.laizi) {
      c.fillStyle = 'rgba(255, 213, 106, 0.35)';
      c.fillRect(-glyph.width / 2, -glyph.height / 2, glyph.width, glyph.height);
    }
    c.restore();
  }

  /** 甩出的赖子：前方格最右侧，牌面朝向该家自己 */
  private drawLaiziOut(game: Game, p: PlayerState, anchor: Anchor, _view: ViewState): void {
    const tossed = p.discards.filter((k) => k === game.laizi);
    if (!tossed.length) return;
    const cfg = LAIZI_OUT[anchor];
    const rotate = RIVER[anchor].rotate;
    tossed.forEach((kind, i) => {
      this.drawTile('tile_discard', kind, cfg.x + i * cfg.dx, cfg.y + i * cfg.dy, cfg.scale, game, { rotate });
    });
  }

  /**
   * 左右手牌：APK 预渲染长方体（zlp / ylp），按 CardLayer3D 槽位摆。
   */
  private drawSideHandBoxes(game: Game, p: PlayerState, anchor: 'left' | 'right'): void {
    const n = p.hand.length;
    if (n <= 0) return;
    const waiting = 3 * (4 - p.melds.length) + 1;
    const splitDrawn = game.turn === p.seat && game.drawn !== null && n === waiting + 1;
    const packed = splitDrawn ? n - 1 : n;
    // 左家视角左侧是远端，余牌从近端排；右家反之。
    drawSideWall3d(this.ctx, (name) => this.img(name), anchor, n, packed, anchor === 'left' ? 'near' : 'far');
  }

  /** 对家用立着的牌背；左右用 zlp/ylp 长方体暗牌。 */
  private drawOtherHand(game: Game, p: PlayerState, anchor: Anchor): void {
    if (anchor === 'left' || anchor === 'right') {
      this.drawSideHandBoxes(game, p, anchor);
      return;
    }
    const cfg = OTHER_HAND[anchor];
    const n = p.hand.length;
    if (n <= 0) return;
    const waiting = 3 * (4 - p.melds.length) + 1;
    const splitDrawn = game.turn === p.seat && game.drawn !== null && n === waiting + 1;
    const step = cfg.dx;
    const packed = splitDrawn ? n - 1 : n;
    const gap = splitDrawn ? cfg.drawnGap : 0;
    const fullStart = cfg.x - ((FULL_HAND - 1) * step) / 2;

    for (let i = 0; i < n; i++) {
      const along = i < packed ? fullStart + i * step : fullStart + packed * step + gap;
      this.drawTile('tile_back_up', null, Math.round(along), Math.round(cfg.y), cfg.scale, game);
    }
  }

  /**
   * 自己的手牌。刚摸到的那张单独放在右侧并留出间隔，方便判断。
   */
  handSlots(game: Game, view: ViewState): Array<{ kind: Kind; x: number; y: number; slot: number; isDrawn: boolean }> {
    const p = game.players[view.humanSeat];
    const tiles = p.hand.slice();
    let drawnKind: Kind | null = null;
    if (game.drawn !== null && game.turn === view.humanSeat && game.drawn !== game.laizi) {
      const i = tiles.indexOf(game.drawn);
      if (i >= 0) {
        drawnKind = tiles[i];
        tiles.splice(i, 1);
      }
    }

    const gap = drawnKind !== null ? HAND.drawnGap : 0;
    const total = tiles.length * HAND.step + gap + (drawnKind !== null ? HAND.step : 0);
    const startX = HAND.centerX - total / 2 + HAND.step / 2;

    const out = tiles.map((kind, i) => ({
      kind,
      x: startX + i * HAND.step,
      y: HAND.baseY - (view.selectedSlot === i ? HAND.liftY : 0),
      slot: i,
      isDrawn: false,
    }));
    if (drawnKind !== null) {
      const slot = tiles.length;
      out.push({
        kind: drawnKind,
        x: startX + tiles.length * HAND.step + gap,
        y: HAND.baseY - (view.selectedSlot === slot ? HAND.liftY : 0),
        slot,
        isDrawn: true,
      });
    }
    return out;
  }

  private drawHand(game: Game, view: ViewState): void {
    const slots = this.handSlots(game, view);
    const body = this.img('tile_hand');
    const w = (body?.width ?? TILE.hand.w) * HAND.scale;
    const h = (body?.height ?? TILE.hand.h) * HAND.scale;

    for (const s of slots) {
      this.drawTile('tile_hand', s.kind, s.x, s.y, HAND.scale, game);
      this.hits.push({
        x: s.x - w / 2,
        y: s.y - h / 2,
        w,
        h,
        hit: { t: 'tile', kind: s.kind, slot: s.slot },
      });
    }

    // 听牌 / 赖子超限提示
    const laizi = game.laiziInHand(view.humanSeat);
    if (laizi >= game.rules.laiziBlockHuCount) {
      this.roundRect(DESIGN_W / 2 - 150, HAND.baseY - 108, 300, 34, 8, 'rgba(150,20,20,0.85)', '#ffd54a');
      this.text(`手上 ${laizi} 张赖子，不能胡牌`, DESIGN_W / 2, HAND.baseY - 91, { size: 18, color: '#ffe9a8' });
    } else {
      let ting: Kind[] = [];
      let prefix = '听';
      if (view.selectedSlot !== null && slots[view.selectedSlot]) {
        ting = game.tingIfDiscard(view.humanSeat, slots[view.selectedSlot].kind);
        prefix = '打出后听';
      } else {
        const p = game.players[view.humanSeat];
        const waiting = 3 * (4 - p.melds.length) + 1;
        if (p.hand.length === waiting) ting = game.tingTiles(view.humanSeat);
      }
      if (ting.length) {
        this.roundRect(DESIGN_W / 2 - 190, HAND.baseY - 108, 380, 34, 8, 'rgba(0,0,0,0.62)', 'rgba(255,255,255,0.25)');
        this.text(`${prefix}：${ting.map(kindName).join(' ')}`, DESIGN_W / 2, HAND.baseY - 91, { size: 17, color: '#8fd8ff' });
      }
    }
  }

  private drawButtons(view: ViewState): void {
    view.buttons.forEach((b, i) => {
      const x = BUTTONS.x + i * BUTTONS.step;
      const y = BUTTONS.y;
      this.drawCentered(b.image, x, y, BUTTONS.scale);
      const size = BUTTONS.size * BUTTONS.scale;
      this.hits.push({ x: x - size / 2, y: y - size / 2, w: size, h: size, hit: { t: 'button', id: b.id } });
    });
  }

  private drawBanners(game: Game, view: ViewState): void {
    const now = performance.now();
    for (const [seat, b] of view.banners) {
      if (b.expires < now) continue;
      const anchor = anchorFor(seat, view.humanSeat, game.rules.playerCount);
      const pos = HEAD_POS[anchor];
      const dy = anchor === 'bottom' ? -90 : 70;
      // 出现时有一个轻微放大的动效
      const age = 1 - Math.max(0, (b.expires - now) / 1400);
      const pop = 0.9 + 0.18 * Math.min(1, age * 5);
      this.drawCentered(b.image, pos.x, pos.y + dy, 0.62 * pop);
    }
  }

  private drawTopBar(game: Game, view: ViewState): void {
    const bar = this.img('hud_bar');
    if (bar) this.ctx.drawImage(bar, 8, 8, 248, 34);
    else this.roundRect(8, 8, 248, 34, 10, 'rgba(0,0,0,0.55)');
    this.text(`底分 x${game.players[view.humanSeat].mul}   余 ${game.wallLeft}`, 18, 25, {
      size: 15,
      align: 'left',
      color: '#ffe9a8',
    });

    const panel = this.img('laizi_panel');
    if (panel) this.ctx.drawImage(panel, 8, 44, 152, 70);
    else this.roundRect(8, 44, 152, 70, 10, 'rgba(0,0,0,0.55)', 'rgba(255,255,255,0.18)');
    this.text('朝', 26, 58, { size: 14, color: '#ffe9a8', align: 'left' });
    this.text('赖', 90, 58, { size: 14, color: '#8fd8ff', align: 'left' });
    this.drawTile('tile_discard', game.chaoTian, 44, 90, 0.64, game, { badge: false });
    this.drawTile('tile_discard', game.laizi, 108, 90, 0.64, game, { badge: true });

    const mk = (id: string, label: string, x: number, on = false) => {
      this.roundRect(x, 8, 76, 40, 10, on ? 'rgba(180,130,20,0.85)' : 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.2)');
      this.text(label, x + 38, 28, { size: 17, color: on ? '#ffe9a8' : '#fff' });
      this.hits.push({ x, y: 8, w: 76, h: 40, hit: { t: 'ui', id } });
    };
    mk('lobby', '大厅', DESIGN_W - 92);
    mk('mute', '静音', DESIGN_W - 176, view.muted);
    mk('auto', '托管', DESIGN_W - 260, view.auto);
    mk('rules', '规则', DESIGN_W - 344);
  }

  private drawResult(game: Game, view: ViewState): void {
    const c = this.ctx;
    c.fillStyle = 'rgba(0,0,0,0.62)';
    c.fillRect(0, 0, DESIGN_W, DESIGN_H);

    const w = 620;
    const h = 400;
    const x = (DESIGN_W - w) / 2;
    const y = (DESIGN_H - h) / 2;
    this.roundRect(x, y, w, h, 18, 'rgba(24,38,30,0.96)', '#ffd54a');

    const over = game.over!;
    const title =
      over.reason === 'liuju' ? '流局' : over.winner === view.humanSeat ? '自摸胡牌' : `${over.winner === null ? '' : `电脑${over.winner} `}自摸`;
    this.text(title, DESIGN_W / 2, y + 44, { size: 34, color: '#ffe9a8' });

    // 各家分数
    game.players.forEach((p, i) => {
      const ry = y + 100 + i * 44;
      const label = p.seat === view.humanSeat ? '我' : `电脑${p.seat}`;
      this.text(label, x + 60, ry, { size: 22, align: 'left' });
      this.text(`底分 x${p.mul}`, x + 190, ry, { size: 18, align: 'left', color: '#9fd0ff' });
      this.text(`甩赖子 ${p.laiziOut}`, x + 320, ry, { size: 18, align: 'left', color: '#9fd0ff' });
      this.text(`${p.score >= 0 ? '+' : ''}${p.score}`, x + w - 60, ry, {
        size: 24,
        align: 'right',
        color: p.score >= 0 ? '#7dff9b' : '#ff8080',
      });
    });

    // 计分明细
    const lines = new Map<string, number>();
    for (const s of game.settlements) lines.set(s.reason, (lines.get(s.reason) ?? 0) + 1);
    const detail = [...lines.entries()].map(([r, n]) => `${r}x${n}`).join('   ');
    if (detail) this.text(detail, DESIGN_W / 2, y + h - 96, { size: 18, color: '#cfe8d8' });

    const bw = 180;
    const bh = 52;
    const by = y + h - 70;
    this.roundRect(DESIGN_W / 2 - 200, by, bw, bh, 12, '#c8891f', '#ffd54a');
    this.text('再来一局', DESIGN_W / 2 - 110, by + bh / 2, { size: 22 });
    this.hits.push({ x: DESIGN_W / 2 - 200, y: by, w: bw, h: bh, hit: { t: 'ui', id: 'again' } });

    this.roundRect(DESIGN_W / 2 + 20, by, bw, bh, 12, 'rgba(0,0,0,0.55)', 'rgba(255,255,255,0.3)');
    this.text('返回大厅', DESIGN_W / 2 + 110, by + bh / 2, { size: 22 });
    this.hits.push({ x: DESIGN_W / 2 + 20, y: by, w: bw, h: bh, hit: { t: 'ui', id: 'lobby' } });
  }

  private drawLobby(view: ViewState): void {
    const bg = this.img('lobby_bg') ?? this.img('table');
    if (bg) {
      const s = DESIGN_H / bg.height;
      const w = bg.width * s;
      this.ctx.drawImage(bg, (DESIGN_W - w) / 2, 0, w, DESIGN_H);
    } else {
      this.ctx.fillStyle = '#0b1a12';
      this.ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
    }

    this.drawCentered('lobby_girl', LOBBY.girlX, LOBBY.girlY, 1);

    const px = LOBBY.panelX;
    const py = LOBBY.panelY;
    this.roundRect(px - LOBBY.panelW / 2, py - LOBBY.panelH / 2, LOBBY.panelW, LOBBY.panelH, 18, 'rgba(8,18,14,0.78)', 'rgba(255,213,74,0.45)');

    this.drawCentered('emblem_chaotian', px, py - 220, 0.72);
    this.text('干瞪眼麻将', px, py - 158, { size: 34, color: '#ffe9a8', stroke: 'rgba(0,0,0,0.85)' });

    this.text('选择人数', px, py - 108, { size: 22, color: '#ffe9a8' });
    ([2, 3, 4] as const).forEach((n, i) => {
      const x = px - 160 + i * 160;
      const y = py - 52;
      const on = view.playerCount === n;
      this.roundRect(x - 64, y - 28, 128, 56, 12, on ? 'rgba(180,130,20,0.92)' : 'rgba(0,0,0,0.45)', on ? '#ffd54a' : 'rgba(255,255,255,0.25)');
      this.drawCentered(on ? 'radio_on' : 'radio_off', x - 36, y, 0.9);
      this.text(`${n} 人`, x + 18, y, { size: 22, color: on ? '#ffe9a8' : '#fff' });
      this.hits.push({ x: x - 64, y: y - 28, w: 128, h: 56, hit: { t: 'ui', id: `players:${n}` } });
    });

    const rules = [
      '108 张（条 / 筒 / 万），不能吃，只能自摸',
      '开局翻朝天，下一张为本局赖子',
      '甩赖子从牌尾补张，底分 ×2，可累乘',
      '手上 2 张及以上赖子不能胡；赖子不当万能牌',
      '点杠 1 分 · 暗杠 / 自摸 2 分 · 回头杠 1 分',
      '3 张朝天亮出算暗杠；打出朝天被碰算点杠',
    ];
    rules.forEach((line, i) => {
      this.text(line, px, py + 8 + i * 30, { size: 16, color: '#d8efe4' });
    });

    const start = this.img('btn_start');
    const sw = start ? start.width : 280;
    const sh = start ? start.height : 90;
    this.drawCentered('btn_start', px, py + 225, 1);
    this.hits.push({ x: px - sw / 2, y: py + 225 - sh / 2, w: sw, h: sh, hit: { t: 'ui', id: 'start' } });
    if (!start) {
      this.roundRect(px - 140, py + 189, 280, 72, 12, '#c8891f', '#ffd54a');
      this.text('开始游戏', px, py + 225, { size: 26 });
    }

    this.roundRect(16, 16, 88, 40, 10, 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.2)');
    this.text(view.muted ? '已静音' : '静音', 60, 36, { size: 17 });
    this.hits.push({ x: 16, y: 16, w: 88, h: 40, hit: { t: 'ui', id: 'mute' } });
  }

  private drawRules(): void {
    const c = this.ctx;
    c.fillStyle = 'rgba(0,0,0,0.72)';
    c.fillRect(0, 0, DESIGN_W, DESIGN_H);
    const w = 720;
    const h = 500;
    const x = (DESIGN_W - w) / 2;
    const y = (DESIGN_H - h) / 2;
    this.roundRect(x, y, w, h, 18, 'rgba(24,38,30,0.98)', '#ffd54a');
    this.text('干瞪眼规则', DESIGN_W / 2, y + 40, { size: 30, color: '#ffe9a8' });
    const lines = [
      '牌张：条、筒、万 1-9 各 4 张，共 108 张。不允许吃牌，只能自摸胡牌。',
      '朝天：开局把牌堆第一张翻开，这张牌不参与摸牌。',
      '赖子：朝天的下一张（同花色循环，如 5 筒→6 筒，9 万→1 万）。',
      '赖子按自身牌面组牌，不能替代任意牌。手上 2 张及以上赖子不能胡。',
      '甩赖子：出牌时打出赖子，从牌堆尾部补一张，该玩家底分 ×2，可多次累乘。',
      '点杠 1 分（放杠者支付）；暗杠、自摸各 2 分（其余每家支付）。',
      '回头杠 1 分（碰后再补第四张，其余每家支付）。',
      '摸到 3 张朝天亮出按暗杠计；别人打出的朝天被碰掉，放牌者算点杠。',
      '结算时双方底分乘数都参与放大。牌墙摸完仍无人自摸则流局。',
    ];
    lines.forEach((line, i) => {
      this.text(line, x + 36, y + 88 + i * 36, { size: 18, align: 'left', color: '#e8f5ee', bold: false });
    });
    this.hits.length = 0;
    this.roundRect(DESIGN_W / 2 - 90, y + h - 70, 180, 48, 12, '#c8891f', '#ffd54a');
    this.text('知道了', DESIGN_W / 2, y + h - 46, { size: 22 });
    this.hits.push({ x: 0, y: 0, w: DESIGN_W, h: DESIGN_H, hit: { t: 'ui', id: 'rules-close' } });
    this.hits.push({ x: DESIGN_W / 2 - 90, y: y + h - 70, w: 180, h: 48, hit: { t: 'ui', id: 'rules-close' } });
  }
}
