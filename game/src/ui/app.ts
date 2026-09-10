/** 游戏主控：把牌局逻辑、输入、电脑出牌与画面串起来。 */

import { chooseAction, chooseClaim } from '../core/ai';
import { RuleConfig } from '../core/config';
import { Game } from '../core/game';
import { Kind, sortTiles } from '../core/tiles';
import { Action, GameEvent } from '../core/types';
import { ImageName, VoiceOp } from './assets';
import { AudioManager } from './audio';
import { Renderer, ViewState } from './render';

/** 电脑思考与动画的节奏（毫秒） */
const PACE = {
  botAction: 620,
  botClaim: 520,
  banner: 1400,
};

export class App {
  private game: Game;
  private view: ViewState;
  private timer: number | null = null;
  private eventCursor = 0;

  constructor(
    private renderer: Renderer,
    private audio: AudioManager,
    private rules: Partial<RuleConfig> = {},
    auto = false,
    skipLobby = auto
  ) {
    const playerCount = this.rules.playerCount ?? 4;
    this.game = new Game({ rules: { ...this.rules, playerCount }, humanSeat: 0 });
    this.view = {
      humanSeat: 0,
      selectedSlot: null,
      buttons: [],
      banners: new Map(),
      message: null,
      showResult: false,
      auto,
      muted: this.audio.muted,
      scene: skipLobby ? 'play' : 'lobby',
      playerCount,
      showRules: false,
    };
    if (this.view.scene === 'play') {
      this.consumeEvents();
      this.refreshButtons();
      this.scheduleNext();
    }
  }

  // ------------------------------------------------------------ 循环

  start(): void {
    const loop = () => {
      this.renderer.draw(this.game, this.view);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /** 布局预览：亮出碰、缩短手牌、保证有赖子，便于核对遮罩与锚点 */
  previewLayout(shrinkExtra = 0): void {
    this.view.auto = false;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    const g = this.game;
    for (const p of g.players) {
      const kind =
        p.hand.find((k) => k !== g.laizi && p.hand.filter((x) => x === k).length >= 2) ??
        p.hand.find((k) => k !== g.laizi) ??
        p.hand[0];
      p.melds = [{ type: 'peng', kind, from: (p.seat + 1) % g.players.length }];
      let removed = 0;
      p.hand = p.hand.filter((k) => {
        if (k === kind && removed < 2) {
          removed++;
          return false;
        }
        return true;
      });
      // 预览只摆稳定态：碰完还要打一张，这里直接给等着别人出牌时的张数。
      const waiting = 3 * (4 - p.melds.length) + 1;
      if (p.isBot && p.hand.length > waiting) p.hand.length = waiting;
      p.discards.push(g.laizi, g.laizi);
      p.laiziOut = 2;
      p.mul = g.rules.laiziMultiplier * g.rules.laiziMultiplier;
    }
    const me = g.players[0];
    if (!me.hand.includes(g.laizi)) me.hand.unshift(g.laizi);
    if (shrinkExtra > 0) me.hand.splice(Math.max(1, me.hand.length - shrinkExtra), shrinkExtra);
    sortTiles(me.hand, g.laizi);
  }

  restart(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.game = new Game({ rules: { ...this.rules, playerCount: this.view.playerCount }, humanSeat: 0 });
    this.eventCursor = 0;
    this.view.selectedSlot = null;
    this.view.showResult = false;
    this.view.showRules = false;
    this.view.scene = 'play';
    this.view.message = null;
    this.view.banners.clear();
    this.audio.play('start');
    this.consumeEvents();
    this.refreshButtons();
    this.scheduleNext();
  }

  goLobby(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.view.scene = 'lobby';
    this.view.showResult = false;
    this.view.showRules = false;
    this.view.selectedSlot = null;
    this.view.buttons = [];
    this.view.message = null;
    this.view.banners.clear();
    this.view.auto = false;
  }

  /** 让电脑在延迟之后行动；轮到人类时只更新按钮等待输入 */
  private scheduleNext(): void {
    if (this.view.scene !== 'play') return;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    const g = this.game;
    if (g.phase === 'over') {
      this.view.showResult = true;
      const won = g.over?.winner === this.view.humanSeat;
      this.audio.play(g.over?.reason === 'liuju' ? 'liuju' : won ? 'win' : 'lose');
      return;
    }

    if (g.phase === 'action') {
      if (g.turn === this.view.humanSeat && !this.view.auto) {
        this.refreshButtons();
        return;
      }
      this.timer = window.setTimeout(() => this.stepBotAction(), PACE.botAction);
      return;
    }

    // claim 阶段：人类若有可选项则等待，否则电脑先表态
    const pend = g.pending;
    if (!pend) return;
    if (!this.view.auto && pend.waiting.includes(this.view.humanSeat) && g.claimOptions(this.view.humanSeat).length) {
      this.refreshButtons();
      return;
    }
    this.timer = window.setTimeout(() => this.stepBotClaim(), PACE.botClaim);
  }

  private stepBotAction(): void {
    const g = this.game;
    if (g.phase !== 'action') return this.scheduleNext();
    if (g.turn === this.view.humanSeat && !this.view.auto) return this.scheduleNext();
    const seat = g.turn;
    g.act(seat, chooseAction(g, seat));
    this.consumeEvents();
    this.refreshButtons();
    this.scheduleNext();
  }

  private stepBotClaim(): void {
    const g = this.game;
    const pend = g.pending;
    if (g.phase !== 'claim' || !pend) return this.scheduleNext();

    // 按离打牌者的距离依次表态
    const order = [...pend.waiting].sort(
      (a, b) =>
        ((a - pend.seat + g.players.length) % g.players.length) -
        ((b - pend.seat + g.players.length) % g.players.length)
    );
    for (const seat of order) {
      if (seat === this.view.humanSeat && !this.view.auto) continue;
      const action = chooseClaim(g, seat);
      if (action.type !== 'pass') {
        g.claim(seat, action);
        this.consumeEvents();
        this.refreshButtons();
        this.scheduleNext();
        return;
      }
      g.claim(seat, { type: 'pass' });
      if (g.phase !== 'claim') break;
    }
    this.consumeEvents();
    this.refreshButtons();
    this.scheduleNext();
  }

  // ------------------------------------------------------------ 输入

  handlePointer(clientX: number, clientY: number): void {
    this.audio.unlock();
    const hit = this.renderer.hitTest(clientX, clientY);
    if (!hit) return;

    if (hit.t === 'ui') {
      if (hit.id === 'start' || hit.id === 'again') {
        this.audio.play('click_btn');
        this.restart();
      } else if (hit.id === 'lobby') {
        this.audio.play('click_btn');
        this.goLobby();
      } else if (hit.id.startsWith('players:')) {
        this.audio.play('click_btn');
        this.view.playerCount = Number(hit.id.slice('players:'.length));
      } else if (hit.id === 'rules') {
        this.audio.play('click_btn');
        this.view.showRules = true;
      } else if (hit.id === 'rules-close') {
        this.audio.play('click_btn');
        this.view.showRules = false;
      } else if (hit.id === 'mute') {
        this.view.muted = this.audio.toggleMute();
      } else if (hit.id === 'auto') {
        this.audio.play('click_btn');
        this.view.auto = !this.view.auto;
        this.view.selectedSlot = null;
        this.scheduleNext();
      }
      return;
    }

    if (this.view.scene !== 'play' || this.view.showResult || this.view.showRules) return;

    if (hit.t === 'button') {
      this.audio.play('click_btn');
      this.onButton(hit.id);
      return;
    }

    // 点牌：第一次抬起，第二次打出
    const g = this.game;
    if (g.phase !== 'action' || g.turn !== this.view.humanSeat) return;
    if (this.view.selectedSlot === hit.slot) {
      this.discard(hit.kind);
    } else {
      this.view.selectedSlot = hit.slot;
      this.audio.play('click_tile', 0.7);
    }
  }

  private discard(kind: Kind): void {
    const g = this.game;
    this.view.selectedSlot = null;
    if (!g.act(this.view.humanSeat, { type: 'discard', kind })) return;
    this.consumeEvents();
    this.refreshButtons();
    this.scheduleNext();
  }

  /** 调试：打出刚摸到的牌（或第一张），用于界面验收 */
  forceDiscard(): void {
    const g = this.game;
    if (this.view.scene !== 'play' || g.phase !== 'action' || g.turn !== this.view.humanSeat) return;
    const kind = g.drawn ?? g.players[this.view.humanSeat].hand[0];
    this.discard(kind);
  }

  private onButton(id: string): void {
    const g = this.game;
    const seat = this.view.humanSeat;
    const [type, kindStr] = id.split(':');
    const kind = kindStr === undefined ? undefined : Number(kindStr);
    const action = { type, kind } as Action;

    if (g.phase === 'claim') {
      if (!g.claim(seat, action)) return;
    } else if (!g.act(seat, action)) {
      return;
    }
    this.view.selectedSlot = null;
    this.consumeEvents();
    this.refreshButtons();
    this.scheduleNext();
  }

  /** 根据当前阶段刷新可点击的操作按钮 */
  private refreshButtons(): void {
    const g = this.game;
    const seat = this.view.humanSeat;
    const buttons: ViewState['buttons'] = [];

    const push = (a: Action) => {
      const map: Partial<Record<Action['type'], ImageName>> = {
        peng: 'btn_peng',
        chaoTianPeng: 'btn_peng',
        mingGang: 'btn_gang',
        anGang: 'btn_gang',
        buGang: 'btn_gang',
        chaoTianGang: 'btn_gang',
        hu: 'btn_hu',
        pass: 'btn_guo',
      };
      const image = map[a.type];
      if (!image) return;
      buttons.push({ id: a.kind === undefined ? a.type : `${a.type}:${a.kind}`, image });
    };

    if (g.phase === 'claim') {
      for (const a of g.claimOptions(seat)) push(a);
    } else if (g.phase === 'action' && g.turn === seat) {
      for (const a of g.actionOptions(seat)) {
        if (a.type === 'discard') continue;
        push(a);
      }
    }
    this.view.buttons = buttons;
  }

  // ------------------------------------------------------------ 事件 -> 声音/横幅

  private voiceOf(seat: number): 'man' | 'woman' {
    return this.game.players[seat]?.voice ?? (seat % 2 === 0 ? 'man' : 'woman');
  }

  private banner(seat: number, image: ImageName): void {
    this.view.banners.set(seat, { image, expires: performance.now() + PACE.banner });
  }

  /** 把牌局产生的事件转成音效与横幅 */
  private consumeEvents(): void {
    const events = this.game.events;
    for (; this.eventCursor < events.length; this.eventCursor++) {
      this.applyEvent(events[this.eventCursor]);
    }
  }

  private applyEvent(e: GameEvent): void {
    switch (e.t) {
      case 'start':
        this.audio.play('start');
        break;
      case 'draw':
        this.audio.play('draw_tile', 0.55);
        break;
      case 'discard':
        this.audio.play('out_tile', 0.8);
        this.audio.tileVoice(this.voiceOf(e.seat), e.kind);
        break;
      case 'shuaiLaizi':
        this.audio.play('out_tile', 0.8);
        this.audio.voice(this.voiceOf(e.seat), 'qj_lzg');
        this.view.message = `甩赖子  底分 ×${e.mul}`;
        window.setTimeout(() => {
          if (this.view.message?.startsWith('甩赖子')) this.view.message = null;
        }, 1200);
        break;
      case 'meld': {
        const voiceMap: Record<string, VoiceOp> = {
          peng: 'peng',
          chaoTianPeng: 'qj_ctx',
          mingGang: 'qj_mg',
          anGang: 'qj_ag',
          buGang: 'qj_bg',
          chaoTianGang: 'qj_ctx',
        };
        const bannerMap: Record<string, ImageName> = {
          peng: 'banner_peng',
          chaoTianPeng: 'banner_chaotian',
          mingGang: 'banner_gang',
          anGang: 'banner_angang',
          buGang: 'banner_huitou',
          chaoTianGang: 'banner_chaotian',
        };
        this.audio.voice(this.voiceOf(e.seat), voiceMap[e.meld.type] ?? 'gang');
        this.banner(e.seat, bannerMap[e.meld.type] ?? 'banner_gang');
        break;
      }
      case 'hu':
        this.audio.voice(this.voiceOf(e.seat), 'zimo');
        this.banner(e.seat, 'banner_zimo');
        break;
      case 'liuju':
        this.audio.play('liuju');
        break;
      default:
        break;
    }
  }
}
